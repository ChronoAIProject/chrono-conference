"""Explicit DELTA selection and evidence production in chrono-harness."""

from tbook.figkit import Box

SIZE = (358, 530)
ALT = {
    "zh": "chrono-harness 当前活跃仓库按 Git 差异查询 FILEMAP 明确登记，传递选出受影响的 DELTA 检查，"
          "执行候选判官（基线只作为数据）并生成通过或失败证据回执。完整性尚未证明。"
          "活跃组织有 25 个公开仓库，每个平台有 21 个预构建二进制，Copier v0.1.52 提供 29 条规则。",
    "en": "The active chrono-harness organization looks up a Git diff in the explicit FILEMAP registry, transitively selects "
          "affected DELTA checks, runs the candidate judge with the baseline as data only, and records pass "
          "or fail evidence. Completeness remains unproven. It has 25 public repositories, 21 prebuilt binaries "
          "per platform, Copier v0.1.52, and 29 atomic rules as of November 27, 2026.",
}

# Audited active home: https://github.com/chrono-harness/, 2026-11-27.
REPOSITORIES, BINARIES, COPIER, RULES = 25, 21, "v0.1.52", 29


def draw(fig):
    t = fig.t
    assert (REPOSITORIES, BINARIES, COPIER, RULES) == (25, 21, "v0.1.52", 29)
    fig.text(179, 24, t("chrono-harness · 活跃仓库", "chrono-harness · active home"),
             size=16, weight=600, anchor="middle")
    fig.text(179, 44, "github.com/chrono-harness/",
             size=12, mono=True, color="dim", anchor="middle")
    for x, y, value, label in [
        (88, 75, str(REPOSITORIES), t("公开仓库", "Public repos")),
        (270, 75, str(BINARIES), t("二进制 / 平台", "Binaries / platform")),
        (88, 132, COPIER, "Copier"),
        (270, 132, str(RULES), t("原子规则", "Atomic rules")),
    ]:
        fig.text(x, y, value, size=21, weight=600, color="cyan", anchor="middle")
        fig.text(x, y + 25, label, size=13, anchor="middle")
    fig.line(12, 168, 346, 168, "edge", 1.2)
    stages = [
        (t("Git 差异", "Git diff"), None, "edge"),
        (t("FILEMAP 明确登记查询", "FILEMAP registry lookup"), None, "blue"),
        (t("传递 DELTA 选择", "Transitive DELTA selection"), None, "blue"),
        (t("执行候选判官", "Run candidate judge"), t("基线仅作为数据", "Baseline as data only"), "cyan"),
        (t("通过 / 失败证据回执", "Pass / fail evidence receipt"), None, "edge"),
    ]
    y = 180
    previous = None
    for title, note, role in stages:
        if note:
            box = Box(25, y, 308, 58)
            fig.rect(25, y, 308, 58, color=role, fill=role, fill_opacity=0.10, width=1.6, rx=6)
            fig.text(179, y + 17, title, color=role, size=15, anchor="middle", middle=True)
            fig.text(179, y + 41, note, color="dim", size=13, anchor="middle", middle=True)
        else:
            box = fig.box(179, y, title, role, w=308, size=15)
        if previous:
            fig.link(previous, box, "dim")
        previous = box
        y = box.bottom[1] + 15
    fig.line(25, 459, 333, 459, "edge", 1.2)
    fig.text(179, 483, "completeness_proven: false",
             size=13, mono=True, color="dim", anchor="middle")
    fig.text(179, 507, t("活跃仓库与工具链 · 2026-11-27", "Active home and toolchain · 2026-11-27"),
             size=13, color="dim", anchor="middle")
