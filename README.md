# Magic Touch — Beauty Salon

A single-page site for Magic Touch Beauty Salon. Plain HTML, CSS and JavaScript —
no build step and no dependencies. Open `index.html` in a browser, or upload the
folder to any static host.

```
index.html
assets/css/styles.css     design tokens + all styling
assets/js/data.js         ← everything you will want to edit
assets/js/components.js   markup templates (cards, tiles, icons)
assets/js/main.js         nav, scroll reveals, wiring
assets/img/               the .webp files the site actually loads
assets/img/logo.webp      logo, rebuilt from the source screenshot
assets/img/source/        the original full-size photos (not published)
tools/build-images.py     regenerates the photos from assets/img/source/
tools/build-logo.py       regenerates the logo + favicon
```

## Editing content

All content lives in **`assets/js/data.js`**. Nothing else needs touching.

### WhatsApp and contact

The salon has two lines, and they are kept apart on purpose:

```js
var WHATSAPP_NUMBER  = "201017673725";   // messaging + booking, never dialled
var WHATSAPP_DISPLAY = "+20 1017673725";

var PHONE_NUMBER     = "201016136187";   // voice calls
var PHONE_DISPLAY    = "+20 1016136187";

var FACEBOOK_URL     = "https://www.facebook.com/p/...";
```

`WHATSAPP_NUMBER` drives every booking button on the page — the hero, the nav,
all ten service cards, the closing CTA and the footer's WhatsApp row. It is
only ever rendered as a `wa.me` link, never as something to dial.

`PHONE_NUMBER` is used by the "or call" lines under the hero and closing CTA,
and by the footer's phone row, all as `tel:` links.

Change either in this one place.

Each service card opens WhatsApp with its own prefilled message, so you know
what is being asked for from the first line:

> Hello Magic Touch, I would like to book the Shiatsu Acupressure
> (60 mins — 950 L.E.). Is there availability?

The wording lives in `serviceMessage()` and `BOOKING_MESSAGE`.

### Prices and services

Edit the `MASSAGE_SERVICES` and `WELLNESS_SERVICES` arrays. Adding or removing an
entry adds or removes a card — no markup changes needed.

## The logo

`assets/img/logo.webp` (header and footer) and `assets/img/favicon.png` (browser
tab) are both generated from `assets/img/source/logo.png` by:

```
python tools/build-logo.py
```

The supplied file was a **screenshot** of a transparent image: the grey and
white "transparency" checkerboard was baked in as real pixels, and the file had
no alpha channel at all. Dropped straight onto the dark header it would have
shown a grid of grey squares. The script rebuilds the transparency:

- flood-fills the checkerboard inwards from the border,
- separately reclaims the backdrop walled inside the artwork — the counters of
  **O**, **a** and **g**, and the hollow of the star — which it identifies by
  those regions carrying *both* checkerboard tones, something no flat highlight
  in the artwork ever does,
- grades the anti-aliased rim so there is no grey fringe,
- trims the empty margin, and resizes with premultiplied alpha so edges do not
  halo.

If you can find the **original** logo file — a real transparent PNG, or better
an SVG — drop it in as `assets/img/source/logo.png` and re-run the script. It
will pass through cleanly and look sharper at large sizes.

The favicon is the comet-star cropped out of the logo (`STAR_BOX` in the
script), masked to just that shape so the **H** of TOUCH does not intrude.

If `logo.webp` is ever missing, the header and footer fall back to the
typographic "Magic Touch" wordmark instead of showing a broken image.

## Photos

The site loads small `.webp` files from `assets/img/`. They are generated from
the full-size originals in `assets/img/source/`, which stay out of the published
build — together the originals are about 13 MB, the generated set is 308 KB.

### Changing or adding a photo

1. Put the new full-size image in `assets/img/source/`.
2. Add or edit its row in the `JOBS` table in `tools/build-images.py` — source
   filename, output name, output size, and the crop centring as `(x, y)` where
   `0.5, 0.5` is a plain centre crop. Nudge those numbers if the crop cuts off
   the subject.
3. Run it (needs Python with Pillow):

   ```
   python tools/build-images.py
   ```

Any source that is much brighter or cooler than the warm dark palette can be
corrected on the way through — add it to the `TONE` table with a brightness,
saturation and warm-tint strength. `wellness-pedicure.webp` is the worked
example.

### Where each photo is used

| Section | Set in |
| --- | --- |
| Hero background | `index.html` — `.hero__image` |
| Massage thumbnails | `image:` on each entry in `MASSAGE_SERVICES` |
| Wellness cards | `image:` on each entry in `WELLNESS_SERVICES` |
| Experience panel | `index.html` — `.ritual-card__img` |

Setting a massage service's `image` to `null` falls back to an abstract gold
line-art tile drawn from its `glyph`, so the layout never breaks while you are
waiting on a photo.

## Design system

Colours, type and spacing are CSS custom properties at the top of
`assets/css/styles.css` (section 1). Changing `--gold`, `--bg` or
`--font-display` there updates the whole site.

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#0F0B08` | page background |
| `--surface` | `#1A1410` | cards and panels |
| `--gold` | `#D4A017` | accent, prices, CTAs |
| `--cream` | `#F4E9C6` | headings |

Type is Playfair Display (headings, prices) with Poppins (body), loaded from
Google Fonts.
