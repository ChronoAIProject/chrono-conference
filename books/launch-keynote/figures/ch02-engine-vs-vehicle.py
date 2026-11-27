SIZE = (680, 320)
WRAP = True
ALT = {
    "zh": "整车类比。左栏的裸发动机由孤立提示词、明文 .env 密钥与手工复制粘贴拼成，缺少审计和回滚。右栏的可更换发动机接入五层底盘，依次为 NyxID 身份与授权、Ornn 技能、CMA 与 heca 运行环境、chrono-harness 治理及实际业务界面。",
    "en": "A vehicle analogy in two panels. A bare engine relies on an isolated prompt, plaintext .env keys, and manual copy and paste, with no audit or rollback. A swappable engine plugs into a five-layer chassis: NyxID for identity and access, Ornn for skills, CMA and heca for runtimes, chrono-harness for governance, and live surfaces.",
}


def draw(fig):
    bare, complete = fig.row([330, 330], 320, gap=20)
    for panel, title, role in (
        (bare, fig.t("裸发动机", "Bare engine"), "magenta"),
        (complete, fig.t("整车", "Complete vehicle"), "cyan"),
    ):
        panel.rect(1, 1, 328, 318, color="edge", fill="panel", fill_opacity=0.55, rx=10)
        panel.line(18, 49, 312, 49, role, 2)
        panel.text(18, 32, title, size=21, weight=700)

    loose_parts = (
        fig.t("孤立的提示词", "Isolated prompt"),
        fig.t("明文 .env 密钥", "Plaintext .env keys"),
        fig.t("手工复制粘贴", "Brittle copy and paste"),
    )
    for index, label in enumerate(loose_parts):
        top = 70 + index * 63
        bare.rect(26, top, 278, 44, color="magenta", width=1.3, dash="5 4", rx=5)
        bare.text(165, top + 22, label, size=17, anchor="middle", middle=True)
        if index < len(loose_parts) - 1:
            bare.line(165, top + 44, 165, top + 63, "dim", 1.3, dash="3 3")
    bare.text(165, 285, fig.t("缺少审计与回滚", "No audit or rollback"), size=16, color="magenta", anchor="middle", weight=650)

    layers = (
        (fig.t("NyxID", "NyxID"), fig.t("身份与授权", "Identity & access")),
        (fig.t("Ornn", "Ornn"), fig.t("技能管理", "Skill lifecycle")),
        (fig.t("CMA / heca", "CMA / heca"), fig.t("运行环境", "Runtimes")),
        (fig.t("chrono-harness", "chrono-harness"), fig.t("治理", "Governance")),
        (fig.t("业务界面", "Live surfaces"), fig.t("交付与运营", "Delivery & ops")),
    )
    assert len(layers) == 5
    complete.rect(26, 64, 278, 36, color="cyan", fill="cyan", fill_opacity=0.13, rx=5)
    complete.text(165, 82, fig.t("可更换发动机", "Swappable engine"), size=17, color="cyan", anchor="middle", middle=True, weight=650)
    complete.arrow(165, 101, 165, 117, "cyan", 1.5, head=6)
    complete.rect(26, 118, 278, 177, color="cyan", fill="cyan", fill_opacity=0.06, rx=5)
    for index, (name, purpose) in enumerate(layers):
        top = 119 + index * 35
        if index:
            complete.line(35, top, 295, top, "edge", 1)
        complete.text(39, top + 17, name, size=15, weight=650, middle=True)
        complete.text(291, top + 17, purpose, size=14, color="dim", anchor="end", middle=True)
