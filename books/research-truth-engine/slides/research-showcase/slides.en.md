---
# 01 Cover
theme: ../../../../theme/slides
title: "The Ratchet of Logic · Research Showcase"
info: "The Omega Institute research showcase: FIB ATOM, information escape, forced geometry, the literature frontier, and the red frontier."
htmlAttrs:
  lang: "en"
  data-polarity: "deep-space"
deck:
  code: "OMEGA//TRUTH"
  book: "The Ratchet of Logic"
  title: "Research Showcase"
  version: "0.1.0"
  blurb: "Four mathematical showstoppers, frozen Lean 4 theorems, and an honest red frontier: 16 research slides."
layout: cover
preloadImages: false
---

<p class="kicker">The Omega Institute · The Open Math Frontier</p>
<h1 class="display">The Ratchet<br>of <em>Logic</em></h1>
<p class="lead">Prose can hide a flaw for decades; the Lean 4 kernel lets no step slide.</p>

---
# 02 Scale
section: "Scale"
---

<div class="body center">
  <p class="kicker">One Way Forward</p>
  <h2 class="t">A Ratchet Turns <em>Only One Way</em></h2>
  <div class="g2 mt-l">
    <Stat value="167,819" label="frozen Lean 4 theorems" tone="ok" />
    <Stat value="14,701" label="frozen modules · 4.78M lines of Lean" />
    <Stat class="mt" value="720/720" label="consecutive UTC hours, every hour with commits" tone="magenta" />
    <Stat class="mt" value="2,128" label="open literature resolutions · 74 days" />
  </div>
</div>
<Source>trureturing@05ceb90 (Nov 20, 2026) · cadence @e55900e (Nov 19) · Lean 4.35.0</Source>

---
# 03 Part I
layout: section
chapter: "01"
section: "Part I · FIB ATOM"
---

<p class="kicker">Part I · FIB ATOM</p>
<h2 class="t">Identical on the Boundary,<br><em>Singular in Lineage</em></h2>
<p class="lead">Substitution <Tex t="\alpha \mapsto \beta,\ \beta \mapsto \beta\alpha" />:<br>boundary readings match exactly, yet the lineage law turns asymptotically singular to the uniform one.</p>

---
# 04 FIB ATOM
section: "FIB ATOM"
---

<div class="body">
  <p class="kicker">Theorem 1.1 · Theorem 1.3</p>
  <h2 class="t"><em>Three</em> Carry Values; <em>One-Step</em> Lineage Split</h2>
  <div class="split mt">
    <div>
      <img src="./img/ch01-fib-substitution-tree.en.svg" alt="Fibonacci substitution tree and lineage total-variation curve" style="display:block;height:285px;width:auto;max-width:100%;object-fit:contain;margin:0 auto;border-radius:6px;border:1px solid var(--tr-panel-edge)">
<TheoremCard class="compact mt" label="Theorem 1.1" title="Golden Carry Deficit Is Three-Valued" gid="D5/S1/Deficit/DeficitThreeValued.deficit_three_valued" cite="thm-fib-deficit">

For all natural numbers $v_1, v_2$: $c(v_1, v_2) \in \{-1,\ 0,\ 1\}$.

</TheoremCard>
    </div>
<TheoremCard class="compact" label="Theorem 1.3" title="Injective Fibonacci Genealogical Transport" gid="D5/S3/Arith/FibonacciAtomic/GenealogicalFiberTransport.result" cite="thm-fib-lineage">

For all $1 \le a + b$: substitution keeps every tree of a source fiber at the same boundary composition; transport is injective, with exact total variation from the uniform target-fiber law $\mathrm{TV}(a, b, n) = 1 - \mathrm{fiberCount}(a, b) / \mathrm{fiberCount}(\mathrm{step}^{[n]}(a, b)) \to 1$ as $n \to \infty$. If $2 \le a + b$, one step gives $1 - 2^{-b} \le \mathrm{TV}(a, b, 1)$; smallest case $\mathrm{TV}(1, 1, 1) = \tfrac{2}{3}$.

</TheoremCard>
  </div>
</div>
<Source>D5/S1/Deficit · D5/S3/Arith/FibonacciAtomic · Vol. III, Ch. 1</Source>

---
# 05 Part II
layout: section
chapter: "02"
section: "Part II · Information Escape"
---

<p class="kicker">Part II · Information Escape · Intuition</p>
<h2 class="t">You Cannot Mine<br><em>the Same Gold Twice</em></h2>
<p class="lead">The intuition behind recoverability: a new theorem counts as new information only if it separates states the old catalog could not. The next slide gives the exact Lean statements.</p>

---
# 06 Information escape
section: "Information Escape"
---

