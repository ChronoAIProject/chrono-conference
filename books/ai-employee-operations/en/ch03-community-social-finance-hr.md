# Chapter 3: Behind the Curtain—Community, Social, Finance, HR, Admin, and Three Watchdogs

A clean front lobby is only the tenth of the iceberg floating above the waterline. Running a thirteen-day global launch (December 4–17) across YouTube, LinkedIn, X, Discord, and GitHub without an outside agency never breaks teams during the seventy-five-minute broadcast itself—it breaks them in the relentless backstage grind of guest triage, timezone staging, receipt matching, recruiting queues, and recurring reminders.

**[ANALOGY]** Picture the backstage team as a **samba drumline**: bass, snare, and agogô each hold one narrow rhythmic lane without stepping across another player's chart—and in the back row sits a **cold-eyed Monday critic** with a metronome whose sole job is calling out whoever drifted off-beat, wasted cycles, or burned money the week before.

Inside ChronoAI, five core operational desks plus three newly standalone watchdogs hold those lanes—driven underneath by **`13` scheduled agents** in our Social and Community playbook (`8` X Content Studio + `3` Community/Concierge + `2` Reputation/Retro) and audited end to end in `audit-2026-11-26.md` across **`15` live agents, `89` scheduled tasks, and `931` passing automated operational tests** (`374` state-repo + `182` studio + `279` community + `96` retro).

::: {.figure src="ch03-community-ops-pipeline"}
**Backstage Event-Driven Pipelines and Three Standalone Watchdogs.** Top Discord, X, and GitHub signals flow through a **2 × 4 card grid** spanning Community Ops (`10/12`), Social Auto-X + LinkedIn (`12/14`), `NyxBot` Finance (`24/28` + `17` permanently human items), honestly downgraded HR (`14/20`), Admin (`8/10`), and three standalone watchdogs (Sentiment Monitor `6/7`, KB Maintainer `3/3`, Retrospective Analyst `11/11`); below sits an **amber bar** recording **`Nov 27 full-flow rehearsal · 11/12 passed`**, anchored at the bottom by a **cyan bar** for **`Human approval queue + audit log`**.
:::

## Community Ops (`10 / 12`) and Social Auto-X + LinkedIn (`12 / 14`): Mechanical Rejections and a 55-Minute Zero-Human Run

Handing a company's social accounts to an unguarded bot to "improvise posts" is the fastest self-inflicted disaster on the internet. We split the circuit cleanly: **AI owns high-frequency drafting, mechanical checks, timezone scheduling, FAQ triage, and clip staging; humans own milestone announcements, sensitive replies, and moderation rulings.**

- **Community Ops (`10 / 12 = 83.3%`, up from `9/11`):** Runs skill `4.36` paired with `reply-queue 0.3`. Building on 75 earlier rehearsal actions, the November 27 full-flow rehearsal ran the entire event arc end to end:
  - **Measured timings:** Open-booking announcement landed in `3m01s`; `T-1d` and `T-1h` reminders fired **`49 s`** and **`46 s`** past schedule; post-event thanks arrived in `2m43s`, replay links in `3m06s`, and four Discord guest questions cleared in **`56–76 s`** (outside reminder overlap) while logging cleanly into `Questions`.
  - **Two real warts caught on the bench:** First, one stale template in `Event_Config` leaked backstage phrasing (*"noted, will compile for the host"*)—hot-patched live at `13:30` into natural guest wording. Second, a no-op *"not yet time"* check task burned **`16.6 minutes`** sitting idle in the worker slot, now queued for trimming. Heated conflict mediation and ban appeals stay permanently human.
- **Social (`Auto-X` + LinkedIn, `12 / 14 = 85.7%`, up from `11/13`):** Delivered three concrete, auditable milestones in a single week:
  1. **November 25:** `@li-publisher` crossed Lark approval and published **the first live Lark-approved post directly to ChronoAI's LinkedIn company page** via `NyxID` (`#187`);
  2. **November 26:** Auto-X carried an **urgent video brief end-to-end in `55 minutes` with zero human intervention steps**;
  3. **November 27 rehearsal proof of brakes:** After receiving a launch-promo schedule request, the writer turned in three drafts plus art by `12:20`—and the automated checker **mechanically rejected all three round-1 drafts** because none named the product. The writer rewrote (`14:15–14:21`), cleared fact and tone review (`14:45`/`15:00`), flagged high-risk for human sign-off (`15:15`), and shipped at `15:26:15`—three minutes and twenty-three seconds after the human lead replied **`"发 149"`** in Lark.

