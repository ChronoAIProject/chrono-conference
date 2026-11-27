/* Daylight Plaza × Deep-Space Glass. All positions are in the 1920 × 1080 camera frame. */
FILM.defaultPolarity = 'daylight';
FILM.cinemaSubtitles = true;
FILM.hud = false;
Object.assign(FILM.polarity, {
  prologue_street: 'daylight', prologue_lobby: 'daylight', act1_judgment: 'daylight',
  act2_observatory: 'deep-space', act2_kernel_audit: 'deep-space', act2_open_frontier: 'deep-space',
  act3_vehicle: 'daylight', act3_limits: 'daylight', act4_employees: 'daylight', coda_invitation: 'dual-split'
});
Object.assign(FILM.alphaScenes, {
  prologue_street: true, prologue_lobby: true,
  act2_observatory: true, act2_kernel_audit: true, act4_employees: true
});

const plaza = pal('daylight'), space = pal('deep-space');
const company = 'CHRONOAI PTE. LTD.', institute = 'THE OMEGA INSTITUTE (INDEPENDENT)';
const kernelGid = 'D5/S3/ConceptDynamics/InformationEscape/CatalogKernel.jointKernel_antitone';
const noveltyGid = 'D5/S3/ConceptDynamics/InformationEscape/StructuralNovelty.lowersEscape_iff_not_mem_semanticClosureWithout';
const fredkinGid = 'D5/S3/Quantum/Entanglement/FredkinEntanglingPowerRefutation.result';
const pinLabel = 'trureturing@' + DATA.pin.commit.slice(0, 8);

function caption(s, x, y, c, size = 18, o = {}) {
  txt(s, x, y, { fam: F.mono, size, c, w: 500, ...o });
}
function heading(s, x, y, size, c, o = {}) {
  txt(s, x, y, { fam: F.disp, size, c, w: 700, ...o });
}
function rule(x1, x2, y, p) { line(x1, y + 0.5, x2, y + 0.5, p.edge, 1, 1); }
function frame(S, chapter, shot, source, note, blend) {
  cinemaFrame(S, { leftLabel: scenePolarity(S.id) === 'deep-space' ? institute : company,
    chapterLabel: chapter, rightLabel: shot, slateLeft: source, slateRight: note, blend });
  if (blend > 0 && blend < 1) matteType(S, chapter, shot, source, note, blend);
}
/* At the midpoint of a polarity dissolve the two matte inks have the same luminance.
   Overprint the registration type during that interval to keep the institution and shot legible. */
function matteType(S, chapter, shot, source, note, blend) {
  const a = clamp((0.48 - Math.abs(blend - 0.5)) * 4);
  const ink = blend < 0.56 ? plaza.ink : space.ink;
  const detail = { fam: F.mono, size: 15, w: 600, c: ink, ls: 2, base: 'middle', a };
  txt(scenePolarity(S.id) === 'deep-space' ? institute : company, 64, 65.5, detail);
  txt(chapter, 960, 65.5, { ...detail, fam: F.disp, size: 22, w: 700, align: 'center' });
  txt(timecode(S.t) + ' · ' + shot, 1856, 65.5, { ...detail, align: 'right' });
  txt(source, 64, 1014.5, detail);
  txt(note, 1856, 1014.5, { ...detail, align: 'right' });
}
function paper(p) { fillBox(0, VIEWPORT.y, W, VIEWPORT.h, p.bg, 1); }
function throughWindow(x, y, w, h, draw) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); draw(); ctx.restore();
}

SCENES.prologue_street = S => {
  plate('plate-street-corner.jpg', VIEWPORT, { zoomFrom: 1, zoomTo: 1.08, panX: -28, panY: -8, p: S.p, vignette: 0.08 });
  const title = ease(clamp(S.u / 1.1)) * (1 - ease(clamp((S.u - lineAt(S, 1).s) / 2)));
  if (title > 0) {
    const x = 74 - 12 * (1 - title);
    glassCard(x, 521, 835, 202, title, { polarity: 'daylight' });
    heading('面向未来的造物', x + 32, 640, 88, plaza.ink, { fam: F.zh, a: title });
    caption('BUILD FOR WHAT COMES NEXT · 2026 VIRTUAL LAUNCH', x + 36, 694, plaza.dim, 22, { a: title, ls: 1 });
  }
  glassCard(1246, 175, 605, 178, 1, { kicker: 'STREET CORNER  /  SGT 2026-12-17' });
  for (const [x, value, label] of [[1274,'1,108','SEATS'],[1500,'18','STANDS'],[1675,'0','CAMERAS']]) {
    heading(value, x, 282, 54, plaza.ink);
    caption(label, x, 319, plaza.dim, 17, { ls: 2 });
  }
  frame(S, 'PROLOGUE  /  STREET CORNER', 'DAYLIGHT', 'STREET CORNER · VENUE PLAN', 'SGT 2026-12-17');
};

