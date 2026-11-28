# Chapter 4: Street Corner: A Virtual Venue That Runs Itself

If a company stands on stage boasting that its AI employees can staff your front desk, yet rents a five-star hotel ballroom and hires a row of humans in suits to run its own launch—any sharp skeptic bursts out laughing, and the physicist in row one raises a hand: *"If your machine is so solid, why didn't you let it set out the chairs at the door?"*

So we skipped the hotel, skipped the film crew, and built a permanent, open online launch lobby on our own 3D spatial engine, `chrono-metaverse`: **Street Corner (`street-corner`)**.

![3D overview of the Street Corner virtual lobby showing the ChronoAI reception desk, plaza promenade, and Flower Town entrance](../assets/street-corner.png)

Two clean doors lead inside: the public read-only viewer at `/u/street-corner?view=extended` or one-click open-signup **`NyxID`** entry into the interactive workspace (`invite_code_required: false`, GitHub / Google / Apple—while YouTube `@ChronoAIOfficial` and LinkedIn Live remain completely login-free). Official seat reservations run straight through Telegram concierge bot **`@chronoai_frontdesk_bot`** (the web booking form and phone line remain open pre-launch items—we never count unfinished doors).

Instead of hitting a dead registration form, you walk into a live 3D plaza built on real coordinates. Dead ahead glows the reception desk staffed by AI Concierge **Donna**; along the world-map wall sits **Flower Town** with **2 rows × 9 flower mats (`basket-01`..`basket-18`)**, tended by **Blossom** via Telegram bot **`@flowerassis_bot`**; and rising behind the square stands the **Xingchao (Star Tide)** virtual stadium—not a hand-waved sketch of imaginary circles, but the real `chronoai-lobby` (v40) catalog of **four stands × eight tiered rows totaling exactly `1,108` addressable seats**:

- **By stand**: **North `248`**, **South `248`**, **East `306`**, **West `306`** ($248 + 248 + 306 + 306 = 1{,}108$).
- **By tiered row (`1 → 8`)**: **`144, 144, 144, 140, 136, 136, 132, 132`** (`= 1,108`).
- **Real seat codes**: every seat carries a concrete coordinate (`N1-17`, `E1-20`, `W8-01`), lighting up or clearing in the live 3D venue roughly **`55–81 s`** after a metaverse event fires.

Pull the camera back and the architectural ambition gets even wilder: `chrono-metaverse` (`dev 21e1f93`, November 27, 2026) drives a **four-stage extended broadcast pipeline**—from the physical office cabinet screen (`rb.cabinet-01`), outward to the `1,108`-seat virtual stadium, up to a **`252.8 m × 142.2 m`** sky-screen over Marina Bay Sands, and finally to an Earth-orbital **`5,307 km × 2,985 km`** planetary display. Scale can reach orbit, provided every single chair on the floor locks like a Swiss watch.

## A Five-Step State Machine: Why Two Browsers Cannot Claim Seat `N1-17` at Once

Virtual launches rarely fail because the shaders look dull; they break on **state consistency under rush-hour concurrency**. When hundreds of guests hit the gate ten minutes before curtain, what stops two browsers from locking Seat `N1-17` in the exact same millisecond? And what keeps Guest #1,109 from staring at an ugly 500 error?

Here is the real kitchen-bench story: during early testing, an ordinary `750`-row spreadsheet backing seat state snapped straight in half under load—so before opening night we scrapped it and rebuilt the floor onto a compact bitmask (`sheet-v3`) wrapped in an atomic booking lock. The visitor path tightens into five deterministic steps: arrive via lobby link or `@chronoai_frontdesk_bot`, authenticate zero-secret via `NyxID`, clear concierge triage with **Donna**, trigger an atomic four-stand seat lock or Flower Town mat placement, and cross into the 16:00 SGT keynote broadcast.

::: {.figure src="ch04-street-corner-flow"}
**Street Corner Five-Stage Guest Flow & Atomic Booking Lock.** Visitors enter via the lobby and `NyxID` (or book directly via `@chronoai_frontdesk_bot`), check in with Donna, branch cleanly into atomic four-stand tiered seating (`1,108`-seat cap) or Flower Town celebratory flower mats (`2 × 9 = 18` slots), and step into the 16:00 SGT livestream stage.
:::

Rather than asking you to trust prose about concurrency, our client-side deterministic schematic lab `LAUNCH//ARENA` maps all four stands × eight tiered rows (North `248`, South `248`, East `306`, West `306` = `1,108` seats) alongside all `18` flower mats along the world-map wall. Start with the quiet pre-doors floor:

::: {.viz src="launch-arena" preset="lobby" height="500"}
**Street Corner Overview (`lobby`).** Pre-doors architectural map of `street-corner`: four floating glass tiered stands enclose the lobby bowl on all four sides (North `248`, South `248`, East `306`, West `306`—`1,108` open seats across eight rows), with the keynote screen (north), Donna's reception desk (west), Flower Town (east), and `2 × 9` flower-basket mats (`basket-01..18`) along the southern world-map wall positioned *inside* the bowl.
:::

Now throw the doors open. The `booking` card runs an opening arrival surge across the front tiered rows of all four stands. Keep your eyes glued to the collision counter at the bottom: under the atomic lock invariant, **duplicate-seat collisions stay identically `0`**, binding every confirmation token to one unique seat code (`N1-17`, `E1-20`, `W8-01`)—our exact pass bar for the December 11 load drill.

::: {.viz src="launch-arena" preset="booking" height="500"}
**Atomic Seat Lock (`booking`).** Simulates **`N = 720` guests** paused at **`T−30` (minute `45`)**: **`432` seats (`144 × 3`)** cleanly fill rows 1–3 across all four stands in cyan while row 4 stays empty, holding duplicate-seat collisions strictly at `0`.
:::

