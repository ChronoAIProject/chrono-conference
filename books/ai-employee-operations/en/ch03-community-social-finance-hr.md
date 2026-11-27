# Chapter 3: Behind the Curtain—Community Ops, Auto-X, Finance, and HR Packs

A gleaming front lobby is only the visible tenth of an iceberg. Running a thirteen-day bilingual countdown (December 4–17) across YouTube, LinkedIn, X, Discord, and GitHub without an agency normally crushes small teams under four relentless backstage pipelines: community triage, multi-timezone social dispatch, ledger reconciliation, and HR/admin housekeeping.

Inside ChronoAI, five backstage AI employees organized across those four pipelines carry the load—every single one routed through `NyxID`, packaged via `Ornn`, and bounded by human approval queues.

::: {.figure src="ch03-community-ops-pipeline"}
**Four Core Backstage Event-Driven Pipelines.** Live signals from Discord, X, and GitHub flow across four backstage pipelines—Community Ops (`9/11`, 75 rehearsal actions), Social Auto-X (`11/13`), `NyxBot` Finance (`24/28`), and HR/Admin packs (showing HR `15/20`, with Admin `5/10` running in parallel); major public releases and state-mutating writes halt at the amber human approval queue before committing and logging to audit.
:::

## Community Ops (`9 / 11`) and Social Auto-X (`11 / 13`): 75 Rehearsed Actions

Handing a brand's social keys directly to an unguarded bot to "improvise posts" is the fastest self-inflicted crisis on the internet. We split the wire cleanly: **AI owns high-frequency drafting, timezone staging, FAQ routing, and clip assembly; humans own the final publish trigger on sensitive announcements.**

- **Community Ops (`9 / 11` workflows wired)**: As of November 25, 2026, rehearsal logs in `nyxid-nyxbot-trials` record **75 completed rehearsal actions**—onboarding new arrivals, routing booking links, deduplicating recurring questions, drafting bug issues, and compiling daily digests. The remaining 2 workflows (heated conflict mediation and ban appeals) stay explicitly with human moderators.
- **Social Auto-X (`11 / 13` workflows wired)**: Stages the thirteen-day bilingual countdown matrix from Appendix A, attaches verified screenshots and short film clips across SGT/US/EU windows, and tracks conversion—holding major milestone posts and sensitive public replies at the amber approval gate. During the November 26–27 pre-launch operational audit (`nyxid-nyxbot-trials@e50c4eb`), the combined social, studio, community, and retro suites passed **931 automated tests** (`374` state-repo, `182` studio, `279` community, `96` retro), locked formal December 17 announcements and reminders to the official Discord server, and held the **Sentiment Monitor off live Discord channels pending PDPA sign-off**.

## `NyxBot` Finance (`24 / 28`): The Most Restrained Bookkeeper in Town

Among all six roles, **finance** allows the least margin for sloppy boundaries.

Inside `ChronoAIProject/nyxbot-finance` (verified November 25, 2026), `NyxBot` Finance runs **24 of 28 standard small-business accounting workflows (`85.7%`)**—expense categorization, recurring invoice checks, Credits reconciliation (`1 credit = 1 USD`), anomaly alerts, draft monthly statements, and multi-currency sanity checks.

Two bright red borders remain printed in bold:

1. **Authority border**: `NyxBot` Finance holds read-only ledger and draft-preparation scopes only—**zero capability to initiate cash transfers, bank wires, or statutory tax filings** (the remaining 4 workflows stay permanently behind human locks).
2. **Commercial maturity border**: All 24 verified workflows currently run on internal and demo ledgers, with **zero external paying merchants live in production yet**—our pilot cohort opens in Chapter 6 to prove real store ledgers one merchant at a time.

## HR Pack (`15 / 20`) and Admin (`5 / 10`): Automate the Clean Work, Refuse the Reckless Work

The final two roles embody pragmatic restraint:

- **HR Pack (`chrono-hr`, `15 / 20`)**: Automates job-description drafting, interview scheduling, open-source contribution summaries, and onboarding checklists; compensation bands, reference judgment, formal offer issuance, and terminations (`5` workflows) stay strictly human.
- **Admin (`5 / 10`)**: Honestly covers half of admin operations today—structured meeting notes, cross-timezone calendar conflict resolution, archival reminders, and launch-asset checklists—leaving legal contracts, statutory filings, and major procurement (`5` workflows) strictly in human hands.

Together, our front-desk role (Donna partnered with Blossom) and five backstage roles form one audited operational unit. Yet the single sharpest test waiting on December 17 is eleven minutes of unscripted press and public questioning. Chapter 4 publishes **all 30 verified answers in Donna's press Q&A bank**—alongside the exact escalation circuit that fires the instant a question steps outside the line.
