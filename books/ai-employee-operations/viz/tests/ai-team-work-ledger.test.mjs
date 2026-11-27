#!/usr/bin/env node
// Browser regression suite for OPS//LEDGER (books/ai-employee-operations/viz/ai-team-work-ledger/):
//   node books/ai-employee-operations/viz/tests/ai-team-work-ledger.test.mjs   (or: node tools/node/viz-test.mjs ai-employee-operations)
// It first runs the quality gates every stage-first page must pass, then reads the page through the read-only probe
// window.OPS_LEDGER_DEBUG and checks every claim against sources and rules written here: the ledger is parsed from the
// Markdown table of chapter 1 (both languages, declared in tests/dependencies.json), the sums and shares are computed
// in integers, the escalation gate is the rule "answer only what the verified bank holds, escalate everything else",
// and the countdown dates are checked as timestamps. Then the stills of the four cards, in both languages.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { session, stageFirstChecks, settle, until, playsAfter, openStill, cjkLeftovers } from '../../../../tools/node/viz-testkit.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const BOOK = 'ai-employee-operations', ID = 'ai-team-work-ledger';
const ORDER = ['donna', 'finance', 'autox', 'community', 'hr', 'admin'];

/* ---------- the ledger, parsed from chapter 1 ---------- */
/** The rows of the readiness table: [ready, total, share as printed]; the last row is the total. */
function ledger(lang) {
  const md = fs.readFileSync(path.join(ROOT, 'books', BOOK, lang, 'ch01-six-role-ai-workforce.md'), 'utf8');
  const rows = [];
  for (const line of md.split('\n')) {
    const cells = line.split('|').map((c) => c.trim()).slice(1, -1);
    if (cells.length < 4) continue;
    const num = (c) => { const m = /^\**`(\d+)`\**$/.exec(c); return m ? Number(m[1]) : null; };
    const share = /`(\d+\.\d)%`/.exec(cells[3]);
    if (num(cells[1]) != null && num(cells[2]) != null && share) rows.push({ ready: num(cells[1]), total: num(cells[2]), share: share[1] });
  }
  return rows;
}
const TABLE = { zh: ledger('zh'), en: ledger('en') };
const ROWS = TABLE.en.slice(0, 6), TOTAL = TABLE.en[6];
const share1 = (a, b) => ((1000 * a / b + 0.5 | 0) / 10).toFixed(1);   // one decimal, rounded half up, from integers
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/* ---------- the gate rule ---------- */
const BANK = new Set(['When does the launch start?']);           // the one bank question the simulator asks
const RECEIPTS = new Set();                                     // the simulated refund has no matching receipt
const outcome = (req) => (req.kind === 'question' ? (BANK.has(req.text) ? 'answered' : 'escalated') : (RECEIPTS.has(req.order) ? 'answered' : 'escalated'));

const T = await session();
const { check } = T;
await stageFirstChecks(T, BOOK, ID);

check('chapter 1 has the same seven ledger rows in both languages', TABLE.zh.length === 7 && TABLE.en.length === 7 && eq(TABLE.zh, TABLE.en), JSON.stringify(TABLE));

const page = await T.goto(BOOK, ID, '?lang=zh');
await page.evaluate(() => document.fonts && document.fonts.ready); await settle(page, 300);
const D = (fn, arg) => page.evaluate(fn, arg);
const state = async () => { await settle(page); return D(() => window.OPS_LEDGER_DEBUG.state); };
const seek = async (t) => { await D((v) => window.OPS_LEDGER_DEBUG.seek(v), t); return state(); };
const scene = async (sc, t) => { await D(([a, b]) => window.OPS_LEDGER_DEBUG.scene(a, b), [sc, t]); return state(); };
const text = (sel) => page.textContent(sel);

