/* TRUTH//DAG · 真值图观测站: information escape on a finite arena, after trureturing
   D5/S3/ConceptDynamics/InformationEscape (CatalogKernel, ExactRate, StructuralNovelty).
     arena    16 states (x, y) on a 4×4 lattice, x across and y up
     catalog  six binary readouts; two states agree on a theorem when its readout is the same on both
                T₁ y ≥ 1 · T₂ y ≥ 2 · T₃ y ≥ 3 · T₄ x ≥ 2 · T₅ = T₁ ∧ ¬T₂ (y = 1, recoverable) · T₆ x ≤ 1 (same kernel as T₄)
     rail     t = the number of theorems inserted in the order T₁ … T₆ (a fraction draws the next cut in)
   For the selected set S the page enumerates all 120 unordered pairs of distinct states and computes, exactly:
     joint kernel   the pairs on which every theorem of S agrees (its classes: states with the same readouts)
     escape         the distinct pairs in the joint kernel; rate = escaped / 120 (Lean counts ordered pairs, ×2 / 240)
     unique capture of i ∈ S   pairs in the joint kernel of S \ {i} that theorem i separates (ExactRate.uniqueCaptureCount)
     recoverable i  agreement on every other theorem of S implies agreement on i (kernel ∈ semanticClosureWithout i)
   Colours: cyan = a cut with unique capture > 0, violet = a cut with unique capture 0, magenta = an escaped pair,
   amber = the current theorem (the one being inserted, or the last toggled) and a probed state.
   Read-only probe for the browser suite: TRUTH_DAG_DEBUG. */
