/* Live captures occupy the full aperture. All editorial motion is sampled from
   the measured narration clock, including the entrance, hold and exit of each cue. */
FILM.defaultPolarity = 'daylight';
FILM.cinemaSubtitles = true;
FILM.hud = false;

const polarities = {
  s01_cold_open_hook: 'daylight',
  s02_office_through_glass_to_stadium: 'daylight',
  s03_bay_mbs_night_to_orbit_warp: 'dual-split',
  s04_omega_stations_radar_dive: 'deep-space',
  s05_lean_kernel_anvil_live: 'deep-space',
  s06_red_ink_honesty_rh: 'deep-space',
  s07_vehicle_nyxid_zero_secret: 'daylight',
  s08_ornn_cma_heca_live_montage: 'daylight',
  s09_unfinished_steel_workbench: 'daylight',
  s10_nine_ai_employees_live_ops: 'daylight',
  s11_unified_world_return_flight: 'dual-split',
  s12_coda_pick_up_the_chalk: 'dual-split'
};
for (const [id, polarity] of Object.entries(polarities)) {
  FILM.polarity[id] = polarity;
  FILM.alphaScenes[id] = true;
}

const aperture = { x: 0, y: 0, w: W, h: H };
const leftMargin = 84;
const rightMargin = W - leftMargin;
const telemetryY = 782;
const company = 'ChronoAI Pte. Ltd.';
const observatory = 'The Omega Institute';
const englishNumber = new Intl.NumberFormat('en');
const kernelGid = 'D5/S3/ConceptDynamics/InformationEscape/CatalogKernel.jointKernel_antitone';
const noveltyGid = 'D5/S3/ConceptDynamics/InformationEscape/StructuralNovelty.lowersEscape_iff_not_mem_semanticClosureWithout';
const fredkinGid = 'D5/S3/Quantum/Entanglement/FredkinEntanglingPowerRefutation.result';

function reel(S, maker, source, productMix = 0, productPlate = false) {
  plate(S.id + '.jpg', aperture, { zoomTo: 1, vignette: 0 });
  // Product captures have their own captions below the app window. Give the
  // bilingual subtitle band its own matte during those shots and their dissolves.
  const matte = alphaScene(S.id) ? productMix : Number(productPlate);
  fillBox(0, 916, W, H - 916, pal(scenePolarity(S.id)).bg, matte);
  cinemaFrame(S, {
    barHeight: 40, leftLabel: maker, chapterLabel: sceneName(S.id),
    rightLabel: String(S.i + 1).padStart(2, '0') + ' / 12',
    slateLeft: source, slateRight: '2026 · 11 · 28'
  });
}

// The argument is a complete cue window (0…1), not an indefinitely latched trigger.
function envelope(p) {
  return ease(p / 0.11) * ease((1 - p) / 0.16);
}

function titleBeat(p, kicker, title) {
  const a = envelope(p);
  if (a <= 0) return;
  const inMotion = 1 - eo(p / 0.13);
  const x = leftMargin - 34 * inMotion, y = 142;
  const w = Math.max(tw(title, 57, F.disp, 700), tw(kicker, 18, F.mono, 600, 2)) + 64;
  const wash = ctx.createLinearGradient(x, y, x + w + 36, y);
  wash.addColorStop(0, rgba(C.bg, 0.88));
  wash.addColorStop(0.82, rgba(C.bg, 0.70));
  wash.addColorStop(1, rgba(C.bg, 0));
  fillBox(x, y, w + 36, 110, wash, a);
  fillBox(x, y, 3, 110 * eo(p / 0.15), C.white, a);
  txt(kicker, x + 24, y + 29, { size: 18, fam: F.mono, ls: 2, w: 600, c: C.white, a });
  txt(title, x + 22, y + 87 + 8 * inMotion, { size: 57, fam: F.disp, w: 700, c: C.white, a });
}

function telemetry(p, label, options = {}) {
  const a = envelope(p);
  if (a <= 0) return;
  const { side = 'left', kind, y = telemetryY } = options;
  const size = 22, width = tw(label, size, F.mono, 700, 1) + 44;
  const slide = 14 * (1 - eo(p / 0.14));
  const x = side === 'right' ? rightMargin - width + slide : leftMargin - slide;
  pill(x, y, label, { size, w: width, h: 48, polarity: 'deep-space', kind, a });
}

function meter(p, amount, measure, side = 'left') {
  const a = envelope(p);
  if (a <= 0) return;
  const value = englishNumber.format(Math.round(amount * eo(p / 0.25)));
  const numberWidth = tw(englishNumber.format(amount), 43, F.disp, 700);
  const width = numberWidth + tw(measure, 20, F.mono, 600, 1) + 76;
  const x = side === 'right' ? rightMargin - width : leftMargin, y = telemetryY - 8;
  glassCard(x, y, width, 63, a, { fill: rgba(C.bg, 0.76), border: rgba(C.white, 0.50),
    radius: 14, topRule: false, polarity: 'deep-space' });
  txt(value, x + 19 + numberWidth, y + 44, { size: 43, fam: F.disp, w: 700, align: 'right', a });
  txt(measure, x + numberWidth + 41, y + 40, { size: 20, fam: F.mono, ls: 1, w: 600, a });
}

