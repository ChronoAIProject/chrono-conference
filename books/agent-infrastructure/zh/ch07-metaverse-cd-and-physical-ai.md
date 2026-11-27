# 第七章 屏幕之外：chrono-metaverse、chrono-cd 与 Living with AI

如果一套智能体基础设施永远只会在命令行里改自己的代码，它充其量只是一台精致的「程序员玩具」。整车真正开上大路的标志，是同一套零密钥鉴权、技能生命周期与硬性人工审批闸门，能够无缝延伸到**三维共享空间、零运维云应用部署，以及真实物理世界里的灯开关、传感器与家庭终端**。

ChronoAI 在屏幕之外已经落地的三条真实表面，正是 **`chrono-metaverse`**、**`chrono-cd`** 与 **`Living with AI`**。

::: {.figure src="ch07-physical-digital-twin"}
**数字表面与物理家居双面延伸图。** 左栏为数字表面：`chrono-metaverse` 三维空间与 `chrono-cd` GitOps 部署相连；右栏为物理家居表面：`Living with AI` 经 `nyx-homeassistant-node`（`v1.1.1-alpha.52`）通过 `NyxID` 权限安全连接 Home Assistant 传感器与执行器。
:::

## `chrono-metaverse`：像提交代码一样构建三维虚拟空间

我们在第一卷第四章漫游过的 12-17 发布会前厅 `street-corner`，并非某位美术师在闭源三维软件里手工烘焙出来的一张死图，而是运行在 **`chrono-metaverse`** 空间引擎上的可编程世界。

拆开 `chrono-metaverse` 的协议表面，你会发现它和软件工程里的分支发布流如出一辙：

- **草稿—操作—预览—发布事务流**：无论是给 `street-corner` 布置 1,108 个剧场席位，还是让花店助手小花把第 12 号花篮放上长廊展台，所有空间变更都走严格的 `create_draft` → `append_draft_ops` → `create_draft_preview` → `publish_draft` 事务流水线，支持快照回溯（`get_snapshot`）、分块加载（`get_chunk`）与区域内容查询（`get_region_content`）；
- **统一事件总线与组合世界**：空间内来宾入席、花篮落位与导播提示全部记录进可回放事件时间线（`write_events` / `list_timeline`），并支持把多个子空间拼装成更大的连续世界（`join_space_child` / `update_space_composition`）；
- **与 `NyxID` 原生打通**：进入 `street-corner` 的身份签入与小花修改展台槽位的写入权限，全部走同一套零密钥代理与作用域控制，杜绝陌生访客越权篡改公共会场几何体。

## `chrono-cd`：把应用交付压成声明式单步闭环

当智能体替团队写完一项 Web 服务（例如在线前厅、观测站后端或商户看板），如果部署环节还要靠人工登录服务器手敲 Nginx 与环境变量，自动化链条就会在最后一米彻底断掉。

**`chrono-cd`** 为 ChronoAI 内部与合作伙伴提供统一的声明式持续交付平面：

- 单个声明式配置即可管理应用版本修订（`put_app` / `list_app_revisions` / `restart_app`）；
- 密钥与配置文件通过受控加密通道注入（`set_app_secrets` / `set_secret_files`），同样绝不落盘到公开 Git 仓库；
- 内置统一遥测指标、结构化日志检索与配额申请流（`query_app_metrics` / `query_app_logs` / `create_quota_request`），让 `CMA`、`heca` 与值守 AI 员工能直接根据真实线上日志定位回归。

## `Living with AI`：把零密钥护栏伸进真实物理家庭

智能体走出屏幕的终极考题，是走进真实人类的起居空间。当你允许一位 AI 助手读取家里温度传感器、调节灯光、检查门锁或联动 Home Assistant 设备时，任何一次越权写操作带来的都不再是一条报错日志，而是真实世界的物理安全隐患。

**`Living with AI`** 线的公开核心节点 **`ChronoAIProject/nyx-homeassistant-node`**（当前版本 **`v1.1.1-alpha.52`**，2026 年 11 月 4 日）把家庭与办公空间的自动化设备桥接进了同一张 `NyxID` 安全网。在团队内部基于 `nyx-homeassistant-node` 录制的实景演示里（详见公司演示资料 `chrono-company-slides`，2026 年 11 月），这条链路已经走出聊天窗口：从飞书群里一句口令经 `NyxID → Home Assistant` 驱动机器狗在园区巡逻，到办公室摄像头识别零食见底后自动征集口味并备好补货单，背后都是同一套受限代理：

- 智能体永远拿不到 Home Assistant 的长期明文超级令牌；
- 读取传感器状态（只读）与控制高风险物理执行器（写操作）严格分权，延续「只读自动、高危必经人类确认」的整车铁律；
- 与早期分布式事件框架沉淀 **`aevatar`**（截至 2026 年 10 月 12 日累计 `131 万` 行 C# 源码、`16,366` 条测试断言）一脉相承，让事件驱动的多智能体协作从云端无缝延展到客厅边缘。

到此为止，整车五层从最底层的 `NyxID` 到最外层的物理家庭节点已经全部拆解完毕。为了方便工程师、媒体与合作伙伴随时检索，接下来的[附录 A](appendix-a-enterprise-repo-atlas.md) 给出全企业六大组织的仓库全景地图，而[附录 B](appendix-b-security-and-readiness.md) 则摊开毫不掩饰的**信任边界与诚实成熟度矩阵**。
