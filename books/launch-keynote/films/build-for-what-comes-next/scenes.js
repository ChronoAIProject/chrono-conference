/* Film · Build for What Comes Next · 面向未来的造物 (book launch-keynote, the opening film of the 2026-12-17 launch).
   Scenes for theme/film/engine.js: one SCENES.<id> per scene of script.json, every frame a pure function of S.u.
   Where every figure on screen comes from (launch-keynote appendix B, the evidence ledger, and appendix A):
     trureturing: 167,819 frozen theorems, the-omega-institute/trureturing@05ceb90, snapshot 2026-11-20, Lean 4.35.0;
     the launch: the Street Corner lobby (1,108 seats), five explainer films, four bilingual books, concierge Donna
       with a 30-question verified press bank (launch-keynote README);
     the keynote: 2026-12-17, 16:00 SGT, online (appendix A, rundown).
   The cost/judgment curves are a stance and the engine/vehicle picture is an analogy; both are labelled on screen.
   The only Lean citation is film.json "lean": lowersEscape_false_of_recoverable, ¬ LowersEscape for a theorem whose
   primitive agreement is recoverable from the other theorems of the catalog. Nothing else is drawn in green. */
'use strict';

/* ---------- shared helpers (prefixed k, clear of the engine's names) ---------- */
const kCJK = /[㐀-鿿＀-￯]/;
const kFam = s => (kCJK.test(s) ? F.zh : F.mono);
const kFade = (S, i = 0.5, o = 0.6) => clamp(S.u / i) * clamp((S.d - S.u) / o);
const kNum = n => Math.round(n).toLocaleString('en-US');
/* a small bracketed label: kind of claim (STANCE, ANALOGY) or provenance */
function kTag(s, x, y, col, a, size = 15) {
  if (a <= 0.003) return 0;
  const fam = kFam(s), w = tw(s, size, fam, 700, 2) + 26;
  box(x, y - size - 9, w, size + 18, col, a, 1.2, rgba(C.bg, 0.6));
  txt(s, x + 13, y + 1, { size, fam, w: 700, c: col, a, ls: 2 });
  return w;
}
/* the top status banner from scene time t0 on (badgeQ would show its first entry from the scene start) */
function kBadge(S, t0, kind) { badge(clamp((S.u - t0) / 0.5) * clamp((S.d - S.u) / 0.5), kind); }
/* one Lean citation by its whole GID: the green LEAN ✓ block and the label the lock resolves */
function kLean(x, y, gid, a, o = {}) {
  if (a <= 0.003) return;
  const r = leanCite(gid);
  if (!r || r.kind !== 'theorem') { window.FILM_ERRORS.push(`film.json does not cite the theorem ${gid}`); return; }
  const size = o.size || 22, head = STR.en.lean || 'LEAN ✓';
  const wh = tw(head, size * 0.8, F.mono, 700, 1) + 20, wn = tw(r.label, size, F.mono, 700);
  const x0 = o.align === 'center' ? x - (wh + 14 + wn) / 2 : x;
  fillBox(x0, y - size * 1.05, wh, size * 1.4, C.lean, a);
  txt(head, x0 + 10, y - size * 0.12, { size: size * 0.8, fam: F.mono, w: 700, c: C.bg, a, ls: 1 });
  txt(r.label, x0 + wh + 14, y, { size, fam: F.mono, w: 700, c: C.lean, a });
}
const GID = 'D5/S3/ConceptDynamics/InformationEscape/StructuralNovelty.lowersEscape_false_of_recoverable';
Object.assign(FILM.speed, { hook: 0.02, vehicle: 0.035, northstar: 0.015, invitation: 0.03 });

