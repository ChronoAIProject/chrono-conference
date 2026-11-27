SIZE = (520, 320)
ALT = {
    "zh": "截至 2026 年 11 月 27 日，trureturing 文献问题登记册共有 2,278 项去重文献问题结项，其中已证 1,512 项，已反驳 766 项。按来源分组，arXiv 为 465 已证、375 已反驳，OEIS 为 677、52，期刊为 358、326，Erdős 问题为 1、3，其他为 11、10。各行条形均按结项数等比例绘制。",
    "en": "The November 27, 2026 trureturing literature register contains 2,278 unique resolutions: 1,512 proved and 766 refuted. Proved and refuted counts by source are arXiv 465 and 375, OEIS 677 and 52, journals 358 and 326, Erdős 1 and 3, and other sources 11 and 10. All bar lengths share the same count scale.",
}

# trureturing@548388cd (2026-11-27), Blueprint/** and Problems/*.md.
OUTCOMES = (
    ("arXiv", "arXiv", 465, 375),
    ("OEIS", "OEIS", 677, 52),
    ("期刊", "Journals", 358, 326),
    ("Erdős 问题", "Erdős", 1, 3),
    ("其他", "Other", 11, 10),
)


def draw(fig):
    proved = sum(row[2] for row in OUTCOMES)
    refuted = sum(row[3] for row in OUTCOMES)
    assert proved == 1512 and refuted == 766 and proved + refuted == 2278
    assert [p + r for _, _, p, r in OUTCOMES] == [840, 729, 684, 4, 21]

    fig.text(15, 26, fig.t(f"{proved + refuted:,} 项文献问题结项", f"{proved + refuted:,} literature resolutions"),
             size=21, weight=700)
    fig.text(15, 56, fig.t("来源", "Source"), size=15, color="dim", weight=650)
    for x, label, role in (
        (429, fig.t("已证", "Proved"), "cyan"),
        (506, fig.t("已反驳", "Refuted"), "magenta"),
    ):
        fig.text(x, 56, label, size=15, anchor="end", color=role, weight=700)
    fig.line(15, 67, 505, 67, "edge", 1)

    plot_left, plot_width = 112, 246
    scale = plot_width / 750
    for index, (zh, en, positives, negatives) in enumerate(OUTCOMES):
        y = 88 + 33 * index
        fig.text(15, y, fig.t(zh, en), size=16, middle=True, weight=600)
        fig.line(plot_left, y, plot_left + plot_width, y, "edge", 1)
        fig.rect(plot_left, y - 7, scale * positives, 14, color=None, fill="cyan")
        fig.rect(plot_left + scale * positives, y - 7, scale * negatives, 14, color=None, fill="magenta")
        fig.text(429, y, fig.t(str(positives), str(positives)), size=16, anchor="end", middle=True)
        fig.text(506, y, fig.t(str(negatives), str(negatives)), size=16, anchor="end", middle=True)

    fig.line(15, 242, 505, 242, "edge", 1)
    fig.text(15, 267, fig.t("合计", "Total"), size=17, weight=700)
    fig.text(429, 267, fig.t(f"{proved:,}", f"{proved:,}"), size=17, anchor="end", color="cyan", weight=700)
    fig.text(506, 267, fig.t(f"{refuted:,}", f"{refuted:,}"), size=17, anchor="end", color="magenta", weight=700)
    fig.text(15, 299, fig.t("trureturing@548388cd · 2026-11-27", "trureturing@548388cd · 2026-11-27"),
             size=15, color="dim")
