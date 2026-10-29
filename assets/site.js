// Menu tabs, and the once-only scroll-in moments (deals board, photos, lists, the Opening soon stamp).
// Content is visible by default: the hidden starting states only apply once `.motion` is set at the end of this file.
document.documentElement.classList.replace('no-js', 'js');

const tabs = [...document.querySelectorAll('[role="tab"]')];
function show(tab, animate) {
  tabs.forEach(t => {
    const on = t === tab;
    t.setAttribute('aria-selected', on);
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
  });
  if (!animate) return;
  const panel = document.getElementById(tab.getAttribute('aria-controls'));
  panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap'); // restart the short fade
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => { if (t.getAttribute('aria-selected') !== 'true') show(t, true); });
  t.addEventListener('keydown', e => {
    const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!k) return;
    const next = tabs[(i + k + tabs.length) % tabs.length];
    show(next, true); next.focus();
  });
});
// "See the menu" always lands on the food list
document.querySelectorAll('a[href="#menu"]').forEach(a => a.addEventListener('click', () => {
  if (tabs[0] && tabs[0].getAttribute('aria-selected') !== 'true') show(tabs[0], true);
}));
if (tabs.length) show(tabs[0], false);

// one observer: whatever scrolls into view gets `.in` once, and the CSS plays its motion
const still = /[?&]still\b/.test(location.search); // ?still shows the finished page (screenshots, print checks)
const targets = document.querySelectorAll('.bills, .find, [data-reveal], [data-stagger]');
document.querySelectorAll('[data-stagger]').forEach(g => [...g.children].forEach((c, i) => c.style.setProperty('--i', i)));
if (still || !('IntersectionObserver' in window)) {
  targets.forEach(el => el.classList.add('in'));
} else {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .18, rootMargin: '0px 0px -6% 0px' });
  targets.forEach(el => io.observe(el));
}
// lazy images fade in when they finish loading instead of popping in (an already-cached image is ready at once)
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  const ready = () => img.classList.add('ready');
  if (img.complete) ready(); else { img.addEventListener('load', ready, { once: true }); img.addEventListener('error', ready, { once: true }); }
});

// the story: the chapter crossing the middle of the screen sets the step the route map draws to
const story = document.querySelector('.story');
const chapters = [...document.querySelectorAll('.chapter')];
if (story && chapters.length) {
  const setStep = ch => {
    story.dataset.step = ch.dataset.step;
    chapters.forEach(c => c.classList.toggle('on', c === ch));
  };
  if (still || !('IntersectionObserver' in window)) { story.dataset.step = '6'; chapters.forEach(c => c.classList.add('on')); }
  else {
    setStep(chapters[0]);
    const so = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setStep(e.target); }),
      { rootMargin: '-38% 0px -50% 0px' });
    chapters.forEach(c => so.observe(c));
  }
}


// looping clips play only while on screen (and never under reduced motion or ?still: the poster stays)
const loops = document.querySelectorAll('video[data-loop]');
if (loops.length && 'IntersectionObserver' in window && !still && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const vo = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) { v.preload = 'auto'; const p = v.play(); if (p && p.catch) p.catch(() => {}); } else v.pause();
  }), { threshold: .25 });
  loops.forEach(v => vo.observe(v));
}

// whole-page smooth scrolling (Lenis, self-hosted): wheel and trackpad glide, touch stays native, anchors ease to their target
let lenis = null;
if (!still && window.Lenis && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  lenis = new Lenis({ lerp: .085, wheelMultiplier: 1, smoothWheel: true });
  const loop = t => { lenis.raf(t); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a || a.getAttribute('href').length < 2) return;
    const to = document.querySelector(a.getAttribute('href')); if (!to) return;
    e.preventDefault();
    lenis.scrollTo(to, { offset: -(parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0), duration: 1.3, easing: t => 1 - Math.pow(1 - t, 4) });
    history.pushState(null, '', a.getAttribute('href'));
  });
}

