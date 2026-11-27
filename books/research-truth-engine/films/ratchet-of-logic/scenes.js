'use strict';

FILM.cinemaSubtitles = true;

const paper = pal('daylight');
const space = pal('deep-space');
function typeLine(s, x, y, size, color, opts = {}) {
  txt(s, x, y, { fam: F.disp, w: 650, size, c: color, ...opts });
}
function slate(S, source) {
  cinemaFrame(S, { barHeight: 72, rightLabel: source, leftLabel: DATA.book.code });
}

const kCJK = /[㐀-鿿＀-￯]/;
const kFam = s => (kCJK.test(s) ? F.zh : F.mono);
const kFade = (S, i = 0.5, o = 0.6) => clamp(S.u / i) * clamp((S.d - S.u) / o);
function kTag(s, x, y, col, a, size = 15) {
  if (a <= 0.003) return 0;
  const fam = kFam(s), w = tw(s, size, fam, 700, 2) + 26;
  box(x, y - size - 9, w, size + 18, col, a, 1.2, rgba(C.bg, 0.6));
  txt(s, x + 13, y + 1, { size, fam, w: 700, c: col, a, ls: 2 });
  return w;
}
function kBadge(S, t0, kind) { badge(clamp((S.u - t0) / 0.5) * clamp((S.d - S.u) / 0.5), kind); }
/* Every green badge shows the cited GID exactly as film.json writes it (module path with slashes, then the
   declaration), so the three citations read alike; the engine's label would show some as dotted Lean names. */
function kLean(x, y, gid, a, o = {}) {
  if (a <= 0.003) return;
  const r = leanCite(gid);
  if (!r || r.kind !== 'theorem') { window.FILM_ERRORS.push(`film.json does not cite the theorem ${gid}`); return; }
  const size = o.size || 22, head = STR.en.lean || 'LEAN ✓';
  const wh = tw(head, size * 0.8, F.mono, 700, 1) + 20, wn = tw(r.gid, size, F.mono, 700);
  const x0 = o.align === 'center' ? x - (wh + 14 + wn) / 2 : x;
  fillBox(x0, y - size * 1.05, wh, size * 1.4, C.lean, a);
  txt(head, x0 + 10, y - size * 0.12, { size: size * 0.8, fam: F.mono, w: 700, c: C.bg, a, ls: 1 });
  txt(r.gid, x0 + wh + 14, y, { size, fam: F.mono, w: 700, c: C.lean, a });
}
function kTitle(S) {
  const u = S.u, L0 = lineAt(S, 0), ta = clamp(u / 0.4) * (1 - clamp((u - L0.s + 0.1) / 0.6));
  if (ta <= 0.003) return;
  const p = clamp(u / 1.3);
  txt(`${DATA.book.code} · FILM`, W / 2, 380, { size: 26, fam: F.mono, w: 700, align: 'center', c: C.cyan, a: ta, ls: 10 });
  txt(DATA.film.title_zh, W / 2, 515, { size: 116, fam: F.zh, w: 900, align: 'center', c: C.white, a: ta * clamp(p * 1.6), ab: 4 });
  txt(scramble(DATA.film.title.toUpperCase(), p, 3), W / 2, 610, { size: 52, fam: F.orb, w: 900, align: 'center', c: C.white, a: ta, ls: 8, ab: 2 });
}
const G_KER = 'D5/S3/ConceptDynamics/InformationEscape/CatalogKernel.jointKernel_antitone';
const G_NOV = 'D5/S3/ConceptDynamics/InformationEscape/StructuralNovelty.lowersEscape_iff_not_mem_semanticClosureWithout';
const G_FRD = 'D5/S3/Quantum/Entanglement/FredkinEntanglingPowerRefutation.result';
Object.assign(FILM.speed, { ratchet: 0.012, novelty: 0.016, frontier: 0.022 });

