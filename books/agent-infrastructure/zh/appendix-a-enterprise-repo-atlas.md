# 附录 A 全企业仓库全景地图

为支撑 ChronoAI 2026 线上发布会全套事实核查，我们于 **2026 年 11 月 27–28 日**通过 GitHub API 分页遍历了关联的全部六个 GitHub 组织——商业基础设施归属 **ChronoAI Pte. Ltd.**，独立基础科研与开放论文归属独立科研品牌 **The Omega Institute**——精确盘点出 **`539` 个代码仓库**，按真实品牌归属与技术层整理为以下全景地图。

## 六大组织总览与品牌归属（`2026-11-27/28` 实测：`539` 仓）

| GitHub 组织 | 精确仓库数 | 归属品牌与定位 | 代表核心仓库与关键变更说明 |
| --- | ---: | --- | --- |
| `ChronoAIProject` | **`150`** | **ChronoAI** 商业与基础设施主组织 | `NyxID`、`nyx-assistant-sdk`、`nyx-assistant-browser-extensions`、`Ornn`、`nyx-skills`、`cma`、`chrono-metaverse`、`chrono-cd`（私有）、`consensus-rnd`（`sshx`）、`nyx-homeassistant-node`、`video-event-monitor`、`nyxid-esp-panel`、`nyxbot-finance`、`nyxid-nyxbot-trials`、`chrono-company-slides`、`chrono-goals`、`Branding`、`chrono-conference`（注：原单仓 `ChronoAIProject / chrono-harness` 已于 `2026-11-22` 归档，活跃开发迁至 [chrono-harness](https://github.com/chrono-harness/)） |
| `the-omega-institute` | **`59`** | **The Omega Institute** 独立开放科研组织 | `trureturing`、`trureturing-tools`（托管 `StrataLint`）、`trureturing-live`、`trureturing-books`（`3` 部双语专著，每语种 **`344` 双语页 / 含前言 `347` 页**）、`trureturing-books-template`、`trureturing-outreach`、`trureturing-source-theories`、`mathesis`、`riemann-hypothesis`、`riemann-hypothesis-book`、`automath` |
| `mathesis-papers` | **`237`** | **The Omega Institute** 开放论文与源码仓库群 | Mathesis 线上 API 供应 `225` 篇收录论文（`224` 篇附 Lean 链接、`225` 份 PDF、`1,534` 条登记形式化陈述、**`218` 枚 Zenodo DOI**；正式同行评审录用 `0` 篇、独立验证器回执 `0` 条），另含 `human-in-the-loop` 自动化研究方法论手稿（`2026-11-27/28`） |
| `chrono-harness` | **`25`** | **ChronoAI** 模块化可执行治理与判官活跃主场 | 全数 `25` 仓公开活跃（替代已归档单仓）：`chrono-harness-main`、`chrono-harness-instructions`、`20` 个独立版本 Rust 组件仓（**`v0.1.3`–`v0.1.22`**，每平台 `21` 预编译二进制，含 **`540` 份 `verus!` 形式化验证 Rust 文件**）与 Copier `v0.1.52` |
| `getheca` | **`7`** | **ChronoAI** 本地优先编排平台组织 | 公开构建产物与站点文档（注：`getheca/heca` 核心源码仓目前仍为内部私有） |
| `aevatarAI` | **`61`** | 早期分布式事件与 Actor 框架沉淀 | `aevatar`（`131 万` 行 C# 源码、`16,366` 条测试断言，`2026-10-12` 快照） |
| **合计（6 组织）** | **`539`** | **商业与独立科研严格分立** | `150 + 59 + 237 + 25 + 7 + 61 = 539` |

> **带明确截止日的工程节奏快照（保留原统计窗口，绝不混拼新旧口径）：** 在 `2026-09-20` 至 `2026-11-19` 的 60 天统计窗口内，跨 `74` 个活跃仓库合计产生 **`141,624` 次提交**（后 30 天 `90,295` 次，由约 15 名人类工程师与智能体协作维护；`2026-11-19` 之后本地仓库另已新增超过 `13,700` 次提交）；在 `2026-09-08` 至 `2026-11-07` 的 69 仓显式机器人身份拆分中，显式 Bot/Agent 账号占 **`36,819 / 105,363`（`34.9%`，约 `35%`，下界估计）**。

## 发布会四大专著与核心源仓映射

1. **第一卷《面向未来的造物》**：汇总 `chrono-company-slides`（`data/facts.json` 与 `BP.md`）、`Branding`、`chrono-goals`（`goals/chronoai-launch-event.yaml`）、`chrono-metaverse` 与 `trureturing` 主线数据。
2. **第二卷《整车工程》**：直接对应 `NyxID`、`nyx-assistant-sdk`、`nyx-assistant-browser-extensions`、`Ornn`、`nyx-skills`、`cma`、`getheca`、[chrono-harness](https://github.com/chrono-harness/)、`consensus-rnd`（`sshx`）、`chrono-metaverse`、`chrono-cd`、`nyx-homeassistant-node`、`video-event-monitor` 与 `nyxid-esp-panel`。
3. **第三卷《逻辑的棘轮》**：直接锚定 `the-omega-institute/trureturing` 所钉提交 [{commit}](trureturing:)，并覆盖 `trureturing-tools`、`trureturing-live`、`trureturing-outreach`、`trureturing-books`（`344` 双语页/语种，含前言 `347` 页）、`trureturing-source-theories`、`mathesis`、`mathesis-papers`（`218` 枚 Zenodo DOI）、`riemann-hypothesis`、`riemann-hypothesis-book` 与 `automath`。
4. **第四卷《把发布会交给 AI 员工》**：直接映射 `nyxid-nyxbot-trials@df5ef47`（`6` 核心岗位 `82/99`、`9` 独立岗位 `102/120`、`2026-11-27` 12 阶段全流程彩排 `11/12` 通过）、`nyxbot-finance`（`24/28`）、`chrono-hr`（`14/20`）与 `chrono-goals/goals/chronoai-first-merchant.yaml`。

所有公开仓库均接受外部社区按真实提交哈希审查与独立复现；任何内部私有仓库（如 `getheca/heca`、`chrono-cd`）或根许可待补项目（如 `chrono-harness` 组织仓）均在[附录 B](appendix-b-security-and-readiness.md) 明文标示，绝不混淆。
