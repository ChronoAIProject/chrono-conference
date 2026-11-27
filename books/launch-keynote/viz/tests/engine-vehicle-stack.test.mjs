#!/usr/bin/env node
// Browser regression suite for VEHICLE//STACK (books/launch-keynote/viz/engine-vehicle-stack/):
//   node books/launch-keynote/viz/tests/engine-vehicle-stack.test.mjs   (or node tools/node/viz-test.mjs launch-keynote)
// It first runs the quality gates every stage-first page must pass, then reads the page through the read-only probe
// window.VEHICLE_STACK_DEBUG. Frames are sampled for 80 combinations of events (write policy, approval time, revocation
// time, engine swaps), and each frame is checked against rules written here from the drawer's words, not from the page's
// code: when the write may pass the gate, when a call is refused, in which window a call may carry the plaintext key,
// which engine is in the bay, and that the key is drawn below the NyxID boundary only.
import { session, stageFirstChecks, settle, until, playsAfter, openStill, cjkLeftovers } from '../../../../tools/node/viz-testkit.mjs';

const BOOK = 'launch-keynote', ID = 'engine-vehicle-stack';
const CONTEXT = ['bay', 'harness', 'runtime', 'skills'];
const LAYERS = [...CONTEXT, 'vault', 'surface'];

/* ---------- independent rules (ticks of 0.1 s) ---------- */
const READ_CHECK = 30, READ_KEY = [34, 50], GATE = 66;
/** When the write passes the human gate: at once under auto-pass, else when a human approves (never on its own). */
const passAt = (ev) => (ev.policy === 'auto' ? GATE : ev.approveAt != null ? Math.max(GATE, ev.approveAt) : Infinity);
/** A call is refused when the grant is revoked by the time it would pass NyxID's check. */
const readRefused = (ev) => ev.revokeAt != null && ev.revokeAt <= READ_CHECK;
const writeRefused = (ev) => ev.revokeAt != null && ev.revokeAt <= passAt(ev);
/** The window in which a call may carry the plaintext key: from the injection to the end of the stripping. */
const keyWindow = (call, ev) => (call === 1 ? (readRefused(ev) ? null : READ_KEY) : writeRefused(ev) || passAt(ev) === Infinity ? null : [passAt(ev), passAt(ev) + 10]);
const engineAt = (ev, t) => ev.engines.filter((e) => e[0] <= t + 1e-9).at(-1)[1];

const T = await session();
const { check } = T;

/* ---------- the quality gates of every stage-first page ---------- */
await stageFirstChecks(T, BOOK, ID);

const page = await T.goto(BOOK, ID, '?lang=zh');
await page.evaluate(() => document.fonts && document.fonts.ready); await settle(page);
const D = (fn, arg) => page.evaluate(fn, arg);
const state = async () => { await settle(page); return D(() => window.VEHICLE_STACK_DEBUG.state); };
const TS = Array.from({ length: 401 }, (_, i) => i / 4);

let s = await state();
check('page carries its id', (await D(() => document.body.dataset.vizId)) === ID);
check('opens on HOT-SWAP at 5.0 s, Engine Beta in the bay, not playing', s.preset === 'swap' && s.t === 50 && s.engine === 'beta' && !s.playing, JSON.stringify(s));
const names = await D(() => window.VEHICLE_STACK_DEBUG.engines());
check('the engine bay holds exactly the three placeholder engines', JSON.stringify(Object.values(names)) === JSON.stringify(['Engine Alpha', 'Engine Beta', 'Local Core']), JSON.stringify(names));

/* ---------- every frame of 80 event combinations ---------- */
const combos = [];
for (const policy of ['gate', 'auto']) for (const approveAt of [null, 50, 70, 95]) for (const revokeAt of [null, 10, 31, 64, 80])
  for (const engines of [[[0, 'alpha']], [[0, 'alpha'], [20, 'beta'], [70, 'local']]]) combos.push({ policy, approveAt, revokeAt, engines });
