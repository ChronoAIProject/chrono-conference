"""Ornn's skill lifecycle, from authoring through audited retrieval."""

SIZE = (500, 425)
ALT = {
    "zh": "Ornn v0.18.0 的五阶段技能生命周期：编写或生成技能、AgentSeal 安全扫描、冻结版本"
          "及分发标签、绑定 NyxID 服务、智能体拉取并审计；使用反馈返回编写阶段。"
          "Ornn 规范列出 134 项 OpenAPI 操作。nyx-skills 有 163 项技能，Ornn 有 286 个测试文件。",
    "en": "Ornn v0.18.0 takes a skill through authoring or generation, AgentSeal security scanning, "
          "version and distribution-tag freezing, NyxID service binding, and agent retrieval with audit. "
          "Usage feedback returns to authoring. The Ornn spec lists 134 OpenAPI operations, "
          "nyx-skills contains 163 skills, and Ornn has 286 test files.",
}

# Ornn@v0.18.0 (2026-11-27): 134 ops on 109 paths in the full OpenAPI spec.
# Skill catalog: nyx-skills@25ef75934d (2026-11-27).
OPERATIONS, SKILLS, TEST_FILES = 134, 163, 286


def draw(fig):
    t = fig.t
    assert (OPERATIONS, SKILLS, TEST_FILES) == (134, 163, 286)

    fig.text(250, 27, t("Ornn v0.18.0 · 技能生命周期", "Ornn v0.18.0 · Skill lifecycle"),
             size=19, weight=600, anchor="middle")
    stages = [
        (88, 49, t("编写 / 生成", "Author /\ngenerate"), "edge"),
        (250, 49, t("AgentSeal\n安全扫描", "AgentSeal\nsecurity scan"), "blue"),
        (412, 49, t("冻结版本\n与分发标签", "Freeze version\n& dist-tag"), "cyan"),
        (412, 185, t("NyxID\n服务绑定", "NyxID\nservice binding"), "blue"),
        (250, 185, t("智能体拉取\n与审计", "Agent pull\n& audit"), "cyan"),
    ]
    for index, (x, y, label, role) in enumerate(stages, 1):
        fig.rect(x - 72, y, 144, 112, color=role, fill="panel", rx=7, width=1.6)
        fig.text(x, y + 23, f"{index:02d}", size=17, color="dim",
                 anchor="middle", middle=True, mono=True)
        lines = label.split("\n")
        fig.lines(x, y + (68 if len(lines) == 1 else 54), lines, size=17, leading=1.7,
                  anchor="middle", middle=True, weight=600)
    for x in (160, 322):
        fig.arrow(x, 105, x + 18, 105, "cyan", 1.6, head=7)
    fig.arrow(412, 161, 412, 185, "cyan", 1.6, head=7)
    fig.arrow(340, 241, 322, 241, "cyan", 1.6, head=7)
    fig.curve_arrow([(178, 241), (88, 241), (88, 161)], "dim", 1.6, dash="4 4", head=7)
    fig.text(131, 220, t("使用反馈", "Feedback"), size=17, color="dim", anchor="middle")

    fig.line(15, 312, 485, 312, "edge", 1.2)
    for x, value, label in [
        (88, OPERATIONS, t("OpenAPI 操作", "OpenAPI ops")),
        (250, SKILLS, t("nyx-skills 技能", "nyx-skills")),
        (412, TEST_FILES, t("测试文件", "Test files")),
    ]:
        fig.text(x, 346, str(value), size=25, color="cyan", weight=600, anchor="middle")
        fig.text(x, 376, label, size=17, anchor="middle")
    fig.text(250, 409, "2026-11-27 · Ornn v0.18.0 & nyx-skills",
             size=17, color="dim", anchor="middle")
