"""Exact seating counts plotted as six concentric rings and a basket promenade."""

import math

SIZE = (480, 340)
ALT = {
    "zh": "剧场示意图以每个小点代表一个座位。由内向外六圈分别有 96、144、176、204、232、"
          "256 席，共 1,108 席；最外围步道上的 18 个菱形代表花篮位。右侧逐圈列出准确容量。",
    "en": "Each small dot in the theater schematic represents a seat. Six concentric rings contain "
          "96, 144, 176, 204, 232 and 256 seats from inside to outside, for 1,108 seats total. "
          "Eighteen diamonds on the outer promenade represent flower basket slots. The legend gives exact capacities.",
}

# Conference figure brief: virtual theater allocation.
RING_COUNTS = (96, 144, 176, 204, 232, 256)
BASKETS = 18


def draw(fig):
    t = fig.t
    total = sum(RING_COUNTS)
    assert RING_COUNTS == (96, 144, 176, 204, 232, 256)
    assert total == 1108 and BASKETS == 18
    cx, cy = 153, 170
    radii = (49, 65, 80, 95, 110, 125)
    colors = ("cyan", "blue", "cyan", "blue", "cyan", "blue")
    drawn_seats = 0
    for radius, count, color in zip(radii, RING_COUNTS, colors):
        for index in range(count):
            angle = 2 * math.pi * index / count
            fig.dot(cx + radius * math.cos(angle), cy + radius * math.sin(angle), 1.15, color)
            drawn_seats += 1
    assert drawn_seats == total
    fig.circle(cx, cy, 142, color="dim", width=1.2, dash="3 4")
    basket_points = [
        (cx + 142 * math.cos(2 * math.pi * i / BASKETS),
         cy + 142 * math.sin(2 * math.pi * i / BASKETS))
        for i in range(BASKETS)
    ]
    assert len(basket_points) == BASKETS
    for x, y in basket_points:
        fig.polygon([(x, y - 4), (x + 4, y), (x, y + 4), (x - 4, y)],
                    "magenta", fill_opacity=1)
    fig.text(cx, cy - 7, t(f"{total:,}", f"{total:,}"), size=22, weight=600, anchor="middle", middle=True)
    fig.text(cx, cy + 15, t("座位", "Seats"), size=15, color="dim", anchor="middle", middle=True)

    fig.text(316, 24, t("由内至外", "Inside → outside"), size=16, weight=600)
    for index, (count, color) in enumerate(zip(RING_COUNTS, colors), 1):
        y = 54 + (index - 1) * 35
        fig.dot(322, y, 4.5, color)
        fig.text(335, y, t(f"第 {index} 圈", f"Ring {index}"), size=15, middle=True)
        fig.text(467, y, t(str(count), str(count)), size=16, weight=600, anchor="end", middle=True)
        fig.rect(335, y + 10, 128 * count / max(RING_COUNTS), 4, color=None, fill=color, rx=2)
    fig.line(315, 255, 468, 255, "edge", 1.2)
    fig.polygon([(322, 272), (327, 277), (322, 282), (317, 277)], "magenta", fill_opacity=1)
    fig.text(335, 277, t("花篮位", "Basket slots"), size=15, middle=True)
    fig.text(467, 277, t(str(BASKETS), str(BASKETS)), size=16, weight=600, anchor="end", middle=True)
    fig.text(240, 332, t("座位与步道示意 · 每点一席", "Schematic · one dot per seat"),
             size=15, color="dim", anchor="middle")