/* ---------- the ledger on the page is the chapter's ---------- */
let st = await state();
check('opens on SIX-ROLES: the board at t = 0, at rest, with all six rows drawn', st.preset === 'six-roles' && st.scene === 'board' && st.t === 0 && !st.playing && eq(st.drawnRows, ORDER), JSON.stringify(st));
check('every role carries the ready and total counts of the chapter\'s table, in its order', eq(st.roles.map((r) => r.id), ORDER) && st.roles.every((r, i) => r.ready === ROWS[i].ready && r.total === ROWS[i].total), JSON.stringify(st.roles));
check('every role\'s share, to one decimal, is the share the chapter prints', st.roles.every((r, i) => r.pct.toFixed(1) === ROWS[i].share && share1(ROWS[i].ready, ROWS[i].total) === ROWS[i].share));
const ready = ROWS.reduce((s, r) => s + r.ready, 0), total = ROWS.reduce((s, r) => s + r.total, 0);
check('13 + 24 + 11 + 9 + 15 + 5 = 77 and 15 + 28 + 13 + 11 + 20 + 10 = 97, as the total row says', ready === 77 && total === 97 && TOTAL.ready === 77 && TOTAL.total === 97);
check('77 / 97 = 79.4% on the page, in the chapter and here', st.all.ready === 77 && st.all.total === 97 && st.all.pct.toFixed(1) === '79.4' && share1(77, 97) === '79.4' && TOTAL.share === '79.4');
check('the 20 held behind human gates are total − ready', st.all.gated === 20 && total - ready === 20);
check('the title, the key readout and the pills say 77 / 97 = 79.4%', (await text('#hudBig')).includes('77 / 97 = 79.4%') && (await text('#roKey')).includes('79.4%') && (await text('#pillReady')).includes('77/97') && (await text('#pillGate')).includes('20'));
check('the merchant starter pack is (13 + 24) / (15 + 28) = 37 / 43 = 86.0%, with 0 external paying merchants', st.starter.ready === ROWS[0].ready + ROWS[1].ready && st.starter.total === ROWS[0].total + ROWS[1].total
  && st.starter.ready === 37 && st.starter.total === 43 && st.starter.pct.toFixed(1) === share1(37, 43) && share1(37, 43) === '86.0' && st.starter.externalMerchants === 0);

/* ---------- the board's stress probes: every one escalates, none commits ---------- */
st = await seek(46.5);
check('46 probes at t = 46.5: all escalated, 0 unauthorized commitments', st.probes.fired === 46 && st.probes.escalated === 46 && st.probes.unauthorized === 0 && st.escalated === 46);
const targets = await D(() => window.OPS_LEDGER_DEBUG.targets(100));
const gatedOf = Object.fromEntries(ORDER.map((id, i) => [id, ROWS[i].total - ROWS[i].ready]));
check('every probe targets a gated workflow (a cell past the role\'s ready count)', targets.length === 100 && targets.every(([id, i]) => i >= 0 && i < gatedOf[id]));
const hits = new Map(); for (const [id, i] of targets) hits.set(`${id}.${i}`, (hits.get(`${id}.${i}`) || 0) + 1);
check('100 probes cover all 20 gated workflows evenly, 5 each', hits.size === 20 && [...hits.values()].every((h) => h === 5));
let probeOK = true; for (let t = 0; t <= 100; t += 7) { const s = await seek(t); if (s.probes.unauthorized !== 0 || s.probes.escalated !== s.probes.fired) probeOK = false; }
check('along the whole rail, escalated = fired and unauthorized = 0', probeOK);

/* ---------- the gate ---------- */
st = await scene('gate', 100);
const reqs = { inbank: { kind: 'question', text: 'When does the launch start?' }, press: { kind: 'question', text: 'Can you share financing details?' }, refund: { kind: 'refund', order: 'no-receipt' } };
check('GATE with the press question on and the refund off: the bank question is answered and the off-script one escalates', st.gate.inbank === outcome(reqs.inbank) && st.gate.press === outcome(reqs.press) && st.gate.refund === 'off' && st.gate.escalated === 1 && st.gate.unauthorized === 0, JSON.stringify(st.gate));
await page.click('#refundBtn'); st = await state();
check('the refund button adds the unverified refund, which escalates too', st.refund && st.gate.refund === outcome(reqs.refund) && st.gate.escalated === 2 && st.gate.unauthorized === 0, JSON.stringify(st.gate));
await page.click('#pressBtn'); st = await state();
check('the press button takes the off-script question out of the trace', !st.press && st.gate.press === 'off' && st.gate.escalated === 1);
await page.click('#pressBtn'); await page.click('#refundBtn'); st = await state();
check('both buttons toggle back', st.press && !st.refund);
const before = await seek(11), during = await seek(29), after = await seek(34);
check('the off-script question travels, is checked at the gate, then lands in the human queue', before.gate.press === 'idle' && during.gate.press === 'check' && after.gate.press === 'escalated');
check('the drawer names the human desk only by the public address contact@chrono-ai.fun', (await D(() => document.getElementById('drawer').textContent)).includes('contact@chrono-ai.fun'));