SCENES.prologue_lobby = S => {
  plate('plate-lobby-baskets.jpg', VIEWPORT, { zoomFrom: 1, zoomTo: 1.14, panX: 54, panY: -22, p: S.p, vignette: 0.08 });
  glassCard(1280, 190, 555, 323, 1, { kicker: 'STREET CORNER  /  CONCIERGE' });
  heading('DONNA', 1308, 303, 65, plaza.ink);
  heading('30 VERIFIED Q&A', 1308, 359, 34, plaza.ink);
  rule(1308, 1806, 388, plaza);
  caption('ZERO IMPROVISATION', 1308, 431, plaza.dim, 22);
  caption('→ HUMAN ESCALATION', 1308, 475, plaza.ink, 22);
  // Parallel shutters close toward the theater screen, leaving its slit visible at the cut.
  const iris = ease(clamp((S.u - S.d + 1.2) / 1.2));
  fillBox(0, VIEWPORT.y, W * 0.66 * iris, VIEWPORT.h, space.bg, 0.62 * iris);
  fillBox(W - W * 0.20 * iris, VIEWPORT.y, W * 0.20 * iris, VIEWPORT.h, space.bg, 0.62 * iris);
  frame(S, 'PROLOGUE  /  LOBBY PROMENADE', 'DAYLIGHT', 'DONNA · VERIFIED PRESS BANK', '30 QUESTIONS · HUMAN ESCALATION', 0.38 * iris);
};

SCENES.act1_judgment = S => {
  paper(plaza);
  const reveal = ease(Q(S, 1, 'When execution drops toward zero', 1.4));
  // One sliding architectural cut exchanges the title and the diagram without superimposing type.
  throughWindow(W * reveal, 165, W * (1 - reveal), 640, () => {
    caption('ACT I   /   THE PRICE OF JUDGMENT', 106, 269, plaza.dim, 22, { ls: 2 });
    heading('执行正在趋近免费', 96, 490, 130, plaza.ink, { fam: F.zh });
    heading('EXECUTION IS APPROACHING ZERO', 104, 615, 79, plaza.ink);
    rule(104, 1816, 711, plaza);
  });
  throughWindow(0, 165, W * reveal, 640, () => {
    glassCard(96, 185, 824, 590, 1, { kicker: 'EDITORIAL MODEL  /  RELATIVE VALUE' });
    heading('Execution & judgment', 128, 302, 53, plaza.ink);
    statusTag(128, 331, 'amber', 'STANCE · NOT A THEOREM');
    const left = 154, width = 688, progress = eo(clamp(reveal + 0.12));
    for (let row = 0; row < 4; row++) rule(left, left + width, 430 + row * 80, plaza);
    const prices = [[plaza.ink, t => 445 + 228 * (1 - Math.exp(-3.7 * t))],
      [plaza.amber, t => 634 - 189 * t ** 1.55]];
    for (const [col, price] of prices) {
      curve(v => [left + width * v * progress, price(v * progress)], 80, col, 1, 3);
      fillBox(left + width * progress - 3, price(progress) - 3, 6, 6, col, 1);
    }
    caption('JUDGMENT VALUE', 652, 417, plaza.amber, 17);
    caption('EXECUTION COST', 650, 713, plaza.ink, 17);
    glassCard(960, 185, 864, 590, 1, { kicker: 'REPOSITORY LEDGER  /  COMMIT VELOCITY' });
    const count = eo(Q(S, 2, 'From September twentieth', 2.1));
    const total = n => count ? Math.round(n * count).toLocaleString('en-US') : '—';
    heading(total(141624), 995, 384, 112, plaza.ink);
    caption('COMMITS / 60 DAYS', 1000, 431, plaza.dim, 22, { ls: 1 });
    rule(1000, 1784, 462, plaza);
    heading(total(90295), 1000, 533, 52, plaza.ink);
    caption('30 DAYS', 1000, 563, plaza.dim);
    heading('74', 1510, 533, 52, plaza.ink);
    caption('REPOSITORIES', 1510, 563, plaza.dim);
    caption('PRODUCT-LINE-COMMITS.CSV · 2026-11-19 · ~15 HUMAN ENGINEERS', 1000, 609, plaza.dim, 17);
    rule(1000, 1784, 634, plaza);
    heading('34.9% explicit bot/agent share', 1000, 690, 34, plaza.ink);
    caption('69 REPOS · 2026-11-07 · IDENTITY SAMPLE', 1000, 735, plaza.dim, 18);
  });
  frame(S, 'ACT I  /  THE PRICE OF JUDGMENT', 'VOL I', 'CHRONO-COMPANY-SLIDES · REPOSITORY CENSUS', 'TWO WINDOWS · APPENDIX B');
};

