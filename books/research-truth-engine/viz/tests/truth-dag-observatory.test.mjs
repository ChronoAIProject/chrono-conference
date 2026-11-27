#!/usr/bin/env node
// Browser regression suite for TRUTH//DAG (books/research-truth-engine/viz/truth-dag-observatory/):
//   node books/research-truth-engine/viz/tests/truth-dag-observatory.test.mjs     (or: node tools/node/viz-test.mjs research-truth-engine)
// It first runs the quality gates every stage-first page must pass, then reads the page through the read-only probe
// window.TRUTH_DAG_DEBUG and checks every claim against an independent implementation written here: the six theorems
// rebuilt from their printed statements, the joint kernel by partition refinement (splitting blocks one theorem at a
// time), escaped pairs counted from block sizes (Σ C(n, 2)), unique capture by direct leave-one-out counting over
// ordered pairs, and recoverability as an inclusion of pair sets. Nothing here calls the page's own functions.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { session, stageFirstChecks, settle, until, playsAfter, openStill, cjkLeftovers } from '../../../../tools/node/viz-testkit.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const BOOK = 'research-truth-engine', ID = 'truth-dag-observatory';
const GIDS = [
  'D5/S3/ConceptDynamics/InformationEscape/CatalogKernel.jointKernel_antitone',
  'D5/S3/ConceptDynamics/InformationEscape/CatalogKernel.jointKernel_insert',
  'D5/S3/ConceptDynamics/InformationEscape/StructuralNovelty.lowersEscape_false_of_recoverable',
  'D5/S3/ConceptDynamics/InformationEscape/StructuralNovelty.same_kernel_both_zero',
  'D5/S3/ConceptDynamics/InformationEscape/StructuralNovelty.lowersEscape_iff_not_mem_semanticClosureWithout'
];

/* ---------- independent model: the statements as printed on the page ---------- */
const STATES = 16, K = 6;
const coords = Array.from({ length: STATES }, (_, s) => ({ x: s % 4, y: (s - (s % 4)) / 4 }));
const STATEMENTS = ['y ≥ 1', 'y ≥ 2', 'y ≥ 3', 'x ≥ 2', 'T₁ ∧ ¬T₂', 'x ≤ 1'];
const truth = [
  ({ y }) => y >= 1, ({ y }) => y >= 2, ({ y }) => y >= 3, ({ x }) => x >= 2,
  ({ y }) => y >= 1 && !(y >= 2),          // T₁ ∧ ¬T₂: exactly row 1
  ({ x }) => x <= 1
];
const reading = truth.map((f) => coords.map((c) => (f(c) ? 1 : 0)));
const agrees = (i, a, b) => reading[i][a] === reading[i][b];
const inMask = (m) => [0, 1, 2, 3, 4, 5].filter((i) => (m >> i) & 1);
/** Partition refinement: start from one block and split every block by each selected theorem in turn. */
function blocks(m) {
  let parts = [Array.from({ length: STATES }, (_, s) => s)];
  for (const i of inMask(m)) parts = parts.flatMap((b) => [b.filter((s) => reading[i][s]), b.filter((s) => !reading[i][s])]).filter((b) => b.length);
  return parts;
}
const choose2 = (n) => (n * (n - 1)) / 2;
const escapedOf = (m) => blocks(m).reduce((t, b) => t + choose2(b.length), 0);
/** Ordered distinct pairs on which every theorem of m (except `skip`) agrees: the joint kernel off the diagonal. */
function kernel(m, skip = -1) {
  const out = new Set(), sel = inMask(m).filter((i) => i !== skip);
  for (let a = 0; a < STATES; a++) for (let b = 0; b < STATES; b++) if (a !== b && sel.every((i) => agrees(i, a, b))) out.add(a * STATES + b);
  return out;
}
const agreementSet = (i) => { const out = new Set(); for (let a = 0; a < STATES; a++) for (let b = 0; b < STATES; b++) if (a !== b && agrees(i, a, b)) out.add(a * STATES + b); return out; };
const subset = (A, B) => [...A].every((x) => B.has(x));
const sameSet = (A, B) => A.size === B.size && subset(A, B);
/** Unique capture of i in catalog m (ordered pairs, as Lean counts): pairs the others leave together and i separates. */
const uniqueOrdered = (m, i) => [...kernel(m, i)].filter((p) => !agrees(i, Math.floor(p / STATES), p % STATES)).length;
const recoverable = (m, i) => subset(kernel(m, i), agreementSet(i));   // i's kernel ⊇ the joint kernel of the others
const eq = (x, y) => JSON.stringify(x) === JSON.stringify(y);

