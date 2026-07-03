# Theme Development

## Theme Structure

```
themes/cantolyrico-warm/
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
│       ├── audio-player.html
│       ├── youtube.html
│       └── stripe-buy.html
└── assets/
    ├── scss/
    │   └── main.scss
    └── js/
        └── main.js
```

## Design System

### Colors

```scss
$terracotta: #C67C4E;    // Primary
$warm-cream: #FAF3E3;    // Background
$soft-gold: #D4A853;     // Accent
$deep-burgundy: #6B2D3C; // Secondary
$sage-green: #8B9A71;    // Pilates accent
$warm-gray: #6B6257;     // Text
```

### Typography

- Headings: Cormorant Garamond
- Body: Source Sans 3
- Accents: Libre Baskerville

### Spacing Scale

```scss
$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 1.5rem;
$spacing-xl: 2rem;
$spacing-2xl: 3rem;
```

## Adding Styles

Edit `assets/scss/main.scss` and Hugo will automatically recompile.

## Adding JavaScript

Edit `assets/js/main.js`. The file is minified during build.
