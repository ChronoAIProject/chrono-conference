/* Daylight Plaza × Deep-Space Glass. Clip scenes are transparent HUD layers over the
   verified local 3D captures. All copy is ledger-dated and the badges retain their
   epistemic meaning in the cinema master and the still-plate web edition. */
FILM.defaultPolarity = 'daylight';
FILM.cinemaSubtitles = true;
FILM.hud = false;
Object.assign(FILM.polarity, {
  prologue_office_to_stadium: 'daylight',
  prologue_bay_to_orbit: 'dual-split',
  act1_judgment: 'daylight',
  act2_stations_to_galaxies: 'deep-space',
  act2_kernel_ratchet: 'deep-space',
  act2_red_stamps: 'deep-space',
  act3_vehicle_chassis: 'daylight',
  act3_unfinished_bolts: 'daylight',
  act4_nine_employees_rehearsal: 'daylight',
  coda_choir_and_chalk: 'dual-split'
});
Object.assign(FILM.alphaScenes, {
  prologue_office_to_stadium: true,
  prologue_bay_to_orbit: true,
  act2_stations_to_galaxies: true
});

const plaza = pal('daylight');
const space = pal('deep-space');
const company = 'CHRONOAI PTE. LTD.';
const institute = 'THE OMEGA INSTITUTE (INDEPENDENT)';
const kernelGid = 'D5/S3/ConceptDynamics/InformationEscape/CatalogKernel.jointKernel_antitone';
const noveltyGid = 'D5/S3/ConceptDynamics/InformationEscape/StructuralNovelty.lowersEscape_iff_not_mem_semanticClosureWithout';
const fredkinGid = 'D5/S3/Quantum/Entanglement/FredkinEntanglingPowerRefutation.result';

function caption(s, x, y, c, size = 18, o = {}) {
  txt(s, x, y, { fam: F.mono, size, c, w: 500, ...o });
}
function heading(s, x, y, size, c, o = {}) {
  txt(s, x, y, { fam: F.disp, size, c, w: 700, ...o });
}
function rule(x1, x2, y, p) { line(x1, y + 0.5, x2, y + 0.5, p.edge, 1, 1); }
function frame(S, chapter, shot, source, note, blend) {
  cinemaFrame(S, { leftLabel: scenePolarity(S.id) === 'deep-space' ? institute : company,
    chapterLabel: chapter, rightLabel: shot, slateLeft: source, slateRight: note, blend,
    barHeight: FILM.alphaScenes[S.id] ? 56 : undefined });
}
function paper(p) { fillBox(0, VIEWPORT.y, W, VIEWPORT.h, p.bg, 1); }
function card(x, y, w, h, p, kicker) {
  glassCard(x, y, w, h, 1, { fill: p.surface, kicker });
}
function lineBlock(lines, x, y, p, size = 23) {
  lines.forEach((value, i) => caption(value, x, y + i * 44, p.ink, size));
}
function splitPaper() {
  fillBox(0, VIEWPORT.y, 960, VIEWPORT.h, plaza.bg, 1);
  fillBox(960, VIEWPORT.y, 960, VIEWPORT.h, space.bg, 1);
}

SCENES.prologue_office_to_stadium = S => {
  plate('office-stadium.jpg', { x: 0, y: 0, w: W, h: H }, { zoomTo: 1, vignette: 0 });
  frame(S, 'PROLOGUE  /  FOUR STANDS', 'OFFICE → STADIUM', 'CHRONOAI LOBBY · LOCAL 3D CAPTURE', 'LIVE PIP · 30 FPS');
};

SCENES.prologue_bay_to_orbit = S => {
  plate(S.p < 0.7 ? 'marina-bay-sky.jpg' : 'earth-orbit.jpg', { x: 0, y: 0, w: W, h: H }, { zoomTo: 1, vignette: 0 });
  frame(S, 'PROLOGUE  /  BAY TO ORBIT', 'MARINA BAY → EARTH', 'CHRONOAI METAVERSE · LOCAL 3D CAPTURE', 'SYNCED PIP · 30 FPS');
};