<div class="body">
  <p class="kicker">Theorem 2.3 · Theorem 2.5</p>
  <h2 class="t">A Thousand Rephrasings <em>Shrink the Blind Spot by Zero</em></h2>
  <div class="row mt">
    <img src="./img/ch02-information-escape-lattice.en.svg" alt="Information escape lattice and semantic closure" style="display:block;height:270px;width:auto;max-width:100%;object-fit:contain;margin:0 auto;border-radius:6px;border:1px solid var(--tr-panel-edge)">
    <div class="grow">
<TheoremCard class="compact" label="Theorem 2.3" title="Escape Drops iff Outside the Semantic Closure" gid="D5/S3/ConceptDynamics/InformationEscape/StructuralNovelty.lowersEscape_iff_not_mem_semanticClosureWithout" cite="thm-ie-closure">

On a nondegenerate arena, entry `index` strictly lowers escape iff its kernel lies outside the semantic closure of the other entries.

</TheoremCard>
<TheoremCard class="compact mt-s" label="Theorem 2.5" title="Same Kernel, Zero Unique Capture" gid="D5/S3/ConceptDynamics/InformationEscape/StructuralNovelty.same_kernel_both_zero" cite="thm-ie-same-kernel">

Distinct entries with identical agreement relations both have zero unique capture.

</TheoremCard>
    </div>
  </div>
</div>
<Source>Headline is an intuition; the cards state the Lean theorems · D5/S3/ConceptDynamics/InformationEscape/StructuralNovelty · Vol. III, Ch. 2</Source>

---
# 07 Part III
layout: section
chapter: "03"
section: "Part III · Forced Geometry"
---

<p class="kicker">Part III · Forced Geometry</p>
<h2 class="t">Assume Neither Complex<br>Numbers Nor 3D.<br><em>Does Logic Force Both?</em></h2>
<p class="lead">Keep only observable fibers, a three-way balancing law, and compact reciprocity—then see whether mathematics has any other choice.</p>

---
# 08 Five-mode chart
section: "Five-Mode Chart"
---

<div class="body">
  <p class="kicker">Theorem 3.1</p>
  <h2 class="t">The Pyramid Is Visible; <em>a Fisher Fiber Is Hidden</em></h2>
  <div class="split mt">
    <img src="./img/ch03-five-mode-pyramid.en.svg" alt="Visible five-mode pyramid and hidden Fisher fiber" style="display:block;height:480px;width:auto;max-width:100%;object-fit:contain;margin:0 auto;border-radius:6px;border:1px solid var(--tr-panel-edge)">
<TheoremCard class="compact" label="Theorem 3.1" title="A Global Fisher Chart for Five Modes" gid="D5/S1/Words/AdmissibleWords/FiveModeMixedCoordinates.mixed_coordinates_global_chart" cite="thm-five-mode-chart">

On the five-mode open simplex: for every visible point $v$ in the pyramid and every real $c$, there is a **unique** positive law $p$ with $\mathrm{visible}(p) = v$ and $\mathrm{hiddenChi}(p) = c$.

The directional derivative of the hidden coordinate is exactly the Fisher pairing; the hidden direction sums to zero and vanishes in visible coordinates.

</TheoremCard>
  </div>
</div>
<Source>D5/S1/Words/AdmissibleWords/FiveModeMixedCoordinates · Vol. III, Ch. 3</Source>

---
# 09 Rigidity
section: "Rigidity"
---

<div class="body">
  <p class="kicker">Theorem 3.2 · Theorem 3.3</p>
  <h2 class="t">Forced: <em>Complex Hilbert Space</em> and <em>Three Dimensions</em></h2>
  <div class="g2 mt">
<TheoremCard class="compact" label="Theorem 3.2" title="Raw Balancing Forces Complex Hilbert Space" gid="D5/S3/Quantum/Completion/RawAnchoredRadicalDescent.raw_hilbert_characterization" cite="thm-raw-hilbert">

For a unital magma $M$ with $U(1) = 1$ and $\omega = (-1 + i\sqrt{3})/2$, `RawBalance` ($c \ge 0$, $c(a, a) = 0$, three-way balancing) holds iff a minimal complex Hilbert rep exists; any $F$ with $F(ab) = F(a) + F(b)$, $F(Ua) = \omega F(a)$, $c(a, b) = \|F(a) - F(b)\|^2$ forces it; then any two minimal reps $S, T$ admit a **unique** surjective complex-linear isometry $e$ preserving all labels ($\forall a,\ e(S.\mathrm{label}\,a) = T.\mathrm{label}\,a$).

</TheoremCard>
<TheoremCard class="compact" label="Theorem 3.3" title="Compact Reciprocity Forces Three Dimensions" gid="D5/S3/Quantum/Algebra/OriginalCompactReciprocity.original_rigidity" cite="thm-rigidity-3d">

