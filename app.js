(function () {
  'use strict';

  var CAU_HINH = window.CAU_HINH || {};
  var API = CAU_HINH.API_URL || '';
  var TEN_TRANG = CAU_HINH.TEN_TRANG || 'Góc Học Tập';
  var KHOA_PHIEN = 'hoctap_phien';
  var TAT_CA = 'Tất cả';

  var app = document.getElementById('app');
  var cho = document.getElementById('cho');

  // phien: {token,id,ten,lop} · nha: dữ liệu trang chủ · de: đề đang làm · kq: kết quả vừa nộp
  var st = { phien: null, nha: null, tab: 'choi', cheDoVao: 'vao', de: null, viTri: 0, traLoi: {}, batDau: 0, dongHo: null, kq: null };

  document.title = TEN_TRANG;

  /* ---------- Tiện ích ---------- */

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function gio(giay) {
    var p = Math.floor(giay / 60), s = giay % 60;
    return p + ':' + (s < 10 ? '0' : '') + s;
  }

  function docPhien() {
    try {
      return JSON.parse(localStorage.getItem(KHOA_PHIEN)) || null;
    } catch (e) {
      return null;
    }
  }

  function luuPhien(p) {
    st.phien = p;
    try {
      if (p) localStorage.setItem(KHOA_PHIEN, JSON.stringify(p));
      else localStorage.removeItem(KHOA_PHIEN);
    } catch (e) { /* trình duyệt chặn lưu trữ: vẫn dùng được trong lần mở này */ }
  }

  async function goi(hanhDong, duLieu) {
    var body = Object.assign({ action: hanhDong, token: st.phien && st.phien.token }, duLieu || {});
    cho.hidden = false;
    var j;
    try {
      // text/plain để trình duyệt không gửi yêu cầu kiểm tra trước (Apps Script không trả lời loại đó)
      var r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) });
      j = await r.json();
    } catch (e) {
      throw new Error('Không kết nối được máy chủ. Em kiểm tra mạng rồi thử lại nhé.');
    } finally {
      cho.hidden = true;
    }
    if (!j.ok) {
      if (j.code === 'DANG_NHAP') dangXuat();
      throw new Error(j.error || 'Có lỗi xảy ra');
    }
    return j.data;
  }

  function baoLoi(e) {
    alert(e.message);
  }

  function dungDongHo() {
    clearInterval(st.dongHo);
    st.dongHo = null;
  }

  /* ---------- Đăng nhập / tạo tài khoản ---------- */

  function veDangNhap(loi) {
    var dk = st.cheDoVao === 'dk';
    app.innerHTML =
      '<div class="the the-hep">' +
      '<h1 class="giua">🎓 ' + esc(TEN_TRANG) + '</h1>' +
      '<div class="tabs">' +
      '<button type="button" data-act="cheDoVao" data-v="vao" class="' + (dk ? '' : 'chon') + '">Đăng nhập</button>' +
      '<button type="button" data-act="cheDoVao" data-v="dk" class="' + (dk ? 'chon' : '') + '">Tạo tài khoản</button>' +
      '</div>' +
      '<form id="fVao">' +
      '<label for="iId">ID</label><input id="iId" name="id" autocomplete="username" autocapitalize="none" maxlength="20" required>' +
      '<label for="iMk">Mật khẩu</label><input id="iMk" name="matKhau" type="password" autocomplete="' + (dk ? 'new-password' : 'current-password') + '" maxlength="50" required>' +
      (dk
        ? '<label for="iTen">Họ tên</label><input id="iTen" name="ten" maxlength="30" required>' +
          '<label for="iLop">Lớp</label><input id="iLop" name="lop" maxlength="15">' +
          '<p class="mo" style="margin-top:10px">ID gồm chữ không dấu, số hoặc gạch dưới. Đừng dùng mật khẩu em đang dùng ở nơi khác.</p>'
        : '') +
      '<p class="loi">' + esc(loi || '') + '</p>' +
      '<button class="nut rong">' + (dk ? 'Tạo tài khoản' : 'Đăng nhập') + '</button>' +
      '</form>' +
      (dk ? '' : '<p class="mo giua" style="margin:14px 0 0">Quên mật khẩu? Em nhờ thầy cô đặt lại nhé.</p>') +
      '</div>';
  }

  async function guiDangNhap(form) {
    var f = new FormData(form);
    var dl = { id: f.get('id'), matKhau: f.get('matKhau'), ten: f.get('ten'), lop: f.get('lop') };
    try {
      luuPhien(await goi(st.cheDoVao === 'dk' ? 'dangKy' : 'dangNhap', dl));
      st.tab = 'choi';
      await taiTrangChu();
    } catch (e) {
      if (!st.phien) {
        veDangNhap(e.message);
        document.getElementById('iId').value = dl.id;
        if (dl.ten && document.getElementById('iTen')) {
          document.getElementById('iTen').value = dl.ten;
          document.getElementById('iLop').value = dl.lop || '';
        }
      } else {
        baoLoi(e);
      }
    }
  }

  function dangXuat() {
    dungDongHo();
    luuPhien(null);
    st.cheDoVao = 'vao';
    st.nha = null;
    st.de = null;
    veDangNhap();
  }

  /* ---------- Trang chủ ---------- */

  async function taiTrangChu() {
    st.nha = await goi('trangChu');
    st.de = null;
    st.kq = null;
    veTrangChu();
  }

  function luaChonChuDe() {
    var o = st.nha.chuDe.map(function (c) {
      return '<option value="' + esc(c.ten) + '">' + esc(c.ten) + '</option>';
    });
    if (st.nha.chuDe.length > 1) o.push('<option value="' + TAT_CA + '">' + TAT_CA + ' (trộn các chủ đề)</option>');
    return o.join('');
  }

  function veTrangChu() {
    var n = st.nha;
    var choNhan = n.thachDau.filter(function (t) { return t.vaiTro === 'nhan' && !t.xong; }).length;
    var than = st.tab === 'choi' ? veTabChoi() : st.tab === 'dau' ? veTabThachDau() : veTabXepHang();
    app.innerHTML =
      '<div class="dau"><h1>👋 Chào ' + esc(n.toi.ten) + '</h1>' +
      '<button class="nut phu nho" data-act="dangXuat">Đăng xuất</button></div>' +
      '<div class="tabs">' +
      nutTab('choi', '📚 Tự chơi') +
      nutTab('dau', '⚔️ Thách đấu' + (choNhan ? ' <span class="cham">' + choNhan + '</span>' : '')) +
      nutTab('hang', '🏆 Xếp hạng') +
      '</div>' + than;
  }

  function nutTab(ma, nhan) {
    return '<button data-act="tab" data-v="' + ma + '" class="' + (st.tab === ma ? 'chon' : '') + '">' + nhan + '</button>';
  }

  function veTabChoi() {
    var n = st.nha;
    if (!n.chuDe.length) return '<div class="the"><p>Chưa có câu hỏi nào. Em chờ thầy cô thêm bài nhé.</p></div>';
    var the = n.chuDe.map(function (c) {
      return '<button class="chu-de" data-act="choi" data-v="' + esc(c.ten) + '"><b>' + esc(c.ten) + '</b>' +
        '<span class="mo">' + c.soCau + ' câu hỏi</span></button>';
    });
    if (n.chuDe.length > 1) {
      the.push('<button class="chu-de" data-act="choi" data-v="' + TAT_CA + '"><b>🎲 ' + TAT_CA + '</b><span class="mo">Trộn các chủ đề</span></button>');
    }
    return '<div class="the"><h2>Chọn chủ đề để luyện tập</h2>' +
      '<p class="mo">Mỗi lượt tối đa ' + n.soCauMoiLuot + ' câu, chọn ngẫu nhiên. Làm càng nhanh càng tốt!</p>' +
      '<div class="luoi">' + the.join('') + '</div></div>';
  }

  function veTabThachDau() {
    var n = st.nha;
    var html = '<div class="the"><h2>Thách đấu một bạn</h2>';
    if (!n.nguoiChoi.length) {
      html += '<p class="mo">Chưa có bạn nào khác tạo tài khoản. Em rủ các bạn vào chơi nhé!</p>';
    } else if (!n.chuDe.length) {
      html += '<p class="mo">Chưa có câu hỏi nào.</p>';
    } else {
      html += '<p class="mo">Em làm bài trước, sau đó bạn kia làm đúng bộ câu hỏi đó. Ai nhiều điểm hơn thì thắng, bằng điểm thì ai nhanh hơn thắng.</p>' +
        '<form id="fThach">' +
        '<label for="sBan">Chọn bạn</label><select id="sBan" name="doiThu">' +
        n.nguoiChoi.map(function (p) {
          return '<option value="' + esc(p.id) + '">' + esc(p.ten) + (p.lop ? ' – ' + esc(p.lop) : '') + ' (' + esc(p.id) + ')</option>';
        }).join('') + '</select>' +
        '<label for="sCd">Chủ đề</label><select id="sCd" name="chuDe">' + luaChonChuDe() + '</select>' +
        '<p></p><button class="nut rong">⚔️ Thách đấu!</button></form>';
    }
    html += '</div>';

    var moi = n.thachDau.filter(function (t) { return t.vaiTro === 'nhan' && !t.xong; });
    if (moi.length) {
      html += '<div class="the"><h2>Lời thách đấu gửi đến em</h2>' + moi.map(function (t) {
        return '<div class="hang"><div class="than"><b>' + esc(t.doiThu) + '</b> thách em · ' + esc(t.chuDe) +
          '<div class="mo">Cần vượt: ' + t.diemDoiThu + '/' + t.tongCau + ' điểm trong ' + gio(t.giayDoiThu) + '</div></div>' +
          '<button class="nut nho" data-act="nhan" data-v="' + esc(t.ma) + '">Nhận lời</button></div>';
      }).join('') + '</div>';
    }

    var khac = n.thachDau.filter(function (t) { return t.xong || t.vaiTro === 'thach'; });
    if (khac.length) {
      var chu = { thang: 'Thắng', thua: 'Thua', hoa: 'Hoà' };
      html += '<div class="the"><h2>Các trận của em</h2>' + khac.map(function (t) {
        var phai = t.xong
          ? '<span class="nhan ' + t.ketQua + '">' + chu[t.ketQua] + '</span>'
          : '<span class="nhan cho">Chờ bạn chơi</span>';
        var diem = 'Em: ' + t.diemToi + '/' + t.tongCau + ' (' + gio(t.giayToi) + ')' +
          (t.xong ? ' · Bạn: ' + t.diemDoiThu + '/' + t.tongCau + ' (' + gio(t.giayDoiThu) + ')' : '');
        return '<div class="hang"><div class="than"><b>' + esc(t.doiThu) + '</b> · ' + esc(t.chuDe) +
          '<div class="mo">' + diem + '</div></div>' + phai + '</div>';
      }).join('') + '</div>';
    }
    return html;
  }

  function veTabXepHang() {
    var n = st.nha;
    if (!n.xepHang.length) return '<div class="the"><p>Chưa ai chơi cả. Em hãy là người đầu tiên!</p></div>';
    var huy = ['🥇', '🥈', '🥉'];
    return '<div class="the"><h2>Bảng xếp hạng</h2>' +
      '<p class="mo">Điểm = tổng điểm cao nhất của em ở từng chủ đề. Bằng điểm thì ai thắng thách đấu nhiều hơn đứng trên.</p>' +
      n.xepHang.map(function (r, i) {
        return '<div class="hang' + (r.id === n.toi.id ? ' toi' : '') + '"><div class="thu">' + (huy[i] || i + 1) + '</div>' +
          '<div class="than"><b>' + esc(r.ten) + '</b>' + (r.lop ? ' <span class="mo">' + esc(r.lop) + '</span>' : '') +
          '<div class="mo">' + r.luot + ' lượt chơi · thắng ' + r.thang + ' trận</div></div>' +
          '<div class="so">' + r.diem + ' điểm</div></div>';
      }).join('') + '</div>';
  }

  /* ---------- Làm bài ---------- */

  function moDe(de) {
    st.de = de;
    st.viTri = 0;
    st.traLoi = {};
    st.kq = null;
    st.batDau = Date.now();
    dungDongHo();
    st.dongHo = setInterval(function () {
      var el = document.getElementById('dongHo');
      if (el) el.textContent = gio(Math.round((Date.now() - st.batDau) / 1000));
    }, 1000);
    veBaiLam();
  }

  function veBaiLam() {
    var de = st.de, c = de.cau[st.viTri], chon = st.traLoi[c.ma];
    var cuoi = st.viTri === de.cau.length - 1;
    app.innerHTML =
      '<div class="dau"><div><b>' + esc(de.chuDe) + '</b>' + (de.cheDo === 'tu' ? '' : ' · ⚔️ Thách đấu') +
      '<div class="mo">Câu ' + (st.viTri + 1) + '/' + de.cau.length + ' · ⏱ <span id="dongHo">' +
      gio(Math.round((Date.now() - st.batDau) / 1000)) + '</span></div></div>' +
      '<button class="nut phu nho" data-act="thoat">Thoát</button></div>' +
      '<div class="tien-do"><i style="width:' + Math.round((st.viTri + 1) / de.cau.length * 100) + '%"></i></div>' +
      '<div class="the"><div class="cau-hoi">' + esc(c.cauHoi) + '</div>' +
      Object.keys(c.luaChon).map(function (k) {
        return '<button class="lua' + (chon === k ? ' chon' : '') + '" data-act="chon" data-v="' + k + '"><b>' + k + '.</b>' +
          '<span>' + esc(c.luaChon[k]) + '</span></button>';
      }).join('') +
      '<div class="chan">' +
      '<button class="nut phu" data-act="lui"' + (st.viTri ? '' : ' disabled') + '>← Câu trước</button>' +
      (cuoi ? '<button class="nut" data-act="nop">Nộp bài ✓</button>' : '<button class="nut" data-act="toi">Câu tiếp →</button>') +
      '</div></div>';
  }

  async function nopBai() {
    var de = st.de;
    var thieu = de.cau.filter(function (c) { return !st.traLoi[c.ma]; }).length;
    if (thieu && !confirm('Em còn ' + thieu + ' câu chưa trả lời. Vẫn nộp bài chứ?')) return;
    try {
      st.kq = await goi('nopBai', { ve: de.ve, traLoi: st.traLoi });
      dungDongHo();
      veKetQua();
    } catch (e) {
      baoLoi(e);
    }
  }

  function veKetQua() {
    var kq = st.kq, de = st.de;
    var theoMa = {};
    de.cau.forEach(function (c) { theoMa[c.ma] = c; });

    var loiNhan = '';
    if (kq.cheDo === 't1') {
      loiNhan = '<p>Đã gửi lời thách đấu! Khi bạn chơi xong, kết quả sẽ hiện ở mục Thách đấu.</p>';
    } else if (kq.thachDau) {
      var t = kq.thachDau;
      var chu = { thang: '🎉 Em thắng rồi!', thua: 'Lần này bạn thắng. Cố lên nhé!', hoa: 'Hai bạn hoà nhau!' };
      loiNhan = '<p><b>' + chu[t.ketQua] + '</b><br><span class="mo">Bạn: ' + t.diemDoiThu + '/' + kq.tong + ' điểm trong ' + gio(t.giayDoiThu) + '</span></p>';
    } else if (kq.diem === kq.tong) {
      loiNhan = '<p><b>🌟 Tuyệt vời, đúng hết!</b></p>';
    }

    var xemLai = kq.chiTiet.map(function (d, i) {
      var c = theoMa[d.ma];
      if (!c) return '';
      var cuaEm = d.chon && c.luaChon[d.chon] ? d.chon + '. ' + c.luaChon[d.chon] : 'chưa trả lời';
      return '<div class="xem-lai"><b>Câu ' + (i + 1) + '.</b> ' + esc(c.cauHoi) +
        '<div class="' + (d.dung ? 'dung' : 'sai') + '">' + (d.dung ? '✓' : '✗') + ' Em chọn: ' + esc(cuaEm) + '</div>' +
        (!d.dung && d.dapAn ? '<div>Đáp án đúng: ' + esc(d.dapAn + '. ' + (c.luaChon[d.dapAn] || '')) + '</div>' : '') +
        (d.giaiThich ? '<div class="mo">💡 ' + esc(d.giaiThich) + '</div>' : '') + '</div>';
    }).join('');

    app.innerHTML =
      '<div class="the giua"><p class="mo">' + esc(de.chuDe) + '</p>' +
      '<div class="diem-to">' + kq.diem + '/' + kq.tong + '</div>' +
      '<p class="mo">Thời gian: ' + gio(kq.giay) + '</p>' + loiNhan +
      '<div class="chan">' +
      '<button class="nut phu" data-act="veNha">Về trang chủ</button>' +
      (kq.cheDo === 'tu' ? '<button class="nut" data-act="choi" data-v="' + esc(de.chuDe) + '">Chơi lượt nữa</button>' : '') +
      '</div></div>' +
      '<div class="the"><h2>Xem lại bài làm</h2>' +
      (kq.cheDo === 't1' ? '<p class="mo">Đáp án đúng sẽ được giữ kín cho đến khi bạn kia chơi xong.</p>' : '') +
      xemLai + '</div>';
    window.scrollTo(0, 0);
  }

  /* ---------- Xử lý bấm nút ---------- */

  var HANH_DONG = {
    cheDoVao: function (el) {
      st.cheDoVao = el.dataset.v;
      veDangNhap();
    },
    dangXuat: dangXuat,
    tab: function (el) {
      st.tab = el.dataset.v;
      veTrangChu();
    },
    choi: function (el) {
      goi('batDau', { chuDe: el.dataset.v }).then(moDe, baoLoi);
    },
    nhan: function (el) {
      goi('nhanThachDau', { ma: el.dataset.v }).then(moDe, baoLoi);
    },
    chon: function (el) {
      st.traLoi[st.de.cau[st.viTri].ma] = el.dataset.v;
      veBaiLam();
    },
    lui: function () {
      if (st.viTri > 0) st.viTri--;
      veBaiLam();
    },
    toi: function () {
      if (st.viTri < st.de.cau.length - 1) st.viTri++;
      veBaiLam();
    },
    nop: nopBai,
    thoat: function () {
      var nhac = st.de.cheDo === 'tu' ? 'Thoát thì lượt này không được tính điểm. Em chắc chứ?'
        : st.de.cheDo === 't1' ? 'Thoát thì lời thách đấu sẽ không được gửi. Em chắc chứ?'
        : 'Đồng hồ trận đấu vẫn chạy khi em thoát. Em chắc chứ?';
      if (!confirm(nhac)) return;
      dungDongHo();
      taiTrangChu().catch(baoLoi);
    },
    veNha: function () {
      taiTrangChu().catch(baoLoi);
    }
  };

  app.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (el && !el.disabled && HANH_DONG[el.dataset.act]) HANH_DONG[el.dataset.act](el);
  });

  app.addEventListener('submit', function (e) {
    e.preventDefault();
    // getAttribute vì form có ô name="id" che mất thuộc tính form.id
    var ma = e.target.getAttribute('id');
    if (ma === 'fVao') {
      guiDangNhap(e.target);
    } else if (ma === 'fThach') {
      var f = new FormData(e.target);
      goi('thachDau', { doiThu: f.get('doiThu'), chuDe: f.get('chuDe') }).then(moDe, baoLoi);
    }
  });

  /* ---------- Khởi động ---------- */

  if (!API) {
    app.innerHTML = '<div class="the the-hep"><h1>🎓 ' + esc(TEN_TRANG) + '</h1>' +
      '<p>Trang chưa được nối với Google Sheets.</p>' +
      '<p class="mo">Thầy cô mở file <b>config.js</b> và dán đường link Apps Script vào <b>API_URL</b> (xem file HUONG-DAN.md).</p></div>';
  } else {
    st.phien = docPhien();
    if (st.phien) {
      taiTrangChu().catch(function (e) {
        if (st.phien) {
          app.innerHTML = '<div class="the the-hep"><p>' + esc(e.message) + '</p>' +
            '<button class="nut rong" data-act="veNha">Thử lại</button></div>';
        }
      });
    } else {
      veDangNhap();
    }
  }
})();