/* ---------- the toy arena: 16 states, theorems are observables, the joint kernel is computed ---------- */
const NST = 16, CELL = 26;
const bit = (s, k) => (s >> k) & 1;
const OBS = { b0: s => bit(s, 0), b1: s => bit(s, 1), b2: s => bit(s, 2), b3: s => bit(s, 3), x01: s => bit(s, 0) ^ bit(s, 1) };
const SEQ = [OBS.b0, OBS.b1, OBS.b2, OBS.b3];
function kInKer(i, j, obs) { for (const f of obs) if (f(i) !== f(j)) return false; return true; }
function kKer(obs) { let n = 0; for (let i = 0; i < NST; i++) for (let j = i + 1; j < NST; j++) if (kInKer(i, j, obs)) n++; return n; }
FILM.init.push(() => {
  const E = window.FILM_ERRORS, want = [120, 56, 24, 8, 0];
  want.forEach((n, k) => { if (kKer(SEQ.slice(0, k)) !== n) E.push(`joint kernel of the first ${k} theorems is ${kKer(SEQ.slice(0, k))}, not ${n}`); });
  if (kKer([OBS.b0, OBS.b1, OBS.x01]) !== 24) E.push('bit0 xor bit1 should not cut the kernel of {bit0, bit1}');
  if (kKer([OBS.b0, OBS.b1, OBS.b2]) !== 8) E.push('bit2 should cut the kernel of {bit0, bit1} from 24 to 8');
  /* antitone on every chain of the toy catalog: adding a theorem never adds a pair */
  for (let k = 0; k < 4; k++) for (let i = 0; i < NST; i++) for (let j = 0; j < NST; j++) if (kInKer(i, j, SEQ.slice(0, k + 1)) && !kInKer(i, j, SEQ.slice(0, k))) E.push('kernel grew');
});
/* the pair matrix: a pair lit violet is a blind spot; pairs a new theorem tells apart flash magenta, then go dark */
function kLattice(x0, y0, prev, next, cut, a) {
  if (a <= 0.003) return;
  for (let i = 0; i < NST; i++) for (let j = 0; j < NST; j++) {
    const x = x0 + j * CELL + 2, y = y0 + i * CELL + 2, s = CELL - 4;
    if (i === j) { fillBox(x, y, s, s, C.dim, a * 0.3); continue; }
    const was = kInKer(i, j, prev), is = kInKer(i, j, next);
    if (was && is) fillBox(x, y, s, s, C.vio, a * 0.85);
    else if (was) {
      if (cut <= 0) fillBox(x, y, s, s, C.vio, a * 0.85);
      else if (cut < 0.35) fillBox(x, y, s, s, C.mag, a);
      else fillBox(x, y, s, s, C.mag, a * (1 - cut) * 1.3);
    } else fillBox(x, y, s, s, C.dim, a * 0.07);
  }
  box(x0 - 6, y0 - 6, NST * CELL + 12, NST * CELL + 12, C.cyan, a * 0.8, 1.2);
}

