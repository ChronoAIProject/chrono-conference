# Chapter 6: chrono-harness & sshx—Executable Judges Over Wishful Prompts

No major outage in software history happened because somebody forgot to write *"please code carefully"* on a wiki page. Engineering rules fail whenever they live only in prose instead of living inside compiled judges that exit non-zero.

When autonomous agents land thousands of commits a week, governing quality with **polite prayer prompts** is not merely naive—it is reckless. **(Analogy)** Pasting a hundred earnest rules into `AGENTS.md` without executable judges is like ripping out highway steel guardrails and speed cameras, then planting a polite wooden roadside sign reading *"Autonomous Vehicles: Please Drive Considerately."* Replacing the wooden sign with steel means compiling rules into Rust binaries that fail closed.

As of **November 27, 2026**, active development of **`chrono-harness`** has migrated cleanly to its dedicated GitHub organization **`https://github.com/chrono-harness/`**:

- **Active modular organization (`https://github.com/chrono-harness/`)**: **`25` public non-archived repositories** (all active `2026-11-27`), including **`20` independently versioned component repos** (**`v0.1.3`–`v0.1.22`**, `runner v0.1.22` in PR `#211`, **est. `276k` LOC of Rust**) shipping **`21` prebuilt binaries per platform** (`42` release assets across Linux x86\_64 and macOS aarch64), alongside Copier template **`v0.1.52`** (`2026-11-27`) and **`29` atomic rules**. The two newest rules—**`communication.plain-language`** (banning hollow jargon) and **`recovery.bounded`** (bounding retries and failure recovery)—compile the exact anti-bluffing ethos of this manual into machine-enforced discipline.
- **Legacy monorepo lineage**: The earlier monorepo `ChronoAIProject/chrono-harness` (which cut `v0.1.4` on `2026-11-13`) was **archived on `2026-11-22`** frozen at `271,797` LOC of Rust; every live install and contribution now points to **`https://github.com/chrono-harness/`**.
- **Candid license status**: The `chrono-harness` org repositories are **source-public with root `LICENSE` files pending** (derived default instruction files carry `Apache-2.0` attribution), whereas our companion independent review protocol **`sshx`** (`ChronoAIProject/consensus-rnd`, **`v1.0.0-beta.58`**, `2026-11-25`) is explicitly **`MIT`**-licensed.

## Declarative `FILEMAP` and Transitive `DELTA` Selection

High-velocity repositories die at one of two equally stupid extremes: either shallow lint lets real regressions walk straight into `main`, or a one-comma edit kicks off a two-hour full-repo browser matrix that starves every other worker in line.

`chrono-harness` slices cleanly between both traps with a five-stage deterministic pipeline:

::: {.figure src="ch06-harness-delta-pipeline"}
**`chrono-harness` (`https://github.com/chrono-harness/`, `21` binaries per platform / `29` atomic rules) Declarative `DELTA` Pipeline.** Starting from a Git diff, explicit `FILEMAP` lookups (fail-closed on unregistered files—zero guessing) compute exact transitive reachability across registered edges, execute the candidate judge while treating baselines strictly as immutable data, and emit structured pass/fail receipts while keeping **`completeness_proven: false`** hardcoded in live crates and archived `SPEC.md`.
:::

Step through its four sharpest teeth interactively inside **`HARNESS//DELTA`** (a 14-unit schematic dependency model):

### Rule 1: Exact `DELTA` Selection Over Blind Full-Repo Runs

Edit a single Markdown prose chapter—what actually needs to execute? In the `prose-edit` schematic scenario below, mutating one document node activates only structural and parity verification (`2 / 14` units in the model), cutting `86%` of unrelated browser and build work inside the schematic graph by driving local and CI selection from the exact same registered edges.

::: {.viz src="harness-delta-judge" preset="prose-edit" height="500"}
**Prose-Only Delta (`prose-edit`).** Illustrates modifying one documentation node: declarative `DELTA` selection activates only the `2 / 14` structural checks along its registered edges, skipping `86%` of unrelated model cost.
:::

### Rule 2: Transitive Expansion Across Core Consumers

Conversely, touch a shared kernel or runtime core and `DELTA` selection shows zero mercy—running deterministic breadth-first expansion across every declared consumer edge so all `9 / 14` impacted units (the core node plus 8 downstream consumers) enter the mandatory judge queue.

::: {.viz src="harness-delta-judge" preset="core-change" height="500"}
**Core Kernel Change (`core-change`).** Mutating a foundational core node propagates deterministically across registered `FILEMAP` edges, illuminating `9 / 14` impacted units (the core node plus 8 dependent consumers) for mandatory checks.
:::

### Rule 3: Visible Alert on Mixed Policy + Product Edits (`policy.mixed-warning`)

