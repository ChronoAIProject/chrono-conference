# Appendix B: Trust Boundaries, Feature Flags, and Honest Readiness Matrix

An architecture manual that lists only highlights without limits is a sales brochure. This appendix puts every major component's **trust boundary, public availability, critical guardrails, and candid current limitations** on one auditable sheet (verified November 25–27, 2026).

## Full-Stack Honest Readiness Matrix

| Component | Verified Version / Footprint | Public Status | Primary Trust Boundary | Candid Current Limitations |
| --- | --- | --- | --- | --- |
| **`NyxID`** | `v0.78.0` (`55` services, `41` MCP specs, `7` LLM routes, `9` channels) | **Live Public** (`invite_code_required: false`, `1 credit = 1 USD` + BYOK) | Secrets locked in proxy memory; `0` plaintext keys in context | Rapid weekly cadence (`63` minors in `8` wks); enterprise SLAs hardening alongside pilot cohort |
| **`NyxBot` / `NyxAgent` / SDK** | `8` default / `32` max specialists, `50` memories, `30/hr` & `300/day` triggers | **Live Public & Lobby Active** (`street-corner`, `live.trureturing.org`) | Hard numeric ceilings + secretless browser handshake | Finance `24/28` validated on internal/demo ledger only; **`0` external paying merchants live yet** |
| **`Ornn` & `nyx-skills`** | `v0.18.0` Alpha, `134` ops (`109` paths), `187k` LOC, `286` test files, `163` public skills | **Public Alpha** (`ornn.chrono-ai.fun`; TS `0.4.0` / Py `0.2.0` SDKs) | AgentSeal scans + immutable versions + `NyxID` service scopes | Alpha API surface; third-party publisher review pipelines still expanding |
| **`CMA` & `cmaeg`** | 4-layer cloud stack, ~`2.1 s` hot cred reload, two-phase outbound delivery | **Live Cloud** (`cma.nyxid.ai`) | Isolated sandboxes + live revocation without container restart | **Single primary coding runtime today**; multi-runtime cloud selection remains ahead |
| **`heca`** | `27` agent types (`6` primary + `21` ACP), `361` nightlies | **Active Internal Production** | One worktree per task + unified permission queue + Goal Ledger | **Source code not yet publicly released**; public packaging in progress |
| **`chrono-harness` & `sshx`** | `v0.1.4`, `16` binaries each (Linux/macOS), `272k` LOC Rust, `25` repos; `sshx v1.0.0-beta.58` | **Public Open Source** | Fail-closed `FILEMAP` + transitive `DELTA` + `policy.mixed-warning` | `SPEC.md` explicitly marks **`completeness_proven: false`** |
| **`chrono-metaverse` & `chrono-cd`** | `street-corner` (`1,108` seats, `18` baskets), transactional draft-publish | **Live Launch Lobby** | Atomic seat lock + transactional spatial writes + `NyxID` auth | 3D theater hard-capped at `1,108` seats; overflow cleanly routes to HD livestream |
| **`Living with AI`** | `nyx-homeassistant-node v1.1.1-alpha.52` | **Public Alpha** | Strict read-sensor vs. physical-actuator write separation | Early Alpha; safety-critical home actuators stay behind local human approval |
| **`trureturing` & `Mathesis`** | `167,819` frozen theorems, `2,128` resolutions, `19,022` DAG nodes; Mathesis `212` collected (2026-11-27); archive `212` public repos (`211` with Lean source, `207` DOIs, `1,480` statements) | **Fully Public & Replayable** (independent brand **The Omega Institute**) | Lean 4 kernel + `24` active StrataLint rules + lockfile hash checks | Mathesis peer-review acceptances stand at **`0`**; Riemann Hypothesis remains **`OPEN`** |

## Three Non-Disableable Security Invariants

No matter which merchant or engineering team deploys the stack, three hard flags never flip off:

1. **Zero plaintext secrets in model context**: upstream credentials are injected and scrubbed strictly inside `NyxID` proxy memory;
2. **No silent high-risk writes**: outgoing cash transfers, legal signings, irreversible public announcements, and safety-critical physical actuations require explicit human sign-off;
3. **No bypassed registry or evidence gates**: production merges and published claims carry reproducible verification receipts—never "ship first, verify later."

Ready to see how this engineering vehicle operates internally and across our launch rehearsals as six staffed AI employee roles? Open Volume IV (*Handing the Launch to AI Employees*), or send architecture and pilot inquiries to `contact@chrono-ai.fun`.
