#!/usr/bin/env node
// Browser regression suite for HARNESS//DELTA (books/agent-infrastructure/viz/harness-delta-judge/):
//   node books/agent-infrastructure/viz/tests/harness-delta-judge.test.mjs   (or: node tools/node/viz-test.mjs agent-infrastructure)
// It first runs the quality gates every stage-first page must pass, then reads the page through the read-only probe
// window.HARNESS_DELTA_DEBUG and checks every claim against an implementation written here: the suite keeps its own
// copy of the FILEMAP, computes reachability and shortest distances with Floyd–Warshall (not a breadth-first search),
// and recomputes costs, the mixed-policy groups and the registry error. Then the stills of the four cited cards.
import { session, stageFirstChecks, settle, until, playsAfter, openStill, cjkLeftovers } from '../../../../tools/node/viz-testkit.mjs';

const BOOK = 'agent-infrastructure', ID = 'harness-delta-judge';

/* ---------- the suite's own FILEMAP ---------- */
const UNITS = {
  'core/kernel': ['core', 6], 'core/runtime': ['core', 6], 'api/server': ['api', 8], 'api/client': ['api', 6], 'api/contract': ['api', 5],
  'viz/runtime': ['viz', 5], 'viz/browser': ['viz', 18], 'docs/export': ['docs', 12], 'docs/pages': ['docs', 4],
  'policy/rules': ['policy', 3], 'judges/delta': ['judges', 7], 'judges/selftest': ['judges', 6], 'docs/chapter': ['docs', 4], 'docs/structure': ['docs', 10]
};
const EDGES = [
  ['core/kernel', 'core/runtime'], ['core/kernel', 'api/server'], ['core/runtime', 'api/server'], ['core/runtime', 'viz/runtime'],
  ['api/server', 'api/client'], ['api/server', 'api/contract'], ['api/client', 'api/contract'],
  ['viz/runtime', 'viz/browser'], ['viz/runtime', 'docs/export'], ['docs/export', 'docs/pages'],
  ['docs/chapter', 'docs/structure'], ['policy/rules', 'judges/delta'], ['judges/delta', 'judges/selftest']
];
const IDS = Object.keys(UNITS), n = IDS.length, IX = Object.fromEntries(IDS.map((id, i) => [id, i]));
/** Floyd–Warshall shortest path lengths over the consumer edges (Infinity = unreachable, 0 on the diagonal). */
const dist = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 0 : Infinity)));
for (const [a, b] of EDGES) dist[IX[a]][IX[b]] = 1;
for (let k = 0; k < n; k++) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];
/** The units that must be judged when `changed` changes: every unit at finite distance from one of them. */
function closure(changed) {
  const level = {};
  for (const id of IDS) { const d = Math.min(...changed.map((c) => dist[IX[c]][IX[id]])); if (d < Infinity) level[id] = d; }
  return level;
}
const cost = (ids) => ids.reduce((s, id) => s + UNITS[id][1], 0);
const FULL = cost(IDS);
const policyTrack = (id) => ['policy', 'judges'].includes(UNITS[id][0]);
const sorted = (a) => [...a].sort();
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const T = await session();
const { check } = T;
await stageFirstChecks(T, BOOK, ID);

const page = await T.goto(BOOK, ID, '?lang=zh');
await page.evaluate(() => document.fonts && document.fonts.ready); await settle(page, 300);
const D = (fn, arg) => page.evaluate(fn, arg);
const state = async () => { await settle(page); return D(() => window.HARNESS_DELTA_DEBUG.state); };
const seek = async (t) => { await D((v) => window.HARNESS_DELTA_DEBUG.seek(v), t); return state(); };
const set = async (ids, ghost) => { await D(([a, b]) => window.HARNESS_DELTA_DEBUG.set(a, b), [ids, ghost]); return state(); };
const text = (sel) => page.textContent(sel);

