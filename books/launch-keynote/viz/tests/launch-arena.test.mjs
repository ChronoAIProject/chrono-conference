#!/usr/bin/env node
// Browser regression suite for LAUNCH//ARENA (books/launch-keynote/viz/launch-arena/):
//   node books/launch-keynote/viz/tests/launch-arena.test.mjs        (or node tools/node/viz-test.mjs launch-keynote)
// It first runs the quality gates every stage-first page must pass, then reads the page through the read-only probe
// window.LAUNCH_ARENA_DEBUG and checks each claim against an independent implementation written here: the ring sum
// written out by hand, arrivals counted guest by guest with integer comparisons, the seat lock replayed with BigInt
// hashing over a Set of taken seats, the naive race replayed minute by minute, and the basket schedule from its words.
// It never calls the page's own functions to decide what is right.
import { session, stageFirstChecks, settle, until, playsAfter, openStill, cjkLeftovers } from '../../../../tools/node/viz-testkit.mjs';

const BOOK = 'launch-keynote', ID = 'launch-arena';

/* ---------- independent model ---------- */
const RINGS = [96, 144, 176, 204, 232, 256];
const CAP = 96 + 144 + 176 + 204 + 232 + 256;
const OFF = []; { let o = 0; for (const n of RINGS) { OFF.push(o); o += n; } }
const T0 = 75;
/** The guest hash as unsigned 32-bit products, computed with BigInt. */
const M32 = (1n << 32n) - 1n;
const hash = (k, r) => Number(((BigInt(k) * 0x9E3779B1n) & M32) ^ ((BigInt(r + 1) * 0x85EBCA6Bn) & M32));
/** Guests who have arrived by minute t: guest k arrives at minute 75·k/N, compared exactly as 75·k ≤ t·N. */
function arrived(t, N) { const tt = Math.min(t, T0); let c = 0; for (let k = 1; k <= N; k++) if (75 * k <= tt * N + 1e-9) c++; return c; }
/** The atomic lock replayed: guests one at a time, innermost ring with a free seat, forward probe from the hash. */
function lockAll(n) {
  const taken = new Set(), out = [];
  for (let k = 1; k <= n; k++) {
    const r = RINGS.findIndex((size, i) => [...Array(size).keys()].some((s) => !taken.has(OFF[i] + s)));
    if (r < 0) { out.push(-1); continue; }
    let s = hash(k, r) % RINGS[r];
    while (taken.has(OFF[r] + s)) s = (s + 1) % RINGS[r];
    taken.add(OFF[r] + s); out.push(OFF[r] + s);
  }
  return out;
}
const LOCK = lockAll(1250);
const ringOf = (g) => RINGS.findIndex((n, i) => g >= OFF[i] && g < OFF[i] + n);
/** The naive race replayed: guests of minute m = ⌈75·k/N⌉ read the seats taken before minute m and lock nothing. */
function naive(N) {
  const taken = new Set(), out = [0]; let dup = 0;
  for (let m = 1; m <= T0; m++) {
    const batch = []; for (let k = 1; k <= N; k++) if (Math.floor((75 * k + N - 1) / N) === m) batch.push(k);
    const r = RINGS.findIndex((size, i) => taken.size < CAP && [...Array(size).keys()].some((s) => !taken.has(OFF[i] + s)));
    const picks = [];
    if (r >= 0) for (const k of batch) { let s = hash(k, r) % RINGS[r]; while (taken.has(OFF[r] + s)) s = (s + 1) % RINGS[r]; picks.push(OFF[r] + s); }
    const counts = new Map(); for (const g of picks) counts.set(g, (counts.get(g) || 0) + 1);
    for (const [g, c] of counts) { dup += c - 1; taken.add(g); }
    out.push(dup);
  }
  return out;
}
/** Basket stands, as the drawer words them: the first 12 one every 5 minutes from minute 5, then one every 2 minutes. */
const BASKETS = []; for (let i = 1; i <= 12; i++) BASKETS.push(5 * i); for (let i = 1; i <= 6; i++) BASKETS.push(60 + 2 * i);
const placed = (t) => BASKETS.filter((x) => x <= t).length;
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const T = await session();
const { check } = T;

