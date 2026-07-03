#!/usr/bin/env python3
"""
Script to migrate performance/event content from Squarespace HTML to Hugo markdown.
"""

import os
import re
from pathlib import Path
from bs4 import BeautifulSoup
from datetime import datetime
import html

# Base paths
BASE_DIR = Path("/home/timlinux/dev/html/cantolyrico.com")
MIRROR_DIR = BASE_DIR / "cantolyrico-mirror" / "cantolyrico.com" / "performances"
OUTPUT_DIR = BASE_DIR / "content" / "singing" / "performances"


def extract_metadata_from_html(html_content: str) -> dict:
    """Extract metadata from Squarespace HTML."""
    soup = BeautifulSoup(html_content, "html.parser")

    metadata = {}

    # Get title from <title> tag or h1
    title_tag = soup.find("title")
    if title_tag:
        title = title_tag.get_text()
        # Remove " — Canto    Lyrico" suffix
        title = re.sub(r'\s*—\s*Canto\s+Lyrico$', '', title)
        title = re.sub(r'\s*&mdash;\s*Canto\s+Lyrico$', '', title)
        metadata["title"] = title.strip()

    # Get headline from h1 (often cleaner)
    h1_tag = soup.find("h1", class_="BlogItem-title")
    if h1_tag:
        metadata["headline"] = h1_tag.get_text(strip=True)
        # Prefer h1 if available
        if metadata.get("headline"):
            metadata["title"] = metadata["headline"]

    # Get OG description
    og_desc = soup.find("meta", property="og:description")
    if og_desc and og_desc.get("content"):
        metadata["description"] = html.unescape(og_desc.get("content"))

    # Get itemprop description
    if "description" not in metadata:
        itemprop_desc = soup.find("meta", itemprop="description")
        if itemprop_desc and itemprop_desc.get("content"):
            metadata["description"] = html.unescape(itemprop_desc.get("content"))

    # Get date from itemprop datePublished
    date_published = soup.find("meta", itemprop="datePublished")
    if date_published and date_published.get("content"):
        metadata["date_published"] = date_published.get("content")

    # Get date from time element (often more accurate for event date)
    time_tag = soup.find("time", class_="Blog-meta-item--date")
    if time_tag and time_tag.get("datetime"):
        metadata["date_published"] = time_tag.get("datetime")

    # Get OG image
    og_image = soup.find("meta", property="og:image")
    if og_image and og_image.get("content"):
        image_url = og_image.get("content")
        metadata["image"] = image_url

    # Get author
    author = soup.find("meta", itemprop="author")
    if author and author.get("content"):
        metadata["author"] = author.get("content")

    # Extract main content from the article body
    content_parts = []

    # Find the main HTML content block
    html_content_div = soup.find("div", class_="sqs-html-content")
    if html_content_div:
        # Get all paragraphs
        for p in html_content_div.find_all("p"):
            text = p.get_text(strip=True)
            if text:
                content_parts.append(text)

    # Also check for multiple html blocks
    all_html_blocks = soup.find_all("div", class_="sqs-html-content")
    for block in all_html_blocks:
        for elem in block.find_all(["p", "h2", "h3", "li"]):
            text = elem.get_text(strip=True)
            if text and text not in content_parts:
                content_parts.append(text)

    # Check for image captions (some posts only have content in captions)
    caption_divs = soup.find_all("div", class_="image-caption")
    for caption in caption_divs:
        for p in caption.find_all("p"):
            text = p.get_text(strip=True)
            if text and text not in content_parts:
                content_parts.append(text)

    # Also check figcaption elements
    figcaptions = soup.find_all("figcaption", class_="image-caption-wrapper")
    for figcaption in figcaptions:
        for p in figcaption.find_all("p"):
            text = p.get_text(strip=True)
            if text and text not in content_parts:
                content_parts.append(text)

    if content_parts:
        metadata["content"] = "\n\n".join(content_parts)

    return metadata


def create_slug(title: str) -> str:
    """Create a URL-friendly slug from title."""
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s_]+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    slug = slug.strip('-')
    return slug[:60]  # Limit length


def parse_date(date_str: str) -> datetime:
    """Parse ISO date string."""
    try:
        # Handle various ISO formats
        date_str = date_str.replace('+0000', '+00:00').replace('+0100', '+01:00')
        # Try to parse just the date part
        return datetime.strptime(date_str[:10], '%Y-%m-%d')
    except Exception:
        return datetime.now()


def extract_event_details(text: str) -> dict:
    """Extract event details like date, venue from text."""
    details = {}

    if not text:
        return details

    # Look for date patterns
    date_patterns = [
        r'Date:\s*([^\n,]+)',
        r'(\d{1,2}\s+\w+\s+\d{4})',
        r'(\w+\s+\d{1,2}(?:st|nd|rd|th)?\s+\w+\s+\d{4})',
    ]
    for pattern in date_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            details["event_date"] = match.group(1).strip()
            break

    # Look for venue patterns
    venue_patterns = [
        r'Venue:\s*([^\n]+)',
        r'(?:at|@)\s+([A-Z][^,\n]+)',
    ]
    for pattern in venue_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            venue = match.group(1).strip()
            # Clean up venue - remove trailing metadata
            venue = re.sub(r'\s*(Date|Time|Performers?|Programme):.*$', '', venue, flags=re.IGNORECASE)
            details["venue"] = venue.strip()
            break

    # Look for time patterns
    time_patterns = [
        r'(?:Time:\s*|@\s*|,\s*)(\d{1,2}[h:]\d{2}|\d{1,2}\s*[ap]m)',
    ]
    for pattern in time_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            details["time"] = match.group(1).strip()
            break

    return details


