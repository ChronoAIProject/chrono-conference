/* trureturing books · film engine (theme/film/engine.js)
   Adapted from the trureturing-film engine (films/<NNN>-<name>/engine.js, Apache-2.0, the-omega-institute).

   Deterministic 1920×1080 Canvas renderer: window.renderAt(t) draws the frame at time t (seconds) as a pure
   function of t, so frames can be captured in parallel and re-rendered identically. theme/film/build.py writes
   <film>/out/index.html with, in order:
     window.FILM_TOKENS  { film, font, sem }   palette and font stacks from theme/generated/tokens.mjs
     window.DATA         { timeline, film, book, lean, pin, names, strings, data, fonts, fontText }
     this file, then the film's scenes.js (SCENES.<scene id> = S => { … }), then `window.ready = boot()`.

   Colour semantics (theme/tokens.json "semantic"): C.lean (green) only for Lean-verified results, C.now
   (amber) for the current focus, C.open (red) for open problems, C.argued (violet) for argued claims that the
   kernel has not checked. Editorial elements use neutral ink and optical glass. */
'use strict';

const W = 1920, H = 1080, TAU = Math.PI * 2;
const DATA = window.DATA;
const TL = DATA.timeline;
const FPS = (DATA.film && DATA.film.fps) || 30;
const TOK = window.FILM_TOKENS || {};
const cv = document.getElementById('c');
// Keep Chromium's raster path stable when frame capture interleaves drawing and readback.
const ctx = cv.getContext('2d', { willReadFrequently: false });

/* ---------- palette and fonts (from the design tokens) ---------- */
const DEEP_SPACE = {
  bg: '#05080E', surface: '#0A101B', panel: 'rgba(10, 16, 27, 0.84)',
  edge: 'rgba(255, 255, 255, 0.14)', edgeHot: 'rgba(148, 163, 184, 0.36)',
  ink: '#F1F5F9', dim: '#94A3B8', faint: '#475569', accent: '#7DD3FC',
  secondary: '#CBD5E1', lean: '#34D399', open: '#F87171', amber: '#FBBF24', argued: '#A78BFA'
};
const DAYLIGHT = {
  bg: '#F4F1EE', surface: '#F9F7F5', panel: 'rgba(249, 247, 245, 0.90)',
  edge: '#D5CFC9', edgeHot: '#ABA39B', ink: '#1A1A1A', dim: '#57524C',
  faint: '#9A938C', accent: '#1A1A1A', secondary: '#5C5752', lean: '#0D6E4C',
  open: '#C92A2A', amber: '#B4690E', argued: '#6D28D9'
};
// dayBg was introduced with Scheme B. Older generated bundles still carry the neon aliases.
const filmTokens = TOK.film || {};
const legacyTokens = !filmTokens.dayBg && filmTokens.bg?.toLowerCase() === '#010208';
const optics = legacyTokens ? {} : filmTokens;
const semantics = legacyTokens ? {} : TOK.sem || {};
const POLARITY = {
  daylight: { ...DAYLIGHT, bg: optics.dayBg || DAYLIGHT.bg, surface: optics.daySurface || DAYLIGHT.surface,
    edge: optics.dayEdge || DAYLIGHT.edge, ink: optics.dayInk || DAYLIGHT.ink, accent: optics.dayInk || DAYLIGHT.accent,
    dim: optics.dayDim || DAYLIGHT.dim, lean: optics.dayOk || DAYLIGHT.lean, open: optics.dayWarn || DAYLIGHT.open,
    amber: optics.dayAmber || DAYLIGHT.amber },
  'deep-space': { ...DEEP_SPACE, bg: optics.bg || DEEP_SPACE.bg, ink: optics.white || DEEP_SPACE.ink,
    dim: optics.dim || DEEP_SPACE.dim, accent: optics.cyan || DEEP_SPACE.accent, secondary: optics.mag || DEEP_SPACE.secondary,
    lean: semantics.lean || optics.green || DEEP_SPACE.lean, open: semantics.open || optics.red || DEEP_SPACE.open,
    amber: semantics.now || optics.gold || DEEP_SPACE.amber, argued: semantics.argued || optics.vio || DEEP_SPACE.argued }
};
function pal(mode) { return mode === 'daylight' ? POLARITY.daylight : POLARITY['deep-space']; }
const dark = pal('deep-space');
const C = { ...filmTokens, ...dark, white: dark.ink, cyan: dark.accent, mag: dark.secondary,
  vio: dark.argued, green: dark.lean, red: dark.open, gold: dark.amber, now: dark.amber,
  blue: optics.blue || '#38BDF8', orange: optics.orange || '#FB923C' };
const GENERIC = /^(serif|sans-serif|monospace|system-ui|ui-monospace|cursive|fantasy)$/;
/* `local` names fonts present on the Linux render machines (not design tokens); they go before the generic family. */
function stack(list, local = []) {
  const named = list.filter(f => !GENERIC.test(f)), generic = list.filter(f => GENERIC.test(f));
  return [...new Set([...named, ...local, ...generic])].map(f => (GENERIC.test(f) ? f : `"${f}"`)).join(', ');
}
const fonts = TOK.font || {};
const F = {
  orb: stack(fonts['film-display'] || [], ['DejaVu Sans']),
  raj: stack(fonts['film-subtitle'] || [], ['DejaVu Sans']),
  disp: stack(fonts.display || [], ['DejaVu Sans']),
  mono: stack(fonts.data || [], ['DejaVu Sans Mono']),
  zh: stack(fonts.body || [], ['Noto Sans CJK SC', 'WenQuanYi Zen Hei', 'DejaVu Sans']),
  math: stack(['DejaVu Sans'].concat(fonts.data || []), ['FreeSerif'])
};
const STR = DATA.strings || { zh: {}, en: {} };

/* ---------- math & randomness ---------- */
const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
const lerp = (a, b, x) => a + (b - a) * x;
const ease = x => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const eo = x => { x = clamp(x); return 1 - Math.pow(1 - x, 3); };
const ei = x => { x = clamp(x); return x * x * x; };
function rnd(i, j = 0) { const x = Math.sin(i * 127.1 + j * 311.7 + 17.13) * 43758.5453; return x - Math.floor(x); }
function hexrgb(hex) { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
const rgba = (hex, a) => { const [r, g, b] = hexrgb(hex); return `rgba(${r},${g},${b},${a})`; };
/* mix two palette colours (k = 0 → a, 1 → b) */
function mix(a, b, k) { const p = hexrgb(a), q = hexrgb(b); return '#' + p.map((v, i) => Math.round(lerp(v, q[i], k)).toString(16).padStart(2, '0')).join(''); }
function rotY(p, a) { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c]; }
function rotX(p, a) { const c = Math.cos(a), s = Math.sin(a); return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c]; }
function rotZ(p, a) { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]; }
function proj(p, cx = W / 2, cy = H / 2, fov = 900, camZ = 5) {
  const z = p[2] + camZ; const k = fov / Math.max(z, 0.05);
  return [cx + p[0] * k, cy + p[1] * k, k, z];
}

