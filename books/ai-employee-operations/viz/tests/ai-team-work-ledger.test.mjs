#!/usr/bin/env node
// Browser regression suite for OPS//LEDGER (books/ai-employee-operations/viz/ai-team-work-ledger/):
//   node books/ai-employee-operations/viz/tests/ai-team-work-ledger.test.mjs   (or: node tools/node/viz-test.mjs ai-employee-operations)
// It first runs the quality gates every stage-first page must pass, then reads the page through the read-only probe
// window.OPS_LEDGER_DEBUG and checks every claim against sources and rules written here: the ledger is written out
// below from the 2026-11-27 role audit (ChronoAIProject/nyxid-nyxbot-trials@df5ef47) with the shares and totals that
// audit prints, the sums and shares are computed in integers, the escalation gate is the rule "answer only what the
// verified bank holds, escalate everything else", and the countdown dates are checked as timestamps. Then the stills
// of the four cards, in both languages.
import { session, stageFirstChecks, settle, until, playsAfter, openStill, cjkLeftovers } from '../../../../tools/node/viz-testkit.mjs';

const BOOK = 'ai-employee-operations', ID = 'ai-team-work-ledger';

/* ---------- the ledger of the 2026-11-27 audit, written out by hand ---------- */
// [role, ready, total, share as the audit prints it]; the first six are the core small-business roles
const AUDIT = [
  ['donna', 14, 15, '93.3'], ['finance', 24, 28, '85.7'], ['autox', 12, 14, '85.7'], ['community', 10, 12, '83.3'], ['hr', 14, 20, '70.0'], ['admin', 8, 10, '80.0'],
  ['sentiment', 6, 7, '85.7'], ['kb', 3, 3, '100.0'], ['retro', 11, 11, '100.0']
];
const ROWS = AUDIT.map(([id, ready, total, share]) => ({ id, ready, total, share }));
const ORDER = ROWS.map((r) => r.id), CORE_IDS = ORDER.slice(0, 6);
// the totals the audit declares, and its equal-weight means
const DECL = { core: { ready: 82, total: 99, share: '82.8', mean: '83.0' }, all: { ready: 102, total: 120, share: '85.0', mean: '87.1' }, starter: { ready: 38, total: 43, share: '88.4' } };
const HR_BEFORE = [15, 20];                                     // HR before the evidence audit moved it down
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

check('the written-out audit is self-consistent: every printed share is ready / total, rounded to one decimal', ROWS.every((r) => share1(r.ready, r.total) === r.share));

const page = await T.goto(BOOK, ID, '?lang=zh');
await page.evaluate(() => document.fonts && document.fonts.ready); await settle(page, 300);
const D = (fn, arg) => page.evaluate(fn, arg);
const state = async () => { await settle(page); return D(() => window.OPS_LEDGER_DEBUG.state); };
const seek = async (t) => { await D((v) => window.OPS_LEDGER_DEBUG.seek(v), t); return state(); };
const scene = async (sc, t) => { await D(([a, b]) => window.OPS_LEDGER_DEBUG.scene(a, b), [sc, t]); return state(); };
const text = (sel) => page.textContent(sel);

/* ---------- the ledger on the page is the audit's ---------- */
let st = await state();
check('opens on SIX-ROLES: the board at t = 0, at rest, with all nine rows drawn (six core, three standalone)', st.preset === 'six-roles' && st.scene === 'board' && st.t === 0 && !st.playing && eq(st.drawnRows, ORDER), JSON.stringify(st));
check('every role carries the ready and total counts of the audit, in its order, and the first six are the core roles', eq(st.roles.map((r) => r.id), ORDER) && st.roles.every((r, i) => r.ready === ROWS[i].ready && r.total === ROWS[i].total && r.core === CORE_IDS.includes(r.id)), JSON.stringify(st.roles));
check('every role\'s share, to one decimal, is the share the audit prints', st.roles.every((r, i) => r.pct.toFixed(1) === ROWS[i].share));
const tally = (ids) => { const rs = ROWS.filter((r) => ids.includes(r.id)); return [rs.reduce((s, r) => s + r.ready, 0), rs.reduce((s, r) => s + r.total, 0)]; };
const [cr, ct] = tally(CORE_IDS), [ar, atot] = tally(ORDER);
check('six core roles: 14 + 24 + 12 + 10 + 14 + 8 = 82 and 15 + 28 + 14 + 12 + 20 + 10 = 99, the totals the audit declares', cr === DECL.core.ready && ct === DECL.core.total && st.core.ready === cr && st.core.total === ct);
check('82 / 99 = 82.8% on the page and here', st.core.pct.toFixed(1) === DECL.core.share && share1(cr, ct) === DECL.core.share);
check('nine roles: 82 + 6 + 3 + 11 = 102 and 99 + 7 + 3 + 11 = 120, 102 / 120 = 85.0%', ar === DECL.all.ready && atot === DECL.all.total && st.all.ready === ar && st.all.total === atot && st.all.pct.toFixed(1) === DECL.all.share && share1(ar, atot) === DECL.all.share);
check('the page meets the declared totals and says so with its own tick', st.declared.met && eq(st.declared.core, [82, 99]) && eq(st.declared.all, [102, 120]) && (await text('#roKey')).includes('✓'));
check('the 18 held behind human gates are total − ready', st.all.gated === 18 && atot - ar === 18 && st.core.gated === ct - cr);
check('the title carries both denominators, the key readout and the pills the nine-role total', (await text('#hudBig')).includes('82 / 99 = 82.8%') && (await text('#hudBig')).includes('102 / 120 = 85.0%')
  && (await text('#roKey')).includes('85.0%') && (await text('#roKeySub')).includes('82 / 99') && (await text('#pillReady')).includes('102/120') && (await text('#pillGate')).includes('18'));
