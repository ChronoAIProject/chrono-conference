# Appendix B: Load-Test, Acceptance, and Rehearsal Matrix

Never declare readiness by gut feeling. This acceptance matrix consolidates every automated gate governing the four conference volumes and every live drill governing the December 17 broadcast—nothing freezes for release until every row exits green with real artifacts and visual inspection.

## Publication & Media Automated Gates

| Gate Axis | Authoritative Command | Pass Requirement |
| --- | --- | --- |
| Structure, Parity & Lean Lock | `./tbook check` (all 4 visible books) | `0` errors, `0` warnings; every `lean=` resolves to a frozen `theorem`, zero `UNVERIFIED` |
| Source-Only Git Hygiene | `./tbook artifacts check` | `0` tracked derived SVGs, stills, or build outputs |
| Static Figures & Mobile Legibility | `./tbook fig build --check` & `./tbook fig list` | All 26 computed figures pass asserts and bilingual checks; smallest phone label $\ge 10.0\text{ px}$ |
| Interactive Labs & Slow-Frame Tests | `node tools/node/viz-validate.mjs`, `./tbook test --slow` & `VIZ_SLOW_FRAMES=1000` | All 7 labs pass `stageFirstChecks`, independent algorithm assertions, and `openStill` checks |
| Bilingual Slidev Decks | `node tools/node/slides-check.mjs` & `./tbook build slides` | All 4 decks (`66` slides per language, `132` bilingual pages total) page-aligned zh/en, `0` overflow, `0` system-font fallback, matching PDF page counts |
| Deterministic Explainer Films | `TBOOK_FILMS=require ./tbook build films` | All 5 films pass zero `Q()` mismatches, synced bilingual subtitles, posters $\le 300\text{ KB}$ |
| Full Multi-Format Export | `./tbook build html pdf epub site` | HTML, screen & print PDFs (plus academic PDFs for Volumes I & III), EPUB (`epubcheck` clean), and site pages visually inspected |

## Live Broadcast & AI Employee Rehearsal Drills (Dec 11 – Dec 15)

| Drill | Load / Adversarial Probe | Acceptance Criterion |
| --- | --- | --- |
| `street-corner` Atomic Booking Lock | `1,250` simulated concurrent arrivals | Exact `1,108` locked seats with `0` collisions; Guests `1,109–1,250` route cleanly to HD livestream |
| Flower Town 18-Stand Contention | `25` concurrent flower orders competing for `18` slots | Strict one-stand-one-owner locking; excess requests get polite full-stand notice |
| Donna Adversarial Redline Suite | `20` funding traps, model-name traps, and RH hype probes | `20 / 20` zero-improvisation refusals with tracked tickets escalated to `contact@chrono-ai.fun` |
| `NyxID` / `CMA` Hot Revocation Drill | Mid-session token revocation on live worker | Downstream hits `403 REVOKED` inside ~`2.1 s` window without crashing running sandboxes |
| Dual-Stream Failover Test | Deliberate disconnect on one RTMP stream | Surviving stream holds steady; Community Ops & Auto-X pin failover URL within `90 s` |
| Full-Repo Disclosure Scan | Regex audit across all 72 chapter, coda, and appendix files (88 edition Markdown files including prefaces and contents), 4 decks, 7 labs, and 5 films | Zero funding/budget figures, zero AI model names, sole email `contact@chrono-ai.fun`, exact brand capitalization |

Only when every row in both matrices exits green—and the rendered sheets, slides, interactive stages, and book spreads have been verified with our own eyes—does this virtual launch, built on our own agent stack under human review, earn its opening line: **Build for what comes next.**
