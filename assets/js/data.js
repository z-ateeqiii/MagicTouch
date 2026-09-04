/* =========================================================================
   Magic Touch — Site content
   -------------------------------------------------------------------------
   Everything editable lives in this file: contact link, services, prices.
   No markup here. Changing a price means changing one line.
   ========================================================================= */

/* -----------------------------------------------------------------
   CONTACT / BOOKING

   Two separate lines, both digits only, country code first, no "+".

   WHATSAPP_NUMBER — messaging only. Every booking button on the page
     points here: the hero, the nav, all ten service cards, the closing
     CTA and the footer. It is never offered as a "call" link.

   PHONE_NUMBER — voice calls. Used by the "or call" links and the
     footer's phone row.
   ----------------------------------------------------------------- */
var WHATSAPP_NUMBER  = "201017673725";
var WHATSAPP_DISPLAY = "+20 1017673725";

var PHONE_NUMBER  = "201016136187";
var PHONE_DISPLAY = "+20 1016136187";

/* Prefilled text for the general "book an appointment" buttons.
   Service cards build their own message from the service name. */
var BOOKING_MESSAGE = "Hello Magic Touch, I would like to book an appointment.";

/* -----------------------------------------------------------------
   SOCIAL
   ----------------------------------------------------------------- */
var FACEBOOK_URL = "https://www.facebook.com/p/Magic-touch-Dalia-Soliman-100064310432901/";

/* -----------------------------------------------------------------
   SITE CREDIT  (footer)
   ----------------------------------------------------------------- */
var CREDIT_NAME    = "Al-Ateeqi";
var CREDIT_NUMBER  = "201276364094";     // digits only, for the tel: link
var CREDIT_DISPLAY = "+20 1276364094";

/* -----------------------------------------------------------------
   SERVICE CATEGORIES  (section 02 — overview tiles)
   `icon` maps to a key in components.js -> ICONS
   ----------------------------------------------------------------- */
var CATEGORIES = [
  { name: "Massage Therapies",   icon: "massage",  href: "#massage"  },
  { name: "Steam Room & Scrub",  icon: "steam",    href: "#wellness" },
  { name: "Pedicure & Manicure", icon: "nails",    href: "#wellness" },
  { name: "Recovery & Relaxation", icon: "lotus",  href: "#massage"  }
];

/* -----------------------------------------------------------------
   MASSAGE SERVICES  (section 03)

   image: a square photo (240×240 is plenty — it renders at 88px).
          Set it to null to fall back to the abstract `glyph` visual,
          which stays available for any service without a photo.
   ----------------------------------------------------------------- */
var MASSAGE_SERVICES = [
  {
    name: "Shiatsu Acupressure",
    duration: "60 mins",
    price: "950 L.E.",
    glyph: "pressure",
    image: "assets/img/svc-shiatsu.webp",
    description: "An invigorating full body massage using Japanese techniques to activate the correct pressure points of chi, or life energy — reducing inflammation, tension and stiffness while stimulating the body."
  },
  {
    name: "Aromatherapy Massage",
    duration: "60 mins",
    price: "850 L.E.",
    glyph: "droplet",
    image: "assets/img/svc-aromatherapy.webp",
    description: "A blend of pure aromatic essential oils from flowers, fruits, herbs and sweet wood, combined with a rhythmic full body massage to induce relaxation, calm the nervous system and promote mental well-being."
  },
  {
    name: "Egyptian Massage",
    duration: "60 mins",
    price: "850 L.E.",
    glyph: "lotus",
    image: "assets/img/svc-egyptian.webp",
    description: "This ancient therapeutic technique combines soft tissue and muscle manipulation, warm kneading and sweeping strokes to relax inactive muscles and stimulate the lymphatic system, leaving the body refreshed and energised."
  },
  {
    name: "Swedish Oil Massage",
    duration: "60 mins",
    price: "850 L.E.",
    glyph: "wave",
    image: "assets/img/svc-swedish.webp",
    description: "A classic full body massage that releases tension, improves muscle tone, eases soreness and stimulates circulation — creating a lasting feeling of tranquillity and well-being."
  },
  {
    name: "Foot Reflexology",
    duration: "30 mins",
    price: "500 L.E.",
    glyph: "foot",
    image: "assets/img/svc-reflexology.webp",
    description: "An ancient pressure-point therapy designed to release blockages, relieve stress and restore balance throughout the body."
  },
  {
    name: "Anti Stress Massage",
    duration: "30 mins",
    price: "500 L.E.",
    glyph: "calm",
    image: "assets/img/svc-antistress.webp",
    description: "A focused massage designed to loosen tense muscles around the head, neck, shoulders and back."
  }
];

/* -----------------------------------------------------------------
   WELLNESS & BEAUTY SERVICES  (section 04)
   `image` is a 4:5 portrait photo; `note` is optional supporting text.
   ----------------------------------------------------------------- */
var WELLNESS_SERVICES = [
  {
    name: "Steam Room", price: "550 L.E.", note: null,
    image: "assets/img/wellness-steam.webp"
  },
  {
    name: "Scrubs", price: "450 L.E.", note: "Ask for more scrub",
    image: "assets/img/wellness-scrubs.webp"
  },
  {
    name: "Pedicure", price: "300 L.E.", note: null,
    image: "assets/img/wellness-pedicure.webp"
  },
  {
    name: "Manicure", price: "200 L.E.", note: null,
    image: "assets/img/wellness-manicure.webp"
  }
];

/* -----------------------------------------------------------------
   EXPERIENCE POINTS  (section 05)
   ----------------------------------------------------------------- */
var EXPERIENCE_POINTS = [
  "Calm, private and unhurried treatment rooms",
  "Natural oils and carefully chosen products",
  "Traditional techniques alongside modern therapy",
  "Every session tailored to how you feel that day",
  "Clear pricing — no surprises at the end"
];
