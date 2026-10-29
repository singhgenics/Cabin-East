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

// exploded views: a tall section pins the stage while scroll pulls the layers together into one stack
const xvs = [...document.querySelectorAll('[data-xv]')];
if (xvs.length) {
  const calm = still || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const smooth = t => t * t * (3 - 2 * t);
  const items = xvs.map(el => ({
    el, stick: el.querySelector('.xv-stick'), stage: el.querySelector('.xv-stage'), cap: el.querySelector('.xv-cap'),
    word: el.querySelector('.xv-word'), kicker: el.querySelector('.xv-kicker'), k0: el.querySelector('.xv-kicker').textContent, k1: 'Ready to eat', bar: el.querySelector('.xv-bar i'),
    layers: [...el.querySelectorAll('.xv-l')], tags: [...el.querySelectorAll('.xv-tag')], p: -1,
  }));
  if (calm) items.forEach(it => it.el.classList.add('xv-calm'));
  else {
    const draw = it => {
      const r = it.el.getBoundingClientRect(), run = r.height - it.stick.offsetHeight;
      const t = clamp(-r.top / Math.max(1, run), 0, 1);
      const p = clamp((t - .12) / .6, 0, 1);                       // hold apart, pull together, hold together
      if (Math.abs(p - it.p) < .0004) return;
      it.p = p;
      const h = it.stage.offsetHeight, n = it.layers.length;
      it.layers.forEach((l, i) => {                                   // outer layers leave first, so the stack folds in a wave
        const q = smooth(clamp((p - i * .045) / .82, 0, 1)), bump = Math.sin(q * Math.PI);
        l.style.transform = `translateY(${(+l.dataset.dy * h * q).toFixed(1)}px) rotate(${((i % 2 ? 1 : -1) * 3.2 * bump).toFixed(2)}deg) scale(${(1 + .05 * bump).toFixed(3)})`;
      });
      it.tags.forEach((g, i) => {
        const q = smooth(clamp((p - i * .045) / .82, 0, 1));
        g.style.transform = `translateY(calc(-50% + ${(+g.dataset.dy * h * q).toFixed(1)}px))`;
        g.style.opacity = (1 - smooth(clamp(p / .3, 0, 1))).toFixed(3);
      });
      const done = smooth(clamp((p - .86) / .14, 0, 1)), e = smooth(p);
      it.cap.style.opacity = done.toFixed(3);
      it.cap.style.transform = `translateY(${((1 - done) * 16).toFixed(1)}px)`;
      it.word.style.transform = `translateY(${((.5 - e) * 60).toFixed(1)}px) scale(${(.92 + .16 * e).toFixed(3)})`;
      it.stage.style.transform = `scale(${(.9 + .16 * e).toFixed(3)})`;  // slow push-in as it comes together
      it.bar.style.transform = `scaleX(${t.toFixed(3)})`;
      it.kicker.textContent = p < .08 ? it.k0 : p > .92 ? it.k1 : 'Coming together';
    };
    let queued = false;
    const tick = () => { queued = false; items.forEach(draw); };
    const kick = () => { if (!queued) { queued = true; requestAnimationFrame(tick); } };
    addEventListener('scroll', kick, { passive: true }); addEventListener('resize', kick); tick();
    document.documentElement.classList.add('xv-on');
  }
}
document.documentElement.classList.add('motion');
