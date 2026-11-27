/* LAUNCH//ARENA · 发布会会场: the Street Corner lobby and its six-ring stadium, on one floor plan.
     rings    96 + 144 + 176 + 204 + 232 + 256 = 1,108 seats in six concentric half rings around the keynote podium
     lobby    Donna's reception desk, the promenade with 18 numbered flower-basket stands, Blossom's Flower Town counter
     stream   the exit to the synchronized YouTube / LinkedIn Live stream for guests beyond the 1,108 seats
   The rail is minutes from T−75 to T+25 (T−0 = 16:00 SGT on 17 December). Model: guest k of N arrives at minute 75·k/N,
   so ⌊N·t/75⌋ have arrived by minute t. The atomic seat lock serves guests one at a time in order of arrival: the
   innermost ring with a free seat, then a forward probe from the guest's hash position to the first free seat. Guest k's
   seat therefore depends on k alone. From guest 1,109 on there is no seat lock: odd overflow numbers go to YouTube, even
   ones to LinkedIn Live. The naive race of the small plot is a counterfactual: each minute's arrivals read the free seats
   as they stood at the start of the minute and take one without a lock. Baskets: stand i gets its basket at minute
   5·i (i ≤ 12) or 60 + 2·(i − 12) (i > 12), after a three-minute walk from the Flower Town counter.
   Colours: cyan = a locked seat, violet = a guest routed to the stream, magenta = a basket, amber = the current selection
   (and, on the BASKET card, the open stands). Read-only probe for the browser suite: LAUNCH_ARENA_DEBUG. */
