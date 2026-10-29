// Builds index.html from src/template.html and the live menu in Dream/food.html + drinks.html.
// Usage: node src/build.mjs   (re-run after any menu change)
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { loadMenu, DREAM } from '../../Menu-repo/src/menu-data.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PLATING = path.join(DREAM, 'Menu-repo/img/plating');
const OUT_IMG = path.join(ROOT, 'assets/menu');
fs.mkdirSync(OUT_IMG, { recursive: true });

// dish name -> plating photo id (Menu-repo data.json), plus lines it names differently
const data = JSON.parse(fs.readFileSync(path.join(DREAM, 'Menu-repo/src/data.json'), 'utf8'));
const PHOTO = Object.fromEntries(data.map(d => [d.name, d.id]));
Object.assign(PHOTO, {
  'Pitcher or tasting paddle': 'paddle', 'Paul John Brilliance': 'neat', 'Single malt flight': 'maltflight',
  'Suntory Toki highball': 'toki', 'Haku': 'vodka', 'Brewed coffee': 'coffee', 'Happy hour, 4–8 pm': null,
});

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function price(p) {
  if (typeof p === 'number') return `₹${p}`;
  if (p === 'daily') return 'Daily';
  if (/^\d+\+$/.test(p)) return `from ₹${p.slice(0, -1)}`;
  if (/^₹[\d,]+\+$/.test(p)) return `from ${p.slice(0, -1)}`;
  return p;
}

function photo(id) {
  if (!id) return null;
  const src = path.join(PLATING, id + '.jpg');
  if (!fs.existsSync(src)) return null;
  const out = path.join(OUT_IMG, id + '.webp');
  if (!fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(src).mtimeMs)
    execFileSync('cwebp', ['-quiet', '-q', '78', '-resize', '640', '0', src, '-o', out]);
  return `assets/menu/${id}.webp`;
}

// owner rules for the website (2026-10-20): never mention Kolkata or its cabins; happy hour is 12-6
const SCRUB = [
  [/,? ?Tangra style/g, ''], [/ The bestseller of the old cabins\./g, ' Our bestseller.'],
  [/, street-cabin style\./g, ', street style.'], [/The old cabins’ dessert: noodles/g, 'Our dessert: noodles'],
  [/Happy hour, 4–8 pm/g, 'Happy hour, 12–6 pm'], [/Kolkata|City of Joy/gi, ''],
];
const scrub = s => typeof s === 'string' ? SCRUB.reduce((a, [re, to]) => a.replace(re, to), s) : s;
const SEC_ID = { kolkata: 'wok' };

const DIET = { v: ['veg', 'Vegetarian'], nv: ['nonveg', 'Non-vegetarian'], vn: ['both', 'Veg or non-veg'] };
const TAG = { goa: 'Goa' };
const CHILLI = '<svg viewBox="0 0 12 16" aria-hidden="true"><path d="M7.5 1.2c.3 1-.1 1.8-.9 2.3 2.4.6 3.6 2.6 3.2 5.4-.5 3.3-3.3 6.1-7.6 6.5-.7.1-1-.6-.4-1 2.5-1.6 3.4-3.9 3.2-6.2-.1-1.6.6-3.2 2-4.1-.4-.6-.4-1.4.1-2 .2-.4.4-.6.4-.9z"/></svg>';

// the diet mark and chillies ride on the name's last word so they never wrap onto a line of their own
const marksHtml = (d, heat) => (d ? `<span class="diet diet-${d[0]}" title="${d[1]}"><span class="sr">${d[1]}</span></span>` : '')
  + (heat ? `<span class="heat" title="Heat ${heat} of 2">${CHILLI.repeat(heat)}<span class="sr">Heat ${heat} of 2</span></span>` : '');
function nameWithMarks(name, d, heat) {
  const marks = marksHtml(d, heat);
  if (!marks) return esc(name);
  const k = name.lastIndexOf(' ');
  return `${esc(name.slice(0, k + 1))}<span class="nw">${esc(name.slice(k + 1))}${marks}</span>`;
}

// split sections into two columns of about equal length (rows weighted, photo rows taller)
function columns(secs) {
  const w = s => 1.6 + s.items.reduce((a, it) => a + 1 + it[1].length / 90 + it[2].length / 90, 0);
  const total = secs.reduce((a, s) => a + w(s), 0);
  let acc = 0, cut = secs.length;
  for (let i = 0; i < secs.length; i++) { if (acc + w(secs[i]) / 2 > total / 2) { cut = i; break; } acc += w(secs[i]); }
  return [secs.slice(0, cut), secs.slice(cut)].map(c => `<div class="menu-col">${c.map(section).join('\n')}</div>`).join('\n');
}