const mean = (ids) => (ROWS.filter((r) => ids.includes(r.id)).reduce((s, r) => s + r.ready / r.total, 0) / ids.length * 100).toFixed(1);
check('the drawer\'s equal-weight means are those of the rows: 83.0% (six core) and 87.1% (nine)', mean(CORE_IDS) === DECL.core.mean && mean(ORDER) === DECL.all.mean
  && (await D(() => document.querySelector('#drawer div.zh').textContent)).includes('83.0%') && (await D(() => document.querySelector('#drawer div.en').textContent)).includes('87.1%'));
const [sr, stt] = tally(['donna', 'finance']);
check('the merchant starter pack is (14 + 24) / (15 + 28) = 38 / 43 = 88.4%, with 0 external paying merchants', st.starter.ready === sr && st.starter.total === stt
  && sr === DECL.starter.ready && stt === DECL.starter.total && st.starter.pct.toFixed(1) === share1(sr, stt) && share1(sr, stt) === DECL.starter.share && st.starter.externalMerchants === 0);

/* ---------- the board's stress probes: every one escalates, none commits ---------- */
st = await seek(46.5);
check('46 probes at t = 46.5: all escalated, 0 unauthorized commitments', st.probes.fired === 46 && st.probes.escalated === 46 && st.probes.unauthorized === 0 && st.escalated === 46);
const targets = await D(() => window.OPS_LEDGER_DEBUG.targets(100));
const gatedOf = Object.fromEntries(ROWS.map((r) => [r.id, r.total - r.ready]));
check('every probe targets a gated workflow (a cell past the role\'s ready count)', targets.length === 100 && targets.every(([id, i]) => i >= 0 && i < gatedOf[id]));
const hits = new Map(); for (const [id, i] of targets) hits.set(`${id}.${i}`, (hits.get(`${id}.${i}`) || 0) + 1);
const GATED_N = Object.values(gatedOf).reduce((a, b) => a + b, 0);
check('100 probes go round all 18 gated workflows in turn: each is hit 5 or 6 times, the first 100 − 5·18 = 10 six times', GATED_N === 18 && hits.size === 18
  && [...hits.values()].filter((h) => h === 6).length === 100 - 5 * 18 && [...hits.values()].every((h) => h === 5 || h === 6) && eq(targets[18], targets[0]));
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
check('COUNTDOWN at t = 70: T-0, 12-17 16:00 SGT, seven of nine roles on duty (HR keeps to its background work, the Retrospective Analyst to Mondays)', st.date.milestone === 'T-0' && st.date.text === '12-17 16:00 SGT' && st.date.active.length === 7 && st.date.of === 9
  && !st.date.active.includes('hr') && !st.date.active.includes('retro'), JSON.stringify(st.date));
const marks = [[0, 'T-20', '11-27 00:00 SGT'], [16, 'T-13', '12-04 10:00 SGT'], [28, 'T-9', '12-08 00:00 SGT'], [38, 'T-6', '12-11 00:00 SGT'], [50, 'T-2', '12-15 00:00 SGT'], [60, 'T-1', '12-16 00:00 SGT'], [70, 'T-0', '12-17 16:00 SGT'], [100, 'T+1', '12-18 16:00 SGT']];
let markOK = true, markBad = ''; for (const [t, rel, day] of marks) { const s = await seek(t); if (s.date.milestone !== rel || s.date.text !== day) { markOK = false; markBad = `t = ${t}: ${s.date.milestone} ${s.date.text}`; break; } }
check('the rail passes the eight gates: the Nov 27 rehearsal, Dec 4 10:00 SGT wave 1, Dec 8 press kit, Dec 11 load drill, Dec 15 freeze, Dec 16 Discord dress rehearsal, Dec 17 broadcast, Dec 18 replay', markOK, markBad);
const live = msAt('12-17 16:00 SGT');
check('T-20 (11-27) is 20 days and 16 hours before the broadcast, T-13 (12-04 10:00 SGT) 13 days and 6 hours, T-1 (12-16) a day and 16 hours, T+1 exactly a day after',
  near((live - msAt('11-27 00:00 SGT')) / 3600e3, 20 * 24 + 16) && near((live - msAt('12-04 10:00 SGT')) / 3600e3, 13 * 24 + 6) && near((live - msAt('12-16 00:00 SGT')) / 3600e3, 24 + 16) && near((msAt('12-18 16:00 SGT') - live) / 3600e3, 24));