(() => {
  'use strict';
  const { kit, L } = TRV, { clamp } = kit, P = TRV.palette;
  const $ = (id) => document.getElementById(id);

  /* ---------- the venue ---------- */
  const RINGS = [96, 144, 176, 204, 232, 256];
  const CAP = RINGS.reduce((a, b) => a + b, 0);                                   // 1,108
  const START = RINGS.map((_, r) => RINGS.slice(0, r).reduce((a, b) => a + b, 0));  // first global seat id of each ring
  const NMAX = 1250, T0 = 75, TMAX = 100, WALK = 2.5, STANDS = 18;
  const BASKET_AT = Array.from({ length: STANDS }, (_, i) => (i < 12 ? 5 * (i + 1) : 60 + 2 * (i - 11)));
  const BASKET_WALK = 3;
  // seat angles: each ring runs from 10° to 170° in four sections with three aisles of 4°
  const A0 = 10, A1 = 170, AISLE = 4, SECT = (A1 - A0 - 3 * AISLE) / 4, DEG = Math.PI / 180;
  const RING_OF = new Int8Array(CAP), THETA = new Float64Array(CAP);
  RINGS.forEach((n, r) => {
    const per = n / 4;
    for (let i = 0; i < n; i++) {
      const g = START[r] + i, sec = Math.floor(i / per), j = i % per;
      RING_OF[g] = r; THETA[g] = (A0 + sec * (SECT + AISLE) + ((j + 0.5) / per) * SECT) * DEG;
    }
  });

  /* ---------- the atomic seat lock (guest k's seat does not depend on the load) ---------- */
  const hash = (k, r) => (Math.imul(k, 0x9E3779B1) ^ Math.imul(r + 1, 0x85EBCA6B)) >>> 0;
  const SEAT = new Int16Array(NMAX + 1).fill(-1);     // global seat id of guest k, −1: routed to the stream
  const OWNER = new Int16Array(CAP);                   // the guest who holds each seat
  {
    const taken = new Uint8Array(CAP), filled = RINGS.map(() => 0);
    let ring = 0;
    for (let k = 1; k <= NMAX; k++) {
      while (ring < RINGS.length && filled[ring] >= RINGS[ring]) ring++;
      if (ring >= RINGS.length) continue;
      const n = RINGS[ring];
      let s = hash(k, ring) % n;
      while (taken[START[ring] + s]) s = (s + 1) % n;
      taken[START[ring] + s] = 1; filled[ring]++; SEAT[k] = START[ring] + s; OWNER[START[ring] + s] = k;
    }
  }
  const arrivals = (t, N) => Math.min(N, Math.floor((N * Math.min(Math.max(t, 0), T0)) / T0 + 1e-9));
  const basketsAt = (t) => BASKET_AT.filter((x) => x <= t + 1e-9).length;

  /* ---------- the naive race (counterfactual, for the small plot) ---------- */
  const naiveCache = new Map();
  /** Cumulative duplicate seats after each minute 0 … 75 when each minute's arrivals grab seats from a stale snapshot. */
  function naiveSeries(N) {
    if (naiveCache.has(N)) return naiveCache.get(N);
    const taken = new Uint8Array(CAP), free = RINGS.slice(), D = new Int32Array(T0 + 1);
    let dup = 0, k = 1;
    for (let m = 1; m <= T0; m++) {
      const hi = arrivals(m, N), picks = [];
      let ring = 0;
      while (ring < RINGS.length && free[ring] <= 0) ring++;
      for (; k <= hi; k++) {
        if (ring >= RINGS.length) continue;
        const n = RINGS[ring];
        let s = hash(k, ring) % n;
        while (taken[START[ring] + s]) s = (s + 1) % n;    // the snapshot: picks of this minute are not seen
        picks.push(START[ring] + s);
      }
      const seen = new Set();
      for (const g of picks) { if (seen.has(g)) dup++; else seen.add(g); }
      for (const g of seen) { taken[g] = 1; free[RING_OF[g]]--; }
      D[m] = dup;
    }
    naiveCache.set(N, D);
    return D;
  }
  const naiveAt = (t, N) => naiveSeries(N)[clamp(Math.floor(t + 1e-9), 0, T0)];

  /* ---------- state ---------- */
  const S = { N: NMAX, sel: null, focus: null, stop: null };
  /** Everything the page shows at the current minute, computed seat by seat. */
  function derive(t) {
    const N = S.N, A = arrivals(t, N), over = A - Math.min(A, CAP);
    const fill = RINGS.map(() => 0), hold = new Uint8Array(CAP);
    let dup = 0, locked = 0;
    for (let k = 1; k <= A; k++) {
      const g = SEAT[k];
      if (g < 0) continue;
      if (hold[g]) dup++; else { hold[g] = 1; fill[RING_OF[g]]++; locked++; }
    }
    return { t, N, A, seated: locked, over, yt: Math.ceil(over / 2), li: Math.floor(over / 2), dup, fill, hold, baskets: basketsAt(t),
      naive: naiveAt(t, N), live: t >= T0 - 1e-9 };
  }

  /* ---------- formatting and canvas text ---------- */
  const fmt = (n) => Math.round(n).toLocaleString('en-US');
  const MINUS = '−';
  const relLabel = (t) => { const m = Math.floor(t + 1e-9) - T0; return m < 0 ? `T${MINUS}${-m}` : m === 0 ? `T${MINUS}0` : `T+${m}`; };
  const face = (f) => (f === 'body' ? TRV.fonts.body : f === 'display' ? TRV.fonts.display : TRV.fonts.data);
  function text(ctx, str, x, y, color, o) {
    o = o || {};
    ctx.font = `${o.weight ? o.weight + ' ' : ''}${o.size || 11}px ${face(o.face)}`;
    ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.base || 'middle'; ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
    if (o.halo) { ctx.lineWidth = 3.5; ctx.lineJoin = 'round'; ctx.strokeStyle = P.stage; ctx.strokeText(str, x, y); }
    ctx.fillStyle = color; ctx.fillText(str, x, y); ctx.globalAlpha = 1;
    return ctx.measureText(str).width;
  }
  const width = (ctx, str, size, f, weight) => { ctx.font = `${weight ? weight + ' ' : ''}${size}px ${face(f)}`; return ctx.measureText(str).width; };
  function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); }

  /* ---------- geometry of the floor plan in a box ---------- */
  function geom(bx) {
    const wide = bx.w >= bx.h * 1.2;
    let lobby, arena;
    if (wide) {
      const lw = bx.w * 0.27, gap = bx.w * 0.03;
      lobby = { x: bx.x, y: bx.y, w: lw, h: bx.h }; arena = { x: bx.x + lw + gap, y: bx.y, w: bx.w - lw - gap, h: bx.h };
    } else {
      const ah = bx.h * 0.6, gap = bx.h * 0.04;
      arena = { x: bx.x, y: bx.y, w: bx.w, h: ah }; lobby = { x: bx.x, y: bx.y + ah + gap, w: bx.w, h: bx.h - ah - gap };
    }
    const foot = clamp(arena.h * 0.09, 14, 22), cx = arena.x + arena.w / 2, cy = arena.y + arena.h - foot;
    const pw = clamp(arena.w * 0.27, 78, 150), ph = clamp(arena.h * 0.15, 30, 44);
    const portal = { x: arena.x + arena.w - pw, y: arena.y, w: pw, h: ph };
    const reach = Math.hypot(portal.x - cx, Math.max(0, cy - (portal.y + ph)));
    const R = Math.max(30, Math.min(arena.w / 2 - 4, cy - arena.y - 2, reach - 8));
    const rIn = 0.34 * R, dr = (R - rIn) / RINGS.length, ringR = RINGS.map((_, r) => rIn + (r + 0.5) * dr);
    // the lobby: portrait (wide stage) or landscape (narrow stage)
    const tall = lobby.h > lobby.w * 1.05, stands = [];
    let desk, shop, door;
    if (tall) {
      const top = lobby.y + lobby.h * 0.2, bottom = lobby.y + lobby.h * 0.78, colX = [lobby.x + lobby.w * 0.24, lobby.x + lobby.w * 0.76];
      const step = (bottom - top) / 8;
      for (let i = 0; i < STANDS; i++) stands.push({ x: colX[i < 9 ? 0 : 1], y: top + (i % 9) * step });
      const rs = clamp(Math.min(step, colX[1] - colX[0]) * 0.33, 4.5, 13);
      stands.forEach((s) => { s.r = rs; });
      desk = { x: lobby.x + lobby.w * 0.5, y: lobby.y + lobby.h * 0.9, w: lobby.w * 0.46, h: 11, vertical: false };
      shop = { x: lobby.x + lobby.w * 0.5, y: lobby.y + lobby.h * 0.07, w: lobby.w * 0.46, h: 11, vertical: false };
      door = { x: lobby.x + 4, y: lobby.y + lobby.h };
    } else {
      const left = lobby.x + lobby.w * 0.2, right = lobby.x + lobby.w * 0.8, rowY = [lobby.y + lobby.h * 0.36, lobby.y + lobby.h * 0.76];
      const step = (right - left) / 8;
      for (let i = 0; i < STANDS; i++) stands.push({ x: left + (i % 9) * step, y: rowY[i < 9 ? 0 : 1] });
      const rs = clamp(Math.min(step, rowY[1] - rowY[0]) * 0.34, 4.5, 13);
      stands.forEach((s) => { s.r = rs; });
      desk = { x: lobby.x + lobby.w * 0.07, y: lobby.y + lobby.h * 0.58, w: 10, h: lobby.h * 0.5, vertical: true };
      shop = { x: lobby.x + lobby.w * 0.93, y: lobby.y + lobby.h * 0.58, w: 10, h: lobby.h * 0.5, vertical: true };
      door = { x: lobby.x, y: lobby.y + lobby.h * 0.58 };
    }
    return { wide, tall, lobby, arena, cx, cy, R, rIn, dr, ringR, foot, portal, stands, desk, shop, door };
  }
  const seatXY = (G, g, rr) => { const r = rr == null ? G.ringR[RING_OF[g]] : rr, th = THETA[g]; return [G.cx + r * Math.cos(th), G.cy - r * Math.sin(th)]; };
  /** Where guest k stands at minute t, or null when they are not walking: door → desk → seat or stream exit. */
  function guestAt(G, k, t, N) {
    const tau = (T0 * k) / N, p = (t - tau) / WALK;
    if (p < 0 || p >= 1) return null;
    const desk = [G.desk.x, G.desk.y], door = [G.door.x, G.door.y], g = SEAT[k];
    const goal = g >= 0 ? seatXY(G, g) : [G.portal.x + G.portal.w * 0.5, G.portal.y + G.portal.h * 0.5];
    if (p < 0.35) { const u = p / 0.35; return { x: door[0] + (desk[0] - door[0]) * u, y: door[1] + (desk[1] - door[1]) * u, seat: g >= 0 }; }
    const u = (p - 0.35) / 0.65, c = g >= 0 ? [G.cx - G.R * 0.6, G.cy + 4] : [G.portal.x, desk[1]];
    const a = (1 - u) * (1 - u), b = 2 * u * (1 - u), d = u * u;
    return { x: a * desk[0] + b * c[0] + d * goal[0], y: a * desk[1] + b * c[1] + d * goal[1], seat: g >= 0 };
  }

  /* ---------- the stage ---------- */
  let geo = null;
  function drawArena(ctx, G, D, thumb) {
    const { cx, cy, R, rIn, dr } = G, dim = S.focus === 'baskets' ? 0.35 : 1, k = thumb ? 1.7 : 1;
    // spotlight on the podium once the keynote is live
    if (D.live) {
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.05);
      glow.addColorStop(0, TRV.alpha(P.sigma, 0.2)); glow.addColorStop(0.45, TRV.alpha(P.sigma, 0.06)); glow.addColorStop(1, TRV.alpha(P.sigma, 0));
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(cx, cy, R * 1.05, Math.PI, 0); ctx.closePath(); ctx.fill();
    }
    // ring floors
    ctx.globalAlpha = 0.5 * dim; ctx.strokeStyle = P.panelEdge; ctx.lineWidth = 1;
    for (let r = -1; r < RINGS.length; r++) { ctx.beginPath(); ctx.arc(cx, cy, rIn + (r + 1) * dr, -A1 * DEG, -A0 * DEG); ctx.stroke(); }
    ctx.globalAlpha = 1;
    // seats: one radial tick each, cyan when locked
    const open = [], held = [];
    for (let g = 0; g < CAP; g++) (D.hold[g] ? held : open).push(g);
    const tick = (list, color, alpha) => {
      if (!list.length) return;
      ctx.strokeStyle = color; ctx.globalAlpha = alpha * dim; ctx.lineCap = 'butt';
      for (let r = 0; r < RINGS.length; r++) {
        const rr = G.ringR[r], spacing = (rr * SECT * DEG) / (RINGS[r] / 4);
        ctx.lineWidth = clamp(spacing * 0.62, 0.8, 3.4) * (thumb ? 1.25 : 1);
        ctx.beginPath();
        for (const g of list) {
          if (RING_OF[g] !== r) continue;
          const th = THETA[g], c = Math.cos(th), s = Math.sin(th), h = Math.min(dr * 0.46, dr * 0.34 * k);
          ctx.moveTo(cx + (rr - h) * c, cy - (rr - h) * s); ctx.lineTo(cx + (rr + h) * c, cy - (rr + h) * s);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    tick(open, P.faint, 0.9);
    if (held.length) { ctx.shadowColor = P.cyan; ctx.shadowBlur = thumb ? 6 : 3; tick(held, P.cyan, 0.95); ctx.shadowBlur = 0; }
    // the selected ring
    if (S.sel && S.sel.ring != null) {
      const rr = G.ringR[S.sel.ring];
      ctx.strokeStyle = P.amber; ctx.lineWidth = 1.6; ctx.shadowColor = P.amber; ctx.shadowBlur = 8;
      for (const e of [-0.5, 0.5]) { ctx.beginPath(); ctx.arc(cx, cy, rr + e * dr, -A1 * DEG, -A0 * DEG); ctx.stroke(); }
      ctx.shadowBlur = 0;
    }
    // podium
    const pr = rIn * 0.62;
    ctx.fillStyle = TRV.alpha(P.sigma, D.live ? 0.22 : 0.08); ctx.strokeStyle = D.live ? P.sigma : P.lineHot; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(cx, cy, pr, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = P.lineHot; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx - R - 2, cy + 0.5); ctx.lineTo(cx + R + 2, cy + 0.5); ctx.stroke();
    // the stream exit
    const pt = G.portal, on = D.over > 0;
    roundRect(ctx, pt.x + 0.5, pt.y + 0.5, pt.w - 1, pt.h - 1, 4);
    ctx.fillStyle = TRV.alpha(P.violet, on ? 0.16 : 0.05); ctx.fill();
    ctx.strokeStyle = on ? P.violet : P.faint; ctx.lineWidth = on ? 1.6 : 1; if (on) { ctx.shadowColor = P.violet; ctx.shadowBlur = 8; } ctx.stroke(); ctx.shadowBlur = 0;
    if (thumb) return;
    const fs = clamp(R / 18, 9, 12);
    // labels: podium, rings, stream exit, the lock counter
    const pod = L('主讲台', 'KEYNOTE');
    if (width(ctx, pod, fs - 1, 'display', 600) < pr * 1.7) text(ctx, pod, cx, cy - pr * 0.42, D.live ? P.ink : P.dim, { align: 'center', size: fs - 1, face: 'display', weight: 600 });
    if (D.live && pr > 26) text(ctx, L('直播中', 'LIVE'), cx, cy - pr * 0.42 - fs - 1, P.sigma, { align: 'center', size: fs - 2, face: 'display', weight: 600 });
    const rs = Math.min(fs - 1, dr * 0.9);
    if (rs >= 7.5) for (let r = 0; r < RINGS.length; r++) {
      const x = cx - G.ringR[r], full = D.fill[r] === RINGS[r];
      text(ctx, String(r + 1), x, cy + G.foot * 0.5, full ? P.cyan : P.dim, { align: 'center', size: rs, weight: full ? 600 : 0 });
    }
    const lh = Math.min(fs - 0.5, pt.h * 0.36);
    text(ctx, L('直播分流', 'LIVE STREAM'), pt.x + pt.w / 2, pt.y + pt.h * 0.32, on ? P.violet : P.dim, { align: 'center', size: lh, face: 'display', weight: 600 });
    text(ctx, `YT ${D.yt} · LI ${D.li}`, pt.x + pt.w / 2, pt.y + pt.h * 0.72, on ? P.ink : P.dim, { align: 'center', size: lh - 0.5 });
    const counter = L(`席位锁 ${fmt(D.seated)}/${fmt(CAP)} · 重座 ${D.dup}`, `LOCKS ${fmt(D.seated)}/${fmt(CAP)} · DUP ${D.dup}`);
    const right = G.arena.x + G.arena.w, minX = cx - G.rIn * 0.2;
    let cs = clamp(fs - 1, 8.5, 11);
    while (cs > 7.5 && width(ctx, counter, cs) > right - minX) cs -= 0.5;
    text(ctx, counter, right, cy + G.foot * 0.5, P.ink, { align: 'right', size: cs, halo: true });
  }
  function drawLobby(ctx, G, D, thumb) {
    const { lobby, desk, shop, stands } = G, fs = clamp(Math.min(lobby.w, lobby.h * 1.6) / 22, 8.5, 11.5), focus = S.focus === 'baskets';
    // the promenade floor
    ctx.fillStyle = TRV.alpha(P.lineHot, 0.08); ctx.strokeStyle = TRV.alpha(P.lineHot, 0.5); ctx.lineWidth = 1;
    roundRect(ctx, lobby.x + 0.5, lobby.y + 0.5, lobby.w - 1, lobby.h - 1, 6); ctx.fill(); ctx.stroke();
    // desk and counter
    const bar = (b, color) => { ctx.fillStyle = TRV.alpha(color, 0.25); ctx.strokeStyle = color; ctx.lineWidth = 1.3; roundRect(ctx, b.x - b.w / 2, b.y - b.h / 2, b.w, b.h, 3); ctx.fill(); ctx.stroke(); };
    bar(desk, P.cyan); bar(shop, P.magenta);
    // baskets: placed (magenta), open (faint, or amber on the BASKET card), the selected stand (amber ring)
    const now = D.t;
    stands.forEach((s, i) => {
      const placed = BASKET_AT[i] <= now + 1e-9, sel = S.sel && S.sel.stand === i;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r * (thumb ? 1.15 : 1), 0, kit.TAU);
      if (placed) { ctx.fillStyle = P.magenta; ctx.globalAlpha = 0.9; ctx.shadowColor = P.magenta; ctx.shadowBlur = thumb ? 8 : 5; ctx.fill(); ctx.shadowBlur = 0; ctx.globalAlpha = 1; }
      else if (focus) { ctx.setLineDash([3, 2.5]); ctx.strokeStyle = P.amber; ctx.lineWidth = 1.5; ctx.stroke(); ctx.setLineDash([]); }
      else { ctx.strokeStyle = P.faint; ctx.lineWidth = 1.2; ctx.stroke(); }
      if (sel) { ctx.strokeStyle = P.amber; ctx.lineWidth = 2; ctx.shadowColor = P.amber; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(s.x, s.y, s.r + 3.5, 0, kit.TAU); ctx.stroke(); ctx.shadowBlur = 0; }
      if (!thumb && s.r >= 6.5) text(ctx, String(i + 1), s.x, s.y + 0.5, placed ? P.stage : focus ? P.amber : P.dim, { align: 'center', size: clamp(s.r * 0.95, 7, 11), weight: 600 });
    });
    // a basket on its way from the counter to its stand
    BASKET_AT.forEach((at, i) => {
      const u = (now - (at - BASKET_WALK)) / BASKET_WALK;
      if (u < 0 || u >= 1) return;
      const s = stands[i], e = TRV.smooth(u), x = shop.x + (s.x - shop.x) * e, y = shop.y + (s.y - shop.y) * e;
      ctx.strokeStyle = TRV.alpha(P.magenta, 0.45); ctx.lineWidth = 1.2; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(shop.x, shop.y); ctx.lineTo(x, y); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = P.magenta; ctx.shadowColor = P.magenta; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(x, y, Math.max(3.2, s.r * 0.55), 0, kit.TAU); ctx.fill(); ctx.shadowBlur = 0;
      if (focus && !thumb) text(ctx, `#${i + 1}`, x + Math.max(3.2, s.r * 0.55) + 4, y, P.magenta, { size: fs - 1, weight: 600, halo: true });
    });
    if (thumb) return;
    // words
    const lab = (str, b, color, align) => {
      if (b.vertical) text(ctx, str, align === 'left' ? lobby.x + 6 : lobby.x + lobby.w - 6, lobby.y + 9, color, { align, size: fs - 0.5, face: 'display', weight: 600 });
      else text(ctx, str, b.x, b.y + (b === desk ? -b.h / 2 - fs * 0.75 : b.h / 2 + fs * 0.8), color, { align: 'center', size: fs - 0.5, face: 'display', weight: 600 });
    };
    lab(L('Donna · 接待前台', 'DONNA · RECEPTION'), desk, P.cyan, 'left');
    lab(L('花店 · 小花', 'FLOWER TOWN · BLOSSOM'), shop, P.magenta, 'right');
  }
  function drawGuests(ctx, G, D) {
    const N = S.N, t = D.t, lo = Math.max(1, Math.ceil((N * (t - WALK)) / T0 - 1e-9)), hi = D.A;
    for (let k = lo; k <= hi; k++) {
      const p = guestAt(G, k, t, N); if (!p) continue;
      ctx.fillStyle = p.seat ? P.cyan : P.violet; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.arc(p.x, p.y, 2.1, 0, kit.TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function drawStage() {
    const g = kit.plot($('cv'), { x: [0, 1], y: [0, 1], pad: [0, 0, 0, 0] }), ctx = g.ctx, W = g.W, H = g.H;
    const D = derive(clock.t);
    if (TRV.thumbMode) {
      const glow = ctx.createRadialGradient(W * 0.62, H * 0.75, 0, W * 0.62, H * 0.75, W * 0.6);
      glow.addColorStop(0, TRV.alpha(P.cyan, 0.08)); glow.addColorStop(1, TRV.alpha(P.cyan, 0)); ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
      const G = geom({ x: W * 0.05, y: H * 0.08, w: W * 0.9, h: H * 0.84 });
      geo = G; drawLobby(ctx, G, D, true); drawArena(ctx, G, D, true);
      return;
    }
    const st = $('stage').getBoundingClientRect(), below = (el) => (el ? el.getBoundingClientRect().bottom - st.top : 0);
    TRV.hudFit();
    const top = Math.max(40, below($('hudBig').parentElement)) + 8, bottom = Math.max(16, $('legend').offsetHeight + 18);
    const G = geom({ x: 16, y: top, w: W - 32, h: Math.max(80, H - top - bottom) });
    geo = G;
    drawLobby(ctx, G, D, false); drawArena(ctx, G, D, false); drawGuests(ctx, G, D);
  }

  /* ---------- the strip ---------- */
  function plotSeats(cv) {
    const N = S.N, D = derive(clock.t), g = kit.plot(cv, { x: [0, TMAX], y: [0, 1360], pad: [40, 12, 10, 20] });
    g.axes({ yTicks: [[0, '0'], [500, '500'], [CAP, fmt(CAP)]], xTicks: [[0, `T${MINUS}75`], [T0, `T${MINUS}0`], [TMAX, 'T+25']] });
    const arr = [], sat = [];
    for (let t = 0; t <= TMAX; t += 0.5) { const a = arrivals(t, N); arr.push([t, a]); sat.push([t, Math.min(a, CAP)]); }
    g.poly([...arr, ...sat.slice().reverse()], P.violet, { alpha: 0.28 });
    g.hline(CAP, P.ink, { dash: [4, 3], alpha: 0.7 });
    g.line(arr, P.dim, { width: 1.3 }); g.line(sat, P.cyan, { width: 2 });
    g.vline(clock.t, P.amber, { alpha: 0.8 }); g.dot(clock.t, D.seated, P.cyan, 4, { glow: 8 });
    g.legend([[P.cyan, L('已入座（不超过 1,108）', 'seated (never above 1,108)')], [P.dim, L('已到场', 'arrived')], [P.violet, L('转入直播', 'routed to the stream')]], { bottom: true });
    $('pAMeta').textContent = `N = ${fmt(N)}`;
  }
  function plotDup(cv) {
    const N = S.N, ser = naiveSeries(N), top = Math.max(4, ser[T0] * 1.15), g = kit.plot(cv, { x: [0, TMAX], y: [-top * 0.04, top], pad: [40, 12, 10, 20] });
    g.axes({ yTicks: [[0, '0'], [Math.round(top / 2), String(Math.round(top / 2))]], xTicks: [[0, `T${MINUS}75`], [T0, `T${MINUS}0`], [TMAX, 'T+25']] });
    const race = []; for (let m = 0; m <= T0; m++) { race.push([m, ser[m]]); if (m < T0) race.push([m + 1, ser[m]]); }
    race.push([TMAX, ser[T0]]);
    g.line(race, P.dim, { width: 1.4, dash: [4, 3] });
    g.line([[0, 0], [TMAX, 0]], P.cyan, { width: 2.2 });
    g.vline(clock.t, P.amber, { alpha: 0.8 }); g.dot(clock.t, 0, P.cyan, 4, { glow: 8 });
    g.legend([[P.cyan, L('原子选座锁：恒为 0', 'atomic seat lock: always 0')], [P.dim, L('无锁竞态（反事实）', 'naive race (counterfactual)'), 'dash']], { right: false, dy: 2 });
    $('pBMeta').textContent = L(`原子锁 0 · 竞态 ${naiveAt(clock.t, N)}`, `lock 0 · race ${naiveAt(clock.t, N)}`);
  }
  function drawPlots() { if (TRV.still || TRV.figure) return; plotSeats($('plotA')); plotDup($('plotB')); }

  /* ---------- words: HUD, legend, readouts, pills ---------- */
  function drawText() {
    const D = derive(clock.t), focus = S.focus === 'baskets';
    const rel = relLabel(clock.t), mins = L('分钟', 'min');
    let big, sub;
    if (focus) {
      big = L(`花篮展台 · 已摆 ${D.baskets} / 18`, `Basket stands · ${D.baskets} / 18 placed`);
      sub = L(`${rel} ${mins} · ${18 - D.baskets} 座待领 · 小花核验每张贺卡`, `${rel} ${mins} · ${18 - D.baskets} open · Blossom checks every card`);
    } else {
      big = L(`剧场 · 已入座 ${fmt(D.seated)} / ${fmt(CAP)}`, `Arena · ${fmt(D.seated)} / ${fmt(CAP)} seated`);
      sub = D.live ? L(`${rel} · 16:00 SGT 已开场 · ${fmt(D.over)} 人转直播 · 重座 ${D.dup}`, `${rel} · 16:00 SGT, keynote live · ${fmt(D.over)} to the stream · ${D.dup} duplicate seats`)
        : L(`${rel} ${mins} · 已到场 ${fmt(D.A)} · 重座 ${D.dup}`, `${rel} ${mins} · ${fmt(D.A)} arrived · ${D.dup} duplicate seats`);
    }
    $('hudBig').textContent = big; $('hudSub').textContent = sub;
    const items = focus ? [['mg', '已摆花篮', 'basket placed'], ['am', '待领展台', 'open stand'], ['cy', '已锁定席位', 'locked seat']]
      : [['cy', '已锁定席位', 'locked seat'], ['vi', '转入直播', 'routed to the stream'], ['mg', '已摆花篮', 'basket placed']].concat(S.sel ? [['am', '当前选中', 'current selection']] : []);
    const leg = items.map(([cl, zh, en]) => `<span><i class="sw ${cl}"></i>${L(zh, en)}</span>`).join('');
    if ($('legend')._h !== leg) { $('legend').innerHTML = leg; $('legend')._h = leg; }
    $('roSeated').innerHTML = `<span class="c-cy">${fmt(D.seated)}</span> / ${fmt(CAP)}`;
    $('roSeatedSub').innerHTML = `${RINGS.join(' + ')} = ${fmt(CAP)} <span class="nummark">${CAP === 1108 ? '✓' : '✗'}</span>`;
    $('roArrived').textContent = `${fmt(D.A)} / ${fmt(S.N)}`;
    $('roStream').innerHTML = `${fmt(D.over)} <small>YouTube ${D.yt} · LinkedIn ${D.li}</small>`;
    $('roDup').innerHTML = `${D.dup} <span class="nummark">${D.dup === 0 ? L('✓ 没有席位编号重复', '✓ no seat number repeats') : '✗'}</span> <small class="nobr">${L(`无锁竞态：${D.naive}`, `naive race: ${D.naive}`)}</small>`;
    $('roBaskets').textContent = `${D.baskets} / 18`;
    let sel = '—';
    if (S.sel && S.sel.ring != null) { const r = S.sel.ring; sel = L(`第 ${r + 1} 圈 · ${D.fill[r]} / ${RINGS[r]}`, `Ring ${r + 1} · ${D.fill[r]} / ${RINGS[r]}`); }
    else if (S.sel && S.sel.stand != null) {
      const i = S.sel.stand, at = BASKET_AT[i], when = relLabel(at);
      sel = at <= clock.t + 1e-9 ? L(`展台 ${i + 1} · 已摆（${when}）`, `Stand ${i + 1} · placed at ${when}`) : L(`展台 ${i + 1} · 待领（模型 ${when}）`, `Stand ${i + 1} · open (model: ${when})`);
    }
    $('roSel').textContent = sel;
    $('roNote').textContent = D.over > 0
      ? L(`席位已满：第 1,109 位起不再发席位锁，奇数号转 YouTube、偶数号转 LinkedIn Live。`, `The house is full: from guest 1,109 on no seat lock is issued; odd overflow numbers go to YouTube, even ones to LinkedIn Live.`)
      : L('锁一次只发给一个人：内圈坐满之后才轮到外圈。', 'The lock is granted to one guest at a time: an outer ring starts only when the inner rings are full.');
    $('pillLoad').querySelector('strong').textContent = fmt(S.N);
    $('pillSeated').querySelector('strong').textContent = `${fmt(D.seated)} / ${fmt(CAP)}`;
    $('pillDup').querySelector('strong').textContent = String(D.dup);
    if (document.activeElement !== $('load')) $('load').value = String(S.N);
    $('oLoad').textContent = fmt(S.N);
  }

  const paint = kit.painter(() => { drawText(); drawStage(); drawPlots(); }, [$('stage'), $('plotA'), $('plotB')]);

  /* ---------- the rail ---------- */
  const clock = kit.clock({
    range: $('now'), play: $('play'), label: $('tau'), speeds: $('speedChips'), max: TMAX, rate: 10, step: 5,
    // (the label is first drawn while the clock is being built: it reads t only)
    format: (t) => `${relLabel(t)} ${L('分钟', 'min')} <small>T${MINUS}0 = 16:00 SGT</small>`,
    onChange: (t, C) => {
      if (!C.playing) S.stop = null;
      else if (S.stop != null && C.t >= S.stop - 1e-9) { const s = S.stop; S.stop = null; C.pause(); C.set(s); }
      paint();
    }
  });
  $('rew').addEventListener('click', () => { clock.pause(); clock.set(0); });

  /* ---------- controls ---------- */
  const leave = () => cards.mark(null);
  const setLoad = (n) => { S.N = clamp(Math.round(Number(n)) || 1, 1, NMAX); paint(); };
  $('load').addEventListener('input', (ev) => { leave(); setLoad(ev.target.value); });
  $('loadCap').addEventListener('click', () => { leave(); setLoad(CAP); });
  $('loadMax').addEventListener('click', () => { leave(); setLoad(NMAX); });
  /** What a pointer at (x, y) on the stage canvas points at: { ring } or { stand } or null. */
  function hit(x, y) {
    const G = geo; if (!G) return null;
    let best = null, bd = Infinity;
    G.stands.forEach((s, i) => { const d = Math.hypot(x - s.x, y - s.y); if (d <= s.r + 5 && d < bd) { bd = d; best = { stand: i }; } });
    if (best) return best;
    const d = Math.hypot(x - G.cx, y - G.cy), th = Math.atan2(G.cy - y, x - G.cx) / DEG;
    if (d >= G.rIn && d <= G.R && th >= A0 - 3 && th <= A1 + 3) return { ring: clamp(Math.floor((d - G.rIn) / G.dr), 0, RINGS.length - 1) };
    return null;
  }
  $('cv').addEventListener('click', (ev) => {
    const b = $('cv').getBoundingClientRect(), h = hit(ev.clientX - b.left, ev.clientY - b.top);
    if (!h && !S.sel) return;
    leave();
    S.sel = h && !(S.sel && S.sel.ring === h.ring && S.sel.stand === h.stand) ? h : null;
    paint();
  });

  /* ---------- experiment cards ---------- */
  // a card that plays declares its still: the frame of the figure a chapter cites (and of PDF / EPUB)
  const PRESETS = {
    lobby: { N: NMAX, at: 0, still: 0 },
    booking: { N: 743, at: 42, play: true, from: 0, stop: 42, still: 42 },
    overflow: { N: NMAX, at: TMAX, play: true, from: 0, still: TMAX },
    basket: { N: NMAX, at: 60, play: true, from: 40, stop: 60, still: 60, focus: 'baskets' },
    checkin: { N: CAP, at: T0, still: T0 }
  };
  const NOTES = {
    lobby: ['开门之前（T−75）：右侧 6 圈共 1,108 个席位全部空着；左侧 Donna 守着接待前台，18 座编号花篮展台沿长廊排开，花店在长廊尽头。拖动时间轴或按 ▶，让来宾入场。', 'Before the doors open (T−75): all 1,108 seats in the six rings on the right are open; on the left Donna keeps the reception desk, the 18 numbered basket stands line the promenade, and Flower Town sits at its end. Drag the rail or press ▶ to let the guests in.'],
    booking: ['第一波 743 位来宾在 75 分钟里匀速到场。到第 42 分钟（T−33）已到 416 人：选座锁逐个发放、先坐满最内圈，于是第 1–3 圈的 96 + 144 + 176 = 416 席恰好坐满，第 4 圈还空着；没有一个席位编号重复。', 'A first wave of 743 guests arrives evenly over 75 minutes. By minute 42 (T−33), 416 have arrived: the seat lock serves them one at a time and fills the innermost ring first, so the 96 + 144 + 176 = 416 seats of rings 1–3 are exactly full and ring 4 is still empty; no seat number repeats.'],
    overflow: ['1,250 位来宾到场，比席位多 142 人。前 1,108 人各锁一席，坐满 6 圈；从第 1,109 位起不再发席位锁，奇数号转 YouTube、偶数号转 LinkedIn Live，各 71 人。重座仍是 0。', '1,250 guests arrive, 142 more than there are seats. The first 1,108 each lock one seat and fill the six rings; from guest 1,109 on no seat lock is issued, and odd overflow numbers go to YouTube, even ones to LinkedIn Live, 71 each. Duplicate seats: still 0.'],
    basket: ['长廊上的 18 座编号展台：到第 60 分钟（T−15）已有 12 座摆上花篮，6 座待领（琥珀色虚线）。第 13 只花篮正从花店柜台出发，经小花核验贺卡后送往自己的展台。', 'The 18 numbered stands of the promenade: by minute 60 (T−15) twelve hold a basket and six are open (dashed amber). Basket 13 is leaving the Flower Town counter for its stand, its greeting card checked by Blossom.'],
    checkin: ['T−0，16:00 SGT：1,108 位来宾恰好坐满 1,108 席，18 座展台全部摆上花篮，舞台灯打在主讲台上。', 'T−0, 16:00 SGT: 1,108 guests fill the 1,108 seats exactly, all 18 stands hold their baskets, and the spotlight is on the keynote podium.']
  };
  // a cited figure keeps one sentence next to ◀ ▶; the full lab keeps the longer notes above
  const FIGURE_NOTES = {
    lobby: ['开门前：6 圈 1,108 席全空，18 座展台待用。', 'Before doors: 1,108 seats in six rings and 18 stands, all open.'],
    booking: ['第 42 分钟：416 人坐满内三圈，重座 0。', 'Minute 42: 416 guests fill rings 1–3; zero duplicate seats.'],
    overflow: ['1,250 人到场：1,108 席坐满，142 人转直播，重座 0。', '1,250 arrive: 1,108 seated, 142 to the stream, zero duplicates.'],
    basket: ['12 座展台已摆花篮，6 座待领。', '12 stands hold baskets; 6 are open.'],
    checkin: ['T−0：1,108 席与 18 座展台全部就位。', 'T−0: all 1,108 seats and all 18 stands are filled.']
  };
  let booting = true;
  function applyPreset(id) {
    const p = PRESETS[id];
    S.N = p.N; S.sel = null; S.focus = p.focus || null;
    clock.pause(); clock.set(p.at);
    if (TRV.still && p.still != null) clock.set(p.still === 'end' ? clock.max : p.still);
    // a still (cover, cited figure for PDF/EPUB) and the opening view of the full page show the telling frame;
    // inside a chapter the card plays once the reader has scrolled it into view; a click plays at once
    if (!p.play || TRV.still || (booting && !TRV.embed)) { paint(); return; }
    clock.set(p.from || 0); S.stop = p.stop == null ? null : p.stop;
    if (booting) kit.autoplay(clock, $('stage')); else clock.play();
  }
  const cards = kit.cards($('presets'), { presets: PRESETS, notes: TRV.figure ? FIGURE_NOTES : NOTES, noteEl: $('presetNote'), tour: $('tour'), onPick: applyPreset,
    idle: ['自由探索：拖动到场人数与时间轴，点一圈席位或一座展台。随时可以再选一张卡。', 'Free play: drag the load and the rail, click a ring or a stand. Pick a card again at any time.'] });

  TRV.drawer({ drawer: $('drawer'), open: $('infoBtn'), close: $('drawerClose') });
  TRV.startGlitch(document.querySelector('.brand'));

  /* ---------- probe for the browser suite, cover, start ---------- */
  const at = (x, y) => { const b = $('cv').getBoundingClientRect(); return { x: b.left + x, y: b.top + y }; };
  window.LAUNCH_ARENA_DEBUG = {
    get state() {
      const D = derive(clock.t);
      return { t: clock.t, max: clock.max, playing: clock.playing, preset: cards.current, N: S.N, cap: CAP, rings: RINGS.slice(), arrivals: D.A, seated: D.seated,
        overflow: D.over, youtube: D.yt, linkedin: D.li, duplicates: D.dup, naive: D.naive, fill: D.fill.slice(), baskets: D.baskets, live: D.live,
        focus: S.focus, sel: S.sel ? { ...S.sel } : null, stop: S.stop };
    },
    /** The seat (global id 0 … 1,107, or −1 for the stream) of guests 1 … n under the atomic lock. */
    seats: (n) => Array.from(SEAT.subarray(1, Math.min(NMAX, n) + 1)),
    /** The ring of each global seat id and its angle in degrees. */
    layout: () => ({ ring: Array.from(RING_OF), theta: Array.from(THETA, (x) => x / DEG) }),
    naive: (n) => Array.from(naiveSeries(clamp(Math.round(n), 1, NMAX))),
    basketAt: () => BASKET_AT.slice(),
    set: (n) => setLoad(n), seek: (t) => { clock.pause(); clock.set(t); },
    point: {
      ring: (r) => (geo ? at(geo.cx + geo.ringR[r] * Math.cos(70 * DEG), geo.cy - geo.ringR[r] * Math.sin(70 * DEG)) : null),
      stand: (i) => (geo ? at(geo.stands[i].x, geo.stands[i].y) : null),
      empty: () => (geo ? at(geo.arena.x + 4, geo.arena.y + 4) : null)
    }
  };
  /** Cover: the full house of 1,250 guests during the keynote, every basket placed. */
  window.TRV_THUMB = () => { S.N = NMAX; S.sel = null; S.focus = null; clock.pause(); clock.set(TMAX); paint.now(); };
  cards.pick(cards.initial('lobby'));   // a chapter may cite another card: ::: {.viz src="launch-arena" preset="booking"}
  booting = false;
  paint();
})();
