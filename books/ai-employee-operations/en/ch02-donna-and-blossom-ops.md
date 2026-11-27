# Chapter 2: Donna and Blossom—Front-Desk Guardrails That Never Bluff

Reception is the most underestimated job in any live event. Outsiders picture a polite smile; anyone who has ever run a thousand-person launch knows reception is the **primary seawall**—one oversold block of seats, one misprinted partner plaque, or one improvised promise to a journalist can trigger a meltdown in ten minutes flat.

Inside `street-corner`, two scoped front-of-house AI employees hold that seawall: **Donna** at the ChronoAI reception desk (confirmed November 27 for official Telegram seat bookings via `@chronoai_frontdesk_bot`, skill `0.8`) and **Blossom** across the promenade at **Flower Town**. Opening the `street-corner` URL in a signed-out browser first presents a one-click **`NyxID` sign-in** (`invite_code_required: false`, open public signup) before entering the 3D space; guests who prefer zero signup can watch the synchronized YouTube and LinkedIn Live stream directly.

![Operational 3D perspective of Street Corner showing Donna's reception desk, main plaza promenade, and Flower Town entrance](../assets/street-corner.png)

## Exact Spatial Accounting: 1,108 Theater Seats and 18 Flower Stands

Before a single welcome message fires, Donna and Blossom operate against an exact physical capacity ledger—never vague reassurances like *"plenty of spots left."*

The amphitheater spans **six concentric rings** totaling exactly **1,108 seats**, bordered by **18 numbered flower-basket stands** along the promenade. Every ring count sits locked inside the atomic booking state machine:

::: {.figure src="ch02-seat-ring-allocation"}
**Exact `street-corner` Ring & Flower-Stand Allocation.** Six concentric theater rings hold `96`, `144`, `176`, `204`, `232`, and `256` seats respectively (summing strictly to `1,108`), flanked by `18` numbered promenade flower-basket slots; arrivals beyond 1,108 overflow automatically to the livestream.
:::

Three atomic invariants govern every transaction:

1. **Lock first, confirm second**: Donna never promises *"Ring 2, Seat 18 is yours"* before the atomic lock commits. Confirmation copy fires only after the backend returns a unique committed `seat_id` (in `nyxid-nyxbot-trials` PR #181's `1,500`-row load test, single-row readback measured ~`7.5 s`).
2. **Transparent overflow at Guest #1,109**: Zero overselling, zero cryptic 500 pages. The instant seat 1,108 locks, Donna switches seamlessly to overflow routing, delivering synchronized YouTube (`@ChronoAIOfficial`) and LinkedIn Live links plus replay reminders.
3. **One stand, one owner**: Across Flower Town, Blossom guides visitors through bouquet selection, validates greeting-card copy against brand and safety rules, locks one unique stand (`slot_01`–`slot_18`), and commits through `chrono-metaverse`'s draft-preview-publish pipeline so two baskets can never overwrite one stand (three live Telegram test orders completed order-to-stand placement in ~`2.5` minutes). Both remaining gaps stay candid: telephone seat booking still awaits a dedicated phone number, and the December 17 `T-30m` check-in reminder cron is queued for the formal production switchover.

## Donna's Four Front-Desk Guardrails

Across her `13 / 15` live workflows, four iron rules keep reception rock-solid:

- **Candid identity**: Donna introduces herself openly as an AI concierge—never impersonating a human;
- **Dated citations**: Every cited metric (`167,819` frozen theorems, `NyxID v0.78.0`, `77/97` ops readiness) stays strictly locked to the dated ledger in Volume I, Appendix B;
- **Hard redline filters**: Zero funding or budget numbers, zero AI model identifiers, and strict brand separation between `ChronoAI` and `The Omega Institute`;
- **Zero-improvisation escalation**: Any question outside the 30-item verified press bank ([Chapter 4](ch04-live-press-qa-bank.md)) is never guessed—Donna logs the verbatim prompt and routes it cleanly to `contact@chrono-ai.fun` for human follow-up.

While Donna and Blossom hold the front lobby, the remaining five backstage roles organized across four operational streams—**Community Ops, Social Auto-X, `NyxBot` Finance, and the separately tracked HR Pack and Admin roles**—carry the thirteen-day countdown and operational backbone. Chapter 3 pulls back the curtain.