/* ---------- hook: cost of execution falls, the value of judgment rises; four pillars on one stack ---------- */
function kCrown(x, y, s, col, a) {
  if (a <= 0.003 || s <= 0.01) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-42, 22); ctx.lineTo(-50, -24); ctx.lineTo(-21, 2); ctx.lineTo(0, -36); ctx.lineTo(21, 2); ctx.lineTo(50, -24); ctx.lineTo(42, 22); ctx.closePath();
  ctx.fillStyle = rgba(col, 0.2); ctx.fill(); ctx.lineJoin = 'round'; ctx.lineWidth = 4; ctx.strokeStyle = col; ctx.stroke();
  ctx.restore();
  dot(x - 50 * s, y - 24 * s, 9 * s, 'm', a); dot(x, y - 36 * s, 11 * s, 'w', a); dot(x + 50 * s, y - 24 * s, 9 * s, 'm', a);
}
/* pictograms of the four pillars, centred at (x, y) */
function kIcon(k, x, y, col, a) {
  if (a <= 0.003) return;
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineJoin = 'round';
  ctx.beginPath();
  if (k === 0) { for (let r = 0; r < 4; r++) { ctx.moveTo(x + 22 + r * 12, y + 26); ctx.arc(x, y + 26, 22 + r * 12, 0, Math.PI, true); } }
  else if (k === 1) { ctx.rect(x - 50, y - 30, 100, 64); ctx.moveTo(x - 12, y - 14); ctx.lineTo(x + 18, y + 2); ctx.lineTo(x - 12, y + 18); ctx.closePath(); }
  else if (k === 2) { for (let i = 0; i < 4; i++) ctx.rect(x - 44 + i * 24, y - 36 + (i % 2) * 6, 18, 70 - (i % 2) * 6); }
  else { ctx.arc(x, y - 16, 16, 0, TAU); ctx.moveTo(x - 34, y + 34); ctx.quadraticCurveTo(x, y - 6, x + 34, y + 34); }
  ctx.stroke(); ctx.restore();
}
const PILLARS = [
  ['LOBBY', '前厅', 'Street Corner · 1,108 seats'],
  ['FILMS', '影片', 'five explainer films'],
  ['FOUR BOOKS', '四部书', 'bilingual · zh / en'],
  ['CONCIERGE', '礼宾', 'Donna · 30-question bank']
];
SCENES.hook = S => {
  const u = S.u, a = kFade(S, 0.4);
  txt('CHRONOAI · 2026 VIRTUAL LAUNCH · 2026 线上发布会', W / 2, 205, { size: 22, fam: F.zh, w: 700, align: 'center', c: C.cyan, a: a * 0.9, ls: 4 });
  /* the chart: one stance, drawn while line 0 is spoken, gone as line 1 begins */
  const ca = a * (1 - at(S, 1, 0.7, 0.1));
  if (ca > 0.003) {
    const x0 = 400, y0 = 250, w = 1120, h = 520, gx = x0 + 110, gy = y0 + h - 80, gw = w - 260, gh = h - 170;
    panel(x0, y0, w, h, ca, C.cyan, 'EXECUTION · JUDGMENT');
    /* the stance tag, right-aligned 42 px in from the panel's right edge */
    const stance = 'STANCE · 立场 · SCHEMATIC · 示意，非数据';
    kTag(stance, x0 + w - 42 - (tw(stance, 15, kFam(stance), 700, 2) + 26), y0 - 16, C.argued, ca);
    line(gx, gy, gx + gw + 30, gy, C.dim, ca, 2); line(gx, gy, gx, gy - gh - 20, C.dim, ca, 2);
    txt('time →', gx + gw + 30, gy + 34, { size: 18, fam: F.mono, align: 'right', c: C.dim, a: ca });
    const pc = eo(Q(S, 0, 'When execution becomes almost free', 2.0));
    const cost = s => [gx + s * gw, gy - gh * (0.04 + 0.92 * Math.exp(-4.2 * s))];
    curve(s => cost(s * pc), 140, C.cyan, ca, 5);
    const ce = cost(pc);
    dot(ce[0], ce[1], 12, 'c', ca * clamp(pc * 4));
    txt('COST OF EXECUTION · 执行成本', gx + 26, gy - gh + 16, { size: 24, fam: F.zh, w: 700, c: C.cyan, a: ca * clamp(pc * 3) });
    txt('→ almost free', ce[0] - 10, ce[1] - 22, { size: 22, fam: F.mono, w: 700, align: 'right', c: C.cyan, a: ca * clamp((pc - 0.7) * 4) });
    const pj = eo(Q(S, 0, 'judgment becomes the crown', 1.5));
    const val = s => [gx + s * gw, gy - gh * (0.06 + 0.86 / (1 + Math.exp(-9 * (s - 0.55))))];
    curve(s => val(s * pj), 140, C.mag, ca, 5);
    const je = val(pj);
    kCrown(je[0], je[1] - 58, eo(Q(S, 0, 'the crown', 0.6)) * 1.1, C.mag, ca);
    txt('VALUE OF JUDGMENT · 判断', je[0] - 70, je[1] + 6, { size: 24, fam: F.zh, w: 700, align: 'right', c: C.mag, a: ca * clamp(pj * 3) });
  }
  /* four pillars drop and lock onto one stack */
  const drops = [Q(S, 1, 'the lobby', 0.55), Q(S, 1, 'the films', 0.55), Q(S, 1, 'the four books', 0.55), Q(S, 1, 'even the concierge', 0.55)];
  const slab = eo(Q(S, 1, 'built on our own stack', 0.7)), lock = Q(S, 1, 'under human review and hard gates', 0.5);
  PILLARS.forEach(([en, zh, sub], k) => {
    const p = drops[k];
    if (p <= 0) return;
    const pw = 300, ph = 330, x = 300 + k * 340, y = 300 - 260 * (1 - eo(p)), pa = a * clamp(p * 2.5);
    panel(x, y, pw, ph, pa, k === 3 ? C.mag : C.cyan, `0${k + 1}`);
    kIcon(k, x + pw / 2, y + 120, C.white, pa);
    txt(en, x + pw / 2, y + 215, { size: 32, fam: F.orb, w: 900, align: 'center', c: C.white, a: pa, ls: 2 });
    txt(zh, x + pw / 2, y + 258, { size: 28, fam: F.zh, w: 700, align: 'center', c: C.cyan, a: pa });
    txt(sub, x + pw / 2, y + 300, { size: 17, fam: F.mono, align: 'center', c: C.dim, a: pa });
    if (lock > 0) fillBox(x, y + ph - 4, pw, 8, C.white, pa * (1 - lock) * 0.9 + pa * 0.35);
  });
  if (slab > 0) {
    const sx = 300, sw = 4 * 340 - 40, sy = 662, sa = a * slab;
    panel(sx + sw / 2 * (1 - slab), sy, sw * slab, 100, sa, C.cyan);
    txt('AGENT STACK · HUMAN GATES · 自有底座 · 人类闸门', sx + sw / 2, sy + 44, { size: 28, fam: F.zh, w: 900, align: 'center', c: C.white, a: sa, ls: 2 });
    txt('ON OUR OWN STACK · NyxID · Ornn · CMA · heca · chrono-harness', sx + sw / 2, sy + 80, { size: 20, fam: F.mono, w: 700, align: 'center', c: C.cyan, a: sa * clamp(lock * 2) });
    for (let i = 0; i < 9; i++) { const px = sx + ((u * 260 + i * 151) % sw); dot(px, sy + 100, 6, i % 3 ? 'c' : 'm', sa * lock); }
  }
};

