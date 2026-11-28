/* VEHICLE//STACK · 从发动机到整车: a swappable engine bay on a five-layer chassis, and a tool-call packet through it.
     bands    the engine bay (Engine Alpha / Engine Beta / Local Core, placeholder names), L4 chrono-harness (judges),
              L3 CMA / heca (runtime), L2 Ornn (skills), L1 NyxID (vault and proxy), L5 the live surfaces
     lanes    requests go down the left lane, responses come up the right lane; the dashed line on top of NyxID is the
              boundary below which, and only below which, the plaintext key exists
   The rail is a 10 s session in ticks of 0.1 s (a model): a read call (0–6 s) and a write call (from 6 s). A call is a
   table of stops { layer, from, to, lane, carries }: the packet rests at a stop for 62% of its span, then moves to the
   next one. Whatever moves up out of NyxID carries data or 403, never the key, so plaintext in context (the engine bay
   and every band above NyxID) is 0 in every tick: the page sums it band by band. Events are times on the rail, so every
   frame is a pure function of t: engine swaps (a history), the approval of the write (never by the page itself), the
   revocation of the grant (403 REVOKED from then on; sandboxes reload the binding within the ~2.1 s window, no restart).
   Colours: cyan = a capability handle, violet = the plaintext key, magenta = a refusal (403), amber = the current
   engine and the write waiting at the gate. Read-only probe for the browser suite: VEHICLE_STACK_DEBUG. */
