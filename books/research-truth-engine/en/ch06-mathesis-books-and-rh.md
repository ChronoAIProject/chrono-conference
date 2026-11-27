# Chapter 6: Mathesis, Monographs, and Sharded Riemann Hypothesis Replay

Welding a theorem into the Lean 4 kernel finishes only half the work of science. A typechecker proves without mercy that a deduction has zero cracks, yet a typechecker will not hand you physical intuition or stitch two hundred thousand lemmas into a book a working mathematician actually wants on their desk.

Across `The Omega Institute`'s publishing ecosystem, three bridges carry kernel truth into human circulation: the open paper portal **`Mathesis`**, the continuously published bilingual monograph library **`trureturing-books` (`books.trureturing.org`)**, and the industrial sharded replay suite **`the-omega-institute/riemann-hypothesis`** (paired with its bilingual companion book **`riemann-hypothesis-book`**). One iron law rules all three—**never blur the three evidence tiers, and never blur attribution.**

::: {.figure src="ch06-three-evidence-tiers"}
**Three Epistemic Evidence Marks.** Stacked top to bottom: top green `LEAN ✓` (kernel checked) belongs strictly to frozen Lean 4 `theorem` declarations resolved in `trureturing.lock.json` (`223,231` theorems in the Nov 27, 2026 `548388cd` snapshot); middle violet (`Written proof`) marks source-backed prose arguments paired with a DOI or source repository and a formalization request; bottom red `OPEN` isolates genuinely unproved frontiers—including Extended/Grand RH, simplicity of zeros, pair correlation, and `trureturing`'s internal universal Hankel sign assertion.
:::

## Mathesis, `mathesis-papers`, and the Outreach Ledger: Putting `0` on Page One

As of November 27, 2026, the open publication organization **`https://github.com/mathesis-papers`** hosts **`236` repositories** (`235` public, `1` private), while the live Mathesis portal (`papers.trureturing.org` / `mathesis-omega-research.apps.chrono-ai.fun`) serves **`225` collected papers** (`224` linked directly to Lean formal source and `225` PDFs; the org catalog snapshot tracks `224` public paper repositories, `1,528` registered formal statements, `217` DOIs, alongside the `human-in-the-loop-automated-research` methodology manuscript).

Now write the number most launch decks would bury in fine print straight across the center of the chalkboard: as of November 27, 2026, **formal peer-review acceptances through Mathesis's own review pipeline stand at `0`** (`mathesis.accepted = 0`, `mathesis.collected = 225`).

Why print a stark `0` inside a flagship monograph? Because Feynman's rule against fooling yourself admits no exceptions: rebranding open source-backed preprints as peer-reviewed journal acceptances is the cheapest insult one can offer working scientists. Standing directly beside that `0` is the complete external scholarly ledger (`trureturing-outreach@d22e63c8`, November 27, 2026), every debit and credit intact:

- **`1,049` scholars contacted, `485` replied (`46.2%`)** top-line (`1,034` contacted / `478` replied after non-system filtering, spanning ~**`299` institutional domains** and **`47` countries**);
- **`316` positive responses** (`697` recorded quotes), **`223` active collaborations** (**`44` co-authoring**), and **`70` explicitly credited**;
- **`66` declined or requested stop-outreach**—recorded openly right beside the wins, never painted green;
- Concrete scholarly outputs to date: **`1` published journal paper** (*RAIRO-ITA* 60, 29), **`15` public arXiv preprints**, and **`21` OEIS entries** (newly adding `A024718`, `A048585`, and `A392984`).

## `trureturing-books`: Three Continuously Published Bilingual Monographs

The four-volume launch edition in your hands runs on **`trureturing-books-template v1.26.0`**, the same open-source publishing engine powering **`the-omega-institute/trureturing-books`** (PR `#1,556`, `415` preview release assets as of November 28, 2026). On `https://books.trureturing.org/`, that engine continuously publishes three living bilingual monographs:

| Continuously Published Monograph | Chapters / Lang | Interactive Labs | Explainer Films | Notes / Persistent Identifier |
| --- | --- | --- | --- | --- |
| `quantum-geometry` | `304` | `130` | `48` | DOI `10.5281/zenodo.24156135` |
| `omega-math` | `23` | `4` | `19` | Source-only bilingual pipeline |
| `omega-unification` | `20` | `1` | `16` | Source-only bilingual pipeline |
| **Combined Total** | **`347` bilingual ch (`694` zh/en)** | **`135` labs** | **`83` films** | **`2,017` frozen Lean 4 theorems directly cited** |

Every volume enforces the same unforgiving build hygiene: source-only Git commits with computed figures materialized across dark, light, mobile, and print themes, interactive laboratories emitting per-card print stills, deterministic canvas explainer films, strict zh/en structural parity, and automated `statement_id` digest checks on every lock bump.

## Riemann Hypothesis Provenance, 8,490-Shard Replay, and the True Red Frontier

Nowhere across our repositories is surgical precision more non-negotiable than around the **Riemann Hypothesis**. Sloppy phrasing here would either erase another mathematician's triumph or blur which repository does what. Keep all five verified layers cleanly separated:

