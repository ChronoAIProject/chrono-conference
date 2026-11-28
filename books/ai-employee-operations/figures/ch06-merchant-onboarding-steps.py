"""Five steps from a merchant identity to an auditable live operation."""

SIZE = (358, 360)
ALT = {
    "zh": "商户上手依次为创建无需邀请码的 NyxID 账户、连接九类门店消息渠道、选择 Ornn "
          "入门技能（nyx-skills 目录计 163 项）、配置审批与消费上限（1 credit = 1 USD 的计费单位换算），"
          "最后上线并保留审计账本及回放。",
    "en": "Merchant onboarding starts with a NyxID account without an invite code, followed by "
          "connecting nine channel types, selecting Ornn starter skills from the 163-skill nyx-skills "
          "catalog, configuring approval and spend ceilings (1 credit = 1 USD as a unit conversion), "
          "and going live with an audit ledger and replay.",
}

# Audited source: NyxID@v0.78.0; nyx-skills@25ef759 (2026-11-27).
# Account configuration and credit unit are specified by the conference figure brief.
CHANNELS, SKILLS = 9, 163
INVITE_REQUIRED = False


def draw(fig):
    t = fig.t
    assert (CHANNELS, SKILLS, INVITE_REQUIRED) == (9, 163, False)
    steps = [
        (t("创建 NyxID 账户", "Create NyxID account"), t("无需邀请码", "No invite code required")),
        (t("连接门店渠道", "Connect store channels"), t(f"{CHANNELS} 类消息渠道", f"{CHANNELS} channel types")),
        (t("选择 Ornn 入门技能", "Select Ornn starter skills"), t(f"nyx-skills · {SKILLS} 项", f"nyx-skills · {SKILLS} skills")),
        (t("配置审批与消费上限", "Set approval & spend ceiling"), t("1 credit = 1 USD（单位换算）", "1 credit = 1 USD")),
        (t("上线运营", "Go live"), t("审计账本与回放", "Audit ledger & replay")),
    ]
    first_y, pitch = 8, 71
    marker_x, marker_offset, marker_radius = 27, 29, 18
    for index, (title, detail) in enumerate(steps, 1):
        y = first_y + (index - 1) * pitch
        marker_y = y + marker_offset
        if index < len(steps):
            fig.line(marker_x, marker_y + marker_radius, marker_x, marker_y + pitch - marker_radius, "cyan", 1.8)
        fig.rect(52, y, 298, 59, color="edge", fill="panel", rx=6)
        fig.circle(marker_x, marker_y, marker_radius, color="cyan", fill="bg", width=1.7)
        fig.text(marker_x, marker_y, t(str(index), str(index)), size=16, color="cyan",
                 weight=600, anchor="middle", middle=True)
        fig.line(marker_x + marker_radius, marker_y, 52, marker_y, "cyan", 1.5)
        fig.text(64, y + 19, title, size=15, weight=600, middle=True)
        fig.text(64, y + 41, detail, size=13, color="dim", middle=True)
