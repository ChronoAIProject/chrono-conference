# 附录 B 数据口径、证据边界与对外红线总账

本附录把整套发布会出版物引用的每一条核心数字、统计日期、源仓库路径与公开披露红线集中成一张可审计总账。任何记者、合作伙伴或怀疑论者，都可以按表逐行回溯原始仓库。

## 核心指标与精确统计口径总表

| 领域 | 指标项 | 精确数值 | 来源仓库 / 接口 | 统计日期 |
| --- | --- | --- | --- | --- |
| 研发节奏 | 近 60 天 / 30 天企业提交 | `141,624`（60d）/ `90,295`（30d），覆盖 `74` 仓 | `chrono-company-slides`（`product-line-commits.csv`） | 2026-11-19 |
| 研发身份 | 显式机器/Agent 账号占比 | `35%`（`36,819 / 105,363`，69 仓窗口；不含本地人签多代理） | `chrono-company-slides`（`team-structure.csv`） | 2026-11-07 |
| `NyxID` | 线上版本与能力规模 | `v0.78.0`（`126` 标签、`63` 次版本/8 周）；`55` 服务、`41` MCP 规范、`7` LLM 网关、`9` 渠道类型（`10` 适配器）；公开注册（`invite_code_required: false`）；`1 credit = 1 USD` | `ChronoAIProject/NyxID@v0.78.0` & `api.nyxid.ai` | 2026-11-03 / 11-27 |
| `NyxBot` | 专项代理与触发限额 | 默认 `8` / 上限 `32` 专家、群组上限 `8`、记忆 `50`、触发上限 `30/h` 与 `300/d` | `ChronoAIProject/NyxID@v0.78.0` | 2026-11-03 |
| `Ornn` | 技能生命周期 API 与技能数 | `v0.18.0` Alpha、`134` OpenAPI 操作（`109` 路径，含 `58` 管理操作）、`18.7 万` LOC、`286` 测试文件；`nyx-skills` `163` 公开技能（`164` 插件项） | `ChronoAIProject/Ornn@v0.18.0` & `nyx-skills@d77457c` | 2026-11-19 / 11-27 |
| `CMA` / `heca` | 托管与本地编排 | `CMA` 4 层架构、约 `2.1 s` 凭证热重载（当前单主编码运行时）；`heca` `27` 代理（`6` 主 + `21` ACP）、`361` 夜间构建（源码待公开） | `chrono-company-slides/decks/bp/BP.md` | 2026-11-27 |
| `chrono-harness` | 治理工具链与 `sshx` | `v0.1.4`、Linux x86_64 与 macOS aarch64 各 `16` 个预编译二进制、`27.2 万` 行 Rust、`25` 模块仓（`SPEC.md` 标 `completeness_proven: false`）；`sshx v1.0.0-beta.58` | `ChronoAIProject/chrono-harness` & `consensus-rnd` | 2026-11-13 / 11-25 |
| 物理终端 | `Living with AI` 家庭节点 | `nyx-homeassistant-node v1.1.1-alpha.52` | `ChronoAIProject/nyx-homeassistant-node` | 2026-11-04 |
| `trureturing` | 冻结 Lean 4 定理库 | `167,819` 定理、`14,701` 冻结模块、`16,278` `.lean` 文件、`4.78M` LOC（`4,775,059` 行），Lean `4.35.0` | `the-omega-institute/trureturing@05ceb90` | 2026-11-20 |
| `trureturing` | 24/7 小时级连续节律 | `720 / 720` UTC 小时（`100.0%`），中位数 `59` 提交/时，近 7 日日均 `159` PR | `the-omega-institute/trureturing@e55900e` | 2026-11-19 |
| `trureturing` | 文献开放题解决统计 | `74` 天解 `2,126` 带日期题（总计 `2,128`：`1,400` 证、`728` 反，日均约 `29`）；量子/物理 `582`；悬置 >10 年 `124`（最久 `47` 年） | `the-omega-institute/trureturing@05ceb90` | 2026-11-20 |
| `live.trureturing.org` | 实时全息玻璃观测站 | `19,022` DAG 节点、`8` 研究部门、`17` 公开仓库 | `https://live.trureturing.org/` 实测抓取 | 2026-11-27 |
| 学术外联与出版 | 学者通信、Mathesis 与 OEIS | 联络 `838`、回复 `440`（`53%`）、`273` 机构 / `46` 国、`294` 肯定、`223` 合作交流、`64` 婉拒、`1` 期刊发表（2026-11-08）；`18` OEIS（2026-11-20）；Mathesis 收录 `212` 篇（审稿录用 `0` 篇，2026-11-27）；RH 书 `8,490` 分片 | `trureturing-outreach` & `mathesis` | 2026-11-08 / 11-20 / 11-27 |
| AI 员工运营 | 六岗基线与 11-27 审阅 | 六岗发布基线合计 `77 / 97`（`79.4%`，11-25）：Donna `13/15`（`@chronoai_frontdesk_bot`、`1,108` 席、`18` 花篮）、财务 `24/28`（演示账本）、Auto-X `11/13`、社群 `9/11`（75 次彩排）、HR `15/20`、行政 `5/10`；11-26/27 审阅 `15` 个线上代理与 `89` 项定时任务（`931` 项测试通过），看板单列舆情监测员与知识库维护员；外部付费商户 `0` | `nyxbot-finance` & `nyxid-nyxbot-trials@e50c4eb` | 2026-11-25 / 11-27 |

## 不可逾越的对外红线（供全员、Donna 与媒体对照）

1. **零融资与零预算披露**：本仓库及所有对外演讲、书稿、图件、幻灯片与短片均不披露任何融资金额、预算数字或可反推资本规模的口径。
2. **品牌严格隔离**：商业与产品线归属 **`ChronoAI`**（`ChronoAI Pte. Ltd.`，新加坡）；基础科研归属独立品牌 **`The Omega Institute`**（始终保留英文原名，绝不写作商业联合出品商标）。
3. **禁止夸大与伪造验证**：绝不使用「已彻底解决（SOLVED）」「全球首个」「已获独立同行评审」等失实表述；绝不在正文中手写伪造绿色内核徽章；所有未形式化战略判断与类比必须标明为立场或类比。
4. **禁止模型标识泄漏**：遵循书库出版规范，所有书稿正文与文档中不出现任何具体 AI 模型厂商或型号名称。
5. **唯一对外联络口**：全站统一使用 `contact@chrono-ai.fun` 与 `https://chrono-ai.fun/`。

## 本卷 Lean 4 声明索引

下方的声明索引由构建系统直接从锁文件（提交 [{commit}](trureturing:)）按需生成，提供本卷引用的每一条冻结定理到 Lean 源码精确行号的永久链接：

::: {.stats src="declarations" display="link" group="theorems" format="html"}
查看本卷冻结 Lean 4 定理声明索引
:::