function item(it, i) {
  const [title, what, story, p, diet, tag, heat] = it;
  const [name, sub] = title.split('|');
  const img = photo(PHOTO[name]);
  const d = DIET[diet];
  return `<li class="dish${img ? ' has-img' : ''}">
${img ? `<img class="dish-img" src="${img}" alt="${esc(name)}, plated" loading="lazy" decoding="async" width="640" height="478">` : ''}
<div class="dish-body">
<h4 class="dish-name">${nameWithMarks(name, d, heat)}</h4>
${sub ? `<p class="dish-sub">${esc(sub)}</p>` : ''}
<p class="dish-what">${esc(what)}</p>
<p class="dish-story">${esc(story)}${tag && TAG[tag] ? ` <span class="tag">${TAG[tag]}</span>` : ''}</p>
</div>
<p class="dish-price">${esc(price(p))}</p>
</li>`;
}

function section(s) {
  return `<section class="menu-sec" id="m-${s.id}" aria-labelledby="h-${s.id}">
<header class="menu-sec-head"><h3 id="h-${s.id}">${esc(s.t)}</h3><p>${esc(s.k)}</p></header>
<ul class="dish-list">${s.items.map(item).join('\n')}</ul>
</section>`;
}

const clean = secs => secs.map(s => ({ ...s, id: SEC_ID[s.id] || s.id, t: scrub(s.t), k: scrub(s.k), items: s.items.map(it => it.map(scrub)) }));
// web copies of the hero plates and Flow scenes (src/gen-images.sh writes the sources)
const IMG = path.join(ROOT, 'assets/img');
const webp = (src, out, args) => {
  src = path.join(ROOT, src); out = path.join(IMG, out);
  if (!fs.existsSync(src)) return console.warn('missing', src);
  if (!fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(src).mtimeMs) execFileSync('cwebp', ['-quiet', ...args, src, '-o', out]);
};
for (const f of ['photo-chicken', 'photo-paddle', 'dish1-photo', 'dish2-photo', 'dish3-photo']) webp(`assets/plates/${f}.png`, `${f}.webp`, ['-q', '80']);
webp('assets/plates/hoarding-wood.png', 'hoarding-wood.webp', ['-q', '72', '-resize', '1376', '0']);
webp('assets/plates/poster-paper.png', 'paper.webp', ['-q', '70', '-resize', '512', '0']);
webp('assets/plates/nav-logo.png', 'logo-line.webp', ['-q', '90', '-resize', '0', '240']);
webp('assets/plates/poster-logo.png', 'logo-icon.webp', ['-q', '92', '-resize', '440', '0']);
webp('assets/plates/nav-rail-strip.png', 'nav-rail.webp', ['-q', '72']);
for (const f of ['wok-fire', 'steamer-stack', 'tap-pour', 'garden-dusk', 'beach', 'calcutta-lane', 'cabin-booths', 'noodle-cart', 'dimsum-hands', 'bao-lift', 'cocktail-bar', 'beer-trio']) webp(`assets/flow/${f}.jpg`, `${f}.webp`, ['-q', '78']);

const raw = loadMenu();
const food = clean(raw.food), drinks = clean(raw.drinks);
const leak = JSON.stringify([food, drinks]).match(/kolkata|tangra|city of joy|cabins/i);
if (leak) throw new Error('menu text still mentions ' + leak[0] + '; extend SCRUB');
const menuHtml = `<div class="menu-panel" id="panel-food" role="tabpanel" aria-labelledby="tab-food">${columns(food)}</div>
<div class="menu-panel" id="panel-drinks" role="tabpanel" aria-labelledby="tab-drinks">${columns(drinks)}</div>`;