SCENES.act2_observatory = S => {
  plate('plate-obs-cosmos.jpg', VIEWPORT, { p: S.p, zoomTo: 1.07, panX: -32, vignette: 0.05 });
  glassCard(68, 168, 560, 420, 1, { kicker: 'LIVE.TRURETURING.ORG  /  OBSERVATORY' });
  heading('167,819', 95, 285, 66, space.lean);
  caption('LEAN ✓  FROZEN THEOREMS', 99, 319, space.lean, 21);
  caption('trureturing@05ceb90 · 2026-11-20', 99, 346, space.dim, 16);
  rule(98, 598, 365, space);
  caption('19,022 NODES · 8 DEPTS · 17 REPOS', 98, 397, space.ink, 19);
  caption('Live graph · 2026-11-27', 98, 423, space.dim, 16);
  caption('720 / 720 UTC HRS', 98, 458, space.ink, 21);
  caption('@e55900e · 2026-11-19', 98, 482, space.dim, 16);
  rule(98, 598, 495, space);
  caption('2,128 RESOLUTIONS · 2,126 IN 74D + 2 UNDATED', 98, 525, space.ink, 19);
  caption('1,400 proofs · 728 refutations', 98, 550, space.dim, 17);
  caption('582 quantum / physics · @05ceb90', 98, 574, space.dim, 16);
  frame(S, 'ACT II  /  THE RATCHET OF LOGIC', 'COSMOS ORBIT', 'LIVE.TRURETURING.ORG · COSMOS', 'VOL III · LIVE GRAPH / FROZEN CATALOG', ease(clamp(S.u / 1.6)));
};

SCENES.act2_kernel_audit = S => {
  plate('plate-obs-galaxy.jpg', VIEWPORT, { p: S.p, zoomTo: 1.09, panX: 38, vignette: 0.06 });
  glassCard(598, 168, 1254, 628, 1, { kicker: 'THE OMEGA INSTITUTE  /  FROZEN DECLARATION' });
  heading('Live Lean 4 kernel audit', 628, 279, 52, space.ink);
  caption(pinLabel, 630, 319, space.dim, 23);
  const fredkin = leanCite(fredkinGid);
  if (fredkin?.kind === 'theorem') statusTag(1710, 293, 'lean', 'LEAN ✓');
  rule(630, 1820, 344, space);
  caption('D5/S3/Quantum/Entanglement/FredkinEntanglingPowerRefutation.lean:142', 630, 378, space.dim, 18);
  caption('theorem result : ¬ claim', 630, 430, space.ink, 35);
  caption('witness > 2.00034 ebits', 630, 467, space.ink, 22);
  caption('statement_id sha256:96a43ff10b04...', 630, 499, space.dim, 18);
  const audit = ease(Q(S, 2, 'Running #print axioms', 1));
  fillBox(622, 515, 1206, 154, space.bg, 0.87);
  fillBox(622, 515, 3, 154, space.lean, 0.25 + 0.75 * audit);
  caption('#print axioms', 642, 537, space.secondary, 16);
  const axioms = [
    "'D5.S3.Quantum.Entanglement.FredkinEntanglingPowerRefutation.result' depends on axioms: [propext,",
    ' Classical.choice,',
    ' Quot.sound]'
  ];
  axioms.forEach((lineText, i) => caption(lineText, 642, 565 + i * 26, space.ink, 20));
  caption('custom axioms: 0 · sorryAx: 0', 642, 653, mix(space.dim, space.lean, audit), 20);
  const ratchet = ease(Q(S, 2, 'zero uses of sorryAx', 0.9));
  for (const [i, gid] of [kernelGid, noveltyGid].entries()) {
    const citation = leanCite(gid);
    if (citation?.kind !== 'theorem') continue;
    const y = 689 + i * 49;
    statusTag(630, y, 'lean', 'LEAN ✓', 0.65 + ratchet * 0.35);
    caption(citation.name.split('.').pop(), 750, y + 22, mix(space.dim, space.lean, ratchet), 22);
  }
  frame(S, 'ACT II  /  KERNEL AUDIT', 'GALAXY DRIFT', 'TRURETURING · FROZEN SOURCE / LINE 142', 'LEAN 4 · PIN 8A3F20FB');
};