The slickest form of cheating in automated governance is loosening the grading rubric inside the exact pull request that breaks production code. `policy.mixed-warning` never adds bureaucratic human sign-off queues, yet the instant a changeset touches both a product node and a policy/judge node, a magenta warning fires and widens required verification across both sides.

::: {.viz src="harness-delta-judge" preset="mixed-policy" height="500"}
**Mixed Policy + Product Warning (`mixed-policy`).** Touching both production code and a judge rule triggers an explicit magenta `policy.mixed-warning` alert and widens required verification scope.
:::

### Rule 4: Fail Closed on Missing Edges (`registry.explicit`)

Many build wrappers guess which tests to run from filename patterns or directory heuristics—and the day they guess wrong, regressions glide silently into `main`. `chrono-harness` fails closed: **an unregistered file triggers an explicit registry error**, forcing the author to declare real ownership and dependency edges rather than guessing or hiding behind a blind full-repo run.

::: {.viz src="harness-delta-judge" preset="missing-edge" height="500"}
**Fail-Closed Unregistered Edge (`missing-edge`).** Introducing a file absent from `FILEMAP` causes `registry.explicit` to reject the run explicitly instead of guessing or silently skipping coverage.
:::

## `sshx`: Multi-Perspective Review Against Self-Deception

Mechanical unit judges catch broken invariants; they rarely catch solving the wrong problem or subtly stretching a claim's wording. **`sshx`** (`ChronoAIProject/consensus-rnd`, **`v1.0.0-beta.58`**, `2026-11-25`, **`MIT`**) formalizes **isolated read-only review seats**: independent reviewers inspect the same architecture diff, code patch, or formal claim separately and emit structured agreement, disagreement, and unverified-assumption receipts before merge. Yet as Volume III, Chapter 7 and Figure 27 (`ch07-hitl-ablation-gate`) demonstrate empirically, read-only prose review seats alone still leave `20%` correlated review slop until coupled with executable counterexample obligation gates that drive false positives from `30.0%` down to `0.0%`.

## Hardcoded Honesty as a Badge of Craft: `completeness_proven: false`

Once rules compile into judges, the next question hits immediately: **what stops the judges themselves from drifting or failing silently?** Open `16+` repositories across `chrono-harness` and two formal locks guard both the brake calipers and the agent-facing rules:

- **`540` Rust files wired with `verus!` formal-verification macros (`856` org-wide references)**: Locking down the brake calipers themselves—`verified_bytes.rs` (`#84`) formally proves **byte-for-byte rule emission** so generated rule artifacts cannot drift from specification bytes; `#119` proves **temporary `git fetch` ref cleanup on OID mismatch**, ensuring aborted fetches never leave poisoned dangling refs behind; and `#73` verifies **`judge-mixed` dispatch against 4 deliberate fault mutations**, proving the mixed-policy alarm cannot be quietly bypassed when product code and judge logic change together.
- **Z3 `4.12.5` formal counterexample model for `recovery.bounded` (`chrono-harness-instructions#90`)**: Even agent-facing recovery rules carry mathematical teeth—its executable Z3 `4.12.5` model emits four check verdicts (**`unsat, unsat, sat, sat`**) and constructs a reachable counterexample proving that **blind retries trigger double-writes** unless an agent verifies the prior operation's external effect first.

**(Position)** Precisely because we verify every brake caliper we can formalize with Verus and Z3, we refuse to pretend to omniscience—and put our sharpest caveat right in the center of the console: **`completeness_proven: false`** remains **hardcoded directly inside the live Rust crates (`runner`, `inputs`, `judge-*`, `cache`)** as well as in archived `SPEC.md` (`parity: unestablished`).

A gauge that prints `UNKNOWN` beyond its calibrated range is a scientific instrument; a dashboard that forces every lamp green is propaganda. Proving every brake caliper without claiming omniscience means `FILEMAP` expansion guarantees completeness over every declared edge while refusing to bluff about undeclared external side effects. Keeping `completeness_proven: false` bolted into the code is what keeps us turning real incidents into stronger judges tomorrow.

Open the full `HARNESS//DELTA` laboratory below to click any subset of the 14 repository and policy nodes, simulate unregistered edges, and watch transitive BFS selection and cost savings compute live.

::: {.viz src="harness-delta-judge" height="560"}
**Full Laboratory: `HARNESS//DELTA`.** Click any combination of the 14 repo and policy nodes or toggle unregistered edges to watch BFS delta selection, verification cost savings, and `policy.mixed-warning` live.
:::

All four chassis layers are now bolted tight: keys in `NyxID`, skills in `Ornn`, twin execution in `CMA` and `heca`, and compiled judges in `chrono-harness` and `sshx`. Chapter 7 steps past the terminal window to see where this vehicle touches programmable 3D broadcast worlds, declarative cloud rollouts, and physical homes.
