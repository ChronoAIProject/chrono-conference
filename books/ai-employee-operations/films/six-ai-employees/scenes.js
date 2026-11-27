/* Film · Six AI Employees Run a Launch · 六位 AI 员工值守一场发布会 (book ai-employee-operations).
   Scenes for theme/film/engine.js, every frame a pure function of S.u. Where every figure comes from:
     workflow coverage, snapshot 2026-11-25 (launch-keynote appendix B and chapter 7; ai-employee-operations README):
       concierge Donna 13 / 15 (with Blossom at Flower Town), community 9 / 11, Auto-X 11 / 13, finance 24 / 28 (the demo
       ledger), HR 15 / 20, admin 5 / 10; together 77 / 97 = 79.4 %, the other 20 behind human gates or on the roadmap;
     the countdown: thirteen days, 2026-12-04 to 2026-12-17 (ai-employee-operations chapters 3 and 5).
   One cell per workflow is drawn; FILM.init checks that the counts add up to 77 / 97 and 20, and reports a page error
   otherwise. The radar and the percentages are computed here from those counts. No Lean citations: film.json "lean" is
   empty and nothing is green; amber marks the 20 gated or roadmap workflows, the one thing in focus in the last scene. */
'use strict';

/* ---------- shared helpers (prefixed k, clear of the engine's names) ---------- */
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
function kTitle(S) {
  const u = S.u, L0 = lineAt(S, 0), ta = clamp(u / 0.4) * (1 - clamp((u - L0.s + 0.1) / 0.6));
  if (ta <= 0.003) return;
  const p = clamp(u / 1.3);
  txt(`${DATA.book.code} · FILM`, W / 2, 380, { size: 26, fam: F.mono, w: 700, align: 'center', c: C.cyan, a: ta, ls: 10 });
  txt(DATA.film.title_zh, W / 2, 515, { size: 100, fam: F.zh, w: 900, align: 'center', c: C.white, a: ta * clamp(p * 1.6), ab: 4 });
  txt(scramble(DATA.film.title.toUpperCase(), p, 3), W / 2, 610, { size: 50, fam: F.orb, w: 900, align: 'center', c: C.white, a: ta, ls: 8, ab: 2 });
}
function kEnd(S, from, o = {}) {
  const a = clamp((S.u - from) / 0.7) * clamp((S.d - S.u) / 0.9);
  if (a <= 0.003) return;
  fillBox(0, 0, W, H, C.bg, 0.74 * clamp((S.u - from) / 0.7));
  const cx = o.x || W / 2, cy = o.y || 400, b = DATA.book, f = DATA.film;
  drawHyper(CUBE4, [[0, 3, S.t * 0.21], [1, 2, S.t * 0.13], [2, 3, S.t * 0.17]], { scale: 1.15, a: 0.3 * a, cx, cy: cy - 20, camZ: 7, lw: 1.4, dots: false });
  txt(`${b.code} · FILM`, cx, cy - 92, { size: 24, fam: F.mono, w: 700, align: 'center', c: C.cyan, a, ls: 10 });
  txt(f.title_zh, cx, cy, { size: 80, fam: F.zh, w: 900, align: 'center', c: C.white, a, ab: 3 });
  txt(f.title.toUpperCase(), cx, cy + 74, { size: 40, fam: F.orb, w: 900, align: 'center', c: C.white, a: a * 0.94, ls: 5 });
  const p2 = clamp((S.u - from - 0.35) / 0.6) * a;
  txt(`${b.title.zh} · ${b.title.en}`, cx, cy + 132, { size: 24, fam: F.zh, w: 700, align: 'center', c: C.mag, a: p2 });
  let y = cy + 205;
  if (DATA.lean.length) y = leanList(cx, y, p2, { align: 'center', size: 21, gap: 40 });
  const p3 = clamp((S.u - from - 0.6) / 0.6) * a;
  txt('ChronoAI  ·  chrono-ai.fun  ·  contact@chrono-ai.fun', cx, y + 14, { size: 28, fam: F.mono, w: 700, align: 'center', c: C.cyan, a: p3, ls: 1 });
}

Object.assign(FILM.speed, { team: 0.025, roles: 0.012, boundary: 0.016 });

