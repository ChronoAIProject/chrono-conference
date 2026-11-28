# Chapter 4: 2,278 Literature Problems—Flagship Proofs and Refutations

The worst way to grade a research engine is on final exams it wrote for itself. The only honest test is to throw it straight into the open ocean of published literature—where physicists, combinatorialists, and number theorists left explicit *Open Problems*, *Conjectures*, and *Question 1* at the backs of real papers.

Across **`81` calendar days (`2026-09-08` to `2026-11-27`)** at `the-omega-institute/trureturing@548388cd`, `trureturing` logged **`2,276` dated literature resolutions** (plus `2` undated entries, totaling **`2,278`** unique resolutions: **1,512 proved** and **766 refuted**, averaging ~**28 per day**; out of **`2,305`** tracked dossiers, **`27`** remain explicitly logged as unresolved).

Notice the weight of those **`766` refutations**: **a prover that only flatters existing conjectures is a yes-man; a genuine ratchet snaps false idols.** Whether cracking the Fredkin integer ceiling at the fourth decimal place (`2.00034… > 2`) or severing universal Jordan compatibility at dimension $d = 4$, an exact counterexample carries every ounce of dignity that the five positive proofs below do. Split all 2,278 resolutions (and 2,305 dossiers) by published source, and the footprint spans five distinct arenas:

::: {.figure src="ch04-resolution-velocity"}
**Source and Verdict Breakdown of 2,278 Resolved Literature Problems (November 27, 2026 `548388cd` frozen snapshot).** Cyan bars show proofs (`1,512` total) and magenta bars show refutations (`766` total; `2,305` dossiers tracked, `27` unresolved): arXiv (`465` proved / `375` refuted; `860` dossiers), OEIS (`677` / `52`; `732`), peer-reviewed journals (`358` / `326`; `687`), Erdős problems (`1` / `3`; `5`), and other literature (`11` / `10`; `21`). Quantum information and physics account for `598` resolutions (`314` proved, `284` refuted); `127` stood open for at least ten years (`478` for at least three years), up to `47` years.
:::

Aggregate bars show the skyline; mathematicians trust only **individual theorems laid bare on the workbench**. Below stand **seven flagship literature proofs and refutations** spanning *Phys. Rev. A*, *Phys. Lett. A*, *Nat. Commun.*, *JCTA*, and *Commun. Math. Phys.*, crowned at the close of this chapter by **one live November 27, 2026 theorem uniquely selecting 4D spacetime** (eight frozen theorems in all)—each bolted to a build-generated green Lean declaration you can click straight into Lean source right now.

## Refutation 1: Four-Qubit Fredkin Gate Exceeds 2 ebits (*Phys. Rev. A* 2025)

In 2025, Qiu, Song, and Chen (`arXiv:2410.15253`, *Phys. Rev. A*) studied the entangling power—the supremum over admissible product inputs carrying local ancillas—of the four-qubit controlled-swap (Fredkin) gate $F_4$ across the `AD:BC` bipartition and conjectured that the ceiling is cleanly $2$ ebits (`claim : entanglementGeneration = 2`).

A tidy integer ceiling—until tapped with the rational-matrix hammer, where it fractures in the fourth decimal place: `trureturing` built an explicit admissible product input with local ancillas whose reduced state conjugates to an exact rational matrix, certified its spectrum via kernel `decide`, and proved with pinned logarithm bounds that it generates approximately `2.00034…` ebits (strictly exceeding $2$), refuting the conjecture outright.

