---
# 01 封面
theme: ../../../../theme/slides
title: "把发布会交给 AI 员工 · AI 员工方案"
info: "面向店主、工作室与部署伙伴：六岗 AI 员工怎样分工、在哪儿停、怎样两周上岗，以及服务商怎样持临时能力句柄进场。"
htmlAttrs:
  lang: "zh-CN"
  data-polarity: "daylight"
  data-tr-palette: "paper"
colorSchema: "light"
defaults:
  class: "tr-own-bg tr-daylight"
deck:
  code: "CHRONO//OPS"
  book: "把发布会交给 AI 员工"
  title: "AI 员工方案"
  version: "0.1.0"
  blurb: "77/97 与 20 项人工闸门与路线图边界、Donna 问答闸门、五步上岗与服务商进场闭环。"
layout: cover
preloadImages: false
---

<p class="kicker">ChronoAI · AI 员工方案</p>
<h1 class="display">把发布会<br>交给 <em>AI 员工</em></h1>
<p class="lead">从周一早九点的真实工作流，<br>到可审计、可随时吊销的商户与服务商方案。</p>

---
# 02 为什么失败
section: "为什么失败"
---

<div class="body">
  <p class="kicker">入职第一周</p>
  <h2 class="t">为什么大多数「AI 员工」<em class="warn">活不过第一周</em>？</h2>
  <div class="g3 mt-l">
    <div class="card"><h4>01 · 无分工</h4><h3>一个万能窗口</h3><p>财务、客服、宣发塞进同一个上下文：第一周，报价就错了两位小数。</p></div>
    <div class="card"><h4>02 · 无门禁</h4><h3>明文密码直给</h3><p>密钥躺在环境变量里，一页带毒的网页就能全部带走。</p></div>
    <div class="card"><h4>03 · 无刹车</h4><h3>没有审批闸门</h3><p>第二周，它在社群里替公司许下兑现不了的售后承诺，没人拦得住。</p></div>
  </div>
  <p class="lead mt-l">错的不是「雇佣 AI 员工」这件事，而是<b>雇佣它的方式</b>。</p>
</div>
<Source>《把发布会交给 AI 员工》第一章</Source>

---
# 03 真实一天
section: "真实一天"
---

<div class="body">
  <p class="kicker">今天在跑的四件差事</p>
  <h2 class="t">四件今天在跑的差事，<em>每件都知道在哪儿停</em></h2>
  <div class="g4 mt-l">
    <div class="tile"><i>street-corner 前厅</i><b>礼宾 Donna</b><span><em>做</em>：先落锁拿到 seat_id，再说「已留好」。</span><span><em class="hl-magenta">停</em>：库外追问，升级给人。</span></div>
    <div class="tile"><i>演示账本</i><b>财务员 NyxBot</b><span><em>做</em>：票据归类、对账、异常告警。</span><span><em class="hl-magenta">停</em>：任何一笔对外打款。</span></div>
    <div class="tile"><i>三个时区</i><b>社媒 Auto-X</b><span><em>做</em>：起草线程，建议发布窗口。</span><span><em class="hl-magenta">停</em>：里程碑官宣，等人按键。</span></div>
    <div class="tile"><i>客厅</i><b>Living with AI</b><span><em>做</em>：读取家中传感器。</span><span><em class="hl-magenta">停</em>：动执行器之前，先问主人。</span></div>
  </div>
  <p class="lead mt-l">会做事不稀奇；<b>知道在哪儿停</b>，才是能雇的员工。</p>
</div>
<Source>《把发布会交给 AI 员工》第二、三章 · nyx-homeassistant-node@v1.1.1-alpha.52 · 截至 2026-11-25</Source>

---
# 04 分工红线
section: "分工红线"
---

<div class="body">
  <p class="kicker">六岗账本 · 截至 2026-11-25</p>
  <h2 class="t">77 项交给 AI，<em>20 项留守闸门与路线图</em></h2>
  <img class="mt" src="./img/ch01-human-ai-boundary.zh.svg" alt="AI 员工执行区与人类授权边界：六个岗位已覆盖 77/97 项工作流；资金拨付、对外法律承诺、未经批准的媒体表述与不可逆撤销留给人类" style="height: 460px; width: auto; max-width: 100%; object-fit: contain; display: block; margin: 0 auto;">
  <p class="lead mt">97 项流程里，AI 打通 77 项（79.4%）；剩下 20 项留守人工闸门或路线图边界。</p>
</div>
<Source>nyxbot-finance · nyxid-nyxbot-trials · 六岗账本截至 2026-11-25</Source>

---
# 05 前厅实景
section: "前厅实景"
---

