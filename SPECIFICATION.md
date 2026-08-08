# Zapilates — Technical Specification

## Overview

Zapilates is a Hugo-powered static website for **Marcelle Sutton**, a Pilates instructor and researcher based in Lisbon and Marvão, Portugal.

The site presents:

- The Pilates method and the principles underlying it
- Marcelle's practice: private, group, barre and remedial classes
- Specialisms for singers, dancers, and musicians
- Marcelle's MMus (*cum laude*, Stellenbosch University) thesis on the influence of a Pilates warm-up on classical singers
- A journal of long-form writing on movement, breath and the nervous system

The predecessor site (cantolyrico.com — classical singing + pilates) was split into two: singing content moved to a separate cantolyrico.com Hugo project, and the pilates + research material is extracted here.

## Architecture

### Technology Stack

- **Static Site Generator**: Hugo 0.147+ (extended, dart-sass)
- **Styling**: SCSS compiled via Hugo Pipes
- **JavaScript**: Vanilla ES6+ (no frameworks)
- **Fonts**: Fraunces (variable serif, opsz + SOFT), Inter, IBM Plex Mono (Google Fonts)
- **Packaging**: Nix flake — reproducible build as a Nix derivation
- **Serving**: NixOS module (`services.zapilates`) driving nginx
- **TLS**: Let's Encrypt via `security.acme`

### URL structure (flat)

All primary pages live at the site root — the entire site is pilates, so nested prefixes would be redundant.

```
/                       Home
/about/                 About Marcelle
/about-pilates/         The Method
/bio/                   Movement specialist
/classes/               Classes landing
/private/               Private sessions
/group/                 Group classes
/barre/                 Pilates barre
/remedial/              Remedial pilates
/for-singers/           Specialism
/for-dancers/           Specialism
/workshops/             Workshops archive (section)
/thesis/                MMus research
/studio/                Studio + gallery
/blog/                  Journal (section)
/contact/               Contact
/tags/<tag>/            Tag pages
```

### Directory Structure

```
zapilates.com/
├── content/                      # Markdown content
├── themes/zapilates-studio/      # Custom Hugo theme
│   ├── layouts/
│   │   ├── _default/             # baseof, single, list
│   │   ├── partials/             # header, footer
│   │   ├── shortcodes/           # figure, youtube
│   │   └── index.html            # Home
│   ├── assets/
│   │   ├── scss/main.scss        # Design system
│   │   └── js/main.js            # UI JS
│   └── theme.toml
├── static/                       # Images (and any other static assets)
├── nix/
│   ├── site.nix                  # Nix derivation for the built site
│   └── module.nix                # NixOS module
├── flake.nix
├── hugo.toml
├── SPECIFICATION.md              # this file
├── PACKAGES.md
└── PROMPT.log
```

## Design system (Zapilates Studio theme)

**Design intent** — editorial, movement-forward, quiet. Inspired by STOTT / Merrithew, Balanced Body and boutique studio brands. Never generic wellness.

### Palette

| Token             | Value    | Purpose                                       |
| ----------------- | -------- | --------------------------------------------- |
| `--ink`           | `#1a1a1c`| Text; footer + CTA background                 |
| `--ink-soft`      | `#33323a`| Secondary text                                |
| `--ink-muted`     | `#6c6a72`| Metadata, eyebrows                            |
| `--mist`          | `#ded8cc`| Hairlines, borders                            |
| `--bone`          | `#f4efe6`| Primary paper background                      |
| `--bone-deep`     | `#e8dfcd`| Band variation                                |
| `--bone-light`    | `#faf7f0`| Lightest band variation                       |
| `--sage`          | `#6f7d5e`| Sparingly — accent number 2                   |
| `--rust`          | `#b1583a`| Primary accent — CTAs, italic display accents |
| `--rust-deep`     | `#862f14`| Hover state                                   |

### Typography

- **Display**: `Fraunces` (variable serif) — headings and italic accent phrases; uses `opsz` and `SOFT` axes for optical size + weight interplay.
- **Body & UI**: `Inter` — long-form prose, buttons, nav.
- **Metadata**: `IBM Plex Mono` — eyebrow labels, dates, stamp elements.

### Motion

- Sticky header with shadow on scroll
- Full-bleed hero image with subtle 24-second ken-burns loop
- Horizontally-scrolling principles marquee ("Breathe · Centre · Precision · Control · Concentration · Flow")
- Reveal-on-scroll fades for section-level content
- Class cards invert on hover (bone → ink)

### Accessibility

- Skip-to-content link
- Semantic landmarks (`header`, `main`, `footer`, `nav`)
- Focus-visible outlines preserved
- `prefers-reduced-motion` respected: marquee, ken-burns, and reveal fades are suppressed
- Text contrast ≥ WCAG AA on ink/bone
- Meaningful `alt` attributes on all imagery

## Content sources

- **Marcelle's biography, class copy, and testimonials** — carried forward from the previous cantolyrico.com Hugo project (pilates section)
- **About Pilates (The Method) and "Pilates for Stress" blog post** — extracted from the archived Squarespace mirror in `cantolyrico-mirror/` (a gitignored, local-only migration source). Marcelle's biography is consolidated into the single **About Marcelle** page (`content/about.md`); the earlier duplicate "Pilates Bio" page was removed.
- **Thesis material** — extracted from `cantolyrico-mirror/cantolyrico.com/performances/2019/9/6/mmus-pending.html`
- **Workshop pages** — reconstructed from the previous performances markdown files with pilates tag

## Build & deploy

### Local build

```bash
nix develop
hugo --minify
```

Output: `./public/` (46 pages at the time of writing).

### Nix package

```bash
nix build
```

Output: `./result/` (a Nix-store symlink to the built site).

### NixOS deployment

Consume the flake as an input in a NixOS `flake.nix`, import `zapilates.nixosModules.default`, and enable `services.zapilates`. See `README.md` for the full recipe.

## Testing

Manual acceptance criteria (Golden path):

- [ ] Homepage loads with hero, marquee, stats, split-intro, class grid, specialisms, thesis callout, testimonials, journal preview, and CTA band
- [ ] All main-menu items resolve to a rendered page
- [ ] Journal (`/blog/`) and Workshops (`/workshops/`) list pages surface all their children
- [ ] The blog post `/blog/pilates-for-stress/` embeds the YouTube demo via the `youtube` shortcode
- [ ] Mobile menu opens / closes; Escape closes it
- [ ] Reduced-motion preference disables marquee and ken-burns
- [ ] All images have `alt` text
