from datetime import datetime, timedelta

SIZE = (520, 300)
ALT = {
    "zh": "2026 年 12 月 17 日新加坡时间 16:00 至 17:15 的 75 分钟播出表。第 0–5 分钟为开场影片与 Donna 欢迎，第 5–20 分钟为执行与判断宣言，第 20–35 分钟为第二幕科研真理引擎（在 live.trureturing.org 进行五步核验），第 35–50 分钟为第三幕整车演示（NyxID、Ornn、CMA、heca、chrono-harness），第 50–62 分钟为六类 AI 员工与 Street Corner 导览，第 62–75 分钟为记者公开问答与邀请。",
    "en": "The 75-minute broadcast on December 17, 2026 runs from 16:00 to 17:15 SGT. Minutes 00–05 cover the opening film and Donna's welcome, 05–20 the execution and judgment manifesto, 20–35 Act II, the research truth engine with a five-step audit at live.trureturing.org, 35–50 Act III, the complete-vehicle demo featuring NyxID, Ornn, CMA, heca, and chrono-harness, 50–62 the six AI employees and Street Corner tour, and 62–75 the open press Q&A and invitation.",
}

START = datetime(2026, 12, 17, 16, 0)
DURATIONS = (5, 15, 15, 15, 12, 13)


def draw(fig):
    total = sum(DURATIONS)
    assert total == 75 and START + timedelta(minutes=total) == datetime(2026, 12, 17, 17, 15)

    events = (
        (fig.t("开场影片与 Donna 欢迎", "Opening film & Donna welcome"), None, "dim"),
        (fig.t("第一幕 · 执行与判断", "Act I · Execution & judgment"), None, "magenta"),
        (fig.t("北极星 · 五步核验", "North Star · 5-step audit"),
         fig.t("live.trureturing.org · 五步核验", "live.trureturing.org · five-step audit"), "blue"),
        (fig.t("第三幕 · 整车演示", "Act III · Complete-vehicle demo"),
         fig.t("NyxID · Ornn · CMA · heca · chrono-harness", "NyxID · Ornn · CMA · heca · chrono-harness"), "cyan"),
        (fig.t("第四幕 · 六类 AI 员工与会场导览", "Act IV · Six AI employees & Street Corner tour"), None, "violet"),
        (fig.t("记者公开问答与邀请", "Open press Q&A & invitation"), None, "dim"),
    )
    fig.text(16, 24, fig.t("12 月 17 日 · 新加坡时间", "December 17 · SGT"), size=17, weight=700)
    fig.text(504, 24, fig.t("16:00–17:15", "16:00–17:15"), size=17, anchor="end", weight=700)

    fig.text(16, 87, fig.t("直播起算分钟", "Elapsed minutes"), size=15, color="dim")
    elapsed, y = 0, 113
    for duration, (label, note, role) in zip(DURATIONS, events):
        end = elapsed + duration
        x = 16 + 488 * elapsed / total
        width = 488 * duration / total
        fig.rect(x, 40, width - 3, 25, color=role, fill=role, fill_opacity=0.23, rx=3)
        fig.rect(17, y - 10, 5, 13, color=None, fill=role, rx=2)
        fig.text(31, y, fig.t(f"{elapsed:02d}–{end:02d}", f"{elapsed:02d}–{end:02d}"), size=15, mono=True, color=role, weight=650)
        fig.text(98, y, label, size=16, weight=650)
        if note:
            fig.text(98, y + 19, note, size=15, color="dim")
        y += 45 if note else 27
        elapsed = end
