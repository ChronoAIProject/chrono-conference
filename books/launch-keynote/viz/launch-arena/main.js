/* LAUNCH//ARENA · 发布会会场: the Street Corner lobby inside the four glass stands of the virtual stadium, on one floor plan.
     stands   North 248 + South 248 + East 306 + West 306 = 1,108 seats. Every stand has eight tiered rows split by a
              centre aisle; the row totals over the four stands, front (1) to back (8), are 144, 144, 144, 140, 136, 136,
              132, 132. Seats per row follow the seat catalog of the chronoai-lobby space (v40); seat codes are written
              the catalog's way, stand letter + row + seat (N1-17, E1-20, W8-01). Along each row the page numbers the
              seats clockwise. Plan positions follow the rounded-square curve of the venue build
              (chrono-metaverse scenes/tide-arena/build.py: RX 8.35, RZ 10.75, scale 2, rows 0.41 apart).
     lobby    inside the bowl, schematic and not to scale: the keynote LED screen, Donna's reception desk, Blossom's
              Flower Town counter and the world-map wall with 2 rows × 9 basket mats (basket-01 … basket-18)
     stream   the exit to the synchronized YouTube / LinkedIn Live stream for guests beyond the 1,108 seats
   The rail is minutes from T−75 to T+25 (T−0 = 16:00 SGT on 17 December). Model: guest k of N arrives at minute 75·k/N,
   so ⌊N·t/75⌋ have arrived by minute t. The atomic seat lock serves guests one at a time in order of arrival: the
   front-most row with a free seat (over all four stands), then a forward probe from the guest's hash position in that
   row to the first free seat. Guest k's seat therefore depends on k alone. From guest 1,109 on there is no seat lock:
   odd overflow numbers go to YouTube, even ones to LinkedIn Live. The naive race of the small plot is a counterfactual:
   each minute's arrivals read the free seats as they stood at the start of the minute and take one without a lock.
   Baskets: mat i gets its basket at minute 5·i (i ≤ 12) or 60 + 2·(i − 12) (i > 12), after a 2.5-minute trip from the
   Flower Town counter.
   Colours: cyan = a locked seat, violet = a guest routed to the stream, magenta = a basket, amber = the current selection
   (and, on the BASKET card, the open mats). Read-only probe for the browser suite: LAUNCH_ARENA_DEBUG. */
