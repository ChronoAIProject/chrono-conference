# Chapter 7: chrono-metaverse, chrono-cd, and Living with AI

An agent stack that only ever edits its own code inside a terminal is an expensive programmer's toy, not a complete vehicle. The real road test arrives when the exact same zero-secret proxy, versioned skill forge, and human write-approval brakes extend without wobble into **programmable 3D broadcast worlds, declarative cloud delivery, and real lights, cameras, and hardware panels inside physical rooms.**

As of **November 27, 2026**, three live surfaces carry ChronoAI past the terminal: **`chrono-metaverse`**, **`chrono-cd`**, and **`Living with AI`**. **(Position)** True to our rules, we label squarely which surface is public, which remains private/internal, and which stands at early alpha hardware proof.

::: {.figure src="ch07-physical-digital-twin"}
**Digital Surface and Physical Home Extensions.** Left: digital surface pairing public 3D engine `chrono-metaverse` (with its 4-stage extended broadcast pipeline) and internal GitOps plane `chrono-cd`. Right: physical surface where `Living with AI` connects Home Assistant sensors and actuators via `nyx-homeassistant-node` (`v1.1.1-alpha.52`), `video-event-monitor` (`0.5.0-alpha.2`), and public hardware panel `nyxid-esp-panel` (`v1.0.0`, Apache-2.0) behind `NyxID` permissions.
:::

## `chrono-metaverse`: Authoring 3D Broadcast Worlds Like Database Transactions

The December 17 `street-corner` lobby walked in Volume I is not a dead artist mesh baked inside proprietary 3D software; it is a programmable world powered by the public engine **`ChronoAIProject/chrono-metaverse`** (`dev 21e1f93`, `2026-11-27`, PR `#346`).

Its signature engineering exhibit for December 17 is the **4-stage extended broadcast pipeline**:

1. **Stage 1 — Office Origin (`rb.cabinet-01`)**: Live presenter and operational demonstration feed;
2. **Stage 2 — Virtual Stadium: Xingchao (Star Tide) (`street-corner`)**: **`1,108` live seats** built cleanly as **4 tiered stands × 8 rows** (North `248`, South `248`, East `306`, West `306`; rows `1→8` holding `144, 144, 144, 140, 136, 136, 132, 132` seats with live addresses such as `N1-17`, `E1-20`, `W8-01`), bordered along the world-map wall by **`18` flower basket mats** (`2 rows × 9`);
3. **Stage 3 — Marina Bay Sands Sky-Screen**: A **`252.8 m × 142.2 m`** skyline screen anchored over Singapore's waterfront;
4. **Stage 4 — Earth Orbital Planetary Screen**: Camera pullback to a **`5,307 km × 2,985 km`** orbital display.

Underneath the visuals, its protocol reads like disciplined versioned transactions:

- **Draft → Ops → Preview → Publish**: Whether laying out `1,108` theater seats or letting Blossom place Basket `#12` on its promenade mat, every spatial mutation runs through `create_draft` → `append_draft_ops` → `create_draft_preview` → `publish_draft`, backed by snapshots (`get_snapshot`), chunk streaming (`get_chunk`), and region queries (`get_region_content`).
- **Replayable Event Timeline & Space Composition**: Seat light-ups, basket placements, and show cues record onto replayable timelines (`write_events` / `list_timeline`), while child spaces compose into larger worlds (`join_space_child` / `update_space_composition`).
- **Native `NyxID` Enforcement**: Visitor check-ins and Blossom's stand writes traverse the exact same scoped proxy so no unprivileged guest can alter public venue geometry.

Pushing this live Singapore waterfront world toward December 17 drove **`276` merged PRs in 14 days**, anchored by three unmistakable bench surgeries. First came ruthless deletion: carrying a hand-rolled CMA client inside the 3D viewer meant every protocol tweak broke Spatial Workbench twice, so `#298` ripped out **`10,656` lines** of bespoke plumbing (`+570/-10,656` across `63` files) and mounted Spatial Workbench directly onto **`nyx-assistant-sdk v0.1.0` GA** (`#307`)—giving the 3D world the exact same zero-secret voice-and-tool rail as every browser surface. Second came byte-level cache forensics (`#326`): walking the camera along the Fullerton waterfront blew straight past the browser's **`96 MiB` geometry cache**, stuttering on dense urban extrusions. Dissecting vertex attributes on the bench cut the fat to the bone—**quantizing extruded surface normals into signed `i16`** and **packing facade reflection atlas rows alongside base and roof endpoints into just two `u8` bytes**, pulling the waterfront comfortably back inside the `96 MiB` ceiling. Third, skyline glass and harbor water went under calibration: `#345` added **multi-elevation tower radiance** sampling **`6` directions × `3` elevations** on Marina Bay towers, while `#346` introduced a **wave-slope water LUT** applying a **`75%` conservative correction** to G/B unresolved-wave reflection bias—regression-locked by **`744` unit tests** and a **9-route browser replay** suite while keeping all **`1,132` scene anchors** and **`15` airborne craft** (`#61`, `#315`) pinned smoothly onto the live city.

