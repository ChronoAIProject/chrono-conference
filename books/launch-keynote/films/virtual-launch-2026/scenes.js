/* Titles, cuts and captions share the measured narration clock. The full-frame
   plate supplies the same composition when the player runs without the clips. */
FILM.defaultPolarity = 'daylight';
FILM.cinemaSubtitles = true;
FILM.hud = false;
const obsidian = '#04070E';
const chapterInk = '#FFFFFF';
const night = 'deep-space';
POLARITY[night].bg = obsidian;
const company = 'ChronoAI Pte. Ltd.';
const institute = 'The Omega Institute (Independent)';
const aperture = { x: 0, y: 0, w: W, h: H };

for (const [i, scene] of TL.scenes.entries()) {
  FILM.polarity[scene.id] = i === 7 ? 'dual-split' : i >= 5 ? night : 'daylight';
  FILM.alphaScenes[scene.id] = true;
}

function frame(S, location, product = false) {
  const split = S.i === 7;
  const bars = S.i === 0 || S.i >= 5 ? night : 'daylight';
  plate(S.id + '.jpg', aperture, { p: S.p, zoomTo: 1.035, vignette: 0 });
  if (product) fillBox(0, 916, W, 124, pal(scenePolarity(S.id)).bg);
  cinemaFrame(S, {
    polarity: bars, barHeight: 40, chapterInk,
    leftLabel: split ? company + ' · Singapore' : S.i >= 5 ? institute : company,
    chapterLabel: '', rightLabel: split ? institute : String(S.i + 1).padStart(2, '0') + ' / 08',
    slateLeft: location, slateRight: '2026 · 11 · 28'
  });
  txt(sceneName(S.id), 914, 20, { fam: F.disp, size: 21, w: 700, ls: 0.5,
    c: bars === night ? chapterInk : pal(bars).ink, align: 'right', base: 'middle' });
}

function opacity(p) {
  return eo(p / 0.09) * ease((1 - p) / 0.10);
}

// Each card is contained within one half of the aperture. The middle of the
// live capture stays visible and the terminal output has its own reading area.
function card(p, label, rows, options = {}) {
  const a = opacity(p);
  if (a <= 0) return;
  const { right = false, y = 116, size = 50, family = F.disp, kind, layer } = options;
  const labelSize = 20, inset = 27, lineHeight = Math.round(size * 1.14);
  const maxWidth = 824;
  const widths = rows.map(s => tw(s, size, family, 700));
  const fitted = Math.min(size, Math.floor(size * (maxWidth - 2 * inset) / Math.max(...widths)));
  const width = Math.ceil(Math.max(tw(label, labelSize, F.mono, 700, 1.1),
    ...rows.map(s => tw(s, fitted, family, 700))) + 2 * inset);
  const height = 63 + lineHeight * rows.length;
  const dx = (right ? 1 : -1) * 24 * (1 - eo(p / 0.13));
  const x = (right ? W - 75 - width : 75) + dx;
  const accent = kind ? pal(night)[kind] : C.secondary;
  glassCard(x, y, width, height, a, { polarity: night, fill: rgba(obsidian, 0.91),
    border: rgba(C.white, 0.34), topRule: false, radius: 12 });
  if (layer) {
    const cell = (width - 2 * inset - 15) / 4;
    for (let n = 0; n < 4; n++) {
      fillBox(x + inset + n * (cell + 5), y + height - 10, cell, 2, n === layer - 1 ? chapterInk : C.dim, a);
    }
  }
  txt(label, x + inset, y + 33, { fam: F.mono, size: labelSize, ls: 1.1, w: 700, c: accent, a });
  rows.forEach((s, i) => txt(s, x + inset, y + 44 + lineHeight * (i + 0.80), {
    fam: family, size: fitted, w: 700, c: chapterInk, a }));
}

const productCard = { right: true, y: 690, size: 39 };
const stackCard = { ...productCard, y: 710, size: 36 };

