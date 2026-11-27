/* FIB//OBSERVER · FIB ATOM 观测器: one object, a composition v = (a, b) and its quantity q(v) = 2a + 3b, in three scenes.
     graft    the residue grid (ℤ/H)² and a word of R (step: (a, b) ↦ (b, a + b)) and G (add the graft w = c·stepʲ(1, 0));
              the rail runs the letters: u = stepᵏ(v) + t at every letter, with t mod H in L_w = {α·ρ(w) + β·Mρ(w)}
              (trureturing D5/S3/Arith/FibonacciAtomic/GraftAffineClosure)
     lineage  the ordered binary trees of composition (a, b) (α = true leaves, β = false), the substitution α → β,
              β → (β α) applied n times (the rail), and the fibers by generation: TV(n) = 1 − |Fiber(v)| / |Fiber(stepⁿ v)|
              with |Fiber(a, b)| = Catalan(a + b − 1)·C(a + b, a) (GenealogicalFiberTransport)
     deficit  Zeckendorf tokens of v₁, v₂, v₁ + v₂ and the deficit c = β(v₁) + β(v₂) − β(v₁ + v₂), exact in ℤ[φ]; the
              three contraction-face readings in the window [−ψ², −ψ]; the rail is v₂ (DeficitThreeValued)
   Exact arithmetic throughout: integers for compositions and residues, BigInt for fiber counts, pairs (a, b) = a + bφ
   for β. Colours: cyan = α leaves and the graft (L_w, G letters), magenta = β leaves and stepᵏ(v), violet = R letters
   and TV, amber = the current letter, generation or pair. Read-only probe for the browser suite: FIB_OBSERVER_DEBUG. */