Let $W$ be a finite-dimensional real inner-product space, $G \le (W \to_L[\mathbb{R}] W)^\times$ a compact subgroup, $A \in \mathrm{OriginalLie}\,G$ nonzero, $x \neq 0$, $Ax = 0$. Under full reciprocity, a $G$-invariant inner product $B$ exists with

$$\dim_{\mathbb{R}} W = 3 = \dim_{\mathbb{R}} \mathrm{OriginalLie}\,G,$$

and the range of the action is exactly the skew endomorphisms of $B$, that is, $\mathfrak{so}(3)$.

</TheoremCard>
  </div>
</div>
<Source>D5/S3/Quantum/Completion · D5/S3/Quantum/Algebra · Vol. III, Ch. 3</Source>

---
# 10 Part IV
layout: section
chapter: "04"
section: "Part IV · Literature"
---

<p class="kicker">Part IV · Literature</p>
<h2 class="t">Into the Open<br>Literature: <em>74 Days,<br>2,128 Resolutions</em></h2>
<p class="lead">No self-set exams—straight into the Open Problems scholars leave at the end of their papers.</p>

---
# 11 Breakdown
section: "Breakdown"
---

<div class="body">
  <p class="kicker">Sep 8 → Nov 20, 2026</p>
  <h2 class="t">2,128 Resolutions: <em>1,400 Proved</em>, <em class="magenta">728 Refuted</em></h2>
  <div class="split mt">
    <img src="./img/ch04-resolution-velocity.en.svg" alt="Sources of literature resolutions, proved versus refuted" style="display:block;height:480px;width:auto;max-width:100%;object-fit:contain;margin:0 auto;border-radius:6px;border:1px solid var(--tr-panel-edge)">
    <div>
      <Stat class="md" value="674" label="from peer-reviewed journals · plus 736 arXiv, 693 OEIS" />
      <Stat class="md mt" value="124" label="open for over a decade, the oldest for 47 years" tone="magenta" />
      <Stat class="md mt" value="582" label="in quantum information &amp; physics (299 proved · 283 refuted)" />
    </div>
  </div>
</div>
<Source>trureturing@05ceb90 (Nov 20, 2026) · 2,126 dated + 2 undated = 2,128</Source>

---
# 12 Flagship proofs
section: "Flagship Proofs"
---

<div class="body">
  <p class="kicker">Phys. Lett. A 2000 · Phys. Rev. A 2012</p>
  <h2 class="t">A 26-Year-Old Entropy Bound; <em>a Facet for Every K</em></h2>
  <div class="g2 mt">
<TheoremCard class="compact" label="Theorem 4.2" title="Sharp Higuchi–Sudbery Entropy Bound" gid="D5/S3/Quantum/Entanglement/HiguchiSudbery/HiguchiSudberyEntropyMaximum.result" cite="thm-higuchi-sudbery">

For every normalized four-qubit pure state $z \in \mathbb{C}^{16}$, the average von Neumann entropy across the three two-qubit cuts AB, AC, AD satisfies

$$\mathrm{averageEntropy}(z) \le 1 + \tfrac{1}{2}\log_2 3,$$

and the explicit state $M_4$ attains equality.

</TheoremCard>
<TheoremCard class="compact" label="Theorem 4.3" title="Mermin–CGLMP Is a Facet for Every K≥2" gid="D5/S3/QuantumBounds/MerminCglmpFacet.result" cite="thm-mermin-facet">

For every integer $K \ge 2$, every behavior in the tripartite local polytope $L_K$ obeys

$$(K - 1) \le I_K(p),$$

and the saturating face has codimension exactly $1$ in $L_K$—a facet.

</TheoremCard>
  </div>
</div>
<Source>D5/S3/Quantum/Entanglement · D5/S3/QuantumBounds · Vol. III, Ch. 4</Source>

---
# 13 Flagship refutations
section: "Flagship Refutations"
---

<div class="body">
  <p class="kicker">Phys. Rev. A 2025 · Nat. Commun. 2021</p>
  <h2 class="t">Two Conjectures, <em class="magenta">Two Kernel Counterexamples</em></h2>
  <div class="g2 mt">
<TheoremCard class="compact" label="Theorem 4.1" title="Fredkin Entangling-Power Conjecture Refuted" gid="D5/S3/Quantum/Entanglement/FredkinEntanglingPowerRefutation.result" cite="thm-fredkin-refutation">

The Qiu–Song–Chen conjecture that the four-qubit Fredkin gate's entangling-power supremum across `AD:BC` with local ancillas equals $2$ ebits is false: $\neg\,\mathrm{claim}$.

<span class="sm muted">Witness from the proof, not in the statement: about 2.00034… ebits.</span>

