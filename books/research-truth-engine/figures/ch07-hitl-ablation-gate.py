"""人机协作的盲评结果与可执行反例闸门的消融结果。"""

PANEL_WIDTH, PANEL_HEIGHT = 358, 336
GAP = 16
SIZE = (2 * PANEL_WIDTH + GAP, PANEL_HEIGHT)
WRAP = True

ALT = {
    "zh": "30 篇论文由三族前沿模型盲评。人机协作在 300 次成对比较中胜出 260 次（86.7%），"
          "纯模型胜出 40 次（13.3%）。相比未验证的人类预印本，人机协作论文的评分标准差压缩 2.3–4.2 倍，"
          "10 篇中有 10 篇得到形式化或认证核验支撑。20 条声明的评审消融中，加入可执行反例闸门后，"
          "假阳性率从 30.0% 降至 0.0%，F1 达 94.7%。审计覆盖 24,925 个 PR，"
          "其中近期已合并且纳入修复分析的 935 个 PR 中有 557 个（59.6%）经历多提交修复。",
    "en": "Three frontier model families scored 30 papers blind. Human+AI won 260 of 300 pairwise comparisons (86.7%), "
          "and standalone AI won 40 (13.3%). Human+AI score standard deviations were 2.3–4.2 times smaller than for "
          "unverified human preprints, and all 10 Human+AI papers had formal or certified checks. In a 20-claim "
          "ablation, the executable counterexample gate lowered review false positives from 30.0% to 0.0% and reached "
          "94.7% F1. The audit covered 24,925 PRs. Of 935 recent merged PRs included in the repair analysis, "
          "557 (59.6%) required multiple commits.",
}

# human-in-the-loop-automated-research v1.0, 2026-11-27.
PAPERS, FAMILIES = 30, 3
HUMAN_WINS, STANDALONE_WINS = 260, 40
SD_COMPRESSION = (2.3, 4.2)
CHECKED_PAPERS, HUMAN_AI_PAPERS = 10, 10
CLAIMS = 20
PROSE_FPR, GATE_FPR, GATE_F1 = 0.30, 0.0, 0.947
AUDITED_PRS, REPAIRED_PRS, REPAIR_SAMPLE = 24_925, 557, 935
SOURCE = "human-in-the-loop-automated-research v1.0 · 2026-11-27"

INSET = 18
RIGHT = PANEL_WIDTH - INSET
INNER_WIDTH = RIGHT - INSET


def _card(panel, title, subtitle):
    panel.rect(2, 2, PANEL_WIDTH - 4, PANEL_HEIGHT - 4, color="edge", fill="panel", rx=9, width=1.4)
    panel.text(INSET, 34, title, size=20, weight=700)
    panel.text(INSET, 58, subtitle, size=14, color="dim")
    panel.line(INSET, 72, RIGHT, 72, "edge", 1)


