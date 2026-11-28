# ChronoAI 2026 线上发布会 · `chrono-conference`

> **Build for what comes next.**  
> **加速真理的发现，加速更美好生活的发现。**  
> *Accelerate the discovery of truth, and of a better life.*

2026 年 12 月 17 日 16:00（新加坡时间），ChronoAI 将在纯线上虚拟空间举办一场**没有实体座位、没有摄影棚、没有外包制作公司、由自有智能体底座在明确人类闸门下协同生成与值守、出版物与核心基础设施公开开源（`heca` 源码整理待公开）**的发布会。来宾经由开放注册的 `NyxID` 一键登录步入 [chrono-metaverse](https://chrono-metaverse-chronoai.apps.nyxid.ai/workspace?space=street-corner&view=extended) 的街角数字孪生前厅（或直接通过全程免登录的 YouTube / LinkedIn Live 同步观看），向 AI 礼宾 **Donna**（Telegram `@chronoai_frontdesk_bot`）预订虚拟座位、向街角花店助手 **Blossom** 下单送出署名花篮、开场前回一句“入座”落座前厅，并在离场时直接申请试点同一套 AI 员工。

本仓库以 [`the-omega-institute/trureturing-books-template`](https://github.com/the-omega-institute/trureturing-books-template) 为骨架，把整场发布会的**思想宣言、全程讲稿、全栈架构、可核验科研展示、AI 员工运营剧本、记者问答库、静态矢量图、交互式实验室、确定性讲解视频与中英双语 Slidev 演示文稿**合铸为一整套可多端编译（HTML / 屏幕版与印刷版 PDF / 第一、三卷学术版 PDF / EPUB）的开源出版物。

---

## 四卷本发布会总览 · Four-Book Conference Edition

| 卷次 | 目录 | 代号 | 中文书名 | English Title | 配套媒体 |
| --- | --- | --- | --- | --- | --- |
| I | [`books/launch-keynote/`](books/launch-keynote/) | `CHRONO//KEYNOTE` | 《面向未来的造物：2026 ChronoAI 线上发布会主书与全程讲稿》 | *Build for What Comes Next: The 2026 ChronoAI Virtual Launch Manifesto & Keynote* | 7 静图 · 2 交互实验室 · 3 影片 · 20 页主演讲稿 |
| II | [`books/agent-infrastructure/`](books/agent-infrastructure/) | `CHRONO//STACK` | 《整车工程：ChronoAI 全栈产品与安全架构手册》 | *The Complete Vehicle: ChronoAI Full-Stack Product & Security Architecture* | 7 静图 · 2 交互实验室 · 1 影片 · 16 页架构演讲稿 |
| III | [`books/research-truth-engine/`](books/research-truth-engine/) | `OMEGA//TRUTH` | 《逻辑的棘轮：trureturing、全息观测站与开放数学前沿》 | *The Ratchet of Logic: trureturing, the Live Observatory, and the Open Math Frontier* | 7 静图 · 2 交互实验室 · 1 影片 · 16 页科研演讲稿 |
| IV | [`books/ai-employee-operations/`](books/ai-employee-operations/) | `CHRONO//OPS` | 《把发布会交给 AI 员工：运营剧本、记者问答与商户上手手册》 | *Handing the Launch to AI Employees: Operations Playbook, Press Q&A, and Merchant Onboarding* | 6 静图 · 1 交互实验室 · 1 影片 · 14 页运营演讲稿 |

---

## 证据边界与诚实原则 · Evidence & Epistemic Boundaries

本书库严格遵守 **Lean 内核验证 / 纸面证明与立场 / 开放问题** 三层边界：

- **绿色 `LEAN ✓` 与蓝色零公理 `LEAN ✓`（`axioms: []`）**：仅授予 `trureturing.lock.json` 所钉 [`the-omega-institute/trureturing`](https://github.com/the-omega-institute/trureturing) 提交 `548388cd` 上已冻结的 Lean 4 `theorem` 声明（全套四卷本共锚定 `25` 条冻结 Lean 4 定理，含蓝色零公理定理），点击直达源码行号，书末自动生成形式化验证账本。
- **类比、立场与书面结果**：如“大模型是发动机、Agent 是整车”“定理挖掘是掘金”“边界与体”“驯服的红皇后”，文中一律显式标注为立场或类比，从不冒充形式定理。
- **红色 `OPEN`**：未解决的前沿数学问题与尚未封闭的工程目标，如实标注边界与现状。
- **对外口径与品牌分立**：商业基础设施与发布会主体为 ChronoAI Pte. Ltd.（新加坡），官网 [chrono-ai.fun](https://chrono-ai.fun/)，唯一对外联系邮箱 `contact@chrono-ai.fun`；第三卷（`OMEGA//TRUTH`）及 `trureturing`、`Mathesis` 归属独立基础科研品牌 **The Omega Institute**（始终保留英文原名，与商业主体严格分立）。不涉及资金规模，不渲染未核实结论。

---

## 本地构建与预览 · Local Build & Preview

```bash
./tbook doctor                  # 工具链体检
./tbook check                   # 结构、双语对齐、Lean 冻结引用与媒体契约校验
./tbook fig build               # 由 Python figkit 脚本生成全部双语矢量图
./tbook build html site         # 构建全站 HTML、交互实验室与幻灯片
./tbook build pdf epub          # 导出屏幕版/印刷版 PDF（第一、三卷含学术版）与 EPUB
./tbook build films             # 渲染双语字幕讲解视频（720p MP4）
./tbook serve                   # 启动本地预览服务
```

模板示例书保留在 `books/example-*` 并通过 `site.toml` 的 `hide = ["example-*"]` 隐藏，以确保未来与上游模板平滑同步。

---

## 许可 · License

- 书库框架与构建工具链沿用 [`the-omega-institute/trureturing-books-template`](https://github.com/the-omega-institute/trureturing-books-template)，按 **Apache-2.0** 许可发布（见 [`LICENSE`](LICENSE)）。
- 发布会四卷本正文、讲稿、静态图脚本、交互可视化与视频源码按 **CC-BY-4.0** 许可发布。
