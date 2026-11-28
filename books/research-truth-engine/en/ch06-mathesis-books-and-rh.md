# Chapter 6: Mathesis, Monographs, and Sharded Riemann Hypothesis Replay

Welding a theorem into the Lean 4 kernel finishes only half the work of science. A typechecker proves without mercy that a deduction has zero cracks, yet a typechecker will not hand you physical intuition or stitch two hundred thousand lemmas into a book a working mathematician actually wants on their desk.

Across `The Omega Institute`'s publishing ecosystem, three bridges carry kernel truth into human circulation: the open paper portal **`Mathesis`**, the continuously published bilingual monograph library **`trureturing-books` (`books.trureturing.org`)**, and the industrial sharded replay suite **`the-omega-institute/riemann-hypothesis`** (paired with its bilingual companion book **`riemann-hypothesis-book`**). One iron law rules all three—**never blur the three evidence tiers, and never blur attribution.**

::: {.figure src="ch06-three-evidence-tiers"}
**Three Epistemic Evidence Marks.** Stacked top to bottom: top green `LEAN ✓` (kernel checked) belongs strictly to frozen Lean 4 `theorem` declarations resolved in `trureturing.lock.json` (`223,231` theorems in the Nov 27, 2026 `548388cd` snapshot); middle violet (`Written proof`) marks source-backed prose arguments paired with a DOI or source repository and a formalization request; bottom red `OPEN` isolates genuinely unproved frontiers—including Extended/Grand RH, simplicity of zeros, pair correlation, and `trureturing`'s internal universal Hankel sign assertion.
:::

## Mathesis, `mathesis-papers`, and the Outreach Ledger: Putting Double-Zero Honesty on Page One

As of **`2026-11-27T21:31Z`** (`catalog@293dc68c37`), the open publication organization **`https://github.com/mathesis-papers`** has grown to **`237` repositories (`236` public)** powering **`225` public collected papers** on `Mathesis` (`papers.trureturing.org`). Open the full inventory drawer:

- **Source bindings, persistent DOIs, and multi-format editions**: across those `225` public collected papers sit **`224` pinned Lean links**, **`218` Zenodo DOIs**, and **`1,534` registered statements**, flanked by **`60` bilingual reading editions**, **`43` slide decks**, and **`42` explainer videos**;
- **Open protocol for humans and research agents**: the organization logs **`756` shared formalization requests** and **`138` merged PRs**; `mathesis` OpenAPI **`v1.3.0`** exposes **`77` paths** with machine-readable `/skill.md`, `/llms.txt`, and `mathesis-contribute` onboarding, while PRs `#157–#159` opened prose theoretical and versioned methodology publishing (housing the `human-in-the-loop-automated-research v1.0` audit dissected in Chapter 7);
- **Four concrete November 27 shelf entries**: to ground abstract totals in real mathematics, the same single day landed `hagele-2026-refined-bmv-33-all-dimensions`, `lagarias-sun-2024-supernorm-size-asymptotic`, `peng-zero-dimensional-shadowing-extension`, and `su-hu-2026-minimum-rectangular-size` (proving exact minimum rectangular size **`81`**).

Now write the numbers most launch decks would bury in a footnote straight across the center of the chalkboard—not one `0`, but **double-zero honesty**:

1. **Formal peer-review acceptances through Mathesis's own review pipeline stand at `0`** (`mathesis.accepted = 0`, `mathesis.collected = 225`);
2. **Independent Mathesis verifier receipts stand at `0 / 1,534`**.

Why stamp both zeros onto page one? Because in science, blurred categories rot everything they touch: **a paper-level Lean source link is not an independent verifier receipt, and a posted source-backed preprint is never peer review.** Standing cleanly behind two honest zeros beats painting half-built infrastructure green.

Standing directly beside those zeros is the complete external scholarly ledger (`trureturing-outreach`, `data @ d22e63c8`, November 27, 2026), every debit and credit intact:

- **`1,049` scholars contacted, `485` replied (`46.2%`)** top-line (`1,034` contacted / `478` replied after non-system filtering, spanning ~**`299` institutional domains** and **`47` countries**);
- **`316` positive responses** (`697` recorded quotes), **`223` collaborating** (including **`44` co-authoring**, alongside `177` engaged in proof-checking and `120` in gap-repair), and **`70` credited/acknowledged**;
- **`66` declined/stop-outreach requests immediately honored**—recorded openly right beside the wins, never quietly swept away;
- Concrete scholarly outputs to date: **`1` published journal paper** (*RAIRO-ITA* 60, 29), **`17` identity-checked collaborative arXiv preprints (`16` externally coauthored)**, and **`21` OEIS entries** (newly adding `A024718`, `A048585`, and `A392984`).

