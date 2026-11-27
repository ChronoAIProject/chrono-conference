/* Film · From a Flower Basket to a Seat · 从一束花到一个席位 (book launch-keynote, chapter 4, the living venue).
   Scenes for theme/film/engine.js, every frame a pure function of S.u. Where every figure comes from:
     Street Corner: six concentric rings of 96 + 144 + 176 + 204 + 232 + 256 = 1,108 seats under an atomic booking lock,
       guest 1,109 onward routed to the live stream (launch-keynote viz/launch-arena; chapter 4);
     concierge Donna: a 30-question verified press bank, off-bank questions escalated to contact@chrono-ai.fun
       (ai-employee-operations chapters 2 and 4); Flower Town: Blossom and 18 numbered flower-basket stands;
     the keynote: 2026-12-17, 16:00 SGT (launch-keynote appendix A).
   The seats are drawn one by one and booked in a fixed order, each exactly once; FILM.init checks the ring sum and that
   the booking order never repeats a seat, and reports a page error otherwise. No Lean citations: film.json "lean" is
   empty, and nothing is drawn in green. */
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
/* opening title, decoding in during the lead and gone as the narration starts */
function kTitle(S) {
  const u = S.u, L0 = lineAt(S, 0), ta = clamp(u / 0.4) * (1 - clamp((u - L0.s + 0.1) / 0.6));
  if (ta <= 0.003) return;
  const p = clamp(u / 1.3);
  txt(`${DATA.book.code} · FILM`, W / 2, 380, { size: 26, fam: F.mono, w: 700, align: 'center', c: C.cyan, a: ta, ls: 10 });
  txt(DATA.film.title_zh, W / 2, 515, { size: 112, fam: F.zh, w: 900, align: 'center', c: C.white, a: ta * clamp(p * 1.6), ab: 4 });
  txt(scramble(DATA.film.title.toUpperCase(), p, 3), W / 2, 610, { size: 50, fam: F.orb, w: 900, align: 'center', c: C.white, a: ta, ls: 8, ab: 2 });
}
/* end card over a dark veil: book code, film titles, Lean citations (if any), the one public address */
function kEnd(S, from, o = {}) {
  const a = clamp((S.u - from) / 0.7) * clamp((S.d - S.u) / 0.9);
  if (a <= 0.003) return;
  fillBox(0, 0, W, H, C.bg, 0.72 * clamp((S.u - from) / 0.7));
  const cx = o.x || W / 2, cy = o.y || 400, b = DATA.book, f = DATA.film;
  drawHyper(CUBE4, [[0, 3, S.t * 0.21], [1, 2, S.t * 0.13], [2, 3, S.t * 0.17]], { scale: 1.15, a: 0.3 * a, cx, cy: cy - 20, camZ: 7, lw: 1.4, dots: false });
  txt(`${b.code} · FILM`, cx, cy - 92, { size: 24, fam: F.mono, w: 700, align: 'center', c: C.cyan, a, ls: 10 });
  txt(f.title_zh, cx, cy, { size: 88, fam: F.zh, w: 900, align: 'center', c: C.white, a, ab: 3 });
  txt(f.title.toUpperCase(), cx, cy + 74, { size: 40, fam: F.orb, w: 900, align: 'center', c: C.white, a: a * 0.94, ls: 5 });
  const p2 = clamp((S.u - from - 0.35) / 0.6) * a;
  txt(`${b.title.zh} · ${b.title.en}`, cx, cy + 132, { size: 24, fam: F.zh, w: 700, align: 'center', c: C.mag, a: p2 });
  let y = cy + 205;
  if (DATA.lean.length) y = leanList(cx, y, p2, { align: 'center', size: 21, gap: 40 });
  const p3 = clamp((S.u - from - 0.6) / 0.6) * a;
  txt('ChronoAI  ·  chrono-ai.fun  ·  contact@chrono-ai.fun', cx, y + 14, { size: 28, fam: F.mono, w: 700, align: 'center', c: C.cyan, a: p3, ls: 1 });
  const pin = DATA.pin || {};
  if (pin.commit && DATA.lean.length) txt(`github.com/${pin.repo} @ ${pin.commit.slice(0, 12)}`, cx, y + 52, { size: 18, fam: F.mono, align: 'center', c: C.dim, a: p3 });
}

Object.assign(FILM.speed, { arrival: 0.02, seats: 0.012, flowers: 0.018 });

