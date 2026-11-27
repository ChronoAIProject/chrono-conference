"""Ornn's skill lifecycle, from authoring through audited retrieval."""

SIZE = (500, 322)
ALT = {
    "zh": "Ornn v0.18.0 的五阶段技能生命周期：编写或生成技能、AgentSeal 安全扫描、冻结版本"
          "及分发标签、绑定 NyxID 服务、智能体拉取并审计；使用反馈返回编写阶段。"
          "Ornn 规范列出 134 项 OpenAPI 操作。nyx-skills 有 163 项技能，Ornn 有 286 个测试文件。",
    "en": "Ornn v0.18.0 takes a skill through authoring or generation, AgentSeal security scanning, "
          "version and distribution-tag freezing, NyxID service binding, and agent retrieval with audit. "
          "Usage feedback returns to authoring. The Ornn spec lists 134 OpenAPI operations, "
          "nyx-skills contains 163 skills, and Ornn has 286 test files.",
}

# Ornn@v0.18.0 (2026-11-19): 134 ops on 109 paths in the full OpenAPI spec.
# Skill catalog: nyx-skills@d77457c (2026-11-27).
OPERATIONS, SKILLS, TEST_FILES = 134, 163, 286


def draw(fig):
    t = fig.t
    assert (OPERATIONS, SKILLS, TEST_FILES) == (134, 163, 286)

    fig.text(250, 21, t("Ornn v0.18.0 · 技能生命周期", "Ornn v0.18.0 · Skill lifecycle"),
             size=18, weight=600, anchor="middle")
    stages = [
        (88, 43, t("编写 / 生成", "Author / generate"), "edge"),
        (250, 43, t("AgentSeal\n安全扫描", "AgentSeal\nsecurity scan"), "blue"),
        (412, 43, t("冻结版本\n与分发标签", "Freeze version\n& dist-tag"), "cyan"),
        (412, 151, t("NyxID\n服务绑定", "NyxID\nservice binding"), "blue"),
        (250, 151, t("智能体拉取\n与审计", "Agent pull\n& audit"), "cyan"),
    ]
    for index, (x, y, label, role) in enumerate(stages, 1):
        number_offset, title_offset = (17, 48) if index <= 3 else (13, 40)
        fig.rect(x - 72, y, 144, 82, color=role, fill="panel", rx=7, width=1.6)
        fig.text(x, y + number_offset, t(f"{index:02d}", f"{index:02d}"), size=15, color="dim",
                 anchor="middle", middle=True, mono=True)
        lines = label.split("\n")
        fig.lines(x, y + title_offset - (len(lines) - 1) * 10, lines, size=15, leading=1.35,
                  anchor="middle", middle=True, weight=600)
    for x in (160, 322):
        fig.arrow(x, 84, x + 18, 84, "cyan", 1.6, head=7)
    fig.arrow(412, 125, 412, 151, "cyan", 1.6, head=7)
    fig.arrow(340, 192, 322, 192, "cyan", 1.6, head=7)
    fig.curve_arrow([(178, 192), (88, 192), (88, 125)], "dim", 1.6, dash="4 4", head=7)
    fig.text(100, 170, t("使用反馈", "Feedback"), size=15, color="dim")

    fig.line(15, 243, 485, 243, "edge", 1.2)
    for x, value, label in [
        (88, OPERATIONS, t("OpenAPI 操作", "OpenAPI ops")),
        (250, SKILLS, t("nyx-skills 技能", "nyx-skills")),
        (412, TEST_FILES, t("测试文件", "Test files")),
    ]:
        fig.text(x, 270, t(str(value), str(value)), size=25, color="cyan", weight=600, anchor="middle")
        fig.text(x, 290, label, size=15, anchor="middle")
    fig.text(250, 314, t("2026-11-19 / 27 · Ornn v0.18.0 & nyx-skills", "2026-11-19 / 27 · Ornn v0.18.0 & nyx-skills"),
             size=15, color="dim", anchor="middle")
