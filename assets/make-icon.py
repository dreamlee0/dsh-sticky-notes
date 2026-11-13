"""Render the storefront icon (180x180 PNG) for dsh-sticky-notes.

The catalog refuses SVG, so this draws a raster twin of icon.svg:
moss-green rounded tile, a cream sticky note, a small calendar card and a leaf.
"""
from PIL import Image, ImageDraw
import math

S = 180
SS = 4  # supersample factor
W = S * SS

img = Image.new("RGBA", (W, W), (0, 0, 0, 0))
d = ImageDraw.Draw(img)


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


# ── tile background: moss gradient ────────────────────────────────────
top = (156, 186, 125)
bottom = (71, 97, 63)
grad = Image.new("RGB", (W, W))
gd = ImageDraw.Draw(grad)
for y in range(W):
    gd.line([(0, y), (W, y)], fill=lerp(top, bottom, y / (W - 1)))

mask = Image.new("L", (W, W), 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, W - 1, W - 1], radius=int(14 * SS), fill=255)
img.paste(grad, (0, 0), mask)

d = ImageDraw.Draw(img)
# inner hairline
d.rounded_rectangle(
    [int(1.5 * SS), int(1.5 * SS), W - int(1.5 * SS), W - int(1.5 * SS)],
    radius=int(12.5 * SS),
    outline=(255, 255, 255, 82),
    width=int(1.5 * SS),
)


def rotate_paste(layer, box, angle):
    """Paste `layer` centred on `box` rotated by `angle` degrees."""
    rot = layer.rotate(angle, resample=Image.BICUBIC, expand=True)
    cx = (box[0] + box[2]) // 2
    cy = (box[1] + box[3]) // 2
    img.alpha_composite(rot, (cx - rot.width // 2, cy - rot.height // 2))


# ── sticky note (rotated, cream paper) ────────────────────────────────
note_w, note_h = int(30 * SS), int(32 * SS)
note = Image.new("RGBA", (note_w, note_h), (0, 0, 0, 0))
nd = ImageDraw.Draw(note)
nd.rounded_rectangle(
    [0, 0, note_w - 1, note_h - 1],
    radius=int(3.5 * SS),
    fill=(251, 247, 231, 255),
    outline=(198, 185, 154, 255),
    width=max(1, int(1.2 * SS)),
)
# ruled lines
for i, y in enumerate((8, 14, 20)):
    w = 20 if i < 2 else 17
    nd.line(
        [int(5 * SS), y * SS, int((5 + w) * SS), y * SS],
        fill=(124, 154, 96, 190),
        width=int(1.8 * SS),
    )
# folded corner
nd.polygon(
    [
        (note_w - int(5 * SS), note_h - 1),
        (note_w - 1, note_h - int(5 * SS)),
        (note_w - 1, note_h - 1),
    ],
    fill=(226, 214, 184, 255),
)
rotate_paste(note, (int(14 * SS), int(22 * SS), int(46 * SS), int(56 * SS)), 6)

# ── calendar card (top right) ─────────────────────────────────────────
cal_w, cal_h = int(20 * SS), int(19 * SS)
cal = Image.new("RGBA", (cal_w, cal_h), (0, 0, 0, 0))
cd = ImageDraw.Draw(cal)
cd.rounded_rectangle(
    [0, 0, cal_w - 1, cal_h - 1],
    radius=int(4 * SS),
    fill=(246, 242, 226, 242),
)
cd.line([0, int(6 * SS), cal_w, int(6 * SS)], fill=(124, 154, 96, 255), width=int(1.6 * SS))
cd.line([int(5 * SS), int(2.6 * SS), int(5 * SS), int(5.6 * SS)], fill=(124, 154, 96, 255), width=int(1.6 * SS))
cd.line([int(15 * SS), int(2.6 * SS), int(15 * SS), int(5.6 * SS)], fill=(124, 154, 96, 255), width=int(1.6 * SS))
for i, cx in enumerate((6, 11, 15.4)):
    col = ((79, 111, 68), (143, 174, 114), (185, 201, 161))[i]
    cd.ellipse([int((cx - 1.4) * SS), int(10.2 * SS), int((cx + 1.4) * SS), int(13 * SS)], fill=col)
img.alpha_composite(cal, (int(33 * SS), int(11 * SS)))

# ── leaf accent (bottom right) ────────────────────────────────────────
leaf_w, leaf_h = int(20 * SS), int(20 * SS)
leaf = Image.new("RGBA", (leaf_w, leaf_h), (0, 0, 0, 0))
ld = ImageDraw.Draw(leaf)
ld.polygon(
    [
        (leaf_w - 2, 2),
        (int(leaf_w * 0.72), int(leaf_h * 0.42)),
        (int(leaf_w * 0.36), int(leaf_h * 0.80)),
        (2, leaf_h - 2),
        (int(leaf_w * 0.30), int(leaf_h * 0.62)),
        (int(leaf_w * 0.62), int(leaf_h * 0.24)),
    ],
    fill=(220, 232, 203, 235),
)
ld.line(
    [2, leaf_h - 2, leaf_w - 2, 2],
    fill=(242, 246, 232, 255),
    width=max(1, int(1.2 * SS)),
)
img.alpha_composite(leaf, (int(30 * SS), int(36 * SS)))

# ── downscale ─────────────────────────────────────────────────────────
out = img.resize((S, S), Image.LANCZOS)
out.save("D:/deepseek/memo-calendar/assets/icon-180.png", "PNG", optimize=True)
print("wrote assets/icon-180.png", out.size)