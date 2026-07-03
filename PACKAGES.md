# Canto Lyrico - Package Documentation

This document provides an annotated list of all packages and dependencies in the
Canto Lyrico software architecture.

## Nix Development Environment

Defined in `utils/develop.nix`, these packages are available in the development shell.

### Core Tools

| Package | Purpose |
|---------|---------|
| `git` | Version control |
| `gource` | Repository visualization |
| `ffmpeg` | Media processing (gource output) |

### TUI/CLI Tools

| Package | Purpose |
|---------|---------|
| `gum` | Interactive CLI components |
| `chafa` | Image to ASCII converter |

### Hugo & Web Development

| Package | Purpose |
|---------|---------|
| `hugo` | Static site generator |
| `nodejs_22` | JavaScript runtime (for npm scripts if needed) |

### Documentation

| Package | Purpose |
|---------|---------|
| `python312Packages.mkdocs` | Documentation site generator |
| `python312Packages.mkdocs-material` | Material theme for MkDocs |

### Code Quality & Linting

| Package | Purpose |
|---------|---------|
| `pre-commit` | Git hook framework |
| `nixfmt-rfc-style` | Nix code formatter |
| `bearer` | Security scanner |
| `shfmt` | Shell script formatter |
| `markdownlint-cli` | Markdown linting |
| `actionlint` | GitHub Actions linter |
| `shellcheck` | Shell script analyzer |
| `nodePackages.cspell` | Spell checker |

### Presentations & Servers

| Package | Purpose |
|---------|---------|
| `marp-cli` | Markdown presentation tool |
| `httplz` | Local HTTP server |

### Python (Migration Tools)

| Package | Purpose |
|---------|---------|
| `python312` | Python runtime |
| `python312Packages.beautifulsoup4` | HTML parsing |
| `python312Packages.html2text` | HTML to Markdown conversion |
| `python312Packages.pyyaml` | YAML processing |

## Hugo Theme Dependencies

The custom `cantolyrico-warm` theme uses:

### Google Fonts (CDN)

- **Cormorant Garamond** - Elegant serif for headings
- **Source Sans 3** - Clean sans-serif for body text
- **Libre Baskerville** - Classic serif for quotes/accents

### CSS

- **SCSS** - Compiled via Hugo Pipes with Dart Sass
- Custom design system with tokens for colors, spacing, typography

### JavaScript

- Vanilla ES6+ (no external dependencies)
- Features: mobile navigation, audio player, lazy loading

## External Services

### Stripe (E-commerce)

- Stripe Checkout for payment processing
- Requires Netlify Functions (or similar) for server-side session creation

### GitHub

- Repository hosting
- GitHub Actions for CI/CD
- GitHub Pages for deployment
- GitHub Sponsors for donations

## Build Dependencies

### Hugo Modules

None currently - using embedded assets.

### Node.js (Optional)

If npm scripts are needed:

```json
{
  "devDependencies": {
    "sass": "^1.69.0"
  }
}
```

## CDN Resources

| Resource | Source | Usage |
|----------|--------|-------|
| Google Fonts | fonts.googleapis.com | Typography |

## File Assets

### Audio Files

Located in `static/audio/`:

- `01-with-darkness-deep.mp3` - Opus Sobrietate track 1
- `02-cujus-animam-gementem.mp3` - Opus Sobrietate track 2
- `03-il-mio-ben-quando-verra.mp3` - Opus Sobrietate track 3
- `04-giusto-ciel-in-tal-periglio.mp3` - Opus Sobrietate track 4
- `05-nana.mp3` - Opus Sobrietate track 5
- `06-oblivion-soave.mp3` - Opus Sobrietate track 6
- `07-che-si-puo-fare.mp3` - Opus Sobrietate track 7
- `08-asturiana.mp3` - Opus Sobrietate track 8
- `sonvanger-voice-and-cello.mp3` - Meermin Meerlig collaboration

### Images

Located in `static/images/`:

- Site favicon
- Performance photos
- Profile images

---

Made with 💗 by [Kartoza](https://kartoza.com) |
[Donate!](https://github.com/sponsors/timlinux) |
[GitHub](https://github.com/timlinux/cantolyrico.com)
