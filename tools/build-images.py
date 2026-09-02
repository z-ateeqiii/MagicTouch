"""Generate web-optimised WebP derivatives from the salon's source photos.

Each entry: (source file, output name, target size, crop centring, quality)
Centring is (x, y) in 0..1 — 0.5/0.5 is a plain centre crop.
"""
import os
from PIL import Image, ImageOps, ImageEnhance

# Per-image tone correction, applied before encoding, for sources that sit
# outside the warm dark palette. (brightness, saturation, warm-tint strength)
TONE = {
    "wellness-pedicure.webp": (0.80, 0.86, 0.16),
}
WARM = (212, 160, 23)


def tone_map(im, name):
    settings = TONE.get(name)
    if not settings:
        return im
    brightness, saturation, tint = settings
    im = ImageEnhance.Brightness(im).enhance(brightness)
    im = ImageEnhance.Color(im).enhance(saturation)
    return Image.blend(im, Image.new("RGB", im.size, WARM), tint)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "img", "source")
OUT = os.path.join(ROOT, "assets", "img")

JOBS = [
    # hero — landscape banner, kept near native resolution
    ("hero section.png",            "hero.webp",              (1470, 980), (0.5, 0.5), 80),

    # massage thumbnails — square, shown at 88px (240px covers 2x displays)
    ("Shiatsu Acupressure1.png",    "svc-shiatsu.webp",       (240, 240), (0.50, 0.42), 82),
    ("3.png",                       "svc-aromatherapy.webp",  (240, 240), (0.58, 0.55), 82),
    ("2.png",                       "svc-egyptian.webp",      (240, 240), (0.48, 0.58), 82),
    ("Swedish Oil Massage.png",     "svc-swedish.webp",       (240, 240), (0.50, 0.38), 82),
    ("leg massage.png",             "svc-reflexology.webp",   (240, 240), (0.50, 0.52), 82),
    ("1.png",                       "svc-antistress.webp",    (240, 240), (0.45, 0.45), 82),

    # wellness cards — 4:5 portrait media panels
    ("steam room.png",              "wellness-steam.webp",    (640, 800), (0.50, 0.45), 78),
    ("Scrubs2.png",                 "wellness-scrubs.webp",   (640, 800), (0.45, 0.50), 78),
    ("padicure.png",                "wellness-pedicure.webp", (640, 800), (0.42, 0.55), 78),
    ("manicure.png",                "wellness-manicure.webp", (640, 800), (0.50, 0.55), 78),

    # experience panel — tall portrait
    ("steam room2.png",             "experience.webp",        (900, 1100), (0.55, 0.55), 78),
]


def build():
    total_in = total_out = 0
    for src_name, out_name, size, centring, quality in JOBS:
        src_path = os.path.join(SRC, src_name)
        out_path = os.path.join(OUT, out_name)

        with Image.open(src_path) as im:
            im = im.convert("RGB")
            fitted = ImageOps.fit(im, size, method=Image.LANCZOS, centering=centring)
            fitted = tone_map(fitted, out_name)
            fitted.save(out_path, "WEBP", quality=quality, method=6)

        size_in = os.path.getsize(src_path)
        size_out = os.path.getsize(out_path)
        total_in += size_in
        total_out += size_out
        print("%-24s %5dx%-5d %7.0f KB -> %6.0f KB"
              % (out_name, size[0], size[1], size_in / 1024, size_out / 1024))

    print("-" * 60)
    print("total %.1f MB -> %.0f KB" % (total_in / 1048576, total_out / 1024))


if __name__ == "__main__":
    build()