const T = await session();
const { check } = T;

/* ---------- the quality gates of every stage-first page ---------- */
await stageFirstChecks(T, BOOK, ID);

const page = await T.goto(BOOK, ID, '?lang=zh');
await page.evaluate(() => document.fonts && document.fonts.ready); await settle(page, 300);
const D = (fn, arg) => page.evaluate(fn, arg);
const state = async () => { await settle(page); return D(() => window.TRUTH_DAG_DEBUG.state); };
const seek = async (t) => { await D((v) => window.TRUTH_DAG_DEBUG.seek(v), t); return state(); };
const pick = async (id) => { await page.click(`[data-preset="${id}"]`); await settle(page, 60); };
const text = (sel) => page.textContent(sel);

/* ---------- the catalog on the page is the catalog it prints ---------- */
check('page carries its id and the runtime language', (await D(() => document.body.dataset.vizId)) === ID && (await D(() => TRV.lang())) === 'zh');
check('the six statements are T₁ y ≥ 1, T₂ y ≥ 2, T₃ y ≥ 3, T₄ x ≥ 2, T₅ = T₁ ∧ ¬T₂, T₆ x ≤ 1', eq(await D(() => window.TRUTH_DAG_DEBUG.statements()), STATEMENTS));
check('the readouts of the page are the truth values of those statements on the 16 states (s = 4y + x)', eq(await D(() => window.TRUTH_DAG_DEBUG.readouts()), reading));
check('T₄ and T₆ have the same agreement relation (the same kernel), as distinct entries', sameSet(agreementSet(3), agreementSet(5)) && !eq(reading[3], reading[5]));
check('T₅ follows from T₁ and T₂ alone (recoverable in {T₁, T₂, T₅})', recoverable(0b010011, 4) && !recoverable(0b010001, 4) && !recoverable(0b010010, 4));

