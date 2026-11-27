# 附录 A 全企业仓库全景地图

在筹备 ChronoAI 2026 线上发布会之初，我们完整遍历了关联的全部六个 GitHub 组织（商业产品线归属 **ChronoAI**，基础科研与开放论文线归属独立品牌 **The Omega Institute**），将超过 **465 个公开与协作仓库**按真实归属、品牌边界与产品层梳理为一张可对照的全景地图（统计快照：2026 年 11 月 26–27 日）。

## 六大组织总览与品牌归属

| GitHub 组织 | 统计仓库数 | 归属品牌与定位 | 代表核心仓库 |
| --- | ---: | --- | --- |
| `ChronoAIProject` | `150` | **ChronoAI** 商业与基础设施主组织 | `NyxID`、`Ornn`、`nyx-skills`、`cma`、`chrono-metaverse`、`chrono-cd`、`chrono-harness`、`consensus-rnd`（`sshx`）、`nyx-homeassistant-node`、`nyxbot-finance`、`nyxid-nyxbot-trials`、`chrono-company-slides`、`chrono-goals`、`Branding`、`chrono-conference` |
| `the-omega-institute` | `59` | **The Omega Institute** 独立开放科研组织 | `trureturing`、`trureturing-live`、`trureturing-books`、`trureturing-books-template`、`trureturing-outreach`、`trureturing-source-theories`、`mathesis`、`riemann-hypothesis`、`riemann-hypothesis-book`、`automath` |
| `mathesis-papers` | `224` | **The Omega Institute** 开放论文与源码仓库群 | 212 份公开论文仓（211 份附 Lean 源码、207 份具 DOI、1,480 条登记陈述） |
| `chrono-harness` | `25` | **ChronoAI** 模块化可执行治理与判官组件库 | `chrono-harness-main`、`chrono-harness-instructions` 及各专项判官 Rust 组件仓 |
| `getheca` | `7` | **ChronoAI** 本地优先编排平台组织（`heca` 源码待公开） | `heca` 发行通道与文档打包工作区 |
| `aevatarAI` | 活跃 + 归档 | 早期分布式事件与 Actor 框架沉淀 | `aevatar`（131 万行 C#、16,366 条测试断言，2026-10-12 快照） |

## 发布会四大专著与核心源仓映射

1. **第一卷《面向未来的造物》**：汇总 `chrono-company-slides`（`data/facts.json` 与 `BP.md`）、`Branding`、`chrono-goals`（`goals/chronoai-launch-event.yaml`）、`chrono-metaverse` 与 `trureturing` 主线数据。
2. **第二卷《整车工程》**：直接对应 `NyxID`、`Ornn`、`nyx-skills`、`cma`、`getheca`、`chrono-harness`、`consensus-rnd`、`chrono-metaverse`、`chrono-cd` 与 `nyx-homeassistant-node`。
3. **第三卷《逻辑的棘轮》**：直接锚定 `the-omega-institute/trureturing` 所钉提交 [{commit}](trureturing:)，并覆盖 `trureturing-live`、`trureturing-outreach`、`trureturing-books`、`mathesis`、`mathesis-papers`、`riemann-hypothesis-book` 与 `automath`。
4. **第四卷《把发布会交给 AI 员工》**：直接映射 `nyxid-nyxbot-trials`（前厅礼宾 Donna、花店小花、社群 75 次彩排与问答口径）、`nyxbot-finance`（24/28 演示财务账本）、`chrono-hr` 与 `chrono-goals/goals/chronoai-first-merchant.yaml`。

所有公开仓库均接受外部社区按真实提交哈希审查与复现；任何尚未公开源码的组件（如 `heca`）均在[附录 B](appendix-b-security-and-readiness.md) 显式标注，绝不混淆。
