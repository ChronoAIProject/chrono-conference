---
# 01 Cover
theme: ../../../../theme/slides
title: "The Complete Vehicle · Product Architecture"
info: "Companion deck to The Complete Vehicle: six engineering failure modes that wreck agent prototypes, and the mechanical cures in NyxID, NyxBot, Ornn, CMA, heca and chrono-harness."
htmlAttrs:
  lang: "en"
deck:
  code: "CHRONO//STACK"
  book: "The Complete Vehicle"
  title: "Product Architecture"
  version: "0.1.0"
  blurb: "Six failure modes and six mechanical cures, from zero-key proxying to executable judges, with an honest readiness matrix."
layout: cover
preloadImages: false
---

<p class="kicker">ChronoAI · Product Architecture</p>
<h1 class="display">The Complete<br><em>Vehicle</em></h1>
<p class="lead">Six failure modes that shatter agent prototypes on contact, and the six mechanical cures we welded on.</p>

---
# 02 Overview: six failure modes, six gates
section: "Overview"
---

<div class="body">
  <p class="kicker">Six failure modes · six gates</p>
  <h2 class="t">Six Hard Gates Between a Demo and <em>Production</em></h2>
  <table class="t mt">
    <thead><tr><th>#</th><th>Failure</th><th>Cure</th><th>One invariant</th></tr></thead>
    <tbody>
      <tr><td class="mono">01</td><td>Plaintext secrets</td><td><span class="mono hl-cyan">NyxID</span></td><td>Zero plaintext keys in agent context, always</td></tr>
      <tr><td class="mono">02</td><td>Runaway loops</td><td><span class="mono hl-cyan">NyxBot</span></td><td>Triggers capped at 30 per hour, 300 per day</td></tr>
      <tr><td class="mono">03</td><td>Prompt drift</td><td><span class="mono hl-cyan">Ornn</span></td><td>Skills ship scanned and version-frozen</td></tr>
      <tr><td class="mono">04</td><td>Colliding branches</td><td><span class="mono hl-cyan">CMA · heca</span></td><td>One isolated Git worktree per task (heca)</td></tr>
      <tr><td class="mono">05</td><td>Rules on paper</td><td><span class="mono hl-cyan">chrono-harness</span></td><td>An unregistered file is rejected, never guessed</td></tr>
      <tr><td class="mono">06</td><td>Stuck in the terminal</td><td><span class="mono hl-cyan">chrono-metaverse · Living with AI</span></td><td>The same NyxID guardrails reach spaces and homes</td></tr>
    </tbody>
  </table>
</div>
<Source>The Complete Vehicle, Chapters 1–7 and Appendix B · checked 2026-11-25 to 11-27</Source>

---
# 03 Failure 01: secrets
layout: section
chapter: "01"
section: "Failure 01 · Secrets"
---

<p class="kicker">Failure 01 · Plaintext keys</p>
<h2 class="t">Never Tape the Vault Code<br><em>to the Envelope</em></h2>
<p class="lead">Put production keys in a <code>.env</code> and hand them to an agent that reads the open web: that is the envelope. One poisoned page mails every key away.</p>

---
# 04 NyxID: zero-key proxy
section: "NyxID"
---

<div class="body">
  <p class="kicker">NyxID · v0.78.0</p>
  <h2 class="t">Agents Hold Handles, <em>Never Plaintext Keys</em></h2>
  <div class="split mt">
    <img src="./img/ch01-nyxid-proxy-layers.en.svg" alt="NyxID four-layer zero-key proxy: agent context, policy and approval gate, encrypted vault, upstream services" style="height: 560px; width: auto; max-width: 100%; object-fit: contain; display: block; margin: 0 auto;">
    <div style="align-self: center;">
      <Stat value="0" label="plaintext keys ever enter agent context" />
      <dl class="readout mt">
        <dt>Cadence</dt><dd>63 minors / 8 wks</dd>
        <dt>Signup</dt><dd>Open, no invite</dd>
        <dt>Metering</dt><dd class="cy">1 credit = 1 USD</dd>
        <dt>Keys</dt><dd>BYOK supported</dd>
      </dl>
    </div>
  </div>
