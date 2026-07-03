#!/usr/bin/env python3
"""
Squarespace to Hugo Migration Script

Extracts content from the Squarespace mirror and converts to Hugo Markdown.
Preserves all original content text without editorializing.
"""

import os
import re
import yaml
from pathlib import Path
from datetime import datetime
from bs4 import BeautifulSoup
import html2text

# Paths
MIRROR_DIR = Path("cantolyrico-mirror/cantolyrico.com")
CONTENT_DIR = Path("content")
STATIC_DIR = Path("static")

# html2text configuration
h2t = html2text.HTML2Text()
h2t.ignore_links = False
h2t.ignore_images = False
h2t.body_width = 0  # Don't wrap lines
h2t.ignore_emphasis = False


def clean_title(title: str) -> str:
    """Clean up title from HTML, preserving original text."""
    # Remove extra whitespace
    title = re.sub(r'\s+', ' ', title).strip()
    # Remove "— Canto Lyrico" suffix
    title = re.sub(r'\s*[—–-]\s*Canto\s*Lyrico$', '', title)
    return title


def extract_meta(soup: BeautifulSoup) -> dict:
    """Extract metadata from HTML head."""
    meta = {}

    # Title
    title_tag = soup.find('title')
    if title_tag:
        meta['title'] = clean_title(title_tag.get_text())

    # Description
    desc_tag = soup.find('meta', {'name': 'description'})
    if desc_tag and desc_tag.get('content'):
        meta['description'] = desc_tag['content'].strip()

    # OG Image
    og_image = soup.find('meta', {'property': 'og:image'})
    if og_image and og_image.get('content'):
        meta['image'] = og_image['content']

    return meta


def extract_main_content(soup: BeautifulSoup) -> str:
    """Extract main content from page, preserving original text."""
    # Look for main content areas
    main_selectors = [
        '.Main-content',
        '.page-content',
        'main',
        '.Content',
        'article',
        '.sqs-layout'
    ]

    content = None
    for selector in main_selectors:
        content = soup.select_one(selector)
        if content:
            break

    if not content:
        # Fall back to body
        content = soup.find('body')

    if content:
        # Remove navigation, header, footer, scripts
        for tag in content.select('nav, header, footer, script, style, .Header, .Footer, .Mobile'):
            tag.decompose()

        # Convert to markdown, preserving original text
        html_content = str(content)
        markdown = h2t.handle(html_content)

        # Clean up excessive whitespace but preserve content
        markdown = re.sub(r'\n{4,}', '\n\n\n', markdown)
        return markdown.strip()

    return ""


def extract_performance_date(filename: str) -> datetime | None:
    """Extract date from performance filename path."""
    # Pattern: performances/YYYY/M/D/title.html
    match = re.search(r'performances/(\d{4})/(\d{1,2})/(\d{1,2})/', filename)
    if match:
        year, month, day = match.groups()
        try:
            return datetime(int(year), int(month), int(day))
        except ValueError:
            pass
    return None


def create_front_matter(meta: dict, date: datetime = None) -> str:
    """Create YAML front matter."""
    front_matter = {}

    if 'title' in meta:
        front_matter['title'] = meta['title']

    if date:
        front_matter['date'] = date.isoformat()

    if 'description' in meta:
        front_matter['description'] = meta['description']

    if 'image' in meta:
        front_matter['image'] = meta['image']

    # Add draft status for review
    front_matter['draft'] = False

    return '---\n' + yaml.dump(front_matter, allow_unicode=True, default_flow_style=False) + '---\n\n'


def process_page(html_path: Path, output_path: Path, date: datetime = None):
    """Process a single HTML page to Markdown."""
    print(f"Processing: {html_path}")

    try:
        with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
            html_content = f.read()
    except Exception as e:
        print(f"  Error reading file: {e}")
        return

    soup = BeautifulSoup(html_content, 'html.parser')

    # Extract metadata
    meta = extract_meta(soup)

    # Extract content
    content = extract_main_content(soup)

    if not meta.get('title'):
        # Use filename as title
        meta['title'] = html_path.stem.replace('-', ' ').title()

    # Create front matter and full content
    front_matter = create_front_matter(meta, date)
    full_content = front_matter + content

    # Ensure output directory exists
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Write output
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(full_content)

    print(f"  -> {output_path}")


