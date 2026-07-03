# Canto Lyrico

The official website of Marcelle Volckaert - Classical Singer & Pilates Instructor.

[![Hugo](https://img.shields.io/badge/Hugo-0.121+-ff4088?logo=hugo)](https://gohugo.io/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## About

This is a Hugo-powered static website featuring:

- **Classical Singing**: Performance archive, music recordings, and video content
- **Pilates Studio**: Information about services, classes, and booking
- **E-commerce**: Stripe-powered class booking

## Development

### Prerequisites

This project uses Nix for reproducible development environments.

```bash
# Enter the development shell
nix develop
```

### Running Locally

```bash
# Start Hugo development server
hugo server -D

# Build for production
hugo --minify
```

### Project Structure

```
.
├── content/           # Markdown content
├── themes/            # Custom Hugo theme (cantolyrico-warm)
├── static/            # Static assets (audio, images)
├── scripts/           # Migration and utility scripts
├── docs/              # MkDocs documentation
└── .github/workflows/ # CI/CD pipelines
```

## Design

The site uses a warm, personal aesthetic with:

- **Colors**: Terracotta (#C67C4E), Warm Cream (#FAF3E3), Soft Gold (#D4A853),
  Deep Burgundy (#6B2D3C), Sage Green (#8B9A71)
- **Typography**: Cormorant Garamond (headings), Source Sans 3 (body)
- **Features**: Responsive design, custom audio player, mobile-first approach

## Documentation

Full documentation is available in the `docs/` directory and can be built with MkDocs:

```bash
cd docs && mkdocs serve
```

## Contributing

Contributions are welcome! Please read the [SPECIFICATION.md](SPECIFICATION.md) for
technical details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file.