SCENES.act2_open_frontier = S => {
  paper(space);
  glassCard(96, 184, 820, 590, 1, { kicker: 'EXTERNAL RECORD  /  TRURETURING-OUTREACH' });
  heading('Scholar correspondence', 127, 294, 50, space.ink);
  heading('838', 126, 402, 83, space.ink);
  heading('440', 480, 402, 83, space.ink);
  caption('SCHOLARS CONTACTED', 130, 440, space.dim, 17);
  caption('REPLIES · 53%', 483, 440, space.dim, 17);
  rule(130, 880, 465, space);
  caption('46 countries · 273 institutions · 64 declines', 130, 503, space.ink, 23);
  caption('1 journal paper · 2026-11-08', 130, 542, space.secondary, 21);
  caption('18 OEIS entries · 2026-11-20', 130, 577, space.secondary, 21);
  rule(130, 880, 603, space);
  caption('MATHESIS  /  2026-11-27', 130, 641, space.dim, 18);
  heading('212 open papers listed', 130, 690, 36, space.ink);
  heading('0 Mathesis peer-review acceptances', 130, 739, 31, space.ink);

  glassCard(964, 184, 860, 590, 1, { kicker: 'RESEARCH FRONTIER  /  HANKEL EQUIVALENCE' });
  heading('Riemann Hypothesis', 999, 307, 61, space.ink);
  heading('OPEN', 994, 478, 134, space.open);
  rule(1000, 1787, 520, space);
  caption('Formalized integer-coefficient Hankel equivalence', 1000, 572, space.ink, 23);
  caption('8,490-shard public replay', 1000, 619, space.secondary, 24);
  const focus = ease(Q(S, 1, 'Riemann Hypothesis', 0.75));
  line(1000, 655, 1000 + 786 * focus, 655, space.open, 0.75, 1);
  statusTag(1000, 693 - 5 * focus, 'open', 'OPEN · NOT PROVED');
  frame(S, 'ACT II  /  THE OPEN FRONTIER', 'VOL III', 'TRURETURING-OUTREACH · MATHESIS', 'PUBLIC RECORD · 2026-11-27');
};

