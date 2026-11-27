# Chapter 6: Hire One for Your Store—Five-Step Merchant and Partner Playbooks

Watching another team hand a global launch to nine scoped AI employees is entertaining, yet every pragmatic founder closes the tab with one blunt question: **"I don't run a math institute or a research lab—I run a storefront, a design shop, an e-commerce brand, or a twenty-person studio. How do I hire my first AI employee without wrecking my books?"**

Delivering our first live external merchant sits at the top of `chrono-goals/goals/chronoai-first-merchant.yaml`, paired with complete candor about today's line: **as of `2026-11-27`, our six core roles (`82 / 99`, rising to `102 / 120` with three watchdogs) and `NyxBot` Finance (`24 / 28`, plus `17` permanently human items) run against real bank balances and a demo bookkeeping ledger—external paying merchants remain `0`.** Joining our first pilot cohort means sitting at the same workbench beside ChronoAI's architecture engineers auditing real logs every week instead of vanishing into a self-serve ticket queue.

## Why Week One Starts With Two Roles—and Why Safe Setup Takes 34 Minutes, Not "15-Minute Magic"

**[ANALOGY]** When you build a car, you test the brakes and speedometer before bolting on six extra cylinders. Automation projects blow up when a business tries to rewire every department on Monday morning. Start instead with the **two-role merchant starter pack**—and add a Monday **Retrospective Analyst** once the first fortnight runs clean:

1. **Front-Desk Concierge (modeled on Donna, `14/15`):** Absorbs repetitive hours, pricing, booking, and verified FAQ traffic—stopping cold and escalating custom quotes, refund disputes, or off-script promises straight to a human.
2. **Back-Office Ledger Clerk (modeled on `NyxBot` Finance, `24/28`):** Connects read-only to daily order streams and receipt categories, catching duplicates, missing receipts, and anomalies in a three-minute nightly owner brief—holding **zero authority to wire cash, move bank funds, or file statutory taxes**.
3. **Kitchen-bench honesty on setup time—`34` real minutes, not "15-minute magic":** When we timed a genuine clean-account installation of `NyxBot` Finance on a second pass, it took **`34 minutes`** across **`10` confirmations and `8` explicit approvals**. Whenever money sits on the table, thirty-four careful minutes of checked permissions beats a glossy "three-minute autopilot" pitch ten times out of ten.

Compress the entire rollout into five verifiable steps:

::: {.figure src="ch06-merchant-onboarding-steps"}
**Five-Step Merchant & Partner Onboarding Path.** Open public `NyxID` signup (`v0.78.0`, `invite_code_required: false`), bind live customer channels (`9` live types / `10` adapters, expanding to `11` types / `12` adapters on `dev 0.79.0`), install a two-role starter pack from `Ornn` (`163` public skills), weld human write gates and daily spend ceilings (`1 credit = 1 USD` or BYOK), and run a 14-day audited pilot.
:::

Switch to the `merchant` card below to filter the full launch roster into the clean two-role starter footprint built for external stores:

::: {.viz src="ai-team-work-ledger" preset="merchant" height="500"}
**Merchant Adoption Mode (`merchant`).** Filters the AI employee work ledger to the recommended two-role starter pack (Front-Desk Concierge + Finance Ledger), showing Day-1 verified workflows alongside non-negotiable human approval lines.
:::

## Five-Step Deployment Checklist (First Live Production Run in Two Weeks)

| Step | Action | Tool / Entry Point | Exit Gate (Do Not Advance Until Green) |
| --- | --- | --- | --- |
| **Step 1** | Open `NyxID` workspace & zero-secret vault | [`https://nyxid.ai/`](https://nyxid.ai/) (open signup) | Connect read-only calendar/ticketing/ledger feeds; confirm `0` plaintext keys in context |
| **Step 2** | Bind live customer channels | `NyxID` `9` live channel types (`11` on `dev 0.79.0`) / `nyx-assistant-sdk v0.2.4` | Round-trip test messages across Telegram, Slack, Lark, or web widget with `0` drops |
| **Step 3** | Install two-role starter skills from `Ornn` | [`ornn.chrono-ai.fun`](https://ornn.chrono-ai.fun/) + [`nyx-skills`](https://github.com/ChronoAIProject/nyx-skills) | Verify AgentSeal scan pass, pin immutable versions, audit `NyxID` scopes (~`34`-min clean install verified) |
| **Step 4** | Weld spend caps & human approval gates | `NyxID` Credits cap + write gates | Set daily credit limit; pass **`10 / 10`** adversarial refund & off-script refusal drills |
| **Step 5** | Run 14-day audited shadow/pilot trial | `CMA v0.12.0` (`Apache-2.0`) audit logs + 3-min daily review | 14 straight days with `0` unauthorized writes and `0` invented claims before adding `#9` Retro or more roles |

## Three Ways to Join (Sole Inbox: `contact@chrono-ai.fun`)

- **First Pilot Merchants:** Send a note under 200 words naming your industry, your two sharpest repetitive workflows, and the red lines no agent may cross.
- **Deployment & Integration Partners (Temporary-Keycard Handoff):** **[ANALOGY]** When an HVAC technician services an apartment, the owner does not hand over the safe combination—they issue a temporary keycard active from 2:00 PM to 5:00 PM. Agencies, ERP consultants, and independent studios contract directly with clients on setup and operations fees without ever touching raw passwords: the client issues a narrow, expiring `NyxID` capability handle (`55` built-in services / `42` OpenAPI-to-MCP specs), revokes it on handoff (~**`2.1 s`** `CMA` hot convergence), and packages repeatable vertical workflows in `Ornn` (TS `0.4.0` / Py `0.2.0` SDKs) for the next client (direct client contracting is open today; platform dispatch and escrow stay on the roadmap).
- **Open-Source Skill Authors:** Contribute tested vertical skills and regression checks directly to `ChronoAIProject/nyx-skills`.

Open the full **`OPS//LEDGER`** workbench below to inspect the live workflow counts, honest downgrades, and human gates, fire simulated off-script press or unauthorized-refund probes, and switch freely between the full team and the two-role merchant starter view.

::: {.viz src="ai-team-work-ledger" height="560"}
**Full Laboratory: `OPS//LEDGER`.** Inspect live AI employee coverage, candid downgrades, and human approval gates, simulate off-script press and unauthorized-refund blocks, and scrub the Dec 4–18 launch countdown or merchant starter mode.
:::

[Appendix A](appendix-a-social-and-press-kit.md) and [Appendix B](appendix-b-acceptance-and-rehearsal.md) close this volume with our ready-to-stage bilingual countdown copy, verified Media Fact Sheet, publication gates, November 27 rehearsal telemetry, and pre-launch stress checklist. Here is to hiring an AI employee that clocks in Monday at 9:00 AM—and always knows exactly where to hit the brake.
