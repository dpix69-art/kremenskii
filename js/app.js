(function () {
  var KEY = 'cookieConsent';
  var COOKIE = 'cookie_consent=1; Max-Age=31536000; Path=/; SameSite=Lax';

  function $id(id){ return document.getElementById(id); }

  function isAccepted() {
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

  var closed = false; // защита от двойных кликов
  function accept(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (closed) return;
    closed = true;
    try { localStorage.setItem(KEY, 'accepted'); } catch (e) {}
    document.cookie = COOKIE;
    hide();
  }

  var wired = false;
  function wire() {
    if (wired) return;
    wired = true;

    var close  = $id('cookie-close');
    var banner = $id('cookie-banner');

    if (close) {
      close.addEventListener('click', accept, { passive:false });
      // без pointerup — чтобы не было двойного срабатывания
      close.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') accept(e);
      });
    }
    if (banner) {
      // делегирование на всякий случай
      banner.addEventListener('click', function (e) {
        var t = e.target;
        if (t && (t.id === 'cookie-close' || (t.closest && t.closest('#cookie-close')))) {
          accept(e);
        }
      });
    }
    console.log('[cookie] wired');
  }

  function sync() {
    if (isAccepted()) hide(); else show();
  }

  function init() { wire(); sync(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('[cookie] loaded');
})();