/* ---------- the six roles, in the order the narration names them ---------- */
const ROLES = [
  ['CONCIERGE · DONNA', '礼宾 Donna', 13, 15],
  ['COMMUNITY', '社群运营', 9, 11],
  ['AUTO-X', '社媒 Auto-X', 11, 13],
  ['FINANCE · NyxBot', '财务员', 24, 28],
  ['HR', 'HR 模板包', 15, 20],
  ['ADMIN', '行政', 5, 10]
];
const DONE = ROLES.reduce((s, r) => s + r[2], 0), ALL = ROLES.reduce((s, r) => s + r[3], 0), GATED = ALL - DONE;
const pct = (a, b) => (100 * a / b).toFixed(1);
FILM.init.push(() => {
  if (DONE !== 77 || ALL !== 97 || GATED !== 20) window.FILM_ERRORS.push(`role counts add up to ${DONE} / ${ALL}, not 77 / 97`);
});
/* the 97 workflow cells in role order: { r: role, k: index in role, auto } */
const CELLS = [];
ROLES.forEach((r, i) => { for (let k = 0; k < r[3]; k++) CELLS.push({ r: i, k, auto: k < r[2] }); });

/* ---------- team: one chat box shatters into six signed roles; 77 of 97 ---------- */
SCENES.team = S => {
  const u = S.u, a = kFade(S);
  kTitle(S);
  const L0 = lineAt(S, 0);
  const shat = Q(S, 0, 'division of labor', 1.0);
  const out0 = 1 - at(S, 1, 0.6, -0.2);
  /* the lone magic chatbot */
  const ba = a * clamp((u - L0.s + 0.2) / 0.4) * (1 - clamp(shat * 3));
  if (ba > 0.003) {
    const jit = Q(S, 0, 'Forget the lone magic chatbot', 0.5) * Math.sin(u * 40) * 4;
    panel(W / 2 - 380 + jit, 330, 760, 240, ba, C.dim, 'ONE MAGIC CHAT BOX');
    txt('Ask me anything…', W / 2 - 330 + jit, 440, { size: 40, fam: F.disp, w: 700, c: C.white, a: ba });
    for (let i = 0; i < 3; i++) dot(W / 2 - 320 + i * 30 + jit, 510, 7, 'w', ba * (0.4 + 0.6 * Math.abs(Math.sin(u * 4 + i))));
    const sq = Q(S, 0, 'Forget the lone magic chatbot', 0.6, 0.6);
    if (sq > 0) line(W / 2 - 400, 450, W / 2 - 400 + 800 * eo(sq), 450, C.mag, ba, 5);
  }
  /* six role cards, flying out of the shards */
  if (shat > 0) {
    ROLES.forEach(([en, zh], i) => {
      const t = eo(clamp(shat * 1.3 - i * 0.06)), col = i % 2 ? C.mag : C.cyan;
      const tx = 290 + (i % 3) * 470, ty = 250 + Math.floor(i / 3) * 250;
      const x = lerp(W / 2 - 150 + (i - 2.5) * 30, tx, t), y = lerp(400, ty, t), ca = a * out0 * clamp(t * 2);
      panel(x, y, 400, 200, ca, col, `ROLE 0${i + 1}`);
      txt(en, x + 24, y + 86, { size: en.length > 14 ? 26 : 32, fam: F.orb, w: 900, c: C.white, a: ca, ls: 1 });
      txt(zh, x + 24, y + 128, { size: 26, fam: F.zh, w: 700, c: col, a: ca });
      const sg = Q(S, 0, 'signed accountability', 0.5, i * 0.1);
      if (sg > 0) {
        curve(s => [x + 24 + s * 170 * sg, y + 166 - 8 * Math.sin(s * 9) * (1 - s * 0.6)], 40, C.white, ca, 2);
        txt('SIGNED · owner of record', x + 376, y + 172, { size: 15, fam: F.mono, w: 700, align: 'right', c: C.dim, a: ca * sg });
      }
    });
  }
  /* line 1: the date and the coverage grid, one cell per workflow */
  const ga = a * at(S, 1, 0.6, 0.2);
  if (ga > 0.003) {
    chip(W / 2, 230, 360, 56, 'DEC 17 · 2026', C.cyan, ga * Q(S, 1, 'For December seventeenth', 0.4), 30, F.orb);
    const fq = clamp((u - phraseAt(S, 1, 'six AI employee roles')) / 2.6);
    const cw = 64, chh = 64, cols = 20, x0 = W / 2 - cols * cw / 2, y0 = 300;
    CELLS.forEach((c, n) => {
      const x = x0 + (n % cols) * cw, y = y0 + Math.floor(n / cols) * chh, shown = clamp(fq * 97 * 1.1 - n);
      if (shown <= 0) return;
      const col = c.r % 2 ? C.mag : C.cyan;
      if (c.auto) fillBox(x + 4, y + 4, cw - 8, chh - 8, rgba(col, 0.75), ga * shown);
      box(x + 4, y + 4, cw - 8, chh - 8, c.auto ? col : C.dim, ga * shown, 1.2);
    });
    const nq = Q(S, 1, 'seventy-seven of ninety-seven', 0.6);
    txt(`${DONE} / ${ALL}  =  ${pct(DONE, ALL)} %`, W / 2, 680, { size: 56, fam: F.orb, w: 900, align: 'center', c: C.white, a: ga * nq, ab: 2 });
    txt('workflows covered by AI employees · 覆盖的真实流程', W / 2, 726, { size: 22, fam: F.zh, w: 700, align: 'center', c: C.cyan, a: ga * nq });
    txt('snapshot 2026-11-25 · one cell per workflow', W / 2, 762, { size: 17, fam: F.mono, align: 'center', c: C.dim, a: ga * nq });
  }
};