/* ---------- every one of the 64 catalogs: classes, escaped pairs, unique capture, recoverability ---------- */
let allOK = true, bad = '';
for (let m = 0; m < 64 && allOK; m++) {
  const page_ = await D((x) => window.TRUTH_DAG_DEBUG.analyse(x), m);
  const parts = blocks(m), escaped = escapedOf(m);
  // the page's classes are the blocks: same states together
  const together = (a, b) => page_.classOf[a] === page_.classOf[b];
  const sameBlocks = parts.every((b) => b.every((s) => together(s, b[0]))) && parts.every((b, k) => parts.every((c, l) => k === l || !together(b[0], c[0])));
  const pairs = page_.pairs.length === escaped && page_.pairs.every(([a, b]) => a < b && parts.some((blk) => blk.includes(a) && blk.includes(b)));
  let uniq = true;
  for (const i of inMask(m)) {
    const u = uniqueOrdered(m, i), rec = recoverable(m, i), w = escapedOf(m & ~(1 << i));
    // the page counts unordered pairs: Lean's ordered count is exactly twice; IE-007: without = full + unique
    if (2 * page_.unique[i] !== u || page_.recoverable[i] !== rec || page_.without[i] !== w || w !== escaped + u / 2 || (u === 0) !== rec) uniq = false;
  }
  if (!(sameBlocks && pairs && uniq)) { allOK = false; bad = `mask ${m}: ${JSON.stringify({ classes: [new Set(page_.classOf).size, parts.length], escaped: [page_.pairs.length, escaped], unique: page_.unique })}`; }
}
check('all 64 catalogs: classes = refinement blocks, escaped pairs = Σ C(block, 2), unique capture × 2 = ordered leave-one-out count, recoverable ⇔ unique = 0, without = escaped + unique', allOK, bad);
let anti = true;
for (let m = 0; m < 64; m++) for (let n = 0; n < 64; n++) if ((m & n) === m && !subset(kernel(n), kernel(m))) anti = false;
check('jointKernel is antitone: S ⊆ S′ ⇒ kernel(S′) ⊆ kernel(S), for all 729 nested pairs of catalogs', anti);
let insert = true;
for (let m = 0; m < 64; m++) for (let i = 0; i < K; i++) { const ins = kernel(m | (1 << i)), cap = new Set([...kernel(m)].filter((p) => agreementSet(i).has(p))); if (!sameSet(ins, cap)) insert = false; }
check('jointKernel(insert i S) = jointKernel(S) ∩ agreement(i), for all 64 × 6 insertions', insert);
let twins = true;
for (let m = 0; m < 64; m++) if ((m & 0b101000) === 0b101000) { const a = await D((x) => window.TRUTH_DAG_DEBUG.analyse(x), m); if (a.unique[3] !== 0 || a.unique[5] !== 0 || uniqueOrdered(m, 3) || uniqueOrdered(m, 5)) twins = false; }
check('every catalog holding both T₄ and T₆ gives both unique capture 0 (16 catalogs)', twins);
let novelty = true;
for (let m = 0; m < 64; m++) for (const i of inMask(m)) {
  const lowers = escapedOf(m) < escapedOf(m & ~(1 << i));   // the exact rate of the catalog is below the rate without i
  if (lowers !== !recoverable(m, i)) novelty = false;
}
check('LowersEscape(i) ⇔ the kernel of i is not implied by the others, in every catalog and for every member', novelty);

/* ---------- the rail: the catalog in order ---------- */
const PATH = [[120, 1], [72, 2], [40, 3], [24, 4], [8, 8], [8, 8], [8, 8]];
let railOK = true;
for (let k = 0; k <= 6; k++) {
  const s = await seek(k), want = PATH[k];
  if (s.mode !== 'prefix' || s.escaped !== want[0] || s.classes !== want[1] || s.escaped !== escapedOf((1 << k) - 1) || blocks((1 << k) - 1).length !== want[1] || !eq(s.selected, inMask((1 << k) - 1))) railOK = false;
}
check('rail k = 0 … 6: escaped 120, 72, 40, 24, 8, 8, 8 of 120 and classes 1, 2, 3, 4, 8, 8, 8 (here and on the page)', railOK);
let mono = true; for (let k = 0; k < 6; k++) if (PATH[k + 1][0] > PATH[k][0]) mono = false;
check('the escape rate never rises along the rail, and stays flat exactly at T₅ and T₆', mono && PATH[5][0] === PATH[4][0] && PATH[6][0] === PATH[5][0] && PATH[4][0] < PATH[3][0]);
let st = await seek(3.5);
check('between two steps the next cut is being drawn in and the numbers stay those of the last full step', st.inserting === 3 && st.escaped === 24 && st.current === 3 && /T₄/.test(await text('#hudSub')), JSON.stringify(st));

