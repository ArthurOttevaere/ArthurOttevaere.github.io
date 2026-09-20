---
version: alpha
name: The Charter
description: >
  Design system for arthurottevaere.github.io — a paper-and-ink portfolio with
  one signature orange, one variable display face used as a width instrument,
  and a single recurring motif (the orange dot). Tokens below are the LIGHT
  theme, which is the canonical set; the dark theme re-declares the same token
  names and nothing else (see "Theming"). The normative source is
  assets/css/site.css; this file is its contract and its reasoning.
homepage: https://arthurottevaere.github.io/
source: assets/css/site.css
updated: 2026-09-14

colors:
  # surfaces
  paper: "#F6F4EF"        # the page
  paper-2: "#FCFBF8"      # a panel lifted off the page
  # ink
  ink: "#101014"          # primary text, and the nav pill's surface
  ink-2: "#33323A"        # long-form body text
  muted: "#67656C"        # secondary text, labels
  faint: "#A6A39C"        # decorative numerals only — NOT a text colour
  # lines
  rule: "#DDD9D0"         # hairline between rows and sections
  rule-2: "#CBC6BC"       # a line meant to be seen (outline buttons, borders)
  # the one colour
  accent: "#FF4A12"       # signature orange — surfaces, dots, rules
  accent-ink: "#C83500"   # the same orange, darkened, for small text on paper
  on-accent: "#101014"    # what sits ON the orange
  ok: "#1F8A4C"           # the live-status dot. The only other hue in the system.
  # the dark form card, which stays dark on a light page
  form-bg: "#101014"
  form-fg: "#F6F4EF"
  form-line: "rgba(246,244,239,.20)"

typography:
  # Archivo is variable on TWO axes (wdth 62–125, wght 100–900). Width is the
  # identity: it is what makes a title feel set rather than sized.
  hero:
    fontFamily: Archivo
    fontSize: fit-to-width      # JS measures the last name and solves for the size
    fontWeight: 850
    lineHeight: 0.8
    letterSpacing: "-0.005em"
    fontVariation: "'wdth' 62–125 (animated), 'wght' 850"
  page-title:
    fontFamily: Archivo
    fontSize: 140px
    fontSizeFluid: "clamp(52px, 9.4vw, 140px)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.045em"
    fontVariation: "'wdth' 112"
  contact-title:
    fontFamily: Archivo
    fontSize: 150px
    fontSizeFluid: "clamp(60px, 9.6vw, 150px)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.05em"
    fontVariation: "'wdth' 96"
  section-title:
    fontFamily: Archivo
    fontSize: 86px
    fontSizeFluid: "clamp(38px, 5.6vw, 86px)"
    fontWeight: 750
    lineHeight: 0.95
    letterSpacing: "-0.04em"
    fontVariation: "'wdth' 108"
  project-title:
    fontFamily: Archivo
    fontSize: 92px
    fontSizeFluid: "clamp(38px, 6vw, 92px)"
    fontWeight: 800
    lineHeight: 0.94
    letterSpacing: "-0.042em"
    fontVariation: "'wdth' 100"
  statement:
    fontFamily: Archivo
    fontSize: 70px
    fontSizeFluid: "clamp(28px, 4.4vw, 70px)"
    fontWeight: 600
    lineHeight: 1.07
    letterSpacing: "-0.028em"
    fontVariation: "'wdth' 92"
  heading:
    fontFamily: Archivo
    fontSize: 36px
    fontSizeFluid: "clamp(25px, 2.6vw, 36px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 104"
  card-title:
    fontFamily: Archivo
    fontSize: 33px
    fontSizeFluid: "clamp(23px, 2.3vw, 33px)"
    fontWeight: 550
    lineHeight: 1.06
    letterSpacing: "-0.025em"
  lede:
    fontFamily: Archivo
    fontSize: 20px
    fontSizeFluid: "clamp(17px, 1.4vw, 20px)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: Archivo
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
    fontVariation: "'wdth' 100"
  prose:
    fontFamily: Archivo
    fontSize: 17.5px
    fontWeight: 400
    lineHeight: 1.72
  ui:
    fontFamily: Archivo
    fontSize: 15px
    fontWeight: 550
    letterSpacing: "-0.005em"
  voice-lead:
    fontFamily: Instrument Serif
    fontSize: 34px
    fontSizeFluid: "clamp(21px, 2.5vw, 34px)"
    fontWeight: 400
    lineHeight: 1.16
    letterSpacing: "-0.01em"
    fontStyle: italic
  voice-quote:
    fontFamily: Instrument Serif
    fontSize: 36px
    fontSizeFluid: "clamp(24px, 2.7vw, 36px)"
    fontWeight: 400
    lineHeight: 1.22
    letterSpacing: "-0.012em"
    fontStyle: italic
  eyebrow:
    fontFamily: Geist Mono
    fontSize: 11.5px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.09em"
    textTransform: uppercase
  label:
    fontFamily: Geist Mono
    fontSize: 10.5px
    fontWeight: 400
    letterSpacing: "0.08em"
    textTransform: uppercase

fontFamilies:
  display: "'Archivo', 'Helvetica Neue', Arial, sans-serif"
  voice: "'Instrument Serif', Georgia, 'Times New Roman', serif"
  mono: "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace"

rounded:
  focus: 3px          # the focus ring's own corner
  xs: 10px            # 38px icon tiles
  sm: 12px            # inputs, submit, lightbox image
  md: 14px            # small card media, next-project thumbnail
  lg: 16px            # screenshot frames, menus
  xl: 18px            # card media, timeline card, footer note
  2xl: 20px           # id card
  3xl: 22px           # contact form, project cover
  panel: "clamp(20px, 2.4vw, 30px)"   # enclosed content panels
  tile: 27px          # the three footer tiles
  crown: "30px 30px 0 0"              # the footer's top corners
  pill: 999px
  circle: 50%

spacing:
  gutter: "clamp(24px, 4.6vw, 48px)"  # every page's margin from the screen edge
  shell: 1280px                        # max content width
  nav-h: 60px                          # the reservation the fixed nav pill gets
  # vertical rhythm — section padding, fluid
  section-sm: "clamp(38px, 4.5vw, 64px)"
  section-md: "clamp(70px, 9vw, 130px)"
  section-lg: "clamp(110px, 13vw, 190px)"

motion:
  ease: "cubic-bezier(.2,.7,.2,1)"      # the default — most transitions
  ease-expo: "cubic-bezier(.16,1,.3,1)" # arrivals: reveals, big movement
  ease-io: "cubic-bezier(.65,0,.35,1)"  # a shape closing on itself (the splash)
  ease-pill: "cubic-bezier(.32,.72,0,1)" # the nav's active pill only
  ease-pop: "cubic-bezier(.34,1.56,.64,1)" # overshoot — footer tiles only
  instant: 140ms
  quick: 220ms
  base: 350ms
  slow: 600ms
  arrival: 950ms
  cinematic: 1150ms

effects:
  lift: "0 1px 0 rgba(16,16,20,.04), 0 26px 50px -30px rgba(16,16,20,.34)"
  grain: "SVG fractalNoise, 220×220, alpha .15 (light) / .07 white (dark)"

components:
  button:
    height: 46px
    heightSmall: 38px
    paddingInline: 20px
    paddingInlineSmall: 15px
    radius: "{rounded.pill}"
    fontSize: 15px
    fontWeight: 550
    gap: 9px
    border: "1px solid transparent"
    iconSize: 15px
  nav:
    offsetTop: 14px
    padding: 6px
    radius: "{rounded.pill}"
    background: "{colors.ink}"
    itemHeight: 36px
    itemFontSize: 14.5px
    shadow: "0 14px 34px -20px rgba(0,0,0,.55)"
  input:
    radius: "{rounded.sm}"
    padding: "13px 15px"
    fontSize: 15.5px
    border: "1px solid {colors.form-line}"
    focusBorder: "{colors.accent}"
  card:
    gap: 16px
    mediaRadius: "{rounded.xl}"
    mediaRatio: "16 / 11"
    mediaRadiusSmall: "{rounded.md}"
    mediaRatioSmall: "4 / 3"
    hoverScale: 1.035
  chip:
    radius: "{rounded.pill}"
    padding: "5px 11px"
    fontSize: 13px
    border: "1px solid {colors.rule-2}"
  dot:
    size: "0.17em"          # relative to the title it ends
    color: "{colors.accent}"
    marginLeft: "0.06em"
  focusRing:
    outline: "2px solid {colors.accent}"
    offset: 3px
    radius: "{rounded.focus}"

omitted: []
---

# The Charter

**The design system of `arthurottevaere.github.io`.**

This document is the contract between the intent and the code. It is written to
be read twice: once by a person deciding what to build, and once by whoever —
human or agent — has to build it and wants exact numbers.

Two rules govern everything below:

1. **`assets/css/site.css` is the only normative source.** If this document and
   the stylesheet disagree, the stylesheet is right and this document is a bug.
   Fix it in the same commit.
2. **The tokens are the values; the prose is the reason.** Copy the value, but
   do not ship it without reading why it exists — most of the numbers here are
   consequences of a rule, not preferences.

---

## Contents

