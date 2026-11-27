# Chapter 4: CMA—Cloud-Hosted Managed Agents and Event Gateway

Ask a systems engineer to open five terminal tabs, juggle isolated Git worktrees, and wire local proxies on a laptop, and they feel right at home. Ask a florist, a finance controller, or a community manager to do the same, and the laptop snaps shut five minutes later.

**`CMA` (`ChronoAI Managed Agent`, live at `cma.nyxid.ai`, repo `ChronoAIProject/cma`)** and its event gateway **`cmaeg`** exist to ship managed cloud agents as a plugged-in appliance rather than a twenty-page ops kit. Official releases resumed with **`v0.12.0`** on **November 24, 2026** (`main 8f5ba69408`), accompanied the same day by an explicit **`Apache-2.0` `LICENSE`** (PR `#3647`); meanwhile, `develop` tore through **`723` merged PRs in 14 days** to hit **`3fa2aaf1fb` (PR `#4243`)** on **November 27**, riding release Trains `02→17` while enforcing distributed contracts `TC-040`, `TC-045`, and `TC-070` against live clusters.

## Two Consolidated Core Services + K8s Sandbox Controller, Four Security Layers

Every extra daemon you spawn in production is one more 3 a.m. pager alert waiting to misfire. Rather than shattering the cloud plane into a dozen chatty microservices, `CMA` strips it down to **two application services (`cma-agent-manager`, `cma-event-gateway`) plus one Kubernetes `agent-sandbox` controller**—three moving parts supporting four crisp security layers from the sandbox floor up:

::: {.figure src="ch04-cma-four-layers"}
**`CMA` (`v0.12.0`, `Apache-2.0`, `cma.nyxid.ai`) Four-Layer Cloud Architecture.** Grounded in the Kubernetes `agent-sandbox` controller and `chrono-sandbox` isolated containers, then consolidated into `cma-event-gateway` (`cmaeg`, spanning 6 IM platforms + `github`/`custom`) and `cma-agent-manager` (managed runtime, ~`2.1 s` hot credential reload, and operator audit surface)—with every outbound call mediated by `NyxID`.
:::

Trace how each logical layer maps onto running infrastructure:

1. **Layer 1 — Isolated Sandboxes & Artifact Store (K8s `agent-sandbox` controller + `chrono-sandbox`)**: Every managed agent runs inside an isolated sandbox with pause/revive lifecycle control, scoped file trees, document revision histories, and read-only share links, eliminating cross-tenant state bleed.
2. **Layer 2 — Multi-Channel Event Gateway `cmaeg` (`cma-event-gateway`)**: Normalizes asynchronous inbound traffic across **6 IM platforms (`telegram`, `lark`, `feishu`, `discord`, `slack`, `whatsapp`) plus `github` and `custom`** into partitioned threads with signature verification, deduplication, and two-phase outbound delivery (`prepareoutboundmessage` / `commitoutboundmessage`), preventing duplicate replies and silent drops.
3. **Layer 3 — Managed Runtime & ~`2.1 s` Hot Credential Reload (`cma-agent-manager`)**: **(Analogy)** Conventional cloud runners bake secrets into container environment variables at boot—meaning revoking one tool permission is like dynamiting the whole electrical substation just to trip one circuit breaker, killing active long-running tasks mid-sentence. `CMA` decouples the credential plane from container lifetime: updating or revoking bindings in `NyxID` converges live in roughly **`2.1 s`** (`2.152 s` idle / `1.804 s` busy in the cached verification benchmark) with zero container reboot—instant grants on, instant kill-switch off.
4. **Layer 4 — Operator Surface & Audit Trail (`cma-agent-manager`)**: Live event streams, transcripts, file trees, permission queues, and usage reports let operators inspect every file write and external post without SSH-ing into logs.

Inspect the `hot-reload` experiment card below to trace `CMA` converging to updated `NyxID` bindings inside the ~2.1-second window without restarting the sandbox:

