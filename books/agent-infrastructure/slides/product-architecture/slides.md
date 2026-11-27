---
# 01 封面
theme: ../../../../theme/slides
title: "整车工程 · 产品架构"
info: "《整车工程》配套演示：六个把智能体原型撞散的工程死穴，以及 NyxID、NyxBot、Ornn、CMA、heca、chrono-harness 给出的机械解法。"
htmlAttrs:
  lang: "zh-CN"
deck:
  code: "CHRONO//STACK"
  book: "整车工程"
  title: "产品架构"
  version: "0.1.0"
  blurb: "六个工程死穴与六道机械解法：从零密钥代理到可执行判官，附诚实成熟度矩阵。"
layout: cover
preloadImages: false
---

<p class="kicker">ChronoAI · 产品架构</p>
<h1 class="display">整车<em>工程</em></h1>
<p class="lead">六个能把智能体原型当场撞散的工程死穴，<br>以及我们焊上去的六道机械解法。</p>

---
# 02 总览：六个死穴，六道硬门
section: "总览"
---

<div class="body">
  <p class="kicker">六个死穴 · 六道硬门</p>
  <h2 class="t">从聊天玩具到生产系统，<em>要过六道硬门</em></h2>
  <table class="t mt">
    <thead><tr><th>#</th><th>死穴</th><th>机械解</th><th>一条不变量</th></tr></thead>
    <tbody>
      <tr><td class="mono">01</td><td>明文泄露</td><td><span class="mono hl-cyan">NyxID</span></td><td>智能体上下文里的明文密钥恒为 0</td></tr>
      <tr><td class="mono">02</td><td>失控递归</td><td><span class="mono hl-cyan">NyxBot</span></td><td>自动触发封顶：每小时 30 次、每日 300 次</td></tr>
      <tr><td class="mono">03</td><td>提示词漂移</td><td><span class="mono hl-cyan">Ornn</span></td><td>技能先扫描、冻结版本，再上岗</td></tr>
      <tr><td class="mono">04</td><td>分支互踩</td><td><span class="mono hl-cyan">CMA · heca</span></td><td>一任务一隔离 Git 工作树（heca）</td></tr>
      <tr><td class="mono">05</td><td>空口规范</td><td><span class="mono hl-cyan">chrono-harness</span></td><td>未登记依赖的文件直接拒收，绝不靠猜</td></tr>
      <tr><td class="mono">06</td><td>困在终端</td><td><span class="mono hl-cyan">chrono-metaverse · Living with AI</span></td><td>同一套 NyxID 护栏伸进空间与家居</td></tr>
    </tbody>
  </table>
</div>
<Source>《整车工程》第一至七章与附录 B · 核对 2026-11-25 至 11-27</Source>

---
# 03 死穴一：密钥
layout: section
chapter: "01"
section: "死穴一 · 密钥"
---

<p class="kicker">死穴 01 · 明文密钥</p>
<h2 class="t">永远别把保险柜密码<br><em>贴在信封背面</em></h2>
<p class="lead">把生产密钥写进 <code>.env</code>，交给一个会读外部网页的智能体——这就是那只信封。一页带毒的网页，就能把每一把钥匙寄走。</p>

---
# 04 NyxID：零密钥代理
section: "NyxID"
---

<div class="body">
  <p class="kicker">NyxID · v0.78.0</p>
  <h2 class="t">智能体只拿句柄，<em>永远摸不到明文密钥</em></h2>
  <div class="split mt">
    <img src="./img/ch01-nyxid-proxy-layers.zh.svg" alt="NyxID 四层零密钥代理：智能体上下文、策略与审批关口、加密凭据库、上游服务" style="height: 560px; width: auto; max-width: 100%; object-fit: contain; display: block; margin: 0 auto;">
    <div style="align-self: center;">
      <Stat value="0" label="条明文密钥进入智能体上下文" />
      <dl class="readout mt">
        <dt>迭代</dt><dd>8 周 63 个次版本</dd>
        <dt>注册</dt><dd>公开 · 无需邀请码</dd>
        <dt>计量</dt><dd class="cy">1 credit = 1 USD</dd>
        <dt>密钥</dt><dd>支持 BYOK</dd>
      </dl>
    </div>
  </div>
