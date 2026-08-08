// Zapilates Studio — theme JS
// -----------------------------
// A small, dependency-free motion system: sticky/auto-hiding header, scroll
// progress, staggered scroll reveals, count-up stats, cursor-spotlight cards,
// magnetic buttons, hero parallax, grouped nav, mobile peel menu, enquiry form,
// external-link safety and smooth anchors. Everything degrades under
// prefers-reduced-motion and on coarse/no-hover pointers.

(function () {
  "use strict";

  const mq = (q) => window.matchMedia(q).matches;
  const REDUCE = mq("(prefers-reduced-motion: reduce)");
  const FINE_HOVER = mq("(hover: hover) and (pointer: fine)");

  document.addEventListener("DOMContentLoaded", () => {
    /* ---------------------------------------------------------------------
     * Consolidated scroll engine — header state, progress bar, hero parallax.
     * One rAF-throttled listener drives them all.
     * ------------------------------------------------------------------- */
    const header = document.querySelector("[data-header]");
    const progress = document.querySelector("[data-scroll-progress]");
    const heroMedia = document.querySelector(".hero-media");
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      const y = window.scrollY;

      if (header) {
        header.classList.toggle("is-scrolled", y > 8);
        // Auto-hide when scrolling down (past the hero), reveal when scrolling up.
        if (y > 240 && y > lastY + 4) header.classList.add("is-hidden");
        else if (y < lastY - 4 || y < 240) header.classList.remove("is-hidden");
      }

      if (progress) {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
      }

      if (heroMedia && !REDUCE && y < window.innerHeight) {
        heroMedia.style.transform = "translateY(" + y * 0.18 + "px)";
      }

      lastY = y;
      ticking = false;
    };

    const requestScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener("scroll", requestScroll, { passive: true });

    // Keyboard focus must always bring the auto-hidden header back into view.
    if (header) header.addEventListener("focusin", () => header.classList.remove("is-hidden"));

    /* ---------------------------------------------------------------------
     * Mobile peel menu
     * ------------------------------------------------------------------- */
    const toggle = document.querySelector("[data-nav-toggle]");
    const mobile = document.querySelector("[data-nav-mobile]");
    if (toggle && mobile) {
      // When closed, take the whole menu out of the tab order / a11y tree.
      const setOpen = (open) => {
        mobile.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) mobile.removeAttribute("inert");
        else mobile.setAttribute("inert", "");
      };
      setOpen(false);
      toggle.addEventListener("click", () => setOpen(!mobile.classList.contains("is-open")));
      mobile.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && mobile.classList.contains("is-open")) {
          setOpen(false);
          toggle.focus();
        }
      });
    }

    /* ---------------------------------------------------------------------
     * Grouped desktop dropdowns — touch + keyboard, aria-expanded
     * ------------------------------------------------------------------- */
    const coarse = mq("(hover: none)");
    document.querySelectorAll(".has-dropdown").forEach((dd) => {
      const link = dd.querySelector(".nav-parent");
      if (!link) return;
      link.setAttribute("aria-expanded", "false");
      if (coarse) {
        link.addEventListener("click", (e) => {
          if (dd.classList.contains("is-open")) return;
          e.preventDefault();
          document.querySelectorAll(".has-dropdown.is-open").forEach((o) => {
            if (o !== dd) {
              o.classList.remove("is-open");
              const l = o.querySelector(".nav-parent");
              if (l) l.setAttribute("aria-expanded", "false");
            }
          });
          dd.classList.add("is-open");
          link.setAttribute("aria-expanded", "true");
        });
      }
      dd.addEventListener("focusin", () => link.setAttribute("aria-expanded", "true"));
      dd.addEventListener("focusout", () => {
        if (!dd.contains(document.activeElement)) {
          dd.classList.remove("is-open");
          link.setAttribute("aria-expanded", "false");
        }
      });
    });

    /* ---------------------------------------------------------------------
     * Scroll reveals — per-group stagger via transition-delay
     * ------------------------------------------------------------------- */
    const reveals = document.querySelectorAll(".reveal");
    if (REDUCE || !("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("is-visible"));
    } else {
      const groups = new Map();
      reveals.forEach((el) => {
        const key = el.closest("[data-reveal-group]") || el.parentElement;
        const arr = groups.get(key) || [];
        arr.push(el);
        groups.set(key, arr);
      });
      groups.forEach((arr) =>
        arr.forEach((el, i) => {
          el.style.transitionDelay = Math.min(i, 8) * 90 + "ms";
        })
      );
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -80px 0px", threshold: 0.08 }
      );
      reveals.forEach((el) => io.observe(el));
    }

    /* ---------------------------------------------------------------------
     * Count-up stats — animates a numeric prefix, keeps any suffix (e.g. +)
     * ------------------------------------------------------------------- */
    document.querySelectorAll("[data-count]").forEach((el) => {
      const raw = el.getAttribute("data-count");
      const target = parseFloat(raw);
      if (isNaN(target)) return;
      const suffix = raw.replace(/[0-9.,\s]/g, "");
      if (REDUCE || !("IntersectionObserver" in window)) {
        el.textContent = raw;
        return;
      }
      el.textContent = "0" + suffix;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const dur = 1400;
            let t0 = null;
            const tick = (t) => {
              if (t0 === null) t0 = t;
              const p = Math.min(1, (t - t0) / dur);
              const eased = 1 - Math.pow(1 - p, 3);
              el.textContent = Math.round(target * eased) + suffix;
              if (p < 1) window.requestAnimationFrame(tick);
              else el.textContent = raw;
            };
            window.requestAnimationFrame(tick);
            io.unobserve(entry.target);
          });
        },
        { threshold: 0.6 }
      );
      io.observe(el);
    });

    /* ---------------------------------------------------------------------
     * Cursor spotlight — cards track the pointer via --mx / --my
     * ------------------------------------------------------------------- */
    if (!REDUCE && FINE_HOVER) {
      document.querySelectorAll(".specialism, .list-card").forEach((card) => {
        card.addEventListener(
          "pointermove",
          (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
            card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
          },
          { passive: true }
        );
      });

      /* Magnetic buttons — gently pull toward the cursor */
      document.querySelectorAll("[data-magnetic]").forEach((btn) => {
        btn.addEventListener(
          "pointermove",
          (e) => {
            const r = btn.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width / 2) * 0.28;
            const y = (e.clientY - r.top - r.height / 2) * 0.28;
            btn.style.transform = "translate(" + x + "px," + y + "px)";
          },
          { passive: true }
        );
        btn.addEventListener("pointerleave", () => {
          btn.style.transform = "";
        });
      });
    }

    /* ---------------------------------------------------------------------
     * Marquee — duplicate content once for a seamless loop
     * ------------------------------------------------------------------- */
    document.querySelectorAll(".marquee-track").forEach((track) => {
      if (track.dataset.doubled) return;
      track.dataset.doubled = "1";
      track.innerHTML += track.innerHTML;
    });

    /* ---------------------------------------------------------------------
     * Enquiry form — compose a prefilled email; native validation + status
     * ------------------------------------------------------------------- */
    const enquiry = document.querySelector("[data-enquiry-form]");
    if (enquiry) {
      const params = new URLSearchParams(window.location.search);
      const preset = params.get("interest");
      const select = enquiry.querySelector('[name="interest"]');
      if (preset && select) {
        Array.from(select.options).forEach((o) => {
          if (o.value.toLowerCase() === preset.toLowerCase()) o.selected = true;
        });
      }
      const status = enquiry.querySelector("[data-enquiry-status]");
      enquiry.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!enquiry.reportValidity()) return;
        const data = new FormData(enquiry);
        const to = enquiry.getAttribute("data-email") || "marcelle@zapilates.com";
        const topic = (data.get("interest") || "General enquiry").toString();
        const body =
          "Name: " + (data.get("name") || "").toString().trim() + "\n" +
          "Email: " + (data.get("email") || "").toString().trim() + "\n" +
          "Interested in: " + topic + "\n\n" +
          (data.get("message") || "").toString().trim() + "\n";
        window.location.href =
          "mailto:" + to +
          "?subject=" + encodeURIComponent("Zapilates enquiry — " + topic) +
          "&body=" + encodeURIComponent(body);
        if (status) {
          status.textContent =
            "Opening your email app… if nothing happens, write to " + to + ".";
        }
      });
    }

    /* ---------------------------------------------------------------------
     * External-link safety
     * ------------------------------------------------------------------- */
    document.querySelectorAll('a[href^="http"]').forEach((a) => {
      try {
        const u = new URL(a.href);
        if (u.host && u.host !== window.location.host) {
          const rel = (a.getAttribute("rel") || "").split(/\s+/).filter(Boolean);
          if (!rel.includes("noopener")) rel.push("noopener");
          if (!rel.includes("noreferrer")) rel.push("noreferrer");
          a.setAttribute("rel", rel.join(" "));
        }
      } catch (_) {}
    });

    /* ---------------------------------------------------------------------
     * Smooth in-page anchors
     * ------------------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      const href = a.getAttribute("href");
      if (!href || href === "#" || href === "#!") return;
      a.addEventListener("click", (e) => {
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const headerH = header ? header.offsetHeight : 0;
        const y = target.getBoundingClientRect().top + window.pageYOffset - headerH - 16;
        window.scrollTo({ top: y, behavior: REDUCE ? "auto" : "smooth" });
        history.pushState(null, "", href);
        // Move keyboard focus to the target so it isn't left on the link.
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      });
    });
  });
})();
