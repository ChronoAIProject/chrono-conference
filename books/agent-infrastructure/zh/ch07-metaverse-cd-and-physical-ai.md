# 第七章 屏幕之外：chrono-metaverse、chrono-cd 与 Living with AI

如果一套智能体基础设施一辈子只待在命令行里改自己的代码，它顶多是一只昂贵的「程序员玩具」。整车真正驶上真实路面的标志，是同一套零密钥代理、版本化技能与高危写操作审批闸门，能够毫无松动地延伸到**可编程三维直播空间、声明式云端交付平面，以及真实客厅里的灯开关、摄像头与硬件面板**。

截至 **2026 年 11 月 27 日**，ChronoAI 已经跑在屏幕之外的三条真实表面，正是 **`chrono-metaverse`**、**`chrono-cd`** 与 **`Living with AI`**。**（立场）** 照本卷规矩，三条线哪条已公开、哪条仍为内部私有、哪条还处于早期硬件 Alpha 验证，全部当面分清。

::: {.figure src="ch07-physical-digital-twin"}
**数字表面与物理家居双面延伸图。** 左栏为数字表面：公开三维空间引擎 `chrono-metaverse`（含四级扩展转播链路）与内部声明式部署平面 `chrono-cd` 相连；右栏为物理家居表面：`Living with AI` 经 `nyx-homeassistant-node`（`v1.1.1-alpha.52`）、`video-event-monitor`（`0.5.0-alpha.2`）与公开硬件面板 `nyxid-esp-panel`（`v1.0.0`，Apache-2.0）通过 `NyxID` 权限安全连接 Home Assistant 传感器与执行器。
:::

## `chrono-metaverse`：像提交数据库事务一样构建三维转播世界

第一卷里漫游过的 12-17 发布会主会场 `street-corner`，绝不是某位美术师在闭源三维软件里烘焙死的一张贴图，而是运行在公开空间引擎 **`ChronoAIProject/chrono-metaverse`**（`dev` 提交 `21e1f93`，`2026-11-27`，PR `#346`）上的可编程世界。

它最直观的工程作品，是为 12-17 发布会搭起的**四级扩展转播管线（4-Stage Extended Broadcast Pipeline）**：

1. **第一级 · 办公室源端（Office `rb.cabinet-01`）**：主播与实时演示信号的起始机位；
2. **第二级 · 虚拟体育馆（`星潮` / `street-corner`）**：精确按 **4 座看台 × 8 层阶梯排**建模的 **`1,108` 个实时席位**（北看台 `248`、南看台 `248`、东看台 `306`、西看台 `306`；第 `1` 至 `8` 排依次为 `144, 144, 144, 140, 136, 136, 132, 132` 席，编码如 `N1-17`、`E1-20`、`W8-01`），沿世界地图长廊布设 `2 排 × 9 块` 共 **`18` 座花篮展位**；
3. **第三级 · 滨海湾金沙空中巨幕（Marina Bay Sands Sky-Screen）**：面向新加坡地标天际线的 **`252.8 m × 142.2 m`** 虚拟天幕；
4. **第四级 · 地球轨道行星巨屏（Earth Orbital Planetary Screen）**：镜头拉升至轨道高度展开的 **`5,307 km × 2,985 km`** 行星级屏幕。

剖开引擎底层协议，你会发现它的每一次空间变更都像版本化数据库事务一样冷峻：

- **草稿—操作—预览—发布事务流**：无论是落位 1,108 个剧场席位，还是让花店助手小花把第 12 号花篮放上长廊垫位，所有写操作都必须走 `create_draft` → `append_draft_ops` → `create_draft_preview` → `publish_draft`，配快照回溯（`get_snapshot`）、分块流式加载（`get_chunk`）与区域查询（`get_region_content`）；
- **可回放事件总线与空间组合**：来宾入席点亮、花篮落位与导播提示统统记入可回放时间线（`write_events` / `list_timeline`），并支持把多个子空间拼装成连续世界（`join_space_child` / `update_space_composition`）；
- **原生 `NyxID` 权限护栏**：访客签入与小花修改花篮展位的写入调用全部经过同一套零密钥代理与作用域核验，拒绝未授权访客篡改公共会场几何体。

