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

FILM.polarity.roles = 'daylight';
const roster = [
  ['Donna', 14, 15], ['Finance', 24, 28], ['Auto-X', 12, 14],
  ['Community', 10, 12], ['HR', 14, 20], ['Admin', 8, 10],
  ['Sentiment Monitor', 6, 7], ['KB Maintainer', 3, 3], ['Retrospective Analyst', 11, 11]
];
function coverage(roles) {
  const done = roles.reduce((sum, role) => sum + role[1], 0);
  const total = roles.reduce((sum, role) => sum + role[2], 0);
  return { count: done + ' / ' + total, percent: (100 * done / total).toFixed(1) + '%' };
}
function workflowBar(x, y, done, total, step, h, col, outline, progress = 1) {
  for (let i = 0; i < total; i++) {
    box(x + i * step, y, step - 4, h, outline, 0.9, 1.5);
    if (i < done) fillBox(x + i * step, y, step - 4, h, col, clamp(progress * done - i));
  }
}
SCENES.team = S => {
  typeLine('Which roles are counted?', 145, 240, 72, space.ink);
  const cuts = [[roster, '9 standalone roles'], [roster.slice(0, 6), '6 core roles']];
  cuts.forEach(([roles, label], i) => {
    const x = 145 + i * 835, result = coverage(roles);
    const a = i === 0 ? 1 : at(S, 1, 0.65);
    glassCard(x, 345, 790, 400, a);
    typeLine(label, x + 38, 426, 44, space.accent, { a });
    typeLine(result.count, x + 30, 574, 108, space.ink, { a });
    typeLine(result.percent + ' of workflows', x + 38, 679, 38, space.dim, { a });
  });
  slate(S, 'TRIALS @ df5ef47  /  2026-11-27');
};
SCENES.roles = S => {
  typeLine('Workflow coverage by role', 140, 194, 67, paper.ink);
  const groupX = [145, 1020];
  ['Six core roles', 'Three additional roles'].forEach((s, i) => typeLine(s, groupX[i], 286, 35, paper.dim));
  roster.forEach(([role, done, total], i) => {
    const extra = i >= 6, x = groupX[Number(extra)], y = 364 + (extra ? i - 6 : i) * 75;
    typeLine((extra ? '#' + (i + 1) + '  ' : '') + role, x, y, 28, paper.ink);
    const barX = x + (extra ? 370 : 215);
    workflowBar(barX, y - 22, done, total, 15, 21, paper.dim, paper.faint, sinceStart(S, i * 0.10, 0.9));
    typeLine(done + '/' + total, x + (extra ? 720 : 750), y, 30, paper.ink, { align: 'right', fam: F.mono });
  });
  line(1020, 576, 1754, 576, paper.edge, 1, 2);
  typeLine('HR   15/20 → 14/20', 1020, 645, 44, paper.ink, { a: at(S, 1, 0.6) });
  typeLine('PDF-reading evidence did not hold up.', 1020, 706, 30, paper.dim, { a: at(S, 1, 0.6) });
  slate(S, 'EVIDENCE AUDIT  /  df5ef47');
};
SCENES.boundary = S => {
  typeLine('The missed stage', 145, 227, 73, space.ink);
  const metrics = [['11 / 12', 'first-try stages'], ['4', 'human actions'], ['29 s', 'Donna median']];
  metrics.forEach(([value, name], i) => {
    const x = 145 + i * 550;
    typeLine(value, x, 390, 89, space.ink);
    typeLine(name, x + 4, 447, 31, space.dim);
  });
  const stall = at(S, 2, 0.7);
  line(145, 520, 1760, 520, space.dim, 0.5, 2);
  typeLine('65 min', 145, 628, 62, space.accent, { a: stall });
  typeLine('Incoming Lark request still queued', 148, 690, 33, space.dim, { a: stall });
  typeLine('3 min', 985, 628, 62, space.accent, { a: stall });
  typeLine('Separate one-shot task delivered', 988, 690, 33, space.dim, { a: stall });
  typeLine('the host’s question sheet', 988, 735, 33, space.dim, { a: stall });
  typeLine('External paying merchants   0', 145, 800, 46, space.ink, { a: at(S, 3, 0.6) });
  slate(S, 'TRIALS #225 / #226  ·  NYXID #2534  ·  2026-11-27');
};

FILM.poster = () => {
  drawPolarityBackground('daylight', 0);
  drawPolarityBackground('deep-space', 0.6, 960, W);
  typeLine('ChronoAI Pte. Ltd.', 88, 125, 26, paper.dim);
  line(88, 170, 872, 170, paper.edge, 1, 2);
  typeLine('Nine AI Employees', 88, 380, 76, paper.ink);
  typeLine('Run a Launch', 88, 476, 76, paper.ink);
  typeLine('九位 AI 员工值守一场发布会', 88, 660, 46, paper.ink, { fam: F.zh });
  typeLine('November 27  /  Workflow audit', 88, 735, 27, paper.dim);
  line(88, 902, 872, 902, paper.edge, 1, 2);
  typeLine('TRIALS  /  df5ef47', 88, 960, 24, paper.dim, { fam: F.mono });
  roster.forEach(([role, done, total], i) => {
    const y = 230 + i * 70;
    typeLine(role, 1010, y, 25, space.ink);
    workflowBar(1320, y - 17, done, total, 15, 17, space.accent, space.dim);
    typeLine(done + '/' + total, 1850, y, 24, space.ink, { align: 'right', fam: F.mono });
  });
  typeLine(coverage(roster).count + ' WORKFLOWS', 1430, 960, 28, space.accent, { align: 'center' });
};