::: {.viz src="nyxid-credential-flow" preset="hot-reload" height="500"}
**2.1-Second Hot Credential Reload (`hot-reload`).** Demonstrates `CMA` converging live to updated `NyxID` grants and revocations in ~`2.1 s` with zero sandbox reboot and zero exposed plaintext secrets.
:::

## 723 PRs in 14 Days: Production Rescues and Distributed Fencing

Two weeks and `723` merged PRs on live clusters did not come from polishing architecture slides; they came from four real bench failures disassembled and fenced for good. The first rescue pulled **9 live sandboxes out of a mid-upgrade wedge** (`#3234`, `#3259`, `#3318`, `#4098`): during `image_rotation`, a `terminal_validation` error at `conversation_reopen` trapped sessions behind an endless loading spinner that neither failed cleanly nor moved forward. Rather than papering over the wedge with blind retries, the fix replaced the stuck transition with an explicit **parked-runtime state** and a clean **owner-triggered recovery** lever—leaving a clear invariant that failed image swaps park visibly in the breakdown lane instead of spinning forever in limbo.

The second fight lived inside millisecond races between active cutovers and warm-pool cleanup: flip a live agent's runtime pointer onto a fresh sandbox while a spare reaper sweeps idle containers, and one slipped beat either routes traffic into a dying pod or amputates a freshly claimed spare. `#4100` welded pointer cutover into a single **deployment-scoped lane fence transaction**, while `#3959` and `#4229` converted pool reclamation into **UID/`resourceVersion`-conditional foreground draining** restricted strictly to unclaimed spares. The mechanical lock holds both ways: pointer swaps commit atomically under one fence, and no reaper can yank a claimed sandbox out from under an active conversation.

The third hunt struck right before cutting the supervised Debian Desktop fixture image, when the credential scanner tripped **`74` blocking findings** and froze the train. Opening the image layers on the bench caught the culprit red-handed: regenerated Python bytecode caches inside `cryptography`, `Redis`, and `urllib3` were re-emitting flagged string fixtures at build time. Stripping that bytecode regeneration (`#4148`) wiped out the false-positive leak class, while the remaining **`65` upstream items** were pinned to verifiable **package-member evidence** (`#4238`) instead of lazy blanket ignores—locking in the invariant that every scanner clearance carries inspectable package provenance.

The fourth fix stitched multi-replica tracing and mid-reply handoffs onto one cryptographic rail. Under multi-replica traffic, request traces mysteriously sheared in half and owner handoffs flashed HTTP `503`. Tracing middleware ordering caught the bug: `SetRequestIdLayer` sat *outside* the relay router, letting inter-replica hops cross without authenticated correlation. Moving to **signed inter-replica `x-request-id`** (`#3266`) and sealing every cross-replica hop and browser file preview behind **signed custody proofs** (`#4227`, `#4228`) eliminated blind audit seams, while **durable Responses v2** (`#2922`, `#4117`, `#4165`) backed live streams with durable history fallback so mid-flight owner handoffs replay cleanly instead of dropping `503`. Together, those four bench rescues leave the cloud plane fenced where real clusters actually break.

## Honest Current Boundary: Single Primary Coding Agent Runtime Today

**(Position)** Putting `v0.12.0` and `Apache-2.0` on the front label demands putting the unfinished edge right beside them rather than smuggling roadmap items into present tense (mirrored in [Appendix B](appendix-b-security-and-readiness.md)):

- As of **November 27, 2026**, `CMA` `v0.12.0` (`Apache-2.0`), its two consolidated core services plus Kubernetes `agent-sandbox` controller, `cmaeg`'s 6 IM platforms plus `github`/`custom`, and ~`2.1 s` hot credential reload are all live;
- **Today, however, `CMA` still ships with a single primary coding agent runtime**, with free multi-runtime switching in the hosted cloud still ahead on the roadmap.

For heavy builders who need to drive dozens of heterogeneous coding and research agents simultaneously across local Git worktrees, live terminals, and embedded browser panes, ChronoAI pairs `CMA` with the second half of our dual cockpit: local-first spatial orchestrator **`heca`**. Chapter 5 opens its workbench.