/* ---------- the countdown ---------- */
const msAt = (s) => { const m = /^(\d\d)-(\d\d) (\d\d):(\d\d) SGT$/.exec(s); return m ? Date.UTC(2026, Number(m[1]) - 1, Number(m[2]), Number(m[3]) - 8, Number(m[4])) : NaN; };
st = await scene('countdown', 70);
check('COUNTDOWN at t = 70: T-0, 12-17 16:00 SGT, five roles on duty (HR keeps to its background work)', st.date.milestone === 'T-0' && st.date.text === '12-17 16:00 SGT' && st.date.active.length === 5 && !st.date.active.includes('hr'), JSON.stringify(st.date));
const marks = [[0, 'T-13', '12-04 10:00 SGT'], [18, 'T-9', '12-08 00:00 SGT'], [34, 'T-6', '12-11 00:00 SGT'], [52, 'T-2', '12-15 00:00 SGT'], [100, 'T+1', '12-18 16:00 SGT']];
let markOK = true; for (const [t, rel, day] of marks) { const s = await seek(t); if (s.date.milestone !== rel || s.date.text !== day) { markOK = false; break; } }
check('the rail passes the six gates: Dec 4 10:00 SGT wave 1, Dec 8 wave 2 press kit, Dec 11 load drill, Dec 15 dress rehearsal and freeze, and the Dec 18 replay', markOK);
const live = msAt('12-17 16:00 SGT');
check('T-13 (12-04 10:00 SGT) is 13 days and 6 hours before the broadcast, T+1 exactly a day after', near((live - msAt('12-04 10:00 SGT')) / 3600e3, 13 * 24 + 6) && near((msAt('12-18 16:00 SGT') - live) / 3600e3, 24));
let mono = true, prev = -Infinity; for (let t = 0; t <= 100; t += 2.5) { const s = await seek(t), ms = msAt(s.date.text); if (!(ms >= prev)) mono = false; prev = ms; }
check('dates only move forward along the rail', mono);

/* ---------- the merchant filter ---------- */
const keep = (ids) => { const rs = ORDER.map((id, i) => [id, ROWS[i]]).filter(([id]) => ids.includes(id)); const a = rs.reduce((s, [, r]) => s + r.ready, 0), b = rs.reduce((s, [, r]) => s + r.total, 0); return [a, b]; };
const STEPS = [[0, ORDER], [25, ['donna', 'finance', 'autox', 'community', 'hr']], [50, ['donna', 'finance', 'autox', 'community']], [75, ['donna', 'finance', 'autox']], [100, ['donna', 'finance']]];
let filtOK = true, filtBad = '';
for (const [t, ids] of STEPS) {
  const s = await scene('merchant', t), [a, b] = keep(ids);
  if (!eq(s.view.visible, ids) || s.view.ready !== a || s.view.total !== b) { filtOK = false; filtBad = `t = ${t}: ${JSON.stringify(s.view)} want ${a}/${b}`; }
}
check('the merchant rail removes Admin, HR, Community and Auto-X one after another, and the totals follow (77/97 → 37/43)', filtOK, filtBad);
st = await scene('merchant', 100);
check('MERCHANT at the end: only the two starter rows are drawn, 37 / 43 = 86.0%', eq(st.drawnRows, ['donna', 'finance']) && st.view.pct.toFixed(1) === '86.0' && (await text('#hudBig')).includes('37 / 43 = 86.0%'));

/* ---------- the controls ---------- */
st = await scene('board', 0);
const pt = await D(() => window.OPS_LEDGER_DEBUG.point('hr'));
await page.mouse.click(pt.x, pt.y); st = await state();
check('clicking a role row selects it; its numbers and its human line show in the readouts', st.selected === 'hr' && (await text('#roRole')).includes('15 / 20') && (await text('#roGate')).includes('Offer'));
for (const [key, sc] of [['2', 'gate'], ['3', 'countdown'], ['4', 'merchant'], ['1', 'board']]) { await page.keyboard.press(key); check(`key ${key} switches to the scene ${sc}`, (await state()).scene === sc); }
await page.click('#sceneChips [data-scene="countdown"]'); st = await state();
check('the scene chips switch scenes and leave the card', st.scene === 'countdown' && st.preset === null);
await seek(0); await page.locator('body').click({ position: { x: 5, y: 5 } });
await page.keyboard.press('ArrowRight'); check('→ steps the rail by 5', (await state()).t === 5);
await page.keyboard.press('Space');
check('Space plays the rail', await until(page, () => { const d = window.OPS_LEDGER_DEBUG.state; return d.playing && d.t > 5; }));
await page.keyboard.press('Space'); check('Space pauses', !(await state()).playing);
await page.click('#rew'); check('⏮ returns to the start', (await state()).t === 0);

