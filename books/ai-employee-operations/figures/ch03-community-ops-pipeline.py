"""Community signals proceed through eight operating roles to human review and audit."""

SIZE = (560, 425)
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

    card_height, pitch, first_row = 99, 120, 69
    rehearsal_top = first_row + 2 * pitch + 3
    approval_top = rehearsal_top + 59
    fig.rect(13, 7, 534, 42, color="edge", fill="panel", rx=6)
    fig.text(280, 28, t("Discord  ·  X  ·  GitHub 信号", "Discord  ·  X  ·  GitHub signals"),
             size=19, weight=600, anchor="middle", middle=True)
    centers = (77, 212, 348, 483)
    for x in centers:
        fig.arrow(x, 49, x, first_row, "dim", 1.4, head=7)
        fig.arrow(x, first_row + card_height, x, first_row + pitch, "dim", 1.4, head=7)
        fig.arrow(x, first_row + pitch + card_height, x, rehearsal_top, "dim", 1.4, head=7)

    for index, (zh, en, covered, total) in enumerate(ROLE_DATA):
        row, column = divmod(index, 4)
        x, y = centers[column], first_row + row * pitch
        role = "cyan" if row == 0 else "blue"
        fig.rect(x - 63, y, 126, card_height, color=role, fill="panel", rx=5, width=1.4)
        fig.text(x, y + 22, t(zh, en), size=19, weight=600, anchor="middle", middle=True)
        fig.text(x + 50, y + 54, f"{covered}/{total}",
                 size=19, color=role, weight=600, anchor="end", middle=True)
        fig.rect(x - 50, y + 75, 100, 6, color=None, fill="edge", rx=2)
        fig.rect(x - 50, y + 75, 100 * covered / total, 6, color=None, fill=role, rx=2)

    fig.rect(13, rehearsal_top, 534, 41, color="now", fill="now", fill_opacity=0.10, rx=5, width=1.6)
    result = f"{REHEARSAL_PASSED}/{REHEARSAL_STAGES}"
    fig.text(280, rehearsal_top + 20, t(f"2026-11-27 全流程排练 · {result} 通过", f"Nov 27 full-flow rehearsal · {result} passed"),
             size=19, color="now", weight=600, anchor="middle", middle=True)
    fig.arrow(280, rehearsal_top + 41, 280, approval_top, "cyan", 1.6, head=7)
    fig.rect(13, approval_top, 534, 41, color="cyan", fill="panel", rx=5)
    fig.text(280, approval_top + 20, t("人类审批队列  +  审计日志", "Human approval queue  +  audit log"),
             size=19, weight=600, anchor="middle", middle=True)
