"""Routine execution and retained human authority across six operating roles."""

SIZE = (680, 310)
WRAP = True
ALT = {
    "zh": "六个 AI 员工岗位覆盖 97 项工作流中的 77 项。左栏的青色进度条按 77/97 比例绘制，"
          "列出受理、分流、拟稿、预约锁定、账本对账和定时发布。右栏列出必须由人掌握的权限："
          "资金拨付、对外法律承诺、未经批准的媒体表述及不可逆撤销。",
    "en": "Six AI employee roles cover 77 of 97 workflows. The cyan bar shows the exact coverage fraction "
          "and the left panel lists intake, triage, drafting, booking locks, ledger reconciliation and "
          "scheduled posts. The right panel reserves capital release, external legal commitments, "
          "unapproved press claims and irreversible revocations for human authority.",
}

# Six-role workflow coverage from the conference figure brief.
ROLES, COVERED, TOTAL = 6, 77, 97


def draw(fig):
    t = fig.t
    assert (ROLES, COVERED, TOTAL) == (6, 77, 97)
    autonomous, human = fig.row([330, 330], 310, gap=20)
    for panel, role in ((autonomous, "cyan"), (human, "magenta")):
        panel.rect(2, 2, 326, 306, color=role, fill="panel", rx=8, width=1.6)

    autonomous.text(165, 23, t("AI 员工执行", "AI employee execution"), size=18,
                    weight=600, color="cyan", anchor="middle", middle=True)
    autonomous.text(18, 58, t(f"{COVERED}/{TOTAL}", f"{COVERED}/{TOTAL}"), size=28,
                    color="cyan", weight=600)
    autonomous.text(312, 57, t(f"{ROLES} 个岗位", f"{ROLES} roles"), size=15, anchor="end")
    width = 294
    autonomous.rect(18, 72, width, 13, color="edge", fill="bg", rx=3)
    autonomous.rect(18, 72, width * COVERED / TOTAL, 13, color=None, fill="cyan", rx=3)
    autonomous.text(18, 104, t("已覆盖工作流", "Covered workflows"), size=14, color="dim")
    tasks = [
        t("受理", "Intake"), t("分流", "Triage"), t("拟稿", "Drafting"),
        t("预约锁定", "Booking locks"), t("账本对账", "Ledger reconciliation"),
        t("定时发布", "Scheduled posts"),
    ]
    for index, task in enumerate(tasks):
        y = 127 + index * 29
        autonomous.dot(26, y, 4, "cyan")
        autonomous.text(42, y, task, size=15, middle=True)

    human.text(165, 23, t("人类授权边界", "Human authority boundary"), size=17,
               weight=600, color="magenta", anchor="middle", middle=True)
    human.line(18, 44, 312, 44, "magenta", 1.4)
    permissions = [
        t("资金拨付", "Capital release"),
        t("对外法律承诺", "External legal commitments"),
        t("未经批准的媒体表述", "Unapproved press claims"),
        t("不可逆撤销", "Irreversible revocations"),
    ]
    for index, label in enumerate(permissions):
        y = 63 + index * 57
        human.rect(18, y, 294, 44, color="edge", fill="bg", rx=5)
        # A lock denotes a retained authorization, not a failure state.
        human.rect(29, y + 17, 16, 14, color="magenta", fill="magenta", fill_opacity=0.13, rx=2)
        human.arc(37, y + 17, 5, 0, 180, "magenta", 1.6)
        human.text(57, y + 22, label, size=15, color="ink", middle=True)
