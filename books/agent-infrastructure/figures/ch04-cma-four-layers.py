"""Four managed-agent layers from user-facing access to isolated execution."""

SIZE = (358, 360)
ALT = {
    "zh": "CMA（cma.nyxid.ai）四层结构从上到下为用户界面与分享链接、托管智能体运行时"
          "（凭据热重载约 2.1 秒）、事件网关 cmaeg 与渠道路由，以及隔离沙箱执行与产物存储。",
    "en": "CMA (cma.nyxid.ai) has four layers, from user surfaces and share links to managed agent "
          "runtime with approximately 2.1-second hot credential reload, the cmaeg event gateway and "
          "channel routing, and isolated sandbox execution with artifact storage.",
}

# Approximate credential reload time reported in the conference figure brief.
RELOAD_SECONDS = 2.1


def draw(fig):
    t = fig.t
    assert RELOAD_SECONDS == 2.1
    fig.text(179, 20, t("CMA · cma.nyxid.ai", "CMA · cma.nyxid.ai"),
             size=17, anchor="middle", weight=600)
    layers = [
        (4, t("用户访问层", "User surface"), t("界面与分享链接", "Interface & share links"), "cyan"),
        (3, t("托管智能体运行时", "Managed agent runtime"),
         t(f"凭据热重载 ≈ {RELOAD_SECONDS} 秒", f"Hot credential reload ≈ {RELOAD_SECONDS} s"), "blue"),
        (2, t("事件网关 cmaeg", "Event gateway cmaeg"), t("消息渠道路由", "Channel routing"), "blue"),
        (1, t("隔离沙箱执行", "Isolated sandbox execution"), t("产物存储", "Artifact store"), "edge"),
    ]
    for i, (number, title, detail, role) in enumerate(layers):
        y = 34 + i * 82
        fig.rect(13, y, 332, 66, color=role, fill="panel", width=1.4, rx=6)
        fig.rect(13, y, 44, 66, color=None, fill=role, fill_opacity=0.13, rx=6)
        fig.text(35, y + 31, t(str(number), str(number)), size=25, color="ink", weight=600, anchor="middle", middle=True)
        fig.text(70, y + 20, title, size=16, weight=600, middle=True)
        fig.text(70, y + 44, detail, size=13, color="dim", middle=True)
        if i < len(layers) - 1:
            fig.arrow(179, y + 66, 179, y + 82, "dim", 1.4, head=6)
