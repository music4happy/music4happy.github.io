/* 키움스쿨 공통 동작: 미션 체크, 퀴즈, 카톡 보내기, 인쇄, 소리로 듣기 */
(function () {
  var K = window.KIUM || {};
  var KAKAO = ''; // 키움스쿨 선생님 카카오톡 채널(1:1 채팅) 또는 오픈채팅 주소. 넣으면 '선생님께 보내기'가 바로 연결됩니다.
  function $(s) { return document.querySelector(s); }
  function toast(t) { var el = $('#ktoast'); if (!el) return; el.textContent = t; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove('on'); }, 2600); }
  function nameOf() { var n = ($('#kname') && $('#kname').value.trim()) || ''; try { if (n) localStorage.setItem('kium_name', n); } catch (e) {} return n || '키움이'; }
  try { var saved = localStorage.getItem('kium_name'); if (saved && $('#kname')) $('#kname').value = saved; } catch (e) {}
  function send(text, title) {
    if (KAKAO) {
      var go = function () { location.href = KAKAO; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast('내용을 복사했어요. 채팅창에 붙여 넣어 주세요.'); setTimeout(go, 900); }, go); else go();
      return;
    }
    if (navigator.share) { navigator.share({ title: title || '키움스쿨', text: text }).catch(function () {}); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast('복사했어요. 카톡 대화창에 붙여 넣어 주세요.'); });
    else prompt('아래 내용을 복사해 주세요', text);
  }
  window.kiumSend = send;

  /* 주중 미션 */
  var box = $('#missions');
  if (box && K.missions) {
    var key = 'kium_' + K.id + '_' + K.week;
    var done = {}; try { done = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) {}
    K.missions.forEach(function (m, i) {
      var li = document.createElement('label'); li.className = 'mi' + (done[i] ? ' done' : '');
      li.innerHTML = '<input type="checkbox"' + (done[i] ? ' checked' : '') + '><span class="day">' + m[0] + '</span><span class="txt">' + m[1] + '</span><span class="stamp">참 잘했어요</span>';
      li.querySelector('input').addEventListener('change', function (e) { done[i] = e.target.checked; li.classList.toggle('done', e.target.checked); try { localStorage.setItem(key, JSON.stringify(done)); } catch (er) {} prog(); if (e.target.checked) toast(m[0] + ' 미션 성공!'); });
      box.appendChild(li);
    });
    function prog() { var n = Object.keys(done).filter(function (k) { return done[k]; }).length; var p = $('#mprog'); if (p) { p.style.width = (n / K.missions.length * 100) + '%'; } var t = $('#mcount'); if (t) t.textContent = n + ' / ' + K.missions.length; return n; }
    prog();
    var mb = $('#msend'); if (mb) mb.addEventListener('click', function () {
      var n = prog(), list = K.missions.filter(function (m, i) { return done[i]; }).map(function (m) { return '✔ ' + m[0] + ' ' + m[1]; }).join('\n');
      send('[' + K.name + '] ' + nameOf() + '의 주중 미션 ' + n + '/' + K.missions.length + ' 완료!\n' + (list || '아직 시작 전이에요. 응원해 주세요!') + '\n\n' + location.href.split('#')[0], K.name + ' 주중 미션');
    });
  }

  /* 퀴즈 */
  var qz = $('#quiz');
  if (qz && K.quiz) {
    var score = 0, answered = 0;
    K.quiz.forEach(function (q, qi) {
      var d = document.createElement('div'); d.className = 'q';
      d.innerHTML = '<p class="qn">Q' + (qi + 1) + '. ' + q.q + '</p><div class="opts"></div><p class="fb"></p>';
      q.o.forEach(function (o, oi) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'opt'; b.innerHTML = o;
        b.addEventListener('click', function () {
          if (d.classList.contains('done')) return;
          d.classList.add('done'); answered++;
          var ok = oi === q.a; if (ok) score++;
          b.classList.add(ok ? 'right' : 'wrong'); d.querySelectorAll('.opt')[q.a].classList.add('right');
          d.querySelector('.fb').textContent = (ok ? '딩동댕! ' : '아쉬워요! ') + (q.e || '');
          if (answered === K.quiz.length) { var r = $('#qresult'); r.innerHTML = '<b>' + score + ' / ' + K.quiz.length + '</b> ' + (score === K.quiz.length ? '만점! 말씀 박사님이에요!' : score >= K.quiz.length - 1 ? '아주 잘했어요!' : '다시 한 번 도전해 볼까요?'); r.classList.add('on'); if (score === K.quiz.length) confetti(); }
        });
        d.querySelector('.opts').appendChild(b);
      });
      qz.appendChild(d);
    });
    var qs = $('#qsend'); if (qs) qs.addEventListener('click', function () { send('[' + K.name + '] ' + nameOf() + '의 말씀 퀴즈 결과: ' + score + ' / ' + K.quiz.length + (answered < K.quiz.length ? ' (아직 푸는 중)' : '') + '\n\n' + location.href.split('#')[0], K.name + ' 퀴즈'); });
    var qr = $('#qreset'); if (qr) qr.addEventListener('click', function () { location.hash = 'quiz'; location.reload(); });
  }
  function confetti() {
    var c = ['#E5484D', '#F5C542', '#3FB950', '#3E7CC9', '#8E63C9'];
    for (var i = 0; i < 60; i++) { var s = document.createElement('i'); s.className = 'cf'; s.style.left = Math.random() * 100 + 'vw'; s.style.background = c[i % c.length]; s.style.animationDelay = Math.random() * .6 + 's'; document.body.appendChild(s); setTimeout(function (el) { el.remove(); }.bind(null, s), 2600); }
  }

  /* 워크북 인쇄 · 소리로 듣기 · 공유 */
  var pb = $('#wprint'); if (pb) pb.addEventListener('click', function () { window.print(); });
  var sb = $('#speak'); if (sb) sb.addEventListener('click', function () {
    if (!('speechSynthesis' in window)) { toast('이 기기에서는 소리 듣기를 지원하지 않아요.'); return; }
    if (speechSynthesis.speaking) { speechSynthesis.cancel(); sb.textContent = '🔊 이야기 듣기'; return; }
    var t = ($('#story') || {}).innerText || ''; var u = new SpeechSynthesisUtterance(t); u.lang = 'ko-KR'; u.rate = .9; u.onend = function () { sb.textContent = '🔊 이야기 듣기'; };
    speechSynthesis.speak(u); sb.textContent = '⏹ 멈추기';
  });
  var fs = $('#fsend'); if (fs) fs.addEventListener('click', function () { send('키움스쿨에서 이번 주 말씀을 함께 배워요!\n' + K.name + ' · ' + (K.title || '') + '\n' + location.href.split('#')[0], '키움스쿨'); });
  var ws = $('#wsend'); if (ws) ws.addEventListener('click', function () {
    var ans = Array.prototype.map.call(document.querySelectorAll('.wb textarea, .wb input[type=text]'), function (el) { return el.value.trim(); }).filter(Boolean);
    send('[' + K.name + '] ' + nameOf() + '의 워크북\n' + (ans.length ? ans.map(function (a, i) { return (i + 1) + '. ' + a; }).join('\n') : '(작성한 내용이 없어요)'), K.name + ' 워크북');
  });
})();
