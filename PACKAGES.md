# Zapilates — Package Documentation

This document provides an annotated list of all packages and dependencies in the
Zapilates software architecture.

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

The custom `zapilates-studio` theme uses:

### Google Fonts (CDN)

- **Fraunces** - Variable serif (optical size + SOFT axes) for display
- **Inter** - Clean sans-serif for UI and body text
- **IBM Plex Mono** - Monospace for metadata and indices

### CSS

- **SCSS** - Compiled via Hugo Pipes with Dart Sass
- Custom design system with tokens for colours, spacing, typography

### JavaScript

- Vanilla ES6+ (no external dependencies)
- Features: sticky-header shadow, mobile navigation toggle, reveal-on-scroll,
  marquee doubling, external-link safety, smooth-scroll anchors

## External Services

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

### Images

Located in `static/images/`:

- Site favicon
- Studio and class photography
- Marcelle profile images

---

Made with 💗 by [Kartoza](https://kartoza.com) |
[Donate!](https://github.com/sponsors/timlinux) |
[GitHub](https://github.com/timlinux/zapilates)
