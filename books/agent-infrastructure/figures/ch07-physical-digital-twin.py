"""Digital and physical surfaces share permission-mediated agent access."""

SIZE = (680, 310)
WRAP = True
ALT = {
    "zh": "两块示意图展示智能体的数字与物理表面。左侧 chrono-metaverse 的三维空间与 "
          "chrono-cd 的 GitOps 部署相连。右侧 Living with AI 通过 NyxID 权限连接"
          " Home Assistant 传感器与执行器，节点版本为 v1.1.1-alpha.52。",
    "en": "Two schematics show digital and physical agent surfaces. On the left, chrono-metaverse "
          "provides a 3D space and chrono-cd supplies GitOps deployment. On the right, Living with AI "
          "connects Home Assistant sensors and actuators through NyxID permissions, using "
          "nyx-homeassistant-node v1.1.1-alpha.52.",
}

# facts-latest.json: ChronoAIProject/nyx-homeassistant-node@v1.1.1-alpha.52, 2026-11-04.
NODE_VERSION = "1.1.1-alpha.52"


def draw(fig):
    t = fig.t
    assert NODE_VERSION == "1.1.1-alpha.52"
    digital, physical = fig.row([330, 330], 310, gap=20)

    for panel, title in [(digital, t("数字表面", "Digital surface")), (physical, t("物理家居", "Physical home"))]:
        panel.rect(2, 2, 326, 306, color="edge", fill="panel", rx=8)
        panel.text(165, 23, title, size=18, weight=600, anchor="middle", middle=True)
        panel.line(18, 43, 312, 43, "edge", 1.2)

    # A perspective room with a deployment endpoint on the floor.
    floor = [(37, 125), (155, 81), (293, 128), (175, 180)]
    digital.polygon(floor, "cyan", color="cyan", fill_opacity=0.10)
    for x, y in [(37, 125), (155, 81), (293, 128)]:
        digital.line(x, y, x, y - 32, "dim", 1.2)
    digital.polyline([(37, 93), (155, 49), (293, 96)], "dim", 1.2)
    digital.text(165, 134, "chrono-metaverse", size=16, weight=600, anchor="middle")
    digital.text(165, 157, t("三维空间", "3D space"), size=14, anchor="middle")
    digital.arrow(165, 219, 165, 181, "cyan", 1.8)
    digital.rect(43, 220, 244, 61, color="blue", fill="blue", fill_opacity=0.10, rx=6, width=1.6)
    digital.text(165, 244, "chrono-cd", size=16, color="blue", anchor="middle")
    digital.text(165, 270, t("GitOps 部署", "GitOps deployment"), size=14, color="dim", anchor="middle")

    physical.polygon([(28, 117), (165, 52), (302, 117), (302, 204), (28, 204)],
                     "blue", color="blue", fill_opacity=0.08)
    physical.text(165, 91, t("Living with AI", "Living with AI"), size=16, weight=600, anchor="middle")
    sensor = physical.box(91, 118, t("传感器", "Sensors"), "edge", w=120, size=14)
    actuator = physical.box(239, 118, t("执行器", "Actuators"), "edge", w=120, size=14)
    home = physical.box(165, 168, t("Home Assistant", "Home Assistant"), "blue", w=190, size=14)
    physical.link(sensor.bottom, (105, 168), "dim", head=6)
    physical.link((225, 168), actuator.bottom, "dim", head=6)
    permission = physical.box(165, 219, t("NyxID 权限", "NyxID permissions"), "cyan", w=244, size=16)
    physical.arrow(*home.bottom, *permission.top, "cyan", 1.6, head=6, both=True)
    physical.text(165, 274, t("nyx-homeassistant-node", "nyx-homeassistant-node"),
                  size=14, anchor="middle", weight=600)
    physical.text(165, 294, t(f"v{NODE_VERSION}", f"v{NODE_VERSION}"),
                  size=14, color="dim", anchor="middle")
