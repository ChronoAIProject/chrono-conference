# 第三章 Ornn：面向 Agent 的技能生命周期 API

今天在许多正在试水智能体的公司里，常见的一幕是把「技能」存成某个聊天记录里复制粘贴了七次的 Markdown 碎片：没有版本号、没有安全审计、没有权限依赖声明，改坏一行也没人知道是谁干的、什么时候干的、影响了哪三位 AI 员工。

软件工程几十年来陆续沉淀出包管理器、代码签名与现代语义化版本规范，才告别了这种石器时代。智能体生态却常常忘了同一条铁律：**只要一段工作流指令能够触发真实的 API 写操作，它就是可执行软件，必须按软件的规矩管理整个生命周期。**

这就是 **`Ornn`**（在线版本 `v0.18.0` Alpha，`https://ornn.chrono-ai.fun`）与公开技能目录 **`nyx-skills`** 存在的唯一理由。

## 五段式技能生命周期：从起草到 AgentSeal 扫描与权限绑定

`Ornn` 不把自己包装成花哨的「提示词商店」，而是一套真正面向智能体与工程流水线的 **技能生命周期 API**。每一项技能从诞生到上岗，必须完整走过五道硬环节：

::: {.figure src="ch03-ornn-skill-lifecycle"}
**`Ornn`（`v0.18.0`）五段式技能生命周期闭环。** 一项技能依次经历编写或从 OpenAPI 自动生成、AgentSeal 安全扫描、不可变版本冻结并由分发标签（dist-tag）指向、绑定受限 `NyxID` 服务作用域，最后供智能体按版本拉取并留存审计轨迹；支撑 `134` 个 OpenAPI 操作端点（`109` 条路径）、`286` 份测试文件与 `nyx-skills` 中的 `163` 项公开技能。
:::

逐条拆解这五道关卡的工程含义：

1. **起草与自动生成（Author / Generate）**：开发者既可以手工编写标准 `SKILL.md` 与附属脚本，也可以直接通过 `Ornn` 的生成端点，从任意 OpenAPI 规范或源仓库自动合成技能骨架，并通过统一格式校验器（`validateformat` / `getformatschema`）核对结构。
2. **AgentSeal 安全审计（Scan & Audit）**：每一版技能进入分发前都经过静态与策略扫描（`rescanskillversionagentseal` / `triggerskillaudit`），检测越权命令、硬编码密钥与可疑外联模式，并把审计历史永久挂在该版本号下。
3. **版本冻结与分发标签（Version & Dist-Tag）**：支持精确语义化版本、版本差异对比（`diffskillversions`）、安全回滚与弃用标记（`setskillversiondeprecation`），绝不允许「静默覆盖线上正在跑的技能」。
4. **绑定 `NyxID` 服务边界（Service Binding）**：技能本身不带任何明文密钥，只声明自己需要哪几项 `NyxID` 代理服务（`setskillnyxidservice`），使权限审计在安装那一刻就一目了然。
5. **面向智能体的拉取与计量（Agent Pull & Telemetry）**：通过原生 TypeScript SDK（`0.4.0`）与 Python SDK（`0.2.0`），云端 `CMA`、本地 `heca` 与 `NyxBot` 均可按版本拉取技能闭合包（`getskillclosure`），并留下完整拉取与使用遥测。

## 实测工程厚度：不是概念原型，是 18.7 万行与 286 份测试文件

以下是 `ChronoAIProject/Ornn` 与 `ChronoAIProject/nyx-skills` 在 2026 年 11 月 19 日至 27 日的实测仓库账本：

| 指标项 | 精确读数 | 来源仓库与日期 |
| --- | --- | --- |
| 当前线上与标签版本 | `v0.18.0` Alpha（`28` 个发布标签，基线 2026-09-17） | `ChronoAIProject/Ornn@v0.18.0` & `ornn.chrono-ai.fun/version.json`（在线检查 2026-11-27） |
| API 表面规模 | **134 个 OpenAPI 操作**（覆盖 `109` 条路径，含 `58` 个 `/api/v1/admin/` 管理操作与 `3` 个健康检查） | `ChronoAIProject/Ornn@v0.18.0` `specBuilder.ts`（2026-11-27 实测） |
| 源码规模 | **18.7 万行**（精确 `186,526` 行 TS/TSX/JS/Python） | `ChronoAIProject/Ornn@88f2d78`（2026-11-19） |
| 自动化测试套件 | **286 份测试文件**（`*.test.*` / `*.spec.*` / `test_*.py`） | `ChronoAIProject/Ornn@88f2d78`（2026-11-19） |
| 官方多语言 SDK | TypeScript `v0.4.0` · Python `v0.2.0` | `sdk/typescript/package.json` & `sdk/python/pyproject.toml` |
| 公共技能与插件目录 | **163 项公开技能**（含 `SKILL.md`）、**164 个插件条目**、**1 个技能集** | `ChronoAIProject/nyx-skills@d77457c`（2026-11-27） |

检验工程成熟度有一个最实在的土办法：别听作者吹功能列表，数一数他为这堆代码写了多少测试文件。286 份测试文件加上 163 项全仓可查的公开技能，说明 `Ornn` 从一开始就是按「供机器高频调用的基础设施」而不是「一次性展示页」来造的。

现在，钥匙锁进了 `NyxID`，技能封箱进了 `Ornn`——下一层最紧迫的问题来了：**把这些零密钥、带技能的智能体真正放进生产环境 24 小时跑起来，云端怎么托管、本地怎么并发？** 第四章与第五章依次拆解整车的双模运行时：`CMA` 与 `heca`。
