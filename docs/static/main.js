// Плавное появление блоков при прокрутке
(function () {
  const sel = '.sec-h,.stats>div,.adv>div,.card,.contacts>div,.gal,.info>*,.more,.rv-head,.rv,.empty';
  const els = [...document.querySelectorAll(sel)];
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold: 0.12, rootMargin: '0px 0px -40px 0px'});
  window.rvObserve = (el, i) => {
    el.classList.add('rv-in');
    el.style.setProperty('--d', Math.min(i, 5) * 0.09 + 's');
    io.observe(el);
  };
  els.forEach(el => {
    const i = [...el.parentNode.children].indexOf(el);
    window.rvObserve(el, i);
  });
})();
