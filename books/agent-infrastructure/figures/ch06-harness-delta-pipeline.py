"""Explicit DELTA selection and evidence production in chrono-harness."""

SIZE = (358, 426)
ALT = {
    "zh": "chrono-harness v0.1.4 按 Git 差异查询 FILEMAP 明确登记，传递选出受影响的 DELTA 检查，"
          "执行候选判官（基线只作为数据）并生成通过或失败证据回执。完整性尚未证明。"
          "每个发布平台有 16 个二进制文件，Rust 源码约 27.2 万行，发布会资料列出 25 个仓库。",
    "en": "chrono-harness v0.1.4 looks up a Git diff in the explicit FILEMAP registry, transitively selects "
          "affected DELTA checks, runs the candidate judge with the baseline as data only, and records pass "
          "or fail evidence. Completeness remains unproven. There are 16 binaries per release platform, "
          "approximately 272,000 Rust source lines, and 25 repositories according to the conference brief.",
}

# facts-latest.json: release v0.1.4 (2026-11-13), Rust LOC at f619e1c (2026-11-22).
# Repository count supplied in the conference task.
BINARIES, RUST_WAN, REPOSITORIES = 16, 27.2, 25


def draw(fig):
    t = fig.t
    assert (BINARIES, RUST_WAN, REPOSITORIES) == (16, 27.2, 25)
    rust_lines = round(RUST_WAN * 10_000)
    assert rust_lines == 272_000
    fig.text(179, 21, t("chrono-harness v0.1.4", "chrono-harness v0.1.4"),
             size=17, weight=600, anchor="middle")
    for x, value, label in [
        (61, t(str(BINARIES), str(BINARIES)), t("二进制 / 平台", "Binaries / platform")),
        (179, t(f"{RUST_WAN} 万", f"{rust_lines // 1000}k"), t("Rust 源码行", "Rust LOC")),
        (297, t(str(REPOSITORIES), str(REPOSITORIES)), t("仓库", "Repos")),
    ]:
        fig.text(x, 46, value, size=22, weight=600, color="cyan", anchor="middle")
        fig.text(x, 63, label, size=13, anchor="middle")
    fig.line(12, 74, 346, 74, "edge", 1.2)
    stages = [
        (t("Git 差异", "Git diff"), None, "edge"),
        (t("FILEMAP 明确登记查询", "FILEMAP registry lookup"), None, "blue"),
        (t("传递 DELTA 选择", "Transitive DELTA selection"), None, "blue"),
        (t("执行候选判官", "Run candidate judge"), t("基线仅作为数据", "Baseline as data only"), "cyan"),
        (t("通过 / 失败证据回执", "Pass / fail evidence receipt"), None, "edge"),
    ]
    y = 85
    previous = None
    for title, note, role in stages:
        box = fig.box(179, y, title, role, w=308, note=note, note_mono=False, size=15, note_size=13)
        if previous:
            fig.link(previous, box, "dim")
        previous = box
        y = box.bottom[1] + 15
    fig.line(25, 365, 333, 365, "edge", 1.2)
    fig.text(179, 380, t("completeness_proven: false", "completeness_proven: false"),
             size=13, mono=True, color="dim", anchor="middle")
    fig.text(179, 400, t("发布 11-13 · 源码 11-22（2026）", "Release Nov 13 · source Nov 22, 2026"),
             size=13, color="dim", anchor="middle")
