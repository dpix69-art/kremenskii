#!/usr/bin/env python3
"""
generate-presskit.py v2

Clean, minimal Press Kit PDF from content.json.
Images compressed in-memory (800px max, JPEG q75) — output ~500KB vs 29MB.

Usage: python3 scripts/generate-presskit.py
Requires: pip install reportlab Pillow
"""

import json, io
from pathlib import Path
from PIL import Image as PILImage
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics

CONTENT_PATH = Path("client/public/content.json")
IMAGES_DIR = Path("client/public")
OUTPUT_PATH = Path("client/public/files/press-kit.pdf")

IMG_MAX_PX = 800
IMG_QUALITY = 75

BLACK = HexColor("#0a0a0a")
DARK = HexColor("#333333")
GRAY = HexColor("#777777")
LIGHT = HexColor("#cccccc")

PAGE_W, PAGE_H = A4
ML, MR, MT, MB = 30*mm, 30*mm, 32*mm, 28*mm
CW = PAGE_W - ML - MR


def compress_image(img_path):
    full = IMAGES_DIR / img_path.replace("?url-00", "").lstrip("/")
    if not full.exists():
        return None
    try:
        img = PILImage.open(full).convert("RGB")
        w, h = img.size
        if max(w, h) > IMG_MAX_PX:
            r = IMG_MAX_PX / max(w, h)
            img = img.resize((int(w*r), int(h*r)), PILImage.LANCZOS)
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=IMG_QUALITY, optimize=True)
        buf.seek(0)
        return ImageReader(buf)
    except Exception as e:
        print(f"  Warning: {full} — {e}")
        return None


def rule(c, y):
    c.setStrokeColor(LIGHT)
    c.setLineWidth(0.4)
    c.line(ML, y, ML + CW, y)


def wrap_lines(text, font, size, max_w):
    lines = []
    for para in text.split("\n"):
        para = para.strip()
        if not para:
            lines.append("")
            continue
        words = para.split()
        cur = ""
        for w in words:
            test = f"{cur} {w}".strip()
            if pdfmetrics.stringWidth(test, font, size) <= max_w:
                cur = test
            else:
                if cur: lines.append(cur)
                cur = w
        if cur: lines.append(cur)
    return lines


def draw_text(c, text, x, y, font="Helvetica", size=9, color=BLACK, max_w=None, leading=13.5):
    mw = max_w or CW
    lines = wrap_lines(text, font, size, mw)
    c.setFont(font, size)
    c.setFillColor(color)
    for line in lines:
        if y < MB + 16:
            c.showPage()
            y = PAGE_H - MT
            c.setFont(font, size)
            c.setFillColor(color)
        if line == "":
            y -= leading * 0.5
        else:
            c.drawString(x, y, line)
            y -= leading
    return y