/* ---------- roles: six segmented bars and the radar they make ---------- */
/* cell step CW and bar start BX keep the longest bar (finance, 28 cells, ending at BX + 28 CW - 4) at least 44 px
   clear of its right-aligned count at x 1330, so the poster (bars at 0.82, written at 1280 wide) keeps >= 24 px */
const BX = 620, BY = 250, BH = 86, CW = 20;
function kBars(fills, a, o = {}) {
  ROLES.forEach(([en, zh, done, all], i) => {
    const y = BY + i * BH, f = clamp(fills[i]), ra = a * (o.dimAuto ? 0.55 : 1);
    txt(en, 160, y + 16, { size: 22, fam: F.orb, w: 900, c: C.white, a: a, ls: 1 });
    txt(zh, 160, y + 46, { size: 20, fam: F.zh, w: 700, c: i % 2 ? C.mag : C.cyan, a });
    const col = i % 2 ? C.mag : C.cyan;
    for (let k = 0; k < all; k++) {
      const x = BX + k * CW, auto = k < done, on = auto && k < f * done;
      if (!auto && o.hideGated) continue;
      box(x, y, CW - 4, 44, auto ? col : C.dim, ra * (auto ? 1 : 0.8), 1.1);
      if (on) fillBox(x + 2, y + 2, CW - 8, 40, rgba(col, 0.8), ra);
    }
    const shown = Math.round(f * done);
    if (!o.hideFrac) {
      txt(`${shown} / ${all}`, 1330, y + 34, { size: 30, fam: F.disp, w: 700, align: 'right', c: C.white, a: a * clamp(f * 3) });
      txt(`${pct(shown, all)} %`, 1440, y + 34, { size: 20, fam: F.mono, w: 700, align: 'right', c: C.dim, a: a * clamp(f * 3) });
    }
  });
}
function kRadar(cx, cy, r, fills, a) {
  if (a <= 0.003) return;
  const ang = i => -Math.PI / 2 + i / 6 * TAU;
  for (let ring_ = 1; ring_ <= 4; ring_++) {
    ctx.save(); ctx.globalAlpha = a * 0.35; ctx.strokeStyle = C.dim; ctx.lineWidth = 1; ctx.beginPath();
    for (let i = 0; i <= 6; i++) { const t = ang(i % 6), q = r * ring_ / 4; ctx[i ? 'lineTo' : 'moveTo'](cx + q * Math.cos(t), cy + q * Math.sin(t)); }
    ctx.stroke(); ctx.restore();
  }
  ctx.save(); ctx.globalAlpha = a; ctx.beginPath();
  ROLES.forEach(([, , done, all], i) => { const v = clamp(fills[i]) * done / all, t = ang(i); ctx[i ? 'lineTo' : 'moveTo'](cx + r * v * Math.cos(t), cy + r * v * Math.sin(t)); });
  ctx.closePath(); ctx.fillStyle = rgba(C.cyan, 0.22); ctx.fill(); ctx.strokeStyle = C.cyan; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
  ['DONNA', 'COMM.', 'AUTO-X', 'FINANCE', 'HR', 'ADMIN'].forEach((s, i) => {
    const t = ang(i);
    txt(s, cx + (r + 34) * Math.cos(t), cy + (r + 34) * Math.sin(t) + 6, { size: 15, fam: F.mono, w: 700, align: 'center', c: C.white, a });
  });
}
SCENES.roles = S => {
  const u = S.u, a = kFade(S);
  /* each bar fills as the narration names its role; the last names come close together, hence 0.8 s fills */
  const fills = [
    Q(S, 0, 'Concierge Donna', 0.8),
    Q(S, 0, 'plus Community', 0.8),
    Q(S, 0, 'Social Auto-X', 0.8),
    Q(S, 0, 'Finance', 0.8),
    Q(S, 0, 'HR, and Admin', 0.8),
    Q(S, 0, 'and Admin', 0.8)
  ];
  txt('SIX ROLES · WORKFLOWS COVERED · 六个岗位的覆盖', 160, 205, { size: 20, fam: F.zh, w: 700, c: C.cyan, a: a * at(S, 0, 0.5, -0.2), ls: 2 });
  kBars(fills, a);
  /* what each role carries, shown as the narration names the role: a compact sub-label under its Chinese name, in the
     role's colour (baseline at row + 68, glyph bottom <= row + 72, so >= 12 px clear of the next row at row + 86; the
     widest, 415 px from x 160, stays >= 40 px clear of the bars at BX) */
  const notes = [
    [0, Q(S, 0, "Flower Town's Blossom", 0.5), '+ Blossom · Flower Town · 小花照看花店'],
    [2, Q(S, 0, 'Social Auto-X', 0.5), '+ Community · countdown Dec 4 → 17 · 十三天倒计时'],
    [3, Q(S, 0, 'Finance', 0.5), '+ reconciles the demo ledger · 核对演示账本'],
    [5, Q(S, 0, 'and Admin', 0.5), '+ HR · keep templates moving · 维护流程模板']
  ];
  notes.forEach(([i, p, s]) => txt(s, 160, BY + i * BH + 68, { size: 14, fam: F.zh, w: 700, c: i % 2 ? C.mag : C.cyan, a: a * p, ls: 1 }));
  kRadar(1665, 470, 165, fills, a * at(S, 0, 0.6, 0.6));
  txt('coverage by role · computed from the counts', 1665, 700, { size: 15, fam: F.mono, align: 'center', c: C.dim, a: a * at(S, 0, 0.6, 0.6) });
  const tot = Math.round(fills.reduce((s, f, i) => s + clamp(f) * ROLES[i][2], 0));
  txt(`${tot} / ${ALL}`, 1665, 770, { size: 44, fam: F.disp, w: 700, align: 'center', c: C.white, a: a * at(S, 0, 0.6, 0.6) });
  txt('snapshot 2026-11-25', 1665, 806, { size: 15, fam: F.mono, align: 'center', c: C.dim, a: a * at(S, 0, 0.6, 0.6) });
};

