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

FILM.polarity.hook = 'daylight';
FILM.polarity.invitation = 'daylight';
SCENES.hook = S => {
  statusTag(145, 147, 'argued', 'STANCE · 立场', 1, 'daylight');
  typeLine('Who chooses the cut?', 140, 310, 87, paper.ink);
  const selected = at(S, 0, 2.0, 0.6);
  for (let i = 0; i < 100; i++) {
    const x = 149 + i % 25 * 43, y = 405 + Math.floor(i / 25) * 48;
    const col = i === 38 ? paper.amber : paper.dim;
    fillBox(x, y, 32, 32, col, i === 38 ? selected : 0.15 + 0.32 * (1 - selected));
    if (i === 38) box(x - 4, y - 4, 40, 40, col, selected, 3);
  }
  typeLine('100 cuts', 1300, 465, 59, paper.ink);
  typeLine('1 release decision', 1302, 538, 37, paper.dim);
  line(145, 656, 1770, 656, paper.edge, 1, 2);
  typeLine('4 bilingual books', 145, 755, 45, paper.ink, { a: at(S, 1, 0.6) });
  typeLine('6 films   /   1 flagship + 5 shorts', 821, 755, 45, paper.ink, { a: at(S, 1, 0.6) });
  slate(S, 'CHRONOAI PTE. LTD.');
};
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
  const u = S.u, a = sinceStart(S, 0, 0.45);
  statusTag(140, 133, 'argued', 'ANALOGY · 类比', a);
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
  slate(S, 'CHRONOAI PTE. LTD.');
};


SCENES.northstar = S => {
  typeLine('Erase one claim.', 140, 218, 76, space.ink);
  typeLine('Can the others recover it?', 145, 320, 52, space.ink);
  const erased = at(S, 0, 1.3, 1);
  for (let i = 0; i < 3; i++) {
    const x = 150 + i * 220;
    box(x, 414, 167, 100, space.accent, i === 2 ? 1 - 0.55 * erased : 1, 2);
    typeLine(['A', 'B', 'A ∧ B'][i], x + 84, 480, 43, space.ink, { align: 'center', fam: F.math, a: i === 2 ? 1 - 0.75 * erased : 1 });
  }
  typeLine('Same distinctions after erasure', 146, 593, 39, space.accent);
  line(920, 176, 920, 624, space.dim, 0.55, 2);
  const a = at(S, 1, 0.7);
  typeLine('The Omega Institute', 1020, 294, 48, space.ink, { a });
  typeLine('Independent research', 1023, 357, 31, space.dim, { a });
  typeLine('223,231+', 1013, 507, 103, space.ink, { a });
  typeLine('frozen Lean 4 theorems', 1023, 584, 40, space.accent, { a });
  leanList(145, 771, 1, { size: 23 });
  slate(S, 'TRURETURING @548388cd  /  2026-11-27');
};
SCENES.invitation = S => {
  typeLine('Take a seat.', 140, 236, 84, paper.ink);
  typeLine('December 17, 2026   /   16:00 SGT', 145, 327, 40, paper.dim);
  const cards = [['1,108', 'seats', '4 stands × 8 rows'], ['18', 'basket mats', 'along the map wall'], ['9', 'AI employee roles', '102 / 120 workflows']];
  cards.forEach(([value, noun, detail], i) => {
    const x = 145 + i * 546;
    glassCard(x, 404, 510, 294);
    typeLine(value, x + 28, 508, 78, paper.ink);
    typeLine(noun, x + 32, 582, 42, paper.ink);
    typeLine(detail, x + 32, 649, 29, paper.dim);
  });
  typeLine('contact@chrono-ai.fun', 145, 802, 38, paper.ink, { fam: F.mono });
  slate(S, 'CHRONOAI PTE. LTD.');
};

FILM.poster = () => {
  drawPolarityBackground('daylight', 0);
  drawPolarityBackground('deep-space', 0.6, 960, W);
  typeLine('ChronoAI Pte. Ltd.', 88, 125, 26, paper.dim);
  line(88, 170, 872, 170, paper.edge, 1, 2);
  typeLine('Build for What', 88, 380, 76, paper.ink);
  typeLine('Comes Next', 88, 476, 76, paper.ink);
  typeLine('面向未来的造物', 88, 660, 46, paper.ink, { fam: F.zh });
  typeLine('December 17, 2026  /  16:00 SGT', 88, 735, 27, paper.dim);
  line(88, 902, 872, 902, paper.edge, 1, 2);
  typeLine('VIRTUAL LAUNCH  /  2026', 88, 960, 24, paper.dim, { fam: F.mono });
  kEngine(1440, 404, 155, 1.2, space.accent, 1);
  statusTag(1092, 166, 'argued', 'ANALOGY · 类比', 1, 'deep-space');
  LAYERS.forEach(([name], i) => {
    const x = 1118 + 15 * i, y = 805 - i * 48;
    box(x, y, 586 - 30 * i, 37, space.dim, 0.85, 1.5);
    typeLine(name, 1411, y + 27, 23, space.ink, { align: 'center' });
  });
};