def migrate_main_pages():
    """Migrate main pages (about, contact, etc.)."""
    pages = {
        'about.html': CONTENT_DIR / 'about.md',
        'contact-us.html': CONTENT_DIR / 'contact.md',
        'music.html': CONTENT_DIR / 'singing' / 'music.md',
        'videos.html': CONTENT_DIR / 'singing' / 'videos.md',
        'mermaids.html': CONTENT_DIR / 'singing' / 'mermaids.md',
        'about-pilates.html': CONTENT_DIR / 'pilates' / '_index.md',
        'pilates-bio.html': CONTENT_DIR / 'pilates' / 'bio.md',
        'pilates-studio.html': CONTENT_DIR / 'pilates' / 'studio.md',
        'pilates-for-singers.html': CONTENT_DIR / 'pilates' / 'for-singers.md',
        'pilates-for-dancers.html': CONTENT_DIR / 'pilates' / 'for-dancers.md',
        'pilates-barre.html': CONTENT_DIR / 'pilates' / 'services' / 'barre.md',
        'remedial-pilates.html': CONTENT_DIR / 'pilates' / 'services' / 'remedial.md',
    }

    for html_file, output_path in pages.items():
        html_path = MIRROR_DIR / html_file
        if html_path.exists():
            process_page(html_path, output_path)


def migrate_performances():
    """Migrate all performance pages."""
    performances_dir = MIRROR_DIR / 'performances'

    if not performances_dir.exists():
        print("Performances directory not found")
        return

    # Find all performance HTML files
    for html_file in performances_dir.rglob('*.html'):
        # Skip index/list pages
        if html_file.name in ['index.html'] or 'tag' in str(html_file):
            continue

        # Extract date from path
        date = extract_performance_date(str(html_file))

        # Create output path
        if date:
            output_name = html_file.stem + '.md'
            output_path = CONTENT_DIR / 'singing' / 'performances' / str(date.year) / output_name
        else:
            output_path = CONTENT_DIR / 'singing' / 'performances' / (html_file.stem + '.md')

        process_page(html_file, output_path, date)


def migrate_products():
    """Migrate product pages."""
    products_dir = MIRROR_DIR / 'products'

    if not products_dir.exists():
        print("Products directory not found")
        return

    for html_file in products_dir.glob('*.html'):
        output_path = CONTENT_DIR / 'products' / (html_file.stem + '.md')
        process_page(html_file, output_path)


def create_section_indexes():
    """Create _index.md files for sections."""
    sections = {
        CONTENT_DIR / '_index.md': {
            'title': 'Canto Lyrico',
            'description': 'Home page of Marcelle Volckaert, classical singer.'
        },
        CONTENT_DIR / 'singing' / '_index.md': {
            'title': 'Classical Singing',
            'description': 'Performances, recordings, and videos'
        },
        CONTENT_DIR / 'singing' / 'performances' / '_index.md': {
            'title': 'Diary of Events',
            'description': 'Performance archive'
        },
        CONTENT_DIR / 'pilates' / 'services' / '_index.md': {
            'title': 'Pilates Services',
            'description': 'Private sessions, group classes, and more'
        },
        CONTENT_DIR / 'products' / '_index.md': {
            'title': 'Buy Pilates Classes',
            'description': 'Book your Pilates sessions'
        },
    }

    for path, meta in sections.items():
        if not path.exists():
            path.parent.mkdir(parents=True, exist_ok=True)
            front_matter = '---\n' + yaml.dump(meta, allow_unicode=True) + '---\n'
            with open(path, 'w', encoding='utf-8') as f:
                f.write(front_matter)
            print(f"Created section index: {path}")


def main():
    """Run the migration."""
    print("=" * 60)
    print("Squarespace to Hugo Migration")
    print("=" * 60)

    # Ensure content directories exist
    CONTENT_DIR.mkdir(exist_ok=True)

    print("\n--- Creating Section Indexes ---")
    create_section_indexes()

    print("\n--- Migrating Main Pages ---")
    migrate_main_pages()

    print("\n--- Migrating Performances ---")
    migrate_performances()

    print("\n--- Migrating Products ---")
    migrate_products()

    print("\n" + "=" * 60)
    print("Migration complete!")
    print("Review the generated content in the 'content' directory.")
    print("=" * 60)


if __name__ == '__main__':
    main()
