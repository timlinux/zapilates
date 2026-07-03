# Configuration

## Hugo Configuration

The main configuration is in `hugo.toml`.

### Site Settings

```toml
baseURL = "https://cantolyrico.com/"
languageCode = "en-ZA"
title = "Canto Lyrico"
theme = "cantolyrico-warm"
```

### Parameters

```toml
[params]
  tagline = "Marcelle Volckaert, Classical Singer & Movement Specialist"
  description = "..."
  author = "Marcelle Volckaert"
  location = "Marvão, Portugal"
  email = "info@cantolyrico.com"

  # Social
  twitter = "CantoLyrico"
  instagram = "go_well_with_marcelle"
  facebook = "..."
```

### Menu

Edit the `[menu]` section to modify navigation.

## Theme Configuration

Theme files are in `themes/cantolyrico-warm/`.

### Colors

Edit `assets/scss/main.scss` to change colors:

```scss
$terracotta: #C67C4E;
$warm-cream: #FAF3E3;
$soft-gold: #D4A853;
$deep-burgundy: #6B2D3C;
$sage-green: #8B9A71;
$warm-gray: #6B6257;
```
