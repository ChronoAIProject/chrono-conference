"""Final mixes from out/music_bed.wav and out/narration.wav, with measured ducking.

Usage: python3 theme/film/mix.py <film dir> [--allow-silent]

  out/mix_voice.wav   narration over the score, the bed ducked ~12 dB under speech, -17 dB RMS
  out/mix_music.wav   the score alone, only when a music-only video is requested ($FILM_OUTPUTS, else
                      film.json's outputs; theme/film/plan.py); otherwise a stale one is removed

Without out/narration.wav the step fails, unless --allow-silent (local dry runs before TTS):
then mix_voice.wav is the score alone. Adapted from trureturing-film films/*/mix.py
(Apache-2.0, the-omega-institute).
"""

from __future__ import annotations

import json
import math
import subprocess
import sys
from pathlib import Path
from tempfile import TemporaryDirectory

from common import fail, ffmpeg, film_dir_arg, load, plan

SR = 48000


def keynote_duck(voice, bed):
    """Ride the bed in dB. Overlapping pre-ducks and releases meet at the deeper gain."""
    import numpy as np

    hop = SR // 100
    edges = np.arange(0, len(voice), hop)
    sizes = np.diff(np.append(edges, len(voice)))
    power = np.add.reduceat(voice**2, edges) / sizes
    if power.max() == 0:
        return
    active = power > power.max() * 0.001  # 30 dB below the loudest 10 ms of narration
    indices = np.arange(len(edges))
    previous = np.maximum.accumulate(np.where(active, indices, -100))
    following = np.minimum.accumulate(np.where(active, indices, len(edges) + 100)[::-1])[::-1]
    # Speech occupies the full 10 ms block. Begin releasing at its exclusive end.
    release = 1 - (indices - previous - 1) / 40
    pre_duck = 1 - (following - indices) / 25
    depth = np.maximum(release, pre_duck).clip(0, 1)
    # Set the fully ducked bed 12 dB under speech, preserving differences between scenes.
    bed_power = np.add.reduceat(np.mean(bed**2, axis=1), edges) / sizes
    ratio = math.sqrt(power[active].mean() / max(1e-12, bed_power[active].mean()))
    gain = ratio * 10 ** ((-12 + 7) / 20)
    for start in range(0, len(bed), SR):
        stop = min(start + SR, len(bed))
        ramp = np.interp(np.arange(start, stop), edges, depth)
        bed[start:stop] *= (gain * 10 ** (-7 * ramp / 20))[:, None]


def keynote_master(samples, output):
    """Two-pass EBU R128 mastering at 48 kHz, with margin for true peaks after resampling."""
    import soundfile as sf

    norm = "loudnorm=I=-14:TP=-1.7:LRA=16"
    with TemporaryDirectory(dir=output.parent) as temp:
        source = Path(temp) / "premix.wav"
        sf.write(source, samples, SR, subtype="FLOAT")
        ff = [ffmpeg(), "-nostdin", "-hide_banner", "-nostats", "-i", str(source)]
        scan = subprocess.run([*ff, "-af", norm+":print_format=json", "-f", "null", "-"],
                              capture_output=True, text=True, check=True)
        stats = json.loads(scan.stderr[scan.stderr.rindex("{"):scan.stderr.rindex("}")+1])
        if math.isfinite(float(stats["input_i"])):
            filt = (norm + f":measured_I={stats['input_i']}:measured_TP={stats['input_tp']}"
                    f":measured_LRA={stats['input_lra']}:measured_thresh={stats['input_thresh']}"
                    f":offset={stats['target_offset']}:linear=true")
        else:
            # Silence or audio shorter than R128's gating window.
            filt = f"volume={min(0, -1.7-float(stats['input_tp']))}dB"
        result = Path(temp) / "master.wav"
        filt += f",aresample={SR},apad,atrim=end_sample={len(samples)}"
        subprocess.run([*ff, "-loglevel", "error", "-af", filt, "-c:a", "pcm_s24le", str(result)], check=True)
        result.replace(output)
    print(f"film: mastered {output} at 48 kHz")