(() => {
  'use strict';
  const { kit, L } = TRV, { fix, clamp } = kit, P = TRV.palette;
  const $ = (id) => document.getElementById(id);
  const N = 4, STATES = N * N, PAIRS = STATES * (STATES - 1) / 2, ORDERED = STATES * (STATES - 1);
  const SUB = '₀₁₂₃₄₅₆₇₈₉', sub = (n) => String(n).split('').map((d) => SUB[+d]).join('');
  const name = (i) => `T${sub(i + 1)}`;
  const at = (s) => [s % N, Math.floor(s / N)];
  /* lane: how far the drawn cut sits from the lattice line, toward the side where the statement is true (in pixels) */
  const TH = [
    { stmt: 'y ≥ 1', short: 'y≥1', read: (x, y) => y >= 1, lane: 3 },
    { stmt: 'y ≥ 2', short: 'y≥2', read: (x, y) => y >= 2, lane: 3 },
    { stmt: 'y ≥ 3', short: 'y≥3', read: (x, y) => y >= 3, lane: 3 },
    { stmt: 'x ≥ 2', short: 'x≥2', read: (x, y) => x >= 2, lane: 3 },
    { stmt: 'T₁ ∧ ¬T₂', short: 'T₁∧¬T₂', read: (x, y) => y >= 1 && !(y >= 2), lane: 8, from: [0, 1] },
    { stmt: 'x ≤ 1', short: 'x≤1', read: (x, y) => x <= 1, lane: 3, twin: 3 }
  ];
  const K = TH.length, ALL = (1 << K) - 1, NODE_ORDER = [0, 1, 2, 3, 5, 4];
  const R = TH.map((th) => Array.from({ length: STATES }, (_, s) => (th.read(...at(s)) ? 1 : 0)));
  const agree = (i, a, b) => R[i][a] === R[i][b];
  const members = (mask) => TH.map((_, i) => i).filter((i) => (mask >> i) & 1);
  const prefix = (k) => (1 << k) - 1;

  /* ---------- exact combinatorics of one selection (64 selections in all, each computed once) ---------- */
  const memo = new Map();
  function analyse(mask) {
    if (memo.has(mask)) return memo.get(mask);
    const sel = members(mask);
    const joint = (a, b, skip) => sel.every((i) => i === skip || agree(i, a, b));
    const ids = new Map(), classOf = [];
    for (let s = 0; s < STATES; s++) { const key = sel.map((i) => R[i][s]).join(''); if (!ids.has(key)) ids.set(key, ids.size); classOf.push(ids.get(key)); }
    const pairs = [];
    for (let a = 0; a < STATES; a++) for (let b = a + 1; b < STATES; b++) if (joint(a, b, -1)) pairs.push([a, b]);
    const unique = {}, without = {}, recoverable = {};
    for (const i of sel) {
      let u = 0, w = 0;
      for (let a = 0; a < STATES; a++) for (let b = a + 1; b < STATES; b++) if (joint(a, b, i)) { w++; if (!agree(i, a, b)) u++; }
      unique[i] = u; without[i] = w;
      // the kernel of i contains the joint kernel of the others (over all ordered pairs, the diagonal included)
      let rec = true;
      for (let a = 0; a < STATES && rec; a++) for (let b = 0; b < STATES; b++) if (joint(a, b, i) && !agree(i, a, b)) { rec = false; break; }
      recoverable[i] = rec;
    }
    const r = { mask, sel, classOf, classes: ids.size, pairs, escaped: pairs.length, unique, without, recoverable };
    memo.set(mask, r);
    return r;
  }
  const RATES = Array.from({ length: K + 1 }, (_, k) => analyse(prefix(k)).escaped / PAIRS);

  /* ---------- state: the rail replays the catalog in order; toggling a theorem makes a custom catalog ---------- */
  const S = { custom: null, last: -1, probe: null, stopAt: null };
  let clock = null;
  const tNow = () => (clock ? clock.t : 3);
  const kNow = () => Math.min(K, Math.floor(tNow() + 1e-9));
  const frac = () => (S.custom == null && kNow() < K ? clamp(tNow() - kNow(), 0, 1) : 0);
  const mask = () => (S.custom != null ? S.custom : prefix(kNow()));
  /** The current theorem: the one being drawn in, else the last inserted (prefix), else the last toggled (custom). */
  const current = () => (S.custom != null ? S.last : frac() > 0 ? kNow() : kNow() - 1);
  const inserting = () => (S.custom == null && frac() > 0 ? kNow() : -1);

  /* ---------- formatting and canvas text ---------- */
  const face = (f) => (f === 'body' ? TRV.fonts.body : f === 'display' ? TRV.fonts.display : TRV.fonts.data);
  function text(ctx, str, x, y, color, o) {
    o = o || {};
    ctx.font = `${o.weight ? o.weight + ' ' : ''}${o.size || 11}px ${face(o.face)}`; ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.base || 'middle';
    ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
    if (o.halo) { ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.strokeStyle = P.stage; ctx.strokeText(str, x, y); }
    ctx.fillStyle = color; ctx.fillText(str, x, y); ctx.globalAlpha = 1;
  }
  const rate3 = (n) => fix(n / PAIRS, 3);
  const cutCol = (A, i) => (i === current() ? P.amber : A.unique[i] > 0 ? P.cyan : P.violet);

  /* ---------- the cuts of a theorem as merged lattice segments (lattice units, y up) ---------- */
  const CUTS = TH.map((_, i) => {
    const h = [], v = [];
    for (let s = 0; s < STATES; s++) {
      const [x, y] = at(s);
      if (x + 1 < N && R[i][s] !== R[i][s + 1]) v.push({ u: x + 1, a: y, b: y + 1, dir: R[i][s + 1] ? 1 : -1 });
      if (y + 1 < N && R[i][s] !== R[i][s + N]) h.push({ w: y + 1, a: x, b: x + 1, dir: R[i][s + N] ? 1 : -1 });
    }
    const merge = (list, key) => {
      list.sort((p, q) => p[key] - q[key] || p.a - q.a);
      const out = [];
      for (const sgm of list) { const last = out[out.length - 1]; if (last && last[key] === sgm[key] && last.b === sgm.a && last.dir === sgm.dir) last.b = sgm.b; else out.push({ ...sgm }); }
      return out;
    };
    return { h: merge(h, 'w'), v: merge(v, 'u') };
  });

  /* ---------- the stage ---------- */
  let geo = null;
  function drawLattice(ctx, lx, ly, side, A, thumb) {
    const c = side / N, X = (u) => lx + u * c, Y = (w) => ly + side - w * c, ins = inserting(), e = TRV.smooth(frac());
    const center = (s) => { const [x, y] = at(s); return [X(x + 0.5), Y(y + 0.5)]; };
    const scale = thumb ? 1.9 : 1;
    // cells
    ctx.strokeStyle = TRV.alpha(P.lineHot, 0.38); ctx.lineWidth = 1;
    for (let k = 0; k <= N; k++) { ctx.beginPath(); ctx.moveTo(X(k), Y(0)); ctx.lineTo(X(k), Y(N)); ctx.moveTo(X(0), Y(k)); ctx.lineTo(X(N), Y(k)); ctx.stroke(); }
    if (!thumb) {
      for (let k = 0; k < N; k++) { text(ctx, String(k), X(k + 0.5), Y(0) + 13, P.dim, { align: 'center', size: 10.5 }); text(ctx, String(k), X(0) - 12, Y(k + 0.5), P.dim, { align: 'center', size: 10.5 }); }
      text(ctx, 'x →', X(N) + 6, Y(0) + 13, P.dim, { size: 10.5, alpha: 0.85 }); text(ctx, 'y', X(0) - 12, Y(N) - 2, P.dim, { align: 'center', size: 10.5, base: 'bottom' });
    }
    // escaped pairs: one curve per pair of distinct states the catalog cannot tell apart
    const severed = ins >= 0 ? (pr) => !agree(ins, pr[0], pr[1]) : () => false;
    const dense = A.escaped > 24, probe = S.probe;
    ctx.lineCap = 'round';
    for (const pr of A.pairs) {
      const [ax, ay] = center(pr[0]), [bx, by] = center(pr[1]), mx = (ax + bx) / 2, my = (ay + by) / 2, dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy);
      const bend = Math.min(0.24 * d, c * 0.55) * ((pr[0] + pr[1]) % 2 ? 1 : -1), qx = mx - dy / d * bend, qy = my + dx / d * bend;
      const cut = severed(pr), hit = probe != null && (pr[0] === probe || pr[1] === probe);
      ctx.strokeStyle = cut || hit ? P.amber : P.magenta;
      ctx.globalAlpha = cut ? 0.85 * (1 - e) : hit ? 0.95 : dense ? 0.3 : 0.75;
      ctx.lineWidth = (hit ? 2.2 : dense ? 1.1 : 1.8) * scale;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.quadraticCurveTo(qx, qy, bx, by); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // cuts: each selected theorem, drawn beside the lattice line on the side where its statement is true
    const labels = [];
    const drawCut = (i, grow, col, dash) => {
      const off = TH[i].lane * scale;
      ctx.strokeStyle = col; ctx.lineWidth = (i === current() ? 3 : 2.2) * scale; ctx.setLineDash(dash ? [6 * scale, 4 * scale] : []);
      if (col === P.amber) { ctx.shadowColor = P.amber; ctx.shadowBlur = 10; }
      for (const sgm of CUTS[i].h) { const y = Y(sgm.w) - sgm.dir * off, x0 = X(sgm.a), x1 = X(sgm.a + (sgm.b - sgm.a) * grow); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); }
      for (const sgm of CUTS[i].v) { const x = X(sgm.u) + sgm.dir * off, y0 = Y(sgm.a), y1 = Y(sgm.a + (sgm.b - sgm.a) * grow); ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); }
      ctx.setLineDash([]); ctx.shadowBlur = 0;
      // one label per theorem, where its cut meets the right edge (horizontal parts) or the top edge
      const hr = CUTS[i].h.find((sgm) => sgm.b === N), vt = CUTS[i].v.find((sgm) => sgm.b === N);
      if (hr) labels.push({ i, side: 'r', x: X(N) + 8, y: Y(hr.w) - hr.dir * off, col });
      else if (vt) labels.push({ i, side: 't', x: X(vt.u) + vt.dir * off, y: Y(N) - 9, col });
    };
    for (const i of A.sel) drawCut(i, 1, cutCol(A, i), A.unique[i] === 0);
    if (ins >= 0) drawCut(ins, e, P.amber, false);
    // states
    const r = Math.max(4, c * 0.12) * (thumb ? 1.35 : 1);
    for (let s = 0; s < STATES; s++) {
      const [x, y] = center(s), alone = !A.pairs.some((pr) => pr[0] === s || pr[1] === s);
      ctx.fillStyle = P.ink; ctx.globalAlpha = alone ? 1 : 0.88; ctx.beginPath(); ctx.arc(x, y, r, 0, kit.TAU); ctx.fill(); ctx.globalAlpha = 1;
      if (!alone) { ctx.strokeStyle = P.magenta; ctx.lineWidth = 1.4 * scale; ctx.beginPath(); ctx.arc(x, y, r + 2.5 * scale, 0, kit.TAU); ctx.stroke(); }
      if (s === probe) { ctx.strokeStyle = P.amber; ctx.lineWidth = 2; ctx.shadowColor = P.amber; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(x, y, r + 7, 0, kit.TAU); ctx.stroke(); ctx.shadowBlur = 0; }
    }
    // cut labels, pushed apart where two cuts end side by side
    if (!thumb) {
      const place = (list, key, gap) => { list.sort((p, q) => p[key] - q[key]); for (let k = 1; k < list.length; k++) if (list[k][key] - list[k - 1][key] < gap) list[k][key] = list[k - 1][key] + gap; };
      const right = labels.filter((l) => l.side === 'r'), top = labels.filter((l) => l.side === 't');
      place(right, 'y', 14); place(top, 'x', 24);
      for (const l of right) text(ctx, name(l.i), l.x, l.y, l.col, { size: 12, weight: 600, halo: true });
      for (const l of top) text(ctx, name(l.i), l.x, l.y, l.col, { size: 12, weight: 600, align: 'center', base: 'bottom', halo: true });
    }
    return { X, Y, c, lx, ly, side, center };
  }

  /** The catalog as a small DAG: one node per theorem; T₅ is built from T₁ and T₂, T₆ states the cut of T₄.
      mode: 'column' (statements beside the nodes), 'mini' (a narrow column: node and count), 'row' (under the lattice). */
  function drawNodes(ctx, box, A, mode, thumb) {
    const nodes = [], cur = current(), sel = new Set(A.sel), row = mode === 'row';
    // the derived theorem T₅ comes last, below its sources; the twin T₆ sits right after T₄
    const slot = (i) => NODE_ORDER.indexOf(i);
    if (!row) {
      const rh = Math.min(mode === 'mini' ? 50 : 62, box.h / K), r = clamp(rh * 0.3, 9, 15), cx = box.x + (mode === 'mini' ? 34 : 44), y0 = box.y + (box.h - rh * K) / 2;
      for (let i = 0; i < K; i++) nodes.push({ i, x: cx, y: y0 + (slot(i) + 0.5) * rh, r });
    } else {
      const cw = box.w / K, r = clamp(Math.min(cw * 0.26, box.h * 0.2), 8, 14), y = box.y + r + 18;
      for (let i = 0; i < K; i++) nodes.push({ i, x: box.x + (slot(i) + 0.5) * cw, y, r });
    }
    const bends = mode === 'column' ? [34, 22] : [20, 12];
    // relations: T₁ → T₅ ← T₂ (built from), T₄ ═ T₆ (same kernel: a double bar between the two adjacent nodes)
    const rel = (a, b, bend, col, twin) => {
      const p = nodes[a], q = nodes[b];
      ctx.strokeStyle = col; ctx.lineWidth = 1.3 * (thumb ? 1.8 : 1); ctx.globalAlpha = 0.85;
      const path = (d) => {
        ctx.beginPath();
        if (twin && !row) { ctx.moveTo(p.x + d, p.y + p.r + 2); ctx.lineTo(q.x + d, q.y - q.r - 2); }
        else if (twin) { ctx.moveTo(p.x + p.r + 2, p.y + d); ctx.lineTo(q.x - q.r - 2, q.y + d); }
        else if (!row) { ctx.moveTo(p.x - p.r, p.y + d); ctx.bezierCurveTo(p.x - p.r - bend, p.y + d, q.x - q.r - bend, q.y + d, q.x - q.r, q.y + d); }
        else { ctx.moveTo(p.x, p.y - p.r + d); ctx.bezierCurveTo(p.x, p.y - p.r - bend + d, q.x, q.y - q.r - bend + d, q.x, q.y - q.r + d); }
        ctx.stroke();
      };
      if (twin) { path(-2); path(2); } else {
        path(0);
        const hx = !row ? q.x - q.r : q.x, hy = !row ? q.y : q.y - q.r, ang = !row ? 0 : Math.PI / 2, s = 6;
        ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx - s * Math.cos(ang) - s * 0.5 * Math.sin(ang), hy - s * Math.sin(ang) + s * 0.5 * Math.cos(ang));
        ctx.lineTo(hx - s * Math.cos(ang) + s * 0.5 * Math.sin(ang), hy - s * Math.sin(ang) - s * 0.5 * Math.cos(ang)); ctx.closePath(); ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    const relCol = sel.has(4) && A.recoverable[4] ? P.violet : P.lineHot;
    rel(0, 4, bends[0], relCol, false); rel(1, 4, bends[1], relCol, false); rel(3, 5, 0, sel.has(3) && sel.has(5) ? P.violet : P.lineHot, true);
    for (const n of nodes) {
      const on = sel.has(n.i), col = n.i === cur ? P.amber : !on ? P.faint : A.unique[n.i] > 0 ? P.cyan : P.violet;
      ctx.fillStyle = on ? TRV.alpha(col, 0.18) : TRV.alpha(P.stage, 0.9); ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, kit.TAU); ctx.fill();
      ctx.strokeStyle = col; ctx.lineWidth = (n.i === cur ? 2.4 : 1.6) * (thumb ? 1.6 : 1); ctx.setLineDash(on ? [] : [3, 3]);
      if (n.i === cur) { ctx.shadowColor = P.amber; ctx.shadowBlur = 12; }
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, kit.TAU); ctx.stroke(); ctx.setLineDash([]); ctx.shadowBlur = 0;
      if (thumb) continue;
      text(ctx, name(n.i), n.x, n.y + 0.5, on ? P.ink : P.dim, { align: 'center', size: n.r > 12 ? 12 : 10.5, weight: 600 });
      const u = on ? A.unique[n.i] : null, uTxt = on ? String(u) : '—', uCol = on ? (u > 0 ? P.cyan : P.violet) : P.faint;
      if (mode === 'column') {
        const tx = n.x + n.r + 10, right = box.x + box.w - 4;
        text(ctx, TH[n.i].stmt, tx, n.y - 7, on ? P.ink : P.dim, { size: 12 });
        text(ctx, on ? L('独占捕获', 'unique capture') : L('未选入目录', 'not in the catalog'), tx, n.y + 9, P.dim, { size: 10.5, face: 'body' });
        text(ctx, uTxt, right, n.y, uCol, { align: 'right', size: 15, weight: 600 });
      } else if (mode === 'mini') {
        text(ctx, uTxt, n.x + n.r + 8, n.y, uCol, { size: 13, weight: 600 });
      } else {
        text(ctx, TH[n.i].short, n.x, n.y + n.r + 11, on ? P.ink : P.dim, { align: 'center', size: 10 });
        text(ctx, uTxt, n.x, n.y + n.r + 25, uCol, { align: 'center', size: 11.5, weight: 600 });
      }
    }
    return { nodes, mode };
  }

  function drawStage() {
    const g = kit.plot($('cv'), { x: [0, 1], y: [0, 1], pad: [0, 0, 0, 0] }), ctx = g.ctx, W = g.W, H = g.H, A = analyse(mask());
    if (TRV.thumbMode) {   // the cover is wordless: the lattice after the novel cut, the catalog beside it
      const side = Math.min(H * 0.8, W * 0.5);
      const lat = drawLattice(ctx, W * 0.1, (H - side) / 2, side, A, true);
      const nodes = drawNodes(ctx, { x: W * 0.66, y: H * 0.1, w: W * 0.26, h: H * 0.8 }, A, 'column', true);
      geo = { lat, nodes };
      return;
    }
    const st = $('stage').getBoundingClientRect(), below = (el) => (el ? el.getBoundingClientRect().bottom - st.top : 0);
    const top = Math.max(46, below($('hudBig').parentElement)) + 14, bottom = Math.max(18, $('legend').offsetHeight + 22);
    const bx = { x: 18, y: top, w: W - 36, h: Math.max(120, H - top - bottom) };
    const mode = bx.w >= 560 && bx.w >= bx.h * 1.45 ? 'column' : bx.w >= bx.h * 1.05 ? 'mini' : 'row';
    let lat, nodes;
    if (mode !== 'row') {
      const colW = mode === 'column' ? clamp(bx.w * 0.36, 210, 300) : 78, gap = mode === 'column' ? 96 : 62;
      const side = Math.max(60, Math.min(bx.h - 40, bx.w - colW - gap));
      const lx = bx.x + 26 + Math.max(0, (bx.w - colW - gap - side) / 2), ly = bx.y + 18 + Math.max(0, (bx.h - 40 - side) / 2);
      lat = drawLattice(ctx, lx, ly, side, A, false);
      nodes = drawNodes(ctx, { x: bx.x + bx.w - colW, y: bx.y, w: colW, h: bx.h }, A, mode, false);
    } else {
      const rowH = clamp(bx.h * 0.26, 74, 92), side = Math.max(60, Math.min(bx.w - 70, bx.h - rowH - 40));
      const lx = bx.x + 22 + (bx.w - 52 - side) / 2, ly = bx.y + 16;
      lat = drawLattice(ctx, lx, ly, side, A, false);
      nodes = drawNodes(ctx, { x: bx.x, y: ly + side + 26, w: bx.w, h: Math.max(40, bx.y + bx.h - (ly + side + 26)) }, A, mode, false);
    }
    geo = { lat, nodes };
  }

  /* ---------- the strip ---------- */
  function plotRate(cv) {
    const A = analyse(mask()), g = kit.plot(cv, { x: [0, K], y: [0, 1.05], pad: [34, 14, 10, 20] });
    g.axes({ yTicks: [0, [0.2, '0.2'], [0.6, '0.6'], 1], xTicks: [0, 1, 2, 3, 4, 5, 6] });
    for (let k = 0; k < K; k++) { g.line([[k, RATES[k]], [k + 1, RATES[k]]], P.dim, { width: 1.3 }); g.line([[k + 1, RATES[k]], [k + 1, RATES[k + 1]]], RATES[k + 1] < RATES[k] ? P.cyan : P.violet, { width: 2.2 }); }
    for (let k = 0; k <= K; k++) g.dot(k, RATES[k], RATES[k] === RATES[k - 1] ? P.violet : P.cyan, 3.2);
    if (S.custom == null) g.vline(clamp(tNow(), 0, K), P.amber, { alpha: 0.85 });
    else { const n = A.sel.length; g.dot(n, A.escaped / PAIRS, P.amber, 5, { glow: 8 }); g.text(n, A.escaped / PAIRS, L('自选', 'custom'), P.amber, { dx: 8, dy: -8, size: 10 }); }
    $('pAMeta').textContent = `${A.escaped} / ${PAIRS} = ${rate3(A.escaped)}`;
  }
  function plotUnique(cv) {
    const A = analyse(mask()), top = Math.max(16, ...A.sel.map((i) => A.unique[i])), g = kit.plot(cv, { x: [0, K], y: [0, top * 1.18], pad: [30, 10, 10, 20] });
    g.axes({ yTicks: [0, top], xTicks: TH.map((_, i) => [i + 0.5, name(i)]) });
    for (let i = 0; i < K; i++) {
      if (!A.sel.includes(i)) { g.text(i + 0.5, top * 0.06, '—', P.faint, { align: 'center', base: 'bottom', size: 11 }); continue; }
      const u = A.unique[i], col = i === current() ? P.amber : u > 0 ? P.cyan : P.violet;
      if (u > 0) g.rect(i + 0.18, 0, i + 0.82, u, col, { alpha: 0.55, stroke: col, width: 1.2 });
      else g.rect(i + 0.18, 0, i + 0.82, top * 0.04, col, { alpha: 0.2, stroke: col, width: 1.2 });
      g.text(i + 0.5, Math.max(u, top * 0.04), String(u), col, { align: 'center', base: 'bottom', dy: -3, size: 10.5 });
    }
    const zeros = A.sel.filter((i) => A.unique[i] === 0).map(name);
    $('pBMeta').textContent = zeros.length ? L(`独占为 0：${zeros.join('、')}`, `zero: ${zeros.join(', ')}`) : L('每条都独占 > 0', 'every one > 0');
  }
  function drawPlots() { if (TRV.still || TRV.figure) return; plotRate($('plotA')); plotUnique($('plotB')); }

  /* ---------- words: HUD, readouts, pills, toggles ---------- */
  function drawText() {
    const A = analyse(mask()), cur = current(), k = kNow(), ins = inserting(), n = A.sel.length;
    let big = L(`联合核 · ${A.classes} 类`, `Joint kernel · ${A.classes} class${A.classes === 1 ? '' : 'es'}`), hud;
    const esc = L(`${A.escaped} / ${PAIRS} 对仍不可分 · 逃逸率 ${rate3(A.escaped)}`, `${A.escaped} / ${PAIRS} pairs still indistinguishable · escape rate ${rate3(A.escaped)}`);
    if (S.custom != null) hud = L(`自选 ${n} 条定理 · `, `custom catalog of ${n} · `) + esc;
    else if (ins >= 0) hud = L(`正在插入 ${name(ins)}（${TH[ins].stmt}）· `, `inserting ${name(ins)} (${TH[ins].stmt}) · `) + esc;
    else if (k === 0) hud = L(`空目录：${PAIRS} 对都分不开 · 逃逸率 1`, `empty catalog: all ${PAIRS} pairs indistinguishable · escape rate 1`);
    else hud = L(`插入 ${name(k - 1)} 之后 · `, `after inserting ${name(k - 1)} · `) + esc;
    $('hudBig').textContent = big; $('hudSub').textContent = hud;
    $('roEsc').innerHTML = `<span class="c-mg">${A.escaped}</span> / ${PAIRS} = ${rate3(A.escaped)}`;
    $('roEscSub').textContent = L(`逃逸率 · 有序计数 ${2 * A.escaped} / ${ORDERED}，比率相同`, `escape rate · ordered count ${2 * A.escaped} / ${ORDERED}, the same rate`);
    $('roCls').textContent = String(A.classes);
    $('roOrd').textContent = `${2 * A.escaped} / ${ORDERED}`;
    const inSel = cur >= 0 && A.sel.includes(cur);
    $('roCurT').innerHTML = cur >= 0 ? L(`当前定理 ${name(cur)}（${TH[cur].stmt}）的独占捕获`, `Unique capture of the current theorem ${name(cur)} (${TH[cur].stmt})`) : L('当前定理的独占捕获', 'Unique capture of the current theorem');
    if (inSel) {
      const u = A.unique[cur], w = A.without[cur], ok = w === A.escaped + u, lowers = u > 0, rec = A.recoverable[cur];
      $('roCur').innerHTML = L(`<span class="${u ? 'c-cy' : ''}">${u}</span> 对（有序 ${2 * u}）`, `<span class="${u ? 'c-cy' : ''}">${u}</span> pair${u === 1 ? '' : 's'} (ordered ${2 * u})`);
      $('roWithout').innerHTML = `${w} = ${A.escaped} + ${u} <span class="nummark">${ok ? '✓' : '✗'}</span>`;
      $('roLowers').innerHTML = L(`${rec ? '可恢复' : '不可恢复'} → ${lowers ? '降低逃逸' : '不降低逃逸'}`, `${rec ? 'recoverable' : 'not recoverable'} → ${lowers ? 'lowers the escape' : 'does not lower it'}`)
        + ` <span class="nummark">${rec === !lowers ? '✓' : '✗'}</span>`;
    } else {
      $('roCur').textContent = cur >= 0 ? L(`${name(cur)} 不在目录中`, `${name(cur)} is not in the catalog`) : L('目录为空', 'the catalog is empty');
      $('roWithout').textContent = '—'; $('roLowers').textContent = '—';
    }
    const zeros = A.sel.filter((i) => A.unique[i] === 0);
    $('roNote').textContent = !n ? L('目录为空：16 个态全在一类里。', 'Empty catalog: all 16 states lie in one class.')
      : zeros.length ? L(`${zeros.map(name).join('、')} 的独占捕获为 0：去掉它，逃逸率不变。`, `${zeros.map(name).join(', ')} capture${zeros.length === 1 ? 's' : ''} nothing alone: removing ${zeros.length === 1 ? 'it' : 'any one of them'} leaves the escape rate unchanged.`)
        : L('目录中每条定理都独占切开至少一对：去掉任何一条，逃逸率都会升高。', 'Every theorem of the catalog separates at least one pair on its own: removing any of them raises the escape rate.');
    $('pillCat').querySelector('strong').textContent = `${n} / ${K}`;
    $('pillEsc').querySelector('strong').textContent = `${A.escaped} / ${PAIRS}`;
    $('pillCls').querySelector('strong').textContent = String(A.classes);
    document.querySelectorAll('#thmChips [data-th]').forEach((b) => { const i = +b.dataset.th; b.setAttribute('aria-pressed', String(A.sel.includes(i))); b.classList.toggle('current', i === cur); });
  }

  const paint = kit.painter(() => { drawText(); drawStage(); drawPlots(); }, [$('stage'), $('plotA'), $('plotB')]);

  /* ---------- the rail ---------- */
  clock = kit.clock({
    range: $('now'), play: $('play'), label: $('tau'), speeds: $('speedChips'), max: K, t: 3, rate: 0.8, step: 1,
    // (the label is first drawn while the clock is being built: it reads t and the page state, never the clock)
    format: (t) => (S.custom != null ? `${L('自选目录', 'CUSTOM')} <small>${members(S.custom).length} / ${K}</small>`
      : `${L('已插入 ', 'INSERTED ')}${Math.min(K, Math.floor(t + 1e-9))} <small>/ ${K}</small>`),
    onChange: (t, C) => {
      S.custom = null;   // moving the rail (or playing) returns to the catalog in order
      if (S.stopAt != null && C.playing && t >= S.stopAt - 1e-9) { const end = S.stopAt; S.stopAt = null; C.pause(); C.set(end); return; }
      paint();
    }
  });
  const relabel = () => clock.set(clock.t, true);
  function setCustom(m, last) {
    S.stopAt = null; clock.pause();
    S.custom = m & ALL; S.last = last == null ? -1 : last;
    relabel(); paint();
  }
  const leave = () => cards.mark(null);
  function toggle(i) { leave(); const m = mask() ^ (1 << i); setCustom(m, i); }
  /** A click with the pointer hands the focus to the stage, so that Space plays at once (as kit does for its chips). */
  const release = (ev) => { if (!ev || !(ev.detail > 0)) return; const st = $('stage'); if (!st.hasAttribute('tabindex')) st.setAttribute('tabindex', '-1'); st.focus({ preventScroll: true }); };
  $('thmChips').addEventListener('click', (ev) => { const b = ev.target.closest('[data-th]'); if (!b) return; toggle(+b.dataset.th); release(ev); });
  $('selAll').addEventListener('click', (ev) => { leave(); setCustom(ALL, -1); release(ev); });
  $('selNone').addEventListener('click', (ev) => { leave(); S.probe = null; setCustom(0, -1); release(ev); });
  $('rew').addEventListener('click', () => { S.stopAt = null; clock.pause(); clock.set(0); });
  const keymap = {};
  for (let i = 0; i < K; i++) keymap[String(i + 1)] = () => toggle(i);
  kit.keys(keymap);

  /* ---------- direct manipulation: a node toggles its theorem; a state is probed ---------- */
  function hitAt(ev) {
    if (!geo) return null;
    const b = $('cv').getBoundingClientRect(), x = ev.clientX - b.left, y = ev.clientY - b.top;
    for (const n of geo.nodes.nodes) if (Math.hypot(x - n.x, y - n.y) <= n.r + 7) return { node: n.i };
    if (geo.nodes.mode === 'column') for (const n of geo.nodes.nodes) if (Math.abs(y - n.y) < n.r + 4 && x > n.x && x < n.x + 200) return { node: n.i };
    const l = geo.lat;
    for (let s = 0; s < STATES; s++) { const [cx, cy] = l.center(s); if (Math.hypot(x - cx, y - cy) <= Math.max(12, l.c * 0.3)) return { state: s }; }
    return null;
  }
  $('cv').addEventListener('click', (ev) => {
    const h = hitAt(ev);
    if (h && h.node != null) toggle(h.node);
    else if (h && h.state != null) { S.probe = S.probe === h.state ? null : h.state; paint(); }
    else if (S.probe != null) { S.probe = null; paint(); }
  });
  $('cv').addEventListener('pointermove', (ev) => { const h = hitAt(ev); $('cv').style.cursor = h ? 'pointer' : 'default'; });

  /* ---------- experiment cards ---------- */
  // a card that plays declares its still: the frame of the cover and of the figure a chapter cites
  const PRESETS = {
    observatory: { at: 3, still: 3 },
    'novel-cut': { from: 3, at: 4, play: true, still: 4 },
    redundant: { from: 4, at: 5, play: true, still: 5 },
    freeze: { from: 5, at: 6, play: true, still: 6 }
  };
  const NOTES = {
    observatory: ['三条水平切线 T₁、T₂、T₃ 把 16 个态切成 4 行。每行 4 个态仍互相分不开：品红连线还剩 4 × 6 = 24 对，逃逸率 24 / 120 = 0.200。',
      'Three horizontal cuts T₁, T₂, T₃ slice the 16 states into 4 rows. The 4 states of a row still cannot be told apart: 4 × 6 = 24 magenta links remain, an escape rate of 24 / 120 = 0.200.'],
    'novel-cut': ['插入竖直切线 T₄（x ≥ 2）：它的核不能由 T₁、T₂、T₃ 推出，于是把每一行一分为二。4 类变成 8 类，逃逸对从 24 降到 8；T₄ 独占切开 16 对。',
      'Insert the vertical cut T₄ (x ≥ 2): its kernel cannot be implied by T₁, T₂, T₃, so it splits every row in two. Four classes become eight and the escaped pairs fall from 24 to 8; T₄ alone separates 16 pairs.'],
    redundant: ['插入 T₅ = T₁ ∧ ¬T₂（恰是第 1 行，y = 1）：它的两条边界正是 T₁、T₂ 已画出的切线，可由它们推出。联合核不变，逃逸对仍是 8，T₅ 的独占捕获为 0。留一法下 T₁、T₂ 此时也能由另外两条推出，独占同样变成 0。',
      'Insert T₅ = T₁ ∧ ¬T₂ (exactly row 1, y = 1): its two edges are the cuts T₁ and T₂ have already drawn, so it follows from them. The joint kernel stays the same, 8 pairs still escape, and T₅ captures 0 on its own. Leave-one-out, T₁ and T₂ now follow from the other two as well, so they capture 0 too.'],
    freeze: ['插入 T₆（x ≤ 1）：与 T₄ 是同一条切线、同一个核。两者互相恢复，T₄ 与 T₆ 的独占捕获同时变成 0；逃逸对仍是 8。',
      'Insert T₆ (x ≤ 1): the same cut as T₄, with the same kernel. Each recovers the other, so T₄ and T₆ both capture 0 on their own; 8 pairs still escape.']
  };
  // a cited figure keeps one sentence next to ◀ ▶; the full lab has the explanations above
  const FIGURE_NOTES = {
    observatory: ['三条切线切出 4 类：24 / 120 对仍不可分。', 'Three cuts make 4 classes: 24 / 120 pairs still escape.'],
    'novel-cut': ['真正新的切线 T₄：逃逸对从 24 降到 8。', 'The genuinely new cut T₄: escaped pairs fall from 24 to 8.'],
    redundant: ['T₅ 可由 T₁、T₂ 推出，边界全在旧切线上：仍是 8 对。', 'T₅ follows from T₁ and T₂, its edges on old cuts: still 8 pairs.'],
    freeze: ['同核双胞胎 T₄、T₆：独占捕获都为 0。', 'Same-kernel twins T₄, T₆: both capture 0 on their own.']
  };
  let booting = true;
  function applyPreset(id) {
    const p = PRESETS[id];
    S.stopAt = null; S.probe = null; clock.pause(); clock.set(p.at);
    if (TRV.still && p.still != null) clock.set(p.still);
    // a still (cover, cited figure for PDF/EPUB) and the opening view of the full page show the telling frame;
    // inside a chapter the card plays once the reader has scrolled it into view; a click plays at once
    if (!p.play || TRV.still || (booting && !TRV.embed)) return;
    clock.set(p.from); S.stopAt = p.at;
    if (booting) kit.autoplay(clock, $('stage')); else clock.play();
  }
  const cards = kit.cards($('presets'), { presets: PRESETS, notes: TRV.figure ? FIGURE_NOTES : NOTES, noteEl: $('presetNote'), tour: $('tour'), onPick: applyPreset,
    idle: ['自由探索：切换定理、点格点上的态、拖时间轴。随时可以再选一张卡。', 'Free play: toggle theorems, probe a state on the lattice, scrub the rail. Pick a card again at any time.'] });

  // the theory drawer shows every evidence box of the page
  const shelf = $('drawerEvidence');
  document.querySelectorAll('#evidence .lean').forEach((b) => shelf.appendChild(b.cloneNode(true)));
  TRV.drawer({ drawer: $('drawer'), open: $('infoBtn'), close: $('drawerClose') });
  TRV.startGlitch(document.querySelector('.brand'));

  /* ---------- probe for the browser suite, cover, start ---------- */
  const view = (x, y) => { const b = $('cv').getBoundingClientRect(); return { x: b.left + x, y: b.top + y }; };
  window.TRUTH_DAG_DEBUG = {
    get state() {
      const A = analyse(mask()), cur = current();
      return { t: clock.t, max: clock.max, playing: clock.playing, preset: cards.current, mode: S.custom != null ? 'custom' : 'prefix', k: kNow(),
        selected: A.sel.slice(), classes: A.classes, escaped: A.escaped, escapedOrdered: 2 * A.escaped, pairs: PAIRS, orderedPairs: ORDERED, rate: A.escaped / PAIRS,
        unique: Object.fromEntries(A.sel.map((i) => [i, A.unique[i]])), without: Object.fromEntries(A.sel.map((i) => [i, A.without[i]])),
        recoverable: Object.fromEntries(A.sel.map((i) => [i, A.recoverable[i]])), current: cur, inserting: inserting(), probe: S.probe };
    },
    /** The page's catalog: readout of theorem i on state s = 4y + x (1 when its statement is true). */
    readouts: () => R.map((row) => row.slice()),
    /** The joint-kernel class of every state, and the escaped unordered pairs, for any selection (a bitmask of T₁ … T₆). */
    analyse: (m) => { const A = analyse(m & ALL); return { classOf: A.classOf.slice(), pairs: A.pairs.map((p) => p.slice()), unique: { ...A.unique }, recoverable: { ...A.recoverable }, without: { ...A.without } }; },
    statements: () => TH.map((th) => th.stmt),
    seek: (t) => { S.stopAt = null; clock.pause(); clock.set(t); },
    select: (list) => { leave(); setCustom(list.reduce((m, i) => m | (1 << i), 0), list.length ? list[list.length - 1] : -1); },
    /** Viewport coordinates of the node of theorem i, or of state s on the lattice (for pointer tests). */
    point: {
      node: (i) => (geo ? view(geo.nodes.nodes[i].x, geo.nodes.nodes[i].y) : null),
      state: (s) => (geo ? view(...geo.lat.center(s)) : null)
    }
  };
  /** Cover: the lattice right after the novel cut T₄, with the catalog beside it. */
  window.TRV_THUMB = () => { S.custom = null; S.probe = null; clock.pause(); clock.set(4); paint.now(); };
  cards.pick(cards.initial('observatory'));   // a chapter may cite another card: ::: {.viz src="truth-dag-observatory" preset="freeze"}
  booting = false;
  paint();
})();
