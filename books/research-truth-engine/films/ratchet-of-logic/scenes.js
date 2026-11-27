/* Film · The Ratchet of Logic · 逻辑的棘轮 (book research-truth-engine).
   Scenes for theme/film/engine.js, every frame a pure function of S.u.
   Lean citations (film.json "lean", the only things drawn in green):
     CatalogKernel.jointKernel_antitone            smaller ⊆ larger → jointKernel larger ⊆ jointKernel smaller;
     StructuralNovelty.lowersEscape_iff_not_mem_semanticClosureWithout
                                                   (nondegenerate arena) LowersEscape i ↔ the kernel of theorem i is not
                                                   in the semantic closure of the catalog without i;
     FredkinEntanglingPowerRefutation.result       ¬ claim, claim := K_AD:BC(F₄) = 2 (arXiv:2410.15253); the explicit
                                                   product input of the proof gives 2.00034… ebits.
   Computed here, and labelled so: a toy arena of 16 states (4 bits) whose theorems are the observables "bit k".
   FILM.init recounts the joint kernel (unordered pairs of states no theorem tells apart): 120, 56, 24, 8, 0 as bits
   0..3 are added; adding bit 0 XOR bit 1 to {bit 0, bit 1} changes nothing; adding bit 2 cuts 24 to 8.
   Figures from the evidence ledger (launch-keynote appendix B): 720 / 720 UTC hours with commits, 2026-10-21 to
   2026-11-19 (trureturing@e55900e); 167,819 frozen theorems and 2,128 literature resolutions (2,126 dated + 2
   undated; 1,400 proofs, 728 refutations), cumulative snapshot 2026-11-20 (trureturing@05ceb90);
   live.trureturing.org: 19,022 nodes, 8 departments (2026-11-27). The Higuchi–Sudbery bound is shown as a result of
   book chapter 4, not as a citation of this film.
   The Riemann Hypothesis is open (problem prob-rh-open) and is marked red. The ratchet and the gold are analogies. */
'use strict';

