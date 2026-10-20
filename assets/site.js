// Menu tabs and the paste-up of the deal bills when they scroll into view.
document.documentElement.classList.replace('no-js', 'js');

const tabs = [...document.querySelectorAll('[role="tab"]')];
function show(tab) {
  tabs.forEach(t => {
    const on = t === tab;
    t.setAttribute('aria-selected', on);
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
  });
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => show(t));
  t.addEventListener('keydown', e => {
    const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!k) return;
    const next = tabs[(i + k + tabs.length) % tabs.length];
    show(next); next.focus();
  });
});
// "See the menu" always lands on the food list
document.querySelectorAll('a[href="#menu"]').forEach(a => a.addEventListener('click', () => show(tabs[0])));
if (tabs.length) show(tabs[0]);

const bills = document.querySelector('.bills');
if (bills && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { bills.classList.add('in'); io.disconnect(); }
  }), { threshold: .2 });
  io.observe(bills);
} else if (bills) bills.classList.add('in');