/* ---------- scene timing ---------- */
/* SC[id] = { i, start, end, lines: [{ s, e, en, zh }] } with line times relative to the scene start. */
const SC = {};
TL.scenes.forEach((s, i) => {
  SC[s.id] = Object.assign({}, s, {
    i, lines: TL.lines.filter(l => l.scene === s.id).map(l => ({ s: l.start - s.start, e: l.end - s.start, en: l.en, zh: l.zh }))
  });
});
function lineAt(S, k) { return S.L[k] || { s: 1e9, e: 1e9, en: '', zh: '' }; }
/* progress (0→1) of a phase starting at line k plus `off` seconds, lasting `dur` seconds */
function at(S, k, dur = 1, off = 0) { return clamp((S.u - lineAt(S, k).s - off) / dur); }
function sinceStart(S, off, dur) { return clamp((S.u - off) / dur); }
/* progress from the moment `phrase` is spoken in line k (estimated by its character offset), plus `delay` */
const _phrase = new Map();
function phraseAt(S, k, phrase) {
  const L = lineAt(S, k); if (!L.en) return 1e9;
  const key = S.id + '|' + k + '|' + phrase; let off = _phrase.get(key);
  if (off == null) {
    const i = phrase ? L.en.indexOf(phrase) : 0;
    if (i < 0) phraseMissing(S, k, phrase);
    off = i < 0 ? 0 : i / L.en.length * (L.e - L.s); _phrase.set(key, off);
  }
  return L.s + off;
}
/* A phrase line k does not contain: timing falls back to the start of the line. A page error under FILM_STRICT=1 (the
   build), else a console warning; theme/film/build.py and ./tbook check report the literal ones before any render. */
function phraseMissing(S, k, phrase) {
  const msg = `film: SCENES.${S.id}: line ${k} of scene ${S.id} does not contain the phrase ${JSON.stringify(phrase)}; ` +
    'its timing falls back to the start of the line';
  if (DATA.strict) window.FILM_ERRORS.push(msg); else console.warn(msg);
}
function Q(S, k, phrase, dur = 0.5, delay = 0) { return clamp((S.u - phraseAt(S, k, phrase) - delay) / dur); }

/* ---------- offscreen resources ---------- */
function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
const pearl = {};
const PEARLS = { c: 'cyan', m: 'mag', g: 'gold', w: 'white', o: 'orange', r: 'red', v: 'vio', n: 'green', b: 'blue' };
function buildResources() {
  for (const [name, key] of Object.entries(PEARLS)) {
    const p = mk(64, 64), px = p.getContext('2d');
    const gr = px.createRadialGradient(26, 26, 1, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.18, rgba(C[key], 0.95));
    gr.addColorStop(0.5, rgba(C[key], 0.35)); gr.addColorStop(1, rgba(C[key], 0));
    px.fillStyle = gr; px.fillRect(0, 0, 64, 64); pearl[name] = p;
  }
}