// exploded views: a tall section pins the stage while scroll pulls the layers together into one dish.
// The scroll position only sets a target; the picture eases toward it every frame, so wheel notches and
// touch flicks glide instead of stepping (frame-rate independent, nothing but transform and opacity moves).
const xvs = [...document.querySelectorAll('[data-xv]')];
if (xvs.length) {
  const calm = still || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const smooth = t => t * t * (3 - 2 * t);
  const out = t => 1 - Math.pow(1 - t, 3);
  const items = xvs.map(el => ({
    el, stick: el.querySelector('.xv-stick'), stage: el.querySelector('.xv-stage'), cap: el.querySelector('.xv-cap'),
    word: el.querySelector('.xv-word'), kicker: el.querySelector('.xv-kicker'), k0: el.querySelector('.xv-kicker').textContent, k1: el.dataset.k1 || 'Ready to eat', pf: +el.dataset.frames || 0, cv: el.querySelector('.xv-pour-cv'), frames: [], shown: -1, pcur: -1, ptarget: 0, started: false, rv: 1, pp: 0,
    bar: el.querySelector('.xv-bar i'), whole: el.querySelector('.xv-whole'),
    layers: [...el.querySelectorAll('.xv-l')], tags: [...el.querySelectorAll('.xv-tag')],
    target: 0, cur: -1, h: 0, label: '',
  }));
  if (calm) items.forEach(it => it.el.classList.add('xv-calm'));
  else {
    // show a stage only once all its pictures have loaded and decoded (one retry each), so layers never pop in piecemeal
    items.forEach(it => {
      const imgs = [...it.layers, it.whole].filter(Boolean);
      const ok = img => img.decode().catch(() => new Promise(res => { const src = img.src; img.src = ''; img.src = src; img.decode().then(res, res); }));
      Promise.race([Promise.all(imgs.map(ok)), new Promise(r => setTimeout(r, 6000))]).then(() => it.stage.classList.add('xv-ready'));
    });
    const measure = it => { it.h = it.stage.offsetHeight; };
    const aim = it => {                                              // scroll position -> target progress (0 apart, 1 together)
      const r = it.el.getBoundingClientRect(), run = r.height - it.stick.offsetHeight;
      it.t = clamp(-r.top / Math.max(1, run), 0, 1);
      if (it.pf) {                                                   // act 1: the glass fills under the tap; act 2: it pulls apart and comes together
        it.ptarget = clamp((it.t - .03) / .34, 0, 1) * (it.pf - 1);
        it.target = clamp((it.t - .5) / .4, 0, 1);
        it.rv = smooth(clamp((it.t - .38) / .1, 0, 1));
      } else it.target = clamp((it.t - .1) / .62, 0, 1);
      it.live = r.bottom > -200 && r.top < innerHeight + 200;
    };
    const paintPour = it => {                                         // draw the nearest loaded frame at or below the current one
      let k = Math.round(it.pcur); while (k > 0 && !it.frames[k]) k--;
      if (it.frames[k] && k !== it.shown) { it.cv.getContext('2d').drawImage(it.frames[k], 0, 0, it.cv.width, it.cv.height); it.shown = k; }
    };
    const loadPour = it => {
      if (it.started) return; it.started = true;
      const order = [...Array(it.pf).keys()].sort((a, b) => (a % 6 ? 1 : 0) - (b % 6 ? 1 : 0) || a - b);   // every 6th frame first
      order.forEach(i => { const im = new Image(); im.decoding = 'async'; im.onload = () => { it.frames[i] = im; it.shown = -1; paintPour(it); }; im.src = `assets/pour/f-${String(i).padStart(3, '0')}.webp`; });
    };
    items.filter(it => it.pf).forEach(it => new IntersectionObserver(es => { if (es[0].isIntersecting) loadPour(it); }, { rootMargin: '1800px 0px' }).observe(it.el));
    const draw = it => {
      const p = it.cur, h = it.h;
      it.layers.forEach((l, i) => {                                   // outer layers leave first, so the stack folds in a wave
        const q = smooth(clamp((p - i * .04) / .84, 0, 1)), bump = Math.sin(q * Math.PI);
        l.style.transform = `translate3d(0, ${(+l.dataset.dy * h * q).toFixed(2)}px, 0) rotate(${((i % 2 ? 1 : -1) * 3 * bump).toFixed(2)}deg) scale(${(1 + .045 * bump).toFixed(4)})`;
      });
      const fuse = smooth(clamp((p - .86) / .12, 0, 1));              // the layers dissolve into the finished dish
      it.layers.forEach(l => l.style.opacity = ((1 - fuse) * it.rv).toFixed(3));
      if (it.whole) { it.whole.style.opacity = (fuse * it.rv).toFixed(3); it.whole.style.transform = `scale(${(.97 + .03 * fuse).toFixed(4)})`; }
      it.tags.forEach((g, i) => {
        const q = smooth(clamp((p - i * .04) / .84, 0, 1));
        g.style.transform = `translate3d(0, calc(-50% + ${(+g.dataset.dy * h * q).toFixed(2)}px), 0)`;
        g.style.opacity = ((1 - smooth(clamp(p / .28, 0, 1))) * it.rv).toFixed(3);
      });
      const done = out(clamp((p - .9) / .1, 0, 1)), e = smooth(p);
      it.cap.style.opacity = done.toFixed(3);
      it.cap.style.transform = `translate3d(0, ${((1 - done) * 18).toFixed(1)}px, 0)`;
      it.word.style.transform = `translate3d(0, ${((.5 - e) * 70).toFixed(1)}px, 0) scale(${(.92 + .16 * e).toFixed(4)})`;
      let sc = .9 + .17 * e;                                           // slow push-in as it comes together
      if (it.pf) {
        it.pp = clamp(it.pcur / (it.pf - 1), 0, 1); paintPour(it);
        it.cv.style.opacity = (1 - it.rv).toFixed(3);
        sc = (1 - it.rv) * (.94 + .06 * it.pp) + it.rv * sc;
      }
      it.stage.style.transform = `scale(${sc.toFixed(4)})`;
      it.bar.style.transform = `scaleX(${it.t.toFixed(4)})`;
      let label = p < .06 ? it.k0 : p > .94 ? it.k1 : 'Coming together';
      if (it.pf && p < .06) label = it.rv < .2 ? (it.pp < .03 ? it.k0 : it.pp > .97 ? 'Poured' : 'Pouring') : 'What’s in a pint';
      if (label !== it.label) { it.label = label; it.kicker.textContent = label; }
    };
    let last = 0, running = false;
    const frame = now => {
      const dt = Math.min(64, now - (last || now)); last = now;
      let busy = false;
      items.forEach(it => {
        if (!it.live) return;
        if (it.cur < 0) it.cur = it.target;
        const k = 1 - Math.exp(-dt / (lenis ? 55 : 95));              // ~95ms time constant
        let moved = false;
        if (it.pf) { if (it.pcur < 0) it.pcur = it.ptarget; const pd = it.ptarget - it.pcur; if (Math.abs(pd) > .02) { it.pcur += pd * k; moved = true; } else if (it.pcur !== it.ptarget) { it.pcur = it.ptarget; moved = true; } }
        const d = it.target - it.cur;
        if (Math.abs(d) > .0004) { it.cur += d * k; busy = true; moved = true; }
        else if (it.cur !== it.target) { it.cur = it.target; moved = true; }
        if (moved) { draw(it); if (it.pf && Math.abs(it.ptarget - it.pcur) > .02) busy = true; }
      });
      if (busy) requestAnimationFrame(frame); else { running = false; last = 0; }
    };
    const kick = () => { items.forEach(aim); if (!running) { running = true; requestAnimationFrame(frame); } };
    const remeasure = () => { items.forEach(measure); items.forEach(it => it.cur = -1); kick(); };
    addEventListener('scroll', kick, { passive: true }); addEventListener('resize', remeasure);
    document.documentElement.classList.add('xv-on');
    remeasure();
  }
}
document.documentElement.classList.add('motion');
