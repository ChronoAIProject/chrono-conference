# Chapter 3: Three-Way Balancing Forces Complex Space; Reciprocity Forces Three Dimensions

Page one of almost every physics textbook hands down three commandments from the clouds: states inhabit a complex Hilbert space, physical space has three dimensions, and probabilities follow squared complex norms. Ask *"why complex numbers instead of reals? why three dimensions and $\mathfrak{so}(3)$?"* and the textbook clears its throat and shuts the door: *"because experiment says so."*

Treating *"because the book says so"* as a final verdict is the laziest shortcut in physics, and bowing to an unexamined axiom is the costliest superstition in mathematics. Inside `trureturing`, we clear every textbook commandment out of the room and bolt the doors: **no complex numbers, no spatial dimension, no Hilbert space in the premises—only minimal operational fibers, raw three-way balancing, and compact first-order reciprocity. Does mathematics itself leave no exit—watching complex Hilbert space and three-dimensional rotation walk straight back through the locked door?**

The answer is not speculative philosophy; it is four structural rigidity theorems already welded shut inside the Lean 4 kernel.

## The Visible Pyramid and One Invisible Fisher Fiber

Pick up right where Chapter 1's visible dial versus hidden fiber left off. On the five-mode open probability simplex `openSimplex` ($\{p : \mathrm{Fin}\,5 \to \mathbb{R} \mid \forall s,\, p_s > 0,\ \sum_s p_s = 1\}$), an external observer reads three visible occupancy means `visible p`, filling an open 3D pyramid `openPyramid`.

Pin those three visible numbers down, and one degree of freedom remains inside the four-dimensional simplex. What does that hidden fiber look like? The frozen theorem below proves that adjoining a single hidden log cross-ratio `hiddenChi p` yields a unique global coordinate chart—and along every tangent vector, its derivative equals the exact **Fisher pairing** with the invisible base loop `hiddenDirection`.

