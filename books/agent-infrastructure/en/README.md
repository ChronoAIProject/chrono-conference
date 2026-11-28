# Preface

> "What I cannot create, I do not understand." Richard Feynman left that line on his final blackboard, and it cuts straight through agent infrastructure too: any stack that hides its trust boundaries, raw counts, and unfinished seams behind painted-green slides is showroom clay, not a machine.

Welcome to Volume II of the ChronoAI 2026 Virtual Launch edition: ***The Complete Vehicle: ChronoAI Full-Stack Product & Security Architecture*** (code `CHRONO//STACK`).

Volume I put the core thesis on center stage: **(Analogy)** when execution tumbles toward zero marginal cost and frontier reasoning "engines" become metered commodities, a bare engine screaming on wet concrete without brakes, flywheel, or roll cage only tears itself apart; durable value belongs to the **complete vehicle** that swaps engines beneath the hood without stopping traffic. **(Position)** This volume kills the stage spotlights, puts the car on hydraulic lifts, and taps every glossy claim with a tuning-fork hammer—engineer to engineer, documenting live versions, hard boundaries, measured latencies, private repos, pending licenses, and honest gaps without flattery (all core figures audited through **November 27–28, 2026**).

Before turning the first bolt, spend fifty-eight seconds (0:58) on the single security invariant holding the entire stack together: **never hand a plaintext secret into an agent's context window.**

::: {.film src="never-hand-a-key"}
**Never Hand a Plaintext Key (Architecture Film).** Fifty-eight seconds (0:58) tracing the Room 412 hotel-keycard capability handle (analogy), `NyxID`'s zero-secret proxy vault and instant revocation path, and the live `v0.78.0` (`55` built-in services, `42` OpenAPI-to-MCP specs, `7` LLM gateways, `9` live channels) versus `dev 0.79.0` (`11` channels) production catalog.
:::

## Five-Layer Mechanical Teardown

Across seven chapters and two auditable reference appendices, this volume dissects every layer from zero-secret identity out to physical-home sensors and hardware:

1. **Chapter 1 — `NyxID` (Live `v0.78.0` / `dev` `0.79.0`)**: Zero-secret proxy vault, **55 built-in services**, **42 OpenAPI-to-MCP specs**, **7 LLM gateway routes**, **9 live messaging channel types (10 adapters)** plus **5 call/voice profiles** (`dev` expanding to **11 messaging types / 12 adapters** with Meta Messenger & Instagram), and `1 credit = 1 USD` + BYOK spend breakers.
2. **Chapter 2 — `NyxBot`, `NyxAgent` & `nyx-assistant-sdk`**: Specialist mesh (`8` default / `32` max), group cap `8`, `50` bounded memory slots (`500` chars each), up to `16` pinned Ornn skills, **`30/hr` & `300/day` default trigger caps** (configurable hard ceilings **`300/hr` & `3,000/day`**), and shipped **`nyx-assistant-sdk v0.2.4`** (powering live Voice Guide Alexandra on `live.trureturing.org`).
3. **Chapter 3 — `Ornn` (`v0.18.0` Alpha) & `nyx-skills`**: `134` OpenAPI operations across `109` paths (`58` admin, `3` health probes), `187k` LOC, `286` test files, TS `0.4.0` / Python `0.2.0` SDKs, and `163` public skills (`164` plugins, `1` skillset) in `nyx-skills@25ef75934d`.
4. **Chapter 4 — `CMA` (`v0.12.0`, `Apache-2.0`) & `cmaeg`**: Consolidated into two core application services (`cma-agent-manager`, `cma-event-gateway`) plus the Kubernetes `agent-sandbox` controller, covering `6` IM platforms plus `github`/`custom`, with ~`2.1 s` hot credential reload—candidly documenting **single primary coding agent runtime status today**.
5. **Chapter 5 — `heca`**: Local-first multi-provider spatial orchestrator (`6` primary providers + `21` ACP = `27` agent integrations, **`360` nightlies**, latest `0.1.0-nightly-20261121-1`, `6` platforms, `4` usable runtimes with Apple `container` still blocked)—candidly marking **`getheca/heca` source private/internal**.
6. **Chapter 6 — `chrono-harness` & `sshx`**: Active home migrated to **`https://github.com/chrono-harness/`** (`25` public repos, `20` independently versioned component repos shipping **`21` prebuilt binaries per platform**, Copier **`v0.1.52`**, **`29` atomic rules**, ~`276k` est. LOC of Rust; legacy monorepo `ChronoAIProject/chrono-harness` archived `2026-11-22`), paired with `sshx v1.0.0-beta.58` (MIT)—proudly exposing **`completeness_proven: false`** hardcoded right inside the live Rust crates.
7. **Chapter 7 — Beyond the Screen**: Programmable 3D `chrono-metaverse` (featuring the 4-stage extended broadcast pipeline from Office to the `1,108`-seat Virtual Stadium to Marina Bay Sands' `252.8 m` sky-screen to Earth orbit's `5,307 km` planetary screen), private GitOps plane `chrono-cd`, and `Living with AI` (`nyx-homeassistant-node v1.1.1-alpha.52`, `video-event-monitor 0.5.0-alpha.2`, plus public `nyxid-esp-panel v1.0.0`).
8. **Appendices A & B**: Six-organization repository atlas mapping **`539` repositories across 6 affiliated GitHub organizations** (explicitly separating ChronoAI's `243` commercial/engineering repos from independent research brand **The Omega Institute**'s `296` research repos), and a **Trust Boundary, License & Honest Readiness Matrix** stripped of cosmetic green paint.

For technical walkthroughs with engineering leads or partners, open the companion sixteen-slide bilingual architecture deck below.

::: {.slides src="product-architecture"}
**The Complete Vehicle: Full-Stack Product & Security Architecture Deck (16 slides, zh/en page-aligned).** Structured around six concrete agent failure modes and their mechanical cures, complete with six computed architecture diagrams and our honest readiness matrix.
:::

Grab a flashlight and step beneath the first load-bearing layer: **`NyxID`—because if you cannot guard the keys, every tower built on top is made of paper.**
