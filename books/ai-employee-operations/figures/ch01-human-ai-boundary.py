"""Routine execution and retained human authority across nine operating roles."""

SIZE = (680, 344)
WRAP = True
ALT = {
    "zh": "九个独立 AI 员工岗位覆盖 120 项工作流中的 102 项。左栏的青色进度条按 102/120 比例绘制，"
          "列出受理、分流、拟稿、预约锁定、账本对账和定时发布。右栏列出必须由人掌握的权限："
          "资金拨付、对外法律承诺、未经批准的媒体表述及不可逆撤销。六核心岗位为 82/99（82.8%），审计日期为 2026-11-27。",
    "en": "Nine standalone AI employee roles cover 102 of 120 workflows. The cyan bar shows the exact coverage fraction "
          "and the left panel lists intake, triage, drafting, booking locks, ledger reconciliation and "
          "scheduled posts. The right panel reserves capital release, external legal commitments, "
          "unapproved press claims and irreversible revocations for human authority. The six-core roster is 82/99 (82.8%) on November 27, 2026.",
}

# Audited standalone roster, 2026-11-27.
ROLES, COVERED, TOTAL = 9, 102, 120
CORE_COVERED, CORE_TOTAL = 82, 99


def draw(fig):
    t = fig.t
    assert (ROLES, COVERED, TOTAL, CORE_COVERED, CORE_TOTAL) == (9, 102, 120, 82, 99)
    autonomous, human = fig.row([330, 330], SIZE[1], gap=20)
    for panel, role in ((autonomous, "cyan"), (human, "magenta")):
        panel.rect(2, 2, 326, SIZE[1] - 4, color=role, fill="panel", rx=8, width=1.6)

    autonomous.text(165, 23, t("AI 员工执行", "AI employee execution"), size=18,
                    weight=600, color="cyan", anchor="middle", middle=True)
    autonomous.text(18, 80, f"{COVERED}/{TOTAL}", size=28,
                    color="cyan", weight=600)
    autonomous.text(312, 80, t(f"{ROLES} 个独立岗位", f"{ROLES} standalone roles"), size=15, anchor="end")
    width = 294
    autonomous.rect(18, 96, width, 13, color="edge", fill="bg", rx=3)
    autonomous.rect(18, 96, width * COVERED / TOTAL, 13, color=None, fill="cyan", rx=3)
    autonomous.text(18, 133, t("九岗位覆盖工作流", "Nine-role workflow coverage"), size=14, color="dim")
    core_rate = f"{CORE_COVERED / CORE_TOTAL:.1%}"
    autonomous.text(18, 158, t(f"六核心 {CORE_COVERED}/{CORE_TOTAL} · {core_rate}",
                               f"Six-core {CORE_COVERED}/{CORE_TOTAL} · {core_rate}"), size=14, color="dim")
    tasks = [
        t("受理", "Intake"), t("分流", "Triage"), t("拟稿", "Drafting"),
        t("预约锁定", "Booking locks"), t("账本对账", "Ledger reconciliation"),
        t("定时发布", "Scheduled posts"),
    ]
    for index, task in enumerate(tasks):
        y = 182 + index * 26
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
        y = 64 + index * 69
        human.rect(18, y, 294, 44, color="edge", fill="bg", rx=5)
        # A lock denotes a retained authorization, not a failure state.
        human.rect(29, y + 17, 16, 14, color="magenta", fill="magenta", fill_opacity=0.13, rx=2)
        human.arc(37, y + 17, 5, 0, 180, "magenta", 1.6)
        human.text(57, y + 22, label, size=15, color="ink", middle=True)
