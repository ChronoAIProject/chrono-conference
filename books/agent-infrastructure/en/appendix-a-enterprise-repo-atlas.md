# Appendix A: Complete Enterprise Repository Atlas

To ground every claim in the ChronoAI 2026 Virtual Launch edition, we enumerated all six affiliated GitHub organizations via paginated GitHub API audit on **November 27–28, 2026**—keeping commercial infrastructure under **ChronoAI Pte. Ltd.** strictly separate from independent basic research and open papers under **The Omega Institute**—mapping exactly **`539` repositories** to their true brand boundary and architectural home.

## Six Organizations and Brand Ownership (`2026-11-27/28` Audit: `539` Repos)

| GitHub Organization | Exact Repos | Brand Identity & Scope | Representative Flagship Repositories & Lineage Notes |
| --- | ---: | --- | --- |
| `ChronoAIProject` | **`150`** | **ChronoAI** commercial & infrastructure hub | `NyxID`, `nyx-assistant-sdk`, `Ornn`, `nyx-skills`, `cma`, `chrono-metaverse`, `chrono-cd` (private), `consensus-rnd` (`sshx`), `nyx-homeassistant-node`, `nyxid-esp-panel`, `nyxbot-finance`, `nyxid-nyxbot-trials`, `chrono-company-slides`, `chrono-goals`, `Branding`, `chrono-conference` *(note: legacy monorepo `ChronoAIProject/chrono-harness` was archived `2026-11-22`; active development moved to `https://github.com/chrono-harness/`)* |
| `the-omega-institute` | **`59`** | **The Omega Institute** independent research imprint | `trureturing`, `trureturing-tools` (hosting `StrataLint`), `trureturing-live`, `trureturing-books`, `trureturing-books-template`, `trureturing-outreach`, `trureturing-source-theories`, `mathesis`, `riemann-hypothesis`, `riemann-hypothesis-book`, `automath` |
| `mathesis-papers` | **`237`** | **The Omega Institute** open source-backed papers | Live Mathesis API serves `225` collected papers (`224` with Lean links, `225` PDFs, `1,534` registered formal statements, `217` DOIs; `0` formal peer-review acceptances & `0` independent verifier receipts), plus `human-in-the-loop-automated-research` methodology manuscript (`2026-11-27/28`) |
| `chrono-harness` | **`25`** | **ChronoAI** active home for modular Rust judges | All `25` public non-archived repos replacing archived `ChronoAIProject/chrono-harness`: `chrono-harness-main`, `chrono-harness-instructions`, `20` independently versioned Rust component repos (`21` prebuilt binaries/platform), and Copier `v0.1.52` |
| `getheca` | **`7`** | **ChronoAI** local-first orchestrator org | Public release artifacts and site *(note: core `getheca/heca` source repository remains private/internal)* |
| `aevatarAI` | **`61`** | Event-driven distributed actor heritage | `aevatar` (`1.31M` LOC C#, `16,366` test assertions as of `2026-10-12`) |
| **Total (6 Orgs)** | **`539`** | **Strict commercial vs. research separation** | `150 + 59 + 237 + 25 + 7 + 61 = 539` |

> **Dated engineering cadence snapshots (cutoff windows preserved verbatim):** Across `2026-09-20` to `2026-11-19` (`60` days), **`74` active repositories** logged **`141,624` commits** (`90,295` in the final 30 days, maintained by ~15 human engineers plus agents; local repos have accumulated >`13,700` additional commits since `2026-11-19`). Across the `2026-09-08` to `2026-11-07` 69-repo explicit bot/agent split, explicit bot/agent accounts accounted for **`36,819 / 105,363` (`34.9%`, ~`35%` lower bound)**.

## Mapping From Source Repos to the Four Conference Volumes

1. **Volume I (*Build for What Comes Next*)**: Synthesizes `chrono-company-slides` (`data/facts.json`, `BP.md`), `Branding`, `chrono-goals` (`goals/chronoai-launch-event.yaml`), `chrono-metaverse`, and `trureturing` headline telemetry.
2. **Volume II (*The Complete Vehicle*)**: Maps directly onto `NyxID`, `nyx-assistant-sdk`, `Ornn`, `nyx-skills`, `cma`, `getheca`, `https://github.com/chrono-harness/`, `consensus-rnd` (`sshx`), `chrono-metaverse`, `chrono-cd`, `nyx-homeassistant-node`, and `nyxid-esp-panel`.
3. **Volume III (*The Ratchet of Logic*)**: Pins directly to `the-omega-institute/trureturing` at commit [{commit}](trureturing:), spanning `trureturing-tools`, `trureturing-live`, `trureturing-outreach`, `trureturing-books`, `trureturing-source-theories`, `mathesis`, `mathesis-papers`, `riemann-hypothesis`, `riemann-hypothesis-book`, and `automath`.
4. **Volume IV (*Handing the Launch to AI Employees*)**: Draws directly from `nyxid-nyxbot-trials@df5ef47` (`82/99` across `6` core roles, `102/120` across `9` standalone roles, `2026-11-27` 12-stage dress rehearsal `11/12` pass), `nyxbot-finance` (`24/28`), `chrono-hr` (`14/20`), and `chrono-goals/goals/chronoai-first-merchant.yaml`.

Every public repository is open for commit-level checkout and independent verification; private repositories (`getheca/heca`, `chrono-cd`) and pending root licenses (`chrono-harness` org) are called out explicitly in [Appendix B](appendix-b-security-and-readiness.md).
