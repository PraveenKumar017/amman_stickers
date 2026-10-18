/* ============================================
   Amman Stickers — Main JavaScript
   ============================================ */

(function () {
  "use strict";

  var WHATSAPP_NUMBER = "919750602334";
  var DEFAULT_WA_MESSAGE = "Hello Amman Stickers, I would like to enquire about custom sticker printing.";

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector(".site-header");

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.getElementById("nav-toggle");
  var siteNav = document.getElementById("site-nav");

  function closeNav() {
    if (!navToggle || !siteNav) return;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    siteNav.classList.remove("is-open");
  }

  function openNav() {
    if (!navToggle || !siteNav) return;
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    siteNav.classList.add("is-open");
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    siteNav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        closeNav();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeNav();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) {
        closeNav();
      }
    });
  }

  /* ---------- Portfolio filtering ---------- */
  var filterButtons = document.querySelectorAll(".filter-btn");
  var workItems = document.querySelectorAll(".work-item");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.getAttribute("data-filter");

      filterButtons.forEach(function (btn) {
        btn.classList.remove("is-active");
        btn.setAttribute("aria-pressed", "false");
      });
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");

      workItems.forEach(function (item) {
        var category = item.getAttribute("data-category");
        var show = filter === "all" || category === filter;
        item.classList.toggle("is-hidden", !show);
      });
    });
  });

  filterButtons.forEach(function (button) {
    button.setAttribute("aria-pressed", button.classList.contains("is-active") ? "true" : "false");
  });

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCaption = document.getElementById("lightbox-caption");
  var lightboxClose = document.getElementById("lightbox-close");
  var lightboxPrev = document.getElementById("lightbox-prev");
  var lightboxNext = document.getElementById("lightbox-next");
  var workOpenButtons = Array.prototype.slice.call(document.querySelectorAll(".work-open"));
  var lastFocused = null;

  function getVisibleItems() {
    return workOpenButtons.filter(function (btn) {
      var item = btn.closest(".work-item");
      return item && !item.classList.contains("is-hidden");
    });
  }

  function currentIndex() {
    var visible = getVisibleItems();
    return visible.indexOf(document.activeElement) !== -1
      ? visible.indexOf(document.activeElement)
      : 0;
  }

  function showInLightbox(button) {
    if (!lightbox || !lightboxImg) return;

    var full = button.getAttribute("data-full") || "";
    var alt = button.getAttribute("data-alt") || "";
    var captionEl = button.closest(".work-item");
    var titleEl = captionEl ? captionEl.querySelector(".work-title") : null;
    var figEl = captionEl ? captionEl.querySelector("figcaption") : null;
    var caption = titleEl
      ? titleEl.textContent
      : (figEl ? figEl.textContent : alt);

    lightboxImg.src = full;
    lightboxImg.alt = alt;
    if (lightboxCaption) lightboxCaption.textContent = caption;

    lastFocused = button;
    lightbox.hidden = false;
    // force reflow so the transition runs
    void lightbox.offsetWidth;
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";

    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";

    window.setTimeout(function () {
      lightbox.hidden = true;
      lightboxImg.src = "";
      lightboxImg.alt = "";
    }, 250);

    if (lastFocused) lastFocused.focus();
  }

  function stepLightbox(direction) {
    var visible = getVisibleItems();
    if (!visible.length) return;

    var current = visible.indexOf(lastFocused);
    if (current === -1) current = 0;

    var next = (current + direction + visible.length) % visible.length;
    showInLightbox(visible[next]);
  }

  workOpenButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      showInLightbox(button);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", function () {
      stepLightbox(-1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", function () {
      stepLightbox(1);
    });
  }

  if (lightbox) {
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (!lightbox || lightbox.hidden) return;

    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      stepLightbox(-1);
    } else if (event.key === "ArrowRight") {
      stepLightbox(1);
    }
  });

  /* ---------- Enquiry form → WhatsApp ---------- */
  var form = document.getElementById("enquiry-form");

  function setFieldError(input, errorEl, hasError) {
    input.classList.toggle("is-invalid", hasError);
    if (errorEl) errorEl.hidden = !hasError;
    input.setAttribute("aria-invalid", hasError ? "true" : "false");
  }

  function buildWhatsAppUrl(message) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var nameInput = document.getElementById("ef-name");
      var phoneInput = document.getElementById("ef-phone");
      var serviceInput = document.getElementById("ef-service");
      var messageInput = document.getElementById("ef-message");

      var nameError = document.getElementById("ef-name-error");
      var phoneError = document.getElementById("ef-phone-error");
      var serviceError = document.getElementById("ef-service-error");

      var name = nameInput.value.trim();
      var phone = phoneInput.value.replace(/\D/g, "");
      var service = serviceInput.value;
      var extra = messageInput ? messageInput.value.trim() : "";

      var nameInvalid = name.length < 2;
      var phoneInvalid = phone.length < 10 || phone.length > 13;
      var serviceInvalid = !service;

      setFieldError(nameInput, nameError, nameInvalid);
      setFieldError(phoneInput, phoneError, phoneInvalid);
      setFieldError(serviceInput, serviceError, serviceInvalid);

      if (nameInvalid || phoneInvalid || serviceInvalid) {
        var firstInvalid = form.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var lines = [
        "Hello Amman Stickers, I would like to enquire about " + service + ".",
        "",
        "Name: " + name,
        "Phone: " + phone
      ];

      if (extra) {
        lines.push("Message: " + extra);
      }

      var url = buildWhatsAppUrl(lines.join("\n"));
      window.open(url, "_blank", "noopener,noreferrer");
    });

    // Clear error state as the user fixes fields
    form.addEventListener(
      "input",
      function (event) {
        var target = event.target;
        if (target.classList.contains("is-invalid")) {
          var errorEl = document.getElementById(target.id + "-error");
          var nowValid = true;

          if (target.id === "ef-name") {
            nowValid = target.value.trim().length >= 2;
          } else if (target.id === "ef-phone") {
            var digits = target.value.replace(/\D/g, "");
            nowValid = digits.length >= 10 && digits.length <= 13;
          } else if (target.id === "ef-service") {
            nowValid = !!target.value;
          }

          if (nowValid) {
            setFieldError(target, errorEl, false);
          }
        }
      },
      true
    );

    // Select fires "change" reliably (and "input" on modern browsers)
    form.addEventListener("change", function (event) {
      var target = event.target;
      if (target.id === "ef-service" && target.classList.contains("is-invalid") && target.value) {
        setFieldError(target, document.getElementById("ef-service-error"), false);
      }
    });
  }

  /* ---------- Update static WhatsApp links with encoded default message ---------- */
  var defaultWaUrl = buildWhatsAppUrl(DEFAULT_WA_MESSAGE);
  document.querySelectorAll('a[href*="wa.me"]').forEach(function (link) {
    // Keep form-generated links alone; only fix the default-message links
    if (link.getAttribute("href").indexOf("text=Hello%20Amman%20Stickers") !== -1) {
      link.setAttribute("href", defaultWaUrl);
    }
  });

  /* ---------- Dynamic copyright year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );

      revealEls.forEach(function (el) {
        observer.observe(el);
      });
    }
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();