SCENES.act1_judgment = S => {
  paper(plaza);
  card(80, 170, 850, 550, plaza, 'ACT I · JUDGMENT UNDER LOAD');
  heading('CHEAP EXECUTION', 116, 304, 52, plaza.ink);
  heading('SCARCE JUDGMENT', 116, 366, 52, plaza.amber);
  statusTag(116, 420, 'amber', 'STANCE · NOT A THEOREM');
  lineBlock(['EXECUTION COST ↓', 'JUDGMENT VALUE ↑', '100× WRONG CATHEDRAL'], 116, 490, plaza, 24);
  card(980, 170, 860, 550, plaza, 'AUDITED REPOSITORY LEDGER · 2026-11-27');
  heading('141,624', 1020, 304, 92, plaza.ink);
  caption('COMMITS · 60 DAYS · 74 ACTIVE REPOS', 1024, 350, plaza.dim, 19);
  rule(1024, 1798, 386, plaza);
  heading('538', 1020, 474, 72, plaza.ink);
  caption('REPOSITORIES · 6 ORGANIZATIONS', 1024, 514, plaza.dim, 19);
  heading('34.9%', 1512, 474, 66, plaza.ink);
  caption('EXPLICIT BOT / AGENT SAMPLE · 69 REPOS', 1516, 514, plaza.dim, 17);
  frame(S, 'ACT I  /  THE HAMMER AND THE FLOOD', 'JUDGMENT', 'MASTER LEDGER · 2026-11-28', 'ANALOGY / STANCE');
};

SCENES.act2_stations_to_galaxies = S => {
  plate(S.p < 0.5 ? 'obs-stations.jpg' : 'obs-galaxies.jpg', { x: 0, y: 0, w: W, h: H }, { zoomTo: 1, vignette: 0 });
  frame(S, 'ACT II  /  EIGHT STATIONS', 'STATIONS → GALAXIES', 'LIVE.TRURETURING.ORG · LIVE 3D CAPTURE', '星穹 → 星系 → 曜白 · 30 FPS');
};

SCENES.act2_kernel_ratchet = S => {
  plate('obs-galaxies.jpg', VIEWPORT, { p: S.p, zoomFrom: 1.02, zoomTo: 1.08, panX: 18, panY: -8, vignette: 0.04 });
  card(580, 164, 1260, 602, space, 'THE OMEGA INSTITUTE · FROZEN DECLARATION');
  heading('LEAN 4 KERNEL AUDIT', 620, 278, 52, space.ink);
  statusTag(620, 316, 'lean', 'LEAN ✓');
  caption('FredkinEntanglingPowerRefutation.result', 780, 337, space.dim, 20);
  rule(620, 1804, 366, space);
  lineBlock(['#print axioms', '[propext, Classical.choice, Quot.sound]', 'custom axioms: 0 · sorryAx: 0'], 620, 430, space, 25);
  statusTag(620, 622, 'amber', 'ANALOGY · WATCHMAKER RATCHET');
  const refs = [kernelGid, noveltyGid, fredkinGid];
  refs.forEach((gid, i) => { if (leanCite(gid)?.kind === 'theorem') statusTag(1180, 420 + i * 62, 'lean', 'LEAN ✓'); });
  frame(S, 'ACT II  /  THE RATCHET OF LOGIC', 'KERNEL AUDIT', 'TRURETURING · FROZEN SOURCE', 'ANALOGY · LEAN ✓');
};

SCENES.act2_red_stamps = S => {
  paper(space);
  card(78, 166, 812, 548, space, 'THE OMEGA INSTITUTE · EXTERNAL RECORD');
  heading('HONESTY IN RED INK', 114, 296, 48, space.ink);
  heading('1,049', 114, 414, 82, space.ink);
  caption('CONTACTED · 485 REPLIED', 118, 456, space.dim, 19);
  caption('15 arXiv · 21 OEIS · 66 DECLINED', 118, 500, space.ink, 22);
  heading('225', 118, 598, 68, space.ink);
  caption('MATHESIS PAPERS · 0 ACCEPTANCES', 122, 638, space.open, 20);
  card(954, 166, 886, 548, space, 'RH PROVENANCE · PUBLIC REPLAY');
  heading('Levent Alpöge · Lean 4', 992, 286, 42, space.ink);
  caption('RH + Dirichlet GRH · community certified', 996, 330, space.ink, 21);
  heading('8,490', 996, 444, 82, space.ink);
  caption('SHARD REPLAY · THE OMEGA INSTITUTE', 1000, 484, space.dim, 19);
  statusTag(996, 560, 'open', 'OPEN · ERH / GRAND RH / ZERO SIMPLICITY / PAIR CORRELATION');
  frame(S, 'ACT II  /  RED STAMPS', 'OPEN FRONTIER', 'THE OMEGA INSTITUTE · PUBLIC REPLAY', 'OPEN · 2026-11-28');
};

