"""The cinema-keynote arrangement. All scenes share one continuous sixteenth-note grid."""

import math

import numpy as np
from scipy.signal import butter, sosfilt

from common import fail, tfilm

SR = 48000
TAU = math.tau


def clock(seconds):
    return np.arange(round(seconds * SR)) / SR


def hz(note):
    return 440 * 2 ** ((note - 69) / 12)


def envelope(t, attack, release):
    return np.minimum(1, t / attack) * np.minimum(1, (len(t) / SR - t) / release)


def place(bus, at, sound, gain=1, pan=0):
    """Mix mono into stereo with bounded slices, including pre-roll before the first frame."""
    start = round(at * SR)
    lo, hi = max(0, start), min(len(bus), start + len(sound))
    if lo < hi:
        part = sound[lo - start : hi - start] * gain
        bus[lo:hi, 0] += part * math.sqrt(1 - pan)
        bus[lo:hi, 1] += part * math.sqrt(1 + pan)


def bell(t, freq):
    p = TAU * freq * t
    return envelope(t, 0.006, 0.06) * (
        np.sin(p) * np.exp(-3.4 * t)
        + 0.35 * np.sin(2.01 * p) * np.exp(-6 * t)
        + 0.16 * np.sin(3.94 * p) * np.exp(-9 * t)
    )


def kit(rng):
    def metal(t, cutoff):
        noise = rng.normal(0, 0.5, len(t))
        return sosfilt(butter(2, cutoff, fs=SR, btype="highpass", output="sos"), noise)

    t = clock(0.34)
    kick = np.sin(TAU * (49 * t + 1.65 * (1 - np.exp(-39 * t)))) * np.exp(-13 * t)
    kick += 0.16 * metal(t, 2400) * np.exp(-150 * t)
    kick *= envelope(t, 0.002, 0.025)
    t = clock(0.21)
    taps = sum(np.where(t >= d, np.exp(-42 * np.maximum(0, t - d)), 0) for d in (0, 0.013, 0.028))
    clap = envelope(t, 0.002, 0.03) * (metal(t, 1450) * taps + 0.22 * np.sin(TAU * 185 * t) * np.exp(-34 * t))
    t = clock(0.085)
    hat = envelope(t, 0.001, 0.016) * metal(t, 6800) * np.exp(-54 * t)
    t = clock(0.053)
    tick = bell(t, 1830) * np.exp(-95 * t)
    return kick, clap, hat, tick


def pad(bus, at, length, mode, root, tones, level, progress, rate):
    t = clock(length)
    if not len(t):
        return
    env = envelope(t, 0.13, 0.15)
    if mode in ("quiet", "tension"):
        drone = np.sin(TAU * hz(root) * t) + 0.18 * np.sin(TAU * hz(root + 19) * t)
        gain = 0.019 if mode == "quiet" else 0.085
        place(bus, at, env * drone, level * gain)
        return
    wide = mode == "anthemic"
    gain = {"build": 0.036, "break": 0.024, "groove": 0.030, "anthemic": 0.047}[mode]
    cutoff = 240 * 18 ** np.clip(progress + rate * t, 0, 1) if mode == "build" else 2100
    for tone in tones:
        frequency = hz(root + 12 + tone)
        for side in (-1, 1):
            phase = TAU * frequency * (1 + side * (0.0028 if wide else 0.0013)) * t
            # Roll off the partials of each detuned saw at the moving two-pole cutoff.
            wave = sum(
                np.sin(h * phase) / (h * np.sqrt(1 + (h * frequency / cutoff) ** 4)) for h in range(1, 8)
            )
            place(bus, at, env * wave, level * gain, side * (0.54 if wide else 0.32))