## `chrono-cd`: Closing the Last Meter of Cloud Delivery (Private Internal)

When agents finish shipping a web service—a launch lobby, an observatory API, or a merchant panel—forcing a human to SSH into hosts and hand-edit Nginx configs snaps automation one meter short of the finish line.

**`chrono-cd`** (**private internal repository**, latest `ea32caa`, `2026-11-26`, PR `#90`) provides ChronoAI's single declarative delivery plane:

- Declarative rollouts, immutable revisions, and controlled restarts (`put_app`, `list_app_revisions`, `restart_app`);
- Encrypted runtime secrets and secret files (`set_app_secrets`, `set_secret_files`) that never touch Git;
- Unified telemetry schemas, structured log queries, and quota workflows (`query_app_metrics`, `query_app_logs`, `create_quota_request`) letting `CMA`, `heca`, and ops agents diagnose regressions straight from live production logs.

## `Living with AI`: Bolting the Circuit Breaker Beside Real Front Doors

The hardest boundary test for autonomous agents is stepping into physical rooms where human beings live. **(Analogy)** A bad line of code in a terminal prints a red stack trace; a rogue API write inside a home is not an HTTP 500—it is an unlocked door or a tripped physical relay. Every meter closer to copper wire turns `NyxID`'s read-vs-write split from abstract policy into an honest breaker box screwed into your hallway wall.

As of **November 27, 2026**, **`Living with AI`** spans three connected pieces:

- **`ChronoAIProject/nyx-homeassistant-node`** (**`v1.1.1-alpha.52`**, `main` pushed `2026-11-15`): Public bridge binding Home Assistant sensors and devices behind `NyxID`'s trust plane;
- **`video-event-monitor`** (**`0.5.0-alpha.2`**): Companion vision-event watcher powering shelf-emptiness detection and automated restock prompts;
- **`nyxid-esp-panel`** (**`v1.0.0`**, `2026-11-20`, **`Apache-2.0`**): Public hardware panel firmware and interface—corresponding directly to the 42nd OpenAPI-to-MCP spec (`nyx-panel.openapi.json`) added in Chapter 1—running on-device **"Hey Nyx" C161 wake-word** detection across **3 board profiles** (including the **8-inch Waveshare JD9365/ES7210** panel).

Step down from cloud VMs onto bare-metal copper and live cameras, and every stray byte draws blood. Stress-testing repeated WebRTC voice calls on `nyxid-esp-panel` exposed a silent **`~21 KB/call` PSRAM leak (`#15`)**: `dtls_srtp_deinit` was hanging onto the final DTLS object and TLS buffers after hangup, steadily bleeding small boards toward watchdog resets; right beside it, a micro-speech **`FrontendReset` null-pointer write (`#20`)** crashed audio front-end reinitialization. Plugging both bare-metal faults keeps wall panels alive through full days of repeated voice traffic. Over on the office camera bench, two fixes turned `video-event-monitor` into a disciplined watcher: a **two-stage 4K `detail_regions` crop (`#20`)** scans a wide frame first and fetches targeted high-res crops within a hard **3-image budget**—reading snack labels cleanly without incinerating token budgets on full 4K frames—and an **idle-agent leak fix (`#21`)** solved the mystery of why idle per-event agents never retired. Tracing lifecycle timestamps caught **CMA's own background maintenance continually refreshing `updated_at`**, tricking the idle reaper into sparing zombie watchers; separating event activity from maintenance ticks restored deterministic retirement immediately.

Internal recorded proofs (documented in `chrono-company-slides`, November 2026) already run from a single Feishu command patrolling a campus robot dog through `NyxID → Home Assistant` to an office camera spotting an empty snack shelf, polling flavors, and drafting a restock order. **Our boundary stays blunt: smart-home automation remains early alpha and internal hardware proof**, governed by three unbendable rules:

- Agents never receive raw, long-lived Home Assistant superuser tokens;
- Read-only sensor inspection and safety-critical physical actuations stay strictly separated behind scoped grants and local human sign-off;
- Drawing on our event-driven actor heritage in **`aevatar`** (`1.31M` LOC of C# and `16,366` test assertions as of October 12, 2026), reactive orchestration extends cleanly from cloud sandboxes to edge devices at home.

All five layers of the complete vehicle are now open down to the frame. [Appendix A](appendix-a-enterprise-repo-atlas.md) maps all **`539` repositories across 6 GitHub organizations**, and [Appendix B](appendix-b-security-and-readiness.md) lays out our unpainted **Trust Boundary, License & Honest Readiness Matrix**.
