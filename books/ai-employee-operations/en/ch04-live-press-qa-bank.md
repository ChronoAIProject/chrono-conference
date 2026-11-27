# Chapter 4: Live Press Q&A Bank—30 Approved Answers for Donna

Putting an AI concierge in front of skeptical journalists and systems engineers carries one lethal trap—not sounding stiff, but **improvising past verified evidence.** One guessed figure, one unconfirmed ship date, or one sloppy brand conflation can drain away months of earned credibility in ten minutes.

Concierge **Donna** therefore runs every incoming query through one unforgiving two-branch gate:

::: {.figure src="ch04-qa-gating-flow"}
**Donna Live Press Q&A Decision Gate.** Incoming press and guest queries match first against the canonical 30-item press bank: in-bank matches (cyan branch) return faithful, dated, source-linked replies immediately; unmatched queries pass disclosure redline checks (zero funding claims, zero AI model names, zero hype) and log verbatim into the bottom blue `Log & escalate` node routed to `contact@chrono-ai.fun`.
:::

Test both branches interactively on the `donna-gate` experiment card below—watching an in-bank factual query clear with source citation while an off-script funding or attribution probe stops cold in amber and files an escalation ticket:

::: {.viz src="ai-team-work-ledger" preset="donna-gate" height="500"}
**Donna Press Q&A Gate (`donna-gate`).** Contrasts immediate source-backed replies for in-bank questions against amber hard-blocking and escalation to `contact@chrono-ai.fun` for undisclosed or unverified probes.
:::

## Canonical 30-Question Press Q&A Specification (December 17, 2026)