/* ---------- the cards ---------- */
await pick('observatory'); st = await state();
check('OBSERVATORY: three theorems, 4 classes, 24 / 120 escaped, rate 0.200', st.k === 3 && st.classes === 4 && st.escaped === 24 && Math.abs(st.rate - 0.2) < 1e-12 && !st.playing && (await text('#roEsc')).includes('24') && (await text('#roEsc')).includes('0.200'), JSON.stringify(st));
check('OBSERVATORY: Lean\'s ordered count reads 48 / 240', (await text('#roOrd')).trim() === '48 / 240');
check('NOVEL-CUT plays from three theorems to four', await playsAfter(page, () => pick('novel-cut'), () => window.TRUTH_DAG_DEBUG.state));
check('… and stops by itself at four theorems', await until(page, () => { const d = window.TRUTH_DAG_DEBUG.state; return !d.playing && d.t === 4; }));
st = await state();
check('NOVEL-CUT: 8 classes, escaped 24 → 8, T₄ captures 16 pairs alone (32 ordered) and lowers the escape', st.classes === 8 && st.escaped === 8 && st.unique[3] === 16 && uniqueOrdered(0b1111, 3) === 32 && !st.recoverable[3] && st.without[3] === 24);
check('NOVEL-CUT: the readouts say 24 = 8 + 16 and “not recoverable → lowers”', (await text('#roWithout')).includes('24 = 8 + 16') && /不可恢复 → 降低逃逸/.test(await text('#roLowers')));
check('REDUNDANT plays from four theorems to five', await playsAfter(page, () => pick('redundant'), () => window.TRUTH_DAG_DEBUG.state));
check('… and stops by itself at five', await until(page, () => { const d = window.TRUTH_DAG_DEBUG.state; return !d.playing && d.t === 5; }));
st = await state();
check('REDUNDANT: escaped pairs stay 8, T₅ is recoverable, captures 0 and does not lower the escape', st.escaped === 8 && st.unique[4] === 0 && st.recoverable[4] && escapedOf(0b11111) === escapedOf(0b01111));
check('REDUNDANT: leave-one-out, T₁ and T₂ now follow from the other two and capture 0 as well; T₃ and T₄ keep 8 and 16', eq([0, 1, 2, 3].map((i) => st.unique[i]), [0, 0, 8, 16]) && [0, 1, 2, 3].every((i) => uniqueOrdered(0b11111, i) === 2 * st.unique[i]) && recoverable(0b11111, 0) && recoverable(0b11111, 1));
check('FREEZE plays from five theorems to six', await playsAfter(page, () => pick('freeze'), () => window.TRUTH_DAG_DEBUG.state));
check('… and ends at six', await until(page, () => { const d = window.TRUTH_DAG_DEBUG.state; return !d.playing && d.t === 6; }));
st = await state();
check('FREEZE: T₄ and T₆ both capture 0 (so do T₁, T₂, T₅); only T₃ keeps 8; 8 pairs still escape', st.unique[3] === 0 && st.unique[5] === 0 && st.unique[4] === 0 && eq([st.unique[0], st.unique[1], st.unique[2]], [0, 0, 8]) && st.escaped === 8);
check('FREEZE: the strip names the zeros', /T₁、T₂、T₄、T₅、T₆/.test(await text('#pBMeta')), await text('#pBMeta'));

/* ---------- the keyboard after a click; the rail from the keyboard ---------- */
await page.click('body', { position: { x: 5, y: 5 } });
await seek(2); await page.keyboard.press('ArrowRight'); st = await state();
check('→ inserts one more theorem', st.k === 3 && st.mode === 'prefix');
await page.keyboard.press('ArrowLeft'); check('← takes it out again', (await state()).k === 2);
await page.keyboard.press('End'); check('End inserts all six', (await state()).k === 6);
await page.keyboard.press('Home'); check('Home empties the catalog', (await state()).escaped === 120);
await page.keyboard.press('Space');
check('Space plays the catalog in order', await until(page, () => { const d = window.TRUTH_DAG_DEBUG.state; return d.playing && d.t > 0; }));
await page.keyboard.press('Space'); check('Space pauses', !(await state()).playing);
await page.click('#rew'); check('⏮ returns to the empty catalog', (await state()).t === 0);

