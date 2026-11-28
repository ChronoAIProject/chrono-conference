/* NYXID//VAULT · NyxID 凭证流: the same call, and the same poisoned tool response, through two lanes.
     legacy  plaintext keys for k attached services sit in the agent's environment; the agent calls upstream directly
     nyxid   the four layers of the chapter: agent runtime → scoped capability token (read:issues) → NyxID proxy and
             policy engine (the vault, the audit ledger, the credits meter) → upstream service
   One rail t ∈ [0, 100] runs the trace of the chosen scenario (read, write, injection, revocation, metering).
   The page's invariant: the plaintext secrets the NyxID agent can read are 0 for every k, scenario and moment, while
   the legacy lane exposes k. The reload of the revoke scenario takes CONVERGE_T − REVOKE_T rail units of 0.05 s each
   = 2.1 s (the figure chapter 4 gives for CMA); metering adds COST per call at 1 credit = 1 USD and stops at CAP.
   Colours: magenta = a plaintext key, cyan = the scoped capability / NyxID path, violet = audit and metering,
   amber = the current packet. Read-only probe for the browser suite: NYXID_VAULT_DEBUG. */
(() => {
  'use strict';
  const { kit, L } = TRV, { fix, clamp } = kit, P = TRV.palette;
  const $ = (id) => document.getElementById(id);
  const K_MAX = 55, T_MAX = 100, SEC_PER_T = 0.05;
  const REVOKE_T = 12, CONVERGE_T = 54, RELOAD_S = (CONVERGE_T - REVOKE_T) * SEC_PER_T;   // 42 × 0.05 s = 2.1 s
  const COST = 0.25, CAP = 4, CALLS = 20, callAt = (i) => 2 + 4.6 * i;                    // example price and ceiling
  const SCENARIOS = ['read', 'write', 'inject', 'revoke', 'meter'];
  const NAME = { read: ['读取', 'READ'], write: ['写入', 'WRITE'], inject: ['注入攻击', 'INJECTION'], revoke: ['吊销', 'REVOKE'], meter: ['计量', 'METER'] };
  const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);

  /* ---------- the model: everything the page shows is a function of (scenario, k, mode, t) ---------- */
  const S = { scenario: 'inject', k: 12, mode: 'credits' };
  /** Calls of the meter scenario issued by time t, and how each ended under the ceiling. */
  function meter(t) {
    let spend = 0, served = 0, stopped = 0, issued = 0;
    for (let i = 0; i < CALLS; i++) {
      if (callAt(i) > t + 1e-9) break;
      issued++;
      if (spend + COST <= CAP + 1e-9) { spend += COST; served++; } else stopped++;
    }
    return { issued, served, stopped, spend, legacySpend: issued * COST };
  }
  function model(t) {
    const { scenario: sc, k } = S, out = { scenario: sc, k, t };
    // legacy lane: the keys are in the environment the whole time, so they are what an injection can reach
    let leaked = 0;
    if (sc === 'inject') leaked = t >= 78 ? k : t >= 55 ? Math.min(k, Math.floor(k * (t - 55) / 20)) : 0;
    const restarts = sc === 'revoke' && t >= 50 ? 1 : 0;
    out.legacy = { exposed: k, leaked, restarts, compromised: sc === 'inject' && t >= 45 };
    // NyxID lane: the context holds one opaque handle and no plaintext secret, in every case
    let audit = 0, verdict = ['—', '—'];
    if (sc === 'read') { audit = t >= 85 ? 1 : 0; verdict = t >= 85 ? ['200 OK · 已清洗响应头', '200 OK · headers scrubbed'] : t >= 20 ? ['作用域 ✓ read:issues', 'scope ✓ read:issues'] : verdict; }
    if (sc === 'write') { audit = t >= 45 ? 1 : 0; verdict = t >= 24 ? ['403 越权：issues:write ∉ read:issues', '403 out of scope: issues:write ∉ read:issues'] : verdict; }
    if (sc === 'inject') {
      audit = (t >= 40 ? 1 : 0) + (t >= 80 ? 1 : 0);
      verdict = t >= 62 ? ['拒绝横向外联 · 403', 'lateral egress denied · 403'] : t >= 40 ? ['200 OK · 响应已清洗', '200 OK · response scrubbed'] : t >= 7 ? ['作用域 ✓ read:issues', 'scope ✓ read:issues'] : verdict;
    }
    let reload = null;
    if (sc === 'revoke') {
      audit = (t >= 10 ? 1 : 0) + (t >= REVOKE_T ? 1 : 0) + (t >= 86 ? 1 : 0);
      const state = t < REVOKE_T ? 'active' : t < CONVERGE_T ? 'propagating' : 'revoked';
      // Model one issued handle. The binding revision changes when the proxy applies the update.
      const handleRevision = 1, eligibilityRevision = state === 'revoked' ? 2 : 1;
      const denied = t >= 70 && handleRevision !== eligibilityRevision;
      reload = { denied, handleRevision, eligibilityRevision, revokedAt: REVOKE_T * SEC_PER_T, convergedAt: CONVERGE_T * SEC_PER_T, seconds: RELOAD_S, state,
        elapsed: t < REVOKE_T ? 0 : Math.min(t, CONVERGE_T) * SEC_PER_T - REVOKE_T * SEC_PER_T, sandboxRestarts: 0 };
      verdict = denied ? ['403 REVOKED', '403 REVOKED'] : state === 'revoked' ? ['绑定已收敛 · 未重启', 'binding converged · no restart'] : state === 'propagating' ? ['热重载中', 'hot reload in progress'] : ['200 OK', '200 OK'];
    }
    let bill = null;
    if (sc === 'meter') {
      const m = meter(t);
      audit = m.issued;
      bill = { ...m, cost: COST, cap: CAP, mode: S.mode, credits: S.mode === 'credits' ? m.spend : 0, usd: m.spend };
      verdict = m.stopped ? ['到达封顶 · 后续调用硬停', 'ceiling reached · later calls stop'] : m.issued ? ['计量中', 'metering'] : verdict;
    }
    out.nyxid = { exposed: 0, leaked: 0, restarts: 0, audit, verdict, reload, bill };
    return out;
  }

  /* ---------- the packets of each scenario: lane, route, start, end, label, whether a plaintext key rides along ---------- */
  const PLAN = {
    read: [
      { lane: 'legacy', route: 'req', t0: 0, t1: 30, label: 'GET /issues', key: true },
      { lane: 'legacy', route: 'resp', t0: 55, t1: 85, label: '200 OK' },
      { lane: 'nyxid', route: 'req', t0: 0, t1: 45, label: 'GET /issues' },
      { lane: 'nyxid', route: 'resp', t0: 52, t1: 85, label: '200 OK' }
    ],
    write: [
      { lane: 'legacy', route: 'req', t0: 0, t1: 30, label: 'POST /issues', key: true },
      { lane: 'legacy', route: 'resp', t0: 55, t1: 85, label: '201 CREATED' },
      { lane: 'nyxid', route: 'gate', t0: 0, t1: 22, label: 'POST /issues' },
      { lane: 'nyxid', route: 'back', t0: 26, t1: 45, label: '403' }
    ],
    inject: [
      { lane: 'legacy', route: 'req', t0: 0, t1: 25, label: 'GET /page', key: true },
      { lane: 'legacy', route: 'resp', t0: 25, t1: 45, label: '200 + !', poison: true },
      { lane: 'nyxid', route: 'req', t0: 0, t1: 15, label: 'GET /page' },
      { lane: 'nyxid', route: 'resp', t0: 18, t1: 40, label: '200 + !', poison: true },
      { lane: 'nyxid', route: 'gate', t0: 50, t1: 62, label: 'POST evil' },
      { lane: 'nyxid', route: 'back', t0: 66, t1: 80, label: '403' }
    ],
    revoke: [
      { lane: 'legacy', route: 'req', t0: 0, t1: 6, label: 'GET', key: true },
      { lane: 'legacy', route: 'resp', t0: 6, t1: 10, label: '200' },
      { lane: 'legacy', route: 'req', t0: 20, t1: 32, label: 'GET', key: true },
      { lane: 'legacy', route: 'resp', t0: 34, t1: 45, label: '401' },
      { lane: 'nyxid', route: 'req', t0: 0, t1: 6, label: 'GET' },
      { lane: 'nyxid', route: 'resp', t0: 6, t1: 10, label: '200' },
      { lane: 'nyxid', route: 'gate', t0: 58, t1: 70, label: 'GET' },
      { lane: 'nyxid', route: 'back', t0: 72, t1: 86, label: '403 REVOKED' }
    ]
  };
  // the meter scenario: one short packet per call; a call over the ceiling bounces at the gate
  PLAN.meter = [];
  {
    let spend = 0;
    for (let i = 0; i < CALLS; i++) {
      const a = callAt(i), ok = spend + COST <= CAP + 1e-9;
      if (ok) spend += COST;
      PLAN.meter.push({ lane: 'legacy', route: 'req', t0: a, t1: a + 3.6, label: '', key: true });
      PLAN.meter.push(ok ? { lane: 'nyxid', route: 'req', t0: a, t1: a + 3.6, label: '' } : { lane: 'nyxid', route: 'gate', t0: a, t1: a + 2.4, label: '402' });
    }
  }

  /* ---------- canvas helpers ---------- */
  const face = (f) => (f === 'body' ? TRV.fonts.body : f === 'display' ? TRV.fonts.display : TRV.fonts.data);
  function text(ctx, str, x, y, color, o) {
    o = o || {};
    if (TRV.thumbMode) return;          // the cover is wordless
    ctx.font = `${o.weight ? o.weight + ' ' : ''}${o.size || 11}px ${face(o.face)}`; ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.base || 'middle';
    ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
    if (o.halo) { ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.strokeStyle = P.stage; ctx.strokeText(str, x, y); }
    ctx.fillStyle = color; ctx.fillText(str, x, y); ctx.globalAlpha = 1;
  }
  /** Whether a label fits in `w` pixels at its size and weight. */
  function fits(ctx, str, w, size, f, weight) {
    ctx.font = `${weight ? weight + ' ' : ''}${size}px ${face(f)}`;
    return ctx.measureText(str).width <= w;
  }
  /** Shorten a label to fit `w` pixels at its size (an ellipsis at the end). */
  function fit(ctx, str, w, size, f) {
    if (fits(ctx, str, w, size, f)) return str;
    let s = str; while (s.length > 1 && ctx.measureText(s + '…').width > w) s = s.slice(0, -1);
    return s + '…';
  }
  /** A label as one line when it fits in `w` pixels, else broken into its parts, one per line (a narrow stage). */
  function lines(ctx, parts, w, size, f, sep) {
    const one = parts.join(sep || '');
    return fits(ctx, one, w, size, f) ? [one] : parts.map((s) => fit(ctx, s, w, size, f));
  }
  /** Lines of text centred on y, `lh` pixels apart. */
  const stack = (ctx, ls, x, y, lh, color, o) => ls.forEach((s, i) => text(ctx, s, x, y + (i - (ls.length - 1) / 2) * lh, color, o));
  function rrect(ctx, r, rad) { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(r.x, r.y, r.w, r.h, rad); else ctx.rect(r.x, r.y, r.w, r.h); }
  function box(ctx, r, o) {
    o = o || {};
    rrect(ctx, r, o.rad == null ? 6 : o.rad);
    ctx.fillStyle = o.fill || TRV.alpha(P.void, 0.88); ctx.fill();
    ctx.setLineDash(o.dash || []); ctx.lineWidth = o.width || 1.2; ctx.strokeStyle = o.stroke || P.lineHot; ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
    if (o.glow) { ctx.shadowColor = o.stroke; ctx.shadowBlur = o.glow; }
    ctx.stroke(); ctx.shadowBlur = 0; ctx.setLineDash([]); ctx.globalAlpha = 1;
  }
  /** Lay out n key chips in r as large as they fit; returns their centres and the chip size. */
  function grid(r, n) {
    let best = { cols: 1, rows: n, s: 0 };
    for (let cols = 1; cols <= Math.max(1, n); cols++) {
      const rows = Math.ceil(n / cols), s = Math.min(r.w / cols / 1.6, r.h / rows);
      if (s > best.s) best = { cols, rows, s };
    }
    const cw = best.s * 1.6, ch = best.s, ox = r.x + (r.w - best.cols * cw) / 2, oy = r.y + (r.h - best.rows * ch) / 2, pts = [];
    for (let i = 0; i < n; i++) pts.push([ox + (i % best.cols + 0.5) * cw, oy + (Math.floor(i / best.cols) + 0.5) * ch]);
    return { pts, w: Math.min(cw * 0.78, 22), h: Math.min(ch * 0.62, 12) };
  }
  /** One key chip: a plaintext key (magenta) or a sealed token in the vault (cyan, outlined). */
  function chip(ctx, x, y, w, h, kind, alpha) {
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    const r = { x: x - w / 2, y: y - h / 2, w, h };
    if (kind === 'plain' || kind === 'hot') {
      rrect(ctx, r, Math.min(3, h / 3)); ctx.fillStyle = P.magenta;
      if (kind === 'hot') { ctx.shadowColor = P.magenta; ctx.shadowBlur = 8; }
      ctx.fill(); ctx.shadowBlur = 0;
      if (w > 9) { ctx.fillStyle = P.stage; ctx.beginPath(); ctx.arc(x - w * 0.22, y, Math.max(1, h * 0.2), 0, kit.TAU); ctx.fill(); }
    } else {
      rrect(ctx, r, Math.min(3, h / 3)); ctx.strokeStyle = kind === 'revoked' ? P.faint : P.cyan; ctx.lineWidth = 1; ctx.globalAlpha *= kind === 'revoked' ? 0.8 : 0.75; ctx.stroke();
      if (kind === 'lit') { ctx.fillStyle = TRV.alpha(P.cyan, 0.55); ctx.fill(); }
      if (kind === 'revoked') { ctx.beginPath(); ctx.moveTo(r.x, r.y + r.h); ctx.lineTo(r.x + r.w, r.y); ctx.stroke(); }
    }
    ctx.globalAlpha = 1;
  }
  function along(pts, f) {
    const lens = []; let tot = 0;
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); lens.push(d); tot += d; }
    let s = clamp(f, 0, 1) * tot;
    for (let i = 0; i < lens.length; i++) { if (s <= lens[i] || i === lens.length - 1) { const u = lens[i] ? s / lens[i] : 0; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u]; } s -= lens[i]; }
    return pts[pts.length - 1];
  }
  const wire = (ctx, pts, color, o) => {
    o = o || {};
    ctx.strokeStyle = color; ctx.lineWidth = o.width || 1.2; ctx.globalAlpha = o.alpha == null ? 0.7 : o.alpha; ctx.setLineDash(o.dash || []);
    ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
  };
  function stamp(ctx, str, x, y, color, size, align) {
    if (TRV.thumbMode) return;
    ctx.font = `600 ${size}px ${face()}`;
    const w = ctx.measureText(str).width + 10, h = size + 7, px = align === 'left' ? x : align === 'right' ? x - w : x - w / 2;
    ctx.fillStyle = TRV.alpha(P.stage, 0.9); ctx.fillRect(px, y - h / 2, w, h);
    ctx.strokeStyle = TRV.alpha(color, 0.85); ctx.lineWidth = 1; ctx.strokeRect(px + 0.5, y - h / 2 + 0.5, w - 1, h - 1);
    text(ctx, str, px + w / 2, y + 0.5, color, { align: 'center', size, weight: 600 });
  }
  function packet(ctx, p, label, size, o) {
    o = o || {};
    if (o.key) chip(ctx, p[0] - 13, p[1] + 9, 12, 7, 'hot');
    ctx.fillStyle = P.amber; ctx.shadowColor = P.amber; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(p[0], p[1], 5, 0, kit.TAU); ctx.fill(); ctx.shadowBlur = 0;
    if (o.poison) { ctx.strokeStyle = P.magenta; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(p[0], p[1], 9, 0, kit.TAU); ctx.stroke(); }
    if (!label) return;
    // a label riding the wire between two boxes stays inside that gap (halo plus 6 px clear of both borders), so it
    // never covers the box edges or the header text drawn just inside them (.env · k at the agent box's top right)
    let lx = p[0];
    if (o.span) {
      ctx.font = `${size}px ${face()}`;
      const hw = ctx.measureText(label).width / 2 + 2 + 6;
      lx = clamp(lx, o.span[0] + hw, Math.max(o.span[0] + hw, o.span[1] - hw));
    }
    text(ctx, label, lx, p[1] - 13, P.ink, { align: 'center', size, halo: true });
  }

  /* ---------- the stage ---------- */
  let geo = null;
  function drawStage() {
    const g = kit.plot($('cv'), { x: [0, 1], y: [0, 1], pad: [0, 0, 0, 0] }), ctx = g.ctx, W = g.W, H = g.H;
    let bx;
    if (TRV.thumbMode) bx = { x: W * 0.05, y: H * 0.08, w: W * 0.9, h: H * 0.84 };
    else {
      const st = $('stage').getBoundingClientRect(), below = (el) => (el ? el.getBoundingClientRect().bottom - st.top : 0);
      TRV.hudFit();
      const top = Math.max(40, below($('hudBig').parentElement)) + 8, bottom = Math.max(18, $('legend').offsetHeight + 16);
      bx = { x: 12, y: top, w: W - 24, h: Math.max(90, H - top - bottom) };
    }
    const t = clock.t, M = model(t), narrow = bx.w < 560, fs = clamp(bx.w / 62, 8.5, 12), small = fs - 1;
    const gap = clamp(bx.h * 0.04, 6, 12), hL = (bx.h - gap) * 0.43, R1 = { x: bx.x, y: bx.y, w: bx.w, h: hL }, R2 = { x: bx.x, y: bx.y + hL + gap, w: bx.w, h: bx.h - hL - gap };
    const capH = TRV.thumbMode ? 8 : fs + 8;
    // lane frames
    for (const [R, col, zh, en] of [[R1, P.dim, '直连 · 明文密钥放在 .env', 'LEGACY · RAW KEYS IN .env'], [R2, P.cyan, 'NyxID · 四层零密钥代理', 'NyxID · FOUR-LAYER ZERO-SECRET PROXY']]) {
      rrect(ctx, R, 8); ctx.fillStyle = TRV.alpha(col, 0.035); ctx.fill(); ctx.strokeStyle = TRV.alpha(col, 0.35); ctx.lineWidth = 1; ctx.stroke();
      text(ctx, fit(ctx, L(zh, en), R.w - 16, small, 'display'), R.x + 8, R.y + capH / 2 + 1, col, { size: small, face: 'display', weight: 600 });
    }
    const inner = (R) => ({ x: R.x + 6, y: R.y + capH + 2, w: R.w - 12, h: R.h - capH - 8 });
    const I1 = inner(R1), I2 = inner(R2);
    const col = (I, a, b) => ({ x: I.x + I.w * a, w: I.w * (b - a) });
    const titleH = TRV.thumbMode ? 4 : small + 6;
    const meterMode = S.scenario === 'meter';

    /* legacy lane: agent (keys in env) → upstream; attacker below upstream */
    const la = { ...col(I1, 0, 0.36), y: I1.y, h: I1.h }, lu = { ...col(I1, 0.62, 1), y: I1.y, h: I1.h * 0.46 }, lx = { ...col(I1, 0.62, 1), y: I1.y + I1.h * 0.54, h: I1.h * 0.46 };
    const restarting = S.scenario === 'revoke' && t >= 50 && t < 70;
    const restarted = S.scenario === 'revoke' && t >= 70;
    box(ctx, la, { stroke: M.legacy.compromised ? P.magenta : P.lineHot, glow: M.legacy.compromised ? 10 : 0 });
    text(ctx, fit(ctx, L('智能体运行时', 'AGENT RUNTIME'), la.w - 10, small, 'display'), la.x + 6, la.y + titleH / 2 + 2, P.ink, { size: small, face: 'display', weight: 600 });
    if (!narrow || la.w > 120) text(ctx, `.env · ${S.k}`, la.x + la.w - 6, la.y + titleH / 2 + 2, P.magenta, { size: small, align: 'right' });
    const keyArea = { x: la.x + 6, y: la.y + titleH + 2, w: la.w - 12, h: la.h - titleH - 6 };
    if (restarted && !TRV.thumbMode) keyArea.h -= small + 7;
    const gk = grid(keyArea, S.k), legacyKeys = gk.pts;
    legacyKeys.forEach(([x, y]) => chip(ctx, x, y, gk.w, gk.h, M.legacy.compromised ? 'hot' : 'plain', restarting ? 0.25 : 0.9));
    if (restarting) stamp(ctx, L('重启中', 'RESTARTING'), la.x + la.w / 2, la.y + la.h / 2, P.ink, small);
    box(ctx, lu, {});
    text(ctx, fit(ctx, L('上游服务', 'UPSTREAM SERVICE'), lu.w - 10, small, 'display'), lu.x + lu.w / 2, lu.y + lu.h / 2, P.ink, { size: small, face: 'display', weight: 600, align: 'center' });
    const xAim = meterMode ? null : lx;
    if (xAim) {
      box(ctx, lx, { stroke: M.legacy.leaked ? P.magenta : P.faint, dash: [4, 3] });
      text(ctx, fit(ctx, L('攻击者端点', 'ATTACKER ENDPOINT'), lx.w - 46, small, 'display'), lx.x + 6, lx.y + lx.h / 2, M.legacy.leaked ? P.magenta : P.dim, { size: small, face: 'display', weight: 600 });
      text(ctx, String(M.legacy.leaked), lx.x + lx.w - 8, lx.y + lx.h / 2, M.legacy.leaked ? P.magenta : P.dim, { size: fs + 3, weight: 700, align: 'right' });
    }
    if (meterMode) {
      // the legacy bill: every call is charged and nothing at the gateway stops it
      const b = M.nyxid.bill, f = b.legacySpend / (CALLS * COST), bar = { x: lx.x, y: lx.y + lx.h * 0.45, w: lx.w, h: Math.max(6, lx.h * 0.4) };
      text(ctx, fit(ctx, L('直连花费 · 无封顶', 'LEGACY SPEND · NO CEILING'), lx.w, small - 0.5, 'display'), lx.x, lx.y + lx.h * 0.2, P.dim, { size: small - 0.5, face: 'display', weight: 600 });
      rrect(ctx, bar, 3); ctx.strokeStyle = P.lineHot; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = TRV.alpha(P.dim, 0.6); ctx.fillRect(bar.x + 1, bar.y + 1, (bar.w - 2) * f, bar.h - 2);
      text(ctx, `${fix(b.legacySpend, 2)} USD`, bar.x + 4, bar.y + bar.h / 2, P.ink, { size: small - 0.5, halo: true });
    }
    const A = [la.x + la.w, lu.y + lu.h / 2], U = [lu.x, lu.y + lu.h / 2], X = [lx.x, lx.y + lx.h / 2], AX = [la.x + la.w, lx.y + lx.h / 2];
    wire(ctx, [A, U], P.lineHot);
    if (xAim) wire(ctx, [AX, X], M.legacy.compromised ? P.magenta : P.faint, { dash: [4, 4], alpha: M.legacy.compromised ? 0.8 : 0.5 });
    // the exfiltration: each key that has left is drawn on its way to (or at) the attacker
    if (S.scenario === 'inject' && t >= 55) {
      for (let i = 0; i < S.k; i++) {
        const leave = 55 + 20 * i / S.k, f = seg(t, leave, leave + 6);
        if (f <= 0) continue;
        const from = legacyKeys[i], mid = [AX[0], AX[1]], p = f < 0.35 ? along([from, mid], f / 0.35) : along([mid, X], (f - 0.35) / 0.65);
        if (f < 1) chip(ctx, p[0], p[1], 10, 6, 'hot', 0.9);
      }
    }

    /* NyxID lane: agent (handle only) → capability token → proxy and policy engine (vault, audit, credits) → upstream */
    const na = { ...col(I2, 0, 0.2), y: I2.y, h: I2.h }, nt = { ...col(I2, 0.25, 0.4), y: I2.y + I2.h * 0.18, h: I2.h * 0.64 };
    const np = { ...col(I2, 0.45, 0.76), y: I2.y, h: I2.h }, nu = { ...col(I2, 0.82, 1), y: I2.y, h: I2.h * 0.46 }, nx = { ...col(I2, 0.82, 1), y: I2.y + I2.h * 0.54, h: I2.h * 0.46 };
    const rv = M.nyxid.reload;
    box(ctx, na, { stroke: P.cyan, alpha: 0.85 });
    text(ctx, fit(ctx, L('智能体', 'AGENT'), na.w - 10, small, 'display'), na.x + 6, na.y + titleH / 2 + 2, P.ink, { size: small, face: 'display', weight: 600 });
    // the empty context slot: the invariant 0, drawn where the legacy lane draws its k keys
    const slot = { x: na.x + 6, y: na.y + titleH + 2, w: na.w - 12, h: Math.max(14, (na.h - titleH - 8) * 0.55) };
    rrect(ctx, slot, 4); ctx.setLineDash([3, 3]); ctx.strokeStyle = TRV.alpha(P.magenta, 0.55); ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
    text(ctx, '0', slot.x + slot.w / 2, slot.y + slot.h / 2 + 0.5, P.magenta, { size: clamp(slot.h * 0.6, 10, 22), weight: 700, align: 'center' });
    const handleY = slot.y + slot.h + (na.y + na.h - slot.y - slot.h) / 2;
    chip(ctx, na.x + na.w / 2, handleY, Math.min(na.w * 0.6, 34), Math.min(10, (na.y + na.h - slot.y - slot.h) * 0.5), rv && rv.state === 'revoked' ? 'revoked' : 'lit');
    box(ctx, nt, { stroke: P.cyan, alpha: 0.85 });
    text(ctx, fit(ctx, L('临时句柄', 'HANDLE'), nt.w - 8, small, 'display'), nt.x + nt.w / 2, nt.y + nt.h * 0.36, P.ink, { size: small, face: 'display', weight: 600, align: 'center' });
    stack(ctx, lines(ctx, ['read:', 'issues'], nt.w - 6, small - 0.5), nt.x + nt.w / 2, nt.y + nt.h * 0.68, small + 1, P.cyan, { size: small - 0.5, align: 'center' });
    box(ctx, np, { stroke: P.cyan, glow: 6 });
    text(ctx, fit(ctx, L('NyxID 代理 · 策略引擎', 'NyxID PROXY · POLICY'), np.w - 12, small, 'display'), np.x + 8, np.y + titleH / 2 + 2, P.cyan, { size: small, face: 'display', weight: 600 });
    // the policy gate on the proxy's left edge, the vault inside, audit and metering along the bottom
    const gx = np.x + 3, gy0 = np.y + titleH + 2, gy1 = np.y + np.h - 4;
    ctx.strokeStyle = P.cyan; ctx.lineWidth = 3; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.moveTo(gx, gy0); ctx.lineTo(gx, gy1); ctx.stroke(); ctx.globalAlpha = 1;
    const denied = (S.scenario === 'write' && t >= 22) || (S.scenario === 'inject' && t >= 62) || rv?.denied;
    const audit = `${L('审计', 'AUDIT')} ${M.nyxid.audit}`;
    const badge = 'DENIED ✕', badgeSize = small - 0.5;
    const footW = np.w - 16, rowH = clamp(np.h * 0.24, 14, 26);
    // Keep the verdict in the audit footer. Stack it below the count if both won't fit across.
    ctx.font = `600 ${badgeSize}px ${face()}`;
    const badgeW = ctx.measureText(badge).width + 10;
    const stackVerdict = denied && !TRV.thumbMode && !fits(ctx, audit, footW - badgeW - 4, small, null, 600);
    const footH = rowH + (stackVerdict ? badgeSize + 9 : 0);
    const vault = { x: np.x + 12, y: np.y + titleH + 2, w: np.w - 20, h: np.h - titleH - footH - 8 };
    // Reserve a vault label only when there is space above the key grid.
    if (!TRV.thumbMode && vault.h >= 42) {
      text(ctx, 'ring-v1', vault.x, vault.y + 6, P.ink, { size: small, weight: 600 });
      vault.y += 13; vault.h -= 13;
    }
    const gv = grid(vault, S.k), injecting = (S.scenario === 'read' && t >= 25 && t < 40) || (S.scenario === 'inject' && t >= 6 && t < 14);
    const scrubbing = (S.scenario === 'read' && t >= 62 && t < 70) || (S.scenario === 'inject' && t >= 24 && t < 32);
    gv.pts.forEach(([x, y], i) => chip(ctx, x, y, gv.w, gv.h, i === 0 && rv && rv.state !== 'active' ? 'revoked' : i === 0 && injecting ? 'lit' : 'sealed'));
    const foot = { x: np.x + 8, y: np.y + np.h - footH - 4, w: footW, h: footH };
    if (meterMode) {
      const b = M.nyxid.bill, f = b.spend / CAP;
      rrect(ctx, foot, 3); ctx.strokeStyle = TRV.alpha(P.violet, 0.6); ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = TRV.alpha(P.violet, 0.45); ctx.fillRect(foot.x + 1, foot.y + 1, (foot.w - 2) * f, foot.h - 2);
      ctx.strokeStyle = P.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(foot.x + foot.w - 1, foot.y - 3); ctx.lineTo(foot.x + foot.w - 1, foot.y + foot.h + 3); ctx.stroke();   // the ceiling
      stack(ctx, lines(ctx, [`${fix(b.spend, 2)} / ${fix(CAP, 2)}`, S.mode === 'byok' ? 'USD · BYOK' : 'CREDITS'], foot.w - 8, small - 0.5, null, ' '), foot.x + 5, foot.y + foot.h / 2, small + 1, P.ink, { size: small - 0.5, halo: true });
    } else {
      text(ctx, fit(ctx, audit, foot.w, small), foot.x, foot.y + rowH / 2, P.violet, { size: small, weight: 600 });
      if (denied) {
        const badgeY = foot.y + (stackVerdict ? (rowH + foot.h) / 2 : rowH / 2);
        stamp(ctx, badge, foot.x + foot.w, badgeY, P.ink, badgeSize, 'right');
      }
    }
    box(ctx, nu, {});
    text(ctx, fit(ctx, L('上游服务', 'UPSTREAM'), nu.w - 8, small, 'display'), nu.x + nu.w / 2, nu.y + nu.h / 2, P.ink, { size: small, face: 'display', weight: 600, align: 'center' });
    if (meterMode) {
      // one tick per call: served (violet), stopped at the ceiling (crossed), not yet issued (faint)
      const b = M.nyxid.bill, cols = 10, cw = nx.w / cols, ch = Math.min(nx.h / 2, cw * 0.8);
      for (let i = 0; i < CALLS; i++) {
        const cx = nx.x + (i % cols + 0.5) * cw, cy = nx.y + nx.h / 2 + (Math.floor(i / cols) - 0.5) * ch, s = Math.min(cw, ch) * 0.62, r = { x: cx - s / 2, y: cy - s / 2, w: s, h: s };
        rrect(ctx, r, 2);
        if (i < b.served) { ctx.fillStyle = TRV.alpha(P.violet, 0.75); ctx.fill(); }
        else if (i < b.issued) { ctx.strokeStyle = P.ink; ctx.lineWidth = 1; ctx.stroke(); ctx.beginPath(); ctx.moveTo(r.x + 2, r.y + 2); ctx.lineTo(r.x + s - 2, r.y + s - 2); ctx.moveTo(r.x + s - 2, r.y + 2); ctx.lineTo(r.x + 2, r.y + s - 2); ctx.stroke(); }
        else { ctx.strokeStyle = P.faint; ctx.lineWidth = 1; ctx.stroke(); }
      }
    } else {
      box(ctx, nx, { stroke: P.faint, dash: [4, 3] });
      // the label beside its count when both fit on one row; on a narrow stage the label above, the count below
      const atk = L('攻击者', 'ATTACKER'), atkO = { size: small, face: 'display', weight: 600 }, zeroO = { size: fs + 3, weight: 700 };
      if (fits(ctx, atk, nx.w - 26, small, 'display', 600)) {
        text(ctx, atk, nx.x + 5, nx.y + nx.h / 2, P.dim, atkO);
        text(ctx, '0', nx.x + nx.w - 6, nx.y + nx.h / 2, P.magenta, { ...zeroO, align: 'right' });
      } else {
        text(ctx, fit(ctx, atk, nx.w - 8, small, 'display'), nx.x + nx.w / 2, nx.y + nx.h * 0.32, P.dim, { ...atkO, align: 'center' });
        text(ctx, '0', nx.x + nx.w / 2, nx.y + nx.h * 0.66, P.magenta, { ...zeroO, align: 'center' });
      }
    }
    const a = [na.x + na.w, nt.y + nt.h / 2], tk0 = [nt.x, nt.y + nt.h / 2], tk1 = [nt.x + nt.w, nt.y + nt.h / 2], pg = [gx, nt.y + nt.h / 2];
    const vc = [vault.x + vault.w / 2, nt.y + nt.h / 2], pr = [np.x + np.w, nu.y + nu.h / 2], u = [nu.x, nu.y + nu.h / 2], x = [nx.x, nx.y + nx.h / 2];
    wire(ctx, [a, tk0], P.cyan, { alpha: 0.6 }); wire(ctx, [tk1, pg], P.cyan, { alpha: 0.6 }); wire(ctx, [pr, u], P.lineHot);
    if (!meterMode) wire(ctx, [[np.x + np.w, x[1]], x], P.faint, { dash: [2, 4], alpha: 0.6 });
    const ROUTES = {
      legacy: { req: [A, U], resp: [U, A] },
      nyxid: { req: [a, tk0, tk1, pg, vc, [vc[0], pr[1]], pr, u], resp: [u, pr, [vc[0], pr[1]], vc, pg, tk1, tk0, a], gate: [a, tk0, tk1, pg], back: [pg, tk1, tk0, a] }
    };
    // stamps: what happens at the gate and in the vault at this moment
    const gateStamp = (s, colr) => stamp(ctx, s, gx + 6, nt.y - 2 > np.y + titleH ? nt.y - 2 : np.y + titleH + 8, colr, small - 0.5, 'left');
    if (S.scenario === 'read' && t >= 20 && t < 30) gateStamp('SCOPE ✓', P.cyan);
    if (S.scenario === 'inject' && t >= 7 && t < 15) gateStamp('SCOPE ✓', P.cyan);
    if (meterMode && M.nyxid.bill.stopped) gateStamp('CAP ✕', P.violet);
    if (injecting) stamp(ctx, 'INJECT', vault.x + vault.w / 2, vault.y + vault.h - 6, P.cyan, small - 0.5);
    if (scrubbing) stamp(ctx, 'SCRUB', vault.x + vault.w / 2, vault.y + vault.h - 6, P.cyan, small - 0.5);
    if (M.legacy.compromised) stamp(ctx, L('env 全部可读', 'ENV READABLE'), la.x + la.w / 2, la.y + la.h - 7, P.magenta, small - 0.5);
    if (S.scenario === 'inject' && t >= 45) stamp(ctx, L('只有句柄', 'HANDLE ONLY'), na.x + na.w / 2, na.y + na.h - 7, P.cyan, small - 1);
    if (S.scenario === 'revoke') {
      if (t >= REVOKE_T) stamp(ctx, L('上游密钥已轮换', 'KEY ROTATED'), lu.x + lu.w / 2, lu.y + lu.h - (small + 6) / 2 - 2, P.ink, small - 1);
      if (restarted) stamp(ctx, L('新 .env · 重启 1 次', 'NEW .env · 1 RESTART'), la.x + la.w / 2, la.y + la.h - (small + 6) / 2 - 2, P.ink, small - 1);
      if (t >= REVOKE_T) {
        // the hot reload: the new binding travels from the proxy back into the running sandbox in 2.1 s
        const f = seg(t, REVOKE_T, CONVERGE_T), path = [[np.x + 4, np.y + np.h - 6], [na.x + na.w, np.y + np.h - 6]], end = along(path, f);
        wire(ctx, path, P.cyan, { dash: [4, 3], alpha: 0.45 });
        wire(ctx, [path[0], end], P.cyan, { width: 2.4, alpha: 0.95 });
        if (f < 1) { ctx.fillStyle = P.amber; ctx.beginPath(); ctx.arc(end[0], end[1], 4, 0, kit.TAU); ctx.fill(); }
        const elapsed = f < 1 ? `${fix(rv.elapsed, 2)} s` : `✓ ${fix(RELOAD_S, 1)} s · ${L('0 次重启', '0 RESTARTS')}`;
        stamp(ctx, elapsed, narrow ? np.x - 4 : (path[0][0] + path[1][0]) / 2, np.y + np.h - 6 - (small + 4), P.cyan, small - 0.5, narrow ? 'right' : 'center');
      }
    }
    // the packets
    for (const pk of PLAN[S.scenario]) {
      if (t < pk.t0 || t > pk.t1) continue;
      const pts = ROUTES[pk.lane][pk.route]; if (!pts) continue;
      packet(ctx, along(pts, seg(t, pk.t0, pk.t1)), narrow ? '' : pk.label, small - 0.5, { key: pk.key, poison: pk.poison, span: pk.lane === 'legacy' ? [A[0], U[0]] : null });
    }
    geo = { la, na, np };
  }

  /* ---------- the strip ---------- */
  function plotBlast(cv) {
    const g = kit.plot(cv, { x: [1, K_MAX], y: [-3, K_MAX + 4], pad: [30, 12, 10, 20] });
    g.axes({ yTicks: [0, 25, 55], xTicks: [1, 12, 25, 41, 55], xLabel: 'k' });
    g.line([[1, 1], [K_MAX, K_MAX]], P.magenta, { width: 2 });
    g.line([[1, 0], [K_MAX, 0]], P.cyan, { width: 2.6, glow: 6 });
    g.vline(S.k, P.amber, { alpha: 0.8 }); g.dot(S.k, S.k, P.magenta, 4.5); g.dot(S.k, 0, P.cyan, 4.5);
    /* legacy = k names the diagonal from above, just under the k = 55 grid line. Its ink box keeps CLEAR px from that
       grid line and, measured square to the diagonal at this canvas's own slope, CLEAR px from the 2 px line and from
       the 4.5 px dot riding it, so the gap holds at every width, language, theme and k. */
    const legacy = L('直连 = k', 'legacy = k'), CLEAR = 6, ctx = g.ctx;
    ctx.font = `10.5px ${face('body')}`; ctx.textAlign = 'right'; ctx.textBaseline = 'top';
    const lm = ctx.measureText(legacy), xe = g.X(K_MAX), ye = g.Y(K_MAX), slope = (g.Y(1) - ye) / (xe - g.X(1));
    const inkTop = Math.round(ye) + 1 + CLEAR, inkBottom = inkTop + lm.actualBoundingBoxAscent + lm.actualBoundingBoxDescent;
    const inkRight = xe - (inkBottom - ye + (CLEAR + 4.5) * Math.hypot(1, slope)) / slope;
    g.text(K_MAX, K_MAX, legacy, P.magenta, { align: 'right', base: 'top', dx: inkRight - xe - lm.actualBoundingBoxRight, dy: inkTop + lm.actualBoundingBoxAscent - ye, size: 10.5, face: 'body' });
    // lifted clear of the axis label k, which the kit draws in the same bottom-right corner
    g.text(K_MAX, 0, L('NyxID = 0', 'NyxID = 0'), P.cyan, { align: 'right', base: 'bottom', dy: -12, dx: -4, size: 10.5, face: 'body' });
    $('pATitle').textContent = L('泄露面随挂载服务数 k', 'Blast radius against attached services k'); $('pAMeta').textContent = `k = ${S.k} · ${S.k} / 0`;
  }
  function plotRail(cv) {
    const t = clock.t;
    if (S.scenario === 'meter') {
      const top = CALLS * COST, g = kit.plot(cv, { x: [0, T_MAX], y: [0, top * 1.1], pad: [30, 12, 10, 20] }), leg = [], nyx = [];
      for (let u = 0; u <= T_MAX; u += 0.5) { const m = meter(u); leg.push([u, m.legacySpend]); nyx.push([u, m.spend]); }
      g.axes({ yTicks: [0, 2, CAP], xTicks: [0, 50, 100], xLabel: 't' });
      g.hline(CAP, P.violet, { dash: [4, 3], alpha: 0.8 }); g.line(leg, P.dim, { width: 1.6 }); g.line(nyx, P.violet, { width: 2.4 });
      g.vline(t, P.amber, { alpha: 0.8 });
      g.text(T_MAX, top, L('直连：无封顶', 'legacy: no ceiling'), P.dim, { align: 'right', base: 'top', dx: -4, size: 10.5, face: 'body' });
      g.text(T_MAX, CAP, L('NyxID：封顶', 'NyxID: ceiling'), P.violet, { align: 'right', base: 'bottom', dy: -4, dx: -4, size: 10.5, face: 'body' });
      const m = meter(t);
      $('pBTitle').textContent = L('沿时间轴：累计花费（USD）', 'Along the rail: cumulative spend (USD)'); $('pBMeta').textContent = `${fix(m.legacySpend, 2)} / ${fix(m.spend, 2)}`;
      return;
    }
    const g = kit.plot(cv, { x: [0, T_MAX], y: [-2, S.k + 3], pad: [30, 12, 10, 20] }), leg = [], nyx = [];
    for (let u = 0; u <= T_MAX; u += 0.5) { const m = model(u); leg.push([u, m.legacy.leaked]); nyx.push([u, m.nyxid.leaked]); }
    g.axes({ yTicks: [0, S.k], xTicks: [0, 50, 100], xLabel: 't' });
    g.line(leg, P.magenta, { width: 2 }); g.line(nyx, P.cyan, { width: 2.6 });
    g.vline(t, P.amber, { alpha: 0.8 });
    const m = model(t);
    $('pBTitle').textContent = L('沿时间轴：外流的密钥', 'Along the rail: keys leaked'); $('pBMeta').textContent = `${m.legacy.leaked} / ${m.nyxid.leaked}`;
  }
  function drawPlots() { if (TRV.still || TRV.figure) return; plotBlast($('plotA')); plotRail($('plotB')); }

  /* ---------- words: HUD, readouts, pills ---------- */
  function drawText() {
    const t = clock.t, M = model(t), sc = S.scenario;
    let sub;
    if (sc === 'inject') sub = t < 45 ? L('同一条带毒的工具响应同时回到两个智能体', 'the same poisoned tool response reaches both agents')
      : L(`直连：env 里 ${S.k} 把明文密钥可读，已外流 ${M.legacy.leaked} · NyxID：只有句柄，可读密钥 0`, `legacy: ${S.k} plaintext keys readable in env, ${M.legacy.leaked} leaked · NyxID: handle only, 0 readable`);
    else if (sc === 'read') sub = L('NyxID 在策略层核查作用域，令牌只在代理内存里注入，回程洗掉敏感头', 'NyxID checks the scope at the policy engine, injects the token in proxy memory only, scrubs headers on return');
    else if (sc === 'write') sub = L('越权写入：直连的密钥照写不误；NyxID 的 read:issues 句柄被拒', 'out-of-scope write: the legacy key writes anyway; the NyxID read:issues handle is refused');
    else if (sc === 'revoke') {
      const rv = M.nyxid.reload;
      sub = rv.state === 'active' ? L('调用正常；下一刻在 NyxID 里吊销这项绑定', 'calls succeed; the binding is about to be revoked in NyxID')
        : rv.state === 'propagating' ? L(`热重载 ${fix(rv.elapsed, 2)} s / ${fix(RELOAD_S, 1)} s · 沙箱照常运行`, `hot reload ${fix(rv.elapsed, 2)} s / ${fix(RELOAD_S, 1)} s · the sandbox keeps running`)
          : L(`吊销 ${fix(RELOAD_S, 1)} s 后收敛 · 沙箱 0 次重启 · 直连需重启 1 次`, `converged ${fix(RELOAD_S, 1)} s after the revocation · sandbox 0 restarts · legacy needs 1 restart`);
    } else {
      const b = M.nyxid.bill;
      sub = L(`${b.issued} 次调用：放行 ${b.served}、封顶后硬停 ${b.stopped} · ${fix(b.spend, 2)} USD`, `${b.issued} calls: ${b.served} served, ${b.stopped} stopped at the ceiling · ${fix(b.spend, 2)} USD`);
    }
    $('hudBig').textContent = `${L(NAME[sc][0], NAME[sc][1])} · k = ${S.k}`;
    if (M.nyxid.reload?.denied) {
      const { handleRevision, eligibilityRevision } = M.nyxid.reload;
      sub = L('句柄版本', 'Handle revision') + ' ' + handleRevision + ' ≠ eligibility_revision ' + eligibilityRevision + ' · 403 REVOKED';
    }
    $('hudSub').textContent = sub;
    $('roBlast').innerHTML = `<span class="c-mg">${S.k}</span> / <span class="c-cy">0</span> <span class="nummark">${M.nyxid.exposed === 0 && M.legacy.exposed === S.k ? '= k / 0 ✓' : '✗'}</span>`;
    $('roBlastSub').textContent = L('直连 / NyxID', 'legacy / NyxID');
    $('roLeak').innerHTML = `<span class="c-mg">${M.legacy.leaked}</span> / <span class="c-cy">${M.nyxid.leaked}</span>`;
    $('roVerdict').textContent = L(M.nyxid.verdict[0], M.nyxid.verdict[1]);
    $('roAudit').textContent = String(M.nyxid.audit);
    if (sc === 'meter') {
      const b = M.nyxid.bill;
      $('roXLabel').textContent = L('计量（1 credit = 1 USD）', 'Metering (1 credit = 1 USD)');
      $('roX').innerHTML = `${fix(b.credits, 2)} credits · ${fix(b.usd, 2)} USD <small>${S.mode === 'byok' ? L('BYOK：记在自己的密钥上', 'BYOK: billed to your own key') : L(`封顶 ${fix(CAP, 2)}`, `ceiling ${fix(CAP, 2)}`)}</small>`;
    } else if (sc === 'revoke') {
      const rv = M.nyxid.reload;
      $('roXLabel').textContent = L('凭证热重载', 'Hot credential reload');
      $('roX').innerHTML = `${fix(rv.elapsed, 2)} s / ${fix(RELOAD_S, 1)} s <small>${L(`沙箱重启 ${rv.sandboxRestarts} · 直连重启 ${M.legacy.restarts}`, `sandbox restarts ${rv.sandboxRestarts} · legacy restarts ${M.legacy.restarts}`)}</small>`;
    } else {
      $('roXLabel').textContent = L('能力句柄的作用域', 'Scope of the capability handle');
      $('roX').textContent = 'read:issues';
    }
    $('roNote').textContent = L('直连通道的泄露面就是 k：拖动 k，上方钥匙格随之增减；NyxID 智能体框里的明文密钥始终是 0。', 'The legacy blast radius is k: drag k and the key grid above grows and shrinks; the NyxID agent box always holds 0 plaintext keys.');
    $('pillK').querySelector('strong').textContent = String(S.k);
    $('pillLegacy').querySelector('strong').textContent = String(M.legacy.exposed);
    $('pillNyx').querySelector('strong').textContent = String(M.nyxid.exposed);
    fK.set(S.k);
  }

  const paint = kit.painter(() => { drawText(); drawStage(); drawPlots(); }, [$('stage'), $('plotA'), $('plotB')]);

  /* ---------- the rail, the scenario, k, the billing mode ---------- */
  const clock = kit.clock({
    range: $('now'), play: $('play'), label: $('tau'), speeds: $('speedChips'), max: T_MAX, rate: 20, step: 5,
    // (the label is first drawn while the clock is being built, so it reads t and never the clock itself)
    format: (t, max) => (S.scenario === 'revoke' ? `${(t * SEC_PER_T).toFixed(2)} s <small>/ ${(max * SEC_PER_T).toFixed(2)} s</small>` : `t ${t.toFixed(0)} <small>/ ${max.toFixed(0)}</small>`),
    onChange: () => paint()
  });
  const fK = kit.field($('kRange'), { fmt: (v) => String(v), onInput: (v) => { leave(); S.k = clamp(Math.round(v), 1, K_MAX); paint(); } });
  const leave = () => cards.mark(null);
  function setScenario(sc, t) {
    S.scenario = sc; scenarioChips.set(sc, true);
    clock.pause(); clock.set(t == null ? T_MAX : t);
    paint();
  }
  const scenarioChips = kit.chips($('scenarioChips'), 'scenario', (v) => { leave(); setScenario(v); });
  $('revokeHandle').addEventListener('click', () => {
    leave();
    // Replay the next call made with the old handle once the new revision is active.
    setScenario('revoke', 70);
    if (!TRV.reduceMotion) clock.play();
  });
  const modeChips = kit.chips($('modeChips'), 'mode', (v) => { leave(); S.mode = v; paint(); });
  $('rew').addEventListener('click', () => { clock.pause(); clock.set(0); });
  const keymap = {};
  SCENARIOS.forEach((sc, i) => { keymap[String(i + 1)] = () => { leave(); setScenario(sc); }; });
  kit.keys(keymap);

  /* ---------- experiment cards ---------- */
  const PRESETS = {
    'direct-leak': { scenario: 'inject', k: 12, mode: 'credits', play: true, still: 80 },
    'scoped-proxy': { scenario: 'inject', k: 55, mode: 'credits', play: true, still: 65 },
    'hot-reload': { scenario: 'revoke', k: 12, mode: 'credits', play: true, still: 55 },
    'billing-meter': { scenario: 'meter', k: 12, mode: 'credits', play: true, still: 90 }
  };
  const NOTES = {
    'direct-leak': ['直连：12 项服务的明文密钥都在智能体的 env 里。一条带毒的工具响应让智能体读出环境变量，再把 12 把钥匙全部发给攻击者；泄露面等于 k。', 'Legacy: plaintext keys for 12 services sit in the agent\'s env. One poisoned tool response makes the agent read its environment and send all 12 keys to the attacker; the blast radius equals k.'],
    'scoped-proxy': ['同一条攻击走 NyxID：挂满 55 项服务，令牌只有 read:issues。合法读取放行，令牌只在代理内存里注入、回程洗掉；注入后发往攻击者的横向外联在策略引擎处被拒。智能体能读到的明文密钥是 0。', 'The same attack through NyxID: all 55 services attached, the token allows read:issues only. The legitimate read passes, the token is injected in proxy memory and scrubbed on return, and the lateral call to the attacker after the injection is refused at the policy engine. The agent can read 0 plaintext keys.'],
    'hot-reload': ['在 NyxID 里吊销一项绑定：新绑定沿墨黑能力路径回到运行中的沙箱，约 2.1 s 收敛，沙箱 0 次重启；之后的调用得到 403 REVOKED。直连要轮换上游密钥再重新部署，进程重启一次。', 'Revoke a binding in NyxID: the new binding travels along the ink capability path into the running sandbox and converges in about 2.1 s with 0 restarts; later calls get 403 REVOKED. The legacy lane has to rotate the upstream key and redeploy, restarting the process once.'],
    'billing-meter': ['20 次调用、示例单价 0.25 credit、1 credit = 1 USD：NyxID 放行 16 次，累计 4.00 credit 碰到单代理封顶，其余 4 次在代理处硬停。直连没有这道封顶，花费一直往上走。', 'Twenty calls at an example price of 0.25 credit, 1 credit = 1 USD: NyxID serves 16, the total of 4.00 credits meets the per-agent ceiling, and the other 4 stop hard at the proxy. The legacy lane has no such ceiling, and its spend keeps rising.']
  };
  // a cited figure keeps one sentence next to ◀ ▶; the full lab keeps the detailed explanations above
  const FIGURE_NOTES = {
    'direct-leak': ['直连 env 里的 12 把明文密钥全部外流，泄露面等于 k。', 'All 12 plaintext keys in the legacy env leave: the blast radius equals k.'],
    'scoped-proxy': ['55 项服务、同一条攻击：横向外联被拒，可读密钥恒为 0。', '55 services, the same attack: the lateral call is refused, 0 readable keys.'],
    'hot-reload': ['吊销约 2.1 s 后收敛，沙箱 0 次重启。', 'Converged about 2.1 s after the revocation, 0 sandbox restarts.'],
    'billing-meter': ['放行 16 次后碰到封顶 4.00 credit，其余调用硬停。', 'After 16 calls the 4.00-credit ceiling stops the rest.']
  };
  let booting = true;
  function applyPreset(id) {
    const p = PRESETS[id];
    S.k = p.k; S.mode = p.mode; modeChips.set(p.mode, true);
    setScenario(p.scenario, T_MAX);
    if (TRV.still && p.still != null) clock.set(p.still === 'end' ? clock.max : p.still);
    // a still (cover, cited figure for PDF/EPUB) and the opening view of the full page show the telling frame;
    // inside a chapter the card plays once the reader has scrolled it into view; a click plays at once
    if (!TRV.still && booting && !TRV.embed && p.still != null) clock.set(p.still);
    if (!p.play || TRV.still || (booting && !TRV.embed)) return;
    clock.set(0);
    if (booting) kit.autoplay(clock, $('stage')); else clock.play();
  }
  const cards = kit.cards($('presets'), { presets: PRESETS, notes: TRV.figure ? FIGURE_NOTES : NOTES, noteEl: $('presetNote'), tour: $('tour'), onPick: applyPreset,
    idle: ['自由探索：换工况、拖动 k、拖时间轴。随时可以再选一张卡。', 'Free play: change the scenario, drag k, scrub the rail. Pick a card again at any time.'] });

  TRV.drawer({ drawer: $('drawer'), open: $('infoBtn'), close: $('drawerClose') });
  TRV.startGlitch(document.querySelector('.brand'));

  /* ---------- probe for the browser suite, cover, start ---------- */
  window.NYXID_VAULT_DEBUG = {
    get state() {
      const M = model(clock.t);
      return { scenario: S.scenario, k: S.k, mode: S.mode, t: clock.t, max: clock.max, playing: clock.playing, preset: cards.current,
        exposed: { legacy: M.legacy.exposed, nyxid: M.nyxid.exposed }, leaked: { legacy: M.legacy.leaked, nyxid: M.nyxid.leaked },
        restarts: { legacy: M.legacy.restarts, nyxid: M.nyxid.restarts }, audit: M.nyxid.audit, verdict: M.nyxid.verdict[1],
        reload: M.nyxid.reload, bill: M.nyxid.bill, secondsPerUnit: SEC_PER_T };
    },
    /** The page's model at another (scenario, k, t) without moving the page: for sweeps in the suite. */
    at: (scenario, k, t, mode) => { const keep = { ...S }; S.scenario = scenario; S.k = k; if (mode) S.mode = mode; const M = model(t); Object.assign(S, keep); return { exposed: { legacy: M.legacy.exposed, nyxid: M.nyxid.exposed }, leaked: { legacy: M.legacy.leaked, nyxid: M.nyxid.leaked }, audit: M.nyxid.audit, bill: M.nyxid.bill, reload: M.nyxid.reload }; },
    set: (o) => { if (o.k != null) S.k = clamp(Math.round(o.k), 1, K_MAX); if (o.mode) { S.mode = o.mode; modeChips.set(o.mode, true); } if (o.scenario) setScenario(o.scenario, o.t); else paint(); },
    seek: (t) => { clock.pause(); clock.set(t); },
    params: { COST, CAP, CALLS, REVOKE_T, CONVERGE_T, K_MAX }
  };
  /** Cover: the injection with 24 attached services, keys on their way out above, the empty context below. */
  window.TRV_THUMB = () => { S.k = 24; setScenario('inject', 70); paint.now(); };
  cards.pick(cards.initial('direct-leak'));   // a chapter may cite another card: ::: {.viz src="nyxid-credential-flow" preset="hot-reload"}
  booting = false;
  paint();
})();
