# Chapter 5: From Booking Open to Replay—Rehearsals, Failure Drills, and the Event-Day Runbook

No disciplined launch survives on slogans shouted ten minutes before airtime or triple espressos poured over a sweating keyboard. **(Position)** Operational calm is never a mood—it is the residue of **running the whole show twenty days early, timing the ugliest failure to the minute, and welding a deterministic bypass into the runbook before doors ever open**.

## The November 27 Full-Flow Dress Rehearsal: 11 of 12 First-Try—and One Real Scar

On the afternoon of November 27, 2026, we pretended it was already launch day and handed the entire arc—from open booking to replay delivery—straight to our AI employee team (`trials#225`/`#226`). The telemetry came back both sharp and unvarnished:

- **`12` launch stages rehearsed end to end; `11 / 12` passed on the first try**, with `0` platform capacity-queue wait (`capacity_wait = 0`) across every scheduled job.
- **The human lead performed only `4` actions all afternoon:** (1) play guest in Telegram and Discord, (2) ask the internal Lark group for the host Q&A sheet, (3) reply **`"发 149"`** in Lark DM to release one X promo post, and (4) confirm replay readiness after sign-off. Every other handoff ran autonomously on clockwork.
- **Measured latencies:**
  - **Concierge Donna (Telegram):** `13` live ops (book, check, cancel, rename, duplicate catch, check-in), **`0` dropped**, median **`29 s`**, max **`63 s`** (`7–29 s` text replies; `37–63 s` sheet writes). Scheduled check-in reminder finished in **`69 s`**, messaging only the `2` booked test accounts and skipping real registrants by rule.
  - **Community Ops (Discord):** `T-1d` and `T-1h` reminders landed **`49 s`** and **`46 s`** past schedule; `4` guest questions answered in **`56–76 s`** (outside reminder overlap) and logged straight into `Questions`; open-booking notice, thanks, and replay links delivered in **`2m43s`–`3m06s`**.
  - **Auto-X Content Studio:** Scheduled at `11:32`; at `12:20` the automated checker **mechanically rejected all 3 round-1 drafts** for missing the product name; writer rewrote and cleared review by `14:21`, passed fact and tone gates (`14:45`/`15:00`), paused for human approval (`15:15`), and shipped at `15:26:15`—`3m23s` after `"发 149"`.
- **The `1` real failure exposed—and its deterministic bypass:** At `14:49:27`, the lead asked the internal Lark group for the host Q&A sheet; the message stalled inside the platform gateway queue for **`65–70 minutes`** without ever dispatching (platform bug **`NyxID#2534`**). Instead of crossing fingers, the team fired a **scheduled one-shot task** at `14:59:35`, delivering the compiled **7-topic host Q&A sheet** cleanly to the internal ops group in **`3.0 minutes`**. Four smaller rough edges (leaked backstage wording patched live same day, a `16.6`-minute no-op check queued for trimming, test metadata in Donna's `/event` sheet queued for pre-Dec-16 cutover, and explicit product tagging for event posts) were logged right beside it.

**(Analogy)** Catching a 65-minute gateway stall during rehearsal is like finding a jammed landing-gear pin on the runway during taxi tests—you do not hide the inspection sheet; you thank your luck it broke on November 27 instead of December 17 at 4:00 PM.

## Fifteen-Day Deterministic Calendar (2026-12-04 to 2026-12-18)

Aligned with `chrono-goals/goals/chronoai-launch-event.yaml`, seven primary milestones from November 27's full-flow rehearsal through December 18 (expanded to eight gates with December 8's media fact sheet in the interactive `countdown` view) lock every AI employee and human gate onto one clock:

::: {.figure src="ch05-event-countdown-milestones"}
**Launch Milestone Calendar (Nov 27 – Dec 18, 2026).** Seven milestones in sequence: Nov 27 Full-Flow Rehearsal (`11/12` passed), Dec 04 Doors Open (`T-13d`), Dec 11 Load & Stream Drill (`T-6d`), Dec 15 Artifact Freeze (`T-2d`), Dec 16 Formal Discord Dress Rehearsal (`T-1d`), **Dec 17 16:00–17:15 SGT** Live Broadcast (`T-0`, highlighted in amber), and Dec 18 Clips & Pilot Follow-up (`T+1d`).
:::

Scrub the `countdown` card inside `OPS//LEDGER` below to walk day-by-day across the launch arc and inspect which AI roles wake up—and which human gates stay armed—at each checkpoint:

::: {.viz src="ai-team-work-ledger" preset="countdown" height="500"}
**Launch Countdown Dispatch (`countdown`).** Steps across **`8` gates from `Nov 27` through `Dec 18`** (including `11-27` rehearsal, `12-08` media sheet, and `12-16` formal Discord dress rehearsal), illuminating active AI roles and mandatory human approval checkpoints at every milestone.
:::

