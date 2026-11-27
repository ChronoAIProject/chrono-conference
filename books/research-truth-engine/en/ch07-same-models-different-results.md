# Chapter 7: Same Models, Different Results—The Research Operating System

Whenever we put `trureturing`'s audited ledger on screen—**`223,231`** cumulative frozen Lean 4 theorems as of November 27, 2026 (`548388cd`, up `+33%` in seven days), **`2,278`** unique literature resolutions (**`2,276` dated across `81` days from `2026-09-08` to `2026-11-27`**, plus `2` undated; `1,512` proved / `766` refuted, averaging ~`28`/day), and **`720 / 720`** unbroken UTC hours of commit coverage (median `63` commits/hour, `217` merged PRs/day)—almost every room asks the exact same opening question:

**"Are you hiding a secret frontier model nobody else can rent?"**

No. Quite the opposite: **every underlying reasoning engine driving this system is commercially metered and open to anyone on Earth.**

Picture a sharper optical-bench image **(Analogy)**: mount a razor-sharp microscope objective lens with no rigid brass optical bench underneath it, and ordinary floor vibration shakes it so badly that every single photograph smears. Inside an ordinary chat box, the exact same commercial engines emit plausible pseudo-proofs and hand-waving *"it is easy to see"* smears—yet bolted into `trureturing`, they become a one-way discovery ratchet sustaining 720 unbroken UTC hours of commit coverage and ~28 Lean-checked literature resolutions per day across **`81` days**.

Inside that same optical-bench **(Analogy)**, the answer hits the single nail this entire conference drives home: **resolution is never set by an unmounted lens in one chat turn; it is set by the research operating system bolted around it—rigid brass bench, fine micrometer stops, irreversible Truth DAG, executable counterexample gates, and a zero-mercy compiler kernel.**

## Four Load-Bearing Pillars Turning Chat Into a Research Operating System

Dissect `trureturing` beside an ordinary chat session like an experimentalist stripping down two benches, and four non-negotiable pillars stand clear:

1. **Move memory out of volatile chat into an irreversible Truth DAG**: Close a chat window and amnesia wipes the chalkboard clean; `trureturing` freezes every kernel-checked lemma into `Golden/Frozen/state/`, turning **`17,968` frozen modules, `20,223` `.lean` files, and `6.02M` lines of code** into importable steel rebar for every next proof attempt.
2. **Pair formal Information Escape criteria with independent deduplication audits**: As [@thm-ie-recoverable] and [@thm-ie-same-kernel] establish in Chapter 2, the formal criterion separates cuts that genuinely shrink the blind spot from disguised restatements, while repository-level deduplication and ledger audits enforce that discipline operationally instead of mistaking noisy volume for progress.
3. **Bolt massive parallelism inside strict worktree and lint isolation**:
   - `heca` isolates parallel research workers inside dedicated Git worktrees;
   - `chrono-harness` (hosted at `https://github.com/chrono-harness/` across `25` public repos—candidly preserving hardcoded `completeness_proven: false` in its live crates) enforces declarative delta judges;
   - **`StrataLint`'s `23` active static rules** (`27` registered, `4` deferred, in `the-omega-institute/trureturing-tools`) lock axiom and style hygiene at merge time. Together, those three iron fences let `63` median commits/hour and `217` merged PRs/day land without branch collisions or smuggled axioms.
4. **Expose every claim to working outside scholars**:
   - Our earlier `automath` baseline (`49,623` declarations, `18,624` theorems, `7,877 / 12,989` statements matched at `60.6%` as of August 4, 2026) measured natural-language formalization friction head-on;
   - Through November 27, 2026, `trureturing-outreach` (`data @ d22e63c8`) logged **`485` replying scholars** out of `1,049` contacted (`46.2%`; `478 / 1,034` non-system filtered across ~`299` institutional domains and `47` countries), including `316` positive responses (`697` quotes), `223` collaborating (`44` co-authoring, with `177` in proof-checking and `120` in gap-repair), `70` credited/acknowledged, and **`66` declined/stop-outreach requests immediately honored**;
   - Concrete external output now spans `1` *RAIRO-ITA* journal paper, **`17` identity-checked collaborative arXiv preprints (`16` externally coauthored)**, and `21` OEIS entries—paired with our frozen October 31 novelty audit across `1,108` incoming items transparently recording `1.5%` prior settled results and `1.6%` partial overlap.

## Lifting the Hood With Controlled Evidence: `human-in-the-loop-automated-research v1.0`

Slogans prove nothing; controlled measurements settle arguments. On November 27, 2026, `mathesis-papers` published **`human-in-the-loop-automated-research v1.0`** (commit `812c64de9e`), dissecting why unguarded AI research breaks and putting hard empirical gates under the microscope.

Start by naming the failure modes cleanly. Unguarded automation does not fail in just one direction—it triggers twin systemic pathologies compounded by two subtler toxins:

- **Scientific slop**: autonomous pipelines churning out eloquent prose and tidy plots masking broken core derivations;
- **Proof indigestion**: working mathematicians buried under unchecked proof dumps where verification costs exceed writing the proof from scratch;
- **Formal slop & review slop**: the first pads green builds with trivial or shifted formalizations; the second is correlated false-positive rubber-stamping in prose review—even when separate model families critique one another, prose consensus still lets plausible falsehoods walk straight through the gate.

