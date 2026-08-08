// Zapilates Studio — theme JS
// -----------------------------
// Sticky header shadow, mobile menu toggle, reveal-on-scroll, marquee doubling,
// external-link safety, smooth anchors. No dependencies.

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("[data-header]");
    if (header) {
      const onScroll = () => {
        header.classList.toggle("is-scrolled", window.scrollY > 8);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    const toggle = document.querySelector("[data-nav-toggle]");
    const mobile = document.querySelector("[data-nav-mobile]");
    if (toggle && mobile) {
      toggle.addEventListener("click", () => {
        const open = mobile.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });

      mobile.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
          mobile.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && mobile.classList.contains("is-open")) {
          mobile.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.focus();
        }
      });
    }

    // Desktop grouped dropdowns — keyboard/touch support + aria-expanded.
    const coarse = window.matchMedia("(hover: none)").matches;
    document.querySelectorAll(".has-dropdown").forEach((dd) => {
      const link = dd.querySelector(".nav-parent");
      if (!link) return;
      link.setAttribute("aria-expanded", "false");

      if (coarse) {
        link.addEventListener("click", (e) => {
          if (dd.classList.contains("is-open")) return; // second tap follows the link
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

    const reveals = document.querySelectorAll(".reveal");
    if (reveals.length && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -80px 0px", threshold: 0.05 }
      );
      reveals.forEach((el) => io.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add("is-visible"));
    }

    // Marquee — duplicate content once for a seamless loop
    document.querySelectorAll(".marquee-track").forEach((track) => {
      if (track.dataset.doubled) return;
      track.dataset.doubled = "1";
      track.innerHTML += track.innerHTML;
    });

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

    // Enquiry form — compose a prefilled email in the visitor's mail client.
    // No backend required; degrades to the plain mailto link shown below it.
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
        if (!enquiry.reportValidity()) return; // native required-field validation
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

    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      const href = a.getAttribute("href");
      if (!href || href === "#" || href === "#!") return;

      a.addEventListener("click", (e) => {
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const headerH = header ? header.offsetHeight : 0;
        const y =
          target.getBoundingClientRect().top +
          window.pageYOffset -
          headerH -
          16;
        window.scrollTo({ top: y, behavior: "smooth" });
        history.pushState(null, "", href);
      });
    });
  });
})();