/* ---------- shared helpers (prefixed k, clear of the engine's names) ---------- */
const kCJK = /[㐀-鿿＀-￯]/;
const kFam = s => (kCJK.test(s) ? F.zh : F.mono);
const kFade = (S, i = 0.5, o = 0.6) => clamp(S.u / i) * clamp((S.d - S.u) / o);
const kNum = n => Math.round(n).toLocaleString('en-US');
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
/* all cited theorems, one badge per line (the engine's leanList, showing GIDs); returns the y after the last */
function kLeanList(x, y, a, o = {}) {
  if (a <= 0.003) return y;
  const gap = o.gap || 44;
  for (const r of DATA.lean.filter(z => z.kind === 'theorem')) { kLean(x, y, r.gid, a, o); y += gap; }
  return y;
}
function kTitle(S) {
  const u = S.u, L0 = lineAt(S, 0), ta = clamp(u / 0.4) * (1 - clamp((u - L0.s + 0.1) / 0.6));
  if (ta <= 0.003) return;
  const p = clamp(u / 1.3);
  txt(`${DATA.book.code} · FILM`, W / 2, 380, { size: 26, fam: F.mono, w: 700, align: 'center', c: C.cyan, a: ta, ls: 10 });
  txt(DATA.film.title_zh, W / 2, 515, { size: 116, fam: F.zh, w: 900, align: 'center', c: C.white, a: ta * clamp(p * 1.6), ab: 4 });
  txt(scramble(DATA.film.title.toUpperCase(), p, 3), W / 2, 610, { size: 52, fam: F.orb, w: 900, align: 'center', c: C.white, a: ta, ls: 8, ab: 2 });
}
function kEnd(S, from, o = {}) {
  const a = clamp((S.u - from) / 0.7) * clamp((S.d - S.u) / 0.9);
  if (a <= 0.003) return;
  fillBox(0, 0, W, H, C.bg, 0.74 * clamp((S.u - from) / 0.7));
  const cx = o.x || W / 2, cy = o.y || 340, b = DATA.book, f = DATA.film;
  drawHyper(CUBE4, [[0, 3, S.t * 0.21], [1, 2, S.t * 0.13], [2, 3, S.t * 0.17]], { scale: 1.15, a: 0.3 * a, cx, cy: cy - 20, camZ: 7, lw: 1.4, dots: false });
  txt(`${b.code} · FILM`, cx, cy - 92, { size: 24, fam: F.mono, w: 700, align: 'center', c: C.cyan, a, ls: 10 });
  txt(f.title_zh, cx, cy, { size: 88, fam: F.zh, w: 900, align: 'center', c: C.white, a, ab: 3 });
  txt(f.title.toUpperCase(), cx, cy + 74, { size: 40, fam: F.orb, w: 900, align: 'center', c: C.white, a: a * 0.94, ls: 5 });
  const p2 = clamp((S.u - from - 0.35) / 0.6) * a;
  txt(`${b.title.zh} · ${b.title.en}`, cx, cy + 132, { size: 24, fam: F.zh, w: 700, align: 'center', c: C.mag, a: p2 });
  let y = cy + 205;
  if (DATA.lean.length) y = kLeanList(cx, y, p2, { align: 'center', size: 20, gap: 38 });
  const p3 = clamp((S.u - from - 0.6) / 0.6) * a;
  txt('chrono-ai.fun  ·  contact@chrono-ai.fun', cx, y + 14, { size: 28, fam: F.mono, w: 700, align: 'center', c: C.cyan, a: p3, ls: 1 });
  const pin = DATA.pin || {};
  if (pin.commit) txt(`github.com/${pin.repo} @ ${pin.commit.slice(0, 12)}`, cx, y + 52, { size: 18, fam: F.mono, align: 'center', c: C.dim, a: p3 });
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
  const tip = [x + (r + 12) * Math.cos(-0.62), y + (r + 12) * Math.sin(-0.62)], piv = [x + r + 110, y - r - 30];
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

/* ---------- novelty: inside the closure, nothing to gain; outside it, the kernel shrinks ---------- */
const CLOSURE = ['b₀', 'b₁', 'b₀ ⊕ b₁', 'b₀ ∧ b₁', '¬b₀', 'b₀ ∨ b₁'];
SCENES.novelty = S => {
  const u = S.u, a = kFade(S);
  const X0 = 200, Y0 = 250, BX = 1240, BY = 400;
  /* candidate b2 (outside the closure) arrives and cuts; candidate b0 ⊕ b1 (inside) arrives and bounces */
  const tB = phraseAt(S, 0, 'stands outside the semantic closure'), cB = clamp((u - tB - 0.9) / 0.8);
  const tA = phraseAt(S, 1, 'the same gold'), mA = clamp((u - tA + 0.6) / 1.6);
  const base = [OBS.b0, OBS.b1], withB = [OBS.b0, OBS.b1, OBS.b2];
  const prev = cB > 0 ? (cB >= 1 ? withB : base) : base, next = cB > 0 ? withB : base;
  kLattice(X0, Y0, prev, next, cB >= 1 ? 1 : cB, a);
  txt('catalog {b₀, b₁} · computed here', X0, Y0 - 22, { size: 17, fam: F.mono, c: C.dim, a });
  const n = cB >= 0.35 ? 8 : 24;
  txt('|joint kernel|', 700, 300, { size: 22, fam: F.mono, w: 700, c: C.dim, a: a * Q(S, 0, 'lowers information escape', 0.5) });
  txt(String(n), 700, 384, { size: 88, fam: F.disp, w: 700, c: C.vio, a: a * Q(S, 0, 'lowers information escape', 0.5), ab: 2 });
  /* the semantic closure of what is already known */
  const ca = a * at(S, 0, 0.7, 0.2);
  ctx.save(); ctx.globalAlpha = ca; ctx.beginPath(); ctx.ellipse(BX, BY, 330, 150, 0, 0, TAU); ctx.fillStyle = rgba(C.vio, 0.12); ctx.fill();
  ctx.setLineDash([12, 8]); ctx.strokeStyle = C.vio; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
  txt('SEMANTIC CLOSURE · 已知结论的语义闭包', BX, BY - 168, { size: 20, fam: F.zh, w: 700, align: 'center', c: C.vio, a: ca, ls: 1 });
  CLOSURE.forEach((s, i) => {
    const x = BX - 220 + (i % 3) * 220, y = BY - 40 + Math.floor(i / 3) * 80;
    const isA = i === 2;
    if (isA && mA > 0) return;
    txt(s, x, y, { size: 30, fam: F.math, w: 700, align: 'center', c: C.white, a: ca * (isA ? 1 : 0.7) });
  });
  /* candidate B: b2, from outside, cuts */
  const bq = clamp((u - tB) / 0.9);
  if (bq > 0) {
    const s = eo(bq), x = lerp(1700, X0 + 8 * CELL, s), y = lerp(640, Y0 + 8 * CELL, s);
    const fadeB = 1 - clamp((u - tB - 1.9) / 0.5);
    txt('b₂', x, y + 12, { size: 40, fam: F.math, w: 900, align: 'center', c: C.cyan, a: a * fadeB, ab: 2 });
    ring(x, y, 34, C.cyan, a * fadeB, 3);
    txt('outside the closure · novel', 1500, 640, { size: 22, fam: F.mono, w: 700, align: 'center', c: C.cyan, a: a * bq * fadeB });
    txt('Δ = 24 → 8', 700, 470, { size: 30, fam: F.mono, w: 700, c: C.cyan, a: a * clamp(cB * 2 - 0.6) });
  }
  /* the theorem, kernel-checked */
  const lq = Q(S, 0, 'if and only if', 0.6);
  txt('LowersEscape i   ⇔   ker(Tᵢ) ∉ closure(catalog ∖ i)', W / 2, 720, { size: 32, fam: F.math, w: 700, align: 'center', c: C.white, a: a * lq, ab: 1 });
  txt('for a nondegenerate arena · 非退化竞技场', W / 2, 760, { size: 19, fam: F.zh, w: 700, align: 'center', c: C.dim, a: a * lq });
  kLean(W / 2, 812, G_NOV, a * lq, { align: 'center', size: 19 });
  const tl = phraseAt(S, 0, 'if and only if');
  if (u < tl) kBadge(S, 0, 'computed'); else kBadge(S, tl, 'lean');
  /* line 1: candidate A, b0 ⊕ b1, from inside: it bounces, Δ = 0 */
  if (mA > 0) {
    const go = mA < 0.55 ? eo(mA / 0.55) : 1 - 0.6 * eo((mA - 0.55) / 0.45);
    const x = lerp(BX, X0 + 8 * CELL, go), y = lerp(BY - 40, Y0 + 8 * CELL, go);
    txt('b₀ ⊕ b₁', x, y + 12, { size: 34, fam: F.math, w: 900, align: 'center', c: C.white, a, ab: 1 });
    ring(x, y, 46, C.white, a * 0.8, 2.5);
    const zq = clamp((mA - 0.5) * 4);
    txt('Δ = 0 · already known', 700, 520, { size: 26, fam: F.mono, w: 700, c: C.white, a: a * zq });
    txt('同一块金子，挖不了两次', 700, 566, { size: 24, fam: F.zh, w: 900, c: C.white, a: a * zq });
    kTag('ANALOGY · 类比', 700, 612, C.argued, a * zq);
  }
};

/* ---------- frontier: the cadence and the ledger; the observatory; proved, refuted, open ---------- */
const DEPTS = [
  ['FORMAL VERIFICATION CORE', '形式验证核心'], ['THEORY ARCHITECTURE', '理论架构'], ['OPEN-PROBLEM HUNTERS', '开放题猎手'],
  ['QUANTUM & PHYSICS', '量子与物理基础'], ['NUMBER THEORY & ZEROS', '数论与零点'], ['COMBINATORICS & OEIS', '组合与 OEIS'],
  ['OUTREACH & MONOGRAPHS', '学术外联与专著'], ['GOVERNANCE & STRATALINT', '治理与 StrataLint']
];
function kWheel(cx, cy, r, rot, hi, a) {
  if (a <= 0.003) return;
  for (let k = 0; k < 8; k++) {
    const t0 = rot + k / 8 * TAU + 0.03, t1 = rot + (k + 1) / 8 * TAU - 0.03, h = hi[k] || 0;
    const col = h < 0 ? C.open : h > 0 ? C.cyan : C.dim;
    ctx.save(); ctx.globalAlpha = a * (0.55 + 0.45 * Math.abs(h)); ctx.beginPath(); ctx.arc(cx, cy, r, t0, t1); ctx.arc(cx, cy, r * 0.72, t1, t0, true); ctx.closePath();
    ctx.fillStyle = rgba(col, 0.12 + 0.25 * Math.abs(h)); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
    const tm = (t0 + t1) / 2, lx = cx + r * 1.13 * Math.cos(tm), ly = cy + r * 1.13 * Math.sin(tm);
    txt(DEPTS[k][1], lx, ly + 8, { size: 19, fam: F.zh, w: 700, align: Math.cos(tm) > 0.2 ? 'left' : Math.cos(tm) < -0.2 ? 'right' : 'center', c: h ? col : C.white, a: a * (0.75 + 0.25 * Math.abs(h)) });
  }
  ring(cx, cy, r * 0.62, C.cyan, a * 0.5, 1.2);
  txt('live.trureturing.org', cx, cy - 10, { size: 22, fam: F.mono, w: 700, align: 'center', c: C.white, a });
  txt('19,022 nodes · 8 departments', cx, cy + 22, { size: 17, fam: F.mono, align: 'center', c: C.cyan, a });
  txt('snapshot 2026-11-27', cx, cy + 46, { size: 15, fam: F.mono, align: 'center', c: C.dim, a });
}
SCENES.frontier = S => {
  const u = S.u, a = kFade(S);
  const L1 = lineAt(S, 1), end = clamp((u - L1.e - 1.4) / 0.7);
  const o0 = a * at(S, 0, 0.6, -0.1) * (1 - at(S, 1, 0.6, -0.2));
  if (o0 > 0.003) {
    /* 720 UTC hours, 30 days by 24 hours, every one with commits */
    const hq = phraseAt(S, 0, 'seven hundred twenty unbroken UTC hours'), fill = clamp((u - hq) / 2.4);
    const HX = 200, HY = 290, cw = 19, ch = 13;
    txt('24 / 7', HX, 250, { size: 40, fam: F.orb, w: 900, c: C.cyan, a: o0 * Q(S, 0, 'Across seven hundred twenty', 0.5) });
    txt('UTC hour ↓ · day →', HX + 30 * cw, 250, { size: 16, fam: F.mono, align: 'right', c: C.dim, a: o0 });
    for (let d = 0; d < 30; d++) for (let h = 0; h < 24; h++) {
      const on = (d * 24 + h) < fill * 720;
      fillBox(HX + d * cw, HY + h * ch, cw - 3, ch - 3, on ? C.cyan : C.dim, o0 * (on ? 0.85 : 0.18));
    }
    txt(`${kNum(Math.floor(fill * 720))} / 720 UTC hours with commits`, HX, HY + 24 * ch + 40, { size: 24, fam: F.mono, w: 700, c: C.white, a: o0 * clamp(fill * 4) });
    txt('2026-10-21 → 2026-11-19 · trureturing@e55900e', HX, HY + 24 * ch + 72, { size: 17, fam: F.mono, c: C.dim, a: o0 * clamp(fill * 4) });
    /* the ledger */
    const t1 = Q(S, 0, 'one hundred sixty-seven thousand frozen theorems', 1.6), t2 = Q(S, 0, 'two thousand one hundred twenty-six dated', 1.6);
    if (t1 > 0) {
      panel(860, 260, 900, 200, o0, C.cyan, 'FROZEN THEOREMS · 冻结定理');
      txt(kNum(167819 * eo(t1)), 890, 380, { size: 82, fam: F.orb, w: 900, c: C.white, a: o0, ab: 2 });
      txt('Lean 4.35.0 · trureturing@05ceb90 · cumulative snapshot 2026-11-20', 890, 430, { size: 18, fam: F.mono, c: C.dim, a: o0 });
    }
    if (t2 > 0) {
      panel(860, 500, 900, 250, o0, C.mag, 'LITERATURE RESOLUTIONS · 文献题解');
      /* counts to the 2,126 dated resolutions, then steps to the 2,128 total as the narration names it */
      txt(kNum(2126 * eo(t2) + 2 * Q(S, 0, 'two thousand one hundred twenty-eight in total', 0.4)), 890, 618, { size: 82, fam: F.orb, w: 900, c: C.white, a: o0, ab: 2 });
      const bw = 820, p = eo(t2);
      fillBox(890, 650, bw * 1400 / 2128 * p, 18, C.cyan, o0); fillBox(890 + bw * 1400 / 2128 * p, 650, bw * 728 / 2128 * p, 18, C.mag, o0);
      txt('1,400 proved · 证明', 890, 700, { size: 20, fam: F.zh, w: 700, c: C.cyan, a: o0 * p });
      txt('728 refuted · 反驳', 890 + bw, 700, { size: 20, fam: F.zh, w: 700, align: 'right', c: C.mag, a: o0 * p });
      txt('2,126 dated + 2 undated · 2026-09-08 → 2026-11-20 · trureturing@05ceb90', 890, 732, { size: 16, fam: F.mono, c: C.dim, a: o0 * p });
    }
  }
  /* line 1: the observatory wheel, then proved, refuted (Lean) and open (red) */
  const wa = a * at(S, 1, 0.7, -0.2) * (1 - end);
  if (wa > 0.003) {
    const pq = Q(S, 1, 'proving four-qubit entropy bounds', 0.5), rq = Q(S, 1, 'refuting the four-qubit Fredkin', 0.5), oq = Q(S, 1, 'open in stark red', 0.5);
    kWheel(560, 500, 250, -Math.PI / 2 + 0.05 * u, [0, 0, 0, Math.max(pq, rq), -oq, 0, 0, 0], wa);
    const X = 1020, Wd = 780;
    if (pq > 0) {
      panel(X, 220, Wd, 150, wa * pq, C.cyan, 'PROVED · Higuchi–Sudbery (Phys. Lett. A 2000)');
      txt('mean entropy, three 2|2 cuts of 4 qubits  ≤  1 + ½ log₂ 3', X + 24, 300, { size: 21, fam: F.math, w: 700, c: C.white, a: wa * pq });
      txt('see book chapter 4 · 四量子比特熵上界', X + 24, 342, { size: 18, fam: F.zh, w: 700, c: C.cyan, a: wa * pq });
    }
    if (rq > 0) {
      panel(X, 400, Wd, 200, wa * rq, C.lean, 'REFUTED · arXiv:2410.15253');
      txt('claim :  K_AD:BC(F₄) = 2', X + 24, 476, { size: 28, fam: F.math, w: 700, c: C.white, a: wa * rq });
      line(X + 20, 466, X + 20 + 360 * eo(clamp(rq * 2 - 0.6)), 466, C.mag, wa * rq, 3);
      txt('¬ claim · an explicit product input: 2.00034… > 2 ebits', X + 24, 520, { size: 21, fam: F.mono, w: 700, c: C.white, a: wa * rq });
      kLean(X + 24, 572, G_FRD, wa * rq, { size: 16 });
    }
    if (oq > 0) {
      panel(X, 630, Wd, 120, wa * oq, C.open, 'OPEN · 开放问题');
      txt('RIEMANN HYPOTHESIS · 黎曼猜想', X + 24, 698, { size: 30, fam: F.zh, w: 900, c: C.open, a: wa * oq, ab: 1 });
      txt('not proved here · 此处未证明', X + Wd - 24, 732, { size: 18, fam: F.zh, w: 700, align: 'right', c: C.open, a: wa * oq });
    }
    const tr = phraseAt(S, 1, 'refuting the four-qubit Fredkin'), to = phraseAt(S, 1, 'open in stark red');
    if (u >= to) kBadge(S, to, 'open'); else if (u >= tr) kBadge(S, tr, 'lean');
  }
  kEnd(S, L1.e + 1.4);
};

/* ---------- poster: the ratchet over the shrinking kernel, the three citations ---------- */
FILM.poster = () => {
  const si = 0, sc = TL.scenes[si], t = 15;
  background(t, sc, si, 15);
  kLattice(150, 300, [OBS.b0, OBS.b1], [OBS.b0, OBS.b1, OBS.b2], 0.2, 0.95);
  kRatchet(1690, 250, 96, 2.3, 0.9);
  txt('逻辑的棘轮', 1180, 360, { size: 116, fam: F.zh, w: 900, align: 'center', c: C.white, ab: 4 });
  txt('THE RATCHET OF LOGIC', 1180, 460, { size: 54, fam: F.orb, w: 900, align: 'center', c: C.white, ab: 3, ls: 6 });
  txt('blind spots can shrink, never grow · 盲区只缩不胀', 1180, 530, { size: 26, fam: F.zh, w: 700, align: 'center', c: C.vio });
  bloom(0.55);
  kLeanList(1180, 640, 1, { align: 'center', size: 15, gap: 36 });
  txt('the joint kernel of a toy 16-state arena · computed', 150, 760, { size: 16, fam: F.mono, c: C.dim });
  txt(`${DATA.book.code} · ${DATA.book.title.zh} · ${DATA.book.title.en}`, W / 2, 960, { size: 22, fam: F.zh, w: 700, align: 'center', c: C.dim });
  hud(t, Math.round(t * FPS), si, sc);
  post(3);
};
