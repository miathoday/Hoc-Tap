// Các trò chơi luyện tập. Muốn đổi nội dung thì sửa danh sách DS bên dưới.
// Trò chơi báo đúng/sai ngay nên đáp án nằm trong file này (khác với phần "Luyện tập", đáp án nằm trong Google Sheets).
(function () {
  'use strict';

  var DS = [
    { id: 'pic', pic: '🐬', name: 'Picture Pop', en: 'Look and choose the word', vi: 'Nhìn hình, chọn từ đúng', items: [
      ['🐬', 'dolphin', ['shark', 'whale', 'penguin']], ['🏓', 'table tennis', ['badminton', 'basketball', 'volleyball']],
      ['🥪', 'sandwich', ['noodles', 'pizza', 'dumplings']], ['🏙️', 'city', ['village', 'town', 'island']],
      ['🌾', 'countryside', ['city', 'seaside', 'mountains']], ['⛰️', 'mountains', ['countryside', 'island', 'seaside']],
      ['🏸', 'badminton', ['table tennis', 'tennis', 'chess']], ['🍜', 'noodles', ['sandwich', 'fried rice', 'spring rolls']],
      ['🐼', 'panda', ['koala', 'monkey', 'parrot']], ['🦜', 'parrot', ['dolphin', 'panda', 'rabbit']],
      ['🎨', 'Art', ['Music', 'Science', 'Maths']], ['🔬', 'Science', ['Art', 'English', 'History']],
      ['🏝️', 'island', ['city', 'mountains', 'village']], ['🥟', 'dumplings', ['noodles', 'sandwich', 'pizza']]] },
    { id: 'stress', pic: '👏', name: 'Stress Clap', en: 'Tap the STRONG part of the word', vi: 'Chạm vào âm tiết được nhấn mạnh', items: [
      [['dol', 'phin'], 0], [['ten', 'nis'], 0], [['sand', 'wich'], 0], [['fa', 'vour', 'ite'], 0], [['coun', 'try', 'side'], 0],
      [['bad', 'min', 'ton'], 0], [['a', 'bout'], 1], [['be', 'cause'], 1], [['your', 'self'], 1], [['ba', 'na', 'na'], 1],
      [['gi', 'raffe'], 1], [['com', 'pu', 'ter'], 1]] },
    { id: 'build', pic: '🧱', name: 'Sentence Builder', en: 'Tap the words in the right order', vi: 'Chạm các từ theo đúng thứ tự', items: [
      'Can you tell me about yourself ?', 'I live in a small village in the countryside .',
      'My favourite subject is Art because it is fun .', 'What is your best friend\'s favourite sport ?',
      'She lives in the city with her grandparents .', 'I like dolphins because they are clever and friendly .',
      'His favourite food is noodles , but he likes pizza too .', 'Where does your cousin live ?'] },
    { id: 'fix', pic: '🔍', name: 'Mistake Detective', en: 'Tap the wrong word', vi: 'Tìm và chạm vào từ sai', items: [
      ['I live in a countryside .', 3, 'the', 'We say "in the countryside".'],
      ['He favourite colour is pink .', 0, 'His', 'Use "His" before a noun.'],
      ['She live in a big city .', 1, 'lives', 'She / He + verb-s.'],
      ['My favourite food are noodles .', 3, 'is', '"My favourite food" is one thing, so use "is".'],
      ['I\'m on Class 5A .', 1, 'in', 'We say "in Class 5A".'],
      ['Can you tell me about you ?', 5, 'yourself', '"Tell me about yourself."'],
      ['I like pandas because it are cute .', 4, 'they', '"Pandas" is plural, so use "they".'],
      ['What are your favourite animal ?', 1, 'is', 'One animal: "What is (What\'s)...?"'],
      ['Her brother favourite sport is badminton .', 1, 'brother\'s', 'Add \'s: "her brother\'s favourite sport".'],
      ['Where do he live ?', 1, 'does', 'He / She: "Where does...?"']] },
    { id: 'read', pic: '📖', name: 'Story Detective', en: 'Read about Ben and answer', vi: 'Đọc về Ben và trả lời câu hỏi',
      story: 'Hi! My name\'s Ben. I\'m ten years old and I\'m in Class 5B. I live in a small village in the countryside with my parents and my little sister. My favourite animal is the dolphin because it is clever and friendly. I love noodles, but my sister\'s favourite food is pizza. At school, my favourite subject is Art. After school, I play table tennis with my best friend, Nam. He lives in the town near my village.',
      items: [
        ['Where does Ben live?', 'In a village in the countryside', ['In a big city', 'In a town', 'On an island']],
        ['Why does Ben like dolphins?', 'Because they are clever and friendly', ['Because they are big', 'Because they live in the sea', 'Because his sister likes them']],
        ['Whose favourite food is pizza?', 'His sister\'s', ['Ben\'s', 'Nam\'s', 'His mother\'s']],
        ['Ben and Nam live in the same village.', 'False', ['True', 'We don\'t know']],
        ['How many people are there in Ben\'s family?', 'Four', ['Three', 'Five', 'Two']],
        ['What does Ben do after school?', 'He plays table tennis', ['He draws pictures', 'He eats noodles', 'He plays badminton']]] },
    { id: 'speak', pic: '🎤', name: 'Talk Show', en: 'Answer for 30 seconds. Add "because"!', vi: 'Nói 30 giây, nhớ thêm lý do với "because"', items: [
      ['Can you tell me about yourself?', 'My name\'s ... I\'m ... years old. I\'m in Class ... I live in ...'],
      ['Where do you live? What is it like?', 'I live in ... It\'s a (big / small / quiet / busy) ... I like it because ...'],
      ['What\'s your favourite animal? Why?', 'My favourite animal is the ... because it is (clever / cute / friendly / strong).'],
      ['What\'s your favourite food? Who cooks it?', 'My favourite food is ... because it is (delicious / healthy / sweet). My ... cooks it.'],
      ['What\'s your favourite sport? Who do you play with?', 'My favourite sport is ... I play it with ... because it is (fun / exciting).'],
      ['What\'s your favourite subject? Why?', 'My favourite subject is ... because it is (interesting / easy / fun).'],
      ['Tell me about your best friend.', 'My best friend is ... He / She is in Class ... He / She lives in ... His / Her favourite ... is ...'],
      ['City or countryside: which do you like more? Why?', 'I like the ... more because it is (quiet / busy / clean) and there are ...']] }
  ];

  var SO_CAU = 8;

  function tron(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function doc(t) {
    try {
      var u = new SpeechSynthesisUtterance(t);
      u.lang = 'en-GB';
      u.rate = 0.85;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch (e) { /* máy không hỗ trợ đọc: bỏ qua */ }
  }

  function sao(diem, tong) {
    var r = tong ? diem / tong : 0;
    return r >= 0.9 ? 3 : r >= 0.7 ? 2 : r >= 0.4 ? 1 : 0;
  }

  var dongHo = null;

  function dung() {
    clearInterval(dongHo);
    dongHo = null;
    try {
      speechSynthesis.cancel();
    } catch (e) { /* bỏ qua */ }
  }

  // tot: { tênGame: {diem, tong} } là thành tích tốt nhất của học sinh
  function veO(tot) {
    return '<div class="tc"><div class="tc-luoi">' + DS.map(function (g, i) {
      var b = tot && tot[g.name], s = b ? sao(b.diem, b.tong) : 0;
      return '<button class="tc-o tc-o' + i + '" data-act="game" data-v="' + i + '">' +
        '<span class="tc-hinh">' + g.pic + '</span><b>' + g.name + '</b><small>' + g.en + '</small><small>' + g.vi + '</small>' +
        '<span class="tc-tot">' + (b ? ('⭐'.repeat(s) || '💪') + ' ' + b.diem + '/' + b.tong : 'Play!') + '</span></button>';
    }).join('') + '</div></div>';
  }

  // cb.xong(tênGame, điểm, tổng, giây) gọi khi chơi hết một lượt; cb.thoat() khi bấm quay về
  function choi(viTri, P, cb) {
    var G = DS[viTri], items, idx, diem, batDau;
    P.className = 'tc tc-san';

    function q(s) { return P.querySelector(s); }
    function them(h) { P.insertAdjacentHTML('beforeend', h); }

    function moLuot() {
      items = tron(G.items);
      if (G.id !== 'read') items = items.slice(0, SO_CAU);
      idx = 0;
      diem = 0;
      batDau = Date.now();
      hien();
    }

    function dau() {
      return '<div class="tc-hang"><button class="tc-nut tc-vien" data-tc="ve">← Games</button><h2>' + G.pic + ' ' + G.name + '</h2>' +
        '<b>' + Math.min(idx + 1, items.length) + ' / ' + items.length + '</b></div>' +
        '<div class="tc-thanh"><i style="width:' + (idx / items.length * 100) + '%"></i></div>' +
        '<p><b>' + G.en + '</b> <span class="tc-vi">' + G.vi + '</span></p>';
    }

    function tiep(ok, loi) {
      if (ok) diem++;
      them('<div class="tc-fb tc-nay ' + (ok ? 'ok' : 'no') + '">' + (ok ? '✅ Great job! ' : '❌ Not yet. ') + esc(loi || '') + '</div>' +
        '<button class="tc-nut" data-tc="tiep">' + (idx + 1 < items.length ? 'Next →' : 'Finish 🏁') + '</button>');
      q('[data-tc=tiep]').focus();
    }

    function ketThuc() {
      dung();
      var s = sao(diem, items.length);
      P.innerHTML = '<div class="tc-to tc-nay">' + (s === 3 ? '🏆' : s ? '🎉' : '💪') + '</div>' +
        '<p class="tc-q">' + diem + ' / ' + items.length + ' correct</p><p class="tc-q">' + ('⭐'.repeat(s) || 'Try again for a star!') + '</p>' +
        '<div class="tc-hang"><button class="tc-nut tc-vien" data-tc="ve">← Games</button><button class="tc-nut tc-vang" data-tc="lai">Play again</button></div>';
      cb.xong(G.name, diem, items.length, Math.round((Date.now() - batDau) / 1000));
    }

    function khoaNut(lop, dungLa) {
      P.querySelectorAll(lop).forEach(function (x) {
        x.disabled = true;
        if (dungLa(x)) x.classList.add('ok');
      });
    }

    function hien() {
      dung();
      var it = items[idx];
      P.innerHTML = dau();

      if (G.id === 'pic' || G.id === 'read') {
        var ans = it[1], opts = tron([ans].concat(tron(it[2]).slice(0, 3)));
        if (G.id === 'pic') them('<div class="tc-to tc-nay">' + it[0] + '</div><p class="tc-q">What is it?</p>');
        else them('<div class="tc-truyen">' + esc(G.story) + '</div><p class="tc-q">' + esc(it[0]) + '</p>');
        them('<div class="tc-chon">' + opts.map(function (o) { return '<button class="tc-lc">' + esc(o) + '</button>'; }).join('') + '</div>');
        P.querySelectorAll('.tc-lc').forEach(function (b) {
          b.onclick = function () {
            var ok = b.textContent === ans;
            khoaNut('.tc-lc', function (x) { return x.textContent === ans; });
            if (!ok) b.classList.add('no');
            if (G.id === 'pic') doc(ans);
            tiep(ok, G.id === 'pic' ? 'It\'s "' + ans + '". Say it aloud!' : 'Answer: ' + ans);
          };
        });
      }

      if (G.id === 'stress') {
        var tu = it[0].join('');
        them('<p class="tc-q">Listen, clap, then tap.</p><div class="tc-hang tc-giua"><button class="tc-nut tc-vang" data-tc="nghe">🔊 Listen</button></div>' +
          '<div class="tc-the">' + it[0].map(function (s, i) { return '<button class="tc-chip tc-am" data-i="' + i + '">' + s + '</button>'; }).join('') + '</div>');
        q('[data-tc=nghe]').onclick = function () { doc(tu); };
        P.querySelectorAll('.tc-am').forEach(function (b) {
          b.onclick = function () {
            var ok = +b.dataset.i === it[1];
            khoaNut('.tc-am', function (x) { return +x.dataset.i === it[1]; });
            if (!ok) b.classList.add('no');
            doc(tu);
            tiep(ok, it[0].map(function (s, i) { return i === it[1] ? s.toUpperCase() : s; }).join('-'));
          };
        });
      }

      if (G.id === 'build') {
        var words = it.split(' '), daChon = [];
        var kho = tron(words.map(function (w, i) { return { w: w, i: i }; }));
        them('<div class="tc-khe"><div class="tc-the" data-tc="dong"></div></div><div class="tc-the" data-tc="kho"></div>' +
          '<div class="tc-hang" data-tc="nutXay"><button class="tc-nut tc-vien" data-tc="hoan">↩ Undo</button><button class="tc-nut" data-tc="kiem">Check ✓</button></div>');
        var veXay = function () {
          q('[data-tc=dong]').innerHTML = daChon.map(function (p) { return '<span class="tc-chip">' + esc(p.w) + '</span>'; }).join('');
          q('[data-tc=kho]').innerHTML = kho.filter(function (p) { return daChon.indexOf(p) < 0; })
            .map(function (p) { return '<button class="tc-chip" data-i="' + p.i + '">' + esc(p.w) + '</button>'; }).join('');
        };
        veXay();
        q('[data-tc=kho]').onclick = function (e) {
          var b = e.target.closest('.tc-chip');
          if (!b) return;
          daChon.push(kho.filter(function (p) { return p.i === +b.dataset.i; })[0]);
          veXay();
        };
        q('[data-tc=hoan]').onclick = function () {
          daChon.pop();
          veXay();
        };
        q('[data-tc=kiem]').onclick = function () {
          if (daChon.length < words.length) return;
          var ok = daChon.map(function (p) { return p.w; }).join(' ') === it;
          q('[data-tc=nutXay]').remove();
          q('[data-tc=kho]').onclick = null;
          var sach = it.replace(/ ([.,?])/g, '$1');
          doc(sach);
          tiep(ok, sach);
        };
      }

      if (G.id === 'fix') {
        them('<div class="tc-the">' + it[0].split(' ').map(function (w, i) {
          return '<button class="tc-chip tc-tu" data-i="' + i + '">' + esc(w) + '</button>';
        }).join('') + '</div>');
        P.querySelectorAll('.tc-tu').forEach(function (b) {
          b.onclick = function () {
            var ok = +b.dataset.i === it[1];
            P.querySelectorAll('.tc-tu').forEach(function (x) {
              x.disabled = true;
              if (+x.dataset.i === it[1]) {
                x.classList.add('ok');
                x.innerHTML = '<s>' + x.innerHTML + '</s> ' + esc(it[2]);
              }
            });
            if (!ok) b.classList.add('no');
            tiep(ok, it[3]);
          };
        });
      }

      if (G.id === 'speak') {
        var t = 30;
        them('<div class="tc-to tc-nay">🎤</div><p class="tc-q">' + esc(it[0]) + '</p>' +
          '<div class="tc-hang tc-giua"><button class="tc-nut tc-vang" data-tc="nghe">🔊 Listen</button><button class="tc-nut" data-tc="chay">▶ Start 30s</button><span class="tc-gio" data-tc="gio">0:30</span></div>' +
          '<div class="tc-khung">Help: ' + esc(it[1]) + '</div>' +
          '<div class="tc-tick"><b>Teacher ticks (giáo viên hoặc bạn cùng chơi chấm):</b>' +
          '<label><input type="checkbox"> Full sentences, 3 or more</label>' +
          '<label><input type="checkbox"> Correct grammar (is / lives / his / her / the)</label>' +
          '<label><input type="checkbox"> Gives a reason with "because"</label>' +
          '<label><input type="checkbox"> Clear word stress and loud voice</label></div>' +
          '<button class="tc-nut" data-tc="cham">Score it ✓</button>');
        q('[data-tc=nghe]').onclick = function () { doc(it[0]); };
        q('[data-tc=chay]').onclick = function () {
          clearInterval(dongHo);
          t = 30;
          dongHo = setInterval(function () {
            t--;
            var el = q('[data-tc=gio]');
            if (!el) return clearInterval(dongHo);
            el.textContent = t <= 0 ? 'Time!' : '0:' + (t < 10 ? '0' : '') + t;
            if (t <= 0) clearInterval(dongHo);
          }, 1000);
        };
        q('[data-tc=cham]').onclick = function () {
          clearInterval(dongHo);
          var n = P.querySelectorAll('.tc-tick input:checked').length;
          q('[data-tc=cham]').remove();
          tiep(n >= 3, n + ' / 4 ticks. ' + (n >= 3 ? '' : 'Try once more with the help frame.'));
        };
      }
    }

    P.onclick = function (e) {
      var el = e.target.closest('[data-tc]');
      if (!el) return;
      var v = el.dataset.tc;
      if (v === 've') {
        dung();
        cb.thoat();
      } else if (v === 'lai') {
        moLuot();
      } else if (v === 'tiep') {
        idx++;
        if (idx < items.length) hien();
        else ketThuc();
      }
    };

    moLuot();
  }

  window.TroChoi = { veO: veO, choi: choi, dung: dung };
})();