(() => {
  'use strict';
  const { kit, L } = TRV, { clamp } = kit, P = TRV.palette;
  const $ = (id) => document.getElementById(id);

  /* ---------- the venue: four stands × eight tiered rows ---------- */
  // seats per row, front (row 1) to back (row 8); `side` is the stand's axis in quarter turns from east (y points south)
  const STANDS = [
    { id: 'N', zh: '北', en: 'North', side: 3, rows: [32, 32, 32, 32, 30, 30, 30, 30] },
    { id: 'S', zh: '南', en: 'South', side: 1, rows: [32, 32, 32, 32, 30, 30, 30, 30] },
    { id: 'E', zh: '东', en: 'East', side: 0, rows: [40, 40, 40, 38, 38, 38, 36, 36] },
    { id: 'W', zh: '西', en: 'West', side: 2, rows: [40, 40, 40, 38, 38, 38, 36, 36] }
  ];
  const NROW = 8;
  const ROWS = Array.from({ length: NROW }, (_, r) => STANDS.reduce((a, s) => a + s.rows[r], 0));   // 144, 144, 144, 140, 136, 136, 132, 132
  const CAP = ROWS.reduce((a, b) => a + b, 0);                                                    // 1,108
  const START = ROWS.map((_, r) => ROWS.slice(0, r).reduce((a, b) => a + b, 0));                  // first global seat id of each row
  const STAND_CAP = STANDS.map((s) => s.rows.reduce((a, b) => a + b, 0));                          // 248, 248, 306, 306
  const NMAX = 1250, T0 = 75, TMAX = 100, WALK = 2.5, MATS = 18;
  const BASKET_AT = Array.from({ length: MATS }, (_, i) => (i < 12 ? 5 * (i + 1) : 60 + 2 * (i - 11)));
  const BASKET_WALK = 2.5;
  const DEG = Math.PI / 180;

  /* ---------- plan positions: the rounded-square curve of the venue build (x east, y south, metres of the build) ---------- */
  const RX = 8.35, RZ = 10.75, SCALE = 2, HALF = 0.665, AISLE = 0.048, END = 0.39;
  function curve(t, r) {
    const c = Math.cos(t), s = Math.sin(t), n = (Math.abs(c) ** 3 + Math.abs(s) ** 3) ** (-1 / 3);
    return [SCALE * (RX + r) * c * n, SCALE * (RZ + r) * s * n];
  }
  const axisOf = (si) => (STANDS[si].side * Math.PI) / 2;
  const seatR = (r) => 0.24 + 0.41 * r + 0.16;     // radial offset of the seats of row r (0-based)
  const ROW_OF = new Int8Array(CAP), STAND_OF = new Int8Array(CAP), NUM_OF = new Uint8Array(CAP);
  const PX = new Float64Array(CAP), PY = new Float64Array(CAP), CODE = new Array(CAP);
  const SEGMENT = STANDS.map(() => new Int16Array(NROW));   // first global seat id of stand s in row r
  for (let r = 0; r < NROW; r++) {
    let g = START[r];
    STANDS.forEach((st, si) => {
      const axis = axisOf(si), arc = HALF - 0.023 - (0.16 * r) / (NROW - 1), rad = seatR(r), m = st.rows[r] / 2;
      SEGMENT[si][r] = g;
      let num = 0;
      for (const [lo, hi] of [[axis - arc, axis - AISLE], [axis + AISLE, axis + arc]]) {
        // half a row: seats evenly spaced by arc length, 0.39 m kept free at both ends
        const K = 64, ts = [], len = [0];
        for (let i = 0; i <= K; i++) ts.push(lo + ((hi - lo) * i) / K);
        for (let i = 1; i <= K; i++) { const a = curve(ts[i - 1], rad), b = curve(ts[i], rad); len.push(len[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
        const total = len[K];
        for (let j = 0; j < m; j++) {
          const want = END + ((total - 2 * END) * j) / (m - 1);
          let i = 1;
          while (i < K && len[i] < want) i++;
          const u = (want - len[i - 1]) / (len[i] - len[i - 1] || 1), [x, y] = curve(ts[i - 1] + (ts[i] - ts[i - 1]) * u, rad);
          num++;
          ROW_OF[g] = r; STAND_OF[g] = si; NUM_OF[g] = num; PX[g] = x; PY[g] = y;
          CODE[g] = `${st.id}${r + 1}-${String(num).padStart(2, '0')}`;
          g++;
        }
      }
    });
  }
  const BY_CODE = new Map(CODE.map((c, g) => [c, g]));
  const EXT = { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity };
  for (let g = 0; g < CAP; g++) { EXT.x0 = Math.min(EXT.x0, PX[g]); EXT.x1 = Math.max(EXT.x1, PX[g]); EXT.y0 = Math.min(EXT.y0, PY[g]); EXT.y1 = Math.max(EXT.y1, PY[g]); }
  // the lobby inside the bowl, schematic (relative positions only)
  const LOBBY = {
    screen: { x: 0, y: -14.5, w: 15, h: 1.1 },     // keynote LED screen
    wall: { x: 0, y: 16.4, w: 21, h: 1.0 },        // world-map wall
    desk: { x: -8.5, y: 1, w: 1.4, h: 6.5 },       // Donna's reception desk
    shop: { x: 9.5, y: 4.5, w: 1.4, h: 5.5 }       // Flower Town counter
  };
  const MAT = Array.from({ length: MATS }, (_, i) => ({ x: -8.8 + 2.2 * (i % 9), y: i < 9 ? 14.3 : 12.0 }));
  const MAT_SIZE = 1.3;
  const DOOR = curve(0.75 * Math.PI, 5), EXIT = curve(-0.25 * Math.PI, 1.2);   // the south-west and north-east corner gaps
  const BRIDGE = STANDS.map((_, si) => curve(axisOf(si), -1.6));               // where each stand meets the lobby floor

  /* ---------- the atomic seat lock (guest k's seat does not depend on the load) ---------- */
  const hash = (k, r) => (Math.imul(k, 0x9E3779B1) ^ Math.imul(r + 1, 0x85EBCA6B)) >>> 0;
  const SEAT = new Int16Array(NMAX + 1).fill(-1);     // global seat id of guest k, −1: routed to the stream
  const OWNER = new Int16Array(CAP);                   // the guest who holds each seat
  {
    const taken = new Uint8Array(CAP), filled = ROWS.map(() => 0);
    let row = 0;
    for (let k = 1; k <= NMAX; k++) {
      while (row < NROW && filled[row] >= ROWS[row]) row++;
      if (row >= NROW) continue;
      const n = ROWS[row];
      let s = hash(k, row) % n;
      while (taken[START[row] + s]) s = (s + 1) % n;
      taken[START[row] + s] = 1; filled[row]++; SEAT[k] = START[row] + s; OWNER[START[row] + s] = k;
    }
  }
  const arrivals = (t, N) => Math.min(N, Math.floor((N * Math.min(Math.max(t, 0), T0)) / T0 + 1e-9));
  const basketsAt = (t) => BASKET_AT.filter((x) => x <= t + 1e-9).length;

  /* ---------- the naive race (counterfactual, for the small plot) ---------- */
  const naiveCache = new Map();
  /** Cumulative duplicate seats after each minute 0 … 75 when each minute's arrivals grab seats from a stale snapshot. */
  function naiveSeries(N) {
    if (naiveCache.has(N)) return naiveCache.get(N);
    const taken = new Uint8Array(CAP), free = ROWS.slice(), D = new Int32Array(T0 + 1);
    let dup = 0, k = 1;
    for (let m = 1; m <= T0; m++) {
      const hi = arrivals(m, N), picks = [];
      let row = 0;
      while (row < NROW && free[row] <= 0) row++;
      for (; k <= hi; k++) {
        if (row >= NROW) continue;
        const n = ROWS[row];
        let s = hash(k, row) % n;
        while (taken[START[row] + s]) s = (s + 1) % n;    // the snapshot: picks of this minute are not seen
        picks.push(START[row] + s);
      }
      const seen = new Set();
      for (const g of picks) { if (seen.has(g)) dup++; else seen.add(g); }
      for (const g of seen) { taken[g] = 1; free[ROW_OF[g]]--; }
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
    const fill = ROWS.map(() => 0), standFill = STANDS.map(() => 0), seg = STANDS.map(() => new Int16Array(NROW)), hold = new Uint8Array(CAP);
    let dup = 0, locked = 0, last = -1;
    for (let k = 1; k <= A; k++) {
      const g = SEAT[k];
      if (g < 0) continue;
      if (hold[g]) dup++;
      else { hold[g] = 1; fill[ROW_OF[g]]++; standFill[STAND_OF[g]]++; seg[STAND_OF[g]][ROW_OF[g]]++; locked++; last = k; }
    }
    return { t, N, A, seated: locked, over, yt: Math.ceil(over / 2), li: Math.floor(over / 2), dup, fill, standFill, seg, hold, last,
      baskets: basketsAt(t), naive: naiveAt(t, N), live: t >= T0 - 1e-9 };
  }

  /* ---------- formatting and canvas text ---------- */
  const fmt = (n) => Math.round(n).toLocaleString('en-US');
  const MINUS = '−';
  const relLabel = (t) => { const m = Math.floor(t + 1e-9) - T0; return m < 0 ? `T${MINUS}${-m}` : m === 0 ? `T${MINUS}0` : `T+${m}`; };
  const matCode = (i) => `basket-${String(i + 1).padStart(2, '0')}`;
  const standName = (si) => L(`${STANDS[si].zh}看台`, STANDS[si].en);
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
  const MARGIN = 3.4;   // metres of room for the stand labels around the outermost seats
  function geom(bx) {
    const bw = EXT.x1 - EXT.x0 + 2 * MARGIN, bh = EXT.y1 - EXT.y0 + 2 * MARGIN;
    const pw = clamp(bx.w * 0.17, 76, 140), ph = clamp(bx.h * 0.085, 28, 42);
    // the stream exit goes to the right of the plan when the stage is wide, above it when it is narrow
    const kRight = Math.min((bx.w - pw - 10) / bw, bx.h / bh), kTop = Math.min(bx.w / bw, (bx.h - ph - 8) / bh);
    const side = kRight >= kTop, k = Math.max(1, side ? kRight : kTop);
    // side by side, the plan and the exit are centred together, so the exit stays next to the plan on a wide stage
    const group = bw * k + 10 + pw;
    const area = side ? { x: bx.x + Math.max(0, (bx.w - group) / 2), y: bx.y, w: bw * k, h: bx.h } : { x: bx.x, y: bx.y + ph + 8, w: bx.w, h: bx.h - ph - 8 };
    const ox = area.x + (area.w - bw * k) / 2 - (EXT.x0 - MARGIN) * k, oy = area.y + (area.h - bh * k) / 2 - (EXT.y0 - MARGIN) * k;
    const at = (x, y) => [ox + x * k, oy + y * k];
    const plan = { x: ox + (EXT.x0 - MARGIN) * k, y: oy + (EXT.y0 - MARGIN) * k, w: bw * k, h: bh * k };
    const portal = side ? { x: area.x + area.w + 10, y: plan.y + 2, w: pw, h: ph } : { x: bx.x + bx.w - pw, y: bx.y, w: pw, h: ph };
    const sx = new Float64Array(CAP), sy = new Float64Array(CAP);
    for (let g = 0; g < CAP; g++) { sx[g] = ox + PX[g] * k; sy[g] = oy + PY[g] * k; }
    const box = (b) => ({ x: ox + (b.x - b.w / 2) * k, y: oy + (b.y - b.h / 2) * k, w: b.w * k, h: b.h * k, cx: ox + b.x * k, cy: oy + b.y * k });
    const mats = MAT.map((m) => { const [x, y] = at(m.x, m.y); return { x, y, s: Math.max(5, MAT_SIZE * k) }; });
    return { k, at, plan, portal, sx, sy, mats, screen: box(LOBBY.screen), wall: box(LOBBY.wall), desk: box(LOBBY.desk), shop: box(LOBBY.shop),
      door: at(DOOR[0], DOOR[1]), exit: at(EXIT[0], EXIT[1]), bridge: BRIDGE.map((b) => at(b[0], b[1])) };
  }
  /** Where guest k stands at minute t, or null when they are not walking: door → desk → their stand → seat, or → stream exit. */
  function guestAt(G, k, t, N) {
    const tau = (T0 * k) / N, p = (t - tau) / WALK;
    if (p < 0 || p >= 1) return null;
    const desk = [G.desk.cx, G.desk.cy], door = G.door, g = SEAT[k];
    if (p < 0.35) { const u = p / 0.35; return { x: door[0] + (desk[0] - door[0]) * u, y: door[1] + (desk[1] - door[1]) * u, seat: g >= 0 }; }
    const goal = g >= 0 ? [G.sx[g], G.sy[g]] : [G.portal.x + G.portal.w * 0.5, G.portal.y + G.portal.h * 0.5];
    const c = g >= 0 ? G.bridge[STAND_OF[g]] : G.exit;
    const u = (p - 0.35) / 0.65, a = (1 - u) * (1 - u), b = 2 * u * (1 - u), d = u * u;
    return { x: a * desk[0] + b * c[0] + d * goal[0], y: a * desk[1] + b * c[1] + d * goal[1], seat: g >= 0 };
  }

  /* ---------- the stage ---------- */
  let geo = null, hover = null;
  /** The glass tray of a stand: from just inside its front row to just behind its back row, over its whole arc. */
  function trayPath(ctx, G, si) {
    const axis = axisOf(si), n = 40;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) { const t = axis - HALF + (2 * HALF * i) / n, [x, y] = G.at(...curve(t, 0.05)); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    for (let i = n; i >= 0; i--) { const t = axis - HALF + 0.11 + ((2 * HALF - 0.22) * i) / n, [x, y] = G.at(...curve(t, seatR(NROW - 1) + 0.35)); ctx.lineTo(x, y); }
    ctx.closePath();
  }
  function drawLobby(ctx, G, D, thumb) {
    const focus = S.focus === 'baskets', k = G.k, fs = clamp(k * 1.75, 8, 11.5);
    // the lobby floor inside the bowl
    ctx.beginPath();
    for (let i = 0; i <= 96; i++) { const [x, y] = G.at(...curve((i / 96) * kit.TAU, -1.1)); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    ctx.closePath(); ctx.fillStyle = TRV.alpha(P.lineHot, 0.07); ctx.fill(); ctx.strokeStyle = TRV.alpha(P.lineHot, 0.45); ctx.lineWidth = 1; ctx.stroke();
    // Schematic wayfinding from the mat wall through each aisle. The rail drives the arrows.
    G.bridge.forEach(([endX, endY], si) => {
      const mat = G.mats[[4, 13, 8, 0][si]];
      const dx = endX - mat.x, dy = endY - mat.y;
      ctx.save();
      ctx.translate(mat.x, mat.y);
      ctx.rotate(Math.atan2(dy, dx));
      const distance = Math.hypot(dx, dy);
      ctx.strokeStyle = TRV.alpha(P.cyan, 0.32);
      ctx.setLineDash([2, 4]);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(distance, 0); ctx.stroke();
      ctx.setLineDash([]);
      ctx.translate(distance * (0.18 + 0.7 * ((D.t / 8 + si / 4) % 1)), 0);
      ctx.strokeStyle = P.cyan;
      ctx.beginPath(); ctx.moveTo(-4, -3); ctx.lineTo(0, 0); ctx.lineTo(-4, 3); ctx.stroke();
      ctx.restore();
    });
    // keynote screen: lit once the keynote is live
    const sc = G.screen;
    if (D.live) {
      const gr = sc.w * 0.9, glow = ctx.createRadialGradient(sc.cx, sc.cy, 0, sc.cx, sc.cy, gr);
      glow.addColorStop(0, TRV.alpha(P.sigma, 0.28)); glow.addColorStop(1, TRV.alpha(P.sigma, 0));
      ctx.fillStyle = glow; ctx.fillRect(sc.cx - gr, sc.cy - gr, 2 * gr, 2 * gr);
    }
    roundRect(ctx, sc.x, sc.y, sc.w, sc.h, 2); ctx.fillStyle = TRV.alpha(P.sigma, D.live ? 0.5 : 0.12); ctx.fill();
    ctx.strokeStyle = D.live ? P.sigma : P.lineHot; ctx.lineWidth = 1.2; ctx.stroke();
    // world-map wall, desk and counter
    const wl = G.wall;
    roundRect(ctx, wl.x, wl.y, wl.w, wl.h, 2); ctx.fillStyle = TRV.alpha(P.ink, 0.1); ctx.fill(); ctx.strokeStyle = P.panelEdge; ctx.lineWidth = 1; ctx.stroke();
    const bar = (b, color) => { ctx.fillStyle = TRV.alpha(color, 0.25); ctx.strokeStyle = color; ctx.lineWidth = 1.3; roundRect(ctx, b.x, b.y, b.w, b.h, 3); ctx.fill(); ctx.stroke(); };
    bar(G.desk, P.cyan); bar(G.shop, P.magenta);
    // basket mats: placed (magenta), open (faint, or dashed amber on the BASKET card), the selected mat (amber frame)
    const now = D.t;
    G.mats.forEach((m, i) => {
      const placed = BASKET_AT[i] <= now + 1e-9, sel = S.sel && S.sel.mat === i, s = m.s * (thumb ? 1.15 : 1);
      ctx.beginPath(); ctx.rect(m.x - s / 2, m.y - s / 2, s, s);
      if (placed) { ctx.fillStyle = P.magenta; ctx.globalAlpha = 0.9; ctx.shadowColor = P.magenta; ctx.shadowBlur = thumb ? 8 : 5; ctx.fill(); ctx.shadowBlur = 0; ctx.globalAlpha = 1; }
      else if (focus) { ctx.setLineDash([3, 2.5]); ctx.strokeStyle = P.amber; ctx.lineWidth = 1.5; ctx.stroke(); ctx.setLineDash([]); }
      else { ctx.strokeStyle = P.faint; ctx.lineWidth = 1.2; ctx.stroke(); }
      if (sel) { ctx.strokeStyle = P.amber; ctx.lineWidth = 2; ctx.shadowColor = P.amber; ctx.shadowBlur = 8; ctx.strokeRect(m.x - s / 2 - 3, m.y - s / 2 - 3, s + 6, s + 6); ctx.shadowBlur = 0; }
      if (!thumb && s >= 12) text(ctx, String(i + 1).padStart(2, '0'), m.x, m.y + 0.5, placed ? P.stage : focus ? P.amber : P.dim, { align: 'center', size: clamp(s * 0.55, 7, 10), weight: 600 });
    });
    // a basket on its way from the counter to its mat
    BASKET_AT.forEach((at, i) => {
      const u = (now - (at - BASKET_WALK)) / BASKET_WALK;
      if (u < 0 || u >= 1) return;
      const m = G.mats[i], e = TRV.smooth(u), x0 = G.shop.cx, y0 = G.shop.cy, x = x0 + (m.x - x0) * e, y = y0 + (m.y - y0) * e, r = Math.max(3.2, m.s * 0.4);
      ctx.strokeStyle = TRV.alpha(P.magenta, 0.45); ctx.lineWidth = 1.2; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = P.magenta; ctx.shadowColor = P.magenta; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(x, y, r, 0, kit.TAU); ctx.fill(); ctx.shadowBlur = 0;
      if (focus && !thumb) text(ctx, matCode(i), x + r + 4, y, P.magenta, { size: fs - 1, weight: 600, halo: true });
    });
    if (thumb) return;
    // words, kept inside the lobby floor
    const lim = G.at(-14.5, 0)[0], limR = G.at(14.5, 0)[0];
    const label = (str, x, y, color, size, o) => {
      let sz = size; while (sz > 7 && width(ctx, str, sz, 'display', 600) > limR - lim) sz -= 0.5;
      const w = width(ctx, str, sz, 'display', 600), cx = clamp(x, lim + w / 2, limR - w / 2);
      text(ctx, str, cx, y, color, { align: 'center', size: sz, face: 'display', weight: 600, halo: true, ...(o || {}) });
    };
    label(D.live ? L('主屏 · 直播中', 'KEYNOTE · LIVE') : L('主屏', 'KEYNOTE SCREEN'), sc.cx, sc.y + sc.h + fs * 0.9, D.live ? P.sigma : P.dim, fs - 1);
    label(L('Donna · 前台', 'DONNA · DESK'), G.desk.cx, G.desk.y - fs * 0.85, P.cyan, fs - 0.5);
    label(L('花店 · 小花', 'FLOWER TOWN'), G.shop.cx, G.shop.y - fs * 0.85, P.magenta, fs - 0.5);
    label(L('世界地图墙 · 2 × 9 花篮垫位', 'WORLD-MAP WALL · 2 × 9 MATS'), wl.cx, wl.cy, P.dim, fs - 1.5, { face: 'data', weight: 0 });
    // the lock counter, under the screen
    const counter = L(`席位锁 ${fmt(D.seated)}/${fmt(CAP)} · 重座 ${D.dup}`, `LOCKS ${fmt(D.seated)}/${fmt(CAP)} · DUP ${D.dup}`);
    let cs = clamp(fs, 8.5, 11.5);
    while (cs > 7.5 && width(ctx, counter, cs) > limR - lim) cs -= 0.5;
    text(ctx, counter, G.at(0, -9.2)[0], G.at(0, -9.2)[1], P.ink, { align: 'center', size: cs, halo: true });
  }
  function drawStands(ctx, G, D, thumb) {
    const dim = S.focus === 'baskets' ? 0.35 : 1, k = G.k;
    // glass trays
    for (let si = 0; si < STANDS.length; si++) {
      trayPath(ctx, G, si); ctx.fillStyle = TRV.alpha(P.cyan, 0.04 * dim + 0.02); ctx.fill();
      ctx.strokeStyle = TRV.alpha(P.lineHot, 0.6 * dim); ctx.lineWidth = 1; ctx.stroke();
    }
    // seats: one small square each, cyan when locked
    const s = clamp(k * 0.42, 1.3, 3.4) * (thumb ? 1.35 : 1), h = s / 2;
    ctx.globalAlpha = 0.87 * dim; ctx.fillStyle = P.dim; ctx.beginPath();
    for (let g = 0; g < CAP; g++) if (!D.hold[g]) ctx.rect(G.sx[g] - h, G.sy[g] - h, s, s);
    ctx.fill();
    ctx.globalAlpha = 0.95 * dim; ctx.fillStyle = P.cyan; ctx.shadowColor = P.cyan; ctx.shadowBlur = thumb ? 5 : 0; ctx.beginPath();
    for (let g = 0; g < CAP; g++) if (D.hold[g]) ctx.rect(G.sx[g] - h, G.sy[g] - h, s, s);
    ctx.fill(); ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    // the selected seat and its row of its stand
    const inspected = hover || S.sel;
    if (inspected && inspected.seat != null) {
      const g0 = inspected.seat, si = STAND_OF[g0], r = ROW_OF[g0], a = SEGMENT[si][r], n = STANDS[si].rows[r];
      ctx.strokeStyle = P.amber; ctx.lineWidth = 1.4; ctx.shadowColor = P.amber; ctx.shadowBlur = 6; ctx.lineCap = 'round';
      for (const [lo, hi] of [[a, a + n / 2 - 1], [a + n / 2, a + n - 1]]) {
        ctx.beginPath(); for (let g = lo; g <= hi; g++) { if (g === lo) ctx.moveTo(G.sx[g], G.sy[g]); else ctx.lineTo(G.sx[g], G.sy[g]); } ctx.stroke();
      }
      ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(G.sx[g0], G.sy[g0], s + 3.5, 0, kit.TAU); ctx.stroke(); ctx.shadowBlur = 0;
    }
    // the stream exit
    const pt = G.portal, on = D.over > 0;
    roundRect(ctx, pt.x + 0.5, pt.y + 0.5, pt.w - 1, pt.h - 1, 4);
    ctx.fillStyle = TRV.alpha(P.violet, on ? 0.16 : 0.05); ctx.fill();
    ctx.strokeStyle = on ? P.violet : P.faint; ctx.lineWidth = on ? 1.6 : 1; if (on) { ctx.shadowColor = P.violet; ctx.shadowBlur = 8; } ctx.stroke(); ctx.shadowBlur = 0;
    if (thumb) return;
    const fs = clamp(k * 1.75, 8, 11.5);
    // stand labels behind the back row: name and fill
    STANDS.forEach((st, si) => {
      const [x, y] = G.at(...curve(axisOf(si), seatR(NROW - 1) + 1.05)), full = D.standFill[si] === STAND_CAP[si];
      const str = `${L(`${st.zh} ${st.id}`, `${st.en} ${st.id}`)} · ${fmt(D.standFill[si])}/${fmt(STAND_CAP[si])}`;
      ctx.save(); ctx.translate(x, y); if (st.side === 0) ctx.rotate(Math.PI / 2); else if (st.side === 2) ctx.rotate(-Math.PI / 2);
      text(ctx, str, 0, 0, full ? P.cyan : P.dim, { align: 'center', size: fs - 1, weight: full ? 600 : 0, halo: true });
      ctx.restore();
    });
    // row numbers at the west end of the north stand, when the rows are far enough apart
    const dr = 0.82 * k;
    if (dr >= 7.5) for (let r = 0; r < NROW; r++) {
      const g = SEGMENT[0][r], [x, y] = [G.sx[g], G.sy[g]];
      text(ctx, String(r + 1), x - dr * 0.9, y, D.fill[r] === ROWS[r] ? P.cyan : P.dim, { align: 'center', size: Math.min(fs - 1.5, dr * 0.85) });
    }
    const lh = Math.min(fs - 0.5, pt.h * 0.36);
    text(ctx, L('直播分流', 'LIVE STREAM'), pt.x + pt.w / 2, pt.y + pt.h * 0.32, on ? P.violet : P.dim, { align: 'center', size: lh, face: 'display', weight: 600 });
    text(ctx, `YT ${D.yt} · LI ${D.li}`, pt.x + pt.w / 2, pt.y + pt.h * 0.72, on ? P.ink : P.dim, { align: 'center', size: lh - 0.5 });
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
      const glow = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, W * 0.6);
      glow.addColorStop(0, TRV.alpha(P.cyan, 0.08)); glow.addColorStop(1, TRV.alpha(P.cyan, 0)); ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
      const G = geom({ x: W * 0.05, y: H * 0.06, w: W * 0.9, h: H * 0.88 });
      geo = G; drawLobby(ctx, G, D, true); drawStands(ctx, G, D, true);
      return;
    }
    const st = $('stage').getBoundingClientRect(), below = (el) => (el ? el.getBoundingClientRect().bottom - st.top : 0);
    TRV.hudFit();
    const top = Math.max(40, below($('hudBig').parentElement)) + 8, bottom = Math.max(16, $('legend').offsetHeight + 18);
    const G = geom({ x: 16, y: top, w: W - 32, h: Math.max(80, H - top - bottom) });
    geo = G;
    drawLobby(ctx, G, D, false); drawStands(ctx, G, D, false); drawGuests(ctx, G, D);
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
      big = L(`花篮垫位 · 已摆 ${D.baskets} / 18`, `Basket mats · ${D.baskets} / 18 placed`);
      sub = L(`${rel} ${mins} · ${18 - D.baskets} 块待领 · 小花核验每张贺卡`, `${rel} ${mins} · ${18 - D.baskets} open · Blossom checks every card`);
    } else {
      big = L(`看台 · 已入座 ${fmt(D.seated)} / ${fmt(CAP)}`, `Stands · ${fmt(D.seated)} / ${fmt(CAP)} seated`);
      sub = D.live ? L(`${rel} · 16:00 SGT 已开场 · ${fmt(D.over)} 人转直播 · 重座 ${D.dup}`, `${rel} · 16:00 SGT, keynote live · ${fmt(D.over)} to the stream · ${D.dup} duplicate seats`)
        : L(`${rel} ${mins} · 已到场 ${fmt(D.A)} · 重座 ${D.dup}`, `${rel} ${mins} · ${fmt(D.A)} arrived · ${D.dup} duplicate seats`);
    }
    const inspected = hover || S.sel;
    if (inspected) {
      const g = inspected.seat;
      sub = g != null
        ? CODE[g] + ' · ' + (D.hold[g] ? L('已锁定', 'locked') : L('空位', 'open'))
        : matCode(inspected.mat) + ' · ' + (inspected.mat < D.baskets ? L('已摆', 'placed') : L('待领', 'open'));
    }
    $('hudBig').textContent = big; $('hudSub').textContent = sub;
    const items = focus ? [['mg', '已摆花篮', 'basket placed'], ['am', '待领垫位', 'open mat'], ['cy', '已锁定席位', 'locked seat']]
      : [['cy', '已锁定席位', 'locked seat'], ['vi', '转入直播', 'routed to the stream'], ['mg', '已摆花篮', 'basket placed']].concat(S.sel ? [['am', '当前选中', 'current selection']] : []);
    const leg = items.map(([cl, zh, en]) => `<span><i class="sw ${cl}"></i>${L(zh, en)}</span>`).join('');
    if ($('legend')._h !== leg) { $('legend').innerHTML = leg; $('legend')._h = leg; }
    $('roSeated').innerHTML = `<span class="c-cy">${fmt(D.seated)}</span> / ${fmt(CAP)}`;
    $('roSeatedSub').innerHTML = `${STAND_CAP.join(' + ')} = ${fmt(CAP)} <span class="nummark">${CAP === 1108 ? '✓' : '✗'}</span>`;
    $('roArrived').textContent = `${fmt(D.A)} / ${fmt(S.N)}`;
    $('roStream').innerHTML = `${fmt(D.over)} <small>YouTube ${D.yt} · LinkedIn ${D.li}</small>`;
    $('roDup').innerHTML = `${D.dup} <span class="nummark">${D.dup === 0 ? L('✓ 没有席位编号重复', '✓ no seat code repeats') : '✗'}</span> <small class="nobr">${L(`无锁竞态：${D.naive}`, `naive race: ${D.naive}`)}</small>`;
    $('roBaskets').textContent = `${D.baskets} / 18`;
    let sel = '—';
    if (S.sel && S.sel.seat != null) {
      const g = S.sel.seat, si = STAND_OF[g], r = ROW_OF[g], k = OWNER[g], held = D.hold[g] === 1, fill = D.seg[si][r], n = STANDS[si].rows[r];
      sel = held ? L(`${CODE[g]} · 第 ${fmt(k)} 位来宾 · ${standName(si)}第 ${r + 1} 排 ${fill} / ${n}`, `${CODE[g]} · guest #${fmt(k)} · ${standName(si)} row ${r + 1}: ${fill} / ${n}`)
        : L(`${CODE[g]} · 空位 · ${standName(si)}第 ${r + 1} 排 ${fill} / ${n}`, `${CODE[g]} · open · ${standName(si)} row ${r + 1}: ${fill} / ${n}`);
    } else if (S.sel && S.sel.mat != null) {
      const i = S.sel.mat, at = BASKET_AT[i], when = relLabel(at);
      sel = at <= clock.t + 1e-9 ? L(`${matCode(i)} · 已摆（${when}）`, `${matCode(i)} · placed at ${when}`) : L(`${matCode(i)} · 待领（模型 ${when}）`, `${matCode(i)} · open (model: ${when})`);
    }
    $('roSel').textContent = sel;
    const latest = D.last > 0 ? L(` 最近一次落锁：第 ${fmt(D.last)} 位来宾 → ${CODE[SEAT[D.last]]}。`, ` Latest lock: guest #${fmt(D.last)} → ${CODE[SEAT[D.last]]}.`) : '';
    $('roNote').textContent = D.over > 0
      ? L(`席位已满：第 1,109 位起不再发席位锁，奇数号转 YouTube、偶数号转 LinkedIn Live。`, `The house is full: from guest 1,109 on no seat lock is issued; odd overflow numbers go to YouTube, even ones to LinkedIn Live.`)
      : L('锁一次只发给一个人：四座看台的第 1 排坐满之后才轮到第 2 排。', 'The lock is granted to one guest at a time: row 2 opens only when row 1 is full in all four stands.') + latest;
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
  /** What a pointer at (x, y) on the stage canvas points at: { seat } or { mat } or null. */
  function hit(x, y) {
    const G = geo; if (!G) return null;
    for (let i = 0; i < MATS; i++) { const m = G.mats[i]; if (Math.abs(x - m.x) <= m.s / 2 + 4 && Math.abs(y - m.y) <= m.s / 2 + 4) return { mat: i }; }
    let best = -1, bd = Math.max(6, G.k * 0.9);
    for (let g = 0; g < CAP; g++) { const d = Math.hypot(x - G.sx[g], y - G.sy[g]); if (d < bd) { bd = d; best = g; } }
    return best >= 0 ? { seat: best } : null;
  }
  $('cv').addEventListener('pointermove', ev => {
    if (ev.pointerType === 'touch') return;
    const b = ev.currentTarget.getBoundingClientRect();
    hover = hit(ev.clientX - b.left, ev.clientY - b.top);
    paint();
  });
  $('cv').addEventListener('pointerleave', () => { hover = null; paint(); });
  $('cv').addEventListener('focus', () => {
    if (!S.sel && $('cv').matches(':focus-visible')) S.sel = { seat: BY_CODE.get('N1-17') };
    paint();
  });
  $('cv').addEventListener('keydown', ev => {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -1, ArrowDown: 1 }[ev.key];
    if (!step) return;
    ev.preventDefault(); ev.stopPropagation(); hover = null;
    const seat = S.sel?.seat ?? BY_CODE.get('N1-17');
    if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
      const si = STAND_OF[seat], row = (ROW_OF[seat] + step + NROW) % NROW;
      S.sel = { seat: SEGMENT[si][row] + Math.min(NUM_OF[seat], STANDS[si].rows[row]) - 1 };
    } else S.sel = { seat: (seat + step + CAP) % CAP };
    paint();
  });
  $('cv').addEventListener('click', (ev) => {
    const b = $('cv').getBoundingClientRect(), h = hit(ev.clientX - b.left, ev.clientY - b.top);
    if (!h && !S.sel) return;
    leave();
    S.sel = h && !(S.sel && S.sel.seat === h.seat && S.sel.mat === h.mat) ? h : null;
    paint();
  });

  /* ---------- experiment cards ---------- */
  // a card that plays declares its still: the frame of the figure a chapter cites (and of PDF / EPUB)
  const PRESETS = {
    lobby: { N: NMAX, at: 0, still: 0 },
    booking: { N: 720, at: 45, play: true, from: 0, stop: 45, still: 45 },
    overflow: { N: NMAX, at: TMAX, play: true, from: 0, still: TMAX },
    basket: { N: NMAX, at: 60, play: true, from: 40, stop: 60, still: 60, focus: 'baskets' },
    checkin: { N: CAP, at: T0, still: T0 }
  };
  const NOTES = {
    lobby: ['开门之前（T−75）：四座玻璃看台的 1,108 个席位全部空着——北 248、南 248、东 306、西 306，每座 8 排阶梯。看台围住的前厅里，Donna 守着接待前台，世界地图墙前排着 2 × 9 块花篮垫位（basket-01 … basket-18），花店就在旁边。拖动时间轴或按 ▶，让来宾入场。', 'Before the doors open (T−75): all 1,108 seats of the four glass stands are open — North 248, South 248, East 306, West 306, eight tiered rows each. In the lobby they enclose, Donna keeps the reception desk, the world-map wall carries 2 × 9 basket mats (basket-01 … basket-18), and Flower Town sits beside it. Drag the rail or press ▶ to let the guests in.'],
    booking: ['第一波 720 位来宾在 75 分钟里匀速到场。到第 45 分钟（T−30）已到 432 人：选座锁逐个发放、先坐满最前排，于是四座看台第 1–3 排的 144 + 144 + 144 = 432 席恰好坐满，第 4 排还空着；没有一个席位编号重复。另记实测：11 月 27 日全流程彩排中，Donna 处理 13 次预约与签到，0 次掉单，中位 29 秒（最长 63 秒）。', 'A first wave of 720 guests arrives evenly over 75 minutes. By minute 45 (T−30), 432 have arrived: the seat lock serves them one at a time and fills the front row first, so the 144 + 144 + 144 = 432 seats of rows 1–3 in the four stands are exactly full and row 4 is still empty; no seat code repeats. Measured separately: in the 27 November full-flow rehearsal Donna handled 13 bookings and check-ins, 0 dropped, median 29 s (max 63 s).'],
    overflow: ['1,250 位来宾到场，比席位多 142 人。前 1,108 人各锁一席，坐满四座看台（北 248 · 南 248 · 东 306 · 西 306）；从第 1,109 位起不再发席位锁，奇数号转 YouTube、偶数号转 LinkedIn Live，各 71 人。重座仍是 0。', '1,250 guests arrive, 142 more than there are seats. The first 1,108 each lock one seat and fill the four stands (North 248 · South 248 · East 306 · West 306); from guest 1,109 on no seat lock is issued, and odd overflow numbers go to YouTube, even ones to LinkedIn Live, 71 each. Duplicate seats: still 0.'],
    basket: ['世界地图墙前的 2 排 × 9 块垫位：到第 60 分钟（T−15）已有 12 块摆上花篮，6 块待领（琥珀色虚线）。basket-13 正从花店柜台出发，经小花核验贺卡后送往自己的垫位。', 'The 2 rows × 9 mats along the world-map wall: by minute 60 (T−15) twelve hold a basket and six are open (dashed amber). basket-13 is leaving the Flower Town counter for its mat, its greeting card checked by Blossom.'],
    checkin: ['T−0，16:00 SGT：1,108 位来宾恰好坐满 1,108 席，从 N1-01 到 W8-36；18 块垫位全部摆上花篮，主屏亮起。模型之外的实测：11 月 27 日彩排，Donna 13 次预约与签到，0 掉单，中位 29 秒。', 'T−0, 16:00 SGT: 1,108 guests fill the 1,108 seats exactly, from N1-01 to W8-36; all 18 mats hold their baskets and the keynote screen lights up. Measured outside the model: in the 27 November rehearsal Donna handled 13 bookings and check-ins, 0 dropped, median 29 s.']
  };
  // a cited figure keeps one sentence next to ◀ ▶; the full lab keeps the longer notes above
  const FIGURE_NOTES = {
    lobby: ['开门前：4 座看台 × 8 排，1,108 席全空；18 块垫位待用。', 'Before doors: 4 stands × 8 rows, 1,108 seats and 18 mats, all open.'],
    booking: ['第 45 分钟：432 人坐满第 1–3 排，重座 0。', 'Minute 45: 432 guests fill rows 1–3; zero duplicate seats.'],
    overflow: ['1,250 人到场：1,108 席坐满，142 人转直播，重座 0。', '1,250 arrive: 1,108 seated, 142 to the stream, zero duplicates.'],
    basket: ['12 块垫位已摆花篮，6 块待领。', '12 mats hold baskets; 6 are open.'],
    checkin: ['T−0：1,108 席与 18 块垫位全部就位。', 'T−0: all 1,108 seats and all 18 mats are filled.']
  };
  let booting = true;
  function applyPreset(id) {
    const p = PRESETS[id];
    S.N = p.N; hover = null; S.sel = null; S.focus = p.focus || null;
    clock.pause(); clock.set(p.at);
    if (TRV.still && p.still != null) clock.set(p.still === 'end' ? clock.max : p.still);
    // a still (cover, cited figure for PDF/EPUB) and the opening view of the full page show the telling frame;
    // inside a chapter the card plays once the reader has scrolled it into view; a click plays at once
    if (!p.play || TRV.still || (booting && !TRV.embed)) { paint(); return; }
    clock.set(p.from || 0); S.stop = p.stop == null ? null : p.stop;
    if (booting) kit.autoplay(clock, $('stage')); else clock.play();
  }
  const cards = kit.cards($('presets'), { presets: PRESETS, notes: TRV.figure ? FIGURE_NOTES : NOTES, noteEl: $('presetNote'), tour: $('tour'), onPick: applyPreset,
    idle: ['自由探索：拖动到场人数与时间轴，点一个席位（右栏读出它的编号，如 N1-17）或一块花篮垫位。随时可以再选一张卡。', 'Free play: drag the load and the rail, click a seat (its code, such as N1-17, appears on the right) or a basket mat. Pick a card again at any time.'] });

  TRV.drawer({ drawer: $('drawer'), open: $('infoBtn'), close: $('drawerClose') });
  TRV.startGlitch(document.querySelector('.brand'));

  /* ---------- probe for the browser suite, cover, start ---------- */
  const at = (x, y) => { const b = $('cv').getBoundingClientRect(); return { x: b.left + x, y: b.top + y }; };
  window.LAUNCH_ARENA_DEBUG = {
    get state() {
      const D = derive(clock.t);
      return { t: clock.t, max: clock.max, playing: clock.playing, preset: cards.current, N: S.N, cap: CAP, rows: ROWS.slice(), stands: STAND_CAP.slice(),
        arrivals: D.A, seated: D.seated, overflow: D.over, youtube: D.yt, linkedin: D.li, duplicates: D.dup, naive: D.naive, fill: D.fill.slice(),
        standFill: D.standFill.slice(), latest: D.last > 0 ? CODE[SEAT[D.last]] : null, baskets: D.baskets, live: D.live,
        focus: S.focus, sel: S.sel ? { ...S.sel } : null, stop: S.stop };
    },
    /** The seat (global id 0 … 1,107, or −1 for the stream) of guests 1 … n under the atomic lock. */
    seats: (n) => Array.from(SEAT.subarray(1, Math.min(NMAX, n) + 1)),
    /** Row (0-based), stand letter, seat number and seat code of each global seat id, with its plan position in metres. */
    layout: () => ({ row: Array.from(ROW_OF), stand: Array.from(STAND_OF, (s) => STANDS[s].id), num: Array.from(NUM_OF), code: CODE.slice(),
      x: Array.from(PX), y: Array.from(PY) }),
    naive: (n) => Array.from(naiveSeries(clamp(Math.round(n), 1, NMAX))),
    basketAt: () => BASKET_AT.slice(),
    set: (n) => setLoad(n), seek: (t) => { clock.pause(); clock.set(t); },
    point: {
      seat: (code) => (geo && BY_CODE.has(code) ? at(geo.sx[BY_CODE.get(code)], geo.sy[BY_CODE.get(code)]) : null),
      mat: (i) => (geo ? at(geo.mats[i].x, geo.mats[i].y) : null),
      empty: () => (geo ? at(...geo.at(0, -3)) : null)
    }
  };
  /** Cover: the full house of 1,250 guests during the keynote, every basket placed. */
  window.TRV_THUMB = () => { S.N = NMAX; S.sel = null; S.focus = null; clock.pause(); clock.set(TMAX); paint.now(); };
  cards.pick(cards.initial('lobby'));   // a chapter may cite another card: ::: {.viz src="launch-arena" preset="booking"}
  booting = false;
  paint();
})();
