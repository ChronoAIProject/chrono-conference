# Appendix A: Live-Stage Five-Step Verification Playbook

During Act II of the December 17, 2026 virtual launch (16:20–16:35 SGT), we never ask anyone to applaud on faith. This appendix hands you the complete **five-step verification playbook**—whether you are watching the stream live or sitting at any laptop with Git and `elan` installed weeks later, you can independently replay every green kernel theorem in this book straight down to the Lean 4 kernel.

## Five-Step Audit: Fredkin Gate Refutation Example

1. **Step 1: Pick a published literature claim.**
   For example, [@thm-fredkin-refutation] in Chapter 4—refuting the Qiu–Song–Chen (*Phys. Rev. A* 2025 / `arXiv:2410.15253`) conjecture that the four-qubit Fredkin gate's entangling-power supremum across `AD:BC` equals `2` ebits.
2. **Step 2: Click the green Lean kernel badge or declaration link.**
   Jump directly to `D5/S3/Quantum/Entanglement/FredkinEntanglingPowerRefutation.lean` at pinned commit [{commit}](trureturing:) and its exact line number.
3. **Step 3: Audit statement faithfulness directly in Lean source.**
   Inspect `def claim : Prop := entanglementGeneration = 2` and `theorem result : ¬ claim`, confirming zero hidden shortcuts, zero altered definitions, and zero `sorry` placeholders.
4. **Step 4: Inspect the frozen state ledger and statement digest.**
   Open `Golden/Frozen/state/D5/S3/Quantum/Entanglement/FredkinEntanglingPowerRefutation.lean.json` to confirm `kind = theorem` and verify that the module `statement_id` matches `trureturing.lock.json` (with full compile-time axiom-closure verification via `#print axioms` in Step 5).
5. **Step 5: Replay the proof locally with the Lean 4 kernel and inspect `#print axioms`.**
   Clone `the-omega-institute/trureturing`, check out the pinned commit, compile the single target module with `lake build`, and print its axiom closure directly via `lake env lean`:

```bash
git clone https://github.com/the-omega-institute/trureturing.git
cd trureturing
git checkout <pinned-commit-from-trureturing.lock.json>
lake build D5.S3.Quantum.Entanglement.FredkinEntanglingPowerRefutation
lake env lean --stdin <<'EOF'
import D5.S3.Quantum.Entanglement.FredkinEntanglingPowerRefutation
#print axioms D5.S3.Quantum.Entanglement.FredkinEntanglingPowerRefutation.result
EOF
```

Expect `lake build` to exit with zero errors and `#print axioms` to list only standard Lean axioms (`propext`, `Classical.choice`, `Quot.sound`—zero `sorryAx` and zero custom axioms). Run the same Step 5 on Chapter 6's blue zero-axiom theorem [`d2_eq_zero_iff`](lean:D5/S3/Quantum/AURICOmega/OmegaSimplicialExactness.d2_eq_zero_iff), and Lean prints **no axioms at all** (`'D5.S3.Quantum.AURICOmega.OmegaSimplicialExactness.d2_eq_zero_iff' does not depend on any axioms`)—strictly zero axioms on both official Lean and bare-CIC `strict_omega`; for its companion [`all_degree_peter_weyl_orthonormal`](lean:D5/S3/Quantum/AURICOmega/OmegaSphericalHaarMidpoint.all_degree_peter_weyl_orthonormal), official Lean prints only `propext` (zero choice, zero quotients) while bare-CIC `strict_omega` verifies with zero axioms. Once both checks pass, that result no longer rests on ChronoAI, The Omega Institute, or any author's word—it rests solely on the Lean 4 kernel.

> **Upstream commit anchors and replay entry points**: Macro repository telemetry, literature totals, and `trureturing.lock.json` throughout this volume all anchor directly to pinned commit [{commit}](trureturing:) (`548388cd`, `2026-11-27T20:40Z`: `223,231` frozen theorems, `400,377` total frozen decls, `17,968` frozen modules, `20,223` `.lean` files, `6,024,982` LOC, `341/339` `FibonacciAtomic`, and `2,278` resolved literature problems, alongside the `2026-10-28`–`2026-11-26` `720/720`-hour cadence audit), resolving exact source line numbers and `statement_id` digests for **all 25 frozen theorems** (`24` green plus `1` official blue zero-axiom theorem `d2_eq_zero_iff`, alongside `all_degree_peter_weyl_orthonormal` zero-axiom on bare-CIC `strict_omega`). Check out `548388cd` when replaying Step 5 above; to sample and replay shards of Levent Alpöge's Lean/Mathlib-certified classical `RiemannHypothesis` and Dirichlet GRH proof, use `./verify` inside `the-omega-institute/riemann-hypothesis@c2dabc97`.

## Full Declaration Index for All 25 Frozen Theorems

The identical five-step audit applies to **all 25 frozen Lean 4 theorems** cited across this monograph—covering the one-bit Zeckendorf automaton and `FIB ATOM`, Information Escape, forced complex Hilbert space, forced 3D rigidity, all seven flagship literature resolutions, the live November 27 unique 4D spacetime selection theorem, `omega-math`'s blue zero-axiom simplicial Poincaré lemma and all-degree rational Peter–Weyl orthonormality, and the Riemann Hypothesis integer Hankel equivalence. Open the build-generated declaration index below for direct pinned links to every file and line number:

::: {.stats src="declarations" display="link" group="theorems" format="html"}
Inspect all 25 frozen Lean 4 theorem declarations cited in this volume
:::