Next comes the boundary that divides working operations from fragile theater: **what happens when 1,250 guests show up for a 1,108-seat arena?** Glossy virtual stages either crash or silently stack avatars on top of one another. Our routing switch is blunt: seats 1 through 1,108 stay strictly locked inside the four stands, and from Guest #1,109 onward, Donna hands over an immediate full-house notice and routes the visitor cleanly into login-free YouTube (`@ChronoAIOfficial`) and LinkedIn Live—modeled in the `overflow` card below and locked as our December 11 load-drill bar: **zero collisions, zero stranded errors.**

::: {.viz src="launch-arena" preset="overflow" height="500"}
**Full-House Overflow (`overflow`).** At 1,250 arrivals, all 1,108 seats across the four stands stay locked with zero collisions while the 142 overflow guests route cleanly to the synchronized YouTube and LinkedIn Live stream.
:::

## Along the World-Map Wall: Blossom and Eighteen Flower Mats

If the four stands embody concurrency discipline, the **2 rows × 9 mats (`0.6 × 0.6 m` each, `basket-01`..`basket-18`)** lining the world-map wall give an agent-staffed venue its unmistakable warmth. Across Asia, opening days are greeted by celebratory flower stands from partners, contributors, and friends. Rather than baking static decorations into the scenery, we wired every mat as a live spatial target.

![Floor layout of the 2 rows × 9 numbered flower-basket mats lining the Street Corner world-map wall](../assets/lobby-slots.png)

A guest or partner messages Telegram bot **`@flowerassis_bot`**, chooses an arrangement with **Blossom**, and signs a greeting card. Donna verifies the payload and writes straight into `chrono-metaverse`—and roughly **`2.5 minutes`** end-to-end, a unique 3D flower basket with its signed plaque materializes on the assigned mat for every arriving visitor to see.

![Rendered 3D celebratory flower baskets and greeting plaques placed inside the Street Corner lobby](../assets/lobby-baskets.png)

The `basket` schematic card below shows all 18 mats—12 illuminated with placed arrangements and 6 glowing amber awaiting claims. Behind each real basket runs the entire five-layer vehicle: `NyxID` scoped handles, `NyxBot` specialist workflows, and the `chrono-metaverse` write protocol.

::: {.viz src="launch-arena" preset="basket" height="500"}
**Eighteen Flower Mats (`basket`).** Focuses on the 2 rows × 9 numbered mats (`basket-01..18`; 12 placed, 6 open in amber) along the world-map wall, tracing a greeting card from `@flowerassis_bot` and Blossom into a live 3D stand.
:::

## Sixty-One Seconds Through Street Corner

For a kinetic tour of the entire visitor arc—from checking in with Donna, across all four tiered stands locking `1,108` seats, to lighting up the `18` Flower Town mats—watch the 61-second (1:01) venue film below.

::: {.film src="from-flower-to-seat"}
**From a Flower Basket to a Seat (Venue Tour Film).** A 61-second (1:01) walkthrough of `street-corner`: Donna's reception guardrails, atomic locking across 1,108 seats on four tiered stands, graceful livestream overflow, and Blossom's 18 Flower Town mats.
:::

## The November 27 Full-Flow Rehearsal: 11/12 Passed—and One Real 65-Minute Stall

Anyone can draw clean guardrails on slides. Real engineering shows up when you run a dress rehearsal hard enough to make the machinery sweat.

As of **November 27, 2026** (`nyxid-nyxbot-trials@df5ef47`), **Donna** moved up from `13/15` to **`14 / 15` (`93.3%`)**—with check-in reminders verified live on November 27 and only the phone line (`con-14`) honestly left open. Paired with the canonical **30-question verified press bank** published in Volume IV, Chapter 4 (loaded to Donna's production sheet ahead of the December 16 Discord dress rehearsal), she runs on a rule worth ten times "answering everything": **refuse to improvise beyond verified facts—log the question verbatim and escalate straight to `contact@chrono-ai.fun`.**

That same day, we rehearsed all **12 launch stages** end-to-end with live bots (`trials#225`/`#226`):

- **`11 / 12` stages passed on the first try**, requiring only **`4` human actions** from the lead (play one guest, request the host Q&A sheet, reply `"发 149"` to approve one X post, and confirm the replay link);
- **Measured latencies**: Donna completed `13` booking and check-in operations with **`0` dropped** at a **`29 s` median** (max `63 s`); Discord Q&A ran **`56–76 s`**; scheduled reminders fired **`46–49 s`** past tick;
- **And the 1 real failure we refuse to sweep under the rug**: requesting the host Q&A sheet inside an internal Lark group stalled in the gateway queue for **`65–70 minutes`** (bug **`NyxID#2534`**)—diagnosed on the spot and bypassed via a scheduled one-shot task that delivered the 7-topic host briefing cleanly in **`3.0 minutes`**.

A venue willing to print its own queue-stall ticket number and bypass latency in Chapter 4 is ready for live doors. Open the full `LAUNCH//ARENA` lab below, drag arrivals from `1` to `1,250`, click any stand or flower mat, and push our lobby until it squeaks.

::: {.viz src="launch-arena" height="560"}
**Full Laboratory: `LAUNCH//ARENA`.** Drag concurrent arrival load (1–1,250), step through all five experiment cards, and click individual stands or the 18 flower-basket mats to inspect atomic locking and overflow curves live.
:::

Take your seat as the house lights drop. The first beam hitting the main screen does not illuminate a commercial slogan; it illuminates a proving ground colder than any market and far less forgiving than any press conference—**pure mathematics and the Lean 4 compiler kernel**. Look up at our North Star in Chapter 5.
