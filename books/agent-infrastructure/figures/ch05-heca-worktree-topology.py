"""A local canvas coordinates providers and ACP agents across isolated worktrees."""

SIZE = (500, 452)
ALT = {
    "zh": "heca 本地优先画布协调 6 个主要服务提供方和 21 个 ACP 智能体，共 27 个接入项。"
          "三个示例窗口展示隔离的 Git worktree、实时终端与浏览器面板。权限队列和目标账本提供统一协调。",
    "en": "heca's local-first canvas coordinates six primary providers and 21 ACP agents, "
          "27 integrations in total. Three example windows show isolated Git worktrees, live terminals "
          "and browser panels, coordinated by a permission queue and goal ledger.",
}

# Integration counts from the conference figure brief.
PROVIDERS, ACP_AGENTS = 6, 21


def draw(fig):
    t = fig.t
    assert (PROVIDERS, ACP_AGENTS) == (6, 21)
    total = PROVIDERS + ACP_AGENTS
    assert total == 27

    fig.rect(14, 8, 472, 385, color="edge", fill="panel", rx=9)
    fig.text(250, 28, t("heca · 本地优先画布", "heca · Local-first canvas"),
             size=19, weight=600, anchor="middle", middle=True)
    for x, count, columns, title, color in [
        (132, PROVIDERS, 3, t("主要服务提供方", "Primary providers"), "cyan"),
        (368, ACP_AGENTS, 7, t("ACP 智能体", "ACP agents"), "blue"),
    ]:
        fig.rect(x - 108, 51, 216, 135, color=color, rx=6, width=1.4)
        fig.text(x, 73, str(count), size=22, weight=600, color=color, anchor="middle", middle=True)
        fig.text(x, 105, title, size=17, anchor="middle", middle=True)
        for index in range(count):
            row, col = divmod(index, columns)
            fig.dot(x + (col - (columns - 1) / 2) * 19, 134 + row * 16, 4.7, color)
        fig.polyline([(x, 186), (x, 199), (250, 199)], "dim", 1.4)
    fig.arrow(250, 199, 250, 235, "dim", 1.4, head=7)
    fig.text(263, 217, t(f"共 {total} 项接入", f"{total} integrations"),
             size=17, color="ink", middle=True)

    fig.rect(24, 235, 452, 148, color="dim", dash="5 4", rx=6)
    fig.text(250, 258, t("隔离 Git worktree", "Isolated Git worktrees"), size=17, weight=600, anchor="middle")
    for index, x in enumerate((98, 250, 402)):
        fig.rect(x - 65, 267, 130, 107, color="edge", fill="bg", rx=4)
        fig.line(x - 65, 281, x + 65, 281, "edge", 1.2)
        for offset in (0, 8, 16):
            fig.dot(x - 55 + offset, 274, 2, "dim")
        fig.text(x, 296, t(f"工作树 {index + 1}", f"Worktree {index + 1}"), size=17, anchor="middle", middle=True)
        fig.text(x, 326, t("实时终端", "Live terminal"), size=17, color="dim", anchor="middle", middle=True)
        fig.text(x, 356, t("浏览器面板", "Browser panel"), size=17, color="dim", anchor="middle", middle=True)
    fig.rect(14, 406, 472, 36, color="cyan", fill="cyan", fill_opacity=0.10, rx=5)
    fig.text(250, 424, t("权限队列  ·  目标账本", "Permission queue  ·  Goal ledger"),
             size=17, weight=600, anchor="middle", middle=True)
