(function () {
  var KEY = 'cookieConsent';
  var COOKIE = 'cookie_consent=1; Max-Age=31536000; Path=/; SameSite=Lax';

  function $id(id){ return document.getElementById(id); }

  function accepted() {
    try { if (localStorage.getItem(KEY) === 'accepted') return true; } catch (e) {}
    return document.cookie.indexOf('cookie_consent=1') !== -1;
  }

  function show() {
    var b = $id('cookie-banner');
    if (!b) return;
    b.removeAttribute('hidden');
    b.style.display = 'flex';
  }
  function hide() {
    var b = $id('cookie-banner');
    if (!b) return;
    b.style.display = 'none';
    b.setAttribute('hidden','');
  }

  function accept(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    try { localStorage.setItem(KEY, 'accepted'); } catch (e) {}
    document.cookie = COOKIE;
    hide();
  }

  function wire() {
    var close = $id('cookie-close');
    var banner = $id('cookie-banner');

    // 1) Явная привязка к крестику
    if (close) {
      close.addEventListener('click', accept, { passive:false });
      close.addEventListener('pointerup', accept, { passive:false });
      close.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') accept(e);
      });
    }
    // 2) Делегирование на сам баннер
    if (banner) {
      banner.addEventListener('click', function (e) {
        var t = e.target;
        if (!t) return;
        if (t.id === 'cookie-close' || (t.closest && t.closest('#cookie-close'))) accept(e);
      });
    }
    // 3) Глобальный «страховочный» обработчик в capture-фазе
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (!t) return;
      if (t.id === 'cookie-close' || (t.closest && t.closest('#cookie-close'))) accept(e);
    }, true);
  }

  function init() {
    if (accepted()) return;
    show();
    wire();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