/* ---------- drawing helpers ---------- */
function font(w, size, fam) { ctx.font = `${w} ${size}px ${fam}`; }
/* text: o = { size, fam, w, c, a, align, base, ls (letter spacing px) }. */
function txt(s, x, y, o = {}) {
  const size = o.size || 28, fam = o.fam || F.mono, w = o.w || 400, a = o.a == null ? 1 : o.a;
  if (a <= 0.003 || s === '' || s == null) return;
  ctx.save();
  font(w, size, fam); ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.base || 'alphabetic';
  ctx.letterSpacing = (o.ls || 0) + 'px';
  ctx.globalAlpha = a; ctx.fillStyle = o.c || C.white; ctx.fillText(s, x, y);
  ctx.restore();
}
function tw(s, size, fam, w = 400, ls = 0) { ctx.save(); font(w, size, fam); ctx.letterSpacing = ls + 'px'; const m = ctx.measureText(s).width; ctx.restore(); return m; }
const GLY = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#$%&@∀∃λ→↔¬∧∨⊢ℕℝ∑∏φ⟨⟩≤≥≠';
/* decode-in effect: characters settle left to right as p goes 0 → 1 */
function scramble(str, p, seed = 0) {
  let out = '';
  for (let i = 0; i < str.length; i++) {
    const th = 0.15 + 0.45 * (i / Math.max(1, str.length)) + 0.25 * rnd(i, seed);
    if (str[i] === ' ' || p >= th) out += str[i];
    else if (p > th - 0.35) out += GLY[Math.floor(rnd(i + Math.floor(p * 40), seed + 3) * GLY.length)];
    else out += ' ';
  }
  return out;
}
function typed(str, p) { return str.slice(0, Math.floor(clamp(p) * str.length)); }
function line(x1, y1, x2, y2, col, a = 1, w = 1.5) {
  if (a <= 0) return;
  ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = w;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.globalAlpha = 1;
}
function dashed(x1, y1, x2, y2, col, a, w = 2) { if (a <= 0) return; ctx.save(); ctx.setLineDash([10, 9]); line(x1, y1, x2, y2, col, a, w); ctx.restore(); }
function arrow(x1, y1, x2, y2, col, a, w = 2.5) {
  if (a <= 0) return;
  line(x1, y1, x2, y2, col, a, w);
  const an = Math.atan2(y2 - y1, x2 - x1), L = 14;
  line(x2, y2, x2 - L * Math.cos(an - 0.4), y2 - L * Math.sin(an - 0.4), col, a, w);
  line(x2, y2, x2 - L * Math.cos(an + 0.4), y2 - L * Math.sin(an + 0.4), col, a, w);
}
function ring(x, y, r, col, a, lw = 2) { if (a <= 0) return; ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.globalAlpha = 1; }
function fillBox(x, y, w, h, col, a) { if (a <= 0) return; ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(x, y, w, h); ctx.globalAlpha = 1; }
function cornerTicks(x, y, w, h, k) {
  ctx.beginPath();
  ctx.moveTo(x, y + k); ctx.lineTo(x, y); ctx.lineTo(x + k, y);
  ctx.moveTo(x + w - k, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + k);
  ctx.moveTo(x + w, y + h - k); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - k, y + h);
  ctx.moveTo(x + k, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - k);
  ctx.stroke();
}
/* rectangle with heavier corner brackets (the trureturing-film panel frame) */
function box(x, y, w, h, col, a = 1, lw = 1.5, fill = null) {
  if (a <= 0.003) return;
  ctx.globalAlpha = a;
  if (fill) { ctx.fillStyle = fill; ctx.fillRect(x, y, w, h); }
  ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.strokeRect(x, y, w, h);
  const k = Math.min(18, w / 4, h / 4); ctx.lineWidth = lw * 2.2;
  cornerTicks(x, y, w, h, k);
  ctx.globalAlpha = 1;
}
/* Rectangle path retained as the public helper used by older scene scripts. */
function cutPath(x, y, w, h) {
  ctx.beginPath(); ctx.rect(x, y, w, h);
}
/* Swiss architectural translucent card with a clean header strip and small corner ticks. */
function panel(x, y, w, h, a, col, title = null, o = {}) {
  if (a <= 0.003) return;
  const p = paletteAt(x + w / 2, o.polarity);
  const border = o.border || p.edge;
  ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = o.fill || p.panel; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = border; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  ctx.globalAlpha = a * 0.72; ctx.strokeStyle = p.edgeHot; ctx.lineWidth = 1;
  cornerTicks(x + 0.5, y + 0.5, w - 1, h - 1, Math.min(14, w / 2, h / 2));
  if (title) { ctx.globalAlpha = a * 0.08; ctx.fillStyle = col || p.secondary; ctx.fillRect(x, y, w, 32); }
  ctx.restore();
  if (title) txt(title, x + 16, y + 22, { size: 15, fam: F.mono, c: col || p.ink, a, w: 700, ls: 2 });
}
/* a framed label: centred text in a small bracketed box */
function chip(x, y, w, h, s, col, a, size = 24, fam = F.mono) {
  if (a <= 0) return;
  box(x - w / 2, y - h / 2, w, h, col, a, 2, 'rgba(0,0,0,0.5)');
  txt(s, x, y + size * 0.36, { size, fam, w: 700, align: 'center', c: col, a });
}
function dot(x, y, r, name = 'c', a = 1) {
  if (a <= 0.003 || r <= 0.2) return;
  ctx.globalAlpha = a; ctx.drawImage(pearl[name] || pearl.c, x - r, y - r, r * 2, r * 2); ctx.globalAlpha = 1;
}
/* a rubber stamp that slams in as p goes 0 → 1 */
function stamp(s, x, y, p, col = C.open, size = 64, rot = -0.08) {
  if (p <= 0) return;
  const k = 1 + 1.6 * (1 - eo(p)); const a = clamp(p * 3);
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k);
  const w = tw(s, size, F.orb, 900, 6) + 60;
  ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.strokeRect(-w / 2, -size * 0.85, w, size * 1.35);
  ctx.lineWidth = 1.5; ctx.strokeRect(-w / 2 + 9, -size * 0.85 + 9, w - 18, size * 1.35 - 18);
  ctx.restore();
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k);
  txt(s, 0, size * 0.33, { size, fam: F.orb, w: 900, c: col, a, align: 'center', ab: 3, ls: 6 });
  ctx.restore();
}
function curve(fn, n, col, a, lw = 3) {
  if (a <= 0) return;
  ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
  for (let i = 0; i <= n; i++) { const [x, y] = fn(i / n); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
  ctx.stroke(); ctx.globalAlpha = 1;
}

/* ---------- hypercubes (title cards, posters) ---------- */
function hypercube(n) {
  const V = [], E = [];
  for (let i = 0; i < (1 << n); i++) { const v = []; for (let b = 0; b < n; b++) v.push((i >> b) & 1 ? 1 : -1); V.push(v); }
  for (let i = 0; i < V.length; i++) for (let b = 0; b < n; b++) { const j = i ^ (1 << b); if (j > i) E.push([i, j]); }
  return { V, E };
}
const CUBE4 = hypercube(4), CUBE5 = hypercube(5);
function rotN(v, a, b, ang) { const c = Math.cos(ang), s = Math.sin(ang); const x = v[a], y = v[b]; v[a] = x * c - y * s; v[b] = x * s + y * c; }
function projN(v0, planes, dist = 3.2) {
  const v = v0.slice();
  for (const [a, b, ang] of planes) rotN(v, a, b, ang);
  let p = v;
  while (p.length > 3) { const w = p[p.length - 1]; const k = dist / (dist - w * 0.55); p = p.slice(0, -1).map(x => x * k); }
  return p;
}
function drawHyper(cube, planes, o) {
  const P = cube.V.map(v => {
    let p = projN(v, planes, o.dist || 3.2);
    p = rotY(rotX(p, o.rx || 0), o.ry || 0);
    return proj(p.map(x => x * (o.scale || 1)), o.cx || W / 2, o.cy || H / 2, o.fov || 900, o.camZ || 6);
  });
  const a0 = o.a == null ? 1 : o.a;
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineWidth = o.lw || 2;
  for (let e = 0; e < cube.E.length; e++) {
    const [i, j] = cube.E[e]; const a = P[i], b = P[j];
    const depth = clamp((a[2] + b[2]) / 2 / 260, 0.25, 1.4);
    ctx.globalAlpha = a0 * 0.55 * depth;
    ctx.strokeStyle = (e % 3 === 0) ? (o.c2 || C.mag) : (o.c || C.cyan);
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  if (o.dots !== false) for (const p of P) dot(p[0], p[1], 5 + p[2] * 0.02, 'w', a0 * 0.9);
  ctx.globalCompositeOperation = 'source-over';
  return P;
}

/* ---------- background and film configuration ---------- */
const opticalDust = Array.from({ length: 120 }, (_, i) => [rnd(i, 1) * W, rnd(i, 2) * H, rnd(i, 4)]);
const FILM = {
  init: [], speed: {}, polarity: {}, alphaScenes: {}, defaultPolarity: 'deep-space', cinemaSubtitles: false,
  names: Object.assign({}, DATA.names || {}), poster: null, hud: true
};
let CURRENT_SCENE_ID = TL.scenes[0] && TL.scenes[0].id;
function scenePolarity(sceneId) { return FILM.polarity[sceneId] || FILM.defaultPolarity || 'deep-space'; }
function alphaScene(sceneId) { return window.ALPHA_MODE === true && FILM.alphaScenes && FILM.alphaScenes[sceneId]; }
function paletteAt(x, mode = scenePolarity(CURRENT_SCENE_ID)) {
  return pal(mode === 'dual-split' && x < W / 2 ? 'daylight' : mode);
}
const starPhase = [];
function computeStarPhase() {
  starPhase.length = 0; let acc = 0;
  for (const s of TL.scenes) { starPhase.push(acc); acc += (FILM.speed[s.id] ?? 0.02) * (s.end - s.start); }
}
function drawPolarityBackground(mode, t, x0 = 0, x1 = W) {
  const p = pal(mode);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, x1 - x0, H); ctx.clip();
  if (mode === 'daylight') {
    const g = ctx.createRadialGradient(W * 0.5, H * 0.36, 0, W * 0.5, H * 0.42, H * 0.95);
    g.addColorStop(0, '#FAF8F6'); g.addColorStop(1, '#ECE8E2');
    ctx.fillStyle = g; ctx.fillRect(x0, 0, x1 - x0, H);
    ctx.strokeStyle = p.edge; ctx.lineWidth = 1; ctx.globalAlpha = 0.035;
    for (let k = 0; k < 5; k++) {
      const xx = x0 + (x1 - x0) * (0.18 + k * 0.19), yy = 160 + k * 128;
      ctx.beginPath(); ctx.moveTo(xx - 18, yy); ctx.lineTo(xx + 18, yy); ctx.moveTo(xx, yy - 18); ctx.lineTo(xx, yy + 18); ctx.stroke();
    }
  } else {
    ctx.fillStyle = p.bg; ctx.fillRect(x0, 0, x1 - x0, H);
    const g = ctx.createRadialGradient(W * 0.48, H * 0.42, 0, W * 0.48, H * 0.42, H * 0.9);
    g.addColorStop(0, 'rgba(125,211,252,0.035)'); g.addColorStop(1, 'rgba(5,8,14,0)');
    ctx.fillStyle = g; ctx.fillRect(x0, 0, x1 - x0, H);
    ctx.strokeStyle = p.edgeHot; ctx.lineWidth = 1; ctx.globalAlpha = 0.36;
    for (let k = 0; k < 4; k++) {
      const r = 250 + k * 170, phase = t * (1 + k * 0.16) + k * 0.7;
      ctx.beginPath(); ctx.arc(W * 0.63, H * 0.47, r, phase, phase + Math.PI * 1.22); ctx.stroke();
    }
    ctx.fillStyle = p.secondary;
    for (const [x, y, luminance] of opticalDust) {
      ctx.globalAlpha = 0.025 + luminance * 0.045;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  ctx.restore();
}
function background(t, sc, si, u) {
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  CURRENT_SCENE_ID = sc.id;
  if (alphaScene(sc.id)) { ctx.clearRect(0, 0, W, H); return; }
  const mode = scenePolarity(sc.id);
  const phase = (starPhase[si] || 0) + (FILM.speed[sc.id] ?? 0.02) * u;
  if (mode === 'dual-split') {
    drawPolarityBackground('daylight', phase, 0, W / 2);
    drawPolarityBackground('deep-space', phase, W / 2, W);
    line(W / 2 + 0.5, 0, W / 2 + 0.5, H, pal('daylight').edge, 1, 1);
  } else drawPolarityBackground(mode, phase);
}
/* restrained architectural perspective grid below the horizon hy */
function grid(t, a = 0.5, hy = H * 0.64, col, speed = 0.3) {
  if (a <= 0) return;
  const mode = scenePolarity(CURRENT_SCENE_ID);
  const p = pal(mode);
  let stroke = mode === 'daylight' ? p.ink : p.dim;
  if (mode === 'dual-split') {
    stroke = ctx.createLinearGradient(0, 0, W, 0);
    stroke.addColorStop(0.5, pal('daylight').ink);
    stroke.addColorStop(0.5, pal('deep-space').dim);
  }
  ctx.save(); ctx.globalAlpha = Math.min(0.18, a * 0.18); ctx.strokeStyle = stroke; ctx.lineWidth = 1;
  for (let i = -12; i <= 12; i++) {
    ctx.beginPath(); ctx.moveTo(W / 2 + i * 24, hy); ctx.lineTo(W / 2 + i * 210, H); ctx.stroke();
  }
  const ph = ((t * speed) % 1 + 1) % 1;
  for (let k = 0; k < 12; k++) {
    const depth = (k + ph) / 12, y = hy + (H - hy) * depth * depth;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  ctx.restore();
}

/* ---------- solid shots: lit solids drawn by the modelling core of the visualizations ---------- */
/* A film whose film.json says "solid": true gets theme/viz/solid-core.js (and the pinned three.js it imports) next to
   its page; boot() imports it and makes one WebGL renderer on an offscreen canvas (pixel ratio 1, antialiasing on, a
   fixed size per shot). solid(key, rect) returns the shot `key`: the primitives of kit.solid (surface, poly, glass,
   tube, line, arrow, ring, bead, fan) between begin() and end(a); end() draws the solid synchronously and composites it
   into the frame with drawImage, so whatever the scene draws after it (labels, panels, chips, stamps) and the
   subtitles lie on top. p(v) / anchor(v) project a world point to frame pixels; anchor(v).hidden is true when a
   surface or polyhedron of the shot is in front of it. No clock, animation loop or randomness: the frame stays a pure
   function of t. Without WebGL the page fails to boot (no fallback), so a film with solid shots never renders blind. */
const SOLID = { core: null, renderer: null, shots: new Map() };
const SOLID_PALETTE = { stage: C.bg, ink: C.white, cyan: C.cyan, magenta: C.mag, violet: C.vio, amber: C.now, dim: C.dim,
  lean: C.lean, blue: C.blue, orange: C.orange };
async function solidInit() {
  const id = (DATA.film && DATA.film.id) || 'film';
  try {
    SOLID.core = await import(new URL(DATA.solid.core, location.href).href);
  } catch (e) {
    throw new Error(`film ${id}: cannot load the modelling core ${DATA.solid.core} (${e && e.message})`);
  }
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2', { antialias: true, alpha: true, preserveDrawingBuffer: true });
  if (!gl) throw new Error(`film ${id} has solid shots ("solid": true in film.json) but this browser cannot create a WebGL ` +
    'context: run Chromium with WebGL enabled (theme/film/lib.js starts it with SwiftShader, ' +
    '--enable-unsafe-swiftshader; ./tbook doctor checks it); there is no fallback');
  SOLID.renderer = SOLID.core.createRenderer(canvas, { pixelRatio: 1 });
}
function makeShot(key) {
  const sc = SOLID.core.createScene({ palette: SOLID_PALETTE });
  const sh = { key, x: 0, y: 0, w: 1, h: 1, scene: sc };
  for (const name of ['surface', 'poly', 'glass', 'tube', 'line', 'arrow', 'ring', 'bead', 'fan']) sh[name] = (...a) => sc[name](...a);
  sh.begin = () => { sc.begin(); return sh; };
  /* draw the solid now and composite it at the shot's rectangle with opacity a */
  sh.end = (a = 1) => {
    sc.end(); sc.render(SOLID.renderer);
    if (a > 0.003) { ctx.save(); ctx.globalAlpha = a; ctx.drawImage(SOLID.renderer.domElement, sh.x, sh.y, sh.w, sh.h); ctx.restore(); }
    return sh;
  };
  /* world point → [x, y, depth] in frame pixels */
  sh.p = v => { const q = sc.p(v); return [sh.x + q[0], sh.y + q[1], q[2]]; };
  sh.occluded = (v, eps = 0.02) => sc.occluded(v, eps);
  /* where a 2D label should go: { x, y, depth, hidden } (hidden: a solid of this shot is in front of the point) */
  sh.anchor = (v, eps = 0.02) => { const q = sh.p(v); return { x: q[0], y: q[1], depth: q[2], hidden: sc.occluded(v, eps) }; };
  sh.marks = () => sc.marks().map(m => Object.assign(m, { x: sh.x + m.x, y: sh.y + m.y }));
  return sh;
}
/* solid(key, { x, y, w, h, yaw, pitch, zoom, radius | unit, cx, cy, lw }) → the shot, its camera set for this frame.
   x, y, w, h: the rectangle in the 1920×1080 frame; the camera options are those of kit.solid / kit.stage3. */
function solid(key, o = {}) {
  if (!SOLID.renderer) throw new Error(`solid('${key}'): this film has no solid shots; set "solid": true in film.json`);
  let sh = SOLID.shots.get(key);
  if (!sh) { sh = makeShot(key); SOLID.shots.set(key, sh); }
  sh.x = Math.round(o.x || 0); sh.y = Math.round(o.y || 0); sh.w = Math.round(o.w || W); sh.h = Math.round(o.h || H);
  sh.scene.camera(Object.assign({}, o, { W: sh.w, H: sh.h }));
  return sh;
}

/* ======================================================================= */
/*                     SCENES (registered by scenes.js)                    */
/* ======================================================================= */
const SCENES = {};
/* the safe area for scene content: clear of the HUD (top) and the subtitles (bottom) */
const SAFE = { x0: 120, x1: W - 120, y0: 165, y1: 840 };

/* Status banner, top centre. kind: lean (green) | open (red) | argued / theory (violet) | computed (cyan). */
const BADGES = {
  lean: ['badge_lean', 'lean', 'LEAN ✓'],
  open: ['badge_open', 'open', 'OPEN'],
  argued: ['badge_argued', 'argued', 'ARGUED'],
  theory: ['badge_argued', 'argued', 'ARGUED'],
  computed: ['badge_computed', 'cyan', 'NUM']
};
function badge(a, kind) {
  if (a <= 0.01) return;
  const spec = BADGES[kind] || BADGES.computed;
  const col = C[spec[1]];
  const head = kind === 'lean' ? (STR.en.lean || 'LEAN ✓') : kind === 'open' ? (STR.en.open || 'OPEN') : spec[2];
  const en = STR.en[spec[0]] || '', zh = STR.zh[spec[0]] || '';
  const wHead = tw(head, 16, F.mono, 700, 2), wEn = tw(en, 15, F.mono, 700, 2), wZh = tw(zh, 17, F.zh, 700, 1);
  const pad = 22, gap = 22, w = pad * 2 + wHead + gap + wEn + gap + wZh, x = W / 2 - w / 2, y = 112;
  ctx.save(); ctx.globalAlpha = a;
  cutPath(x, y, w, 32, 10); ctx.fillStyle = rgba(mix(col, C.bg, 0.86), 0.82); ctx.fill();
  ctx.strokeStyle = col; ctx.lineWidth = 1.4; ctx.stroke();
  ctx.fillStyle = col; ctx.fillRect(x, y, pad + wHead + gap / 2, 32);
  ctx.restore();
  txt(head, x + pad, y + 22, { size: 16, fam: F.mono, w: 700, c: C.bg, a, ls: 2 });
  txt(en, x + pad + wHead + gap, y + 22, { size: 15, fam: F.mono, w: 700, c: col, a, ls: 2 });
  txt(zh, x + pad + wHead + gap + wEn + gap, y + 23, { size: 17, fam: F.zh, w: 700, c: col, a, ls: 1 });
}
/* seq = [[line index, phrase | null, kind], …]: show the latest entry that has started */
function badgeQ(S, seq) {
  let cur = seq[0], st = 0;
  seq.forEach(e => { const s0 = e[0] === 0 && !e[1] ? 0 : phraseAt(S, e[0], e[1]); if (S.u >= s0) { cur = e; st = s0; } });
  badge(clamp((S.u - st) / 0.5) * clamp(S.u / 0.8) * clamp((S.d - S.u) / 0.5), cur[2]);
}
/* LEAN ✓ declaration chips: the film's citations (DATA.lean) at the pinned commit. Only theorems get the green
   chip (./tbook check refuses any other kind in film.json "lean"). Each shows r.label: the full Lean name, or the GID
   when the declaration's namespace would name another module (tbook.film.cited_label). */
/* the citation of one GID (film.json "lean"), or null: look citations up by the whole GID, not by the short name */
function leanCite(gid) { return (DATA.lean || []).find(z => z.gid === gid) || null; }
function leanList(x, y, a, o = {}) {
  if (a <= 0) return y;
  const size = o.size || 22, gap = o.gap || 44, align = o.align || 'left';
  const p = o.palette || C;
  for (const r of DATA.lean.filter(z => z.kind === 'theorem')) {
    const name = r.label || r.name;
    const head = STR.en.lean || 'LEAN ✓', wh = tw(head, size * 0.72, F.mono, 700, 1) + 18, wn = tw(name, size, F.mono, 700);
    const total = wh + 14 + wn, x0 = align === 'center' ? x - total / 2 : x;
    fillBox(x0, y - size * 0.95, wh, size * 1.25, p.lean, a * 0.95);
    txt(head, x0 + 9, y - size * 0.12, { size: size * 0.72, fam: F.mono, w: 700, c: p.bg, a, ls: 1 });
    txt(name, x0 + wh + 14, y, { size, fam: F.mono, w: 700, c: p.lean, a });
    y += gap;
  }
  return y;
}
/* end card: book code and titles, film title, Lean citations and the pinned commit; o: from (seconds into the scene),
   y (top line), x (centre, default the frame's), hyper (false: no hypercube behind it) */
function closingCard(S, o = {}) {
  const from = o.from || 0, a = clamp((S.u - from) / 1.0) * clamp((S.d - S.u) / 1.2);
  if (a <= 0) return;
  const b = DATA.book, f = DATA.film, cy = o.y || 300, cx = o.x || W / 2;
  if (o.hyper !== false) drawHyper(CUBE4, [[0, 3, S.t * 0.21], [1, 2, S.t * 0.13], [2, 3, S.t * 0.17]], { scale: 1.2, a: 0.35 * a, cx, cy: cy - 30, camZ: 7, lw: 1.4, dots: false });
  txt(b.code, cx, cy - 70, { size: 26, fam: F.mono, w: 700, align: 'center', c: C.cyan, a, ls: 10 });
  txt(b.title.zh, cx, cy + 20, { size: 78, fam: F.zh, w: 900, align: 'center', c: C.white, a, ab: 3 });
  txt(b.title.en, cx, cy + 90, { size: 40, fam: F.disp, w: 700, align: 'center', c: C.white, a: a * 0.92, ls: 2 });
  const p2 = clamp((S.u - from - 0.8) / 0.8) * a;
  txt(`${(STR.en.film || 'FILM').toUpperCase()} ${f.number} · ${f.title.toUpperCase()}`, cx, cy + 165, { size: 22, fam: F.mono, w: 700, align: 'center', c: C.mag, a: p2, ls: 3 });
  txt(f.title_zh, cx, cy + 205, { size: 26, fam: F.zh, w: 700, align: 'center', c: C.white, a: p2 * 0.85 });
  const p3 = clamp((S.u - from - 1.6) / 0.8) * a;
  const y = leanList(cx, cy + 290, p3, { align: 'center', size: 24, gap: 46 });
  const pin = DATA.pin || {};
  if (pin.commit) txt(`github.com/${pin.repo} @ ${pin.commit.slice(0, 12)}`, cx, y + 16, { size: 20, fam: F.mono, align: 'center', c: C.dim, a: p3, ls: 1 });
}
/* placeholder for a scene of script.json that scenes.js does not define */
function missingScene(S) {
  panel(W / 2 - 560, 380, 1120, 220, 1, C.open, 'SCENES.JS');
  txt(`SCENES.${S.id} is not defined`, W / 2, 495, { size: 44, fam: F.mono, w: 700, align: 'center', c: C.open });
  txt('add it to the film\'s scenes.js', W / 2, 550, { size: 24, fam: F.mono, align: 'center', c: C.white });
}

/* ---------- post-processing, HUD, subtitles ---------- */
function bloom() {}
function sceneName(id) { return FILM.names[id] || id.toUpperCase(); }
function hud(t, f, si, s) {
  const mode = scenePolarity(s.id), p = pal(mode), a = 0.78;
  ctx.globalAlpha = a; ctx.strokeStyle = p.edgeHot; ctx.lineWidth = 1;
  const m = 34.5;
  cornerTicks(m, m, W - 2 * m, H - 2 * m, 30);
  ctx.globalAlpha = 1;
  const book = DATA.book || {}, pin = DATA.pin || {};
  const left = mode === 'dual-split' ? pal('daylight') : p;
  txt(`${book.code || 'TRURETURING'} · ${(STR.en.film || 'FILM').toUpperCase()}`, 60, 67, { size: 15, fam: F.mono, w: 700, c: left.ink, a, ls: 2 });
  txt(`SEQ ${String(si + 1).padStart(2, '0')}/${String(TL.scenes.length).padStart(2, '0')} · ${sceneName(s.id)}`, 60, 90, { size: 13, fam: F.mono, w: 700, c: left.dim, a, ls: 1.5 });
  txt(timecode(t), W - 60, 67, { size: 15, fam: F.mono, w: 700, c: p.ink, a, align: 'right', ls: 2 });
  if (pin.commit) txt(`PIN ${pin.commit.slice(0, 8)} · ${STR.en.pinned || 'PINNED'}`, W - 60, 90, { size: 13, fam: F.mono, w: 700, c: p.dim, a: 0.72, align: 'right', ls: 1 });
}
/* line breaking for subtitles: CJK per character (Latin runs kept whole), Latin per word */
function wrap(s, size, fam, w, maxW) {
  const cjk = /[㐀-鿿豈-﫿]/.test(s);
  const words = cjk ? (s.match(/[A-Za-zÀ-ÿ0-9/()+\-−=_.^·²³⁴⁵⁶⁷⁸⁹⁰⁻ⁿ₀-₉√|α-ωΑ-Ω∞≤≥⊥'\[\]{}]+|[\s\S]/g) || []) : s.split(' ');
  const sep = cjk ? '' : ' ';
  const lines = []; let cur = '';
  for (const wd of words) {
    const tr = cur ? cur + sep + wd : wd;
    if (tw(tr, size, fam, w) > maxW && cur) { lines.push(cur.trimEnd()); cur = wd.trim() ? wd : ''; } else cur = tr;
  }
  if (cur) lines.push(cur);
  for (let i = 1; i < lines.length; i++) {
    if (/^[，。、；：！？”）》」』]/.test(lines[i])) { lines[i - 1] += lines[i][0]; lines[i] = lines[i].slice(1); }
    if (/[“（《「『]$/.test(lines[i - 1])) { lines[i] = lines[i - 1].slice(-1) + lines[i]; lines[i - 1] = lines[i - 1].slice(0, -1); }
  }
  return lines.filter(l => l.length);
}
const SUBS = { zh: true, en: true };
(DATA.film && DATA.film.subtitles ? ['zh', 'en'] : []).forEach(l => { SUBS[l] = DATA.film.subtitles.includes(l); });
// The semantic role selects both text and stroke. Neutral is the default for editorial labels.
function pill(x, y, label, opts = {}) {
  const p = paletteAt(x, opts.polarity);
  const colors = { lean: p.lean, open: p.open, amber: p.amber, now: p.amber, argued: p.argued };
  const color = colors[opts.kind] || p.dim;
  const a = opts.a ?? 1, size = opts.size ?? 15, h = opts.h ?? 28;
  const w = opts.w ?? tw(label, size, F.mono, 700, 1) + 24;
  if (a <= 0) return w;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x + 0.5, y + 0.5, w - 1, h - 1, opts.radius ?? h / 2);
  ctx.fillStyle = p.panel;
  ctx.globalAlpha = a;
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.globalAlpha = a * 0.75;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
  txt(label, x + w / 2, y + h / 2, { size, fam: F.mono, w: 700, align: 'center', base: 'middle', c: color, a, ls: 1 });
  return w;
}
function statusTag(x, y, kind, text, a = 1, polarity) {
  const labels = { lean: 'LEAN ✓', open: 'OPEN', amber: 'NOW', now: 'NOW', argued: 'ARGUED' };
  return pill(x, y, text || labels[kind] || '', { kind, a, polarity, radius: 2 });
}
function glassCard(x, y, w, h, a = 1, opts = {}) {
  if (w < 1 || h < 1 || a <= 0) return;
  const p = paletteAt(x + w / 2, opts.polarity);
  ctx.save();
  ctx.globalAlpha = a;
  ctx.beginPath();
  ctx.roundRect(x + 0.5, y + 0.5, w - 1, h - 1, opts.radius ?? 2);
  ctx.fillStyle = opts.fill ?? p.panel;
  ctx.fill();
  ctx.strokeStyle = opts.border ?? p.edge;
  ctx.lineWidth = 1;
  ctx.stroke();
  if (opts.topRule !== false) line(x + 2, y + 1.5, x + w - 2, y + 1.5, p.edgeHot, a, 1);
  if (opts.kicker) {
    txt(opts.kicker, x + 24, y + 28, { size: 13, fam: F.mono, w: 600, c: opts.accent || p.dim, a, ls: 2 });
    if (h > 48) line(x + 24, y + 42.5, x + w - 24, y + 42.5, p.edge, a, 1);
  }
  txt(opts.title, x + 24, y + (opts.kicker ? 79 : 39), { size: 28, fam: F.disp, w: 700, c: p.ink, a });
  ctx.restore();
}
function timecode(t) {
  const frame = Math.max(0, Math.round(t * FPS));
  const fields = [Math.floor(frame / (60 * FPS)), Math.floor(frame / FPS) % 60, frame % FPS];
  return 'T+' + fields.map(n => String(n).padStart(2, '0')).join(':');
}
const MATTE_HEIGHT = 131;
const VIEWPORT = { x: 0, y: MATTE_HEIGHT, w: W, h: H - 2 * MATTE_HEIGHT };
let frameBarHeight = null;
function cinemaFrame(S, opts = {}) {
  const mode = opts.polarity || scenePolarity(S.id);
  const bar = clamp(opts.barHeight ?? MATTE_HEIGHT, 0, H / 2);
  const progress = clamp(opts.progress ?? S.p ?? 0);
  const day = pal('daylight'), night = pal('deep-space');
  // An explicit blend is an absolute position along the daylight-to-deep-space transition.
  function drawBars(p) {
    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, W, bar);
    ctx.fillRect(0, H - bar, W, bar);
    const inset = 64, center = bar / 2, baseline = H - center;
    line(0, bar - 0.5, W, bar - 0.5, p.edge, 1, 1);
    line(0, H - bar + 0.5, W, H - bar + 0.5, p.edge, 1, 1);
    const detail = { size: 15, fam: F.mono, w: 600, c: p.dim, ls: 2, base: 'middle' };
    txt(opts.leftLabel ?? DATA.book?.code, inset, center, detail);
    txt(opts.chapterLabel ?? sceneName(S.id), W / 2, center,
      { size: 22, fam: F.disp, w: 700, c: p.ink, ls: 2, align: 'center', base: 'middle' });
    const right = [timecode(S.t), opts.rightLabel].filter(Boolean).join(' · ');
    txt(right, W - inset, center, { ...detail, align: 'right' });
    txt(opts.slateLeft, inset, baseline, detail);
    txt(opts.slateRight, W - inset, baseline, { ...detail, align: 'right' });
    const y = H - bar / 4 + 0.5;
    line(inset, y, W - inset, y, p.edge, 1, 1);
    line(inset, y, inset + (W - 2 * inset) * progress, y, p.dim, 0.8, 1);
  }
  frameBarHeight = bar;
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  if (opts.blend != null) {
    const k = clamp(opts.blend);
    // The night edge is translucent white on obsidian. Interpolate its visible matte colour.
    const edge = k === 1 ? night.edge : mix(day.edge, mix(night.bg, '#FFFFFF', 0.14), k);
    drawBars({ bg: mix(day.bg, night.bg, k), ink: mix(day.ink, night.ink, k), dim: mix(day.dim, night.dim, k), edge });
  } else if (mode === 'dual-split') {
    drawBars(day);
    ctx.beginPath(); ctx.rect(W / 2, 0, W / 2, H); ctx.clip();
    drawBars(night);
  } else {
    drawBars(pal(mode));
  }
  ctx.restore();
}
const ASSETS = {};
async function preloadImage(name) {
  const img = new Image();
  // Install both listeners before setting src, including for a cached or failed load.
  const loaded = new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => reject(new Error(`film: cannot load image assets/${name}`));
  });
  img.src = 'assets/' + encodeURIComponent(name);
  await loaded;
  if (img.decode) {
    try { await img.decode(); } catch (e) { if (!img.naturalWidth) throw e; }
  }
  return [name, img];
}
function plate(name, rect = VIEWPORT, opts = {}) {
  const { x, y, w, h } = { ...VIEWPORT, ...rect };
  if (alphaScene(CURRENT_SCENE_ID)) {
    ctx.clearRect(x, y, w, h);
    return;
  }
  const img = ASSETS[name], a = clamp(opts.a ?? 1);
  if (!img || a === 0 || w <= 0 || h <= 0) return;
  const p = ease(opts.p ?? 0);
  const zoom = Math.max(1, lerp(opts.zoomFrom ?? 1, opts.zoomTo ?? 1.06, p));
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight) * zoom;
  const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;
  const dx = x + clamp((w - dw) / 2 + (opts.panX || 0) * p, w - dw, 0);
  const dy = y + clamp((h - dh) / 2 + (opts.panY || 0) * p, h - dh, 0);
  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.globalAlpha = a;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, dx, dy, dw, dh);
  if (opts.dim > 0) fillBox(x, y, w, h, '#000', a * clamp(opts.dim));
  const vignette = clamp(opts.vignette ?? 0.15);
  if (vignette > 0) {
    const cx = x + w / 2, cy = y + h / 2;
    const shade = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.hypot(w, h) / 2);
    shade.addColorStop(0.3, 'transparent');
    shade.addColorStop(1, rgba('#000000', vignette));
    fillBox(x, y, w, h, shade, a);
  }
  ctx.restore();
}
function subtitles(t, polarity) {
  const l = TL.lines.find(x => t >= x.start - 0.15 && t <= x.end + 0.35);
  if (!l) return;
  const a = clamp((t - (l.start - 0.15)) / 0.15) * clamp((l.end + 0.35 - t) / 0.2);
  const id = TL.scenes[sceneIndex(t)].id;
  const cinema = FILM.cinemaSubtitles || FILM.polarity[id];
  const mode = polarity || scenePolarity(id), p = pal(mode);
  const daylight = mode === 'daylight';
  const rows = [
    { text: SUBS.zh && l.zh, size: 40, family: F.zh, weight: 700, leading: 52, color: p.ink },
    { text: SUBS.en && l.en, size: 27, family: F.raj, weight: 600, leading: 33, color: daylight ? p.dim : p.secondary }
  ].filter(row => row.text);
  if (!rows.length) return;
  // Reserve the same bilingual safe zone when long lines wrap or one language is disabled.
  const padding = 13;
  for (const row of rows) row.lines = wrap(row.text, row.size, row.family, row.weight, 1500);
  const textHeight = rows.reduce((sum, row) => sum + row.leading * row.lines.length, 0);
  const scale = cinema ? Math.min(1, 85 / textHeight) : 1;
  const h = textHeight * scale + 2 * padding;
  const bottom = cinema ? H - (frameBarHeight ?? MATTE_HEIGHT) - 13 : H - 46;
  const y0 = bottom - h;
  const widths = rows.flatMap(row => row.lines.map(s => tw(s, row.size * scale, row.family, row.weight)));
  const bw = Math.max(200, ...widths) + 70, x = (W - bw) / 2;
  const scrim = daylight ? 'rgba(244,241,238,0.88)' : 'rgba(5,8,14,0.82)';
  fillBox(x, y0, bw, h, scrim, a);
  line(x, y0 + 0.5, x + bw, y0 + 0.5, p.edge, a, 1);
  let y = y0 + padding;
  for (const row of rows) {
    const leading = row.leading * scale;
    for (const s of row.lines) {
      txt(s, W / 2, y + leading / 2, { size: row.size * scale, fam: row.family, w: row.weight,
        c: row.color, a, align: 'center', base: 'middle' });
      y += leading;
    }
  }
}
// Legacy scene and poster callbacks retain these entry points.
function post() {}
function glitchAmount() { return 0; }
function glitch() {}