/* ---------- boundary: twenty workflows behind the human gate; an employee you can hire ---------- */
SCENES.boundary = S => {
  const u = S.u, a = kFade(S);
  const L1 = lineAt(S, 1), end = clamp((u - L1.e - 0.3) / 0.7);
  /* the bars and the gate leave completely (0.5 s → 0.1 s before line 1) before the employee card comes in
     (from 0.05 s before line 1): the two are never on screen together */
  const ba = a * (1 - at(S, 1, 0.4, -0.5));
  kBars([1, 1, 1, 1, 1, 1], ba, { hideGated: true, hideFrac: true });
  /* the gated cells leave the bars and line up behind the gate */
  const mv = clamp((u - phraseAt(S, 0, 'the remaining twenty workflows')) / 1.6);
  const GX = 1400, gq = Q(S, 0, 'behind human gates', 0.5);
  let g = 0;
  ROLES.forEach(([, , done, all], i) => {
    for (let k = done; k < all; k++, g++) {
      const sx = BX + k * CW, sy = BY + i * BH, tx = GX + 50 + (g % 4) * 64, ty = 270 + Math.floor(g / 4) * 64;
      const t = eo(clamp(mv * 1.6 - g * 0.03));
      const x = lerp(sx, tx, t), y = lerp(sy, ty, t), w = lerp(CW - 4, 54, t), h = lerp(44, 54, t);
      box(x, y, w, h, t > 0.95 && gq > 0 ? C.now : C.dim, ba, 1.4, t > 0.95 && gq > 0 ? rgba(C.now, 0.14) : null);
    }
  });
  if (gq > 0) {
    fillBox(GX - 6, 240, 12, 360, C.now, ba * gq);
    for (let i = 0; i < 7; i++) line(GX - 34, 254 + i * 54, GX + 34, 254 + i * 54, C.now, ba * gq * 0.6, 2);
    txt('GATES & ROADMAP · 闸门与路线图', GX + 175, 230, { size: 22, fam: F.zh, w: 900, align: 'center', c: C.now, a: ba * gq, ls: 2 });
  }
  txt(`${GATED}`, GX + 175, 670, { size: 64, fam: F.disp, w: 700, align: 'center', c: C.now, a: ba * Q(S, 0, 'stay behind human gates', 0.5) });
  txt('held behind gates or roadmap · 留守闸门或路线图', GX + 175, 706, { size: 18, fam: F.zh, w: 700, align: 'center', c: C.white, a: ba * Q(S, 0, 'stay behind human gates', 0.5) });
  let gx = BX;
  [[Q(S, 0, 'money out', 0.5), 'MONEY OUT · 资金划转'], [Q(S, 0, 'contracts signed', 0.5), 'CONTRACTS SIGNED · 合同签署'], [Q(S, 0, 'off-script press claims', 0.5), 'OFF-SCRIPT PRESS · 库外媒体表态']].forEach(([p, s]) => {
    kTag(s, gx, 806, C.now, ba * p, 16);
    gx += tw(s, 16, kFam(s), 700, 2) + 26 + 22;
  });
  /* line 1: the employee badge */
  const eq = Q(S, 1, 'Honest boundaries', 0.6, -0.05) * (1 - end);
  if (eq > 0) {
    const x = W / 2 - 400, y = 250 + 30 * (1 - eo(eq));
    panel(x, y, 800, 430, a * eq, C.cyan, 'AI EMPLOYEE · 可雇佣的 AI 员工');
    txt('77', x + 40, y + 150, { size: 96, fam: F.disp, w: 700, c: C.cyan, a: a * eq });
    txt('workflows automated · 已打通', x + 190, y + 120, { size: 24, fam: F.zh, w: 700, c: C.white, a: a * eq });
    txt('dated · sourced · auditable', x + 190, y + 152, { size: 18, fam: F.mono, c: C.dim, a: a * eq });
    txt('20', x + 40, y + 280, { size: 96, fam: F.disp, w: 700, c: C.now, a: a * eq });
    txt('human gates / roadmap · 人工闸门与路线图', x + 190, y + 250, { size: 24, fam: F.zh, w: 700, c: C.white, a: a * eq });
    txt('boundaries published, not hidden', x + 190, y + 282, { size: 18, fam: F.mono, c: C.dim, a: a * eq });
    stamp('HIREABLE', x + 400, y + 375, Q(S, 1, 'an employee you can actually hire', 0.45), C.cyan, 40, -0.05);
  }
  kEnd(S, L1.e + 0.3);
};