/* ---------- the lobby in 3D wireframe (x right, y down, z away from the camera) ---------- */
function kP(p, c) {
  let q = [p[0] - c.x, p[1] - c.y, p[2] - c.z];
  q = rotY(q, c.yaw); q = rotX(q, c.pitch);
  return proj(q, c.cx, c.cy, c.fov, c.dist);
}
function kSeg(a, b, c, col, al, lw = 1.5) { const p = kP(a, c), q = kP(b, c); line(p[0], p[1], q[0], q[1], col, al, lw); }
function kBoxW(x, y, z, w, h, d, c, col, al) {
  const P = [[0, 0, 0], [w, 0, 0], [w, 0, d], [0, 0, d], [0, h, 0], [w, h, 0], [w, h, d], [0, h, d]].map(v => [x + v[0], y + v[1], z + v[2]]);
  [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(([i, j]) => kSeg(P[i], P[j], c, col, al, 2));
}
const DESK = [-3.9, 0.45, -0.6], STAD = [2.7, 1, -0.2];
function kLobby(c, a, u) {
  if (a <= 0.003) return;
  for (let x = -7; x <= 7; x++) kSeg([x, 1, -4.5], [x, 1, 4.5], c, C.mag, a * 0.22, 1);
  for (let z = -4.5; z <= 4.5; z += 1) kSeg([-7, 1, z], [7, 1, z], c, C.mag, a * 0.22, 1);
  /* the theater: six rising half rings behind the desk side of the square */
  for (let i = 0; i < 6; i++) {
    const r = 1.0 + 0.42 * i, y = 1 - 0.13 * i, n = 40, pts = [];
    for (let k = 0; k <= n; k++) { const t = Math.PI * k / n; pts.push(kP([STAD[0] + r * Math.cos(t), y, STAD[2] + r * Math.sin(t)], c)); }
    ctx.globalAlpha = a * 0.85; ctx.strokeStyle = C.cyan; ctx.lineWidth = 2; ctx.beginPath();
    pts.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.globalAlpha = 1;
  }
  kSeg([STAD[0] - 0.8, 0.98, STAD[2] - 0.35], [STAD[0] + 0.8, 0.98, STAD[2] - 0.35], c, C.white, a, 3);
  /* the reception desk, Donna behind it */
  kBoxW(DESK[0] - 0.8, DESK[1], DESK[2], 1.6, 0.55, 0.6, c, C.white, a * 0.9);
  const dn = kP([DESK[0], DESK[1] - 0.55, DESK[2] + 0.9], c);
  dot(dn[0], dn[1], 16 + 2 * Math.sin(u * 3), 'm', a);
  /* Flower Town: 18 stands along the promenade at the front */
  for (let i = 0; i < 18; i++) {
    const x = -6.4 + i * 0.33, b0 = kP([x, 1, -3.4], c), b1 = kP([x, 0.55, -3.4], c);
    line(b0[0], b0[1], b1[0], b1[1], C.vio, a * 0.9, 2);
    dot(b1[0], b1[1], 6, i % 3 ? 'v' : 'm', a);
  }
}
function kLobbyLabel(c, p, s, col, a, dy = -26) {
  if (a <= 0.003) return;
  const q = kP(p, c);
  txt(s, q[0], q[1] + dy, { size: 20, fam: kFam(s), w: 700, align: 'center', c: col, a, ls: 1 });
}
function kStrike(s, x, y, a, sp) {
  if (a <= 0.003) return;
  const w = tw(s, 24, F.mono, 700, 2) + 40;
  box(x - w / 2, y - 30, w, 46, C.dim, a, 1.4, rgba(C.bg, 0.55));
  txt(s, x, y + 2, { size: 24, fam: F.mono, w: 700, align: 'center', c: C.dim, a, ls: 2 });
  if (sp > 0) line(x - w / 2 - 6, y - 7, x - w / 2 - 6 + (w + 12) * eo(sp), y - 7, C.mag, a, 4);
}
SCENES.arrival = S => {
  const u = S.u, a = kFade(S);
  kTitle(S);
  const la = a * at(S, 0, 1.0, 0.1);
  const push = ease(at(S, 1, 2.2, -0.2));
  const c = { x: lerp(0, -2.6, push), y: lerp(0, 0.2, push), z: lerp(0, -0.4, push), yaw: -0.32 + 0.035 * u - 0.25 * push, pitch: lerp(0.46, 0.4, push), fov: lerp(1280, 1800, push), dist: 12, cx: W / 2, cy: lerp(540, 590, push) };
  if (la > 0.003) grid(S.t, 0.35 * la, H * 0.7, C.mag, 0.25);
  kLobby(c, la, u);
  kLobbyLabel(c, [STAD[0], STAD[1] - 1.1, STAD[2] + 2.6], 'SIX RINGS · 1,108 SEATS', C.cyan, la * (1 - push));
  kLobbyLabel(c, [-4.6, 0.3, -3.4], 'FLOWER TOWN · 花店', C.vio, la * (1 - push), 0);
  kLobbyLabel(c, [DESK[0], DESK[1] - 1.1, DESK[2] + 0.9], 'DONNA · 礼宾', C.mag, la);
  /* line 0: what this venue is not, and what it is */
  const o0 = a * (1 - at(S, 1, 0.6, -0.1));
  kStrike('STUDIO CAMERA', 560, 236, o0 * Q(S, 0, 'no studio camera', 0.4), Q(S, 0, 'no studio camera', 0.5, 0.45));
  kStrike('RENTED BALLROOM', 1010, 236, o0 * Q(S, 0, 'no rented ballroom', 0.4), Q(S, 0, 'no rented ballroom', 0.5, 0.45));
  const lv = Q(S, 0, 'a living three-dimensional lobby', 0.5);
  if (lv > 0) chip(1450, 228, 330, 48, 'LIVE 3D LOBBY · 实时三维', C.cyan, o0 * lv, 22, F.zh);
  txt('street-corner · view=extended', 1450, 284, { size: 18, fam: F.mono, align: 'center', c: C.dim, a: o0 * lv });
  /* line 1: the press bank beside the desk; every visitor is checked against it */
  const bk = a * Q(S, 1, 'thirty-question verified press bank', 0.6);
  const vis = Q(S, 1, 'greets every visitor', 0.4);
  const dq = kP([DESK[0], DESK[1], DESK[2]], c);
  for (let i = 0; i < 7; i++) {
    const t = clamp((u - phraseAt(S, 1, 'greets every visitor') - i * 0.55) / 1.4);
    if (t <= 0 || t >= 1) continue;
    const from = [DESK[0] + 3.2 - i * 0.2, 1, DESK[2] - 2.6], to = [DESK[0] + 0.2, 1, DESK[2] - 0.35];
    const q = kP([lerp(from[0], to[0], eo(t)), 0.9, lerp(from[2], to[2], eo(t))], c);
    dot(q[0], q[1], 10, 'w', a * vis * Math.min(1, (1 - t) * 6));
  }
  if (bk > 0.003) {
    const x0 = 1250, y0 = 300, cw = 92, ch = 62;
    panel(x0 - 24, y0 - 70, 6 * cw + 36, 5 * ch + 150, bk, C.cyan, 'VERIFIED PRESS BANK · 核验问答库');
    const hit = Math.floor(Math.max(0, u - phraseAt(S, 1, 'thirty-question verified press bank')) / 0.4);
    for (let k = 0; k < 30; k++) {
      const p = clamp((u - phraseAt(S, 1, 'thirty-question verified press bank') - k * 0.03) / 0.3);
      const x = x0 + (k % 6) * cw, y = y0 + Math.floor(k / 6) * ch, on = (hit * 7) % 30 === k;
      box(x, y - 10, cw - 10, ch - 12, on ? C.white : C.cyan, bk * p * (on ? 1 : 0.6), on ? 2.2 : 1.2, on ? rgba(C.cyan, 0.25) : rgba(C.bg, 0.6));
      txt(`Q${String(k + 1).padStart(2, '0')}`, x + (cw - 10) / 2, y + 30, { size: 20, fam: F.mono, w: 700, align: 'center', c: on ? C.white : C.cyan, a: bk * p });
    }
    txt('30 / 30 answers carry a date and a source', x0, y0 + 5 * ch + 22, { size: 17, fam: F.mono, c: C.white, a: bk });
    txt('off-bank → contact@chrono-ai.fun', x0, y0 + 5 * ch + 50, { size: 17, fam: F.mono, c: C.dim, a: bk });
    line(dq[0] + 40, dq[1] - 30, x0 - 26, y0 + 120, C.cyan, bk * 0.5, 1.5);
  }
};

/* ---------- seats: six rings, 1,108 seats, booked one by one, each exactly once ---------- */
const RINGS = [96, 144, 176, 204, 232, 256], SEATS = RINGS.reduce((s, n) => s + n, 0);
const SCX = 1080, SCY = 792, R0 = 178, DR = 58, TH0 = Math.PI + 0.1, TH1 = 2 * Math.PI - 0.1;
let SEAT = null, ORDER = null;
FILM.init.push(() => {
  SEAT = []; ORDER = [];
  RINGS.forEach((n, i) => {
    const base = SEAT.length;
    for (let j = 0; j < n; j++) { const th = TH0 + (j + 0.5) / n * (TH1 - TH0), r = R0 + i * DR; SEAT.push({ i, x: SCX + r * Math.cos(th), y: SCY + r * Math.sin(th) }); }
    for (let k = 0; k < n; k++) ORDER.push(base + (k * 37) % n);  /* 37 is prime to every ring size: a permutation */
  });
  if (SEATS !== 1108) window.FILM_ERRORS.push(`seat rings sum to ${SEATS}, not 1,108`);
  if (new Set(ORDER).size !== SEATS) window.FILM_ERRORS.push('the booking order repeats a seat');
});
function kStadium(rings, booked, hotN, a) {
  if (a <= 0.003 || !SEAT) return;
  const rank = new Int32Array(SEATS).fill(SEATS);
  for (let k = 0; k < booked; k++) rank[ORDER[k]] = k;
  for (let i = 0; i < 6; i++) {
    const ra = a * clamp(rings[i]);
    if (ra <= 0.003) continue;
    ctx.globalAlpha = ra * 0.35; ctx.strokeStyle = C.cyan; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(SCX, SCY, R0 + i * DR + 22, TH0, TH1); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  const pass = (pred, col, r, al) => {
    ctx.globalAlpha = al; ctx.fillStyle = col; ctx.beginPath();
    for (let s = 0; s < SEATS; s++) if (pred(s)) { const z = SEAT[s]; ctx.moveTo(z.x + r, z.y); ctx.arc(z.x, z.y, r, 0, TAU); }
    ctx.fill(); ctx.globalAlpha = 1;
  };
  pass(s => rank[s] === SEATS && clamp(rings[SEAT[s].i]) > 0, C.dim, 2.3, a * 0.7);
  pass(s => rank[s] < booked - hotN, C.cyan, 2.6, a);
  pass(s => rank[s] < booked && rank[s] >= booked - hotN, C.now, 3.4, a);
  fillBox(SCX - 140, SCY + 8, 280, 10, C.white, a * 0.8);
  txt('STAGE · 舞台', SCX, SCY + 42, { size: 18, fam: F.zh, w: 700, align: 'center', c: C.white, a: a * 0.8 });
}
function kLock(x, y, s, col, a, open = 0) {
  if (a <= 0.003) return;
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(x, y - 12 * s - 10 * s * open, 12 * s, Math.PI, 0); ctx.stroke();
  ctx.strokeRect(x - 17 * s, y - 12 * s, 34 * s, 26 * s); ctx.restore();
}
SCENES.seats = S => {
  const u = S.u, a = kFade(S);
  const rp = phraseAt(S, 0, 'six concentric theater rings');
  const rings = RINGS.map((_, i) => (u - rp - i * 0.2) / 0.3);
  const tA = phraseAt(S, 0, 'protected by an atomic booking lock'), tB = phraseAt(S, 1, 'When the theater fills') + 0.5;
  const booked = Math.round(SEATS * ease(clamp((u - tA) / (tB - tA))));
  kStadium(rings, booked, booked < SEATS ? 12 : 0, a);
  /* Donna's desk, the seats "behind her" */
  fillBox(170, 742, 230, 46, rgba(C.mag, 0.18), a); box(170, 742, 230, 46, C.mag, a, 1.6);
  dot(285, 716, 15, 'm', a);
  txt('DONNA · 礼宾', 285, 818, { size: 20, fam: F.zh, w: 700, align: 'center', c: C.mag, a });
  /* the count */
  const ca = a * Q(S, 0, 'exactly one thousand one hundred eight seats', 0.5);
  txt(RINGS.join(' + ') + ' = ' + kNum(SEATS), SCX, 270, { size: 30, fam: F.mono, w: 700, align: 'center', c: C.white, a: ca, ab: 1 });
  txt('six concentric rings · 六圈同心席位 · drawn here, one dot per seat', SCX, 305, { size: 17, fam: F.zh, c: C.dim, align: 'center', a: ca });
  const la = a * Q(S, 0, 'protected by an atomic booking lock', 0.5);
  if (la > 0.003) {
    panel(150, 300, 360, 380, la, C.cyan, 'ATOMIC BOOKING LOCK');
    kLock(220, 400, 1.3, booked >= SEATS ? C.cyan : C.now, la);
    txt(kNum(booked), 270, 410, { size: 54, fam: F.orb, w: 900, c: C.white, a: la });
    txt('/ 1,108 booked · 已锁定', 180, 460, { size: 20, fam: F.zh, w: 700, c: C.cyan, a: la });
    txt('DUPLICATE SEATS', 180, 530, { size: 18, fam: F.mono, w: 700, c: C.dim, a: la, ls: 2 });
    txt('0', 180, 592, { size: 60, fam: F.disp, w: 700, c: C.cyan, a: la });
    txt('撞座 · one seat, one guest', 230, 588, { size: 18, fam: F.zh, c: C.dim, a: la });
    /* the booked count and the zero above are computed by this film, not read from the live venue */
    kTag('SCHEMATIC · 示意', 180, 652, C.dim, la);
  }
  /* line 1: full; guest 1,109 and the next ones flow to the live stream */
  stamp('FULL · 1,108 / 1,108', SCX, 560, Q(S, 1, 'When the theater fills', 0.45), C.cyan, 46, -0.06);
  const pa = a * Q(S, 1, 'flows seamlessly to the live stream', 0.6, -0.6);
  if (pa > 0.003) {
    panel(1600, 360, 220, 220, pa, C.mag, 'LIVE STREAM');
    ctx.save(); ctx.globalAlpha = pa; ctx.fillStyle = C.mag; ctx.beginPath(); ctx.moveTo(1688, 438); ctx.lineTo(1740, 470); ctx.lineTo(1688, 502); ctx.closePath(); ctx.fill(); ctx.restore();
    txt('直播流', 1710, 545, { size: 22, fam: F.zh, w: 700, align: 'center', c: C.white, a: pa });
    txt('YouTube · LinkedIn Live', 1710, 610, { size: 16, fam: F.mono, align: 'center', c: C.dim, a: pa });
  }
  const g0 = phraseAt(S, 1, 'guest one thousand one hundred nine');
  for (let i = 0; i < 6; i++) {
    const t = clamp((u - g0 - i * 0.45) / 1.8);
    if (t <= 0 || t >= 1) continue;
    const s = eo(t), x = (1 - s) * (1 - s) * 240 + 2 * (1 - s) * s * 1180 + s * s * 1640, y = (1 - s) * (1 - s) * 650 + 2 * (1 - s) * s * 860 + s * s * 470;
    dot(x, y, i ? 9 : 14, i ? 'm' : 'w', a * Math.min(1, (1 - t) * 8));
    if (!i) txt('#1,109', x, y - 24, { size: 22, fam: F.mono, w: 700, align: 'center', c: C.white, a: a * Math.min(1, (1 - t) * 8) });
  }
};

/* ---------- flowers: 18 numbered stands; a bouquet, a card, a basket on its stand ---------- */
const STAND_X = i => 250 + i * 84, STAND_Y = 700, PICK = 6;
function kBasket(x, y, s, a) {
  if (a <= 0.003) return;
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = C.white; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(x - 24 * s, y - 10 * s); ctx.lineTo(x - 17 * s, y + 16 * s); ctx.lineTo(x + 17 * s, y + 16 * s); ctx.lineTo(x + 24 * s, y - 10 * s); ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y - 10 * s, 24 * s, Math.PI, 0); ctx.stroke(); ctx.restore();
  [[-14, -18, 'm'], [0, -26, 'w'], [14, -18, 'v'], [-6, -12, 'm'], [8, -11, 'c']].forEach(([dx, dy, k]) => dot(x + dx * s, y + dy * s, 11 * s, k, a));
}
SCENES.flowers = S => {
  const u = S.u, a = kFade(S);
  const L1 = lineAt(S, 1);
  const end = clamp((u - L1.e - 0.3) / 0.7);
  const sa = a * (1 - 0.75 * end);
  const big = 1 - ease(at(S, 1, 0.8, -0.3));
  const fs = lerp(30, 76, big), fw = tw('FLOWER TOWN · 花店', fs, F.zh, 900, 3);
  txt('FLOWER TOWN · 花店', lerp(250, W / 2 - fw / 2, big), lerp(238, 430, big), { size: fs, fam: F.zh, w: 900, c: C.vio, a: sa * at(S, 0, 0.5, -0.2), ls: 3, ab: 2 * big });
  txt('18 numbered flower-basket stands · 十八座编号花篮展台', W / 2, 500, { size: 24, fam: F.zh, w: 700, align: 'center', c: C.white, a: sa * big * Q(S, 0, 'eighteen numbered flower-basket stands', 0.5) });
  line(200, STAND_Y + 70, 1730, STAND_Y + 70, C.vio, sa * 0.6, 2);
  txt('PROMENADE · 会场长廊', 1730, STAND_Y + 100, { size: 16, fam: F.zh, w: 700, align: 'right', c: C.dim, a: sa });
  /* Blossom walks the row; each stand she passes is tended */
  const bt = phraseAt(S, 0, 'Blossom tends eighteen numbered'), walk = clamp((u - bt) / 3.2);
  for (let i = 0; i < 18; i++) {
    const x = STAND_X(i), appear = at(S, 0, 0.4, i * 0.05), tended = walk * 17 >= i && u > bt;
    const pick = i === PICK && Q(S, 1, 'Pick a bouquet', 0.4) > 0;
    const col = pick ? C.now : tended ? C.cyan : C.dim;
    box(x - 28, STAND_Y, 56, 52, col, sa * appear, pick ? 2.6 : 1.4, pick ? rgba(C.now, 0.15) : rgba(C.bg, 0.6));
    line(x, STAND_Y, x, STAND_Y - 60, col, sa * appear, 2);
    txt(String(i + 1).padStart(2, '0'), x, STAND_Y + 36, { size: 22, fam: F.mono, w: 700, align: 'center', c: col, a: sa * appear });
  }
  if (u > bt) {
    const bx = lerp(STAND_X(0), STAND_X(17), ease(walk)), by = STAND_Y - 118 + 6 * Math.sin(u * 6);
    dot(bx, by, 17, 'v', sa); ring(bx, by, 26, C.vio, sa * 0.7, 2);
    txt('BLOSSOM · 小花', bx, by - 40, { size: 20, fam: F.zh, w: 700, align: 'center', c: C.vio, a: sa });
    txt(`${Math.min(18, Math.floor(walk * 17) + 1)} / 18 stands tended`, 1730, 238, { size: 20, fam: F.mono, w: 700, align: 'right', c: C.cyan, a: sa * clamp(walk * 4) });
  }
  /* line 1: the order, step by step, then the basket appears on stand 07 */
  const s1 = Q(S, 1, 'Pick a bouquet', 0.5), s2 = Q(S, 1, 'sign a card', 0.5), s3 = Q(S, 1, 'watch your basket materialize', 0.5);
  if (s1 > 0) {
    panel(420, 300, 340, 220, sa * s1, C.mag, '01 · PICK A BOUQUET');
    kBasket(590, 440, 1.6 * eo(s1), sa * s1);
    txt('选一束花', 590, 500, { size: 22, fam: F.zh, w: 700, align: 'center', c: C.white, a: sa * s1 });
  }
  if (s2 > 0) {
    panel(790, 300, 340, 220, sa * s2, C.mag, '02 · SIGN A CARD');
    /* the card (806–1114) centred in the panel; the message, typed left to right, ends centred with >= 16 px each side */
    box(806, 350, 308, 110, C.white, sa * s2, 1.4, rgba(C.white, 0.06));
    const msg = 'Congratulations on the launch!', mx = 960 - tw(msg, 15, F.mono, 700) / 2;
    txt(typed(msg, clamp((u - phraseAt(S, 1, 'sign a card')) / 1.3)), mx, 396, { size: 15, fam: F.mono, w: 700, c: C.white, a: sa * s2 });
    txt('— a friend', 1920 - mx, 438, { size: 15, fam: F.mono, align: 'right', c: C.dim, a: sa * clamp((s2 - 0.6) * 3) });
    txt('写下贺卡', 960, 500, { size: 22, fam: F.zh, w: 700, align: 'center', c: C.white, a: sa * s2 });
  }
  if (s3 > 0) {
    panel(1160, 300, 340, 220, sa * s3, C.now, '03 · ON STAND 07');
    txt('花篮落座 · stand 07', 1330, 420, { size: 24, fam: F.zh, w: 700, align: 'center', c: C.now, a: sa * s3 });
    const m = clamp((u - phraseAt(S, 1, 'watch your basket materialize')) / 1.4), tx = STAND_X(PICK), ty = STAND_Y - 86;
    for (let k = 0; k < 16; k++) {
      const t = clamp(m * 1.4 - k * 0.025), sx = 1330 + 120 * Math.cos(k * 2.4), sy = 460 + 40 * Math.sin(k * 1.7);
      if (t > 0 && t < 1) dot(lerp(sx, tx, eo(t)), lerp(sy, ty, eo(t)), 7, k % 2 ? 'm' : 'v', sa * (1 - t));
    }
    kBasket(tx, ty, 1.15 * eo(clamp(m * 1.4 - 0.6)), sa * clamp(m * 1.4 - 0.5));
  }
  const kq = Q(S, 1, 'before the keynote begins', 0.5);
  if (kq > 0) {
    const left = 15 * 60 - Math.floor(Math.max(0, u - phraseAt(S, 1, 'before the keynote begins')) * 1);
    const mm = String(Math.floor(left / 60)).padStart(2, '0'), ss = String(left % 60).padStart(2, '0');
    chip(1600, 410, 250, 120, '', C.cyan, sa * kq);
    txt('KEYNOTE 16:00 SGT', 1600, 385, { size: 18, fam: F.mono, w: 700, align: 'center', c: C.cyan, a: sa * kq, ls: 1 });
    txt(`T−00:${mm}:${ss}`, 1600, 440, { size: 34, fam: F.orb, w: 900, align: 'center', c: C.white, a: sa * kq });
  }
  kEnd(S, L1.e + 0.3);
};

/* ---------- poster: the full theater, Donna's desk and the promenade under the title ---------- */
FILM.poster = () => {
  const si = 1, sc = TL.scenes[si], t = sc.start + 11;
  background(t, sc, si, 11);
  ctx.save(); ctx.translate(560, 770); ctx.scale(0.8, 0.8); ctx.translate(-SCX, -SCY);
  kStadium([1, 1, 1, 1, 1, 1], SEATS, 0, 1);
  ctx.restore();
  for (let i = 0; i < 18; i++) {
    const x = 200 + i * 44, y = 900, col = i === PICK ? C.now : C.vio;
    box(x - 15, y, 30, 26, col, 0.95, 1.2, rgba(C.bg, 0.6)); line(x, y, x, y - 26, col, 0.9, 2); dot(x, y - 32, 7, i % 3 ? 'v' : 'm', 1);
  }
  txt('FLOWER TOWN · 18 STANDS', 200, 965, { size: 18, fam: F.mono, w: 700, c: C.vio, ls: 2 });
  txt('从一束花到一个席位', 1380, 330, { size: 88, fam: F.zh, w: 900, align: 'center', c: C.white, ab: 4 });
  txt('FROM A FLOWER BASKET', 1380, 430, { size: 46, fam: F.orb, w: 900, align: 'center', c: C.white, ab: 3, ls: 6 });
  txt('TO A SEAT', 1380, 490, { size: 46, fam: F.orb, w: 900, align: 'center', c: C.white, ab: 3, ls: 6 });
  txt('1,108 SEATS · ATOMIC LOCK · 0 DUPLICATES', 1380, 580, { size: 24, fam: F.mono, w: 700, align: 'center', c: C.cyan, ls: 3 });
  txt('STREET CORNER · DEC 17 · 16:00 SGT', 1380, 625, { size: 22, fam: F.mono, w: 700, align: 'center', c: C.mag, ls: 3 });
  /* the seat count and the zero are the film's own schematic, as on the in-film lock readout */
  const stag = 'SCHEMATIC · 示意';
  kTag(stag, 1380 - (tw(stag, 15, kFam(stag), 700, 2) + 26) / 2, 684, C.dim, 1);
  bloom(0.55);
  txt(`${DATA.book.code} · ${DATA.book.title.zh} · ${DATA.book.title.en}`, 1380, 960, { size: 22, fam: F.zh, w: 700, align: 'center', c: C.dim });
  hud(t, Math.round(t * FPS), si, sc);
  post(3);
};