function theoremBeat(p, gid, label) {
  if (leanCite(gid)?.kind === 'theorem') {
    telemetry(p, 'LEAN ✓   ' + label, { kind: 'lean', side: 'right', y: 116 });
  }
}

SCENES.s01_cold_open_hook = S => {
  const productCut = (S.u >= 9 && S.u < 10.5) || (S.u >= 12 && S.u < 13.5);
  reel(S, company, 'Singapore office', Number(productCut));
  titleBeat(Q(S, 0, 'Zero cameras', 2.6), 'SINGAPORE', 'Zero cameras.');
  meter(Q(S, 1, 'five hundred thirty-nine', 4.6), 539, 'REPOSITORIES');
  titleBeat(at(S, 2, 2.5), 'COLD OPEN', 'Execution at zero.');
};

SCENES.s02_office_through_glass_to_stadium = S => {
  reel(S, company, 'Donna reception  /  Tide Arena');
  meter(Q(S, 0, 'Eighteen flower mats', 3.8), 18, 'FLOWER MATS');
  telemetry(Q(S, 0, 'zero dropped seats', 3.5), '13 requests   /   0 dropped seats', { side: 'right' });
  meter(Q(S, 1, 'four floating stands', 6.5), 1108, 'TIDE ARENA SEATS', 'right');
  meter(at(S, 2, 5), 141624, 'COMMITS IN 60 DAYS');
};

SCENES.s03_bay_mbs_night_to_orbit_warp = S => {
  reel(S, company, 'chrono-metaverse  /  Marina Bay to Earth orbit');
  telemetry(Q(S, 0, 'Marina Bay Sands', 4.3), 'Marina Bay Sands   /   Singapore');
  meter(Q(S, 1, 'orbital screen', 4.6), 5307, 'KM  /  ORBITAL SCREEN', 'right');
  titleBeat(Q(S, 2, "Earth's atmosphere", 2.6), 'OUTBOUND', 'Escape velocity');
};

SCENES.s04_omega_stations_radar_dive = S => {
  reel(S, observatory, 'live.trureturing.org');
  titleBeat(Q(S, 0, 'independent research observatory', 2.7), 'THE OMEGA INSTITUTE', 'Eight stations');
  meter(Q(S, 1, 'eight spiral galaxies', 5.1), 19022, 'TRUTH NODES', 'right');
  meter(Q(S, 2, 'frozen Lean four theorems', 4.9), 223231, 'FROZEN THEOREMS');
};

SCENES.s05_lean_kernel_anvil_live = S => {
  reel(S, observatory, 'trureturing.org  /  Lean 4 kernel  /  books.trureturing.org', clamp((S.u - 6) / 0.5), true);
  titleBeat(at(S, 0, 2.6), 'THE LEAN KERNEL', 'Inspect the chalk.');
  theoremBeat(Q(S, 1, 'One explicit witness', 7), fredkinGid, 'Fredkin witness · 2.00034 ebits');
  telemetry(Q(S, 1, '#print axioms', 5.8), 'propext · Classical.choice · Quot.sound');
  telemetry(Q(S, 2, "Feynman's tiny ratchet", 4.5), 'ANALOGY   Ratchet and pawl', { kind: 'amber' });
  theoremBeat(Q(S, 2, 'truth narrows illusion', 2.7), kernelGid, 'Catalog kernel · antitonicity');
  theoremBeat(Q(S, 2, 'old knowledge', 3.0, 0.82), noveltyGid, 'Structural novelty · semantic closure');
};

SCENES.s06_red_ink_honesty_rh = S => {
  reel(S, observatory, 'Mathesis  /  Riemann Hypothesis replay', clamp((25 - S.u) / 0.6), true);
  meter(Q(S, 0, 'scholars contacted', 4.1), 1049, 'SCHOLARS CONTACTED');
  meter(at(S, 1, 4.4), 225, 'OPEN PAPERS', 'right');
  telemetry(Q(S, 1, 'formal peer-review acceptances', 5.4), '0 formal peer-review acceptances', { kind: 'open' });
  telemetry(Q(S, 2, 'Levent Alpöge', 5.7), 'Levent Alpöge   /   Nov 20');
  meter(Q(S, 2, 'Omega built', 4.6), 8490, 'REPLAY SHARDS', 'right');
  telemetry(Q(S, 2, 'Extended RH', 6.2), 'OPEN   Extended RH · Grand RH · zero simplicity · pair correlation',
    { kind: 'open', side: 'right' });
};

SCENES.s07_vehicle_nyxid_zero_secret = S => {
  reel(S, company, 'nyxid.ai  /  scoped access and revocation', 1, true);
  telemetry(Q(S, 0, 'engine by the token', 5), 'ANALOGY   The rented engine', { kind: 'amber', side: 'right' });
  titleBeat(Q(S, 1, 'complete vehicle', 2.6), 'NYXID', 'The complete vehicle');
  telemetry(Q(S, 1, 'hotel keycard', 4.4), 'ANALOGY   Room 412 · until noon', { kind: 'amber' });
  telemetry(Q(S, 2, 'one-command revocation', 4.6), 'HTTP 200   →   revoke   →   401', { side: 'right' });
};