st = await seek(0);
check('at the Nov 27 rehearsal the readout carries its measured numbers: 11 / 12 stages, median 29 s, the 65–70 min NyxID#2534 stall and its 3.0 min bypass', /11 \/ 12|11 of 12/.test(await text('#hudSub')) && /29 s/.test(await text('#roNote')) && /NyxID#2534/.test(await text('#roNote')) && /3\.0/.test(await text('#roNote')));
// the Retrospective Analyst works on Mondays: on duty exactly in the spans that hold one (and for the review after the broadcast)
const MONDAY_SPANS = ['T-20', 'T-13', 'T-6', 'T+1'];
let retroOK = true; for (const [t, rel] of marks) { const s = await seek(t); if (s.date.active.includes('retro') !== MONDAY_SPANS.includes(rel)) retroOK = false; }
const monday = (y, m, d) => new Date(Date.UTC(y, m, d)).getUTCDay() === 1;
check('the Retrospective Analyst is on duty in the spans that hold a Monday (Nov 30, Dec 7, Dec 14) and after the broadcast, and Dec 17 2026 is not a Monday', retroOK && monday(2026, 10, 30) && monday(2026, 11, 7) && monday(2026, 11, 14) && !monday(2026, 11, 17));
let mono = true, prev = -Infinity; for (let t = 0; t <= 100; t += 2.5) { const s = await seek(t), ms = msAt(s.date.text); if (!(ms >= prev)) mono = false; prev = ms; }
check('dates only move forward along the rail', mono);

/* ---------- the merchant filter ---------- */
const keep = tally;
const STEPS = [[0, ORDER], [20, CORE_IDS], [40, ['donna', 'finance', 'autox', 'community', 'hr']], [60, ['donna', 'finance', 'autox', 'community']], [80, ['donna', 'finance', 'autox']], [100, ['donna', 'finance']]];
let filtOK = true, filtBad = '';
for (const [t, ids] of STEPS) {
  const s = await scene('merchant', t), [a, b] = keep(ids);
  if (!eq(s.view.visible, ids) || s.view.ready !== a || s.view.total !== b) { filtOK = false; filtBad = `t = ${t}: ${JSON.stringify(s.view)} want ${a}/${b}`; }
}
check('the merchant rail removes the three standalone roles, then Admin, HR, Community and Auto-X one after another, and the totals follow (102/120 → 82/99 → 38/43)', filtOK, filtBad);
st = await scene('merchant', 100);
check('MERCHANT at the end: only the two starter rows are drawn, 38 / 43 = 88.4%', eq(st.drawnRows, ['donna', 'finance']) && st.view.pct.toFixed(1) === '88.4' && (await text('#hudBig')).includes('38 / 43 = 88.4%'));

/* ---------- the controls ---------- */
st = await scene('board', 0);
const pt = await D(() => window.OPS_LEDGER_DEBUG.point('hr'));
await page.mouse.click(pt.x, pt.y); st = await state();
check('clicking a role row selects it; its numbers and its human line show in the readouts, HR naming its honest downgrade', st.selected === 'hr' && (await text('#roRole')).includes('14 / 20') && (await text('#roGate')).includes('Offer') && (await text('#roGate')).includes(`${HR_BEFORE[0]} / ${HR_BEFORE[1]}`));
const pr = await D(() => window.OPS_LEDGER_DEBUG.point('retro'));
await page.mouse.click(pr.x, pr.y); st = await state();
check('the standalone rows are selectable too: the Retrospective Analyst reads 11 / 11', st.selected === 'retro' && (await text('#roRole')).includes('11 / 11'));
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
  'six-roles': (s) => s.scene === 'board' && s.t === 0 && s.core.ready === 82 && s.core.total === 99 && s.all.ready === 102 && s.all.total === 120 && eq(s.drawnRows, ORDER) && s.probes.fired === 0,
  'donna-gate': (s) => s.scene === 'gate' && s.t === 35 && s.gate.inbank === 'answered' && s.gate.press === 'escalated' && s.gate.refund === 'off' && s.gate.unauthorized === 0,
  countdown: (s) => s.scene === 'countdown' && s.t === 70 && s.date.milestone === 'T-0' && s.date.text === '12-17 16:00 SGT' && s.date.active.length === 7,
  merchant: (s) => s.scene === 'merchant' && s.t === 100 && eq(s.view.visible, ['donna', 'finance']) && s.view.ready === 38 && s.view.total === 43
};
const HUD = { 'six-roles': '82 / 99 = 82.8%', 'donna-gate': '1', countdown: '12-17 16:00 SGT', merchant: '38 / 43 = 88.4%' };
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
