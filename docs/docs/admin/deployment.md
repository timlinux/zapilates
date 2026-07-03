# Deployment

## GitHub Pages

The site is deployed to GitHub Pages via GitHub Actions.

### Automatic Deployment

1. Push changes to the `main` branch
2. GitHub Actions runs the build workflow
3. Hugo builds the site with `hugo --minify`
4. Output is deployed to the `gh-pages` branch
5. GitHub Pages serves the content

### Manual Build

```bash
# Build locally
hugo --minify

# Output is in the public/ directory
```

## Netlify (Alternative)

For Stripe integration, Netlify is recommended.

### Setup

1. Connect your GitHub repository
2. Configure build settings:
   - Build command: `hugo --minify`
   - Publish directory: `public`
3. Add environment variables for Stripe

### Environment Variables

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## DNS Configuration

Point your domain to GitHub Pages or Netlify:

- GitHub Pages: Add CNAME file to `static/`
- Netlify: Configure in dashboard