</div>
<Source>ChronoAIProject/NyxID@v0.78.0 · api.nyxid.ai public config · 2026-11-03 to 11-26</Source>

---
# 05 Failure 02: runaway
layout: section
chapter: "02"
section: "Failure 02 · Runaway"
---

<p class="kicker">Failure 02 · Runaway loops</p>
<h2 class="t">Chatboxes Die of <em>Context Rot and Event Storms</em></h2>
<p class="lead">Finance rules, a 30-question press script, 1,108 seats and the latest commits in one window: the instructions start to fight.</p>
<p class="sm muted mt">Snapshot: 30-question bank as of 2026-11-27 (Vol. IV, Ch. 4) · 1,108 seats as of 2026-11-25</p>

---
# 06 NyxBot: a mesh with hard budgets
section: "NyxBot"
---

<div class="body">
  <p class="kicker">NyxBot · NyxAgent · nyx-assistant-sdk</p>
  <h2 class="t">Split the Chatbox Into a <em>Budgeted Specialist Mesh</em></h2>
  <div class="split mt">
    <img src="./img/ch02-nyxbot-specialist-mesh.en.svg" alt="NyxBot specialist mesh: 8 specialists by default, 32 at most, 8 per group, 50 memory slots, 30 triggers per hour and 300 per day" style="height: 540px; width: auto; max-width: 100%; object-fit: contain; display: block; margin: 0 auto;">
    <div style="align-self: center;">
      <Stat value="300" unit="/day" label="hard cap on automatic triggers, plus 30 per hour" />
      <ul class="plain mt">
        <li>Caps live in <code>assistant_settings.rs</code>, not in a prompt</li>
        <li><code>nyx-assistant-sdk</code>: the browser only handshakes a NyxID session; zero keys in front-end code</li>
      </ul>
    </div>
  </div>
</div>
<Source>ChronoAIProject/NyxID@v0.78.0 · backend/src/models/assistant_*.rs · 2026-11-03</Source>

---
# 07 Failure 03: drift
layout: section
chapter: "03"
section: "Failure 03 · Drift"
---

<p class="kicker">Failure 03 · Prompt drift</p>
<h2 class="t">A Prompt Pasted Seven Times <em>Is a Time Bomb</em></h2>
<p class="lead">Any instruction that can fire a real API write is executable software. It needs a version, a security scan and a declared list of the permissions it uses.</p>

---
# 08 Ornn: skill lifecycle
section: "Ornn"
---

<div class="body">
  <p class="kicker">Ornn · v0.18.0 Alpha · nyx-skills</p>
  <h2 class="t">Skills Are Software. <em>Ship Them Like Software.</em></h2>
  <div class="split mt">
    <img src="./img/ch03-ornn-skill-lifecycle.en.svg" alt="Ornn five-stage skill lifecycle: author or generate, AgentSeal scan, version freeze, NyxID service binding, agent pull and audit" style="height: 540px; width: auto; max-width: 100%; object-fit: contain; display: block; margin: 0 auto;">
    <div style="align-self: center;">
      <Stat value="286" label="test files: count the tests before you hear the features" />
      <dl class="readout mt">
        <dt>API</dt><dd>134 OpenAPI ops</dd>
        <dt>Skills</dt><dd>163 public</dd>
        <dt>Scan</dt><dd>AgentSeal</dd>
        <dt>SDKs</dt><dd>TS 0.4.0 · Py 0.2.0</dd>
      </dl>
    </div>
  </div>
</div>
<Source>ChronoAIProject/Ornn@v0.18.0 (109 paths · Nov 19 / 27, 2026) · nyx-skills@d77457c (Nov 27, 2026)</Source>

