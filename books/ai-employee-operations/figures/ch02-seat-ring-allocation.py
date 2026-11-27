"""Architectural seat stands and the two-by-nine flower-basket mat grid."""

SIZE = (560, 430)
ALT = {
    "zh": "street-corner 采用四个方向席位区的八层座位架构。北、南各 248 席，东、西各 306 席。八行容量为 144、144、144、140、136、136、132、132，总计 1,108 席。右侧是 2×9 的 basket-01..18 花篮垫网格。",
    "en": "The street-corner theater uses four directional stands with eight tiered rows. North and South hold 248 seats each, East and West 306 each. Row capacities are 144, 144, 144, 140, 136, 136, 132 and 132, totaling 1,108 seats. The right panel shows the 2×9 basket-01..18 mat grid.",
}

# Audited chronoai-lobby v40 seat-catalog.json geometry, 2026-11-27.
STAND_SEATS = (("N", 248), ("S", 248), ("E", 306), ("W", 306))
ROW_SEATS = (144, 144, 144, 140, 136, 136, 132, 132)
BASKET_MATS = tuple(f"basket-{index:02d}" for index in range(1, 19))


def _stand(fig, x, y, width, height, direction, capacity, color):
    fig.rect(x, y, width, height, color=color, fill="panel", rx=6, width=1.5)
    fig.text(x + width / 2, y + 15, fig.t(f"{direction} 区 · {capacity}", f"{direction} stand · {capacity}"),
             size=16, color=color, weight=700, anchor="middle", middle=True)
    max_width = width - 24
    for index, row_capacity in enumerate(ROW_SEATS):
        row_width = max_width * row_capacity / max(ROW_SEATS)
        row_x = x + (width - row_width) / 2
        row_y = y + 27 + index * 7
        fig.rect(row_x, row_y, row_width, 5, color=None, fill=color, rx=2)


def draw(fig):
    t = fig.t
    total = sum(capacity for _, capacity in STAND_SEATS)
    assert total == 1108 and len(STAND_SEATS) == 4 and len(ROW_SEATS) == 8
    assert ROW_SEATS == (144, 144, 144, 140, 136, 136, 132, 132)
    assert len(BASKET_MATS) == 18 and BASKET_MATS[0] == "basket-01" and BASKET_MATS[-1] == "basket-18"

    fig.text(15, 21, t("Street Corner · 四区八行席位架构", "Street Corner · four stands, eight tiers"),
             size=18, weight=700)
    _stand(fig, 93, 43, 164, 90, "N", 248, "cyan")
    _stand(fig, 93, 265, 164, 90, "S", 248, "blue")
    _stand(fig, 12, 151, 101, 104, "W", 306, "violet")
    _stand(fig, 237, 151, 101, 104, "E", 306, "magenta")

    fig.rect(119, 170, 112, 66, color="now", fill="now", fill_opacity=0.10, rx=7)
    fig.text(175, 194, t(f"{total:,} 席", f"{total:,} seats"), size=20, color="now", weight=700,
             anchor="middle", middle=True)
    fig.text(175, 218, t("四区合计", "four-stand total"), size=16, color="dim", anchor="middle", middle=True)

    fig.rect(350, 43, 195, 177, color="edge", fill="panel", rx=7)
    fig.text(360, 61, t("八行容量", "Eight row capacities"), size=16, weight=700)
    for index, row_capacity in enumerate(ROW_SEATS, 1):
        y = 81 + (index - 1) * 17
        fig.text(360, y, t(f"第 {index} 行", f"Row {index}"), size=16, middle=True)
        fig.text(530, y, t(str(row_capacity), str(row_capacity)), size=16, weight=650, anchor="end", middle=True)

    fig.rect(350, 237, 195, 105, color="edge", fill="panel", rx=7)
    fig.text(360, 254, t("Flower Town · 2×9 花篮垫", "2×9 basket mats"), size=16, weight=700)
    for index, _ in enumerate(BASKET_MATS):
        column, row = index % 9, index // 9
        x, y = 360 + column * 20, 270 + row * 24
        fig.rect(x, y, 16, 16, color="magenta", fill="magenta", fill_opacity=0.18, rx=2)
    fig.text(360, 328, t("basket-01 … basket-18", "basket-01 … basket-18"), size=16, color="magenta")

    fig.text(15, 412, t("@chronoai_frontdesk_bot · @flowerassis_bot",
                         "@chronoai_frontdesk_bot · @flowerassis_bot"), size=16, color="dim")
