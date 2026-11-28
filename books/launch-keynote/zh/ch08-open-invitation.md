# 第八章 这不是招聘启事，这是一封邀请函

绝大多数科技公司的发布会收尾，总爱甩出一页字号巨大、情绪廉价的「我们正在招聘！」，旁边配一张穿着统一卫衣的摆拍合影。

我们不写招聘启事。招聘启事潜台词是「组织架构图已经画死了，进来当一颗合尺寸的螺丝钉」。而在执行贬值、判断加冕的年代，我们不需要额外的人手拧螺丝——机器拧得比谁都快。我们需要的是**自带挑剔眼光、讨厌舞台剧、敢抄起铁锤先敲自己作品的同行者**。

尼采在《查拉图斯特拉如是说》里拒绝信徒，只呼唤同路人与共创者。用物理黑板前的规矩来说，我们只愿和一种人共事：**不管讲台前站着谁、头衔多大，只要推导里漏了一个负号，当场就敢接过粉笔划掉重算的人。**

## 四扇此刻就敞开的大门

你不需要把简历投进黑洞才能认识 ChronoAI 或独立科研品牌 The Omega Institute。此刻，四扇大门全都敞开，每一扇门背后都是真刀真枪跑着的代码、数据或可复核的证明：

### 第一扇门：给系统工程师与安全偏执狂

如果你看见别人把明文 `.env` 密钥塞进 Agent 上下文就坐立难安，如果你受够了写三页礼貌提示词求机器人别删生产库，请直接翻开第二卷《整车工程》，然后敲开我们的公开代码仓：