To pin every claim to data rather than rhetoric, the `v1.0` manuscript reports four auditable empirical studies (all blinded scoring strictly run across **three independent frontier model families**):

| Empirical Study | Design | Audited Measurements |
| --- | --- | --- |
| **$N = 30$ Three-Family Blinded Benchmark** | `10` human-in-the-loop (H+AI), `10` unverified human preprints, and `10` autonomous AI papers scored blind across **three independent frontier model families** (`90` evaluations; Kendall $W = 0.828$) | H+AI beats autonomous AI **`260 / 300` (`86.7%`)** pairwise ($p = 0.0012,\; 0.0149,\; 3.2\times 10^{-5}$), compresses score SD **`2.3–4.2×`** vs. unverified human preprints by amputating the fatal-error tail, and backs **`10 / 10`** papers with formal/certified checks vs. **`1 / 10`** human and **`0 / 10`** autonomous AI (**`165`** vs. **`119`** vs. **`1`** theorem blocks) |
| **`20`-Claim Mechanistic Ablation** | Compares single-family prose review, **cross-family adversarial critique** consensus, and adding an **executable counterexample obligation gate** | Even cross-family prose consensus leaves **`20%`** correlated false-positive "review slop"; adding an **executable counterexample obligation gate** slashes FPR from **`30%` → `0.0%`**, reaching **`100%` precision, `94.7%` F1, and `95.0%` accuracy** (Fisher exact $p = 0.000119$) |
| **`24,925`-PR Admission-Gate Audit** | Audits pre-admission rejection across all `24,925` PRs and repair rounds across the latest `1,000` merged PRs | **`8.0%`** (`1,995`) closed unmerged pre-admission; **`59.6%`** (`557 / 935`) of the latest `1,000` merged PRs required multi-commit repair under automated gates (median **`31.9 min`**) |
| **`33`-Hour Instrumented Research Trace** | Logs every human intervention and machine formalization/refutation event across `33` continuous hours | Just **`31` brief human messages** (~`1,730` Chinese characters total) steered **`6` Lean 4 units** to completion while preserving **`52` early refutations** that killed dead ends before prose could metastasize |

Read rows two and three twice; they strike the anvil clean through:

- **Prose voting cannot kill correlated error.** Even when **three independent frontier model families** cross-examine a draft blind, one-fifth of defective claims still slip past prose consensus because they read smoothly. Only shifting the burden onto an **executable counterexample obligation gate** drives false positives cleanly from `30%` down to `0.0%`.
- **Admission gates are not theater—they catch fire every hour.** Nearly six out of ten PRs that ultimately merge fail on their first pass; mechanical gates force iterative multi-commit repair long before a bad lemma can reach `548388cd`.
- **Humans supply the rudder, not the oars.** Thirty-one terse messages totaling under two thousand characters over thirty-three hours kept six Lean 4 units on course and banked fifty-two early refutations as protective rails.

And in keeping with this volume's rule against self-deception, we print all **four self-reported limitations** disclosed inside the `v1.0` manuscript itself without softening a syllable:

1. **No randomized no-gate live control arm**: a live theorem repository cannot deliberately let unverified proofs corrupt `main` for an A/B test, so the PR audit is observational production telemetry rather than a randomized trial;
2. **Non-identical autonomous benchmark genre**: the autonomous AI comparator set comes from an external benchmark whose article genre differs from open-literature problem resolutions;
3. **`36k`-character evaluation context window**: blinded scoring read up to `36k` characters per manuscript rather than ingesting arbitrary multi-megabyte appendices or full Lean trees;
4. **One logged typing miss (`ab_17`)**: inside the `20`-claim ablation, the gate recorded one real typing-level miss (`ab_17`), preserved verbatim in the public artifact for external audit.

## Open Frontiers We Refuse to Paper Over

If this research operating system had already solved everything, science would be dead. Naming two wide-open frontiers squarely at the close of this volume is the highest tribute we can pay to the logic ratchet:

::: {.problem #prob-automath-horizon title="Open Frontier: Deep Conceptual Invention and Full Literature Auto-Formalization"}
First, on deep cross-domain frontiers such as Extended/Grand RH, zero simplicity, and pair correlation ([@prob-rh-open]) that demand wholly new conceptual bridges, what missing structural mechanisms separate today's proof search and information-escape guidance from autonomous invention of genuinely new mathematical theories? Second, across natural-language mathematical literature—especially the dense, context-laden ~40% of statements beyond `automath`'s `60.6%` match rate—how can human statement-fidelity auditing drop in friction without sacrificing a shred of faithfulness? Both frontiers remain actively open.
:::

## Build-Generated Formal Verification Summary

Before turning to [Appendix A](appendix-a-live-verification-playbook.md) to run the five-step `lake build` playbook on your own machine, inspect the build-generated summary of **all 25 frozen Lean 4 theorems** (`24` green plus `1` official blue zero-axiom theorem `d2_eq_zero_iff`, alongside `all_degree_peter_weyl_orthonormal` zero-axiom on bare-CIC `strict_omega`) and open frontiers cited across this monograph (pinned directly to commit [{commit}](trureturing:), `548388cd`, November 27, 2026):

::: {.stats src="summary"}
:::

Nietzsche measured the strength of a spirit by how much truth it could endure without flinching. We place all of our source files, every green badge, every stark `0`, every logged miss and limitation, and every glowing red open frontier squarely before your compiler. **Do not trust our enthusiasm—trust your own `lake build`.**
