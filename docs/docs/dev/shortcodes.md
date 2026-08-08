# Shortcodes

The theme provides two custom shortcodes: `figure` and `youtube`.

## Figure

Renders an image with an optional caption.

### Usage

```
{{</* figure src="/images/studio.jpg" alt="The studio" caption="Marvão studio" */>}}
```

Parameters:

- `src` (required): Path to the image
- `alt` (required): Alternative text for accessibility
- `caption`: Optional caption displayed below the image

## YouTube

Embeds a YouTube video with privacy-respecting mode.

### Usage

```
{{</* youtube id="VIDEO_ID" title="Video Title" */>}}
```

Parameters:

- `id` (required): YouTube video ID
- `title`: Accessible title for the iframe