/* An exploded axonometric view. The chassis and its mounting rails stay at fixed coordinates. */
function engineBay(swap) {
  const x = 224, y = 520;
  function face(points, fill, stroke) {
    ctx.beginPath();
    for (const [i, pt] of points.entries()) {
      if (i === 0) ctx.moveTo(...pt); else ctx.lineTo(...pt);
    }
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
    ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke();
  }
  function block(cx, cy, width, depth, h, top, side, ink) {
    const a = [cx - width, cy], b = [cx, cy + depth], c = [cx + width, cy], d = [cx, cy - depth];
    face([a, b, [b[0], b[1] + h], [a[0], a[1] + h]], side, ink);
    face([b, c, [c[0], c[1] + h], [b[0], b[1] + h]], side, ink);
    face([a, b, c, d], top, ink);
  }
  for (let i = 4; i >= 0; i--) block(x, y + i * 22, 106, 42, 10, plaza.surface, plaza.edge, plaza.edgeHot);
  for (const dx of [-52, 52]) dashed(x + dx, y - 7, x + dx, y - 103, plaza.edgeHot, 0.85, 1);
  const lift = Math.sin(Math.PI * swap);
  const cx = x + 35 * lift, cy = y - 39 - 70 * lift;
  block(cx, cy, 69, 29, 28, swap < 0.5 ? plaza.ink : plaza.secondary, plaza.dim, plaza.bg);
  for (let i = -2; i <= 2; i++) line(cx - 26 + i * 9, cy + 2 + i * 4, cx + 6 + i * 9, cy - 12 + i * 4, plaza.bg, 0.84, 1);
  caption('SWAPPABLE', 110, 316, plaza.dim, 17, { ls: 2 });
  heading('Engine bay', 108, 360, 36, plaza.ink);
  caption('FIXED MOUNTS', 111, 695, plaza.dim, 17, { ls: 1.5 });
}
SCENES.act3_vehicle = S => {
  paper(plaza);
  const q1 = Q(S, 1, 'NyxID', 1.1), q2 = Q(S, 2, 'Ornn', 1.1);
  const q3 = Q(S, 3, 'CMA', 1), q4 = Q(S, 3, 'Rust governance', 1), q5 = Q(S, 3, 'real surfaces', 1);
  engineBay(ease(Q(S, 1, 'swappable engine', 3.2)));
  statusTag(1430, 167, 'amber', 'ENGINEERING ANALOGY · NOT A THEOREM');
  const rows = [
    ['L5', 'REAL SURFACES', 'chrono-metaverse · chrono-cd · Living with AI', 'nyx-homeassistant-node v1.1.1-alpha.52', q5],
    ['L4', 'GOVERNANCE', 'chrono-harness v0.1.4 · sshx v1.0.0-beta.58', '272k LOC Rust · FILEMAP + DELTA', q4],
    ['L3', 'ORCHESTRATION', 'CMA · heca', '~2.1s hot credential reload · 27 agent types · 361 nightly builds', q3],
    ['L2', 'SKILL REGISTRY', 'Ornn v0.18.0', '134 OpenAPI ops · 187k LOC · 286 test files · 163 AgentSeal skills', q2],
    ['L1', 'IDENTITY & VAULT', 'NyxID v0.78.0', '55 services · 41 MCP specs · 9 channels · 0 plaintext keys in context', q1]
  ];
  rows.forEach(([id, role, product, spec, q], i) => {
    const y = 213 + i * 114, active = ease(q);
    glassCard(390, y, 1420, 102, 1, { fill: plaza.surface });
    fillBox(390, y, 4, 102, plaza.ink, 0.14 + 0.86 * active);
    heading(id, 414, y + 66, 43, mix(plaza.faint, plaza.ink, active));
    caption(role, 498, y + 58, plaza.dim, 19);
    heading(product, 793, y + 43, 31, plaza.ink);
    caption(spec, 795, y + 79, plaza.dim, 20);
  });
  frame(S, 'ACT III  /  THE COMPLETE VEHICLE', 'VOL II', 'PRODUCT RELEASES · VOL II / APPENDIX B', 'ENGINEERING SNAPSHOT · 2026-11-27', 1 - ease(clamp(S.u / 1.4)));
};

SCENES.act3_limits = S => {
  paper(plaza);
  glassCard(140, 200, 1640, 570, 1, { kicker: 'VOLUME II  /  SHIPPED CAPABILITIES AND BOUNDARIES' });
  heading('UNFINISHED SEAMS', 180, 336, 66, plaza.ink);
  heading('尚未拧紧的螺丝', 180 + tw('UNFINISHED SEAMS', 66, F.disp, 700) + 44, 331, 38, plaza.dim, { fam: F.zh });
  caption('2026-11-27', 1736, 332, plaza.dim, 21, { align: 'right' });
  const rows = [
    ['heca', 'Source repository under preparation. Public release pending.', 'SOURCE PENDING', Q(S, 0, 'source repository')],
    ['CMA', 'Ships with a single primary coding runtime.', 'SINGLE RUNTIME', Q(S, 0, 'CMA ships')],
    ['chrono-harness v0.1.4', 'SPEC.md records completeness_proven: false', 'SPEC BOUNDARY', Q(S, 0, 'explicitly declares')]
  ];
  rows.forEach(([name, detail, state, q], i) => {
    const y = 382 + 115 * i;
    rule(180, 1740, y, plaza);
    heading(name, 180, y + 63, 32, plaza.ink);
    caption(detail, 609, y + 60, plaza.ink, 21);
    pill(1524, y + 36, state, { kind: i === 0 ? 'amber' : undefined, polarity: 'daylight', size: 15,
      a: 0.70 + 0.30 * q, radius: 2, w: 205 });
  });
  frame(S, 'ACT III  /  UNFINISHED SEAMS', 'VOL II', 'HECA · CMA · CHRONO-HARNESS / SPEC.MD', 'PRODUCT BOUNDARIES · 2026-11-27');
};