</div>
<Source>ChronoAIProject/NyxID@v0.78.0 · api.nyxid.ai 公开配置 · 2026-11-03 至 11-26</Source>

---
# 05 死穴二：失控
layout: section
chapter: "02"
section: "死穴二 · 失控"
---

<p class="kicker">死穴 02 · 失控递归</p>
<h2 class="t">万能聊天框，<br>必死于<em>上下文浑浊与事件风暴</em></h2>
<p class="lead">财务准则、30 题口径、1,108 个座位和最新提交，全塞进同一个窗口：指令开始互相打架，出了错也说不清是哪一条带偏了它。</p>
<p class="sm muted mt">口径快照：30 题问答库截至 2026-11-27（第四卷第四章）· 1,108 席截至 2026-11-25</p>

---
# 06 NyxBot：有硬预算的专家网格
section: "NyxBot"
---

<div class="body">
  <p class="kicker">NyxBot · NyxAgent · nyx-assistant-sdk</p>
  <h2 class="t">把巨型聊天框拆成<em>有硬预算的专家网格</em></h2>
  <div class="split mt">
    <img src="./img/ch02-nyxbot-specialist-mesh.zh.svg" alt="NyxBot 专项代理网格：默认 8 名专家、上限 32、每组 8、记忆槽 50、触发 30 次每小时与 300 次每日" style="height: 540px; width: auto; max-width: 100%; object-fit: contain; display: block; margin: 0 auto;">
    <div style="align-self: center;">
      <Stat value="300" unit="次/日" label="自动触发硬上限，另限每小时 30 次" />
      <ul class="plain mt">
        <li>上限写死在 <code>assistant_settings.rs</code>，不靠提示词自觉</li>
        <li><code>nyx-assistant-sdk</code>：浏览器只与 NyxID 会话握手，前端零密钥</li>
      </ul>
    </div>
  </div>
</div>
<Source>ChronoAIProject/NyxID@v0.78.0 · backend/src/models/assistant_*.rs · 2026-11-03</Source>

---
# 07 死穴三：漂移
layout: section
chapter: "03"
section: "死穴三 · 漂移"
---

<p class="kicker">死穴 03 · 提示词漂移</p>
<h2 class="t">复制粘贴七次的 Markdown<br>不是工程，<em>是定时炸弹</em></h2>
<p class="lead">能触发真实 API 写操作的指令，就是可执行软件：<br>要版本号，要安全扫描，要声明它需要哪些权限。</p>

---
# 08 Ornn：技能生命周期
section: "Ornn"
---

<div class="body">
  <p class="kicker">Ornn · v0.18.0 Alpha · nyx-skills</p>
  <h2 class="t">技能是可执行软件，<em>就按软件的规矩管</em></h2>
  <div class="split mt">
    <img src="./img/ch03-ornn-skill-lifecycle.zh.svg" alt="Ornn 五段式技能生命周期：编写或生成、AgentSeal 扫描、冻结版本、绑定 NyxID 服务、智能体拉取与审计" style="height: 540px; width: auto; max-width: 100%; object-fit: contain; display: block; margin: 0 auto;">
    <div style="align-self: center;">
      <Stat value="286" label="份测试文件——先数测试，再听功能" />
      <dl class="readout mt">
        <dt>接口</dt><dd>134 个 OpenAPI 操作</dd>
        <dt>技能</dt><dd>163 项公开</dd>
        <dt>扫描</dt><dd>AgentSeal</dd>
        <dt>SDK</dt><dd>TS 0.4.0 · Py 0.2.0</dd>
      </dl>
    </div>
  </div>
</div>
<Source>ChronoAIProject/Ornn@v0.18.0（109 路径 · 2026-11-19 / 11-27）· nyx-skills@d77457c（2026-11-27）</Source>

