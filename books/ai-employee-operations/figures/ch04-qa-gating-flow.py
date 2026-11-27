"""Donna's live Q&A gate routes approved answers and escalates other queries."""

SIZE = (358, 370)
ALT = {
    "zh": "Donna 接收记者或来宾的问题后检查是否命中获批的 30 题库。命中时忠实回答，提供准确"
          "日期和仓库来源；未命中时检查公开披露红线（融资、夸大、未验证声明），记录问题并升级至 "
          "contact@chrono-ai.fun。",
    "en": "Donna checks an incoming press or guest query against the approved 30-question bank. "
          "A match receives a faithful answer with exact date and repository source. An unmatched query "
          "is checked against disclosure redlines for funding, hype and unverified claims, then "
          "logged and escalated to contact@chrono-ai.fun.",
}

QUESTIONS = 30


def draw(fig):
    t = fig.t
    assert QUESTIONS == 30
    incoming = fig.box(179, 8, t("Donna · 记者 / 来宾提问", "Donna · Press / guest query"), "edge", w=304, size=15)
    fig.arrow(*incoming.bottom, 179, 60, "dim", 1.4, head=7)
    fig.polygon([(179, 60), (343, 103), (179, 146), (15, 103)], "blue",
                color="blue", fill_opacity=0.10)
    fig.text(179, 95, t("获批问答库", "Approved Q&A bank"), size=15,
             weight=600, anchor="middle", middle=True)
    fig.text(179, 114, t(f"命中 {QUESTIONS} 题中的一项？", f"Match one of {QUESTIONS} questions?"),
             size=14, anchor="middle", middle=True)
    for x, color, label in [(89, "cyan", t("是", "YES")), (269, "dim", t("否", "NO"))]:
        fig.curve_arrow([(179, 146), (179, 162), (x, 162), (x, 185)],
                        color, 1.6, head=7)
        fig.text(x + 10, 174, label, size=13, color=color, weight=600, middle=True)
    fig.rect(8, 185, 162, 97, color="cyan", fill="panel", rx=6, width=1.6)
    fig.lines(89, 204, [t("忠实回答", "Faithful answer"), t("准确日期", "Exact date"),
                       t("仓库来源", "Repo source")],
              size=14, leading=1.7, anchor="middle", middle=True)
    fig.rect(188, 185, 162, 97, color="edge", fill="panel", rx=6)
    fig.text(269, 202, t("披露红线检查", "Disclosure check"), size=14, weight=600, anchor="middle", middle=True)
    fig.lines(269, 224, [t("不披露融资", "No funding claims"), t("不夸大", "No hype"),
                        t("不作未验证声明", "No unverified claims")],
              size=13, leading=1.5, color="dim", anchor="middle", middle=True)
    fig.arrow(269, 282, 269, 305, "dim", 1.6, head=7)
    fig.rect(8, 305, 342, 58, color="blue", fill="panel", rx=6, width=1.6)
    fig.text(179, 322, t("记录并升级", "Log & escalate"), size=15, weight=600, anchor="middle", middle=True)
    fig.text(179, 346, t("contact@chrono-ai.fun", "contact@chrono-ai.fun"),
             size=14, color="blue", anchor="middle", middle=True)
