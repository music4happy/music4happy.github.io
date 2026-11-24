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

  /* 온라인 헌금 */
  var ACC = '농협 351-1208-0675-83', HOLDER = '착한이웃교회';
  var gm = document.createElement('div'); gm.id = 'giveModal'; gm.className = 'give-modal'; gm.setAttribute('role', 'dialog'); gm.setAttribute('aria-label', '온라인 헌금');
  gm.innerHTML = '<div class="give-sheet"><p class="sec-label">온라인 헌금</p><h3>감사의 마음을 드립니다</h3><div class="acc"><span>농협</span><b>351-1208-0675-83</b><small>예금주 착한이웃교회</small></div><button type="button" class="btn btn-gold" id="giveCopy">계좌번호 복사하기</button><p class="gnote">복사한 뒤 사용하시는 은행 앱에서 붙여 넣어 보내 주세요. 주일 예배에는 헌금 시간이 따로 없고, 예배당 헌금함을 이용하실 수 있습니다.</p><button type="button" class="btn btn-line" id="giveClose">닫기</button></div>';
  document.body.appendChild(gm);
  function openGive(e) { if (e) e.preventDefault(); gm.classList.add('on'); }
  document.querySelectorAll('[data-give]').forEach(function (a) { a.addEventListener('click', openGive); });
  if (location.hash === '#give') openGive();
  gm.addEventListener('click', function (e) { if (e.target === gm) gm.classList.remove('on'); });
  document.getElementById('giveClose').addEventListener('click', function () { gm.classList.remove('on'); });
  document.getElementById('giveCopy').addEventListener('click', function () {
    var t = '351-1208-0675-83', b = this;
    var done = function () { b.textContent = '복사했어요! 은행 앱에서 붙여 넣으세요'; setTimeout(function () { b.textContent = '계좌번호 복사하기'; }, 2500); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, function () { prompt('계좌번호를 복사해 주세요', t); }); else prompt('계좌번호를 복사해 주세요', t);
  });
})();
