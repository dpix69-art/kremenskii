(function(){
  var KEY = 'cookieConsent';
  var COOKIE = 'cookie_consent=1; max-age=31536000; path=/; SameSite=Lax';
  function accepted(){
    try{ if(localStorage.getItem(KEY)==='accepted') return true; }catch(e){}
    return /(?:^|; )cookie_consent=1/.test(document.cookie);
  }
  function show(){
    var b = document.getElementById('cookie-banner');
    if(b) b.hidden = false;
  }
  function hide(){
    var b = document.getElementById('cookie-banner');
    if(b) b.hidden = true;
  }
  function accept(){
    try{ localStorage.setItem(KEY,'accepted'); }catch(e){}
    document.cookie = COOKIE;
    hide();
  }
  function wire(){
    var btn = document.getElementById('cookie-close');
    if(btn){ btn.addEventListener('click', accept); }
  }
  if(!accepted()){
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', function(){ show(); wire(); });
    }else{ show(); wire(); }
  }
})();