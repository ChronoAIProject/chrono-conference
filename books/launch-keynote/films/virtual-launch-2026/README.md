# Build for What Comes Next: The 2026 Virtual Launch (`virtual-launch-2026`)

> 面向未来的造物 · 2026 线上发布会全片

## Overview

`virtual-launch-2026` is the ten-scene flagship film for Volume I. Its visual language moves between ChronoAI Pte. Ltd.'s daylight plaza and the independent The Omega Institute's deep-space glass observatory. Every analogy and stance is labelled on screen. `LEAN ✓` is reserved for the three frozen theorem declarations listed in `film.json`, and open research boundaries carry red `OPEN` stamps.

The three local cinema clips are full-frame 1920×1080 H.264 inputs at 30 fps. They are kept in the ignored `clips/` and `out/clips/` release-input directories and are checked against the SHA-256 values in `clips.json` before compositing.

- `office-to-stadium.mp4` carries the Stage 1 office LED-wall PiP through the glass into Stage 2 `星潮`.
- `stadium-bay-orbit.mp4` carries the logarithmic Stage 2 → Marina Bay Sands → Earth-orbit pullback.
- `observatory-stations-to-galaxies.mp4` carries the eight live research stations into eight spiral galaxies and the final `曜白` reveal.

The web edition keeps compact tracked JPEG plates in `assets/`. Release masters composite the clips behind the standard transparent HUD layer. `FILM_REQUIRE_CLIPS=1` therefore fails closed if a clip is absent or its digest differs.

## Scene map

1. `prologue_office_to_stadium` opens the 14F MBFC Tower 1 office and crosses into four stands, eight rows, 1,108 seats, and 2×9 flower mats.
2. `prologue_bay_to_orbit` passes the 112 m and 180 km thresholds, Marina Bay Sands, 457 bay buildings, 14 shuttles, and the 5,307 km orbital screen.
3. `act1_judgment` frames 141,624 commits across 74 repositories and the 538-repository six-organization atlas as an explicit `STANCE`.
4. `act2_stations_to_galaxies` cruises the eight named departments, then dives through 19,022 truth nodes and 28,774 edges.
5. `act2_kernel_ratchet` shows the verbatim `#print axioms` receipt and the two Lean ratchet theorems with an explicit `ANALOGY` badge.
6. `act2_red_stamps` records 1,049 outreach contacts, 485 replies, Mathesis' 225 papers and 0 acceptances, and the exact Levent Alpöge provenance alongside open ERH, Grand RH, zero simplicity, and pair correlation.
7. `act3_vehicle_chassis` presents the five-layer ChronoAI vehicle with NyxID, Ornn, CMA, heca, chrono-harness, and the real surfaces.
8. `act3_unfinished_bolts` exposes the private heca source, single CMA runtime, and `completeness_proven: false` boundary.
9. `act4_nine_employees_rehearsal` shows 102/120 workflows across nine roles, the 11/12 rehearsal, the 65-minute NyxID#2534 stall and three-minute bypass, the HR downgrade, and zero paying merchants.
10. `coda_choir_and_chalk` keeps ChronoAI Pte. Ltd. and The Omega Institute institutionally separate and gives the sole public contact `contact@chrono-ai.fun`.

## Capture and verification

The two venue takes use Chrome’s WebGL renderer with the seq-53 Marina Bay scene. The office and stadium share a coordinate system. The broadcast relay moves the stadium screen to the bay at 112 m and to Earth orbit at 180 km. The office and relay iframes decode the same local ChronoAI observatory video at the camera’s 30 Hz presentation times.

The observatory take uses the live WebGL scene at live.trureturing.org. It starts in mixed mode, focuses four departments, triggers a radar pulse, enters the cabin, then switches to galaxy mode at 14 s and daylight at 25 s. All five web plates come from these captures.

Stage the three MP4s in `out/clips/`, then run `FILM_REQUIRE_CLIPS=1 theme/film/film.sh books/launch-keynote/films/virtual-launch-2026 all`. The compositor verifies the three hashes and plays each clip forward and backward to cover the narration. In the rendered film, only the cinema bars and bilingual subtitles overlay these scenes.
