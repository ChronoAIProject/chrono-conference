# Chapter 5: heca—Local-First Multi-Provider Orchestration

Running one coding agent needs one terminal tab. Running dozens of agents across 74 active repositories landing 141,624 commits in sixty days—or building four bilingual books, twenty-six computed figures, seven interactive labs, four Slidev decks, and five narrated films in parallel—turns plain terminal tabs into chaos within ten minutes:

- Parallel edits stomp over each other's working tree and overwrite tests;
- Permission prompts drown inside twelve scrolling panes while nobody knows which worker is blocked;
- Heterogeneous specialists running across different providers cannot see one another's screenshots, terminals, or goal state.

**`heca`** (always lowercase—our local-first spatial orchestration canvas) exists to kill multi-agent chaos at the root.

## Spatial Canvas + Worktree Isolation: One Command Deck for 27 Agent Types

`heca` follows a blunt experimentalist instinct: **pull concurrency out of invisible background PIDs onto one spatial canvas, and eliminate concurrent write races physically with real Git worktrees.**

::: {.figure src="ch05-heca-worktree-topology"}
**`heca` Local-First Spatial Canvas & Worktree Topology.** One local canvas coordinates **27 agent types** (`6` primary providers + `21` ACP agents across `361` nightlies); every worker receives an isolated Git worktree, dedicated terminal, and browser panel governed through one unified permission queue and Goal Ledger.
:::

Four primitives do the heavy lifting every single day:

1. **True Multi-Provider Openness (`6 + 21 = 27`)**: `heca` never locks builders to a single upstream vendor. As of November 26, 2026, it drives **6 primary providers** alongside **21 Agent Client Protocol (ACP) agents**—**27** mix-and-match execution classes collaborating on one board.
2. **One Task, One Worktree**: Every parallel assignment spins up a managed Git worktree sharing the underlying `.git` object store without duplicating storage, keeping builds, diffs, and dirty states physically separated until merge.
3. **Embedded Browser & Visual Loop**: Workspaces attach controllable browser panels directly inside the canvas (navigation, DOM reads, screenshots, JS evaluation), closing visual QA loops without leaving the orchestrator.
4. **Unified Permission Queue & Goal Ledger**: Every escalated action funnels into one inspectable permission queue, while long-running autonomous missions log turns, active time, and verified artifact receipts inside a structured Goal Ledger—never trusting vague claims of "almost done."

## 361 Nightlies—and One Unmistakable Transparency Note

Across the 60-day window ending November 19, 2026, the `heca` line logged **12,053 commits** (`4,404` in the final 30 days) and shipped **361 nightly builds**, driving ChronoAI's daily multi-agent engineering—including the very gateway orchestrating the conference edition you are reading.

Yet our rule from Volume I stands firm: **never call unshipped source "open source."** As of November 26, 2026, **`heca`'s source code is not yet publicly released** (packaging under `getheca` remains in progress). [Appendix B](appendix-b-security-and-readiness.md) flags this explicitly as *source pending* so no external developer wastes five minutes hitting a 404.

Cloud `CMA` and local `heca` give teams extraordinary execution speed. Yet speed without brakes only multiplies wreckage: **how do you stop high-velocity agents from silently skipping checks, gaming test harnesses, or blindly running two hours of browser suites for a one-line prose edit?**

Enter Layer 4—the coldest referee in the entire stack: **`chrono-harness` and `sshx`**. Chapter 6 takes the scalpel to executable governance.
