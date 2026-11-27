/* OPS//LEDGER · AI 团队工作台账: nine AI employee roles and the work ledger of the launch, as of 2026-11-27
   (nyxid-nyxbot-trials@df5ef47): the six core small-business roles, then three standalone watchdog / ops roles.
     board      one row per role, one cell per defined workflow: cyan = ready / demonstrable, violet = held behind a human
                gate or on the roadmap; a divider separates the six core roles from the three standalone ones; the rail
                fires stress probes at the 18 gated workflows, each one escalates
     gate       Donna's press gate and Finance's refund gate: an in-bank question is answered with its source, an
                off-script question and an unverified refund escalate to the human queue; unauthorized commitments 0
     countdown  the runbook from the Nov 27 full-flow rehearsal (done) through the Dec 16 formal Discord dress rehearsal
                to the Dec 17 16:00 SGT broadcast and Dec 18 replay clips, with the roles on duty at each milestone
     merchant   the board filtered, step by step, down to the two-role merchant starter pack
   The per-role counts are those of the 2026-11-27 audit; every sum and share on the page is computed from them and
   checked against the audit's declared totals.
   Colours: cyan = ready / answered, violet = human gate and queue, amber = the current probe, request, date or the
   selected role. Read-only probe for the browser suite: OPS_LEDGER_DEBUG. */