## Four-Phase Execution and Failover Playbook

### Phase 1: Doors Open & Initial Wave (Dec 04 – Dec 10)

- **Dec 04, 10:00 SGT:** Open `street-corner`'s **`1,108` seats** (four stands × 8 tiered rows behind the `sheet-v3` bitmask lock via Telegram `@chronoai_frontdesk_bot`) and **`18` Flower Town mats** (`basket-01..18` via `@flowerassis_bot`); Donna and Blossom enter production guardrails; Community Ops and Auto-X dispatch Wave 1 across Discord, X, and LinkedIn (full copy in [Appendix A](appendix-a-social-and-press-kit.md)).
- **Daily 18:00 SGT:** Community Ops and Auto-X compile seat bookings, flower-mat claims, recurring questions, and escalated tickets; any new factual Q&A entry requires human source sign-off before `#8` KB Maintainer stages it—never ad-hoc prompt edits.

### Phase 2: Stress Drill, Artifact Freeze & Formal Discord Rehearsal (Dec 11 – Dec 16)

- **Dec 11 (Load & Stream Drill):** Hammer `street-corner`'s `sheet-v3` lock with `1,250` simulated concurrent arrivals—verifying exact `1,108` locked seats (`0` collisions) and clean overflow to the HD stream from Guest `#1,109` onward; fire `20` adversarial redline probes at Donna (funding traps, model-name traps, RH attribution traps), demanding **100% refusal and tracked tickets**; rehearse single-stream RTMP failover.
- **Dec 15 (`T-2d` Artifact Freeze):** Lock scripts, four Slidev PDFs, four bilingual books (HTML/PDF/EPUB), and Release assets read-only except emergency security patches.
- **Dec 16 (`T-1d` Formal Discord Dress Rehearsal):** Run the entire launch flow on the **official Discord server** using **production data** (swapping out November 27's test event copy, loading Chapter 4's canonical 30-Q spec into Donna's production sheet, testing the live 3D check-in avatar spawn, and firing the scheduled one-shot host Q&A task that bypasses `NyxID#2534`). Only after all checks pass do December 17's production schedules go live.

### Phase 3: Broadcast Day Telemetry & Replay Release (Dec 17, SGT)

- **T-60 min (15:00):** Verify dual RTMP ingest heartbeats (YouTube `@ChronoAIOfficial` + LinkedIn Live), local offline backup reels, live Pages links, and `chrono-metaverse`'s four-stage extended broadcast pipeline (office `rb.cabinet-01` → Virtual Stadium Xingchao (Star Tide), `1,108` seats → Marina Bay Sands `252.8m × 142.2m` sky-screen → Earth orbital `5,307km × 2,985km` planetary screen), running the concrete **`chrono-metaverse#315`** asset check across all three authored broadcast stops—**`1,132` scene anchors**, **`15` airborne craft over Marina Bay**, and **`2` WGS84 orbital models**—so the four-stage camera pullback runs cleanly on show day.
- **T-15 min (15:45):** Switch to pre-show lobby camera and countdown; Donna flips to live check-in mode while on-call engineers watch four vitals (dual stream bitrate, booking-lock latency, escalation queue depth, and rate-limit alerts).
- **T-0 to T+75 min (16:00–17:15):** Execute Volume I (*Build for What Comes Next*), Appendix A minute-by-minute; the scheduled one-shot task delivers the host Q&A sheet on clockwork; during the `62:00–73:00` live Q&A block, human engineers triage off-bank tickets live for 24-hour written follow-up.
- **~1 Hour Post-Stream (Dec 17, ~18:15 SGT):** Once a human verifies the replay link and flips status to ready, Community Ops dispatches the 75-minute HD replay and four-book download links automatically.

### Phase 4: Clips, Ticket Clearance & 48-Hour Post-Mortem (Dec 18 Onward)

- **T+24h (Dec 18):** Auto-X rolls out five short film clips and verified theorem cards; the `contact@chrono-ai.fun` team clears all open press tickets and opens pilot screening with our first merchant cohort; within **48 hours**, `#9` **Retrospective Analyst** delivers the formal launch post-mortem (`#188`), auditing latency, drop rates, and per-agent cost without flattery.

From November 27's scar-revealing rehearsal to December 18's post-mortem, all nine standalone roles (`82/99` across six core roles, `102/120` total, with `0` external paying merchants live yet) take their exam in public view. Chapter 6 hands the workbench straight to you: **five grounded steps to hire your first AI employee for your own store or studio.**
