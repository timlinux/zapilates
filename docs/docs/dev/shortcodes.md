# Shortcodes

## Audio Player

Renders a custom audio player with playlist support.

### Usage

In page front matter:

```yaml
tracks:
  - title: "Track Title"
    src: "/audio/file.mp3"
    artist: "Artist Name"
```

In content:

```
{{</* audio-player title="Album Name" */>}}
```

## YouTube

Embeds a YouTube video with privacy-respecting mode.

### Usage

```
{{</* youtube id="VIDEO_ID" title="Video Title" */>}}
```

Parameters:

- `id` (required): YouTube video ID
- `title`: Accessible title for the iframe

## Stripe Buy Button

Renders a purchase button with Stripe Checkout integration.

### Usage

```
{{</* stripe-buy productId="prod_xxx" price="€50" label="Book Now" */>}}
```

Parameters:

- `productId` (required): Stripe product ID
- `price`: Price display (informational)
- `label`: Button text (default: "Buy Now")
- `class`: CSS classes (default: "btn btn-primary")

### Requirements

Requires Netlify Function at `/.netlify/functions/create-checkout`.