---
# 09 Failure 04: concurrency
layout: section
chapter: "04"
section: "Failure 04 · Concurrency"
---

<p class="kicker">Failure 04 · Colliding branches</p>
<h2 class="t">Zero-Ops Cloud and Local Swarms <em>Need Two Cockpits</em></h2>
<p class="lead">A shop owner wants a cloud seat with nothing to configure. An engineer wants dozens of agents at once, none trampling another's branch.</p>

---
# 10 CMA: managed cloud agents and hot revoke
section: "CMA"
---

<div class="body">
  <p class="kicker">CMA · ChronoAI Managed Agent · cma.nyxid.ai</p>
  <h2 class="t">New Permissions, Same Sandbox: <em>About 2.1 s</em></h2>
  <div class="flow mt-l">
    <div class="step"><span class="i">01 · Sandbox</span><b>Isolated runs</b><p>One sandbox and file tree per instance; no cross-tenant bleed.</p></div>
    <div class="step"><span class="i">02 · cmaeg</span><b>Event gateway</b><p>Verify, dedupe, debounce; outbound goes <code>prepare</code>, then <code>commit</code>.</p></div>
    <div class="step"><span class="i">03 · Runtime</span><b>Hot credentials</b><p>A NyxID rebind or revoke lands in about 2.1 s.</p></div>
    <div class="step"><span class="i">04 · Console</span><b>Audit view</b><p>Events, transcripts and permission requests on one screen.</p></div>
  </div>
  <div class="card mt-l">
    <h4>Today's limit</h4>
    <p>Hosted instances focus on one primary coding runtime; open hot-switching across other runtimes is still on the roadmap.</p>
  </div>
</div>
<Source>The Complete Vehicle, Chapter 4 · cma.nyxid.ai · checked 2026-11-26</Source>

---
# 11 heca: local-first orchestration
section: "heca"
---

<div class="body">
  <p class="kicker">heca · local-first orchestration</p>
  <h2 class="t">27 Agent Types, <em>One Worktree per Task</em></h2>
  <div class="split mt">
    <img src="./img/ch05-heca-worktree-topology.en.svg" alt="heca local-first canvas: 27 agent types, an isolated Git worktree with live terminal and browser panel per worker, one permission queue and Goal Ledger" style="height: 560px; width: auto; max-width: 100%; object-fit: contain; display: block; margin: 0 auto;">
    <div style="align-self: center;">
      <Stat value="27" label="agent types: 6 primary providers + 21 ACP agents" />
      <dl class="readout mt">
        <dt>Nightlies</dt><dd>361</dd>
        <dt>Approvals</dt><dd>Single queue</dd>
        <dt>Goals</dt><dd>Goal Ledger</dd>
        <dt>Source</dt><dd class="hot">Not yet public</dd>
      </dl>
    </div>
  </div>
</div>
<Source>The Complete Vehicle, Chapter 5 · checked 2026-11-26</Source>

---
# 12 Failure 05: governance
layout: section
chapter: "05"
section: "Failure 05 · Governance"
---

<p class="kicker">Failure 05 · Rules on paper</p>
<h2 class="t">Polite Prompts Cannot Govern <em>59 Commits an Hour</em></h2>
<p class="lead">Take <code>the-omega-institute/trureturing</code>: over 720 straight UTC hours, Oct 21 to Nov 19, 2026, the median was 59 commits per hour.</p>

---
# 13 chrono-harness: executable judges
section: "chrono-harness"
---

