# Development Setup

## Prerequisites

This project uses Nix for reproducible development environments.

### Install Nix

```bash
sh <(curl -L https://nixos.org/nix/install)
```

### Enable Flakes

Add to `~/.config/nix/nix.conf`:

```
experimental-features = nix-command flakes
```

## Getting Started

```bash
# Clone the repository
git clone git@github.com:timlinux/zapilates.git
cd zapilates

# Enter development shell
nix develop

# Start Hugo server
hugo server -D
```

Open http://localhost:1313 in your browser.

## Available Commands

| Command | Description |
|---------|-------------|
| `hugo server -D` | Start dev server with drafts |
| `hugo --minify` | Build for production |
| `pre-commit run --all-files` | Run all linters |
| `python scripts/migrate.py` | Run content migration |
| `mkdocs serve` | Start docs server |

## VS Code

Recommended extensions:

- Hugo Language and Syntax Support
- SCSS IntelliSense
- Markdown All in One
