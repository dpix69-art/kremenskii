(function () {
  var KEY = 'cookieConsent';
  var COOKIE = 'cookie_consent=1; Max-Age=31536000; Path=/; SameSite=Lax';

  function getBanner() { return document.getElementById('cookie-banner'); }
  function getClose()  { return document.getElementById('cookie-close'); }

  function isAccepted() {
    try { if (localStorage.getItem(KEY) === 'accepted') return true; } catch (e) {}
    return document.cookie.indexOf('cookie_consent=1') !== -1;
  }

  function show() { var b = getBanner(); if (b) b.hidden = false; }
  function hide() { var b = getBanner(); if (b) b.hidden = true; }

  function accept() {
    try { localStorage.setItem(KEY, 'accepted'); } catch (e) {}
    document.cookie = COOKIE;
    // максимально явно убираем баннер
    var b = getBanner();
    if (b) b.remove();
  }

  function wire() {
    var close = getClose();
    var banner = getBanner();

    // 1) явная привязка к крестику
    if (close) {
      close.addEventListener('click', accept);
      close.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); accept(); }
      });
    }

    // 2) делегирование: если что-то помешало — ловим клик по баннеру и проверяем цель
    if (banner) {
      banner.addEventListener('click', function (e) {
        if (e.target && (e.target.id === 'cookie-close' || e.target.closest && e.target.closest('#cookie-close'))) {
          accept();
        }
      });
    }
  }

  function init() {
    if (!isAccepted()) {
      show();
      wire();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
