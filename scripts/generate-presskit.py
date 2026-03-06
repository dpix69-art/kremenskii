#!/usr/bin/env python3
"""
generate-presskit.py

Generates a clean, minimal Press Kit PDF from content.json.
Reads artist info, statement, exhibitions, selected works.
Output: client/public/files/press-kit.pdf

Usage: python3 scripts/generate-presskit.py
"""

import json
import os
from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ── Paths ────────────────────────────────────────────────
CONTENT_PATH = Path("client/public/content.json")
IMAGES_DIR = Path("client/public")
OUTPUT_PATH = Path("client/public/files/press-kit.pdf")

# ── Colors ───────────────────────────────────────────────
BLACK = HexColor("#0a0a0a")
GRAY = HexColor("#666666")
LIGHT_GRAY = HexColor("#e0e0e0")
WHITE = HexColor("#ffffff")

# ── Layout ───────────────────────────────────────────────
PAGE_W, PAGE_H = A4
MARGIN_L = 28 * mm
MARGIN_R = 28 * mm
MARGIN_T = 28 * mm
MARGIN_B = 24 * mm
CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R

def load_content():
    with open(CONTENT_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def draw_line(c, y, width=None):
    """Draw a thin horizontal rule."""
    w = width or CONTENT_W
    c.setStrokeColor(LIGHT_GRAY)
    c.setLineWidth(0.5)
    c.line(MARGIN_L, y, MARGIN_L + w, y)

def draw_text_block(c, text, x, y, font="Helvetica", size=9, color=BLACK, max_width=None, leading=14):
    """Draw multiline text, return new y position."""
    c.setFont(font, size)
    c.setFillColor(color)
    mw = max_width or CONTENT_W

    lines = []
    for paragraph in text.split("\n"):
        paragraph = paragraph.strip()
        if not paragraph:
            lines.append("")
            continue
        words = paragraph.split()
        current_line = ""
        for word in words:
            test = f"{current_line} {word}".strip()
            if pdfmetrics.stringWidth(test, font, size) <= mw:
                current_line = test
            else:
                if current_line:
                    lines.append(current_line)
                current_line = word
        if current_line:
            lines.append(current_line)

    for line in lines:
        if y < MARGIN_B + 20:
            c.showPage()
            y = PAGE_H - MARGIN_T
            c.setFont(font, size)
            c.setFillColor(color)
        if line == "":
            y -= leading * 0.6
        else:
            c.drawString(x, y, line)
            y -= leading
    return y

def add_image_safe(c, img_path, x, y, max_w, max_h):
    """Try to add an image, return (actual_w, actual_h) or None."""
    full_path = IMAGES_DIR / img_path.replace("?url-00", "").lstrip("/")
    if not full_path.exists():
        return None
    try:
        img = ImageReader(str(full_path))
        iw, ih = img.getSize()
        ratio = min(max_w / iw, max_h / ih)
        w = iw * ratio
        h = ih * ratio
        c.drawImage(img, x, y - h, width=w, height=h, preserveAspectRatio=True)
        return (w, h)
    except Exception:
        return None


def build_pdf(content):
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT_PATH), pagesize=A4)
    c.setTitle("Press Kit — Dmitrii Kremenskii")
    c.setAuthor("Dmitrii Kremenskii")
    c.setSubject("Artist Press Kit")

    site = content.get("site", {})
    statement = content.get("statement", {})
    contacts = content.get("contacts", {})
    series_list = content.get("series", [])
    exhibitions = statement.get("exhibitions", [])
    paragraphs = statement.get("paragraphs", [])

    artist_name = site.get("artistName", "Dmitrii Kremenskii")
    role = site.get("role", "Visual & Sound Artist")

    # ── PAGE 1: Header + Statement ───────────────────────
    y = PAGE_H - MARGIN_T

    # Artist name — large
    c.setFont("Helvetica-Bold", 24)
    c.setFillColor(BLACK)
    c.drawString(MARGIN_L, y, artist_name)
    y -= 14

    # Role
    c.setFont("Helvetica", 10)
    c.setFillColor(GRAY)
    c.drawString(MARGIN_L, y, role)
    y -= 8

    # Location + email
    city = contacts.get("city", "Stuttgart")
    country = contacts.get("country", "Germany")
    email = contacts.get("email", "hi@kremenskii.art")
    c.drawString(MARGIN_L, y, f"{city}, {country}  ·  {email}")
    y -= 6

    # Website
    c.drawString(MARGIN_L, y, "kremenskii.art")
    y -= 20

    draw_line(c, y)
    y -= 24

    # Statement heading
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(BLACK)
    c.drawString(MARGIN_L, y, "Statement")
    y -= 18

    # Statement text — filter out empty/whitespace-only paragraphs
    statement_text = "\n\n".join(p for p in paragraphs if p.strip())
    y = draw_text_block(c, statement_text, MARGIN_L, y, size=9, leading=14, color=BLACK)
    y -= 20

    # ── Exhibitions ──────────────────────────────────────
    if exhibitions:
        draw_line(c, y)
        y -= 24

        c.setFont("Helvetica-Bold", 11)
        c.setFillColor(BLACK)
        c.drawString(MARGIN_L, y, "Selected Exhibitions & Performances")
        y -= 20

        for ex in exhibitions:
            if y < MARGIN_B + 30:
                c.showPage()
                y = PAGE_H - MARGIN_T

            year = str(ex.get("year", ""))
            event = ex.get("event", "")

            c.setFont("Helvetica", 9)
            c.setFillColor(GRAY)
            c.drawString(MARGIN_L, y, year)
            c.setFillColor(BLACK)
            c.drawString(MARGIN_L + 40, y, event)
            y -= 16

    # ── PAGE 2+: Selected Works ──────────────────────────
    c.showPage()
    y = PAGE_H - MARGIN_T

    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(BLACK)
    c.drawString(MARGIN_L, y, "Selected Works")
    y -= 24

    for s in series_list:
        works = s.get("works", [])
        # Pick up to 3 works per series for press kit
        selected = works[:3]

        for w in selected:
            if y < MARGIN_B + 100:
                c.showPage()
                y = PAGE_H - MARGIN_T

            # Try to show image
            imgs = w.get("images", [])
            main_img = None
            if imgs:
                raw = imgs[0] if isinstance(imgs[0], str) else imgs[0].get("url", "")
                if raw:
                    result = add_image_safe(c, raw, MARGIN_L, y, 65 * mm, 50 * mm)
                    if result:
                        img_w, img_h = result
                        # Text next to image
                        text_x = MARGIN_L + img_w + 8 * mm
                        text_w = CONTENT_W - img_w - 8 * mm
                        main_img = True

            if not main_img:
                text_x = MARGIN_L
                text_w = CONTENT_W
                img_h = 0

            text_y = y - 4

            # Work title
            c.setFont("Helvetica-Bold", 10)
            c.setFillColor(BLACK)
            c.drawString(text_x, text_y, w.get("title", "Untitled"))
            text_y -= 16

            # Series
            c.setFont("Helvetica", 8)
            c.setFillColor(GRAY)
            c.drawString(text_x, text_y, f"Series: {s.get('title', '')}")
            text_y -= 13

            # Year
            c.drawString(text_x, text_y, f"Year: {w.get('year', '')}")
            text_y -= 13

            # Technique
            tech = w.get("technique", w.get("medium", ""))
            if tech:
                c.drawString(text_x, text_y, f"Technique: {tech}")
                text_y -= 13

            # Dimensions
            dims = w.get("dimensions", "")
            if dims:
                c.drawString(text_x, text_y, f"Dimensions: {dims}")
                text_y -= 13

            # Availability
            avail = w.get("sale", {}).get("availability", "")
            if avail:
                label = {"available": "Available", "sold": "Sold"}.get(avail, avail.title())
                c.drawString(text_x, text_y, f"Status: {label}")
                text_y -= 13

            y = min(text_y, y - img_h) - 20

    # ── Contact footer on last page ──────────────────────
    if y < MARGIN_B + 60:
        c.showPage()
        y = PAGE_H - MARGIN_T

    y -= 10
    draw_line(c, y)
    y -= 20

    c.setFont("Helvetica", 9)
    c.setFillColor(GRAY)
    c.drawString(MARGIN_L, y, f"Contact: {email}  ·  kremenskii.art")
    y -= 14
    c.drawString(MARGIN_L, y, f"{city}, {country}")
    y -= 14

    socials = contacts.get("socials", [])
    social_text = "  ·  ".join(s.get("href", "") for s in socials if s.get("href"))
    if social_text:
        c.setFont("Helvetica", 7)
        c.drawString(MARGIN_L, y, social_text)
        y -= 14

    c.setFont("Helvetica", 7)
    c.drawString(MARGIN_L, y, "High-resolution images available on request.")
    y -= 14
    c.drawString(MARGIN_L, y, f"© {artist_name}. All rights reserved. No reproduction without written permission.")

    c.save()
    print(f"\n✅ Press Kit saved: {OUTPUT_PATH}")
    print(f"   Size: {OUTPUT_PATH.stat().st_size / 1024:.0f} KB\n")


if __name__ == "__main__":
    content = load_content()
    build_pdf(content)
