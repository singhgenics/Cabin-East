---
name: Cabin East
description: The pre-launch site as the shop's red plywood hoarding, with the menu wheat-pasted up as crooked bills.
colors:
  cabin-red: "#B5321C"
  bill-cream: "#F2E8D2"
  paste-paper: "#F6EDD9"
  ink: "#1C1714"
  ink-soft: "#5A4C42"
  amber: "#E49B1D"
  jade: "#2F6F57"
  rail-tan: "#D9B98F"
  plaque-wood: "#2A221D"
  cream-on-ink: "#E6DAC0"
  muted-on-ink: "#CFC3AB"
  veg-green: "#2E7D32"
  nonveg-brown: "#8B3A1A"
typography:
  display:
    fontFamily: "Alfa Slab One, Rockwell Extra Bold, serif"
    fontSize: "clamp(4.5rem, 12vw, 9.5rem)"
    fontWeight: 400
    lineHeight: 0.85
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Alfa Slab One, Rockwell Extra Bold, serif"
    fontSize: "clamp(1.7rem, 2.4vw, 2.2rem)"
    fontWeight: 400
    lineHeight: 1
  title:
    fontFamily: "Alfa Slab One, Rockwell Extra Bold, serif"
    fontSize: "1.15rem"
    fontWeight: 400
    lineHeight: 1.1
  lede:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.5vw, 1.3rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "IBM Plex Sans, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.07em"
  price:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.01em"
rounded:
  tag: "2px"
  plaque: "4px"
  button: "6px"
  basket: "50%"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  station: "clamp(56px, 8vw, 120px)"
  bill-gap: "clamp(16px, 2.4vw, 34px)"
  touch: "48px"
components:
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bill-cream}"
    typography: "{typography.label}"
    rounded: "{rounded.button}"
    padding: "0 1.6em"
    height: "48px"
  button-ink-hover:
    backgroundColor: "{colors.cabin-red}"
    textColor: "{colors.bill-cream}"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.button}"
    padding: "0 1.6em"
    height: "48px"
  button-line-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bill-cream}"
  bill-cream:
    backgroundColor: "{colors.paste-paper}"
    textColor: "{colors.ink}"
    padding: "clamp(22px, 2.4vw, 34px)"
  bill-jade:
    backgroundColor: "{colors.jade}"
    textColor: "{colors.bill-cream}"
    padding: "clamp(22px, 2.4vw, 34px)"
  bill-amber:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.ink}"
    padding: "clamp(22px, 2.4vw, 34px)"
  tap-plaque:
    backgroundColor: "{colors.plaque-wood}"
    textColor: "{colors.cream-on-ink}"
    rounded: "{rounded.plaque}"
    padding: "22px 24px"
  menu-tab-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bill-cream}"
    typography: "{typography.label}"
    padding: "14px 28px"
    height: "48px"
  origin-tag:
    backgroundColor: "{colors.jade}"
    textColor: "{colors.bill-cream}"
    rounded: "{rounded.tag}"
    padding: "3px 6px 2px"
---

# Design System: Cabin East

## Overview

**Creative North Star: "The Hoarding"**

While the shop is being fitted out, the website is its site hoarding. The page is Cabin-red painted plywood (a repeating wood-grain raster under the brand red), and everything the visitor reads is pasted onto it: cream wheat-paste bills, a jade happy-hour bill and an amber feast bill, each a degree or two off square and lightly overlapping. Between the boards, the page drops onto plain cream paper stock for the food stations (WOK, STEAM), then into one dark ink band for DRAUGHT, where the beers hang as painted tap plaques. A tan-wood plate runs across the top as the rail.

Density is pub-menu generous: giant slab station words, real prices on every line, dashed rules between dishes like a printed bill of fare. The voice is warm and loud rather than posh. The motion is physical and plays once: bills are pasted onto the board as the page loads and as the deals board scrolls in, photos settle in from a slight zoom inside a fixed frame and drift a few percent as they scroll, lists rise in with a short stagger, and the Opening soon stamp lands. Under a real pointer a bill lifts three pixels, like a sheet catching air.