def build_pdf(data):
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT_PATH), pagesize=A4)
    c.setTitle("Press Kit — Dmitrii Kremenskii")
    c.setAuthor("Dmitrii Kremenskii")

    site = data.get("site", {})
    stmt = data.get("statement", {})
    cont = data.get("contacts", {})

    name = site.get("artistName", "Dmitrii Kremenskii")
    role = site.get("role", "Visual & Sound Artist")
    city = cont.get("city", "Stuttgart")
    country = cont.get("country", "Germany")
    email = cont.get("email", "hi@kremenskii.art")
    paragraphs = stmt.get("paragraphs", [])
    exhibitions = stmt.get("exhibitions", [])
    series_list = data.get("series", [])

    # ══════════════════════════════════════════════════════
    # PAGE 1: Header
    # ══════════════════════════════════════════════════════
    y = PAGE_H - MT

    # Name
    c.setFont("Helvetica-Bold", 22)
    c.setFillColor(BLACK)
    c.drawString(ML, y, name)
    y -= 24

    # Role — on its own line
    c.setFont("Helvetica", 9.5)
    c.setFillColor(GRAY)
    c.drawString(ML, y, role)
    y -= 20

    # Contact block — each on its own line, clean
    c.setFont("Helvetica", 8.5)
    c.setFillColor(DARK)
    c.drawString(ML, y, f"{city}, {country}")
    y -= 13
    c.drawString(ML, y, email)
    y -= 13
    c.setFillColor(GRAY)
    c.drawString(ML, y, "kremenskii.art")
    y -= 22

    rule(c, y)
    y -= 28

    # ── Statement ────────────────────────────────────────
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(BLACK)
    c.drawString(ML, y, "Statement")
    y -= 20

    clean = [p for p in paragraphs if p.strip()]
    y = draw_text(c, "\n\n".join(clean), ML, y, size=8.5, leading=13, color=DARK)
    y -= 16

    # ── Exhibitions ──────────────────────────────────────
    if exhibitions:
        rule(c, y)
        y -= 24
        c.setFont("Helvetica-Bold", 10)
        c.setFillColor(BLACK)
        c.drawString(ML, y, "Selected Exhibitions & Performances")
        y -= 22

        for ex in exhibitions:
            if y < MB + 16:
                c.showPage()
                y = PAGE_H - MT
            yr = str(ex.get("year", ""))
            ev = ex.get("event", "")
            c.setFont("Helvetica", 8.5)
            c.setFillColor(GRAY)
            c.drawString(ML, y, yr)
            c.setFillColor(DARK)
            c.drawString(ML + 36, y, ev)
            y -= 15

    # ══════════════════════════════════════════════════════
    # PAGE 2+: Selected Works
    # ══════════════════════════════════════════════════════
    c.showPage()
    y = PAGE_H - MT

    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(BLACK)
    c.drawString(ML, y, "Selected Works")
    y -= 28

    IW = 52 * mm   # image width
    IH = 66 * mm   # image max height
    TX = ML + IW + 10 * mm
    TW = CW - IW - 10 * mm

    for s in series_list:
        for w in s.get("works", [])[:3]:
            if y < MB + 80 * mm:
                c.showPage()
                y = PAGE_H - MT

            top = y
            img_h = 0

            # Compressed image
            imgs = w.get("images", [])
            if imgs:
                raw = imgs[0] if isinstance(imgs[0], str) else imgs[0].get("url", "")
                if raw:
                    reader = compress_image(raw)
                    if reader:
                        rw, rh = reader.getSize()
                        ratio = min(IW / rw, IH / rh)
                        dw, dh = rw * ratio, rh * ratio
                        c.drawImage(reader, ML, y - dh, width=dw, height=dh)
                        img_h = dh

            # Meta text
            ty = top - 2
            c.setFont("Helvetica-Bold", 9.5)
            c.setFillColor(BLACK)
            c.drawString(TX, ty, w.get("title", "Untitled"))
            ty -= 17

            fields = [
                ("Series", s.get("title", "")),
                ("Year", str(w.get("year", ""))),
                ("Technique", w.get("technique", w.get("medium", ""))),
                ("Dimensions", w.get("dimensions", "")),
            ]
            avail = w.get("sale", {}).get("availability", "")
            if avail:
                fields.append(("Status", {"available": "Available", "sold": "Sold"}.get(avail, avail.title())))

            c.setFont("Helvetica", 7.5)
            for label, val in fields:
                if not val: continue
                c.setFillColor(GRAY)
                c.drawString(TX, ty, label)
                c.setFillColor(DARK)
                c.drawString(TX + 50, ty, val)
                ty -= 12

            y = top - max(img_h, top - ty) - 16

    # ══════════════════════════════════════════════════════
    # Footer
    # ══════════════════════════════════════════════════════
    if y < MB + 60:
        c.showPage()
        y = PAGE_H - MT

    y -= 6
    rule(c, y)
    y -= 20

    c.setFont("Helvetica", 8)
    c.setFillColor(DARK)
    c.drawString(ML, y, f"{email}  ·  kremenskii.art")
    y -= 13
    c.setFillColor(GRAY)
    c.drawString(ML, y, f"{city}, {country}")
    y -= 16

    for s in cont.get("socials", []):
        lbl = s.get("label", "")
        href = s.get("href", "")
        if lbl and href:
            c.setFont("Helvetica", 7)
            c.setFillColor(GRAY)
            c.drawString(ML, y, f"{lbl}: {href}")
            y -= 11

    y -= 6
    c.setFont("Helvetica", 7)
    c.setFillColor(GRAY)
    c.drawString(ML, y, "High-resolution images available on request.")
    y -= 11
    c.drawString(ML, y, f"\u00a9 {name}. All rights reserved.")

    c.save()

    kb = OUTPUT_PATH.stat().st_size / 1024
    sz = f"{kb:.0f} KB" if kb < 1024 else f"{kb/1024:.1f} MB"
    print(f"\n\u2705 Press Kit: {OUTPUT_PATH}  ({sz})\n")


if __name__ == "__main__":
    build_pdf(json.loads(CONTENT_PATH.read_text(encoding="utf-8")))