## `NyxBot` Finance (`24 / 28` + `17` Permanently Human): A Real 34-Minute Kitchen-Bench Install, Not "15-Minute Magic"

Finance leaves zero room for glossy exaggeration. Plenty of demos promise "a 15-minute magical AI CFO." Inside `ChronoAIProject/nyxbot-finance`, we timed a genuine clean-account installation from scratch: the verified second pass took **`34 minutes`**, walking deliberately through **`10` confirmations and `8` explicit approvals**. Thirty-four minutes is not a flaw—it is what careful wiring looks like when money sits on the table.

As of November 27, 2026, `NyxBot` Finance runs **`24` of `28` AI-scoped accounting workflows (`85.7%`)**—receipt categorization, invoice drafting, recurring bill anomaly flags, Credits reconciliation (`1 credit = 1 USD`), read-only cashflow forecasts, journal-entry drafts, budget-variance alerts, and payroll worksheet drafts. On Lark Bitable, receipt photos and text-layer PDFs archive byte-for-byte with each row; scanned image-only PDFs are refused candidly with a prompt to snap a photo instead.

Three bold borders remain welded in place:

1. **Authority border:** **`17` additional finance workflows remain permanently human** (bank wires, cash disbursements, statutory tax filings, payroll release)—neither granted to any agent nor padded into the AI denominator.
2. **Ledger border:** Currently verified on **real bank balances + a demo bookkeeping ledger**, with zero outbound write authority.
3. **Commercial border:** External paying merchants remain **`0`** as of `2026-11-27`—Chapter 6 opens our first external pilot cohort to prove live store ledgers one merchant at a time.

## HR Pack (`14 / 20`, Honestly Downgraded) and Admin (`8 / 10`, Up Three Steps)

Putting these two desks side by side shows both halves of an honest ledger:

- **HR Pack (`chrono-hr`, `14 / 20 = 70.0%`, honestly DOWNGRADED from `15/20`):** Real workflows shipped this week—JobStreet intake and candidate sync into Lark (`hr-13`, 4 runs/day with backfilled rows), a 22-row HR calendar (`hr-15`), and a `09:50` weekday read-only recruiting check (`hr-20`). Yet on November 26, a strict evidence audit caught that `hr-04` **cannot parse PDF resumes** without manual copy-paste. Instead of leaving a fake green check, the owner demoted `hr-04` from `done` to `part`, pulling HR openly down to `14/20`. Compensation bands, formal offers, and terminations stay strictly human.
- **Admin (`Admin`, `8 / 10 = 80.0%`, up from `5/10`):** Weekday `09:00` Singapore group briefs (weather, 7/30-day calendar, MOM holidays), monthly/annual recurring reminders that silence on completion and roll over cleanly, and live Singapore office front/back door and lighting controls via Apple Home and Lark `ChronoAI-Nyxbot`. Whole-shelf pantry vision counting remains honestly marked partial; legal contracts, corporate seals, and major procurement stay human.

## Three Standalone Watchdogs (`20 / 21`): Even the AI Team Faces Monday Judgment

Hire only workers and never an auditor, and any automated operation drifts silently off key. Across November 26–27, we split three cross-cutting guardians into standalone tracked roles, lifting our nine standalone AI employees to **`102 / 120` (`85.0%`; equal-weight average `87.1%`)**:

- **`#7` Sentiment Monitor (`6 / 7 = 85.7%`):** Watches Discord and X hourly, escalates recurring pain points to P2, sends `21:30` closed-item counts and a `22:15` daily digest—under one iron compliance lock: **zero reads from live official Discord channels until PDPA sign-off clears**.
- **`#8` KB Maintainer (`3 / 3 = 100.0%`):** Curates verified FAQs twice daily and previews topic updates on demand before publishing, keeping Community Ops grounded in checked answers rather than wandering onto web search.
- **`#9` Retrospective Analyst (`11 / 11 = 100.0%`, added `2026-11-27`):** The built-in Nietzschean critic sitting in the back row. Every Monday, it skips applause and audits the rest of the AI team against **`40`-item masked weekly samples**, **`7`-peer X benchmarks**, and **per-agent unit cost**—calling out whoever drifted off-beat or burned sixteen minutes on a no-op, and delivering a formal post-mortem within 48 hours of the December 17 broadcast (`#188`).

Front-of-house holds its 1,108 seats; backstage holds its lanes and its Monday critic. Next comes the sharpest live stress test on broadcast day: eleven minutes of unscripted press and developer scrutiny. Chapter 4 lays out **all 30 verified answers in Donna's canonical press specification**—and the exact circuit that fires the instant a question steps over the line.