/* ---------- the quality gates of every stage-first page ---------- */
await stageFirstChecks(T, BOOK, ID);

const page = await T.goto(BOOK, ID, '?lang=zh');
await page.evaluate(() => document.fonts && document.fonts.ready); await settle(page);
const D = (fn, arg) => page.evaluate(fn, arg);
const state = async () => { await settle(page); return D(() => window.LAUNCH_ARENA_DEBUG.state); };
const at = async (N, t) => { await D(([n, x]) => { window.LAUNCH_ARENA_DEBUG.set(n); window.LAUNCH_ARENA_DEBUG.seek(x); }, [N, t]); return state(); };

/* ---------- the venue: 1,108 seats in six rings ---------- */
let s = await state();
check('page carries its id', (await D(() => document.body.dataset.vizId)) === ID);
check('opens on LOBBY: T−75, nothing arrived, 1,108 seats open', s.preset === 'lobby' && s.t === 0 && s.arrivals === 0 && s.seated === 0 && !s.playing, JSON.stringify(s));
check('ring sum written out: 96 + 144 + 176 + 204 + 232 + 256 = 1,108', CAP === 1108 && eq(s.rings, RINGS) && s.cap === 1108 && s.rings.reduce((a, b) => a + b, 0) === CAP, JSON.stringify(s.rings));
const lay = await D(() => window.LAUNCH_ARENA_DEBUG.layout());
const perRing = RINGS.map((_, r) => lay.ring.filter((x) => x === r).length);
let anglesOk = true;
for (let r = 0; r < RINGS.length; r++) { const th = lay.theta.slice(OFF[r], OFF[r] + RINGS[r]); if (th.some((x, i) => x < 10 || x > 170 || (i && x <= th[i - 1]))) anglesOk = false; }
check('the floor plan draws each ring with exactly its number of seats, all at distinct angles between 10° and 170°', lay.ring.length === CAP && eq(perRing, RINGS) && anglesOk, JSON.stringify(perRing));

/* ---------- the atomic seat lock, replayed independently ---------- */
const seats = await D(() => window.LAUNCH_ARENA_DEBUG.seats(1250));
check('1,250 guests: the page assigns exactly the seats of the independent replay of the lock', eq(seats, LOCK));
const first = LOCK.slice(0, CAP);
check('the first 1,108 guests hold 1,108 different seats (zero duplicates); guests 1,109 … 1,250 hold none', new Set(first).size === CAP && first.every((g) => g >= 0) && LOCK.slice(CAP).every((g) => g === -1));
check('rings fill strictly from the inside out: the ring of guest k never decreases', first.every((g, i) => i === 0 || ringOf(g) >= ringOf(first[i - 1])));

let bad = '';
for (const N of [1, 96, 240, 416, 743, 1000, 1108, 1109, 1200, 1250]) for (const t of [0, 7, 30, 42, 60, 74, 75, 100]) {
  const x = await at(N, t), A = arrived(t, N), seatedHere = Math.min(A, CAP), over = A - seatedHere;
  const fill = RINGS.map((_, r) => LOCK.slice(0, A).filter((g) => g >= 0 && ringOf(g) === r).length);
  const ok = x.N === N && x.arrivals === A && x.seated === seatedHere && x.overflow === over && x.youtube === Math.ceil(over / 2) && x.linkedin === Math.floor(over / 2)
    && x.duplicates === 0 && eq(x.fill, fill) && x.seated <= CAP;
  if (!ok) { bad = `N ${N}, t ${t}: page ${JSON.stringify([x.arrivals, x.seated, x.overflow, x.duplicates, x.fill])} vs ${JSON.stringify([A, seatedHere, over, 0, fill])}`; break; }
}
check('80 (load, minute) states: arrivals, seated, stream split and ring fill match the independent count; duplicates 0; seated ≤ 1,108', !bad, bad);
bad = '';
for (let N = 1109; N <= 1250; N += 3) {
  const x = await at(N, 100);
  if (!(x.arrivals === N && x.seated === CAP && x.overflow === N - CAP && x.duplicates === 0 && x.youtube + x.linkedin === N - CAP)) { bad = `N ${N}: ${JSON.stringify(x)}`; break; }
}
check('every load above 1,108: seated stays 1,108, overflow = N − 1,108 goes to the stream, duplicates 0', !bad, bad);