1. **External Breakthrough & Unstinting Credit (November 20–21, 2026)**: On November 20–21, 2026, the Lean and Mathlib communities certified **Levent Alpöge's** Lean `4.33.1` proof of Mathlib's classical `RiemannHypothesis` and Dirichlet GRH (`175,187` modules, `17.37M` lines, strictly standard axioms `[propext, Classical.choice, Quot.sound]`, mirrored in `Deicyde/riemann-hypothesis` and `leanprover-community/riemann-hypothesis`). **Give credit radically and without qualification**: that historic proof belongs to Levent Alpöge and the Lean/Mathlib community—`The Omega Institute` did **not** author it.
2. **`the-omega-institute/riemann-hypothesis` (`c2dabc97`) — The `8,490`-Shard Reproducible Replay**: A 17-million-line formal proof is too large for an individual scientist to trust on hearsay. `The Omega Institute` engineered `the-omega-institute/riemann-hypothesis` to split that certified proof into **`8,490` content-addressed shards** backed by reproducible CI and a standalone `./verify` replay pipeline (`8,558` `.tar.zst` release assets) so any standard workstation can independently sample and verify shards.
3. **`the-omega-institute/riemann-hypothesis-book` (`ebd24a4d`) — The Bilingual Companion Monograph**: This separate repository publishes *Symmetry on the Critical Line*, a bilingual human-readable guide to the proof's mathematical architecture. **The `8,490` replay shards live in `riemann-hypothesis`, never in `riemann-hypothesis-book`.**
4. **Inside `trureturing` Itself (`ActualXiIntegerCriterion.lean`)**: Independently inside `trureturing`'s own tree, [@thm-rh-hankel] freezes strictly an **integer Hankel equivalence** between Mathlib's `RiemannHypothesis` and nonnegativity of all finite-degree integer Hankel forms built from `xiOdd`—it does **not** prove either side internally or import the external proof.
5. **What Genuinely Remains `OPEN` (RED) in [@prob-rh-open]**: Even with classical `RiemannHypothesis` and Dirichlet GRH Lean-certified, the deeper analytic frontier immediately ahead remains blazing red—**Extended RH** (general Dedekind zeta functions over algebraic number fields), **Grand RH** (general automorphic $L$-functions), **simplicity of nontrivial zeros**, **pair correlation** (Montgomery's conjecture), and proving the universal all-degree integer Hankel sign assertion natively inside `trureturing` without importing an external proof.

First inspect the green equivalence bridge frozen inside `trureturing`:

::: {.theorem #thm-rh-hankel title="Equivalence Between the Riemann Hypothesis and Actual-$\xi$ Integer Hankel Nonnegativity" lean="D5/S3/Zeros/Resolvent/ActualXiIntegerCriterion.rh_iff_actual_xi_integer_hankel_nonnegative"}
Standard Mathlib `RiemannHypothesis` holds if and only if for every degree $N \in \mathbb{N}$ and every integer vector $u : \mathrm{Fin}\,(N + 1) \to \mathbb{Z}$, the Hankel form built from the real Taylor coefficients $\mathrm{xiCoefficient}$ of the shifted odd log-derivative `xiOdd` is nonnegative:
$$
\mathrm{RiemannHypothesis}
\iff
\forall (N : \mathbb{N})\,\forall (u : \mathrm{Fin}\,(N+1) \to \mathbb{Z}),\;
0 \le \sum_{a=0}^{N} \sum_{b=0}^{N} u_a\, u_b\, \mathrm{xiCoefficient}(a + b).
$$
Note: this theorem asserts logical equivalence only; it does **not** assert either side unconditionally inside `trureturing`.
:::

::: proof
The forward direction restricts `actual_xi_hankel_nonnegative_of_rh` from real vectors to integer vectors. The converse proceeds by contradiction via `actual_xi_integer_negative_of_not_rh`: assuming $\neg\,\mathrm{RiemannHypothesis}$ yields some finite degree $N$ and integer vector $u : \mathrm{Fin}\,(N+1) \to \mathbb{Z}$ where the Hankel form is strictly negative. Verified and frozen by the Lean 4 kernel in [`rh_iff_actual_xi_integer_hankel_nonnegative`](lean:D5/S3/Zeros/Resolvent/ActualXiIntegerCriterion.rh_iff_actual_xi_integer_hankel_nonnegative).
:::

Immediately beside green [@thm-rh-hankel], therefore, stands the unmistakable red frontier of what remains genuinely open after classical RH:

::: {.problem #prob-rh-open title="Open Frontiers Beyond Classical RH: Extended/Grand RH, Zero Simplicity, and Pair Correlation"}
Following the Lean and Mathlib communities' November 20–21, 2026 certification of Levent Alpöge's Lean `4.33.1` proof of classical `RiemannHypothesis` and Dirichlet GRH (for which `the-omega-institute/riemann-hypothesis` provides `8,490`-shard reproducible replay), four major frontiers remain completely open:

1. **Extended Riemann Hypothesis (ERH)**: whether all nontrivial zeros of Dedekind zeta functions over arbitrary algebraic number fields lie on $\operatorname{Re}(s) = \frac{1}{2}$;
2. **Grand Riemann Hypothesis (GRH)**: the critical-line distribution of nontrivial zeros for general automorphic $L$-functions;
3. **Simplicity of zeros and pair correlation**: whether every nontrivial zero of $\zeta(s)$ is simple, together with Montgomery's pair-correlation conjecture;
4. **Native internal assertion inside `trureturing`**: proving the universal all-degree integer Hankel nonnegativity on the right-hand side of [@thm-rh-hankel] directly inside `ActualXiIntegerCriterion` without importing an external proof.
:::

Printing Mathesis's `0` on page one, crediting another mathematician's breakthrough cleanly while claiming only the sharded verification machinery we built, and marking the true open frontier in stark red—that stubborn honesty is the sole foundation giving green `LEAN ✓` badges their weight.

One decisive question remains for Chapter 7: **if anyone on Earth can rent the same frontier reasoning engines by the token, why do ordinary chat windows churn out fluent hallucinations while `trureturing` carved out `2,278` unique Lean-checked literature resolutions (`2,276` dated across 81–82 days plus `2` undated)?**
