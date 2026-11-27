from datetime import date

SIZE = (520, 320)
ALT = {
    "zh": "live.trureturing.org 在 2026 年 11 月 27 日的快照中汇集 17 个公开仓库，展示 19,022 个有向无环图节点。八个部门是形式验证核心、理论架构、开放问题搜寻、量子与基础、数论与零点、组合与 OEIS、学术外联与专著、治理与 StrataLint。另据 trureturing 全分支提交记录，10 月 21 日至 11 月 19 日 UTC 的 720 个小时都有提交，每小时提交中位数为 59。",
    "en": "In the November 27, 2026 observatory snapshot, live.trureturing.org draws on 17 public repositories and displays 19,022 DAG nodes. Eight departments cover Formal Verification Core, Theory Architecture, Open Problem Hunting, Quantum & Foundations, Number Theory & Zeros, Combinatorics & OEIS, Outreach & Monographs, and Governance & StrataLint. A separate trureturing all-branches audit from October 21 through November 19 UTC found commits in all 720 hours, with a median of 59 per hour.",
}

# Observatory snapshot, 2026-11-27, as recorded in the conference blueprint.
REPOSITORIES, DAG_NODES = 17, 19022
DEPARTMENTS = (
    ("形式验证核心", "Formal Verification Core"),
    ("理论架构", "Theory Architecture"),
    ("开放问题搜寻", "Open Problem Hunting"),
    ("量子与基础", "Quantum & Foundations"),
    ("数论与零点", "Number Theory & Zeros"),
    ("组合与 OEIS", "Combinatorics & OEIS"),
    ("学术外联与专著", "Outreach & Monographs"),
    ("治理与 StrataLint", "Governance & StrataLint"),
)
# facts-latest.json, tru.cov_start/end, tru.hours_with_commits and tru.median_per_hour.
WINDOW = (date(2026, 10, 21), date(2026, 11, 19))
ACTIVE_HOURS, MEDIAN_PER_HOUR = 720, 59


def draw(fig):
    hours = 24 * ((WINDOW[1] - WINDOW[0]).days + 1)
    assert len(DEPARTMENTS) == 8 and (REPOSITORIES, DAG_NODES) == (17, 19022)
    assert hours == ACTIVE_HOURS == 720 and MEDIAN_PER_HOUR == 59

    fig.text(16, 25, fig.t("live.trureturing.org", "live.trureturing.org"), size=21, weight=700)
    fig.text(504, 25, fig.t("2026-11-27", "2026-11-27"), size=15, color="dim", anchor="end")
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
        x, y = 16 + column * 249, 116 + row * 35
        fig.rect(x, y, 239, 29, color="edge", fill="panel", rx=5)
        fig.dot(x + 12, y + 14.5, 3, "blue")
        fig.text(x + 24, y + 14.5, fig.t(zh, en), size=15, middle=True, weight=600)

    fig.text(16, 275, fig.t(f"有提交的小时数 {ACTIVE_HOURS}/{hours} · 中位数 {MEDIAN_PER_HOUR}/小时",
                           f"{ACTIVE_HOURS}/{hours} hours with commits · median {MEDIAN_PER_HOUR}/hour"),
             size=16, weight=700)
    fig.text(16, 300, fig.t("trureturing 全分支 · 2026-10-21 至 11-19 UTC",
                           "trureturing, all branches · Oct 21–Nov 19, 2026 UTC"), size=15, color="dim")