SCENES.act4_employees = S => {
  plate('plate-obs-daylight.jpg', VIEWPORT, { p: S.p, zoomTo: 1.06, panX: 32, vignette: 0.04 });
  glassCard(960, 168, 892, 628, 1, { fill: 'rgba(249,247,245,.95)', kicker: 'SIX AI EMPLOYEES  /  WORKFLOW COVERAGE · 2026-11-25' });
  heading('77 / 97', 991, 324, 98, plaza.ink);
  heading('20 / 97', 1504, 307, 67, plaza.dim);
  caption('79.4% LIVE WORKFLOWS', 995, 363, plaza.ink, 20);
  caption('HUMAN APPROVAL GATE / ROADMAP', 1509, 361, plaza.dim, 17);
  rule(994, 1817, 389, plaza);
  const q = Q(S, 1, 'run seventy-seven', 2);
  const rows = [['Donna',13,15],['Finance NyxBot · demo ledger',24,28],['Auto-X',11,13],
    ['Community · 75 rehearsals',9,11],['HR',15,20],['Admin',5,10]];
  rows.forEach(([label, done, total], i) => {
    const y = 431 + i * 49;
    caption(label, 994, y, plaza.ink, 19);
    const x = 1368, width = 354;
    fillBox(x, y - 14, width, 10, plaza.edge, 1);
    fillBox(x, y - 14, width * done / total * ease(clamp(q * 1.5 - 0.1 * i)), 10, plaza.ink, 1);
    caption(done + '/' + total, 1816, y, plaza.ink, 20, { align: 'right' });
  });
  fillBox(988, 713, 836, 54, plaza.ink, 1);
  caption('0 EXTERNAL PAYING MERCHANTS TODAY · OPENING PILOT COHORT', 1010, 747, plaza.bg, 20);
  frame(S, 'ACT IV  /  SIX AI EMPLOYEES', 'VOL IV', 'NYXBOT-FINANCE · NYXID-NYXBOT-TRIALS', 'PILOT COHORT · 2026-11-27');
};

/* Give each full frozen identifier two readable lines. The shared leanList owns the chip and label.
   Break only at the last namespace separator, preserving every character and the native font. */
