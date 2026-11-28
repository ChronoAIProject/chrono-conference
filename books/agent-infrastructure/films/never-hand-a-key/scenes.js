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

FILM.polarity.leak = 'daylight';
FILM.polarity.catalog = 'daylight';

function keycard(x, y, palette, mode) {
  glassCard(x, y, 600, 365, 1, { polarity: mode, radius: 24, topRule: false });
  fillBox(x + 1, y + 58, 598, 54, palette.dim, 0.82);
  typeLine('GUEST ACCESS', x + 34, y + 174, 27, palette.dim);
  typeLine('412', x + 28, y + 291, 116, palette.ink);
  typeLine('UNTIL 12:00', x + 565, y + 320, 24, palette.ink, { align: 'right', fam: F.mono });
}
SCENES.leak = S => {
  statusTag(150, 150, 'argued', 'ANALOGY · 类比', 1, 'daylight');
  keycard(150, 275, paper, 'daylight');
  const tests = [['Room 412', 'ADMIT'], ['Linen closet', 'DENY'], ['Room 412 after noon', 'EXPIRED']];
  typeLine('Try the same card', 900, 250, 60, paper.ink);
  tests.forEach(([door, result], i) => {
    const y = 357 + i * 114, a = sinceStart(S, i * 1.1, 0.6);
    line(900, y + 30, 1760, y + 30, paper.edge, 1, 2);
    typeLine(door, 900, y, 37, paper.ink);
    typeLine(result, 1755, y, 30, paper.argued, { align: 'right', a });
  });
  typeLine('One handle carries one scoped grant.', 150, 790, 47, paper.ink, { a: at(S, 1, 0.7) });
  slate(S, 'NYXID  /  CAPABILITY SCOPE');
};
SCENES.vault = S => {
  typeLine('Follow one request', 145, 225, 73, space.ink);
  const stages = [['Agent context', 'capability handle', '0 plaintext keys'], ['NyxID proxy', 'checks the grant', 'attaches the credential'], ['Service', 'receives the call', 'within the allowed scope']];
  stages.forEach(([title, detail, note], i) => {
    const x = 145 + i * 570;
    glassCard(x, 336, 460, 262);
    typeLine(title, x + 28, 413, 46, space.ink);
    typeLine(detail, x + 28, 487, 30, space.accent);
    typeLine(note, x + 28, 552, 26, space.dim);
    if (i < 2) {
      arrow(x + 466, 465, x + 558, 465, space.dim, 1, 2);
      const t = (S.u * 0.4 + i * 0.5) % 1;
      fillBox(x + 466 + 85 * t, 462, 6, 6, space.ink, 1);
    }
  });
  typeLine('Approval required   →   wait for a human', 150, 700, 38, space.ink, { a: at(S, 1, 0.7) });
  const gate = at(S, 2, 0.7);
  typeLine('Grant revoked   →   deny the request', 150, 771, 38, space.ink, { a: gate });
  slate(S, 'CHRONOAI PTE. LTD.  /  NYXID');
};
SCENES.catalog = S => {
  typeLine('Production catalog', 145, 230, 75, paper.ink);
  typeLine('v0.78.0   /   2026-11-27', 148, 310, 31, paper.dim, { fam: F.mono });
  [['55', 'built-in services'], ['42', 'OpenAPI → MCP specs'], ['7', 'gateways']].forEach(([count, name], i) => {
    const x = 144 + i * 551;
    line(x, 407, x + 496, 407, paper.ink, at(S, 0, 1.0), 3);
    typeLine(count, x, 572, 140, paper.ink);
    typeLine(name, x + 5, 641, 35, paper.dim);
  });
  typeLine('Messaging channels', 148, 784, 39, paper.ink);
  typeLine('9 live   /   11 on dev v0.79.0', 655, 784, 37, paper.ink, { fam: F.mono, a: at(S, 1, 0.5) });
  slate(S, 'NYXID  /  NOV 27 AUDIT');
};

FILM.poster = () => {
  drawPolarityBackground('daylight', 0);
  drawPolarityBackground('deep-space', 0.6, 960, W);
  typeLine('ChronoAI Pte. Ltd.', 88, 125, 26, paper.dim);
  line(88, 170, 872, 170, paper.edge, 1, 2);
  typeLine('Never Hand a', 88, 380, 76, paper.ink);
  typeLine('Plaintext Key', 88, 476, 76, paper.ink);
  typeLine('别把明文钥匙交进上下文', 88, 660, 46, paper.ink, { fam: F.zh });
  typeLine('NyxID  /  Scoped access', 88, 735, 27, paper.dim);
  line(88, 902, 872, 902, paper.edge, 1, 2);
  typeLine('PRODUCTION  /  2026-11-27', 88, 960, 24, paper.dim, { fam: F.mono });
  keycard(1140, 335, space, 'deep-space');
  statusTag(1140, 265, 'argued', 'ANALOGY · 类比', 1, 'deep-space');
  typeLine('0 PLAINTEXT KEYS IN CONTEXT', 1440, 960, 27, space.accent, { align: 'center' });
};
