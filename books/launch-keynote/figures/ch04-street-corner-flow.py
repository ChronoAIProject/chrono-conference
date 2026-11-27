SIZE = (358, 360)
ALT = {
    "zh": "Street Corner 来宾动线分五步。打开前厅链接，用 NyxID 登录，接受接待员 Donna 的问候并从 30 条问答中获得帮助。然后可原子锁定剧场六环共 1,108 个席位之一，或由 Blossom 在花店 (Flower Town) 的 18 个花篮展位办理花篮。最后进入新加坡时间 16:00 的发布会直播。",
    "en": "The five-stage Street Corner guest journey starts with a lobby link and NyxID sign-in, followed by concierge Donna and her 30-question bank. Guests can then atomically reserve one of 1,108 theater seats across six rings or arrange a Blossom basket at one of 18 Flower Town stands. The keynote stream begins at 16:00 SGT.",
}

SEATS_PER_RING = (96, 144, 176, 204, 232, 256)
STANDS = 18
QUESTIONS = 30


def draw(fig):
    seats, rings = sum(SEATS_PER_RING), len(SEATS_PER_RING)
    assert (seats, rings, STANDS, QUESTIONS) == (1108, 6, 18, 30)

    fig.text(179, 19, fig.t("Street Corner 来宾动线", "Street Corner guest journey"), size=17, anchor="middle", weight=700)
    steps = (
        (31, 40, fig.t("打开前厅链接", "Open lobby link"), ()),
        (83, 40, fig.t("NyxID 登录", "Sign in with NyxID"), ()),
        (135, 53, fig.t("接待员 Donna 问候", "Meet concierge Donna"),
         (fig.t(f"{QUESTIONS} 条问答", f"{QUESTIONS}-question bank"),)),
        (200, 84, fig.t("原子锁座 · Blossom 花篮", "Atomic seat lock · Blossom"),
         (fig.t(f"剧场 · {seats:,} 席 / {rings} 环", f"Theater · {seats:,} seats across {rings} rings"),
          fig.t(f"花店 (Flower Town) · {STANDS} 个花篮展位", f"Flower Town · {STANDS} basket stands"))),
        (296, 53, fig.t("进入发布会直播", "Join the live keynote"), (fig.t("16:00 新加坡时间", "16:00 SGT"),)),
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
            fig.text(63, top + 39 + row * 20, note, size=14, color="dim", middle=True)
        previous_bottom = top + height