/* ---------- ratchet: one way; prose keeps an eloquent mistake, the kernel rejects it; the kernel shrinks ---------- */
function kRatchet(x, y, r, u, a) {
  if (a <= 0.003) return;
  const n = 18, step = TAU / n, clicks = Math.floor(u * 1.4), f = u * 1.4 - clicks, ang = (clicks + eo(clamp(f * 3))) * step;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(ang); ctx.beginPath();
  for (let i = 0; i < n; i++) { const t = i * step; ctx.lineTo(r * Math.cos(t), r * Math.sin(t)); ctx.lineTo((r + 30) * Math.cos(t + step * 0.85), (r + 30) * Math.sin(t + step * 0.85)); ctx.lineTo(r * Math.cos(t + step * 0.85), r * Math.sin(t + step * 0.85)); }
  ctx.closePath(); ctx.fillStyle = rgba(C.bg, 0.85); ctx.fill(); ctx.strokeStyle = C.cyan; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
  ring(x, y, r * 0.42, C.cyan, a, 2.5); ring(x, y, r * 0.16, C.white, a, 2);
  const tip = [x + (r + 12) * Math.cos(-0.62), y + (r + 12) * Math.sin(-0.62)], piv = [x + r + 94, y - r - 30];
  line(piv[0], piv[1], tip[0], tip[1], C.white, a, 5); dot(piv[0], piv[1], 10, 'w', a);
  const kick = clamp(1 - f * 4);
  ctx.save(); ctx.globalAlpha = a * kick; ctx.strokeStyle = C.mag; ctx.lineWidth = 2.5;
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(tip[0], tip[1], 18 + i * 12 + 20 * (1 - kick), -1.6, -0.2); ctx.stroke(); }
  ctx.restore();
}
SCENES.ratchet = S => {
  const u = S.u, a = kFade(S);
  kTitle(S);
  const L1 = lineAt(S, 1);
  const o0 = a * at(S, 0, 0.7, -0.1) * (1 - at(S, 1, 0.6, -0.2));
  if (o0 > 0.003) {
    const ga = o0 * Q(S, 0, 'A ratchet turns one way', 0.5);
    kRatchet(380, 470, 150, u, ga);
    txt('ONE WAY · 只朝一个方向', 380, 720, { size: 26, fam: F.zh, w: 900, align: 'center', c: C.cyan, a: ga, ls: 2 });
    kTag('ANALOGY · 类比', 160, 236, C.argued, ga);
    /* prose: the mistake survives */
    const pq = Q(S, 0, 'In prose, an eloquent mistake', 0.6);
    if (pq > 0) {
      panel(720, 280, 520, 380, o0 * pq, C.dim, 'PROSE · 散文');
      for (let i = 0; i < 6; i++) if (i !== 3) fillBox(750, 340 + i * 44, 460 - (i % 3) * 60, 12, rgba(C.dim, 0.7), o0 * pq);
      txt('∴ the bound holds for every n', 750, 482, { size: 24, fam: F.mono, w: 700, c: C.mag, a: o0 * pq });
      const dq = clamp((u - phraseAt(S, 0, 'survive for decades')) / 2.2);
      txt('still cited, decades later', 750, 632, { size: 18, fam: F.mono, w: 700, c: C.dim, a: o0 * pq });
      fillBox(1050, 620, 160 * eo(dq), 10, C.mag, o0 * pq * 0.8); box(1050, 620, 160, 10, C.dim, o0 * pq, 1);
    }
    /* Lean 4: the kernel rejects it */
    const lq = Q(S, 0, 'in Lean four', 0.6);
    if (lq > 0) {
      panel(1300, 280, 500, 380, o0 * lq, C.cyan, 'LEAN 4 KERNEL');
      /* an illustrative rejection, not output captured from a real Lean run */
      kTag('SCHEMATIC · 示意', 1300, 236, C.dim, o0 * lq);
      ['theorem bound (n : ℕ) :', '    f n ≤ g n := by', '  simp [eloquent]'].forEach((s, i) => txt(s, 1326, 350 + i * 44, { size: 22, fam: F.mono, w: 700, c: C.white, a: o0 * lq }));
      const rq = Q(S, 0, 'the kernel rejects it', 0.4);
      txt('error: unsolved goals', 1326, 520, { size: 24, fam: F.mono, w: 700, c: C.mag, a: o0 * rq });
      stamp('REJECTED', 1550, 600, rq, C.mag, 44, -0.07);
    }
  }
  /* line 1: four theorems cut the kernel; it only shrinks */
  const la = a * at(S, 1, 0.6, -0.1);
  if (la > 0.003) {
    const tc = phraseAt(S, 1, 'intersects the joint kernel');
    const cuts = [0, 1, 2, 3].map(k => clamp((u - tc - k * 1.15) / 0.8));
    let k = 0; while (k < 4 && cuts[k] >= 1) k++;
    const prev = SEQ.slice(0, k), next = SEQ.slice(0, Math.min(4, k + 1)), cp = k < 4 ? cuts[k] : 1;
    const X0 = 220, Y0 = 250;
    kLattice(X0, Y0, prev, next, cp, la);
    txt('16 states · pairs no theorem tells apart · computed here', X0, Y0 - 22, { size: 17, fam: F.mono, c: C.dim, a: la });
    const n = cp >= 0.35 ? kKer(next) : kKer(prev);
    txt('|joint kernel|', 760, 300, { size: 22, fam: F.mono, w: 700, c: C.dim, a: la });
    txt(String(n), 760, 384, { size: 88, fam: F.disp, w: 700, c: C.vio, a: la, ab: 2 });
    txt('blind-spot pairs · 盲区对', 760, 420, { size: 20, fam: F.zh, w: 700, c: C.vio, a: la });
    const counts = [120, 56, 24, 8, 0];
    for (let i = 0; i < 4; i++) {
      const p = clamp((u - tc - i * 1.15) / 0.4);
      if (p <= 0) continue;
      const y = 480 + i * 50;
      txt(`T${'₁₂₃₄'[i]} · tells bit ${i} apart`, 760, y, { size: 22, fam: F.mono, w: 700, c: C.white, a: la * p });
      txt(`${counts[i]} → ${counts[i + 1]}`, 1180, y, { size: 22, fam: F.mono, w: 700, align: 'right', c: C.vio, a: la * p });
    }
    const vq = Q(S, 1, 'blind spots can shrink', 0.6);
    txt('S ⊆ T  ⇒  jointKernel T ⊆ jointKernel S', 1480, 330, { size: 26, fam: F.math, w: 700, align: 'center', c: C.white, a: la * vq, ab: 1 });
    txt('more theorems, never more blind spots', 1480, 376, { size: 20, fam: F.mono, w: 700, align: 'center', c: C.white, a: la * vq });
    txt('盲区只缩不胀', 1480, 430, { size: 30, fam: F.zh, w: 900, align: 'center', c: C.white, a: la * Q(S, 1, 'never grow', 0.5) });
    kLean(W / 2, 790, G_KER, la * vq, { align: 'center', size: 21 });
    const tl = phraseAt(S, 1, 'blind spots can shrink');
    if (u < tl) kBadge(S, L1.s, 'computed'); else kBadge(S, tl, 'lean');
  }
};

