SIZE = (358, 410)
ALT = {
    "zh": "Street Corner 来宾动线分五步。打开前厅链接，用 NyxID 登录，接受接待员 Donna 的问候并从 30 条问答中获得帮助。然后可在北、南、东、西四个席位区的八层座位中原子锁定 1,108 席之一，或由 Blossom 在 2×9 花篮垫（basket-01..18）办理花篮。官方入口是 @chronoai_frontdesk_bot 与 @flowerassis_bot，最后进入新加坡时间 16:00 的发布会直播。",
    "en": "The five-stage Street Corner guest journey starts with a lobby link and NyxID sign-in, followed by concierge Donna and her 30-question bank. Guests can then atomically reserve one of 1,108 seats across four stands and eight tiered rows, or arrange a Blossom basket on the 2×9 basket-01..18 mat grid. Official entry points are @chronoai_frontdesk_bot and @flowerassis_bot before the 16:00 SGT stream.",
}

STAND_SEATS = (("N", 248), ("S", 248), ("E", 306), ("W", 306))
ROW_SEATS = (144, 144, 144, 140, 136, 136, 132, 132)
BASKET_MATS = tuple(f"basket-{index:02d}" for index in range(1, 19))
QUESTIONS = 30


def draw(fig):
    seats, rows = sum(row for _, row in STAND_SEATS), len(ROW_SEATS)
    assert (seats, rows, len(STAND_SEATS), len(BASKET_MATS), QUESTIONS) == (1108, 8, 4, 18, 30)

    fig.text(179, 19, fig.t("Street Corner 来宾动线", "Street Corner guest journey"), size=17, anchor="middle", weight=700)
    steps = (
        (31, 40, fig.t("打开前厅链接", "Open lobby link"), ()),
        (83, 40, fig.t("NyxID 登录", "Sign in with NyxID"), ()),
        (135, 53, fig.t("接待员 Donna 问候", "Meet concierge Donna"),
         (fig.t(f"{QUESTIONS} 条问答", f"{QUESTIONS}-question bank"),)),
        (186, 112, fig.t("原子锁座 · Blossom 花篮", "Atomic seat lock · Blossom"),
         (fig.t(f"剧场 · {seats:,} 席 · N/S 248 · E/W 306", f"Theater · {seats:,} seats · N/S 248 · E/W 306"),
          fig.t("8 行 · 144×3 · 140 · 136×2 · 132×2",
                "8 rows · 144×3 · 140 · 136×2 · 132×2"),
          fig.t("花店 · 2×9 花篮垫 · basket-01..18", "Flower Town · 2×9 mats · basket-01..18"),
          fig.t("@chronoai_frontdesk_bot · @flowerassis_bot", "@chronoai_frontdesk_bot · @flowerassis_bot"))),
        (313, 68, fig.t("进入发布会直播", "Join the live keynote"), (fig.t("16:00 新加坡时间", "16:00 SGT"),)),
    )
    previous_bottom = None
    for index, (top, height, label, notes) in enumerate(steps, start=1):
        role = "cyan" if index in (4, 5) else "edge"
        if previous_bottom is not None:
            fig.arrow(179, previous_bottom + 1, 179, top - 1, "dim", 1.4, head=5.5)
        fig.rect(15, top, 328, height, color=role, fill="panel", rx=7)
        fig.circle(39, top + height / 2, 12, color=role)
        fig.text(39, top + height / 2, fig.t(str(index), str(index)), size=13, anchor="middle", middle=True, weight=650)
        fig.text(63, top + 19, label, size=16, middle=True, weight=650)
        for row, note in enumerate(notes):
            fig.text(63, top + 39 + row * 18, note, size=13, color="dim", middle=True)
        previous_bottom = top + height
