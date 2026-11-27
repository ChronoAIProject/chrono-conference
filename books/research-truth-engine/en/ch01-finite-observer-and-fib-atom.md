# Chapter 1: From a One-Bit Window to FIB ATOM

Richard Feynman had a signature teaching habit: whenever someone buried a deep phenomenon beneath thirty pages of baroque terminology, he stripped it down to the smallest mechanical toy—a spinning plate, a single coin, or two non-adjacent Fibonacci numbers—insisting on mastering that minimal model's quirks before attempting any grand cathedral.

The vast theory tree of `trureturing` (`1,461` source-theory volumes in `trureturing-source-theories`, including `339` `FIB` volumes; as of the November 20, 2026 snapshot, `FibonacciAtomic` holds `326` `.lean` source files, `324` of which are registered frozen modules) starts from exactly such a minimal toy: **a finite observer, golden-ratio carries, and `FIB ATOM` generated on ordered binary trees by the leaf substitution $\alpha \mapsto \beta,\ \beta \mapsto \beta\alpha$.**

## The Three-Valued Trap of Golden Carries

Every natural number $n$ writes uniquely as a sum of non-adjacent Fibonacci numbers (its Zeckendorf representation). Perform one deceptively innocent swap: replace each Fibonacci weight $F_k$ by the corresponding power $\varphi^k$ of the golden ratio $\varphi = (1+\sqrt{5})/2$, yielding a real readout $\beta(n)$.

Naively expect $\beta$ to preserve addition and you immediately hit friction: $\beta(1) = \varphi^2$ and $\beta(2) = \varphi^3$, so the **normalized carry deficit** $c(v_1, v_2) = \beta(v_1) + \beta(v_2) - \beta(v_1 + v_2)$ equals $2\varphi^2 - \varphi^3 = 1$ at $(1, 1)$.

Here is the first mechanical surprise: no matter how astronomically large $v_1$ and $v_2$ grow, that arithmetic leakage **can never escape three integers**.

