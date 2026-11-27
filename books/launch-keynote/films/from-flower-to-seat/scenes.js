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

FILM.polarity.flowers = 'daylight';
FILM.polarity.arrival = 'daylight';

// Plan coordinates (x,z) from nyxid-nyxbot-trials@8efb6587, sheet-v3/seat-catalog.json.
// Within each stand, array indices are the one-based row and seat numbers minus one.
const stands = DATA.data.seatPlan;
const rowTotals = stands.N.map((_, i) =>
  Object.values(stands).reduce((total, rows) => total + rows[i].length, 0));
const standNames = { N: 'North', S: 'South', E: 'East', W: 'West' };
function arena(cx, cy, scale, focus = '', tier = -1) {
  for (const [stand, rows] of Object.entries(stands)) {
    rows.forEach((seats, row) => seats.forEach(([x, z], index) => {
      const code = stand + (row + 1) + '-' + String(index + 1).padStart(2, '0');
      const px = cx + (x - 5.75) * scale, py = cy + (z - 7.75) * scale;
      fillBox(px - 2, py - 2, 4, 4, row === tier ? space.ink : space.accent, tier < 0 || row === tier ? 1 : 0.48);
      if (code === focus) ring(px, py, 10, space.amber, 1, 3);
    }));
  }
  box(cx - 76, cy - 38, 152, 76, space.dim, 0.7, 2);
  typeLine('STAGE', cx, cy + 9, 24, space.ink, { align: 'center' });
  for (const [id, dx, dy] of [['N', 0, -31], ['S', 0, 33], ['W', -31, 0], ['E', 31, 0]]) {
    const total = stands[id].reduce((sum, row) => sum + row.length, 0);
    typeLine(standNames[id] + ' ' + total, cx + dx * scale, cy + dy * scale, 22, space.ink, { align: 'center' });
  }
}
function blossom(x, y, r, col) {
  for (let k = 0; k < 5; k++) {
    const angle = k * TAU / 5 - Math.PI / 2;
    ring(x + r * Math.cos(angle), y + r * Math.sin(angle), r * 0.67, col, 1, 2.4);
  }
}
SCENES.flowers = S => {
  typeLine('Flower Town', 140, 232, 80, paper.ink);
  typeLine('@flowerassis_bot', 145, 297, 34, paper.dim, { fam: F.mono });
  line(148, 395, 1758, 395, paper.dim, 0.8, 3);
  typeLine('WORLD-MAP WALL', 1758, 371, 22, paper.dim, { align: 'right' });
  const fill = ease(at(S, 0, 2.8));
  for (let i = 0; i < 18; i++) {
    const x = 154 + (i % 9) * 180, y = 438 + Math.floor(i / 9) * 165;
    glassCard(x, y, 151, 132);
    blossom(x + 76, y + 54, 17, paper.argued);
    typeLine('basket-' + String(i + 1).padStart(2, '0'), x + 76, y + 107, 20, paper.ink, { align: 'center', fam: F.mono, a: clamp(fill * 20 - i) });
  }
  slate(S, 'STREET CORNER  /  v40');
};
SCENES.seats = S => {
  const inspected = at(S, 2, 0.6);
  const row = inspected > 0 ? Math.min(7, Math.floor((S.u - lineAt(S, 2).s) * 1.3)) : -1;
  const code = at(S, 1, 0.5) ? 'E1-20' : 'N1-17';
  arena(553, 478, 10.4, code, row);
  typeLine('1,108 seats', 1065, 225, 72, space.ink);
  typeLine('@chronoai_frontdesk_bot', 1070, 286, 29, space.accent, { fam: F.mono });
  typeLine('All four stands, by tier', 1070, 380, 34, space.ink);
  rowTotals.forEach((total, i) => {
    const x = 1070 + (i % 4) * 180, y = 470 + Math.floor(i / 4) * 105;
    typeLine('ROW ' + (i + 1), x, y, 21, space.dim);
    typeLine(String(total), x, y + 50, 42, i === row ? space.amber : space.ink);
  });
  typeLine('N1-17   /   E1-20   /   W8-01', 1070, 730, 27, space.accent, { fam: F.mono });
  slate(S, 'SEAT CATALOG  /  v40');
};
SCENES.arrival = S => {
  typeLine('Two clocks at check-in', 140, 248, 78, paper.ink);
  typeLine('NOVEMBER 27 REHEARSAL', 145, 325, 28, paper.dim);
  const measures = [['13 / 13', 'operations handled', '0 dropped'], ['29 s', 'median reply', 'booking or check-in'], ['55–81 s', 'seat light changed', 'visual confirmation']];
  measures.forEach(([n, label, note], i) => {
    const x = 140 + i * 550;
    glassCard(x, 395, 515, 270);
    typeLine(n, x + 32, 497, 78, paper.ink);
    typeLine(label, x + 34, 562, 33, paper.ink);
    typeLine(note, x + 34, 615, 26, paper.dim);
  });
  typeLine('Guest 1,109   →   Livestream', 144, 789, 49, paper.ink, { a: at(S, 1, 0.7) });
  slate(S, 'TRIALS #225 / #226  ·  SEAT EVENTS #181');
};

FILM.poster = () => {
  drawPolarityBackground('daylight', 0);
  drawPolarityBackground('deep-space', 0.6, 960, W);
  typeLine('ChronoAI Pte. Ltd.', 88, 125, 26, paper.dim);
  line(88, 170, 872, 170, paper.edge, 1, 2);
  typeLine('From a Flower', 88, 380, 76, paper.ink);
  typeLine('Basket to a Seat', 88, 476, 76, paper.ink);
  typeLine('从一束花到一个席位', 88, 660, 46, paper.ink, { fam: F.zh });
  typeLine('Street Corner  /  Venue plan', 88, 735, 27, paper.dim);
  line(88, 902, 872, 902, paper.edge, 1, 2);
  typeLine('CHRONOAI LOBBY  /  v40', 88, 960, 24, paper.dim, { fam: F.mono });
  arena(1440, 520, 10.3, 'N1-17');
  typeLine('1,108 SEATS   /   18 BASKET MATS', 1440, 960, 26, space.accent, { align: 'center' });
};