/* ---------- vehicle: an engine alone is not a vehicle; five layers make the chassis ---------- */
const LAYERS = [
  ['NyxID', 'holds the keys', '守住钥匙'],
  ['Ornn', 'governs skills', '治理技能'],
  ['CMA', 'runs managed agents', '托管运行'],
  ['heca', 'orchestrates local agents', '本地编排'],
  ['chrono-harness', 'enforces executable judges', '执行硬判官']
];
/* a turbine-like engine core: hexagon, spinning blades, glowing heart */
function kEngine(x, y, r, spin, col, a, label, side = false) {
  if (a <= 0.003) return;
  ctx.save(); ctx.globalAlpha = a;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) { const t = i / 6 * TAU + Math.PI / 6; ctx[i ? 'lineTo' : 'moveTo'](x + r * Math.cos(t), y + r * Math.sin(t)); }
  ctx.closePath(); ctx.fillStyle = rgba(C.bg, 0.85); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = col; ctx.stroke();
  ctx.lineWidth = 2.5; ctx.strokeStyle = rgba(col, 0.85);
  for (let i = 0; i < 8; i++) {
    const t = spin + i / 8 * TAU;
    ctx.beginPath(); ctx.moveTo(x + r * 0.18 * Math.cos(t), y + r * 0.18 * Math.sin(t));
    ctx.quadraticCurveTo(x + r * 0.6 * Math.cos(t + 0.5), y + r * 0.6 * Math.sin(t + 0.5), x + r * 0.72 * Math.cos(t + 0.15), y + r * 0.72 * Math.sin(t + 0.15));
    ctx.stroke();
  }
  ctx.restore();
  ring(x, y, r * 0.78, col, a * 0.6, 1.5);
  dot(x, y, r * 0.32, 'w', a);
  if (label && side) txt(label, x + r + 28, y + 8, { size: 20, fam: F.zh, w: 700, c: col, a, ls: 2 });
  else if (label) txt(label, x, y + r + 40, { size: 20, fam: F.zh, w: 700, align: 'center', c: col, a, ls: 2 });
}
/* the chassis: layer k slides in as built[k] goes 0 → 1; pulses run along the finished layers */
function kChassis(cx, top, built, hum, u, a) {
  const lw = 1060, lh = 50, gap = 8, x0 = cx - lw / 2;
  for (let k = 0; k < LAYERS.length; k++) {
    const p = eo(built[k]);
    if (p <= 0) continue;
    const y = top + (LAYERS.length - 1 - k) * (lh + gap), dx = (k % 2 ? 1 : -1) * 700 * (1 - p), la = a * clamp(p * 2);
    const col = k === 4 ? C.mag : C.cyan;
    box(x0 + dx, y, lw, lh, col, la, 1.6, rgba(col, 0.1));
    txt(LAYERS[k][0], x0 + dx + 24, y + 34, { size: 26, fam: F.orb, w: 900, c: C.white, a: la, ls: 1 });
    txt(LAYERS[k][1], x0 + dx + 380, y + 33, { size: 22, fam: F.mono, w: 700, c: col, a: la });
    txt(LAYERS[k][2], x0 + dx + lw - 24, y + 34, { size: 24, fam: F.zh, w: 700, align: 'right', c: C.white, a: la * 0.85 });
    if (hum > 0) for (let i = 0; i < 3; i++) { const px = x0 + ((u * (180 + 40 * k) + i * 353 + k * 97) % lw); dot(px, y + lh, 5, k === 4 ? 'm' : 'c', la * hum); }
  }
  /* wheels under the frame */
  const base = top + LAYERS.length * (lh + gap) + 18, wa = a * eo(built[0]);
  [x0 + 150, x0 + lw - 150].forEach(wx => {
    ring(wx, base, 34, C.white, wa, 3); ring(wx, base, 14, C.cyan, wa, 2);
    for (let i = 0; i < 6; i++) { const t = u * 4 * hum + i / 6 * TAU; line(wx + 14 * Math.cos(t), base + 14 * Math.sin(t), wx + 32 * Math.cos(t), base + 32 * Math.sin(t), C.cyan, wa * 0.8, 2); }
  });
}
SCENES.vehicle = S => {
  const u = S.u, a = kFade(S);
  kTag('ANALOGY · 类比', 150, 205, C.argued, a);
  const into = eo(Q(S, 1, 'So we built the complete vehicle', 1.2));
  const wob = Q(S, 0, 'Nobody trusts', 0.3) * (1 - into);
  const built = [Q(S, 1, 'NyxID holds the keys', 0.6), Q(S, 1, 'Ornn governs skills', 0.6), Q(S, 1, 'CMA and heca', 0.6), Q(S, 1, 'CMA and heca', 0.6, 0.4), Q(S, 1, 'chrono-harness enforces', 0.6)];
  const hum = Q(S, 1, 'executable judges', 0.8);
  const swap = ease(Q(S, 1, 'executable judges', 1.6, 0.3));
  /* line 0: an engine for rent, hanging over nothing */
  const ex = W / 2 + Math.sin(u * 9) * 12 * wob, ey = lerp(410, 300, into) + Math.sin(u * 13) * 7 * wob, er = lerp(130, 74, into);
  const spin = u * (1.5 + 3 * hum);
  if (wob > 0) {
    dashed(ex - 260, ey + er + 80, ex + 260, ey + er + 80, C.mag, a * wob * 0.8);
    txt('BOLTED TO NOTHING · 无底盘', ex, ey + er + 130, { size: 26, fam: F.zh, w: 700, align: 'center', c: C.mag, a: a * wob });
    for (let i = 0; i < 10; i++) { const t = (u * 1.7 + i * 0.37) % 1; dot(ex + (rnd(i, 3) - 0.5) * 2 * er, ey + er + 10 + t * 120, 5 * (1 - t), 'm', a * wob * (1 - t)); }
  }
  txt('ANYONE CAN RENT AN ENGINE · 发动机人人可买', W / 2, 205, { size: 24, fam: F.zh, w: 700, align: 'center', c: C.white, a: a * at(S, 0, 0.6) * (1 - into) });
  /* the engines: A in the socket, swapped for B while the chassis keeps running */
  kEngine(ex + 900 * swap, ey, er, spin, C.cyan, a * (1 - swap), into > 0.5 ? 'ENGINE A · 可替换' : 'ENGINE · 发动机', into > 0.5);
  if (swap > 0) kEngine(ex - 900 * (1 - swap), ey, er, spin, C.white, a * swap, 'ENGINE B · 可替换', true);
  /* line 1: the chassis, built from the ground up */
  if (into > 0) {
    box(W / 2 - 560, 400, 1120, 316, C.dim, a * into * 0.6, 1.2);
    txt('THE COMPLETE VEHICLE · 整车', W / 2 + 560, 392, { size: 18, fam: F.zh, w: 700, align: 'right', c: C.dim, a: a * into });
    kChassis(W / 2, 412, built, hum, u, a);
    if (hum > 0) txt('ENGINE SWAPS · CHASSIS KEEPS RUNNING · 换发动机，底盘照转', W / 2, 205, { size: 22, fam: F.zh, w: 700, align: 'center', c: C.cyan, a: a * hum });
  }
};

