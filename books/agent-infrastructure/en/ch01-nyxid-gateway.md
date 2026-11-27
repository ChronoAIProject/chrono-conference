# Chapter 1: NyxID—The Zero-Secret Connectivity & Identity Substrate

Pasting production API keys into a `.env` file and handing them to an autonomous agent that browses the open web, reads stranger emails, and fires external tools is not bold engineering. **(Analogy)** It is scribbling the combination to the hotel's master safe onto the back of an envelope, handing it to a valet, and sending them down a street full of pickpockets.

One poisoned webpage hiding two lines of indirect prompt injection, and the agent obligingly bundles every key in its environment and mails it straight to the attacker. Worse still is the hollow idol many teams worship instead of real boundaries: appending an ALL-CAPS plea to the bottom of a system prompt—**"NEVER LEAK ANY API KEYS!"** **(Position)** Tap "prompt-level security" with a tuning-fork hammer and it rings completely hollow; begging a statistical model to keep secrets is superstition, not systems engineering. Richard Feynman's closing line in Appendix F of the 1986 Rogers Commission Report still governs every trust boundary we build: reality cannot be fooled—and attackers do not flinch because your system prompt used three exclamation marks.

**`NyxID`** starts from one unsentimental mechanical premise: **never ask an agent to keep a secret—wire the network boundary so the agent never touches a plaintext secret in the first place.**

## A Hotel Keycard, Not the Master Safe: Four Hard Boundaries

**(Analogy)** A serious hotel never hands a valet the master safe combination. It issues a magnetic keycard programmed for Room 412 only, timed to expire at noon, and capable of turning into inert plastic the second the front desk revokes it. The valet never lays eyes on the brass master key.

Slice `NyxID`'s proxy stack vertically and that exact mechanical isolation appears across four layers. Above the boundary, the agent runtime holds only a short-lived, narrowly scoped, opaque capability handle—the keycard for Room 412. Every genuine OAuth token, upstream API key, and refresh secret remains sealed inside encrypted proxy memory, injected at the final millisecond before a request leaves for an upstream provider and scrubbed clean before any response returns to the model context.

::: {.figure src="ch01-nyxid-proxy-layers"}
**`NyxID` Four-Layer Zero-Secret Proxy Boundary.** Agent context maintains zero plaintext secrets, holding only a scoped capability handle; every outbound call clears the policy gate (with high-risk writes pausing for human approval) into the encrypted vault that injects and scrubs OAuth/API tokens across live `v0.78.0`'s 55 built-in services, 42 OpenAPI-to-MCP specs, 7 LLM gateway routes, 9 messaging channel types (10 adapters), and 5 call/voice profiles.
:::

Skip slogans and run a crash test. Inside `NYXID//VAULT` below, drive legacy raw-key wiring and `NyxID` through the exact same indirect prompt-injection payload. Start with `direct-leak`: when keys for $k$ external services sit raw inside a conventional agent environment, one hostile tool output sweeps every attached credential—blast radius scales linearly with $k$:

::: {.viz src="nyxid-credential-flow" preset="direct-leak" height="500"}
**Raw-Key Prompt Injection (`direct-leak`).** Under legacy `.env` wiring, a single poisoned external response exfiltrates plaintext credentials across all attached services—blast radius grows linearly with $k$.
:::

Now throw the exact same poisoned payload into `scoped-proxy`. `NyxID`'s policy engine verifies the capability handle's minimal scope (say `read:issues` only) and blocks unauthorized lateral calls; more fundamentally, zero plaintext secrets exist anywhere inside the model window to steal—**exposed credentials stay physically pinned to `0`.**

::: {.viz src="nyxid-credential-flow" preset="scoped-proxy" height="500"}
**Scoped NyxID Proxy (`scoped-proxy`).** Requests pass strict scope validation at the policy engine; upstream secrets are injected and scrubbed strictly inside proxy memory, keeping exposed plaintext secrets identically `0`.
:::

## Live `v0.78.0` vs. `dev` `0.79.0`: Keeping Production and Next-Up Separate

`NyxID` is not an unshipped design memo; it is the live gateway carrying ChronoAI's internal workforce and the December 17 launch. In keeping with our anti-bluffing rule, the table below separates **live production (`https://api.nyxid.ai`)** from the active **`dev` branch** so unreleased feature-flagged capabilities never masquerade as shipped production (verified November 23–27, 2026):

| Engineering Dimension | Live Production (`v0.78.0` @ `898fdf245d`, 2026-11-23) | Active `dev` (`0.79.0` @ `6784b6dd36`, 2026-11-27) | Source / Endpoint |
| --- | --- | --- | --- |
| Release Velocity & Tags | `v0.78.0` (PR `#2870`); **63 minor releases** and **126 tags** in **8 weeks** since `v0.15.0` (2026-09-08) | Active `0.79.0` cycle (PR `#3091`, **`170` merged PRs** in 14 days) | `NyxID` tags / `api.nyxid.ai` |
| Built-In Service Catalog | **55 built-in services** (`DEFAULT_SERVICE_SEEDS`) | Same live baseline | `provider_service.rs` |
| OpenAPI-to-MCP Catalog | **42 OpenAPI catalog specs** (including `nyx-panel.openapi.json` for hardware panels), wrapped as auditable MCP tools | Tracking catalog additions | `specs/catalog/*.json` |
| Unified LLM Gateway | **7 upstream gateway routes** with unified metering | Same routing plane | `llm_gateway_service.rs` |
| Messaging & Voice Channels | **9 messaging channel types (`10` adapters)** + **5 call/voice profiles** | Expands to **11 messaging channel types (`12` adapters)** adding Meta Messenger & Instagram (behind feature flags on `dev`) | `channel_adapters/mod.rs` |
| Signup, Quickstarts & Extensions | Open public signup (`invite_code_required: false`), **5 quickstart guides**, **`0` plaintext keys** in context | Per-bot guest access (`nyxbot:guest-audience-v1`), custom voice instructions (up to **`2,000` chars**), avatars/emotes, admin-selected built-in skills | `api.nyxid.ai` / `quickstarts/` |

