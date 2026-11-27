# Appendix B: Claims Ledger, Evidence Scope, and Disclosure Boundaries

This appendix consolidates every headline metric cited across the four conference volumes—together with its exact repository source, measurement date, scope qualification, and hard public disclosure rules—so journalists, partners, and skeptics can audit every single number directly.

## Master Verified Metrics Ledger

| Domain | Metric | Exact Value | Source Repo / Endpoint | Date |
| --- | --- | --- | --- | --- |
| Engineering Cadence | Enterprise 60d / 30d commits | `141,624` (60d) / `90,295` (30d) across `74` active repos | `chrono-company-slides` (`product-line-commits.csv`) | 2026-11-19 |
| Identity Split | Explicit bot/agent commit share | `35%` (`36,819 / 105,363` across 69-repo window; excludes human-signed local multi-agent commits) | `chrono-company-slides` (`team-structure.csv`) | 2026-11-07 |
| `NyxID` | Version & connectivity surface | `v0.78.0` (`126` tags, `63` minors in `8` wks); `55` built-in services, `41` OpenAPI→MCP specs, `7` LLM providers, `9` channel types (`10` adapters); open signup (`invite_code_required: false`); `1 credit = 1 USD` | `ChronoAIProject/NyxID@v0.78.0` & `api.nyxid.ai` | 2026-11-03 / 11-27 |
| `NyxBot` | Specialist & trigger budgets | `8` default / `32` max specialists, group max `8`, `50` memories, trigger caps `30/hr` and `300/day` | `ChronoAIProject/NyxID@v0.78.0` | 2026-11-03 |
| `Ornn` | Skill lifecycle & catalog | `v0.18.0` Alpha, `134` OpenAPI ops (`109` paths, incl. `58` admin), `187k` LOC, `286` test files; `nyx-skills` `163` public skills (`164` plugin entries) | `ChronoAIProject/Ornn@v0.18.0` & `nyx-skills@d77457c` | 2026-11-19 / 11-27 |
| `CMA` / `heca` | Cloud & local orchestration | `CMA` 4-layer stack, ~`2.1 s` hot cred reload (single primary coding runtime today); `heca` `27` agents (`6` primary + `21` ACP), `361` nightlies (source pending public release) | `chrono-company-slides/decks/bp/BP.md` | 2026-11-27 |
| `chrono-harness` | Governance & `sshx` | `v0.1.4`, `16` prebuilt binaries each for Linux x86_64 & macOS aarch64, `272k` LOC Rust, `25` modular repos (`SPEC.md`: `completeness_proven: false`); `sshx v1.0.0-beta.58` | `ChronoAIProject/chrono-harness` & `consensus-rnd` | 2026-11-13 / 11-25 |
| Physical Edge | `Living with AI` home bridge | `nyx-homeassistant-node v1.1.1-alpha.52` | `ChronoAIProject/nyx-homeassistant-node` | 2026-11-04 |
| `trureturing` | Frozen Lean 4 theorem library | `167,819` theorems, `14,701` frozen modules, `16,278` `.lean` files, `4.78M` LOC (`4,775,059` lines), Lean `4.35.0` | `the-omega-institute/trureturing@05ceb90` | 2026-11-20 |
| `trureturing` | 24/7 continuous commit cadence | `720 / 720` UTC hours (`100.0%`), median `59` commits/hr, `159` merged PRs/day (7-day avg) | `the-omega-institute/trureturing@e55900e` | 2026-11-19 |
| `trureturing` | Literature problem resolutions | `2,126` dated (`2,128` total: `1,400` proved, `728` refuted) in `74` days (~`29`/day); `582` quantum/physics; `124` open >10 yrs (max `47` yrs) | `the-omega-institute/trureturing@05ceb90` | 2026-11-20 |
| `live.trureturing.org` | Live holographic observatory | `19,022` live DAG nodes, `8` departments, `17` public repos | Live DOM snapshot (`https://live.trureturing.org/`) | 2026-11-27 |
| Outreach & Publishing | Scholar replies, Mathesis, OEIS | `838` contacted, `440` replied (`53%`), `273` institutions / `46` countries, `294` positive, `223` collaborative, `64` declined, `1` journal paper (2026-11-08); `18` OEIS entries (2026-11-20); Mathesis `212` collected (`0` peer-review accepted, 2026-11-27); RH book `8,490` shards | `trureturing-outreach` & `mathesis` | 2026-11-08 / 11-20 / 11-27 |
| AI Employee Ops | Six-role baseline & Nov 27 audit | Six-role launch baseline `77 / 97` (`79.4%`, Nov 25): Donna `13/15` (`@chronoai_frontdesk_bot`, `1,108` seats, `18` baskets), Finance `24/28` (demo ledger), Auto-X `11/13`, Community `9/11` (75 rehearsals), HR `15/20`, Admin `5/10`; Nov 26–27 audit reviewed `15` live agents & `89` scheduled tasks (`931` passing tests) and broke out Sentiment Monitor & KB Maintainer on the internal board; `0` external paying merchants yet | `nyxbot-finance` & `nyxid-nyxbot-trials@e50c4eb` | 2026-11-25 / 11-27 |

## Non-Negotiable Public Disclosure Guardrails

1. **Zero funding or budget figures**: No chapter, slide deck, figure, visualization, film, or live concierge response discloses fundraising totals, operating budgets, or figures from which capital scale can be inferred.
2. **Strict brand separation**: Commercial infrastructure belongs to **`ChronoAI`** (`ChronoAI Pte. Ltd.`, Singapore); open formal research belongs to **`The Omega Institute`** (never translated, never co-branded as a joint commercial imprint).
3. **Zero hype or forged badges**: Never claim "SOLVED," "first in the world," or unverified independent peer review; never hand-type fake green kernel badges into prose; explicitly mark every analogy and strategic stance as non-formalized.
4. **No AI model identifiers in prose**: Per publication policy, book text and documentation never cite specific AI model names or vendor model tags.
5. **Sole public contact**: All external communications converge on `contact@chrono-ai.fun` and `https://chrono-ai.fun/`.

## Frozen Lean 4 Declarations Cited in This Volume

The declaration index below is generated automatically at build time from `trureturing.lock.json` (commit [{commit}](trureturing:)), linking every frozen theorem cited in this book directly to its exact Lean source line:

::: {.stats src="declarations" display="link" group="theorems" format="html"}
Inspect the frozen Lean 4 theorem declaration index for this volume
:::
