# -*- coding: utf-8 -*-
"""Generate WeChat tabBar PNGs (81x81, transparent background)."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

SIZE = 81
# 未选中：浅亮灰蓝；选中：明丽亮天蓝（与 app.json tabBar 一致）
COLOR_NORMAL = (186, 198, 216, 255)  # #bac8d8
COLOR_ACTIVE = (56, 189, 248, 255)  # #38bdf8
LINE = 4


def blank() -> Image.Image:
    return Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))


def draw_home(im: Image.Image, color: tuple[int, int, int, int]) -> None:
    d = ImageDraw.Draw(im)
    m = 14
    # 房顶三角
    d.polygon([(40, m), (SIZE - m, m + 22), (m, m + 22)], outline=color, width=int(LINE))
    # 墙
    d.rectangle([m + 2, m + 22, SIZE - m - 2, SIZE - m], outline=color, width=int(LINE))
    # 门
    dw = 14
    d.rectangle(
        [40 - dw // 2, SIZE - m - 26, 40 + dw // 2, SIZE - m - 2],
        outline=color,
        width=int(LINE),
    )


def draw_workorder(im: Image.Image, color: tuple[int, int, int, int]) -> None:
    d = ImageDraw.Draw(im)
    m = 16
    d.rectangle([m, m + 6, SIZE - m, SIZE - m], outline=color, width=int(LINE))
    for i, y in enumerate([28, 38, 48, 58]):
        x0 = m + 10
        x1 = SIZE - m - 10 - (8 if i == 0 else 0)
        d.line([(x0, y), (x1, y)], fill=color, width=2)


def draw_device(im: Image.Image, color: tuple[int, int, int, int]) -> None:
    d = ImageDraw.Draw(im)
    m = 14
    # 屏幕
    d.rectangle([m, m + 4, SIZE - m, SIZE - m - 14], outline=color, width=int(LINE))
    # 底座
    d.rectangle([28, SIZE - m - 10, 53, SIZE - m - 4], fill=color)


def draw_discover(im: Image.Image, color: tuple[int, int, int, int]) -> None:
    d = ImageDraw.Draw(im)
    cx, cy = 40, 38
    r = 22
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color, width=int(LINE))
    # 指针
    d.line([(cx, cy), (cx + 12, cy - 10)], fill=color, width=int(LINE))


def draw_profile(im: Image.Image, color: tuple[int, int, int, int]) -> None:
    d = ImageDraw.Draw(im)
    cx = 40
    d.ellipse([cx - 14, 16, cx + 14, 36], outline=color, width=int(LINE))
    d.arc([12, 44, 68, 88], start=200, end=340, fill=color, width=int(LINE))


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    out_dir = root / "assets" / "tabbar"
    out_dir.mkdir(parents=True, exist_ok=True)

    specs = [
        ("home", draw_home),
        ("workorder", draw_workorder),
        ("device", draw_device),
        ("discover", draw_discover),
        ("profile", draw_profile),
    ]

    for name, draw_fn in specs:
        for suffix, col in (("", COLOR_NORMAL), ("-active", COLOR_ACTIVE)):
            im = blank()
            draw_fn(im, col)
            path = out_dir / f"{name}{suffix}.png"
            im.save(path, "PNG")
            print(path)

    print("Done.")
    marker = root / "scripts" / "_tabbar_icons_generated.txt"
    marker.write_text("ok\n", encoding="utf-8")


if __name__ == "__main__":
    main()
