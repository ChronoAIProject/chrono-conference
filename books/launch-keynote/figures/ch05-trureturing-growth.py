from datetime import date, timedelta

SIZE = (500, 310)
ALT = {
    "zh": "折线绘出 trureturing 有登记日期的文献问题累计结项数。2026 年 9 月 8 日首日为 24，10 月 1 日第 24 天为 486，10 月 24 日第 47 天为 1,301，11 月 20 日第 74 天为 2,126；审计延伸到 11 月 27 日第 81 天的 2,276 项。",
    "en": "The line shows cumulative dated literature problem resolutions in trureturing. Day 1, September 8, 2026, starts at 24. Day 24, October 1, reaches 486. Day 47, October 24, reaches 1,301. Day 74, November 20, reaches 2,126, and the audited endpoint on November 27, day 81, reaches 2,276.",
}

# Audited dated checkpoints from trureturing Problems/ history and Blueprint records.
START = date(2026, 9, 8)
CUMULATIVE = (
    24, 94, 113, 124, 134, 175, 196, 246, 262, 271,
    288, 299, 321, 337, 352, 361, 370, 374, 401, 415,
    420, 432, 446, 486, 528, 567, 611, 645, 662, 686,
    711, 757, 786, 814, 850, 882, 927, 950, 971, 993,
    1021, 1062, 1112, 1164, 1227, 1251, 1301, 1346, 1386, 1434,
    1485, 1537, 1578, 1595, 1616, 1646, 1692, 1720, 1746, 1781,
    1818, 1843, 1869, 1896, 1918, 1934, 1950, 1987, 2026, 2059,
    2078, 2094, 2117, 2126,
)
FINAL_DAY, FINAL_VALUE = 81, 2276
MILESTONES = (1, 24, 47, 74, FINAL_DAY)
MONTHS = {9: "Sep", 10: "Oct", 11: "Nov"}


def draw(fig):
    days = FINAL_DAY
    daily_average = round(FINAL_VALUE / days)
    points = tuple(enumerate(CUMULATIVE, start=1)) + ((FINAL_DAY, FINAL_VALUE),)
    assert len(CUMULATIVE) == 74 and CUMULATIVE[0] == 24 and CUMULATIVE[-1] == 2126
    assert tuple(CUMULATIVE[day - 1] for day in MILESTONES[:-1]) == (24, 486, 1301, 2126)
    assert START + timedelta(days=days - 1) == date(2026, 11, 27) and daily_average == 28
    assert points[-1] == (81, 2276)
    assert all(before[1] <= after[1] for before, after in zip(points, points[1:]))

    ax = fig.axes(64, 47, 396, 191, (1, days), (0, 2350))
    fig.text(64, 24, fig.t("有日期的文献问题结项数", "Dated literature resolutions"), size=18, weight=700)
    ticks = (0, 500, 1000, 1500, 2000)
    ax.grid(ys=ticks)
    ax.yaxis(ticks=ticks, labels=[fig.t(f"{n:,}", f"{n:,}") for n in ticks], size=15)
    axis_milestones = (1, 24, 47, FINAL_DAY)
    axis_dates = [START + timedelta(days=day - 1) for day in axis_milestones]
    ax.xaxis(ticks=axis_milestones, labels=[fig.t(f"{d.month}/{d.day}", f"{MONTHS[d.month]} {d.day}") for d in axis_dates], size=15)

    ax.area(points, "cyan", fill_opacity=0.14)
    ax.path(points, "cyan", 3)
    milestone_counts = (CUMULATIVE[0], CUMULATIVE[23], CUMULATIVE[46], CUMULATIVE[73], FINAL_VALUE)
    for day, count, (dx, dy, anchor) in zip(MILESTONES, milestone_counts,
                                             ((11, -10, "start"), (0, -16, "middle"),
                                              (0, -16, "middle"), (-6, -13, "end"), (-6, -13, "end"))):
        x, y = ax.pt(day, count)
        fig.dot(x, y, 4.2, "cyan", ring="bg")
        fig.text(x + dx, y + dy, fig.t(f"{count:,}", f"{count:,}"), size=16, color="cyan", weight=700, anchor=anchor, halo=True)

    fig.text(64, 291, fig.t(f"trureturing · 2026 · {days} 天 · 日均约 {daily_average} 项 · 548388cd",
                           f"trureturing · 2026 · {days} days · about {daily_average} per day · 548388cd"), size=15, color="dim")