## `trureturing-books`: The Continuously Published Bilingual Trilogy

The four-volume launch edition in your hands runs on **`trureturing-books-template v1.26.0`**, the same open-source publishing engine driving **`the-omega-institute/trureturing-books`** (`https://books.trureturing.org/`). At live **`main b83ae321`** (`2,284` commits, `1,169` merged PRs), that trilogy spans **`~1.99M` Chinese Han characters and `~1.59M` English words** across **`344` bilingual pages per language (`688` total)**, backed by **`283` Python figure scripts**, **`135` interactive labs (`847` `.viz` cards)**, **`83` explainer films (including `3` feature-length >`120 MB` MP4s)**, and **`93` reader-facing preview Release assets**.

Beneath the prose sits dense formal steel: the trilogy embeds **`918` Lean-verified theorem blocks** resolving to **`2,043` unique frozen GIDs** at `548388cd`—including **`132` bare-CIC zero-axiom `strict_omega` theorems** and **`22` official `axioms: []` theorems** that touch neither classical choice nor propositional extensionality. Along Auric's three-book narrative arc, each volume carries a distinct job:

| Monograph & Trilogy Role | Labs & Films | Scale, Key Anchors & Zero-Axiom Boundaries |
| --- | --- | --- |
| **`quantum-geometry`** (`ORTHO//QUANTUM`) · **Compass**: orienting from discrete observation geometry | `130` labs, `48` films | DOI `10.5281/zenodo.24156135` |
| **`omega-math`** (`OMEGA//MATH`) · **Zero-Axiom Rational Hull** | `4` labs, `19` films | Bare-CIC constructive core spine |
| **`omega-unification`** (`OMEGA//UNIFY`) · **Deep-Water Sounding Log** | `1` lab, `16` films | Frontispiece `4/4` model-internal · `0/4` zero-fit |
| **Live Trilogy Total** (`main` `b83ae321`) | `135` labs (`847` `.viz` cards), `83` films (`3` feature >`120 MB` MP4s) | `344` bilingual pages/lang (`688` total; `~1.99M` Han chars / `~1.59M` English words); `918` theorem blocks / `2,043` frozen GIDs (`132` bare-CIC zero-axiom, `22` `axioms: []`); `283` figure scripts, `93` preview assets |

To see what that "Zero-Axiom Rational Hull" looks like up close, inspect two flagship frozen theorems lifted straight from the `omega-math` spine. The first renders inside an automatic **blue** zero-axiom frame:

