#!/usr/bin/env node
// Browser regression suite for NYXID//VAULT (books/agent-infrastructure/viz/nyxid-credential-flow/):
//   node books/agent-infrastructure/viz/tests/nyxid-credential-flow.test.mjs   (or: node tools/node/viz-test.mjs agent-infrastructure)
// It first runs the quality gates every stage-first page must pass, then reads the page through the read-only probe
// window.NYXID_VAULT_DEBUG and checks every claim against a model written here: an environment of k plaintext keys
// that an injected agent can dump, a context that holds one opaque handle, a reload clock in seconds, and a meter that
// counts in integer cents. Then the stills of the four cards a chapter cites, in both languages.
import { session, stageFirstChecks, settle, until, playsAfter, openStill, cjkLeftovers } from '../../../../tools/node/viz-testkit.mjs';

const BOOK = 'agent-infrastructure', ID = 'nyxid-credential-flow';

/* ---------- independent model ---------- */
/** The legacy agent: one plaintext key per attached service, all of it in the environment it can read. */
const legacyEnv = (k) => Object.fromEntries(Array.from({ length: k }, (_, i) => [`SERVICE_${i + 1}_API_KEY`, `sk-live-${(i * 7919 + 13).toString(36)}`]));
/** What an injected agent can dump: every value of its environment that looks like a secret. */
const dumpable = (env) => Object.values(env).filter((v) => /^sk-/.test(v)).length;
/** The NyxID agent: its context holds one opaque capability handle, never a secret. */
const nyxContext = () => ({ handle: 'cap://issues.read/opaque' });
const nyxDumpable = (ctx) => Object.values(ctx).filter((v) => /^sk-/.test(v)).length;
/** Least-squares line through points [x, y]. */
function fitLine(pts) {
  const n = pts.length, sx = pts.reduce((s, p) => s + p[0], 0), sy = pts.reduce((s, p) => s + p[1], 0);
  const sxx = pts.reduce((s, p) => s + p[0] * p[0], 0), sxy = pts.reduce((s, p) => s + p[0] * p[1], 0);
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  return { slope, intercept: (sy - slope * sx) / n };
}
/** The meter in integer cents: calls in order, each served while the running total stays within the ceiling. */
function meterCents(costCents, capCents, calls) {
  let spent = 0, served = 0, stopped = 0;
  for (let i = 0; i < calls; i++) { if (spent + costCents <= capCents) { spent += costCents; served++; } else stopped++; }
  return { spent, served, stopped };
}
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;

const T = await session();
const { check } = T;
await stageFirstChecks(T, BOOK, ID);

const page = await T.goto(BOOK, ID, '?lang=zh');
await page.evaluate(() => document.fonts && document.fonts.ready); await settle(page, 300);
const D = (fn, arg) => page.evaluate(fn, arg);
const state = async () => { await settle(page); return D(() => window.NYXID_VAULT_DEBUG.state); };
const seek = async (t) => { await D((v) => window.NYXID_VAULT_DEBUG.seek(v), t); return state(); };
const set = async (o) => { await D((v) => window.NYXID_VAULT_DEBUG.set(v), o); return state(); };
const at = (scenario, k, t, mode) => D(([a, b, c, d]) => window.NYXID_VAULT_DEBUG.at(a, b, c, d), [scenario, k, t, mode]);
const text = (sel) => page.textContent(sel);

/* ---------- opening view ---------- */
let st = await state();
check('page carries its id', (await D(() => document.body.dataset.vizId)) === ID);
check('opens on DIRECT-LEAK: the injection, k = 12, at its still t = 80, at rest', st.preset === 'direct-leak' && st.scenario === 'inject' && st.k === 12 && st.t === 80 && !st.playing, JSON.stringify(st));

/* ---------- the blast radius: legacy = k, NyxID = 0, for every k in 1 … 55 ---------- */
const params = await D(() => window.NYXID_VAULT_DEBUG.params);
check('the slider runs over the 55 built-in services', params.K_MAX === 55 && (await D(() => document.getElementById('kRange').max)) === '55');
let blastOK = true, blastBad = ''; const pts = [];
for (let k = 1; k <= 55; k++) {
  const m = await at('inject', k, 100);
  const want = dumpable(legacyEnv(k));
  pts.push([k, m.exposed.legacy]);
  if (m.exposed.legacy !== want || m.leaked.legacy !== want || m.exposed.nyxid !== nyxDumpable(nyxContext()) || m.leaked.nyxid !== 0) { blastOK = false; blastBad = `k = ${k}: ${JSON.stringify(m)} (want ${want})`; break; }
}
check('injection at the end of the rail: the legacy lane exposes and leaks exactly the k keys of its env, NyxID 0 (k = 1 … 55)', blastOK, blastBad);
const line = fitLine(pts);
check('the legacy blast radius is linear in k: slope 1, intercept 0', near(line.slope, 1) && near(line.intercept, 0), JSON.stringify(line));
let zeroOK = true, zeroBad = '';
for (const sc of ['read', 'write', 'inject', 'revoke', 'meter']) for (const k of [1, 7, 12, 30, 55]) for (let t = 0; t <= 100; t += 5) {
  const m = await at(sc, k, t);
  if (m.exposed.nyxid !== 0 || m.leaked.nyxid !== 0 || m.exposed.legacy !== k) { zeroOK = false; zeroBad = `${sc} k=${k} t=${t}: ${JSON.stringify(m.exposed)} ${JSON.stringify(m.leaked)}`; }
}
check('NyxID readable and leaked secrets are 0 in every scenario, for every sampled k and moment; the legacy env always holds k', zeroOK, zeroBad);
const leakCurve = [];
for (let t = 0; t <= 100; t += 1) leakCurve.push((await at('inject', 12, t)).leaked.legacy);
check('along the injection the legacy leak never decreases, starts at 0 before the poisoned response and ends at k', leakCurve.every((v, i) => !i || v >= leakCurve[i - 1]) && leakCurve[44] === 0 && leakCurve[100] === 12, leakCurve.join(','));
check('reading or writing leaks nothing in either lane', (await at('read', 30, 100)).leaked.legacy === 0 && (await at('write', 30, 100)).leaked.legacy === 0);

