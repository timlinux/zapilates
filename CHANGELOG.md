# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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
