# 附录 B 信任边界、硬开关与成熟度矩阵

**（立场）** 一份只列「亮点」不列「局限、私有仓、待补许可与实测故障」的架构手册，本质上是拿绿漆糊墙的销售宣传单。本附录把全栈每一项核心组件的**实测版本、公开与许可状态、核心信任边界以及毫不修饰的当前限制**一次性摊在一张可核验总账上（统一核对截止：**2026 年 11 月 27–28 日**）。

## 全栈诚实成熟度矩阵

| 组件 | 实测版本 / 规模（`2026-11-27/28`） | 公开与许可状态 | 核心信任边界 | 毫不修饰的当前限制 |
| --- | --- | --- | --- | --- |
| **`NyxID`** | 线上 `v0.78.0` @ `898fdf245d`（`126` 标签 / 8 周 `63` 次版本；`55` 服务、`42` OpenAPI→MCP、`7` LLM 路由、`9` 消息类 / `10` 适配器 + `5` 语音配置）；`dev` `0.79.0` 扩至 `11` 类 / `12` 适配器 | **公开上线**（`api.nyxid.ai`，`invite_code_required: false`，`1 credit = 1 USD` + BYOK） | 明文密钥封存加密代理内存，模型上下文暴露密钥数恒为 **`0`** | 高频周迭代；`dev` 上的 Meta Messenger / Instagram 仍在特性开关后；企业 SLA 随首批试点商户共同打磨 |
| **`NyxBot` / `NyxAgent` / `nyx-assistant-sdk`** | `8` 默认 / `32` 上限专项代理、群组上限 `8`、`50` 条记忆（每条 `500` 字）、至多 `16` 项钉选 Ornn 技能；触发器默认 **`30/hr` & `300/day`**（可调硬上限 **`300/hr` & `3,000/day`**）；已发布 **`nyx-assistant-sdk v0.2.4`**（`v0.1.0` GA `11-27`） | **公开上线与会场在役**（驱动 `live.trureturing.org` 语音导览 Alexandra 与 `street-corner` 前厅） | 双级泄压硬限额 + 浏览器零密钥握手 | `6` 核心岗位 `82/99`（HR 实事求是降级 `15/20 → 14/20`）、`9` 独立岗位 `102/120` 均为内部验证；**外部付费商户仍为 `0`**；`11-27` 彩排暴露飞书内部群网关队列卡顿 `65–70 min`（`NyxID#2534`） |
| **`Ornn` & `nyx-skills`** | `Ornn v0.18.0` Alpha（`28` 标签）、`134` OpenAPI 操作（`109` 路径、`58` 管理、`3` 健康）、`18.7 万`（`186,526`）LOC、`286` 份测试文件、TS `0.4.0` / Py `0.2.0`；`nyx-skills@25ef75934d`：`163` 公开技能、`164` 插件、`1` 技能集 | **公开 Alpha**（`ornn.chrono-ai.fun`） | AgentSeal 扫描 + 不可变版本冻结 + `NyxID` 服务作用域声明 | 处于 Alpha 演进期，外部第三方作者投稿审核流仍在扩充 |
| **`CMA` & `cmaeg`** | **`v0.12.0`**（`2026-11-24`，`develop c57da2e1e2` `11-27`，PR `#4231`）、`2` 大核心应用服务 + K8s `agent-sandbox` 控制器、`6` IM 平台 + `github`/`custom`、约 **`2.1 s`** 热重载（空闲 `2.152 s` / 忙碌 `1.804 s`） | **云端运行 & 公开开源（`Apache-2.0`）**（`cma.nyxid.ai`，`ChronoAIProject/cma`） | 隔离沙箱 + 代理热吊销不重启容器 + 两阶段发信 | **今日仍仅开放单一主编码智能体运行时**，云端多异构运行时自由切换仍在路线图中 |
| **`heca`** | `27` 类集成（`6` 原生主供应方 + `21` ACP）、**`360` 个夜间构建**（最新 `0.1.0-nightly-20261121-1`，`main 5111cd3b1f` `11-27`，PR `#2870`）、`6` 平台、`4` 种可用运行时（`Host`、`macOS Sandbox`、`Docker`、`Podman`） | **内部高频生产服役**（`getheca` 提供公开构建产物与站点） | 一任务一 Git 工作树 + 统一权限队列 + 目标账本 | **`getheca/heca` 源码仓库目前仍为内部私有**；Apple `container` 运行时仍受阻 |
| **`chrono-harness` & `sshx`** | 活跃主场 **`https://github.com/chrono-harness/`**：`25` 公开仓、`20` 组件仓、每平台 **`21` 预编译二进制**、Copier **`v0.1.52`**、**`29` 条原子规则**、约 `27.6 万` 行 Rust（原单仓 `ChronoAIProject/chrono-harness` 已于 `11-22` 归档）；`sshx v1.0.0-beta.58`（`11-25`） | **`chrono-harness` 源码公开、根级 `LICENSE` 待补**（派生默认指令 `Apache-2.0`）；**`sshx` 为 `MIT` 开源** | `FILEMAP` 故障关闭（漏登报错）+ 传递 `DELTA` 选测 + `policy.mixed-warning` | **`completeness_proven: false`** 至今直接硬编码在活 crate（`runner`、`inputs`、`judge-*`、`cache`）与归档 `SPEC.md`（`parity: unestablished`）中 |
| **`chrono-metaverse` & `chrono-cd`** | `chrono-metaverse`（`dev 21e1f93`，`11-27`，PR `#346`）：`street-corner` `1,108` 席（`4` 看台 × `8` 排）与 `18` 花篮 + 四级扩展转播（办公室→体育馆→金沙 `252.8 m`→轨道 `5,307 km`）；`chrono-cd`（`ea32caa`，`11-26`，PR `#90`） | **`chrono-metaverse` 公开且线上运行**；**`chrono-cd` 为内部私有** | 事务化草稿—发布流 + 原子选座锁 + `NyxID` 鉴权 | 三维体育馆物理容量封顶 `1,108` 席（超出客流分流至 YouTube / LinkedIn 直播）；`chrono-cd` 保持私有 |
| **`Living with AI`** | `nyx-homeassistant-node v1.1.1-alpha.52`（`main` `11-15`）+ `video-event-monitor 0.5.0-alpha.2` + 公开硬件面板 **`nyxid-esp-panel v1.0.0`**（`11-20`） | **公开 Alpha**（`nyxid-esp-panel` 为 **`Apache-2.0`**） | 只读传感与物理执行器写入严格分权 | 智能家居演示仍属早期 Alpha／内部硬件验证，高危物理设备强制保留本地人工确认 |
| **`trureturing` & `Mathesis`** | **`223,231` 条冻结 Lean 4 定理**（`17,968` 模块、`602 万` LOC @ `548388cd`）、**`2,278` 题解**（`1,512` 证 / `766` 驳）、`19,022` 实时真值节点；Mathesis 供应 **`225` 篇论文**（`224` 附 Lean、`225` PDF；`mathesis-papers` 共 `236` 仓、`224` 公开论文仓、`1,528` 陈述、`217` DOI）；`trureturing-tools` 托管 `27` 登记 / `23` 现役 StrataLint 规则 | **全面公开可独立重放**（独立科研品牌 **The Omega Institute**） | Lean 4 内核 + `23` 条现役 StrataLint 规则 + 锁文件摘要比对 | Mathesis 正式同行评审录用数仍为 **`0`**；关于黎曼猜想：社区已于 `2026-11-20/21` 核验 Levent Alpöge 的 Lean 4.33.1 `RiemannHypothesis` 与 Dirichlet GRH 证明（`the-omega-institute/riemann-hypothesis` 构建了 `8,490` 分片 CI 重放），而 `trureturing` 自身仅证整数 Hankel 等价判据（`ActualXiIntegerCriterion.lean`），**广义 Dedekind 扩展黎曼猜想（ERH）、自守 L 函数大黎曼猜想（GRH）、零点单纯性与对关联仍真正处于 `OPEN`** |

## 三条不可关闭的安全硬开关

无论接入哪一家外部商户、哪一个科研团队，下面三条底线在任何配置下都不允许关闭：

1. **禁止明文密钥直入上下文**：所有上游凭据必须经 `NyxID` 代理层注入并清洗；
2. **禁止静默执行高危写操作**：对外资金划转、法律签署、公开渠道不可逆发布以及高风险物理设备动作必须经过显式人工批准；
3. **禁止跳过登记与证据校验**：任何进入生产的代码与出版物必须保留完整可复现的验证回执，拒绝「先合入再补测」的投机捷径。

想进一步看这整套工程底座如何在内部与 11-27 全流程彩排中落地为六大核心小微企业岗位（及全部九位独立 AI 员工）？请翻开第四卷《把发布会交给 AI 员工》，或就试点与技术细节直接致信 `contact@chrono-ai.fun`。
