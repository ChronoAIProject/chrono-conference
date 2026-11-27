from datetime import date, timedelta

SIZE = (500, 310)
ALT = {
    "zh": "折线逐日绘出 trureturing 有登记日期的文献问题累计结项数。2026 年 9 月 8 日首日为 24，10 月 1 日第 24 天为 486，10 月 24 日第 47 天为 1,301，11 月 20 日第 74 天为 2,126。累计数除以 74 天约为每日 29 项。",
    "en": "Daily cumulative count of dated literature problem resolutions in trureturing. Day 1, September 8, 2026, starts at 24. Day 24, October 1, reaches 486. Day 47, October 24, reaches 1,301. Day 74, November 20, ends at 2,126, or about 29 per day over the period.",
}

# facts-latest.json, tru.res_series: one cumulative value per calendar day.
# Source: trureturing Problems/ history and Blueprint records, 2026-11-20 snapshot.
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
MILESTONES = (1, 24, 47, 74)
MONTHS = {9: "Sep", 10: "Oct", 11: "Nov"}


def draw(fig):
    days = len(CUMULATIVE)
    daily_average = round(CUMULATIVE[-1] / days)
    assert days == 74 and CUMULATIVE[0] == 24 and CUMULATIVE[-1] == 2126
    assert tuple(CUMULATIVE[day - 1] for day in MILESTONES) == (24, 486, 1301, 2126)
    assert START + timedelta(days=days - 1) == date(2026, 11, 20) and daily_average == 29
    assert all(before <= after for before, after in zip(CUMULATIVE, CUMULATIVE[1:]))

    ax = fig.axes(64, 47, 396, 191, (1, days), (0, 2250))
    fig.text(64, 24, fig.t("有日期的文献问题结项数", "Dated literature resolutions"), size=18, weight=700)
    ticks = (0, 500, 1000, 1500, 2000)
    ax.grid(ys=ticks)
    ax.yaxis(ticks=ticks, labels=[fig.t(f"{n:,}", f"{n:,}") for n in ticks], size=15)
    dates = [START + timedelta(days=day - 1) for day in MILESTONES]
    ax.xaxis(ticks=MILESTONES, labels=[fig.t(f"{d.month}/{d.day}", f"{MONTHS[d.month]} {d.day}") for d in dates], size=15)

    points = tuple(enumerate(CUMULATIVE, start=1))
    ax.area(points, "cyan", fill_opacity=0.14)
    ax.path(points, "cyan", 3)
    for day, (dx, dy, anchor) in zip(MILESTONES, ((11, -10, "start"), (0, -16, "middle"),
                                                  (0, -16, "middle"), (-6, -13, "end"))):
        count = CUMULATIVE[day - 1]
        x, y = ax.pt(day, count)
        fig.dot(x, y, 4.2, "cyan", ring="bg")
        fig.text(x + dx, y + dy, fig.t(f"{count:,}", f"{count:,}"), size=16, color="cyan", weight=700, anchor=anchor, halo=True)

    fig.text(64, 291, fig.t(f"trureturing · 2026 · {days} 天 · 日均约 {daily_average} 项",
                           f"trureturing · 2026 · {days} days · about {daily_average} per day"), size=15, color="dim")
