# Chapter 7: chrono-metaverse, chrono-cd, and Living with AI

An agent stack that only ever edits its own code inside a terminal is an impressive developer toy, not a complete vehicle. The true test arrives when the exact same zero-secret proxy, skill lifecycle, and write-approval brakes extend cleanly into **shared 3D virtual spaces, zero-ops cloud deployments, and real physical-home sensors and actuators.**

Three concrete surfaces carry ChronoAI beyond the command line today: **`chrono-metaverse`**, **`chrono-cd`**, and **`Living with AI`**.

::: {.figure src="ch07-physical-digital-twin"}
**Digital Surface and Physical Home Extensions.** Left: digital surface pairing `chrono-metaverse` 3D space with `chrono-cd` GitOps deployment. Right: physical home surface where `Living with AI` connects Home Assistant sensors and actuators via `nyx-homeassistant-node` (`v1.1.1-alpha.52`) behind `NyxID` permissions.
:::

## `chrono-metaverse`: Authoring 3D Spaces Like Software Commits

The `street-corner` lobby explored in Volume I is not a static artist render baked inside proprietary 3D software; it is a live programmable world running on **`chrono-metaverse`**.

Inspect its protocol surface and it reads like versioned database transactions:

- **Draft → Ops → Preview → Publish**: Whether laying out 1,108 theater seats or letting Blossom materialize Basket #12 on its promenade stand, every spatial edit moves through transactional `create_draft` → `append_draft_ops` → `create_draft_preview` → `publish_draft`, backed by snapshots (`get_snapshot`), chunk streaming (`get_chunk`), and spatial region queries (`get_region_content`).
- **Event Timeline & Space Composition**: Check-ins, flower placements, and stage cues log onto replayable event timelines (`write_events` / `list_timeline`), while child spaces compose cleanly into broader worlds (`join_space_child` / `update_space_composition`).
- **Native `NyxID` Enforcement**: Visitor sign-in and Blossom's spatial write calls pass through the exact same scoped proxy so no unprivileged guest can alter public venue geometry.

## `chrono-cd`: Closing the Last Meter of Cloud Delivery

When agents finish building a service—a launch lobby, an observatory API, or a merchant dashboard—forcing a human to SSH into servers and hand-edit Nginx configs snaps the automation chain one meter short of the finish line.

**`chrono-cd`** provides one declarative deployment plane across ChronoAI apps:

- Declarative rollouts, immutable revisions, and controlled restarts (`put_app`, `list_app_revisions`, `restart_app`);
- Encrypted runtime secrets and secret files (`set_app_secrets`, `set_secret_files`) that never touch Git;
- Unified telemetry schemas, log queries, and quota workflows (`query_app_metrics`, `query_app_logs`, `create_quota_request`) allowing `CMA`, `heca`, and ops agents to diagnose regressions against real production signals.

## `Living with AI`: Zero-Secret Guardrails Inside Real Physical Homes

The ultimate boundary test for autonomous agents is stepping into physical rooms where people actually live. Once an agent reads home temperature sensors, adjusts lighting, or touches physical locks via Home Assistant, an unchecked write is no longer a failed CI build—it is a real-world safety hazard.

The public bridge of our **`Living with AI`** line, **`ChronoAIProject/nyx-homeassistant-node`** (`v1.1.1-alpha.52`, November 4, 2026), brings physical-home and office automation inside the exact same `NyxID` trust plane. In internal live demos built on `nyx-homeassistant-node` (recorded in `chrono-company-slides`, November 2026), that rail already steps out of the chat box—from triggering a campus robot-dog patrol via a single Feishu message through `NyxID → Home Assistant`, to an office snack steward noticing an empty shelf on camera, polling the team for flavors, and drafting a restock order:

- Agents never receive raw, long-lived Home Assistant superuser tokens;
- Read-only sensor inspection and safety-critical physical actuator writes remain strictly separated behind scoped grants and human approval gates;
- Building on our event-driven actor heritage in **`aevatar`** (`1.31M` LOC of C# and `16,366` test assertions as of October 12, 2026), reactive multi-agent orchestration extends seamlessly from cloud sandboxes to edge devices at home.

All five layers of the complete vehicle are now open on the lift. [Appendix A](appendix-a-enterprise-repo-atlas.md) maps all six GitHub organizations across the enterprise, and [Appendix B](appendix-b-security-and-readiness.md) lays out our candid **Trust Boundary & Readiness Matrix**.
