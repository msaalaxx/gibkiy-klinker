const sl = document.getElementById('sl');
const dots = [...document.querySelectorAll('#dots i')];
const th = [...document.querySelectorAll('.thumbs img')];
const mark = i => {
  dots.forEach((d, k) => d.classList.toggle('on', k == i));
  th.forEach((t, k) => t.classList.toggle('on', k == i));
};
sl.addEventListener('scroll', () => {
  const i = Math.round(sl.scrollLeft / sl.clientWidth);
  mark(i);
  if (i != 3) sl.querySelector('video').pause();
});
th.forEach(t => t.onclick = () => sl.scrollTo({left: sl.clientWidth * t.dataset.i, behavior: 'smooth'}));
mark(0);
