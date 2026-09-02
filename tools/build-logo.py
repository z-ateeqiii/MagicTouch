"""Turn the supplied logo into a web-ready transparent asset.

The source file is a screenshot of a transparent image: the "transparency"
checkerboard (#D7D7D7 / #F7F7F7) is painted into it as real pixels and there
is no alpha channel. This script:

  1. flood-fills the checkerboard inwards from the border, so white details
     *inside* the artwork (sparkles on the comet) are kept,
  2. gives the anti-aliased rim a fractional alpha instead of a grey fringe,
  3. trims the empty margin,
  4. resizes with premultiplied alpha so the edges do not halo,
  5. writes a small transparent WebP.

Run:  python tools/build-logo.py
"""
import os
from collections import deque
from PIL import Image, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "img", "source", "logo.png")
OUT = os.path.join(ROOT, "assets", "img", "logo.webp")

OUT_HEIGHT = 200      # covers the 64px footer mark at 3x
QUALITY = 92

# A pixel counts as backdrop when it is grey (no colour) and light.
CHROMA_MAX = 26       # max(r,g,b) - min(r,g,b)
LIGHT_SOLID = 200     # at or above this, and grey, it is pure backdrop
LIGHT_EDGE = 150      # below this it is treated as solid artwork


def load_rgb():
    return Image.open(SRC).convert("RGB")


CHECKER_DARK = (200, 228)   # the grid's grey square
CHECKER_LIGHT = 238          # ...and its near-white square
MIN_TONE_SHARE = 0.15        # each tone must be this much of the region
MIN_REGION = 30              # ignore stray single pixels


def reclaim_enclosed(w, h, chroma, light, outside):
    """Mark walled-in checkerboard regions as backdrop too."""
    seen = bytearray(w * h)
    reclaimed = 0

    for start in range(w * h):
        if seen[start] or outside[start]:
            continue
        if chroma[start] > CHROMA_MAX or light[start] < LIGHT_EDGE:
            continue

        seen[start] = 1
        queue = deque([start])
        cells = []
        while queue:
            i = queue.popleft()
            cells.append(i)
            x, y = i % w, i // w
            for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                if 0 <= nx < w and 0 <= ny < h:
                    j = ny * w + nx
                    if (not seen[j] and not outside[j]
                            and chroma[j] <= CHROMA_MAX and light[j] >= LIGHT_EDGE):
                        seen[j] = 1
                        queue.append(j)

        if len(cells) < MIN_REGION:
            continue
        dark = sum(1 for i in cells if CHECKER_DARK[0] <= light[i] <= CHECKER_DARK[1])
        pale = sum(1 for i in cells if light[i] >= CHECKER_LIGHT)
        share = MIN_TONE_SHARE * len(cells)
        if dark >= share and pale >= share:
            for i in cells:
                outside[i] = 1
            reclaimed += len(cells)

    if reclaimed:
        print("reclaimed %d enclosed backdrop pixels (letter counters)" % reclaimed)


