"""Community signals proceed through operating roles to human review and audit."""

SIZE = (500, 332)
ALT = {
    "zh": "Discord、X、GitHub 的信号进入社群运营（覆盖 9/11 项工作流，75 次演练操作）"
          "与 Auto-X（11/13），随后进入财务（24/28）与 HR（15/20）。需要授权的行动进入"
          "人类审批队列，再发布并写入审计日志。",
    "en": "Discord, X and GitHub signals feed Community Ops (9 of 11 workflows, 75 rehearsal actions) "
          "and Auto-X (11 of 13). Finance covers 24 of 28 workflows and HR covers 15 of 20. "
          "Actions requiring authorization enter the human approval queue before publication and audit logging.",
}

# Role coverage and rehearsal actions from the conference figure brief.
COMMUNITY, AUTO_X, FINANCE, HR = (9, 11), (11, 13), (24, 28), (15, 20)
REHEARSAL_ACTIONS = 75


def draw(fig):
    t = fig.t
    assert (COMMUNITY, AUTO_X, FINANCE, HR, REHEARSAL_ACTIONS) == ((9, 11), (11, 13), (24, 28), (15, 20), 75)

    fig.rect(13, 6, 474, 34, color="edge", fill="panel", rx=6)
    fig.text(250, 23, t("Discord  ·  X  ·  GitHub 信号", "Discord  ·  X  ·  GitHub signals"),
             size=16, weight=600, anchor="middle", middle=True)
    for x in (128, 372):
        fig.arrow(x, 40, x, 56, "dim", 1.4, head=7)

    roles = [
        (128, 56, t("社群运营", "Community Ops"), COMMUNITY, "cyan"),
        (372, 56, t("Auto-X", "Auto-X"), AUTO_X, "cyan"),
        (128, 150, t("财务", "Finance"), FINANCE, "blue"),
        (372, 150, t("HR", "HR"), HR, "blue"),
    ]
    for x, y, name, (covered, total), role in roles:
        fig.rect(x - 115, y, 230, 78, color=role, fill="panel", rx=5, width=1.4)
        fig.text(x - 103, y + 18, name, size=15, weight=600, middle=True)
        fig.text(x + 103, y + 18, t(f"{covered}/{total}", f"{covered}/{total}"),
                 size=18, color=role, weight=600, anchor="end", middle=True)
        fig.rect(x - 103, y + 35, 206, 6, color=None, fill="edge", rx=2)
        fig.rect(x - 103, y + 35, 206 * covered / total, 6, color=None, fill=role, rx=2)
        detail = (t(f"{REHEARSAL_ACTIONS} 次演练操作", f"{REHEARSAL_ACTIONS} rehearsal actions")
                  if name == t("社群运营", "Community Ops") else t("工作流覆盖", "Workflow coverage"))
        fig.text(x - 103, y + 62, detail, size=15, color="dim", middle=True)
    for x in (128, 372):
        fig.arrow(x, 134, x, 150, "dim", 1.4, head=7)
        fig.arrow(x, 228, x, 244, "dim", 1.4, head=7)
    fig.rect(13, 244, 474, 32, color="now", fill="now", fill_opacity=0.10, rx=5, width=1.6)
    fig.text(250, 260, t("人类审批队列", "Human approval queue"), size=16, color="now",
             weight=600, anchor="middle", middle=True)
    fig.arrow(250, 276, 250, 292, "cyan", 1.6, head=7)
    fig.rect(13, 292, 474, 33, color="cyan", fill="panel", rx=5)
    fig.text(250, 308, t("发布行动  +  审计日志", "Published action  +  audit log"),
             size=16, weight=600, anchor="middle", middle=True)