// Compare each addition to the same base catalog. The two matrices use the same 16 states.
SCENES.novelty = S => {
  const base = [OBS.b0, OBS.b1];
  const cases = [
    { x: 170, title: 'Add an independent bit', obs: OBS.b2, symbol: 'b₂' },
    { x: 1040, title: 'Reuse the known bits', obs: OBS.x01, symbol: 'b₀ ⊕ b₁' }
  ];
  const cut = Q(S, 0, 'stands outside the semantic closure', 0.9);
  cases.forEach(({ x, title, obs, symbol }) => {
    const next = [...base, obs];
    typeLine(title, x, 225, 42, space.ink);
    kLattice(x, 275, base, next, cut, 1);
    typeLine(symbol, x + 464, 410, 34, space.ink, { fam: F.math });
    typeLine(kKer(base) + ' → ' + kKer(next), x + 464, 495, 45, space.accent, { a: cut });
    typeLine('state pairs', x + 468, 545, 26, space.dim);
  });
  statusTag(1050, 726, 'argued', 'ANALOGY · 类比', at(S, 1, 0.35));
  kLean(170, 810, G_NOV, Q(S, 0, 'if and only if', 0.6), { size: 20 });
  slate(S, 'NONDEGENERATE ARENA  /  COMPUTED EXAMPLE');
};