function sceneIndex(t) {
  let si = TL.scenes.findIndex(s => t >= s.start && t < s.end);
  if (si < 0) si = t < 0 ? 0 : TL.scenes.length - 1;
  return si;
}
function sceneState(t, si) {
  const s = TL.scenes[si];
  const u = t - s.start, d = s.end - s.start;
  return { u, d, p: u / d, L: SC[s.id].lines, t, f: Math.round(t * FPS), id: s.id, i: si };
}
function resetCtx() { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none'; ctx.letterSpacing = '0px'; }

function renderAt(t) {
  const f = Math.round(t * FPS);
  const si = sceneIndex(t), s = TL.scenes[si], S = sceneState(t, si);
  resetCtx();
  frameBarHeight = null;
  background(t, s, si, S.u);
  ctx.save();
  (SCENES[s.id] || missingScene)(S);
  ctx.restore(); resetCtx();

  const mode = scenePolarity(s.id);
  const fade = Math.min(clamp(S.u / 0.45), clamp((S.d - S.u) / 0.45));
  function dip(amount, color) {
    if (amount <= 0) return;
    ctx.save();
    // In a composited shot fade only the painted overlays inside the aperture.
    const alpha = alphaScene(s.id);
    if (alpha) ctx.globalCompositeOperation = 'destination-out';
    const inset = alpha ? frameBarHeight ?? 0 : 0;
    fillBox(0, inset, W, H - 2 * inset, color, amount);
    ctx.restore();
  }
  dip((1 - fade) * 0.85, pal(mode).bg);
  if (FILM.hud && frameBarHeight === null) hud(t, f, si, s);
  subtitles(t, mode);
  dip(1 - Math.min(clamp(t / 0.8), clamp((TL.duration - t) / 1.2)), '#000');
}

/* Film-specific posters can still draw any scene with the shared helpers. */
function defaultPoster() {
  const mode = FILM.defaultPolarity, p = pal(mode);
  drawPolarityBackground(mode, 0.6);
  const b = DATA.book, f = DATA.film;
  for (const r of [175, 226, 295]) ring(W * 0.75, H * 0.42, r, p.dim, 0.17, 1);
  const label = { fam: F.mono, size: 20, c: p.dim, ls: 3 };
  txt([b.code, STR.en.film || 'FILM', f.number].filter(Boolean).join(' · '), 120, 192, label);
  txt(f.title_zh, 120, 386, { size: 76, fam: F.zh, w: 700, c: p.ink });
  const titleSize = Math.min(60, 60 * (W - 240) / tw(f.title, 60, F.disp, 700));
  txt(f.title, 120, 480, { size: titleSize, fam: F.disp, w: 700, c: p.ink });
  line(120, 551.5, W - 120, 551.5, p.edge, 1, 1);
  leanList(120, 650, 1, { size: 22, gap: 46, palette: p });
  txt([b.title.zh, b.title.en].filter(Boolean).join(' · '), 120, 965, { ...label, fam: F.zh });
}
function poster() {
  resetCtx();
  CURRENT_SCENE_ID = undefined;
  frameBarHeight = null;
  (FILM.poster || defaultPoster)();
}

/* Called once after scenes.js has loaded: fonts, resources, the film's init hooks. */
window.FILM_ERRORS = window.FILM_ERRORS || [];
async function boot() {
  const text = DATA.fontText || 'ABCabc0123';
  const faces = DATA.fonts || [];
  await Promise.all(faces.map(([fam, w]) => document.fonts.load(`${w} 40px "${fam}"`, text).catch(e => { window.FILM_ERRORS.push(`font ${fam} ${w}: ${e}`); })));
  await document.fonts.ready;
  if (Array.isArray(DATA.assets)) {
    // The build lists all bundled files, including clips or attribution alongside the plates.
    const images = DATA.assets.filter(name => /\.(?:avif|bmp|gif|ico|jpe?g|png|svg|webp)$/i.test(name));
    Object.assign(ASSETS, Object.fromEntries(await Promise.all(images.map(preloadImage))));
  }
  if (DATA.solid) await solidInit();
  buildResources();
  for (const fn of FILM.init) fn();
  computeStarPhase();
  for (const s of TL.scenes) if (!SCENES[s.id]) console.warn(`film: SCENES.${s.id} is not defined in scenes.js`);
  return true;
}
Object.assign(window, { POLARITY, pal, scenePolarity, ASSETS, plate, cinemaFrame, glassCard, pill, statusTag,
  cutPath, renderAt, poster, SUBS, FILM, solid });
