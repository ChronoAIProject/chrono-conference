"""The default specialist mesh and its independent resource ceilings."""

import math

SIZE = (480, 378)
ALT = {
    "zh": "NyxBot / NyxAgent 位于中心，与默认 8 个专家组成辐射网络。专家数上限为 32，"
          "群组容量上限为 8，记忆槽为 50。触发默认上限是每小时 30 次、每日 300 次，"
          "可配置的硬上限是每小时 300 次、每日 3,000 次。图下注明 nyx-assistant-sdk v0.2.4（2026-11-28）。",
    "en": "NyxBot / NyxAgent connects to eight default specialists in a radial mesh. "
          "The specialist ceiling is 32, group capacity is 8, and memory capacity is 50 slots. "
          "Trigger defaults are 30 per hour and 300 per day, with hard ceilings of 300 per hour "
          "and 3,000 per day. The audited note is nyx-assistant-sdk v0.2.4, shipped on 2026-11-28.",
}

# Audited NyxID settings and nyx-assistant-sdk release, 2026-11-28.
DEFAULT, MAXIMUM, GROUP, MEMORIES = 8, 32, 8, 50
HOURLY, DAILY = 30, 300
HARD_HOURLY, HARD_DAILY = 300, 3000


def draw(fig):
    t = fig.t
    assert (DEFAULT, MAXIMUM, GROUP, MEMORIES, HOURLY, DAILY, HARD_HOURLY, HARD_DAILY) == (8, 32, 8, 50, 30, 300, 300, 3000)

    cx, cy, radius = 122, 170, 88
    hub_radius, node_radius = 53, 18
    nodes = [
        (cx + radius * math.cos(2 * math.pi * i / DEFAULT - math.pi / 2),
         cy + radius * math.sin(2 * math.pi * i / DEFAULT - math.pi / 2))
        for i in range(DEFAULT)
    ]
    assert len(nodes) == DEFAULT
    fig.circle(cx, cy, radius - node_radius - 5, color="edge", width=1.2, dash="4 4")
    for x, y in nodes:
        dx, dy = (x - cx) / radius, (y - cy) / radius
        fig.line(cx + hub_radius * dx, cy + hub_radius * dy,
                 x - node_radius * dx, y - node_radius * dy, "cyan", 1.5)
    fig.circle(cx, cy, hub_radius, color="cyan", fill="panel", width=2)
    fig.text(cx, cy - 15, "NyxBot", size=19, weight=600, anchor="middle", middle=True)
    fig.text(cx, cy + 16, "NyxAgent", size=16, anchor="middle", middle=True)
    for i, (x, y) in enumerate(nodes, 1):
        fig.circle(x, y, node_radius, color="cyan", fill="panel", width=1.6)
        fig.text(x, y, str(i), size=16, color="cyan", anchor="middle", middle=True)
    fig.text(cx, 29, t(f"默认 {DEFAULT} 个专家", f"{DEFAULT} default specialists"),
             size=17, weight=600, anchor="middle")
    fig.text(cx, 312, t(f"专家上限 {MAXIMUM}", f"{MAXIMUM} specialists max"),
             size=16, color="dim", anchor="middle")

    fig.line(245, 16, 245, 328, "edge", 1.2)
    fig.text(264, 29, t("配置与硬上限", "Settings & hard ceilings"), size=17, weight=600)
    for i, (value, label) in enumerate([
        (str(GROUP), t("每组容量", "Group capacity")),
        (str(MEMORIES), t("记忆槽", "Memory slots")),
        (f"{HOURLY}/hr · {DAILY}/day", t("默认触发上限", "Default trigger caps")),
        (f"{HARD_HOURLY}/hr · {HARD_DAILY:,}/day", t("可配置硬上限", "Configurable hard ceilings")),
    ]):
        y = 72 + i * 72
        fig.rect(264, y - 25, 5, 61, color=None, fill="blue", rx=2)
        fig.text(280, y, value, size=19 if i >= 2 else 24, weight=600, color="blue")
        fig.text(280, y + 31, label, size=16)
    fig.text(240, 360, "nyx-assistant-sdk v0.2.4 · 2026-11-28",
             size=16, color="dim", anchor="middle")