SCENES.s01_the_shift = S => {
  frame(S, '14F · Singapore');
  card(Q(S, 3, 'Because a model', 2.78), 'ANALOGY', ['THE MODEL IS', 'ONLY AN ENGINE'], { kind: 'amber' });
  card(Q(S, 4, 'We built', 4.48), 'ANALOGY', ['WE BUILT THE', 'ENTIRE VEHICLE'], { kind: 'amber' });
  card(Q(S, 5, 'Look around', 8.65), 'SINGAPORE · 14F', ['ZERO CAMERAS', 'ZERO STAGE CREW', 'RUNNING LIVE'], { size: 44 });
};

SCENES.s02_through_the_glass = S => {
  frame(S, 'Street Corner / Tide Arena');
  card(Q(S, 0, 'Pull straight', 3.2), 'STREET CORNER', ['MARINA BAY']);
  card(Q(S, 1, '1,108', 3.35), 'TIDE ARENA', ['1,108 ATOMIC SEATS']);
  card(Q(S, 2, 'Eighteen flower mats', 4.62), 'FLOWER TOWN', ['18 FLOWER MATS']);
  card(Q(S, 4, 'In sixty days', 8.57), '60 DAYS · 15 ENGINEERS', ['141,624 COMMITS']);
};

SCENES.s03_nyxid_zero_secret = S => {
  frame(S, 'NyxID / scoped proxy', true);
  card(Q(S, 0, 'Rule one', 3.15), 'NYXID', ['AN AGENT PROMPT', 'IS NOT A VAULT']);
  card(Q(S, 2, 'Think of', 4.8), 'ANALOGY', ['SMART HOTEL KEYCARD'], { ...productCard, kind: 'amber' });
  card(Q(S, 4, 'HTTP 200', 4.8), 'SCOPED REQUEST', ['HTTP 200'], productCard);
  card(Q(S, 5, 'Task finished', 2.95), 'ACCESS CONTROL', ['HTTP 200 → REVOKE'], productCard);
  card(Q(S, 5, 'HTTP 401', 1.24), 'ACCESS CONTROL', ['HTTP 200 → REVOKE → HTTP 401'], productCard);
  card(Q(S, 6, 'Fifty-five', 4.92), '0 KEYS EXPOSED', ['55 SERVICES · 42 MCP SPECS'], productCard);
};

SCENES.s04_complete_vehicle_stack = S => {
  frame(S, 'Ornn / CMA / heca / chrono-harness', true);
  card(Q(S, 0, 'Ornn', 10.4), 'L2   ORNN', ['163 SCANNED SKILLS'], { ...stackCard, layer: 1 });
  card(Q(S, 3, 'In the cloud', 10.4), 'L3   CMA v0.12.0', ['2 s HOT RELOAD · APACHE 2.0'], { ...stackCard, layer: 2 });
  card(Q(S, 5, 'On your own machine', 8.6), 'L3   HECA', ['27 INTEGRATIONS · ONE CANVAS'], { ...stackCard, layer: 3 });
  card(Q(S, 7, 'And chrono-harness', 7.72), 'L4   CHRONO-HARNESS', ['21 RUST JUDGES', '540 VERUS-VERIFIED RUST FILES'], { ...stackCard, layer: 4 });
};

SCENES.s05_ai_employees_live = S => {
  frame(S, 'OPS//LEDGER / LAUNCH//ARENA', true);
  card(Q(S, 1, 'nine AI employees', 7.8), '9 AI EMPLOYEES', ['85% WORKFLOWS (102/120)'], productCard);
  card(Q(S, 3, 'Every cash transfer', 4.5), 'HUMAN APPROVAL GATE', ['CASH & COMMITMENTS'], productCard);
  card(Q(S, 4, 'Watch our launch arena', 5.0), 'LAUNCH//ARENA', ['1,108 LOCKED SEATS', '0 COLLISIONS'], productCard);
  card(Q(S, 5, 'Donna', 10.35), 'DONNA · 29 s MEDIAN', ['11/12 STAGES · DEC 17 PILOT'], productCard);
};