---
# 09 死穴四：并发
layout: section
chapter: "04"
section: "死穴四 · 并发"
---

<p class="kicker">死穴 04 · 并发互踩</p>
<h2 class="t">云端免运维与本地百手并行，<br><em>需要两座驾驶舱</em></h2>
<p class="lead">店主要一个什么都不用配的云端岗位；<br>工程师要几十个智能体同时开工，而且互不踩分支。</p>

---
# 10 CMA：云端托管与热吊销
section: "CMA"
---

<div class="body">
  <p class="kicker">CMA · ChronoAI Managed Agent · cma.nyxid.ai</p>
  <h2 class="t">改权限不重启沙箱：约 <em>2.1 秒</em>热收敛</h2>
  <div class="flow mt-l">
    <div class="step"><span class="i">01 · 沙箱</span><b>隔离执行</b><p>每个实例独立沙箱与文件树，<br>切断跨租户污染。</p></div>
    <div class="step"><span class="i">02 · cmaeg</span><b>事件网关</b><p>验签、去重、防抖；外发先 <code>prepare</code> 再 <code>commit</code>。</p></div>
    <div class="step"><span class="i">03 · 运行时</span><b>凭证热重载</b><p>NyxID 改绑定或吊销，约 2.1 s 生效。</p></div>
    <div class="step"><span class="i">04 · 界面</span><b>审计面板</b><p>事件流、转录、权限请求，<br>一屏看清。</p></div>
  </div>
  <div class="card mt-l">
    <h4>当前边界</h4>
    <p>托管实例目前聚焦单一主编码运行时；异构运行时的公开热切换仍在路线图上。</p>
  </div>
</div>
<Source>《整车工程》第四章 · cma.nyxid.ai · 核对 2026-11-26</Source>

---
# 11 heca：本地优先编排
section: "heca"
---

<div class="body">
  <p class="kicker">heca · 本地优先编排</p>
  <h2 class="t">二十七类智能体，<em>一个任务一棵工作树</em></h2>
  <div class="split mt">
    <img src="./img/ch05-heca-worktree-topology.zh.svg" alt="heca 本地优先画布：27 类智能体接入，每个工作代理一棵隔离 Git 工作树、实时终端与浏览器面板，统一权限队列与目标账本" style="height: 560px; width: auto; max-width: 100%; object-fit: contain; display: block; margin: 0 auto;">
    <div style="align-self: center;">
      <Stat value="27" label="类智能体：6 类主供应方 + 21 类 ACP 智能体" />
      <dl class="readout mt">
        <dt>夜间构建</dt><dd>361 个</dd>
        <dt>审批</dt><dd>统一权限队列</dd>
        <dt>目标</dt><dd>Goal Ledger</dd>
        <dt>源码</dt><dd class="hot">待公开</dd>
      </dl>
    </div>
  </div>
</div>
<Source>《整车工程》第五章 · 核对 2026-11-26</Source>

---
# 12 死穴五：规矩
layout: section
chapter: "05"
section: "死穴五 · 规矩"
---

<p class="kicker">死穴 05 · 空口规范</p>
<h2 class="t">礼貌的提示词，<br>管不住<em>每小时 59 次提交</em></h2>
<p class="lead">以 <code>the-omega-institute/trureturing</code> 为例：2026-10-21 至 11-19 连续 720&nbsp;个 UTC 小时，每小时提交中位数 59 次。</p>

---
# 13 chrono-harness：可执行判官
section: "chrono-harness"
---