def main(argv: list[str]) -> int:
    try:
        import numpy as np
        import soundfile as sf
    except ImportError as exc:
        fail(f"{exc.name} is not installed; run theme/film/setup.sh")
    film_dir = film_dir_arg([a for a in argv if not a.startswith("--")])
    film = load(film_dir)
    music_only = plan(film)["music"]
    cinema = ((film.script or {}).get("music") or {}).get("style") == "cinema-keynote"
    out = film_dir / "out"
    if not (out / "music_bed.wav").is_file():
        fail("out/music_bed.wav is missing; run the music step first")
    dtype = "float32" if cinema else "float64"
    bed, sr = sf.read(str(out / "music_bed.wav"), dtype=dtype)
    if sr != SR or bed.ndim != 2:
        fail(f"out/music_bed.wav must be {SR} Hz stereo")
    n = len(bed)
    if (out / "narration.wav").is_file():
        voice, vsr = sf.read(str(out / "narration.wav"), dtype=dtype)
        if vsr != SR:
            fail(f"out/narration.wav must be {SR} Hz")
        if voice.ndim == 2:
            voice = voice.mean(1)
    elif "--allow-silent" in argv:
        print("film: warning: no out/narration.wav; mix_voice.wav is the score alone", file=sys.stderr)
        voice = np.zeros(n)
    else:
        fail("out/narration.wav is missing; run the tts step (or pass --allow-silent for a dry run)")
    voice = np.pad(voice, (0, max(0, n - len(voice))))[:n]
    if cinema:
        if music_only:
            keynote_master(bed, out / "mix_music.wav")
        keynote_duck(voice, bed)
        bed += voice[:, None]
        keynote_master(bed, out / "mix_voice.wav")
        if not music_only:
            (out / "mix_music.wav").unlink(missing_ok=True)
        return 0

    def movavg(x, w):
        c = np.cumsum(np.concatenate([[0.0], x]))
        h = w // 2
        i = np.arange(len(x))
        lo = np.clip(i - h, 0, len(x))
        hi = np.clip(i + h, 0, len(x))
        return (c[hi] - c[lo]) / np.maximum(1, hi - lo)

    def db(x):
        return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)

    target = -17.0
    if np.abs(voice).max() > 0:
        rms = np.sqrt(movavg(voice ** 2, int(0.05 * SR)))
        speech = rms > 0.02 * rms.max()
        v_db = db(voice[speech])
        b_db = db(bed.mean(1)[speech])
        act = movavg(speech.astype(float), int(0.5 * SR))
        duck = 1 - 0.6 * np.clip(act * 1.6, 0, 1)  # up to -8 dB while speaking
        g = 10 ** ((v_db - 12 - (b_db + 20 * np.log10(0.4))) / 20)  # ducked bed sits 12 dB under speech
        mix = bed * (g * duck)[:, None] + voice[:, None]
    else:
        mix = bed.copy()
    mix *= 10 ** ((target - db(mix.mean(1))) / 20)
    mix = np.tanh(mix / 0.95) * 0.95
    sf.write(str(out / "mix_voice.wav"), mix.astype(np.float32), SR)
    said = f"film: mixes → {out / 'mix_voice.wav'} (rms {db(mix.mean(1)):.1f} dB, peak {np.abs(mix).max():.3f})"
    if music_only:
        mo = bed * 10 ** ((target + 1 - db(bed.mean(1))) / 20)
        mo = np.tanh(mo / 0.95) * 0.95
        sf.write(str(out / "mix_music.wav"), mo.astype(np.float32), SR)
        said += f", {out / 'mix_music.wav'} (rms {db(mo.mean(1)):.1f} dB)"
    else:
        (out / "mix_music.wav").unlink(missing_ok=True)
        said += " (no music-only video requested: no music-only mix)"
    print(said)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
