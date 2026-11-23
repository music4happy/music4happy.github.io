/* 착한이웃교회 홈페이지 공통 동작 */
(function () {
  /* 모바일 메뉴 */
  var btn = document.querySelector('.menu-btn'), gnb = document.querySelector('.gnb');
  if (btn && gnb) btn.addEventListener('click', function () { var o = gnb.classList.toggle('open'); btn.setAttribute('aria-expanded', o ? 'true' : 'false'); btn.textContent = o ? '✕' : '☰'; });

  /* 메인 슬라이드 */
  var slides = document.querySelectorAll('.slide'), dots = document.querySelector('.dots'), cur = 0, timer;
  if (slides.length && dots) {
    slides.forEach(function (s, i) { var d = document.createElement('button'); d.type = 'button'; d.setAttribute('aria-label', (i + 1) + '번째 소식'); d.addEventListener('click', function () { go(i); restart(); }); dots.appendChild(d); });
    function go(i) { slides[cur].classList.remove('on'); dots.children[cur].classList.remove('on'); cur = (i + slides.length) % slides.length; slides[cur].classList.add('on'); dots.children[cur].classList.add('on'); }
    function restart() { clearInterval(timer); timer = setInterval(function () { go(cur + 1); }, 6000); }
    go(0); restart();
    var x0 = null, hero = document.querySelector('.hero');
    hero.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) { go(cur + (dx < 0 ? 1 : -1)); restart(); } x0 = null; });
  }

  /* 사진 크게 보기 */
  var lb = document.getElementById('lightbox');
  if (lb) {
    document.querySelectorAll('[data-zoom]').forEach(function (el) { el.addEventListener('click', function () { lb.querySelector('img').src = el.getAttribute('data-zoom') || el.src; lb.classList.add('on'); }); });
    lb.addEventListener('click', function () { lb.classList.remove('on'); });
  }

  /* 앱(홈 화면 추가) */
  if ('serviceWorker' in navigator) window.addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function () {}); });
})();
