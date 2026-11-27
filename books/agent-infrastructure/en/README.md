# Preface

> "What I cannot create, I do not understand." Richard Feynman left that sentence on his final blackboard, and it governs agent infrastructure just as ruthlessly: any architecture that hides its trust boundaries, raw counts, and unfinished edges behind glossy slides has not truly been built.

Welcome to Volume II of the ChronoAI 2026 Virtual Launch edition: ***The Complete Vehicle: ChronoAI Full-Stack Product & Security Architecture*** (code `CHRONO//STACK`).

Volume I stated the thesis from center stage: when execution plunges toward zero marginal cost and frontier reasoning engines become metered commodities, durable value shifts to the **complete vehicle** that keeps running while engines swap beneath the hood. This volume turns off the stage spotlights, puts the car on hydraulic lifts, and walks underneath with a wrench—engineer to engineer, documenting real boundaries, real protocols, real numbers, and the unfinished seams we refuse to hide.

Before turning the first bolt, spend fifty-one seconds on the single security invariant holding the entire stack together: **never hand a plaintext secret into an agent's context window.**

::: {.film src="never-hand-a-key"}
**Never Hand a Plaintext Key (Architecture Film).** Fifty-one seconds contrasting legacy `.env` key blast radius against `NyxID`'s encrypted proxy vault, human write-approval gates, and ~2-second hot revocation (`CMA` ~`2.1 s` hot reload).
:::

## Five-Layer Mechanical Teardown

Across seven chapters and two reference appendices, this volume dissects every layer from zero-secret identity out to physical-home hardware:

1. **Chapter 1 — `NyxID` (`v0.78.0`)**: Zero-secret proxy boundaries, 55 built-in services, 41 OpenAPI-to-MCP specs, 7 LLM gateways, 9 messaging channel types, and `1 credit = 1 USD` billing.
2. **Chapter 2 — `NyxBot`, `NyxAgent` & Browser Assistant SDK**: Specialist mesh (`8` default / `32` max), 50 bounded memory slots, and `30/hr` & `300/day` anti-runaway trigger ceilings.
3. **Chapter 3 — `Ornn` (`v0.18.0`) & `nyx-skills`**: 134 OpenAPI operations across 109 paths, 187k LOC, 286 test files, and 163 public skills governed like real software.
4. **Chapter 4 — `CMA` & `cmaeg`**: Four-layer cloud managed agents, event gateway, and ~`2.1 s` hot credential reload—candidly documenting single-runtime status today.
5. **Chapter 5 — `heca`**: Local-first spatial orchestrator (`6` primary providers + `21` ACP = `27` agent types, `361` nightlies—candidly noting public source is pending).
6. **Chapter 6 — `chrono-harness` (`v0.1.4`) & `sshx` (`v1.0.0-beta.58`)**: 272k LOC of Rust across 25 modular repos and 16 binaries replacing wishful prompts with declarative `FILEMAP` and `DELTA` judges.
7. **Chapter 7 — Beyond the Screen**: 3D `chrono-metaverse`, GitOps `chrono-cd`, and `Living with AI` (`nyx-homeassistant-node v1.1.1-alpha.52`).
8. **Appendices A & B**: Complete enterprise repository atlas and our candid **Trust Boundary & Readiness Matrix**.

For technical walkthroughs with engineering leads or partners, open the companion sixteen-slide bilingual architecture deck below.

::: {.slides src="product-architecture"}
**The Complete Vehicle: Full-Stack Product & Security Architecture Deck (16 slides, zh/en page-aligned).** Structured around six concrete agent failure modes and their mechanical cures, complete with six computed architecture diagrams and our honest readiness matrix.
:::

Grab a flashlight and step beneath the first load-bearing layer: **`NyxID`—because if you cannot guard the keys, every tower built on top is made of paper.**
