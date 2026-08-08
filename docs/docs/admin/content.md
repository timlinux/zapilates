# Content Management

## Adding Content

### Pages

Create a new Markdown file in the appropriate `content/` directory:

```bash
# New about page
content/about.md

# New class page
content/private.md
```

### Front Matter

Every content file needs YAML front matter:

```yaml
---
title: "Page Title"
description: "Meta description"
date: 2024-01-15
image: "/images/page-image.jpg"
draft: false
---
```

### Workshops

Add workshops under `content/workshops/`:

```yaml
---
title: "Workshop Title"
date: 2024-01-15
tags: ["pilates"]
---
```

## Images

### Adding Images

1. Place images in `static/images/`
2. Reference with `/images/filename.jpg`

### Image Optimization

For performance, consider:

- WebP format for modern browsers
- Multiple sizes for responsive images
- Lazy loading (built into theme)
