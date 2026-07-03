# Content Management

## Adding Content

### Pages

Create a new Markdown file in the appropriate `content/` directory:

```bash
# New about page
content/about.md

# New pilates service
content/pilates/services/new-service.md
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

### Performances

Add performances under `content/singing/performances/YEAR/`:

```yaml
---
title: "Concert Title"
date: 2024-01-15
venue: "Concert Hall"
tags: ["opera", "recital"]
---
```

## Managing Audio

### Adding Tracks

1. Add MP3 files to `static/audio/`
2. Reference in page front matter:

```yaml
tracks:
  - title: "Track Title"
    src: "/audio/filename.mp3"
    artist: "Artist Name"
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