::: {.theorem #thm-fib-deficit title="Golden Carry Deficit Is Three-Valued" lean="D5/S1/Deficit/DeficitThreeValued.deficit_three_valued"}
For all natural numbers $v_1, v_2 \in \mathbb{N}$, the normalized golden carry deficit satisfies
$$
c(v_1, v_2) \in \{-1,\, 0,\, 1\}.
$$
:::

::: proof
Apply Galois conjugation $\varphi \mapsto \psi = (1-\sqrt{5})/2 = -1/\varphi \in (-1, 0)$ to evaluate each Zeckendorf digit string on the contraction face $\beta'(v)$. Because even powers of $\psi$ are positive and odd powers negative, geometric series confine every $\beta'(v)$ to the closed unit-length contraction window $[-\psi^2, -\psi]$, which in turn bounds $c(v_1, v_2) = \beta'(v_1) + \beta'(v_2) - \beta'(v_1 + v_2)$ strictly inside $(-2, 2)$; combined with integrality from `deficit_integer`, only $-1, 0, 1$ survive. Checked and frozen by the Lean 4 kernel in [`deficit_three_valued`](lean:D5/S1/Deficit/DeficitThreeValued.deficit_three_valued).
:::

Drag $(v_1, v_2)$ inside the `deficit` experiment card below and try to break the fence: every contraction combination stays pinned strictly between $-2$ and $2$, snapping exclusively to $-1$, $0$, or $1$.

::: {.viz src="fib-atom-observer" preset="deficit" height="500"}
**Three-Valued Golden Deficit (`deficit`).** Live Zeckendorf evaluation of $c(v_1, v_2)$ and the contraction window $[-\psi^2, -\psi]$, confirming the strict $\{-1, 0, 1\}$ trap of [@thm-fib-deficit].
:::

## Forward Graft Words and Exact Affine Closure Modulo $H$

Now step from one integer to a growing ordered binary tree (defined in Lean as the free magma `Source := FreeMagma Bool`, with `true` denoting the non-expanding leaf $\alpha$ and `false` the expanding leaf $\beta$). Act on the two-letter alphabet $\{\alpha, \beta\}$ by the Fibonacci substitution $\alpha \mapsto \beta,\ \beta \mapsto \beta \cdot \alpha$. If a tree currently holds $a$ leaves of type $\alpha$ and $b$ of type $\beta$, one generation maps the composition vector $(a, b)$ to $\mathrm{step}(a, b) = (b, a + b)$—driven by the unimodular matrix $M = \begin{pmatrix} 0 & 1 \\ 1 & 1 \end{pmatrix}$—and the observer's scalar readout is $\mathrm{quantity}(a, b) = 2a + 3b$.

Allow a finite Boolean graft word $W$ to interleave substitution steps (`false`) with grafting a fixed atomic composition $w$ (`true`), then read the resulting boundary modulo any positive modulus $H$. What set of observable shifts can those graft words generate? The frozen theorem below (listing its core representative clauses; the full Lean conjunction also covers scalar-GCD behavior across all words, an autonomous $H^2$-state realization, and an $H^2$ state-count lower bound for atomic-block grafts) characterizes the exact affine closure.

::: {.theorem #thm-fib-graft title="Forward Fibonacci Graft Words Realize the Observable Translation Ideal (Selected Conclusions)" lean="D5/S3/Arith/FibonacciAtomic/GraftAffineClosure.result"}
In the frozen conjunction `GraftAffineClosure.result`, the following conclusions hold in particular:

1. For every prime $p$, natural numbers $e \le h$, and integers $x, y \in \mathbb{Z}$, we have $\gcd(x + p^e b,\, p^h) = \gcd(y + p^e b,\, p^h)$ for **every** integer shift parameter $b \in \mathbb{Z}$ if and only if the classification invariant satisfies $\psi(p, h, e, x) = \psi(p, h, e, y)$;
2. For every positive integer $H > 0$ and base vector $w \in \mathbb{N} \times \mathbb{N}$, every finite Boolean graft word $W$ acts affinely as $\mathrm{run}(w, W, v) = \mathrm{step}^{[k]}(v) + t$ with translation $t \bmod H \in \mathrm{graftSpace}(H, w)$;
3. On $(\mathbb{Z}/H\mathbb{Z})^2$, the step map satisfies $\mathrm{step}^{[(H^2)!]}(v) = v$, and explicit realization words `realizationWord H k A B` hit every pair $(k, t \in \mathrm{graftSpace}(H, w))$ modulo $H$;
4. The image of $\mathrm{graftSpace}(H, w)$ under the scalar observable `quantity` is precisely the principal ideal in $\mathbb{Z}/H\mathbb{Z}$ generated by $\mathrm{graftGcd}(H, w) = \gcd(\gcd(w_1, w_2), H)$.
:::

::: proof
In [`GraftAffineClosure.result`](lean:D5/S3/Arith/FibonacciAtomic/GraftAffineClosure.result), the permutation order of `step` on the finite space $(\mathbb{Z}/H\mathbb{Z})^2$ divides $(H^2)!$, enabling explicit Boolean words that synthesize any nonnegative shift $A \cdot \mathrm{step}^{[(H^2)!]}(w) + B \cdot \mathrm{step}(w)$, while integer GCD identities pin down the principal ideal image. Verified and frozen by the Lean 4 kernel.
:::

Inspect the `graft` experiment card below to turn the abstract symbols of [@thm-fib-graft] into a visible orbit: watch forward Fibonacci graft words act on $(2, 1)$ modulo $H = 5$, combining rotation by `step` with shifts inside `graftSpace`.

::: {.viz src="fib-atom-observer" preset="graft" height="500"}
**Forward Graft Affine Action (`graft`).** Traces Boolean graft words applied to $(2, 1)$ modulo $H = 5$, visualizing the exact affine shift $\mathrm{step}^{[k]} v + t$ of [@thm-fib-graft].
:::

## Identical on the Boundary, Singular in Lineage

So far everything looks orderly, almost transparent. Now comes the hammer blow that gives `FIB ATOM` its physical bite—the arithmetic archetype of why a finite boundary observer is forced to live with hidden structure.

Fix any composition $(a, b)$ with $a + b \ge 1$. All ordered binary trees sharing exact leaf composition $(a, b)$ form a finite set called the **source fiber `Fiber (a, b)`**. Iterate the Fibonacci substitution $n$ generations forward, and two opposite realities unfold simultaneously:

1. **On the boundary, every tree looks identical**: Pick any tree $t \in \mathrm{Fiber}(a, b)$; after $n$ generations, its leaf composition equals $\mathrm{step}^{[n]}(a, b)$ and its scalar observable matches identically. A boundary-only observer cannot detect a hair of difference.
2. **In lineage space, distributions separate toward total singularity**: Pushing the uniform distribution on `Fiber (a, b)` forward via the injective map `fiberMap (a, b) n` into the $n$-th generation fiber `Fiber (step^[n] (a, b))` produces a total variation distance from the uniform distribution on that target fiber that has an exact closed form—and converges to **$1$** as $n \to \infty$!

The computed figure below pairs the first four generations of $\alpha \mapsto \beta,\ \beta \mapsto \beta\alpha$ starting from a single $\beta$ leaf ($1, 2, 3, 5, 8$ leaves) with the exact total variation climb from $(1, 1)$, hitting $2/3$ on generation $1$ alone.

::: {.figure src="ch01-fib-substitution-tree"}
**Fibonacci Substitution Tree and Genealogical Total Variation Separation.** Left: four generations of $\alpha \mapsto \beta,\ \beta \mapsto \beta\alpha$ starting from a single $\beta$ leaf ($1, 2, 3, 5, 8$ leaves). Right: exact total variation distance $\mathrm{TV}(n) = 1 - |\mathrm{Fiber}(1,1)| / |\mathrm{Fiber}(\mathrm{step}^n(1,1))|$ starting at $(1, 1)$, hitting exact $2/3$ at $n = 1$ and climbing rapidly toward $1$ (see [@thm-fib-lineage]).
:::

First inspect the `boundary` card to see distinct ordered source trees inside `Fiber(2, 1)` collapsing onto one identical boundary count:

::: {.viz src="fib-atom-observer" preset="boundary" height="500"}
**Same Composition, Distinct Trees (`boundary`).** Displays distinct ordered trees in `Fiber(2, 1)` yielding the exact same observable composition $(2, 1)$ and scalar quantity $2 \cdot 2 + 3 \cdot 1 = 7$.
:::

Now read the complete frozen Lean 4 theorem locking this separation in stone:

::: {.theorem #thm-fib-lineage title="Ordered Source Fibers and Injective Fibonacci Genealogical Transport" lean="D5/S3/Arith/FibonacciAtomic/GenealogicalFiberTransport.result"}
For all natural numbers $a, b$ with $1 \le a + b$ (counting $\alpha$ and $\beta$ leaves under $\mathrm{step}(a, b) = (b, a + b)$):

1. The source fiber $\mathrm{Fiber}(a, b)$ is finite and nonempty with cardinality $\mathrm{fiberCount}(a, b)$;
2. For every tree $t \in \mathrm{Fiber}(a, b)$ and every generation $n \in \mathbb{N}$, substitution preserves deterministic boundary composition $\mathrm{step}^{[n]}(a, b)$ and scalar quantity $\mathrm{quantity}(\mathrm{step}^{[n]}(a, b))$;
3. For every $n \in \mathbb{N}$, the genealogical transport map $\mathrm{fiberMap}(a, b, n)$ is injective with image cardinality $\mathrm{fiberCount}(a, b)$, both the pushed-forward uniform measure and the target uniform measure are nonnegative and sum to $1$, and their total variation distance equals
$$
\mathrm{transportVariation}(a, b, n) = 1 - \frac{\mathrm{fiberCount}(a, b)}{\mathrm{fiberCount}(\mathrm{step}^{[n]}(a, b))};
$$
4. For every $a, b$ with $1 \le a + b$, $\mathrm{transportVariation}(a, b, n) \to 1$ as $n \to \infty$; moreover, whenever $2 \le a + b$, a single generation already obeys the lower bound $1 - 2^{-b} \le \mathrm{transportVariation}(a, b, 1)$;
5. In particular, at the smallest composition containing both leaf types, $(1, 1)$,
$$
\mathrm{transportVariation}(1, 1, 1) = \frac{2}{3}.
$$
:::

::: proof
In [`GenealogicalFiberTransport.result`](lean:D5/S3/Arith/FibonacciAtomic/GenealogicalFiberTransport.result), ordered binary trees live in the free magma `FreeMagma Bool`. Because `substitution t ≠ .of true` for every tree $t$ (no substitution output is a single $\alpha$ leaf), constructor analysis and structural induction on `.of` and `.mul` prove that `substitution`—and hence every iterate `fiberMap (a, b) n`—is injective, keeping the image cardinality fixed at $\mathrm{fiberCount}(a, b)$. Meanwhile, `fiberCount (step^[n] (a, b))` diverges with $n$, driving the ratio to $0$ and total variation to $1$. Evaluating at $(1, 1)$ and $n = 1$ yields $\mathrm{step}(1, 1) = (1, 2)$ with fiber ratio $2/6 = 1/3$, giving exact total variation $2/3$. Verified and frozen by the Lean 4 kernel.
:::

Step the `lineage` experiment card forward from $(1, 1)$ and watch the pushforward share collapse from $1$ to $1/3$ at $n = 1$ ($\mathrm{TV} = 2/3$) and plunge toward zero thereafter:

::: {.viz src="fib-atom-observer" preset="lineage" height="500"}
**Lineage Singular Limit (`lineage`).** Starts from $(a, b) = (1, 1)$ and advances generation $n$, hitting exact $\mathrm{TV}(1) = 2/3$ and converging toward $1$ as internal histories separate while boundary readouts stay identical ([@thm-fib-lineage]).
:::

Put all three pieces together and you feel the opening heartbeat of `trureturing`: **orderly, rigid boundary readouts concealing vast hidden fibers underneath.** Open the full `FIB//OBSERVER` laboratory below to move freely across all three scenes and check every exact arithmetic invariant live.

::: {.viz src="fib-atom-observer" height="560"}
**Full Laboratory: `FIB//OBSERVER`.** Switch freely across Graft Affine Closure, Genealogical Fiber Transport, and Three-Valued Golden Carry Deficit to test exact instances of all three frozen Lean 4 theorems in this chapter.
:::

Now an immediate razor-sharp question follows: if every finite observer lives with blind spots, how do we tell—without hand-waving—whether a newly proved theorem genuinely shrinks the blind spot or merely repeats what the existing catalog already knew? Chapter 2 brings in the guillotine: **Information Escape and the Irreversible Truth DAG.**
