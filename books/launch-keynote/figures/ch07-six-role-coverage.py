SIZE = (500, 310)
ALT = {
    "zh": "2026 年 11 月 25 日演示清单的六岗位覆盖率。接待 Donna 为 13/15（87%），财务 24/28（86%），社媒 Auto-X 11/13（85%），社群 9/11（82%），人力 15/20（75%），行政 5/10（50%）。合计 77/97（79%），由任务数加总计算。",
    "en": "Demo checklist coverage by role as of November 25, 2026. Concierge Donna covers 13 of 15 workflows (87%), Finance 24 of 28 (86%), Social Auto-X 11 of 13 (85%), Community 9 of 11 (82%), HR 15 of 20 (75%), and Admin 5 of 10 (50%). Across all six roles, 77 of 97 workflows are covered (79%).",
}

# 2026-11-25 demo coverage inventory, nyxbot-finance and nyxid-nyxbot-trials.
ROLES = (
    ("接待 Donna", "Concierge Donna", 13, 15),
    ("财务", "Finance", 24, 28),
    ("社媒 Auto-X", "Social Auto-X", 11, 13),
    ("社群", "Community", 9, 11),
    ("人力", "HR", 15, 20),
    ("行政", "Admin", 5, 10),
)


def draw(fig):
    covered = sum(row[2] for row in ROLES)
    total = sum(row[3] for row in ROLES)
    assert (len(ROLES), covered, total) == (6, 77, 97)
    assert [round(100 * n / d) for _, _, n, d in ROLES] == [87, 86, 85, 82, 75, 50]
    assert round(100 * covered / total) == 79

    fig.text(15, 24, fig.t("演示清单覆盖率", "Demo workflow coverage"), size=19, weight=700)
    fig.text(484, 24, fig.t("2026-11-25", "2026-11-25"), size=15, anchor="end", color="dim")
    fig.line(15, 240, 484, 240, "edge", 1)
    for rank, (zh, en, count, scope) in enumerate((*ROLES, ("全部岗位", "All roles", covered, total))):
        aggregate = rank == len(ROLES)
        y = 263 if aggregate else 55 + rank * 33
        percentage = round(100 * count / scope)
        fig.text(15, y, fig.t(zh, en), size=16 if aggregate else 15, middle=True, weight=700 if aggregate else 550)
        fig.rect(150, y - 7, 207, 14, color="edge", fill="panel", rx=3)
        fig.rect(150, y - 7, 207 * count / scope, 14, color=None, fill="cyan", rx=3)
        fig.text(484, y, fig.t(f"{count}/{scope} · {percentage}%", f"{count}/{scope} · {percentage}%"),
                 size=16 if aggregate else 15, middle=True, anchor="end", weight=700 if aggregate else 550)
    fig.text(150, 295, fig.t("青色表示已覆盖，空段表示未覆盖", "Cyan marks covered workflows"), size=15, color="dim")
