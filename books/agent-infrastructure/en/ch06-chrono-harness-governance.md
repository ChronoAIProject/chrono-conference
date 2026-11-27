# Chapter 6: chrono-harness & sshx—Executable Judges Over Wishful Prompts

No major outage in software history happened because somebody forgot to write *"please code carefully"* in a wiki page. Rules fail whenever they live only in prose instead of living inside compilers and executable judges.

When autonomous agents land thousands of commits a week, governing quality with polite prompt reminders is not merely naive—it is hazardous. Pasting a hundred guidelines into `AGENTS.md` without an automated referee is like tearing down highway guardrails and speed cameras, then planting a polite wooden sign reading *"Autonomous Vehicles: Please Drive Considerately."*

**`chrono-harness`** (current release **`v0.1.4`**, published November 13, 2026; **272k LOC of Rust** across **25 modular repositories** under `chrono-harness`, shipping **16** prebuilt binaries each for Linux x86\_64 and macOS aarch64) together with independent review protocol **`sshx`** (`v1.0.0-beta.58`, November 25, 2026) serve as the mechanical brakes bolted directly onto our delivery pipeline.

## Declarative `FILEMAP` and Transitive `DELTA` Selection

High-velocity repositories usually die at one of two extremes: either shallow syntax lint lets real regressions slip straight into production, or a one-word typo triggers a two-hour full-repo browser matrix that starves every other developer in the queue.

`chrono-harness` slices straight between both traps with a five-stage deterministic pipeline:

::: {.figure src="ch06-harness-delta-pipeline"}
**`chrono-harness` (`v0.1.4`) Declarative `DELTA` Pipeline.** Starting from a Git diff, explicit `FILEMAP` lookups (fail-closed on unregistered files—zero guessing) compute exact transitive reachability across registered edges, run the candidate judge while treating baselines strictly as immutable data, and emit structured pass/fail evidence receipts while candidly tracking `completeness_proven: false` in `SPEC.md`.
:::

Step through its four hardest rules interactively using **`HARNESS//DELTA`** (a 14-unit schematic dependency model):

### Rule 1: Exact `DELTA` Selection Over Blind Full-Repo Runs

Edit a single Markdown prose chapter—what actually needs to run? In the `prose-edit` schematic scenario below, mutating one document node activates only structural and parity verification (`2 / 14` units in the model), cutting `86%` of unrelated browser and build work inside the schematic graph by driving both local and CI selection from declared dependency edges.

::: {.viz src="harness-delta-judge" preset="prose-edit" height="500"}
**Prose-Only Delta (`prose-edit`).** Illustrates modifying one documentation node: declarative `DELTA` selection activates only the `2 / 14` structural checks along its registered edges, skipping `86%` of unrelated model cost.
:::

### Rule 2: Transitive Expansion Across Core Consumers

Conversely, touch a shared kernel or runtime core and `DELTA` selection shows zero leniency—running deterministic breadth-first expansion across every declared consumer edge so all `9 / 14` impacted units (the core node plus 8 downstream consumers) enter the mandatory judge queue.

::: {.viz src="harness-delta-judge" preset="core-change" height="500"}
**Core Kernel Change (`core-change`).** Mutating a foundational core node propagates deterministically across registered `FILEMAP` edges, illuminating `9 / 14` impacted units (the core node plus 8 dependent consumers) for mandatory checks.
:::

### Rule 3: Visible Alert on Mixed Policy + Product Edits (`policy.mixed-warning`)

The sneakiest bug in automated governance is relaxing the grading script inside the same pull request that breaks production code. `policy.mixed-warning` never introduces bureaucratic sign-off queues, yet the instant a changeset touches both a product node and a judge/policy node, a bright magenta warning fires and expands audit coverage across both tracks.

::: {.viz src="harness-delta-judge" preset="mixed-policy" height="500"}
**Mixed Policy + Product Warning (`mixed-policy`).** Touching both production code and a judge rule triggers an explicit magenta `policy.mixed-warning` alert and widens required verification scope.
:::

### Rule 4: Fail Closed on Missing Edges (`registry.explicit`)

Many build wrappers guess which tests to run from file extensions or directory heuristics—and whenever they guess wrong, regressions slip silently into `main`. `chrono-harness` fails closed: **an unregistered file triggers an explicit registry error**, forcing the author to declare true ownership and dependency edges rather than guessing or dumping into a blind full run.

::: {.viz src="harness-delta-judge" preset="missing-edge" height="500"}
**Fail-Closed Unregistered Edge (`missing-edge`).** Introducing a file absent from `FILEMAP` causes `registry.explicit` to reject the run explicitly instead of guessing or silently skipping coverage.
:::

## `sshx`: Multi-Perspective Independent Review Against Self-Deception

Mechanical unit judges catch broken invariants; they rarely catch solving the wrong problem or subtly stretching a claim's wording. `sshx` (`ChronoAIProject/consensus-rnd` `v1.0.0-beta.58`, November 25, 2026) formalizes **independent read-only review seats**: isolated reviewers inspect the same architecture diff, code patch, or theorem statement separately and emit structured agreement/disagreement receipts before landing.

## Candid Specification Boundary: `completeness_proven: false`

Even on our own governance engine, we refuse to overclaim: `chrono-harness`'s `SPEC.md` explicitly records **`completeness_proven: false`**. Expanding every registered `FILEMAP` edge guarantees completeness with respect to declared dependencies, not omniscience over undeclared external side effects. Stating that gap openly keeps us honest as we turn real incidents into new executable judges.

Open the full `HARNESS//DELTA` laboratory below to toggle any subset of the 14 repository and policy nodes, simulate unregistered edges, and watch transitive BFS selection and cost savings compute live.

::: {.viz src="harness-delta-judge" height="560"}
**Full Laboratory: `HARNESS//DELTA`.** Click any combination of the 14 repo and policy nodes or toggle unregistered edges to watch BFS delta selection, verification cost savings, and `policy.mixed-warning` live.
:::

All four chassis layers are now bolted down: keys in `NyxID`, skills in `Ornn`, twin execution in `CMA` and `heca`, and executable judges in `chrono-harness` and `sshx`. Chapter 7 steps beyond the terminal screen to inspect where this vehicle touches live 3D spaces, cloud apps, and physical homes.
