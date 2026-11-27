# Chapter 2: NyxBot, NyxAgent, and the Browser Assistant SDK

Drop a brand-new hire into an office without telling them which ledger they own or how many mass emails they are allowed to send in an hour, and the strongest keycard system on Earth will not save you from an afternoon disaster.

`NyxID` locks down keys and identity. The next layer must govern **role separation, memory hygiene, and anti-runaway budgets**. Across ChronoAI's stack, the surface users and business teams actually interact with is formed by **`NyxBot`**, **`NyxAgent`**, and the embeddable **`nyx-assistant-sdk`**.

## Why a Specialist Mesh Beats One Giant Chat Window

Cram corporate accounting rules, a 30-question press bank, 1,108 theater seat locks, and live GitHub triage into one sprawling context window and watch accuracy collapse: instructions collide, attention smears, and debugging becomes guesswork.

`NyxBot` builds a mechanical gearbox instead—splitting duties into narrow **specialists** governed by hard numeric budgets baked directly into backend source models (`ChronoAIProject/NyxID@v0.78.0`, verified November 3, 2026):

::: {.figure src="ch02-nyxbot-specialist-mesh"}
**`NyxBot` Specialist Mesh and Hard Operational Ceilings (`NyxID@v0.78.0`).** A central dispatcher coordinates `8` default specialists (scaling up to `32` max) with a group cap of `8` agents per room, `50` bounded persistent memory slots per agent, and strict dual trigger rate ceilings (`30/hr` and `300/day`) preventing infinite webhook storms.
:::

Inspect each hard constant (all under `backend/src/models/` in `ChronoAIProject/NyxID@v0.78.0`) and the exact failure mode it kills:

| Source Constant | Exact Cap | Source File | Failure Mode Prevented |
| --- | ---: | --- | --- |
| Default specialists | `8` | `assistant_settings.rs` | Covers core small-company roles out of the box |
| Maximum specialists | `32` | `assistant_settings.rs` | Scales horizontally while bounding routing sprawl |
| Group room cap | `8` | `assistant_group.rs` | Prevents >8-agent group chats from degrading into echo loops |
| Persistent memory slots | `50` | `assistant_agent.rs` | Forces high-signal memory distillation instead of unbounded bloat |
| Hourly trigger ceiling | `30 / hr` | `assistant_settings.rs` | Stops recursive webhooks or retry loops from draining quotas |
| Daily trigger ceiling | `300 / day` | `assistant_settings.rs` | Bounds overnight autonomous action volume predictably |

## Active in Two Live Environments: From Demo Finance Ledgers to Browser Guides

This mesh runs today across two concrete operational environments:

1. **Back-Office & Launch Operations (`nyxbot-finance` & `nyxid-nyxbot-trials`)**: As of November 25, 2026, `NyxBot` Finance covers **24 of 28 accounting workflows** on its demo ledger (categorization, anomaly flags, reconciliation), while December 17 launch roles—Concierge **Donna** (`13/15`), Flower Town **Blossom**, Community Ops (`9/11`, 75 rehearsal actions), and Social **Auto-X** (`11/13`)—ride the exact same specialist routing and rate-limit rails.
2. **Embedded Browser Concierge (`nyx-assistant-sdk`)**: The floating assistant embedded inside `https://live.trureturing.org/` and the `street-corner` virtual lobby runs on the same lightweight browser SDK. Zero backend secrets ship inside frontend JavaScript: the widget handshakes strictly against `NyxID` session endpoints so any web surface—from a formal research observatory to a retail storefront—gains a scoped live guide with minimal integration code.

## One Missing Piece Between "Chatting" and "Shipping"

Once specialist meshes and hard caps are running, a sharp systems engineer immediately asks: **"If every specialist's procedure is just text pasted into an admin form, how do we version, security-scan, freeze, and distribute the reception and finance workflows perfected for December 17 to the next hundred stores?"**

That is Layer 2 of the complete vehicle: our agent-facing skill lifecycle API, **`Ornn` and `nyx-skills`**. Chapter 3 opens the forge.
