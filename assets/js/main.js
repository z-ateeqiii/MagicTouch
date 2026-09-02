/* =========================================================================
   Magic Touch — Behaviour
   Renders the data-driven sections, wires the booking link, mobile nav,
   scroll reveals and header state.
   ========================================================================= */

(function () {
  "use strict";

  /* ---------- 1 · render content ------------------------------------ */

  MT.render("categoryGrid", CATEGORIES, MT.categoryTile);
  MT.render("massageList", MASSAGE_SERVICES, MT.massageCard);
  MT.render("wellnessGrid", WELLNESS_SERVICES, MT.wellnessCard);
  MT.render("checklist", EXPERIENCE_POINTS, MT.checklistItem);

  /* ---------- 2 · booking + social links ---------------------------- */

  var bookingUrl = MT.whatsappUrl(BOOKING_MESSAGE);
  var bookingLinks = document.querySelectorAll("[data-contact-link]");
  for (var i = 0; i < bookingLinks.length; i++) {
    bookingLinks[i].href = bookingUrl;
    bookingLinks[i].target = "_blank";
    bookingLinks[i].rel = "noopener";
  }

  var phoneLinks = document.querySelectorAll("[data-phone-link]");
  for (var p = 0; p < phoneLinks.length; p++) {
    phoneLinks[p].href = "tel:+" + WHATSAPP_NUMBER;
    phoneLinks[p].textContent = WHATSAPP_DISPLAY;
  }

  var socialLinks = document.querySelectorAll("[data-facebook-link]");
  for (var f = 0; f < socialLinks.length; f++) {
    socialLinks[f].href = FACEBOOK_URL;
  }

  var creditNames = document.querySelectorAll("[data-credit-name]");
  for (var c = 0; c < creditNames.length; c++) {
    creditNames[c].textContent = CREDIT_NAME;
  }

  var creditLinks = document.querySelectorAll("[data-credit-link]");
  for (var d = 0; d < creditLinks.length; d++) {
    creditLinks[d].href = "tel:+" + CREDIT_NUMBER;
    creditLinks[d].textContent = CREDIT_DISPLAY;
  }

  /* ---------- 3 · logo, with a typographic fallback ------------------ */

  /* If assets/img/logo.png is missing or fails to decode, drop back to the
     wordmark rather than showing a broken image. */
  var logos = document.querySelectorAll(".brand__logo");
  for (var l = 0; l < logos.length; l++) {
    (function (img) {
      function useWordmark() {
        var brand = img.closest(".brand");
        if (brand) brand.classList.remove("has-logo");
      }
      if (img.complete && img.naturalWidth === 0) useWordmark();
      img.addEventListener("error", useWordmark);
    })(logos[l]);
  }

  /* ---------- 4 · footer year --------------------------------------- */

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- 5 · mobile navigation --------------------------------- */

  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");

  function setNav(open) {
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(!document.body.classList.contains("nav-open"));
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setNav(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setNav(false);
    });
  }

  /* ---------- 6 · header elevation on scroll ------------------------ */

  var header = document.querySelector(".site-header");
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 7 · gentle reveal on scroll --------------------------- */

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealables = document.querySelectorAll(".reveal");

  if (reduced || !("IntersectionObserver" in window)) {
    for (var r = 0; r < revealables.length; r++) {
      revealables[r].classList.add("is-visible");
    }
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  /* Stagger siblings slightly so a section arrives as one calm movement. */
  var sections = document.querySelectorAll("section, footer");
  for (var s = 0; s < sections.length; s++) {
    var items = sections[s].querySelectorAll(".reveal");
    for (var n = 0; n < items.length; n++) {
      items[n].style.setProperty("--reveal-delay", Math.min(n, 4) * 70 + "ms");
      observer.observe(items[n]);
    }
  }
})();