(() => {
  'use strict';
  const { kit, L } = TRV, { fix, clamp } = kit, P = TRV.palette;
  const $ = (id) => document.getElementById(id);
  const MINUS = '−', SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUB = '₀₁₂₃₄₅₆₇₈₉';
  const sup = (n) => String(n).split('').map((d) => (d === '-' ? '⁻' : SUP[+d])).join('');
  const sub = (n) => String(n).split('').map((d) => SUB[+d]).join('');
  const GEN_MAX = 5, VMAX = 89, WORD_MAX = 10, ROW_MAX = 6, AB_MAX = 3;
  const PHI = (1 + Math.sqrt(5)) / 2, PSI = 1 - PHI, LO = -(PSI * PSI), HI = -PSI;

  /* ---------- compositions ---------- */
  const step = (v) => [v[1], v[0] + v[1]];
  const stepN = (v, n) => { let u = v; for (let k = 0; k < n; k++) u = step(u); return u; };
  const quantity = (v) => 2 * v[0] + 3 * v[1];
  const gcd = (x, y) => { x = Math.abs(x); y = Math.abs(y); while (y) [x, y] = [y, x % y]; return x; };
  const mod = (x, H) => ((x % H) + H) % H;
  const block = (j) => stepN([1, 0], j);
  const pair = (v) => `(${v[0]}, ${v[1]})`;

  /* ---------- trees: 'a' = α, 'b' = β, [left, right] = an ordered pair ---------- */
  const shapeMemo = new Map();
  function shapes(n) {   // every ordered full binary shape with n leaves (a leaf is null)
    if (shapeMemo.has(n)) return shapeMemo.get(n);
    const out = [];
    if (n === 1) out.push(null);
    else for (let k = 1; k < n; k++) for (const l of shapes(k)) for (const r of shapes(n - k)) out.push([l, r]);
    shapeMemo.set(n, out);
    return out;
  }
  function combos(n, k) {   // k-subsets of 0 … n − 1 in lexicographic order
    const out = [], cur = [];
    const go = (i) => { if (cur.length === k) { out.push(cur.slice()); return; } for (let x = i; x <= n - (k - cur.length); x++) { cur.push(x); go(x + 1); cur.pop(); } };
    go(0); return out;
  }
  const dress = (shape, labels, pos) => (shape === null ? labels[pos.i++] : [dress(shape[0], labels, pos), dress(shape[1], labels, pos)]);
  const fiberMemo = new Map();
  /** Fiber(a, b): every ordered binary tree with a α-leaves and b β-leaves (shape by shape, then α positions). */
  function fiber(a, b) {
    const key = `${a},${b}`;
    if (fiberMemo.has(key)) return fiberMemo.get(key);
    const n = a + b, out = [];
    if (n >= 1) for (const s of shapes(n)) for (const set of combos(n, a)) { const lab = new Array(n).fill('b'); set.forEach((i) => { lab[i] = 'a'; }); out.push(dress(s, lab, { i: 0 })); }
    fiberMemo.set(key, out);
    return out;
  }
  const sigma = (t) => (t === 'a' ? 'b' : t === 'b' ? ['b', 'a'] : [sigma(t[0]), sigma(t[1])]);
  const ser = (t) => (typeof t === 'string' ? t : `(${ser(t[0])}${ser(t[1])})`);
  const comp = (t) => (t === 'a' ? [1, 0] : t === 'b' ? [0, 1] : ((l, r) => [l[0] + r[0], l[1] + r[1]])(comp(t[0]), comp(t[1])));
  const imageMemo = new Map();
  /** σⁿ applied to every tree of Fiber(a, b): generation n of the lineage. */
  function images(a, b, n) {
    const key = `${a},${b},${n}`;
    if (imageMemo.has(key)) return imageMemo.get(key);
    const out = n === 0 ? fiber(a, b) : images(a, b, n - 1).map(sigma);
    imageMemo.set(key, out);
    return out;
  }
  /* exact counts */
  const binom = (n, k) => { let r = 1n; for (let i = 1n; i <= BigInt(k); i++) r = r * (BigInt(n) - BigInt(k) + i) / i; return r; };
  const catalan = (n) => binom(2 * n, n) / BigInt(n + 1);
  const fiberCount = (v) => (v[0] + v[1] >= 1 ? catalan(v[0] + v[1] - 1) * binom(v[0] + v[1], v[0]) : 0n);
  const bgcd = (x, y) => { while (y) [x, y] = [y, x % y]; return x; };
  const big = (x) => { const s = x.toString(); if (s.length <= 9) return s; return `${s[0]}.${s.slice(1, 3)}·10${sup(s.length - 1)}`; };
  function tvOf(v, n) {
    const src = fiberCount(v), tgt = fiberCount(stepN(v, n));
    return { src, tgt, value: 1 - Number(src) / Number(tgt), exact: tgt < 10n ** 7n ? (() => { const num = tgt - src, g = bgcd(num, tgt) || 1n; return num === 0n ? '0' : `${num / g}/${tgt / g}`; })() : null };
  }
  const tvText = (tv) => (tv.exact != null ? tv.exact : `1 ${MINUS} ${big(tv.src)}/${big(tv.tgt)}`);
  /** A short form for the ladder: the exact fraction while it is short, else 1 − (the share of the image trees). */
  const sci = (x) => { const e = Math.floor(Math.log10(x)), m = x / Math.pow(10, e); return `${m.toFixed(1)}·10${sup(e)}`; };
  const tvShort = (tv) => (tv.exact != null && tv.exact.length <= 9 ? tv.exact : `1 ${MINUS} ${sci(Number(tv.src) / Number(tv.tgt))}`);
  const tvDec = (tv) => (tv.value >= 0.99995 && tv.value < 1 ? '≈ 1' : `≈ ${fix(tv.value, 4)}`);

  /* ---------- golden carry: Zeckendorf digits and β in ℤ[φ] ---------- */
  const F = [0, 1];
  while (F.length < 40) F.push(F[F.length - 1] + F[F.length - 2]);
  const Wt = (i) => F[i + 2];   // W_i = F_(i+2): 1, 2, 3, 5, 8, …
  function zeck(n) {
    if (n <= 0) return [];
    let top = 0; while (Wt(top + 1) <= n) top++;
    const d = new Array(top + 1).fill(0);
    for (let i = top; i >= 0; i--) if (Wt(i) <= n) { d[i] = 1; n -= Wt(i); }
    return d;
  }
  /** β(v) = Σ φ^(i+2) over the digits, as (a, b) meaning a + bφ (φ^k = F(k−1) + F(k)·φ). */
  function beta(v) { let a = 0, b = 0; zeck(v).forEach((x, i) => { if (x) { a += F[i + 1]; b += F[i + 2]; } }); return [a, b]; }
  const contraction = (v) => { const [a, b] = beta(v); return a + b * PSI; };
  const deficit = (v1, v2) => { const b1 = beta(v1), b2 = beta(v2), b3 = beta(v1 + v2); return [b1[0] + b2[0] - b3[0], b1[1] + b2[1] - b3[1]]; };
  const fmtSigned = (x) => (x > 0 ? `+${x}` : x < 0 ? `${MINUS}${-x}` : '0');
  const fmtZphi = ([a, b]) => { if (!b) return fmtSigned(a).replace('+', ''); const phi = `${Math.abs(b) === 1 ? '' : Math.abs(b)}φ`; return a ? `${a < 0 ? MINUS + -a : a} ${b < 0 ? MINUS : '+'} ${phi}` : `${b < 0 ? MINUS : ''}${phi}`; };
  const signCol = (x) => (x > 0 ? P.cyan : x < 0 ? P.magenta : P.ink);

  /* ---------- state ---------- */
  const S = { scene: 'graft', a: 2, b: 1, H: 5, j: 2, c: 1, word: ['R', 'G', 'R', 'G'], v1: 1, stopAt: null, rail: { graft: 4, lineage: 1, deficit: 1 } };
  let clock = null, geo = {};
  const tNow = () => (clock ? clock.t : 0);
  const whole = () => Math.floor(tNow() + 1e-9);
  const part = (max) => (whole() < max ? clamp(tNow() - whole(), 0, 1) : 0);
  const letters = () => Math.min(S.word.length, whole());
  const gen = () => Math.min(GEN_MAX, whole());
  const v2Now = () => clamp(whole(), 0, VMAX);

  /** The run of the word on v: the composition after each letter, its count k of R's and its translation t. */
  function graft() {
    const v = [S.a, S.b], w = block(S.j).map((x) => x * S.c), H = S.H, rows = [{ u: v, k: 0, t: [0, 0] }];
    for (const ch of S.word) {
      const p = rows[rows.length - 1];
      rows.push(ch === 'R' ? { u: step(p.u), k: p.k + 1, t: step(p.t) } : { u: [p.u[0] + w[0], p.u[1] + w[1]], k: p.k, t: [p.t[0] + w[0], p.t[1] + w[1]] });
    }
    const rw = [mod(w[0], H), mod(w[1], H)], mw = step(rw).map((x) => mod(x, H)), space = new Set();
    for (let al = 0; al < H; al++) for (let be = 0; be < H; be++) space.add(mod(al * rw[0] + be * mw[0], H) + H * mod(al * rw[1] + be * mw[1], H));
    let period = 0, e1 = [1, 0], e2 = [0, 1];
    do { e1 = step(e1).map((x) => mod(x, H)); e2 = step(e2).map((x) => mod(x, H)); period++; } while (!(e1[0] === 1 % H && e1[1] === 0 && e2[0] === 0 && e2[1] === 1 % H) && period < 10000);
    return { v, w, H, rows, space, period, gw: gcd(gcd(w[0], w[1]), H) };
  }

  /* ---------- canvas text ---------- */
  const face = (f) => (f === 'body' ? TRV.fonts.body : f === 'display' ? TRV.fonts.display : TRV.fonts.data);
  function text(ctx, str, x, y, color, o) {
    o = o || {};
    ctx.font = `${o.weight ? o.weight + ' ' : ''}${o.size || 11}px ${face(o.face)}`; ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.base || 'middle';
    ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
    if (o.halo) { ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.strokeStyle = P.stage; ctx.strokeText(str, x, y); }
    ctx.fillStyle = color; ctx.fillText(str, x, y); ctx.globalAlpha = 1;
  }
  /** Wrap at words (Chinese at characters) to `width` at `size`. */
  function wrap(ctx, str, width, size, f) {
    ctx.font = `${size}px ${face(f)}`;
    const out = []; let row = '';
    for (const piece of str.match(/\p{Script=Han}|[^\S\n]+|[^\p{Script=Han}\s]+/gu) || []) {
      if (row && ctx.measureText(row + piece).width > width) { out.push(row.trim()); row = ''; }
      row += piece;
    }
    if (row.trim()) out.push(row.trim());
    return out;
  }
  const ring = (ctx, x, y, r, col, w, glow) => { ctx.strokeStyle = col; ctx.lineWidth = w || 1.6; if (glow) { ctx.shadowColor = col; ctx.shadowBlur = glow; } ctx.beginPath(); ctx.arc(x, y, r, 0, kit.TAU); ctx.stroke(); ctx.shadowBlur = 0; };
  const dot = (ctx, x, y, r, col, glow) => { ctx.fillStyle = col; if (glow) { ctx.shadowColor = col; ctx.shadowBlur = glow; } ctx.beginPath(); ctx.arc(x, y, r, 0, kit.TAU); ctx.fill(); ctx.shadowBlur = 0; };
  function arrow(ctx, x0, y0, x1, y1, col, w, alpha) {
    const dx = x1 - x0, dy = y1 - y0, d = Math.hypot(dx, dy); if (d < 1) return;
    ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.strokeStyle = ctx.fillStyle = col; ctx.lineWidth = w || 1.6;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    const h = Math.min(8, d * 0.4), ux = dx / d, uy = dy / d;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - ux * h - uy * h * 0.45, y1 - uy * h + ux * h * 0.45); ctx.lineTo(x1 - ux * h + uy * h * 0.45, y1 - uy * h - ux * h * 0.45); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
  }

  /* ---------- scene: graft ---------- */
  function drawGraft(ctx, bx, wide) {
    const G = graft(), H = G.H, len = S.word.length, m = letters(), e = TRV.smooth(part(len)), row = G.rows[m];
    const side = wide ? Math.max(80, Math.min(bx.h - 36, bx.w * 0.46)) : Math.max(70, Math.min(bx.w - 56, bx.h * 0.4));
    const gx = wide ? bx.x + 34 : bx.x + 30 + (bx.w - 30 - side) / 2, gy = wide ? bx.y + Math.max(0, (bx.h - 20 - side) / 2) : bx.y + 4, cs = side / H;
    const C = (r) => [gx + (r[0] + 0.5) * cs, gy + side - (r[1] + 0.5) * cs], res = (u) => [mod(u[0], H), mod(u[1], H)];
    for (let y = 0; y < H; y++) for (let x = 0; x < H; x++) {
      if (G.space.has(x + H * y)) { ctx.fillStyle = TRV.alpha(P.cyan, 0.12); ctx.fillRect(gx + x * cs + 1, gy + side - (y + 1) * cs + 1, cs - 2, cs - 2); }
      ctx.strokeStyle = TRV.alpha(P.lineHot, 0.5); ctx.lineWidth = 1; ctx.strokeRect(gx + x * cs + 0.5, gy + side - (y + 1) * cs + 0.5, cs - 1, cs - 1);
    }
    for (let k = 0; k < H; k++) { text(ctx, String(k), gx + (k + 0.5) * cs, gy + side + 11, P.dim, { align: 'center', size: 10 }); text(ctx, String(k), gx - 10, gy + side - (k + 0.5) * cs, P.dim, { align: 'center', size: 10 }); }
    text(ctx, `a mod ${H} →`, gx + side, gy + side + 24, P.dim, { align: 'right', size: 10 });
    // the path of residues, letter by letter: R violet, G cyan
    for (let i = 1; i <= m; i++) { const [x0, y0] = C(res(G.rows[i - 1].u)), [x1, y1] = C(res(G.rows[i].u)); arrow(ctx, x0, y0, x1, y1, S.word[i - 1] === 'R' ? P.violet : P.cyan, 1.6, 0.75); }
    let cur = C(res(row.u));
    if (e > 0 && m < len) { const [x0, y0] = cur, [x1, y1] = C(res(G.rows[m + 1].u)); arrow(ctx, x0, y0, x0 + (x1 - x0) * e, y0 + (y1 - y0) * e, P.amber, 2.2); cur = [x0 + (x1 - x0) * e, y0 + (y1 - y0) * e]; }
    const start = C(res(G.v)), pred = C(res(stepN(G.v, row.k))), r0 = clamp(cs * 0.26, 4, 11);
    ring(ctx, start[0], start[1], r0 + 1, P.ink, 1.4); text(ctx, 'v', start[0] - r0 - 4, start[1] - r0 - 2, P.ink, { align: 'right', size: 11, halo: true });
    ring(ctx, pred[0], pred[1], r0 + 4, P.magenta, 2);
    const here = C(res(row.u));
    if (Math.hypot(here[0] - pred[0], here[1] - pred[1]) > 2) { ctx.setLineDash([5, 4]); arrow(ctx, pred[0], pred[1], here[0], here[1], P.cyan, 1.6); ctx.setLineDash([]); }
    dot(ctx, cur[0], cur[1], r0, P.amber, 12);
    // the word and the decomposition
    const pane = wide ? { x: gx + side + 40, y: bx.y + 6, w: bx.x + bx.w - (gx + side + 40), h: bx.h - 6 } : { x: bx.x, y: gy + side + 32, w: bx.w, h: bx.y + bx.h - (gy + side + 32) };
    const ts = clamp(Math.min(wide ? 34 : 26, (pane.w - 6) / len - 6), 16, 34), tokens = [];
    for (let i = 0; i < len; i++) {
      const x = pane.x + i * (ts + 6), y = pane.y, done = i < m, now = i === m - 1 && e === 0, next = i === m && e > 0, col = S.word[i] === 'R' ? P.violet : P.cyan;
      ctx.fillStyle = done ? TRV.alpha(col, 0.22) : 'transparent'; ctx.fillRect(x, y, ts, ts);
      ctx.strokeStyle = now || next ? P.amber : done ? col : P.faint; ctx.lineWidth = now || next ? 2.2 : 1.2; ctx.strokeRect(x + 0.5, y + 0.5, ts - 1, ts - 1);
      text(ctx, S.word[i], x + ts / 2, y + ts / 2 + 0.5, done || next ? P.ink : P.dim, { align: 'center', size: Math.min(15, ts * 0.5), weight: 600 });
      tokens.push({ x, y, w: ts, h: ts, i });
    }
    geo.tokens = tokens;
    const tm = [mod(row.t[0], H), mod(row.t[1], H)], inL = G.space.has(tm[0] + H * tm[1]), sk = stepN(G.v, row.k), q = quantity(row.u);
    const wDef = `${S.c > 1 ? `${S.c}·` : ''}step${sup(S.j)}(1, 0) = ${pair(G.w)}`;
    // the decomposition first; the parameters of the run last (a short frame drops them)
    const big1 = wide ? 13 : 12, small = wide ? 12 : 11;
    const lines = [
      [`u = ${pair(row.u)} = step${sup(row.k)}(v) + t`, P.ink, big1],
      [`= ${pair(sk)} + ${pair(row.t)} ✓`, P.ink, big1],
      [L(`t mod ${H} = ${pair(tm)} ∈ ⟨w, Mw⟩ ${inL ? '✓' : '✗'}（${G.space.size} 格）`, `t mod ${H} = ${pair(tm)} ∈ ⟨w, Mw⟩ ${inL ? '✓' : '✗'} (${G.space.size} cells)`), P.cyan, small],
      [`q(u) = 2·${row.u[0]} + 3·${row.u[1]} = ${q} → gcd(${q}, ${H}) = ${gcd(q, H)}`, P.ink, small],
      [`v = ${pair(G.v)} · H = ${H}`, P.dim, small],
      [`w = ${wDef}`, P.dim, small]
    ];
    let y = pane.y + ts + (wide ? 20 : 14);
    for (const [str, col, size] of lines) for (const piece of wrap(ctx, str, pane.w - 4, size)) { if (y + size / 2 <= pane.y + pane.h) text(ctx, piece, pane.x, y, col, { size }); y += size + (wide ? 8 : 5); }
    geo.graft = { gx, gy, side, cs };
  }

  /* ---------- scene: lineage ---------- */
  function layoutTree(t) {
    const nodes = [], edges = [];
    let leaf = 0, depth = 0;
    const walk = (u, d) => {
      depth = Math.max(depth, d);
      if (typeof u === 'string') { const n = { x: leaf++, d, kind: u }; nodes.push(n); return n; }
      const l = walk(u[0], d + 1), r = walk(u[1], d + 1), n = { x: (l.x + r.x) / 2, d, kind: null };
      nodes.push(n); edges.push([n, l], [n, r]); return n;
    };
    walk(t, 0);
    return { nodes, edges, leaves: leaf, depth };
  }
  function drawTree(ctx, t, box, alpha, thumb) {
    const T = layoutTree(t), sx = T.leaves > 1 ? box.w / (T.leaves - 1) : 0, sy = T.depth ? box.h / T.depth : 0;
    const X = (n) => box.x + (T.leaves > 1 ? n.x * sx : box.w / 2), Y = (n) => box.y + n.d * sy;
    ctx.globalAlpha = alpha; ctx.strokeStyle = TRV.alpha(P.ink, 0.55); ctx.lineWidth = thumb ? 2.4 : 1.1;
    ctx.beginPath(); for (const [p, q] of T.edges) { ctx.moveTo(X(p), Y(p)); ctx.lineTo(X(q), Y(q)); } ctx.stroke();
    const rr = clamp(Math.min(sx * 0.32, 6), thumb ? 3.5 : 1.6, thumb ? 9 : 6);
    for (const n of T.nodes) if (n.kind) { ctx.fillStyle = n.kind === 'a' ? P.cyan : P.magenta; ctx.beginPath(); ctx.arc(X(n), Y(n), rr, 0, kit.TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
  }
  /** One row of trees, k cells wide (the first k of the list); returns the cell centres for the lineage links. */
  function drawRow(ctx, list, box, k, alpha, thumb) {
    const cw = box.w / k, padX = Math.min(12, cw * 0.14), centres = [];
    list.slice(0, k).forEach((t, i) => {
      const cell = { x: box.x + i * cw + padX, y: box.y, w: cw - 2 * padX, h: box.h };
      drawTree(ctx, t, cell, alpha, thumb);
      centres.push(box.x + (i + 0.5) * cw);
    });
    return centres;
  }
  function drawLadder(ctx, box, v, n, e, thumb) {
    const rh = box.h / (GEN_MAX + 1), compact = box.w < 360, rowsGeo = [], tvW = thumb ? 0 : 96;
    const barX = box.x + (thumb ? 0 : compact ? 90 : 150), barW = Math.max(30, box.x + box.w - barX - tvW);
    for (let k = 0; k <= GEN_MAX; k++) {
      const y = box.y + k * rh, mid = y + rh / 2, tv = tvOf(v, k), on = k === n, hot = on || (e > 0 && k === n + 1);
      if (on && !thumb) { ctx.strokeStyle = P.amber; ctx.lineWidth = 1.6; ctx.shadowColor = P.amber; ctx.shadowBlur = 8; ctx.strokeRect(box.x - 4, y + 2, box.w + 8, rh - 4); ctx.shadowBlur = 0; }
      const bh = Math.min(thumb ? 26 : 12, rh * 0.36), fill = barW * tv.value, share = Math.max(2, barW - fill);
      ctx.fillStyle = TRV.alpha(P.violet, hot ? 0.75 : 0.45); ctx.fillRect(barX, mid - bh / 2, fill, bh);
      ctx.fillStyle = P.ink; ctx.globalAlpha = hot ? 0.95 : 0.7; ctx.fillRect(barX + barW - share, mid - bh / 2, share, bh); ctx.globalAlpha = 1;
      ctx.strokeStyle = TRV.alpha(P.lineHot, 0.9); ctx.lineWidth = 1; ctx.strokeRect(barX + 0.5, mid - bh / 2 + 0.5, barW - 1, bh - 1);
      rowsGeo.push({ k, y, h: rh });
      if (thumb) continue;
      const u = stepN(v, k), col = on ? P.amber : P.ink;
      text(ctx, compact ? `n=${k}` : `n = ${k}`, box.x, mid - (compact ? 0 : 7), col, { size: compact ? 10.5 : 11.5, weight: on ? 600 : 0 });
      if (!compact) { text(ctx, `${pair(u)} · q = ${quantity(u)}`, box.x, mid + 8, P.dim, { size: 10.5 }); text(ctx, `|F| = ${big(fiberCount(u))}`, box.x + 82, mid - 7, P.dim, { size: 10.5 }); }
      else text(ctx, pair(u), box.x + 34, mid, P.dim, { size: 10 });
      text(ctx, tvShort(tv), barX + barW + 7, mid - (compact ? 0 : 6), on ? P.amber : P.violet, { size: 10.5, weight: 600 });
      if (!compact) text(ctx, tvDec(tv), barX + barW + 7, mid + 9, P.dim, { size: 10 });
    }
    return rowsGeo;
  }
  /** The ancestors (generation 0, the fiber of v) above, their images at generation n below, one link per lineage. */
  function drawLineage(ctx, bx, wide, thumb) {
    const v = [S.a, S.b], n = gen(), e = TRV.smooth(part(GEN_MAX)), roots = fiber(S.a, S.b), count = roots.length, k = Math.min(count, ROW_MAX);
    const area = wide ? { x: bx.x + 4, y: bx.y, w: bx.w * 0.56, h: bx.h } : { x: bx.x + 4, y: bx.y, w: bx.w - 8, h: bx.h * 0.56 };
    const ladder = wide ? { x: bx.x + bx.w * 0.6, y: bx.y + 4, w: bx.w * 0.4 - 6, h: bx.h - 8 } : { x: bx.x + 4, y: area.y + area.h + 10, w: bx.w - 8, h: bx.h - area.h - 12 };
    const u = stepN(v, n), tgt = fiberCount(u), size = wide ? 11.5 : 10.5;
    const headTop = thumb ? [] : wrap(ctx, L(`祖先 Fiber${pair(v)}：${count} 棵 · 读数 ${pair(v)} · q = ${quantity(v)}`, `ancestors Fiber${pair(v)}: ${count} tree${count === 1 ? '' : 's'} · read ${pair(v)} · q = ${quantity(v)}`), area.w, size, 'body');
    const headLow = thumb ? [] : wrap(ctx, n === 0 ? L('第 0 代：像就是祖先本身', 'generation 0: the images are the ancestors') : L(`第 ${n} 代：读数全是 ${pair(u)} · q = ${quantity(u)} · 纤维共 ${big(tgt)} 棵`, `generation ${n}: all read ${pair(u)} · q = ${quantity(u)} · a fiber of ${big(tgt)}`), area.w, size, 'body');
    const lh = size + 4, more = !thumb && count > k ? 14 : 0;
    const top = { x: area.x, y: area.y + headTop.length * lh + 4, w: area.w, h: Math.max(20, area.h * 0.28 - headTop.length * lh - 4) };
    const lowY = area.y + area.h * 0.4, low = { x: area.x, y: lowY + headLow.length * lh + 4, w: area.w, h: Math.max(24, area.y + area.h - lowY - headLow.length * lh - 4 - more) };
    headTop.forEach((str, i) => text(ctx, str, area.x, area.y + i * lh + lh / 2, P.dim, { size, face: 'body' }));
    headLow.forEach((str, i) => text(ctx, str, area.x, lowY + i * lh + lh / 2, n === 0 ? P.dim : P.ink, { size, face: 'body' }));
    const xs = drawRow(ctx, roots, top, k, 1, thumb);
    // lineage links: ancestor i → its image i (substitution is injective, so the links never merge)
    ctx.strokeStyle = TRV.alpha(P.ink, thumb ? 0.35 : 0.22); ctx.lineWidth = thumb ? 2 : 1; ctx.setLineDash([3, 4]);
    ctx.beginPath(); for (const x of xs) { ctx.moveTo(x, top.y + top.h + 6); ctx.lineTo(x, low.y - 6); } ctx.stroke(); ctx.setLineDash([]);
    drawRow(ctx, images(S.a, S.b, n), low, k, 1 - (n < GEN_MAX ? e : 0), thumb);
    if (e > 0 && n < GEN_MAX) drawRow(ctx, images(S.a, S.b, n + 1), low, k, e, thumb);
    if (more) text(ctx, L(`每行只画前 ${k} 棵，另有 ${count - k} 棵`, `${k} drawn per row, ${count - k} more`), area.x + area.w, area.y + area.h - 6, P.dim, { align: 'right', size: 10.5, face: 'body' });
    geo.ladder = drawLadder(ctx, ladder, v, n, e, thumb);
  }

  /* ---------- scene: deficit ---------- */
  function drawDeficit(ctx, bx, wide) {
    const v1 = S.v1, v2 = v2Now(), s = v1 + v2, z = [zeck(v1), zeck(v2), zeck(s)], width = Math.max(1, ...z.map((d) => d.length));
    const b = [beta(v1), beta(v2), beta(s)], c = deficit(v1, v2), r = [contraction(v1), contraction(v2), contraction(s)];
    const tokH = Math.min(bx.h * 0.42, 150), labW = 44, sideW = wide ? 150 : 0, cell = Math.min(34, (bx.w - labW - sideW - 10) / width, (tokH - 22) / 3);
    const gridW = width * cell, x0 = bx.x + labW + Math.max(0, (bx.w - labW - sideW - gridW) / 2), y0 = bx.y + 16;
    const cx = (i) => x0 + (width - 1 - i) * cell + cell / 2, rowY = (k) => y0 + 14 + k * cell + cell / 2;
    for (let i = 0; i < width; i++) text(ctx, String(Wt(i)), cx(i), y0 + 4, P.dim, { align: 'center', size: clamp(cell * 0.36, 8.5, 11) });
    const names = ['v₁', 'v₂', 'v₁+v₂'];
    for (let k = 0; k < 3; k++) {
      const y = rowY(k);
      text(ctx, names[k], x0 - 8, y, k === 2 ? P.ink : P.dim, { align: 'right', size: 11 });
      for (let i = 0; i < width; i++) {
        ctx.strokeStyle = TRV.alpha(P.lineHot, 0.45); ctx.lineWidth = 1; ctx.strokeRect(cx(i) - cell / 2 + 1.5, y - cell / 2 + 1.5, cell - 3, cell - 3);
        if (z[k][i]) { ctx.fillStyle = P.ink; ctx.globalAlpha = k === 2 ? 0.95 : 0.78; const w = cell * 0.5; ctx.fillRect(cx(i) - w / 2, y - w / 2, w, w); ctx.globalAlpha = 1; }
      }
      if (wide) text(ctx, `β = ${fmtZphi(b[k])}`, x0 + gridW + 14, y, P.dim, { size: 11 });
      if (k === 1) { ctx.strokeStyle = P.lineHot; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(x0 - 30, y + cell / 2); ctx.lineTo(x0 + gridW + 6, y + cell / 2); ctx.stroke(); ctx.setLineDash([]); }
    }
    // the formula, then the window and the trap
    const fy = rowY(2) + cell / 2 + 18, size = bx.w > 520 ? 12.5 : 11;
    const formula = `c = (${fmtZphi(b[0])}) + (${fmtZphi(b[1])}) ${MINUS} (${fmtZphi(b[2])}) = ${fmtSigned(c[0])}`;
    const fl = wrap(ctx, formula, bx.w - 8, size);
    fl.forEach((piece, i) => text(ctx, piece, bx.x + bx.w / 2, fy + i * (size + 6), P.ink, { align: 'center', size }));
    const top = fy + fl.length * (size + 6) + 6, room = bx.y + bx.h - top, lane = top + room * 0.38, trap = top + room * 0.82;
    const sx = bx.x + 26, sw = bx.w - 52, X = (u) => sx + (u + 0.62) / 1.5 * sw;   // the window lane, u ∈ [−0.62, 0.88]
    ctx.fillStyle = TRV.alpha(P.lineHot, 0.2); ctx.fillRect(X(LO), lane - 14, X(HI) - X(LO), 28);
    for (const u of [LO, HI]) { ctx.strokeStyle = P.ink; ctx.globalAlpha = 0.8; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(X(u), lane - 16); ctx.lineTo(X(u), lane + 16); ctx.stroke(); ctx.globalAlpha = 1; }
    text(ctx, `${MINUS}ψ² ≈ ${MINUS}0.382`, X(LO), lane - 24, P.ink, { align: 'center', size: 10.5 }); text(ctx, `${MINUS}ψ ≈ 0.618`, X(HI), lane - 24, P.ink, { align: 'center', size: 10.5 });
    ctx.strokeStyle = P.lineHot; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(sx, lane); ctx.lineTo(sx + sw, lane); ctx.stroke();
    const tags = s === v1 && v2 === 0 ? [[r[0], 'v₁ = v₁+v₂'], [r[1], 'v₂']] : v1 === v2 ? [[r[0], 'v₁ = v₂'], [r[2], 'v₁+v₂']] : [[r[0], 'v₁'], [r[1], 'v₂'], [r[2], 'v₁+v₂']];
    const placed = [];
    tags.forEach(([u, lab]) => {
      dot(ctx, X(u), lane, 5, P.amber, 10);
      let dy = 15; while (placed.some((p) => p.dy === dy && Math.abs(p.x - X(u)) < 56)) dy += 13;
      placed.push({ x: X(u), dy }); text(ctx, lab, X(u), lane + dy, P.amber, { align: 'center', size: 10.5, halo: true });
    });
    // c = β′(v₁) + β′(v₂) − β′(v₁ + v₂) lies in (2·(−ψ²) − (−ψ), 2·(−ψ) − (−ψ²)) = (φ − 3, φ): three integers fit
    const U = (u) => sx + (u + 2.3) / 4.6 * sw;
    ctx.fillStyle = TRV.alpha(P.lineHot, 0.3); ctx.fillRect(U(PHI - 3), trap - 7, U(PHI) - U(PHI - 3), 14);
    ctx.strokeStyle = P.lineHot; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(U(-2.3), trap); ctx.lineTo(U(2.3), trap); ctx.stroke();
    text(ctx, `φ ${MINUS} 3 ≈ ${MINUS}1.382`, U(PHI - 3), trap - 17, P.dim, { align: 'center', size: 10 }); text(ctx, 'φ ≈ 1.618', U(PHI), trap - 17, P.dim, { align: 'center', size: 10 });
    for (let k = -2; k <= 2; k++) {
      const inside = Math.abs(k) <= 1, hit = k === c[0];
      ring(ctx, U(k), trap, inside ? 4.5 : 2.5, inside ? P.ink : P.faint, 1.4);
      if (hit) { dot(ctx, U(k), trap, 4.5, signCol(k)); ring(ctx, U(k), trap, 9, P.amber, 2, 10); }
      text(ctx, fmtSigned(k), U(k), trap + 16, inside ? P.ink : P.faint, { align: 'center', size: 10.5 });
    }
  }

  /* ---------- the stage ---------- */
  function drawStage() {
    const g = kit.plot($('cv'), { x: [0, 1], y: [0, 1], pad: [0, 0, 0, 0] }), ctx = g.ctx, W = g.W, H = g.H;
    geo = {};
    if (TRV.thumbMode) {   // the cover is wordless: two trees of (1, 1) after three substitutions beside the bars of TV
      const xs = drawRow(ctx, fiber(1, 1), { x: W * 0.06, y: H * 0.1, w: W * 0.5, h: H * 0.22 }, 2, 1, true);
      ctx.strokeStyle = TRV.alpha(P.ink, 0.35); ctx.lineWidth = 2; ctx.setLineDash([4, 5]); ctx.beginPath(); for (const x of xs) { ctx.moveTo(x, H * 0.36); ctx.lineTo(x, H * 0.44); } ctx.stroke(); ctx.setLineDash([]);
      drawRow(ctx, images(1, 1, 3), { x: W * 0.06, y: H * 0.48, w: W * 0.5, h: H * 0.42 }, 2, 1, true);
      drawLadder(ctx, { x: W * 0.64, y: H * 0.12, w: W * 0.3, h: H * 0.76 }, [1, 1], 3, 0, true);
      return;
    }
    const st = $('stage').getBoundingClientRect(), below = (el) => (el ? el.getBoundingClientRect().bottom - st.top : 0);
    TRV.hudFit();
    const top = Math.max(46, below($('hudBig').parentElement), below($('sceneChips'))) + 12, bottom = Math.max(18, $('legend').offsetHeight + 22);
    const bx = { x: 18, y: top, w: W - 36, h: Math.max(100, H - top - bottom) }, wide = bx.w >= 540 && bx.w >= bx.h * 1.2;
    if (S.scene === 'graft') drawGraft(ctx, bx, wide);
    else if (S.scene === 'lineage') drawLineage(ctx, bx, wide, false);
    else drawDeficit(ctx, bx, wide);
  }

  /* ---------- the strip ---------- */
  function plotTV(cv) {
    const v = [S.a, S.b], g = kit.plot(cv, { x: [0, GEN_MAX], y: [0, 1.08], pad: [34, 14, 10, 20] }), pts = [];
    for (let k = 0; k <= GEN_MAX; k++) pts.push([k, tvOf(v, k).value]);
    g.axes({ yTicks: [0, [0.5, '0.5'], 1], xTicks: [0, 1, 2, 3, 4, 5] });
    g.hline(1, P.dim, { dash: [4, 3], alpha: 0.8 });
    if (S.a + S.b >= 2) g.hline(1 - Math.pow(0.5, S.b), P.violet, { dash: [2, 3], alpha: 0.7 });
    g.line(pts, P.violet, { width: 2 });
    pts.forEach(([k, y]) => g.dot(k, y, P.violet, 3.2));
    if (S.scene === 'lineage') g.vline(clamp(tNow(), 0, GEN_MAX), P.amber, { alpha: 0.85 });
    $('pAMeta').textContent = `${pair(v)} · TV(1) = ${tvText(tvOf(v, 1))}`;
  }
  function plotDeficit(cv) {
    const g = kit.plot(cv, { x: [0, VMAX + 1], y: [-1.6, 1.6], pad: [26, 10, 8, 18] });
    g.axes({ yTicks: [[-1, MINUS + '1'], 0, [1, '+1']], xTicks: [0, 21, 34, 55, 89] });
    g.hline(1, P.dim, { dash: [3, 3], alpha: 0.6 }); g.hline(-1, P.dim, { dash: [3, 3], alpha: 0.6 });
    let pos = 0, neg = 0;
    for (let v = 0; v <= VMAX; v++) { const c = deficit(S.v1, v)[0]; if (c) g.rect(v + 0.1, 0, v + 0.9, c, signCol(c), { alpha: 0.85 }); if (c > 0) pos++; else if (c < 0) neg++; }
    if (S.scene === 'deficit') g.rect(v2Now(), -1.5, v2Now() + 1, 1.5, P.amber, { fill: false, stroke: P.amber, width: 1.6 });
    geo.plotB = g;
    $('pBMeta').textContent = `v₁ = ${S.v1} · +1: ${pos} · ${MINUS}1: ${neg}`;
  }
  function drawPlots() { if (TRV.still || TRV.figure) return; plotTV($('plotA')); plotDeficit($('plotB')); }

  /* ---------- words: HUD, legend, readouts, pills ---------- */
  const LEGEND = {
    graft: [['cy box', '嫁接空间 L<sub>w</sub>（模 H）', 'graft space L<sub>w</sub> (mod H)'], ['vi', 'R：一步 step', 'R: one step'], ['cy', 'G：加上 w', 'G: add w'], ['mg', 'stepᵏ(v)', 'stepᵏ(v)'], ['am', '当前组成 u', 'current composition u']],
    lineage: [['cy', 'α 叶', 'α leaf'], ['mg', 'β 叶', 'β leaf'], ['vi box', 'TV(n)', 'TV(n)'], ['ik box', '像树所占的份额', 'share of the image trees'], ['am', '当前一代', 'current generation']],
    deficit: [['ik box', 'Zeckendorf 数字', 'Zeckendorf digits'], ['dm box', '窗口 [−ψ², −ψ]', 'window [−ψ², −ψ]'], ['am', '当前一对的读数与 c', 'readings and c of the current pair']]
  };
  function drawText() {
    let title, hud, note, keyName, keyVal;
    if (S.scene === 'graft') {
      const G = graft(), m = letters(), row = G.rows[m], tm = [mod(row.t[0], G.H), mod(row.t[1], G.H)], inL = G.space.has(tm[0] + G.H * tm[1]), q = quantity(row.u);
      const sk = stepN(G.v, row.k), ok = sk[0] + row.t[0] === row.u[0] && sk[1] + row.t[1] === row.u[1];
      title = L(`嫁接 · 模 ${G.H}`, `Graft · mod ${G.H}`);
      hud = L(`第 ${m} / ${S.word.length} 个字母 · u = step${sup(row.k)}(v) + t ${ok ? '✓' : '✗'} · t mod ${G.H} ∈ ⟨w, Mw⟩ ${inL ? '✓' : '✗'}`, `letter ${m} / ${S.word.length} · u = step${sup(row.k)}(v) + t ${ok ? '✓' : '✗'} · t mod ${G.H} ∈ ⟨w, Mw⟩ ${inL ? '✓' : '✗'}`);
      note = G.space.size === G.H * G.H ? L(`w 与 Mw 模 ${G.H} 张成整个 ${G.H}×${G.H} 格：平移可以是任意余数。`, `w and Mw span the whole ${G.H}×${G.H} grid mod ${G.H}: the translation can be any residue.`)
        : L(`gcd(w₁, w₂, H) = ${G.gw}：嫁接空间只有 ${G.space.size} 格，平移出不了这些格。`, `gcd(w₁, w₂, H) = ${G.gw}: the graft space has ${G.space.size} cells, and the translation never leaves them.`);
      // two unbreakable groups: a narrow column breaks after "=", never before the mark
      $('roU').innerHTML = `<span class="nw">${pair(row.u)} =</span> <span class="nw"><span class="c-mg">${pair(sk)}</span> + <span class="c-cy">${pair(row.t)}</span> <span class="nummark">${ok ? '✓' : '✗'}</span></span>`;
      $('roUSub').textContent = `step${sup(row.k)}(${G.v.join(', ')}) + t`;
      $('roK').textContent = `${m} / ${S.word.length} · k = ${row.k}`;
      $('roPer').textContent = L(`${G.period}（整除 (H²)!）`, `${G.period} (divides (H²)!)`);
      $('roT').innerHTML = `${pair(tm)} · |L<sub>w</sub>| = ${G.space.size} <span class="nummark">${inL ? '∈ ✓' : '∉ ✗'}</span>`;
      $('roRead').textContent = `gcd(${q}, ${G.H}) = ${gcd(q, G.H)}`;
      keyName = 'u'; keyVal = pair(row.u);
    } else if (S.scene === 'lineage') {
      const v = [S.a, S.b], n = gen(), tv = tvOf(v, n), u = stepN(v, n), imgs = images(S.a, S.b, n), count = imgs.length;
      const distinct = new Set(imgs.map(ser)).size, same = imgs.every((t) => { const c = comp(t); return c[0] === u[0] && c[1] === u[1]; });
      const tv1 = tvOf(v, 1), bound = 1 - Math.pow(0.5, S.b), holds = S.a + S.b < 2 || bound <= tv1.value + 1e-12;
      title = L(`血统 · n = ${n}`, `Lineage · n = ${n}`);
      hud = L(`${count} 棵树读数都是 ${pair(u)} · q = ${quantity(u)} · TV = ${tvText(tv)}`, `${count} tree${count === 1 ? '' : 's'} all read ${pair(u)} · q = ${quantity(u)} · TV = ${tvText(tv)}`);
      note = n === 0 ? L('第 0 代：像树就是整个纤维，全变差为 0。', 'Generation 0: the images are the whole fiber, and the total variation is 0.')
        : L(`这 ${count} 棵树在 ${big(tv.tgt)} 棵同组成的树里只占 ${count} 个位置。`, `These ${count} tree${count === 1 ? '' : 's'} hold ${count} of the ${big(tv.tgt)} places of their fiber.`);
      $('roTV').innerHTML = `<span class="c-vi">${tvText(tv)}</span> <small>${tvDec(tv)}</small>`;
      $('roTVSub').textContent = `1 ${MINUS} ${big(tv.src)} / ${big(tv.tgt)}`;
      $('roSrc').textContent = `${count} = ${catalan(S.a + S.b - 1)} · ${binom(S.a + S.b, S.a)}`;
      $('roTgt').textContent = `${pair(u)} : ${big(tv.tgt)}`;
      $('roBnd').innerHTML = `${pair(u)} · q = ${quantity(u)} <span class="nummark">${same ? `${count} / ${count} ✓` : '✗'}</span>`;
      $('roInj').innerHTML = `${distinct} / ${count} <span class="nummark">${distinct === count ? '✓' : '✗'}</span> · ${S.a + S.b >= 2 ? `${fix(bound, 3)} ≤ ${fix(tv1.value, 3)} <span class="nummark">${holds ? '✓' : '✗'}</span>` : L('a + b = 1：下界不适用', 'a + b = 1: no bound')}`;
      keyName = 'TV'; keyVal = tvText(tv);
    } else {
      const v1 = S.v1, v2 = v2Now(), c = deficit(v1, v2), r = [contraction(v1), contraction(v2), contraction(v1 + v2)], inWin = r.every((x) => x >= LO - 1e-12 && x <= HI + 1e-12);
      title = L(`亏量 · c(${v1}, ${v2}) = ${fmtSigned(c[0])}`, `Deficit · c(${v1}, ${v2}) = ${fmtSigned(c[0])}`);
      hud = L(`三个读数都在窗口 [${MINUS}0.382, 0.618] 里 ${inWin ? '✓' : '✗'} · c ∈ (${MINUS}1.382, 1.618) · 只有 ${MINUS}1、0、1`, `all three readings lie in [${MINUS}0.382, 0.618] ${inWin ? '✓' : '✗'} · c ∈ (${MINUS}1.382, 1.618) · only ${MINUS}1, 0, 1`);
      note = L('φ 的系数相消，c 是整数；收缩面上的三个读数都在长度为 1 的窗口里，所以 c 只能是 −1、0、1。', 'The φ-coefficients cancel, so c is an integer; the three contraction-face readings lie in a window of length 1, so c can only be −1, 0 or 1.');
      const b = [beta(v1), beta(v2), beta(v1 + v2)];
      $('roC').innerHTML = `<span class="${c[0] > 0 ? 'c-cy' : c[0] < 0 ? 'c-mg' : ''}">${fmtSigned(c[0])}</span> <span class="nummark">${c[1] === 0 && Math.abs(c[0]) <= 1 ? '∈ {−1, 0, 1} ✓' : '✗'}</span>`;
      $('roCSub').textContent = `= (${fmtZphi([b[0][0] + b[1][0], b[0][1] + b[1][1]])}) ${MINUS} (${fmtZphi(b[2])})`;
      $('roB1').textContent = fmtZphi(b[0]); $('roB2').textContent = fmtZphi(b[1]);
      $('roPhi').innerHTML = `${b[0][1]} + ${b[1][1]} ${MINUS} ${b[2][1]} = ${c[1]} <span class="nummark">${c[1] === 0 ? '✓' : '✗'}</span>`;
      $('roWin').innerHTML = `${r.map((x) => fix(x, 3)).join(' · ')} <span class="nummark">${inWin ? '✓' : '✗'}</span>`;
      keyName = 'c'; keyVal = fmtSigned(c[0]);
    }
    $('hudBig').textContent = title; $('hudSub').textContent = hud; $('roNote').textContent = note;
    const leg = LEGEND[S.scene].map(([cl, zh, en]) => `<span><i class="sw ${cl}"></i>${L(zh, en)}</span>`).join('');
    if ($('legend')._h !== leg) { $('legend').innerHTML = leg; $('legend')._h = leg; }
    $('pillComp').querySelector('strong').textContent = S.scene === 'deficit' ? `${S.v1}, ${v2Now()}` : `${S.a}, ${S.b}`;
    $('pillKeyName').textContent = keyName; $('pillKey').querySelector('strong').textContent = keyVal;
    const box = (k, v) => { const el = $(k + 'Num'); if (document.activeElement !== el) el.value = String(v); };
    box('a', S.a); box('b', S.b); box('h', S.H); box('j', S.j); box('m', S.c); box('v1', S.v1); box('v2', v2Now());
    if (document.activeElement !== $('v1')) $('v1').value = String(S.v1);
    $('aDec').disabled = S.a <= 0 || S.a + S.b <= 1; $('aInc').disabled = S.a >= AB_MAX; $('bDec').disabled = S.b <= 0 || S.a + S.b <= 1; $('bInc').disabled = S.b >= AB_MAX;
    $('hDec').disabled = S.H <= 2; $('hInc').disabled = S.H >= 9; $('jDec').disabled = S.j <= 0; $('jInc').disabled = S.j >= 5; $('mDec').disabled = S.c <= 1; $('mInc').disabled = S.c >= 3;
    $('v1Dec').disabled = S.v1 <= 0; $('v1Inc').disabled = S.v1 >= VMAX; $('v2Dec').disabled = v2Now() <= 0; $('v2Inc').disabled = v2Now() >= VMAX;
    $('addR').disabled = $('addG').disabled = S.word.length >= WORD_MAX; $('popW').disabled = S.word.length <= 1;
  }

  const paint = kit.painter(() => { drawText(); drawStage(); drawPlots(); }, [$('stage'), $('plotA'), $('plotB')]);

  /* ---------- the rail, scenes and controls ---------- */
  const SC = {
    graft: { max: () => S.word.length, rate: 1.6, step: 1 },
    lineage: { max: () => GEN_MAX, rate: 0.9, step: 1 },
    deficit: { max: () => VMAX, rate: 12, step: 1 }
  };
  clock = kit.clock({
    range: $('now'), play: $('play'), label: $('tau'), speeds: $('speedChips'), max: 4, rate: 1.6, step: 1,
    // (the label is first drawn while the clock is being built: it reads t and the page state, never the clock)
    format: (t) => {
      const k = Math.floor(t + 1e-9);
      return S.scene === 'graft' ? `${L('字母 ', 'LETTER ')}${Math.min(S.word.length, k)} <small>/ ${S.word.length}</small>`
        : S.scene === 'lineage' ? `n = ${Math.min(GEN_MAX, k)} <small>/ ${GEN_MAX}</small>` : `v₂ = ${clamp(k, 0, VMAX)} <small>/ ${VMAX}</small>`;
    },
    onChange: (t, C) => {
      if (S.stopAt != null && C.playing && t >= S.stopAt - 1e-9) { const end = S.stopAt; S.stopAt = null; C.pause(); C.set(end); return; }
      paint();
    }
  });
  function fitClock(t) {
    const sc = SC[S.scene];
    S.stopAt = null; clock.pause(); clock.rate = sc.rate; clock.step = sc.step; clock.setMax(sc.max(), true);
    clock.set(t == null ? Math.min(clock.t, clock.max) : t);
  }
  /** Switch scene; each scene keeps where its rail was (the graft rail, the generation, v₂). */
  function setScene(sc, t) {
    if (S.scene !== sc) S.rail[S.scene] = clock.t;
    S.scene = sc; sceneChips.set(sc, true);
    document.querySelectorAll('[data-scenes]').forEach((el) => { el.hidden = !el.dataset.scenes.split(' ').includes(sc); });
    fitClock(t == null ? Math.min(S.rail[sc], SC[sc].max()) : t);
  }
  const leave = () => cards.mark(null);
  const sceneChips = kit.chips($('sceneChips'), 'scene', (v) => { leave(); setScene(v); });
  const clampAB = () => { if (S.a + S.b < 1) S.b = 1; };
  const setters = {
    a: (x) => { S.a = clamp(x, 0, AB_MAX); clampAB(); paint(); },
    b: (x) => { S.b = clamp(x, 0, AB_MAX); clampAB(); paint(); },
    h: (x) => { S.H = clamp(x, 2, 9); paint(); },
    j: (x) => { S.j = clamp(x, 0, 5); paint(); },
    m: (x) => { S.c = clamp(x, 1, 3); paint(); },
    v1: (x) => { S.v1 = clamp(x, 0, VMAX); paint(); },
    v2: (x) => { if (S.scene !== 'deficit') setScene('deficit'); clock.pause(); clock.set(clamp(x, 0, VMAX)); }
  };
  const current = { a: () => S.a, b: () => S.b, h: () => S.H, j: () => S.j, m: () => S.c, v1: () => S.v1, v2: () => v2Now() };
  for (const k of Object.keys(setters)) {
    const go = (x) => { leave(); setters[k](Math.round(Number(x)) || 0); };
    $(k + 'Num').addEventListener('change', (ev) => { go(ev.target.value); ev.target.value = String(current[k]()); });
    $(k + 'Num').addEventListener('keydown', (ev) => { if (ev.key === 'Enter') ev.target.blur(); });
    $(k + 'Dec').addEventListener('click', () => go(current[k]() - 1));
    $(k + 'Inc').addEventListener('click', () => go(current[k]() + 1));
  }
  $('v1').addEventListener('input', (ev) => { leave(); setters.v1(Math.round(Number(ev.target.value)) || 0); });
  const editWord = (fn) => { leave(); fn(); fitClock(S.word.length); };   // an edited word is shown run to its end
  $('addR').addEventListener('click', () => editWord(() => { if (S.word.length < WORD_MAX) S.word.push('R'); }));
  $('addG').addEventListener('click', () => editWord(() => { if (S.word.length < WORD_MAX) S.word.push('G'); }));
  $('popW').addEventListener('click', () => editWord(() => { if (S.word.length > 1) S.word.pop(); }));
  $('rew').addEventListener('click', () => { S.stopAt = null; clock.pause(); clock.set(0); });
  kit.keys({ 1: () => { leave(); setScene('graft'); }, 2: () => { leave(); setScene('lineage'); }, 3: () => { leave(); setScene('deficit'); } });

  /* ---------- direct manipulation: a letter of the word, a generation of the ladder, a bar of the deficit row ---------- */
  const local = (cv, ev) => { const b = cv.getBoundingClientRect(); return [ev.clientX - b.left, ev.clientY - b.top]; };
  $('cv').addEventListener('click', (ev) => {
    const [x, y] = local($('cv'), ev);
    if (S.scene === 'graft' && geo.tokens) {
      const tk = geo.tokens.find((q) => x >= q.x && x <= q.x + q.w && y >= q.y && y <= q.y + q.h);
      if (tk) editWord(() => { S.word[tk.i] = S.word[tk.i] === 'R' ? 'G' : 'R'; });
    } else if (S.scene === 'lineage' && geo.ladder) {
      const row = geo.ladder.find((r) => y >= r.y && y < r.y + r.h && x > $('cv').clientWidth * 0.45);
      if (row) { leave(); S.stopAt = null; clock.pause(); clock.set(row.k); }
    }
  });
  $('cv').addEventListener('pointermove', (ev) => {
    const [x, y] = local($('cv'), ev);
    const over = (S.scene === 'graft' && geo.tokens && geo.tokens.some((q) => x >= q.x && x <= q.x + q.w && y >= q.y && y <= q.y + q.h))
      || (S.scene === 'lineage' && geo.ladder && x > $('cv').clientWidth * 0.45 && geo.ladder.some((r) => y >= r.y && y < r.y + r.h));
    $('cv').style.cursor = over ? 'pointer' : 'default';
  });
  $('plotB').addEventListener('click', (ev) => { if (!geo.plotB) return; const [x] = local($('plotB'), ev); leave(); setters.v2(Math.floor(geo.plotB.invX(x))); });

  /* ---------- experiment cards ---------- */
  // a card that plays declares its still: the frame of the cover and of the figure a chapter cites
  const PRESETS = {
    graft: { scene: 'graft', ab: [2, 1], H: 5, j: 2, c: 1, word: 'RGRG', from: 0, at: 4, play: true, still: 4 },
    boundary: { scene: 'lineage', ab: [2, 1], at: 2, still: 2 },
    lineage: { scene: 'lineage', ab: [1, 1], from: 0, at: 3, play: true, still: 3 },
    deficit: { scene: 'deficit', v1: 1, at: 1, still: 1 }
  };
  const NOTES = {
    graft: ['v = (2, 1)，w = step²(1, 0) = (1, 1)，H = 5，词 R G R G。每走一个字母，琥珀点都恰好落在 stepᵏ(v) 加上一个平移处；走完时 u = (5, 7) = step²(v) + t = (3, 4) + (2, 3)，t = Mw + w。t 的余数在 w 与 Mw 张成的嫁接空间里（模 5 时是整个格）。',
      'v = (2, 1), w = step²(1, 0) = (1, 1), H = 5, the word R G R G. After each letter the amber dot sits exactly at stepᵏ(v) plus a translation; at the end u = (5, 7) = step²(v) + t = (3, 4) + (2, 3) with t = Mw + w. The residue of t lies in the graft space spanned by w and Mw (mod 5, the whole grid).'],
    boundary: ['上排是组成 (2, 1) 的全部 Catalan(2) · C(3, 2) = 6 棵有序二叉树：形状与叶序各不相同，边界读数却全是 (2, 1) · q = 7。下排是它们替换两代后的像：读数又全是 (3, 4) · q = 18，仍两两不同，只占这一纤维 4620 棵中的 6 棵。',
      'The upper row holds all Catalan(2) · C(3, 2) = 6 ordered binary trees of composition (2, 1): different shapes and leaf orders, yet every one reads (2, 1) · q = 7. The lower row holds their images two generations on: again they all read (3, 4) · q = 18, still pairwise distinct, filling only 6 of the 4620 trees of that fiber.'],
    lineage: ['从 (1, 1) 的两棵树出发：第一代组成 (1, 2) 的纤维有 6 棵树，两棵像只占 2 棵，TV(1) = 1 − 2/6 = 2/3；第二代 1 − 2/140，第三代 1 − 2/24024，逼近 1。边界读数始终确定。',
      'Start from the two trees of (1, 1): at generation 1 the fiber of (1, 2) has 6 trees and the two images take 2 of them, TV(1) = 1 − 2/6 = 2/3; then 1 − 2/140, then 1 − 2/24024, closing in on 1. The boundary reading stays determined throughout.'],
    deficit: ['c(1, 1)：Z(1) + Z(1) 的两枚筹码进位成 Z(2)，β(1) + β(1) − β(2) = (2 + 2φ) − (1 + 2φ) = +1。收缩面上的读数 ψ²、ψ²、ψ³ 都在窗口 [−ψ², −ψ] 里，c 只能是 −1、0、1。拖时间轴让 v₂ 走到 89。',
      'c(1, 1): the two tokens of Z(1) + Z(1) carry into Z(2), and β(1) + β(1) − β(2) = (2 + 2φ) − (1 + 2φ) = +1. The contraction-face readings ψ², ψ², ψ³ all lie in the window [−ψ², −ψ], so c can only be −1, 0 or 1. Drag the rail to run v₂ up to 89.']
  };
  // a cited figure keeps one sentence next to ◀ ▶; the full lab has the explanations above
  const FIGURE_NOTES = {
    graft: ['嫁接词 RGRG：u = step²(v) + t，t 落在嫁接空间里。', 'Graft word RGRG: u = step²(v) + t with t in the graft space.'],
    boundary: ['六棵不同的树都读 (2, 1) · 7，两代后都读 (3, 4) · 18。', 'Six distinct trees all read (2, 1) · 7, then (3, 4) · 18.'],
    lineage: ['TV(1) = 2/3，第三代已是 1 − 2/24024。', 'TV(1) = 2/3; by generation 3 it is 1 − 2/24024.'],
    deficit: ['c(1, 1) = +1：三个读数在窗口里，c 只能取 −1、0、1。', 'c(1, 1) = +1: three readings in the window leave only −1, 0, 1.']
  };
  let booting = true;
  function applyPreset(id) {
    const p = PRESETS[id];
    if (p.ab) { S.a = p.ab[0]; S.b = p.ab[1]; }
    if (p.H) { S.H = p.H; S.j = p.j; S.c = p.c; S.word = p.word.split(''); }
    if (p.v1 != null) S.v1 = p.v1;
    setScene(p.scene, p.at);
    if (TRV.still && p.still != null) clock.set(p.still);
    // a still (cover, cited figure for PDF/EPUB) and the opening view of the full page show the telling frame;
    // inside a chapter the card plays once the reader has scrolled it into view; a click plays at once
    if (!p.play || TRV.still || (booting && !TRV.embed)) return;
    clock.set(p.from); if (p.at < clock.max) S.stopAt = p.at;
    if (booting) kit.autoplay(clock, $('stage')); else clock.play();
  }
  const cards = kit.cards($('presets'), { presets: PRESETS, notes: TRV.figure ? FIGURE_NOTES : NOTES, noteEl: $('presetNote'), tour: $('tour'), onPick: applyPreset,
    idle: ['自由探索：换组成、换模数与嫁接词、换场景、拖时间轴。随时可以再选一张卡。', 'Free play: change the composition, the modulus and the word, switch scenes, scrub the rail. Pick a card again at any time.'] });

  // the theory drawer shows every evidence box of the page
  const shelf = $('drawerEvidence');
  document.querySelectorAll('#evidence .lean').forEach((b) => shelf.appendChild(b.cloneNode(true)));
  TRV.drawer({ drawer: $('drawer'), open: $('infoBtn'), close: $('drawerClose') });
  TRV.startGlitch(document.querySelector('.brand'));

  /* ---------- probe for the browser suite, cover, start ---------- */
  const view = (cv, x, y) => { const b = cv.getBoundingClientRect(); return { x: b.left + x, y: b.top + y }; };
  window.FIB_OBSERVER_DEBUG = {
    get state() {
      const G = graft(), m = letters(), row = G.rows[m], v = [S.a, S.b], n = gen(), tv = tvOf(v, n), v2 = v2Now(), c = deficit(S.v1, v2);
      return { scene: S.scene, t: clock.t, max: clock.max, playing: clock.playing, preset: cards.current,
        a: S.a, b: S.b, H: S.H, j: S.j, c: S.c, w: G.w.slice(), word: S.word.join(''), letters: m, k: row.k, u: row.u.slice(), stepPart: stepN(G.v, row.k), trans: row.t.slice(),
        transRes: [mod(row.t[0], S.H), mod(row.t[1], S.H)], spaceSize: G.space.size, inSpace: G.space.has(mod(row.t[0], S.H) + S.H * mod(row.t[1], S.H)), period: G.period, reading: gcd(quantity(row.u), S.H),
        n, comp: stepN(v, n), quantity: quantity(stepN(v, n)), fiberSrc: tv.src.toString(), fiberTgt: tv.tgt.toString(), tv: tv.value, tvExact: tv.exact,
        v1: S.v1, v2, deficit: c[0], deficitPhi: c[1], readings: [contraction(S.v1), contraction(v2), contraction(S.v1 + v2)] };
    },
    /** Generation n of the lineage of (a, b) as written trees: a = α, b = β, (xy) = the ordered pair. */
    trees: (a, b, n) => images(a, b, n).map(ser),
    fiber: (a, b) => fiber(a, b).map(ser),
    fiberCount: (a, b) => fiberCount([a, b]).toString(),
    /** The run of the current word: [u, k, t] after each letter. */
    run: () => graft().rows.map((r) => [r.u.slice(), r.k, r.t.slice()]),
    space: () => [...graft().space].sort((x, y) => x - y),
    beta: (v) => beta(v), zeck: (v) => zeck(v), deficitRow: (v1) => Array.from({ length: VMAX + 1 }, (_, v) => deficit(v1, v)[0]),
    seek: (t) => { S.stopAt = null; clock.pause(); clock.set(t); },
    scene: (sc, t) => setScene(sc, t),
    set: (o) => { leave(); Object.assign(S, o); if (o.word) S.word = o.word.split(''); clampAB(); fitClock(); paint(); },
    point: {
      token: (i) => (geo.tokens && geo.tokens[i] ? view($('cv'), geo.tokens[i].x + geo.tokens[i].w / 2, geo.tokens[i].y + geo.tokens[i].h / 2) : null),
      ladder: (k) => (geo.ladder && geo.ladder[k] ? view($('cv'), $('cv').clientWidth * 0.8, geo.ladder[k].y + geo.ladder[k].h / 2) : null),
      bar: (v) => (geo.plotB ? view($('plotB'), geo.plotB.X(v + 0.5), geo.plotB.Y(0)) : null)
    }
  };
  /** Cover: the two trees of (1, 1), their images after three generations, and the bars of TV. */
  window.TRV_THUMB = () => { paint.now(); };
  cards.pick(cards.initial('graft'));   // a chapter may cite another card: ::: {.viz src="fib-atom-observer" preset="lineage"}
  booting = false;
  paint();
})();
