"""Launch milestones with offsets calculated from the broadcast date."""

from datetime import date, datetime, time

SIZE = (520, 390)
ALT = {
    "zh": "2026 年发布日程以 12 月 17 日为 T-0。11 月 27 日全流程排练 12 阶段通过 11 阶段；"
          "12 月 4 日开放预约与前厅（提前 13 天），11 日并发压测与锁座演练（提前 6 天），"
          "15 日冻结，16 日正式 Discord dress rehearsal，17 日新加坡时间 16:00–17:15 直播，"
          "18 日切片、工单与商户跟进（延后 1 天）。",
    "en": "The 2026 launch calendar uses December 17 as T-0. The November 27 full-flow rehearsal passed 11 of 12 stages. "
          "December 4 opens booking and the lobby (13 days before), December 11 is the load test and seat-lock drill "
          "(6 days before), December 15 freezes artifacts, December 16 is the formal Discord dress rehearsal, "
          "December 17 carries the 16:00–17:15 SGT broadcast, and December 18 handles clips, tickets and pilot follow-up.",
}

# Audited rehearsal and launch milestones, 2026-11-27 through 2026-12-18.
MILESTONE_DATES = (
    date(2026, 11, 27), date(2026, 12, 4), date(2026, 12, 11),
    date(2026, 12, 15), date(2026, 12, 16), date(2026, 12, 17), date(2026, 12, 18),
)
START, END = time(16, 0), time(17, 15)


def draw(fig):
    t = fig.t
    dates = list(MILESTONE_DATES)
    broadcast = date(2026, 12, 17)
    offsets = [(day - broadcast).days for day in dates]
    assert offsets == [-20, -13, -6, -2, -1, 0, 1]
    assert (START, END) == (time(16, 0), time(17, 15))
    assert (datetime.combine(broadcast, END) - datetime.combine(broadcast, START)).total_seconds() == 75 * 60
    hours = f"{START:%H:%M}–{END:%H:%M} SGT"

    labels = [
        t("全流程排练 · 11/12 通过", "Full-flow rehearsal · 11/12 passed"),
        t("开放预约与前厅", "Booking & lobby open"),
        t("并发压测与锁座演练", "Load test & seat-lock drill"),
        t("资料冻结", "Artifact freeze"),
        t("正式 Discord dress rehearsal", "Formal Discord dress rehearsal"),
        t(f"直播 · {hours}", f"Live · {hours}"),
        t("切片、工单与商户跟进", "Clips, tickets & pilot follow-up"),
    ]
    fig.text(18, 20, t("2026 年 11–12 月", "November–December 2026"), size=18, weight=600)
    fig.text(502, 20, t("新加坡时间", "Singapore time"), size=15, color="dim", anchor="end")
    fig.line(26, 50, 26, 316, "edge", 2)
    for index, (day, offset, label) in enumerate(zip(dates, offsets, labels)):
        y = 51 + index * 49
        color = "now" if offset == 0 else "cyan"
        if offset == 0:
            fig.rect(10, y - 22, 500, 44, color="now", fill="now", fill_opacity=0.10, rx=5)
        fig.dot(26, y, 5.5, color, ring="bg")
        date_label = f"{day.month} 月 {day.day:02d} 日"
        en_date_label = f"Dec {day.day:02d}" if day.month == 12 else f"Nov {day.day:02d}"
        fig.text(44, y - 7, t(date_label, en_date_label),
                 size=17, weight=600, color=color, middle=True)
        delta = "T-0" if offset == 0 else f"T{offset:+d}d"
        fig.text(44, y + 12, t(delta, delta), size=15, color="dim", middle=True, mono=True)
        fig.text(180, y, label, size=16, weight=600 if offset == 0 else 400, middle=True)