:::: {.theorem #thm-omega-simplicial-exact title="Zero-Axiom Simplicial Poincaré Lemma: Closed 2-Cochains Are Exact" lean="D5/S3/Quantum/AURICOmega/OmegaSimplicialExactness.d2_eq_zero_iff"}
For any vertex type $V$, additive abelian group structure `G : AddCommGroup A` obeying `laws : G.Laws`, chosen base vertex `base : V`, and degree-two simplicial cochain `F : C2 V A`, pointwise closedness and exactness are equivalent:
$$
(\forall x, y, z, w,\; d_2\, G\, F\, x\, y\, z\, w = G.\mathrm{zero})
\iff
(\exists\, e : C^1(V, A),\; \forall x, y, z,\; d_1\, G\, e\, x\, y\, z = F\, x\, y\, z).
$$
::::

::: {.proof}
In [`d2_eq_zero_iff`](lean:D5/S3/Quantum/AURICOmega/OmegaSimplicialExactness.d2_eq_zero_iff), the reverse direction follows directly from the pointwise coboundary identity `d2_d1`, while the forward direction uses the explicit constructive cone homotopy $d_1(H_2(\mathrm{base}, F)) + H_3(\mathrm{base}, d_2 F) = F$ (`d1_H2_add_H3_d2`) to produce the primitive $e = H_2(\mathrm{base}, F)$ with zero non-constructive steps. Crucially, this theorem depends on **literally zero axioms (`axioms: []`) on BOTH official Lean (`Init + OmegaMath`) and bare-CIC `strict_omega`**—not even `Classical.choice`, `Quot.sound`, or `propext`—which is why `tbook` automatically turns this theorem box **blue** instead of green.
:::

Now step one inch further along the same hull to see why reporting exact axiom footprints per kernel matters just as much as zero-axiom construction itself:

:::: {.theorem #thm-omega-peter-weyl title="All-Degree Peter–Weyl Spherical Haar Orthonormality Without π, ℝ, or Choice" lean="D5/S3/Quantum/AURICOmega/OmegaSphericalHaarMidpoint.all_degree_peter_weyl_orthonormal"}
For all natural-number degrees $m, n : \mathbb{N}$, the even character polynomials `evenCharPoly m` and `evenCharPoly n` satisfy exact rational spherical Haar orthonormality under `IntRatio.Equivalent`:
$$
\forall m, n : \mathbb{N},\; \mathrm{Equivalent}\bigl(\mathrm{haarInner}(\mathrm{evenCharPoly}\,m,\, \mathrm{evenCharPoly}\,n),\; \mathrm{degreeDelta}\,m\,n\bigr).
$$
::::

::: {.proof}
In [`all_degree_peter_weyl_orthonormal`](lean:D5/S3/Quantum/AURICOmega/OmegaSphericalHaarMidpoint.all_degree_peter_weyl_orthonormal), the purely algebraic proof first expands the product `(evenCharPoly m).mul (evenCharPoly n)` into the inclusive sum of even characters from $|m - n|$ to $m + n$ (`evenChar_product_sum`), then applies the factorial moment functional `haarKappaPoly` (`haar_evenChar_expectation`, which maps degree $0$ to $1$ and every positive even degree to $0$)—recovering `degreeDelta m n` without ever introducing $\pi$, $\mathbb{R}$, or real integration. Reporting the **dual-backend axiom footprint** with surgical honesty: on official Lean (`Init + OmegaMath`), this declaration uses **`propext` only** (zero `Classical.choice`, zero `Quot.sound`, zero $\pi$, zero $\mathbb{R}$), so `tbook` renders an honest **green** badge rather than blue; on the bare-CIC **`strict_omega`** kernel (`OmegaInit + OmegaMath`), the exact same statement verifies with **`axioms: []`** (zero axioms).
:::

Next, pause over the epigraph carved across the front of **`omega-unification` (`OMEGA//UNIFY`)**—the sharpest sentence in the entire library:

> **`"4/4 model-internal · 0/4 zero-fit first-principles closure"`**—*Why Zero-Completion Is Stronger Than a Fake Grand Unification*.

In theoretical physics and popular science alike, the cheapest temptation is smuggling three or four free fitting parameters under the rug and declaring a "first-principles Theory of Everything." `omega-unification` does the opposite: where all four model-internal channels close cleanly, it marks **`4/4`**; where zero channels achieve genuine zero-fit first-principles closure against nature, it stamps **`0/4`** across the cover. When a sounding lead has not hit bottom, reporting "no bottom yet" beats drawing a fake seabed every single time.

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
2. **Grand Riemann Hypothesis (Grand RH)**: the critical-line distribution of nontrivial zeros for general automorphic $L$-functions;
3. **Simplicity of zeros and pair correlation**: whether every nontrivial zero of $\zeta(s)$ is simple, together with Montgomery's pair-correlation conjecture;
4. **Native internal assertion inside `trureturing`**: proving the universal all-degree integer Hankel nonnegativity on the right-hand side of [@thm-rh-hankel] directly inside `ActualXiIntegerCriterion` without importing an external proof.
:::

Printing Mathesis's double zeros (`0` acceptances and `0 / 1,534` independent verifier receipts) alongside `omega-unification`'s `0/4` zero-fit closure on page one, crediting another mathematician's breakthrough cleanly while claiming only the sharded verification machinery we built, and marking the true open frontier in stark red—that stubborn honesty is the sole foundation giving green `LEAN ✓` badges their weight.

One decisive question remains for Chapter 7: **if anyone on Earth can rent the same frontier reasoning engines by the token, why do ordinary chat windows churn out fluent hallucinations while `trureturing` carved out `2,278` unique Lean-checked literature resolutions (`2,276` dated across `81` days from `2026-09-08` to `2026-11-27`, plus `2` undated)?** Chapter 7 opens the hood with controlled experiments.
