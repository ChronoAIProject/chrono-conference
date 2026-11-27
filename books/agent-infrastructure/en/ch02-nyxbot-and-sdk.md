# Chapter 2: NyxBot, NyxAgent, and the Browser Assistant SDK

Drop a brand-new hire into an office without defining which ledger they own or how many mass emails they may send in an hour, and the strongest keycard system on Earth will not save you from an afternoon wreck.

`NyxID` locks down keys and spend ceilings. The next layer has to govern **role separation, memory discipline, and pressure-relief budgets**. Across ChronoAI's stack, the operational surface that business teams, launch guests, and browser visitors actually meet is formed by **`NyxBot`**, **`NyxAgent`**, and the newly shipped **`nyx-assistant-sdk`** (`v0.1.0` GA on November 27, already at `v0.2.4`).

## A Mechanical Gearbox and Dual Relief Valves: Why a Specialist Mesh Wins

Stuff corporate accounting rules, a 30-question press bank, 1,108 theater seat locks, and live GitHub triage into one giant chat box and watch performance smear: instructions collide, context rots, and when something breaks nobody can tell which sentence tugged the wheel.

**(Analogy)** Rather than building a single-gear monster with no safety valve on the boiler, `NyxBot` operates like a calibrated mechanical gearbox backed by two-stage pressure relief. Duties split into narrow **specialists**; each agent's persistent memory shelf holds at most 50 short index cards (`500` characters apiece—forcing distilled facts instead of hoarded clutter); and automated triggers run through **two distinct valves**: a gentle **default cap (`30/hr` and `300/day`)** that vents runaway webhook loops early, backed by an unyielding **configurable hard upper ceiling (`300/hr` and `3,000/day`)** that operators can dial up for legitimate burst workloads without ever removing the steel burst disc.

Every number in the figure and table below comes straight from backend source models in `ChronoAIProject/NyxID@v0.78.0` (`backend/src/models/`):

::: {.figure src="ch02-nyxbot-specialist-mesh"}
**`NyxBot` Specialist Mesh and Dual-Stage Operational Limits (`NyxID@v0.78.0`).** A central dispatcher coordinates `8` default specialists (`32` max) with an `8`-agent group room cap, `50` persistent memory notes (`500` chars each), and up to `16` pinned Ornn skills; automated triggers run under `30/hr` and `300/day` defaults backed by `300/hr` and `3,000/day` configurable hard upper ceilings.
:::

Inspect each baked-in limit and the exact failure mode it kills:

| Source Constraint | Verified Limit | Source File | Failure Mode Prevented |
| --- | ---: | --- | --- |
| Default specialists | `8` | `assistant_settings.rs` | Covers core small-company roles out of the box |
| Max live subagents / specialists | `32` | `assistant_settings.rs` | Scales horizontally while bounding routing sprawl |
| Group room cap | `8` | `assistant_group.rs` | Stops >8-agent rooms from degenerating into echo chambers |
| Persistent memory slots | `50` notes (`500` chars each) | `assistant_agent.rs` | Forces concise, auditable facts instead of unbounded bloat |
| Max pinned Ornn skills | `16` | `assistant_agent.rs` | Prevents contradictory tool-manual sprawl on a single worker |
| Default trigger rate caps | **`30 / hr`** · **`300 / day`** | `assistant_settings.rs` | Default relief valve catching retry loops and webhook storms early |
| Configurable hard trigger ceilings | **`300 / hr`** · **`3,000 / day`** | `assistant_settings.rs` | Steel burst disc: operators may tune throughput up, never past the hard wall |

## Active Under Real Load: Trial Workforce Ledgers and `nyx-assistant-sdk v0.2.4`

As of **November 27–28, 2026**, this mesh and its relief valves are running under real traffic across two live fronts:

