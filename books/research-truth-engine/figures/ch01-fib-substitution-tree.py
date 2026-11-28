from fractions import Fraction
from math import comb, hypot

SIZE = (608, 402)
WRAP = True
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
        return 31 + 61 * generation, 65 + 272 * (index + 0.5) / leaves

    tree, variation = fig.row([306, 286], SIZE[1])
    tree.text(14, 27, fig.t("替换树", "Substitution tree"), size=18, weight=700)
    tree.text(14, 54, fig.t("α → β · β → βα", "α → β · β → βα"), size=15, color="dim")
    # End each branch at the two node rims.
    radius = 15
    for source, target in edges:
        x1, y1 = node(*source)
        x2, y2 = node(*target)
        dx, dy = x2 - x1, y2 - y1
        inset = radius / hypot(dx, dy)
        tree.line(x1 + dx * inset, y1 + dy * inset, x2 - dx * inset, y2 - dy * inset, "dim", 1.2)
    for generation, word in enumerate(words):
        for index, letter in enumerate(word):
            x, y = node(generation, index)
            role = "cyan" if letter == "β" else "violet"
            tree.circle(x, y, radius, color=role, fill="bg", width=1.4)
            tree.text(x, y, fig.t(letter, letter), size=15, color=role, anchor="middle", middle=True, weight=650)
        tree.text(node(generation, 0)[0], 360, str(len(word)), size=15, anchor="middle", weight=650)
    tree.text(14, 387, fig.t("从 β 出发的叶数", "Leaf count, starting from β"), size=15, color="dim")

    variation.text(14, 27, fig.t("全变差", "Total variation"), size=18, weight=700)
    variation.text(14, 54, fig.t("初始组成 (a, b) = (1, 1)", "Start (a, b) = (1, 1)"), size=15, color="dim")
    ax = variation.axes(40, 80, 220, 204, (0, 4), (0, 1))
    ticks = (0, 0.5, 1)
    ax.grid(ys=ticks)
    ax.yaxis(ticks=ticks, labels=[fig.t(f"{v:g}", f"{v:g}") for v in ticks], size=15)
    points = list(enumerate(map(float, variations)))
    generations = tuple(n for n, _ in points)
    ax.xaxis(ticks=generations, labels=[""] * len(generations))
    for n in generations:
        x, bottom = ax.pt(n, 0)
        variation.text(x, bottom + 29, str(n), size=15, color="dim", anchor="middle")
    variation.text(260, 340, fig.t("代数 n", "Generation n"), size=15, color="dim", anchor="end")
    ax.path(points, "cyan", 2.6)
    ax.points(points, "cyan", r=3.7)
    # D5/S3/Arith/FibonacciAtomic/GenealogicalFiberTransport.result, TV(1) conjunct.
    variation.rect(14, 363, 76, 32, color="lean", fill="lean", fill_opacity=0.12, rx=4, width=1.2)
    variation.text(52, 379, "LEAN ✓", size=15, color="lean", anchor="middle", middle=True, mono=True, weight=600)
    variation.text(102, 379, "TV(1) = 1 − 2/6 = 2/3", size=16, color="lean", middle=True, weight=650)
