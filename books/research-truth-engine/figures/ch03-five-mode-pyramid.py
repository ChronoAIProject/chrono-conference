from math import isclose, log

SIZE = (480, 330)
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
    fig.text(207, 235, fig.t("x", "x"), size=15, color="dim")
    fig.text(25, 210, fig.t("y", "y"), size=15, color="dim")
    fig.text(114, 55, fig.t("z", "z"), size=15, color="dim", anchor="middle")
    fig.text(17, 274, fig.t("x, y, z > 0", "x, y, z > 0"), size=15)
    fig.text(17, 295, fig.t("x + z < 1 · y + z < 1", "x + z < 1 · y + z < 1"), size=15)

    fig.line(236, 15, 236, 311, "edge", 1.2)
    fig.text(249, 25, fig.t("固定占据量的纤维", "Fiber at fixed occupancies"), size=17, weight=700)
    fig.text(249, 48, fig.t("(0.40, 0.35, 0.20)", "(0.40, 0.35, 0.20)"), size=15, color="blue", weight=650)
    ax = fig.axes(284, 78, 166, 147, (-5, 5), (0, 0.45))
    y_ticks = (0, 0.2, 0.4)
    ax.grid(ys=y_ticks)
    ax.yaxis(ticks=y_ticks, labels=[fig.t(f"{v:g}", f"{v:g}") for v in y_ticks], size=15)
    ax.xaxis(ticks=(-5, 0, 5), labels=[fig.t(s, s) for s in ("−5", "0", "5")], size=15)
    ax.plot(lambda chi: law_on_fiber(chi)[4], color="magenta", width=2.5)
    ax.plot(lambda chi: law_on_fiber(chi)[1], color="cyan", width=2.5)
    ax.text(-4.3, 0.39, fig.t("P(100)", "P(100)"), size=15, color="cyan", weight=650, halo=True)
    ax.text(4.5, 0.36, fig.t("P(101)", "P(101)"), size=15, color="magenta", weight=650, anchor="end", halo=True)
    fig.text(457, 274, fig.t("χ · 隐藏对数交比", "χ · Hidden log cross-ratio"),
             size=15, color="dim", anchor="end")
    fig.text(457, 298, fig.t("纤维切向 (1, −1, 0, −1, 1)", "Tangent (1, −1, 0, −1, 1)"),
             size=15, anchor="end")