SCENES.act3_vehicle_chassis = S => {
  paper(plaza);
  card(84, 158, 1748, 570, plaza, 'CHRONOAI PTE. LTD. · COMPLETE VEHICLE');
  heading('NEVER BOLT A BARE ENGINE TO WET CONCRETE', 120, 268, 42, plaza.ink);
  statusTag(120, 310, 'amber', 'ANALOGY · HOTEL KEYCARD');
  const rows = [
    ['L1', 'NyxID v0.78.0', '55 services · 42 MCP specs · 0 plaintext keys'],
    ['L2', 'Ornn v0.18.0 + SDK v0.2.4', '163 scanned skills · 134 operations'],
    ['L3', 'CMA v0.12.0 + heca', 'Apache-2.0 · 27 integrations · 360 nightlies'],
    ['L4', 'chrono-harness', '25 repos · 21 binaries/platform · Copier v0.1.52'],
    ['L5', 'Real surfaces', 'chrono-metaverse · chrono-cd · Living with AI']
  ];
  rows.forEach(([id, name, detail], i) => {
    const y = 370 + i * 67;
    rule(120, 1796, y - 28, plaza);
    heading(id, 122, y + 14, 30, plaza.ink);
    heading(name, 230, y + 14, 28, plaza.ink);
    caption(detail, 840, y + 12, plaza.dim, 20);
  });
  frame(S, 'ACT III  /  THE COMPLETE VEHICLE', 'FIVE-LAYER CHASSIS', 'CHRONOAI PTE. LTD. · 2026-11-28', 'ANALOGY');
};

SCENES.act3_unfinished_bolts = S => {
  paper(plaza);
  card(126, 180, 1660, 500, plaza, 'WORKBENCH · UNFINISHED STEEL IN BROAD DAYLIGHT');
  heading('UNFINISHED BOLTS', 168, 316, 70, plaza.ink);
  const rows = [
    ['heca', 'SOURCE REPOSITORY PRIVATE / INTERNAL'],
    ['CMA', 'SINGLE PRIMARY CODING RUNTIME TODAY'],
    ['chrono-harness', 'completeness_proven: false · parity: unestablished']
  ];
  rows.forEach(([name, detail], i) => {
    const y = 390 + i * 82;
    rule(168, 1742, y - 34, plaza);
    heading(name, 168, y, 32, plaza.ink);
    caption(detail, 548, y, plaza.open, 23);
  });
  statusTag(168, 630, 'amber', 'STANCE · SHOW THE WELD MARKS');
  frame(S, 'ACT III  /  UNFINISHED BOLTS', 'BOUNDARIES', 'CHRONOAI PTE. LTD. · HONEST LEDGER', 'STANCE');
};