/* ---------- the cards ---------- */
await page.click('[data-preset="six-roles"]'); st = await state();
check('SIX-ROLES is a snapshot: it does not play, and stays at t = 0', st.scene === 'board' && st.t === 0 && !st.playing);
for (const c of ['donna-gate', 'countdown', 'merchant']) {
  check(`card ${c} plays from the start when clicked`, await playsAfter(page, () => page.click(`[data-preset="${c}"]`), () => window.OPS_LEDGER_DEBUG.state));
}
check('every card declares the still frame of its figure', eq(await D(() => [...document.querySelectorAll('[data-preset]')].map((b) => `${b.dataset.preset}:${b.dataset.still}`)),
  ['six-roles:0', 'donna-gate:35', 'countdown:70', 'merchant:100']));
await D(() => { const b = document.getElementById('play'); if (b.getAttribute('aria-pressed') === 'true') b.click(); });

/* ---------- the stills a chapter cites ---------- */
const STILLS = {
  'six-roles': (s) => s.scene === 'board' && s.t === 0 && s.all.ready === 77 && s.all.total === 97 && eq(s.drawnRows, ORDER) && s.probes.fired === 0,
  'donna-gate': (s) => s.scene === 'gate' && s.t === 35 && s.gate.inbank === 'answered' && s.gate.press === 'escalated' && s.gate.refund === 'off' && s.gate.unauthorized === 0,
  countdown: (s) => s.scene === 'countdown' && s.t === 70 && s.date.milestone === 'T-0' && s.date.text === '12-17 16:00 SGT' && s.date.active.length === 5,
  merchant: (s) => s.scene === 'merchant' && s.t === 100 && eq(s.view.visible, ['donna', 'finance']) && s.view.ready === 37 && s.view.total === 43
};
const HUD = { 'six-roles': '77 / 97 = 79.4%', 'donna-gate': '1', countdown: '12-17 16:00 SGT', merchant: '37 / 43 = 86.0%' };
for (const lang of ['zh', 'en']) for (const [card, ok] of Object.entries(STILLS)) {
  const still = await openStill(T, BOOK, ID, card, lang), s = await still.evaluate(() => window.OPS_LEDGER_DEBUG.state);
  const hud = await still.textContent('.hud-tl');
  check(`still ${card} (${lang}): the frame of the caption, at rest`, ok(s) && !s.playing, JSON.stringify(s));
  check(`still ${card} (${lang}): the title carries the number of the caption`, hud.includes(HUD[card]), hud);
  if (lang === 'en') { const left = await cjkLeftovers(still); check(`still ${card} (en): no Chinese`, left.length === 0, left.slice(0, 3).join(' | ')); }
  await still.context().close();
}

/* ---------- evidence and the drawer ---------- */
check('no LEAN ✓ box: MODEL and NUM only', await D(() => document.querySelectorAll('.lean').length === 2 && !!document.querySelector('.lean.model') && !!document.querySelector('.lean.num') && !document.querySelector('a[data-lean-gid]')));
check('page ticks are the page\'s own arithmetic (.nummark), never the green of LEAN ✓', await D(() => !document.querySelector('.okmark') && !!document.querySelector('#roKey .nummark')));
await page.click('#infoBtn');
check('the drawer says in both languages that the page is a model, not a proof', /不是证明/.test(await text('#drawer div.zh')) && /not a proof/.test(await text('#drawer div.en')));
await page.keyboard.press('Escape');

/* ---------- English ---------- */
await page.click('[data-lang-set="en"]'); await settle(page, 150);
check('English title', (await D(() => document.title)).startsWith('OPS//LEDGER · AI team work ledger'));
for (const sc of ['board', 'gate', 'countdown', 'merchant']) {
  await page.click(`#sceneChips [data-scene="${sc}"]`); await settle(page);
  for (const t of [0, 35, 70, 100]) { await seek(t); const left = await cjkLeftovers(page); check(`English: no Chinese left in ${sc} at t = ${t}`, left.length === 0, left.slice(0, 3).join(' | ')); }
}
await D(() => localStorage.removeItem('tr-lang'));

check('no page error, console error or failed request (page-specific part)', T.errors.length === 0, T.errors.slice(0, 4).join(' | '));
await T.finish();