/* ---------- the registry the page draws is the suite's ---------- */
const g = await D(() => window.HARNESS_DELTA_DEBUG.graph());
check('the page draws the same 14 units, groups and costs as the suite\'s FILEMAP', g.units.length === 14 && g.units.every((u) => UNITS[u.id] && UNITS[u.id][0] === u.group && UNITS[u.id][1] === u.cost));
check('the page draws the same consumer edges', eq(sorted(g.edges.map((e) => e.join('>'))), sorted(EDGES.map((e) => e.join('>')))));
check('the cost weights add up to 100, so the share saved is 100 − the selected cost', FULL === 100);
check('the FILEMAP is acyclic (no unit reaches itself)', IDS.every((a) => EDGES.every(([x, y]) => !(x === a && dist[IX[y]][IX[a]] < Infinity))));

/* ---------- opening view and the cards' claims ---------- */
let st = await state();
check('opens on PROSE-EDIT at its still t = 100, at rest', st.preset === 'prose-edit' && st.t === 100 && !st.playing && st.phase === 'done', JSON.stringify(st));
const CLAIMS = [
  ['prose-edit', ['docs/chapter'], 2, 86],
  ['core-change', ['core/kernel'], 9, 30],
  ['mixed-policy', ['policy/rules', 'api/server'], 6, 65]
];
for (const [card, changed, count, saved] of CLAIMS) {
  const want = closure(changed), ids = Object.keys(want);
  st = await set(changed, false); await seek(100); st = await state();
  check(`${card}: the closure computed here has ${count} units and saves ${saved}%`, ids.length === count && FULL - cost(ids) === saved, `${ids.length}, ${FULL - cost(ids)}`);
  check(`${card}: the page selects exactly that closure`, eq(sorted(st.selected), sorted(ids)) && st.cost === cost(ids) && st.saved === saved, JSON.stringify([st.selected, st.cost, st.saved]));
  check(`${card}: every unit sits at its shortest distance from the change (BFS level = Floyd–Warshall distance)`, eq(Object.fromEntries(Object.entries(st.levels).sort()), Object.fromEntries(Object.entries(want).sort())), JSON.stringify(st.levels));
  check(`${card}: the depth is the longest of those distances`, st.depth === Math.max(...Object.values(want)));
}
check('the prose edit selects no browser suite, export, API or policy unit', (await set(['docs/chapter'], false)).selected.every((id) => id.startsWith('docs/chapter') || id === 'docs/structure'));

/* ---------- policy.mixed-warning ---------- */
st = await set(['policy/rules', 'api/server'], false);
const pol = closure(['policy/rules']), prod = closure(['api/server']);
check('mixed: the warning is raised when the policy track and product change together', st.mixed === true && (await text('#roJudge')).includes('policy.mixed-warning')
  && (await D(() => !!document.querySelector('#roJudge .c-mg'))));
check('mixed: the two groups are the closures of each side, with their costs', eq(sorted(st.groups.policy.units), sorted(Object.keys(pol))) && st.groups.policy.cost === cost(Object.keys(pol))
  && eq(sorted(st.groups.product.units), sorted(Object.keys(prod))) && st.groups.product.cost === cost(Object.keys(prod)), JSON.stringify(st.groups));
check('mixed: the verification covers both groups (the union)', eq(sorted(st.selected), sorted([...new Set([...Object.keys(pol), ...Object.keys(prod)])])));
check('only policy changed: no warning', (await set(['policy/rules'], false)).mixed === false);
check('only product changed: no warning', (await set(['api/server', 'docs/chapter'], false)).mixed === false);

/* ---------- registry.explicit: fail closed ---------- */
st = await set(['api/client'], true); st = await seek(10);
check('unregistered file, during the lookup: no error yet, nothing selected', st.error === null && st.reached.length === 0 && st.phase === 'lookup');
st = await seek(80);
check('unregistered file: the lookup fails with an explicit error naming the file', st.error === 'api/src/new_route.rs' && st.phase === 'error' && (await text('#hudSub')).includes('api/src/new_route.rs'));
check('unregistered file: nothing is selected, no cost is computed, no full run is substituted', st.selected.length === 0 && st.reached.length === 0 && st.cost === null && st.saved === null);
st = await seek(100);
check('unregistered file: the error holds to the end of the rail', st.error && st.selected.length === 0 && /REGISTRY|登记错误/.test(await text('#hudBig')));