(() => {
  'use strict';
  const { kit, L } = TRV, { fix, clamp } = kit, P = TRV.palette;
  const $ = (id) => document.getElementById(id);
  const T_MAX = 100;

  /* ---------- the ledger (nyxid-nyxbot-trials@df5ef47, 2026-11-27) ---------- */
  const ROLES = [
    { id: 'donna', core: true, ready: 14, total: 15, name: ['礼宾 Donna', 'Concierge Donna'], short: ['Donna', 'Donna'], merchant: ['前台礼宾', 'Front-desk concierge'],
      line: ['11-27 签到提醒已核验，唯一待办是电话线路（con-14）；库外媒体追问、未核验承诺与危机表态强制升级人工', 'check-in reminder verified on Nov 27, the one open item is the phone line (con-14); off-bank press probes, unverified promises and crisis statements escalate to humans'] },
    { id: 'finance', core: true, ready: 24, total: 28, name: ['财务 NyxBot Finance', 'Finance · NyxBot Finance'], short: ['财务', 'Finance'], merchant: ['财务台账', 'Finance ledger'],
      line: ['对外打款与税务申报须人工签批，另有 17 项财务事务永久归人；干净账户第二遍安装实测 34 分钟（10 次确认、8 次审批）；外部付费商户 0', 'outgoing payments and tax filings need human sign-off, and 17 more finance items stay human for good; a clean-account install took 34 min on the second pass (10 confirmations, 8 approvals); 0 external paying merchants'] },
    { id: 'autox', core: true, ready: 12, total: 14, name: ['社媒 Auto-X', 'Social Auto-X'], short: ['Auto-X', 'Auto-X'],
      line: ['11-25 第一条经 Lark 审批的帖子发上 ChronoAI LinkedIn 公司页；11-26 一份紧急视频简报 55 分钟端到端跑完、零人工步骤；重大官宣与争议回复须人工终审', 'Nov 25: the first Lark-approved post went live on the ChronoAI LinkedIn company page; Nov 26: an urgent video brief ran end to end in 55 min with zero human steps; major announcements and sensitive replies need human approval'] },
    { id: 'community', core: true, ready: 10, total: 12, name: ['社群运营', 'Community Ops'], short: ['社群', 'Community'],
      line: ['技能 4.36 与 reply-queue 0.3 上线；品牌危机与封禁申诉交人类裁决', 'skill 4.36 and reply-queue 0.3 in service; brand crises and ban appeals stay with humans'] },
    { id: 'hr', core: true, ready: 14, total: 20, name: ['HR 模板包', 'HR Pack'], short: ['HR', 'HR'],
      line: ['严格证据审计查出 PDF 读取的短板，如实从 15 / 20 下调到 14 / 20；薪酬定级、正式 Offer 与解雇面谈严格归人', 'a strict evidence audit caught PDF-reading limits and honestly moved it down from 15 / 20 to 14 / 20; compensation bands, formal offers and terminations stay strictly human'] },
    { id: 'admin', core: true, ready: 8, total: 10, name: ['行政助手', 'Admin'], short: ['行政', 'Admin'],
      line: ['从 5 / 10 升到 8 / 10；法律合同签章、实体印章与高额采购严格归人', 'up from 5 / 10 to 8 / 10; legal contracts, corporate seals and major procurement stay strictly human'] },
    { id: 'sentiment', core: false, ready: 6, total: 7, name: ['#7 舆情监测员', '#7 Sentiment Monitor'], short: ['舆情', 'Sentiment'],
      line: ['每小时巡检 Discord 与 X，每天 22:15 出日报；还有 1 项未打通；危机表态交人工', 'hourly Discord and X monitoring and a daily digest at 22:15; 1 workflow not yet ready; crisis statements go to humans'] },
    { id: 'kb', core: false, ready: 3, total: 3, name: ['#8 知识库维护员', '#8 KB Maintainer'], short: ['知识库', 'KB'],
      line: ['每天两次整理经核验的 FAQ；只收录有出处的答案', 'curates the verified FAQ twice a day; only answers with a source go in'] },
    { id: 'retro', core: false, ready: 11, total: 11, name: ['#9 复盘分析员', '#9 Retrospective Analyst'], short: ['复盘', 'Retro'],
      line: ['2026-11-27 新增：每周一抽检 40 项、对标 7 个同行 X 账号、核算每个智能体的单位成本，给其余 AI 员工打分', 'added on 2026-11-27: every Monday it samples 40 items, benchmarks 7 peer X accounts and computes each agent\'s unit cost, auditing the rest of the AI team'] }
  ];
  const BYID = Object.fromEntries(ROLES.map((r) => [r.id, r]));
  const CORE = ROLES.filter((r) => r.core);
  const sum = (rs, k) => rs.reduce((s, r) => s + r[k], 0);
  const pct = (a, b) => (b ? (100 * a) / b : 0);
  /** The totals the audit declares; the page's own sums of the rows above must meet them (the ✓ of the key readout). */
  const DECLARED = { core: [82, 99], all: [102, 120] };
  const STARTER = ['donna', 'finance'];
  // removed step after step on the merchant rail: the three standalone roles together, then four core roles one by one
  const FILTER_STEPS = [['sentiment', 'kb', 'retro'], ['admin'], ['hr'], ['community'], ['autox']];
  const FILTER_SPAN = T_MAX / FILTER_STEPS.length;
  const SEP = 0.7;   // height of the divider between the core and the standalone rows, in rows
  /** The gated workflows, enumerated role by role: [role, index within the role's gated cells]. */
  const GATED = ROLES.flatMap((r) => Array.from({ length: r.total - r.ready }, (_, i) => [r.id, i]));

  /* ---------- the countdown: milestones on the rail (not evenly spaced: the broadcast day gets room) ---------- */
  // the watchdogs (Sentiment, KB) keep their daily rounds throughout; the Retrospective Analyst works on Mondays, so it is
  // on duty in the spans that hold one (Nov 30, Dec 7, Dec 14) and for the review after the broadcast; HR keeps to its
  // own background workflows. Which roles light up is illustrative.
  const MILESTONES = [
    { t: 0, at: Date.UTC(2026, 10, 26, 16), day: '11-27', rel: 'T-20', label: ['全流程彩排 · 11 / 12 一次通过（已完成）', 'Full-flow rehearsal · 11 / 12 first try (done)'], active: ['donna', 'autox', 'community', 'admin', 'sentiment', 'kb', 'retro'],
      note: ['11-27 全流程彩排（trials#225 / #226）：12 段中 11 段一次通过，主持人只动了 4 次手；Donna 13 次订座与签到操作 0 丢单，中位 29 s（最长 63 s）。唯一的真故障：Lark 内部群问答在网关队列里卡了 65–70 分钟（NyxID#2534），改用定时一次性任务，3.0 分钟送达 7 个主题的主持人提纲。', 'The Nov 27 full-flow rehearsal (trials#225 / #226): 11 of 12 stages passed on the first try and the human lead acted only 4 times; Donna ran 13 booking and check-in operations with 0 dropped, median 29 s (max 63 s). The one real failure: a Lark internal-group Q&A request sat in the gateway queue for 65–70 minutes (NyxID#2534); a scheduled one-shot task bypassed it and delivered the 7-topic host sheet in 3.0 minutes.'] },
    { t: 16, at: Date.UTC(2026, 11, 4, 2), day: '12-04 10:00 SGT', rel: 'T-13', label: ['第一波 · 订座开放', 'Wave 1 · booking open'], active: ['donna', 'autox', 'community', 'sentiment', 'kb', 'retro'] },
    { t: 28, at: Date.UTC(2026, 11, 7, 16), day: '12-08', rel: 'T-9', label: ['第二波 · 媒体包', 'Wave 2 · press kit'], active: ['donna', 'autox', 'community', 'sentiment', 'kb'] },
    { t: 38, at: Date.UTC(2026, 11, 10, 16), day: '12-11', rel: 'T-6', label: ['压测与直播演练', 'Load & stream drill'], active: ['donna', 'autox', 'community', 'admin', 'sentiment', 'kb', 'retro'] },
    { t: 50, at: Date.UTC(2026, 11, 14, 16), day: '12-15', rel: 'T-2', label: ['产物冻结', 'Artifact freeze'], active: ['donna', 'finance', 'autox', 'community', 'admin', 'sentiment', 'kb'] },
    { t: 60, at: Date.UTC(2026, 11, 15, 16), day: '12-16', rel: 'T-1', label: ['Discord 正式彩排', 'Formal Discord dress rehearsal'], active: ['donna', 'finance', 'autox', 'community', 'admin', 'sentiment', 'kb'],
      note: ['12-16 在 Discord 走一遍正式彩排：12-15 先冻结全部产物，30 题记者问答库在此之前装进 Donna 的生产表。', 'Dec 16: the formal dress rehearsal on Discord. Every artifact is frozen on Dec 15, and the 30-question press bank is loaded into Donna\'s production sheet before the rehearsal.'] },
    { t: 70, at: Date.UTC(2026, 11, 17, 8), day: '12-17 16:00 SGT', rel: 'T-0', label: ['线上直播', 'Live broadcast'], active: ['donna', 'finance', 'autox', 'community', 'admin', 'sentiment', 'kb'] },
    { t: 100, at: Date.UTC(2026, 11, 18, 8), day: '12-18', rel: 'T+1', label: ['回放切片与试点跟进', 'Replay clips & pilot follow-up'], active: ['finance', 'autox', 'community', 'sentiment', 'kb', 'retro'] }
  ];
  const SGT = 8 * 3600e3;
  function dateAt(t) {
    let k = 0; while (k + 1 < MILESTONES.length && MILESTONES[k + 1].t <= t + 1e-9) k++;
    const a = MILESTONES[k], b = MILESTONES[Math.min(k + 1, MILESTONES.length - 1)];
    const ms = b === a ? a.at : a.at + (b.at - a.at) * (t - a.t) / (b.t - a.t), d = new Date(ms + SGT);
    const pad = (x) => String(x).padStart(2, '0');
    return { milestone: k, ms, text: `${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} SGT`, active: a.active, at: a };
  }

  /* ---------- the gate scene: three requests and their times ---------- */
  const REQ = {
    inbank: { who: 'donna', go: 0, check: 12, out: 15, end: 22, kind: 'answer', q: ['发布会几点开始？', 'When does the launch start?'], a: ['12-17 16:00 SGT · 出处：核验问答库', 'Dec 17, 16:00 SGT · source: verified Q&A bank'] },
    press: { who: 'donna', go: 22, check: 28, out: 30, end: 34, kind: 'escalate', q: ['能透露融资细节吗？', 'Can you share financing details?'], a: ['库外 · 升级到 contact@chrono-ai.fun', 'off-bank · escalated to contact@chrono-ai.fun'] },
    refund: { who: 'finance', go: 40, check: 48, out: 51, end: 58, kind: 'escalate', q: ['退款：找不到对应收据', 'Refund: no matching receipt'], a: ['未核验 · 进入人工审批', 'unverified · sent to human approval'] }
  };

  /* ---------- state and the model ---------- */
  const S = { scene: 'board', selected: 'donna', press: true, refund: false };
  const SCENES = ['board', 'gate', 'countdown', 'merchant'];
  /** Which roles are still on the board of the merchant scene at time t, and how much of each row is left (1 → 0). */
  function filterAt(t) {
    const w = {};
    for (const r of ROLES) w[r.id] = 1;
    FILTER_STEPS.forEach((ids, i) => { const v = clamp(1 - (t - FILTER_SPAN * i) / FILTER_SPAN, 0, 1); for (const id of ids) w[id] = v; });
    const visible = ROLES.filter((r) => w[r.id] > 1e-9).map((r) => r.id);
    return { w, visible };
  }
  function model(t) {
    const out = { scene: S.scene, t };
    const all = { ready: sum(ROLES, 'ready'), total: sum(ROLES, 'total') }, core = { ready: sum(CORE, 'ready'), total: sum(CORE, 'total') };
    out.all = { ...all, pct: pct(all.ready, all.total), gated: all.total - all.ready };
    out.core = { ...core, pct: pct(core.ready, core.total), gated: core.total - core.ready };
    out.declared = { core: DECLARED.core.slice(), all: DECLARED.all.slice(),
      met: core.ready === DECLARED.core[0] && core.total === DECLARED.core[1] && all.ready === DECLARED.all[0] && all.total === DECLARED.all[1] };
    out.roles = ROLES.map((r) => ({ id: r.id, core: r.core, ready: r.ready, total: r.total, pct: pct(r.ready, r.total) }));
    // stress probes of the board: probe i targets gated workflow i mod 18; every probe escalates
    const fired = S.scene === 'board' ? Math.floor(t + 1e-9) : 0;
    out.probes = { fired, escalated: fired, unauthorized: 0 };
    // the gate: each request is pending, being checked, answered or escalated
    const status = (q) => (t < q.go ? 'idle' : t < q.check ? 'travel' : t < q.out ? 'check' : q.kind === 'answer' ? 'answered' : 'escalated');
    const gate = {};
    for (const [k, q] of Object.entries(REQ)) gate[k] = S.scene !== 'gate' || (k === 'press' && !S.press) || (k === 'refund' && !S.refund) ? 'off' : status(q);
    out.gate = { ...gate, escalated: ['press', 'refund'].filter((k) => gate[k] === 'escalated').length, answered: gate.inbank === 'answered' ? 1 : 0, unauthorized: 0 };
    const d = dateAt(t);
    out.date = { text: d.text, milestone: MILESTONES[d.milestone].rel, day: MILESTONES[d.milestone].day, active: d.active.slice(), of: ROLES.length };
    const f = filterAt(S.scene === 'merchant' ? t : 0), vis = ROLES.filter((r) => f.visible.includes(r.id));
    out.view = { visible: f.visible, ready: sum(vis, 'ready'), total: sum(vis, 'total'), pct: pct(sum(vis, 'ready'), sum(vis, 'total')) };
    const st = ROLES.filter((r) => STARTER.includes(r.id));
    out.starter = { roles: STARTER.slice(), ready: sum(st, 'ready'), total: sum(st, 'total'), pct: pct(sum(st, 'ready'), sum(st, 'total')), externalMerchants: 0 };
    out.escalated = S.scene === 'board' ? out.probes.escalated : S.scene === 'gate' ? out.gate.escalated : 0;
    return out;
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
  function fit(ctx, str, w, size, f, weight) {
    ctx.font = `${weight ? weight + ' ' : ''}${size}px ${face(f)}`;
    if (ctx.measureText(str).width <= w) return str;
    let s = str; while (s.length > 1 && ctx.measureText(s + '…').width > w) s = s.slice(0, -1);
    return s + '…';
  }
  /** Wrap at words (Chinese at characters) to `width` pixels. */
  function wrap(ctx, str, width, size, f) {
    ctx.font = `${size}px ${face(f)}`;
    const out = []; let row = '';
    for (const part of str.match(/\p{Script=Han}|[^\S\n]+|[^\p{Script=Han}\s]+/gu) || []) {
      if (row && ctx.measureText(row + part).width > width) { out.push(row.trim()); row = ''; }
      row += part;
    }
    if (row.trim()) out.push(row.trim());
    return out;
  }
  function rrect(ctx, r, rad) { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(r.x, r.y, r.w, r.h, rad); else ctx.rect(r.x, r.y, r.w, r.h); }
  function box(ctx, r, stroke, o) {
    o = o || {};
    rrect(ctx, r, o.rad == null ? 6 : o.rad); ctx.fillStyle = o.fill || TRV.alpha(P.void, 0.88); ctx.fill();
    ctx.strokeStyle = stroke; ctx.lineWidth = o.width || 1.2; ctx.setLineDash(o.dash || []);
    if (o.glow) { ctx.shadowColor = stroke; ctx.shadowBlur = o.glow; }
    ctx.stroke(); ctx.shadowBlur = 0; ctx.setLineDash([]);
  }
  const dot = (ctx, x, y, r, color, glow) => { ctx.fillStyle = color; if (glow) { ctx.shadowColor = color; ctx.shadowBlur = glow; } ctx.beginPath(); ctx.arc(x, y, r, 0, kit.TAU); ctx.fill(); ctx.shadowBlur = 0; };
  const along = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];

  /* ---------- scene: the board (and the merchant filter, which is the board with rows leaving) ---------- */
  const CLEAR = 12;   // px kept free between the last cell (and the total bar) and the readout column, at every width
  function drawBoard(ctx, bx, t, M, merchant) {
    const thumb = TRV.thumbMode, narrow = bx.w < 520, fs = clamp(bx.w / 60, 9, 12.5);
    const w = merchant ? filterAt(t).w : Object.fromEntries(ROLES.map((r) => [r.id, 1]));
    const wOf = (r) => (STARTER.includes(r.id) ? 1 : w[r.id]);
    const totalH = thumb ? 0 : clamp(bx.h * 0.12, 26, 40), rowsH = bx.h - totalH - (thumb ? 0 : 8);
    // the divider between the six core rows and the three standalone ones leaves with the standalone rows
    const sepK = Math.max(0, ...ROLES.filter((r) => !r.core).map(wOf)), sepW = SEP * sepK;
    const weight = ROLES.reduce((s, r) => s + wOf(r), 0) + sepW, unit = rowsH / Math.max(weight, 1e-9);
    const vis = ROLES.filter((r) => unit * wOf(r) >= 0.5), rd = sum(vis, 'ready'), tt = sum(vis, 'total');
    const labelW = thumb ? bx.w * 0.06 : clamp(bx.w * (narrow ? 0.26 : 0.24), 70, 220), maxTotal = Math.max(...ROLES.map((r) => r.total));
    // the readout column is at least as wide as its widest text; the total goes on two lines when one would squeeze the cells
    const tw = (s, size, wt) => { ctx.font = `${wt ? wt + ' ' : ''}${size}px ${face('data')}`; return ctx.measureText(s).width; };
    const sumParts = [`${rd} / ${tt}`, `${fix(pct(rd, tt), 1)}%`], sumLine = `${sumParts[0]} = ${sumParts[1]}`;
    let ratioW = 0, oneLine = false;
    if (!thumb) {
      const rowsW = Math.max(...ROLES.map((r) => Math.max(tw(`${r.ready} / ${r.total}`, fs), tw(`${fix(pct(r.ready, r.total), 1)}%`, fs - 1.5))));
      const col = (textW) => Math.max(clamp(bx.w * (narrow ? 0.2 : 0.15), 58, 120), textW + 4), lineW = tw(sumLine, fs, 600);
      oneLine = (bx.w - labelW - col(Math.max(rowsW, lineW)) - CLEAR) / maxTotal >= 10;
      ratioW = col(Math.max(rowsW, oneLine ? lineW : Math.max(tw(sumParts[0], fs, 600), tw(sumParts[1], fs - 1.5, 600))));
    }
    const cellsX = bx.x + labelW, cellsW = bx.w - labelW - ratioW - (thumb ? 8 : CLEAR);
    const pitch = cellsW / maxTotal;
    geo.rows = {};
    let y = bx.y, divided = false;
    for (const r of ROLES) {
      if (!r.core && !divided) {
        divided = true;
        const sh = unit * sepW;
        if (sh >= 0.5) {
          const sy = y + sh / 2, a = merchant ? 0.25 + 0.75 * sepK : 1;
          ctx.globalAlpha = a; ctx.strokeStyle = P.lineHot; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
          ctx.beginPath(); ctx.moveTo(bx.x, sy); ctx.lineTo(bx.x + bx.w, sy); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
          if (!thumb && sh > fs * 1.05) {
            const cr = sum(CORE, 'ready'), ct = sum(CORE, 'total');
            const words = L(`↑ 六核心岗 ${cr} / ${ct} = ${fix(pct(cr, ct), 1)}% · ↓ 三个独立值守岗`, `↑ six core roles ${cr} / ${ct} = ${fix(pct(cr, ct), 1)}% · ↓ three standalone roles`);
            text(ctx, fit(ctx, words, bx.w - 12, fs - 1.5), bx.x + 6, sy, P.dim, { size: fs - 1.5, halo: true, alpha: a });
          }
          y += sh;
        }
      }
      const k = wOf(r), h = unit * k;
      if (h < 0.5) continue;
      const alpha = merchant && !STARTER.includes(r.id) ? 0.25 + 0.75 * k : 1, rowBox = { x: bx.x, y, w: bx.w, h };
      geo.rows[r.id] = rowBox;
      const cy = y + h / 2, ch = Math.min(h * 0.56, pitch * 1.25, 26), cw = Math.max(1.5, pitch * 0.74);
      ctx.globalAlpha = alpha;
      if (S.selected === r.id && !thumb) { rrect(ctx, { x: bx.x - 4, y: y + 2, w: bx.w + 8, h: h - 4 }, 6); ctx.strokeStyle = P.amber; ctx.lineWidth = 1.6; ctx.shadowColor = P.amber; ctx.shadowBlur = 8; ctx.stroke(); ctx.shadowBlur = 0; }
      if (h > fs * 1.4) {
        const nm = merchant && r.merchant ? L(...r.merchant) : narrow ? L(...r.short) : L(...r.name);
        text(ctx, fit(ctx, nm, labelW - 10, fs, 'display', 600), bx.x + 4, cy, P.ink, { size: fs, face: 'display', weight: 600, alpha });
        const audited = r.id === 'hr';
        const ratio = (audited ? '↓ ' : '') + r.ready + ' / ' + r.total;
        text(ctx, ratio, bx.x + bx.w - 4, cy - (h > fs * 2.8 ? fs * 0.55 : 0), audited ? P.magenta : P.ink, { size: fs, align: 'right', alpha });
        if (h > fs * 2.8) text(ctx, `${fix(pct(r.ready, r.total), 1)}%`, bx.x + bx.w - 4, cy + fs * 0.7, P.dim, { size: fs - 1.5, align: 'right', alpha });
      }
      for (let i = 0; i < r.total; i++) {
        const x = cellsX + (i + 0.5) * pitch, ready = i < r.ready, cell = { x: x - cw / 2, y: cy - ch / 2, w: cw, h: ch };
        rrect(ctx, cell, Math.min(2.5, cw / 3));
        if (ready) { ctx.fillStyle = TRV.alpha(P.cyan, thumb ? 0.85 : 0.7); ctx.fill(); }
        else { ctx.fillStyle = TRV.alpha(P.violet, 0.16); ctx.fill(); ctx.strokeStyle = TRV.alpha(P.violet, 0.9); ctx.lineWidth = 1; ctx.stroke(); }
        if (r.id === 'hr' && i === r.ready) {
          ctx.strokeStyle = P.magenta;
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(cell.x, cell.y + cell.h); ctx.lineTo(cell.x + cell.w, cell.y); ctx.stroke();
        }
      }
      // the human line: between the last ready cell and the first gated one
      const sx = cellsX + r.ready * pitch;
      ctx.strokeStyle = P.violet; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx, cy - ch / 2 - 3); ctx.lineTo(sx, cy + ch / 2 + 3); ctx.stroke();
      ctx.globalAlpha = 1;
      y += h;
    }
    // the probes of the board scene: the latest one travels into its gated cell and is turned back to the human queue
    if (!merchant && M.probes.fired > 0) {
      const p = M.probes.fired - 1, [rid, gi] = GATED[p % GATED.length], r = BYID[rid], row = geo.rows[rid];
      if (row) {
        const x = cellsX + (r.ready + gi + 0.5) * pitch, cy = row.y + row.h / 2, f = clamp(t - Math.floor(t + 1e-9), 0, 1), right = [bx.x + bx.w - ratioW - 2, cy];
        const tgt = [x, cy], pos = f < 0.5 ? along(right, tgt, f * 2) : along(tgt, [right[0], cy - row.h * 0.32], (f - 0.5) * 2);
        dot(ctx, pos[0], pos[1], thumb ? 7 : 4.5, P.amber, 12);
        rrect(ctx, { x: x - pitch * 0.45, y: cy - row.h * 0.32, w: pitch * 0.9, h: row.h * 0.64 }, 3); ctx.strokeStyle = P.amber; ctx.lineWidth = 1.4; ctx.stroke();
      }
    }
    if (thumb) return;
    // the total of what is on the board
    const bar = { x: cellsX, y: bx.y + bx.h - totalH * 0.55, w: cellsW, h: Math.max(8, totalH * 0.4) }, ty = bar.y + bar.h / 2, rx = bx.x + bx.w - 4;
    const totalWord = merchant && vis.length === 2 ? L('起步包合计', 'STARTER TOTAL') : vis.length === ROLES.length ? L('九岗合计', 'NINE ROLES') : L('合计', 'TOTAL');
    text(ctx, fit(ctx, totalWord, labelW - 10, fs, 'display', 600), bx.x + 4, ty, P.ink, { size: fs, face: 'display', weight: 600 });
    rrect(ctx, bar, 3); ctx.fillStyle = TRV.alpha(P.violet, 0.2); ctx.fill(); ctx.strokeStyle = TRV.alpha(P.violet, 0.7); ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = TRV.alpha(P.cyan, 0.75); ctx.fillRect(bar.x, bar.y, bar.w * rd / tt, bar.h);
    if (oneLine) text(ctx, sumLine, rx, ty, P.ink, { size: fs, weight: 600, align: 'right' });
    else { text(ctx, sumParts[0], rx, ty - fs * 0.62, P.ink, { size: fs, weight: 600, align: 'right' }); text(ctx, sumParts[1], rx, ty + fs * 0.62, P.ink, { size: fs - 1.5, weight: 600, align: 'right' }); }
  }

  /* ---------- scene: the gate ---------- */
  function drawGate(ctx, bx, t, M) {
    const fs = clamp(bx.w / 60, 9, 12), narrow = bx.w < 520, lanes = [['donna', ['inbank', 'press']], ['finance', ['refund']]];
    const laneH = bx.h / 2, colIn = bx.x, colInW = bx.w * (narrow ? 0.26 : 0.27), emp = { w: bx.w * 0.22 }, outX = bx.x + bx.w * 0.66, outW = bx.w * 0.34;
    emp.x = bx.x + bx.w * 0.34;
    // the two outlets, shared by both lanes: answered (top) and the human queue (bottom)
    const ans = { x: outX, y: bx.y + 4, w: outW, h: bx.h * 0.36 }, hq = { x: outX, y: bx.y + bx.h * 0.46, w: outW, h: bx.h * 0.5 };
    box(ctx, ans, P.cyan, { glow: M.gate.answered ? 6 : 0 });
    text(ctx, fit(ctx, L('带出处直接回答', 'ANSWERED · WITH SOURCE'), ans.w - 12, fs - 0.5, 'display', 600), ans.x + 6, ans.y + fs, P.cyan, { size: fs - 0.5, face: 'display', weight: 600 });
    text(ctx, String(M.gate.answered), ans.x + ans.w - 8, ans.y + ans.h / 2 + 4, P.cyan, { size: fs + 6, weight: 700, align: 'right' });
    const firing = ['press', 'refund'].some((k) => M.gate[k] === 'check');
    box(ctx, hq, firing ? P.amber : P.violet, { glow: firing ? 12 : 4 });
    text(ctx, fit(ctx, L('人工值守队列', 'HUMAN QUEUE'), hq.w - 12, fs - 0.5, 'display', 600), hq.x + 6, hq.y + fs, P.violet, { size: fs - 0.5, face: 'display', weight: 600 });
    text(ctx, fit(ctx, 'contact@chrono-ai.fun', hq.w - 12, fs - 1.5), hq.x + 6, hq.y + fs * 2.3, P.dim, { size: fs - 1.5 });
    text(ctx, String(M.gate.escalated), hq.x + hq.w - 8, hq.y + hq.h - fs * 1.2, P.violet, { size: fs + 6, weight: 700, align: 'right' });
    text(ctx, fit(ctx, `${L('越权承诺', 'unauthorized')} 0`, hq.w - 40, fs - 1.5), hq.x + 6, hq.y + hq.h - fs * 1.1, P.ink, { size: fs - 1.5 });
    geo.rows = {};
    lanes.forEach(([rid, reqs], li) => {
      const y0 = bx.y + li * laneH, cy = y0 + laneH / 2, r = BYID[rid], e = { x: emp.x, y: y0 + laneH * 0.18, w: emp.w, h: laneH * 0.64 };
      geo.rows[rid] = { x: bx.x, y: y0, w: outX - bx.x - 6, h: laneH };
      if (S.selected === rid) { rrect(ctx, { x: bx.x - 4, y: y0 + 3, w: outX - bx.x - 4, h: laneH - 6 }, 6); ctx.strokeStyle = P.amber; ctx.lineWidth = 1.4; ctx.stroke(); }
      box(ctx, e, P.cyan);
      text(ctx, fit(ctx, L(...r.short), e.w - 10, fs, 'display', 600), e.x + e.w / 2, e.y + e.h * 0.32, P.ink, { size: fs, face: 'display', weight: 600, align: 'center' });
      text(ctx, fit(ctx, rid === 'donna' ? L('核验库 30 题', 'bank · 30 items') : L('核对收据', 'receipt check'), e.w - 8, fs - 2), e.x + e.w / 2, e.y + e.h * 0.62, P.dim, { size: fs - 2, align: 'center' });
      // the gate on the employee's right edge
      const gx = e.x + e.w + 3, active = reqs.some((k) => M.gate[k] === 'check');
      ctx.strokeStyle = active ? P.amber : P.violet; ctx.lineWidth = 3; if (active) { ctx.shadowColor = P.amber; ctx.shadowBlur = 10; }
      ctx.beginPath(); ctx.moveTo(gx, e.y); ctx.lineTo(gx, e.y + e.h); ctx.stroke(); ctx.shadowBlur = 0;
      const toAns = [ans.x, ans.y + ans.h / 2], toHq = [hq.x, hq.y + hq.h * (li ? 0.72 : 0.38)];
      ctx.strokeStyle = P.lineHot; ctx.lineWidth = 1; ctx.globalAlpha = 0.7; ctx.beginPath();
      if (reqs.some((k) => REQ[k].kind === 'answer')) { ctx.moveTo(gx, cy - 6); ctx.lineTo(...toAns); }   // a lane only draws the outlets it can use
      ctx.moveTo(gx, cy + 6); ctx.lineTo(...toHq); ctx.stroke(); ctx.globalAlpha = 1;
      // the requests: a chip on the left, a packet that travels, and the stamp of what happened
      reqs.forEach((k, qi) => {
        const q = REQ[k], s = M.gate[k], qy = y0 + laneH * (reqs.length === 1 ? 0.5 : qi ? 0.72 : 0.28), chip = { x: colIn, y: qy - fs * 0.95, w: colInW, h: fs * 1.9 };
        const off = s === 'off';
        const words = wrap(ctx, L(...q.q), chip.w - 8, fs - 2, 'body'), two = narrow && words.length > 1;
        if (two) { chip.y = qy - fs * 1.35; chip.h = fs * 2.7; }
        rrect(ctx, chip, 4); ctx.fillStyle = TRV.alpha(P.void, 0.9); ctx.fill(); ctx.strokeStyle = off ? P.faint : s === 'idle' ? P.lineHot : P.amber; ctx.lineWidth = 1; ctx.setLineDash(off ? [3, 3] : []); ctx.stroke(); ctx.setLineDash([]);
        if (two) words.slice(0, 2).forEach((wd, i) => text(ctx, fit(ctx, wd, chip.w - 8, fs - 2, 'body'), chip.x + 4, qy + (i - 0.5) * (fs + 0.5), off ? P.faint : P.ink, { size: fs - 2, face: 'body' }));
        else text(ctx, fit(ctx, L(...q.q), chip.w - 8, fs - 1.5, 'body'), chip.x + 4, qy, off ? P.faint : P.ink, { size: fs - 1.5, face: 'body' });
        if (off) return;
        let pos = null;
        if (s === 'travel') pos = along([chip.x + chip.w, qy], [e.x, cy], (t - q.go) / (q.check - q.go));
        else if (s === 'check') pos = [gx, cy];
        else if (t < q.end) pos = along([gx, cy], q.kind === 'answer' ? toAns : toHq, clamp((t - q.out) / (q.end - q.out), 0, 1));
        if (pos) dot(ctx, pos[0], pos[1], 4.5, P.amber, 12);
        if (s === 'answered' || s === 'escalated') {
          // the outcome, written in the free band above or below the employee (never across a frame)
          const col = s === 'answered' ? P.cyan : P.violet, tx = narrow ? bx.x : e.x - (e.x - bx.x) * 0.5, ty = s === 'answered' ? e.y - fs * 0.85 : e.y + e.h + fs * 0.85;
          text(ctx, fit(ctx, `${s === 'answered' ? '✓' : '↗'} ${L(...q.a)}`, outX - tx - 10, fs - 2), tx, ty, col, { size: fs - 2 });
        }
      });
    });
  }

  /* ---------- scene: the countdown ---------- */
  function drawCountdown(ctx, bx, t, M) {
    if (M.date.milestone === 'T-20' && !TRV.thumbMode) {
      // Measured durations share one scale; the calendar below has its own axis.
      const h = 40, x = bx.x + 5, w = bx.w - 10, y = bx.y + 22;
      const split = w * 65 / 68;
      text(ctx, L('11/12 首次通过 · NyxID#2534', '11/12 first pass · NyxID#2534'), x, y - 12, P.ink, { size: 11, weight: 600 });
      ctx.fillStyle = P.magenta; ctx.fillRect(x, y, split - 2, 4);
      ctx.fillStyle = P.cyan; ctx.fillRect(x + split, y, w - split, 4);
      text(ctx, L('排队 ≥65 分钟', 'Queue ≥65 min'), x, y + 12, P.magenta, { size: 10 });
      text(ctx, L('绕行 3 分钟', 'Bypass 3 min'), x + w, y + 12, P.cyan, { size: 10, align: 'right' });
      bx = { ...bx, y: bx.y + h + 5, h: bx.h - h - 5 };
    }
    const fs = clamp(bx.w / 60, 9, 12), axisH = fs * 3.4, labelW = clamp(bx.w * 0.2, 56, 170), gx0 = bx.x + labelW, gx1 = bx.x + bx.w - 10;
    const X = (u) => gx0 + (gx1 - gx0) * u / T_MAX, laneH = (bx.h - axisH) / ROLES.length;
    geo.rows = {};
    ROLES.forEach((r, i) => {
      const y = bx.y + i * laneH, cy = y + laneH / 2, on = M.date.active.includes(r.id);
      geo.rows[r.id] = { x: bx.x, y, w: bx.w, h: laneH };
      if (S.selected === r.id) { rrect(ctx, { x: bx.x - 4, y: y + 2, w: bx.w + 8, h: laneH - 4 }, 6); ctx.strokeStyle = P.amber; ctx.lineWidth = 1.4; ctx.stroke(); }
      text(ctx, fit(ctx, L(...r.short), labelW - 8, fs, 'display', 600), bx.x + 4, cy, on ? P.ink : P.dim, { size: fs, face: 'display', weight: 600 });
      ctx.strokeStyle = P.panelEdge; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(gx0, cy); ctx.lineTo(gx1, cy); ctx.stroke();
      for (let k = 0; k < MILESTONES.length - 1; k++) if (MILESTONES[k].active.includes(r.id)) {
        const a = X(MILESTONES[k].t), b = X(MILESTONES[k + 1].t), h = Math.min(laneH * 0.5, 16), lit = t >= MILESTONES[k].t;
        rrect(ctx, { x: a + 1, y: cy - h / 2, w: b - a - 2, h }, 3); ctx.fillStyle = TRV.alpha(P.cyan, lit ? 0.55 : 0.18); ctx.fill();
      }
      if (MILESTONES[MILESTONES.length - 1].active.includes(r.id)) dot(ctx, X(T_MAX) - 3, cy, 4, TRV.alpha(P.cyan, t >= T_MAX - 1e-9 ? 0.9 : 0.35));
    });
    const ay = bx.y + bx.h - axisH + fs * 0.8;
    ctx.strokeStyle = P.lineHot; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(gx0, ay); ctx.lineTo(gx1, ay); ctx.stroke();
    /* eight gates share the rail, so each tick carries only T-n and the date (the current gate's name is in the header);
       the current tick is labelled first and a label that would touch one already written is left out */
    const ticks = MILESTONES.map((m, k) => {
      const x = X(m.t), cur = M.date.milestone === m.rel, align = k === 0 ? 'left' : k === MILESTONES.length - 1 ? 'right' : 'center';
      ctx.font = `600 ${fs - 1.5}px ${face('data')}`;
      const lw = Math.max(ctx.measureText(m.rel).width, ctx.measureText(m.day.slice(0, 5)).width), x0 = align === 'left' ? x : align === 'right' ? x - lw : x - lw / 2;
      ctx.strokeStyle = cur ? P.amber : P.lineHot; ctx.lineWidth = cur ? 2 : 1; ctx.beginPath(); ctx.moveTo(x, bx.y); ctx.lineTo(x, ay + 4); ctx.globalAlpha = cur ? 0.9 : 0.5; ctx.stroke(); ctx.globalAlpha = 1;
      return { m, x, cur, align, x0, x1: x0 + lw };
    });
    const written = [];
    for (const tk of [...ticks.filter((q) => q.cur), ...ticks.filter((q) => !q.cur)]) {
      if (written.some((q) => tk.x0 < q.x1 + 4 && q.x0 < tk.x1 + 4)) continue;
      written.push(tk);
      text(ctx, tk.m.rel, tk.x, ay + fs * 0.95, tk.cur ? P.amber : P.dim, { size: fs - 1.5, align: tk.align, weight: tk.cur ? 600 : 400 });
      text(ctx, tk.m.day.slice(0, 5), tk.x, ay + fs * 2.15, tk.cur ? P.ink : P.dim, { size: fs - 1.5, align: tk.align, weight: tk.cur ? 600 : 400 });
    }
    const nx = X(t);
    ctx.strokeStyle = P.amber; ctx.lineWidth = 2; ctx.shadowColor = P.amber; ctx.shadowBlur = 10; ctx.beginPath(); ctx.moveTo(nx, bx.y); ctx.lineTo(nx, ay); ctx.stroke(); ctx.shadowBlur = 0;
    dot(ctx, nx, ay, 5, P.amber, 12);
  }

  /* ---------- the stage ---------- */
  let geo = { rows: {} };
  function drawStage() {
    const g = kit.plot($('cv'), { x: [0, 1], y: [0, 1], pad: [0, 0, 0, 0] }), ctx = g.ctx, W = g.W, H = g.H;
    let bx;
    if (TRV.thumbMode) bx = { x: W * 0.06, y: H * 0.1, w: W * 0.88, h: H * 0.8 };
    else {
      const st = $('stage').getBoundingClientRect(), below = (el) => (el ? el.getBoundingClientRect().bottom - st.top : 0);
      TRV.hudFit();
      const top = Math.max(44, below($('hudBig').parentElement), below($('sceneChips'))) + 10, bottom = Math.max(18, $('legend').offsetHeight + 18);
      bx = { x: 16, y: top, w: W - 32, h: Math.max(90, H - top - bottom) };
    }
    const t = clock.t, M = model(t);
    if (S.scene === 'board') drawBoard(ctx, bx, t, M, false);
    else if (S.scene === 'merchant') drawBoard(ctx, bx, t, M, true);
    else if (S.scene === 'gate') drawGate(ctx, bx, t, M);
    else drawCountdown(ctx, bx, t, M);
  }

  /* ---------- the strip ---------- */
  function plotCoverage(cv) {
    const M = model(clock.t), rs = S.scene === 'merchant' ? ROLES.filter((r) => M.view.visible.includes(r.id)) : ROLES, n = rs.length;
    const g = kit.plot(cv, { x: [0, 100], y: [0, n], pad: [70, 40, 6, 18] });
    g.axes({ xTicks: [0, 50, 100], frame: false });
    rs.forEach((r, i) => {
      const y = n - i - 0.5, v = pct(r.ready, r.total);
      g.rect(0, y - 0.32, v, y + 0.32, P.cyan, { alpha: 0.5, stroke: r.id === S.selected ? P.amber : null, width: 1.5 });
      g.rect(v, y - 0.32, 100, y + 0.32, P.violet, { alpha: 0.16 });
      g.text(0, y, L(...r.short), P.ink, { align: 'right', dx: -6, size: 10, face: 'body' });
      g.text(100, y, `${fix(v, 1)}%`, P.dim, { dx: 4, size: 10 });
    });
    const agg = S.scene === 'merchant' ? M.view : M.all;
    g.vline(pct(agg.ready, agg.total), P.ink, { dash: [4, 3], alpha: 0.7 });
    $('pATitle').textContent = L('各岗位就绪覆盖率', 'Readiness by role');
    $('pAMeta').textContent = `${agg.ready} / ${agg.total} = ${fix(pct(agg.ready, agg.total), 1)}%`;
  }
  function plotRail(cv) {
    const t = clock.t;
    if (S.scene === 'countdown') {
      const g = kit.plot(cv, { x: [0, T_MAX], y: [0, ROLES.length + 0.5], pad: [30, 12, 8, 20] }), pts = [];
      for (let u = 0; u <= T_MAX; u += 0.5) pts.push([u, dateAt(u).active.length]);
      g.axes({ yTicks: [0, 3, 6, 9], xTicks: MILESTONES.filter((m) => ['T-20', 'T-6', 'T-0', 'T+1'].includes(m.rel)).map((m) => [m.t, m.rel]) });
      g.line(pts, P.cyan, { width: 2.2 }); g.vline(t, P.amber, { alpha: 0.8 });
      $('pBTitle').textContent = L('沿日期：在岗的岗位数', 'Along the dates: roles on duty'); $('pBMeta').textContent = `${dateAt(t).active.length} / ${ROLES.length}`;
      return;
    }
    if (S.scene === 'merchant') {
      const g = kit.plot(cv, { x: [0, T_MAX], y: [80, 90], pad: [34, 12, 8, 20] }), pts = [];
      for (let u = 0; u <= T_MAX; u += 0.5) { const f = filterAt(u), vs = ROLES.filter((r) => f.visible.includes(r.id)); pts.push([u, pct(sum(vs, 'ready'), sum(vs, 'total'))]); }
      g.axes({ yTicks: [80, 85, 90], xTicks: [0, 20, 40, 60, 80, 100] });
      g.line(pts, P.cyan, { width: 2.2 }); g.vline(t, P.amber, { alpha: 0.8 });
      const M = model(t);
      $('pBTitle').textContent = L('沿筛选：留在板上的覆盖率', 'Along the filter: coverage of what stays'); $('pBMeta').textContent = `${fix(M.view.pct, 1)}%`;
      return;
    }
    const gateScene = S.scene === 'gate', top = gateScene ? 3 : T_MAX, g = kit.plot(cv, { x: [0, T_MAX], y: [-top * 0.05, top * 1.08], pad: [30, 12, 8, 20] }), esc = [], un = [];
    for (let u = 0; u <= T_MAX; u += 0.5) { const m = model(u); esc.push([u, m.escalated]); un.push([u, gateScene ? m.gate.unauthorized : m.probes.unauthorized]); }
    g.axes({ yTicks: gateScene ? [0, 1, 2] : [0, 50, 100], xTicks: [0, 50, 100] });
    g.line(esc, P.violet, { width: 2.2 }); g.line(un, P.ink, { width: 2, dash: [5, 3] }); g.vline(t, P.amber, { alpha: 0.8 });
    g.text(T_MAX, 0, L('越权承诺 = 0', 'unauthorized = 0'), P.ink, { align: 'right', base: 'bottom', dy: -5, dx: -4, size: 10, face: 'body' });
    const M = model(t);
    $('pBTitle').textContent = L('升级账本：升级到人工 / 越权承诺', 'Escalation ledger: to humans / unauthorized'); $('pBMeta').textContent = `${M.escalated} / 0`;
  }
  function drawPlots() { if (TRV.still || TRV.figure) return; plotCoverage($('plotA')); plotRail($('plotB')); }

  /* ---------- words ---------- */
  const LEGEND = {
    board: [['cy box', '已打通、可演示', 'ready and demonstrable'], ['vi box', '人工闸门或路线图', 'human gate or roadmap'], ['am', '当前探测 · 选中', 'current probe · selected']],
    gate: [['cy', '库内：带出处回答', 'in the bank: answered with source'], ['vi', '人工值守队列', 'human queue'], ['am', '当前请求', 'current request']],
    countdown: [['cy box', '在岗', 'on duty'], ['am', '当前日期', 'current date']],
    merchant: [['cy box', '已打通、可演示', 'ready and demonstrable'], ['vi box', '人工闸门或路线图', 'human gate or roadmap'], ['am', '选中的岗位', 'selected role']]
  };
  function drawText() {
    const t = clock.t, M = model(t), sel = BYID[S.selected];
    let big, sub;
    if (S.scene === 'board') {
      big = L(`六核心岗 ${M.core.ready} / ${M.core.total} = ${fix(M.core.pct, 1)}% · 九岗 ${M.all.ready} / ${M.all.total} = ${fix(M.all.pct, 1)}%`,
        `Six core ${M.core.ready} / ${M.core.total} = ${fix(M.core.pct, 1)}% · nine roles ${M.all.ready} / ${M.all.total} = ${fix(M.all.pct, 1)}%`);
      sub = M.probes.fired ? L(`${M.probes.fired} 次越权探测全部升级到人工 · 越权承诺 0`, `${M.probes.fired} out-of-bounds probes, all escalated to humans · 0 unauthorized commitments`)
        : L(`截至 2026-11-27 · ${M.all.gated} 项刻意留在人工闸门或路线图后 · HR 经证据审计下调为 14 / 20`, `as of 2026-11-27 · ${M.all.gated} held behind human gates or on the roadmap · HR audited down to 14 / 20`);
    } else if (S.scene === 'gate') {
      big = L(`升级闸门 · 已升级 ${M.gate.escalated}`, `Escalation gate · ${M.gate.escalated} escalated`);
      sub = M.gate.press === 'escalated' || M.gate.refund === 'escalated' ? L('库内问题带出处回答；库外与未核验的一律交人工 · 越权承诺 0', 'bank questions answered with source; off-bank and unverified go to humans · 0 unauthorized')
        : M.gate.inbank === 'answered' ? L('库内问题：Donna 带出处直接回答', 'in-bank question: Donna answers with its source')
          : L('来宾提问进入 Donna 的核验库比对', 'a guest question is matched against Donna\'s verified bank');
    } else if (S.scene === 'countdown') {
      const m = MILESTONES.find((x) => x.rel === M.date.milestone);
      big = `${M.date.milestone} · ${M.date.text}`;
      sub = L(`${m.label[0]} · 在岗 ${M.date.active.length} / ${ROLES.length} 岗`, `${m.label[1]} · ${M.date.active.length} / ${ROLES.length} roles on duty`);
    } else {
      big = L(`商户视图 · ${M.view.ready} / ${M.view.total} = ${fix(M.view.pct, 1)}%`, `Merchant view · ${M.view.ready} / ${M.view.total} = ${fix(M.view.pct, 1)}%`);
      sub = M.view.visible.length === 2 ? L('起步包：前台礼宾 + 财务台账 · 外部付费商户尚为 0', 'starter pack: front-desk concierge + finance ledger · 0 external paying merchants yet')
        : L(`九岗筛到两岗：还剩 ${M.view.visible.length} 岗`, `filtering nine roles down to two: ${M.view.visible.length} left`);
    }
    $('hudBig').textContent = big; $('hudSub').textContent = sub;
    const leg = LEGEND[S.scene].map(([cl, zh, en]) => `<span><i class="sw ${cl}"></i>${L(zh, en)}</span>`).join('');
    if ($('legend')._h !== leg) { $('legend').innerHTML = leg; $('legend')._h = leg; }
    const k = S.scene === 'merchant' ? M.view : M.all;
    $('roKeyLabel').textContent = S.scene === 'merchant' ? L('留在板上的就绪 / 定义流程', 'Ready / defined on the board') : L('九岗就绪 / 定义流程', 'Nine roles: ready / defined');
    $('roKey').innerHTML = `<span class="c-cy">${k.ready}</span> / ${k.total} = ${fix(pct(k.ready, k.total), 1)}% <span class="nummark">${S.scene === 'merchant' ? '' : M.declared.met ? '✓' : '✗'}</span>`;
    $('roKeySub').textContent = S.scene === 'merchant' ? (M.view.visible.length === 2 ? L('两岗起步包', 'two-role starter pack') : L('筛选中', 'filtering'))
      : L(`六核心岗 ${M.core.ready} / ${M.core.total} = ${fix(M.core.pct, 1)}% · 另有 ${M.all.gated} 项在人工闸门或路线图后`, `six core roles ${M.core.ready} / ${M.core.total} = ${fix(M.core.pct, 1)}% · ${M.all.gated} more behind human gates or roadmap`);
    $('roRole').textContent = `${L(...sel.name)} · ${sel.ready} / ${sel.total} = ${fix(pct(sel.ready, sel.total), 1)}%`;
    $('roEsc').innerHTML = `${M.escalated} <small>${L('越权承诺 0', 'unauthorized 0')}</small>`;
    $('roGate').textContent = L(...sel.line);
    if (S.scene === 'countdown') { $('roXLabel').textContent = L('日期 · 在岗岗位', 'Date · roles on duty'); $('roX').textContent = `${M.date.text} · ${M.date.active.map((id) => L(...BYID[id].short)).join(', ')}`; }
    else { $('roXLabel').textContent = L('商户起步包（两岗）', 'Merchant starter pack (two roles)'); $('roX').textContent = `${M.starter.ready} / ${M.starter.total} = ${fix(M.starter.pct, 1)}% · ${L('外部付费商户 0', '0 external paying merchants')}`; }
    const ms = S.scene === 'countdown' ? MILESTONES.find((x) => x.rel === M.date.milestone) : null;
    $('roNote').textContent = ms && ms.note ? L(...ms.note)
      : L('点舞台上的岗位行切换选中；绿色只留给 Lean 定理，这里的对勾都是页面自己核对的算术。', 'Click a role row on the stage to select it; green is reserved for Lean theorems, so every tick here is the page\'s own arithmetic.');
    $('pillReady').querySelector('strong').textContent = `${k.ready}/${k.total}`;
    $('pillGate').querySelector('strong').textContent = String(k.total - k.ready);
    $('pressBtn').setAttribute('aria-pressed', String(S.press)); $('refundBtn').setAttribute('aria-pressed', String(S.refund));
  }

  const paint = kit.painter(() => { drawText(); drawStage(); drawPlots(); }, [$('stage'), $('plotA'), $('plotB')]);
  const clock = kit.clock({
    range: $('now'), play: $('play'), label: $('tau'), speeds: $('speedChips'), max: T_MAX, rate: 20, step: 5,
    // (the label is first drawn while the clock is being built, so it reads t and S and never the clock itself)
    format: (t) => (S.scene === 'countdown' ? `${dateAt(t).text.slice(0, 11)} <small>${MILESTONES[dateAt(t).milestone].rel}</small>`
      : S.scene === 'board' ? `${L('探测', 'PROBES')} ${Math.floor(t + 1e-9)} <small>/ ${T_MAX}</small>` : S.scene === 'merchant' ? `${L('筛选', 'FILTER')} ${t.toFixed(0)}% <small>/ 100%</small>` : `t ${t.toFixed(0)} <small>/ ${T_MAX}</small>`),
    onChange: () => paint()
  });

  /* ---------- controls ---------- */
  const leave = () => cards.mark(null);
  function setScene(sc, t) {
    S.scene = sc; sceneChips.set(sc, true);
    clock.pause(); clock.set(t == null ? (sc === 'board' ? 0 : T_MAX) : t);
    paint();
  }
  const sceneChips = kit.chips($('sceneChips'), 'scene', (v) => { leave(); setScene(v); });
  $('pressBtn').addEventListener('click', () => { leave(); S.press = !S.press; if (S.scene !== 'gate') setScene('gate'); else paint(); });
  $('refundBtn').addEventListener('click', () => { leave(); S.refund = !S.refund; if (S.scene !== 'gate') setScene('gate'); else paint(); });
  $('rew').addEventListener('click', () => { clock.pause(); clock.set(0); });
  kit.keys({ 1: () => { leave(); setScene('board'); }, 2: () => { leave(); setScene('gate'); }, 3: () => { leave(); setScene('countdown'); }, 4: () => { leave(); setScene('merchant'); } });
  const rowAt = (ev) => {
    const b = $('cv').getBoundingClientRect(), x = ev.clientX - b.left, y = ev.clientY - b.top;
    for (const [id, r] of Object.entries(geo.rows || {})) if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return id;
    return null;
  };
  $('cv').addEventListener('click', (ev) => { const id = rowAt(ev); if (id && id !== S.selected) { S.selected = id; paint(); } });
  $('cv').addEventListener('pointermove', (ev) => { $('cv').style.cursor = rowAt(ev) ? 'pointer' : 'default'; });

  /* ---------- experiment cards ---------- */
  const PRESETS = {
    'six-roles': { scene: 'board', selected: 'donna', press: true, refund: false, still: 0 },
    'donna-gate': { scene: 'gate', selected: 'donna', press: true, refund: false, play: true, still: 35 },
    countdown: { scene: 'countdown', selected: 'donna', press: true, refund: false, play: true, still: 70 },
    merchant: { scene: 'merchant', selected: 'finance', press: true, refund: false, play: true, still: 100 }
  };
  const NOTES = {
    'six-roles': ['截至 2026-11-27（nyxid-nyxbot-trials@df5ef47）的账本：上方六行是六个小企业核心岗，合计 82 / 99 = 82.8%；分隔线下是三个独立值守岗：舆情 6 / 7、知识库 3 / 3、11-27 新增的复盘分析员 11 / 11，九岗合计 102 / 120 = 85.0%。青色格已打通，紫色格刻意留在人工闸门后或仍在路线图上。HR 在严格证据审计里从 15 / 20 下调到 14 / 20：账本不刷绿。', 'The ledger as of 2026-11-27 (nyxid-nyxbot-trials@df5ef47): the top six rows are the six core small-business roles, 82 / 99 = 82.8% together; below the divider sit three standalone roles: Sentiment 6 / 7, KB 3 / 3 and the Retrospective Analyst added on Nov 27, 11 / 11, for 102 / 120 = 85.0% across all nine. Cyan cells are ready; violet cells are deliberately kept behind a human gate or still on the roadmap. A strict evidence audit moved HR down from 15 / 20 to 14 / 20: the ledger is not painted green.'],
    'donna-gate': ['两位来宾向 Donna 提问：库内的“几点开始”带着出处直接回答；库外的融资追问不临场编造，记录后升级到 contact@chrono-ai.fun 的人工队列。越权承诺 0。', 'Two guests ask Donna: "when does it start" is in the bank and is answered with its source; the off-bank question about financing is not improvised but recorded and escalated to the human queue at contact@chrono-ai.fun. Zero unauthorized commitments.'],
    countdown: ['从 11-27 的全流程彩排（12 段中 11 段一次通过，已完成）出发，经 12-04 10:00 SGT 第一波订座开放、12-08 第二波媒体包、12-11 压测与直播演练、12-15 产物冻结、12-16 Discord 正式彩排，到 12-17 16:00 SGT 线上直播与 12-18 回放切片；每个里程碑点亮当天在岗的岗位。直播时九岗中七岗在岗：HR 照常处理后台流程，复盘分析员等到周一复盘。', 'From the Nov 27 full-flow rehearsal (11 of 12 stages passed on the first try; done), through the Dec 4 10:00 SGT wave 1 booking open, the Dec 8 wave 2 press kit, the Dec 11 load and stream drill, the Dec 15 artifact freeze and the Dec 16 formal Discord dress rehearsal, to the Dec 17 16:00 SGT live broadcast and the Dec 18 replay clips; each milestone lights up the roles on duty. During the broadcast seven of the nine roles are on duty: HR keeps to its background workflows and the Retrospective Analyst waits for its Monday review.'],
    merchant: ['把九岗一步步筛掉：先是三个独立值守岗，再依次是行政、HR、社群与 Auto-X，只留前台礼宾与财务台账两岗：(14 + 24) / (15 + 28) = 38 / 43 = 88.4%。这是外部门店上手的起步视图；截至 2026-11-27 外部付费商户仍为 0，首批试点刚刚开放。', 'Filter the nine roles step by step: first the three standalone roles, then Admin, HR, Community and Auto-X one after another, down to the front-desk concierge and the finance ledger: (14 + 24) / (15 + 28) = 38 / 43 = 88.4%. It is the starting view for an outside store; as of 2026-11-27 external paying merchants are still 0, and the first pilot cohort is just opening.']
  };
  const FIGURE_NOTES = {
    'six-roles': ['六核心岗 82 / 99 = 82.8%，九岗 102 / 120 = 85.0%；HR 经证据审计下调为 14 / 20。', 'Six core roles 82 / 99 = 82.8%, nine roles 102 / 120 = 85.0%; HR audited down to 14 / 20.'],
    'donna-gate': ['库内问题带出处回答，库外追问升级到人工。', 'In-bank questions are answered with sources; off-bank ones escalate to humans.'],
    countdown: ['12-17 16:00 SGT 直播时，九岗中七岗在岗。', 'At the Dec 17 16:00 SGT broadcast, seven of the nine roles are on duty.'],
    merchant: ['筛到两岗起步包：38 / 43 = 88.4%。', 'Filtered to the two-role starter pack: 38 / 43 = 88.4%.']
  };
  let booting = true;
  function applyPreset(id) {
    const p = PRESETS[id];
    S.selected = p.selected; S.press = p.press; S.refund = p.refund;
    setScene(p.scene, p.still);
    if (!p.play || TRV.still || (booting && !TRV.embed)) return;
    clock.set(0);
    if (booting) kit.autoplay(clock, $('stage')); else clock.play();
  }
  const cards = kit.cards($('presets'), { presets: PRESETS, notes: TRV.figure ? FIGURE_NOTES : NOTES, noteEl: $('presetNote'), tour: $('tour'), onPick: applyPreset,
    idle: ['自由探索：换场景、点岗位行、开关闸门模拟、拖时间轴。随时可以再选一张卡。', 'Free play: switch scenes, click role rows, toggle the gate simulator, scrub the rail. Pick a card again at any time.'] });

  TRV.drawer({ drawer: $('drawer'), open: $('infoBtn'), close: $('drawerClose') });
  TRV.startGlitch(document.querySelector('.brand'));

  /* ---------- probe for the browser suite, cover, start ---------- */
  window.OPS_LEDGER_DEBUG = {
    get state() {
      const M = model(clock.t);
      return { scene: S.scene, t: clock.t, max: clock.max, playing: clock.playing, preset: cards.current, selected: S.selected, press: S.press, refund: S.refund,
        roles: M.roles, all: M.all, core: M.core, declared: M.declared, view: M.view, starter: M.starter, probes: M.probes, gate: M.gate, date: M.date, escalated: M.escalated,
        drawnRows: Object.keys(geo.rows || {}) };
    },
    /** The probes of the board scene at time t: which gated workflow each one targeted. */
    targets: (t) => Array.from({ length: Math.floor(t + 1e-9) }, (_, i) => GATED[i % GATED.length].slice()),
    scene: (sc, t) => setScene(sc, t), seek: (t) => { clock.pause(); clock.set(t); },
    /** Viewport coordinates of the middle of a role's row on the stage (for pointer tests). */
    point: (id) => { const r = (geo.rows || {})[id], b = $('cv').getBoundingClientRect(); return r ? { x: b.left + r.x + r.w * 0.45, y: b.top + r.y + r.h / 2 } : null; }
  };
  /** Cover: the nine-role board mid-probe, the human lines visible on every row. */
  window.TRV_THUMB = () => { S.selected = 'donna'; setScene('board', 46.5); paint.now(); };
  cards.pick(cards.initial('six-roles'));   // a chapter may cite another card: ::: {.viz src="ai-team-work-ledger" preset="countdown"}
  booting = false;
  paint();
})();