/* ---------- northstar: flattery is a toy; mathematics is the stress test; the frozen ratchet ---------- */
let DAG = null;
FILM.init.push(() => {
  const NL = [8, 9, 9, 8, 7, 5, 3], nodes = [], X0 = 230, DX = 132, Y0 = 268, HH = 420;
  NL.forEach((n, L) => {
    for (let i = 0; i < n; i++) {
      const parents = [];
      if (L > 0) {
        const prev = nodes.filter(z => z.L === L - 1);
        const a = Math.floor(rnd(L * 31 + i, 5) * prev.length), b = (a + 1 + Math.floor(rnd(L * 17 + i, 6) * (prev.length - 1))) % prev.length;
        parents.push(prev[a].id, prev[b].id);
      }
      nodes.push({ id: nodes.length, L, x: X0 + L * DX + (rnd(i, L + 9) - 0.5) * 30, y: Y0 + (i + 0.5) / n * HH + (rnd(i, L + 19) - 0.5) * 26, parents, lag: rnd(i, L + 29) * 0.35 });
    }
  });
  DAG = nodes;
});
function kDag(t0, u, a) {
  if (!DAG || a <= 0.003) return;
  const lit = z => clamp((u - t0 - z.L * 0.42 - z.lag) / 0.35);
  for (const z of DAG) for (const pid of z.parents) {
    const p = DAG[pid], l = lit(z);
    line(p.x, p.y, z.x, z.y, C.dim, a * 0.35, 1.2);
    if (l > 0) line(p.x, p.y, lerp(p.x, z.x, l), lerp(p.y, z.y, l), C.cyan, a * 0.75, 1.8);
  }
  for (const z of DAG) { const l = lit(z); ring(z.x, z.y, 9, C.dim, a * 0.6, 1.2); dot(z.x, z.y, 6 + 8 * l, l > 0.5 ? 'c' : 'b', a * (0.3 + 0.7 * l)); }
}
/* a ratchet gear: teeth one way, it advances one tooth per click and never goes back */
function kRatchet(x, y, r, u, a) {
  if (a <= 0.003) return;
  const n = 16, step = TAU / n, clicks = Math.floor(u * 1.6), f = u * 1.6 - clicks, ang = (clicks + eo(clamp(f * 3))) * step;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(ang);
  ctx.beginPath();
  for (let i = 0; i < n; i++) { const t = i * step; ctx.lineTo(r * Math.cos(t), r * Math.sin(t)); ctx.lineTo((r + 16) * Math.cos(t + step * 0.85), (r + 16) * Math.sin(t + step * 0.85)); ctx.lineTo(r * Math.cos(t + step * 0.85), r * Math.sin(t + step * 0.85)); }
  ctx.closePath(); ctx.fillStyle = rgba(C.bg, 0.8); ctx.fill(); ctx.strokeStyle = C.cyan; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.restore();
  ring(x, y, r * 0.35, C.cyan, a, 2);
  const px = x + r + 30, py = y - r * 0.55;
  line(px, py - 40, x + (r + 6) * Math.cos(-0.5), y + (r + 6) * Math.sin(-0.5), C.white, a, 3);
  dot(px, py - 40, 6, 'w', a);
}
SCENES.northstar = S => {
  const u = S.u, a = kFade(S);
  const o0 = a * (1 - at(S, 1, 0.6, -0.1));
  /* line 0, left: a self-graded tool */
  if (o0 > 0.003) {
    panel(220, 270, 640, 440, o0, C.dim, 'SELF-GRADED · 自评');
    ['looks great  ✓', 'ship it  ✓', 'flawless  ✓', 'perfect  ✓'].forEach((s, i) => {
      const p = eo(at(S, 0, 0.4, 0.15 + i * 0.32));
      fillBox(270 + (i % 2) * 70, 330 + i * 86, 380, 58, rgba(C.dim, 0.25), o0 * p);
      txt(s, 300 + (i % 2) * 70, 368 + i * 86, { size: 26, fam: F.mono, w: 700, c: C.white, a: o0 * p });
    });
    stamp('TOY', 540, 500, Q(S, 0, 'is a toy', 0.45), C.mag, 92, -0.12);
    /* right: mathematics as the stress test, symbols pulled into the kernel */
    const m = Q(S, 0, 'Our stress test is mathematics itself', 1.6), cx = 1330, cy = 490;
    if (m > 0) {
      ring(cx, cy, 150, C.cyan, o0 * m, 2.5); ring(cx, cy, 118, C.cyan, o0 * m * 0.5, 1.2);
      txt('LEAN 4 KERNEL', cx, cy + 10, { size: 30, fam: F.orb, w: 900, align: 'center', c: C.white, a: o0 * m, ls: 2 });
      txt('STRESS TEST · 压力测试 = MATHEMATICS', cx, cy + 230, { size: 22, fam: F.zh, w: 700, align: 'center', c: C.cyan, a: o0 * m });
      const SYM = ['∀', '∃', '⊢', '∑', '∫', 'ℕ', 'ℝ', 'φ', 'π', '≤', 'λ', '∂', '⊗', '∞', '≠', '→'];
      SYM.forEach((g, i) => {
        const t = clamp((m * 1.6 - i * 0.04)), r = lerp(560, 175, eo(t)), th = i / SYM.length * TAU + u * 0.35;
        txt(g, cx + r * Math.cos(th), cy + r * Math.sin(th) + 14, { size: 40, fam: F.math, w: 700, align: 'center', c: i % 3 ? C.white : C.mag, a: o0 * clamp(t * 3) });
      });
    }
  }
  /* line 1: the frozen DAG, the counter, the ratchet, the redundant claim that bounces off */
  const da = a * at(S, 1, 0.6, -0.1);
  if (da > 0.003) {
    const t1 = lineAt(S, 1).s;
    kDag(t1, u, da);
    txt('FROZEN TRUTH DAG · 冻结真值图 (schematic)', 230, 245, { size: 18, fam: F.zh, w: 700, c: C.dim, a: da });
    const x0 = 1210, y0 = 250, w = 520;
    panel(x0, y0, w, 420, da, C.cyan, 'TRURETURING · FROZEN');
    const n = 167819 * eo(Q(S, 1, 'one hundred sixty-seven thousand', 2.2));
    txt(kNum(n), x0 + 30, y0 + 112, { size: 64, fam: F.orb, w: 900, c: C.white, a: da, ab: 2 });
    txt('frozen Lean theorems · 冻结定理', x0 + 30, y0 + 150, { size: 20, fam: F.zh, w: 700, c: C.cyan, a: da });
    txt('the-omega-institute/trureturing@05ceb90', x0 + 30, y0 + 186, { size: 17, fam: F.mono, c: C.dim, a: da });
    txt('snapshot 2026-11-20 · Lean 4.35.0', x0 + 30, y0 + 210, { size: 17, fam: F.mono, c: C.dim, a: da });
    const ra = da * Q(S, 1, 'irreversible ratchet', 0.6);
    kRatchet(x0 + 120, y0 + 320, 52, u, ra);
    kTag('ANALOGY · 类比', x0 + 230, y0 + 300, C.argued, ra);
    txt('one way · 只进不退', x0 + 230, y0 + 350, { size: 20, fam: F.zh, w: 700, c: C.white, a: ra });
    /* a redundant claim: recoverable from two frozen nodes, it moves the escape by exactly zero */
    const rp = Q(S, 1, 'redundant claims', 2.4);
    if (rp > 0 && DAG) {
      const A = DAG[DAG.length - 2], B = DAG[DAG.length - 5];
      const go = rp < 0.5 ? eo(rp * 2) : 1 - 0.55 * eo((rp - 0.5) * 2);
      const cx = lerp(1130, A.x + 70, go), cy = lerp(740, (A.y + B.y) / 2, go);
      dashed(cx, cy, A.x, A.y, C.white, da * 0.7, 1.5); dashed(cx, cy, B.x, B.y, C.white, da * 0.7, 1.5);
      ring(cx, cy, 20, C.white, da, 2.5); txt('R', cx, cy + 9, { size: 24, fam: F.orb, w: 900, align: 'center', c: C.white, a: da });
      txt('R · a redundant claim, recoverable from the others · 可由其余定理恢复', 230, 716, { size: 19, fam: F.zh, w: 700, c: C.white, a: da * clamp(rp * 3) });
      txt('Δ escape = 0', 1010, 716, { size: 24, fam: F.mono, w: 700, c: C.white, a: da * clamp((rp - 0.45) * 4) });
    }
    const lq = Q(S, 1, 'lower information escape by zero', 0.6);
    kBadge(S, phraseAt(S, 1, 'lower information escape by zero'), 'lean');
    if (lq > 0) {
      txt('recoverable from the other theorems  ⇒  ¬ LowersEscape', W / 2, 752, { size: 30, fam: F.math, w: 700, align: 'center', c: C.white, a: da * lq, ab: 1 });
      kLean(W / 2, 806, GID, da * lq, { align: 'center', size: 21 });
    }
  }
};

