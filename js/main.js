/* Silk Road Legal Alliance — переключатель языка, вкладки профилей, копирование контактов.
   Тексты на обоих языках лежат прямо в index.html: <span lang="en"> и <span lang="ru">. */
(function () {
  var root = document.documentElement;

  function setLang(l) {
    root.classList.remove('l-en', 'l-ru');
    root.classList.add('l-' + l);
    root.lang = l;
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.l === l));
    });
    try { localStorage.setItem('srla-lang', l); } catch (e) {}
  }

  var init = 'en';
  try {
    var saved = localStorage.getItem('srla-lang');
    if (saved === 'ru' || saved === 'en') init = saved;
  } catch (e) {}
  // Ссылки вида ?lang=ru или #ru сразу открывают нужный язык
  var q = new URLSearchParams(location.search).get('lang');
  if (q === 'ru' || q === 'en') init = q;
  if (location.hash === '#ru') init = 'ru';
  if (location.hash === '#en') init = 'en';
  setLang(init);

  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.l); });
  });

  function showTab(id) {
    document.querySelectorAll('[data-tab]').forEach(function (t) {
      t.setAttribute('aria-selected', String(t.dataset.tab === id));
    });
    document.querySelectorAll('.bio').forEach(function (p) { p.hidden = p.id !== 'bio-' + id; });
  }
  document.querySelectorAll('[data-tab]').forEach(function (t) {
    t.addEventListener('click', function () { showTab(t.dataset.tab); });
  });
  document.querySelectorAll('[data-open]').forEach(function (b) {
    b.addEventListener('click', function () {
      showTab(b.dataset.open);
      document.getElementById('profiles').scrollIntoView();
    });
  });

  function selectValue(b) {
    var v = b.parentNode.querySelector('.v');
    var r = document.createRange();
    r.selectNodeContents(v);
    var s = getSelection();
    s.removeAllRanges();
    s.addRange(r);
  }
  document.querySelectorAll('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var done = function () {
        b.classList.add('ok');
        setTimeout(function () { b.classList.remove('ok'); }, 1400);
      };
      try {
        navigator.clipboard.writeText(b.dataset.copy).then(done, function () { selectValue(b); });
      } catch (e) { selectValue(b); }
    });
  });
})();
