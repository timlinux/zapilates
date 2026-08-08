# Zapilates

The official website of **Marcelle Sutton** — Pilates instructor, remedial-work specialist, and researcher of Pilates for singers and musicians.

[![Hugo](https://img.shields.io/badge/Hugo-0.147+-ff4088?logo=hugo)](https://gohugo.io/)
[![Nix Flake](https://img.shields.io/badge/nix-flake-5277C3?logo=nixos)](https://nixos.wiki/wiki/Flakes)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## About

Static Hugo site covering:

- **The Method** — what Pilates is, and the principles behind it
- **Classes** — Private, Group, Barre, and Remedial
- **Specialisms** — For singers, for dancers, workshops for musicians
- **Research** — Marcelle's MMus (*cum laude*, Stellenbosch) thesis on Pilates warm-up for classical singers
- **Journal** — notes on movement, breath and stress

The repository is also a **Nix flake** that produces:

- a reproducible build of the site as a package (`packages.<system>.zapilates`)
- a NixOS module (`nixosModules.default`) that serves it via nginx with optional ACME/Let's Encrypt

so a NixOS host can consume this flake as an input and deploy the site with a few lines of configuration.

## Design

- **Theme** — `zapilates-studio`, an editorial pilates aesthetic inspired by STOTT / Merrithew, Balanced Body, and boutique studio brands
- **Palette** — Bone paper (`#f4efe6`), Ink (`#1a1a1c`), warm Rust accent (`#b1583a`), muted Sage
- **Typography** — Fraunces (variable serif, opsz + SOFT axes) for display, Inter for body, IBM Plex Mono for metadata
- **Motion** — Sticky-header shadow, principles marquee, image ken-burns on hero, reveal-on-scroll fades

## Development

### Prerequisites

Nix with flakes enabled (`experimental-features = nix-command flakes`).

```bash
# Enter the development shell (Hugo, dart-sass, node, linters, etc.)
nix develop

# Live-reload Hugo dev server
hugo server -D

# One-off production build (writes to ./public)
hugo --minify
```

### Building the site as a Nix package

```bash
# Build — outputs ./result/ symlink to the built static site
nix build

# or, explicitly
nix build .#zapilates

# Serve the built package locally on :8000
nix run .#serve
```

The resulting store path contains the entire minified site (HTML, CSS, JS, images) and is what the NixOS module serves.

## Deploying on a NixOS server

The flake exposes a NixOS module at `nixosModules.default` (aliased as `nixosModules.zapilates`) that:

- adds the site's Nix store path as an nginx document root
- configures the vhost with sensible cache headers and pretty-URL fallbacks
- (optionally) obtains a Let's Encrypt certificate via ACME
- (optionally) opens ports 80 and 443 on the host firewall

### 1. Add this flake as an input

In your server's `flake.nix`:

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";

    zapilates = {
      url = "github:timlinux/zapilates";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, zapilates, ... }: {
    nixosConfigurations.my-server = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [
        ./configuration.nix
        zapilates.nixosModules.default
      ];
    };
  };
}
```

### 2. Enable the service on the host

In `configuration.nix` (or a dedicated module):

```nix
{ config, ... }:
{
  # Let's Encrypt (required only if enableACME = true)
  security.acme = {
    acceptTerms = true;
    defaults.email = "you@example.com";
  };

  services.zapilates = {
    enable = true;
    domain = "zapilates.com";
    serverAliases = [ "www.zapilates.com" ];
    enableACME = true;
    forceSSL = true;
    openFirewall = true;
  };
}
```

Then rebuild:

```bash
sudo nixos-rebuild switch --flake .#my-server
```

### 3. Updating the site on the server

```bash
# On the server (or wherever you build your NixOS config)
nix flake update zapilates
sudo nixos-rebuild switch --flake .#my-server
```

Because the site is a Nix package, activation is atomic — the new site is built to a fresh store path and nginx is reloaded to point at it. Rolling back is a `nixos-rebuild switch --rollback` away.

### Module options

All options live under `services.zapilates`:

| Option              | Type            | Default                     | Description                                                    |
| ------------------- | --------------- | --------------------------- | -------------------------------------------------------------- |
| `enable`            | `bool`          | `false`                     | Enable the site.                                               |
| `package`           | `package`       | `zapilates` from this flake | Override the built site (e.g. to pin a specific revision).     |
| `domain`            | `str`           | `"zapilates.com"`           | Primary vhost domain.                                          |
| `serverAliases`     | `list of str`   | `[ "www.zapilates.com" ]`   | Additional server names.                                       |
| `enableACME`        | `bool`          | `true`                      | Request a Let's Encrypt certificate.                           |
| `forceSSL`          | `bool`          | `true`                      | Redirect HTTP → HTTPS (only takes effect when ACME is on).     |
| `openFirewall`      | `bool`          | `true`                      | Open ports 80 and 443.                                         |
| `extraNginxConfig`  | `lines`         | `""`                        | Extra nginx config injected into the vhost block.              |

## Project structure

```
.
├── content/                      # Markdown content (flat top-level URLs)
│   ├── _index.md                 # Home
│   ├── about.md                  # About Marcelle
│   ├── about-pilates.md          # The Method
│   ├── bio.md                    # Movement specialist bio
│   ├── studio.md                 # Studio + gallery
│   ├── classes.md                # Classes landing
│   ├── private.md / group.md     # Class formats
│   ├── barre.md / remedial.md    # Class formats
│   ├── for-singers.md            # Specialism
│   ├── for-dancers.md            # Specialism
│   ├── thesis.md                 # MMus research
│   ├── contact.md                # Contact
│   ├── workshops/                # Section — workshops archive
│   └── blog/                     # Section — journal
├── themes/zapilates-studio/      # Custom Hugo theme
├── static/                       # Images
├── nix/
│   ├── site.nix                  # Package definition (Hugo derivation)
│   └── module.nix                # NixOS module (services.zapilates)
├── flake.nix                     # Flake outputs: packages, module, devShell, apps
├── SPECIFICATION.md              # Software Requirements Specification
├── PACKAGES.md                   # Package inventory
└── PROMPT.log                    # Prompt log
```

---

Made with 💗 by [Kartoza](https://kartoza.com) · [Donate!](https://github.com/sponsors/timlinux) · [GitHub](https://github.com/timlinux/zapilates)
