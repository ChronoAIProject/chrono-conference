# Chapter 1: One Team, Six Roles—How a Growing Company Hires AI Employees

Most small businesses testing AI end up starring in the same slapstick comedy: a founder buys one "all-in-one AI assistant," dumps half the company wiki inside, watches it miscalculate a client quote by two decimal places in week one and invent an impossible warranty promise in week two, then marches everyone back to manual spreadsheets by week three concluding *"AI employees aren't ready."*

The flaw was never hiring AI employees—it was hiring them with zero division of labor. Human teams separate cashier, controller, legal, reception, and HR behind explicit approval lines; handing every key in the office to one unguarded chat window invites predictable failure.

## The Live Work Ledger: 77 Automated and 20 Held Behind Gates or Roadmap

Preparing the December 17, 2026 virtual launch gave us a real operational arena to split small-company overhead into six scoped roles wired through `NyxID`, `Ornn`, `NyxBot`, and `CMA`. Here is the exact readiness ledger as of **November 25, 2026** (compiled from `nyxbot-finance` and `nyxid-nyxbot-trials`):

| AI Employee Role | Ready / Demo Workflows | Total Defined | Coverage | Deliberate Human Gate / Candid Boundary |
| --- | ---: | ---: | ---: | --- |
| Concierge **Donna** (+ Blossom) | `13` | `15` | `86.7%` | Off-bank press probes, unverified promises, crisis comms escalate to humans |
| Finance **`NyxBot` Finance** | `24` | `28` | `85.7%` | Outgoing payments & tax filings gated; **demo/internal ledger only, `0` external paying merchants yet** |
| Social **Auto-X** | `11` | `13` | `84.6%` | Major announcements & sensitive replies require human approval |
| **Community Ops** | `9` | `11` | `81.8%` | 75 rehearsal actions executed; brand crises & bans stay human-decided |
| **HR Pack** | `15` | `20` | `75.0%` | Compensation bands, formal offers, and terminations strictly human |
| **Admin** | `5` | `10` | `50.0%` | Legal contracts, corporate seals, and major procurement strictly human |
| **Six-Role Total** | **`77`** | **`97`** | **`79.4%`** | **`20` workflows unautomated: high-risk actions held behind human gates, the rest on the roadmap** |

> **November 26–27 Pre-Launch Ops Audit Note**: In the live pre-launch review inside `nyxid-nyxbot-trials` (`e50c4eb`), the operations team audited **15 live agents and 89 scheduled tasks**, passed **931 automated operational tests** (`374` state-repo, `182` studio, `279` community, `96` retro), locked December 17 seat bookings to official Telegram concierge `@chronoai_frontdesk_bot` (currently hosted under personal scope for low-friction booking), designated the official Discord server for launch announcements and reminders, and broke out two cross-cutting support agents—**Sentiment Monitor** and **Knowledge-Base Maintainer**—as standalone rows on the internal tracking board. Figures and interactive labs throughout this book retain the **November 25 six-role launch baseline (`77 / 97`)** as one fixed comparative ledger.

Set autonomous execution side by side with the human authority line in one diagram, and any business owner grasps in three seconds why this split holds up on Monday morning:

::: {.figure src="ch01-human-ai-boundary"}
**Autonomous AI Execution vs. Human Authority Boundary.** Left (cyan): `77 / 97` covered workflows across six roles (intake, triage, drafting, booking locks, ledger reconciliation, and scheduled posts). Right (magenta): core permissions reserved for human authority (capital release, external legal commitments, unapproved press claims, and irreversible revocations).
:::

## Why Leaving 20 Workflows Unautomated Builds Trust in the Other 77

Real operational mastery shows up in knowing where to draw a hard line. In plain business terms: **locking irreversible actions behind hard human gates—and naming roadmap boundaries honestly—is the exact reason your team can safely hand the other 77 workflows to machines around the clock.**

Under `NyxID`, those brakes live in network policy, never in polite prompt wishes—a finance agent literally holds no token scope capable of wiring cash out of an account. Its sharpest action is laying a reconciled invoice summary, anomaly alert, and staged draft neatly inside a human approval queue for a ten-second sign-off.

Inspect the live `six-roles` card below to audit all six roles' verified coverage and explicit human gates:

::: {.viz src="ai-team-work-ledger" preset="six-roles" height="500"}
**Six-Role Readiness Snapshot (`six-roles`).** Interactive breakdown of all six AI employee roles as of November 25, 2026 (`77 / 97 = 79.4%`), displaying verified workflows alongside explicit human-gated seams.
:::

With the six-role roster clear, Chapter 2 steps onto the busiest floor of the entire launch: front-of-house operations with Concierge **Donna** and Flower Town's **Blossom**.