const fails = { context: '', key: '', window: '', engine: '', swap: '', gate: '', refusal: '', reached: '' };
const note = (k, msg) => { if (!fails[k]) fails[k] = msg; };
for (const ev of combos) {
  await D((e) => window.VEHICLE_STACK_DEBUG.set(e), ev); await settle(page);
  const frames = await D((ts) => window.VEHICLE_STACK_DEBUG.sample(ts), TS), tag = JSON.stringify(ev);
  let keyFrames = { 1: 0, 2: 0 };
  for (const f of frames) {
    const sum = CONTEXT.reduce((a, id) => a + f.plain[id], 0), where = `${tag} t=${f.t}`;
    if (sum !== 0 || f.inContext !== 0) note('context', `${where}: plaintext in context ${sum}/${f.inContext}`);
    if (f.carries === 'key') {
      keyFrames[f.call]++;
      if (!['vault', 'surface'].includes(f.layer) || !(f.y > f.boundary)) note('key', `${where}: the key at ${f.layer}, y ${f.y} vs boundary ${f.boundary}`);
      const w = keyWindow(f.call, ev);
      if (!w || f.t < w[0] - 1e-9 || f.t >= w[1] + 1e-9) note('window', `${where}: call ${f.call} carries the key outside ${JSON.stringify(w)}`);
    }
    if (CONTEXT.includes(f.layer) && f.carries === 'key') note('key', `${where}: key in ${f.layer}`);
    if (f.engine !== engineAt(ev, f.t)) note('engine', `${where}: ${f.engine} instead of ${engineAt(ev, f.t)}`);
    if (f.sessions !== 1 || f.reauth !== 0 || f.stateLost !== 0) note('swap', `${where}: ${JSON.stringify([f.sessions, f.reauth, f.stateLost])}`);
    if (f.call === 2 && !writeRefused(ev) && passAt(ev) === Infinity && f.t >= GATE && f.what !== 'wait') note('gate', `${where}: the write is at ${f.what} with no approval`);
    if (f.call === 2 && f.t < passAt(ev) && ['inject', 'ok', 'strip'].includes(f.what)) note('gate', `${where}: the write is past the gate before ${passAt(ev)}`);
    const refused = f.call === 1 ? readRefused(ev) : writeRefused(ev);
    if (refused && ['inject', 'ok', 'strip'].includes(f.what)) note('refusal', `${where}: refused call ${f.call} reached ${f.what}`);
    if (f.done && f.http !== (refused ? 403 : 200)) note('refusal', `${where}: call ${f.call} ended with ${f.http}`);
    if (f.revoked && (f.restarts !== 0 || f.rotated !== 0)) note('refusal', `${where}: restarts ${f.restarts}, rotated ${f.rotated}`);
  }
  if (!readRefused(ev) && keyFrames[1] === 0) note('reached', `${tag}: the read never carried its credential to the surface`);
  const w2 = keyWindow(2, ev); if (w2 && w2[0] < 98 && keyFrames[2] === 0) note('reached', `${tag}: the approved write never carried its credential`);
}
check(`${combos.length} event combinations × ${TS.length} frames: plaintext in context is 0 in every frame, summed band by band`, !fails.context, fails.context);
check('the plaintext key is only ever in NyxID or on the live surface, and drawn below the NyxID boundary', !fails.key, fails.key);
check('a call carries the key only between its injection and the end of its stripping', !fails.window, fails.window);
check('a call that is not refused does carry its credential down to the surface', !fails.reached, fails.reached);
check('the engine in the bay is the last one swapped in by that time', !fails.engine, fails.engine);
check('engine swaps never open a second session, re-authenticate or lose state', !fails.swap, fails.swap);
check('a write never passes the human gate before a human approves it (or auto-pass is chosen)', !fails.gate, fails.gate);
check('a revoked grant refuses the call before any credential is injected; it ends in 403, with no restart and no key rotation', !fails.refusal, fails.refusal);

/* ---------- the hot-reload window ---------- */
await D(() => window.VEHICLE_STACK_DEBUG.set({ engines: [[0, 'local']], policy: 'gate', approveAt: null, revokeAt: 64 }));
const rel = await D(() => window.VEHICLE_STACK_DEBUG.sample([63.9, 64, 74.5, 85, 100]));
check('revocation at 6.4 s: the reload window fills over 2.1 s (half at 7.45 s, whole at 8.5 s) and stays whole', !rel[0].revoked && rel[1].revoked && rel[1].reload === 0
  && Math.abs(rel[2].reload - 0.5) < 1e-9 && rel[3].reload === 1 && rel[4].reload === 1, JSON.stringify(rel.map((f) => [f.t, f.revoked, f.reload])));

