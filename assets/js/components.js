/* =========================================================================
   Magic Touch — Components
   -------------------------------------------------------------------------
   Small, pure template functions. Each one turns a data object from
   data.js into markup. No data lives here.
   ========================================================================= */

var MT = (function () {
  "use strict";

  /* ---------- helpers ---------------------------------------------- */

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function svg(paths, box) {
    return '<svg viewBox="0 0 ' + (box || 24) + " " + (box || 24) +
           '" fill="none" aria-hidden="true" focusable="false">' + paths + "</svg>";
  }

  /* A wa.me link carrying a prefilled message. */
  function whatsappUrl(message) {
    return "https://wa.me/" + WHATSAPP_NUMBER +
           "?text=" + encodeURIComponent(message || BOOKING_MESSAGE);
  }

  /* "I want this one" — the message names the service, its duration and
     price, so the salon knows what is being asked for from the first line. */
  function serviceMessage(service) {
    var detail = service.duration
      ? service.duration + " — " + service.price
      : service.price;
    return "Hello Magic Touch, I would like to book the " +
           service.name + " (" + detail + "). Is there availability?";
  }

  var WHATSAPP_GLYPH =
    '<path d="M20 11.6a8 8 0 0 1-11.9 7L4 20l1.5-4A8 8 0 1 1 20 11.6Z" ' +
      'stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M9.3 9.1c.2-.6.4-.6.7-.6h.6c.2 0 .4 0 .6.5l.5 1.3c0 .2 0 .3-.2.5l-.4.4c-.1.1-.2.2-.1.4' +
      'a5 5 0 0 0 2.4 2c.2.1.3 0 .4-.1l.6-.6c.1-.2.3-.2.5-.1l1.3.6c.2.1.3.3.3.5 0 .8-.6 1.4-1.4 1.5' +
      '-3-.1-5.7-3-6-6.3Z" fill="currentColor"/>';

  /* The per-service booking action, shared by both card types. */
  function bookButton(service) {
    return (
      '<a class="book-link" href="' + esc(whatsappUrl(serviceMessage(service))) + '"' +
         ' target="_blank" rel="noopener"' +
         ' aria-label="Book ' + esc(service.name) + ' on WhatsApp">' +
        '<span class="book-link__icon">' + svg(WHATSAPP_GLYPH) + "</span>" +
        "<span>Book</span>" +
      "</a>"
    );
  }

  /* ---------- line icons (24 × 24, stroked) ------------------------- */

  var ICONS = {
    massage: svg(
      '<circle cx="12" cy="6.6" r="2.9"/>' +
      '<path d="M4.6 20.4c0-3.6 3.3-6.2 7.4-6.2s7.4 2.6 7.4 6.2"/>' +
      '<path d="M7.3 13.2 5.1 10.9M16.7 13.2l2.2-2.3"/>'
    ),
    steam: svg(
      '<path d="M5.7 11.4h12.6l-1 7.9a1.7 1.7 0 0 1-1.7 1.5H8.4a1.7 1.7 0 0 1-1.7-1.5l-1-7.9Z"/>' +
      '<path d="M4.3 11.4h15.4"/>' +
      '<path d="M9.4 8.1c0-1.2 1-1.4 1-2.5s-1-1.3-1-2.2M14.6 8.1c0-1.2 1-1.4 1-2.5s-1-1.3-1-2.2M12 8.4c0-1.1 1-1.3 1-2.4"/>'
    ),
    /* Nail polish bottle — reads instantly at 24px where a hand does not. */
    nails: svg(
      '<path d="M10.2 7.4h3.6v1.7l1.7 1.7c.4.4.6.9.6 1.5v6.3c0 .9-.7 1.6-1.6 1.6H9.5c-.9 0-1.6-.7-1.6-1.6v-6.3c0-.6.2-1.1.6-1.5l1.7-1.7V7.4Z"/>' +
      '<path d="M10.9 7.4V4.9c0-.7.6-1.3 1.3-1.3h.4c.7 0 1.3.6 1.3 1.3v2.5"/>' +
      '<path d="M7.9 13.6h8.2"/>' +
      '<path d="m19.4 3.6.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6.6-1.7Z"/>'
    ),
    lotus: svg(
      '<path d="M12 20.4c-3 0-5.4-2.2-5.4-5 0-3.3 2.7-6.2 5.4-8.6 2.7 2.4 5.4 5.3 5.4 8.6 0 2.8-2.4 5-5.4 5Z"/>' +
      '<path d="M12 20.4c-4.6 0-8.4-2.4-8.4-5.6 0-.9.3-1.8.9-2.5 2.6.3 4.9 1.5 6.5 3.4"/>' +
      '<path d="M12 20.4c4.6 0 8.4-2.4 8.4-5.6 0-.9-.3-1.8-.9-2.5-2.6.3-4.9 1.5-6.5 3.4"/>'
    ),
    check: svg(
      '<circle cx="12" cy="12" r="9"/><path d="m8.2 12.2 2.6 2.6 5-5.4"/>'
    )
  };

  /* ---------- abstract service visuals (stand in for photography) ---- */

  var GLYPHS = {
    pressure:
      '<path d="M16 6v11M24 3v14M32 6v11" opacity=".85"/>' +
      '<circle cx="24" cy="28" r="2.6" fill="currentColor" stroke="none"/>' +
      '<circle cx="24" cy="28" r="7.5" opacity=".8"/>' +
      '<circle cx="24" cy="28" r="12.5" opacity=".5"/>' +
      '<circle cx="24" cy="28" r="17.5" opacity=".25"/>',
    droplet:
      '<path d="M24 8c5 6.2 8.6 10.8 8.6 15.4A8.6 8.6 0 0 1 24 32a8.6 8.6 0 0 1-8.6-8.6C15.4 18.8 19 14.2 24 8Z"/>' +
      '<path d="M24 40c-6-1-9.6-4.6-10.6-10.6 6 1 9.6 4.6 10.6 10.6ZM24 40c6-1 9.6-4.6 10.6-10.6-6 1-9.6 4.6-10.6 10.6Z" opacity=".65"/>',
    lotus:
      '<path d="M24 40c-6 0-10.8-4.4-10.8-10 0-6.6 5.4-12.4 10.8-17.2C29.4 17.6 34.8 23.4 34.8 30c0 5.6-4.8 10-10.8 10Z"/>' +
      '<path d="M24 40c-9.2 0-16.8-4.8-16.8-11.2 0-1.8.6-3.6 1.8-5 5.2.6 9.8 3 13 6.8" opacity=".7"/>' +
      '<path d="M24 40c9.2 0 16.8-4.8 16.8-11.2 0-1.8-.6-3.6-1.8-5-5.2.6-9.8 3-13 6.8" opacity=".7"/>',
    wave:
      '<path d="M6 18c4.5-4 9-4 13.5 0s9 4 13.5 0 6.6-3.4 9 0"/>' +
      '<path d="M6 26c4.5-4 9-4 13.5 0s9 4 13.5 0 6.6-3.4 9 0" opacity=".7"/>' +
      '<path d="M6 34c4.5-4 9-4 13.5 0s9 4 13.5 0 6.6-3.4 9 0" opacity=".45"/>',
    foot:
      '<circle cx="16.2" cy="9.4" r="2.3" opacity=".85"/><circle cx="22" cy="6.8" r="2.1" opacity=".75"/>' +
      '<circle cx="27.4" cy="7.4" r="2" opacity=".65"/><circle cx="32" cy="10.6" r="1.8" opacity=".55"/>' +
      '<path d="M24 12.6c5.8 0 9.2 2.4 9.2 6 0 4.2-3.8 6.8-9.2 6.8s-9.2-2.6-9.2-6.8c0-3.6 3.4-6 9.2-6Z"/>' +
      '<ellipse cx="24" cy="35.8" rx="5.8" ry="7.2" opacity=".9"/>',
    calm:
      '<circle cx="24" cy="15" r="6.5"/>' +
      '<path d="M9 42c0-7.5 6.7-13.5 15-13.5S39 34.5 39 42"/>' +
      '<path d="M13.5 24.5C10.6 26 9 27.9 9 30M34.5 24.5c2.9 1.5 4.5 3.4 4.5 5.5" opacity=".6"/>'
  };

  /* The service photo, or a branded abstract tile for anything without one. */
  function serviceVisual(service) {
    if (service.image) {
      return '<img class="service-visual__img" src="' + esc(service.image) +
             '" alt="" loading="lazy" decoding="async" width="240" height="240">';
    }
    var glyph = GLYPHS[service.glyph] || GLYPHS.lotus;
    return '<span class="service-visual__art">' + svg(glyph, 48) + "</span>";
  }

  /* ---------- templates -------------------------------------------- */

  function categoryTile(category) {
    return (
      '<li class="category">' +
        '<a class="category__link" href="' + esc(category.href) + '">' +
          '<span class="category__icon">' + (ICONS[category.icon] || "") + "</span>" +
          '<span class="category__name">' + esc(category.name) + "</span>" +
        "</a>" +
      "</li>"
    );
  }

  /* Children are laid out by CSS grid-areas, so they stay direct siblings —
     that is what lets the row recompose between mobile and desktop. */
  function massageCard(service, index) {
    return (
      '<li class="massage-item">' +
        '<div class="service-visual" data-variant="' + (index % 3) + '">' +
          serviceVisual(service) +
        "</div>" +
        '<h3 class="massage-item__name">' + esc(service.name) + "</h3>" +
        '<div class="massage-item__meta">' +
          '<span class="duration">' + esc(service.duration) + "</span>" +
          '<span class="price">' + esc(service.price) + "</span>" +
          bookButton(service) +
        "</div>" +
        '<p class="massage-item__desc">' + esc(service.description) + "</p>" +
      "</li>"
    );
  }

  function wellnessCard(service) {
    return (
      '<li class="wellness-card">' +
        '<div class="wellness-card__media">' +
          '<img src="' + esc(service.image) + '" alt="" loading="lazy" ' +
               'decoding="async" width="640" height="800">' +
        "</div>" +
        '<div class="wellness-card__body">' +
          '<h3 class="wellness-card__name">' + esc(service.name) + "</h3>" +
          '<p class="price price--block">' + esc(service.price) + "</p>" +
          (service.note ? '<p class="wellness-card__note">' + esc(service.note) + "</p>" : "") +
          bookButton(service) +
        "</div>" +
      "</li>"
    );
  }

  function checklistItem(text) {
    return (
      '<li class="checklist__item">' +
        '<span class="checklist__icon">' + ICONS.check + "</span>" +
        "<span>" + esc(text) + "</span>" +
      "</li>"
    );
  }

  /* ---------- mount ------------------------------------------------- */

  function render(target, items, template) {
    var node = document.getElementById(target);
    if (!node) return;
    node.innerHTML = items.map(template).join("");
  }

  return {
    render: render,
    whatsappUrl: whatsappUrl,
    categoryTile: categoryTile,
    massageCard: massageCard,
    wellnessCard: wellnessCard,
    checklistItem: checklistItem
  };
})();
