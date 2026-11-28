SIZE = (358, 430)
ALT = {
    "zh": "三类证据标记。绿色 LEAN ✓ 表示由 Lean 内核核验、在 trureturing 冻结并经锁文件解析的 theorem 声明。"
          "trureturing@548388cd 的 2026 年 11 月 27 日冻结快照有 223,231 条定理。"
          "trureturing-books 正文收录 22 条官方零公理（axioms: []）蓝标定理。"
          "紫色表示书面证明，需附 DOI 或源仓库及形式化请求。红色 OPEN 表示未证的猜想和开放问题；"
          "Alpöge 的 RH 证明已获认证，扩展 RH（Dedekind ζ）与大 RH 仍开放。",
    "en": "Three evidence marks. Green LEAN ✓ identifies a kernel-checked theorem frozen in trureturing and resolved "
          "through the lockfile. The November 27, 2026 frozen snapshot of trureturing@548388cd contains 223,231 "
          "theorems. The text of trureturing-books cites 22 official zero-axiom theorems (axioms: []), marked blue. "
          "Violet identifies a written proof with a DOI or source repository and a formalization request. "
          "Red OPEN identifies conjectures and open problems. Alpöge's RH certification is separate from the open "
          "Extended RH (Dedekind zeta) and Grand RH questions.",
}

# Frozen declaration count at trureturing@548388cd, 2026-11-27.
FROZEN_THEOREMS = 223231
# Official axioms: [] theorems cited in trureturing-books.
ZERO_AXIOM_THEOREMS = 22


def draw(fig):
    assert (FROZEN_THEOREMS, ZERO_AXIOM_THEOREMS) == (223231, 22)

    levels = (
        ("lean", fig.t("LEAN ✓", "LEAN ✓"), fig.t("内核核验", "Kernel checked"),
         (fig.t("锁文件解析的冻结定理", "Frozen theorem resolved by the lockfile"),
          "trureturing@548388cd · 2026-11-27",
          fig.t(f"冻结快照 · {FROZEN_THEOREMS:,} 条定理", f"Frozen snapshot · {FROZEN_THEOREMS:,} theorems"))),
        ("argued", fig.t("书面证明", "Written proof"), fig.t("文献佐证", "Source evidence"),
         (fig.t("附 DOI 或源仓库", "DOI or source repository"),
          fig.t("登记形式化请求", "Formalization request recorded"))),
        ("open", fig.t("OPEN", "OPEN"), fig.t("开放问题", "Open problem"),
         (fig.t("未证的猜想或问题", "Unproved conjecture or problem"),
          fig.t("例：扩展 RH（Dedekind ζ）与大 RH (OPEN)", "Extended RH (Dedekind ζ) & Grand RH (OPEN)"))),
    )
    y = 14
    for role, badge, title, notes in levels:
        height = 172 if role == "lean" else 102
        fig.rect(12, y, 334, height, color=role, fill="bg", rx=8)
        fig.rect(12, y + 12, 4, height - 24, color=None, fill=role, rx=2)
        badge_width = fig.chip(25, y + 28, badge, role, size=13)
        fig.text(36 + badge_width, y + 28, title, size=16, weight=700)
        for index, note in enumerate(notes):
            fig.text(25, y + 56 + index * 22, note, size=14, color="dim")
        if role == "lean":
            fig.text(25, y + 129, "trureturing-books", size=14, color="blue", weight=600)
            fig.text(25, y + 151, fig.t(f"{ZERO_AXIOM_THEOREMS} 条官方零公理（axioms: []）蓝标定理",
                                        f"{ZERO_AXIOM_THEOREMS} official zero-axiom theorems (axioms: [])"),
                     size=14, color="blue")
        y += height + 13
