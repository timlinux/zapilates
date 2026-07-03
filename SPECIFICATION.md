# Canto Lyrico - Technical Specification

## Overview

Canto Lyrico is a Hugo-powered static website for Marcelle Volckaert, serving as
both a classical singer portfolio and Pilates studio presence.

## Architecture

### Technology Stack

- **Static Site Generator**: Hugo (v0.121+)
- **Styling**: SCSS (compiled via Hugo Pipes)
- **JavaScript**: Vanilla ES6+ (no frameworks)
- **Hosting**: GitHub Pages / Netlify
- **E-commerce**: Stripe Checkout (via Netlify Functions)
- **Documentation**: MkDocs with Material theme

### Directory Structure

```
cantolyrico.com/
├── archetypes/           # Hugo content archetypes
├── content/              # Markdown content
│   ├── _index.md         # Home page
│   ├── about.md          # About Marcelle
│   ├── contact.md        # Contact page
│   ├── singing/          # Classical singing section
│   │   ├── _index.md
│   │   ├── music.md      # Audio player page
│   │   ├── videos/       # Video content
│   │   └── performances/ # Performance archive (by year)
│   ├── pilates/          # Pilates section
│   │   ├── _index.md
│   │   ├── bio.md
│   │   ├── studio.md
│   │   ├── for-singers.md
│   │   ├── for-dancers.md
│   │   └── services/
│   │       ├── private.md
│   │       ├── group.md
│   │       ├── barre.md
│   │       └── remedial.md
│   └── products/         # E-commerce products
├── themes/
│   └── cantolyrico-warm/ # Custom theme
│       ├── layouts/
│       │   ├── _default/
│       │   │   ├── baseof.html
│       │   │   ├── single.html
│       │   │   └── list.html
│       │   ├── index.html
│       │   ├── partials/
│       │   │   ├── header.html
│       │   │   └── footer.html
│       │   └── shortcodes/
│       │       ├── audio-player.html
│       │       ├── youtube.html
│       │       └── stripe-buy.html
│       └── assets/
│           ├── scss/main.scss
│           └── js/main.js
├── static/
│   ├── audio/            # MP3 files
│   └── images/           # Image assets
├── scripts/
│   └── migrate.py        # Content migration script
├── docs/                 # MkDocs documentation
├── netlify/functions/    # Serverless functions
└── .github/workflows/    # CI/CD
```

## User Stories

### US-001: View Performance History

**As a** visitor interested in classical singing,
**I want to** browse Marcelle's performance history,
**So that** I can learn about her experience and repertoire.

**Acceptance Criteria:**

- Performances are organized by year
- Each performance shows date, venue, and description
- Filtering by tags/venues is available

### US-002: Listen to Recordings

**As a** music enthusiast,
**I want to** listen to Marcelle's recordings,
**So that** I can experience her vocal artistry.

**Acceptance Criteria:**

- Custom audio player with playlist support
- Play/pause, progress bar, time display
- Track selection from playlist
- Accessible controls

### US-003: Book Pilates Sessions

**As a** potential Pilates client,
**I want to** book a class online,
**So that** I can schedule my sessions conveniently.

**Acceptance Criteria:**

- Product/service listing with descriptions
- Stripe checkout integration
- Confirmation page after purchase

### US-004: Contact Marcelle

**As a** visitor,
**I want to** send a message to Marcelle,
**So that** I can inquire about performances or lessons.

**Acceptance Criteria:**

- Contact form with name, email, message
- Form validation
- Spam protection (honeypot/captcha)

### US-005: Mobile-First Experience

**As a** mobile user,
**I want to** navigate the site easily on my phone,
**So that** I have a good browsing experience.

**Acceptance Criteria:**

- Responsive layout at all breakpoints
- Sticky header
- Mobile navigation overlay
- Touch-friendly controls

## Functional Requirements

### FR-001: Navigation

- Main navigation with dropdown menus
- Mobile hamburger menu
- Breadcrumbs on inner pages
- Sticky header on scroll

### FR-002: Audio Player

- HTML5 audio with custom styling
- Playlist support via page front matter
- Progress bar (clickable to seek)
- Play/pause toggle
- Current time / duration display
- Track list with click-to-play

### FR-003: Performance Archive

- Taxonomies: years, venues, tags
- List view with pagination
- Individual performance pages

### FR-004: E-commerce (Stripe)

- Product pages with buy buttons
- Netlify function for checkout session creation
- Redirect to Stripe Checkout
- Success/cancel pages

### FR-005: SEO & Performance

- Open Graph meta tags
- Twitter Card support
- Schema.org structured data
- Lazy loading images
- Minified CSS/JS
- Responsive images

## Design System

### Color Palette

| Name          | Hex       | Usage                      |
|---------------|-----------|----------------------------|
| Terracotta    | `#C67C4E` | Primary accent, CTAs       |
| Warm Cream    | `#FAF3E3` | Background                 |
| Soft Gold     | `#D4A853` | Highlights, icons          |
| Deep Burgundy | `#6B2D3C` | Headers, emphasis, footer  |
| Sage Green    | `#8B9A71` | Pilates section accent     |
| Warm Gray     | `#6B6257` | Body text                  |

### Typography

- **Headings**: Cormorant Garamond (400, 500, 600)
- **Body**: Source Sans 3 (300-700)
- **Accents**: Libre Baskerville (quotes, testimonials)

### Spacing Scale

- xs: 0.25rem
- sm: 0.5rem
- md: 1rem
- lg: 1.5rem
- xl: 2rem
- 2xl: 3rem
- 3xl: 4rem
- 4xl: 6rem

### Breakpoints

- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

## Testing Requirements

### Unit Tests

- Migration script tests (Python)

### Integration Tests

- Hugo build succeeds
- All pages render without errors
- Links are valid (no 404s)

### Manual Testing

- Audio player functionality
- Mobile responsiveness
- Stripe checkout flow (test mode)

## Deployment

### GitHub Pages

1. Push to `main` branch
2. GitHub Action builds site
3. Deploys to `gh-pages` branch

### Netlify (Alternative)

1. Connect repository
2. Build command: `hugo --minify`
3. Publish directory: `public`
4. Netlify Functions for Stripe

## Versioning

- Semantic versioning (MAJOR.MINOR.PATCH)
- Bugfix commits increment PATCH
- New features increment MINOR
- Breaking changes increment MAJOR

---

Made with 💗 by [Kartoza](https://kartoza.com) |
[Donate!](https://github.com/sponsors/timlinux) |
[GitHub](https://github.com/timlinux/cantolyrico.com)
