SIZE = (358, 350)
ALT = {
    "zh": "三类证据标记。绿色 LEAN ✓ 表示由 Lean 内核核验、在 trureturing 冻结并经锁文件解析的 theorem 声明。2026 年 11 月 27 日的冻结库快照有 223,231 条定理。紫色表示书面证明，需附 DOI 或源仓库及形式化请求。红色 OPEN 表示未证的猜想和开放问题；Alpöge 的 RH 证明已获认证，扩展 RH（Dedekind ζ）与 Grand RH 仍开放。",
    "en": "Three evidence marks. Green LEAN ✓ identifies a kernel-checked theorem frozen in trureturing and resolved through the lockfile. The November 27, 2026 frozen snapshot contains 223,231 theorems. Violet identifies a written proof with a DOI or source repository and a formalization request. Red OPEN identifies conjectures and open problems. Alpoge's RH certification is separate from the open Extended RH (Dedekind zeta) and Grand RH questions.",
}

# trureturing@548388cd, 2026-11-27.
FROZEN_THEOREMS = 223231


def draw(fig):
    assert FROZEN_THEOREMS == 223231

    levels = (
        ("lean", fig.t("LEAN ✓", "LEAN ✓"), fig.t("内核核验", "Kernel checked"),
         (fig.t("锁文件解析的冻结定理", "Frozen theorem resolved by the lockfile"),
          fig.t(f"2026-11-27 快照 · {FROZEN_THEOREMS:,} 条定理", f"2026-11-27 snapshot · {FROZEN_THEOREMS:,} theorems"))),
        ("argued", fig.t("书面证明", "Written proof"), fig.t("文献佐证", "Source evidence"),
         (fig.t("附 DOI 或源仓库", "DOI or source repository"),
          fig.t("登记形式化请求", "Formalization request recorded"))),
        ("open", fig.t("OPEN", "OPEN"), fig.t("开放问题", "Open problem"),
         (fig.t("未证的猜想或问题", "Unproved conjecture or problem"),
          fig.t("例：扩展 RH（Dedekind ζ）与 Grand RH（OPEN）", "Extended RH (Dedekind ζ) & Grand RH (OPEN)"))),
    )
    for index, (role, badge, title, notes) in enumerate(levels):
        y = 14 + 110 * index
        fig.rect(12, y, 334, 99, color=role, fill=role, fill_opacity=0.07, rx=8)
        fig.rect(12, y + 12, 4, 75, color=None, fill=role, rx=2)
        badge_width = fig.chip(25, y + 28, badge, role, size=13)
        fig.text(36 + badge_width, y + 28, title, size=16, weight=700)
        fig.lines(25, y + 56, notes, size=14, leading=1.55, color="dim")