def backdrop_alpha(im):
    """Alpha channel: 0 on the checkerboard, 255 on the artwork, with a
    graded rim where the two were blended by anti-aliasing."""
    w, h = im.size
    px = im.load()

    chroma = bytearray(w * h)
    light = bytearray(w * h)
    for y in range(h):
        row = y * w
        for x in range(w):
            r, g, b = px[x, y]
            hi = r if r > g else g
            if b > hi:
                hi = b
            lo = r if r < g else g
            if b < lo:
                lo = b
            chroma[row + x] = hi - lo if hi - lo < 255 else 255
            light[row + x] = (r + g + b) // 3

    # Flood fill the backdrop inwards from every border pixel.
    outside = bytearray(w * h)
    queue = deque()

    def seed(x, y):
        i = y * w + x
        if not outside[i] and chroma[i] <= CHROMA_MAX and light[i] >= LIGHT_EDGE:
            outside[i] = 1
            queue.append((x, y))

    for x in range(w):
        seed(x, 0)
        seed(x, h - 1)
    for y in range(h):
        seed(0, y)
        seed(w - 1, y)

    while queue:
        x, y = queue.popleft()
        if x > 0:
            seed(x - 1, y)
        if x < w - 1:
            seed(x + 1, y)
        if y > 0:
            seed(x, y - 1)
        if y < h - 1:
            seed(x, y + 1)

    # The border fill cannot reach backdrop that is walled in by artwork —
    # the counters of O, a and g, and the hollow of the star. Those regions
    # give themselves away by carrying *both* checkerboard tones, which no
    # flat highlight in the artwork ever does.
    reclaim_enclosed(w, h, chroma, light, outside)

    # Inside the filled region, ramp alpha across the anti-aliased rim.
    span = LIGHT_SOLID - LIGHT_EDGE
    alpha = bytearray(w * h)
    for i in range(w * h):
        if not outside[i]:
            alpha[i] = 255
        else:
            lum = light[i]
            if lum >= LIGHT_SOLID:
                alpha[i] = 0
            else:
                alpha[i] = min(255, max(0, (LIGHT_SOLID - lum) * 255 // span))

    return Image.frombytes("L", (w, h), bytes(alpha))


def resize_premultiplied(im, size):
    """Resize RGBA without letting transparent pixels bleed into the edges.

    Premultiplying and resizing happen at C speed on the full-size image;
    the reverse step runs on the small result, where Python is fast enough.
    """
    r, g, b, a = im.split()
    r, g, b = (ImageChops.multiply(c, a) for c in (r, g, b))
    r, g, b, a = (c.resize(size, Image.LANCZOS) for c in (r, g, b, a))

    channels = [bytearray(c.tobytes()) for c in (r, g, b)]
    alpha = a.tobytes()
    for i, av in enumerate(alpha):
        if av == 0:
            continue
        for c in channels:
            v = c[i] * 255 // av
            c[i] = 255 if v > 255 else v

    bands = [Image.frombytes("L", size, bytes(c)) for c in channels]
    return Image.merge("RGBA", (bands[0], bands[1], bands[2], a))


STAR_BOX = (600, 55, 900, 355)   # the star, in source coordinates
FAVICON_PX = 180
GROUND = (15, 11, 8)             # --bg, so the tab icon sits on brand colour


def star_only(im, alpha):
    """The comet-star on its own — the 'H' of TOUCH overlaps its crop box,
    so keep just the connected shape the star belongs to."""
    w, h = im.size
    ap = alpha.load()
    solid = bytearray(w * h)
    for y in range(h):
        row = y * w
        for x in range(w):
            solid[row + x] = 1 if ap[x, y] > 128 else 0

    seen = bytearray(w * h)
    best = None
    for start in range(w * h):
        if not solid[start] or seen[start]:
            continue
        seen[start] = 1
        queue = deque([start])
        cells = []
        top = h
        while queue:
            i = queue.popleft()
            cells.append(i)
            x, y = i % w, i // w
            if y < top:
                top = y
            for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                if 0 <= nx < w and 0 <= ny < h:
                    j = ny * w + nx
                    if solid[j] and not seen[j]:
                        seen[j] = 1
                        queue.append(j)
        # The star reaches higher than any other sizeable shape.
        if len(cells) >= 5000 and (best is None or top < best[0]):
            best = (top, cells)

    keep = bytearray(w * h)
    for i in best[1]:
        keep[i] = 255
    mask = Image.frombytes("L", (w, h), bytes(keep))
    out = im.copy()
    out.putalpha(ImageChops.multiply(alpha, mask))
    return out


def build_favicon(im, alpha):
    star = star_only(im, alpha).crop(STAR_BOX)
    star = resize_premultiplied(star, (FAVICON_PX, FAVICON_PX))
    icon = Image.new("RGBA", (FAVICON_PX, FAVICON_PX), GROUND + (255,))
    icon.alpha_composite(star)
    path = os.path.join(ROOT, "assets", "img", "favicon.png")
    icon.convert("RGB").save(path, "PNG", optimize=True)
    print("favicon.png  %dx%d  %.0f KB"
          % (FAVICON_PX, FAVICON_PX, os.path.getsize(path) / 1024))


def build():
    im = load_rgb()
    alpha = backdrop_alpha(im)

    build_favicon(im, alpha)

    im.putalpha(alpha)
    box = alpha.point(lambda v: 255 if v > 8 else 0).getbbox()
    im = im.crop(box)
    print("trimmed to %dx%d (from the original margin)" % im.size)

    ratio = OUT_HEIGHT / im.height
    size = (max(1, round(im.width * ratio)), OUT_HEIGHT)
    im = resize_premultiplied(im, size)

    im.save(OUT, "WEBP", quality=QUALITY, method=6)
    print("%s  %dx%d  %.0f KB -> %.0f KB"
          % (os.path.basename(OUT), size[0], size[1],
             os.path.getsize(SRC) / 1024, os.path.getsize(OUT) / 1024))


if __name__ == "__main__":
    build()
