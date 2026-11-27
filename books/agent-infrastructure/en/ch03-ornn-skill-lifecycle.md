# Chapter 3: Ornn—The Agent-Facing Skill-Lifecycle API

Across many companies experimenting with AI agents today, teams still store "skills" as Markdown fragments copy-pasted seven times across Slack threads: no version number, no security scan, no declared service scope, and no way to tell who broke what or which employee was affected when one line drifted.

Software engineering ended that stone-age chaos over decades through package registries, artifact signing, and modern semantic versioning. Agent tooling keeps forgetting the same iron rule: **any workflow instruction capable of triggering real API writes is executable software, and deserves a real software lifecycle.**

That single conviction is why **`Ornn`** (`v0.18.0` Alpha, live at `https://ornn.chrono-ai.fun`) and the public catalog **`nyx-skills`** exist.

## Five-Stage Skill Lifecycle: From OpenAPI Generation to AgentSeal Audits

`Ornn` is not a cosmetic "prompt marketplace." It is an **agent-facing skill-lifecycle API** forcing every operational skill through five disciplined stages:

::: {.figure src="ch03-ornn-skill-lifecycle"}
**`Ornn` (`v0.18.0`) Five-Stage Skill Lifecycle.** Every skill flows from authoring or OpenAPI synthesis through AgentSeal security scanning, immutable version freezing addressed via dist-tags, explicit `NyxID` service binding, and audited agent pulls—backed by `134` OpenAPI operations (109 paths), `286` test files, and `163` public skills in `nyx-skills`.
:::

Trace each stage from source to production execution:

1. **Author or Synthesize**: Builders author structured `SKILL.md` packages directly or synthesize starter skills straight from OpenAPI specs and source repositories, validated against strict format schemas (`validateformat`, `getformatschema`).
2. **AgentSeal Security Scanning**: Before distribution, every release runs through security auditing (`rescanskillversionagentseal`, `triggerskillaudit`) flagging unsafe commands, leaked literals, and anomalous outbound hooks, preserving a permanent version-linked audit trail.
3. **Immutable Versioning & Dist-Tags**: Full version history, cross-version diffs (`diffskillversions`), explicit deprecation controls (`setskillversiondeprecation`), and dist-tags eliminate silent live-prompt drift.
4. **`NyxID` Service Binding**: A skill never carries plaintext keys; it declares only which scoped `NyxID` services it requires (`setskillnyxidservice`), making permission review transparent before install.
5. **Closure Pulls & Telemetry**: Via official TypeScript (`v0.4.0`) and Python (`v0.2.0`) SDKs, cloud `CMA`, local `heca`, and `NyxBot` pull exact transitive skill closures (`getskillclosure`) with clean usage telemetry.

## Verified Engineering Footprint: 187k LOC and 286 Test Files

Measured directly from `ChronoAIProject/Ornn` and `ChronoAIProject/nyx-skills` (November 19–27, 2026):

| Dimension | Verified Reading | Source Repo & Date |
| --- | --- | --- |
| Live Version & Tags | `v0.18.0` Alpha (`28` release tags, baseline 2026-09-17) | `ChronoAIProject/Ornn@v0.18.0` & `ornn.chrono-ai.fun/version.json` (live check 2026-11-27) |
| API Surface | **134 OpenAPI operations** across 109 paths (including 58 `/api/v1/admin/` operations and 3 health endpoints) | `ChronoAIProject/Ornn@v0.18.0` `specBuilder.ts` (verified 2026-11-27) |
| Codebase Size | **187k LOC** (`186,526` lines TS/TSX/JS/Python) | `ChronoAIProject/Ornn@88f2d78` (2026-11-19) |
| Automated Test Suite | **286 test files** (`*.test.*`, `*.spec.*`, `test_*.py`) | `ChronoAIProject/Ornn@88f2d78` (2026-11-19) |
| Official SDKs | TypeScript `v0.4.0` · Python `v0.2.0` | `sdk/typescript/package.json` & `sdk/python/pyproject.toml` |
| Public Skills Catalog | **163 public skills** (`SKILL.md`), **164 plugin entries**, **1 skillset** | `ChronoAIProject/nyx-skills@d77457c` (2026-11-27) |

There is a blunt sanity test for engineering maturity: ignore the pitch list and count how much test machinery surrounds the code. 286 test files and 163 inspectable public skills show `Ornn` was built as machine-grade infrastructure, not a one-week demo.

With secrets locked inside `NyxID` and workflows versioned inside `Ornn`, Layer 3 answers the next hard question: **where do these agents actually execute 24/7—in zero-ops cloud sandboxes, and in high-concurrency local workspaces?** Chapters 4 and 5 dissect our twin runtimes: `CMA` and `heca`.