</TheoremCard>
<TheoremCard class="compact" label="Theorem 4.6" title="Jordan Compatibility Can Fail at d=4" gid="D5/S3/QuantumChannels/JordanCompatibilityRefutation.result" cite="thm-jordan-refutation">

The claim that every pair of compatible quantum channels in every dimension is Jordan compatible is false: $\neg\,\mathrm{claim}$, with an explicit channel counterexample at $d = 4$.

</TheoremCard>
  </div>
  <div class="row mt">
    <span class="sm"><LeanBadge gid="D5/S3/Quantum/Dynamics/AverageMixingDiscriminantIntegrality.result" /> Godsil discriminant integrality · <i>JCTA</i> 2013</span>
    <span class="sm"><LeanBadge gid="D5/S3/Divergence/CoherenceL1RelativeEntropyBound.result" /> Rana coherence bound · <i>PRA</i> 2016</span>
    <span class="sm"><LeanBadge gid="D5/S3/Quantum/Algebra/ZeitlinSixJ/RicciLimit.result" /> Zeitlin Ricci limit · <i>CMP</i> 2026</span>
  </div>
</div>
<Source>D5/S3/Quantum · D5/S3/QuantumChannels · D5/S3/Divergence · Vol. III, Ch. 4</Source>

---
# 14 Observatory
section: "Observatory"
---

<div class="body">
  <p class="kicker">live.trureturing.org</p>
  <h2 class="t">Eight Departments, <em>One Glass House</em></h2>
  <div class="split mt">
    <img src="./img/trureturing-live-dept.png" alt="Live capture of the live.trureturing.org department view" style="display:block;height:500px;width:auto;max-width:100%;object-fit:contain;margin:0 auto;border-radius:6px;border:1px solid var(--tr-panel-edge)">
    <div>
      <Stat value="19,022" label="live DAG nodes · 8 departments · 17 public repositories" />
      <ul class="plain mt-l">
        <li><b>24 active StrataLint rules</b><br><span class="sm muted">Static governance rules and the Lean 4 kernel form a double gate</span></li>
        <li class="mt"><b>838 scholars contacted, 440 replied</b><br><span class="sm muted">273 institutions in 46 countries; 44 in co-authoring tracks</span></li>
        <li class="mt"><b>1 <i>RAIRO-ITA</i> 2026 paper · 18 OEIS entries</b><br><span class="sm muted">Logged with equal candor: 64 scholars declined</span></li>
      </ul>
    </div>
  </div>
</div>
<Source>Live capture of live.trureturing.org (Nov 27, 2026) · trureturing-outreach (Nov 8) · StrataLint (Nov 20)</Source>

---
# 15 Red frontier
section: "The Red Frontier"
---

<div class="body">
  <p class="kicker">Theorem 6.1 · Open problem 6.2</p>
  <h2 class="t">Equivalence Frozen; <em class="warn">RH Itself Stays Open</em></h2>
  <div class="row mt-s">
    <img src="./img/ch06-three-evidence-tiers.en.svg" alt="Three evidence tiers" style="display:block;height:460px;width:auto;max-width:100%;object-fit:contain;margin:0 auto;border-radius:6px;border:1px solid var(--tr-panel-edge)">
    <div class="grow">
<TheoremCard class="compact" label="Theorem 6.1" title="Integer Hankel Criterion for the Riemann Hypothesis" gid="D5/S3/Zeros/Resolvent/ActualXiIntegerCriterion.rh_iff_actual_xi_integer_hankel_nonnegative" cite="thm-rh-hankel">

$\mathrm{RiemannHypothesis} \iff$ the actual-$\xi$ integer Hankel form is nonnegative for every $N$ and every $u : \mathrm{Fin}\,(N+1) \to \mathbb{Z}$. Equivalence only.

</TheoremCard>
<TheoremCard class="compact mt-s" label="Open problem 6.2" title="The Riemann Hypothesis Remains Open" status="open" cite="prob-rh-open">

Is it true? Equivalently, is that form nonnegative for all $N$, $u$? <b>Completely open.</b>

</TheoremCard>
      <p class="sm muted mt-s">Mathesis collects 212 source-backed papers; Mathesis peer-review acceptances: <b class="hl-warn">0</b>.</p>
    </div>
  </div>
</div>
<Source>D5/S3/Zeros/Resolvent/ActualXiIntegerCriterion · Mathesis (Nov 27, 2026) · Vol. III, Ch. 6</Source>

---
# 16 Closing
layout: cover
---

<p class="kicker">Replay It Yourself</p>
<h1 class="display">Five Steps.<br><em>Lean 4</em> Replay.</h1>
<p class="lead mono hl-cyan">live.trureturing.org</p>
<p class="lead mt-s mono">github.com/the-omega-institute/trureturing @ <PinnedCommit /></p>
