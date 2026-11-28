SIZE = (500, 400)
ALT = {
    "zh": "2026 年 11 月 27 日 df5ef47 审计的九岗位覆盖率。六个核心岗位为 Donna 14/15、财务 24/28、Auto-X 12/14、社群 10/12、人力降至 14/20、行政 8/10，合计 82/99（82.8%）。单列的舆情监测员为 6/7，知识库维护员 3/3，复盘分析员 11/11；九岗位合计 102/120（85%）。",
    "en": "The November 27, 2026 df5ef47 audit covers nine standalone roles. The six-core roster is Donna 14/15, Finance 24/28, Auto-X 12/14, Community 10/12, HR down to 14/20, and Admin 8/10, totaling 82/99 (82.8%). Sentiment Monitor is 6/7, KB Maintainer 3/3, and Retrospective Analyst 11/11. All nine roles total 102/120 (85%).",
}

# 2026-11-27 full nine-role audit, nyxid-nyxbot-trials@df5ef47.
ROLES = (
    ("接待 Donna", "Concierge Donna", 14, 15),
    ("财务", "Finance", 24, 28),
    ("社媒 Auto-X", "Social Auto-X", 12, 14),
    ("社群", "Community", 10, 12),
    ("人力", "HR", 14, 20),
    ("行政", "Admin", 8, 10),
    ("舆情监测员", "Sentiment Monitor", 6, 7),
    ("知识库维护员", "KB Maintainer", 3, 3),
    ("复盘分析员", "Retrospective Analyst", 11, 11),
)


def draw(fig):
    covered = sum(row[2] for row in ROLES)
    total = sum(row[3] for row in ROLES)
    core_covered = sum(row[2] for row in ROLES[:6])
    core_total = sum(row[3] for row in ROLES[:6])
    core_rate = f"{core_covered / core_total:.1%}"
    assert (len(ROLES), covered, total, core_covered, core_total) == (9, 102, 120, 82, 99)
    assert [round(100 * n / d) for _, _, n, d in ROLES] == [93, 86, 86, 83, 70, 80, 86, 100, 100]
    assert round(100 * covered / total) == 85
    assert core_rate == "82.8%"

    fig.text(15, 24, fig.t("演示清单覆盖率", "Demo workflow coverage"), size=19, weight=700)
    fig.text(484, 24, fig.t("2026-11-27 · df5ef47", "2026-11-27 · df5ef47"), size=17, anchor="end", color="dim")
    fig.line(15, 322, 484, 322, "edge", 1)
    bar_width = 118
    for rank, (zh, en, count, scope) in enumerate((*ROLES, ("全部岗位", "All roles", covered, total))):
        aggregate = rank == len(ROLES)
        y = 350 if aggregate else 55 + rank * 28
        percentage = round(100 * count / scope)
        fig.text(15, y, fig.t(zh, en), size=18 if aggregate else 17, middle=True, weight=700 if aggregate else 550)
        fig.rect(220, y - 7, bar_width, 14, color="edge", fill="panel", rx=3)
        fig.rect(220, y - 7, bar_width * count / scope, 14, color=None, fill="cyan", rx=3)
        downgrade = " ↓" if en == "HR" else ""
        fig.text(484, y, f"{count}/{scope}{downgrade} · {percentage}%",
                 size=18 if aggregate else 17, middle=True, anchor="end", weight=700 if aggregate else 550)
    fig.text(150, 383, fig.t(f"六核心 {core_covered}/{core_total} · {core_rate}",
                             f"Six-core {core_covered}/{core_total} · {core_rate}"), size=17, color="dim")