FILM.polarity.provenance = 'daylight';
SCENES.frontier = S => {
  typeLine('The independent research ledger', 140, 200, 65, space.ink);
  typeLine('The Omega Institute  /  trureturing @548388cd  /  2026-11-27', 144, 262, 28, space.dim);
  typeLine('223,231', 135, 446, 142, space.ink);
  typeLine('frozen Lean 4 theorems', 147, 508, 40, space.accent);
  typeLine('2,278 resolutions in the ledger', 932, 362, 49, space.ink);
  const facts = ['2,276 dated in 81 days  +  2 undated', '1,512 proved  /  766 refuted', '598 in quantum and physics'];
  facts.forEach((s, i) => typeLine(s, 937, 423 + 52 * i, 34, space.dim, { a: at(S, 1, 0.7) }));
  line(142, 585, 1775, 585, space.dim, 0.65, 2);
  if (S.u < lineAt(S, 2).s) {
    typeLine('One refutation: four-qubit Fredkin entangling power', 145, 665, 37, space.ink);
    typeLine('A product input yields 2.00034… ebits, above the conjectured 2.', 145, 728, 30, space.dim);
    kLean(145, 795, G_FRD, 1, { size: 21 });
  } else {
    typeLine('720 / 720 UTC hours', 145, 693, 53, space.ink);
    typeLine('Oct 28 – Nov 26 · median 63 commits/hour', 148, 761, 32, space.dim);
    typeLine('217 merged PRs/day', 937, 693, 53, space.ink);
    typeLine('Nov 20–26 · seven complete days', 941, 761, 32, space.dim);
  }
  slate(S, 'FROZEN SNAPSHOT  /  548388cd');
};
SCENES.provenance = S => {
  typeLine('Whose proof? Whose replay?', 145, 215, 72, paper.ink);
  const rows = [
    ['Proof', 'Levent Alpöge', 'Classical RH and Dirichlet GRH', 'Lean 4 · community-certified · Nov 2026'],
    ['Replay', 'The Omega Institute', '8,490 reproducible CI shards', 'riemann-hypothesis @c2dabc97'],
    ['Equivalence', 'trureturing', 'Integer Hankel criterion', 'ActualXiIntegerCriterion.lean']
  ];
  rows.forEach(([kind, who, claim, source], i) => {
    const y = 310 + i * 165;
    line(145, y, 1775, y, paper.edge, 1, 2);
    typeLine(kind, 145, y + 80, 33, paper.dim);
    typeLine(who, 445, y + 82, 45, paper.ink);
    typeLine(claim, 1100, y + 66, 35, paper.ink);
    typeLine(source, 1100, y + 114, 24, paper.dim);
  });
  slate(S, 'COMMUNITY PROOF  /  INDEPENDENT REPLAY');
};
SCENES.open = S => {
  typeLine('Four questions about zeros', 145, 217, 70, space.ink);
  const questions = [
    ['Extended RH', 'Dedekind zeta functions of number fields'],
    ['Grand RH', 'Automorphic L-functions'],
    ['Simplicity', 'Does each nontrivial zero have multiplicity one?'],
    ['Pair correlation', 'How are pairs of zeros spaced?']
  ];
  questions.forEach(([title, detail], i) => {
    const y = 300 + i * 126;
    line(145, y, 1775, y, space.dim, 0.55, 2);
    statusTag(147, y + 34, 'open', 'OPEN', 1, 'deep-space');
    typeLine(title, 287, y + 64, 41, space.ink);
    typeLine(detail, 855, y + 65, 33, space.dim);
  });
  slate(S, 'SYMMETRY ON THE CRITICAL LINE  /  ebd24a4d');
};

FILM.poster = () => {
  drawPolarityBackground('daylight', 0);
  drawPolarityBackground('deep-space', 0.6, 960, W);
  typeLine('The Omega Institute  /  Independent research', 88, 125, 26, paper.dim);
  line(88, 170, 872, 170, paper.edge, 1, 2);
  typeLine('The Ratchet', 88, 380, 76, paper.ink);
  typeLine('of Logic', 88, 476, 76, paper.ink);
  typeLine('逻辑的棘轮', 88, 660, 46, paper.ink, { fam: F.zh });
  typeLine('Frozen theorems and open questions', 88, 735, 27, paper.dim);
  line(88, 902, 872, 902, paper.edge, 1, 2);
  typeLine('TRURETURING  /  548388cd', 88, 960, 24, paper.dim, { fam: F.mono });
  kRatchet(1432, 520, 197, 2.2, 1);
  statusTag(1080, 225, 'argued', 'ANALOGY · 类比', 1, 'deep-space');
  typeLine('223,231 FROZEN LEAN 4 THEOREMS', 1440, 960, 26, space.accent, { align: 'center' });
};
