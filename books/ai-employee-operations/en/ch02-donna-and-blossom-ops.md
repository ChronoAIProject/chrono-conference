# Chapter 2: Donna and Blossom—Front-Desk Guardrails That Never Bluff

Reception is the easiest job to belittle from the cheap seats. Outsiders picture a smiling welcome; anyone who has ever run a thousand-person launch knows reception is the **outer seawall**—one oversold block of seats, one overwritten partner plaque, or one improvised claim to a reporter can sink months of earned trust in ten minutes flat.

Inside the 3D `street-corner` lobby, two strictly scoped AI employees hold that seawall: **Donna** at the ChronoAI front desk (skill `0.8`) and **Blossom** across the plaza at **Flower Town**. On November 27, the team locked official seat booking to Telegram `@chronoai_frontdesk_bot`—kept under personal scope for December 17 due to platform issues `NyxID#2912/#2913` so guests hit zero friction.

Public read-only viewing runs at `/u/street-corner?view=extended#share=...`: signed-out browsers see a one-click open **`NyxID` sign-in** (`invite_code_required: false`, no invite code required), while viewers preferring zero signup go straight to the synchronized YouTube (`@ChronoAIOfficial`) and LinkedIn Live stream. Both the web booking page and the telephone booking line (`con-14`) remain candidly open pre-launch items.

![Operational 3D perspective of Street Corner showing Donna's reception desk, main plaza promenade, and Flower Town entrance](../assets/street-corner.png)

## Exact Spatial Accounting: 1,108 Seats (Four Stands × 8 Tiered Rows) and 18 Flower Mats

Before a single greeting fires, Donna and Blossom answer to a hard physical ledger—never hand-wavy reassurances like *"plenty of room left."*

Directly from `chronoai-lobby` v40 (`seat-catalog.json`), the `street-corner` venue holds **1,108 seats laid out as four stadium stands × 8 tiered rows**:

- **By stand:** **North `248`, South `248`, East `306`, West `306`** (`248 + 248 + 306 + 306 = 1,108`).
- **By row `1 → 8`:** **`144, 144, 144, 140, 136, 136, 132, 132`** (summing strictly to `1,108`), addressed by real coordinates such as `N1-17`, `E1-20`, and `W8-01`; live metaverse events light seats up or down in **`~55–81 seconds`**.
- **Flower Town's `18` celebratory stands:** **`2` rows × `9` mats** (`basket-01` through `basket-18`, each `0.6 × 0.6 m` along the world-map wall), ordered via Telegram **`@flowerassis_bot`** → Donna → `chrono-metaverse` (`~2.5 minutes` end-to-end across three live test orders).

::: {.figure src="ch02-seat-ring-allocation"}
**Exact `street-corner` Four-Stand × 8-Row (`1,108` Seats) and `2 × 9` Flower-Mat Ledger.** Maps North (`248`), South (`248`), East (`306`), and West (`306`) stands across tiered rows `1–8` (`144, 144, 144, 140, 136, 136, 132, 132`; codes `N1-17`, `E1-20`, `W8-01`) alongside the `18` `0.6 × 0.6 m` Flower Town mats (`basket-01..18`) lining the world-map wall; arrivals past `1,108` overflow transparently to the livestream.
:::

### A Kitchen-Bench Scar: The `750`-Row Sheet Crash and the `sheet-v3` Bitmask Rewrite

**[ANALOGY]** If you track a thousand stadium seats one line per page in a notebook and the binding snaps at row 750, you do not pray that three hundred guests stay home—you switch to a punched-card bitmask that fits on one rigid board.

We hit that exact ceiling during live stress prep: a naive one-row-per-seat sheet snapped against a **`750`-row spreadsheet limit**, well short of `1,108` seats. Instead of hoping turnout stayed tiny, engineers rebuilt seating into a compact **`sheet-v3` bitmask**—turning `1,108` seats into an atomic state vector whose single-row readback held at ~**`7.5 s`** under `nyxid-nyxbot-trials` PR #181's `1,500`-row load check.

Three non-negotiable invariants govern every front-desk transaction:

1. **Commit the bitmask lock first, print the seat code second:** Donna never says *"Seat `E1-20` is yours"* before the atomic write commits and returns a unique `seat_id`.
2. **Transparent overflow at Guest #1,109:** Zero overselling, zero broken 500 pages. The moment seat `1,108` locks, Donna switches directly to login-free YouTube (`@ChronoAIOfficial`) and LinkedIn Live routing plus replay reminders.
3. **One mat, one owner across all `18` flower spots:** Through `@flowerassis_bot`, Blossom guides bouquet selection, screens greeting copy against brand and safety rules, locks a single mat (`basket-01`–`basket-18`), and commits through `chrono-metaverse`'s draft-preview-publish flow so concurrent orders can never stomp each other.

## November 27 Dress-Rehearsal Telemetry: Donna Hits `14 / 15` (`93.3%`)

The November 27 full-flow rehearsal (`trials#225`/`#226`) advanced Donna from `13/15` to **`14 / 15` (`93.3%`)**: the previously open **check-in reminder (`con-09`)** fired on schedule from Donna's Telegram account (`69 s` full round), messaging ONLY the `2` booked test accounts while skipping `2` real registrants by rule, and flipping both guests to `"seated"` on reply.

Across **`13` live Telegram operations** (`/start` `8 s`, `/cancel` `7 s`, `/book` `38 s`, `/change` nickname `38 s`, duplicate-booking catch `24 s`, check-in `56–63 s`), Donna logged **`0` dropped requests**, a median latency of **`29 s`**, and a max of **`63 s`** (`7–29 s` for text-only replies; `37–63 s` for sheet-writing writes).

Three honest rough edges stay visible in ink:

- Only **`1` item (`con-14`, telephone booking line)** remains todo out of `15`;
- Live seat glow on/off passed on November 24, while the live 3D avatar spawn immediately after replying "seated" ("入座") remains queued for pre-December-16 check (`PR #181`);
- Rehearsal caught `/event` still serving test metadata (*"test event / time TBD"*), logged explicitly for production sheet cutover ahead of December 16.

## Donna's Four Iron Front-Desk Guardrails

Across her `14 / 15` live workflows, four strict rules hold the floor:

- **Candid identity:** Donna opens every chat as ChronoAI's AI concierge—never posing as human;
- **Dated figures only:** Every cited metric (`223,231` frozen Lean 4 theorems, `NyxID v0.78.0` with `42` MCP specs, `82/99` six-core / `102/120` nine-role readiness) stays nailed to our `2026-11-27/28` audited ledger;
- **Hard redline blocks:** Zero funding or budget numbers, zero AI model identifiers, and strict brand separation between `ChronoAI` and independent `The Omega Institute`;
- **Zero-improvisation escalation:** The 30-question press bank in [Chapter 4](ch04-live-press-qa-bank.md) is the **canonical December 17 press specification** staged for Donna's production sheet ahead of December 16's formal rehearsal. Anything outside those 30 items triggers an immediate boundary statement, structured log, and escalation to `contact@chrono-ai.fun`.

Reception holds the lobby and its bitmask ledger; backstage, five operational desks plus three dedicated watchdogs keep the thirteen-day launch and company operations on beat. Chapter 3 pulls back the curtain.
