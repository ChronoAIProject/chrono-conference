"""Architectural seat stands and the two-by-nine flower-basket mat grid."""

SIZE = (708, 450)
WRAP = True
ALT = {
    "zh": "street-corner 采用四个方向席位区的八层座位架构。北、南各 248 席，东、西各 306 席。八行容量为 144、144、144、140、136、136、132、132，总计 1,108 席。右侧是 2×9 的 basket-01..18 花篮垫网格。",
    "en": "The street-corner theater uses four directional stands with eight tiered rows. North and South hold 248 seats each, East and West 306 each. Row capacities are 144, 144, 144, 140, 136, 136, 132 and 132, totaling 1,108 seats. The right panel shows the 2×9 basket-01..18 mat grid.",
}

# Audited chronoai-lobby v40 seat-catalog.json geometry, 2026-11-27.
STAND_SEATS = (("N", 248), ("S", 248), ("E", 306), ("W", 306))
ROW_SEATS = (144, 144, 144, 140, 136, 136, 132, 132)
BASKET_MATS = tuple(f"basket-{index:02d}" for index in range(1, 19))


def _stand(fig, x, y, width, direction, capacity, color):
    fig.rect(x, y, width, 100, color=color, fill="panel", rx=6, width=1.5)
    fig.text(x + width / 2, y + 21, fig.t(f"{direction} 区 · {capacity}", f"{direction} stand · {capacity}"),
             size=16, color=color, weight=700, anchor="middle", middle=True)
    max_width = width - 24
    for index, row_capacity in enumerate(ROW_SEATS):
        row_width = max_width * row_capacity / max(ROW_SEATS)
        row_x = x + (width - row_width) / 2
        row_y = y + 37 + index * 7
        fig.rect(row_x, row_y, row_width, 5, color=None, fill=color, rx=2)


def draw(fig):
    t = fig.t
    total = sum(capacity for _, capacity in STAND_SEATS)
    assert total == 1108 and len(STAND_SEATS) == 4 and len(ROW_SEATS) == 8
    assert ROW_SEATS == (144, 144, 144, 140, 136, 136, 132, 132)
    assert len(BASKET_MATS) == 18 and BASKET_MATS[0] == "basket-01" and BASKET_MATS[-1] == "basket-18"

    theater, capacities = fig.row([446, 246], SIZE[1])
    theater.text(223, 32, t("Street Corner · 四区八行席位架构", "Street Corner · four stands, eight tiers"),
                 size=18, weight=700, anchor="middle")
    _stand(theater, 143, 52, 160, "N", 248, "cyan")
    _stand(theater, 143, 290, 160, "S", 248, "blue")
    _stand(theater, 5, 171, 134, "W", 306, "violet")
    _stand(theater, 307, 171, 134, "E", 306, "magenta")

    theater.rect(153, 171, 140, 100, color="now", fill="now", fill_opacity=0.10, rx=7)
    theater.text(223, 204, t(f"{total:,} 席", f"{total:,} seats"), size=20, color="now", weight=700,
                 anchor="middle", middle=True)
    theater.text(223, 239, t("四区合计", "four-stand total"), size=16, color="dim", anchor="middle", middle=True)

    capacities.rect(2, 52, 242, 252, color="edge", fill="panel", rx=7)
    capacities.text(123, 79, t("八行容量", "Eight row capacities"), size=16, weight=700, anchor="middle")
    for index, row_capacity in enumerate(ROW_SEATS, 1):
        y = 102 + (index - 1) * 26
        capacities.text(17, y, t(f"第 {index} 行", f"Row {index}"), size=16, middle=True)
        capacities.text(229, y, str(row_capacity), size=16, weight=650, anchor="end", middle=True)

    capacities.rect(2, 320, 242, 119, color="edge", fill="panel", rx=7)
    capacities.text(123, 347, t("Flower Town · 2×9 花篮垫", "2×9 basket mats"), size=16, weight=700, anchor="middle")
    for index, _ in enumerate(BASKET_MATS):
        column, row = index % 9, index // 9
        x, y = 27 + column * 22, 361 + row * 23
        capacities.rect(x, y, 16, 16, color="magenta", fill="magenta", fill_opacity=0.18, rx=2)
    capacities.text(123, 424, "basket-01 … basket-18", size=16, color="magenta", anchor="middle")

    theater.text(223, 424, "@chronoai_frontdesk_bot · @flowerassis_bot", size=16, color="dim", anchor="middle")
