from datetime import date

SIZE = (520, 336)
ALT = {
    "zh": "live.trureturing.org 在 2026 年 11 月 27 日的快照中汇集 17 个公开仓库，展示 19,022 个有向无环图节点。八个职能部门是研究方向、数学攻坚、独立评审、形式验证、理论书写、论文与知识、学术交流、工具与表达。另据 trureturing 全分支提交记录，10 月 28 日至 11 月 26 日 UTC 的 720 个小时都有提交，每小时提交中位数为 63。",
    "en": "In the November 27, 2026 observatory snapshot, live.trureturing.org draws on 17 public repositories and displays 19,022 DAG nodes. Eight functional departments are Direction, Math Research, Indep. Review, Verification, Monographs, Papers & Wiki, Scholar Outreach, and Tools & Studio. A separate trureturing all-branches audit from October 28 through November 26 UTC found commits in all 720 hours, with a median of 63 per hour.",
}

# Observatory snapshot, 2026-11-27, as recorded in the conference blueprint.
REPOSITORIES, DAG_NODES = 17, 19022
DEPARTMENTS = (
    ("研究方向", "Direction"),
    ("数学攻坚", "Math Research"),
    ("独立评审", "Indep. Review"),
    ("形式验证", "Verification"),
    ("理论书写", "Monographs"),
    ("论文与知识", "Papers & Wiki"),
    ("学术交流", "Scholar Outreach"),
    ("工具与表达", "Tools & Studio"),
)
# Audited cadence window, 2026-10-28 through 2026-11-26 UTC.
WINDOW = (date(2026, 10, 28), date(2026, 11, 26))
ACTIVE_HOURS, MEDIAN_PER_HOUR = 720, 63


def draw(fig):
    hours = 24 * ((WINDOW[1] - WINDOW[0]).days + 1)
    assert len(DEPARTMENTS) == 8 and (REPOSITORIES, DAG_NODES) == (17, 19022)
    assert hours == ACTIVE_HOURS == 720 and MEDIAN_PER_HOUR == 63

    fig.text(16, 25, fig.t("live.trureturing.org", "live.trureturing.org"), size=21, weight=700)
    fig.text(504, 25, fig.t("2026-11-27", "2026-11-27"), size=17, color="dim", anchor="end")
    fig.rect(16, 44, 199, 46, color="edge", fill="panel", rx=7)
    fig.text(116, 67, fig.t(f"{REPOSITORIES} 个公开仓库", f"{REPOSITORIES} public repositories"),
             size=17, weight=650, anchor="middle", middle=True)
    fig.arrow(226, 67, 280, 67, "blue", 1.8, head=8)
    fig.rect(291, 44, 213, 46, color="cyan", fill="cyan", fill_opacity=0.10, rx=7)
    fig.text(397, 67, fig.t(f"{DAG_NODES:,} 个 DAG 节点", f"{DAG_NODES:,} DAG nodes"),
             size=17, color="cyan", weight=700, anchor="middle", middle=True)
    fig.line(397, 90, 397, 104, "cyan", 1.5)
    fig.line(16, 104, 504, 104, "cyan", 1.5)

    for index, (zh, en) in enumerate(DEPARTMENTS):
        column, row = index % 2, index // 2
        x, y = 16 + column * 249, 116 + row * 38
        fig.rect(x, y, 239, 32, color="edge", fill="panel", rx=5)
        fig.dot(x + 12, y + 16, 3, "blue")
        fig.text(x + 24, y + 16, fig.t(zh, en), size=17, middle=True, weight=600)

    fig.text(16, 288, fig.t(f"有提交的小时数 {ACTIVE_HOURS}/{hours} · 中位数 {MEDIAN_PER_HOUR}/小时",
                           f"{ACTIVE_HOURS}/{hours} hours with commits · median {MEDIAN_PER_HOUR}/hour"),
             size=17, weight=700)
    fig.text(16, 317, fig.t("trureturing 全分支 · 2026-10-28 至 11-26 UTC",
                           "trureturing, all branches · Oct 28–Nov 26, 2026 UTC"), size=17, color="dim")