1. **Back-Office Workforce & November 27 Full-Flow Rehearsal (`nyxid-nyxbot-trials@df5ef47`)**:
   - **Six core small-business roles verified at `82 / 99` (`82.8%`)**: Concierge **Donna** (+ Blossom) `14 / 15` (only phone line `con-14` left); `NyxBot` Finance `24 / 28` (clean-account second install timed at `34 min` across `10` confirmations and `8` approvals); Social **Auto-X** + LinkedIn `12 / 14` (first Lark-approved live LinkedIn post published November 25 by `@li-publisher`; urgent video brief finished in `55 min` with zero human steps on November 26); Community Ops `10 / 12`; Admin `8 / 10`; and **HR Pack `14 / 20`**.
   - **(Position)** **Put the sharpest demotion right up front: HR was honestly downgraded from `15 / 20` back down to `14 / 20`.** Strict evidence auditing caught a PDF resume-reading boundary; instead of burying it in a footnote, the team flipped the green cell back by hand—painted-green scorecards look soothing in slides and ambush you on opening night. Add three standalone ops and watchdog roles (Sentiment Monitor `6/7`, KB Maintainer `3/3`, and Monday's Retrospective Analyst `11/11` grading the rest of the team), and **nine standalone AI employee roles reach `102 / 120` (`85.0%`)**.
   - In the **November 27, 2026 12-stage end-to-end launch dress rehearsal** (`trials#225`/`#226`), **`11 / 12` stages passed on the first try** with only `4` human actions (Donna logged `13` booking/check-in ops, `0` dropped, median `29 s`). The single real failure is logged just as plainly: a Lark internal-group Q&A request stalled in the gateway queue for **`65–70 min`** (`NyxID#2534`), cleanly bypassed via a one-shot scheduled task that delivered the 7-topic host sheet in `3.0 min`.
2. **The 48-Hour SDK-to-Browser Sprint (`nyx-assistant-sdk v0.2.4` & `nyx-assistant-browser-extensions v0.5.0`)**:
   - Embedded web guidance broke out of prototype status in a dead sprint: **`nyx-assistant-sdk`** shipped **`v0.1.0` GA on November 27, 2026**, then cut **`6` releases across `48` hours (`38` merged PRs)** to land **`v0.2.4` on November 28** (`23` tags), delivering voice relay, page screenshot capture, guided tour briefings, and bilingual zh/en catalogs. A real bench snag during long live tours—with Voice Guide **Alexandra** narrating **`https://live.trureturing.org/`** alongside the `street-corner` lobby guide—drove the sharpest fix: while a narrator spoke for several minutes, underlying live telemetry moved on, creating a lose-lose choice between interrupting speech mid-sentence or reciting stale figures. The cure tucked **silent one-turn host tool lookups** directly into natural voice-tour pauses, polling fresh host state in the breath between phrases so long tours never miss live updates and never stumble over themselves.
   - Across the exact same two days (November 26–27), **`nyx-assistant-browser-extensions v0.5.0`** shipped from scratch in **`9` PRs**, lifting that zero-secret handshake onto any webpage the user visits: a **persistent Chrome side panel across tabs**, structured `window.nyxPageAPI` hooks, **bidirectional WebRTC real-time voice (`v0.4.0`)**, and **one-click live page or selection sharing right inside an active voice call (`v0.5.0`)**. The physical safety catch stays bolted tight: page context enters strictly through `activeTab` opt-in read-only excerpt sharing that **hard-excludes form inputs and unsent drafts**, and exactly **`0` backend plaintext secrets** ever touch browser JavaScript or extension storage—every call handshakes strictly through `NyxID` session endpoints.

## One Steel Plate Missing Between "Chatting" and "Shipping"

Once specialist meshes and relief valves are humming, a seasoned engineer asks the obvious hard question: **"If every specialist's playbook is just prose pasted into an admin text area, how do we security-scan, version-freeze, diff, and ship the reception, finance, and audit routines forged for December 17 to the next hundred merchants?"**

That brings us to Layer 2 of the complete vehicle—our agent-facing skill-lifecycle API, **`Ornn` and `nyx-skills`**. Chapter 3 opens the forge.
