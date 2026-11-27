# Chapter 4: CMA—Cloud-Hosted Managed Agents and Event Gateway

Ask a systems engineer to open five terminal tabs, configure isolated Git worktrees, and wire local proxies on a laptop, and they are right at home. Ask a florist, a finance controller, or a community manager to do the same, and they will close the laptop five minutes later.

**`CMA` (`ChronoAI Managed Agent`, live at `cma.nyxid.ai`)** and its companion event gateway **`cmaeg`** solve zero-ops cloud execution: no container plumbing, no webhook signature wrangling, and no rebooting a live sandbox just to grant or revoke one permission.

## Four-Layer Cloud Architecture

Read `CMA`'s production stack from the ground up and four crisp layers appear:

::: {.figure src="ch04-cma-four-layers"}
**`CMA` (`cma.nyxid.ai`) Four-Layer Cloud Architecture.** Bottom to top: Layer 1 isolated sandboxes and artifact storage (`chrono-sandbox`), Layer 2 multi-channel event gateway and routing (`cmaeg`), Layer 3 managed agent runtime with ~`2.1 s` hot credential reload, and Layer 4 user workspace, audit transcripts, and scoped share links—all outbound actions mediated by `NyxID`.
:::

Each layer carries one clean engineering mandate:

1. **Layer 1 — Isolated Sandboxes & Artifact Store**: Each managed agent runs inside an isolated sandbox (`chrono-sandbox` pause/revive lifecycle, scoped file tree, document revision history, and read-only share links), eliminating cross-tenant blast radius.
2. **Layer 2 — Multi-Channel Event Gateway (`cmaeg`)**: Normalizes asynchronous external traffic—GitHub webhooks, native Lark/Feishu events, Telegram updates, WhatsApp callbacks, and custom events—into partitioned threads with signature verification, deduplication, and two-phase outbound delivery (`prepareoutboundmessage` / `commitoutboundmessage`) to guard against duplicate sends and silent drops.
3. **Layer 3 — Managed Runtime & ~`2.1 s` Hot Credential Reload**: In conventional cloud runners, granting or revoking an external tool forces a container restart that kills active work. `CMA` decouples credential state from sandbox lifetime: updating service bindings in `NyxID` converges live in roughly **2.1 seconds**, enabling instant permission grants and instant emergency revocations alike.
4. **Layer 4 — Operator Surface & Audit Trail**: Live event streams, full transcripts, file inspection, access-request queues, and usage reports let operators audit every action without tailing raw server logs.

Inspect the `hot-reload` experiment card below to trace how `CMA` converges to updated `NyxID` bindings inside the ~2.1-second window without bouncing the running sandbox:

::: {.viz src="nyxid-credential-flow" preset="hot-reload" height="500"}
**2.1-Second Hot Credential Reload (`hot-reload`).** Demonstrates `CMA` converging live to updated `NyxID` grants and revocations in ~`2.1 s` with zero sandbox reboot and zero exposed plaintext secrets.
:::

## Honest Current Boundary: Single Primary Coding Runtime Today

Keeping our disclosure discipline intact (and mirrored in [Appendix B](appendix-b-security-and-readiness.md)):

- As of November 26, 2026, `CMA`'s four-layer cloud architecture, `cmaeg` event gateway, and ~`2.1 s` hot credential reload are live in production;
- **Today, however, cloud managed instances center on a single primary coding runtime**, with broader multi-runtime choice still ahead on the roadmap.

For heavy builders who want to command dozens of heterogeneous agents across local Git worktrees, real terminals, and live browser panels simultaneously, ChronoAI pairs `CMA` with the other half of our dual cockpit: local-first orchestrator **`heca`**. Chapter 5 opens its canvas.
