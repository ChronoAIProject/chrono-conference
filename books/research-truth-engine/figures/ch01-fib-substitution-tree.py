from fractions import Fraction
from math import comb

SIZE = (500, 320)
ALT = {
    "zh": "左图从一枚 β 叶出发，按 α→β、β→βα 替换四次，叶数依次为 1、2、3、5、8。"
          "右图从组成 (1, 1) 的有序树均匀分布出发，坐标依次为 α 和 β 的叶数。"
          "第一代的组成为 (1, 2)，纤维大小由 2 增至 6，全变差为 1 − 2/6 = 2/3，随后趋近 1。"
          "绿色标签标出 Lean 冻结定理 GenealogicalFiberTransport.result 中的精确等式。",
    "en": "At left, four substitutions from a single β leaf using α→β and β→βα produce leaf counts of 1, 2, 3, 5 and 8. "
          "At right, the initial law is uniform over ordered trees with composition (1, 1), counting α leaves first and β leaves second. "
          "After one step to (1, 2), the fiber grows from 2 to 6 and total variation is 1 − 2/6 = 2/3. It then approaches 1. "
          "The green badge marks the exact equality in the frozen Lean theorem GenealogicalFiberTransport.result.",
}

# Lean labels α by true and β by false. Composition (a, b) counts α first and β second.
SUBSTITUTION = {"α": "β", "β": "βα"}


def fiber_size(a, b):
    leaves = a + b
    catalan = comb(2 * (leaves - 1), leaves - 1) // leaves
    return catalan * comb(leaves, a)


def draw(fig):
    words = ["β"]
    edges = []
    compositions = [(1, 1)]
    for generation in range(4):
        a, b = compositions[-1]
        compositions.append((b, a + b))
        word, next_word = words[-1], []
        for parent, letter in enumerate(word):
            for child_letter in SUBSTITUTION[letter]:
                edges.append(((generation, parent), (generation + 1, len(next_word))))
                next_word.append(child_letter)
        words.append("".join(next_word))
    fiber_sizes = [fiber_size(a, b) for a, b in compositions]
    variations = [1 - Fraction(fiber_sizes[0], count) for count in fiber_sizes]
    assert [len(word) for word in words] == [1, 2, 3, 5, 8]
    assert compositions[:4] == [(1, 1), (1, 2), (2, 3), (3, 5)]
    assert fiber_sizes[:2] == [2, 6] and variations[1] == Fraction(2, 3)
    assert all(0 <= left < right < 1 for left, right in zip(variations, variations[1:]))

    def node(generation, index):
        leaves = len(words[generation])
        return 28 + 44 * generation, 55 + 176 * (index + 0.5) / leaves

    fig.text(14, 21, fig.t("替换树", "Substitution tree"), size=18, weight=700)
    fig.text(14, 51, fig.t("α → β · β → βα", "α → β · β → βα"), size=15, color="dim")
    fig.line(232, 12, 232, 310, "edge", 1.2)
    for source, target in edges:
        fig.line(*node(*source), *node(*target), "dim", 1.2)
    for generation, word in enumerate(words):
        for index, letter in enumerate(word):
            x, y = node(generation, index)
            role = "cyan" if letter == "β" else "violet"
            fig.circle(x, y, 9.5, color=role, fill="bg", width=1.4)
            fig.text(x, y, fig.t(letter, letter), size=15, color=role, anchor="middle", middle=True, weight=650)
        fig.text(node(generation, 0)[0], 254, fig.t(str(len(word)), str(len(word))),
                 size=15, anchor="middle", weight=650)
    fig.text(14, 283, fig.t("从 β 出发的叶数", "Leaf count, starting from β"), size=15, color="dim")

    fig.text(249, 21, fig.t("全变差", "Total variation"), size=18, weight=700)
    fig.text(249, 51, fig.t("初始组成 (a, b) = (1, 1)", "Start (a, b) = (1, 1)"), size=15, color="dim")
    ax = fig.axes(284, 76, 186, 145, (0, 4), (0, 1))
    ticks = (0, 0.5, 1)
    ax.grid(ys=ticks)
    ax.yaxis(ticks=ticks, labels=[fig.t(f"{v:g}", f"{v:g}") for v in ticks], size=15)
    ax.xaxis(ticks=tuple(range(5)), labels=[fig.t(str(n), str(n)) for n in range(5)], size=15)
    fig.text(470, 270, fig.t("代数 n", "Generation n"), size=15, color="dim", anchor="end")
    points = list(enumerate(map(float, variations)))
    ax.path(points, "cyan", 2.6)
    ax.points(points, "cyan", r=3.7)
    # D5/S3/Arith/FibonacciAtomic/GenealogicalFiberTransport.result, TV(1) conjunct.
    badge_width = fig.chip(249, 302, fig.t("LEAN ✓", "LEAN ✓"), "lean", size=15)
    fig.text(249 + badge_width + 12, 302, fig.t("TV(1) = 1 − 2/6 = 2/3", "TV(1) = 1 − 2/6 = 2/3"),
             size=16, color="lean", weight=650)