SCENES.s06_one_more_thing_omega = S => {
  frame(S, 'Orbital passage / live.trureturing.org');
  const pause = Q(S, 0, 'One more thing.', 3.37);
  const a = opacity(pause);
  if (a > 0) {
    fillBox(0, 40, W, H - 80, obsidian, 0.64 * a);
    txt('One more thing.', 78, 498 + 12 * (1 - eo(pause / 0.14)), {
      size: 92, fam: F.disp, w: 700, c: chapterInk, a });
  }
  card(Q(S, 3, 'Leave orbit', 5.2), 'live.trureturing.org', ['THE OMEGA INSTITUTE', '(INDEPENDENT)']);
  card(Q(S, 5, 'Over 223,231', 5.65), '6.02M LINES', ['223,231 FROZEN', 'LEAN 4 THEOREMS']);
  card(Q(S, 6, '720 hours straight', 7.95), '720 HOURS', ['2,278 LITERATURE PROBLEMS', '684 FROM JOURNALS'], { size: 44 });
  card(Q(S, 7, 'Same models.', 2.75), 'SAME MODELS.', ['RADICALLY DIFFERENT RESULTS.'], { size: 46 });
};

const kernelGid = 'D5/S3/ConceptDynamics/InformationEscape/CatalogKernel.jointKernel_antitone';
const noveltyGid = 'D5/S3/ConceptDynamics/InformationEscape/StructuralNovelty.lowersEscape_iff_not_mem_semanticClosureWithout';
const fredkinGid = 'D5/S3/Quantum/Entanglement/FredkinEntanglingPowerRefutation.result';

function proof(p, gid, rows, y) {
  if (leanCite(gid)?.kind === 'theorem') {
    card(p, 'LEAN ✓', rows, { right: true, y, size: 30, family: F.mono, kind: 'lean' });
  }
}

SCENES.s07_proof_on_blackboard = S => {
  frame(S, 'Lean 4 / Mathematical Atlas / Mathesis', true);
  proof(Q(S, 2, 'One explicit witness', 6.75), fredkinGid,
    ['FredkinEntanglingPowerRefutation.result', '> 2.00034 ebits · sorryAx: 0'], 690);
  const ratchet = Q(S, 3, 'Two frozen theorems', 4.03);
  proof(ratchet, kernelGid, ['jointKernel_antitone'], 562);
  proof(ratchet, noveltyGid, ['lowersEscape_iff_not_mem_semanticClosureWithout'], 676);
  card(Q(S, 4, 'Replay Levent', 4.9), 'REPLAYABLE IN LEAN 4', ['8,490 PUBLIC SHARDS'], productCard);
  card(Q(S, 5, 'Explore three', 5.75), '3 BILINGUAL MONOGRAPHS', ['225 OPEN MATHESIS PAPERS'], productCard);
  card(Q(S, 6, 'Verified truth', 5.55), 'OPEN · OPEN FRONTIERS MARKED RED', ['ERH · GRAND RH · ZERO SIMPLICITY'],
    { ...productCard, kind: 'open' });
};

function codaTitle(p) {
  card(p, '面向未来的造物', ['Build for What', 'Comes Next'], { y: 108, size: 65 });
}

SCENES.s08_build_for_what_comes_next = S => {
  frame(S, 'Marina Bay / the observatory');
  codaTitle(Q(S, 0, 'Now pull back', 4.35));
  card(Q(S, 1, 'Intelligence is becoming abundant', 9.8), 'INTELLIGENCE IS ABUNDANT.', ['TRUST IS WHAT', 'WE BUILD NEXT.']);
  card(Q(S, 3, 'Step into Street Corner', 3.7), 'Street Corner', ['Dec 17 · 16:00 SGT']);
  card(Q(S, 4, 'Audit any theorem', 7.08), 'live.trureturing.org', ['nyxid.ai', 'contact@chrono-ai.fun'], { size: 44 });
  codaTitle(Q(S, 5, 'Pick up the chalk', 5.6));
};

FILM.poster = () => {
  plate('s08_build_for_what_comes_next.jpg', aperture, { zoomTo: 1, vignette: 0 });
  fillBox(0, 0, W, 66, obsidian);
  txt(company + ' · Singapore', 75, 40, { size: 23, fam: F.mono, c: chapterInk });
  txt(institute, W - 75, 40, { size: 23, fam: F.mono, c: chapterInk, align: 'right' });
  codaTitle(0.5);
};