/* ---------- the controls ---------- */
await page.click('#scenarioChips [data-scenario="read"]'); st = await state();
check('the scenario chips switch the scenario and leave the card', st.scenario === 'read' && st.preset === null && /自由探索/.test(await text('#presetNote')));
check('READ: scope ✓, then 200 OK with scrubbed headers and one audit entry', st.verdict.startsWith('200 OK') && st.audit === 1, JSON.stringify(st));
await page.click('#scenarioChips [data-scenario="write"]'); st = await state();
check('WRITE: the read:issues handle is refused with 403 out of scope', /403 out of scope/.test(st.verdict) && st.audit === 1, st.verdict);
await page.evaluate(() => { const el = document.getElementById('kRange'); el.value = '41'; el.dispatchEvent(new Event('input', { bubbles: true })); }); st = await state();
check('the k slider sets k; the pills and the key readout follow', st.k === 41 && (await text('#pillK')).includes('41') && (await text('#pillLegacy')).includes('41') && (await text('#roBlast')).includes('41'));
check('the NyxID pill stays at 0 while k moves', (await text('#pillNyx')).trim().endsWith('0'));
for (const [key, sc] of [['1', 'read'], ['2', 'write'], ['3', 'inject'], ['4', 'revoke'], ['5', 'meter']]) {
  await page.keyboard.press(key); check(`key ${key} switches to the scenario ${sc}`, (await state()).scenario === sc);
}
await seek(0); await page.keyboard.press('ArrowRight'); st = await state();
check('→ steps the rail by 5', near(st.t, 5), String(st.t));
await page.keyboard.press('Space');
check('Space plays the trace', await until(page, () => { const d = window.NYXID_VAULT_DEBUG.state; return d.playing && d.t > 5; }));
await page.keyboard.press('Space'); check('Space pauses', !(await state()).playing);
await page.click('#rew'); check('⏮ returns to the start', (await state()).t === 0);

/* ---------- the hot reload: 2.1 s, no restart, then 403 REVOKED ---------- */
st = await set({ scenario: 'revoke', k: 12, t: 0 });
check('REVOKE at t = 0: the binding is active and the rail reads in seconds', st.reload.state === 'active' && /0\.00 s/.test(await text('#tau')));
const r = st.reload;
check('the reload takes convergedAt − revokedAt = 2.1 s on the rail\'s clock (0.05 s a unit)', near(r.convergedAt - r.revokedAt, 2.1) && near(r.seconds, 2.1)
  && near((params.CONVERGE_T - params.REVOKE_T) * st.secondsPerUnit, 2.1), JSON.stringify(r));
st = await seek(params.REVOKE_T + 20);
check('half-way the binding is propagating and the running sandbox has not restarted', st.reload.state === 'propagating' && st.reload.sandboxRestarts === 0 && near(st.reload.elapsed, 20 * 0.05));
st = await seek(params.CONVERGE_T); const conv = st.reload;
check('at convergence the binding is revoked, elapsed 2.1 s, sandbox restarts 0', conv.state === 'revoked' && near(conv.elapsed, 2.1) && conv.sandboxRestarts === 0);
st = await seek(100);
check('later calls get 403 REVOKED; the legacy lane restarts once to pick up a rotated key', st.verdict === '403 REVOKED' && st.restarts.legacy === 1 && st.restarts.nyxid === 0, JSON.stringify(st.restarts));

/* ---------- the meter: 1 credit = 1 USD, a ceiling that stops the rest ---------- */
const want = meterCents(Math.round(params.COST * 100), Math.round(params.CAP * 100), params.CALLS);
st = await set({ scenario: 'meter', mode: 'credits', t: 100 });
check(`METER at the end: ${want.served} served, ${want.stopped} stopped, ${want.spent / 100} credits, as counted here in cents`, st.bill.issued === params.CALLS && st.bill.served === want.served && st.bill.stopped === want.stopped
  && near(st.bill.spend * 100, want.spent) && near(st.bill.credits, st.bill.usd), JSON.stringify(st.bill));