| # | Section | For |
|---|---|---|
| 1 | [Overview](#1--overview) | Everyone — read this first |
| 2 | [Colors](#2--colors) | Design + code |
| 3 | [Typography](#3--typography) | Design + code |
| 4 | [Layout & Spacing](#4--layout--spacing) | Code |
| 5 | [Elevation & Depth](#5--elevation--depth) | Design |
| 6 | [Shapes](#6--shapes) | Code |
| 7 | [Motion](#7--motion) | Design + code |
| 8 | [Iconography & Imagery](#8--iconography--imagery) | Design + content |
| 9 | [Voice & Content](#9--voice--content) | Content |
| 10 | [Components](#10--components) | Code |
| 11 | [Scenes](#11--scenes) | Code — the four set pieces |
| 12 | [Theming](#12--theming) | Code |
| 13 | [Accessibility](#13--accessibility) | Everyone |
| 14 | [Do's and Don'ts](#14--dos-and-donts) | Everyone |
| 15 | [Contributing](#15--contributing) | Code |
| 16 | [Changelog & open questions](#16--changelog--open-questions) | Maintainer |

**Architecture in one line:** static site on GitHub Pages · React 18 from a CDN-free
vendored copy · `src/*.jsx` compiled by `tools/build.mjs` into `dist/app.js` (committed)
· all content in `data.js` · all styling in one 1,138-line stylesheet · no CSS
framework, no component library, no runtime CSS-in-JS.

---

## 1 · Overview

### What this site is

A portfolio for a Business Engineering / Business Analytics student. Its job is
to make a stranger — a recruiter, a professor, an internship manager — believe
that the person behind it is precise. Everything in this system is in service of
that one impression.

### The personality

**Printed, not rendered.** The palette is warm paper and near-black ink, the
background carries a real noise grain, the footer's rounded crown reads like a
page edge, and headings behave like set type rather than scaled text. The site
should feel like something that was *composed*, and only then happened to be
interactive.

**One colour, used like a pen.** There is exactly one hue in the system. It is
never decoration. It appears as a full-bleed surface (the intro, the footer, the
splash), a dot that ends a title, a rule that fills as you scroll, and a focus
ring. Nothing else is orange.

**Quiet, until you move.** Nothing animates on its own except three things that
are alive on purpose: the badge ring, the footer's fir trees, and the marquee.
Everything else is driven by your scroll or your cursor, and stops the instant
you do.

### The three motifs

These are the load-bearing ideas. A new component either uses one of them or is
deliberately outside them — there is no third option.

| Motif | What it is | Where it appears |
|---|---|---|
| **The dot** | A small orange disc, sized in `em` so it scales with the type it belongs to. It is the period at the end of a title. | Ends every `Words` title · opens the intro (grows into a full page) · the logo's period · the timeline's travelling cursor · the "Today" marker · the bullet before a takeaway · the separator in the marquee |
| **Text that arrives** | Words are hidden and then delivered — rising out of a mask, or filling from 20% to 100% opacity as you scroll through them. | Hero name · section titles (`.words`) · the intro statement · the About bio |
| **Width that breathes** | Archivo's `wdth` axis is treated as a dimension of the design, not a fallback. The hero name compresses from 125 to 72 as you scroll and swells under the cursor. | Hero name · every display size carries a deliberate `font-stretch` · the marquee's two rows (125% / 62%) |

### What this system is not

- Not a component library. There are no generic `Card`, `Modal`, `Tooltip`
  primitives. Each component here exists because one specific place needed it.
- Not themeable beyond light/dark. There is no brand-colour swap.
- Not responsive-first. It is designed at desktop scale and then *held together*
  on phones, which is why several components have a different structure below
  860px rather than a squeezed one.

---

## 2 · Colors

### The palette

Three families, and one exception. Every colour in the site comes from a custom
property in `:root`. **No component declares a colour of its own** — with the
five documented exceptions listed at the end of this section.

#### Surfaces

| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `#F6F4EF` | `#0E0E11` | The page. Always the `<body>` background. |
| `--paper-2` | `#FCFBF8` | `#17171B` | A surface lifted off the page: panels, the id card, screenshot frames, the back-to-top button. In light it is *brighter* than paper; in dark it is *lighter* than paper. The direction is the same — away from the page — even though the sign flips. |

#### Ink

| Token | Light | Dark | Use | Contrast on paper |
|---|---|---|---|---|
| `--ink` | `#101014` | `#ECEAE4` | Headings, primary text, the nav pill's surface | 17.3 : 1 / 16.0 : 1 |
| `--ink-2` | `#33323A` | `#C6C4BE` | Long-form body copy (`.prose`, `.pp-lead`). Slightly softer than `--ink` so a 66ch paragraph does not vibrate. | 11.5 : 1 / 11.1 : 1 |
| `--muted` | `#67656C` | `#96949C` | Secondary text: ledes, captions, labels, inactive nav items | 5.2 : 1 / 6.4 : 1 |
| `--faint` | `#A6A39C` | `#5E5C63` | **Decorative only.** Section numerals, the timeline's year labels, the menu's `01`/`02`. Never a sentence. | 2.3 : 1 / 2.9 : 1 — below AA by design |

#### Lines

| Token | Light | Dark | Use |
|---|---|---|---|
| `--rule` | `#DDD9D0` | `#2A2A31` | A hairline that *separates*. Between rows, under sections, around quiet panels. Should be felt, not read. |
| `--rule-2` | `#CBC6BC` | `#3B3B44` | A line that is *an object's edge*. Outline buttons, the `.all-work` frame, chips, the timeline axis. |

#### The one colour

| Token | Light | Dark | Use |
|---|---|---|---|
| `--accent` | `#FF4A12` | `#FF6E40` | Surfaces and shapes: the splash, the intro veil, the footer, the dot, the progress bar, the focus ring, filled states. |
| `--accent-ink` | `#C83500` | `#FF8A62` | **The same orange, for small text on paper.** `--accent` at 11px on paper is 3.06 : 1 — it fails. This token is 4.82 : 1. Any orange text under ~24px uses this one. |
| `--on-accent` | `#101014` | `#0E0E11` | What sits on top of an orange surface. Always near-black, in both themes — the orange is light enough in both. |
| `--ok` | `#1F8A4C` | `#4ADE80` | The live-status dot on the id card. **The only non-orange hue in the system.** It exists because "currently studying in Rotterdam" needs to read as a live fact, and orange already means something else. Do not extend it into a semantic status palette. |

#### The form's private pair

The contact form is a **dark object on a light page**, and it stays dark in
dark mode (lifted a step rather than inverted). It therefore carries its own
foreground/background pair so it never has to be styled twice:

| Token | Light | Dark |
|---|---|---|
| `--form-bg` | `#101014` | `#1C1C21` |
| `--form-fg` | `#F6F4EF` | `#ECEAE4` |
| `--form-line` | `rgba(246,244,239,.20)` | `rgba(236,234,228,.18)` |

### Rules

1. **Never write a hex outside `:root`.** If you need a tint, use
   `color-mix(in oklab, var(--token) N%, transparent)` — that is how the nav's
   inner highlight, the footer's rules and the timeline's stem are built, and it
   is the only way a tint survives the theme switch.
2. **Orange is a decision, not an accent.** Before making something orange, ask
   which of its five jobs it is doing: a surface that holds the whole screen, a
   dot, a fill that tracks progress, focus, or — once, on the Outside map — a
   fill the pointer reveals. If it is none of those, it is not orange.

   The fifth was added for `.atlas-on`, and it is the only place a colour
   answers a hover. It earns it because it adds a *reading* rather than the
   information: every country visited is already filled in ink at rest, and
   the pointer simply picks out the one it is over. Nothing is hidden behind
   the hover, which is why it can be gated on a real pointer and a phone loses
   nothing. Do not read this as permission for orange hover states elsewhere.
3. **`--faint` is never a sentence.** It is for numerals and ticks. If a reader
   has to read it, it is `--muted`.
4. **Small orange text is `--accent-ink`.** Always. `.sec-n`, `.pill-up`,
   `.tl-readout`, `.tl-today span`, `.form-err` and `a.row:hover .row-ico` all
   already do this.

### The documented hex exceptions

Five places write a literal colour, and each has a reason. This list is closed —
adding a sixth needs a line here.

| Where | Value | Why |
|---|---|---|
| `--lift` | `rgba(16,16,20,…)` / `rgba(0,0,0,…)` | A shadow is a *shade*, not a colour; it must not shift with the palette. |
| `.nav` shadow | `rgba(0,0,0,.55)` | Same. |
| `.foot-tile` shadows | `rgba(0,0,0,.45 / .5)` | Same. |
| Footer gradient + sheen | `#fff` inside `color-mix` | White is used as a *lightener* on the orange, not as a colour. |
| `TOP_COLOR` in `app.jsx` | The four theme colours | `<meta name="theme-color">` cannot read a CSS variable. **If you change `--paper` or `--accent`, change `app.jsx:24` and `index.html:109` too.** |

---

## 3 · Typography

### The three faces

| Role | Face | Axes loaded | What it is for |
|---|---|---|---|
| **Display + text** | Archivo | `wdth 62–125`, `wght 100–900` | Everything, unless it is one of the two below. Variable on both axes — the width axis is the identity. |
| **Voice** | Instrument Serif, italic | `ital 0;1` | Places, quotes, a level of language, a name of a thing. The italic serif is how the site *says something in its own words* rather than labelling it. |
| **Labels** | Geist Mono | `400;500` | Dates, numbers, eyebrows, kinds, counts. Anything that is data about the content rather than the content. |

Loaded from Google Fonts with `display=swap` and both `preconnect` hints
(`index.html:66–68`). The fallback stacks are real and sized to be survivable —
the site must not collapse if fonts.googleapis.com is blocked.

### The width axis is the instrument

This is the single most important typographic rule in the system, and the one
most easily lost.

Every display-size element carries an explicit `font-stretch`. It is not a
default and it is not decoration — it is how two headings at the same size read
as different weights of statement:

| Element | `font-stretch` | Reading |
|---|---|---|
| `.contact-title` | `96%` | Slightly narrow — a big word said plainly |
| `.veil-text` | `92%` | Narrowest of the large sizes — a long sentence that must stay a sentence |
| `.pp-title` | `100%` | Neutral — a project's name, whatever it is |
| `.sec-title` | `108%` | Slightly wide — a section announcing itself |
| `.page-title`, `.boot-hello` | `112%` | Wide — the page's own name |
| `.marquee.wide` | `125%` | The maximum. Used once. |
| `.marquee.narrow` | `62%` | The minimum. Used once, directly under the maximum, which is the whole point of that section. |

The hero name is the extreme case: JS writes `font-variation-settings` per
*letter*, interpolating each letter's width from its rest value to its scrolled
value, plus a bump for whatever the cursor is near. The last name always spans
the full container width, and that fitted width is what sets the font-size of
the entire name (`home.jsx:94–104`).

### The scale

Fluid sizes are `clamp(min, preferred, max)`. The min is what a 360px phone
gets; the max is the design size.

#### Display — Archivo

| Class | Size | Weight | Width | Line-height | Tracking |
|---|---|---|---|---|---|
| `.hero-name` | fitted to width | 850 | 62–125 animated | 0.8 | −0.005em |
| `.contact-title` | `clamp(60, 9.6vw, 150)` | 800 | 96% | 0.86 | −0.05em |
| `.page-title` | `clamp(52, 9.4vw, 140)` | 800 | 112% | 0.86 | −0.045em |
| `.boot-hello` | `clamp(46, 9vw, 132)` | 800 | 112% | 1 | −0.045em |
| `.mq-item` | `clamp(42, 7vw, 104)` | 800 | 125% / 62% | 1.06 | −0.04em |
| `.pp-title` | `clamp(38, 6vw, 92)` | 800 | 100% | 0.94 | −0.042em |
| `.sec-title` | `clamp(38, 5.6vw, 86)` | 750 | 108% | 0.95 | −0.04em |
| `.menu-link` | `clamp(40, 12vw, 72)` | 800 | 110% | 1 | −0.04em |
| `.veil-text` | `clamp(28, 4.4vw, 70)` | 600 | 92% | 1.07 | −0.028em |
| `.pnav-t` | `clamp(26, 3.4vw, 50)` | 700 | 104% | 1.02 | −0.035em |
| `.all-work-t` | `clamp(26, 3.4vw, 46)` | 700 | 104% | 1 | −0.035em |
| `.ab-bio` | `clamp(23, 2.8vw, 42)` | 550 | — | 1.24 | −0.024em |
| `.sec-h` | `clamp(25, 2.6vw, 36)` | 700 | 104% | 1.08 | −0.03em |
| `.take-h` | `clamp(23, 2.5vw, 34)` | 700 | 104% | 1.05 | −0.03em |
| `.pcard-title` | `clamp(23, 2.3vw, 33)` | 550 | — | 1.06 | −0.025em |
| `.trow-k` | `clamp(21, 2.3vw, 32)` | 600 | 104% | — | −0.025em |
| `.ab-cta p` | `clamp(20, 2.2vw, 30)` | 600 | — | — | −0.025em |
| `.take-name` | `clamp(17, 1.7vw, 21)` | 600 | 102% | 1.25 | −0.02em |
| `.tl-title` | `20` | 650 | — | 1.18 | −0.018em |
| `.pcard.sm .pcard-title` | `20` | 550 | — | 1.06 | −0.025em |
| `.prose h3` | `19` | 650 | — | — | −0.015em |
| `.idcard-n` | `17` | 700 | — | — | −0.015em |
| `.row-label` | `17` | 550 | — | — | −0.012em |

**The tracking law:** negative letter-spacing scales with size. Roughly
`−0.05em` at 150px down to `−0.012em` at 17px, and `0` at body size. Never apply
negative tracking to text below 17px, and never apply positive tracking to
Archivo — positive tracking belongs to the mono face only.

#### Voice — Instrument Serif italic

| Class | Size | Line-height | Use |
|---|---|---|---|
| `.quote` | `clamp(24, 2.7vw, 36)` | 1.22 | A pulled quote inside a project body. Wrapped in orange `"` marks. Max 30ch. |
| `.pp-sub` | `clamp(21, 2.5vw, 34)` | 1.16 | A project's second line. Max 34ch. |
| `.veil-cta-note` | `clamp(18, 1.7vw, 24)` | 1.25 | The sentence next to the intro's exit button. |
| `.tl-place` | `19` | 1.2 | The school or company on a timeline card, under a hairline. |
| `.veil-text em` | `1.06em` | inherit | The `*asterisked*` phrase inside the intro statement. |
| `.titem em` | `1.1em` | inherit | A language level ("C1 — fluent"). |

**Where the voice is allowed:** a place, a level, a quotation, or the single
phrase in a statement that carries the whole statement. That is the complete
list. It is never a heading and never a UI label.

#### Text — Archivo

| Class | Size | Line-height | Colour | Measure |
|---|---|---|---|---|
| `body` | 17 | 1.6 | `--ink` | — |
| `.prose p` | 17.5 | 1.72 | `--ink-2` | 66ch |
| `.prose li` | 17 | 1.62 | `--ink-2` | 66ch |
| `.pp-lead` | `clamp(17, 1.5vw, 21)` | 1.55 | `--ink-2` | 56ch |
| `.lede` | `clamp(17, 1.4vw, 20)` | 1.55 | `--muted` | 54ch |
| `.contact-l p` | `clamp(16, 1.4vw, 19)` | — | `--muted` | 40ch |
| `.pcard-sub` | 16 | 1.35 | `--muted` | — |
| `.foot-note-text` | 16 | 1.55 | `--on-accent` | 680px box |
| `.trow-v` | 15.5 | — | `--muted` | — |
| `.input`, `.send` | 15.5 | — | `--form-fg` | — |
| `.btn`, `.link-arrow` | 15 | — | contextual | — |
| `.take-note` | 15 | 1.5 | `--muted` | — |
| `.nav-link` | 14.5 | — | paper @ 66% | — |
| `.shot-cap`, `.fact dd` | 14.5 | 1.5 / 1.4 | `--muted` / `--ink` | 64ch |
| `.row-note` | 14 | — | `--muted` | — |
| `.btn-sm`, `.topic` | 13.5 | — | contextual | — |
| `.tools li`, `.idcard-s`, `.field-label` | 13 | — | `--ink-2` / `--muted` | — |

**The measure law:** every run of prose has a `max-width` in `ch`. Long-form
text is 66ch, a lede is 54ch, an intro is 56ch, a caption is 64ch. `text-wrap:
pretty` is on every paragraph and `text-wrap: balance` on every heading that can
wrap. Do not ship a paragraph without a measure.

#### Labels — Geist Mono

All uppercase with positive tracking. The size ladder is deliberately narrow:
8.6px to 12.5px.

| Class | Size | Tracking | Colour |
|---|---|---|---|
| `.tl-readout` | 12.5 | 0.1em | `--accent-ink` |
| `.tag` | 12 | 0.075em | `--muted` |
| `.tl-date`, `.tl-year`, `.menu-link .n` | 12 | 0.02–0.08em | `--muted` / `--faint` |
| `.eyebrow`, `.veil-eyebrow`, `.boot-meta`, `.tl-top` | 11.5 | 0.09em | `--muted` / `--faint` |
| `.sec-n` | 11.5 | 0.08em | `--accent-ink` |
| `.back`, `.pnav-back`, `.sort` | 11.5 | 0.08em | `--muted` |
| `.pcard-date` | 11.5 | 0.06em | `--muted` |
| `.idcard-m` | 11.5 | 0.04em | `--muted` |
| `.all-work-k` | 11 | 0.1em | `--muted` |
| `.pnav-m`, `.shot-n`, `.count`, `.filter .n` | 11 | 0.06–0.08em | `--muted` / `--faint` |
| `.fact dt`, `.rail-h`, `.row-kind`, `.tl-type`, `.tl-today span` | 10.5 | 0.08em | `--muted` |
| `.flag` | 10.5 | 0.08em | `--ink` |
| `.foot-eyebrow` | 10 | 0.12em | on-accent @ 62% |
| `.foot-note-label` | 10 | 0.14em | on-accent @ 60% |
| `.hero-badge text` | 8.6 | 0.08em | `currentColor` |

**The tracking law, inverted:** the smaller the mono label, the wider the
tracking. 0.14em at 10px, 0.06em at 12px. This keeps the optical density of
every label row identical regardless of size.

### The three utility classes

`.mono` · `.voice` · `.tabular` — use these rather than re-declaring a family.
`.tabular` (`font-variant-numeric: tabular-nums`) belongs on any number that
changes in place, such as the live clock.

---

## 4 · Layout & Spacing

### The shell

```
.shell { width: 100%; max-width: 1280px; margin: 0 auto; padding: 0 var(--gutter) }
```

Every page's content sits in a `.shell`. **The gutter is the one number that
protects the whole site from touching the screen edge:**
`clamp(24px, 4.6vw, 48px)`. The low end (24px) is what a phone gets — 20px and
below reads as text pinned to the bezel.

> **The `.shell` padding trap.** Several blocks that live on a `.shell` need
> vertical padding. They **must** use `padding-block`, never the `padding`
> shorthand — `padding: 40px 0` resets the horizontal gutter to zero and presses
> the whole page against the screen edge. `.pp-body` and `.tl-head` carry an
> in-file comment about this because it has been the source of a real bug.

Two blocks deliberately sit wider than the shell, and only two:

| Block | Width | Why |
|---|---|---|
| `.foot` | `min(1360px, 100% − 40px)` | Its rounded crown has to read as an object *under* the page, not a block inside it. |
| `.atlas` (Outside) | `min(1560px, 100% − 2 × clamp(24px, 3vw, 40px))` | A map is a spread, not an illustration in a column. The formula collapses back to the gutter below the shell's own width, so a phone still gets its margins — the gutter rule is bent at desktop scale only, never broken. |

### Vertical rhythm

Section spacing is fluid and comes from a three-step scale. Do not invent a
fourth.

| Step | Value | Where |
|---|---|---|
| small | `clamp(38px, 4.5vw, 64px)` | Between body sections on a project page |
| medium | `clamp(70px, 9vw, 130px)` | Between acts on About; the contact block |
| large | `clamp(110px, 13vw, 190px)` | Above the featured grid — the breath after the hero |

Page-level offsets always reserve the nav:
`padding-top: calc(var(--nav-h) + clamp(…))`. `--nav-h` is `60px` — a
*reservation*, not the pill's measured height (which is 14 + 48 = 62px). Use the
token; do not measure the pill.

### Grids

| Grid | Desktop | ≤980 | ≤720 | ≤560 |
|---|---|---|---|---|
| `.feat-grid` (home) | 2 columns, gap `clamp(40,5vw,66) / clamp(16,1.8vw,26)` | — | 1 column, 44px | — |
| `.work-grid` (index) | 3 columns, gap `clamp(34,4vw,54) / clamp(14,1.8vw,24)` | 2 columns | — | 1 column |
| `.pp-body` (project) | `250px` rail + `1fr` content, gap `clamp(30,5vw,90)` | — | — | — |
| `.contact-grid` | `1fr` + `0.92fr`, gap `clamp(32,5vw,76)` | — | — | — |
| `.take-grid` | 2 columns | — | 1 column | — |
| `.ab-grid` (About) | `1fr` + `270px` | — | — | — |
| `.race-grid` (Outside) | 2 columns, gap `clamp(44,5.6vw,84) / clamp(16,1.8vw,26)`; every second card offset down by `clamp(26,4.4vw,72)` | — | 1 column, no offset | — |

Row gaps are always larger than column gaps in the card grids — roughly 2.5×.
That is what keeps a grid of cards reading as rows of work rather than a
checkerboard.

Every grid column is `minmax(0, 1fr)`, never `1fr`. `1fr` has a `min-width:auto`
floor and a long unbroken word will blow the grid out.

### Breakpoints

The system is **desktop-down**. There are seven breakpoints and each exists for
a named reason. Do not add one without a reason you can write in a sentence.

| Max-width | What changes |
|---|---|
| `980px` | Work grid 3 → 2 columns |
| `900px` | Project page: rail un-sticks and stacks above the content |
| `860px` | **The structural break.** Nav becomes a burger + full-screen menu · hero re-weights with spacers and a hairline · About un-pins and the timeline becomes vertical · contact grid stacks |
| `720px` | Featured grid → 1 column · takeaways → 1 column · toolkit rows stack · next-project row tightens |
| `640px` | Footer compresses · back-to-top shrinks · intro CTA goes full-width |
| `560px` | Work grid → 1 column · `.all-work` tightens |
| `520px` | Hero badge 64px · hero buttons 42px |

Plus `@media (hover: hover) and (pointer: fine)` — hover styling is gated on a
real pointer so a phone never gets a stuck hover state.

### Stacking (`z-index`)

A small, closed ladder. **Nothing new may be inserted between these values
without adding a row here.**

| z | Layer |
|---|---|
| `100` | `#boot` — the greeting splash |
| `90` | `.lb` — the lightbox |
| `70` | `.progress`, `.cv-pop` |
| `60` | `.nav` |
| `59` | `.menu` — deliberately *under* the nav, so the pill stays clickable while the menu is open |
| `55` | `.to-top` |
| `40` | `.veil` — the intro page |
| `0–6` | In-component stacking (footer trees and tiles, timeline cards and stems, the card's "Featured" flag). All scoped inside a positioned parent. |
| `0` | `.sky` — the night canvas, behind everything |

---

## 5 · Elevation & Depth

Depth in this system is **almost never a shadow**. Hierarchy is carried by, in
order of preference:

1. **A hairline.** `--rule` separates; `--rule-2` outlines. Most "cards" in this
   site are a 1px border and a radius, nothing more.
2. **A surface step.** `--paper-2` against `--paper`. One step only — there is
   no `--paper-3`.
3. **Type scale and whitespace.** A heading is louder because it is bigger and
   has more room, not because it floats.
4. **The grain.** A 220×220 SVG `fractalNoise` tile on `<body>`, alpha `.15`
   black in light and `.07` white in dark. It is what makes the paper a
   material. It is never applied to a component.
5. **A shadow — last.**

### The one shadow token

```css
--lift: 0 1px 0 rgba(16,16,20,.04), 0 26px 50px -30px rgba(16,16,20,.34);
```

Two layers: a 1px contact edge, and a wide, very negatively-spread ambient. It
is deliberately soft and low-contrast — an object resting on paper, not floating
over it.

`--lift` is used **five times in the entire stylesheet**: the CV menu, the
back-to-top button, the lightbox image, the id card, and the current timeline
card. Nothing else.

### The four hard-coded shadows

Each is a specific object with a specific job, and each is listed here so the
list stays closed.

| Where | Shadow | Why not `--lift` |
|---|---|---|
| `.nav` | `0 14px 34px -20px rgba(0,0,0,.55)` | A fixed pill over moving content needs a tighter, darker drop to stay legible over a photograph. |
| `.nav-active::before` | `inset 0 1px 0 …16%` + `0 2px 5px rgba(0,0,0,.08)` | An inner highlight — the pill's active state is a lit surface inside a dark pill, which is the opposite of a lift. |
| `.foot-tile` | `0 10px 24px -12px` → `0 22px 40px -14px` on hover | These are physical tiles that lift toward you. The hover shadow is part of the gesture. |
| `.tl-cursor` | `0 0 0 6px accent @ 14%` | Not a shadow — a halo ring that makes a 15px dot readable against a busy axis. |

### The anti-slop rule

> There is no glow, no coloured shadow, no blur halo, no glassmorphism panel, no
> gradient text, and no "shimmer". These are the house marks of generated
> interfaces and they are banned here.

The exceptions, all four of them, are deliberate and complete:

- **`backdrop-filter: blur(10px)`** appears exactly once, on `.lb` — a
  full-screen scrim that has to sit over arbitrary page content.
- **Gradients** are a closed list of six: the footer's warm vertical lift
  (accent → accent+12% white), the footer's radial sheen, the nav pill's inner
  highlight, the timeline stem's fade from rule to accent, and two
  `mask-image` edge fades (the timeline stage and the marquee). No gradient
  anywhere else.
- **`.foot::after`** uses a 240px spread shadow as a *paint trick*, to bleed the
  footer's colour into the browser's overscroll area past the end of the
  document. It is clipped so it adds no layout and no scroll.
- **`.tl-cursor`**'s ring, above.

---

## 6 · Shapes

Two shape languages, and the boundary between them is the point.

**Pills and circles** for anything you act on — buttons, the nav, chips,
filters, icon buttons, the dot itself. **Soft rectangles** for anything that
*holds* something — media, panels, forms, cards.

### The radius ladder

| Radius | Where |
|---|---|
| `3px` | The focus ring's own corner |
| `2.5px` | A language flag (it needs to read as a flag, not a pill) |
| `4px` | A timeline Gantt bar |
| `10px` | A 38px row icon |
| `11px` | A row inside the CV menu |
| `12px` | Inputs, the submit button, the lightbox image |
| `13px` | A 48px social tile |
| `14px` | Small card media, the next-project thumbnail |
| `16px` | A screenshot frame, the CV menu itself |
| `18px` | Card media, a timeline card, the footer note |
| `20px` | The id card |
| `22px` | The contact form, a project cover |
| `clamp(20px, 2.2vw, 28px)` | The `.all-work` frame |
| `clamp(20px, 2.4vw, 30px)` | The takeaways panel |
| `27px` (22px ≤640) | A footer tile |
| `30px 30px 0 0` | The footer crown |
| `999px` | Every pill |
| `50%` | Every circle |

**The law:** radius grows with the size of the thing. A 38px tile is 10px; a
106px tile is 27px — both land near a 1 : 3.9 ratio. If you are choosing a
radius for something new, divide its short side by 4 and round to the nearest
step on the ladder above.

**The `--r` handshake.** A reveal that clips media (`.rv-media`) animates
`clip-path: inset(… round var(--r, 18px))`. Any element with a non-18px radius
that also reveals **must** re-declare `--r` alongside `border-radius`, or the
clip will round differently from the box during the animation. `.pcard.sm`
(14px) and `.pp-cover` (22px) already do this.

### Aspect ratios

| Ratio | Where |
|---|---|
| `16 / 11` | A large project card's cover |
| `4 / 3` | A small project card's cover; the next-project thumbnail |
| `16 / 8` | A project page's hero cover |
| `4 / 5` | The optional hero portrait |
| `1 / 1` | The scroll badge |

Every media box declares its ratio so the page never reflows when an image
lands. Gallery screenshots are the exception: they are shown at their natural
ratio, whole and uncropped, because a screenshot that is cropped is evidence
that has been edited.

### The dot

The dot is sized in `em` so it belongs to its type:

| Instance | Size |
|---|---|
| `.dot` (ends a title) | `0.17em`, `margin-left: .06em` |
| `.hero-dot` | `0.16em`, `margin-left: .05em` |
| `.boot-hello .bd` | `0.17em` |
| `.mq-sep` | `0.14em` |
| `.trow-k::before` | `0 → 0.2em` on hover (the width opens) |
| `.take-name::before`, `.flag::before` | `6px` |
| `.filter.on::before`, `.idcard-s i` | `7px` |
| `.tl-v-node` | `12px`, 2px border |
| `.tl-today i` | `11px`, 2px accent border |
| `.tl-cursor` | `15px` + 6px halo |

---

## 7 · Motion

### Philosophy

**Motion here is not feedback; it is staging.** Three of the site's four scenes
are driven entirely by scroll position — the user is not watching an animation,
they are moving through one. Everything else is short and functional.

Nothing loops except three things, each for a reason:

| Loop | Duration | Why it is allowed |
|---|---|---|
| `.badge-ring` | `20s` linear | It is a "scroll to explore" affordance; a still one would not read as an invitation. |
| `.fir` sway | `5.4–7.2s`, four offsets | The footer is a landscape. A still forest is a graphic; a moving one is a place. |
| `.marquee` | speed-coupled | It is a list of interests that is *literally* about momentum, and its speed follows your scroll velocity (`.028 px/ms` at rest, up to `.26`). |

### The easing set

| Token | Curve | Use |
|---|---|---|
| `--ease` | `cubic-bezier(.2,.7,.2,1)` | The default. Hovers, gaps opening, small transforms. |
| `--ease-expo` | `cubic-bezier(.16,1,.3,1)` | **Arrivals.** Anything entering the viewport or travelling a long distance. Fast out of the gate, long settle. |
| `--ease-io` | `cubic-bezier(.65,0,.35,1)` | Symmetric in-out. Used once: the splash closing into the dot — a shape collapsing on itself needs to accelerate and decelerate equally. |
| `cubic-bezier(.32,.72,0,1)` | — | The nav's active pill only. Slightly snappier than `--ease-expo`; the pill must arrive before the label's colour finishes changing. |
| `cubic-bezier(.34,1.56,.64,1)` | — | Overshoot. Used once: the footer tiles, which are physical objects. **Do not use overshoot anywhere else.** |

### The duration ladder

| Band | Range | Use |
|---|---|---|
| Instant | `140–220ms` | Colour, opacity, a small state flip |
| Quick | `250–350ms` | Hover transforms, background swaps, the nav pill |
| Base | `400–600ms` | A panel opening, a menu clipping in, a card's stem |
| Arrival | `800–1150ms` | Reveals, word masks, image scale-down |
| Cinematic | `1.5s` | The single slowest: `.rv-media` image settling from `scale(1.12)` |

**Rule:** the further a thing travels, the longer it takes, and the more it
should use `--ease-expo`. A 3px hover nudge at 800ms feels broken; a 26px
reveal at 200ms feels cheap.

### The reveal system

Every animated block carries `.rv` plus a variant, and gets `.in` the first time
it enters the viewport (`IntersectionObserver`, `rootMargin: 0 0 -10% 0`, then
`unobserve`). `useReveals(rootRef, deps)` in `lib.jsx` wires it.

| Variant | Hidden state | Arrival |
|---|---|---|
| `.rv-up` | `opacity 0`, `translateY(26px)` | `.8s` opacity + `1.05s` transform, `--ease-expo` |
| `.rv-fade` | `opacity 0` | `.9s ease` |
| `.rv-media` | `clip-path: inset(100% 0 0 0 round var(--r,18px))`, inner image at `scale(1.12)` | `1.15s` clip + `1.5s` image, `--ease-expo` |
| `.words` | each `.wi` at `translateY(160%)` inside an `overflow:hidden` mask | `.95s`, staggered `42ms` per word |

Two custom properties tune it: **`--d`** delays a whole block (set inline, in
seconds) and **`--i`** is the word index inside a title. Card grids stagger by
column: `(i % 2) * .09s` on the home grid, `(i % 3) * .07s` on the work grid, so
a *row* arrives together.

> **The `.js` gate.** Every hidden state is written as `.js .rv-up { … }`. The
> `js` class is added to `<html>` by the inline script in `index.html:79` before
> first paint. With JavaScript off, no hidden state exists and the page is fully
> readable. This gate is not optional — never write a reveal's hidden state
> without it.

> **Descender room.** `.words .w` carries `padding: .18em .1em .28em` with
> matching negative margins. The padding gives descenders room inside the
> `overflow:hidden` mask; the negative margins give the spacing and line
> wrapping back. Remove either half and either the `g` clips or the heading's
> rhythm breaks.

### Scroll

- **Lenis** smooth scroll, `lerp: .14`, wheel only. It is **disabled** on coarse
  pointers and under reduced motion (`app.jsx:394–406`), because native
  momentum on a phone is better than any emulation.
- Scroll handlers are `requestAnimationFrame`-throttled through
  `useScrollFrame` — one rAF, one listener, `{ passive: true }`. Never attach a
  raw scroll listener.
- **Read geometry before writing style.** The hero's frame reads every rect it
  needs, then writes font variations and clip paths, so no frame forces a
  synchronous layout.
- **Composite, don't repaint.** `will-change: transform` is declared on exactly
  five elements: `.nav`, `.nav-active`, `.tl-track`, `.marquee-track`, and
  `#featured-dot::after`. `will-change: clip-path` on `#boot` and `.veil`. That
  list is the budget — a `will-change` on every hover target costs more than it
  saves.

### Reduced motion

`@media (prefers-reduced-motion: reduce)` appears **eight times** and every
scene has a non-animated form that is not a degraded one:

| Scene | Reduced-motion form |
|---|---|
| Reveals | All shown at once — `opacity:1 !important`, no transform, no clip |
| Home intro | `.intro-static` — the same words, the same orange page, as a normal section |
| Timeline | `.tl-v` — a real vertical timeline with a descending dot |
| About bio | Fully opaque, no fill |
| Splash | Cross-fades out instead of closing into the dot |
| Badge, firs, marquee | Animation off |
| Footer toast | Shown in place, no keyframes |
| Page transition | No enter animation |

JS respects it too: `reduceMotion()` in `lib.jsx` gates Lenis, the hero's
pointer tracking, the marquee loop and the splash's clip-path hand-off.

---

## 8 · Iconography & Imagery

### The logo

An `a.` monogram — Archivo at width 125 / weight 900, with the square period
replaced by the round orange dot. It is the charter in one glyph. `1098 × 552`
viewBox, the letter takes `currentColor`, the dot takes
`var(--logo-dot, var(--accent))` so a surface can override it (the footer paints
it in its own ink). Regenerate the outline only if the display face changes.

### The icon set

`src/icons.jsx` — 34 icons, hand-kept, one flat object. The rules:

- **`currentColor` only.** Never a hard-coded fill or stroke.
- **Stroke icons:** `viewBox="0 0 24 24"`, `stroke-width 1.6`, round caps and
  joins. **Fill icons:** brand marks (GitHub, LinkedIn, Notion) and solid
  glyphs.
- **Sized by the consumer**, not the icon: `.btn svg` is 15px, `.btn-sm svg`
  13px, `.link-arrow svg` 14px, `.soc svg` 19px, `.foot-tile svg` 48px.
- **Spread props:** every icon ends with `{...p}` so a call site can pass
  `style` or `className`.
- `ArrowUR` (up-right) is the site's "this goes somewhere" mark. On hover it
  translates `(3px, -3px)` — that gesture is repeated on the button, the card,
  the row, and the next-project circle, and it should stay identical everywhere.

Adding one: paste the SVG into the block at the bottom of `icons.jsx`, convert
fills/strokes to `currentColor`, add `{...p}`, name it, and reference the name
from `data.js`.

### Borrowed logos

Third-party marks (schools, companies, tools) are pulled down to one ink
silhouette so they never fight the charter. Three filter tokens do it:

| Token | Light | Dark | For |
|---|---|---|---|
| `--logo-mono` | `grayscale(1) brightness(0)` | `… invert(1)` | The resting state of a timeline logo (also `opacity: .38`) |
| `--logo-mono-on` | `none` — real colours | `… invert(1)` — still white | The step you are actually on |
| `--logo-flip` | `none` | `invert(1)` | A mark that is already a single black shape (Notion, GitHub) |

On a dark page a navy or black mark would vanish, so `--logo-mono-on` stays
white there. That asymmetry is intentional.

**Sizing:** a timeline logo is capped on *two* axes — `max-height: 24px` and
`max-width: 118px` — so a six-to-one wordmark and a compact signature carry the
same visual weight. Negative margins (`-9px 0`) keep it out of the row's height,
because the travelling timeline measures card heights.

**Toolkit marks** unroll on row hover by animating `max-width: 0 → 46px`, not a
square box — a wordmark like Canva keeps its proportions instead of being
squeezed into 16×16.

**Flags** are drawn SVGs, not emoji (Windows renders no flag emoji at all). They
get `height: 12px`, `border-radius: 2.5px`, and a `0 0 0 1px` hairline so the
white band of a tricolour still reads against paper.

### Project covers

A project's `cover` is either an image path/URL, or the name of one of the 27
SVG artworks in `src/covers.jsx` — flat, two-tone, 320×180, built from the
palette. They exist so a project without a screenshot still gets a real cover
rather than a grey box. `CoverArt` resolves the two cases; an unknown name falls
back to `Cover.Generic`.

### Photographs

Never ship a raw photograph.

```
npm run images          # only what changed
npm run images -- --all # rebuild everything
```

`tools/optimize-images.mjs` writes WebP copies at `480 / 720 / 960 / 1440 /
1920` into `assets/opt/`, plus `assets/opt/manifest.js` carrying each original's
true pixel size and the copies that exist. `Img` in `lib.jsx` reads that
manifest and renders a `<picture>` with a `srcset` and explicit `width`/`height`
— so the box is the right shape before a byte arrives, and a phone downloads
30 KB instead of 1.5 MB. Originals are never touched; the lightbox still serves
them.

Each grid tells the browser which copy it needs through a `sizes` string —
`CARD_SIZES.lg` / `CARD_SIZES.sm` in `lib.jsx`, and the project cover's own
`sizes`. **If you change a grid's column count or the gutter, update the
matching `sizes` string.** It is the one piece of layout knowledge that lives
outside the stylesheet.

Loading: the first two cards on the home grid and the first three on the work
grid are `eager`; the project page's cover is `eager` + `fetchpriority="high"`.
Everything else is lazy.

---

## 9 · Voice & Content

### Where the content lives

`data.js` — **the only file you edit to change what the site says.** It holds
`profile`, `copy`, `projects` and `homeDeck`. `profile.outside` carries the
Outside page: `pbs`, `races`, `countries`, `supports`. The stylesheet never
mentions a project, a date or a name; the components never hard-code a sentence
that `copy` can override.

Editing `data.js` needs **no rebuild** for the site itself. It does need
`npm run build` to regenerate the per-project share pages, so run it after
adding or renaming a project — and `npm run map` after adding a country, because
the world is drawn ahead of time from that list. `npm run build` warns if the
two have drifted apart.

### Tone

First person, plain, specific. British-influenced English (`en-GB` date
formatting throughout). Contractions are fine. The site is confident about the
work and light about itself.

- ✅ "A mix of coursework and weekend builds. Each one is a small bet on a tool
  I wanted to get fluent in."
- ✅ "No newsletter, no forwarding. Just me reading it."
- ✅ "Nothing in this bucket yet."
- ❌ "Leveraging cutting-edge analytics to drive impactful outcomes."
- ❌ "Welcome to my portfolio!"

Errors name the way out rather than apologising: *"Something went wrong — email
me directly at …"*.

### The em dash

`—` with spaces around it is the site's sentence joint, and it is also a
**parser boundary**: `PERIOD_SPLIT = /\s+[—–]\s+/` splits timeline periods and
project titles on it. An em dash without surrounding spaces is safe; one with
spaces will split a title into a main line and a subtitle. That is usually what
you want — `"F1 Duel — Prediction Game"` becomes a title and a card subtitle —
but know that you are doing it.

### Emphasis

In `profile.tagline`, `*asterisks*` set a phrase in the italic serif. **Use it
once, on the phrase that carries the sentence.** `emphasise()` renders it;
`fillWords()` splits the same string into per-word spans for the scroll fill.

### Structured body copy, without HTML

A project `section.body` entry is a string (a paragraph) or one of:

| Form | Renders |
|---|---|
| `"…"` | `<p class="prose">` |
| `{ h: "…" }` | `<h3>` |
| `{ list: ["…", "…"] }` | A `—`-bulleted list |
| `{ quote: "…" }` | `<blockquote class="quote">` — italic serif, orange quote marks |

**Never put HTML in `data.js`.** If a shape is missing, add it to `Section` in
`work.jsx`, not a `dangerouslySetInnerHTML`.

### Copy overrides

`copy.introCta`, `copy.workLede`, `copy.contactLede`, `copy.aboutCta`. Each has
a default in its component via `COPY(key, fallback)`; delete the key and the
default returns. Add a new one only when the sentence is genuinely editorial.

### The graceful-degradation contract

Every optional field disappears cleanly. A project with only
`id / title / cat / year / summary / cover` still gets a complete page — the
rail, the gallery, the attachments, the takeaways and the subtitle simply do not
render. **Any new content block must follow this.** No empty headings, no
placeholder text, no "Coming soon".

---

## 10 · Components

Each spec gives: what it is, its anatomy, its variants, its states, and the
rules that are easy to break. Source is `assets/css/site.css` unless noted.

---

### 10.1 Button — `.btn`

A pill. The only general-purpose action in the system.

**Anatomy** — `[ label ][ gap 9px ][ icon 15px ]`, `height 46px`,
`padding 0 20px`, `radius 999px`, `1px` transparent border (so a filled and an
outline button are the same size), `15px / 550 / −0.005em`, `white-space: nowrap`.

**Variants**

| Variant | Rest | Hover |
|---|---|---|
| `.btn-ink` | `--ink` bg, `--paper` text | **Turns orange.** `--accent` bg, `--on-accent` text; icon translates `(3px,-3px)` |
| `.btn-line` | Transparent, `--rule-2` border, `--ink` text | Border → `--ink`, bg → `--paper-2` |
| `.btn-accent` | `--accent` bg, `--on-accent` text | **Turns ink.** `--ink` bg, `--paper` text |

`.btn-ink` and `.btn-accent` swap into each other on hover. That is the
system's primary-action gesture and it should not be redefined.

**Size** — `.btn-sm`: `38px` tall, `0 15px`, `13.5px`, `gap 7px`, `13px` icon.

**States** — `:active { transform: scale(.98) }` · `:focus-visible` gets the
global ring · disabled is `opacity .4` + `cursor: not-allowed` (submit only).

**Rules**
- Never more than two buttons in a row. The hero has exactly two; the id card
  has up to three but they are `btn-sm` chips.
- The trailing icon is `ArrowUR` for "goes somewhere", `Download` for a file,
  `Check` for a completed action. Nothing else.
- A button that is really navigation at page scale is not a `.btn` — see
  `.all-work` and `.pnav-next`.

---

### 10.2 Navigation pill — `.nav`

A fixed, centred dark pill holding the logo, the `NAV` links, a theme toggle and
the CV button.

**Anatomy** — `fixed; top:14px; left:50%; translateX(-50%)`, `padding: 6px`,
`radius 999px`, `background: var(--ink)`, `color: var(--paper)`,
`max-width: 100vw − 24px`, shadow `0 14px 34px -20px rgba(0,0,0,.55)`.

**The sliding indicator.** `.nav-active` is an absolutely positioned pill at
`width: calc((100% - (var(--nav-n) - 1) * 2px) / var(--nav-n))`, translated by
`calc(index * 100% + index * 2px)` (the `2px` is the grid gap). **`--nav-n` is
`NAV.length`, written inline by `Nav`.** It used to be a literal `/ 3`, which
made the indicator the wrong width and put it under the wrong label the day a
fourth tab was added — the count must never be typed into the stylesheet
again. Its visible
surface is `::before` at `inset: 2px` — a vertical `color-mix` highlight plus an
inset 1px top light. It sits at `z-index: -1` inside an `isolate` container, so
it slides *behind* the labels. Transition `.28s cubic-bezier(.32,.72,0,1)`;
`opacity: 0` when no nav item is active (home, 404, a project page).

**Auto-hide.** The pill hides on sustained downward scroll and returns on any
upward move (`app.jsx:121–141`). Three guards make it feel deliberate rather
than twitchy: it never hides above `320px`; it needs `48px` of sustained
downward travel to hide and only `16px` upward to return; and travel resets on
direction change. Overscroll is clamped so iOS rubber-banding cannot trigger it.
`.nav.hidden:focus-within` brings it back — a keyboard user is never left
chasing a hidden pill.

**Mobile (≤860px)** — the pill spans `left:12px; right:12px`, drops the links
and the theme toggle, and keeps the logo, the CV button and a burger. The burger
opens `.menu`.

**Rules**
- The pill's own colour is `--ink` in **both** themes. It is an object on the
  page, not a surface of it.
- Nav text uses `color-mix(in oklab, var(--paper) 66%, transparent)` at rest and
  full `--paper` when active or hovered. Hover is gated on `(hover:hover) and
  (pointer:fine)`.
- Focus inside the pill uses `outline-offset: -3px` so the ring stays inside the
  pill's radius.

---

### 10.3 Full-screen menu — `.menu`

Mobile navigation. Not a drawer — a page.

`fixed; inset:0`, `background: var(--paper)`, `z-index: 59`, opened by
animating `clip-path: inset(0 0 100% 0) → inset(0)` over `.6s --ease-expo`.
Items are `clamp(40px, 12vw, 72px) / 800 / wdth 110%`, each prefixed with a mono
`01`–`04`, each on a `--rule` hairline, staggered in at
`calc(120ms + var(--i) * 60ms)`.

Behaviour: `Escape` closes · `body { overflow: hidden }` while open · Lenis is
stopped and restarted · items get `tabIndex={-1}` when closed so they are not in
the tab order · the active route is `--accent`.

---

### 10.4 Project card — `.pcard`

The grid unit. One component, two sizes.

**Anatomy**

```
┌─────────────────────────────┐
│ .pcard-media                │  radius 18 / 14, --r matches
│   CoverArt (object-fit:cover)│  ratio 16/11 (lg) · 4/3 (sm)
│   .flag  "Featured"  ← opt   │  absolute, top/left 12px
└─────────────────────────────┘
  .pcard-title  + ArrowUR        550 weight, icon hidden at rest
  .pcard-sub                     muted, 16px / 14.5px
  .pcard-date  ← sm only         mono, right-aligned
```

**Variants** — `lg` (home, 2 columns) · `.sm` (work index, 3 columns): 14px
radius, `4/3`, 20px title, 14.5px sub, and the date moves to its own right
column.

**Subtitle logic** (`ProjectCard` in `lib.jsx`) — if the title contains
` — `, the part after the dash becomes the subtitle. Otherwise: `cat` on the
small card, `cat · date` on the large one.

**States** — hover scales the cover `1.035` over `1.1s --ease-expo` and fades in
the `ArrowUR` from `translate(-7px, 7px)`. Both are on `.pcard:hover`, so the
whole card is one target. The card is a single `<a>` with `aria-label={title}`.

**Reveal** — the media is `.rv-media`, the text is `.rv-up` at `+.08s`. The
image arrives, then the words.

**Rules**
- The media box's `background: var(--rule)` is the placeholder. There is no
  spinner and no skeleton shimmer.
- `.flag` is a mono pill with a leading 6px orange dot. It marks exactly one
  pinned project — `featured: true` on one entry in `data.js`.
- Set `eager` on the first row only.

---

### 10.5 Section heading — `Words`

The title component. Splits a string into words, wraps each in an
`overflow:hidden` mask, and optionally appends the orange dot.

```jsx
<Words as="h2" className="sec-title" text="Things I've built" dot dotId="featured-dot" />
```

| Prop | Meaning |
|---|---|
| `text` | The heading. Split on whitespace. |
| `as` | Tag — `h1` / `h2` / `span`. **Always pass the semantically right one.** |
| `className` | `.sec-title`, `.page-title`, `.pp-title`, `.contact-title` |
| `dot` | Append the orange dot to the last word |
| `dotId` | Give the dot an id, so a scene can find and animate it |
| `delay` | Block delay, in seconds, written to `--d` |

**Why the dot sits outside the mask.** The mask has to clip — that is what makes
a word rise out of nothing — and the dot has to be free to grow, because the
home hand-off scales it up to catch a full-screen orange page. `.wn` wraps the
last word and the dot with `white-space: nowrap` so they can never separate
across a line break.

A section head is normally: `.eyebrow` (mono, `--muted`, `margin-bottom: 14px`)
→ `Words` → optionally a `.link-arrow` pushed right by
`.sec-head { justify-content: space-between }`.

---

### 10.6 Contact form — `.form`

A dark card on a light page, in both themes.

**Anatomy** — `background: var(--form-bg)`, `radius 22px`,
`padding clamp(18px, 2.2vw, 28px)`, `gap 16px`. Inside: topic chips → email
field → message field with a live counter → submit → a note.

| Part | Spec |
|---|---|
| `.topic` | Pill, `1px --form-line`, `7px 13px`, `13.5px`, `opacity .72` → `1` on hover; selected inverts to `--form-fg` on `--form-bg`. `aria-pressed`. |
| `.input` | `radius 12px`, `13px 15px`, `15.5px`, transparent bg, `--form-line` border. Focus: border → `--accent`, bg → `form-fg @ 5%`. Placeholder at `opacity .4`. |
| `textarea.input` | `resize: vertical`, `min-height: 132px`, `line-height 1.5`, `maxLength 600` |
| `.count` | Mono 11px at `opacity .5`, live `n / 600` |
| `.send` | `52px`, `radius 12px`, `--form-fg` on `--form-bg` inverted; hover turns orange; disabled `opacity .4` |

**States** — the submit is disabled until the email matches
`/^[^\s@]+@[^\s@]+\.[^\s@]+$/` **and** the message is longer than 6 characters.
Then: `Send` → `Sending…` → `Sent — talk soon` (orange, with a check) → resets
after `3.6s`. On failure, `.form-note` is replaced by `.form-err` naming the
direct email address.

**Delivery** — POSTs JSON to `profile.formspree`. With no endpoint it stays in
demo mode and confirms locally. There is no third state.

---

### 10.7 Quiet row — `.row` / `.trow`

The system's list primitive. Used for attachments, takeaways and the toolkit. It
is deliberately **not a card** — content that is a list should read as a list.

`border-top` on the container, `border-bottom` on each row, `18px` vertical
padding. The hover gesture is `padding-left: 0 → 12px` over `.4–.45s --ease` —
the row steps forward rather than lighting up. On a link row the icon tile picks
up `--accent-ink` and the trailing `ArrowUR` translates `(2px,-2px)`; on a
download row it translates `(0, 2px)` instead.

`.trow` (toolkit) adds a dot that *opens* on hover — `.trow-k::before` animates
`width: 0 → .2em` — and unrolls each item's logo by animating `max-width`.

---

### 10.8 Navigation-scale links — `.all-work`, `.pnav-next`

When navigation is the point of the block, it gets the scale of the content
above it rather than a small link.

**`.all-work`** — a bordered frame (`--rule-2`, `clamp(20px,2.2vw,28px)`)
holding a mono kicker, a `clamp(26px,3.4vw,46px)` title and a circular
`clamp(48px,4.6vw,62px)` go-button. On hover the **whole frame inverts** to
`--ink` and the circle turns orange and translates `(4px,-4px)`.

**`.pnav-next`** — `[thumbnail][title + meta][circle]`. On hover the thumbnail
scales `1.05`, the text slides `6px` right, and the circle fills with `--ink`
and slides `5px`.

These two are the same idea at two scales: *the way out of a page is a real
destination, not a footnote.*

---

### 10.9 Lightbox — `.lb`

`fixed; inset:0; z-index:90`, scrim of `paper @ 92%` plus `backdrop-filter:
blur(10px)` — the **only** blur in the site. Portalled to `<body>` so it escapes
any transformed ancestor. Image capped at `78vh` with `--lift`; caption centred
at 70ch; a 44px close circle top-right; prev/next with a mono `n / total`
readout at the bottom.

---

### 10.10 Small parts

| Part | Spec |
|---|---|
| `.eyebrow` | Mono `11.5px / .09em / uppercase`, `--muted`. Opens most sections. |
| `.tag` | Mono `12px / .075em / uppercase`, `--muted`; `<b>` inside goes `--ink` without changing weight (used for the live clock). |
| `.link-arrow` | `15px / 550` on a `--rule-2` underline; hover darkens the line and opens the gap `8px → 12px`. |
| `.filter` | `16px / 500`, `--muted` → `--ink`; active grows a 7px orange dot before it; a mono count follows in `--faint`. |
| `.sort` | Mono `11.5px`; `.asc` rotates its arrow 180°. |
| `.soc` | `48 × 48`, `radius 13px`, `--paper-2` on `--rule`; hover inverts to `--ink` and lifts `3px`. |
| `.to-top` | `46px` circle (42 ≤640), `--lift`, appears past `1.1 × viewport height`, `tabIndex -1` while hidden. |
| `.progress` | `2px`, `z 70`, `transform: scaleX(var(--p))` from origin `0 50%`; `opacity 0` above `8px` of scroll. |
| `.idcard` | `--paper-2`, `--rule`, `radius 20px`, `--lift`. Avatar is bottom-anchored with the image at `70%` so the head rises out of the bubble, lifted `3px` so the chin never touches the rim. |
| `.take-panel` | An enclosed panel — `--paper-2` on `--rule`, `clamp(20px,2.4vw,30px)`. The last content on a project page, clearly still content. |
| `.flag`, `.pill-up`, `.tools li`, `.topic` | The four pill-shaped chips. All `999px`; all mono except `.tools li` and `.topic`. |

---

## 11 · Scenes

Four set pieces. Each is a single continuous gesture, each has a
reduced-motion twin, and each is the reason the system exists — read these
before changing anything they touch. The Outside page is deliberately *not*
one of them: see 11.5.

### 11.1 The splash — `#boot`

An orange screen with three greetings — *Hello · Bonjour · Hallo*, `420ms`
apart, the last one held — that closes into the dot of the name.

- **Home only.** `window.__splash` is decided before first paint
  (`index.html:97-98`); every other page gets `.no-splash` and the markup is
  removed before it can render.
- `__bootHold = 3 × 420ms = 1260ms`. The app waits for the **full** sequence
  even on a fast connection — a greeting cut in half is worse than no greeting.
- The close: read the target dot's rect, compute `coverRadius`, set
  `clip-path: circle(R at cx cy)`, force a reflow, then animate to
  `circle(r at cx cy)` over `.95s --ease-io`. The target is `#hero-dot` if it is
  fully in view, otherwise the logo's own dot.
- **Safety nets, all three required:** a 12s timeout that fades the splash out
  if the app never mounts · `scrollRestoration = 'manual'` so a reload starts at
  the top where the dot is · a reduced-motion path that cross-fades.

### 11.2 The home scroll — hero → veil → grid

Three acts on one gesture, over a `330vh` pinned scene. Thresholds are fractions
of the viewport height (`home.jsx:109`):

| Range | What happens |
|---|---|
| `0 → .18vh` | The name rests. Letters swell under the cursor. |
| `.18 → .86vh` | The dot **opens**: a `clip-path` circle grows from the dot's radius to `coverRadius`, `easeIO`. The name tightens from its rest widths toward its scrolled widths. |
| `.86vh → S0` | The orange page holds the screen. |
| `.95 → 2.0vh` | The statement fills in, word by word, `0.2 → 1.0` opacity with a `3.4`-word soft head. Past `72%`, the exit CTA rises. |
| `S0 → S1` | The page **closes** into the dot of "Things I've built●". `S1` is where that heading sits 30% down the screen. |

**The hand-off.** Below a `56px` radius the fixed veil stops and
`#featured-dot::after` — a 120px disc on its own composited layer — takes over,
scaled by a `--catch` variable. This is not an optimisation, it is a
correctness fix: a fixed overlay is painted a frame behind a touch scroll, and
WebKit does not invalidate the previous, larger circle when the page scrolls at
the same time, leaving a comb of orange ring fragments. A separate layer has
nothing to invalidate — the compositor rescales a texture rasterised once at
full size, so it also stays crisp all the way down. **Do not "simplify" this
into a transform on the dot.**

`window.__topAccent(bool)` keeps `<meta name="theme-color">` on whatever is
actually at the top of the screen, so on iOS the orange runs under the Dynamic
Island instead of stopping at a grey bar.

Reduced motion: `.intro-static` — the same orange page as an ordinary section.

### 11.3 The timeline

Three ideas hold it together:

1. **The axis is real time.** A month is always the same number of pixels. A
   step is a bar of its actual length. "Today" sits where today is.
2. **You never move.** Time slides past a dot fixed at 30% of the screen. The
   scroll decides *when* you are, not where.
3. **Speed follows content.** Rather than stopping on each date, time slows
   around every start and end — a smooth speed curve, integrated once and
   inverted — and hurries through empty years.

Cards live above the axis, one per Gantt lane, one at a time per lane: the next
arrives exactly as the previous finishes leaving. A card on the current step
gets `--accent` border and `--lift`; an upcoming one is dashed with a
translucent fill and an `Upcoming` pill. Short screens get `.is-tight`, which
narrows the card and tightens its type so it always fits the stage.

Below 860px, and under reduced motion, `.tl-v` is a real vertical timeline with
a descending orange dot — not a fallback, a second design.

**Dates** parse from `period` strings: `"2025-09 — Present"`, `"2022-09 —
2025-06"`, `"Fall 2026"`. Only an em/en dash *with spaces* separates the two
sides, so ISO dates stay intact.

### 11.4 The footer

The bottom half of the site's arc — the night sky is the top half.

- A `min(1360px, 100% − 40px)` orange slab with a `30px` crown, a warm vertical
  gradient and a radial sheen.
- **The forest:** 22 seeded firs above the top edge, four sway durations
  (`5.4 / 6.0 / 6.6 / 7.2s`) at different offsets so the line never pulses in
  unison. Hover gusts one tree. `width: max-content` on the row so the grove is
  always its own size and is simply cropped by the footer's edges — without it
  the trees squash on narrow screens.
- **Three tiles:** `106 × 106`, `radius 27`, overlapping `−24px`, fanned by
  `rotate((i − 1) × 4deg)`. Hover lifts `12px` and scales `1.1` with the one
  overshoot curve in the system. The mail tile copies the address and shows a
  `1.5s` toast rather than opening a mail client.
- **The bleed:** `.foot::after` paints a `240px`-spread shadow in the footer's
  own colour, clipped to below the document, so the browser's overscroll area
  and the strip under an iOS home bar are orange too. `env(safe-area-inset-bottom)`
  keeps the home indicator *on* the orange rather than below it.

---

### 11.5 The Outside page — the one with no gesture

`/outside/` is the exception that proves the rule above: it is the only page
with no set piece. It has the reveals every page has and nothing else — no pin,
no scrub, no hand-off. That is the point. The work pages earn their staging;
the personal one would look like it was trying if it had any.

What carries it instead is register. Same palette, same faces, same dot — but
the numbers are set at display size and the grid steps down the page instead of
sitting square:

| Part | What it is |
|---|---|
| `.pbs` | The records, as a printed table: ruled top and bottom, one cell per distance, cells divided by hairlines, `--pbn` columns (the count, inline). Each cell is the distance at `clamp(16,1.6vw,20)/600` in `--ink` — **Archivo, not mono**: here the distance *names* the record rather than tagging it, the same reasoning that makes `.trow-k` a real size in the toolkit — then a `.tabular` time at `clamp(25,2.7vw,37)`, then the pace. **The pace is computed from the distance and the clock, never typed** (`pace()` in `outside.jsx`) — one less number that can drift out of true. The block announces itself by structure, not by size; a board of huge figures would make this a results page. |
| `.race` | A race. The box holds, in order: the photograph; or the time at `clamp(38,5.4vw,76)`; or the distance at `clamp(21,2.4vw,34)`. With none of the three there is **no box** — `.race.bare` is a hairline and its text. This chain is what lets a race exist before its photograph does without ever showing a placeholder. The pace rides against the time wherever the time lands — under it inside the box, beside it on the line below a photograph — so the pairing reads the same here as in `.pbs`. |
| `.tally` | Two figures beside the map's title, in the slot `.sec-head` already keeps free. `column-reverse`, so the number reads first. |
| `.atlas` | **A plate, not two blocks of colour.** The world is line work: every border a hairline at `--ink` 15% over a `--ink` 5% wash. The countries visited are the only filled thing on it — solid `--ink` at 92%, cut apart from one another by a `--paper` hairline, without which the eight in western Europe merge into one shapeless blot. The **single country under the pointer** turns `--accent` (§2, the fifth job). Every stroke is `vector-effect="non-scaling-stroke"`, set on the path, so a hairline is one *screen* pixel at any size rather than fattening with the viewBox. |
| `.atlas-on.tiny` | Below `TINY` (20 px² on the map — Luxembourg is 1.4, Slovenia 17.6, Belgium 28) a paper hairline would rub the country out entirely, so it keeps its own ink instead and is allowed to merge with its neighbours. Being visible beats being separate. The same threshold widens its pointer target. |
| `.atlas-hit` | A second, invisible copy of each outline, `pointer-events:all`. **It must declare a `fill`** — an SVG path without one paints black, and this one sits over the country it listens for. `.wide` gives only the `TINY` countries a 9px transparent stroke: a halo on every country would eat its neighbours' edges, which cost Belgium most of its target the first time round. Countries are drawn largest first so the small ones sit on top and win the overlap. |
| Phones | Under 720px a country is a few pixels across and a paper separator would eat most of one. Separation gives way to legibility: the countries take their own ink and are allowed to touch. The hover is gated on `(hover:hover) and (pointer:fine)` per the house rule and costs a phone nothing, because the resting fill already carries the whole message. |

| `.sup-av` | The 56px circle on an allegiance row: a portrait at `fit:"cover"`, a crest at `fit:"contain"` (10px of padding on the image, so `object-fit` centres the artwork in what is left). With no image the row falls back to its `icon` in a `.row-ico` of the same footprint, so the list never changes shape. **The image is positioned, not laid out:** `Img` renders a `<picture>`, whose box is sized by its own child, and a percentage height inside a grid slot does not resolve — together they left both avatars ratio-locked and overflowing the circle, invisibly, because `overflow:hidden` cropped the evidence. `display:contents` on the picture plus `position:absolute` on the image gives 100% something definite to mean. Only `fit:"cover"` means fill; anything else means fit, so a near miss in `data.js` lands on the behaviour a crest wants instead of silently cropping it. |

**Where the map comes from.** `tools/build-map.mjs` reads Natural Earth 1:110m
(public domain, vendored at `tools/data/world-110m.json`), decodes the TopoJSON,
projects through Robinson, splits every ring that crosses the antimeridian —
without that, Russia is drawn with a streak across the Pacific — simplifies with
Douglas–Peucker at `0.28px`, and writes `assets/map/world.js`: the land, one
path per visited country, and their areas in px² (which is what lets the page
order them for hit-testing). The tolerance is deliberately low — the map is
drawn as line work, and a coastline flattened into polygons shows immediately.
It costs 72 KB, and only the visited countries getting their own path is what
keeps it to that. It is **not** in the bundle: `useWorldMap()` injects the
script the first time the section mounts, and the frame holds its aspect ratio
until it lands.

Antarctica is dropped — a cartographic convention, not an oversight. Natural
Earth counts the overseas departments as France, which would light up South
America on a map of where someone has been; `CLIP` in the generator keeps only
the rings whose centre falls in a given lon/lat box, for the countries that need
it. It clips the *visited* layer only — French Guiana is still part of the
background world, as it should be. The list is one line long and should stay
short: it is a fix for a dataset quirk, not a way to edit geography.

---

## 12 · Theming

### The contract

```
:root                     → light tokens + color-scheme: light
html[data-theme="dark"]   → THE SAME TOKEN NAMES, different values
                            + color-scheme: dark
```

**No component is styled twice.** The dark block re-declares 20 custom
properties and nothing else. If you find yourself writing
`html[data-theme="dark"] .some-component { … }`, the component is reaching past
a token it should be using — fix the token, not the selector.

The only permitted exception is a *structural* one:
`html[data-theme="light"] .sky { display: none }` — the night canvas has no
light-theme form and is switched off rather than recoloured.

### How the theme is chosen

1. An inline script in `<head>` (before first paint) reads
   `sessionStorage['ao-theme']`, falls back to `prefers-color-scheme`, and sets
   `data-theme` on `<html>`. **This runs before the stylesheet paints** — there
   is no flash.
2. `useTheme()` in `app.jsx` keeps React in sync, writes the attribute, and
   repaints `<meta name="theme-color">`.
3. The toggle stores the choice in `sessionStorage` — **per session, not
   forever**. A returning visitor gets their system preference again.
4. While no explicit choice is stored, a system change is followed live.

### What flips, and what does not

| Flips | Stays |
|---|---|
| All 20 surface / ink / line / accent tokens | The nav pill stays `--ink` — an object, not a surface |
| The grain (black `.15` → white `.07`) | The contact form stays dark (lifted, not inverted) |
| `--lift` (warmer / much darker) | `--on-accent` stays near-black in both |
| The logo filters (`--logo-mono*`) | Every layout, size, radius and duration |
| `color-scheme` — form controls and scrollbars | |

### The accent shifts on purpose

`#FF4A12` → `#FF6E40`. The light orange is too hot on a near-black page; the
dark one is lighter and less saturated so it reads as the same colour rather
than glowing. `--accent-ink` inverts direction — *darker* than the accent in
light (for text on paper), *lighter* in dark. Both exist to solve the same
problem in opposite directions.

### Adding a token

1. Add it to `:root` with a comment saying what it is *for*, not what it is.
2. Add the dark value in the `[data-theme="dark"]` block. **Both, always** — a
   token that exists in only one theme is a bug.
3. Add a row to §2 of this document.
4. If it is a colour that carries text, compute its contrast and add it to §13.

---

## 13 · Accessibility

### Contrast — measured, not assumed

WCAG 2.1 ratios, computed from the tokens. Normal text needs 4.5 : 1; large text
(≥24px, or ≥18.66px bold) needs 3 : 1.

**Light theme**

| Pair | Ratio | Verdict |
|---|---|---|
| `--ink` on `--paper` | **17.27 : 1** | AAA |
| `--ink` on `--paper-2` | **18.34 : 1** | AAA |
| `--ink-2` on `--paper` | **11.52 : 1** | AAA |
| `--muted` on `--paper` | **5.23 : 1** | AA |
| `--muted` on `--paper-2` | **5.55 : 1** | AA |
| `--accent-ink` on `--paper` | **4.82 : 1** | AA |
| `--on-accent` on `--accent` | **5.64 : 1** | AA |
| `--paper` on `--ink` (`.btn-ink`) | **17.27 : 1** | AAA |
| `--form-fg` on `--form-bg` | **17.27 : 1** | AAA |
| `--accent` on `--paper` | **3.06 : 1** | Large text / non-text only |
| `--ok` on `--paper` | **3.98 : 1** | Non-text (it is a 7px dot) |
| `--faint` on `--paper` | **2.29 : 1** | Decorative only — see below |

**Dark theme**

| Pair | Ratio | Verdict |
|---|---|---|
| `--ink` on `--paper` | **16.02 : 1** | AAA |
| `--ink-2` on `--paper` | **11.05 : 1** | AAA |
| `--muted` on `--paper` | **6.44 : 1** | AA |
| `--muted` on `--paper-2` | **5.97 : 1** | AA |
| `--accent` on `--paper` | **6.94 : 1** | AA |
| `--accent-ink` on `--paper` | **8.32 : 1** | AAA |
| `--on-accent` on `--accent` | **6.94 : 1** | AA |
| `--form-fg` on `--form-bg` | **14.11 : 1** | AAA |
| `--ok` on `--paper` | **11.06 : 1** | AAA |
| `--faint` on `--paper` | **2.92 : 1** | Decorative only |

**The two knowing exceptions**

- **`--faint`** (2.29 : 1 / 2.92 : 1) carries *only* redundant decoration:
  section numerals, timeline year ticks, the menu's `01`–`04`, a filter's count.
  Every one of these duplicates information already present in readable text.
  **Never put a sentence in `--faint`.**
- **`--accent` at small sizes** fails on paper (3.06 : 1). That is exactly why
  `--accent-ink` exists. Orange text under ~24px must use `--accent-ink`.

### Focus

One global ring, and it is never removed:

```css
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 3px }
```

`:focus-visible`, not `:focus`, so a mouse click does not ring a button. The one
override is inside the nav pill (`outline-offset: -3px`) so the ring stays
within the pill's radius. **There is no `outline: none` anywhere in this
stylesheet, and there must never be one.**

### Keyboard and structure

- `<a class="sr-only" href="#main">Skip to content</a>` is the first focusable
  element on every page.
- `Escape` closes the menu, the CV dropdown and the lightbox.
- Hidden interactive content is removed from the tab order: `.menu-link` and
  `.to-top` get `tabIndex={-1}` while hidden.
- The auto-hiding nav returns on `:focus-within`.
- One `<h1>` per page. On About, where the design's heading *is* the bio, an
  `.sr-only` `<h1>` supplies it.
- `<main id="main">`, `<header class="nav">`, `<nav aria-label="Primary">`,
  `<footer>`, `<article>` for a project page, `<aside>` for the rail and the id
  card.

### ARIA — used where it earns its place

| Pattern | Attributes |
|---|---|
| Active nav link | `aria-current="page"` |
| Filter / topic toggles | `aria-pressed` |
| Burger | `aria-expanded`, `aria-label` flips open/close |
| CV menu | `aria-haspopup="menu"`, `aria-expanded`, `role="menu"` / `menuitem"` |
| Menu overlay | `aria-hidden={!open}` |
| Decorative SVG, canvas, spacers | `aria-hidden="true"` |
| Card | `aria-label={title}` on the single wrapping `<a>` |
| Sort | `aria-label` states current order **and** what clicking does |
| Duplicated marquee row | `aria-hidden="true"` on the second copy |
| Topic chips | wrapped in `role="group"` with `aria-label` |

### Motion

See §7. Every scene has a reduced-motion form, `reduceMotion()` gates the JS,
and Lenis never runs when it is set.

### Without JavaScript

The page still reads. `.js` is added to `<html>` before paint and **every**
reveal's hidden state is written behind that class, so no-JS means no hidden
state. `<noscript>` points at the GitHub profile.

### Images

Every `<img>` has an `alt`. Decorative ones — the hero portrait, logos, flags,
avatars — carry `alt=""` with `aria-hidden` where appropriate. Gallery
screenshots take their caption as their alt.

### The standing checklist

- [ ] Tab through the page: is every interactive thing reachable, and visibly
      ringed?
- [ ] Does anything animate that shouldn't under `prefers-reduced-motion`?
- [ ] New text colour → contrast computed and added to the tables above?
- [ ] New `<img>` → `alt` written (or deliberately empty)?
- [ ] Toggle → does it carry `aria-pressed` or `aria-expanded`?
- [ ] Zoom to 200% — does anything overflow horizontally?
- [ ] Disable JS — is the page readable?

---

## 14 · Do's and Don'ts

### Colour

- ✅ Take every colour from a token. Tint with `color-mix(in oklab, …)`.
- ✅ Use `--accent-ink` for any orange text under ~24px.
- ❌ Never write a hex outside `:root` (five documented exceptions, §2).
- ❌ Never add a second hue. `--ok` is the only one and it is not a palette.
- ❌ Never style a component under `html[data-theme="dark"]`. Fix the token.

### Type

- ✅ Set a deliberate `font-stretch` on every display-size element.
- ✅ Give every paragraph a `max-width` in `ch`.
- ✅ Use the italic serif for a place, a level, a quote, or one phrase in a
  statement — nothing else.
- ❌ Never use negative tracking below 17px.
- ❌ Never use positive tracking on Archivo. That belongs to the mono face.
- ❌ Never set a heading in the mono face, or a label in the display face.

### Layout

- ✅ Wrap page content in `.shell`.
- ✅ Use `padding-block` on anything that sits on a `.shell`.
- ✅ Use `minmax(0, 1fr)` for grid columns.
- ❌ Never hard-code a side padding to replace `--gutter`.
- ❌ Never add a breakpoint you cannot justify in one sentence.
- ❌ Never insert a `z-index` between the ladder's steps without adding a row
  to §4.

### Depth

- ✅ Reach for a hairline, then a surface step, then space. Shadow last.
- ✅ Use `--lift` when you genuinely need one.
- ❌ **No glow. No coloured shadow. No blur halo. No glassmorphism. No gradient
  text. No shimmer skeleton.** These are the tells of a generated interface.
- ❌ No `--paper-3`. One surface step is the system.

### Motion

- ✅ Match duration to distance, and use `--ease-expo` for arrivals.
- ✅ Gate hidden states behind `.js`.
- ✅ Throttle scroll work through `useScrollFrame`.
- ❌ Never add a fourth thing that loops on its own.
- ❌ Never use the overshoot curve outside the footer tiles.
- ❌ Never add `will-change` without removing one — that list is a budget.
- ❌ Never ship an animation without its reduced-motion form.

### Content

- ✅ Put everything in `data.js`.
- ✅ Let every optional block disappear cleanly.
- ❌ Never put HTML in `data.js`. Add a shape to `Section` instead.
- ❌ Never ship an empty heading, a placeholder, or a "Coming soon".
- ❌ Never use ` — ` (spaced dash) inside a title you don't want split.

### Components

- ✅ Reuse `.btn`, `.row`, `.pcard`, `Words` before inventing.
- ✅ Make the whole card one link, not a link inside a card.
- ❌ Never build a generic primitive "for later". This is not a component
  library.
- ❌ Never remove a focus outline.

---

## 15 · Contributing

### The three files that matter

| File | What it owns | Rebuild? |
|---|---|---|
| `data.js` | Everything the site *says* | No — except after adding/renaming a project |
| `assets/css/site.css` | Everything the site *looks like* | No |
| `src/*.jsx` | Everything the site *does* | **Yes** — `npm run build`, then commit `dist/app.js` |

### Commands

```bash
npm run build     # compile src/*.jsx → dist/app.js, write share pages + sitemap
npm run watch     # rebuild on save
npm run images    # WebP derivatives + manifest (needs sips + cwebp)
npm run og        # Open Graph images
npm run icons     # favicons
```

`tools/build.mjs` also writes one small HTML file per address (`/work/`,
`/work/<id>/`, `/about/`, `/contact/`, `404.html`), each a copy of `index.html`
with its own `<title>`, description and preview image — so a link shared in
LinkedIn or iMessage previews correctly. It then regenerates `sitemap.xml`.

**The globals convention:** the JSX files do not use ES imports. Each is
transpiled on its own and wrapped in an IIFE, and they share state through
`window` (`window.Icon`, `window.PROFILE`, `window.Cover`, …). Load order in
`FILES` matters: `icons → covers → lib → home → work → about → contact → app`.
A new module goes in that list, exports through `Object.assign(window, {…})` at
the bottom, and never imports.

### Adding a design token

1. `:root` — value + a comment about its *purpose*.
2. `[data-theme="dark"]` — the paired value. Both, always.
3. §2 of this document — a row.
4. If it carries text — §13, with the computed ratio.

### Adding a component

1. **Check first.** Can `.btn`, `.row`, `.pcard`, `Words` or an existing chip do
   it? Most of the time, yes.
2. Name it in the site's vocabulary — `.pcard`, `.tl-card`, `.foot-tile`. Short
   prefix, no BEM, no utility soup.
3. Add it to the right numbered section of `site.css` (there are 17, and they
   are ordered by where they appear in the site).
4. Use only tokens.
5. Give it a `.rv` variant if it enters the viewport.
6. Give it a reduced-motion form if it moves.
7. Check it at 360px, 860px and 1440px, in both themes.
8. Tab to it. Confirm the ring.
9. Add a spec to §10 here.

### Adding a project

1. Append an entry to `projects` in `data.js`. Required: `id`, `title`, `cat`,
   `year`, `summary`, `cover`. Everything else is optional and will simply not
   render.
2. Drop screenshots in `assets/images/projects/<id>/` and run `npm run images`.
3. `npm run build` — this writes `/work/<id>/index.html` and updates the
   sitemap.
4. Optionally add the `id` to `homeDeck` to feature it on the home page.
5. Commit `data.js`, `dist/app.js`, the new `work/<id>/` page, `sitemap.xml`,
   and the `assets/opt/` output.

### Definition of done

- [ ] No new hex outside `:root`
- [ ] Both themes checked
- [ ] 360px / 860px / 1440px checked
- [ ] Reduced motion checked
- [ ] Keyboard-reachable with a visible focus ring
- [ ] Contrast computed for any new text colour
- [ ] `npm run build` run and `dist/app.js` committed, if `src/` changed
- [ ] This document updated in the same commit, if the system changed

### Review questions

Ask these of any change before merging:

1. Which of the three motifs does it use? If none — is being outside them the
   point?
2. Is every value a token?
3. Does it read at 360px?
4. Does it read with motion off?
5. Does it read with JavaScript off?
6. Does it read in dark mode?
7. Did it add a shadow? Could a hairline have done it?
8. Did it add a colour? Really?

---

## 16 · Changelog & open questions

### Status

| | |
|---|---|
| Document version | `1.0` — first formal write-up |
| Written | 2026-09-14 |
| Describes | `main` @ `83798a0` |
| Source of truth | `assets/css/site.css` (1,138 lines, 17 sections) |
| History | 93 commits, 2026-04-14 → 2026-09-13 |

This document is a **retroactive formalisation**. The system was designed in the
stylesheet first; this file names what was already there, measures it, and turns
the implicit rules into explicit ones. Nothing here proposes a change to the
site — where the two disagree, the stylesheet wins and this file is wrong.

### Known tensions

Honest notes, not bugs.

1. **`--faint` fails AA in both themes** (2.29 : 1 / 2.92 : 1). Acceptable
   because every use is redundant decoration, but it is one careless
   `class="faint"` away from becoming a real failure. Consider renaming it
   `--decorative` to make misuse feel wrong.
2. **`TOP_COLOR` duplicates four palette values in `app.jsx`, and two more in
   `index.html`.** `<meta name="theme-color">` cannot read a CSS variable, so
   the duplication is structural. It is a real maintenance trap — §2 flags it,
   but a build-time injection would be better.
3. **`sizes` strings encode grid knowledge outside the stylesheet**
   (`CARD_SIZES` in `lib.jsx`). Change a grid's columns and you must remember to
   change these, or the browser downloads the wrong derivative.
4. **`--nav-h: 60px` is a reservation, not a measurement** (the pill is 62px).
   It works, but the name suggests otherwise.
5. **`metrics` in `data.js` is dead.** The giant-number band was removed on
   purpose; the field is kept harmlessly in case it returns somewhere quieter.
6. **The radius ladder has 18 steps.** Every one is justified, but it is the
   least systematic part of the system. The `short-side ÷ 4` law in §6 is the
   rule that would tighten it if it were ever rebuilt.
7. **No automated visual regression.** `tools/test-motion.mjs` and
   `tools/test-scroll.mjs` exist with Playwright available; they are not wired
   into a CI gate.

### If this system grows

In rough priority order:

1. Inject `theme-color` at build time from the CSS tokens, closing tension 2.
2. Rename `--faint` → `--decorative`, closing tension 1.
3. A Playwright check that screenshots each page in both themes at three widths
   and diffs against a committed baseline.
4. A tiny lint that fails the build on a hex literal outside `:root`.
5. Derive the `sizes` strings from the grid definitions rather than restating
   them.

---

*The charter is in `assets/css/site.css`. This document is why it says what it
says.*
