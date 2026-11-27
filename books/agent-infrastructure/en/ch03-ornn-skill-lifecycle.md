# Chapter 3: Ornn—The Agent-Facing Skill-Lifecycle API

Across many companies experimenting with AI agents today, you still find a stone-age habit: "skills" live as Markdown snippets copy-pasted seven times across chat threads—no version tag, no security scan, no declared service scope, and no way to tell who broke one line, when it went live, or which active AI employees it poisoned.

**(Analogy)** Running production agents off loose chat snippets is like operating a chemical plant from handwritten sticky notes taped onto unmarked valves—no batch number, no purity assay, no Material Safety Data Sheet, and no idea what mixed until smoke pours from the manifold. Software engineering escaped that chaos over decades through package registries, artifact signing, and semantic versioning. Agent ecosystems keep forgetting the exact same law: **any instruction capable of triggering real API writes, cash flows, or customer notices is executable software, not prose—and it must obey a real software lifecycle.**

**(Stance)** Tap the idol of glossy "prompt marketplaces" with a hammer and they ring hollow: pretty thumbnails and star ratings prove zero operational safety. Machine-grade infrastructure is measured in security scans, immutable versions, explicit scope manifests, and automated test suites. That conviction is the sole reason **`Ornn`** (`v0.18.0` Alpha, live at `https://ornn.chrono-ai.fun`) and the public catalog **`nyx-skills`** exist.

## Five-Stage Skill Lifecycle: From OpenAPI Synthesis to AgentSeal Assays

`Ornn` was built from day one as an **agent-facing skill-lifecycle API**. Every operational skill passes through five non-optional industrial gates before an agent can pull it:

::: {.figure src="ch03-ornn-skill-lifecycle"}
**`Ornn` (`v0.18.0`) Five-Stage Skill Lifecycle.** Every skill flows from authoring or OpenAPI synthesis through AgentSeal security scanning, immutable version freezing addressed via dist-tags, explicit `NyxID` service binding, and audited agent pulls—backed by `134` OpenAPI operations (`109` paths), `286` test files, and `163` public skills in `nyx-skills@25ef75934d`.
:::

Trace how those five gates turn loose prompts into sealed, auditable cartridges:

1. **Author or Synthesize**: Builders write structured `SKILL.md` packages by hand or synthesize starter skills straight from OpenAPI specs and source repositories, validated against strict format schemas (`validateformat`, `getformatschema`).
2. **AgentSeal Security Scanning**: Before distribution, every release clears static and policy auditing (`rescanskillversionagentseal`, `triggerskillaudit`) flagging unsafe commands, leaked literals, and anomalous outbound hooks, permanently binding the audit record to that exact version.
3. **Immutable Versioning & Dist-Tags**: Exact semantic versions, cross-version diffs (`diffskillversions`), explicit deprecation controls (`setskillversiondeprecation`), and dist-tags kill silent live-prompt drift.
4. **`NyxID` Service Binding**: A skill package carries zero plaintext keys; it declares strictly which scoped `NyxID` services it requires (`setskillnyxidservice`), making permission review legible before installation.
5. **Closure Pulls & Telemetry**: Using official TypeScript (`v0.4.0`) and Python (`v0.2.0`) SDKs, cloud `CMA`, local `heca`, and `NyxBot` fetch exact transitive skill closures (`getskillclosure`) while emitting full pull and usage telemetry.

## Verified Engineering Footprint: 187k LOC and 286 Test Files

There is one blunt bench test for separating a real forge from a launch-week mockup: ignore the feature bullets and count the typed surface and test suite. Measured directly from `ChronoAIProject/Ornn` and `ChronoAIProject/nyx-skills` through **November 27, 2026**:

| Dimension | Verified Reading | Source Repo & Audit Date |
| --- | --- | --- |
| Live Version & Tags | `v0.18.0` Alpha (`28` release tags, baseline 2026-09-17) | `ChronoAIProject/Ornn@v0.18.0` & `ornn.chrono-ai.fun/version.json` (2026-11-27) |
| OpenAPI Surface | **134 OpenAPI operations** across `109` paths (including `58` `/api/v1/admin/` ops and `3` health probes) | `ChronoAIProject/Ornn@v0.18.0` `specBuilder.ts` (2026-11-27) |
| Codebase Size | **187k LOC** (`186,526` lines TS/TSX/JS/Python) | `ChronoAIProject/Ornn@88f2d78` (2026-11-19) |
| Automated Test Suite | **286 test files** (`*.test.*`, `*.spec.*`, `test_*.py`) | `ChronoAIProject/Ornn@88f2d78` (2026-11-19) |
| Official SDKs | TypeScript `v0.4.0` · Python `v0.2.0` | `sdk/typescript/package.json` & `sdk/python/pyproject.toml` |
| Public Skills Catalog | **163 public skills** (`SKILL.md`), **164 plugin entries**, **1 skillset** (AgentSeal-scanned) | `ChronoAIProject/nyx-skills@25ef75934d` (2026-11-27) |

The boundary stays just as candid: `Ornn` remains explicitly labeled **`v0.18.0` Alpha**, with external third-party publisher review pipelines still expanding rather than pretending to be a frozen `v1.0` registry.

Secrets are locked inside `NyxID`; workflows are version-frozen inside `Ornn`. Layer 3 now answers the unavoidable operational question: **where do these zero-secret, skill-equipped agents actually execute around the clock—both in zero-ops cloud sandboxes and across high-concurrency local workspaces?** Chapters 4 and 5 open our twin runtimes: `CMA` and `heca`.
