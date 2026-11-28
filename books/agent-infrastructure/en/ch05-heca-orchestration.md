# Chapter 5: heca—Local-First Multi-Provider Orchestration

Running one coding agent takes one terminal tab. Running dozens of agents across the 60-day window (`2026-09-20` to `2026-11-19`) in which ChronoAI and independent research brand The Omega Institute landed 141,624 commits across 74 active repositories—or assembling four bilingual books, computed figures, interactive labs, Slidev decks, and narrated films in parallel—turns ordinary terminal tabs into a demolition derby within ten minutes:

- Parallel edits stomp across each other's working tree and silently overwrite passing tests;
- Permission prompts drown inside twelve scrolling panes while nobody knows which worker stalled waiting for sign-off;
- Specialists running on different providers go blind to one another's screenshots, terminal logs, and live goal state.

**`heca`** (always lowercase—our local-first spatial orchestration canvas) exists to kill multi-agent collisions at the physical level.

## A Machinist's Bench With Separate Vises: One Deck for 27 Agent Integrations

**(Analogy)** Putting ten welders onto one steel sheet without separate vises or sightlines does not multiply output by ten; it produces a pile of scorched scrap. `heca` builds a **machinist's workbench with dedicated vises**: pulling concurrency out of invisible background PIDs onto one spatial canvas, then clamping each parallel assignment inside its own real Git worktree so two torches never touch the same working directory at once.

::: {.figure src="ch05-heca-worktree-topology"}
**`heca` Local-First Spatial Canvas & Worktree Topology.** One local canvas coordinates **27 agent integrations** (`6` primary providers + `21` ACP agents across **`360` nightlies**, latest `0.1.0-nightly-20261121-1`) across `6` platforms and `4` usable runtimes; every worker gets an isolated Git worktree, dedicated terminal, and browser panel governed through one unified permission queue and Goal Ledger.
:::

Four blunt primitives carry the daily workload:

1. **True Multi-Provider Openness (`6 + 21 = 27`)**: `heca` refuses to weld builders to one upstream vendor. As of **November 27, 2026** (`main` at `5111cd3b1f`, PR `#2870`), it integrates **6 primary providers** alongside **21 Agent Client Protocol (ACP) agents**—**27** mix-and-match execution classes collaborating, handing off, and verifying work on one shared board.
2. **One Task, One Worktree**: Every parallel assignment opens a managed Git worktree sharing the underlying `.git` object store without duplicating storage, keeping builds, diffs, and dirty working trees physically separated until merge or archive.
3. **Six Platforms & Embedded Visual Loops**: Spanning **6 platforms** (macOS, Linux, and Windows desktop; iOS and Android mobile; plus web), workspaces mount controllable browser panels directly inside the canvas (navigation, DOM reads, screenshots, JS evaluation) so visual QA never leaves the orchestrator.
4. **Unified Permission Queue & Goal Ledger**: Every escalated action funnels into one inspectable permission queue, while long-running missions record turns, active time, and verified artifact receipts inside a structured Goal Ledger—never accepting a casual claim of "almost done."

## Swapping the Terminal Engine Mid-Flight, Four-Adapter Secure Input, and Hermetic Git Hygiene

Once parallel worktrees live on one spatial deck, **`106` merged PRs in 14 days** went straight into the steel seams underneath: terminal byte streams, password keystrokes, and Git process hygiene. Three bench surgeries locked those seams shut:

- **Unified `libghostty-vt` Engine & 24-Stream EOF Harness (PRs `#2821`, `#2825`)**: A single-switch **`2,745`-file `libghostty-vt` engine transplant** (`+185,152/-63,625` lines) ripped out legacy `vt100`/`vte`, `kterm`, and the old `HVT1` restore codec so every Flutter surface (desktop, web, mobile) and the native Rust `gpui` client share one terminal session engine; running it through the **W6 24-concurrent-finishing-streams stress harness (`#2825`)** caught and killed a subtle browser race that dropped late final bytes right at process EOF—leaving one terminal state machine verified to flush the last byte under 24-way concurrent shutdown.
- **Four-Adapter Echo-Off Secure Input Across Three Platforms (PRs `#2845`–`#2870`)**: When a CLI prompt asks for a password or hardware PIN, client-side heuristics stall behind heavy scrollback backpressure while naive mobile password fields pop up iOS AutoFill mid-session. Detection now lives inside the daemon: when the OS flags a canonical **echo-off PTY**, the daemon fires **revisioned `secure` mode transitions decoupled from output flow-control credit**, snapping input protection shut out-of-band across **4 client adapters spanning 3 platforms**—Web (`#2851`), macOS (both the Flutter adapter `#2849` and the native Rust `gpui` adapter `#2850`, with `arm64`/`x86_64` Carbon secure-input linkage verified before signing), and iOS (`#2855`, `#2870`, tuned specifically to mask mobile keystrokes **without triggering iOS password AutoFill**). Scrollback floods can never stall the lock, and secrets never stray into OS autofill caches.
- **Surgical 8-Variable Git Environment Hygiene (PR `#2863`)**: Launching `heca` from inside a Git hook or an active worktree shell lets parent variables such as `GIT_DIR` and `GIT_WORK_TREE` hitch a ride—causing an explicit git call aimed at Repo B to hijack Repo A instead—while wiping the entire environment breaks user SSH agents and credential helpers. PR `#2863` takes a scalpel: on every explicit-repo git call, it surgically strips the exact **8 repository-location Git environment variables** while preserving user credentials untouched, locking each machinist's vise hermetic.

## 360 Nightlies—and Two Boundaries We Refuse to Smudge

Across the 60-day cadence window ending November 19, 2026, the `heca` line logged **12,053 commits** (`4,404` in the final 30 days). As of **November 27, 2026**, the release stream stands at exactly **`360` nightly tags** (latest tag **`0.1.0-nightly-20261121-1`**), with `main` at `5111cd3b1f` (PR `#2870`). The very gateway orchestrating the four-volume conference edition you are reading runs on `heca` daily.

**(Position)** Tap our own hood with the same tuning-fork hammer: bragging about `360` nightlies and `27` agent integrations is easy; engineering honesty means placing the two unfinished edges in full view (mirrored in [Appendix B](appendix-b-security-and-readiness.md)):

- **Four usable runtimes today, one still blocked**: `heca` currently runs cleanly across **4 local isolation runtimes (`Host`, `macOS Sandbox`, `Docker`, `Podman`)**; **Apple's `container` runtime remains blocked**, and we do not pad the count to five.
- **`getheca/heca` source remains private/internal**: While public release artifacts and site documentation live under the `getheca` GitHub organization, the core source repository has not been open-sourced yet. Calling a private repository "open source" is a cheap fraud; every ledger in this book marks `heca` plainly as **private/internal source** so no outside developer wastes five minutes hitting a 404.

Cloud `CMA` and local `heca` push commit velocity straight into the redline—and without brakes, every slip turns into a pileup: **how do you stop high-velocity agents from silently skipping tests, softening grading scripts, or burning two hours of full-repo browser matrices over a three-word typo?**

Enter Layer 4—the coldest mechanical referee in the stack: **`chrono-harness` and `sshx`**. Chapter 6 takes apart the brake calipers.
