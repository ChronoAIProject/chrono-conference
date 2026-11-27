"""Community signals proceed through eight operating roles to human review and audit."""

SIZE = (560, 340)
ALT = {
    "zh": "Discord、X、GitHub 的信号进入八个运营岗位。11 月 27 日审计的覆盖率为社群 10/12、Auto-X 12/14、财务 24/28、HR 14/20、行政 8/10、舆情监测 6/7、知识库 3/3、复盘 11/11。底部记录 11/12 的全流程排练结果，再进入人类审批与审计日志。",
    "en": "Discord, X and GitHub signals feed eight operating roles. The November 27 audit records Community 10/12, Auto-X 12/14, Finance 24/28, HR 14/20, Admin 8/10, Sentiment 6/7, KB 3/3 and Retro 11/11. The bottom rehearsal gate records 11/12 full-flow stages passed before human approval and audit logging.",
}

# Role coverage and full-flow rehearsal from the 2026-11-27 audit.
ROLE_DATA = (
    ("社群运营", "Community", 10, 12),
    ("Auto-X", "Auto-X", 12, 14),
    ("财务", "Finance", 24, 28),
    ("HR", "HR", 14, 20),
    ("行政", "Admin", 8, 10),
    ("舆情监测", "Sentiment", 6, 7),
    ("知识库", "KB", 3, 3),
    ("复盘", "Retro", 11, 11),
)
REHEARSAL_PASSED, REHEARSAL_STAGES = 11, 12


def draw(fig):
    t = fig.t
    assert len(ROLE_DATA) == 8
    assert sum(row[2] for row in ROLE_DATA) == 88 and sum(row[3] for row in ROLE_DATA) == 105
    assert (REHEARSAL_PASSED, REHEARSAL_STAGES) == (11, 12)

    fig.rect(13, 6, 534, 34, color="edge", fill="panel", rx=6)
    fig.text(280, 23, t("Discord  ·  X  ·  GitHub 信号", "Discord  ·  X  ·  GitHub signals"),
             size=16, weight=600, anchor="middle", middle=True)
    centers = (80, 215, 350, 485)
    for x in centers:
        fig.arrow(x, 40, x, 55, "dim", 1.4, head=7)
        fig.arrow(x, 127, x, 144, "dim", 1.4, head=7)
        fig.arrow(x, 216, x, 239, "dim", 1.4, head=7)

    for index, (zh, en, covered, total) in enumerate(ROLE_DATA):
        row, column = divmod(index, 4)
        x, y = centers[column], 55 + row * 89
        role = "cyan" if row == 0 else "blue"
        fig.rect(x - 60, y, 120, 72, color=role, fill="panel", rx=5, width=1.4)
        fig.text(x, y + 17, t(zh, en), size=16, weight=600, anchor="middle", middle=True)
        fig.text(x + 50, y + 39, t(f"{covered}/{total}", f"{covered}/{total}"),
                 size=17, color=role, weight=600, anchor="end", middle=True)
        fig.rect(x - 50, y + 52, 100, 6, color=None, fill="edge", rx=2)
        fig.rect(x - 50, y + 52, 100 * covered / total, 6, color=None, fill=role, rx=2)

    fig.rect(13, 239, 534, 34, color="now", fill="now", fill_opacity=0.10, rx=5, width=1.6)
    fig.text(280, 256, t("2026-11-27 全流程排练 · 11/12 通过", "Nov 27 full-flow rehearsal · 11/12 passed"),
             size=16, color="now", weight=600, anchor="middle", middle=True)
    fig.arrow(280, 273, 280, 291, "cyan", 1.6, head=7)
    fig.rect(13, 291, 534, 33, color="cyan", fill="panel", rx=5)
    fig.text(280, 307, t("人类审批队列  +  审计日志", "Human approval queue  +  audit log"),
             size=16, weight=600, anchor="middle", middle=True)
