# Cabin East website

Public site for Cabin East (Wok | Steam | Draught), opening soon in Betalbatim, South Goa.
Live at https://singhgenics.github.io/Cabin-East/ (GitHub Pages, `main`, root).

Static HTML/CSS/JS, no runtime build. `index.html` is generated; edit `src/template.html`.

## Rebuild

```sh
node src/build.mjs        # menu + web images -> index.html
```

The full menu, prices and dish photos come from the live menu in the Dream repo
(`food.html`, `drinks.html`) through `../Menu-repo/src/menu-data.mjs` and `../Menu-repo/img/plating`.
Run the build after any menu change.

Website copy rules, enforced in `src/build.mjs` (SCRUB): never mention Kolkata, Tangra or City of Joy; happy hour reads 12–6.

## Images

- `assets/plates/`: hero pieces (logo cut from the brand kit, menu photos, Flow textures).
- `assets/flow/`: Flow scenes (wok fire, steamer stack, tap pour, garden at dusk, beach).
- `src/gen-images.sh [job]`: regenerates Flow pictures, free nano2, all in the Flow project **Website**
  (id in `src/flow/PROJECT_ID`, prompts in `src/flow/*.txt`). Delete an output to redo it.

The garden picture is an artist's impression and is labelled as one on the page.

## Design

- `PRODUCT.md`: product facts and constraints.
- `DESIGN.md`: the visual system (the hoarding: red plywood, pasted cream bills, Alfa Slab One).
- `.impeccable/mocks/decision/`: the three direction comps; `hoarding.jpg` was chosen.

## Story section

`#story` tells the Calcutta-to-Goa history (copy in `src/template.html`; facts and caveats in `PRODUCT.md`). Its three illustrations (`calcutta`, `cabin`, `cart` in `src/gen-images.sh`) are Flow images in the Website project and are captioned as illustrations. `assets/site.js` sets the map step from the chapter in view; `?still` shows the finished page.

## The moat sections

Page order: hero, moat strip, Steam (dim sum, bao), Draught (craft beer, craft cocktails), deals, story, wok, garden, menu, find us. Dish and drink cards are pulled from the live menu by name in `src/template.html` (`{{Name|img}}` etc.); the counts in the moat strip are live (`{{#dimsum}}`). Four extra Flow scenes (`dimsum`, `bao`, `cocktails`, `beers` in `src/gen-images.sh`) are captioned as illustrations.

## Exploded scenes

`x-dimsum`, `x-bao`, `x-beer` in `src/gen-images.sh` are Flow exploded views on flat chroma green (prompts in `src/flow/x-*.txt`). `python3 src/explode/slice.py` keys the green out and cuts each into five transparent layers (`assets/explode/`, layout in `src/explode/*.json`); `src/build.mjs` writes the scene markup (`{{#explode:name}}`) and `assets/site.js` drives it from scroll.

Each scene also has a `x-<name>-whole` Flow picture (the finished dish, no steam: steam keys to green flecks) that the layers dissolve into; `slice.py` writes it as `assets/explode/<name>-whole.webp`.

Whole-page smooth scrolling is Lenis (self-hosted `assets/lenis.min.js`, v1.1.20), set up at the top of the exploded-views block in `assets/site.js`; it is off for reduced motion and `?still`.

## Wok video

`assets/video/wok-toss.mp4` is a Flow image-to-video clip (Veo Lite, started from `assets/flow/wok-fire.jpg`, prompt in `src/flow/wok-toss.txt`), cut so its last 0.6s dissolves into its first and it loops without a jump (`ffmpeg` xfade, audio dropped, 960 px wide). It plays only while on screen and not under reduced motion. If `gflow video i2v` ends with "no signed media URL", the clip was still made and paid for: `gflow data list videos`, then `gflow data download <media_id>` recovers it free.

`assets/video/cocktail-shake.mp4` is the same kind of clip for the craft cocktails picture (start frame `assets/flow/cocktail-bar.jpg`, prompt `src/flow/cocktail-shake.txt`).

## More Flow video

`src/gen-video.sh [job]` makes the clips (Veo Lite, ~10 credits each, one at a time; prompts `src/flow/v-*.txt`, raw files in `/tmp/vids`). Encode as loops with the same ffmpeg xfade recipe, 800 px wide (480 for portrait), into `assets/video/`: `dimsum-pleat`, `bao-steam`, `beer-trio`, `garden-dusk`, `noodle-cart`, plus `wok-toss` and `cocktail-shake`. Each plays only while on screen.

The beer pour scene (`assets/pour/f-000..065.webp`) is the `pour` clip (first 5.5 s, 12 fps, 405x720 frames, start frame `assets/flow/pour-start.jpg`) played by scroll position on a canvas (`data-pour` in `assets/site.js`).