The built page departs from the approved comp in three recorded ways. Real menu photographs (from the Menu repo's plating set) and the real pint-stack logo replace the comp's generated pictures, by owner decision. The jade bill is lettered in cream, not ink, because ink on jade measures 2.99:1. The hero reproduces the comp at roughly 70% overall in the comp diff; the composition, palette and type landed, the pictures and some proportions did not.

**Key Characteristics:**
- Red plywood ground with pasted paper bills, each rotated between -3deg and +3deg.
- Alfa Slab One for every shouted word; IBM Plex Sans for reading; IBM Plex Mono for the numbers.
- Paper is a material, not a colour: bills and slips carry a paper-grain raster, slips carry a deckled edge mask.
- One dark band (DRAUGHT) per page; everything else sits on cream or red.
- Motion is the paste-up, the once-only scroll-ins and the lift: transform, opacity and (for the map route) stroke offset only, played once, and reduced (movement removed, colour and opacity kept) under reduced motion.

## Colors

Five pinned brand colours from the Cabin Red kit, plus a small set of supporting tones that exist only to sit on those five.

### Primary
- **Cabin Red** (cabin-red): the hoarding itself, every station word that is not inked, section heads in the menu, the hero headline and wordmark on the main poster, link-arrow text, nav hover underline, heat marks and text selection. Reads 5.02:1 on bill cream.

### Secondary
- **Jade Bill** (jade): the happy-hour bill (hero and deals row) and the small "Goa" origin tag in the menu. Always lettered in cream (4.88:1); its small print uses a pale jade-cream tint.
- **Amber Bill** (amber): the feast-for-four bill (ink lettering, 7.62:1), the DRAUGHT station word, tap and bar prices on the ink band, the focus ring, and the double ring of the opening-soon stamp.

### Neutral
- **Bill Cream** (bill-cream): the page body under a paper-grain raster, button text on ink, lettering on jade.
- **Paste Paper** (paste-paper): the face of every cream bill and deckled slip; a hair lighter than the page so pasted paper reads as a separate sheet.
- **Signwriter Ink** (ink): all body text, ink buttons, selected menu tab, the DRAUGHT band, rules under menu section heads.
- **Faded Ink** (ink-soft): descriptions, captions, the diet key; 7.08:1 on paper.
- **Rail Tan** (rail-tan): fallback fill under the tan-wood rail raster.
- **Plaque Wood** (plaque-wood): tap plaque faces on the ink band.
- **Cream on Ink** (cream-on-ink) and **Muted on Ink** (muted-on-ink): lede and description text inside the DRAUGHT band.
- **Veg Green** and **Non-veg Brown** (veg-green, nonveg-brown): the square diet marks only; never decorative.

### Named Rules
**The Pinned Five Rule.** Red, cream, ink, amber and jade are fixed brand values. Supporting tones may be added only to sit on one of them (text on ink, faces of plaques), never as a sixth accent.

**The Lettering Follows Contrast Rule.** A bill's lettering is whichever of ink or cream clears 4.5:1 on its face: ink on cream and amber, cream on jade, red, and ink.

## Typography

**Display Font:** Alfa Slab One (with Rockwell Extra Bold, serif)
**Body Font:** IBM Plex Sans, variable weight and width (with system-ui)
**Numbers Font:** IBM Plex Mono Medium (with ui-monospace)

**Character:** Signwriter's slab for everything shouted, a plain industrial sans for everything read, and a typewriter mono for the figures, the way a pub chalks prices.

### Hierarchy
- **Display** (400, clamp(4.5rem, 12vw, 9.5rem), 0.85, uppercase): the station words WOK, STEAM, DRAUGHT, THE MENU. One letter-group per word may be inked instead of red ("W" of WOK, "am" of STEAM). The hero headline on the main poster is the same face sized to the poster's container (10.6cqi, 0.98).
- **Headline** (400, clamp(1.7rem, 2.4vw, 2.2rem), 1, uppercase in red): menu section heads, bill titles (clamp(1.5rem, 2.2vw, 2rem)), the Find us poster title (up to 5.25rem) and the garden statement (sentence case, up to 3.25rem).
- **Title** (400, 1.15rem to 1.4rem, 1.05 to 1.1): dish and drink names in lists, slips, baskets and shelf cards; tap names at clamp(1.6rem, 2.6vw, 2.2rem).
- **Lede** (400, clamp(1.125rem, 1.5vw, 1.3rem), 1.5, max 46ch): one paragraph beside each station word.
- **Body** (400, 1.0625rem, 1.6, tabular figures): running copy; descriptions step down to 0.9375rem at 1.35 to 1.45 in faded ink.
- **Label** (600, 1.0625rem, 0.07em, uppercase): buttons and menu tabs. The rail nav is the same family at 700, 85% width, 1.3125rem, 0.04em, uppercase.
- **Price** (Mono 500, 1rem to 1.35rem, 0.01em, no wrap): every price, every time in the hours table, every measure (330 / 500 ml).

### Named Rules
**The Ledger Rule.** IBM Plex Mono sets prices, times and measures and nothing else. If it is not a number someone pays, waits for or pours, it is in Plex Sans or Alfa Slab One.

**The Slab Shouts Rule.** Alfa Slab One is never set below title size and never for running text; Plex Sans never sets a station word.

## Layout

A full-bleed board model. Each red hoarding band holds a 1600px-max board; cream stations and the ink band hold the same 1600px measure; the deals row and menu tighten to 1400px and Find us to 1200px. Side gutter is the fluid gutter token; stations breathe with the station token above and below.

The hero board keeps the comp's proportions (aspect 1376 / 542, min 520px tall) and places bills absolutely by percentage: the main poster centred at about half the width, a food photo bill top-left, a beer photo bill right, the jade happy-hour bill lower-left overlapping the poster's edge. Below the hero, sections alternate a giant station word against a lede on a two-column grid, with photo and list columns weighted roughly 1.35 : 1.

Breakpoints are 1100px (WOK header stacks, deals row drops to two columns) and 820px (phones). At 820px the rail stacks logo over a spread-out nav; the hero stops being a collage and becomes a two-column grid in reading order: main poster full width, then the food and beer photos as a square pair, then the happy-hour bill centred at 78% width overlapping the pair by 18px. Every two-column section goes to one column, slips go to a single column with a 120px photo, the full menu drops from two text columns to one, and bill rotations ease to about ±0.8deg.

## Elevation & Depth

Depth is physical paper on wood: every bill carries a three-part warm shadow (a 1px contact line, a short drop, a long soft fall) tinted toward the red ground rather than grey. Deckled slips cannot take a box-shadow through their mask, so they use the same idea as a stacked drop-shadow filter. Lift is the only state change in depth.

### Shadow Vocabulary
- **Pasted** (`0 1px 1px rgba(60,14,6,.18), 0 6px 14px -4px rgba(60,14,6,.35), 0 18px 36px -18px rgba(40,8,2,.45)`): every bill, photo print, the stamp, station photos.
- **Lifted** (`0 1px 1px rgba(60,14,6,.15), 0 14px 22px -8px rgba(60,14,6,.4), 0 30px 50px -24px rgba(40,8,2,.5)`): a bill under the pointer.
- **Slip** (`drop-shadow(0 2px 1px rgba(60,14,6,.2)) drop-shadow(0 10px 12px rgba(60,14,6,.3))`): deckled slips.
- **Plaque frame** (inset cream hairline, inset wood gap, inset amber hairline, `0 14px 26px -14px #000`): tap plaques on the ink band.
- **Rail** (`0 1px 0 rgba(60,30,10,.35), 0 4px 10px -6px rgba(40,10,2,.5)`): the sticky top rail over the board.

### Named Rules
**The Warm Shadow Rule.** Shadows are tinted toward the red ground (rgba 60,14,6 and 40,8,2), never neutral black, except on the ink band where the plaque drop is black.

## Shapes

Paper is square-cornered; only things that are made rather than printed get a radius. Bills, slips, photo prints and the stamp's paper are sharp; buttons and the menu tab strip take a 6px corner, tap plaques and menu thumbnails 4px, shelf photos 3px, the origin tag 2px, steamer-basket thumbnails are full circles. The opening-soon stamp is a circle with a double amber ring rotated 12deg. Slips get a torn deckle on all edges from a raster alpha mask. Lists are ruled with 1.5px dashed ink at 22 to 28% opacity; section heads take a solid 2px ink rule.

The direction contract asked for square plaque corners on buttons; the build shipped a 6px radius, and the build is what is recorded.

**The Crooked Paste Rule.** Every pasted element is rotated, between -3deg and +3deg, and neighbours generally lean opposite ways. Nothing pasted sits at 0deg on desktop.

## Components

### Buttons
Painted signboard plaques: heavy, uppercase, 48px tall minimum.
- **Shape:** 6px corners with a 2px ink border.
- **Ink:** ink face, cream label, soft ink drop beneath; hover turns the face and border Cabin red.
- **Line:** transparent face, ink border and label; hover fills ink with a cream label.
- **Press:** sinks 1px and scales to 0.985. Focus is the global 3px amber ring offset 3px.

### Navigation (top rail)
A 56px sticky tan-wood plate (raster, tan fallback) with the line logo left and four uppercase Plex Sans links right. Hover (real pointers only) draws a 2px deep-red underline in from the left over 200ms (a scaleX that leaves to the right) and darkens the label. On phones the rail stacks logo above the links, which spread across the full width.

### Bills
Pasted posters on the hoarding: cream (paper-grain raster), jade, or amber, sharp corners, the pasted shadow, rotated. On desktop the hero bills are absolutely placed; elsewhere bills sit in a grid with staggered top offsets (0, 40, 12, 56px). Bill titles are slab headline; prices are mono.

### Deckled slips
Featured wok dishes as torn paper: a 40% photo column multiplied into the paper, slab title, faded-ink line, mono price pinned to the bottom. Edge from the deckle mask; depth from the slip drop-shadow; slight alternating rotation.

### Tap plaques
Beers on the ink band as painted plaques: plaque-wood face, 4px corners, a framed inset border in cream and amber, slab name in a per-tap colour (gold, pink, amber), mono amber price at right with "330 / 500 ml" underneath in a muted tone.

### Menu
Two tabs (Food, Drinks) in a 2px ink-bordered strip with 6px corners; selected tab is ink with cream label. Dishes are two-column grids (optional 76px thumbnail, name block, mono price), separated by dashed rules, set in two text columns that break cleanly. Diet marks are the Indian square symbol (green dot for veg, brown triangle for non-veg, split for either); heat is a small red chilli SVG repeated per level.

### Story (From a Calcutta street to a Goa beach)
A cream-paper section after the hero. A sticky jade bill on the left holds a dotted route map (no country outline, on purpose): Calcutta, then Mumbai (1975), then Betalbatim, with other cities as dim dots, in cream on jade for contrast. Six chapters scroll on the right: slab headings, a red slab year only where a year carries information, body copy at 17-19px, and a pasted print with an italic caption saying it is an illustration, never a historical photograph. The chapter crossing the middle of the screen is full strength and the others sit back (desktop); that chapter sets the step the map draws to. On phones the map shows the whole route at once. Sources and the "told differently by different sources" caveat sit in a small note at the end. This is the one place on the site that names Calcutta, Tiretta Bazaar and Tangra (owner's request, 2026-10-21).

### Hero (2026-10-29)
Full-width, full-screen video of the chef tossing the wok (`assets/video/hero-wok.mp4`, poster `wok-fire.webp`), dark gradient from the left and bottom for legibility. Over it, in one left column: a pasted paper sticker "Opening soon in Betalbatim" (small, rotated), the logo mark, "Cabin East" in cream slab with the amber mono tagline, the one-line pitch and two buttons (cream fill, cream outline). A jade happy-hour sticker sits bottom right (in flow on phones). It stays a video under reduced motion only as a poster, and `?still` shows the poster. The old plywood board of bills is retired; plywood returns as the dim sum scene and the deals bills.

### Moat strip, Steam and Draught chapters (2026-10-21)
The four things the pub is built on get the biggest billing. A cream strip under the hero sets "Dim sum. Bao. Craft beer. Craft cocktails." in slab type, alternating red and ink, above four linked cells (photo, a live count in red slab, name, one line, arrow link). **Steam** (cream) opens with a giant slab "Steam", then dim sum (sticky illustrated photo left, four paper cards right) and bao (wide photo, three cards), a proof row (4 to a basket, 2 to a plate, batches, to order) and the steamer-for-two price. **Draught** (ink band, amber giant title) holds craft beer (photo, three tap plaques, paddle and bottle rows) and craft cocktails (wide bar photo, then eight photo cards, four across on desktop, two on phones, with a green "Goa" tag on the feni and kokum drinks). Paper cards are cream, rotated under half a degree, with the pasted shadow; each photo sits in a `.ph` frame.

### Exploded scenes (2026-10-29)
Three full-bleed, pinned scenes sit at the head of dim sum, bao and craft beer: Cabin-red plywood, jade, and an ink-and-amber glow. The section is about 3.4 screens tall (3 on phones) and the stage sticks while scroll runs it: layers float apart with mono tag plaques, then fold together in a wave (outer layers first, a little rotation and scale mid-flight) as the stage pushes in and the giant backdrop word drifts; a thin amber bar tracks progress, the kicker reads "How a basket is built" to "Coming together" to "Ready to eat", and the caption with a link to the dishes fades in at the end. Pictures are Flow exploded views on flat green, keyed to transparent layers with `src/explode/slice.py`. The scroll sets only a target: the picture eases toward it every frame (about 95ms time constant, frame-rate independent), so wheel notches and flicks glide. The layers dissolve into a Flow picture of the finished dish (`<name>-whole`, same camera, centred on the stack), so each item ends as one object. A stage appears only once its pictures have loaded and decoded. Reduced motion, `?still` and no-JS keep the exploded layout in normal flow with the caption visible.

### Photo frames
Every large photo sits in a clipping frame (`.ph`, `overflow: clip`) that owns the size, shadow and rotation; the image inside rests at 1.12 scale, settles in from 1.26 with a fade over 1.2s on first view, and drifts +/-5% with a scroll-linked animation where the browser supports `animation-timeline: view()`. Lazy images fade in when they finish loading.

### Opening-soon stamp
A 148px ink disc with a double amber ring, cream slab lettering, rotated 12deg and overlapping the Find us board's corner.

## Do's and Don'ts

### Do:
- **Do** paste every poster-like block onto red plywood as a rotated bill with the pasted shadow.
- **Do** letter jade bills in cream; ink on jade is 2.99:1.
- **Do** set every price, time and measure in IBM Plex Mono Medium, never wrapped.
- **Do** use real plated photography from the Menu repo for dishes and drinks; label any picture of an unbuilt room as an artist's impression.
- **Do** keep motion to the paste-up (transform and opacity, 560ms, cubic-bezier(.23,1,.32,1), staggered 80-100ms), the once-only scroll-ins, the 3px hover lift (pointer devices only) and 160ms scale(.97) press feedback; reduce them under prefers-reduced-motion.
- **Do** stack the hero on phones as poster, then the photo pair, then the happy-hour bill.

### Don't:
- **Don't** add a sixth accent colour; supporting tones exist only to sit on the pinned five.
- **Don't** set Alfa Slab One for running text, or Plex Mono for anything that is not a price, time or measure.
- **Don't** square-up pasted bills or give them rounded corners; paper is sharp and crooked.
- **Don't** use neutral grey shadows on the cream or red grounds.
- **Don't** animate layout or paint properties; motion is transform, opacity and the map route's stroke offset, and the hover shadow is a pseudo-element faded by opacity.
