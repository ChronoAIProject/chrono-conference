/* HARNESS//DELTA · 变更判官: a declarative FILEMAP of 14 units and the DELTA selection over it.
     lookup   0–20   each changed file is looked up in the registry; an unregistered file fails here (registry.explicit)
     expand  20–80   breadth-first along the registered consumer edges, one level after another (delta.selection)
     judge   80–100  the selected units are judged; the rest are skipped and their cost is saved
   The cost weights add up to 100, so the share saved is 100 − the cost of the selection. A change set that touches the
   policy track (rules and judges) and product units together raises policy.mixed-warning.
   Colours: amber = changed (the reader's current selection), cyan = selected by DELTA, dim = skipped,
   magenta = warning / registry error, violet = the policy track. Read-only probe for the browser suite: HARNESS_DELTA_DEBUG. */
(() => {
  'use strict';
  const { kit, L } = TRV, { clamp } = kit, P = TRV.palette;
  const $ = (id) => document.getElementById(id);
  const T_MAX = 100, LOOKUP_END = 20, EXPAND_END = 80, GHOST_FAIL = 15;
  const GHOST = 'api/src/new_route.rs';

  /* ---------- the FILEMAP: units (group, cost, place on the grid) and consumer edges ---------- */
  const UNITS = [
    { id: 'core/kernel', name: 'kernel', group: 'core', cost: 6, col: 0, row: 0 },
    { id: 'core/runtime', name: 'runtime', group: 'core', cost: 6, col: 1, row: 0 },
    { id: 'api/server', name: 'server', group: 'api', cost: 8, col: 2, row: 0 },
    { id: 'api/client', name: 'client', group: 'api', cost: 6, col: 3, row: 0 },
    { id: 'api/contract', name: 'contract', group: 'api', cost: 5, col: 4, row: 0 },
    { id: 'viz/runtime', name: 'viz-rt', group: 'viz', cost: 5, col: 2, row: 1 },
    { id: 'viz/browser', name: 'browser', group: 'viz', cost: 18, col: 3, row: 1 },
    { id: 'docs/export', name: 'export', group: 'docs', cost: 12, col: 3, row: 2 },
    { id: 'docs/pages', name: 'pages', group: 'docs', cost: 4, col: 4, row: 2 },
    { id: 'policy/rules', name: 'rules', group: 'policy', cost: 3, col: 0, row: 3 },
    { id: 'judges/delta', name: 'delta', group: 'judges', cost: 7, col: 1, row: 3 },
    { id: 'judges/selftest', name: 'selftest', group: 'judges', cost: 6, col: 2, row: 3 },
    { id: 'docs/chapter', name: 'chapter', group: 'docs', cost: 4, col: 0, row: 4 },
    { id: 'docs/structure', name: 'structure', group: 'docs', cost: 10, col: 1, row: 4 }
  ];
  const EDGES = [
    ['core/kernel', 'core/runtime'], ['core/kernel', 'api/server'], ['core/runtime', 'api/server'], ['core/runtime', 'viz/runtime'],
    ['api/server', 'api/client'], ['api/server', 'api/contract'], ['api/client', 'api/contract'],
    ['viz/runtime', 'viz/browser'], ['viz/runtime', 'docs/export'], ['docs/export', 'docs/pages'],
    ['docs/chapter', 'docs/structure'], ['policy/rules', 'judges/delta'], ['judges/delta', 'judges/selftest']
  ];
  const BY = Object.fromEntries(UNITS.map((u) => [u.id, u]));
  const FULL = UNITS.reduce((s, u) => s + u.cost, 0);   // 100
  const POLICY = new Set(['policy', 'judges']);
  const isPolicy = (id) => POLICY.has(BY[id].group);
  const OUT = Object.fromEntries(UNITS.map((u) => [u.id, []]));
  for (const [a, b] of EDGES) OUT[a].push(b);

  /* ---------- the selection ---------- */
  const S = { changed: new Set(['docs/chapter']), ghost: false, omitEdge: false, hover: null };
  /** Breadth-first from the changed units: the level at which each unit is reached (changed units are level 0). */
  function bfs(changed) {
    const level = new Map(), queue = [];
    for (const id of UNITS.map((u) => u.id)) if (changed.has(id)) { level.set(id, 0); queue.push(id); }
    for (let i = 0; i < queue.length; i++) {
      const parent = queue[i];
      for (const nb of OUT[parent]) {
        if (S.omitEdge && parent === 'docs/chapter' && nb === 'docs/structure') continue;
        if (level.has(nb)) continue;
        level.set(nb, level.get(parent) + 1);
        queue.push(nb);
      }
    }
    return level;
  }
  let R = null;
  function derive() {
    const level = S.ghost ? new Map() : bfs(S.changed), depth = level.size ? Math.max(...level.values()) : 0;
    const selected = UNITS.map((u) => u.id).filter((id) => level.has(id)), cost = selected.reduce((s, id) => s + BY[id].cost, 0);
    const changed = UNITS.map((u) => u.id).filter((id) => S.changed.has(id));
    const policy = changed.filter(isPolicy), product = changed.filter((id) => !isPolicy(id));
    const mixed = !S.ghost && policy.length > 0 && product.length > 0;
    const group = (ids) => { const lv = bfs(new Set(ids)); return { units: [...lv.keys()], cost: [...lv.keys()].reduce((s, id) => s + BY[id].cost, 0) }; };
    R = { key: `${changed.join()}|${S.ghost}|${S.omitEdge}`, level, depth, selected, cost, changed, mixed, policyGroup: mixed ? group(policy) : null, productGroup: mixed ? group(product) : null,
      error: S.ghost ? GHOST : null, saved: FULL - cost };
  }
  const fresh = () => { if (!R || R.key !== `${UNITS.map((u) => u.id).filter((id) => S.changed.has(id)).join()}|${S.ghost}|${S.omitEdge}`) derive(); return R; };
  /** The time at which BFS level d is reached on the rail. */
  const levelAt = (d, D) => LOOKUP_END + (EXPAND_END - LOOKUP_END) * (D ? d / D : 0);
  function now(t) {
    const D = fresh(), failed = !!D.error && t >= GHOST_FAIL;
    const reached = failed || t < LOOKUP_END ? [] : D.selected.filter((id) => t >= levelAt(D.level.get(id), D.depth) - 1e-9);
    const phase = failed ? 'error' : t < LOOKUP_END ? 'lookup' : t < EXPAND_END ? 'expand' : t < T_MAX ? 'judge' : 'done';
    const judged = phase === 'judge' || phase === 'done' ? (phase === 'done' ? 1 : (t - EXPAND_END) / (T_MAX - EXPAND_END)) : 0;
    return { D, t, failed, reached, phase, judged, reachedCost: reached.reduce((s, id) => s + BY[id].cost, 0) };
  }

  /* ---------- canvas helpers ---------- */
  const face = (f) => (f === 'body' ? TRV.fonts.body : f === 'display' ? TRV.fonts.display : TRV.fonts.data);
  function text(ctx, str, x, y, color, o) {
    o = o || {};
    if (TRV.thumbMode) return;
    ctx.font = `${o.weight ? o.weight + ' ' : ''}${o.size || 11}px ${face(o.face)}`; ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.base || 'middle';
    ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
    if (o.halo) { ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.strokeStyle = P.stage; ctx.strokeText(str, x, y); }
    ctx.fillStyle = color; ctx.fillText(str, x, y); ctx.globalAlpha = 1;
  }
  function fit(ctx, str, w, size, f) {
    ctx.font = `${size}px ${face(f)}`;
    if (ctx.measureText(str).width <= w) return str;
    let s = str; while (s.length > 1 && ctx.measureText(s + '…').width > w) s = s.slice(0, -1);
    return s + '…';
  }
  function rrect(ctx, r, rad) { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(r.x, r.y, r.w, r.h, rad); else ctx.rect(r.x, r.y, r.w, r.h); }
  /** A banner across the stage: a dark plate, a coloured frame, one or two lines. */
  /** Wrap at words (Chinese at characters) to `width` pixels. */
  function wrap(ctx, str, width, size, weight) {
    ctx.font = `${weight ? weight + ' ' : ''}${size}px ${face()}`;
    const out = []; let row = '';
    for (const part of str.match(/\p{Script=Han}|[^\S\n]+|[^\p{Script=Han}\s]+/gu) || []) {
      if (row && ctx.measureText(row + part).width > width) { out.push(row.trim()); row = ''; }
      row += part;
    }
    if (row.trim()) out.push(row.trim());
    return out;
  }
  /** A banner in the region r: a dark plate, a coloured frame, a heading line and wrapped detail, centred in r. */
  function banner(ctx, head, detail, r, color, size) {
    if (TRV.thumbMode) return;
    const a = wrap(ctx, head, r.w - 14, size, 600), b = wrap(ctx, detail, r.w - 14, size - 1), lh = size + 4, h = Math.min(r.h, (a.length + b.length) * lh + 12);
    const box = { x: r.x, y: r.y + (r.h - h) / 2, w: r.w, h };
    rrect(ctx, box, 4); ctx.fillStyle = TRV.alpha(P.stage, 0.92); ctx.fill(); ctx.strokeStyle = color; ctx.lineWidth = 1.4; ctx.shadowColor = color; ctx.shadowBlur = 10; ctx.stroke(); ctx.shadowBlur = 0;
    [...a.map((x) => [x, true]), ...b.map((x) => [x, false])].forEach(([str, bold], i) => text(ctx, str, box.x + box.w / 2, box.y + 6 + (i + 0.5) * lh, bold ? color : P.ink, { size: bold ? size : size - 1, weight: bold ? 600 : 400, align: 'center' }));
  }

  /* ---------- the stage ---------- */
  let geo = { nodes: {} };
  function drawStage() {
    const g = kit.plot($('cv'), { x: [0, 1], y: [0, 1], pad: [0, 0, 0, 0] }), ctx = g.ctx, W = g.W, H = g.H;
    let bx;
    if (TRV.thumbMode) bx = { x: W * 0.05, y: H * 0.1, w: W * 0.9, h: H * 0.8 };
    else {
      const st = $('stage').getBoundingClientRect(), below = (el) => (el ? el.getBoundingClientRect().bottom - st.top : 0);
      TRV.hudFit();
      const top = Math.max(40, below($('hudBig').parentElement)) + 10, bottom = Math.max(18, $('legend').offsetHeight + 18);
      bx = { x: 14, y: top, w: W - 28, h: Math.max(100, H - top - bottom) };
    }
    const N = now(clock.t), D = N.D, cols = 5, rows = 5, cw = bx.w / cols, rh = bx.h / rows;
    const nw = Math.min(cw * 0.8, 150), nh = clamp(rh * 0.62, 16, 44), fs = clamp(Math.min(nw / 7.2, nh * 0.42), 8, 13);
    const rect = (u) => ({ x: bx.x + (u.col + 0.5) * cw - nw / 2, y: bx.y + (u.row + 0.5) * rh - nh / 2, w: nw, h: nh });
    geo.nodes = {};
    // the policy track: rules and judges, in a violet dashed frame
    const pr = { x: bx.x + 4, y: bx.y + 3 * rh + 3, w: 3 * cw - 8, h: rh - 6 };
    rrect(ctx, pr, 8); ctx.setLineDash([5, 4]); ctx.strokeStyle = TRV.alpha(P.violet, D.mixed && N.t >= LOOKUP_END ? 0.95 : 0.55); ctx.lineWidth = D.mixed && N.t >= LOOKUP_END ? 1.6 : 1; ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = TRV.alpha(P.violet, 0.04); ctx.fill();
    text(ctx, L('政策轨道', 'POLICY TRACK'), pr.x + 6, pr.y - 4, P.violet, { size: fs - 1, face: 'display', weight: 600, alpha: 0.9, base: 'bottom' });
    const free = { x: bx.x + 3 * cw + 4, y: bx.y + 3 * rh + 2, w: 2 * cw - 8, h: 2 * rh - 4 };   // the empty corner: banners go here
    const reached = new Set(N.reached), done = N.t >= EXPAND_END - 1e-9 && !N.failed;
    // edges: dim, cyan once the consumer is reached along them, the advancing front in amber
    for (const [a, b] of EDGES) {
      const ra = rect(BY[a]), rb = rect(BY[b]), p0 = [ra.x + ra.w, ra.y + ra.h / 2], p1 = [rb.x, rb.y + rb.h / 2];
      if (S.omitEdge && a === 'docs/chapter' && b === 'docs/structure') {
        text(ctx, '×', (p0[0] + p1[0]) / 2, p0[1], P.magenta, { size: 16, align: 'center' });
        continue;
      }
      const same = BY[a].row === BY[b].row, skip = BY[b].col - BY[a].col > 1;
      const curve = (f) => {
        if (skip && same) { const mx = (p0[0] + p1[0]) / 2, my = Math.min(p0[1], p1[1]) - (nh + 16); const u = 1 - f; return [u * u * p0[0] + 2 * u * f * mx + f * f * p1[0], u * u * p0[1] + 2 * u * f * my + f * f * p1[1]]; }
        const c0 = [p0[0] + (p1[0] - p0[0]) * 0.5, p0[1]], c1 = [p0[0] + (p1[0] - p0[0]) * 0.5, p1[1]], u = 1 - f;
        return [u ** 3 * p0[0] + 3 * u * u * f * c0[0] + 3 * u * f * f * c1[0] + f ** 3 * p1[0], u ** 3 * p0[1] + 3 * u * u * f * c0[1] + 3 * u * f * f * c1[1] + f ** 3 * p1[1]];
      };
      const la = D.level.get(a), lb = D.level.get(b), live = la != null && lb === la + 1 && !N.failed;
      const t0 = live ? levelAt(la, D.depth) : 0, t1 = live ? levelAt(lb, D.depth) : 0, f = live ? clamp((N.t - t0) / Math.max(1e-9, t1 - t0), 0, 1) : 0;
      ctx.strokeStyle = P.lineHot; ctx.lineWidth = 1.2; ctx.globalAlpha = done && !(reached.has(a) && reached.has(b)) ? 0.74 : 0.9;
      ctx.beginPath(); for (let i = 0; i <= 24; i++) { const p = curve(i / 24); if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); } ctx.stroke(); ctx.globalAlpha = 1;
      const head = curve(1), prev = curve(0.92), ang = Math.atan2(head[1] - prev[1], head[0] - prev[0]);
      ctx.fillStyle = P.lineHot; ctx.beginPath(); ctx.moveTo(head[0], head[1]); ctx.lineTo(head[0] - 7 * Math.cos(ang - 0.4), head[1] - 7 * Math.sin(ang - 0.4)); ctx.lineTo(head[0] - 7 * Math.cos(ang + 0.4), head[1] - 7 * Math.sin(ang + 0.4)); ctx.fill();
      if (f > 0) {
        ctx.strokeStyle = P.cyan; ctx.lineWidth = 2.4; ctx.shadowColor = P.cyan; ctx.shadowBlur = 8;
        ctx.beginPath(); for (let i = 0; i <= 24; i++) { const p = curve(f * i / 24); if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); } ctx.stroke(); ctx.shadowBlur = 0;
        if (f < 1) { const p = curve(f); ctx.fillStyle = P.amber; ctx.shadowColor = P.amber; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(p[0], p[1], 4, 0, kit.TAU); ctx.fill(); ctx.shadowBlur = 0; }
      }
    }
    // nodes
    for (const u of UNITS) {
      const r = rect(u), ch = S.changed.has(u.id), sel = reached.has(u.id), skipped = done && !sel && !ch;
      geo.nodes[u.id] = r;
      rrect(ctx, r, 5);
      ctx.fillStyle = ch ? TRV.alpha(P.amber, 0.16) : sel ? TRV.alpha(P.cyan, 0.16) : TRV.alpha(P.void, 0.9); ctx.globalAlpha = skipped ? 0.83 : 1; ctx.fill();
      ctx.strokeStyle = ch ? P.amber : sel ? P.cyan : POLICY.has(u.group) ? TRV.alpha(P.violet, 0.8) : P.lineHot; ctx.lineWidth = ch || sel ? 1.8 : 1.1;
      if ((ch && N.phase === 'lookup') || (sel && N.phase === 'judge')) { ctx.shadowColor = ch ? P.amber : P.cyan; ctx.shadowBlur = 12; }
      ctx.stroke(); ctx.shadowBlur = 0;
      if (sel && N.judged > 0) { ctx.fillStyle = TRV.alpha(P.cyan, 0.32); ctx.fillRect(r.x + 2, r.y + r.h - 4, (r.w - 4) * N.judged, 2.5); }
      ctx.globalAlpha = 1;
      if (S.hover === u.id) { ctx.strokeStyle = P.ink; ctx.lineWidth = 1; ctx.setLineDash([2, 2]); ctx.strokeRect(r.x - 3, r.y - 3, r.w + 6, r.h + 6); ctx.setLineDash([]); }
      const twoLine = r.h >= fs * 2.6;
      text(ctx, fit(ctx, u.name, r.w - 8, fs, 'display'), r.x + r.w / 2, r.y + r.h / 2 - (twoLine ? fs * 0.55 : 0), skipped ? P.dim : P.ink, { size: fs, face: 'display', weight: 600, align: 'center' });
      if (twoLine) text(ctx, fit(ctx, `${u.group} · ${u.cost}`, r.w - 8, fs - 2), r.x + r.w / 2, r.y + r.h / 2 + fs * 0.65, P.dim, { size: fs - 2, align: 'center' });
    }
    // the unregistered file, next to the unit whose directory it sits in, and the registry error
    if (S.ghost) {
      const r = { x: bx.x + 4.5 * cw - nw / 2, y: bx.y + 1.5 * rh - nh / 2, w: nw, h: nh };
      geo.ghost = r;
      rrect(ctx, r, 5); ctx.setLineDash([4, 3]); ctx.strokeStyle = P.magenta; ctx.lineWidth = 1.6; ctx.fillStyle = TRV.alpha(P.magenta, N.failed ? 0.14 : 0.05); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, fit(ctx, 'new_route.rs', r.w - 8, fs - 1), r.x + r.w / 2, r.y + r.h / 2 - (r.h >= fs * 2.6 ? fs * 0.5 : 0), P.magenta, { size: fs - 1, align: 'center', weight: 600 });
      if (r.h >= fs * 2.6) text(ctx, fit(ctx, L('未登记', 'unregistered'), r.w - 8, fs - 2), r.x + r.w / 2, r.y + r.h / 2 + fs * 0.6, P.magenta, { size: fs - 2, align: 'center' });
      if (N.failed) banner(ctx, L('registry.explicit · 登记错误', 'registry.explicit · REGISTRY ERROR'), L(`${GHOST} 不在 FILEMAP 中 · 0 项检查 · 不猜，也不退回全量`, `${GHOST} is not in FILEMAP · 0 checks · no guess, no full run`),
        free, P.magenta, clamp(fs, 8.5, 12));
    } else geo.ghost = null;
    if (D.mixed && N.t >= LOOKUP_END) {
      banner(ctx, L('policy.mixed-warning · 政策与产品同改', 'policy.mixed-warning · POLICY + PRODUCT'),
        L(`政策组 ${D.policyGroup.units.length} 项（成本 ${D.policyGroup.cost}）· 产品组 ${D.productGroup.units.length} 项（成本 ${D.productGroup.cost}）· 两组都要验证`, `policy ${D.policyGroup.units.length} units (cost ${D.policyGroup.cost}) · product ${D.productGroup.units.length} units (cost ${D.productGroup.cost}) · verify both`),
        free, P.magenta, clamp(fs, 8.5, 12));
    }
    if (done && !D.mixed && !S.ghost && !TRV.thumbMode) {
      const witness = S.omitEdge && S.changed.has('docs/chapter') && !reached.has('docs/structure');
      const head = witness ? L('Z3 · 反例', 'Z3 · COUNTEREXAMPLE') : L('已判定单元', 'JUDGED UNITS');
      const detail = witness ? L('chapter 已改 · structure 漏检', 'chapter changed · structure missed')
        : N.reached.length + ' / ' + UNITS.length;
      banner(ctx, head, detail, free, witness ? P.magenta : P.cyan, clamp(fs + 1, 10, 14));
    }
    geo.bx = bx;
  }

  /* ---------- the strip ---------- */
  function plotCost(cv) {
    const N = now(clock.t), D = N.D, g = kit.plot(cv, { x: [0, FULL], y: [0, 2], pad: [62, 14, 8, 20] });
    g.axes({ xTicks: [0, 25, 50, 75, 100], frame: false });
    g.rect(0, 1.15, FULL, 1.75, P.dim, { alpha: 0.35 });
    g.rect(0, 0.25, D.cost, 0.85, P.cyan, { alpha: 0.18, stroke: TRV.alpha(P.cyan, 0.6), width: 1 });
    if (N.reachedCost) g.rect(0, 0.25, N.reachedCost, 0.85, P.cyan, { alpha: 0.55 });
    g.text(0, 1.45, L('全仓', 'full'), P.dim, { align: 'right', dx: -6, size: 10.5, face: 'body' });
    g.text(0, 0.55, 'DELTA', P.cyan, { align: 'right', dx: -6, size: 10.5 });
    g.text(FULL, 1.45, String(FULL), P.ink, { align: 'right', dx: -4, size: 10.5 });
    if (!D.error) g.text(Math.max(D.cost, 0), 0.55, `${D.cost} · ${L('省', 'saved')} ${D.saved}%`, P.ink, { dx: 6, size: 10.5 });
    else g.text(0, 0.55, L('登记错误：不计算', 'registry error: not computed'), P.magenta, { dx: 6, size: 10.5, face: 'body' });
    $('pATitle').textContent = L('验证成本：DELTA 对照全仓', 'Verification cost: DELTA against the full repo');
    $('pAMeta').textContent = D.error ? '—' : `${D.cost} / ${FULL}`;
  }
  function plotReach(cv) {
    const D = fresh(), g = kit.plot(cv, { x: [0, T_MAX], y: [0, UNITS.length + 1], pad: [30, 12, 10, 20] }), pts = [];
    for (let t = 0; t <= T_MAX; t += 0.5) pts.push([t, now(t).reached.length]);
    g.axes({ yTicks: [0, 7, 14], xTicks: [0, LOOKUP_END, EXPAND_END, T_MAX], xLabel: 't' });
    g.hline(UNITS.length, P.dim, { dash: [4, 3], alpha: 0.8 });
    g.line(pts, D.error ? P.magenta : P.cyan, { width: 2.2 });
    g.vline(clock.t, P.amber, { alpha: 0.8 });
    $('pBTitle').textContent = L('沿时间轴：展开到达的单元', 'Along the rail: units the expansion reaches');
    $('pBMeta').textContent = `${now(clock.t).reached.length} / ${UNITS.length}`;
  }
  function drawPlots() { if (TRV.still || TRV.figure) return; plotCost($('plotA')); plotReach($('plotB')); }

  /* ---------- words ---------- */
  function drawText() {
    const N = now(clock.t), D = N.D, n = D.selected.length;
    $('hudBig').textContent = D.error ? L('DELTA · 登记错误', 'DELTA · REGISTRY ERROR') : `DELTA · ${N.phase === 'done' || N.phase === 'judge' ? n : N.reached.length} / ${UNITS.length}`;
    $('hudSub').textContent = N.failed ? L(`${GHOST} 不在 FILEMAP 中：报错，0 项检查，不猜也不全测`, `${GHOST} is not in FILEMAP: an error, 0 checks, no guess and no full run`)
      : N.phase === 'lookup' ? L(`查登记：${D.changed.length + (S.ghost ? 1 : 0)} 个改动文件逐一对照 FILEMAP`, `registry lookup: ${D.changed.length + (S.ghost ? 1 : 0)} changed file(s) against FILEMAP`)
        : N.phase === 'expand' ? L(`沿消费边逐层展开 · 已到达 ${N.reached.length} 个单元`, `expanding level by level along consumer edges · ${N.reached.length} reached`)
          : !n ? L('没有改动：没有要跑的检查', 'nothing changed: no check to run')
            : L(`选中 ${n} 个单元，成本 ${D.cost} / ${FULL}，省 ${D.saved}%${D.mixed ? ' · 政策与产品同改' : ''}`, `${n} units selected, cost ${D.cost} / ${FULL}, ${D.saved}% saved${D.mixed ? ' · policy and product changed together' : ''}`);
    $('roSel').innerHTML = D.error ? `<span class="c-mg">ERROR</span>` : `<span class="c-cy">${n} / ${UNITS.length}</span> · ${D.saved}%`;
    $('roSelSub').textContent = D.error ? L('registry.explicit 拒绝这次选择', 'registry.explicit refuses the selection') : L('选中 · 省下', 'selected · saved');
    $('roCost').textContent = D.error ? '—' : `${D.cost} / ${FULL}`;
    $('roDepth').textContent = D.error ? '—' : String(D.depth);
    $('roChanged').textContent = [...D.changed, ...(S.ghost ? [GHOST] : [])].join(', ') || L('（无）', '(none)');
    $('roJudge').innerHTML = D.error ? `<span class="c-mg">registry.explicit · ERROR</span>` : D.mixed ? `<span class="c-mg">policy.mixed-warning</span>` : L('delta.selection · 正常', 'delta.selection · normal');
    $('roNote').textContent = L('点图上的单元改变改动集；“加入一个未登记文件”演示 registry.explicit 的报错。', 'Click units on the graph to change the change set; "Add an unregistered file" shows the error of registry.explicit.');
    $('changeNote').textContent = S.hover ? `${S.hover} · ${L('成本', 'cost')} ${BY[S.hover].cost}` : L(`已改动 ${D.changed.length} 个单元${S.ghost ? '，另有 1 个未登记文件' : ''}`, `${D.changed.length} unit(s) changed${S.ghost ? ', plus 1 unregistered file' : ''}`);
    $('pillSel').querySelector('strong').textContent = D.error ? 'ERR' : `${n}/${UNITS.length}`;
    $('pillSaved').querySelector('strong').textContent = D.error ? '—' : `${D.saved}%`;
    $('omitEdge').setAttribute('aria-pressed', String(S.omitEdge));
    $('ghostBtn').setAttribute('aria-pressed', String(S.ghost));
  }

  const paint = kit.painter(() => { drawText(); drawStage(); drawPlots(); }, [$('stage'), $('plotA'), $('plotB')]);
  const clock = kit.clock({
    range: $('now'), play: $('play'), label: $('tau'), speeds: $('speedChips'), max: T_MAX, rate: 25, step: 5,
    format: (t, max) => `t ${t.toFixed(0)} <small>/ ${max.toFixed(0)}</small>`,
    onChange: () => paint()
  });

  /* ---------- controls: click a unit, the unregistered file, clear ---------- */
  const leave = () => cards.mark(null);
  /** A change by the reader: show the finished selection at once (▶ replays it). */
  const changed = () => { leave(); clock.pause(); clock.set(T_MAX); paint(); };
  const toggle = (id) => { if (S.changed.has(id)) S.changed.delete(id); else S.changed.add(id); changed(); };
  const toggleGhost = () => { S.ghost = !S.ghost; changed(); };
  const clear = () => { S.changed.clear(); S.ghost = false; S.omitEdge = false; changed(); };
  $('omitEdge').addEventListener('click', () => {
    S.omitEdge = !S.omitEdge;
    S.changed = new Set(['docs/chapter']);
    S.ghost = false;
    changed();
  });
  $('ghostBtn').addEventListener('click', toggleGhost);
  $('clearBtn').addEventListener('click', clear);
  $('rew').addEventListener('click', () => { clock.pause(); clock.set(0); });
  kit.keys({ u: toggleGhost, c: clear });
  const hit = (ev) => {
    const b = $('cv').getBoundingClientRect(), x = ev.clientX - b.left, y = ev.clientY - b.top;
    for (const [id, r] of Object.entries(geo.nodes)) if (x >= r.x - 4 && x <= r.x + r.w + 4 && y >= r.y - 4 && y <= r.y + r.h + 4) return id;
    return null;
  };
  $('cv').addEventListener('click', (ev) => { const id = hit(ev); if (id) toggle(id); });
  $('cv').addEventListener('pointermove', (ev) => { const id = hit(ev); if (id !== S.hover) { S.hover = id; $('cv').style.cursor = id ? 'pointer' : 'default'; paint(); } });
  $('cv').addEventListener('pointerleave', () => { if (S.hover) { S.hover = null; paint(); } });

  /* ---------- experiment cards ---------- */
  const PRESETS = {
    'prose-edit': { changed: ['docs/chapter'], ghost: false, play: true, still: 100 },
    'core-change': { changed: ['core/kernel'], ghost: false, play: true, still: 100 },
    'mixed-policy': { changed: ['policy/rules', 'api/server'], ghost: false, play: true, still: 100 },
    'missing-edge': { changed: ['api/client'], ghost: true, play: true, still: 80 }
  };
  const NOTES = {
    'prose-edit': ['只改一章正文（chapter）：它唯一的消费者是结构检查（structure）。DELTA 选中 2 / 14 个单元，成本 14 / 100，省下 86%；浏览器、导出与 API 都不跑。', 'Change one prose chapter: its only consumer is the structure check. DELTA selects 2 / 14 units at a cost of 14 / 100 and saves 86%; the browser suites, the export and the API do not run.'],
    'core-change': ['改核心内核（kernel）：广度优先沿登记的消费边展开四层——runtime 与 server，再到 viz-rt、client、contract，再到 browser 与 export，最后到 pages。9 / 14 个单元必须重判，政策轨道与文档不动。', 'Change the core kernel: the expansion goes four levels along the registered consumer edges, to runtime and server, then viz-rt, client and contract, then browser and export, and last pages. 9 / 14 units must be judged again; the policy track and the docs are untouched.'],
    'mixed-policy': ['同一次改动里既改了规则（rules），又改了产品（server）：混合策略的 policy.mixed-warning 亮起，政策组以紫色虚线框标出，并列出政策组与产品组的单元和成本，两组都要验证。它是可见警告，不是审批关卡。', 'One change set touches a rule (rules) and product code (server): the policy-mixed warning lights up. The policy group gets a violet dashed frame, and both groups with their costs are listed for verification. It is a visible warning, not an approval gate.'],
    'missing-edge': ['改动里有一个 FILEMAP 没有登记的文件 new_route.rs：查登记这一步就报错，registry.explicit 拒绝这次选择。0 项检查，不按目录去猜，也不退回全量运行。', 'The change set holds new_route.rs, a file the FILEMAP does not register: the registry lookup fails, and registry.explicit refuses the selection. Zero checks: no guess from the directory, no fallback to a full run.']
  };
  const FIGURE_NOTES = {
    'prose-edit': ['只改一章正文：选中 2 / 14，省 86%。', 'One prose chapter: 2 / 14 selected, 86% saved.'],
    'core-change': ['改核心内核：沿登记的边传递到 9 / 14。', 'The core kernel: the registered edges reach 9 / 14.'],
    'mixed-policy': ['政策与产品同改：混合策略警告，紫色虚线政策组框，两组都要验证。', 'Policy and product together: a policy-mixed warning, a violet dashed policy-group frame, both verified.'],
    'missing-edge': ['未登记的文件：报错，0 项检查，不猜。', 'An unregistered file: an error, 0 checks, no guess.']
  };
  let booting = true;
  function applyPreset(id) {
    const p = PRESETS[id];
    S.omitEdge = false; S.changed = new Set(p.changed); S.ghost = p.ghost; S.hover = null;
    clock.pause(); clock.set(p.still);
    if (!p.play || TRV.still || (booting && !TRV.embed)) { paint(); return; }
    clock.set(0);
    if (booting) kit.autoplay(clock, $('stage')); else clock.play();
  }
  const cards = kit.cards($('presets'), { presets: PRESETS, notes: TRV.figure ? FIGURE_NOTES : NOTES, noteEl: $('presetNote'), tour: $('tour'), onPick: applyPreset,
    idle: ['自由探索：点单元改变改动集、加入未登记文件、拖时间轴。随时可以再选一张卡。', 'Free play: click units to change the change set, add an unregistered file, scrub the rail. Pick a card again at any time.'] });

  TRV.drawer({ drawer: $('drawer'), open: $('infoBtn'), close: $('drawerClose') });
  TRV.startGlitch(document.querySelector('.brand'));

  /* ---------- probe for the browser suite, cover, start ---------- */
  const at = (r) => { const b = $('cv').getBoundingClientRect(); return { x: b.left + r.x + r.w / 2, y: b.top + r.y + r.h / 2 }; };
  window.HARNESS_DELTA_DEBUG = {
    get state() {
      const N = now(clock.t), D = N.D;
      return { t: clock.t, max: clock.max, playing: clock.playing, preset: cards.current, phase: N.phase,
        changed: D.changed.slice(), ghost: S.ghost, selected: D.error ? [] : D.selected.slice(), reached: N.reached.slice(),
        levels: Object.fromEntries([...D.level.entries()]), depth: D.depth, cost: D.error ? null : D.cost, full: FULL, saved: D.error ? null : D.saved,
        mixed: D.mixed, groups: D.mixed ? { policy: D.policyGroup, product: D.productGroup } : null, error: N.failed ? D.error : null, pendingError: D.error };
    },
    /** The registry as the page draws it (data, for the suite to compare with its own copy). */
    graph: () => ({ units: UNITS.map(({ id, group, cost }) => ({ id, group, cost })), edges: EDGES.map((e) => e.slice()) }),
    set: (ids, ghost) => { S.changed = new Set(ids); S.ghost = !!ghost; changed(); },
    seek: (t) => { clock.pause(); clock.set(t); },
    /** Viewport coordinates of a unit on the stage (for pointer tests). */
    point: (id) => (geo.nodes[id] ? at(geo.nodes[id]) : null)
  };
  /** Cover: the core change at the end of its run, the selection fanning out from the kernel. */
  window.TRV_THUMB = () => { S.changed = new Set(['core/kernel']); S.ghost = false; clock.set(T_MAX); paint.now(); };
  cards.pick(cards.initial('prose-edit'));   // a chapter may cite another card: ::: {.viz src="harness-delta-judge" preset="core-change"}
  booting = false;
  paint();
})();
