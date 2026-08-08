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

## Nix Build

The site can also be built reproducibly as a Nix derivation:

```bash
# Build the site
nix build

# Output is a Nix-store symlink at ./result/
```

For NixOS hosting, consume the flake and enable the `services.zapilates`
module (see `README.md`).

## DNS Configuration

Point your domain to GitHub Pages:

- Add a `CNAME` file to `static/` with your domain
- Configure the A/CNAME records with your DNS provider
