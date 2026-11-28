from math import isclose, log

SIZE = (480, 380)
ALT = {
    "zh": "左侧为五种二进制词的正概率分布在三个可见占据坐标中的投影，定义域为 x、y、z 均为正且 x+z<1、y+z<1 的开方锥。右侧固定蓝点 (0.40, 0.35, 0.20)，沿隐藏对数交比 χ 追踪词 101 与 100 的概率。χ 遍历全实数时五项概率沿方向 (1,−1,0,−1,1) 变化，可见坐标保持固定。",
    "en": "At left is a projection of the open square pyramid of visible occupancies for positive laws on five binary words. Its bounds are x,y,z>0, x+z<1 and y+z<1. At the blue point (0.40, 0.35, 0.20), the chart at right traces the masses of words 101 and 100 along the hidden log cross-ratio χ. As χ ranges over the real line, the law moves along (1,−1,0,−1,1), with all three occupancies fixed.",
}

# D5/S1/Words/AdmissibleWords/FiveModeMixedCoordinates.mixed_coordinates_global_chart.
# The frozen statement orders the words as 000, 100, 010, 001, 101.
OCCUPANCIES = (0.40, 0.35, 0.20)
HIDDEN_DIRECTION = (1, -1, 0, -1, 1)


def visible(p):
    return p[1] + p[4], p[3] + p[4], p[2]


def law_on_fiber(chi):
    x, y, z = OCCUPANCIES
    remainder = 1 - x - y - z
    lower, upper = max(0, -remainder), min(x, y)
    for _ in range(44):
        joint = (lower + upper) / 2
        p = (remainder + joint, x - joint, z, y - joint, joint)
        log_ratio = log(p[0]) + log(p[4]) - log(p[1]) - log(p[3])
        if log_ratio < chi:
            lower = joint
        else:
            upper = joint
    assert isclose(log_ratio, chi, abs_tol=1e-9)
    assert min(p) > 0 and isclose(sum(p), 1)
    assert all(isclose(a, b) for a, b in zip(visible(p), OCCUPANCIES))
    return p


def project(x, y, z):
    return 113 + 96 * x - 74 * y, 174 + 33 * x + 37 * y - 108 * z


def draw(fig):
    x, y, z = OCCUPANCIES
    assert min(OCCUPANCIES) > 0 and x + z < 1 and y + z < 1
    assert sum(HIDDEN_DIRECTION) == 0 and visible(HIDDEN_DIRECTION) == (0, 0, 0)

    fig.text(17, 25, fig.t("可见占据坐标", "Visible occupancies"), size=17, weight=700)
    origin, x_tip, corner, y_tip = [project(px, py, 0) for px, py in ((0, 0), (1, 0), (1, 1), (0, 1))]
    peak = project(0, 0, 1)
    fig.polygon([origin, x_tip, corner, y_tip], "cyan", fill_opacity=0.12)
    fig.polygon([peak, x_tip, corner], "cyan", fill_opacity=0.13)
    fig.polygon([peak, corner, y_tip], "cyan", fill_opacity=0.23)
    fig.polyline([x_tip, origin, y_tip], "dim", 1.2, dash="4 4")
    fig.line(*peak, *origin, "dim", 1.2, dash="4 4")
    fig.polyline([peak, x_tip, corner, y_tip, peak, corner], "cyan", 1.6)
    section = [project(px, py, z) for px, py in ((0, 0), (1 - z, 0), (1 - z, 1 - z), (0, 1 - z))]
    fig.polygon(section, "blue", color="blue", width=1.2, dash="4 4", fill_opacity=0.12)
    fig.dot(*project(*OCCUPANCIES), 5, "blue", ring="bg")
    fig.text(211, 229, "x", size=16, color="dim")
    fig.text(21, 209, "y", size=16, color="dim")
    fig.text(114, 55, "z", size=16, color="dim", anchor="middle")
    fig.text(17, 321, "x, y, z > 0", size=16)
    fig.text(17, 352, "x + z < 1 · y + z < 1", size=16)

    fig.line(236, 15, 236, 365, "edge", 1.2)
    fig.text(249, 25, fig.t("固定占据量的纤维", "Fiber at fixed occupancies"), size=17, weight=700)
    fig.text(249, 54, "(0.40, 0.35, 0.20)", size=16, color="blue", weight=650)
    for left, color, label in ((249, "cyan", "P(100)"), (356, "magenta", "P(101)")):
        fig.line(left, 80, left + 18, 80, color, 2.5)
        fig.text(left + 25, 80, label, size=16, color=color, weight=650, middle=True)
    ax = fig.axes(289, 113, 161, 147, (-5, 5), (0, 0.45))
    y_ticks = (0, 0.2, 0.4)
    ax.grid(ys=y_ticks)
    ax.yaxis(ticks=y_ticks, labels=[f"{v:g}" for v in y_ticks], size=16)
    ax.xaxis(ticks=(-5, 0, 5), labels=("", "", ""))
    for value, label in ((-5, "−5"), (0, "0"), (5, "5")):
        ax.text(value, 0, label, dy=31, size=16, color="dim", anchor="middle")
    ax.plot(lambda chi: law_on_fiber(chi)[4], color="magenta", width=2.5)
    ax.plot(lambda chi: law_on_fiber(chi)[1], color="cyan", width=2.5)
    fig.text(457, 321, fig.t("χ · 隐藏对数交比", "χ · Hidden log cross-ratio"),
             size=16, color="dim", anchor="end")
    fig.text(457, 352, fig.t("纤维切向 (1, −1, 0, −1, 1)", "Tangent (1, −1, 0, −1, 1)"),
             size=16, anchor="end")