/* ---------- invitation: the date, three steps, the address; the title ---------- */
const STEPS = [
  ['01', 'TAKE A SEAT', '落座街角前厅', 'Street Corner'],
  ['02', 'TEST EVERY LINK', '亲手核验每一条链接', 'every claim → its source'],
  ['03', 'APPLY TO PILOT AN AI EMPLOYEE', '申请试点第一位 AI 员工', 'first pilot cohort'],
];
SCENES.invitation = S => {
  const u = S.u, a = kFade(S, 0.4, 0.3);
  const o0 = a * (1 - at(S, 1, 0.5, -0.3));
  if (o0 > 0.003) {
    const d = eo(at(S, 0, 0.8, -0.1));
    txt(scramble('DEC 17 · 2026', d, 2), W / 2, 312, { size: 100, fam: F.orb, w: 900, align: 'center', c: C.white, a: o0, ls: 8, ab: 3 });
    txt('16:00 SGT · ONLINE · 线上发布会', W / 2, 372, { size: 26, fam: F.zh, w: 700, align: 'center', c: C.cyan, a: o0 * d, ls: 3 });
    const sp = [Q(S, 0, 'take a seat in Street Corner', 0.6), Q(S, 0, 'test every link yourself', 0.6), Q(S, 0, 'apply to pilot your first AI employee', 0.6)];
    STEPS.forEach(([n, en, zh, sub], k) => {
      const p = eo(sp[k]);
      if (p <= 0) return;
      const x = 270 + k * 470, y = 430 + 50 * (1 - p), pa = o0 * p, col = k === 2 ? C.mag : C.cyan;
      panel(x, y, 440, 200, pa, col, n);
      txt(en, x + 24, y + 86, { size: Math.min(30, 30 * 392 / tw(en, 30, F.orb, 900, 1)), fam: F.orb, w: 900, c: C.white, a: pa, ls: 1 });
      txt(zh, x + 24, y + 134, { size: 30, fam: F.zh, w: 700, c: col, a: pa });
      txt(sub, x + 24, y + 172, { size: 18, fam: F.mono, c: C.dim, a: pa });
    });
    txt('chrono-ai.fun  ·  contact@chrono-ai.fun', W / 2, 730, { size: 30, fam: F.mono, w: 700, align: 'center', c: C.cyan, a: o0 * at(S, 0, 0.8, 1.6), ls: 2 });
  }
  /* line 1: the title, and the end card under it */
  const ta = a * at(S, 1, 0.6, -0.35);
  if (ta > 0.003) {
    const p = clamp((u - lineAt(S, 1).s + 0.35) / 1.0);
    txt('面向未来的造物', W / 2, 370, { size: 110, fam: F.zh, w: 900, align: 'center', c: C.white, a: ta, ab: 4 });
    txt(scramble('BUILD FOR WHAT COMES NEXT', p, 4), W / 2, 470, { size: 58, fam: F.orb, w: 900, align: 'center', c: C.white, a: ta, ls: 8, ab: 2 });
    leanList(W / 2, 580, ta * clamp(p * 2 - 0.4), { align: 'center', size: 21 });
    txt('ChronoAI  ·  chrono-ai.fun  ·  contact@chrono-ai.fun', W / 2, 660, { size: 28, fam: F.mono, w: 700, align: 'center', c: C.cyan, a: ta * clamp(p * 2 - 0.6), ls: 1 });
    const pin = DATA.pin || {};
    if (pin.commit) txt(`github.com/${pin.repo} @ ${pin.commit.slice(0, 12)}`, W / 2, 700, { size: 18, fam: F.mono, align: 'center', c: C.dim, a: ta * clamp(p * 2 - 0.6) });
  }
};

