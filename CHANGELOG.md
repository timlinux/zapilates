# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Editorial content blocks** — new shortcodes (`lead`, `checklist`, `factsheet`,
  `quote`, `signoff`, `cta`, `disclaimer`) that recompose every page into scannable,
  on-brand chunks. All copy stays grounded in the original content.
- **Information architecture** — class pages nested under `/classes/` (with aliases
  for the old URLs) so they gain a parent, sibling ordering and nav visibility;
  grouped dropdown navigation (About · Classes · For Performers · Journal + a Book
  CTA) replacing the flat 10-item menu; breadcrumb wayfinding on every page; a
  regrouped footer mirroring the nav; and an empty-state for list pages.
- **Enquiry form** on the Contact page — composes a prefilled email in the visitor's
  mail client (no backend, no dependencies), with a plain mailto fallback.

### Changed

- Recomposed all page copy for flow and concision: unified first-person voice,
  British spelling, de-duplicated the Research and For-Singers pages, reframed
  testimonials and health claims responsibly, added a medical disclaimer, corrected
  terminology, and brought pricing/format parity to the class pages. Dated
  scaffolding removed (prices kept).
- The `figure` shortcode no longer renders an image that matches the page's
  hero (front-matter `image` or the `heroImage` fallback) — that photo already
  leads the page in the masthead, so it is never repeated in the body.

### Added

- **Per-page hero images** — every content page now leads with a full-bleed
  image masthead (gradient scrim + light title), rendered by a shared
  `page-hero` partial from each page's front-matter `image`. Pages without an
  image (e.g. tag pages) fall back to the site-wide `heroImage` — the same
  photo used on the home page, defined once in `hugo.toml`.
- **Peel mobile-menu reveal** — menu links fold down in 3D from the top edge in
  a staggered cascade (pure CSS, driven by the existing `.is-open` toggle).
- **Ember-glow CTAs** — a "flame-wrap"-inspired warm glow that breathes on hover
  with a single shine sweep, applied to the nav "Book · Enquire" button and the
  home hero / CTA-band buttons via a reusable `.cta-ember` class and `ember-cta`
  SCSS mixin. Both effects are pure CSS/vanilla-JS (no canvas, no npm) and are
  flattened under `prefers-reduced-motion`.

### Removed

- Duplicate "Pilates Bio" page (`content/bio.md`); biography consolidated into
  the single **About Marcelle** page (`content/about.md`).
- Old-site scraper `harvest-site.sh`.
- 14 unused images from `static/images/` carried over from the previous site.
- Singing-only documentation: the Audio Player user guide
  (`docs/docs/user/audio-player.md`).

### Changed

- Scrubbed all non-Pilates references from the mkdocs `docs/` tree — removed
  Classical Singing, OPUS SOBRIETATE audio, and Stripe e-commerce content; fixed
  identity strings, URLs, theme name (`zapilates-studio`), palette tokens, and
  typography (Fraunces / Inter / IBM Plex Mono) to match the live site.
- Updated `PACKAGES.md` and `SPECIFICATION.md` to reflect the Pilates-only scope.
- Fixed the `.exrc` project header to "Zapilates".
