"""Render the deterministic 48 kHz stereo score to <film dir>/out/music_bed.wav.

script.json music settings select bpm, progression and style (cinema-keynote, dual-polarity, minimalist or legacy).
Each scene can set polarity, the five existing pad/bass/motif/kick/hat levels, and line-timed cues.
Usage: python3 theme/film/music.py <film dir>

Adapted from trureturing-film films/*/music.py (Apache-2.0, the-omega-institute).
"""

from __future__ import annotations

import math
import os
import sys

from common import fail, film_dir_arg, load, out_dir, timeline

SR = 48000
PROGRESSIONS = {  # (root midi, chord tones), one chord per bar
    "d-minor": [(38, [0, 3, 7]), (34, [0, 4, 7]), (41, [0, 4, 7]), (36, [0, 4, 7]),
                (38, [0, 3, 7]), (34, [0, 4, 7]), (43, [0, 3, 7]), (33, [0, 4, 7])],
    "a-minor": [(45, [0, 3, 7]), (41, [0, 4, 7]), (36, [0, 4, 7]), (43, [0, 4, 7]),
                (45, [0, 3, 7]), (41, [0, 4, 7]), (38, [0, 3, 7]), (40, [0, 4, 7])],
    "daylight-warm": [(38, [0, 7, 14, 16]), (43, [0, 7, 11, 14]),
                      (40, [0, 7, 12, 14]), (45, [0, 7, 12, 16])],
    "dual-polarity": [(38, [0, 3, 7, 14]), (36, [0, 7, 12, 14]),
                      (43, [0, 3, 7, 14]), (41, [0, 7, 12, 14])],
}
# The two voicings share roots and fifths, so the scene can change harmony within a bar.
DAY_VOICINGS = ([0, 7, 11, 14], [0, 7, 12, 16], [0, 7, 11, 14], [0, 7, 14, 16])
OPEN_LEVEL = (1.0, 0.4, 0.3, 0.0, 0.1)
MID_LEVELS = ((0.9, 0.7, 0.8, 0.5, 0.4), (1.0, 0.6, 0.7, 0.4, 0.3))
END_LEVEL = (1.0, 0.8, 0.7, 0.5, 0.4)


def write_score(film_dir, bed, bpm, style, progression):
    import numpy as np
    import soundfile as sf

    # Leave headroom over narration and preserve intentionally quiet arrangements.
    rms = np.sqrt(np.einsum("ij,ij->", bed, bed, dtype=np.float64) / bed.size)
    peak = max(float(bed.max()), -float(bed.min()), 1e-12)
    gain = min(10 ** (-19 / 20) / max(rms, 1e-12), 1.6, 0.8 / peak)
    bed *= gain
    out = out_dir(film_dir) / "music_bed.wav"
    sf.write(str(out), bed, SR)
    db = 20 * np.log10(max(rms * gain, 1e-12))
    print(f"film: score {len(bed)/SR:.1f} s at {bpm:g} bpm ({style}, {progression}), rms {db:.1f} dB → {out}")


