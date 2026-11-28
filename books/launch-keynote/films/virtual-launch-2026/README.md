# Build for What Comes Next: The 2026 Virtual Launch (`virtual-launch-2026`)

> 面向未来的造物 · 2026 线上发布会全片

## Overview

The eight-scene flagship launch film for Volume I opens in ChronoAI Pte. Ltd.'s Singapore office, flies through Tide Arena over Marina Bay, demonstrates the complete five-layer vehicle and nine AI employees live on screen, and—after a "One more thing" orbital jump—enters the independent research observatory of The Omega Institute (`live.trureturing.org`) for live Lean 4 kernel verification before closing on simultaneous views of sunlit Marina Bay and the observatory's galaxies.

The narration, bilingual single-row subtitles, and five chapter openings are in [script.json](script.json). Pre-recorded studio voice tracks live in [voice/](voice/) (`line00.mp3`–`line55.mp3`), allowing CI and local builds to assemble the exact timed timeline and `-7 dB` ducked 120 BPM score deterministically without external TTS weights. [scenes.js](scenes.js) times kinetic titles and live telemetry to those lines. Green `LEAN ✓` labels cite the three frozen theorems listed in [film.json](film.json); open questions carry red `OPEN` labels and analogies carry amber labels.

## Capture and verification

[clips.json](clips.json) lists the eight forward-only 1920×1080 H.264 masters by scene. Each filename is paired with the SHA-256 digest of the stitched clip. Stage the eight MP4s in the ignored `out/clips/` directory. Each clip plays forward at 30 fps beyond its measured scene duration; the finale transitions from the orbital return flight into a live 960×1080 dual-world split with a two-pixel divider. The canvas preview uses [JPEG plates](assets/) for the eight scenes.

From the repository root, render both narrated editions and regenerate the poster with the measured timeline and self-hosted fonts.

```sh
film=books/launch-keynote/films/virtual-launch-2026
FILM_REQUIRE_CLIPS=1 FILM_STRICT=1 theme/film/film.sh "$film" all narrated narrated_720p cover
FILM_STRICT=1 theme/film/film.sh "$film" poster
```

The compositor verifies the eight clip hashes before rendering. The mux embeds the five chapters in the MP4s and writes the matching `out/chapters.vtt` for the preview player.
