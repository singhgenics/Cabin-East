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