check('the ceiling is never passed at any moment of the rail', await (async () => { for (let t = 0; t <= 100; t += 2.5) { const m = await at('meter', 12, t, 'credits'); if (m.bill.spend > params.CAP + 1e-9) return false; } return true; })());
check('the legacy lane is charged for every call: no ceiling', near(st.bill.legacySpend, params.CALLS * params.COST));
await page.click('#modeChips [data-mode="byok"]'); st = await state();
check('BYOK: the same calls stop at the same ceiling, no credits are debited, the spend is billed to the own key', st.mode === 'byok' && st.bill.credits === 0 && near(st.bill.usd, want.spent / 100) && st.bill.served === want.served);
await page.click('#modeChips [data-mode="credits"]');

/* ---------- the cards play; each declares its still ---------- */
for (const c of ['direct-leak', 'scoped-proxy', 'hot-reload', 'billing-meter']) {
  check(`card ${c} plays its trace from the start when clicked`, await playsAfter(page, () => page.click(`[data-preset="${c}"]`), () => window.NYXID_VAULT_DEBUG.state));
}
check('every card declares the still frame of its figure', JSON.stringify(await D(() => [...document.querySelectorAll('[data-preset]')].map((b) => `${b.dataset.preset}:${b.dataset.still}`)))
  === JSON.stringify(['direct-leak:80', 'scoped-proxy:65', 'hot-reload:55', 'billing-meter:90']));
await D(() => { const b = document.getElementById('play'); if (b.getAttribute('aria-pressed') === 'true') b.click(); });

/* ---------- the stills a chapter cites ---------- */
const STILLS = {
  'direct-leak': (s) => s.scenario === 'inject' && s.k === 12 && s.t === 80 && s.exposed.legacy === 12 && s.leaked.legacy === dumpable(legacyEnv(12)) && s.exposed.nyxid === 0 && s.leaked.nyxid === 0,
  'scoped-proxy': (s) => s.scenario === 'inject' && s.k === 55 && s.t === 65 && s.exposed.nyxid === 0 && s.leaked.nyxid === 0 && /lateral egress denied/.test(s.verdict),
  'hot-reload': (s) => s.scenario === 'revoke' && s.t === 55 && s.reload.state === 'revoked' && near(s.reload.elapsed, 2.1) && s.reload.sandboxRestarts === 0 && s.exposed.nyxid === 0,
  'billing-meter': (s) => s.scenario === 'meter' && s.t === 90 && s.bill.issued === 20 && s.bill.served === want.served && s.bill.stopped === want.stopped && near(s.bill.spend * 100, want.spent) && near(s.bill.credits, s.bill.usd)
};
for (const lang of ['zh', 'en']) for (const [card, ok] of Object.entries(STILLS)) {
  const still = await openStill(T, BOOK, ID, card, lang), s = await still.evaluate(() => window.NYXID_VAULT_DEBUG.state);
  const hud = await still.textContent('.hud-tl');
  check(`still ${card} (${lang}): the frame of the caption, at rest`, ok(s) && !s.playing, JSON.stringify(s));
  check(`still ${card} (${lang}): the title names the scenario and k`, hud.includes(`k = ${s.k}`), hud);
  if (lang === 'en') { const left = await cjkLeftovers(still); check(`still ${card} (en): no Chinese`, left.length === 0, left.slice(0, 3).join(' | ')); }
  await still.context().close();
}

/* ---------- evidence and the drawer ---------- */
check('no LEAN ✓ box: the page cites no theorem, its boxes are MODEL and NUM', await D(() => document.querySelectorAll('.lean').length === 2 && !!document.querySelector('.lean.model') && !!document.querySelector('.lean.num') && !document.querySelector('a[data-lean-gid]')));
await page.click('#infoBtn');
check('the drawer says in both languages that the page is a model, not a proof', /不是证明/.test(await text('#drawer div.zh')) && /not a proof/.test(await text('#drawer div.en')));
await page.keyboard.press('Escape');

/* ---------- English through every scenario ---------- */
await page.click('[data-lang-set="en"]'); await settle(page, 150);
check('English title', (await D(() => document.title)).startsWith('NYXID//VAULT · NyxID credential flow'));
for (const sc of ['read', 'write', 'inject', 'revoke', 'meter']) {
  await page.click(`#scenarioChips [data-scenario="${sc}"]`); await settle(page);
  for (const t of [0, 50, 100]) { await seek(t); const left = await cjkLeftovers(page); check(`English: no Chinese left in ${sc} at t = ${t}`, left.length === 0, left.slice(0, 3).join(' | ')); }
}
await D(() => localStorage.removeItem('tr-lang'));

await page.click('#revokeHandle');
await settle(page);
const revoked = await state();
check('revoking rejects the old revision without exposing a key', revoked.reload.denied && revoked.reload.handleRevision !== revoked.reload.eligibilityRevision && revoked.exposed.nyxid === 0 && (await page.textContent('#hudSub')).includes('403 REVOKED'));

check('no page error, console error or failed request (page-specific part)', T.errors.length === 0, T.errors.slice(0, 4).join(' | '));
await T.finish();
