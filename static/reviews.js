(function () {
  const KEY = 'gk_reviews_v1';
  const dlg = document.getElementById('rv-dialog');
  const MAX = +dlg.dataset.max;
  const list = document.getElementById('rv-list');
  const staticReviews = JSON.parse(document.getElementById('rv-data').textContent || '[]');

  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } };
  const save = (a) => { try { localStorage.setItem(KEY, JSON.stringify(a.slice(0, 30))); } catch (e) {} };
  let mine = load().map(r => Object.assign({mine: true}, r));

  const starsEl = (n) => {
    const s = document.createElement('span'); s.className = 'stars'; s.setAttribute('aria-label', n + ' из 10');
    for (let i = 1; i <= 10; i++) { const c = document.createElement('span'); c.textContent = '⭐'; if (i > n) c.className = 'off'; s.appendChild(c); }
    return s;
  };

  function render() {
    const all = mine.concat(staticReviews);
    list.innerHTML = '';
    if (!all.length) {
      const e = document.createElement('div'); e.className = 'empty';
      e.innerHTML = '<b>Пока нет отзывов</b>Станьте первым, кто поделится мнением о нашем клинкере.';
      list.appendChild(e);
    }
    all.forEach((r, i) => {
      const d = document.createElement('article'); d.className = 'rv' + (r.mine ? ' mine' : '');
      const top = document.createElement('div'); top.className = 'rv-top';
      const nm = document.createElement('b'); nm.textContent = r.name;
      if (r.mine) { const t = document.createElement('span'); t.className = 'tag'; t.textContent = 'ваш отзыв'; nm.appendChild(t); }
      const dt = document.createElement('small'); dt.textContent = r.date || '';
      top.append(nm, dt);
      const rt = document.createElement('div'); rt.appendChild(starsEl(r.rating));
      const sc = document.createElement('span'); sc.className = 'rv-score'; sc.textContent = r.rating + '/10'; rt.appendChild(sc);
      const p = document.createElement('p'); p.textContent = r.text;
      d.append(top, rt, p); list.appendChild(d);
      if (window.rvObserve) window.rvObserve(d, i % 2);
    });
    const avg = document.getElementById('avg');
    if (all.length) {
      const m = all.reduce((s, r) => s + r.rating, 0) / all.length;
      document.getElementById('avg-n').textContent = m.toFixed(1);
      const as = document.getElementById('avg-s'); as.innerHTML = ''; as.appendChild(starsEl(Math.round(m)));
      document.getElementById('avg-c').textContent = 'на основе ' + all.length + ' ' + plural(all.length);
      avg.hidden = false;
    } else avg.hidden = true;
  }
  const plural = n => { const a = n % 10, b = n % 100; return (a === 1 && b !== 11) ? 'отзыва' : 'отзывов'; };

  // ---- выбор звёзд ----
  const pick = document.getElementById('pick');
  let rating = 0;
  const btns = [];
  for (let i = 1; i <= 10; i++) {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = '⭐';
    b.setAttribute('role', 'radio'); b.setAttribute('aria-label', i + ' из 10');
    b.addEventListener('click', () => { rating = i; paint(i); label(); });
    b.addEventListener('mouseenter', () => paint(i));
    btns.push(b); pick.appendChild(b);
  }
  const val = document.createElement('span'); val.className = 'pick-val'; pick.appendChild(val);
  const paint = n => btns.forEach((b, k) => b.classList.toggle('on', k < n));
  const label = () => { val.textContent = rating ? rating + ' / 10' : ''; };
  pick.addEventListener('mouseleave', () => paint(rating));

  // ---- форма ----
  const form = document.getElementById('rv-form');
  const nameI = document.getElementById('rv-name'), textI = document.getElementById('rv-text');
  const cnt = document.getElementById('cnt');
  const setErr = (id, m) => { document.getElementById(id).textContent = m || ''; };
  textI.addEventListener('input', () => {
    cnt.textContent = textI.value.length + ' / ' + MAX; cnt.classList.toggle('warn', textI.value.length > MAX - 20);
  });

  function openDlg() {
    form.reset(); rating = 0; paint(0); label(); cnt.textContent = '0 / ' + MAX;
    ['err-name', 'err-rating', 'err-text'].forEach(i => setErr(i));
    document.getElementById('rv-form-box').hidden = false; document.getElementById('rv-ok').hidden = true;
    dlg.showModal(); nameI.focus();
  }
  document.querySelectorAll('[data-open-review]').forEach(b => b.addEventListener('click', openDlg));
  dlg.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => dlg.close()));
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = nameI.value.trim().replace(/\s+/g, ' '), text = textI.value.trim();
    let bad = false;
    if (name.length < 3) { setErr('err-name', 'Введите ФИО'); bad = true; } else setErr('err-name');
    if (!rating) { setErr('err-rating', 'Поставьте оценку от 1 до 10'); bad = true; } else setErr('err-rating');
    if (text.length < 5) { setErr('err-text', 'Напишите пару слов об отзыве'); bad = true; } else setErr('err-text');
    if (bad) return;
    const r = {name: name, rating: rating, text: text.slice(0, MAX), date: new Date().toLocaleDateString('ru-RU')};
    const stored = load(); stored.unshift(r); save(stored);
    mine = stored.map(x => Object.assign({mine: true}, x));
    render();
    const msg = 'Отзыв для сайта\nФИО: ' + r.name + '\nОценка: ' + r.rating + '/10\nОтзыв: ' + r.text;
    document.getElementById('rv-send').href = dlg.dataset.wa + '?text=' + encodeURIComponent(msg);
    document.getElementById('rv-form-box').hidden = true; document.getElementById('rv-ok').hidden = false;
  });

  render();
})();
