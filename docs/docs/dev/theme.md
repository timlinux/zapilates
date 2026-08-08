# Theme Development

## Theme Structure

```
themes/zapilates-studio/
├── theme.toml          # Theme metadata
├── layouts/
│   ├── _default/
│   │   ├── baseof.html # Base template
│   │   ├── single.html # Single page
│   │   └── list.html   # List page
│   ├── index.html      # Home page
│   ├── partials/
│   │   ├── header.html
│   │   └── footer.html
│   └── shortcodes/
│       ├── figure.html
│       └── youtube.html
└── assets/
    ├── scss/
    │   └── main.scss
    └── js/
        └── main.js
```

## Design System

**Design intent** — editorial, movement-forward, quiet. Inspired by
STOTT / Merrithew, Balanced Body, and boutique studio brands.

### Colours (design tokens)

```scss
--ink:       #1a1a1c;  // Text; footer + CTA background
--ink-soft:  #33323a;  // Secondary text
--ink-muted: #6c6a72;  // Metadata, eyebrows
--mist:      #ded8cc;  // Hairlines, borders
--bone:      #f4efe6;  // Primary paper background
--bone-deep: #e8dfcd;  // Band variation
--sage:      #6f7d5e;  // Secondary accent
--rust:      #b1583a;  // Primary accent — CTAs, italic display accents
--rust-deep: #862f14;  // Hover state
```

### Typography

- **Display**: Fraunces (variable serif, `opsz` + `SOFT` axes)
- **Body & UI**: Inter
- **Metadata**: IBM Plex Mono

## Adding Styles

Edit `assets/scss/main.scss` and Hugo will automatically recompile via
Hugo Pipes (Dart Sass).

## Adding JavaScript

Edit `assets/js/main.js`. The file is minified during build.
