from math import exp, isclose

SIZE = (500, 310)
ALT = {
    "zh": "概念示意图。青色曲线表示相对执行成本按指数下降，品红色曲线表示判断与核验的相对权重按逻辑斯蒂函数上升。琥珀色标出两条曲线相交的位置，借此示意 2026 年的组织转折。曲线取自示意公式，无观测数据。",
    "en": "Conceptual chart with no observations. Relative execution cost falls exponentially in cyan while the relative weight of judgment and verification rises logistically in magenta. An amber marker uses the curves' intersection to illustrate the proposed organizational turning point in 2026.",
}


def execution_cost(t):
    return exp(-0.55 * t)


def judgment_share(t):
    return 1 - 1 / (1 + exp(0.9 * (t - 3)))


def draw(fig):
    lo, hi = 0.0, 6.0
    assert execution_cost(lo) > judgment_share(lo)
    assert execution_cost(hi) < judgment_share(hi)
    for _ in range(48):
        midpoint = (lo + hi) / 2
        if execution_cost(midpoint) > judgment_share(midpoint):
            lo = midpoint
        else:
            hi = midpoint
    turning_point = (lo + hi) / 2
    value = execution_cost(turning_point)
    assert isclose(value, judgment_share(turning_point), abs_tol=1e-12)
    assert judgment_share(3) == 0.5

    fig.text(56, 25, fig.t("概念模型 · 相对量", "Conceptual model · relative scale"), size=16, weight=650)
    ax = fig.axes(56, 46, 414, 210, (0, 6), (0, 1))
    ticks = (0, 0.5, 1)
    ax.grid(ys=ticks)
    ax.yaxis(ticks=ticks, labels=[fig.t(str(v), str(v)) for v in ticks], size=15)
    ax.xaxis(arrow=True)
    ax.plot(execution_cost, color="cyan", width=3.2)
    ax.plot(judgment_share, color="magenta", width=3.2)
    x, y = ax.pt(turning_point, value)
    fig.line(x, y, x, 256, "now", 1.4, dash="4 4")
    fig.dot(x, y, 5, "now", ring="bg")
    fig.text(x, 281, fig.t("2026 转折点", "2026 turning point"), size=16, color="now", anchor="middle", weight=650)
    fig.text(96, 79, fig.t("执行成本", "Execution cost"), size=18, color="cyan", weight=650)
    fig.text(459, 183, fig.t("判断与核验", "Judgment & verification"), size=18, color="magenta", weight=650, anchor="end")
    fig.text(477, 281, fig.t("时间", "Time"), size=15, color="dim", anchor="end")
