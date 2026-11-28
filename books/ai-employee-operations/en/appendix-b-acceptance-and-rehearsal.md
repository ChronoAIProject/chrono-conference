# Appendix B: Load-Test, Acceptance, and Rehearsal Checklist

Never declare readiness by gut feeling. The three checklists below bind every automated publication gate across all four conference books, **the actual telemetry from November 27's full-flow dress rehearsal**, and **our December 11–16 pre-launch drills** into one hard ledger—nothing freezes for release until every row exits green with real artifacts and visual inspection.

## I. Publication & Media Automated Gates

| Gate Axis | Authoritative Command | Pass Requirement |
| --- | --- | --- |
| Structure, Parity & Lean Lock | `./tbook check` (all 4 visible books) | `0` errors, `0` warnings; every `lean=` resolves to a frozen `theorem`, zero `UNVERIFIED` |
| Source-Only Git Hygiene | `./tbook artifacts check` | `0` tracked derived SVGs, stills, or build outputs |
| Static Figures & Mobile Legibility | `./tbook fig build --check` & `./tbook fig list` | All 27 computed figures pass asserts and bilingual checks; smallest phone label $\ge 10.0\text{ px}$ |
| Interactive Labs & Slow-Frame Tests | `node tools/node/viz-validate.mjs`, `./tbook test --slow` & `VIZ_SLOW_FRAMES=1000` | All 7 labs pass `stageFirstChecks`, independent algorithm assertions, and `openStill` checks |
| Bilingual Slidev Decks | `node tools/node/slides-check.mjs` & `./tbook build slides` | All 4 decks (`66` slides per language, `132` bilingual pages total) page-aligned zh/en, `0` overflow, `0` system-font fallback, matching PDF page counts |
| Deterministic Explainer Films | `TBOOK_FILMS=require ./tbook build films` | All 6 films (flagship + 5 shorts) pass zero `Q()` mismatches, synced bilingual subtitles, posters $\le 300\text{ KB}$ |
| Full Multi-Format Export | `./tbook build html pdf epub site` | HTML, screen & print PDFs (plus academic PDFs for Volumes I & III), EPUB (`epubcheck` clean), and site pages visually inspected |

## II. Completed Field Evidence: Nov 26 Operational Audit & Nov 27 Full-Flow Rehearsal (`trials#225`/`#226`)

| Audited Run | Recorded Outcome & Measured Telemetry | Defects Exposed & Concrete Fix |
| --- | --- | --- |
| Live Ops Audit (`audit-2026-11-26.md`) | Audited **`15` live agents, `89` scheduled tasks**, and **`931` passing automated operational tests** (`374` state-repo, `182` studio, `279` community, `96` retro) | Strict Nov 26 audit caught HR `hr-04` PDF-reading limit and honestly downgraded HR `15/20 → 14/20`; Sentiment Monitor held off live Discord pending PDPA sign-off |
| Nov 27 Full-Flow Rehearsal Overview | **`12` stages rehearsed; `11 / 12` passed first try**; human lead performed only **`4` actions** (guest ops, Q&A list ask, `"发 149"` approval, replay-ready confirmation); `capacity_wait = 0` | `1` failure logged below (`NyxID#2534`), plus `4` smaller defects tracked for Dec 16 verification |
| Concierge Donna (Telegram) | `13` ops, **`0` dropped**, median **`29 s`** (max `63 s`; text `7–29 s`, sheet writes `37–63 s`); check-in reminder `con-09` finished in `69 s`, skipping real registrants | Test metadata in `/event` queued for pre-Dec-16 production swap; phone line `con-14` still unassigned; 3D check-in avatar spawn queued for Dec 16 recheck |
| Community Ops (Discord) | `T-1d` / `T-1h` reminders **`49 s` / `46 s`** past schedule; `4` guest questions answered in **`56–76 s`** and logged to `Questions`; notices/thanks/replay `2m43s`–`3m06s` | Stale backstage phrasing in `Event_Config` hot-patched live at `13:30`; `16.6`-min no-op check task queued for trimming |
| Auto-X Promo Pipeline | Scheduled `11:32`; `12:20` checker **mechanically rejected all 3 round-1 drafts** for omitting the product name; rewritten, reviewed, held at `15:15`, shipped `3m23s` after **`"发 149"`** | Explicit event-post product-tagging rule added to topic selection to avoid round-2 rework |
| Host Q&A Sheet (Sole Failure & Bypass) | `14:49:27` Lark internal-group request stalled in gateway queue for **`65–70 min`** (`NyxID#2534`); bypassed cleanly via **scheduled one-shot task** delivering **7 host topics in `3.0 min`** | December 17 runbook locked to scheduled one-shot delivery rather than live group-chat pull |

## III. Pre-Launch Load Drills, Freeze & Formal Rehearsal Checklist (Dec 11 – Dec 16)

| Milestone & Drill | Load / Verification Probe | Pass Criterion |
| --- | --- | --- |
| `Dec 11` `street-corner` `sheet-v3` Atomic Lock | `1,250` simulated concurrent guests racing for four stands × 8 tiered rows | Exact **`1,108`** locked seats (N `248` / S `248` / E `306` / W `306`) with `0` collisions; Guests `1,109–1,250` route cleanly to HD stream |
| `Dec 11` Flower Town `2 × 9` Mat Contention | `25` concurrent flower orders competing for `basket-01..18` (`0.6 × 0.6 m` mats) | Strict one-mat-one-owner locking with zero overwrites; excess orders get polite full notice |
| `Dec 11` Donna Adversarial Redline Suite | `20` funding traps, model-name traps, and RH attribution probes | **`20 / 20`** zero-improvisation refusals with tracked tickets escalated to `contact@chrono-ai.fun` |
| `Dec 11` `NyxID` / `CMA` Hot Revocation Drill | Mid-session token revocation on live worker | Downstream hits `403 REVOKED` inside ~`2.1 s` window without crashing active sandboxes |
| `Dec 11` Dual-Stream Failover Test | Deliberate disconnect on one RTMP stream | Surviving stream holds steady; Community Ops & Auto-X pin failover URL within `90 s` |
| `Dec 15` Artifact Freeze & Disclosure Scan | Regex audit across all 72 chapter, coda, and appendix files (88 edition Markdown files including prefaces and contents), 4 decks, 7 labs, and 6 films (flagship + 5 shorts) | Zero funding/budget figures, zero AI model names, sole email `contact@chrono-ai.fun`, exact brand spelling, read-only freeze |
| `Dec 16` **Formal Discord Dress Rehearsal** | Full end-to-end run on the official Discord server with production event copy, Chapter 4's canonical 30-Q sheet, and scheduled one-shot Q&A delivery | All checks green, live 3D check-in avatar verified, authorizing creation of **Dec 17 (`16:00–17:15 SGT`)** live schedules |

Only when every row across all three checklists turns honestly green—and the rendered figures, slides, interactive labs, and book spreads pass inspection with our own eyes—does this virtual launch, built on our own agent stack under human review, earn its opening line: **Build for what comes next.**
