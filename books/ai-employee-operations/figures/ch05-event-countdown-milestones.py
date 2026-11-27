"""Launch milestones with offsets calculated from the broadcast date."""

from datetime import date, datetime, time

SIZE = (520, 343)
ALT = {
    "zh": "2026 年发布日程以 12 月 17 日为 T-0：12 月 4 日开放预约与前厅（提前 13 天），"
          "8 日发布媒体包与第二波倒计时（提前 9 天），11 日并发压测与锁座演练（提前 6 天），"
          "15 日全程彩排与冻结（提前 2 天），17 日新加坡时间 16:00–17:15 直播，"
          "18 日切片、工单与商户跟进（延后 1 天）。",
    "en": "The 2026 launch calendar uses December 17 as T-0: December 4 booking and lobby open "
          "(13 days before), December 8 press kit and second countdown wave (9 days before), "
          "December 11 Load test & seat-lock drill (6 days before), December 15 dress rehearsal and freeze "
          "(2 days before), December 17 live broadcast from 16:00 to 17:15 SGT, and December 18 "
          "clips, tickets and pilot follow-up (one day after).",
}

# Launch dates transcribed from the conference figure brief (chronoai-launch-event.yaml).
DAYS = (4, 8, 11, 15, 17, 18)
START, END = time(16, 0), time(17, 15)


def draw(fig):
    t = fig.t
    dates = [date(2026, 12, day) for day in DAYS]
    broadcast = date(2026, 12, 17)
    offsets = [(day - broadcast).days for day in dates]
    assert DAYS == (4, 8, 11, 15, 17, 18)
    assert offsets == [-13, -9, -6, -2, 0, 1]
    assert (START, END) == (time(16, 0), time(17, 15))
    assert (datetime.combine(broadcast, END) - datetime.combine(broadcast, START)).total_seconds() == 75 * 60
    hours = f"{START:%H:%M}–{END:%H:%M} SGT"

    labels = [
        t("开放预约与前厅", "Booking & lobby open"),
        t("媒体包与第二波倒计时", "Press kit & countdown wave 2"),
        t("并发压测与锁座演练", "Load test & seat-lock drill"),
        t("全程彩排与冻结", "Dress rehearsal & freeze"),
        t(f"直播 · {hours}", f"Live · {hours}"),
        t("切片、工单与商户跟进", "Clips, tickets & pilot follow-up"),
    ]
    fig.text(18, 20, t("2026 年 12 月", "December 2026"), size=18, weight=600)
    fig.text(502, 20, t("新加坡时间", "Singapore time"), size=15, color="dim", anchor="end")
    fig.line(26, 50, 26, 316, "edge", 2)
    for index, (day, offset, label) in enumerate(zip(dates, offsets, labels)):
        y = 51 + index * 53
        color = "now" if offset == 0 else "cyan"
        if offset == 0:
            fig.rect(10, y - 22, 500, 44, color="now", fill="now", fill_opacity=0.10, rx=5)
        fig.dot(26, y, 5.5, color, ring="bg")
        fig.text(44, y - 7, t(f"12 月 {day.day:02d} 日", f"Dec {day.day:02d}"),
                 size=17, weight=600, color=color, middle=True)
        delta = "T-0" if offset == 0 else f"T{offset:+d}d"
        fig.text(44, y + 12, t(delta, delta), size=15, color="dim", middle=True, mono=True)
        fig.text(180, y, label, size=16, weight=600 if offset == 0 else 400, middle=True)