<div class="body">
  <p class="kicker">chrono-harness v0.1.4 · sshx v1.0.0-beta.58</p>
  <h2 class="t">判官写进二进制，<em>不写进提示词</em></h2>
  <div class="split mt">
    <img src="./img/ch06-harness-delta-pipeline.zh.svg" alt="chrono-harness 增量判定流水线：Git 差异、FILEMAP 明确登记、传递 DELTA 选择、执行候选判官、通过或失败证据回执" style="height: 580px; width: auto; max-width: 100%; object-fit: contain; display: block; margin: 0 auto;">
    <ul class="plain" style="align-self: center;">
      <li><b>FILEMAP</b>：漏登依赖即拒收，绝不靠猜</li>
      <li><b>DELTA</b>：只跑改动波及的检查；<br>改一章文字，只唤醒 2&nbsp;/&nbsp;14 个单元（示意模型）</li>
      <li><code>policy.mixed-warning</code>：规则与产品同改，即刻告警</li>
      <li><code>completeness_proven: false</code>：不宣称穷尽完备</li>
    </ul>
  </div>
</div>
<Source>ChronoAIProject/chrono-harness v0.1.4（2026-11-13）· sshx v1.0.0-beta.58（ChronoAIProject/consensus-rnd，2026-11-25）</Source>

---
# 14 屏幕之外
section: "屏幕之外"
---

<div class="body">
  <p class="kicker">死穴 06 · 困在终端</p>
  <h2 class="t">同一套护栏，<em>从三维空间伸进客厅</em></h2>
  <img class="mt" src="./img/ch07-physical-digital-twin.zh.svg" alt="数字与物理双面延伸：chrono-metaverse 三维空间与 chrono-cd 部署，Living with AI 经 nyx-homeassistant-node 与 NyxID 权限连接传感器和执行器" style="height: 460px; width: auto; max-width: 100%; object-fit: contain; display: block; margin: 0 auto;">
  <p class="lead mt">读传感器，自动执行；动高危物理执行器，必须先经人类确认。</p>
</div>
<Source>ChronoAIProject/nyx-homeassistant-node@v1.1.1-alpha.52（2026-11-04）· 《整车工程》第七章</Source>

---
# 15 诚实成熟度矩阵
section: "诚实边界"
---

<div class="body">
  <p class="kicker">成熟度矩阵 · 核对 2026-11-25 至 11-27</p>
  <h2 class="t">今天在跑的，和<em class="magenta">还没做到的</em></h2>
  <table class="t mt">
    <thead><tr><th>组件</th><th>今天在跑</th><th>当前边界</th></tr></thead>
    <tbody>
      <tr><td class="mono">NyxID</td><td>公开上线 · v0.78.0 · 开放注册</td><td>仍在高频周迭代；企业级 SLA 随首批商户打磨</td></tr>
      <tr><td class="mono">Ornn</td><td>公开 Alpha · v0.18.0 · 163 项公开技能</td><td>Alpha 阶段；第三方投稿审核流仍在扩充</td></tr>
      <tr><td class="mono">CMA</td><td>云端运行 · 约 2.1 s 热吊销</td><td>当前只开放单一主编码运行时</td></tr>
      <tr><td class="mono">heca</td><td>内部生产服役 · 361 个夜间构建</td><td>源码尚未公开</td></tr>
      <tr><td class="mono">chrono-harness</td><td>公开开源 · v0.1.4 · 16 个二进制</td><td><code>completeness_proven: false</code></td></tr>
      <tr><td class="mono">NyxBot Finance</td><td>演示账本跑通 24 / 28 项流程</td><td>外部付费商户 0；只读与起草，不持打款权限</td></tr>
    </tbody>
  </table>
</div>
<Source>《整车工程》附录 B · 信任边界与诚实成熟度矩阵</Source>

---
# 16 结尾
layout: cover
---

<p class="kicker">核心栈开源 · heca 整理中 · 欢迎来敲</p>
<h1 class="display">拆开代码，<br><em>亲自敲打</em></h1>
<p class="lead">别信幻灯片，去读仓库：这里每个数字都标着出处和日期。</p>
<dl class="readout mt">
  <dt>代码</dt><dd class="cy"><a href="https://github.com/ChronoAIProject">github.com/ChronoAIProject</a></dd>
  <dt>联系</dt><dd>contact@chrono-ai.fun</dd>
  <dt>所钉提交</dt><dd><PinnedCommit /></dd>
</dl>
