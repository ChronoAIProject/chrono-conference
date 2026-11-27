# Appendix A: Live-Stage Five-Step Verification Playbook

During Act II of the December 17, 2026 virtual launch (16:20–16:35 SGT), we never ask anyone to applaud on faith. This appendix provides the exact **five-step verification playbook**—whether you are watching live or sitting at any laptop with Git and `elan` installed weeks later, you can independently replay any green kernel theorem in this book down to the Lean 4 kernel.

## Five-Step Audit: Fredkin Gate Refutation Example

1. **Step 1: Pick a published literature claim.**
   For example, [@thm-fredkin-refutation] in Chapter 4—refuting the Qiu–Song–Chen (*Phys. Rev. A* 2025 / `arXiv:2410.15253`) conjecture that the four-qubit Fredkin gate's entangling-power supremum across `AD:BC` equals `2` ebits.
2. **Step 2: Click the green Lean kernel badge or declaration link.**
   Jump directly to `D5/S3/Quantum/Entanglement/FredkinEntanglingPowerRefutation.lean` at pinned commit [{commit}](trureturing:) and its exact line number.
3. **Step 3: Audit statement faithfulness directly in Lean source.**
   Inspect `def claim : Prop := entanglementGeneration = 2` and `theorem result : ¬ claim`, verifying zero hidden shortcuts, zero altered definitions, and zero `sorry` placeholders.
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

Expect `lake build` to exit with zero errors and `#print axioms` to list only standard Lean axioms (`propext`, `Classical.choice`, `Quot.sound`—zero `sorryAx` and zero custom axioms). Once both pass, that result no longer rests on ChronoAI, The Omega Institute, or any author's word—it rests solely on the Lean 4 kernel.

> **Why three `trureturing` commit SHAs appear across the edition**: `e55900e` anchors the November 19, 2026 720-hour continuous commit cadence audit; `05ceb90` anchors the November 20, 2026 cumulative snapshot (`167,819` frozen theorems and `2,128` literature resolutions); and `trureturing.lock.json` pins [{commit}](trureturing:) on `dev` to resolve exact source line numbers and `statement_id` digests for all 21 cited theorems. Always check out the lockfile commit when replaying Step 5 above.

## Full Declaration Index for All 21 Frozen Theorems

The identical five-step audit applies to **all 21 frozen Lean 4 theorems** cited across this monograph—covering `FIB ATOM`, Information Escape, forced complex Hilbert space, forced 3D rigidity, all seven flagship literature resolutions, and the Riemann Hypothesis integer Hankel equivalence. Open the build-generated declaration index below for direct pinned links to every file and line number:

::: {.stats src="declarations" display="link" group="theorems" format="html"}
Inspect all 21 frozen Lean 4 theorem declarations cited in this volume
:::