def main(argv: list[str]) -> int:
    try:
        import numpy as np
        from scipy.signal import butter, sosfilt
    except ImportError as exc:
        fail(f"{exc.name} is not installed; run theme/film/setup.sh")
    film_dir = film_dir_arg(argv)
    film = load(film_dir)
    tl, provisional = timeline(film, allow_provisional=os.environ.get("FILM_STRICT") != "1")
    if provisional:
        print("film: warning: scoring against provisional timing; rerun after tts", file=sys.stderr)
    script = film.script or {}
    settings = script.get("music") or {}
    style = settings.get("style", "dual-polarity")
    cinema = style == "cinema-keynote"
    if not cinema and style not in ("dual-polarity", "minimalist", "legacy"):
        fail("script.json: music.style must be cinema-keynote, dual-polarity, minimalist or legacy")
    progression = settings.get("progression", "daylight-warm" if cinema else "a-minor")
    if progression not in PROGRESSIONS:
        fail(f"script.json: music.progression must be one of {', '.join(PROGRESSIONS)}")
    chords = PROGRESSIONS[progression]
    bpm = float(settings.get("bpm", 116 if cinema else 80))
    if not 40 <= bpm <= 200:
        fail("script.json: music.bpm must be between 40 and 200")
    beat = 60.0 / bpm
    if cinema:
        from cinema_score import render

        bed = render(tl, script["scenes"], beat, chords)
        write_score(film_dir, bed, bpm, style, progression)
        return 0

    bar = 4 * beat
    duration = tl["duration"] + 0.5
    bed = np.zeros((int(duration * SR), 2), dtype=np.float32)
    tau = math.tau

    def midi(note):
        return 440 * 2 ** ((note - 69) / 12)

    def clock(seconds):
        return np.arange(int(seconds * SR)) / SR

    # Automation holds each scene's levels, then eases into the next across its cut.
    # A short scene still gets its own control point. The sixth lane is daylight presence.
    by_id = {s["id"]: s for s in script["scenes"]}
    points, values = [], []
    scenes = tl["scenes"]
    for i, scene in enumerate(scenes):
        source = by_id[scene["id"]]
        default = MID_LEVELS[i % 2]
        if i == 0:
            default = OPEN_LEVEL
        elif i == len(scenes) - 1:
            default = END_LEVEL
        day = {"deep-space": 0, "dual-split": 0.5, "daylight": 1}[source.get("polarity", "deep-space")]
        controls = (*source.get("music", default), day)
        margin = min(0.6, (scene["end"] - scene["start"]) / 3)
        points.extend((scene["start"] + margin, scene["end"] - margin))
        values.extend((controls, controls))
    lanes = np.asarray(values).T

    def add(start, signal, left=1, right=1):
        offset = round(start * SR)
        lo, hi = max(0, offset), min(len(bed), offset + len(signal))
        if hi > lo:
            part = signal[lo - offset:hi - offset]
            bed[lo:hi, 0] += left * part
            bed[lo:hi, 1] += right * part

    # All automation and filters are bar-local. The stereo mix is the only film-length buffer.
    t = clock(bar + 1.2)
    pad_env = np.sin(0.5 * np.pi * np.minimum(1, t / 0.85)) ** 2
    pad_env *= np.cos(0.5 * np.pi * np.clip((t - bar) / 1.2, 0, 1)) ** 2
    low = butter(2, 430, fs=SR, output="sos")
    high = butter(2, 920, fs=SR, output="sos")
    motif_beats = {"minimalist": (1.5,), "dual-polarity": (0.5, 2.75), "legacy": (0.5, 1.5, 2.5, 3.5)}[style]
    pulse_beats = (0, 1, 2, 3) if style == "legacy" else (0, 2)

    def bell(t, frequency, glass):
        phase = tau * frequency * t
        fundamental = np.sin(phase) * np.exp(-2.8 * t)
        felt = 0.14 * np.sin(2 * phase) * np.exp(-7 * t)
        overtone = 0.19 * np.sin(2.51 * phase) * np.exp(-4.8 * t)
        return -np.expm1(-85 * t) * (fundamental + (1 - glass) * felt + glass * overtone)

    for index in range(math.ceil(duration / bar)):
        start = index * bar
        pad, bass, motif, kick, hat, day = [np.interp(start + t, points, lane) for lane in lanes]
        root, tones = chords[index % len(chords)]
        bright_tones = DAY_VOICINGS[index % len(DAY_VOICINGS)] if progression == "dual-polarity" else tones
        breath = 0.5 + 0.5 * np.sin(tau * (start + t) / 11)
        for off in sorted(set(tones) | set(bright_tones)):
            # Keep common voices sounding while thirds, sevenths and extensions crossfade.
            weight = (1 - day) * (off in tones) + day * (off in bright_tones)
            if not weight.any():
                continue
            phase = midi(root + 12 + off) * t
            tri = 1 - 4 * np.abs((phase + 0.25) % 1 - 0.5)
            voice = 0.62 * tri + 0.38 * np.sin(tau * phase) + 0.08 * np.sin(2 * tau * phase)
            warmth = 0.12 + 0.48 * day + 0.22 * breath
            voice = (1 - warmth) * sosfilt(low, voice) + warmth * sosfilt(high, voice)
            pan = 0.17 * np.sin(index * 0.7 + off)
            add(start, 0.105 * voice * pad_env * pad * weight, 1 - pan, 1 + pan)

        for q in pulse_beats:
            offset = round(q * beat * SR)
            u = clock(min(1.1, 1.3 * beat))
            phase = tau * midi(root) * u
            pulse = (np.sin(phase) + 0.12 * np.sin(2 * phase)) * (-np.expm1(-38 * u)) * np.exp(-4.5 * u)
            pulse *= np.minimum(1, (len(u) / SR - u) / 0.06)
            add(start + q * beat, 0.16 * pulse * bass[offset:offset + len(u)])

        for i, q in enumerate(motif_beats):
            offset = round(q * beat * SR)
            u = clock(min(1.55, len(t[offset:]) / SR))
            light = day[offset:offset + len(u)]
            step = (0, 7, 14, 7, 12)[(index + i) % 5]
            pluck = bell(u, midi(root + 24 + step), 1 - light)
            pluck *= np.minimum(1, (len(u) / SR - u) / 0.12)
            pluck *= 0.064 * motif[offset:offset + len(u)]
            pan = 0.23 if (index + i) % 2 else -0.23
            add(start + q * beat, pluck, 1 - pan, 1 + pan)
            add(start + q * beat + 0.14, pluck, 0.16 * (1 + pan), 0.16 * (1 - pan))

        for q in pulse_beats:
            offset = round(q * beat * SR)
            u = clock(0.38)
            thump = np.sin(tau * (48 * u - 0.4 * np.expm1(-15 * u))) * (-np.expm1(-80 * u)) * np.exp(-15 * u)
            add(start + q * beat, 0.11 * thump * kick[offset:offset + len(u)])
            offset = round((q + 0.5) * beat * SR)
            u = clock(0.09)
            brush = sum(np.sin(tau * f * u) for f in (462, 707, 887)) / 3
            brush *= -np.expm1(-160 * u) * np.exp(-67 * u)
            add(start + (q + 0.5) * beat, 0.04 * brush * hat[offset:offset + len(u)], 0.75, 1)

    def riser(end, frequency):
        u = clock(1.5)
        envelope = np.sin(np.pi * u / 1.5) ** 2 * u / 1.5
        phase = tau * frequency * (u + 0.015 * u ** 2)
        add(end - 1.5, 0.085 * envelope * (np.sin(phase) + 0.4 * np.sin(1.5 * phase)), 0.9, 1)

    def impact(start, frequency):
        u = clock(1.75)
        resonance = np.sin(tau * (frequency * u - 0.6 * np.expm1(-4 * u)))
        add(start, 0.13 * resonance * (-np.expm1(-35 * u)) * np.exp(-3.8 * u))

    def chime(start, frequency, gain=0.06, duration=2):
        u = clock(duration)
        note = gain * bell(u, frequency, 1) * np.minimum(1, (duration - u) / 0.045)
        add(start, note, 1, 0.7)
        add(start + 0.025, note, 0.18, 0.48)

    def root_hz(time):
        return midi(chords[int(max(0, time) / bar) % len(chords)][0])

    for scene in scenes[1:]:
        cut = scene["start"]
        frequency = root_hz(cut)
        riser(cut, frequency * 2)
        impact(cut, frequency)
        if by_id[scene["id"]].get("chapter"):
            chime(cut, frequency * 4, gain=0.035)

    starts: dict[str, list[float]] = {}
    for line in tl["lines"]:
        starts.setdefault(line["scene"], []).append(line["start"])
    for scene in script["scenes"]:
        times = starts.get(scene["id"], [])
        for cue in scene.get("cues") or []:
            index = cue.get("line", 0)
            if not 0 <= index < len(times):
                continue
            at = times[index] + float(cue.get("at", 0))
            frequency = root_hz(at)
            kind = cue["kind"]
            if kind in ("stamp", "impact"):
                impact(at, frequency)
            if kind in ("stamp", "chime"):
                chime(at, frequency * 4)
            elif kind == "glitch":
                chime(at, frequency * 6, gain=0.032, duration=0.16)
    end_chime = max(0, tl["duration"] - 3)
    chime(end_chime, root_hz(end_chime) * 3)

    def fade(seconds, opening):
        count = min(len(bed), round(seconds * SR))
        ramp = np.linspace(0, min(1, count / (seconds * SR)), count, dtype=np.float32)
        if opening:
            bed[:count] *= ramp[:, None]
        else:
            bed[-count:] *= ramp[::-1, None]

    fade(1.5, True)
    fade(3.5, False)
    write_score(film_dir, bed, bpm, style, progression)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
