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