> **Production Cutover Note:** All thirty answers below are audited against live repositories and production endpoints through **November 27–28, 2026**. They form the **canonical December 17 press specification** staged for Donna's production sheet ahead of **December 16's formal Discord dress rehearsal** (replacing the test event metadata caught during November 27's run). Donna must stay strictly faithful to every count, attribution, and boundary below.

### Group I: Launch & Company Fundamentals (Q1–Q6)

1. **Q1: What is ChronoAI, and how large is your public repository footprint?**
   **A**: ChronoAI (statutory entity `ChronoAI Pte. Ltd.`, Singapore; `https://chrono-ai.fun/`) builds agent infrastructure and governance tooling with roughly `15` full-time human engineers working alongside autonomous agents on our own stack. As of `2026-11-27/28`, six GitHub organizations span **`539` repositories** (`ChronoAIProject` `150`, `the-omega-institute` `59`, `mathesis-papers` `237`, `chrono-harness` `25`, `getheca` `7`, `aevatarAI` `61`).
2. **Q2: When and where does the launch broadcast run, and what rehearsals come first?**
   **A**: **December 17, 2026, `16:00–17:15 SGT` (`08:00–09:15 UTC`)**, a 75-minute English livestream simultaneously on YouTube (`@ChronoAIOfficial`) and LinkedIn Live, paired with the 3D `street-corner` lobby. Preceded by the Dec 11 load/stream drill, Dec 15 artifact freeze, and **Dec 16 formal Discord dress rehearsal**.
3. **Q3: Is this launch really "100% AI-generated" with no outside agency?**
   **A**: Not "100% AI with zero humans"—human architects own specifications, editorial taste, disclosure redlines, and final approvals, while the books host on GitHub Pages and the stream runs on YouTube and LinkedIn Live. What is strictly true: **zero physical cameras, zero rented venue, zero outside production agency**—the virtual lobby and four-stage `chrono-metaverse` broadcast pipeline, five films, four bilingual Slidev decks, seven interactive labs, twenty-six computed figures, four bilingual monographs (pinning **`25` frozen Lean 4 theorems at `548388cd`**, including a blue zero-axiom theorem), and concierge flows were produced and checked by AI systems running on ChronoAI's stack.
4. **Q4: What is the relationship between ChronoAI and The Omega Institute? Can we describe it as a co-branded venture?**
   **A**: **Never as a joint commercial imprint.** `ChronoAI` is the commercial infrastructure company; `The Omega Institute` (never translated) is an independent basic-research brand whose `trureturing` engine runs on shared engineering infrastructure while answering solely to the Lean 4 kernel.
5. **Q5: How much funding have you raised, what is your valuation, or what did this launch cost?**
   **A**: Under our public disclosure boundary, we do not disclose fundraising amounts, valuation, or budgets, nor should they be inferred from public reference metrics. Sole official contact: `contact@chrono-ai.fun`.
6. **Q6: Are those `141,624` commits in 60 days real engineering or bot spam?**
   **A**: Across **`2026-09-20` to `2026-11-19`**, `141,624` commits landed across `74` active repos (`90,295` in the final 30 days; >`13,700` additional local commits since Nov 19). Across `69` repos (`2026-09-08`..`11-07`), explicit bot/agent accounts accounted for **`36,819 / 105,363` (~`35%`, exact `34.9%`, lower bound)**. The majority landed inside `trureturing` behind the Lean 4 compiler and `StrataLint` (`27` registered / **`23` active** rules, now hosted in `the-omega-institute/trureturing-tools`), alongside `NyxBot`, `CMA`, `heca`, `NyxID`, and `chrono-harness`. Every public history is open to audit.

### Group II: The Five-Layer Complete Vehicle (Q7–Q12)

7. **Q7: Why call your strategy "building the vehicle instead of buying an engine"?**
   **A**: **(Analogy)** (never a theorem): frontier reasoning engines are metered commodities anyone can rent, while a bare engine without brakes or gearbox cannot safely enter traffic. Production reliability lives in the zero-secret vault (`NyxID`), skill lifecycle (`Ornn`), twin runtimes (`CMA`/`heca`), and executable judges (`chrono-harness`).
8. **Q8: Is `NyxID` publicly open today, and what are its latest channels and pricing?**
   **A**: Yes—live production at `api.nyxid.ai` runs **`v0.78.0`** (`898fdf245d`, `2026-11-23`; `126` tags, `63` minor releases in 8 weeks) with open signup (`invite_code_required: false`), `55` built-in services, **`42` OpenAPI-to-MCP specs**, `7` LLM gateway providers, `9` messaging channel types (`10` adapters) plus `5` voice profiles and `5` quickstarts; transparent Credits (`1 credit = 1 USD`) plus BYOK. Branch `dev` (`0.79.0`, `2026-11-27`) expands to **`11` messaging channel types (`12` adapters)** adding feature-flagged Meta Messenger and Instagram plus per-bot guest access (`nyxbot:guest-audience-v1`).
9. **Q9: How does `NyxID` keep prompt injection from stealing API keys?**
   **A**: Structural separation—**(Analogy)** a workshop padlock with a numbered brass tag that unlocks one bench cabinet for a single shift and gets re-pinned at sign-off: plaintext OAuth tokens and API keys stay inside the encrypted proxy vault where they are injected and scrubbed; agents hold narrow, expiring opaque capability handles, keeping plaintext keys in context strictly at **`0`**.
10. **Q10: How does `Ornn` differ from a prompt library, and what did `nyx-assistant-sdk` ship?**
    **A**: `Ornn` (`v0.18.0` Alpha, `28` tags, `134` OpenAPI ops across `109` paths, `186,526` LOC, `286` test files, TS `0.4.0` / Python `0.2.0` SDKs) manages skills as software: AgentSeal security scans, immutable versions and dist-tags, diffs, and explicit `NyxID` service scopes; `ChronoAIProject/nyx-skills@25ef75934d` (`2026-11-27`) hosts **`163` public skills, `164` plugin entries, and `1` skillset**. Companion **`nyx-assistant-sdk`** shipped **`v0.2.4`** (`2026-11-28`, voice relay, page screenshot capture, zh/en guided tours) and powers Voice Guide **Alexandra** live on `live.trureturing.org`.
11. **Q11: Who uses `CMA` vs. `heca`, and what are their honest current limits?**
    **A**: `CMA` (`ChronoAIProject/cma`) resumed official releases at **`v0.12.0`** (`2026-11-24`) under an **`Apache-2.0` `LICENSE`** (PR `#3647`), consolidated into 2 core app services (`cma-agent-manager`, `cma-event-gateway`) + K8s `agent-sandbox`, covering `6` IM platforms plus `github`/`custom` with ~`2.1 s` hot credential reload—**still centered on a single primary coding agent runtime today**. `heca` (`getheca/heca`) serves local builders across `27` integrations (`6` primary + `21` ACP), **`360` nightly tags** (latest `0.1.0-nightly-20261121-1`), 6 platforms, and 4 usable runtimes (`Host`, `macOS Sandbox`, `Docker`, `Podman`; Apple `container` remains blocked)—with **its source repo still private/internal**.
12. **Q12: Where does `chrono-harness` live now, and is it formally complete?**
    **A**: Its active home moved to **`https://github.com/chrono-harness/`** (**`25` public repos**, `20` independently versioned component repos `v0.1.3`–**`v0.1.22`**, with `runner v0.1.22`, ~`276k` est. LOC Rust, **`21` prebuilt binaries per platform**, Copier **`v0.1.52`** with `29` atomic rules; old `ChronoAIProject/chrono-harness` was archived `2026-11-22`; root `LICENSE` files are pending on split repos while companion `sshx v1.0.0-beta.58` is MIT). It runs declarative `FILEMAP` + transitive `DELTA` fail-closed selection, and live crates plus archived `SPEC.md` still explicitly hardcode **`completeness_proven: false`** (`parity: unestablished`).

### Group III: The Omega Institute & `trureturing` (Q13–Q18)

13. **Q13: What is `trureturing`'s latest frozen count, monograph output, and 24/7 cadence?**
    **A**: As of **`2026-11-27`** (`trureturing@548388cd`, Lean `4.35.0`), **`223,231` frozen theorems** (`400,377` total frozen decls), **`17,968` frozen modules**, `20,223` `.lean` files, and **`6.02M` LOC** (`223,247` theorems / `6.03M` LOC at `5f390707`). Companion `trureturing-books` continuously publishes 3 bilingual monographs spanning **`344` bilingual content pages/lang (`688` total; `347` incl. `3` prefaces, ~`1.99M` zh chars / `1.59M` en words), `135` interactive labs, `83` explainer films, and `918` theorem blocks citing `2,043` frozen Lean 4 GIDs**; `trureturing-source-theories` holds `1,461` theory volumes. Over 30 days (`10-28`..`11-26`), cadence hit **`720 / 720` (`100.0%`) UTC hours**, median **`63` commits/hr**, and **`217` merged PRs/day**.
14. **Q14: Is `live.trureturing.org` a canned video or live telemetry—and what are the 8 departments?**
    **A**: A live glass observatory tracking **`19,022` truth nodes** (`36,865` total nodes, `28,774` edges) across 8 spiral galaxies, `17` tracked public repos, and **8 functional departments** (`2026-11-27`): (1) Direction, (2) Math Research, (3) Independent Review, (4) Verification, (5) Monographs, (6) Papers & Wiki, (7) Scholar Outreach, and (8) Tools & Studio—narrated live by **Voice Guide Alexandra** (`nyx-assistant-sdk v0.2.4`).
15. **Q15: Have you genuinely resolved over two thousand published problems—including refutations and misses?**
    **A**: Over **`81–82` days** (`2026-09-08`..`11-27`, `trureturing@548388cd`), The Omega Institute's `trureturing` logged **`2,278` unique resolved problems** (**`1,512` proved, `766` refuted**; `2,276` dated + `2` undated; `2,279` at `5f390707`), including **`598` Quantum/Physics** (`314` proved, `284` refuted) and **`127` open $\ge 10$ years** (up to **`47` years**), while keeping **`27` unresolved dossiers** (`2,305` total) visibly on the ledger.
16. **Q16: How have external mathematicians responded—and did anyone turn you away?**
    **A**: As of `2026-11-27` (`trureturing-outreach@d22e63c8`), The Omega Institute contacted **`1,049`** scholars and received **`485`** replies (**`46.2%`**; `1,034` / `478` non-system filtered across ~`299` institutional domains and `47` countries): **`316` positive** (`697` quotes), **`223` collaborating** (`44` co-authoring), **`70` credited/acknowledged**, **`1` published journal paper** (*RAIRO-ITA* 60, 29), **`17` collaborative arXiv preprints (`16` externally coauthored)**, and **`21` OEIS entries** (adding `A024718`, `A048585`, `A392984`)—alongside **`66` declined or stop-outreach requests, all immediately honored** and logged candidly.
17. **Q17: Have the papers on Mathesis passed independent peer review?**
    **A**: **No.** As of `2026-11-27/28`, `https://github.com/mathesis-papers` hosts `237` repos and the live Mathesis API serves **`225` collected papers** (`224` with Lean links, `225` PDFs; catalog snapshot `1,534` registered formal statements, **`218` Zenodo DOIs**), while **formal peer-review acceptances through Mathesis remain `0` and independent verifier receipts remain `0`**. We never dress up preprints as peer-reviewed acceptances.
18. **Q18: Are you claiming to have proved the Riemann Hypothesis—and what are the `8,490` shards?**
    **A**: **Never claim credit we did not earn.** Four three-second press checks:
    - **Attribution:** On **`2026-11-20/21`**, the Lean and Mathlib communities certified **Levent Alpöge's** Lean `4.33.1` proof of classical `RiemannHypothesis` and Dirichlet GRH (`175,187` modules, `17.37M` lines, `[propext, Classical.choice, Quot.sound]`, mirrored at `leanprover-community/riemann-hypothesis`).
    - **Replay & Companion Book:** **`the-omega-institute/riemann-hypothesis`** (`c2dabc97`) built the **`8,490`-shard** reproducible CI and `./verify` replay (`8,558` `.tar.zst` release assets); **`the-omega-institute/riemann-hypothesis-book`** (`ebd24a4d`) is the bilingual guide *Symmetry on the Critical Line* (never the shard host).
    - **`trureturing` Internal Scope:** `ActualXiIntegerCriterion.lean` proves only the integer Hankel nonnegativity equivalence criterion—not RH itself.
    - **Four Red `OPEN` Frontiers:** **Extended RH (general Dedekind $\zeta$ functions), Grand RH (general automorphic $L$-functions), simplicity of zeros, and pair correlation** remain genuinely open.

### Group IV: Virtual Venue, AI Employees & Pilots (Q19–Q24)

19. **Q19: How is `street-corner` laid out, how do guests book, and what happens at capacity?**
    **A**: Three operational lanes:
    - **Venue Geometry & Bot Channels:** `street-corner` (`chronoai-lobby` v40) runs **four stands × 8 tiered rows totaling `1,108` seats** (North `248`, South `248`, East `306`, West `306`; rows `1→8`: `144, 144, 144, 140, 136, 136, 132, 132`; codes like `N1-17`, `E1-20`, `W8-01`). Official booking runs via Telegram **`@chronoai_frontdesk_bot`** (personal-scope for Dec 17 under `NyxID#2912/#2913`; web booking page and phone line `con-14` stay candidly open pre-launch items).
    - **Open Signup vs. No-Login Livestream:** Public read-only viewing sits at `/u/street-corner?view=extended#share=...` (one-click open `NyxID` signup, `invite_code_required: false`); viewers preferring zero login—and Guest `#1,109` onward—route transparently to login-free YouTube (`@ChronoAIOfficial`) and LinkedIn Live HD streams.
    - **Load-Tested Nov 27 Hardening:** After an earlier `750`-row sheet limit snapped, seating moved to the **`sheet-v3` bitmask atomic lock** (~`7.5 s` readback at `1,500` rows); Nov 27 rehearsal logged `13` live Donna ops with `0` drops (median `29 s`, max `63 s`), backed by `chrono-metaverse`'s `1,132` anchors, `96 MiB` quantized cache, and water/tower LUTs to keep browser walks steady under crowds.
20. **Q20: How do Flower Town and its `18` flower stands work?**
    **A**: Along the world-map wall sit **`2` rows × `9` mats** (`basket-01..18`, `0.6 × 0.6 m` each). Guests order via Telegram **`@flowerassis_bot`**, where Blossom validates greeting copy and hands off to Donna for exclusive mat locking in `chrono-metaverse` (`~2.5 minutes` end-to-end).
21. **Q21: How many workflows are actually verified across the AI employee team today?**
    **A**: As of **`2026-11-27 18:47`** (`nyxid-nyxbot-trials@df5ef47`), all four denominators sit on the table: (1) **6 core small-business roles: `82 / 99` (`82.8%`; equal-weight `83.0%`, `+27 pp` WoW)**—Donna `14/15`, Finance `24/28` (`+ 17` permanently human), Social `12/14`, Community `10/12`, HR **`14/20` (honestly downgraded from `15/20`)**, Admin `8/10`; (2) **+ 3 standalone watchdogs** (Sentiment Monitor `6/7`, KB Maintainer `3/3`, Retrospective Analyst `11/11`) = **9 standalone roles: `102 / 120` (`85.0%`; equal-weight `87.1%`)**; (3) `13` scheduled agents in the Social/Community playbook; (4) `15` live audited agents, `89` scheduled tasks, and `931` passing automated tests.
22. **Q22: How many external paying merchants are live in production right now?**
    **A**: **`0` external paying merchants** as of `2026-11-27` (`chrono-goals@35d7cfd`). Finance `24/28` runs against real bank balances plus a demo bookkeeping ledger (verified in a `34`-minute clean-account install with `10` confirmations and `8` approvals); this launch opens our first pilot cohort.
23. **Q23: How does a small business apply for the first pilot cohort?**
    **A**: Send a note under 200 words to `contact@chrono-ai.fun` naming your industry, your two sharpest repetitive workflows (we recommend starting with Concierge + Finance Ledger), and your non-negotiable human red lines—zero raw passwords required.
24. **Q24: Where does `Living with AI` stand today?**
    **A**: Public bridge `ChronoAIProject/nyx-homeassistant-node` sits at **`v1.1.1-alpha.52`** (`main` pushed `2026-11-15`, companion `video-event-monitor 0.5.0-alpha.2`), joined by public hardware panel **`nyxid-esp-panel v1.0.0`** (`2026-11-20`, Apache-2.0)—still early alpha and internal hardware proofs enforcing `NyxID` separation between sensors and actuators.

### Group V: Skeptic & Audit Questions (Q25–Q30)

25. **Q25: Are you secretly running an unreleased proprietary frontier model?**
    **A**: No. Underlying reasoning comes from commercially metered providers open to any engineering team; the difference comes from the five-layer chassis, Truth DAG, information-escape judges, and Lean 4 kernel.
26. **Q26: If AI systems assembled the launch, who is legally and operationally accountable when something fails?**
    **A**: **Human architects and approvers hold final accountability.** AI handles high-speed execution while cash release, legal signatures, merge rules, and sensitive public posts bind to named humans—even in November 27's rehearsal, the high-risk X post waited for a human to reply `"发 149"`.
27. **Q27: How can an independent developer or mathematician check your claims without trusting your slides?**
    **A**: Four zero-friction checks: sign up for public `NyxID`; test `@chronoai_frontdesk_bot` and `street-corner`'s bitmask lock; run Volume III Appendix A's single-module `lake build` on `trureturing` (or `./verify` on `the-omega-institute/riemann-hypothesis`); or clone `chrono-conference` and run `./tbook check`.
28. **Q28: Are you sweeping rehearsal bugs or unfinished components under the rug?**
    **A**: Never. We publish the **HR `15/20 → 14/20` PDF downgrade**, **November 27's 65–70 min Lark gateway stall (`NyxID#2534`)**, the `750`-row sheet crash → `sheet-v3` rewrite, private `heca` source, single-runtime `CMA`, `chrono-harness` `completeness_proven: false`, `0` Mathesis peer-review acceptances & `0` independent verifier receipts, `0` external paying merchants, `66` scholar refusals, and `27` unresolved dossiers straight in the text.
29. **Q29: Where can viewers download the replay, books, decks, and source after broadcast?**
    **A**: Openly published on GitHub Pages and Releases (HTML, screen/print PDFs, academic PDFs for Volumes I and III, EPUB, 4 Slidev decks, 7 interactive labs, 5 720p narrated films with bilingual subtitles), with replays on YouTube `@ChronoAIOfficial` and LinkedIn.
30. **Q30: Who handles deeper technical, pilot, or press questions outside these 30 items?**
    **A**: Leave your question and return address for an immediate tracked ticket, or write straight to our sole public inbox **`contact@chrono-ai.fun`**, targeted for a human reply within 24 hours.

## Mandatory Escalation Circuit for Off-Bank Queries

Whenever a query falls outside Q1–Q30, Donna runs three mechanical steps with zero helpful guesswork:

1. **Name the boundary plainly:** tell the guest the question sits outside the verified specification and will not be improvised;
2. **Capture structured evidence:** log verbatim text, timestamp, channel source, and redline tag;
3. **Escalate to humans:** route to `contact@chrono-ai.fun` on-call triage and return a tracked ticket ID.

With all 30 press gates loaded, Chapter 5 widens the clock across fifteen live operational days—opening with **November 27's scar-revealing dress rehearsal** and marching through **December 4 doors-open, December 16 formal Discord rehearsal, December 17 broadcast and replay, and December 18 post-mortem**.