(() => {
  'use strict';
  const { kit, L } = TRV, { clamp } = kit, P = TRV.palette;
  const $ = (id) => document.getElementById(id);

  /* ---------- the vehicle ---------- */
  const TMAX = 100, RELOAD = 21, SWAP = 2, GATE_AT = 66, WRITE_AT = 60, INF = Infinity;
  const ENGINES = { alpha: 'Engine Alpha', beta: 'Engine Beta', local: 'Local Core' }, ORDER = ['alpha', 'beta', 'local'];
  const SHORT = { alpha: 'Alpha', beta: 'Beta', local: 'Local' };
  const LAYERS = [
    { id: 'bay', code: '', name: ['机舱', 'ENGINE BAY'], role: ['可替换的推理引擎', 'a swappable reasoning core'], short: ['引擎', 'engine'] },
    { id: 'harness', code: 'L4', name: ['chrono-harness', 'chrono-harness'], role: ['可执行判官与交付闸门', 'executable judges and delivery gate'], short: ['判官', 'judges'] },
    { id: 'runtime', code: 'L3', name: ['CMA / heca', 'CMA / heca'], role: ['托管运行时与本地编排', 'managed runtime, local orchestration'], short: ['运行时', 'runtime'] },
    { id: 'skills', code: 'L2', name: ['Ornn', 'Ornn'], role: ['技能注册与安全扫描', 'skill registry and scan'], short: ['技能', 'skills'] },
    { id: 'vault', code: 'L1', name: ['NyxID', 'NyxID'], role: ['凭证金库、策略与代理', 'credential vault, policy and proxy'], short: ['金库', 'vault'] },
    { id: 'surface', code: 'L5', name: ['上线表面', 'Live Surface'], role: ['chrono-metaverse · 商户渠道', 'chrono-metaverse · merchant channels'], short: ['上线', 'live'] }
  ];
  const CONTEXT = ['bay', 'harness', 'runtime', 'skills'];   // what the engine's context can see: everything above NyxID
  const NAME = Object.fromEntries(LAYERS.map((l) => [l.id, l]));

  /* ---------- state: events on the rail ---------- */
  const S = { engines: [[0, 'alpha']], policy: 'gate', approveAt: null, revokeAt: null, stop: null };
  const stop = (layer, a, b, lane, carries, what) => ({ layer, a, b, lane, carries, what });
  function refuse(list, x) {
    list.push(stop('vault', x, x + 2, 'turn', '403', 'refused'), stop('skills', x + 2, x + 3, 'res', '403', 'up'), stop('runtime', x + 3, x + 4, 'res', '403', 'up'),
      stop('harness', x + 4, x + 6, 'res', '403', 'logged'), stop('bay', x + 6, x + 8, 'res', '403', 'refusedResult'));
  }
  /** The two calls of the session as tables of stops, given the events. */
  function calls() {
    const rv = S.revokeAt;
    const read = [stop('bay', 0, 12, 'req', 'handle', 'compose'), stop('harness', 12, 18, 'req', 'handle', 'register'), stop('runtime', 18, 24, 'req', 'handle', 'dispatch'),
      stop('skills', 24, 30, 'req', 'handle', 'skill')];
    if (rv != null && rv <= 30) refuse(read, 30);
    else read.push(stop('vault', 30, 34, 'req', 'handle', 'scope'), stop('vault', 34, 42, 'req', 'key', 'inject'), stop('surface', 42, 47, 'turn', 'key', 'ok'),
      stop('vault', 47, 50, 'res', 'key', 'strip'), stop('skills', 50, 52, 'res', 'data', 'up'), stop('runtime', 52, 54, 'res', 'data', 'up'),
      stop('harness', 54, 58, 'res', 'data', 'verdict'), stop('bay', 58, 60, 'res', 'data', 'result'));
    const write = [stop('bay', 60, 62, 'req', 'handle', 'compose'), stop('harness', 62, 63, 'req', 'handle', 'register'), stop('runtime', 63, 64, 'req', 'handle', 'dispatch'),
      stop('skills', 64, GATE_AT, 'req', 'handle', 'skill')];
    const g = S.policy === 'auto' ? GATE_AT : S.approveAt != null ? Math.max(GATE_AT, S.approveAt) : INF;
    if (rv != null && rv <= g) { const x = Math.max(GATE_AT, rv); if (x > GATE_AT) write.push(stop('vault', GATE_AT, x, 'gate', 'handle', 'wait')); refuse(write, x); }
    else if (g === INF) write.push(stop('vault', GATE_AT, INF, 'gate', 'handle', 'wait'));
    else {
      if (g > GATE_AT) write.push(stop('vault', GATE_AT, g, 'gate', 'handle', 'wait'));
      write.push(stop('vault', g, g + 2, 'req', 'key', 'inject'), stop('surface', g + 2, g + 8, 'turn', 'key', 'ok'), stop('vault', g + 8, g + 10, 'res', 'key', 'strip'),
        stop('skills', g + 10, g + 11, 'res', 'data', 'up'), stop('runtime', g + 11, g + 12, 'res', 'data', 'up'), stop('harness', g + 12, g + 16, 'res', 'data', 'verdict'),
        stop('bay', g + 16, g + 18, 'res', 'data', 'result'));
    }
    return [{ id: 1, kind: 'read', stops: read }, { id: 2, kind: 'write', stops: write, gateOpen: g }];
  }
  const engineIndex = (t) => { let i = 0; S.engines.forEach((e, k) => { if (e[0] <= t + 1e-9) i = k; }); return i; };

  /* ---------- geometry ---------- */
  let geo = null;
  function geom(bx) {
    const u = bx.h / 6.9, gap = 0.12 * u, rows = {};
    let y = bx.y;
    for (const l of LAYERS) { const h = l.id === 'bay' ? 1.3 * u : u; rows[l.id] = { y, h, cy: y + h / 2 }; y += h + gap; }
    const narrow = bx.w < 480, xL = bx.x + bx.w * 0.5, xR = bx.x + bx.w * (narrow ? 0.62 : 0.68), boundary = rows.vault.y - gap / 2;
    const pw = clamp(bx.w * 0.12, 44, 76);   // the packet's width: the right column of labels starts 8 px clear of it on the response lane
    const slotX0 = bx.x + bx.w * 0.3, slotW = (bx.w * 0.7 - 2 * 8) / 3;
    const slots = ORDER.map((id, i) => ({ id, x: slotX0 + i * (slotW + 8), y: rows.bay.y + rows.bay.h * 0.1, w: slotW, h: rows.bay.h * 0.56 }));
    return { bx, u, gap, rows, xL, xR, boundary, slots, pw, clearR: xR + pw / 2 + 8, narrow };
  }
  /** Where the packet is drawn at a stop: lane x and band y (the gate sits on the NyxID boundary). */
  function node(G, s, phase) {
    const y = s.lane === 'gate' ? G.boundary - 3 : s.layer === 'bay' ? G.rows.bay.y + G.rows.bay.h * 0.9 : G.rows[s.layer].cy;
    const x = s.lane === 'res' ? G.xR : s.lane === 'turn' ? G.xL + (G.xR - G.xL) * phase : G.xL;
    return [x, y];
  }

  /* ---------- the frame at time t ---------- */
  function derive(t) {
    const cs = calls(), c = t < WRITE_AT - 1e-9 ? cs[0] : cs[1], stops = c.stops;
    let i = stops.findIndex((s) => t >= s.a - 1e-9 && t < s.b - 1e-9), done = false;
    if (i < 0) { i = stops.length - 1; done = true; }
    const s = stops[i], next = done ? null : stops[i + 1] || null;
    const span = s.b - s.a, rest = Number.isFinite(span) ? 0.62 * span : INF, u = t - s.a;
    const moving = !!next && u > rest, f = moving ? TRV.smooth((u - rest) / (span - rest)) : 0;
    // leaving NyxID upwards the credential has been stripped: what crosses the boundary carries data or 403 only
    const carries = moving && s.carries === 'key' && CONTEXT.includes(next.layer) ? next.carries : s.carries;
    const plain = Object.fromEntries(LAYERS.map((l) => [l.id, 0]));
    if (carries === 'key') plain[s.layer] += 1;
    const inContext = CONTEXT.reduce((a, id) => a + plain[id], 0);
    let x = null, y = null;
    if (geo) {
      const phase = s.lane === 'turn' ? clamp(u / (rest || 1), 0, 1) : 0, p0 = node(geo, s, done ? 1 : phase);
      if (moving) { const p1 = node(geo, next, 0); x = p0[0] + (p1[0] - p0[0]) * f; y = p0[1] + (p1[1] - p0[1]) * f; } else { x = p0[0]; y = p0[1]; }
    }
    const ei = engineIndex(t), eAt = S.engines[ei][0], swapF = ei > 0 ? clamp((t - eAt) / SWAP, 0, 1) : 1;
    const revoked = S.revokeAt != null && t >= S.revokeAt - 1e-9, reload = revoked ? clamp((t - S.revokeAt) / RELOAD, 0, 1) : 0;
    const w = cs[1], wStops = w.stops, waitStop = wStops.find((q) => q.lane === 'gate');
    let gate;
    if (S.policy === 'auto') gate = t < GATE_AT ? 'ahead' : wStops.some((q) => q.what === 'refused') ? 'refused' : 'auto';
    else if (t < GATE_AT - 1e-9) gate = 'ahead';
    else if (c.id === 2 && s.what === 'wait') gate = 'waiting';
    else if (wStops.some((q) => q.what === 'refused')) gate = 'refused';
    else gate = 'approved';
    const http = done ? (s.carries === '403' ? 403 : 200) : s.what === 'ok' ? 200 : s.carries === '403' ? 403 : null;
    return { t, call: c.id, kind: c.kind, stop: s, next, i, done, moving, carries, layer: s.layer, lane: s.lane, x, y, plain, inContext,
      engine: S.engines[ei][1], engineSince: eAt, prevEngine: ei > 0 ? S.engines[ei - 1][1] : null, swapF, swaps: S.engines.filter((e, k) => k > 0 && e[0] <= t + 1e-9).length,
      revoked, reload, gate, waited: waitStop ? Math.max(0, Math.min(t, waitStop.b) - waitStop.a) : 0, gateOpen: w.gateOpen, http, calls: cs };
  }
  /** Model time per band up to t (ticks), the gate wait apart. */
  function timeInLayers(t, cs) {
    const out = Object.fromEntries(LAYERS.map((l) => [l.id, 0])); out.gate = 0;
    for (const c of cs) for (const s of c.stops) { const d = Math.max(0, Math.min(s.b, t) - s.a); if (d > 0) out[s.lane === 'gate' ? 'gate' : s.layer] += d; }
    return out;
  }

  /* ---------- words ---------- */
  const fmtS = (t) => `${(t / 10).toFixed(1)} s`;
  const WHAT = {
    compose: [['引擎拟定调用：只带能力句柄', 'the engine drafts the call: a capability handle only'], ['拟定', 'DRAFT']],
    register: [['chrono-harness 登记这次调用', 'chrono-harness registers the call'], ['登记', 'REGISTER']],
    dispatch: [['CMA / heca 把它派发到沙箱', 'CMA / heca dispatch it to a sandbox'], ['派发', 'DISPATCH']],
    skill: [['Ornn 核对技能版本与扫描结果', 'Ornn checks the skill version and its scan'], ['技能 ✓', 'SKILL ✓']],
    scope: [['NyxID 核对作用域：读调用，自动放行', 'NyxID checks the scope: a read passes on its own'], ['作用域 ✓', 'SCOPE ✓']],
    inject: [['NyxID 在代理内存里注入凭证：只在边界之下', 'NyxID injects the credential in proxy memory, below the boundary only'], ['注入', 'INJECT']],
    ok: [['上线表面执行：200 OK', 'the live surface executes: 200 OK'], ['200 OK', '200 OK']],
    strip: [['NyxID 剥掉凭证再把数据交回', 'NyxID strips the credential before handing the data back'], ['剥离', 'STRIP']],
    up: [['结果沿响应道上行', 'the result goes up the response lane'], ['', '']],
    verdict: [['chrono-harness 判定通过', 'chrono-harness: verdict passed'], ['判定 ✓', 'VERDICT ✓']],
    result: [['结果交给当前引擎', 'the result reaches the current engine'], ['结果', 'RESULT']],
    wait: [['写调用停在人工闸门前，等人批准', 'the write waits at the human gate for approval'], ['等待人工批准', 'WAITING FOR A HUMAN']],
    refused: [['授权已吊销：403 REVOKED，未注入凭证', 'grant revoked: 403 REVOKED, no credential injected'], ['403 REVOKED', '403 REVOKED']],
    logged: [['chrono-harness 记下这次拒绝', 'chrono-harness records the refusal'], ['已记录', 'LOGGED']],
    refusedResult: [['引擎收到 403：没有任何凭证经过它', 'the engine gets 403: no credential ever passed it'], ['403', '403']]
  };
  const CARRY = { handle: ['句柄', 'HANDLE'], key: ['密钥', 'KEY'], data: ['数据', 'DATA'], 403: ['403', '403'] };
  const carryColor = (c) => (c === 'key' ? P.violet : c === '403' ? P.magenta : c === 'handle' ? P.cyan : P.ink);
  const callName = (k) => (k === 'read' ? L('读调用 · 会场余座', 'read · venue seats left') : L('写调用 · 发布公告', 'write · post an announcement'));

  /* ---------- canvas helpers ---------- */
  const face = (f) => (f === 'body' ? TRV.fonts.body : f === 'display' ? TRV.fonts.display : TRV.fonts.data);
  function text(ctx, str, x, y, color, o) {
    o = o || {};
    ctx.font = `${o.weight ? o.weight + ' ' : ''}${o.size || 11}px ${face(o.face)}`;
    ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.base || 'middle'; ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
    if (o.halo) { ctx.lineWidth = 3.5; ctx.lineJoin = 'round'; ctx.strokeStyle = P.stage; ctx.strokeText(str, x, y); }
    ctx.fillStyle = color; ctx.fillText(str, x, y); ctx.globalAlpha = 1;
  }
  const width = (ctx, str, size, f, weight) => { ctx.font = `${weight ? weight + ' ' : ''}${size}px ${face(f)}`; return ctx.measureText(str).width; };
  /** A right-column label: the full words when they fit maxW at most 1 px below their size, else the compact ones. */
  const fitWords = (ctx, full, short, maxW, size, f, weight) => (width(ctx, full, size - 1, f, weight) <= maxW ? full : short);
  function fitText(ctx, str, maxW, size, f, weight) { let s = size; while (s > 7.5 && width(ctx, str, s, f, weight) > maxW) s -= 0.5; return s; }
  function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); }

  /* ---------- the stage ---------- */
  function drawBands(ctx, G, D, thumb) {
    const { bx, rows } = G, fs = clamp(G.u * 0.3, 8.5, 12);
    for (const l of LAYERS) {
      const r = rows[l.id], ctxZone = CONTEXT.includes(l.id);
      roundRect(ctx, bx.x + 0.5, r.y + 0.5, bx.w - 1, r.h - 1, 5);
      ctx.fillStyle = TRV.alpha(l.id === 'vault' ? P.violet : l.id === 'surface' ? P.sigma : P.lineHot, l.id === 'bay' ? 0.1 : 0.07); ctx.fill();
      ctx.strokeStyle = TRV.alpha(l.id === 'vault' ? P.violet : P.lineHot, ctxZone || l.id === 'surface' ? 0.55 : 0.75); ctx.lineWidth = 1; ctx.stroke();
      if (D.layer === l.id) {
        ctx.fillStyle = P.amber;
        ctx.fillRect(bx.x + 1, r.y + 3, 3, r.h - 6);
      }
      if (thumb) continue;
      const lx = bx.x + 10, lw = bx.w * (l.id === 'bay' ? 0.27 : 0.44) - 14, title = (l.code ? `${l.code}  ` : '') + L(l.name[0], l.name[1]);
      const ts = fitText(ctx, title, lw, fs, 'display', 600), two = r.h >= ts * 2.6;
      text(ctx, title, lx, two ? r.cy - ts * 0.6 : r.cy, l.id === 'vault' ? P.violet : P.ink, { size: ts, face: 'display', weight: 600 });
      if (two) { const role = G.narrow ? L(l.short[0], l.short[1]) : L(l.role[0], l.role[1]); text(ctx, role, lx, r.cy + ts * 0.65, P.dim, { size: fitText(ctx, role, lw, ts - 1.5, 'body'), face: 'body' }); }
      // the right column: plaintext in context, band by band; the vault's own state. It stays clear of the packet on the response lane.
      const rx = bx.x + bx.w - 10, rw = Math.min(bx.w * 0.27, rx - G.clearR);
      if (ctxZone && l.id !== 'bay') {
        const n = D.plain[l.id], str = fitWords(ctx, L(`明文 ${n}`, `PLAINTEXT ${n}`), L(`明文 ${n}`, `KEYS ${n}`), rw, fs - 0.5, 'data', 600);
        text(ctx, str, rx, r.cy, P.cyan, { align: 'right', size: fitText(ctx, str, rw, fs - 0.5, 'data', 600), weight: 600 });
      } else if (l.id === 'vault') {
        if (D.revoked) {
          const s = (D.reload * RELOAD / 10).toFixed(1), str = fitWords(ctx, L(`热重载 ${s} / 2.1 s`, `RELOAD ${s} / 2.1 s`), L(`热重载 ${s} s`, `RELOAD ${s} s`), rw, fs - 1), sz = fitText(ctx, str, rw, fs - 1);
          text(ctx, str, rx, r.cy - sz * 0.6, P.magenta, { align: 'right', size: sz });
          const bw = rw * 0.9, by = r.cy + sz * 0.45;
          ctx.fillStyle = TRV.alpha(P.magenta, 0.18); ctx.fillRect(rx - bw, by, bw, 4); ctx.fillStyle = P.magenta; ctx.fillRect(rx - bw, by, bw * D.reload, 4);
        } else {
          const str = fitWords(ctx, L('密钥封存于此', 'KEY SEALED HERE'), L('密钥封存', 'KEY SEALED'), rw, fs - 1, 'data', 600);
          text(ctx, str, rx, r.cy, P.violet, { align: 'right', size: fitText(ctx, str, rw, fs - 1, 'data', 600), weight: 600 });
        }
      }
    }
  }
  function drawLanes(ctx, G, D, thumb) {
    const { rows, xL, xR, boundary, bx } = G, top = rows.bay.y + rows.bay.h * 0.9, bottom = rows.surface.cy;
    for (const [x, dir] of [[xL, 1], [xR, -1]]) {
      ctx.strokeStyle = TRV.alpha(P.cyan, 0.68); ctx.lineWidth = thumb ? 2.4 : 1.4; ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, boundary); ctx.stroke();
      ctx.strokeStyle = TRV.alpha(P.violet, 0.7); ctx.beginPath(); ctx.moveTo(x, boundary); ctx.lineTo(x, bottom); ctx.stroke();
      ctx.fillStyle = TRV.alpha(P.dim, 0.7);
      for (const l of LAYERS) {
        if (l.id === 'bay' || l.id === 'surface') continue;
        const cy = rows[l.id].y + 4;
        ctx.beginPath(); ctx.moveTo(x - 3.5, cy - 2.5 * dir); ctx.lineTo(x + 3.5, cy - 2.5 * dir); ctx.lineTo(x, cy + 2.5 * dir); ctx.closePath(); ctx.fill();
      }
    }
    ctx.strokeStyle = TRV.alpha(P.violet, 0.7); ctx.lineWidth = thumb ? 2.4 : 1.4; ctx.beginPath(); ctx.moveTo(xL, bottom); ctx.lineTo(xR, bottom); ctx.stroke();
    // the NyxID boundary
    ctx.strokeStyle = P.violet; ctx.lineWidth = thumb ? 2.6 : 1.6; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(bx.x + 4, boundary); ctx.lineTo(bx.x + bx.w - 4, boundary); ctx.stroke(); ctx.setLineDash([]);
    // the write gate on the request lane, on the boundary
    const waiting = D.gate === 'waiting', gw = clamp(G.u * 0.7, 16, 30);
    ctx.lineWidth = 2;
    ctx.strokeStyle = waiting ? P.amber : P.dim;
    ctx.beginPath(); ctx.moveTo(xL - gw / 2, boundary - 7); ctx.lineTo(xL - gw / 2, boundary + 7); ctx.moveTo(xL + gw / 2, boundary - 7); ctx.lineTo(xL + gw / 2, boundary + 7); ctx.stroke();
    if (S.policy === 'gate') {
      const elapsed = D.t - D.gateOpen;
      const a = D.gate === 'approved' ? -1.05 * TRV.smooth(clamp(elapsed / 1.8, 0, 1)) : 0;
      ctx.save(); ctx.translate(xL - gw / 2, boundary); ctx.rotate(a);
      ctx.strokeStyle = waiting ? P.amber : P.lineHot; ctx.lineWidth = waiting ? 3 : 2.2; if (waiting) { ctx.shadowColor = P.amber; ctx.shadowBlur = 10; }
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(gw, 0); ctx.stroke(); ctx.restore(); ctx.shadowBlur = 0;
    }
    if (thumb) return;
    const fs = clamp(G.u * 0.26, 8, 10.5), rx = bx.x + bx.w - 10, maxW = Math.min(bx.w * 0.25, rx - G.clearR - 10);   // its box stays clear of the packet on the response lane
    const str = fitWords(ctx, L('NyxID 边界', 'NyxID BOUNDARY'), 'NyxID', maxW, fs, 'display', 600), sz = fitText(ctx, str, maxW, fs, 'display', 600), wpx = width(ctx, str, sz, 'display', 600) + 10;
    ctx.fillStyle = P.stage; ctx.fillRect(rx - wpx, boundary - sz * 0.7, wpx, sz * 1.4);
    text(ctx, str, rx - 5, boundary, P.violet, { align: 'right', size: sz, face: 'display', weight: 600 });
  }
  function drawBay(ctx, G, D, thumb) {
    const fs = clamp(G.u * 0.3, 8.5, 12);
    for (const sl of G.slots) {
      const active = sl.id === D.engine, leaving = sl.id === D.prevEngine && D.swapF < 1, a = active ? (D.prevEngine && D.swapF < 1 ? D.swapF : 1) : leaving ? 1 - D.swapF : 0;
      roundRect(ctx, sl.x, sl.y, sl.w, sl.h, 4);
      ctx.fillStyle = TRV.alpha(P.amber, 0.1 * a); ctx.fill();
      if (active) { ctx.strokeStyle = P.amber; ctx.lineWidth = thumb ? 2.6 : 1.8; ctx.shadowColor = P.amber; ctx.shadowBlur = 10 * a; ctx.setLineDash([]); }
      else { ctx.strokeStyle = TRV.alpha(P.dim, 0.7); ctx.lineWidth = 1; ctx.setLineDash([4, 3]); }
      ctx.stroke(); ctx.setLineDash([]); ctx.shadowBlur = 0;
      if (a > 0) {   // the engine block: four cylinders
        ctx.globalAlpha = a; ctx.fillStyle = active ? P.amber : P.dim;
        const cw = sl.w * 0.11, ch = sl.h * 0.34, gx = sl.w * 0.06, x0 = sl.x + sl.w / 2 - (4 * cw + 3 * gx) / 2, y0 = sl.y + sl.h * (thumb ? 0.34 : 0.16);
        for (let k = 0; k < 4; k++) { roundRect(ctx, x0 + k * (cw + gx), y0, cw, ch, 2); ctx.fill(); }
        ctx.globalAlpha = 1;
      }
      if (thumb) continue;
      const name = G.narrow ? SHORT[sl.id] : ENGINES[sl.id], sz = fitText(ctx, name, sl.w - 6, fs - 0.5, 'display', 600);
      text(ctx, name, sl.x + sl.w / 2, sl.y + sl.h * 0.76, active ? P.ink : P.dim, { align: 'center', size: sz, face: 'display', weight: 600 });
    }
    // a recent swap: an arrow from the engine that left to the one that came in
    if (D.prevEngine && D.t - D.engineSince < 12) {
      const from = G.slots[ORDER.indexOf(D.prevEngine)], to = G.slots[ORDER.indexOf(D.engine)], y = from.y + from.h + (G.narrow ? 3 : 6);
      const x0 = from.x + from.w / 2, x1 = to.x + to.w / 2, dir = Math.sign(x1 - x0) || 1;
      ctx.strokeStyle = P.ink; ctx.fillStyle = P.ink; ctx.globalAlpha = 0.75; ctx.lineWidth = thumb ? 2.2 : 1.4; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1 - dir * 6, y); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x1 - dir * 7, y - 4); ctx.lineTo(x1 - dir * 7, y + 4); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
      if (!thumb && !G.narrow) {
        const str = L(`${fmtS(D.engineSince)} 热换`, `HOT SWAP ${fmtS(D.engineSince)}`), sz = fitText(ctx, str, Math.abs(x1 - x0) - 24, fs - 1.5, 'display', 600);
        const wpx = width(ctx, str, sz, 'display', 600) + 10;
        ctx.fillStyle = P.stage; ctx.fillRect((x0 + x1) / 2 - wpx / 2, y - sz * 0.7, wpx, sz * 1.4);
        text(ctx, str, (x0 + x1) / 2, y, P.ink, { align: 'center', size: sz, face: 'display', weight: 600 });
      }
    }
    // the drive shaft from the current engine down to both lanes
    const sl = G.slots[ORDER.indexOf(D.engine)], y = G.rows.bay.y + G.rows.bay.h * 0.9;
    ctx.strokeStyle = TRV.alpha(P.amber, 0.55); ctx.lineWidth = thumb ? 2.4 : 1.4;
    ctx.beginPath(); ctx.moveTo(sl.x + sl.w / 2, sl.y + sl.h); ctx.lineTo(sl.x + sl.w / 2, y); ctx.moveTo(Math.min(G.xL, sl.x + sl.w / 2), y); ctx.lineTo(Math.max(G.xR, sl.x + sl.w / 2), y); ctx.stroke();
  }
  function drawPacket(ctx, G, D, thumb) {
    if (D.x == null) return;
    const w = G.pw * (thumb ? 1.4 : 1), h = clamp(G.u * 0.46, 14, 22) * (thumb ? 1.3 : 1), col = carryColor(D.carries);
    const waiting = D.gate === 'waiting' && D.call === 2;
    roundRect(ctx, D.x - w / 2, D.y - h / 2, w, h, h / 2);
    ctx.fillStyle = D.carries === 'key' ? TRV.alpha(P.violet, 0.9) : D.carries === '403' ? TRV.alpha(P.magenta, 0.9) : TRV.alpha(P.stage, 0.92); ctx.fill();
    ctx.strokeStyle = waiting ? P.amber : col; ctx.lineWidth = waiting ? 2.4 : 1.8; ctx.shadowColor = waiting ? P.amber : col; ctx.shadowBlur = 12; ctx.stroke(); ctx.shadowBlur = 0;
    if (thumb) return;
    const lab = L(CARRY[D.carries][0], CARRY[D.carries][1]), solid = D.carries === 'key' || D.carries === '403';
    text(ctx, lab, D.x, D.y + 0.5, solid ? P.stage : col, { align: 'center', size: fitText(ctx, lab, w - 8, h * 0.56, 'display', 600), face: 'display', weight: 600 });
    const tag = WHAT[D.stop.what][1], str = L(tag[0], tag[1]);
    if (str && !D.moving && D.layer !== 'bay') {   // in the bay the slot names sit above the packet; the HUD says it
      const fs = clamp(G.u * 0.3, 8.5, 11.5), color = D.stop.what === 'wait' ? P.amber : D.carries === '403' ? P.magenta : D.carries === 'key' ? P.violet : P.ink;
      const sz = fitText(ctx, str, G.bx.w * 0.4, fs, 'display', 600);
      text(ctx, str, D.x, D.y - h / 2 - sz * 0.8, color, { align: 'center', size: sz, face: 'display', weight: 600, halo: true });
    }
  }
  function drawStage() {
    const g = kit.plot($('cv'), { x: [0, 1], y: [0, 1], pad: [0, 0, 0, 0] }), ctx = g.ctx, W = g.W, H = g.H;
    if (TRV.thumbMode) {
      geo = geom({ x: W * 0.12, y: H * 0.07, w: W * 0.76, h: H * 0.86 });
      const D = derive(clock.t);
      drawBands(ctx, geo, D, true); drawLanes(ctx, geo, D, true); drawBay(ctx, geo, D, true); drawPacket(ctx, geo, D, true);
      return;
    }
    const st = $('stage').getBoundingClientRect(), below = (el) => (el ? el.getBoundingClientRect().bottom - st.top : 0);
    TRV.hudFit();
    const top = Math.max(40, below($('hudBig').parentElement)) + 8, bottom = Math.max(16, $('legend').offsetHeight + 18);
    geo = geom({ x: 14, y: top, w: W - 28, h: Math.max(120, H - top - bottom) });
    const D = derive(clock.t);
    drawBands(ctx, geo, D, false); drawLanes(ctx, geo, D, false); drawBay(ctx, geo, D, false); drawPacket(ctx, geo, D, false);
  }

  /* ---------- the strip ---------- */
  function plotPlain(cv) {
    const g = kit.plot(cv, { x: [0, TMAX], y: [-0.25, 1.35], pad: [34, 12, 10, 20] }), saved = geo;
    g.axes({ yTicks: [[0, '0'], [1, '1']], xTicks: [[0, '0 s'], [WRITE_AT, '6 s'], [TMAX, '10 s']] });
    const below = [], ctxLine = [];
    geo = null;   // only the counts are sampled here, not the drawing
    for (let t = 0; t <= TMAX; t += 0.25) { const d = derive(t); below.push([t, d.plain.vault + d.plain.surface]); ctxLine.push([t, d.inContext]); }
    geo = saved;
    g.area(below, P.violet, { alpha: 0.22, base: 0 }); g.line(below, P.violet, { width: 1.4 });
    g.line(ctxLine, P.cyan, { width: 2.4 });
    if (S.revokeAt != null) g.vline(S.revokeAt, P.magenta, { dash: [3, 3], alpha: 0.8 });
    g.vline(clock.t, P.amber, { alpha: 0.8 }); g.dot(clock.t, 0, P.cyan, 4, { glow: 8 });
    g.legend([[P.cyan, L('上下文中（恒为 0）', 'in context (always 0)')], [P.violet, L('NyxID 边界之下', 'below the NyxID boundary')]]);
    $('pAMeta').textContent = L(`上下文 0 · 之下 ${derive(clock.t).plain.vault + derive(clock.t).plain.surface}`, `context 0 · below ${derive(clock.t).plain.vault + derive(clock.t).plain.surface}`);
  }
  function plotBudget(cv) {
    const D = derive(clock.t), B = timeInLayers(clock.t, D.calls), rows = LAYERS.map((l) => l.id), max = Math.max(1000, ...rows.map((id) => (B[id] + (id === 'vault' ? B.gate : 0)) * 100)) * 1.12;
    const g = kit.plot(cv, { x: [0, max], y: [rows.length, 0], pad: [70, 14, 8, 20] });
    const ticks = []; const stepMs = max > 4000 ? 2000 : 1000; for (let v = 0; v <= max; v += stepMs) ticks.push([v, `${v / 1000} s`]);
    g.axes({ xTicks: ticks, xGrid: true, frame: false });
    rows.forEach((id, k) => {
      const l = NAME[id], lab = l.code ? `${l.code} ${L(l.short[0], l.short[1])}` : L(l.short[0], l.short[1]);
      g.text(0, k + 0.5, lab, P.dim, { align: 'right', dx: -6, size: 10 });
      const v = B[id] * 100; g.rect(0, k + 0.2, v, k + 0.8, id === 'vault' || id === 'surface' ? P.violet : P.cyan, { alpha: 0.55 });
      if (id === 'vault' && B.gate > 0) g.rect(v, k + 0.2, v + B.gate * 100, k + 0.8, P.amber, { alpha: 0.7 });
    });
    $('pBMeta').textContent = L(`闸门等待 ${(B.gate / 10).toFixed(1)} s · 一格 = 100 ms`, `gate wait ${(B.gate / 10).toFixed(1)} s · 1 tick = 100 ms`);
  }
  function drawPlots() { if (TRV.still || TRV.figure) return; plotPlain($('plotA')); plotBudget($('plotB')); }

  /* ---------- HUD, legend, readouts, pills, controls ---------- */
  function drawText() {
    const D = derive(clock.t), w = WHAT[D.stop.what][0];
    $('hudBig').textContent = L(`整车剖面 · 上下文明文 ${D.inContext}`, `Vehicle cutaway · plaintext in context ${D.inContext}`);
    const tight = $('stage').clientWidth < 520, tag = WHAT[D.stop.what][1];
    $('hudSub').textContent = tight ? `${fmtS(clock.t)} · ${D.kind === 'read' ? L('读调用', 'read') : L('写调用', 'write')}${tag[0] ? ` · ${L(tag[0], tag[1])}` : ''}`
      : `${fmtS(clock.t)} · ${callName(D.kind)} · ${L(w[0], w[1])}`;
    const items = [['cy', '能力句柄', 'capability handle'], ['vi', '明文密钥（只在 NyxID 之下）', 'plaintext key (below NyxID only)'], ['am', '当前引擎 · 等待的闸门', 'current engine · waiting gate']]
      .concat(S.revokeAt != null ? [['mg', '403 拒绝', '403 refusal']] : []);
    const leg = items.map(([cl, zh, en]) => `<span><i class="sw ${cl}"></i>${L(zh, en)}</span>`).join('');
    if ($('legend')._h !== leg) { $('legend').innerHTML = leg; $('legend')._h = leg; }
    const parts = CONTEXT.map((id) => `${id === 'bay' ? L('机舱', 'bay') : NAME[id].code} ${D.plain[id]}`).join(' + ');
    $('roPlain').innerHTML = `<span class="c-cy">${D.inContext}</span>`;
    $('roPlainSub').innerHTML = `${parts} = ${D.inContext} <span class="nummark">${D.inContext === 0 ? '✓' : '✗'}</span>`;
    $('roEngine').textContent = `${ENGINES[D.engine]} · ${L(`自 ${fmtS(D.engineSince)}`, `since ${fmtS(D.engineSince)}`)}`;
    $('roPacket').textContent = `${D.kind === 'read' ? L('读', 'read') : L('写', 'write')} · ${NAME[D.layer].code || L('机舱', 'bay')} · ${L(CARRY[D.carries][0], CARRY[D.carries][1].toLowerCase())}`;
    const gate = {
      ahead: S.policy === 'auto' ? L('全部自动放行（写调用 6.6 s 到达）', 'auto-pass all (the write arrives at 6.6 s)') : L('写调用尚未到达（6.6 s）', 'the write has not arrived yet (6.6 s)'),
      waiting: L(`等待人工批准 ${(D.waited / 10).toFixed(1)} s · 页面不会自动批准`, `waiting for a human for ${(D.waited / 10).toFixed(1)} s · the page never approves by itself`),
      approved: L(`${fmtS(D.gateOpen)} 由人批准放行`, `approved by a human at ${fmtS(D.gateOpen)}`),
      auto: L('自动放行：写调用未经人工', 'auto-pass: the write went through with no human'),
      refused: L('授权已吊销：写调用被 403 拒绝', 'grant revoked: the write was refused with 403')
    }[D.gate];
    $('roGate').textContent = gate;
    $('roGrant').innerHTML = S.revokeAt == null ? L('有效', 'active')
      : D.revoked ? `<span class="c-mg">${L(`${fmtS(S.revokeAt)} 已吊销`, `revoked at ${fmtS(S.revokeAt)}`)}</span> · ${L('热重载', 'reload')} ${(D.reload * RELOAD / 10).toFixed(1)} / 2.1 s · ${L('重启 0 · 轮换上游密钥 0', 'restarts 0 · upstream keys rotated 0')}`
        : L(`有效 · 将于 ${fmtS(S.revokeAt)} 吊销`, `active · revocation at ${fmtS(S.revokeAt)}`);
    $('roSwap').innerHTML = `${L(`换引擎 ${D.swaps} 次`, `${D.swaps} swap${D.swaps === 1 ? '' : 's'}`)} · ${L('会话 1 · 重新鉴权 0 · 丢失状态 0', 'session 1 · re-auth 0 · state lost 0')}`;
    $('roNote').textContent = L('能力句柄在上，明文密钥在下：两者只在 NyxID 的边界处交接。', 'The handle above, the plaintext key below: the two meet only at the NyxID boundary.');
    $('pillEngine').querySelector('strong').textContent = ENGINES[D.engine];
    $('pillPlain').querySelector('strong').textContent = String(D.inContext);
    $('pillGrant').querySelector('strong').textContent = D.revoked ? '403 REVOKED' : L('有效', 'ACTIVE');
    engineChips.set(D.engine, true); policyChips.set(S.policy, true);
    $('approve').disabled = !(S.policy === 'gate' && S.approveAt == null && D.gate !== 'refused' && !(D.revoked));
    $('revoke').setAttribute('aria-pressed', String(S.revokeAt != null));
  }

  const paint = kit.painter(() => { drawText(); drawStage(); drawPlots(); }, [$('stage'), $('plotA'), $('plotB')]);

  /* ---------- the rail ---------- */
  const clock = kit.clock({
    range: $('now'), play: $('play'), label: $('tau'), speeds: $('speedChips'), max: TMAX, rate: 10, step: 2,
    // (the label is first drawn while the clock is being built: it reads t only)
    format: (t) => `${(t / 10).toFixed(1)} s <small>/ 10 s · ${L('模型', 'model')}</small>`,
    onChange: (t, C) => {
      if (!C.playing) S.stop = null;
      else if (S.stop != null && C.t >= S.stop - 1e-9) { const s = S.stop; S.stop = null; C.pause(); C.set(s); }
      paint();
    }
  });
  $('rew').addEventListener('click', () => { clock.pause(); clock.set(0); });

  const leave = () => cards.mark(null);
  const engineChips = kit.chips($('engineChips'), 'engine', (v) => {
    leave();
    const t = clock.t, cur = S.engines[engineIndex(t)][1];
    if (v === cur) return paint();
    S.engines = t <= 1e-9 ? [[0, v]] : S.engines.filter((e) => e[0] < t - 1e-9).concat([[t, v]]);
    paint();
  });
  const policyChips = kit.chips($('policyChips'), 'policy', (v) => { leave(); S.policy = v; paint(); });
  const approve = () => { if ($('approve').disabled) return; leave(); S.approveAt = clock.t; paint(); };
  const revoke = () => { leave(); S.revokeAt = S.revokeAt == null ? clock.t : null; paint(); };
  $('approve').addEventListener('click', approve);
  $('revoke').addEventListener('click', revoke);
  kit.keys({ a: approve, r: revoke });

  /* ---------- experiment cards ---------- */
  // a card that plays declares its still: the frame of the figure a chapter cites (and of PDF / EPUB)
  const PRESETS = {
    swap: { engines: [[0, 'alpha'], [48, 'beta']], policy: 'gate', at: 50, play: true, from: 36, stop: 62, still: 50 },
    vault: { engines: [[0, 'alpha']], policy: 'gate', at: 40, play: true, from: 24, stop: 52, still: 40 },
    approval: { engines: [[0, 'beta']], policy: 'gate', at: 68, play: true, from: 50, still: 68 },
    revoke: { engines: [[0, 'local']], policy: 'gate', revokeAt: 64, at: 85, play: true, from: 56, still: 85 }
  };
  const NOTES = {
    swap: ['读调用在 4.8 s 时还在 NyxID 与上线表面之间，机舱把 Engine Alpha 换成 Engine Beta。会话、技能版本与判官都登记在底盘里：会话仍是 1，重新鉴权 0 次，结果照常回到新引擎。', 'At 4.8 s, while the read call is out between NyxID and the live surface, the bay swaps Engine Alpha for Engine Beta. The session, the skill versions and the judges are registered in the chassis: the session count stays 1, re-authentications 0, and the result comes back to the new engine as usual.'],
    vault: ['4.0 s：读调用已越过 NyxID 边界。机舱与上面三层从头到尾只见过不透明的能力句柄；NyxID 在代理内存里注入凭证，带明文密钥的只有边界之下这一段，回程时先剥掉再交回。上下文中的明文：0。', '4.0 s: the read call has crossed the NyxID boundary. The engine bay and the three bands above have only ever seen an opaque capability handle; NyxID injects the credential in proxy memory, only the stretch below the boundary carries the plaintext key, and it is stripped on the way back. Plaintext in context: 0.'],
    approval: ['读调用在 NyxID 的策略检查处自动放行；6.6 s 到达的写调用停在琥珀色人工闸门前，一直等下去：页面从不替你批准。按“批准这次写入”放行它，或改成“全部自动放行”对照。', 'The read passes NyxID\'s policy check on its own; the write that arrives at 6.6 s stops at the amber human gate and keeps waiting: the page never approves for you. Press "approve this write" to let it through, or switch to "auto-pass all" to compare.'],
    revoke: ['6.4 s 在 NyxID 吊销会话授权：6.6 s 到达的写调用当场收到 403 REVOKED，不注入任何凭证；到 8.5 s，运行中的沙箱在约 2.1 s 的热重载窗口内换上新绑定，重启 0 次，上游服务的主密钥不必轮换。', 'At 6.4 s the session grant is revoked at NyxID: the write arriving at 6.6 s is refused at once with 403 REVOKED and no credential is injected; by 8.5 s the running sandboxes have picked up the new binding within the ~2.1 s hot-reload window, with no restart and no rotation of the upstream services\' master keys.']
  };
  // a cited figure keeps one sentence next to ◀ ▶; the full lab keeps the longer notes above
  const FIGURE_NOTES = {
    swap: ['调用在外时换上 Engine Beta：会话仍是 1，重新鉴权 0。', 'Engine Beta goes in while the call is out: one session, zero re-auth.'],
    vault: ['越过边界的只有句柄；明文密钥只在 NyxID 之下，上下文中为 0。', 'Only the handle crosses; the plaintext key stays below NyxID: 0 in context.'],
    approval: ['读调用自动放行；写调用停在琥珀色人工闸门前等人批准。', 'The read passes on its own; the write waits at the amber human gate.'],
    revoke: ['6.4 s 吊销：写调用收到 403 REVOKED，2.1 s 热重载内无需重启。', 'Revoked at 6.4 s: the write gets 403 REVOKED; the 2.1 s reload needs no restart.']
  };
  let booting = true;
  function applyPreset(id) {
    const p = PRESETS[id];
    S.engines = p.engines.map((e) => e.slice()); S.policy = p.policy; S.approveAt = null; S.revokeAt = p.revokeAt == null ? null : p.revokeAt;
    clock.pause(); clock.set(p.at);
    if (TRV.still && p.still != null) clock.set(p.still === 'end' ? clock.max : p.still);
    // a still (cover, cited figure for PDF/EPUB) and the opening view of the full page show the telling frame;
    // inside a chapter the card plays once the reader has scrolled it into view; a click plays at once
    if (!p.play || TRV.still || (booting && !TRV.embed)) { paint(); return; }
    clock.set(p.from || 0); S.stop = p.stop == null ? null : p.stop;
    if (booting) kit.autoplay(clock, $('stage')); else clock.play();
  }
  const cards = kit.cards($('presets'), { presets: PRESETS, notes: TRV.figure ? FIGURE_NOTES : NOTES, noteEl: $('presetNote'), tour: $('tour'), onPick: applyPreset,
    idle: ['自由探索：换引擎、切换写操作策略、批准或吊销，拖动时间轴。随时可以再选一张卡。', 'Free play: swap the engine, change the write policy, approve or revoke, scrub the rail. Pick a card again at any time.'] });

  TRV.drawer({ drawer: $('drawer'), open: $('infoBtn'), close: $('drawerClose') });
  TRV.startGlitch(document.querySelector('.brand'));

  /* ---------- probe for the browser suite, cover, start ---------- */
  const snapshot = (D) => ({ t: D.t, call: D.call, kind: D.kind, layer: D.layer, lane: D.lane, what: D.stop.what, carries: D.carries, moving: D.moving, done: D.done,
    plain: { ...D.plain }, inContext: D.inContext, engine: D.engine, engineName: ENGINES[D.engine], swaps: D.swaps, sessions: 1, reauth: 0, stateLost: 0,
    gate: D.gate, waited: D.waited, http: D.http, revoked: D.revoked, reload: D.reload, restarts: 0, rotated: 0,
    y: D.y, x: D.x, boundary: geo ? geo.boundary : null });
  window.VEHICLE_STACK_DEBUG = {
    get state() {
      return { ...snapshot(derive(clock.t)), max: clock.max, playing: clock.playing, preset: cards.current, policy: S.policy, approveAt: S.approveAt, revokeAt: S.revokeAt,
        engines: S.engines.map((e) => e.slice()), stop: S.stop };
    },
    /** The frame the page would show at each time of ts, without moving the clock. */
    sample: (ts) => ts.map((t) => snapshot(derive(clamp(t, 0, TMAX)))),
    engines: () => ({ ...ENGINES }),
    /** Set the events directly: { engines, policy, approveAt, revokeAt } (any subset). */
    set: (o) => { if (o.engines) S.engines = o.engines.map((e) => e.slice()); if (o.policy) S.policy = o.policy; if ('approveAt' in o) S.approveAt = o.approveAt; if ('revokeAt' in o) S.revokeAt = o.revokeAt; paint(); },
    seek: (t) => { clock.pause(); clock.set(t); }
  };
  /** Cover: the read call below the NyxID boundary, the key in violet, Engine Alpha in the bay. */
  window.TRV_THUMB = () => { S.engines = [[0, 'alpha']]; S.policy = 'gate'; S.approveAt = null; S.revokeAt = null; clock.pause(); clock.set(40); paint.now(); };
  cards.pick(cards.initial('swap'));   // a chapter may cite another card: ::: {.viz src="engine-vehicle-stack" preset="vault"}
  booting = false;
  paint();
})();