- [`ChronoAIProject/NyxID`](https://github.com/ChronoAIProject/NyxID)（零密钥连接与身份底座，`v0.78.0`，`42` 份 OpenAPI→MCP 规范、`55` 项服务；另附刚发布的 `nyx-assistant-sdk v0.2.4`）
- [`ChronoAIProject/Ornn`](https://github.com/ChronoAIProject/Ornn) 与 [`ChronoAIProject/nyx-skills`](https://github.com/ChronoAIProject/nyx-skills)（技能生命周期 API 与 `163` 项公开技能）
- [`ChronoAIProject/cma`](https://github.com/ChronoAIProject/cma)（云端托管智能体运行时，**`v0.12.0`**，2026-11-24 起正式采用 **`Apache-2.0`** 开源）
- **[`https://github.com/chrono-harness/`](https://github.com/chrono-harness/)**（独立活跃开源组织，**`25` 个公开仓**、估算 `27.6` 万行 Rust、双平台各 `21` 个预编译二进制、Copier `v0.1.52`、**`29` 条原子规则**——来帮我们攻破或收紧那行诚实硬编码的 `completeness_proven: false`！）
- [`ChronoAIProject/chrono-metaverse`](https://github.com/ChronoAIProject/chrono-metaverse)、[`ChronoAIProject/nyx-homeassistant-node`](https://github.com/ChronoAIProject/nyx-homeassistant-node) 与 `nyxid-esp-panel v1.0.0`（三维虚拟会场、物理家庭桥与 `Apache-2.0` 硬件面板）

找一处刺眼的边界漏洞，提一个带最小复现与硬判据的 Issue 或 PR。在我们这里，一行切中要害的机械补丁，胜过十页辞藻华丽的履历。

### 第二扇门：给数学家、理论物理学者与形式化同行

如果你想亲眼检验一台全天候运转的真理挖掘机到底在证明什么、又在哪些悬崖边诚实标红，请翻开第三卷《逻辑的棘轮》，推开 [`live.trureturing.org`](https://live.trureturing.org/) 与 The Omega Institute 的公开仓库群：

- 在 [`the-omega-institute/trureturing`](https://github.com/the-omega-institute/trureturing)（`223,231` 条冻结定理、`17,968` 个模块、`602` 万行代码）里挑一道你领域内的公开题解，按第三卷附录 A 的五步剧本在本地跑一次 `lake build`，或在 [`trureturing-books`](https://github.com/the-omega-institute/trureturing-books) 检阅三部持续出版的双语专著（每语种 `344` 双语页、`918` 条定理块 / `2,043` 个独立冻结 GID）；
- 前往 [`the-omega-institute/riemann-hypothesis`](https://github.com/the-omega-institute/riemann-hypothesis) 用 `./verify` 亲手重放 Levent Alpöge 的 Lean `4.33.1` 古典 RH / 狄利克雷 GRH 证明的 **`8,490` 个分片**，或翻阅伴书 `riemann-hypothesis-book` 与 [`mathesis-papers`](https://github.com/mathesis-papers)（`237` 仓 / `236` 公开、`225` 篇公开论文、双重归零诚实：`0` 篇 Mathesis 同行评审录用且 `0 / 1,534` 独立验证器回执）；
- 直接对**蓝色零公理定理 `d2_eq_zero_iff`**（`axioms: []`，见本卷第五章与第三卷第六章）本地运行 `lake build` 逐行核验，并审视第三卷第七章的人机协同消融图（`ch07-hitl-ablation-gate`：人机协同 `260/300 = 86.7%` 胜出、可执行反例义务闸门将假阳性率从 `30.0%` 压至 `0.0%`，以及 `24,925`-PR 准入审计）；
- 揪出我们自然语言表述里哪怕半句越过 Lean 签名的措辞，或指明已有文献先例——所有指正均由 The Omega Institute 记入 `trureturing-outreach` 公开汇总台账；若你手头有形式清晰、渴望机器排查反例或搭起 Lean 4 骨架的开放猜想，欢迎带题来信。

### 第三扇门：给首批敢真刀真枪试水的试点商户与部署伙伴

如果你正经营一家真实生意——门店、跨境电商、财税律所、设计工作室或研发团队——每天被客户咨询、预约排班、社群同步或对账淹没，又绝不肯拿财务与品牌安全赌博，请翻开第四卷《把发布会交给 AI 员工》：

- 亲自找 Telegram 礼宾 `@chronoai_frontdesk_bot` 试订一张看台座位，或找 `@flowerassis_bot` 让小花往世界地图墙边落一只三维花篮；
- 照着财务员 `34` 分钟干净账号装机实录，挑出你店里最磨人、规则最清晰的两项日常苦活；或者如果你是**部署伙伴**，写清你准备用可随时吊销的 `NyxID` 临时门卡切入哪个垂直行业、完工后如何把流程封箱进 `Ornn`；
- 发一封不到两百字的邮件到 `contact@chrono-ai.fun`，写明你的业务、最想先甩出去的两项活，以及你绝不肯让渡的审批红线。今天外部付费商户还是 `0` 家——我们不画大饼，只按周对着真实工作账本，把第一位 AI 员工稳稳送上你的柜台。

### 第四扇门：给挑刺者与执锤人

这是我们最看重的一扇门。如果你翻完这四卷书，抓出一处含糊的数据口径、一句越界的类比、一张拥挤的静图标签、一条陈旧的仓库链接，或者一段别扭的译文——请立刻敲响警钟。所有书稿与生成器源码全都晒在日光底下。**一套怕外人拿铁锤敲击的系统，根本配不上「面向未来」四个字。**

## 唯一官方联络与核验入口

为杜绝假冒渠道或失真转述，ChronoAI 2026 线上发布会的所有对外合作、媒体垂询、商户试点申请与学术联系均收束于以下官方入口：

| 入口用途 | 官方地址 |
| --- | --- |
| 公司官网 | [`https://chrono-ai.fun/`](https://chrono-ai.fun/) |
| 唯一公开联系邮箱 | [`contact@chrono-ai.fun`](mailto:contact@chrono-ai.fun) |
| 虚拟发布会前厅 | [只读观景 `/u/street-corner?view=extended`](https://chrono-metaverse-chronoai.apps.nyxid.ai/u/street-corner?view=extended) · [交互工作区 `/workspace?space=street-corner&view=extended`](https://chrono-metaverse-chronoai.apps.nyxid.ai/workspace?space=street-corner&view=extended)（开放注册 [`NyxID`](https://nyxid.ai/) 一键登录；Telegram 订座 `@chronoai_frontdesk_bot` · 花篮 `@flowerassis_bot`） |
| 直播频道（12-17 16:00–17:15 SGT） | YouTube `@ChronoAIOfficial` · LinkedIn Live（全程免登录） |
| 治理工具链独立开源组织 | [`https://github.com/chrono-harness/`](https://github.com/chrono-harness/)（`25` 公开仓） |
| 开放科研全息观测站（The Omega Institute） | [`https://live.trureturing.org/`](https://live.trureturing.org/) |
| 本次发布会四卷双语书库与源码 | [`ChronoAIProject/chrono-conference`](https://github.com/ChronoAIProject/chrono-conference) · [`GitHub Pages`](https://chronoaiproject.github.io/chrono-conference/) |
| The Omega Institute 主库、重放仓与专著库 | [`trureturing`](https://github.com/the-omega-institute/trureturing) · [`riemann-hypothesis`](https://github.com/the-omega-institute/riemann-hypothesis) · [`books.trureturing.org`](https://books.trureturing.org/) |

翻向附录 A（分钟级导播台）与附录 B（核验总账）之前，请在[终章](coda.md)停驻一分钟，看一看把整车工程、虚拟会场与纯粹数学拧成同一条脊柱的收束意象：**边界与体——合唱才让一首歌成立。**
