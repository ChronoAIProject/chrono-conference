# Build for What Comes Next: The 2026 Virtual Launch (`virtual-launch-2026`)

> 面向未来的造物 · 2026 线上发布会全片

## Overview

The twelve-scene flagship film for Volume I flies from ChronoAI Pte. Ltd.'s Singapore office through Tide Arena and into the independent observatory of The Omega Institute. Live product captures carry the kernel audit, access revocation, software stack and work ledger. The return flight closes on simultaneous views of sunlit Marina Bay and the observatory's galaxies.

The narration, bilingual lines and chapter openings are in [script.json](script.json). [scenes.js](scenes.js) times titles and telemetry to those lines. Green `LEAN ✓` labels cite the three frozen theorems listed in [film.json](film.json). Open questions carry red labels and analogies carry amber labels.

## Capture and verification

[clips.json](clips.json) maps each scene to its 1920×1080 H.264 master and SHA-256 digest. Stage the twelve MP4s in the ignored `out/clips/` directory. Each clip plays forward at 30 fps and includes at least 0.35 seconds beyond the measured narration scene. The coda combines two moving 960×1080 crops with a two-pixel divider. [assets/](assets/) contains one JPEG fallback per scene.

From the repository root, render both narrated editions and regenerate the poster with the measured timeline and self-hosted fonts.

```sh
film=books/launch-keynote/films/virtual-launch-2026
FILM_REQUIRE_CLIPS=1 FILM_STRICT=1 theme/film/film.sh "$film" all narrated narrated_720p cover
FILM_STRICT=1 theme/film/film.sh "$film" poster
```

The compositor checks all twelve clip hashes. The mux embeds the five chapters in the MP4s and writes the matching `out/chapters.vtt` for the preview player.
