"""The default specialist mesh and its independent resource ceilings."""

import math

SIZE = (480, 310)
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

    cx, cy, radius = 133, 148, 94
    nodes = [
        (cx + radius * math.cos(2 * math.pi * i / DEFAULT - math.pi / 2),
         cy + radius * math.sin(2 * math.pi * i / DEFAULT - math.pi / 2))
        for i in range(DEFAULT)
    ]
    assert len(nodes) == DEFAULT
    fig.circle(cx, cy, radius, color="edge", width=1.2, dash="4 4")
    for x, y in nodes:
        fig.line(cx, cy, x, y, "cyan", 1.5)
    fig.circle(cx, cy, 51, color="cyan", fill="panel", width=2)
    fig.text(cx, cy - 9, t("NyxBot", "NyxBot"), size=18, weight=600, anchor="middle", middle=True)
    fig.text(cx, cy + 13, t("NyxAgent", "NyxAgent"), size=15, anchor="middle", middle=True)
    for i, (x, y) in enumerate(nodes, 1):
        fig.circle(x, y, 15, color="cyan", fill="panel", width=1.6)
        fig.text(x, y, t(str(i), str(i)), size=15, color="cyan", anchor="middle", middle=True)
    fig.text(cx, 22, t(f"默认 {DEFAULT} 个专家", f"{DEFAULT} default specialists"),
             size=16, weight=600, anchor="middle")
    fig.text(cx, 278, t(f"专家上限 {MAXIMUM}", f"{MAXIMUM} specialists max"),
             size=15, color="dim", anchor="middle")

    fig.line(263, 15, 263, 278, "edge", 1.2)
    fig.text(280, 22, t("配置与硬上限", "Settings & hard ceilings"), size=16, weight=600)
    for i, (value, label) in enumerate([
        (t(str(GROUP), str(GROUP)), t("每组容量", "Group capacity")),
        (t(str(MEMORIES), str(MEMORIES)), t("记忆槽", "Memory slots")),
        (t(f"{HOURLY}/hr · {DAILY}/day", f"{HOURLY}/hr · {DAILY}/day"), t("默认触发上限", "Default trigger caps")),
        (t(f"{HARD_HOURLY}/hr · {HARD_DAILY:,}/day", f"{HARD_HOURLY}/hr · {HARD_DAILY:,}/day"), t("可配置硬上限", "Configurable hard ceilings")),
    ]):
        y = 49 + i * 62
        fig.rect(280, y - 13, 5, 46, color=None, fill="blue", rx=2)
        fig.text(295, y + 3, value, size=18 if i >= 2 else 24, weight=600, color="blue")
        fig.text(295, y + 23, label, size=15)
    fig.text(240, 302, t("nyx-assistant-sdk v0.2.4 · 2026-11-28", "nyx-assistant-sdk v0.2.4 · 2026-11-28"),
             size=15, color="dim", anchor="middle")
