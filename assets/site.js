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
document.documentElement.classList.add('motion');
