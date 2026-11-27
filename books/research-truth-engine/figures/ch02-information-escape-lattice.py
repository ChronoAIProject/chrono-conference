from collections import defaultdict
from math import comb

SIZE = (680, 310)
WRAP = True
ALT = {
    "zh": "同一个含 16 个状态的有限示例。左栏加入一个可区分新状态对的定理，四组各四个状态分成八组各两个状态，仍无法区分的无序对由 24 降为 8。右栏从八组开始，加入能从旧定理恢复的判别或加入同核副本，划分与 8 个未区分对均保持原样，新增项的独占捕获数为零。绿色标签对应冻结的 StructuralNovelty 结论。",
    "en": "Both panels use the same 16-state example. A strictly novel observation splits four classes of four into eight classes of two, reducing indistinguishable unordered pairs from 24 to eight. Starting from the refined partition, a recoverable observation or a same-kernel duplicate preserves the eight classes and eight pairs. Each added observation uniquely captures zero pairs. The green badge refers to the frozen StructuralNovelty results.",
}


def partition(*observations):
    classes = defaultdict(list)
    for state in range(16):
        classes[tuple(observe(state) for observe in observations)].append(state)
    return tuple(tuple(group) for group in classes.values())


def escaped(classes):
    return sum(comb(len(group), 2) for group in classes)


def draw_partition(panel, x, classes, role):
    for group in classes:
        # The low bits identify the row, and the third bit splits it into two pairs.
        row = group[0] % 4
        columns = [state // 4 % 2 * 2 + state // 8 for state in group]
        center_y = 107 + row * 33
        left = x + min(columns) * 24
        right = x + max(columns) * 24
        panel.rect(left - 9, center_y - 11, right - left + 18, 22, color=role, fill=role,
                   fill_opacity=0.10, rx=5)
        for column in columns:
            panel.dot(x + column * 24, center_y, 3.4, role)


def draw(fig):
    def original(state):
        return state % 4

    def novel(state):
        return (state >> 2) & 1

    def recoverable(state):
        return (state & 1) ^ ((state >> 1) & 1)

    def duplicate(state):
        return 1 - novel(state)

    before = partition(original)
    after = partition(original, novel)
    redundant = partition(original, novel, recoverable)
    repeated = partition(original, novel, duplicate)
    assert comb(16, 2) == 120
    assert [len(before), len(after)] == [4, 8] and [escaped(before), escaped(after)] == [24, 8]
    assert redundant == repeated == after
    assert escaped(partition(original, duplicate)) - escaped(repeated) == 0
    assert escaped(after) - escaped(repeated) == escaped(after) - escaped(redundant) == 0

    left, right = fig.row([330, 330], 310, gap=20)
    for panel, title, original_classes, new_classes in (
        (left, fig.t("严格新颖的定理", "Strictly novel theorem"), before, after),
        (right, fig.t("可恢复定理或同核副本", "Recoverable or same-kernel"), after, redundant),
    ):
        panel.rect(1, 1, 328, 308, color="edge", fill="panel", fill_opacity=0.5, rx=9)
        panel.text(17, 29, title, size=18, weight=700)
        panel.text(17, 55, fig.t("16 个状态 · 圈内状态不可区分", "16 states · one class per outline"),
                   size=14, color="dim")
        panel.text(75, 83, fig.t("加入前", "Before"), size=14, anchor="middle", weight=650)
        panel.text(255, 83, fig.t("加入后", "After"), size=14, anchor="middle", weight=650)
        panel.arrow(142, 157, 186, 157, "dim", 1.6, head=7)
        draw_partition(panel, 39, original_classes, "dim")
        draw_partition(panel, 219, new_classes, "cyan")
        old_pairs = escaped(original_classes)
        new_pairs = escaped(new_classes)
        panel.text(165, 250, fig.t(f"未区分对 {old_pairs} → {new_pairs}", f"Escaped pairs {old_pairs} → {new_pairs}"),
                   size=17, anchor="middle", weight=700)
    left.text(165, 282, fig.t("四组分成八组", "Four classes split into eight"), size=14, color="dim", anchor="middle")
    # D5/S3/ConceptDynamics/InformationEscape/StructuralNovelty:
    # lowersEscape_false_of_recoverable and same_kernel_both_zero.
    right.chip(17, 284, fig.t("LEAN ✓", "LEAN ✓"), "lean", size=14)
    right.text(97, 284, fig.t("独占捕获数 = 0", "Unique capture count = 0"), size=14, color="lean")