SCENES.s08_ornn_cma_heca_live_montage = S => {
  reel(S, company, 'Ornn  /  CMA  /  heca  /  chrono-harness', 1, true);
  meter(Q(S, 0, 'Ornn turns', 5), 163, 'SCANNED SKILLS', 'right');
  telemetry(Q(S, 1, 'isolated sandboxes', 4.5), 'CMA   /   2.1 s hot reload', { side: 'right' });
  meter(Q(S, 1, 'local canvas heca', 5), 27, 'HECA INTEGRATIONS');
  meter(Q(S, 2, 'executable Rust judges', 4.8), 540, 'VERUS PROOFS', 'right');
};

SCENES.s09_unfinished_steel_workbench = S => {
  reel(S, company, 'Blueprint Tide Arena  /  engineering boundaries');
  titleBeat(at(S, 0, 2.6), 'BLUEPRINT', 'Unfinished steel');
  telemetry(Q(S, 0, "heca's source is still private", 2.9), 'heca   /   private source');
  telemetry(Q(S, 0, 'one primary coding runtime', 3.7), 'CMA   /   one primary runtime', { side: 'right' });
  telemetry(Q(S, 0, 'completeness proven', 4.5), 'chrono-harness   /   completeness_proven: false');
};

SCENES.s10_nine_ai_employees_live_ops = S => {
  reel(S, company, 'AI Team Work Ledger  /  Launch Arena  /  Donna reception', clamp((40 - S.u) / 0.5), true);
  meter(Q(S, 0, 'nine disciplined roles', 5.8), 102, 'OF 120 WORKFLOWS', 'right');
  telemetry(Q(S, 1, 'knocked HR down', 4.2), 'HR coverage   15 → 14 / 20');
  telemetry(Q(S, 1, 'four human taps', 4.1), '11 / 12 on first try   ·   4 human taps', { side: 'right' });
  telemetry(Q(S, 1, 'stalled sixty-five minutes', 4.2), 'NyxID #2534   /   65 min stall · 3 min bypass');
  telemetry(at(S, 2, 5), 'External paying merchants   /   0', { side: 'right' });
};

SCENES.s11_unified_world_return_flight = S => {
  reel(S, 'The Omega Institute  /  ChronoAI Pte. Ltd.', 'Observatory  /  Earth orbit  /  Tide Arena');
  titleBeat(at(S, 0, 2.7), 'INBOUND', 'Return flight');
  telemetry(Q(S, 0, 'Earth orbit', 4.3), 'Earth orbit   →   Marina Bay', { side: 'right' });
  titleBeat(Q(S, 1, 'never fool yourself', 2.6), 'FEYNMAN', 'Never fool yourself.');
  telemetry(Q(S, 2, 'open seams', 3), 'Tide Arena   /   Singapore');
};

SCENES.s12_coda_pick_up_the_chalk = S => {
  reel(S, 'ChronoAI Pte. Ltd.  /  The Omega Institute', 'Street Corner  /  live.trureturing.org');
  telemetry(Q(S, 0, 'Street Corner', 5.4), 'Street Corner   /   Dec 17 · 16:00 SGT');
  telemetry(Q(S, 0, 'green theorem', 4.3), 'live.trureturing.org', { side: 'right' });
  telemetry(Q(S, 0, 'write to contact', 4.1), 'contact@chrono-ai.fun');
  titleBeat(Q(S, 1, 'Pick up the chalk', 2.8), '面向未来的造物', 'Pick up the chalk.');
};

FILM.poster = () => {
  plate('s12_coda_pick_up_the_chalk.jpg', aperture, { zoomTo: 1, vignette: 0 });
  const shade = ctx.createLinearGradient(0, 480, 0, H);
  shade.addColorStop(0, rgba(C.bg, 0));
  shade.addColorStop(0.64, rgba(C.bg, 0.76));
  shade.addColorStop(1, rgba(C.bg, 0.97));
  fillBox(0, 480, W, H - 480, shade, 1);
  fillBox(960, 0, 2, H, C.white, 0.80);
  const label = { size: 22, fam: F.mono, w: 600, c: C.white, ls: 2 };
  txt('2026   /   VIRTUAL LAUNCH', 76, 700, label);
  txt('Build for what', 70, 803, { size: 97, fam: F.disp, w: 700 });
  txt('comes next.', 70, 906, { size: 97, fam: F.disp, w: 700 });
  txt('面向未来的造物', 1032, 800, { size: 74, fam: F.zh, w: 700 });
  txt('Pick up the chalk.', 1030, 904, { size: 66, fam: F.disp, w: 700 });
  line(76, 954, 889, 954, C.white, 0.55, 1);
  line(1032, 954, 1842, 954, C.white, 0.55, 1);
  txt('ChronoAI Pte. Ltd.  /  Marina Bay', 76, 1005, label);
  txt('The Omega Institute  /  Observatory', 1032, 1005, label);
};
