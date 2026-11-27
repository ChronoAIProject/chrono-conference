# Chapter 4: CMA—Cloud-Hosted Managed Agents and Event Gateway

Ask a systems engineer to open five terminal tabs, juggle isolated Git worktrees, and wire local proxies on a laptop, and they feel right at home. Ask a florist, a finance controller, or a community manager to do the same, and the laptop snaps shut five minutes later.

**`CMA` (`ChronoAI Managed Agent`, live at `cma.nyxid.ai`, repo `ChronoAIProject/cma`)** and its event gateway **`cmaeg`** solve zero-ops cloud execution. As of **November 27, 2026**, official releases have resumed: **`v0.12.0`** shipped on **November 24, 2026** (`main 8f5ba69408`), `develop` sits at `c57da2e1e2` (PR `#4231`, `+722` commits past `v0.12.0`), and the public repository now carries an explicit **`Apache-2.0` `LICENSE`** (landed November 24, 2026, PR `#3647`).

## Two Consolidated Core Services + K8s Sandbox Controller, Four Security Layers

Operationally, `CMA` resists microservice sprawl by consolidating into **two core application services (`cma-agent-manager`, `cma-event-gateway`) plus the Kubernetes `agent-sandbox` controller**. Read from the security boundary upward, those services implement four crisp architectural layers:

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

## Honest Current Boundary: Single Primary Coding Agent Runtime Today

**(Stance)** Putting `v0.12.0` and `Apache-2.0` on the front label demands putting the unfinished edge right beside them rather than smuggling roadmap items into present tense (mirrored in [Appendix B](appendix-b-security-and-readiness.md)):

- As of **November 27, 2026**, `CMA` `v0.12.0` (`Apache-2.0`), its two consolidated core services plus Kubernetes `agent-sandbox` controller, `cmaeg`'s 6 IM platforms plus `github`/`custom`, and ~`2.1 s` hot credential reload are all live;
- **Today, however, `CMA` still ships with a single primary coding agent runtime**, with free multi-runtime switching in the hosted cloud still ahead on the roadmap.

For heavy builders who need to drive dozens of heterogeneous coding and research agents simultaneously across local Git worktrees, live terminals, and embedded browser panes, ChronoAI pairs `CMA` with the second half of our dual cockpit: local-first spatial orchestrator **`heca`**. Chapter 5 opens its workbench.