<div class="body">
  <p class="kicker">street-corner · 虚拟前厅</p>
  <h2 class="t"><em>1,108</em> 个座位：先落锁，再开口</h2>
  <div class="g2 mt">
    <img src="./img/street-corner.png" alt="street-corner 三维前厅实景：Donna 接待台、广场主通道与 Flower Town 入口" style="height: 470px; width: auto; max-width: 100%; object-fit: contain; display: block; margin: 0 auto;">
    <img src="./img/ch02-seat-ring-allocation.zh.svg" alt="六圈剧场席位由内至外 96、144、176、204、232、256 席，合计 1,108 席，另有 18 座花篮位" style="height: 470px; width: auto; max-width: 100%; object-fit: contain; display: block; margin: 0 auto;">
  </div>
  <p class="lead mt">Donna（13 / 15）守接待台，小花守 18 座花篮；满座后，第 1,109 位起分流到直播。</p>
</div>
<Source>street-corner · chrono-metaverse · 《把发布会交给 AI 员工》第二章</Source>

---
# 06 记者问答闸门
section: "记者问答闸门"
---

<div class="body">
  <p class="kicker">Donna · 30 题核验库</p>
  <h2 class="t">30 题之内带出处答，<em>30 题之外不编</em></h2>
  <div class="split mt">
    <img src="./img/ch04-qa-gating-flow.zh.svg" alt="Donna 问答闸门：命中 30 题库则忠实作答并附日期与仓库来源；未命中则经披露红线检查后记录并升级至 contact@chrono-ai.fun" style="height: 560px; width: auto; max-width: 100%; object-fit: contain; display: block; margin: 0 auto;">
    <div style="align-self: center;">
      <div class="card"><h4>01 · 库内</h4><p>命中 30 题核验库：给出带日期、带仓库出处的原话。</p></div>
      <div class="card hot mt-s"><h4>02 · 红线</h4><p>融资数字、模型标识、夸大表述：一律不答。</p></div>
      <div class="card mt-s"><h4>03 · 库外</h4><p>不猜，不补充：记录提问，升级至 contact@chrono-ai.fun；<br>人类 24 小时内跟进。</p></div>
    </div>
  </div>
</div>
<Source>《把发布会交给 AI 员工》第四章 · 30 题核验库 · 核对 2026-11-26 至 11-27</Source>

---
# 07 幕后五岗
section: "幕后五岗"
---

<div class="body">
  <p class="kicker">幕后五岗 · 四条流水线 · 截至 2026-11-25</p>
  <h2 class="t">幕后五岗，<em>每一岗的分母都写在账上</em></h2>
  <div class="g4 mt-l">
    <Stat value="9/11" label="社群运营 · 已跑 75 次彩排动作；争议调解与封禁申诉归人" />
    <Stat value="11/13" label="社媒 Auto-X · 三时区排期；里程碑官宣等人按键" />
    <Stat value="24/28" label="财务员 NyxBot · 只读与起草，仅在演示账本；不持打款权限" />
    <div>
      <Stat class="md" value="15/20" label="HR 模板包 · 定级与 Offer 签发归人" />
      <Stat class="md mt-s" value="5/10" label="行政 · 合同签章与高额采购归人" />
    </div>
  </div>
  <p class="lead mt-l">没打通的，就写没打通。</p>
</div>
<Source>nyxid-nyxbot-trials · nyxbot-finance · chrono-hr · 截至 2026-11-25</Source>

---
# 08 十五天剧本
section: "十五天剧本"
---

<div class="body">
  <p class="kicker">2026-12-04 至 12-18 · 新加坡时间</p>
  <h2 class="t">十五天，<em>每道闸门提前刻成剧本</em></h2>
  <div class="split mt">
    <img src="./img/ch05-event-countdown-milestones.zh.svg" alt="发布会十五天里程碑：12-04 开放预约、12-08 媒体包、12-11 负载与演练、12-15 彩排与冻结、12-17 直播、12-18 切片、工单与商户跟进" style="height: 540px; width: auto; max-width: 100%; object-fit: contain; display: block; margin: 0 auto;">
    <div style="align-self: center;">
      <ul class="plain">
        <li><b class="mono hl-cyan">12-04</b>　开放预约，前厅开门</li>
        <li><b class="mono hl-cyan">12-11</b>　1,250 并发冲击选座锁 · 20 条红线诱导</li>
        <li><b class="mono hl-cyan">12-15</b>　全要素彩排，产物封板</li>
        <li><b class="mono hl-cyan">12-17</b>　16:00–17:15 SGT 双流直播</li>
        <li><b class="mono hl-cyan">12-18</b>　切片上架，工单与商户跟进</li>
      </ul>
      <p class="lead mt">12-11 验收线：<br>红线诱导 100% 拒绝编造，并正确升级。</p>
    </div>
  </div>
</div>
<Source>chrono-goals/goals/chronoai-launch-event.yaml · 《把发布会交给 AI 员工》第五章</Source>

---
# 09 商户上手
layout: section
chapter: "01"
section: "商户上手"
---

