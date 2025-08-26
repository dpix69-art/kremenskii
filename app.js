(function(){
  var KEY = 'cookieConsent';
  var COOKIE = 'cookie_consent=1; Max-Age=31536000; Path=/; SameSite=Lax';

  function accepted(){
    try { if (localStorage.getItem(KEY) === 'accepted') return true; } catch(e){}
    return document.cookie.indexOf('cookie_consent=1') !== -1;
  }

  function getBanner(){ return document.getElementById('cookie-banner'); }
  function show(){ var b = getBanner(); if (b) b.style.display = 'flex'; }
  function hide(){ var b = getBanner(); if (b) b.style.display = 'none'; }

  function accept(ev){
    if (ev) ev.preventDefault();
    try { localStorage.setItem(KEY, 'accepted'); } catch(e){}
    document.cookie = COOKIE;
    hide();
  }

  function wire(){
    var b = getBanner();
    if (!b) return;
    var close = document.getElementById('cookie-close') || document.getElementById('cookie-accept-btn');

    // Явная привязка к кнопке (крестику)
    if (close){
      close.addEventListener('click', accept);
      close.addEventListener('keydown', function(e){
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); accept(e); }
      });
    }

    // Делегирование: на всякий случай
    b.addEventListener('click', function(e){
      var t = e.target;
      if (!t) return;
      if (
        t.id === 'cookie-close' || t.id === 'cookie-accept-btn' ||
        (t.closest && (t.closest('#cookie-close') || t.closest('#cookie-accept-btn')))
      ){
        accept(e);
      }
    });
  }

  function init(){
    if (!accepted()){
      show();
      wire();
    }
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