/* ---------- many change sets: the page against the closure ---------- */
let seed = 20261113; const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
let manyOK = true, manyBad = '';
for (let k = 0; k < 60; k++) {
  const changed = IDS.filter(() => rnd() < 0.18);
  st = await set(changed, false);
  const want = closure(changed), ids = Object.keys(want);
  const mixed = changed.some(policyTrack) && changed.some((id) => !policyTrack(id));
  if (!eq(sorted(st.selected), sorted(ids)) || st.cost !== cost(ids) || st.saved !== FULL - cost(ids) || st.mixed !== mixed) { manyOK = false; manyBad = `${changed}: ${JSON.stringify([st.selected, st.cost, st.mixed])}`; break; }
}
check('60 random change sets: selection, cost, share saved and the mixed warning agree with the closure computed here', manyOK, manyBad);
st = await set([], false);
check('an empty change set selects nothing and saves everything', st.selected.length === 0 && st.saved === 100);
let growOK = true, growBad = '';
for (const id of IDS) {
  st = await set([id], false); await seek(50);
  const s50 = await state(); await seek(100); const s100 = await state();
  if (!(s50.reached.every((x) => s100.reached.includes(x)) && eq(sorted(s100.reached), sorted(Object.keys(closure([id])))))) { growOK = false; growBad = `${id}: ${JSON.stringify([s50.reached, s100.reached])}`; break; }
}
check('for every single changed unit the reached set grows along the rail and ends at its closure', growOK, growBad);

/* ---------- the controls ---------- */
st = await set(['docs/chapter'], false);
let pt = await D(() => window.HARNESS_DELTA_DEBUG.point('core/kernel'));
await page.mouse.click(pt.x, pt.y); st = await state();
check('clicking a unit on the stage marks it changed and leaves the card; the selection follows', st.changed.includes('core/kernel') && st.preset === null && st.selected.length === Object.keys(closure(['docs/chapter', 'core/kernel'])).length && st.t === 100);
pt = await D(() => window.HARNESS_DELTA_DEBUG.point('docs/chapter'));
await page.mouse.click(pt.x, pt.y); st = await state();
check('clicking a changed unit again unmarks it', !st.changed.includes('docs/chapter') && eq(sorted(st.selected), sorted(Object.keys(closure(['core/kernel'])))));
await page.click('#ghostBtn'); st = await state();
check('the button adds the unregistered file and the registry error follows', st.ghost && st.error === 'api/src/new_route.rs' && (await D(() => document.getElementById('ghostBtn').getAttribute('aria-pressed'))) === 'true');
await page.click('#ghostBtn'); st = await state();
check('pressing it again removes the file and the selection comes back', !st.ghost && st.error === null && st.selected.length === 9);
await page.click('#clearBtn'); st = await state();
check('clear empties the change set', st.changed.length === 0 && !st.ghost && st.selected.length === 0);
await page.keyboard.press('u'); check('U toggles the unregistered file', (await state()).ghost);
await page.keyboard.press('c'); check('C clears', (await state()).changed.length === 0 && !(await state()).ghost);
await set(['core/kernel'], false); await seek(0); await page.locator('body').click({ position: { x: 5, y: 5 } });
await page.keyboard.press('ArrowRight'); check('→ steps the rail by 5', (await state()).t === 5);
await page.keyboard.press('Space');
check('Space plays the expansion', await until(page, () => { const d = window.HARNESS_DELTA_DEBUG.state; return d.playing && d.t > 5; }));
await page.keyboard.press('Space'); check('Space pauses', !(await state()).playing);
await page.click('#rew'); check('⏮ returns to the start', (await state()).t === 0);