def _benchmark(panel):
    t = panel.t
    _card(panel, t("人机协作 vs 纯模型基准", "H+AI vs. Standalone AI"),
          t(f"N = {PAPERS} · {FAMILIES} 族前沿模型盲评", f"N = {PAPERS} · {FAMILIES} frontier families"))

    total = HUMAN_WINS + STANDALONE_WINS
    assert total == 300
    assert (f"{HUMAN_WINS / total:.1%}", f"{STANDALONE_WINS / total:.1%}") == ("86.7%", "13.3%")

    panel.text(INSET, 94, t("成对比较胜出", "Pairwise wins"), size=13, color="dim")
    split = INNER_WIDTH * HUMAN_WINS / total
    panel.rect(INSET, 104, split, 18, color=None, fill="cyan")
    panel.rect(INSET + split, 104, INNER_WIDTH - split, 18, color=None, fill="magenta", fill_opacity=0.75)
    panel.line(INSET + split, 104, INSET + split, 122, "panel", 1.4)

    for y, label, wins, role in (
        (145, t("人机协作", "Human+AI"), HUMAN_WINS, "cyan"),
        (173, t("纯模型", "Standalone AI"), STANDALONE_WINS, "magenta"),
    ):
        panel.dot(INSET + 4, y - 5, 4, role)
        panel.text(INSET + 16, y, label, size=14)
        panel.text(RIGHT, y, f"{wins}/{total} ({wins / total:.1%})",
                   size=14, color=role, weight=700, anchor="end")

    panel.line(INSET, 187, RIGHT, 187, "edge", 1)
    for y, metric, label, detail in (
        (198, f"{SD_COMPRESSION[0]}–{SD_COMPRESSION[1]}×",
         t("评分标准差缩小", "lower score SD"),
         t("相较未验证的人类预印本", "vs. unverified human preprints")),
        (258, f"{CHECKED_PAPERS}/{HUMAN_AI_PAPERS}",
         t("人机协作论文", "Human+AI papers"),
         t("具形式化或认证核验", "with formal or certified checks")),
    ):
        panel.rect(INSET, y, INNER_WIDTH, 51, color="edge", fill="bg", rx=6, width=1)
        panel.text(INSET + 12, y + 33, metric, size=21, color="cyan", weight=700)
        panel.text(145, y + 21, label, size=14, weight=650)
        panel.text(145, y + 40, detail, size=12, color="dim")


def _gate(panel):
    t = panel.t
    _card(panel, t("可执行反例闸门消融", "Executable Gate Ablation"),
          t(f"{CLAIMS} 条声明评审假阳性率 (FPR)", f"{CLAIMS}-claim review false-positive rate"))

    for y, label, rate, role in (
        (96, t("纯文本评审", "Prose-only review"), PROSE_FPR, "magenta"),
        (162, t("+ 可执行反例闸门", "+ Executable gate"), GATE_FPR, "cyan"),
    ):
        panel.text(INSET, y, label, size=14, weight=650)
        panel.text(RIGHT, y, f"{rate:.1%}", size=19, color=role, weight=700, anchor="end")
        # Both tracks span the same range. The line marks a zero-length bar.
        panel.rect(INSET, y + 12, INNER_WIDTH, 18, color="edge", fill="bg", rx=3, width=1)
        if rate:
            panel.rect(INSET, y + 12, INNER_WIDTH * rate, 18, color=None, fill=role, rx=3)
        else:
            panel.line(INSET, y + 12, INSET, y + 30, role, 3)
    panel.rect(197, 141, 85, 27, color="cyan", fill="cyan", fill_opacity=0.10, rx=4, width=1.2)
    panel.text(239.5, 159, f"{GATE_F1:.1%} F1", size=12, color="cyan", weight=600, mono=True, anchor="middle")

    repair_rate = REPAIRED_PRS / REPAIR_SAMPLE
    assert f"{repair_rate:.1%}" == "59.6%"
    panel.rect(INSET, 217, INNER_WIDTH, 61, color="edge", fill="bg", rx=6, width=1)
    panel.text(INSET + 12, 240,
               t(f"审计 {AUDITED_PRS:,} 个 PR", f"{AUDITED_PRS:,} PRs audited"),
               size=14, weight=650)
    panel.text(INSET + 12, 261,
               t(f"已合并样本中 {REPAIRED_PRS}/{REPAIR_SAMPLE}（{repair_rate:.1%}）经多提交修复",
                 f"{REPAIRED_PRS}/{REPAIR_SAMPLE} merged PRs ({repair_rate:.1%}) needed repair"),
               size=12, color="dim")
    panel.text(PANEL_WIDTH / 2, 309, SOURCE, size=12, color="dim", anchor="middle")


def draw(fig):
    benchmark, gate = fig.row([PANEL_WIDTH, PANEL_WIDTH], PANEL_HEIGHT, gap=GAP)
    _benchmark(benchmark)
    _gate(gate)
