# Chapter 6: Hire One for Your Store—Five-Step Merchant and Partner Playbooks

Watching another team hand a launch to scoped AI agents is fun, yet every practical founder leaves with one grounded question: **"I don't run a math institute or a mega-lab—I run a retail store, an e-commerce brand, a design studio, or a twenty-person shop. How do I hire my first AI employee without breaking my business?"**

Landing our first live external merchant sits at the top of `chrono-goals/goals/chronoai-first-merchant.yaml`, paired with complete candor about today's baseline: **as of November 25, 2026, our finance (`24/28`) and operations packs (`77/97`) are verified on internal and demo ledgers, with zero external paying merchants live yet.** Joining our first pilot cohort means working directly alongside ChronoAI's architecture engineers with weekly work-ledger reviews rather than wrestling a cold self-serve ticket queue.

## Why Week One Starts With Two Roles—Never Six

Automation projects usually implode when a company tries to rewire every department on Monday morning. Start instead with the **two-role merchant starter pack**:

1. **Front-Desk Concierge (modeled on Donna)**: Absorbs high-frequency repetitive hours, pricing, booking, FAQ, and lead-intake traffic—escalating custom quotes, refund disputes, and off-script questions straight to a human.
2. **Back-Office Ledger Clerk (modeled on `NyxBot` Finance)**: Connects read-only to daily order streams and expense categories, flagging duplicates, anomalies, and missing receipts in a three-minute nightly owner digest—holding zero authority to move money.

Compress the entire onboarding path into five verifiable steps:

::: {.figure src="ch06-merchant-onboarding-steps"}
**Five-Step Merchant & Partner Onboarding Path.** Open public `NyxID` signup (`invite_code_required: false`), connect live customer channels (`9` channel types, `10` adapters), pick a two-role starter pack from `Ornn` (`163` public skills), lock human write gates and daily spend ceilings (`1 credit = 1 USD` or BYOK), and run a 14-day audited trial.
:::

Switch to the `merchant` card below to filter the six-role launch board into the clean two-role starter footprint recommended for external stores:

::: {.viz src="ai-team-work-ledger" preset="merchant" height="500"}
**Merchant Adoption Mode (`merchant`).** Filters the full six-role work ledger to the recommended two-role starter pack (Front-Desk Concierge + Finance Ledger), highlighting Day-1 coverage alongside non-negotiable human sign-off lines.
:::

## Five-Step Deployment Checklist (First Live Loop in Two Weeks)

| Step | Action | Tool / Entry Point | Exit Gate (Do Not Advance Until Green) |
| --- | --- | --- | --- |
| **Step 1** | Open `NyxID` workspace & zero-secret vault | `https://api.nyxid.ai` (open signup) | Connect read-only calendar/ticketing/ledger sources; confirm `0` plaintext keys in context |
| **Step 2** | Bind live customer channels | `NyxID` 9 channel types / `nyx-assistant-sdk` | Round-trip test messages across Slack, Telegram, Lark, or web widget with zero drops |
| **Step 3** | Install two-role starter skills from `Ornn` | `ornn.chrono-ai.fun` + `nyx-skills` | Verify AgentSeal scan pass, pin immutable versions, audit `NyxID` service scopes |
| **Step 4** | Weld spend caps & human approval gates | `NyxID` Credits cap + write gates | Set daily credit limit; pass 10/10 adversarial refund & off-script refusal drills |
| **Step 5** | Run 14-day audited shadow/pilot trial | `CMA` audit logs + 3-min daily owner review | 14 straight days with zero unauthorized writes and zero invented claims before adding roles |

## Three Ways to Join (All via `contact@chrono-ai.fun`)

- **First Pilot Merchants**: Send a note under 200 words describing your industry, your two sharpest repetitive workflows, and the red lines you will never delegate.
- **Deployment & Integration Partners (Temporary-Badge Handoff Loop)**: Agencies, ERP consultants, and independent studios contract directly with clients on setup and operations fees without ever asking for raw passwords—entering via a narrow, expiring `NyxID` capability handle (`55` services / `41` MCP specs), revoking it on handoff (~`2.1 s` `CMA` hot convergence), and packaging repeatable vertical workflows in `Ornn` (TS `0.4.0` / Py `0.2.0` SDKs) for the next client (direct client contracting is open today; platform dispatch and escrow sit on the roadmap).
- **Open-Source Skill Authors**: Contribute battle-tested industry skills and verification checks directly to `ChronoAIProject/nyx-skills`.

Open the full **`OPS//LEDGER`** interactive workbench below to inspect all 97 workflows (`77` live + `20` behind human gates or roadmap), fire simulated off-script press and unauthorized-refund probes, and switch freely between the full six-role launch team and the two-role merchant starter view.

::: {.viz src="ai-team-work-ledger" height="560"}
**Full Laboratory: `OPS//LEDGER`.** Inspect all six AI employee roles (`77 / 97` live), simulate off-script press and unauthorized refund gates, and scrub the Dec 4–18 launch countdown or merchant starter mode.
:::

[Appendix A](appendix-a-social-and-press-kit.md) and [Appendix B](appendix-b-acceptance-and-rehearsal.md) conclude this volume with our ready-to-dispatch thirteen-day bilingual social/press kit and our load-test, acceptance, and dress-rehearsal matrix. Here is to hiring an AI employee that clocks in Monday at 9:00 AM—and always knows exactly where to stop.