def extract_year(date_str: str) -> str:
    """Extract year from date string."""
    try:
        return date_str[:4]
    except:
        return str(datetime.now().year)


def create_markdown_content(metadata: dict, html_file: Path) -> str:
    """Create Hugo markdown content from metadata."""
    title = metadata.get("title", "Untitled Performance")
    description = metadata.get("description", "")
    date_str = metadata.get("date_published", "")
    content = metadata.get("content", "")

    # Parse and format date
    if date_str:
        date_obj = parse_date(date_str)
        formatted_date = date_obj.strftime("%Y-%m-%d")
        year = date_obj.strftime("%Y")
    else:
        formatted_date = "2015-01-01"
        year = "2015"

    # Extract event details from description or content
    event_details = extract_event_details(description or content)

    # Build front matter
    front_matter = [
        "---",
        f'title: "{title.replace(chr(34), chr(39))}"',
        f'date: {formatted_date}',
    ]

    # Add description if available
    if description:
        # Clean and escape description
        desc_clean = description.replace('"', "'").replace('\n', ' ').strip()
        # Truncate if too long for front matter
        if len(desc_clean) > 200:
            desc_clean = desc_clean[:197] + "..."
        front_matter.append(f'description: "{desc_clean}"')

    # Add venue if found
    if event_details.get("venue"):
        venue = event_details["venue"].replace('"', "'")
        front_matter.append(f'venue: "{venue}"')

    front_matter.append(f'year: "{year}"')

    # Add tags based on content
    tags = []
    full_text = (title + " " + description + " " + content).lower()

    if "pilates" in full_text:
        tags.append("pilates")
    if "workshop" in full_text:
        tags.append("workshop")
    if "recording" in full_text:
        tags.append("recording")
    if "concert" in full_text:
        tags.append("concert")
    if "recital" in full_text:
        tags.append("recital")
    if "exhibition" in full_text:
        tags.append("exhibition")

    if tags:
        tags_str = ", ".join(f'"{t}"' for t in tags)
        front_matter.append(f'tags: [{tags_str}]')

    # Add weight for sorting (newer = lower weight)
    weight = 10000 - int(year)
    front_matter.append(f'weight: {weight}')

    front_matter.append("---")

    # Build content body
    content_parts = ["\n".join(front_matter), ""]

    # Always add the full content or description as body text
    # Format it nicely with proper line breaks
    body_text = content if content else description

    if body_text:
        # Split on double spaces (common in Squarespace) and format as paragraphs
        # Also handle existing newlines
        body_text = body_text.replace("  ", "\n\n")

        # Clean up and format paragraphs
        paragraphs = []
        for para in body_text.split("\n"):
            para = para.strip()
            if para:
                paragraphs.append(para)

        if paragraphs:
            content_parts.append("\n\n".join(paragraphs))

    return "\n".join(content_parts)


def process_html_file(html_file: Path) -> tuple[str, str]:
    """Process a single HTML file and return (slug, markdown_content)."""
    try:
        with open(html_file, "r", encoding="utf-8", errors="ignore") as f:
            html_content = f.read()

        metadata = extract_metadata_from_html(html_content)

        if not metadata.get("title"):
            print(f"  Skipping {html_file}: No title found")
            return None, None

        title = metadata["title"]
        slug = create_slug(title)
        markdown = create_markdown_content(metadata, html_file)

        return slug, markdown

    except Exception as e:
        print(f"  Error processing {html_file}: {e}")
        import traceback
        traceback.print_exc()
        return None, None


def find_performance_files() -> list[Path]:
    """Find all performance HTML files."""
    html_files = []

    # Walk through year directories
    for year_dir in MIRROR_DIR.iterdir():
        if year_dir.is_dir() and year_dir.name.isdigit():
            for month_dir in year_dir.iterdir():
                if month_dir.is_dir():
                    for day_dir in month_dir.iterdir():
                        if day_dir.is_dir():
                            for html_file in day_dir.glob("*.html"):
                                html_files.append(html_file)

    return html_files


def main():
    print("Migrating performances from Squarespace to Hugo...")
    print(f"Mirror directory: {MIRROR_DIR}")
    print(f"Output directory: {OUTPUT_DIR}")
    print()

    # Ensure output directory exists
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Find all HTML files
    html_files = find_performance_files()
    print(f"Found {len(html_files)} performance HTML files")
    print()

    # Track processed files to avoid duplicates
    processed_slugs = set()

    for html_file in sorted(html_files, reverse=True):  # Most recent first
        print(f"Processing: {html_file.name}")

        slug, markdown = process_html_file(html_file)

        if slug and markdown:
            # Handle duplicate slugs
            original_slug = slug
            counter = 1
            while slug in processed_slugs:
                slug = f"{original_slug}-{counter}"
                counter += 1

            processed_slugs.add(slug)

            # Write markdown file
            output_file = OUTPUT_DIR / f"{slug}.md"
            with open(output_file, "w", encoding="utf-8") as f:
                f.write(markdown)

            print(f"  Created: {output_file.name}")

    print()
    print(f"Migration complete! Created {len(processed_slugs)} performance files.")

    # Update _index.md with better content
    index_content = '''---
title: "Diary of Events"
description: "A chronicle of performances, concerts, and events from 2012 to 2020"
layout: "list"
---

Welcome to the performance archive. Here you will find a chronicle of concerts, recitals, workshops, and other musical events spanning from 2012 to 2020.

Browse the events below to explore the rich history of classical singing performances, from intimate recitals in South Africa to international appearances in Denmark and beyond.
'''

    index_file = OUTPUT_DIR / "_index.md"
    with open(index_file, "w", encoding="utf-8") as f:
        f.write(index_content)
    print(f"Updated: {index_file}")


if __name__ == "__main__":
    main()
