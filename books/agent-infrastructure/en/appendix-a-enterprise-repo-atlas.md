# Appendix A: Complete Enterprise Repository Atlas

Preparing the ChronoAI 2026 Virtual Launch required traversing all six affiliated GitHub organizations (commercial infrastructure under **ChronoAI**, independent basic research and open papers under **The Omega Institute**)—over **465 repositories**—and mapping each one to its honest brand boundary and architectural layer (snapshot: November 26–27, 2026).

## Six Organizations and Brand Ownership

| GitHub Organization | Repo Count | Brand Identity & Scope | Representative Flagship Repositories |
| --- | ---: | --- | --- |
| `ChronoAIProject` | `150` | **ChronoAI** commercial & infrastructure hub | `NyxID`, `Ornn`, `nyx-skills`, `cma`, `chrono-metaverse`, `chrono-cd`, `chrono-harness`, `consensus-rnd` (`sshx`), `nyx-homeassistant-node`, `nyxbot-finance`, `nyxid-nyxbot-trials`, `chrono-company-slides`, `chrono-goals`, `Branding`, `chrono-conference` |
| `the-omega-institute` | `59` | **The Omega Institute** independent research imprint | `trureturing`, `trureturing-live`, `trureturing-books`, `trureturing-books-template`, `trureturing-outreach`, `trureturing-source-theories`, `mathesis`, `riemann-hypothesis`, `riemann-hypothesis-book`, `automath` |
| `mathesis-papers` | `224` | **The Omega Institute** open source-backed papers | 212 public paper repos (211 carrying Lean source, 207 with DOIs, 1,480 registered statements) |
| `chrono-harness` | `25` | **ChronoAI** modular Rust governance & judges | `chrono-harness-main`, `chrono-harness-instructions`, and modular Rust judge components |
| `getheca` | `7` | **ChronoAI** local-first orchestrator (`heca` source pending) | Distribution and documentation workspaces |
| `aevatarAI` | Active + Archived | Event-driven distributed actor heritage | `aevatar` (`1.31M` LOC C#, `16,366` test assertions as of 2026-10-12) |

## Mapping From Source Repos to the Four Conference Volumes

1. **Volume I (*Build for What Comes Next*)**: Synthesizes `chrono-company-slides` (`data/facts.json`, `BP.md`), `Branding`, `chrono-goals` (`goals/chronoai-launch-event.yaml`), `chrono-metaverse`, and `trureturing` headline telemetry.
2. **Volume II (*The Complete Vehicle*)**: Maps directly onto `NyxID`, `Ornn`, `nyx-skills`, `cma`, `getheca`, `chrono-harness`, `consensus-rnd`, `chrono-metaverse`, `chrono-cd`, and `nyx-homeassistant-node`.
3. **Volume III (*The Ratchet of Logic*)**: Pins directly to `the-omega-institute/trureturing` at commit [{commit}](trureturing:), spanning `trureturing-live`, `trureturing-outreach`, `trureturing-books`, `mathesis`, `mathesis-papers`, `riemann-hypothesis-book`, and `automath`.
4. **Volume IV (*Handing the Launch to AI Employees*)**: Draws directly from `nyxid-nyxbot-trials` (Donna, Blossom, 75 community rehearsal actions, press bank), `nyxbot-finance` (`24/28` demo ledger), `chrono-hr`, and `chrono-goals/goals/chronoai-first-merchant.yaml`.

Every public repository is open for independent checkout and commit-level inspection; components whose source is not yet public (such as `heca`) are marked explicitly in [Appendix B](appendix-b-security-and-readiness.md).
