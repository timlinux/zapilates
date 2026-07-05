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