SCENES.act4_nine_employees_rehearsal = S => {
  paper(plaza);
  card(80, 158, 850, 596, plaza, 'WORKFLOW COVERAGE · NINE ROLES');
  heading('102 / 120', 116, 281, 72, plaza.ink);
  caption('85.0% COVERED', 538, 273, plaza.dim, 22);
  rule(116, 894, 307, plaza);
  const roles = [
    ['Donna', 14, 15], ['Finance', 24, 28], ['Auto-X', 12, 14],
    ['Community', 10, 12], ['HR', 14, 20], ['Admin', 8, 10],
    ['Sentiment', 6, 7], ['KB', 3, 3], ['#9 Retro Analyst', 11, 11]
  ];
  roles.forEach(([name, covered, total], index) => {
    const y = 349 + index * 47;
    const ink = name === 'HR' ? plaza.amber : plaza.secondary;
    caption(name, 116, y, plaza.ink, 22);
    fillBox(378, y - 13, 320, 9, plaza.edge, 1);
    fillBox(378, y - 13, 320 * covered / total, 9, ink, 1);
    caption(covered + ' / ' + total, 726, y, ink, 22);
    if (name === 'HR') caption('↓', 862, y, plaza.open, 24);
  });

  card(970, 158, 870, 596, plaza, 'FULL-FLOW REHEARSAL · NOVEMBER 27');
  heading('11 / 12', 1006, 281, 72, plaza.ink);
  caption('STAGES PASSED FIRST TRY', 1330, 273, plaza.dim, 20);
  rule(1006, 1804, 307, plaza);
  heading('4', 1006, 393, 60, plaza.ink);
  caption('HUMAN ACTIONS', 1010, 433, plaza.dim, 20);
  heading('29 s', 1410, 393, 60, plaza.ink);
  caption('DONNA · MEDIAN', 1414, 433, plaza.dim, 20);
  rule(1006, 1804, 467, plaza);
  caption('NyxID #2534', 1008, 515, plaza.dim, 22);
  heading('65 min stall → 3 min bypass', 1006, 573, 43, plaza.ink);
  rule(1006, 1804, 618, plaza);
  heading('0', 1006, 704, 64, plaza.ink);
  caption('EXTERNAL PAYING MERCHANTS', 1094, 692, plaza.ink, 23);
  frame(S, 'ACT IV  /  NINE ROLES', 'DRESS REHEARSAL', 'NYXID-NYXBOT-TRIALS · 2026-11-27', 'HR AUDIT · 15/20 → 14/20');
};

SCENES.coda_choir_and_chalk = S => {
  splitPaper();
  heading('面向未来的造物', 72, 250, 66, plaza.ink, { fam: F.zh });
  heading('Build for What Comes Next', 74, 306, 42, plaza.ink);
  heading('拿起粉笔', 1030, 250, 66, space.ink, { fam: F.zh });
  heading('Pick Up the Chalk', 1034, 306, 42, space.ink);
  card(72, 368, 820, 290, plaza, 'CHRONOAI PTE. LTD.');
  caption('chrono-ai.fun · 4 open monographs', 106, 458, plaza.ink, 24);
  caption('street-corner · github.com/chrono-harness', 106, 508, plaza.ink, 21);
  card(1028, 368, 820, 290, space, 'THE OMEGA INSTITUTE · INDEPENDENT');
  caption('live.trureturing.org · 223,231+ Lean 4 theorems', 1062, 458, space.ink, 23);
  caption('trureturing-books · mathesis-papers', 1062, 508, space.ink, 21);
  statusTag(1062, 570, 'lean', 'LEAN ✓ · FROZEN THEOREMS');
  caption('contact@chrono-ai.fun', 72, 762, plaza.dim, 24);
  frame(S, 'CODA  /  PICK UP THE CHALK', 'DUAL POLARITY', 'CHRONOAI PTE. LTD. × THE OMEGA INSTITUTE', 'contact@chrono-ai.fun');
};

FILM.poster = () => {
  const S = { id: 'coda_choir_and_chalk', t: 0, p: 1 };
  splitPaper();
  heading('面向未来的造物', 64, 288, 80, plaza.ink, { fam: F.zh });
  heading('BUILD FOR WHAT COMES NEXT', 68, 356, 44, plaza.ink);
  heading('拾起粉笔', 1032, 288, 80, space.ink, { fam: F.zh });
  heading('THE OMEGA INSTITUTE', 1036, 356, 40, space.ink);
  caption('1,108 seats · 18 mats · 0 cameras', 70, 820, plaza.ink, 28);
  caption('223,231+ frozen Lean 4 theorems · OPEN frontier', 1036, 820, space.ink, 22);
  caption('contact@chrono-ai.fun', 70, 874, plaza.dim, 23);
  cinemaFrame(S, { polarity: 'dual-split', leftLabel: company, chapterLabel: '', rightLabel: institute,
    slateLeft: 'CHRONO-AI.FUN · SGT 2026-12-17', slateRight: 'LIVE.TRURETURING.ORG · MASTER LEDGER 2026-11-28' });
};