/* ---------- toggling theorems: chips, keys, nodes ---------- */
await seek(4);
await page.click('#thmChips [data-th="4"]'); st = await state();
check('a catalog chip toggles its theorem and leaves the card: T₅ added to T₁ … T₄', st.mode === 'custom' && eq(st.selected, [0, 1, 2, 3, 4]) && st.current === 4 && st.preset === null && /自由探索/.test(await text('#presetNote')));
check('the pressed chips follow the catalog', eq(await D(() => [...document.querySelectorAll('#thmChips [data-th]')].map((b) => b.getAttribute('aria-pressed') === 'true')), [true, true, true, true, true, false]));
check('the rail says the catalog is custom', /自选/.test(await text('#tau')));
await page.click('body', { position: { x: 5, y: 5 } });
await page.keyboard.press('2'); st = await state();
check('key 2 removes T₂: now T₅ no longer follows from the others and captures pairs of its own', eq(st.selected, [0, 2, 3, 4]) && st.unique[4] > 0 && !st.recoverable[4] && 2 * st.unique[4] === uniqueOrdered(0b11101, 4), JSON.stringify(st.unique));
let pt = await D(() => window.TRUTH_DAG_DEBUG.point.node(1));
await page.mouse.click(pt.x, pt.y); st = await state();
check('clicking the node of T₂ on the stage puts it back', eq(st.selected, [0, 1, 2, 3, 4]) && st.current === 1);
pt = await D(() => window.TRUTH_DAG_DEBUG.point.node(5));
await page.mouse.click(pt.x, pt.y); st = await state();
check('clicking the node of T₆ adds the twin: T₄ and T₆ capture 0', eq(st.selected, [0, 1, 2, 3, 4, 5]) && st.unique[3] === 0 && st.unique[5] === 0);
await page.click('#selNone'); st = await state();
check('Clear empties the catalog: one class, 120 escaped', st.selected.length === 0 && st.classes === 1 && st.escaped === 120);
await page.click('#selAll'); st = await state();
check('All six selects the whole catalog: 8 classes, 8 escaped', st.selected.length === 6 && st.classes === 8 && st.escaped === 8);
let custom = true;
for (const list of [[3], [0, 3], [1, 3], [4], [4, 5], [0, 1, 2, 4, 5], [2, 3, 5]]) {
  await D((l) => window.TRUTH_DAG_DEBUG.select(l), list); const s = await state(), m = list.reduce((x, i) => x | (1 << i), 0);
  if (s.escaped !== escapedOf(m) || s.classes !== blocks(m).length || !list.every((i) => 2 * s.unique[i] === uniqueOrdered(m, i))) custom = false;
}
check('custom catalogs: escaped pairs, classes and unique capture as computed here', custom);
await seek(3); st = await state();
check('moving the rail returns to the catalog in order', st.mode === 'prefix' && eq(st.selected, [0, 1, 2]));
pt = await D(() => window.TRUTH_DAG_DEBUG.point.state(5));
await page.mouse.click(pt.x, pt.y); st = await state();
check('clicking a state probes it: its class holds the three other states of row 1', st.probe === 5 && blocks(0b111).find((b) => b.includes(5)).length === 4);
await page.mouse.click(pt.x, pt.y); check('clicking it again clears the probe', (await state()).probe === null);

/* ---------- evidence: the five frozen theorems, honest labels ---------- */
const cites = await D(() => [...new Set([...document.querySelectorAll('#evidence a[data-lean-gid]')].map((a) => a.dataset.leanGid))]);
check('the evidence panel cites exactly the five theorems of the chapter', eq([...cites].sort(), [...GIDS].sort()), JSON.stringify(cites));
check('each of the five sits in its own green LEAN ✓ box', await D((g) => g.every((gid) => { const a = document.querySelector(`#evidence a[data-lean-gid="${gid}"]`), b = a && a.closest('.lean'); return b && b.className === 'lean' && /LEAN ✓/.test(b.querySelector('.ok').textContent); }), GIDS));
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, 'books', BOOK, 'viz', 'visualizations.json'), 'utf8')).visualizations.find((v) => v.id === ID);
check('the registry lists exactly these five theorems and is live', eq(registry.lean.map((l) => l.gid).sort(), [...GIDS].sort()) && registry.status === 'live');
check('a NUM box and a MODEL box carry the page\'s own numbers and choices', await D(() => !!document.querySelector('#evidence .lean.num') && !!document.querySelector('#evidence .lean.model') && !document.querySelector('#evidence .lean.num a[data-lean-gid], #evidence .lean.model a[data-lean-gid]')));
check('readout checks use the neutral .nummark, never the green ✓ of LEAN', await D(() => document.querySelectorAll('#readouts .nummark').length >= 2 && !document.querySelector('#readouts .okmark')));
await page.click('#infoBtn');
check('the drawer says in both languages that the page is not a proof, and repeats every evidence box', /不是证明/.test(await text('#drawer div.zh')) && /not a proof/.test(await text('#drawer div.en'))
  && (await D(() => document.querySelectorAll('#drawerEvidence .lean').length)) === (await D(() => document.querySelectorAll('#evidence .lean').length)));
