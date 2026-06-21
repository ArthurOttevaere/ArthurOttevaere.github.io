#!/usr/bin/env python3
"""
=============================================================================
 generate-og.py  —  Build the social "link preview" image (Open Graph image)
=============================================================================

WHAT THIS IS
------------
When you paste your site link into iMessage, WhatsApp, LinkedIn, Discord, etc.
those apps show a little preview card with an image. That image is
  assets/images/og-image.png
and THIS script is what creates it. Edit the CONFIG block below, run the
script, and a fresh og-image.png is written. That's it.

HOW TO RUN
----------
    python3 tools/generate-og.py

(If Pillow isn't installed:  pip3 install pillow)

WANT A COMPLETELY CUSTOM IMAGE INSTEAD?
---------------------------------------
You don't have to use this generator at all. You can just drop your own
1200×630 PNG/JPG at assets/images/og-image.png and you're done. This script
is only here to make small text/colour tweaks easy.

NOTE: messaging apps cache previews per-URL. After you deploy a new image, an
old preview may stick around. Force a refresh with LinkedIn's Post Inspector
(linkedin.com/post-inspector) or by sharing the link with a ?v=2 on the end.
=============================================================================
"""

import os
from PIL import Image, ImageDraw, ImageFont

# ─────────────────────────────────────────────────────────────────────────
#  CONFIG — edit these to your liking, then re-run the script
# ─────────────────────────────────────────────────────────────────────────

# Text
BRAND   = "Arthur Ottevaere"                                  # small label, top-left
HEADLINE = "Arthur Ottevaere"                                 # the big title
TAGLINE = "Business Engineering · Business Analytics"         # line under the title
FOOTER  = "Dashboards · Data projects · Formula 1 · Tournai, BE"  # small mono line at bottom

# Colours (hex)
BG_COLOR     = "#fafaf9"   # background
ACCENT       = "#2563eb"   # brand blue (logo, underline, glow)
INK          = "#0a0a0a"   # main text
INK_MUTED    = "#52525b"   # tagline text
INK_FAINT    = "#71717a"   # footer text
DOT_COLOR    = "#a1a1aa"   # the faint "." after the headline

SHOW_GLOW    = True        # subtle accent glow in the top-left corner

# Output (1200×630 is the standard Open Graph size — leave as-is)
WIDTH, HEIGHT = 1200, 630
OUTPUT = os.path.join(os.path.dirname(__file__), "..", "assets", "images", "og-image.png")

# Fonts — macOS system fonts. Swap paths if you want a different typeface.
FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_BOLD    = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_MONO    = "/System/Library/Fonts/Menlo.ttc"

# ─────────────────────────────────────────────────────────────────────────
#  Rendering — you normally don't need to touch anything below here
# ─────────────────────────────────────────────────────────────────────────

def _font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        # Fall back to a default font if the system font path doesn't exist.
        return ImageFont.load_default()

def main():
    img = Image.new("RGBA", (WIDTH, HEIGHT), BG_COLOR)

    # Soft accent glow in the top-left, echoing the site's cursor spotlight.
    if SHOW_GLOW:
        glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        gd = ImageDraw.Draw(glow)
        ar, ag, ab = ImageColor_rgb(ACCENT)
        cx, cy, rmax = int(0.28 * WIDTH), int(0.32 * HEIGHT), int(0.62 * WIDTH)
        for i in range(60, 0, -1):
            r = int(rmax * i / 60)
            a = int(26 * (1 - i / 60))
            gd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(ar, ag, ab, a))
        img = Image.alpha_composite(img, glow)

    img = img.convert("RGB")
    d = ImageDraw.Draw(img)

    # Brand mark + name (top-left)
    bx, by = 90, 96
    d.rounded_rectangle([bx, by, bx + 34, by + 34], radius=9, fill=ACCENT)
    d.rounded_rectangle([bx + 12, by + 12, bx + 22, by + 22], radius=2, fill=BG_COLOR)
    d.text((bx + 50, by + 4), BRAND, font=_font(FONT_REGULAR, 24), fill=INK)

    # Headline + faint trailing dot
    hl = _font(FONT_BOLD, 96)
    d.text((86, 232), HEADLINE, font=hl, fill=INK)
    w = d.textlength(HEADLINE, font=hl)
    d.text((86 + w, 232), ".", font=hl, fill=DOT_COLOR)

    # Tagline
    d.text((90, 360), TAGLINE, font=_font(FONT_REGULAR, 31), fill=INK_MUTED)

    # Footer mono line + accent underline
    d.text((90, 505), FOOTER, font=_font(FONT_MONO, 22), fill=INK_FAINT)
    d.rounded_rectangle([92, 556, 156, 559], radius=2, fill=ACCENT)

    img.save(OUTPUT, "PNG", optimize=True)
    print("✓ Wrote", os.path.normpath(OUTPUT), f"({WIDTH}x{HEIGHT})")

def ImageColor_rgb(hexstr):
    from PIL import ImageColor
    return ImageColor.getrgb(hexstr)

if __name__ == "__main__":
    main()
