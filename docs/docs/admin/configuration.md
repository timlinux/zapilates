# Configuration

## Hugo Configuration

The main configuration is in `hugo.toml`.

### Site Settings

```toml
baseURL = "https://zapilates.com/"
languageCode = "en"
title = "Zapilates"
theme = "zapilates-studio"
```

### Parameters

```toml
[params]
  tagline = "Pilates with Marcelle Sutton"
  description = "..."
  author = "Marcelle Sutton"
  location = "Lisbon & Marvão, Portugal"
  email = "marcelle@zapilates.com"

  # Stats strip (shown on home page)
  yearsTeaching = "20+"
  continents = "3"
  languages = "3"

  # Social
  instagram = "go_well_with_marcelle"
```

### Menu

Edit the `[menu]` section to modify navigation.

## Theme Configuration

Theme files are in `themes/zapilates-studio/`.

### Colours

Edit `assets/scss/main.scss` to change colours. The palette is defined as
CSS custom properties (design tokens):

```scss
--ink:    #1a1a1c;  // Text; footer + CTA background
--mist:   #ded8cc;  // Hairlines, borders
--bone:   #f4efe6;  // Primary paper background
--sage:   #6f7d5e;  // Secondary accent
--rust:   #b1583a;  // Primary accent — CTAs, italic display accents
--rust-deep: #862f14; // Hover state
```