await page.keyboard.press('Escape');
check('Esc closes the drawer', await D(() => document.getElementById('drawer').hidden));

/* ---------- the stills a chapter cites: the frame each caption describes ---------- */
check('every card declares its still frame', eq(await D(() => [...document.querySelectorAll('[data-preset]')].map((b) => `${b.dataset.preset}:${b.dataset.still}`)),
  ['observatory:3', 'novel-cut:4', 'redundant:5', 'freeze:6']));
const STILLS = {
  observatory: (s) => s.t === 3 && s.classes === 4 && s.escaped === 24 && s.selected.length === 3,
  'novel-cut': (s) => s.t === 4 && s.classes === 8 && s.escaped === 8 && s.unique[3] === 16 && s.current === 3,
  redundant: (s) => s.t === 5 && s.escaped === 8 && s.unique[4] === 0 && s.recoverable[4] && s.current === 4,
  freeze: (s) => s.t === 6 && s.escaped === 8 && s.unique[3] === 0 && s.unique[5] === 0 && s.current === 5
};
for (const lang of ['zh', 'en']) for (const [card, ok] of Object.entries(STILLS)) {
  const still = await openStill(T, BOOK, ID, card, lang), s = await still.evaluate(() => window.TRUTH_DAG_DEBUG.state);
  const hud = await still.textContent('#hudSub');
  check(`still ${card} (${lang}): at rest on the frame its caption describes, the HUD carries the count`, ok(s) && !s.playing && hud.includes(`${s.escaped} / 120`), `${JSON.stringify(s)} ${hud}`);
  if (lang === 'en') { const left = await cjkLeftovers(still); check(`still ${card} (en): no Chinese`, left.length === 0, left.slice(0, 3).join(' | ')); }
  await still.context().close();
}

/* ---------- English after free play ---------- */
await page.click('[data-lang-set="en"]'); await settle(page, 150);
check('English title', (await D(() => document.title)).startsWith('TRUTH//DAG · Truth DAG observatory'));
await D(() => window.TRUTH_DAG_DEBUG.select([1, 3, 4]));
let left = await cjkLeftovers(page); check('English: no Chinese left in a custom catalog', left.length === 0, left.slice(0, 4).join(' | '));
await seek(3.5); left = await cjkLeftovers(page); check('English: no Chinese left while a cut is drawn in', left.length === 0, left.slice(0, 4).join(' | '));
check('English readouts name the current theorem', /Unique capture of the current theorem T₄/.test(await text('#roCurT')));
await D(() => localStorage.removeItem('tr-lang'));

await page.click('[data-view="galaxies"]');
await settle(page);
check('eight selectable galaxies account for the published corpus', await page.locator('#atlasTargets button').count() === 8 && (await page.textContent('#hudBig')).includes('19,022'));
await page.locator('#atlasTargets button').last().click();
await settle(page);
check('Foundations has 6,719 nodes', (await page.textContent('#hudSub')).includes('6,719'));
await page.click('[data-view="stations"]');
await page.locator('#atlasTargets button').nth(3).click();
await settle(page);
check('station four describes verification', /Lean|内核/.test(await page.textContent('#hudSub')));
await page.click('[data-view="kernel"]');
await settle(page);
check('returning to the kernel restores its legend', await page.locator('#legend .sw').count() === 4);

check('no page error, console error or failed request (page-specific part)', T.errors.length === 0, T.errors.slice(0, 4).join(' | '));
await T.finish();