function frozenRegister(x, y) {
  const size = 19, spacing = 72, width = 822;
  const badgeWidth = tw(STR.en.lean || 'LEAN ✓', size * 0.72, F.mono, 700, 1) + 32;
  const refs = DATA.lean.filter(z => z.kind === 'theorem');
  refs.forEach((ref, i) => {
    const label = ref.label || ref.name;
    const prefix = label.slice(0, label.lastIndexOf('.') + 1);
    const breakX = badgeWidth + tw(prefix, size, F.mono, 700);
    const row = y + i * spacing;
    const draw = (xx, yy) => leanList(xx, yy - i * spacing, 1, { size, gap: spacing, palette: space });
    throughWindow(x - 1, row - 24, breakX + 1, 32, () => draw(x, row));
    throughWindow(x + badgeWidth, row + 7, width - badgeWidth, 28, () => draw(x + badgeWidth - breakX, row + 29));
  });
}
function portalPhotos(y, h, p = 0) {
  plate('plate-street-corner.jpg', { x: 68, y, w: 822, h }, { p, zoomTo: 1.04, vignette: 0.03 });
  plate('plate-obs-cosmos.jpg', { x: 1028, y, w: 822, h }, { p, zoomTo: 1.04, vignette: 0.05 });
}
function splitPaper() {
  fillBox(0, VIEWPORT.y, 960, VIEWPORT.h, plaza.bg, 1);
  fillBox(960, VIEWPORT.y, 960, VIEWPORT.h, '#070B12', 1);
}
function splitChapterBadge(label) {
  const width = tw(label, 20, F.disp, 700, 2) + 48;
  glassCard(960 - width / 2, MATTE_HEIGHT / 2 - 21, width, 42, 1,
    { polarity: 'deep-space', fill: space.bg, border: space.dim, topRule: false });
  heading(label, 960, MATTE_HEIGHT / 2, 20, space.ink, { align: 'center', base: 'middle', ls: 2 });
}
SCENES.coda_invitation = S => {
  splitPaper();
  heading('面向未来的造物', 67, 250, 70, plaza.ink, { fam: F.zh });
  heading('Build for What Comes Next', 70, 307, 42, plaza.ink);
  heading('逻辑的棘轮', 1026, 250, 70, space.ink, { fam: F.zh });
  heading('The Ratchet of Logic', 1030, 307, 42, space.ink);
  portalPhotos(340, 174, S.p);
  caption('STREET CORNER · 1,108 SEATS', 69, 548, plaza.dim, 20);
  caption('THE OMEGA INSTITUTE (INDEPENDENT) · VOL III', 1029, 548, space.dim, 19);
  rule(68, 890, 569, plaza); rule(1028, 1850, 569, space);
  heading('Vols I, II, IV', 68, 645, 52, plaza.ink);
  caption('https://chrono-ai.fun/', 70, 707, plaza.ink, 29);
  caption('contact@chrono-ai.fun', 70, 758, plaza.dim, 25);
  frozenRegister(1028, 607);
  cinemaFrame(S, { polarity: 'dual-split', leftLabel: 'CHRONOAI PTE. LTD.', chapterLabel: '',
    rightLabel: 'THE OMEGA INSTITUTE', slateLeft: 'https://chrono-ai.fun/ · contact@chrono-ai.fun',
    slateRight: 'live.trureturing.org · ' + pinLabel });
  splitChapterBadge('BUILD FOR WHAT COMES NEXT');
};

FILM.poster = () => {
  const S = { id: 'coda_invitation', t: 0, p: 1 };
  splitPaper();
  heading('面向未来的造物', 64, 297, 94, plaza.ink, { fam: F.zh });
  heading('2026 线上发布会全片', 1024, 289, 71, space.ink, { fam: F.zh });
  heading('BUILD FOR WHAT COMES NEXT:', 70, 363, 47, plaza.ink);
  heading('THE 2026 VIRTUAL LAUNCH', 1030, 363, 47, space.ink);
  portalPhotos(399, 338);
  rule(68, 890, 763, plaza); rule(1028, 1850, 763, space);
  caption('MARINA BAY · STREET CORNER · SINGAPORE', 70, 810, plaza.dim, 22, { ls: 1 });
  caption('LIVE.TRURETURING.ORG · VOL III', 1029, 810, space.dim, 21);
  heading('1,108 seats  /  18 stands  /  0 cameras', 69, 876, 36, plaza.ink);
  if (leanCite(fredkinGid)?.kind === 'theorem') {
    statusTag(1029, 848, 'lean', 'LEAN ✓', 1, 'deep-space');
    caption('FredkinEntanglingPowerRefutation.result', 1142, 870, space.lean, 22);
  }
  cinemaFrame(S, { polarity: 'dual-split', leftLabel: company, chapterLabel: '',
    rightLabel: 'THE OMEGA INSTITUTE', slateLeft: 'CHRONO-AI.FUN · SGT 2026-12-17',
    slateRight: 'INDEPENDENT RESEARCH · ' + pinLabel });
  splitChapterBadge('2026 VIRTUAL LAUNCH');
  // Use the event date in the poster's timecode position.
  fillBox(1390, 36, 480, 59, space.bg, 1);
  caption('DEC 17, 2026 · THE OMEGA INSTITUTE', 1856, MATTE_HEIGHT / 2, space.dim, 15,
    { w: 600, ls: 2, align: 'right', base: 'middle' });
};

/* The director's narration lines are also the motion cue addresses (SC[id].lines).
   Subtitle edits occur inside each measured line, on matching English and Chinese clause
   boundaries. Only the caption track is subdivided. Both languages come from script.json. */
