SIZE = (480, 320)
ALT = {
    "zh": "NyxID v0.78.0 位于网络中央。左侧是 55 项内置服务和 42 份 OpenAPI 转 MCP 规范，右侧是 7 家网关提供方和 9 种消息渠道。下方连接 Ornn 的 163 项技能以及 CMA 云端与 heca 本地运行环境，后者支持 27 个智能体接入。NyxID 现场快照日期为 2026 年 11 月 27 日。",
    "en": "NyxID v0.78.0 is the hub. To the left are 55 built-in services and 42 OpenAPI-to-MCP specs. To the right are seven gateway providers and nine messaging channel types. Below are 163 Ornn skills, the CMA cloud runtime, and 27 agent integrations in the heca local runtime. The live NyxID snapshot is dated November 27, 2026.",
}

SERVICES, SPECS, GATEWAYS, CHANNEL_TYPES = 55, 42, 7, 9
SKILLS = 163
HECA_PRIMARY, HECA_ACP = 6, 21


def draw(fig):
    heca_agents = HECA_PRIMARY + HECA_ACP
    assert (SERVICES, SPECS, GATEWAYS, CHANNEL_TYPES, SKILLS, heca_agents) == (55, 42, 7, 9, 163, 27)

    for edge_x, hub_edge, color in ((159, 179, "cyan"), (321, 301, "violet")):
        fig.line(edge_x, 105, hub_edge, 105, color, 2)
    fig.line(240, 146, 240, 177, "blue", 2)
    fig.line(83, 177, 397, 177, "blue", 1.6)
    for x in (83, 240, 397):
        fig.line(x, 177, x, 197, "blue", 1.6)
        fig.dot(x, 177, 3.1, "blue", ring="bg")

    fig.rect(179, 60, 122, 86, color="now", fill="now", fill_opacity=0.04, width=1.8, rx=11)
    fig.text(240, 96, fig.t("NyxID", "NyxID"), size=23, weight=700, anchor="middle", color="now")
    fig.text(240, 128, fig.t("v0.78.0", "v0.78.0"), size=16, anchor="middle")
    for x, color, title, first, second in (
        (8, "cyan", fig.t("服务目录", "Service catalog"), fig.t(f"{SERVICES} 项内置服务", f"{SERVICES} built-in services"),
         fig.t(f"{SPECS} OpenAPI→MCP", f"{SPECS} OpenAPI→MCP")),
        (321, "violet", fig.t("网关与渠道", "Gateways & chat"), fig.t(f"{GATEWAYS} 家 LLM 网关", f"{GATEWAYS} LLM gateways"),
         fig.t(f"{CHANNEL_TYPES} 种消息渠道", f"{CHANNEL_TYPES} channel types")),
    ):
        fig.rect(x, 48, 151, 111, color=color, fill=color, fill_opacity=0.08, rx=8)
        fig.text(x + 10, 76, title, size=16, color=color, weight=700)
        fig.text(x + 10, 104, first, size=16)
        fig.text(x + 10, 129, second, size=16)

    for x, title, note in (
        (83, fig.t("Ornn", "Ornn"), fig.t(f"{SKILLS} 项技能", f"{SKILLS} skills")),
        (240, fig.t("CMA", "CMA"), fig.t("云端运行", "Cloud runtime")),
        (397, fig.t("heca", "heca"), fig.t(f"{heca_agents} 个智能体接入", f"{heca_agents} agents")),
    ):
        fig.rect(x - 75, 197, 150, 74, color="blue", fill="blue", fill_opacity=0.08, rx=8)
        fig.text(x, 222, title, size=18, color="blue", weight=700, anchor="middle")
        fig.text(x, 251, note, size=16, anchor="middle")
    fig.text(240, 300, fig.t("NyxID：2026-11-27 · 技能与 heca：11-27", "NyxID: 2026-11-27 · Skills and heca: Nov 27"),
             size=16, color="dim", anchor="middle")
