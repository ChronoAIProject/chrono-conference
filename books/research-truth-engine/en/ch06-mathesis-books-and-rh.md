# Chapter 6: Mathesis, Monographs, and Sharded Riemann Hypothesis Replay

Locking a theorem inside the Lean 4 kernel finishes only the first half of scientific communication. A typechecker certifies without mercy that a deduction has no cracks, yet a typechecker will not build intuition or weave a hundred and sixty thousand lemmas into a monograph a working mathematician actually wants to read.

Across `The Omega Institute`'s publishing ecosystem, three bridges connect the cold kernel to the human community: the open paper portal **`Mathesis`**, the bilingual monograph library **`books.trureturing.org`**, and the sharded kernel-replay engineering of **`riemann-hypothesis-book`**. One iron discipline binds all three together—**never blur the three evidence tiers.**

::: {.figure src="ch06-three-evidence-tiers"}
**Three Epistemic Evidence Marks.** Stacked top to bottom: top green `LEAN ✓` (kernel checked) belongs strictly to frozen Lean 4 `theorem` declarations resolved in `trureturing.lock.json` (`167,819` theorems in the Nov 20, 2026 snapshot); middle violet (`Written proof`) marks source-backed prose arguments paired with a DOI or source repository and a formalization request; bottom red `OPEN` isolates unproved conjectures and open problems, including the Riemann Hypothesis's universal sign assertion.
:::

## Mathesis and `mathesis-papers`: Putting the Peer-Review Count on Page One

As of November 27, 2026, the open publication pipeline `mathesis-papers` (served via `mathesis-omega-research.apps.chrono-ai.fun`) collects **212 open source-backed papers** (`212` public paper repositories in the broader org catalog, `211` carrying Lean source, `207` with DOIs, `1,480` registered statements); `211` of them ship runnable formal Lean artifacts beside their text rather than an uncheckable PDF alone.

Now put the number most press releases would bury straight onto the chalkboard: as of November 27, 2026, **the number of papers accepted through Mathesis's own peer-review pipeline is `0`** (`mathesis.accepted = 0`, `mathesis.collected = 212`).

Why print a stark `0` inside a launch monograph? Because Feynman's rule against fooling yourself is not optional: disguising open source-backed preprints as peer-reviewed journal acceptances is the cheapest insult one can offer working scientists. Alongside that figure sits the complete outreach ledger as of November 8, 2026: **838** scholars contacted, **440** replied (`53%`) across **273 institutions** and **46 countries**, with **294** positive responses, **223** collaborative exchanges, **44** active co-authoring tracks, **1** published journal paper (*RAIRO-ITA* 2026), and public co-authored preprints—recorded side by side with **64** polite refusals—plus **18 OEIS entries** logged by November 20, 2026.

## Bilingual Monographs and Source-Only Publishing

The four-volume conference edition you are reading right now runs on `the-omega-institute/trureturing-books-template` (`v1.26.0`), the exact open-source publishing engine powering the three flagship bilingual monographs on `https://books.trureturing.org/` (`quantum-geometry`, `omega-math`, `omega-unification`). Every book built on this template enforces:

- Source-only Git hygiene (computed Python figures materialized for dark/light/mobile/print themes, interactive labs generating per-card print stills, deterministic canvas explainer films);
- Strict bilingual parity across every theorem environment, `#id`, `lean` citation, and media sequence;
- Automated `statement_id` hash auditing on every lock bump so prose can never drift silently away from frozen Lean source.

## Sharded Replay on the Riemann Hypothesis: Frozen Equivalence vs. Stark Red Frontier

Nowhere in our repositories is surgical clarity more necessary than around the **Riemann Hypothesis** and the **`riemann-hypothesis-book`** replay project.

Keep two completely separate facts razor-sharp:

1. **What Lean 4 has frozen is an *equivalence criterion***: the frozen theorem below proves that standard Mathlib `RiemannHypothesis` holds if and only if all finite-degree integer Hankel quadratic forms built from the real Taylor coefficients of the shifted odd log-derivative `xiOdd` are nonnegative; meanwhile, `riemann-hypothesis-book` splits large formal replay chains into **8,490 content-addressed shards** so any standard workstation can independently sample and verify segments.
2. **What remains completely unproved is the universal all-degree sign assertion—the Riemann Hypothesis itself**: the Lean source header says it in plain English (`The universal all-degree sign assertion remains unproved`). An equivalence never proves either side.

::: {.theorem #thm-rh-hankel title="Equivalence Between the Riemann Hypothesis and Actual-$\xi$ Integer Hankel Nonnegativity" lean="D5/S3/Zeros/Resolvent/ActualXiIntegerCriterion.rh_iff_actual_xi_integer_hankel_nonnegative"}
Standard Mathlib `RiemannHypothesis` holds if and only if for every degree $N \in \mathbb{N}$ and every integer vector $u : \mathrm{Fin}\,(N + 1) \to \mathbb{Z}$, the Hankel form built from the real Taylor coefficients $\mathrm{xiCoefficient}$ of the shifted odd log-derivative `xiOdd` is nonnegative:
$$
\mathrm{RiemannHypothesis}
\iff
\forall (N : \mathbb{N})\,\forall (u : \mathrm{Fin}\,(N+1) \to \mathbb{Z}),\;
0 \le \sum_{a=0}^{N} \sum_{b=0}^{N} u_a\, u_b\, \mathrm{xiCoefficient}(a + b).
$$
Note: this theorem asserts logical equivalence only; it does **not** assert either side unconditionally.
:::

::: proof
The forward direction restricts `actual_xi_hankel_nonnegative_of_rh` from real vectors to integer vectors. The converse proceeds by contradiction via `actual_xi_integer_negative_of_not_rh`: assuming $\neg\,\mathrm{RiemannHypothesis}$ yields some finite degree $N$ and integer vector $u : \mathrm{Fin}\,(N+1) \to \mathbb{Z}$ where the Hankel form is strictly negative. Verified and frozen by the Lean 4 kernel in [`rh_iff_actual_xi_integer_hankel_nonnegative`](lean:D5/S3/Zeros/Resolvent/ActualXiIntegerCriterion.rh_iff_actual_xi_integer_hankel_nonnegative).
:::

Standing immediately beside green [@thm-rh-hankel], therefore, is an unmistakable red open-problem box:

::: {.problem #prob-rh-open title="The Riemann Hypothesis Remains Open"}
Is `RiemannHypothesis` true—equivalently, are all finite-degree integer Hankel forms in [@thm-rh-hankel] nonnegative for every $N \in \mathbb{N}$ and every $u : \mathrm{Fin}\,(N+1) \to \mathbb{Z}$? This universal assertion remains completely open; any claim that an equivalence criterion or sharded replay framework proves the Riemann Hypothesis is false.
:::

That stubborn honesty is the only thing that gives green Lean kernel badges their weight. If a lab lacks the spine to print *"still open"* in bold red, nothing it prints in green deserves your trust.

One central question remains for Chapter 7: **if everyone on Earth can rent the same frontier reasoning models, why do most setups generate fluent hallucinations while `trureturing` carved out 2,128 unique Lean-checked literature resolutions (2,126 dated across 74 days plus 2 undated)?**
