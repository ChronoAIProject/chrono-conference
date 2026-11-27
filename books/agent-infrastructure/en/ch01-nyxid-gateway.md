# Chapter 1: NyxID—The Zero-Secret Connectivity & Identity Substrate

Pasting production API keys into a `.env` file and handing them to an autonomous agent that browses the open web and reads external emails is security theater in reverse—like writing your vault combination on the back of an envelope and sending a courier down a street full of pickpockets.

One poisoned webpage carrying two lines of indirect prompt injection, and the agent politely exfiltrates every key sitting in its environment. Worse still, teams try to stop the bleed by appending an ALL-CAPS sentence to their system prompt: **"NEVER LEAK ANY API KEYS!"** As Richard Feynman closed Appendix F of the Rogers Commission Report (1986), nature cannot be fooled—and attackers do not back down because your prompt used exclamation marks.

**`NyxID`** starts from one cold engineering premise: **never ask an agent to keep a secret—arrange the network boundary so the agent never touches a plaintext secret in the first place.**

## Four Hard Layers: Why Plaintext Keys Never Enter Context

Slice `NyxID`'s proxy stack vertically and four isolated boundaries appear. Above the boundary, the agent runtime holds only a short-lived, narrowly scoped, opaque capability handle. Every real OAuth token, refresh credential, and upstream API key stays sealed inside encrypted proxy memory—injected only at the final instant before a request leaves for an upstream provider, and stripped clean before any response travels back toward the model window.

::: {.figure src="ch01-nyxid-proxy-layers"}
**`NyxID` Four-Layer Zero-Secret Proxy Boundary.** Agent context maintains zero plaintext secrets, holding only a scoped capability handle; every outbound call passes through the policy gate (with high-risk writes pausing for human approval) into the encrypted vault that injects and scrubs OAuth/API tokens across 55 built-in services, 41 OpenAPI-to-MCP specs, 7 LLM gateways, and 9 channel types.
:::

Test legacy raw-key wiring against `NyxID` under a live prompt-injection attack inside `NYXID//VAULT`. Start with `direct-leak`: when keys for $k$ external services sit inside a conventional agent environment, one hostile tool response scales blast radius linearly with every attached service $k$:

::: {.viz src="nyxid-credential-flow" preset="direct-leak" height="500"}
**Raw-Key Prompt Injection (`direct-leak`).** Under legacy `.env` wiring, a single poisoned external response exfiltrates plaintext credentials across all attached services—blast radius grows linearly with $k$.
:::

Now run that exact same attack through `scoped-proxy`. `NyxID` checks the capability token's narrow scope (say `read:issues` only), drops unauthorized lateral calls, and ensures zero plaintext tokens ever live inside the model's context window—**holding exposed secrets strictly at `0`.**

::: {.viz src="nyxid-credential-flow" preset="scoped-proxy" height="500"}
**Scoped NyxID Proxy (`scoped-proxy`).** Requests pass strict scope validation at the policy engine; upstream secrets are injected and scrubbed strictly inside proxy memory, keeping exposed plaintext secrets identically `0`.
:::

## Sixty-Three Minor Releases in Eight Weeks: `NyxID` `v0.78.0` in Numbers

`NyxID` is not an unshipped design memo; it is the live production gateway powering ChronoAI and the December 17 launch. Verified from `https://api.nyxid.ai/api/v1/public/config` and `ChronoAIProject/NyxID@v0.78.0` (November 3–26, 2026):

| Engineering Dimension | Verified Scope | Source File / Endpoint |
| --- | --- | --- |
| Live Version & Velocity | `v0.78.0`; **63 minor releases** and **126 tags** in **8 weeks** since `v0.15.0` (2026-09-08) | `ChronoAIProject/NyxID` tags & `api.nyxid.ai` |
| Built-In Service Catalog | **55 built-in services** (`DEFAULT_SERVICE_SEEDS`) | `backend/src/services/provider_service.rs` |
| OpenAPI-to-MCP Specs | **41 OpenAPI catalog specs** wrapped as auditable MCP tools | `backend/specs/catalog/*.openapi.json` |
| Unified LLM Gateway | **7 upstream provider routes** with unified metering | `backend/src/services/llm_gateway_service.rs` |
| Messaging Channel Adapters | **9 distinct channel types** (`10` registered adapters) | `backend/src/services/channel_adapters/mod.rs` |
| Access & Quickstarts | Open public signup (`invite_code_required: false`) + **5 quickstart guides** | `api.nyxid.ai` & `docs/quickstarts/` |

## Transparent Metering: `1 credit = 1 USD` and BYOK Spend Ceilings

Right behind credential leakage sits the second nightmare of real-world agent deployment: **runaway billing.** One agent caught in a retry loop over a holiday weekend can burn straight through an uncapped corporate card.

`NyxID` welds metering directly into the same proxy boundary as permissions: Lago + Stripe Credits billing runs on an unambiguous unit (**`1 credit = 1 USD`**), alongside native Bring-Your-Own-Key (BYOK) pass-through and hard per-agent spend caps. Inspect `billing-meter` below to watch a request clear scope validation, log credit usage, and halt cleanly the moment a spend ceiling is reached:

::: {.viz src="nyxid-credential-flow" preset="billing-meter" height="500"}
**Credits & BYOK Metering (`billing-meter`).** Tracks per-call accounting under `1 credit = 1 USD` Credits mode and BYOK pass-through with hard per-agent spend ceilings and audit logs.
:::

Open the full `NYXID//VAULT` laboratory below to vary attached service breadth from `1` to `55`, switch across read, write, prompt-injection, and revocation modes, and verify the zero-secret invariant directly. (We inspect the `hot-reload` preset in Chapter 4 when tearing down `CMA`'s ~2.1-second live credential convergence.)

::: {.viz src="nyxid-credential-flow" height="560"}
**Full Laboratory: `NYXID//VAULT`.** Adjust service count (`1–55`) and toggle operational and attack scenarios to contrast legacy blast radius against `NyxID`'s zero-exposure proxy boundary.
:::

With keys, identity, and spend safely locked inside `NyxID`, Chapter 2 steps one floor higher to inspect the agents users actually talk to—**`NyxBot`, `NyxAgent`, and the Browser Assistant SDK**—and the hard numeric caps that keep multi-specialist meshes from spinning out of control.