Notice how cleanly that boundary holds: live `v0.78.0` already serves all **42** auditable OpenAPI-to-MCP specs—including `nyx-panel.openapi.json`—while feature-flagged `dev` capabilities such as Meta Messenger, Instagram, per-bot guest access, and custom voice instructions stay strictly in the `dev` column until promoted.

## Retiring Master Keys Live: Online Key-Ring Census and Wire-Level Binding

Run an encrypted vault across forty-nine live collections and eventually you hit the nastiest mechanical test in applied cryptography: retiring a legacy master key without shutting the doors—while also slamming shut the quiet cipher-swap hole where a rogue database write lifts a valid ciphertext from Row A and drops it into Row B. **(Analogy)** It is like swapping every lock cylinder in a 49-floor hotel while guests sleep inside, without turning off the lights and without letting anyone transplant Room 1408's cylinder onto Room 3201's door. Across **`170` merged PRs** in 14 days on `dev 0.79.0` (through `6784b6dd36`), the bench first bolted down per-record cryptographic identity (`#2892`–`#3002`): every encrypted field now binds typed `crypto::record_field` Additional Authenticated Data (AAD) directly to its collection, record, and field coordinates, while Rust `Zeroizing` buffers wipe plaintext key bytes the instant they leave scope—so transplanted ciphertexts fail authentication on contact. Next, the online `ring-v1` key-ring census (`#3011`, `#3081`, `#3091`) killed scheduled downtime altogether: gated by a single startup read on `encryption_key_lifecycle._id = "ring-v1"`, a read-only snapshot paired with MongoDB change-stream observers sweeps all **`51` registry entries across `49` collections** live, retiring legacy master keys with zero maintenance window. The surviving invariant is blunt: legacy master keys drain to zero online, and no copied ciphertext can survive decryption outside its home record.

With storage locked down, bench testing caught three subtler races on the wire and inside background queues. First, signing only timestamp and payload left the webhook delivery identifier unauthenticated, leaving room for delivery-ID spoofing on replay paths; **`X-NyxID-Signature-V2`** (`#3089`) now authenticates the unambiguous NUL-delimited frame `version || NUL || timestamp || NUL || X-NyxID-Delivery-Id || NUL || raw_body`, binding delivery identity directly into the MAC. Second, when an organization demotes, removes, or erases a member, background jobs already waiting in a queue can still wake seconds later and run under stale authority. Across `100` files (`#3085`), a strictly monotonic **`OrgMembership.eligibility_revision`** counter closes that race: it bumps atomically on demotion, removal, or erasure—and deliberately never on promotion—so stale queued jobs die mid-flight at dispatch instead of executing past revocation. Third, on the database floor (`#3090`), MongoDB 8 `prepareUnique` rolls out owner-isolation unique constraints online without locking collections. Together they leave three wire-level invariants: delivery IDs cannot be spoofed, revoked authority dies in mid-air before work runs, and tenant owner isolation tightens without halting live traffic.

## Transparent Metering: `1 credit = 1 USD` and BYOK Hard Breakers

Right behind credential leakage waits the second classic failure of production agents: **runaway billing.** One worker trapped in a retry loop over a holiday weekend can melt straight through an uncapped corporate card.

`NyxID` welds financial metering onto the exact same proxy rail as permissions: Lago + Stripe Credits accounting uses one blunt, zero-obfuscation unit (**`1 credit = 1 USD`**), alongside native Bring-Your-Own-Key (BYOK) pass-through and hard per-agent spend ceilings. Watch `billing-meter` below as a call clears scope validation, posts usage, and trips a hard circuit breaker the instant a spend cap hits:

::: {.viz src="nyxid-credential-flow" preset="billing-meter" height="500"}
**Credits & BYOK Metering (`billing-meter`).** Tracks per-call accounting under `1 credit = 1 USD` Credits mode and BYOK pass-through with hard per-agent spend ceilings and audit logs.
:::

Now open the full `NYXID//VAULT` laboratory below. Sweep attached service breadth from `1` to `55`, toggle read, write, prompt-injection, and revocation scenarios, and verify for yourself why `NyxID`'s exposure curve never leaves the zero floor. (We examine the `hot-reload` preset in Chapter 4 when dissecting `CMA`'s ~2.1-second credential convergence.)

::: {.viz src="nyxid-credential-flow" height="560"}
**Full Laboratory: `NYXID//VAULT`.** Adjust service count (`1–55`) and toggle operational and attack scenarios to contrast legacy blast radius against `NyxID`'s zero-exposure proxy boundary.
:::

Keys, identity, and spend now sit safely behind `NyxID`'s vault wall. Chapter 2 climbs one floor higher to inspect the layer humans actually talk to—**`NyxBot`, `NyxAgent`, and the newly shipped `nyx-assistant-sdk`**—and the calibrated mechanical relief valves that keep specialist meshes from shaking themselves apart.
