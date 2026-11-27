"""NyxID brokers scoped access across the credential boundary."""

SIZE = (358, 410)
ALT = {
    "zh": "智能体上下文不含明文凭据，仅持有受限能力句柄。请求经 NyxID 策略与审批关口，"
          "由加密凭据库在代理侧注入 OAuth 或 API 凭据后访问上游。v0.78.0 的目录包含 55 项服务、"
          "42 份 OpenAPI→MCP 规范、7 家服务提供方与 9 类消息渠道；dev v0.79.0 扩展到 11 类渠道。",
    "en": "The agent context holds a scoped capability handle without plaintext credentials. "
          "NyxID checks policy and approval, then injects OAuth or API credentials from an encrypted "
          "vault at the proxy. The v0.78.0 live snapshot has 55 catalog services, 42 OpenAPI-to-MCP specs, "
          "7 service providers and 9 channel types; dev v0.79.0 expands to 11 channel types.",
}

# Audited live prod/dev snapshots: v0.78.0 (2026-11-23) and v0.79.0 dev (2026-11-27).
SERVICES, SPECS, PROVIDERS, CHANNELS, DEV_CHANNELS = 55, 42, 7, 9, 11


def draw(fig):
    t = fig.t
    assert (SERVICES, SPECS, PROVIDERS, CHANNELS, DEV_CHANNELS) == (55, 42, 7, 9, 11)

    stages = [
        (t("智能体上下文", "Agent context"), t("零明文凭据", "Zero plaintext credentials"), "cyan"),
        (t("受限能力句柄", "Scoped capability handle"), None, "edge"),
        (t("NyxID 策略与审批关口", "NyxID policy & approval gate"), None, "now"),
        (t("加密凭据库与代理注入", "Encrypted vault & injection"), t("OAuth / API 凭据", "OAuth / API credentials"), "blue"),
    ]
    previous = None
    # The dashed boundary makes the transition from agent context to broker explicit.
    fig.rect(12, 7, 334, 117, color="cyan", width=1.2, dash="5 4", rx=8)
    for (title, note, color), y in zip(stages, (15, 79, 145, 201)):
        box = fig.box(179, y, title, color, note=note, note_mono=False, w=300, size=15, note_size=13)
        if previous:
            fig.link(previous, box, "dim")
        previous = box
    fig.link(previous, (179, 272), "dim")
    fig.rect(12, 272, 334, 109, color="edge", fill="panel", rx=8)
    fig.text(179, 287, t("上游接入范围", "Upstream coverage"), size=14, weight=600, anchor="middle", middle=True)
    for index, (value, label) in enumerate([
        (SERVICES, t("目录服务", "Catalog services")),
        (SPECS, t("OpenAPI 规范", "OpenAPI specs")),
        (PROVIDERS, t("模型服务提供方", "Model providers")),
        (CHANNELS, t("消息渠道类型", "Channel types")),
    ]):
        x = 95 + (index % 2) * 168
        y = 310 + (index // 2) * 40
        fig.text(x, y, t(str(value), str(value)), size=20, color="cyan", weight=600, anchor="middle", middle=True)
        fig.text(x, y + 17, label, size=13, anchor="middle", middle=True)
    fig.text(179, 393, t("NyxID v0.78.0 · live 2026-11-23/27", "NyxID v0.78.0 · live Nov 23/27"),
             size=12, color="dim", anchor="middle")
    fig.text(179, 407, t("dev v0.79.0 · 11 类渠道", "dev v0.79.0 · 11 channel types"),
             size=12, color="dim", anchor="middle")