def arrange(bus, start, stop, mode, beat, chords, levels, drums):
    """Write this orchestration up to its cut. Long notes release at the boundary."""
    pad_level, bass_level, arp_level, drum_level, hat_level = levels
    kick, clap, hat, tick = drums
    bar = beat * 4
    span = stop - start
    for b in range(math.floor(start / bar), math.ceil(stop / bar)):
        a, z = max(start, b * bar), min(stop, (b + 1) * bar)
        root, tones = chords[b % len(chords)]
        pad(bus, a - start, z - a, mode, root, tones, pad_level, (a - start) / span, 1 / span)
    for step in range(math.ceil(start * 4 / beat - 1e-8), math.ceil(stop * 4 / beat - 1e-8)):
        at = step * beat / 4 - start
        slot, bar_index = step % 16, step // 16
        root, tones = chords[bar_index % len(chords)]
        progress = max(0, at / span)
        if mode == "quiet":
            if slot in (0, 2):
                place(bus, at, kick, (0.047 if slot == 0 else 0.023) * drum_level)
            continue
        if mode == "tension":
            if slot in (0, 8):
                place(bus, at, kick, 0.29 * drum_level)
            if slot % 2 == 0:
                place(bus, at, tick, 0.065 * hat_level, (slot % 4 - 1) * 0.35)
            continue
        if slot % 4 == 0 and (mode != "break" or slot == 0):
            strength = {"build": 0.24 + 0.35 * progress, "break": 0.16}.get(mode, 0.49)
            place(bus, at, kick, strength * drum_level)
        if mode != "break":
            if slot in (4, 12):
                place(bus, at, clap, 0.25 * drum_level, -0.08)
            place(bus, at, hat, (0.08, 0.044, 0.105, 0.054)[slot % 4] * hat_level, 0.27 * (-1) ** step)
            if slot % 2 == 0:
                t = clock(beat * 0.46)
                freq = hz(root + (12 if slot % 4 else 0))
                phase = TAU * freq * t
                pump = 1 - 0.83 * np.exp(-t / 0.071) if slot % 4 == 0 else 1
                bass = np.sin(phase) + 0.24 * np.sin(2 * phase) + 0.13 * np.sin(3 * phase)
                place(bus, at, envelope(t, 0.007, 0.055) * np.exp(-3 * t) * bass * pump, 0.22 * bass_level)
        if mode == "build" and stop - (at + start) < bar:
            # Eighths, sixteenths, then thirty-seconds over the last bar.
            remaining = span - at
            if remaining < 2 * beat or slot % 2 == 0:
                place(bus, at, clap, (0.08 + 0.14 * (1 - remaining / bar)) * drum_level)
            if remaining <= beat:
                place(bus, at + beat / 8, clap, 0.16 * drum_level)
        arp_slots = (2, 10) if mode == "break" else (0, 3, 6, 8, 11, 14)
        if slot in arp_slots:
            index = arp_slots.index(slot)
            tone = tones[(bar_index + index) % len(tones)]
            t = clock(beat * (2 if mode == "break" else 0.78))
            note = bell(t, hz(root + 24 + tone))
            gain = 0.077 * arp_level
            pan = 0.64 * (-1) ** index
            place(bus, at, note, gain, pan)
            place(bus, at + beat * 0.75, note, 0.31 * gain, -pan)
        if mode == "anthemic" and slot in (0, 10):
            t = clock(2.4 * beat)
            melody = (7, 12, 14, 16, 19, 16, 14, 12)[(bar_index * 2 + (slot == 10)) % 8]
            place(bus, at, bell(t, hz(root + 24 + melody)), 0.092 * arp_level, -0.34)