/* ---------- the naive race, replayed independently ---------- */
for (const N of [743, 1108, 1250]) {
  const page_ = await D((n) => window.LAUNCH_ARENA_DEBUG.naive(n), N), mine = naive(N);
  check(`naive race (N = ${N}): the page's duplicate count per minute matches the independent replay`, eq(page_, mine), `${page_.at(-1)} vs ${mine.at(-1)}`);
}
const race = naive(1250);
check('the race is not empty: without the lock 1,250 guests produce duplicate seats, the lock produces none', race[T0] > 0 && (await at(1250, 100)).duplicates === 0, String(race[T0]));

/* ---------- baskets ---------- */
check('basket schedule: the page uses the schedule its drawer words', eq(await D(() => window.LAUNCH_ARENA_DEBUG.basketAt()), BASKETS));
s = await at(1250, 60); check('minute 60: 12 baskets placed, 6 open', s.baskets === 12 && placed(60) === 12);
s = await at(1250, 75); check('minute 75: all 18 baskets placed', s.baskets === 18 && placed(75) === 18);

/* ---------- controls ---------- */
await page.click('[data-preset="overflow"]'); await settle(page);
await page.evaluate(() => { const el = document.getElementById('load'); el.value = '900'; el.dispatchEvent(new Event('input', { bubbles: true })); });
s = await state();
check('the load slider sets N, leaves the card and updates the output', s.N === 900 && s.preset === null && (await page.textContent('#oLoad')).trim() === '900', JSON.stringify([s.N, s.preset]));
await page.click('#loadCap'); s = await state(); check('the chip "exactly full" sets N = 1,108', s.N === CAP);
await page.click('#loadMax'); s = await state(); check('the chip "over capacity" sets N = 1,250', s.N === 1250);
await D(() => window.LAUNCH_ARENA_DEBUG.seek(42));
let pt = await D(() => window.LAUNCH_ARENA_DEBUG.point.ring(2));
await page.mouse.click(pt.x, pt.y); s = await state();
check('clicking ring 3 selects it, and the readout reads its fill out of 176', s.sel && s.sel.ring === 2 && /176/.test(await page.textContent('#roSel')), JSON.stringify(s.sel));
await page.mouse.click(pt.x, pt.y); s = await state();
check('clicking the selected ring again clears the selection', s.sel === null);
pt = await D(() => window.LAUNCH_ARENA_DEBUG.point.stand(4));
await page.mouse.click(pt.x, pt.y); s = await state();
check('clicking stand 5 selects it; at minute 42 it is placed (model: minute 25)', s.sel && s.sel.stand === 4 && /5/.test(await page.textContent('#roSel')), JSON.stringify(s.sel));
pt = await D(() => window.LAUNCH_ARENA_DEBUG.point.empty());
await page.mouse.click(pt.x, pt.y); s = await state();
check('clicking empty floor clears the selection', s.sel === null);
await D(() => window.LAUNCH_ARENA_DEBUG.seek(0));
await page.locator('body').click({ position: { x: 5, y: 5 } });
await page.keyboard.press('ArrowRight'); s = await state();
check('→ steps five minutes', s.t === 5, String(s.t));
await page.keyboard.press(' ');
check('Space plays', await until(page, () => { const d = window.LAUNCH_ARENA_DEBUG.state; return d.playing && d.t > 5; }));
await page.keyboard.press(' '); check('Space pauses', !(await state()).playing);

/* ---------- cards that play stop on their still ---------- */
check('BOOKING plays when clicked', await playsAfter(page, () => page.click('[data-preset="booking"]'), () => window.LAUNCH_ARENA_DEBUG.state));
s = await state();
check('BOOKING: the first wave of 743 guests, armed to stop at minute 42', s.N === 743 && (s.stop === 42 || (!s.playing && s.t === 42)), JSON.stringify(s));
await page.click('[data-speed="2.5"]');
// BOOKING may still be playing: pause it in place (no scrolling) so that the watcher sees BASKET start from rest
await page.locator('#play').evaluate((b) => { if (b.getAttribute('aria-pressed') === 'true') b.click(); }); await settle(page);
check('BASKET plays when clicked', await playsAfter(page, () => page.click('[data-preset="basket"]'), () => window.LAUNCH_ARENA_DEBUG.state));
check('BASKET stops by itself at minute 60, on its still', await until(page, () => { const d = window.LAUNCH_ARENA_DEBUG.state; return !d.playing && d.t === 60 && d.baskets === 12; }, undefined, 120000));
await page.click('[data-speed="1"]');