/* ---------- the cards play; each declares its still ---------- */
for (const c of ['prose-edit', 'core-change', 'mixed-policy', 'missing-edge']) {
  check(`card ${c} plays from the start when clicked`, await playsAfter(page, () => page.click(`[data-preset="${c}"]`), () => window.HARNESS_DELTA_DEBUG.state));
}
check('every card declares the still frame of its figure', eq(await D(() => [...document.querySelectorAll('[data-preset]')].map((b) => `${b.dataset.preset}:${b.dataset.still}`)),
  ['prose-edit:100', 'core-change:100', 'mixed-policy:100', 'missing-edge:80']));
await D(() => { const b = document.getElementById('play'); if (b.getAttribute('aria-pressed') === 'true') b.click(); });

/* ---------- the stills a chapter cites ---------- */
const STILLS = {
  'prose-edit': (s) => s.t === 100 && s.selected.length === 2 && s.saved === 86 && eq(sorted(s.selected), sorted(Object.keys(closure(['docs/chapter'])))),
  'core-change': (s) => s.t === 100 && s.selected.length === 9 && eq(sorted(s.selected), sorted(Object.keys(closure(['core/kernel'])))),
  'mixed-policy': (s) => s.t === 100 && s.mixed && s.selected.length === 6,
  'missing-edge': (s) => s.t === 80 && s.error === 'api/src/new_route.rs' && s.selected.length === 0 && s.cost === null
};
const HUD = { 'prose-edit': '2 / 14', 'core-change': '9 / 14', 'mixed-policy': '6 / 14', 'missing-edge': null };
for (const lang of ['zh', 'en']) for (const [card, ok] of Object.entries(STILLS)) {
  const still = await openStill(T, BOOK, ID, card, lang), s = await still.evaluate(() => window.HARNESS_DELTA_DEBUG.state);
  const hud = await still.textContent('.hud-tl');
  check(`still ${card} (${lang}): the frame of the caption, at rest`, ok(s) && !s.playing, JSON.stringify(s));
  check(`still ${card} (${lang}): the title carries the count of the caption`, HUD[card] ? hud.includes(HUD[card]) : /REGISTRY ERROR|登记错误/.test(hud), hud);
  if (lang === 'en') { const left = await cjkLeftovers(still); check(`still ${card} (en): no Chinese`, left.length === 0, left.slice(0, 3).join(' | ')); }
  await still.context().close();
}

/* ---------- evidence and the drawer ---------- */
check('no LEAN ✓ box: MODEL and NUM only', await D(() => document.querySelectorAll('.lean').length === 2 && !!document.querySelector('.lean.model') && !!document.querySelector('.lean.num') && !document.querySelector('a[data-lean-gid]')));
check('the model box keeps the honest boundary completeness_proven: false', (await text('.lean.model')).includes('completeness_proven: false'));
await page.click('#infoBtn');
check('the drawer says in both languages that the page is a model, not a proof', /不是证明/.test(await text('#drawer div.zh')) && /not a proof/.test(await text('#drawer div.en')));
await page.keyboard.press('Escape');

/* ---------- English ---------- */
await page.click('[data-lang-set="en"]'); await settle(page, 150);
check('English title', (await D(() => document.title)).startsWith('HARNESS//DELTA · Harness delta judge'));
for (const [ids, ghost] of [[['docs/chapter'], false], [['policy/rules', 'api/server'], false], [['api/client'], true], [[], false]]) {
  await set(ids, ghost);
  for (const t of [0, 50, 100]) { await seek(t); const left = await cjkLeftovers(page); check(`English: no Chinese left (${ids.join('+') || 'empty'}${ghost ? ' + unregistered' : ''}, t = ${t})`, left.length === 0, left.slice(0, 3).join(' | ')); }
}
await D(() => localStorage.removeItem('tr-lang'));

await page.click('#omitEdge');
check('omitting the consumer reproduces the two-unit witness', (await state()).selected.join() === 'docs/chapter');
await page.click('#omitEdge');
check('restoring the edge reaches the structure check', (await state()).selected.includes('docs/structure'));

check('no page error, console error or failed request (page-specific part)', T.errors.length === 0, T.errors.slice(0, 4).join(' | '));
await T.finish();