::: {.theorem #thm-fredkin-refutation title="Refutation of the Four-Qubit Fredkin Entangling-Power Conjecture" lean="D5/S3/Quantum/Entanglement/FredkinEntanglingPowerRefutation.result"}
The conjecture `claim` of Qiu–Song–Chen (`arXiv:2410.15253`) that the four-qubit Fredkin gate's entangling-power supremum across `AD:BC` (with local ancillas) equals $2$ ebits is false: $\neg\,\mathrm{claim}$.
:::

::: proof
In [`FredkinEntanglingPowerRefutation.result`](lean:D5/S3/Quantum/Entanglement/FredkinEntanglingPowerRefutation.result), the output amplitude on an explicit admissible product input with local ancillas conjugates the reduced density state to exact rational matrices `Nq` and `Vq`; kernel decision procedures certify the spectrum and rigorous logarithm inequalities prove von Neumann entropy strictly above $2$ (witness value approximately `2.00034…` ebits). Verified and frozen by the Lean 4 kernel.
:::

## Proof 1: Exact Maximum of Higuchi–Sudbery Four-Qubit Entropy (*Phys. Lett. A* 2000)

Twenty-six years ago, Higuchi and Sudbery (*Phys. Lett. A* 2000) posed a landmark question in multipartite entanglement: over all normalized four-qubit pure states $z \in \mathbb{C}^{16}$, is the average two-qubit von Neumann entropy across the three bipartitions (`AB`, `AC`, `AD`) bounded above by $1 + \frac{1}{2}\log_2 3$, attained sharply by their explicit state $M_4$?

::: {.theorem #thm-higuchi-sudbery title="Sharp Higuchi–Sudbery Average Two-Qubit Entropy Bound" lean="D5/S3/Quantum/Entanglement/HiguchiSudbery/HiguchiSudberyEntropyMaximum.result"}
For every normalized four-qubit amplitude vector $z : \mathrm{Fin}\,16 \to \mathbb{C}$ with $\sum_{i=0}^{15} |z_i|^2 = 1$, its average two-qubit von Neumann entropy across cuts `AB`, `AC`, and `AD` satisfies
$$
\mathrm{averageEntropy}(z) \le 1 + \frac{1}{2}\log_2 3,
$$
and the explicit Higuchi–Sudbery state $M_4$ is normalized and achieves equality: $\mathrm{averageEntropy}(M_4) = 1 + \frac{1}{2}\log_2 3$.
:::

::: proof
In [`HiguchiSudberyEntropyMaximum.result`](lean:D5/S3/Quantum/Entanglement/HiguchiSudbery/HiguchiSudberyEntropyMaximum.result), the spectral reduction uses the lower bound $\ge 1$ on the sum of the three cut purities together with a prime certificate identity bounding the sum of degree-3 elementary symmetric polynomials of the three cut spectra by $\le \frac{5}{36}$ (inclusive, attained at $M_4$). A cubic Hermite majorant $p_{\mathrm{nat}}(x)$ then converts that spectral bound into the sharp entropy maximum because the **gap function** $\mathrm{gap}(x) = p_{\mathrm{nat}}(x) + x\ln x$ has double zeros at $x = \frac{1}{6}$ and $x = \frac{1}{2}$ and strictly positive fourth derivative $\mathrm{gap}^{(4)}(x) = 2/x^3 > 0$ on $(0, \infty)$; direct evaluation verifies equality at $M_4$. Verified and frozen by the Lean 4 kernel.
:::

## Proof 2: Universal Tripartite Mermin–CGLMP Facet Theorem for All $K \ge 2$ (*Phys. Rev. A* 2012)

Grandjean et al. (*Phys. Rev. A* 2012) introduced the tripartite $K$-outcome Bell inequality $(K - 1) \le I_K(p)$, verified numerically only for small $K$. Without enumeration or finite-case reduction, the frozen theorem below settles facetness universally for every $K \ge 2$:

::: {.theorem #thm-mermin-facet title="Mermin–CGLMP Inequality Is a Local-Polytope Facet for Every $K \ge 2$" lean="D5/S3/QuantumBounds/MerminCglmpFacet.result"}
For every integer $K \ge 2$:

1. Every behavior $p$ in the tripartite local polytope $L_K$ obeys $(K - 1) \le I_K(p)$;
2. The affine face saturating $I_K(p) = K - 1$ has codimension exactly $1$ inside $L_K$:
$$
\dim_{\mathbb{R}}\bigl(\mathrm{vectorSpan}_{\mathbb{R}}\{p \in L_K \mid I_K(p) = K - 1\}\bigr) + 1
= \dim_{\mathbb{R}}\bigl(\mathrm{vectorSpan}_{\mathbb{R}}(L_K)\bigr).
$$
:::

::: proof
In [`MerminCglmpFacet.result`](lean:D5/S3/QuantumBounds/MerminCglmpFacet.result), vertex evaluation plus convexity establishes validity on all of $L_K$, and tripartite rigidity via the Charlie slice and rectangular gluing establishes exact codimension-$1$ span for every $K \ge 2$. Verified and frozen by the Lean 4 kernel.
:::

## Proof 3: Godsil's Average Mixing Discriminant Integrality (*JCTA* 2013)

In *Journal of Combinatorial Theory, Series A* (`arXiv:1103.2578v3`, §11 Question 1), Chris Godsil asked whether multiplying every entry of the continuous-time quantum walk average mixing matrix of a finite simple graph $G$ by the discriminant of the rational minimal polynomial of $A(G)$ always sweeps away every denominator, leaving pure integers behind.

::: {.theorem #thm-godsil-mixing title="Minimal-Polynomial Discriminant Clears All Average Mixing Denominators" lean="D5/S3/Quantum/Dynamics/AverageMixingDiscriminantIntegrality.result"}
For every natural number $n$, every finite simple graph $G$ on $\mathrm{Fin}\,n$, and every vertex pair $i, j$, there exists an integer $z \in \mathbb{Z}$ such that
$$
\mathrm{discr}\bigl(\mathrm{minpoly}_{\mathbb{Q}}(A_G)\bigr) \cdot \mathrm{avgMixing}(G)_{i,j} = z.
$$
:::

::: proof
In [`AverageMixingDiscriminantIntegrality.result`](lean:D5/S3/Quantum/Dynamics/AverageMixingDiscriminantIntegrality.result), local discriminant cancellation (`discr_scaled_entry`) expresses every scaled entry as an integer symmetric polynomial in the distinct eigenvalues; Vieta's formulas and the fundamental theorem of symmetric polynomials then force integrality. Verified and frozen by the Lean 4 kernel.
:::

## Proof 4: $\ell_1$-Norm Coherence Dominates Relative Entropy Coherence (*Phys. Rev. A* 2016)

Rana, Parashar, and Lewenstein (*Phys. Rev. A* 2016) conjectured that in every finite dimension $n$, the relative entropy of coherence never exceeds the $\ell_1$-norm coherence for any density matrix $\rho$.

::: {.theorem #thm-coherence-l1 title="$\ell_1$ Coherence Dominates Relative Entropy Coherence in Every Finite Dimension" lean="D5/S3/Divergence/CoherenceL1RelativeEntropyBound.result"}
For every natural number $n \in \mathbb{N}$ and every $n \times n$ complex density matrix $\rho$ (`IsState ρ`),
$$
\mathrm{coherenceRel}(\rho) \le \mathrm{l1Coherence}(\rho).
$$
:::

::: proof
In [`CoherenceL1RelativeEntropyBound.result`](lean:D5/S3/Divergence/CoherenceL1RelativeEntropyBound.result), the proof reduces the inequality across all finite dimensions to the Audenaert binary Holevo bound and log-derivative trace bounds. Verified and frozen by the Lean 4 kernel.
:::

## Refutation 2: Compatible Channels Need Not Be Jordan Compatible (*Nat. Commun.* 2021)

Girard, Plávala, and Sikora (*Nature Communications* 2021) asked whether every pair of compatible quantum channels (`Compatible Φ Ψ`) must also be Jordan compatible (`JordanCompatible Φ Ψ`). `trureturing` builds an explicit counterexample in dimension $d = 4$, snapping the universal claim in two:

::: {.theorem #thm-jordan-refutation title="Compatible Quantum Channels in Dimension 4 Need Not Be Jordan Compatible" lean="D5/S3/QuantumChannels/JordanCompatibilityRefutation.result"}
The universal claim that every pair of compatible quantum channels $(\Phi, \Psi)$ in every dimension $d$ is Jordan compatible is false: $\neg\,\mathrm{claim}$, witnessed explicitly at $d = 4$.
:::

::: proof
In [`JordanCompatibilityRefutation.result`](lean:D5/S3/QuantumChannels/JordanCompatibilityRefutation.result), two explicit quantum channels $\Phi, \Psi$ on $\mathrm{Fin}\,4$ are verified to admit a joint mother channel (`compatible_witness`) while satisfying `not_jordanCompatible`. Verified and frozen by the Lean 4 kernel.
:::

## Proof 5: Harmonic Limit of Averaged Zeitlin Ricci Curvature (*Commun. Math. Phys.* 2026)

Finally, a fresh 2026 problem from *Communications in Mathematical Physics*: Lichtenfelz, Modin, and Preston studied the averaged Ricci curvature $\tilde{r}_\ell(N)$ of Zeitlin matrix quantizations of the sphere and asked whether, for every angular mode $\ell \ge 2$, $\tilde{r}_\ell(N) \to -(H_\ell - 1)/2$ as $N \to \infty$ (with $H_\ell = \sum_{k=1}^\ell 1/k$) and becomes eventually strictly negative.

::: {.theorem #thm-zeitlin-ricci title="Harmonic Limit and Eventual Negativity of Averaged Zeitlin Ricci Curvature" lean="D5/S3/Quantum/Algebra/ZeitlinSixJ/RicciLimit.result"}
For every integer $\ell \ge 2$, the averaged Zeitlin Ricci curvature satisfies
$$
\lim_{N \to \infty} \tilde{r}_\ell(N) = -\frac{H_\ell - 1}{2},
$$
and there exists $N_0 \in \mathbb{N}$ such that $\tilde{r}_\ell(N) < 0$ for all $N \ge N_0$.
:::

::: proof
In [`RicciLimit.result`](lean:D5/S3/Quantum/Algebra/ZeitlinSixJ/RicciLimit.result), splitting $\tilde{r}_\ell(N)$ into positive and negative $6j$-symbol sums divided by $N^2 - 1$ makes the negative piece identically constant (equal to $(H_\ell - 1)/2$) for all $N > \ell$, while $6j$ sum rules and Tannery's limit theorem drive the positive piece to $0$; since $H_\ell \ge \frac{3}{2} > 1$ for all $\ell \ge 2$, strict negativity follows for all sufficiently large $N$. Verified and frozen by the Lean 4 kernel.
:::

## Beyond Single Conjectures: Unique Selection of 4D Spacetime (Frozen Nov 27, 2026)

Cracking individual published conjectures tests tactical reach; the deeper question is whether the engine can bolt multiple cross-domain physical constraints onto the same formal bench and watch them converge on a single spacetime dimension. Frozen live on November 27, 2026 inside `DeSitterGravitonModes` (`548388cd`), four classical constraints on any integer spacetime dimension $D \ge 3$—non-vanishing Weyl curvature, summability of the null-diamond leading angular mode weight, scale-invariant conformal Maxwell weight, and two transverse polarizations—close like a four-jaw vise around **$D = 4$**:

::: {.theorem #thm-unique-dim-four title="Unique Selection of 4D Spacetime from Weyl Curvature, Summable Leading Mode, Conformal Maxwell, and Two Polarizations" lean="D5/S3/Quantum/Analysis/NullConeGravity/DeSitterGravitonModes.grand_unification_unique_dimension_four"}
For every natural-number dimension $D \ge 3$, the following equivalence holds:
$$
\begin{aligned}
\bigl(0 < \dim_{\mathbb{R}} \mathrm{Weyl}(D)
&\land \mathrm{Summable}(\mathrm{leadingModeWeight}\,D) \\
&\land (\forall \Omega \in \mathbb{R}_{>0},\ \mathrm{maxwellConformalWeight}(D, \Omega) = 1) \\
&\land D - 2 = 2\bigr) \iff D = 4
\end{aligned}.
$$
The four conditions express nonzero Weyl curvature, summability of the null-diamond leading angular mode weight, a Maxwell conformal weight of one for every positive scale, and two transverse polarizations.
:::

::: proof
In [`grand_unification_unique_dimension_four`](lean:D5/S3/Quantum/Analysis/NullConeGravity/DeSitterGravitonModes.grand_unification_unique_dimension_four), each physical criterion carves away candidate dimensions in turn: non-vanishing Weyl curvature (`weylDim_pos_iff`) immediately eliminates $D = 3$ and forces $D \ge 4$—matching its sibling zero-axiom theorem `graviton_polarizations_three_four_five` in the same module, which proves via `decide` with zero axioms that `gravitonPolarizationCount` takes values `0`, `2`, and `5` in dimensions $D = 3, 4, 5$; summability of `leadingModeWeight D` (`scalar_nullDiamond_and_propagating_gravity_iff`) then trims the surviving window to $D \in \{4, 5\}$; finally, conformal invariance of Maxwell's equations (`maxwellConformalWeight D Ω = 1` for all $\Omega > 0$) paired with two transverse polarizations / Hodge two-form degree ($D - 2 = 2$) uniquely locks $D = 4$, and conversely all four conditions hold at $D = 4$. Verified and frozen by the Lean 4 kernel.
:::

Placed in its broader constructive lineage, this zero-axiom `decide` graviton count (`graviton_polarizations_three_four_five`) pairs directly with [Chapter 6](ch06-mathesis-books-and-rh.md)'s blue zero-axiom simplicial Poincaré lemma [@thm-omega-simplicial-exact] (`d2_eq_zero_iff`, strictly `axioms: []` on both official Lean and bare-CIC `strict_omega`), whose explicit cone homotopy supplies the constructive counterpart for degree-2 simplicial cochains to [Chapter 2](ch02-information-escape-and-novelty.md)'s gluing obstruction ([@thm-gluing-obstruction]).

Seven flagship literature proofs and refutations across five major physics and mathematics journals, plus one live November 27, 2026 theorem uniquely selecting 4D spacetime—eight frozen theorems laid bare with zero rhetoric, every single one backed by a clickable green Lean declaration. Now, what does this living constellation of **`17,968` frozen modules and `223,231` frozen theorems** (`548388cd`, November 27, 2026) actually look like while running 24/7? Chapter 5 walks straight through the glass doors of **`live.trureturing.org`**.