/* ---------- controls ---------- */
await D(() => window.VEHICLE_STACK_DEBUG.set({ engines: [[0, 'alpha']], policy: 'gate', approveAt: null, revokeAt: null }));
await D(() => window.VEHICLE_STACK_DEBUG.seek(30));
await page.click('#engineChips [data-engine="local"]'); s = await state();
check('an engine chip swaps the engine at the current time and leaves the card', s.engine === 'local' && JSON.stringify(s.engines) === JSON.stringify([[0, 'alpha'], [30, 'local']]) && s.preset === null, JSON.stringify(s.engines));
check('the swap keeps the session: still 1, no re-authentication', s.sessions === 1 && s.reauth === 0 && s.swaps === 1);
await D(() => window.VEHICLE_STACK_DEBUG.seek(70)); s = await state();
check('with human-gate writes and no approval the write waits at the gate', s.gate === 'waiting' && s.call === 2 && s.carries === 'handle' && /人工/.test(await page.textContent('#roGate')));
await page.click('#approve'); s = await state();
check('"approve this write" records the approval at the current time', s.approveAt === 70 && (await page.evaluate(() => document.getElementById('approve').disabled)));
await D(() => window.VEHICLE_STACK_DEBUG.seek(73)); s = await state();
check('after approval the write passes: at 7.3 s it is on the live surface with its credential', s.what === 'ok' && s.carries === 'key' && s.layer === 'surface');
await D(() => window.VEHICLE_STACK_DEBUG.seek(100)); s = await state();
check('and it ends with 200 back at the current engine', s.done && s.http === 200 && s.layer === 'bay');
await page.click('#policyChips [data-policy="auto"]'); s = await state();
check('the policy chip switches to auto-pass', s.policy === 'auto' && s.gate === 'auto');
await page.click('#policyChips [data-policy="gate"]');
await D(() => window.VEHICLE_STACK_DEBUG.set({ approveAt: null }));
await D(() => window.VEHICLE_STACK_DEBUG.seek(20));
await page.click('#revoke'); s = await state();
check('the revoke chip revokes the grant at the current time', s.revokeAt === 20 && s.revoked && (await page.getAttribute('#revoke', 'aria-pressed')) === 'true');
await D(() => window.VEHICLE_STACK_DEBUG.seek(37)); s = await state();
check('a call that reaches NyxID after the revocation gets 403 and carries no key', s.carries === '403' && s.http === 403 || (s.done && s.http === 403), JSON.stringify(s));
await page.click('#revoke'); s = await state();
check('pressing the revoke chip again withdraws the revocation', s.revokeAt === null && !s.revoked && (await page.getAttribute('#revoke', 'aria-pressed')) === 'false');
await page.locator('body').click({ position: { x: 5, y: 5 } });
await D(() => window.VEHICLE_STACK_DEBUG.seek(66));
await page.keyboard.press('a'); s = await state(); check('key A approves', s.approveAt === 66);
await page.keyboard.press('r'); s = await state(); check('key R revokes', s.revokeAt === 66);
await page.keyboard.press('r');
await D(() => window.VEHICLE_STACK_DEBUG.seek(10));
await page.keyboard.press('ArrowRight'); s = await state(); check('→ steps 0.2 s', Math.abs(s.t - 12) < 1e-9, String(s.t));
await page.keyboard.press(' ');
check('Space plays', await until(page, () => { const d = window.VEHICLE_STACK_DEBUG.state; return d.playing && d.t > 12; }));
await page.keyboard.press(' '); check('Space pauses', !(await state()).playing);