<p class="kicker">给你的店</p>
<h2 class="t">别第一周招六个，<br><em>从「前台 + 对账」两位开始</em></h2>
<p class="lead">前台接走营业时间、价格口径与预约；<br>对账只读流水，每晚留一页三分钟能读完的简报。两位都不碰打款。</p>

---
# 10 五步上岗
section: "五步上岗"
---

<div class="body">
  <p class="kicker">五步上岗 · 两周试跑</p>
  <h2 class="t">五步上岗，<em>不达标不进下一步</em></h2>
  <div class="split mt" style="grid-template-columns: auto 1fr;">
    <img src="./img/ch06-merchant-onboarding-steps.zh.svg" alt="商户五步上手：创建 NyxID 账户、连接门店渠道、选择 Ornn 入门技能、配置审批与消费上限、上线运营" style="height: 560px; width: auto; max-width: 100%; object-fit: contain; display: block; margin: 0 auto;">
    <div style="align-self: center;">
      <p class="kicker">14 天出场标准</p>
      <dl class="readout" style="grid-template-columns: max-content 1fr;">
        <dt>明文密钥</dt><dd class="cy">0</dd>
        <dt>诱导拦停</dt><dd>10 / 10</dd>
        <dt>人工复核</dt><dd>每日 3 分钟</dd>
        <dt>计价与封顶</dt><dd style="font-size: 38px;">1 credit = 1 USD · 单代理封顶</dd>
        <dt>连续试跑</dt><dd>14 天</dd>
      </dl>
    </div>
  </div>
</div>
<Source>chrono-goals/goals/chronoai-first-merchant.yaml · 《把发布会交给 AI 员工》第六章</Source>

---
# 11 部署伙伴
layout: section
chapter: "02"
section: "部署伙伴"
---

<p class="kicker">部署伙伴 · 门禁卡只是类比</p>
<h2 class="t">平台铺路，<br><em>服务商拿临时门禁卡进场</em></h2>
<p class="lead">钥匙留在 NyxID 金库里；<br>服务商拿到的是窄作用域、短寿命的能力句柄，活一干完，当场收回。</p>

---
# 12 服务商闭环
section: "服务商闭环"
---

<div class="body">
  <p class="kicker">一单活，从进场到收尾</p>
  <h2 class="t">进场、干活、收卡，<em>把经验封成技能</em></h2>
  <div class="flow mt-l">
    <div class="step"><span class="i">01 · 签约</span><b>直接签约</b><p>服务商与商户直接签约；安装与运维费用由双方约定。</p></div>
    <div class="step"><span class="i">02 · 进场</span><b>临时句柄</b><p>NyxID 发放窄作用域、会过期的能力句柄；全程不碰明文密码。</p></div>
    <div class="step"><span class="i">03 · 收回</span><b>一键吊销</b><p>完工即吊销，CMA 约 2.1 s 收敛。</p></div>
    <div class="step"><span class="i">04 · 沉淀</span><b>封进 Ornn</b><p>扫描并冻结跑通的流程，<br>复用到下一家店。</p></div>
  </div>
  <p class="lead mt-l">钥匙从不离开金库；服务商带走的，是封进 Ornn 的那份手艺。</p>
</div>
<Source>NyxID 能力句柄 · CMA 热吊销 · Ornn 版本冻结 · 《整车工程》第一、三、四章</Source>

---
# 13 诚实起点
section: "诚实起点"
---

<div class="body">
  <p class="kicker">不化妆 · 截至 2026-11-25</p>
  <h2 class="t">今天的起点，<em>一个数字都不化妆</em></h2>
  <div class="g2 mt">
    <div class="card">
      <h4>今天在跑</h4>
      <ul class="plain">
        <li>NyxID 公开注册，无需邀请码</li>
        <li>Ornn：nyx-skills 里 163 项公开技能</li>
        <li>六岗 77 / 97 项流程，跑在内部与演示账本上</li>
      </ul>
    </div>
    <div class="card hot">
      <h4>还没有的</h4>
      <Stat value="0" label="家外部付费商户；首批试点 12-17 开放申请" tone="magenta" />
      <p class="mt">平台派单与担保结算在路线图上；服务商与商户直签，今天就能开始。</p>
    </div>
  </div>
</div>
<Source>chrono-goals/goals/chronoai-first-merchant.yaml · 《把发布会交给 AI 员工》第四、六章</Source>

---
# 14 结尾
layout: cover
---

<p class="kicker">首批试点 · 12-17 开放申请</p>
<h1 class="display">成为首批试点商户<br>或<em>部署伙伴</em></h1>
<p class="lead">一封 200 字以内的简信：<br>你的行业、最耗时的两件重复工作、绝不放权的那条红线。</p>
<dl class="readout mt">
  <dt>邮件</dt><dd class="cy">contact@chrono-ai.fun</dd>
  <dt>官网</dt><dd><a href="https://chrono-ai.fun/">chrono-ai.fun</a></dd>
</dl>