/* ---------- poster: the six bars, the radar and the gate ---------- */
FILM.poster = () => {
  const si = 1, sc = TL.scenes[si], t = sc.start + 12;
  background(t, sc, si, 12);
  ctx.save(); ctx.translate(0, 230); ctx.scale(0.82, 0.82); ctx.translate(40, -40);
  kBars([1, 1, 1, 1, 1, 1], 1);
  ctx.restore();
  kRadar(1560, 640, 150, [1, 1, 1, 1, 1, 1], 1);
  txt('六位 AI 员工值守一场发布会', W / 2, 190, { size: 80, fam: F.zh, w: 900, align: 'center', c: C.white, ab: 4 });
  txt('SIX AI EMPLOYEES RUN A LAUNCH', W / 2, 270, { size: 46, fam: F.orb, w: 900, align: 'center', c: C.white, ab: 3, ls: 6 });
  txt('77 / 97 workflows · 20 gated or roadmap · snapshot 2026-11-25', W / 2, 330, { size: 24, fam: F.mono, w: 700, align: 'center', c: C.cyan, ls: 1 });
  bloom(0.5);
  txt(`${DATA.book.code} · ${DATA.book.title.zh} · ${DATA.book.title.en}`, W / 2, 1000, { size: 22, fam: F.zh, w: 700, align: 'center', c: C.dim });
  hud(t, Math.round(t * FPS), si, sc);
  post(3);
};