/* ---------- cards ---------- */
check('VAULT plays when clicked', await playsAfter(page, () => page.click('[data-preset="vault"]'), () => window.VEHICLE_STACK_DEBUG.state));
s = await state();
check('VAULT: Engine Alpha, human-gate writes, no events, armed to stop at 5.2 s', s.engine === 'alpha' && s.policy === 'gate' && s.approveAt === null && s.revokeAt === null && (s.stop === 52 || (!s.playing && s.t === 52)), JSON.stringify(s));
await page.locator('#play').evaluate((b) => { if (b.getAttribute('aria-pressed') === 'true') b.click(); }); await settle(page);
await page.click('[data-speed="2.5"]');
await page.click('[data-preset="swap"]');
check('HOT-SWAP plays and stops by itself at 6.2 s, with Engine Beta in the bay', await until(page, () => { const d = window.VEHICLE_STACK_DEBUG.state; return !d.playing && d.t === 62 && d.engine === 'beta'; }, undefined, 120000));
await page.click('[data-speed="1"]');

/* ---------- the stills a chapter prints ---------- */
const STILLS = {
  swap: (x) => x.t === 50 && x.engine === 'beta' && x.swaps === 1 && x.sessions === 1 && x.reauth === 0 && x.call === 1 && x.carries !== 'key' && x.inContext === 0,
  vault: (x) => x.t === 40 && x.engine === 'alpha' && x.call === 1 && x.layer === 'vault' && x.carries === 'key' && x.y > x.boundary && x.inContext === 0 && x.plain.vault === 1,
  approval: (x) => x.t === 68 && x.engine === 'beta' && x.call === 2 && x.gate === 'waiting' && x.carries === 'handle' && x.policy === 'gate' && x.approveAt === null && x.inContext === 0,
  revoke: (x) => x.t === 85 && x.engine === 'local' && x.revoked && x.revokeAt === 64 && x.reload === 1 && x.done && x.http === 403 && x.restarts === 0 && x.rotated === 0 && x.inContext === 0
};
for (const lang of ['zh', 'en']) for (const card of Object.keys(STILLS)) {
  const still = await openStill(T, BOOK, ID, card, lang);
  const x = await still.evaluate(() => window.VEHICLE_STACK_DEBUG.state), hud = await still.textContent('.hud-tl');
  check(`still ${card} (${lang}): the frame carries the numbers of its caption`, STILLS[card](x) && !x.playing && /(上下文明文|plaintext in context) 0/.test(hud) && hud.includes(`${(x.t / 10).toFixed(1)} s`), JSON.stringify({ x, hud }));
  if (lang === 'en') { const left = await cjkLeftovers(still); check(`still ${card} (en): no Chinese`, left.length === 0, left.slice(0, 3).join(' | ')); }
  await still.context().close();
}

/* ---------- a cited figure is the stage alone; the full lab keeps its strip ---------- */
const fig = await T.open(BOOK, ID, '?embed=1&lang=zh&preset=vault', { viewport: { width: 740, height: 500 } });
await settle(fig);
check('cited figure: the strip of small plots is hidden', await fig.evaluate(() => getComputedStyle(document.querySelector('.strip')).display === 'none'));
await fig.context().close();
const lab = await T.open(BOOK, ID, '?embed=1&lang=zh', { viewport: { width: 740, height: 620 } });
await settle(lab);
check('whole lab in a chapter: the strip is shown', await lab.evaluate(() => getComputedStyle(document.querySelector('.strip')).display !== 'none'));
await lab.context().close();

/* ---------- English after free play ---------- */
await page.click('[data-lang-set="en"]'); await settle(page);
await D(() => window.VEHICLE_STACK_DEBUG.set({ engines: [[0, 'alpha'], [40, 'local']], policy: 'gate', approveAt: null, revokeAt: 70 }));
for (const t of [45, 68, 75, 90]) {
  await D((x) => window.VEHICLE_STACK_DEBUG.seek(x), t); await settle(page);
  const left = await cjkLeftovers(page);
  check(`English: no Chinese left at ${t / 10} s after a swap and a revocation`, left.length === 0, left.slice(0, 3).join(' | '));
}
await D(() => localStorage.removeItem('tr-lang'));

check('no page error, console error or failed request (page-specific part)', T.errors.length === 0, T.errors.slice(0, 4).join(' | '));
await T.finish();