/* ---------- the stills a chapter prints ---------- */
const STILLS = {
  lobby: (x) => x.t === 0 && x.N === 1250 && x.arrivals === 0 && x.seated === 0 && x.baskets === 0 && x.duplicates === 0,
  booking: (x) => x.t === 42 && x.N === 743 && x.arrivals === 416 && x.seated === 416 && eq(x.fill, [96, 144, 176, 0, 0, 0]) && x.duplicates === 0 && arrived(42, 743) === 416,
  overflow: (x) => x.t === 100 && x.arrivals === 1250 && x.seated === CAP && x.overflow === 142 && x.youtube === 71 && x.linkedin === 71 && x.duplicates === 0,
  basket: (x) => x.t === 60 && x.baskets === 12 && x.focus === 'baskets' && placed(60) === 12,
  checkin: (x) => x.t === 75 && x.N === CAP && x.seated === CAP && x.overflow === 0 && x.baskets === 18 && x.live && eq(x.fill, RINGS)
};
const HUD = { lobby: /0 \/ 1,108/, booking: /416 \/ 1,108/, overflow: /1,108 \/ 1,108/, basket: /12 \/ 18/, checkin: /1,108 \/ 1,108/ };
for (const lang of ['zh', 'en']) for (const card of Object.keys(STILLS)) {
  const still = await openStill(T, BOOK, ID, card, lang);
  const x = await still.evaluate(() => window.LAUNCH_ARENA_DEBUG.state), hud = await still.textContent('.hud-tl');
  check(`still ${card} (${lang}): the frame carries the numbers of its caption`, STILLS[card](x) && !x.playing && HUD[card].test(hud), JSON.stringify({ x, hud }));
  if (lang === 'en') { const left = await cjkLeftovers(still); check(`still ${card} (en): no Chinese`, left.length === 0, left.slice(0, 3).join(' | ')); }
  await still.context().close();
}

/* ---------- a cited figure is the stage alone; the full lab keeps its strip ---------- */
const fig = await T.open(BOOK, ID, '?embed=1&lang=zh&preset=booking', { viewport: { width: 740, height: 500 } });
await settle(fig);
check('cited figure: the strip of small plots is hidden', await fig.evaluate(() => getComputedStyle(document.querySelector('.strip')).display === 'none'));
await fig.context().close();
const lab = await T.open(BOOK, ID, '?embed=1&lang=zh', { viewport: { width: 740, height: 620 } });
await settle(lab);
check('whole lab in a chapter: the strip is shown', await lab.evaluate(() => getComputedStyle(document.querySelector('.strip')).display !== 'none'));
await lab.context().close();

/* ---------- English after free play ---------- */
await page.click('[data-lang-set="en"]'); await settle(page);
await D(() => window.LAUNCH_ARENA_DEBUG.seek(90));
pt = await D(() => window.LAUNCH_ARENA_DEBUG.point.stand(16));
await page.mouse.click(pt.x, pt.y); await settle(page);
let left = await cjkLeftovers(page);
check('English: no Chinese left after selecting a stand during the keynote', left.length === 0, left.slice(0, 3).join(' | '));
pt = await D(() => window.LAUNCH_ARENA_DEBUG.point.ring(5));
await page.mouse.click(pt.x, pt.y); await settle(page);
left = await cjkLeftovers(page);
check('English: no Chinese left after selecting a ring', left.length === 0 && /Ring 6/.test(await page.textContent('#roSel')), left.slice(0, 3).join(' | '));
await D(() => localStorage.removeItem('tr-lang'));

check('no page error, console error or failed request (page-specific part)', T.errors.length === 0, T.errors.slice(0, 4).join(' | '));
await T.finish();