::: {.theorem #thm-five-mode-chart title="Visible Occupancies and Hidden Log Cross-Ratio Form a Global Fisher Chart" lean="D5/S1/Words/AdmissibleWords/FiveModeMixedCoordinates.mixed_coordinates_global_chart"}
On the five-mode open probability simplex `openSimplex`:

1. The visible readout maps `openSimplex` into `openPyramid`;
2. For every visible point $v \in \mathrm{openPyramid}$ and every real number $c \in \mathbb{R}$, there exists a **unique** positive law $p \in \mathrm{openSimplex}$ with $\mathrm{visible}(p) = v$ and $\mathrm{hiddenChi}(p) = c$;
3. At every entrywise-positive base vector $p : \mathrm{Fin}\,5 \to \mathbb{R}$ (in particular every $p \in \mathrm{openSimplex}$) and arbitrary direction $u : \mathrm{Fin}\,5 \to \mathbb{R}$, the derivative of $t \mapsto \mathrm{hiddenChi}(p + t u)$ at $t = 0$ equals the Fisher inner product $\mathrm{fisher}(p, \mathrm{hiddenDirection}, u)$;
4. The base loop sums to zero and is invisible to the visible coordinates: $\sum_s \mathrm{hiddenDirection}(s) = 0$ and $\mathrm{visible}(\mathrm{hiddenDirection}) = 0$.
:::

::: proof
Fixing $v = (x, y, z) \in \mathrm{openPyramid}$ and $c \in \mathbb{R}$, setting $r = 1 - x - y - z$ and $a = e^c > 0$ yields $h(k) = (r+k)k - a(x-k)(y-k)$, which is strictly monotone on the admissible open fiber interval $(\max(0, -r),\, \min(x, y))$ and changes sign between its endpoints, giving existence and uniqueness by the intermediate value theorem; for any entrywise-positive base vector $p$ and arbitrary direction $u$, differentiating $t \mapsto \mathrm{hiddenChi}(p + t u)$ at $t = 0$ yields the exact Fisher pairing. Verified and frozen by the Lean 4 kernel in [`mixed_coordinates_global_chart`](lean:D5/S1/Words/AdmissibleWords/FiveModeMixedCoordinates.mixed_coordinates_global_chart).
:::

The computed projection below places the visible pyramid `openPyramid` beside one hidden cross-ratio fiber slicing straight through an interior point, making visible how three observable means plus one invisible Fisher loop span the entire positive simplex.

::: {.figure src="ch03-five-mode-pyramid"}
**Five-Mode Visible Pyramid and Hidden Cross-Ratio Fiber ([@thm-five-mode-chart]).** Left: the cyan polyhedron outlines the open visibility pyramid ($x, y, z > 0,\ x + z < 1,\ y + z < 1$) marking the interior point $(0.40, 0.35, 0.20)$. Right: exact probabilities $P(100)$ (cyan) and $P(101)$ (magenta) along the hidden log cross-ratio fiber $\chi \in [-5, 5]$ at that fixed occupancy, tangent to $(1, -1, 0, -1, 1)$.
:::

## One Raw Balancing Law Forces Complex Hilbert Space

Now comes the first genuine shock. Let $M$ be merely a unital magma (`MulOneClass M`—**not even assumed associative or commutative**), equipped with a unit-preserving unary operation $U : M \to M$ ($U(1) = 1$) and a real comparison readout $c : M \to M \to \mathbb{R}$.

Keep $\mathbb{C}$, inner products, and Hilbert spaces completely outside the locked room—admitting only the real-valued raw balancing package `RawBalance U c`, which combines nonnegativity ($c \ge 0$), zero diagonal ($c(a,a)=0$), unit preservation ($U(1)=1$), and the three-way balancing identity. What climbs back in? The frozen classification theorem below forces existence, uniqueness up to a unique label-preserving unitary isomorphism, and spontaneous associativity, commutativity, and $U^3 = \mathrm{id}$ phase symmetry on the visible quotient:

::: {.theorem #thm-raw-hilbert title="Complete Complex Hilbert Classification From Raw Balancing" lean="D5/S3/Quantum/Completion/RawAnchoredRadicalDescent.raw_hilbert_characterization"}
Let $M$ be a unital magma, $U : M \to M$ satisfy $U(1) = 1$, $c : M \to M \to \mathbb{R}$, and fix the primitive cubic root of unity $\omega = (-1 + i\sqrt{3})/2$. Then:

1. **Existence equivalence**: `RawBalance U c` (including nonnegativity, zero diagonal, and three-way balancing) holds if and only if a minimal complex Hilbert representation `RawHilbertRepresentation U c` exists;
2. **Sufficiency**: For any complex Hilbert space $H$ and map $F : M \to H$ satisfying $F(ab) = F(a) + F(b)$, $F(Ua) = \omega \cdot F(a)$, and $c(a, b) = \|F(a) - F(b)\|^2$, `RawBalance U c` holds;
3. **Uniqueness rigidity**: Whenever `RawBalance U c` holds, any two minimal representations $S, T$ admit a **unique** surjective complex linear isometry $e : S.\mathrm{carrier} \simeq_{\mathrm{li}}[\mathbb{C}] T.\mathrm{carrier}$ preserving all labels ($\forall a,\, e(S.\mathrm{label}\,a) = T.\mathrm{label}\,a$);
4. **Selected visible-algebra conclusions**: On `VisibleQuotient U c`, $c(a, b) = 0$ becomes a congruence whose induced product is associative and commutative, the induced phase satisfies $U^3 = \mathrm{id}$ (so its order divides $3$, including the trivial quotient), and the Eisenstein relation $[Ua \cdot U^2 a] = -[a]$ holds (alongside the full theorem's torsion-free Eisenstein module, scalar action, and quadratic-map conclusions).
:::

::: proof
In [`raw_hilbert_characterization`](lean:D5/S3/Quantum/Completion/RawAnchoredRadicalDescent.raw_hilbert_characterization), `RawBalance U c` drives radical descent onto the zero-comparison quotient and its torsion-free Eisenstein module, from which Fourier completion constructs the complex Hilbert space carrying $\omega = (-1 + i\sqrt{3})/2$, while polarization plus label preservation pins down the unique surjective linear isometry. Verified and frozen by the Lean 4 kernel.
:::

Pause and feel the weight of [@thm-raw-hilbert]: the primitive cubic root of unity $\omega = (-1 + i\sqrt{3})/2$, squared Hilbert distance, and even associativity and commutativity of the visible product were never smuggled through the back door—they are the sole mathematical exit left open by raw three-way balancing (with nonnegativity and zero diagonal).

## Compact Reciprocity Forces Dimension 3 and $\mathfrak{so}(3)$

Complex Hilbert space is locked in by raw balancing. Now tap the next textbook idol—spatial dimension. Under a compact symmetry group obeying first-order full reciprocity, does **three-dimensional space** become the only dimension left standing?

Take a compact subgroup $G$ of invertible continuous linear maps on a finite-dimensional real inner-product space $W$, with tangent Lie algebra $\mathrm{OriginalLie}\,G$. Suppose a nonzero generator $A \in \mathrm{OriginalLie}\,G$ stabilizes a nonzero source vector $x \in W$ ($Ax = 0$) and satisfies first-order complete reciprocity `FullReciprocity G A x` (meaning both projections of the full quotient relation are bijections). Every other dimension collapses, leaving only three:

::: {.theorem #thm-rigidity-3d title="Compact Full Reciprocity Forces Three Dimensions and Orthogonal Lie Algebra" lean="D5/S3/Quantum/Algebra/OriginalCompactReciprocity.original_rigidity"}
Let $W$ be a finite-dimensional real inner-product space, $G \subset (W \to_L[\mathbb{R}] W)^\times$ a compact subgroup, $A \in \mathrm{OriginalLie}\,G$ nonzero, $x \in W$ nonzero with $Ax = 0$, and assume `FullReciprocity G A x`. Then there exists a $G$-invariant real inner-product core $B$ on $W$ such that:

1. $\dim_{\mathbb{R}} W = 3$;
2. $\dim_{\mathbb{R}} (\mathrm{OriginalLie}\,G) = 3$;
3. The action image equals the entire space of $B$-skew endomorphisms ($\mathfrak{so}(3)$): $\mathrm{range}(\mathrm{originalAction}\,G) = \mathrm{skewEndomorphisms}\,B$.
:::

::: proof
Compact group averaging on the finite-dimensional real inner-product space $W$ constructs the $G$-invariant metric $B$ making every element of $\mathrm{OriginalLie}\,G$ skew-adjoint; first-order full reciprocity (bijectivity of both projections of the quotient relation) plus rank-nullity locks both $\dim_{\mathbb{R}} W = 3$ and $\dim_{\mathbb{R}}(\mathrm{OriginalLie}\,G) = 3$; since the skew-endomorphism space of a 3D inner-product space has dimension $\binom{3}{2} = 3$, injectivity forces surjectivity onto all of `skewEndomorphisms B`. Verified and frozen by the Lean 4 kernel in [`original_rigidity`](lean:D5/S3/Quantum/Algebra/OriginalCompactReciprocity.original_rigidity).
:::

## Algebraic Integrality Barrier on Native Protocol Events

Rounding out this chapter's rigidity spine, return to native Fibonacci protocol trees: every raw event mass `eventMass T event` produced by any finite native tree $T$ and Boolean event selector is automatically an **algebraic integer (`IsIntegral ℤ`)**, locking it permanently away from both nonintegral reference-comparison targets:

::: {.theorem #thm-event-arithmetic title="Native Protocol Event Masses Are Algebraic Integers" lean="D5/S3/Quantum/Dynamics/NativeProtocolEventArithmetic.original_event_arithmetic"}
For any leaf label type $L$, native protocol tree $T : \mathrm{Tree}\,L$, and event indicator $\mathrm{event} : \mathrm{Path}\,T \to \mathrm{Basis} \to \mathrm{Bool}$,
$$
\mathrm{IsIntegral}\,\mathbb{Z}\,(\mathrm{eventMass}\,T\,\mathrm{event})
\;\land\;
\mathrm{eventMass}\,T\,\mathrm{event} \neq \mathrm{emptyTarget}
\;\land\;
\mathrm{eventMass}\,T\,\mathrm{event} \neq \mathrm{referenceTarget}.
$$
:::

::: proof
In [`original_event_arithmetic`](lean:D5/S3/Quantum/Dynamics/NativeProtocolEventArithmetic.original_event_arithmetic), the proof establishes algebraic integrality (`IsIntegral ℤ`) not only for $\varphi^{-1}$, but also for the square-root weight $\sqrt{\varphi^{-1}}$, the complex phase factors entering the gate and mark matrices, and complex conjugation used by squared norms; finite sums, products, and squared norms of native amplitudes therefore remain integral over $\mathbb{Z}$, immediately separating them from the proved-nonintegral targets `emptyTarget` and `referenceTarget`. Verified and frozen by the Lean 4 kernel.
:::

By now you have walked the internal theoretical spine that `trureturing` built for itself. Any tough outside scientist immediately fires back the decisive external test: **"Internal elegance is fine—can this engine walk straight into published journals like *Physical Review A*, *Nature Communications*, *Commun. Math. Phys.*, and the OEIS and crack open problems posed by outside researchers years or decades ago?"**

Chapter 4 slams the full **`2,278`-problem** receipt onto the table: seven flagship literature proofs and refutations plus the freshly frozen November 27 4D spacetime uniqueness theorem—eight frozen theorems in total that you can click and verify on stage.