// pull named dishes for the poster sections
const all = [...food, ...drinks].flatMap(s => s.items.map(it => ({ sec: s.id, it })));
const find = n => all.find(x => x.it[0].split('|')[0] === n)?.it;
// food rows are [title, what, how, price, diet, badge, heat, art]; drink rows drop the diet slot: [title, what, how, price, badge, heat, art]
const fields = it => it.length >= 8 ? { diet: it[4], tag: it[5], heat: it[6], art: it[7] } : { diet: null, tag: it[4], heat: it[5], art: it[6] };
const pick = n => {
  const it = find(n); if (!it) throw new Error('menu has no ' + n);
  const [name, sub] = it[0].split('|');
  return { name, sub: sub || '', what: it[1], story: it[2], price: price(it[3]), img: photo(PHOTO[name]),
    marks: marksHtml(DIET[fields(it).diet], fields(it).heat), tagmark: TAG[fields(it).tag] ? `<span class="tag">${TAG[fields(it).tag]}</span>` : '' };
};
const RAW = new Set(['marks', 'tagmark']); // these return markup, everything else is escaped text
const count = k => k === 'taps' ? all.filter(x => fields(x.it).art && fields(x.it).art[0] === 'pint').length : all.filter(x => x.sec === k).length;

let html = fs.readFileSync(path.join(ROOT, 'src/template.html'), 'utf8');
html = html.replace('<!--MENU-->', menuHtml);
html = html.replace(/\{\{([^}|]+)\|(name|sub|what|story|price|img|marks|tagmark)\}\}/g, (_, n, f) => { const v = pick(n.trim())[f]; return RAW.has(f) ? v : esc(v); });
const XV = {
  dimsum: { word: 'Dim sum', kicker: 'How a basket is built', alt: 'Illustration of a crystal prawn dumpling basket pulled apart into its layers',
    tags: ['Bamboo lid', 'Prawn and chive dumplings', 'Parchment liner', 'Bamboo steamer', 'Ceramic plate'],
    cap: 'Hand-folded, steamed to order, four to a basket.', link: ['#dimsum', 'See the dim sum'] },
  bao: { word: 'Bao', kicker: 'How a bao is built', alt: 'Illustration of a pork belly bao pulled apart into its layers',
    tags: ['Steamed bun', 'Coriander and peanut crumb', 'Braised pork belly, hoisin', 'Cucumber', 'Bun base'],
    cap: 'Two to a plate, finished to order.', link: ['#bao', 'See the bao'] },
  beer: { word: 'Beer', kicker: 'How a pint is built', alt: 'Illustration of a pint of craft lager pulled apart into its parts',
    tags: ['The tap', 'Thick foam', 'Craft lager', 'Hops and malt', 'Coaster'],
    cap: 'Three craft taps from small breweries up the coast.', link: ['#beer', 'See the taps'] },
};
const pct = v => (v * 100).toFixed(3) + '%';
function explode(name) {
  const d = JSON.parse(fs.readFileSync(path.join(ROOT, `src/explode/${name}.json`), 'utf8')), c = XV[name];
  const layers = d.layers.map((l, i) => `<img class="xv-l" src="assets/explode/${name}-${i}.webp" alt="" data-dy="${l.dy.toFixed(4)}" data-i="${i}" style="left:${pct(l.x)};top:${pct(l.y)};width:${pct(l.w)}" width="${Math.round(l.w * 896)}" height="${Math.round(l.h * 1200)}" loading="lazy">`).join('');
  const tags = d.layers.map((l, i) => `<span class="xv-tag xv-tag-${i % 2 ? 'r' : 'l'}" data-dy="${l.dy.toFixed(4)}" style="top:${pct(l.y + l.h / 2)}">${c.tags[i]}</span>`).join('');
  return `<section class="xv xv-${name}" data-xv aria-label="${esc(c.kicker)}">
  <div class="xv-stick">
    <p class="xv-kicker">${c.kicker}</p>
    <p class="xv-word" aria-hidden="true">${c.word}</p>
    <div class="xv-stage" style="--ratio:${d.ratio.toFixed(4)}" role="img" aria-label="${esc(c.alt)}">${layers}${tags}</div>
    <div class="xv-bar" aria-hidden="true"><i></i></div>
    <p class="xv-cap"><span>${c.cap}</span> <a href="${c.link[0]}">${c.link[1]}</a> <em>Illustration</em></p>
  </div>
</section>`;
}
html = html.replace(/\{\{#explode:(dimsum|bao|beer)\}\}/g, (_, k) => explode(k));
html = html.replace(/\{\{#(dimsum|bao|cocktails|taps)\}\}/g, (_, k) => String(count(k)));
fs.writeFileSync(path.join(ROOT, 'index.html'), html);
console.log('index.html written:', food.length, 'food sections,', drinks.length, 'drinks sections');