/* ---------- poster: the vehicle with its five layers under the title ---------- */
FILM.poster = () => {
  const si = 1, sc = TL.scenes[si], t = sc.start + 12;
  background(t, sc, si, 12);
  grid(t, 0.45, H * 0.78);
  kEngine(W / 2, 470, 70, 1.2, C.cyan, 1, null);
  kChassis(W / 2, 560, [1, 1, 1, 1, 1], 1, 3.3, 0.95);
  txt('面向未来的造物', W / 2, 205, { size: 104, fam: F.zh, w: 900, align: 'center', c: C.white, ab: 4 });
  txt('BUILD FOR WHAT COMES NEXT', W / 2, 300, { size: 54, fam: F.orb, w: 900, align: 'center', c: C.white, ab: 3, ls: 8 });
  txt('CHRONOAI · 2026 VIRTUAL LAUNCH · DEC 17 · 16:00 SGT', W / 2, 360, { size: 24, fam: F.mono, w: 700, align: 'center', c: C.cyan, ls: 4 });
  bloom(0.55);
  leanList(W / 2, 950, 1, { align: 'center', size: 20 });
  txt('contact@chrono-ai.fun', W / 2, 1000, { size: 22, fam: F.mono, w: 700, align: 'center', c: C.dim });
  hud(t, Math.round(t * FPS), si, sc);
  post(3);
};