<div class="body">
  <p class="kicker">chrono-harness v0.1.4 · sshx v1.0.0-beta.58</p>
  <h2 class="t">Put the Judge in a Binary, <em>Not in a Prompt</em></h2>
  <div class="split mt">
    <img src="./img/ch06-harness-delta-pipeline.en.svg" alt="chrono-harness incremental judging pipeline: Git diff, explicit FILEMAP lookup, transitive DELTA selection, candidate judges, pass or fail evidence receipt" style="height: 580px; width: auto; max-width: 100%; object-fit: contain; display: block; margin: 0 auto;">
    <ul class="plain" style="align-self: center;">
      <li><b>FILEMAP</b>: an unregistered dependency is rejected, never guessed</li>
      <li><b>DELTA</b>: run only what the change reaches; one prose edit wakes 2 of 14 units (schematic model)</li>
      <li><code>policy.mixed-warning</code>: touch rules and product together, get a visible alarm</li>
      <li><code>completeness_proven: false</code>: no claim of exhaustive completeness</li>
    </ul>
  </div>
</div>
<Source>ChronoAIProject/chrono-harness v0.1.4 (2026-11-13) · sshx v1.0.0-beta.58 (ChronoAIProject/consensus-rnd, 2026-11-25)</Source>

---
# 14 Beyond the terminal
section: "Beyond the Terminal"
---

<div class="body">
  <p class="kicker">Failure 06 · Stuck in the terminal</p>
  <h2 class="t">Same Guardrails, <em>From 3D Space to the Living Room</em></h2>
  <img class="mt" src="./img/ch07-physical-digital-twin.en.svg" alt="Digital and physical surfaces: chrono-metaverse 3D spaces and chrono-cd deploys; Living with AI reaches sensors and actuators through nyx-homeassistant-node and NyxID permissions" style="height: 460px; width: auto; max-width: 100%; object-fit: contain; display: block; margin: 0 auto;">
  <p class="lead mt">Reading a sensor runs on its own. Moving a safety-critical physical actuator waits for a human.</p>
</div>
<Source>ChronoAIProject/nyx-homeassistant-node@v1.1.1-alpha.52 (2026-11-04) · The Complete Vehicle, Chapter 7</Source>

---
# 15 Honest readiness matrix
section: "Honest Matrix"
---

<div class="body">
  <p class="kicker">Readiness matrix · checked 2026-11-25 to 11-27</p>
  <h2 class="t">What Runs Today, and <em class="magenta">What Doesn't Yet</em></h2>
  <table class="t mt">
    <thead><tr><th>Component</th><th>Live today</th><th>Current limit</th></tr></thead>
    <tbody>
      <tr><td class="mono">NyxID</td><td>Public · v0.78.0 · open signup</td><td>Still shipping weekly; enterprise SLA matures with first merchants</td></tr>
      <tr><td class="mono">Ornn</td><td>Public Alpha · v0.18.0 · 163 public skills</td><td>Alpha; third-party submission review still growing</td></tr>
      <tr><td class="mono">CMA</td><td>Running in the cloud · about 2.1 s hot revoke</td><td>One primary coding runtime today</td></tr>
      <tr><td class="mono">heca</td><td>Daily internal production · 361 nightlies</td><td>Source not yet public</td></tr>
      <tr><td class="mono">chrono-harness</td><td>Open source · v0.1.4 · 16 binaries</td><td><code>completeness_proven: false</code></td></tr>
      <tr><td class="mono">NyxBot Finance</td><td>24 / 28 flows on demo ledgers</td><td>0 external paying merchants; read and draft only, no payment rights</td></tr>
    </tbody>
  </table>
</div>
<Source>The Complete Vehicle, Appendix B · trust boundaries and readiness matrix</Source>

---
# 16 Closing
layout: cover
---

<p class="kicker">Core stack open · heca pending · skeptics welcome</p>
<h1 class="display">Open the Repos,<br><em>Bring a Hammer</em></h1>
<p class="lead">Don't trust the slides; read the repositories. Every number here carries a source and a date.</p>
<dl class="readout mt">
  <dt>Code</dt><dd class="cy"><a href="https://github.com/ChronoAIProject">github.com/ChronoAIProject</a></dd>
  <dt>Contact</dt><dd>contact@chrono-ai.fun</dd>
  <dt>Pinned</dt><dd><PinnedCommit /></dd>
</dl>