const captionCuts = {
  prologue_street: [
    [['with zero', '没有一台']],
    [['eighteen celebratory', '十八座']],
    [['inside human-defined', '在人类护栏']]
  ],
  prologue_lobby: [
    [['if a question', '超出出处'], ['and routes it', '原样转交']],
    [['What stays rare', '真正稀缺']]
  ],
  act1_judgment: [
    [['writing code', '写代码'], ['That price sheet', '而今天']],
    [['An unguarded', '失去护栏']],
    [['seventy-four active', '横跨'], ['recorded one hundred', '落下十四万'], ['maintained by', '由约十五位'],
      ['while a separate', '另在十一月七日'], ['measured roughly', '机器与代理账号']],
    [['why didn', '为什么每周']]
  ],
  act2_observatory: [
    [['independent research', '独立科研机构'], ['drove this discipline', '把这套方法']],
    [['tracks nineteen', '实时追踪']],
    [['trureturing holds', 'trureturing 已冻结'], ['across fourteen', '一万四千七百'], ['and maintained', '并在连续']],
    [['two thousand one hundred twenty-six', '其中两千一百二十六'], ['plus two undated', '另含两条'],
      ['yielding one thousand', '共一千四百'], ['including five hundred', '其中五百']]
  ],
  act2_kernel_audit: [
    [['Follow the five-step', '沿着五步']],
    [['The Omega Institute', 'The Omega Institute'], ['and froze', '并在源码']],
    [["'D5.S3.", "'D5.S3."], ['depends on axioms', 'depends on axioms'], ['— zero custom', '——自定义公理']],
    [['adding frozen', '新增冻结'], ['and a new claim', '而一条'], ['if and only if', '当且仅当']]
  ],
  act2_open_frontier: [
    [['Across eight', '联系八百'], ['four hundred forty', '收获四百'], ['yielding one', '与一篇']],
    [['and formal peer-review', '但经其'], ['And the Riemann', '而黎曼'], ['remains unequivocally', '至今依然']]
  ],
  act3_vehicle: [
    [['As an engineering', '打一个类比'], ['but bolting', '但把裸发动机']],
    [['Layer one', '第一层'], ['fifty-five built-in', '集成五十五'], ['open signup', '开放注册']],
    [['turning fragile', '把散落的']],
    [['local-first orchestrator', '覆盖二十七'], ['Rust governance', '二十七万行'], ['and real surfaces', '直至 chrono-metaverse']]
  ],
  act3_limits: [
    [["heca's source", 'heca 源码'], ['CMA ships', 'CMA 目前'], ['and chrono-harness', 'chrono-harness 规范']],
    [['Every version', '每一项']]
  ],
  act4_employees: [
    [['They need reliable', '他们需要'], ['without ever', '而且绝不']],
    [['six AI employee', '六个 AI'], ['spanning Donna', '覆盖前台']],
    [['And we state', '我们也坦诚'], ['we are opening', '今天起正式']]
  ],
  coda_invitation: [
    [['What grows scarcer', '每个清晨']],
    [['read all four', '翻阅四部'], ['Build for what', '面向未来的造物']]
  ]
};
FILM.init.push(() => {
  const captions = [];
  for (const scene of TL.scenes) {
    const lines = SC[scene.id].lines;
    for (const [index, l] of lines.entries()) {
      let enStart = 0, zhStart = 0;
      const timeAt = n => scene.start + lerp(l.s, l.e, n / l.en.length);
      function add(enEnd, zhEnd) {
        if (enEnd <= enStart || zhEnd <= zhStart) throw Error('Missing subtitle cut in ' + scene.id + ' line ' + index);
        captions.push({ scene: scene.id, start: timeAt(enStart), end: timeAt(enEnd),
          en: l.en.slice(enStart, enEnd).trim(), zh: l.zh.slice(zhStart, zhEnd).trim() });
        enStart = enEnd; zhStart = zhEnd;
      }
      for (const [en, zh] of captionCuts[scene.id][index]) add(l.en.indexOf(en, enStart), l.zh.indexOf(zh, zhStart));
      add(l.en.length, l.zh.length);
    }
  }
  TL.lines = captions;
});