## `chrono-cd`：把应用交付压成声明式单步路径（内部私有）

当智能体替团队写完一项 Web 服务（线上前厅、观测站接口或商户面板），如果最后一步部署还要人工 SSH 登录服务器手敲 Nginx 与环境变量，整条自动化链条就会在终点线前一米绷断。

**`chrono-cd`**（**当前为内部私有仓库**，最新提交 `ea32caa`，`2026-11-26`，PR `#90`）是 ChronoAI 内部统一的声明式持续交付平面：

- 单份声明式配置管理应用修订与可控重启（`put_app` / `list_app_revisions` / `restart_app`）；
- 运行时密钥与加密配置文件通过受控通道注入（`set_app_secrets` / `set_secret_files`），同样绝不落盘到 Git 仓库；
- 统一遥测模式、结构化日志查询与配额流（`query_app_metrics` / `query_app_logs` / `create_quota_request`），让 `CMA`、`heca` 与运维代理能直接凭线上真日志定位回归。

## `Living with AI`：把断路器拧到真实物理客厅的门框旁

智能体走出屏幕的终极考场，是跨进人类日常起居的物理房间。**（类比）** 在终端里写坏一行代码，顶多弹出一段红色的堆栈报错；但在真实客厅里，一次越权写操作不是 HTTP 500，而是误开一扇真实门锁、误触一只真实继电器。离铜线和物理执行器越近，`NyxID` 的只读／写入分权就越不再是纸面安全条款，而是一只实打实拧在入户配电箱里的空气开关。

**`Living with AI`** 线由三块相互衔接的组件构成（核对日期 `2026-11-27`）：

- **`ChronoAIProject/nyx-homeassistant-node`**（**`v1.1.1-alpha.52`**，`main` 推送至 `2026-11-15`）：公开核心桥接节点，将 Home Assistant 传感器与设备接入 `NyxID` 信任平面；
- **`video-event-monitor`**（**`0.5.0-alpha.2`**）：配套视觉事件监测组件，支撑办公室零食架空缺识别、征集口味与备单等视觉触发场景；
- **`nyxid-esp-panel`**（**`v1.0.0`**，`2026-11-20`，**`Apache-2.0`**）：公开硬件面板固件与接口（对应第一章 `NyxID` 中新增的第 42 份 OpenAPI→MCP 规范 `nyx-panel.openapi.json`）。

在团队内部录制的实景验证中（详见公司演示资料 `chrono-company-slides`，2026 年 11 月），这套链路已经从飞书群里的一句口令经 `NyxID → Home Assistant` 驱动园区机器狗巡逻，并串联视觉补货流程；**但我们同样如实标明边界：智能家居自动化与实景演示目前仍处于早期 Alpha 与内部硬件验证阶段**，延续三条死规矩：

- 智能体永远摸不到 Home Assistant 的长期明文超级令牌；
- 只读传感读取与高风险物理执行器写入严格分权，高危动作强制保留本地人工确认；
- 承接早期分布式事件与 Actor 框架沉淀 **`aevatar`**（`131 万` 行 C# 源码、`16,366` 条测试断言，2026-10-12 快照），让事件驱动协作从云端沙箱延展到物理客厅边缘。

到此为止，整车五层从最底层的 `NyxID` 到最外层的三维空间与物理硬件面板已经全部拆到见骨。接下来，[附录 A](appendix-a-enterprise-repo-atlas.md) 摊开横跨六大 GitHub 组织、共 **`538` 个仓库**的企业全景地图，而[附录 B](appendix-b-security-and-readiness.md) 则列出绝不涂绿漆的**信任边界、许可现状与诚实成熟度矩阵**。