def sound_cue(bed, at, kind, root, rng, drums, rise=1.4):
    kick, clap, hat, tick = drums
    if kind in ("drop", "whoosh_up", "whoosh_down"):
        length = rise if kind == "drop" else 0.54
        t = clock(length)
        up = kind != "whoosh_down"
        fraction = t / length if up else 1 - t / length
        noise = sosfilt(
            butter(2, [1500, 10000], fs=SR, btype="bandpass", output="sos"), rng.normal(0, 0.5, len(t))
        )
        phase = TAU * np.cumsum(110 * 9**fraction) / SR
        swell = envelope(t, 0.035, 0.016) * fraction**1.6 * (0.30 * noise + 0.065 * np.sin(phase))
        onset = at - length if up else at
        place(bed, onset, swell, 0.9, -0.45)
        place(bed, onset + 0.014, swell, 0.66, 0.55)
        if kind == "drop":
            t = clock(1.25)
            crash = np.diff(rng.normal(0, 0.48, len(t) + 1)) * np.exp(-4.8 * t)
            place(bed, at, envelope(t, 0.002, 0.04) * crash, 0.24, 0.33)
    if kind in ("stamp", "impact", "drop"):
        t = clock(0.9)
        sub = np.sin(TAU * (hz(root) * t + 0.65 * (1 - np.exp(-14 * t)))) * np.exp(-7 * t)
        place(bed, at, sub * envelope(t, 0.005, 0.08), 0.43)
        place(bed, at, clap if kind == "stamp" else kick, 0.41)
    elif kind in ("ding", "blip", "chime"):
        notes = {"ding": (19,), "blip": (12,), "chime": (12, 19, 24)}[kind]
        t = clock({"ding": 1.1, "blip": 0.125, "chime": 1.65}[kind])
        for i, semitone in enumerate(notes):
            place(bed, at + i * 0.075, bell(t, hz(root + 24 + semitone)), 0.12, 0.3 * (-1) ** i)
    elif kind == "tick":
        place(bed, at, tick, 0.14)
    elif kind in ("typing", "glitch"):
        offsets = (0, 0.085, 0.19, 0.235, 0.41, 0.48, 0.61) if kind == "typing" else (0, 0.044, 0.108, 0.135)
        for i, offset in enumerate(offsets):
            t = clock(0.037)
            if kind == "typing":
                burst = (0.44 * tick[: len(t)] + hat[: len(t)]) * np.exp(-62 * t)
            else:
                burst = np.sign(np.sin(TAU * (180 + 67 * i) * t)) * envelope(t, 0.002, 0.009)
            place(bed, at + offset, burst, 0.11, 0.45 * (-1) ** i)
    elif kind == "end":
        length = min(5.5, max(0, len(bed) / SR - at))
        t = clock(length)
        for i, semitone in enumerate((0, 12, 16, 19, 24)):
            phase = TAU * hz(root + semitone) * t
            note = (np.sin(phase) + 0.22 * np.sin(2 * phase)) * envelope(t, 0.08, 0.4) * np.exp(-0.25 * t)
            place(bed, at, note, 0.12, 0.5 * math.sin(i * 2))


def render(timeline, scenes, beat, chords):
    bed = np.zeros((round(timeline["duration"] * SR), 2), dtype=np.float32)
    rng = np.random.default_rng(116)
    drums = kit(rng)
    starts = {scene["id"]: [] for scene in scenes}
    for line in timeline["lines"]:
        starts[line["scene"]].append(line["start"])
    cues = []
    for i, (scene, timing) in enumerate(zip(scenes, timeline["scenes"], strict=True)):
        default = "tension" if scene.get("polarity") == "deep-space" else "groove"
        mode = scene.get("mode", "anthemic" if i == len(scenes) - 1 else default)
        levels = scene.get("music", [1] * 5)
        start, end = timing["start"], timing["end"]
        changes = [(start, mode)]
        for cue in scene.get("cues", []):
            at = starts[scene["id"]][cue["line"]] + cue.get("at", 0)
            cues.append((at, cue))
            if "mode" in cue or cue["kind"] == "end":
                changes.append((max(start, min(end, at)), cue.get("mode")))
        changes.sort(key=lambda change: change[0])
        for (a, mode), (z, _) in zip(changes, changes[1:] + [(end, None)]):
            section = bed[round(a * SR) : round(z * SR)]
            if not len(section) or mode is None:
                continue
            if mode not in tfilm.CINEMA_MODES:
                fail(f"unknown cinema-keynote mode {mode!r}")
            arrange(section, a, z, mode, beat, chords, levels, drums)
            n = min(round(0.022 * SR), len(section) // 2)
            if n:
                ramp = np.linspace(0, 1, n, dtype=np.float32)[:, None]
                section[:n] *= ramp
                section[-n:] *= ramp[::-1]
    for at, cue in cues:
        root = chords[int(max(at, 0) / (4 * beat)) % len(chords)][0]
        if cue["kind"] == "end":
            root = chords[0][0]
        sound_cue(bed, at, cue["kind"], root, rng, drums, cue.get("rise", 1.4))

    # Diffuse stereo reflections. Feed each tap from the dry bus to avoid feedback.
    dry = bed.copy()
    for seconds, gain in ((0.031, 0.10), (0.053, 0.08), (0.097, 0.055), (0.157, 0.036), (0.241, 0.022)):
        n = round(seconds * SR)
        if n < len(bed):
            bed[n:] += gain * dry[:-n, ::-1]
    n = min(len(bed), round(2.2 * SR))
    bed[-n:] *= np.linspace(1, 0, n, dtype=np.float32)[:, None]
    return bed
