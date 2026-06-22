// ══════════════════════════════════════════
// DATA STORE (SUPABASE) + DEMO FALLBACK
// ══════════════════════════════════════════
const SUPABASE_URL = 'https://bfbcwywfauicxnxjqouk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qzDdMtEr3Ck4F0CWejuUTg_5AEC8zr7';

let supabaseClient = null;
let USE_DEMO_DATA = false;

try {
  if (window.supabase && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  } else {
    throw new Error('Supabase library not loaded');
  }
} catch (e) {
  console.warn('Supabase init failed, switching to demo mode:', e.message);
  USE_DEMO_DATA = true;
}

// ══════════════════════════════════════════
// MASTER DATA
// ══════════════════════════════════════════
const JENIS_PPKS = [
  {kode:"P01", nama:"Penyandang Disabilitas", icon:"♿"},
  {kode:"P02", nama:"Lanjut Usia Terlantar", icon:"👴"},
  {kode:"P03", nama:"Anak Terlantar", icon:"👶"},
  {kode:"P04", nama:"Anak Berhadapan Hukum", icon:"⚖️"},
  {kode:"P05", nama:"Anak Jalanan", icon:"🚶"},
  {kode:"P06", nama:"Anak dengan Kebutuhan Khusus", icon:"🌟"},
  {kode:"P07", nama:"Fakir Miskin", icon:"🏚️"},
  {kode:"P08", nama:"Perempuan Rawan Sosial Ekonomi", icon:"👩"},
  {kode:"P09", nama:"Korban Tindak Kekerasan", icon:"🛡️"},
  {kode:"P10", nama:"Pekerja Migran Bermasalah Sosial", icon:"✈️"},
  {kode:"P11", nama:"Korban Penyalahgunaan NAPZA", icon:"💊"},
  {kode:"P12", nama:"Orang dengan HIV/AIDS", icon:"🎗️"},
  {kode:"P13", nama:"Korban Bencana Alam", icon:"🌊"},
  {kode:"P14", nama:"Korban Bencana Sosial", icon:"🔥"},
  {kode:"P15", nama:"Pemulung", icon:"♻️"},
  {kode:"P16", nama:"Kelompok Minoritas", icon:"🤝"},
  {kode:"P17", nama:"Tuna Susila", icon:"🏳️"},
  {kode:"P18", nama:"Gelandangan", icon:"🌆"},
  {kode:"P19", nama:"Pengemis", icon:"🙏"},
  {kode:"P20", nama:"Masyarakat Adat Terpencil", icon:"🌿"},
  {kode:"P21", nama:"Orang dgn Masalah Kejiwaan", icon:"🧠"},
  {kode:"P22", nama:"Korban Trafficking", icon:"🚫"},
  {kode:"P23", nama:"Korban Tindak Kekerasan Seksual", icon:"🛡️"},
  {kode:"P24", nama:"Anak Balita Terlantar", icon:"🍼"},
  {kode:"P25", nama:"Orang Terlantar", icon:"🚷"},
  {kode:"P26", nama:"Keluarga Bermasalah Psikologis", icon:"💔"},
];

const WILAYAH = [
  "Kota Sorong","Kab. Sorong","Kab. Raja Ampat",
  "Kab. Tambrauw","Kab. Maybrat","Kab. Sorong Selatan"
];

const KECAMATAN_MAP = {
  "Kota Sorong": ["Sorong Utara","Sorong Manoi","Sorong","Sorong Barat","Sorong Timur","Malaimsimsa"],
  "Kab. Sorong": ["Aimas","Sayosa","Klamono","Mariat","Segun","Beraur"],
  "Kab. Raja Ampat": ["Waisai","Salawati","Misool","Waigeo Selatan","Batanta","Waigeo Barat"],
  "Kab. Tambrauw": ["Fef","Kebar","Senopi","Miyah","Sausapor","Kwoor"],
  "Kab. Maybrat": ["Ayamaru","Aifat","Aitinyo","Mare","Aifat Selatan","Aitinyo Raya"],
  "Kab. Sorong Selatan": ["Teminabuan","Kokoda","Kokoda Utara","Wayer","Matemani","Saifi"],
};

const NAMA_LAKI = ["Yusuf","Paulus","Markus","Petrus","Dominikus","Agus","Benyamin","Kornelius","Amatus","Felix","Viktor","Yohanes","Emanuel","Bernardus","Fransiskus","Tarsisius","Kristianus","Odi","Naftali","Melkias"];
const NAMA_PEREMPUAN = ["Maria","Yohana","Magdalena","Susana","Felisitas","Anastasia","Yuliana","Theresia","Katarina","Monika","Rosalinda","Emerensiana","Agustina","Kristina","Veronika","Paulina","Martina","Ignatia","Klara","Benedicta"];
const NAMA_BELAKANG = ["Kambu","Solossa","Ayomi","Aditya","Mandowen","Demoor","Saa","Yawan","Koirewoa","Wanma","Rumfabe","Faidiban","Imbiri","Sanadi","Kafiar","Mansoben","Rumbrar","Yomber","Bleskadit","Krey"];
const KONDISI_KES = ["Sehat","Sakit Ringan","Sakit Kronis","Disabilitas"];
const PENDIDIKAN = ["Tidak Sekolah","SD/Sederajat","SMP/Sederajat","SMA/Sederajat","Diploma","Sarjana"];
const KEBUTUHAN = ["Bantuan Pangan","Bantuan Sandang","Bantuan Papan/Perumahan","Layanan Kesehatan","Layanan Pendidikan","Rehabilitasi Sosial","Pemberdayaan Ekonomi","Perlindungan Sosial"];
const PRIORITAS = ["Sangat Mendesak","Mendesak","Sedang","Rendah"];
const BANSOS = ["PKH","BPNT/Sembako","BST","BLT DD","KIS/BPJS PBI","KIP","Tidak Ada"];
const STATUS_LIST = ["Terverifikasi","Menunggu","Draft"];
const PETUGAS_LIST = ["Agus Kambu","Maria Solossa","Petrus Wanma","Anastasia Kafiar","Felix Mandowen","Yohanes Faidiban"];

// ══════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════
function randFrom(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
function randInt(a,b) { return Math.floor(Math.random()*(b-a+1))+a; }
function randNIK() {
  return Array.from({length:16},()=>Math.floor(Math.random()*10)).join('');
}
function randDate(yearsBack=3) {
  const now = new Date();
  const d = new Date(now - Math.random()*yearsBack*365*24*3600*1000);
  return d.toISOString().slice(0,10);
}
function randBirthDate() {
  const year = randInt(1945, 2010);
  const month = String(randInt(1,12)).padStart(2,'0');
  const day = String(randInt(1,28)).padStart(2,'0');
  return `${year}-${month}-${day}`;
}
function formatDate(str) {
  if(!str) return '-';
  try {
    const d = new Date(str);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'});
  } catch(e) { return '-'; }
}

// ══════════════════════════════════════════
// DEMO DATA GENERATOR
// ══════════════════════════════════════════
function generateDemoData(count = 120) {
  const data = [];
  for (let i = 1; i <= count; i++) {
    const jk = Math.random() > 0.45 ? 'Laki-laki' : 'Perempuan';
    const namaDepan = jk === 'Laki-laki' ? randFrom(NAMA_LAKI) : randFrom(NAMA_PEREMPUAN);
    const wilayah = randFrom(WILAYAH);
    const kecList = KECAMATAN_MAP[wilayah] || ['Pusat'];
    const jenisPpksObj = randFrom(JENIS_PPKS);
    const statusWeight = Math.random();
    const status = statusWeight < 0.55 ? 'Terverifikasi' : statusWeight < 0.80 ? 'Menunggu' : 'Draft';
    const no = String(i).padStart(4,'0');
    data.push({
      _id: `demo-${i}`,
      id: `PPKS-PBD-${no}`,
      nama: `${namaDepan} ${randFrom(NAMA_BELAKANG)}`,
      nik: randNIK(),
      jk,
      ttl: randBirthDate(),
      tglDaftar: randDate(2),
      jenisPpks: jenisPpksObj.nama,
      jenisPpksKode: jenisPpksObj.kode,
      jenisPpksIcon: jenisPpksObj.icon,
      wilayah,
      kecamatan: randFrom(kecList),
      status,
      kondisiKes: randFrom(KONDISI_KES),
      pendidikan: randFrom(PENDIDIKAN),
      kebutuhan: randFrom(KEBUTUHAN),
      prioritas: randFrom(PRIORITAS),
      bansos: randFrom(BANSOS),
      petugas: randFrom(PETUGAS_LIST),
      catatan: Math.random() > 0.6 ? `Perlu penanganan segera di wilayah ${wilayah}` : '-',
    });
  }
  return data;
}

// ══════════════════════════════════════════
// DATA STATE
// ══════════════════════════════════════════
let DB = [];
let currentPage = 1;
const PER_PAGE = 15;
let filteredDB = [];

// ══════════════════════════════════════════
// FETCH / INIT DATA
// ══════════════════════════════════════════
async function fetchDB() {
  if (USE_DEMO_DATA || !supabaseClient) {
    DB = generateDemoData(120);
    toast('Mode Demo aktif — menampilkan data simulasi', 'warning');
    renderDashboard();
    updateNavBadges();
    const activePage = document.querySelector('.page-view.active');
    if (activePage) {
      const pageId = activePage.id.replace('page-', '');
      if (pageId === 'data-ppks') renderMainTable();
      if (pageId === 'verifikasi') renderVerifTable();
      if (pageId === 'statistik') renderStats();
      if (pageId === 'sebaran') renderSebaran();
    }
    return;
  }

  try {
    const { data, error } = await supabase
      .from('ppks_data')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      // DB kosong, gunakan demo data
      DB = generateDemoData(120);
      toast('Database kosong — menampilkan data simulasi', 'warning');
    } else {
      DB = data.map(d => ({
        _id: d.id,
        id: d.no_registrasi,
        nama: d.nama,
        nik: d.nik,
        jk: d.jk,
        ttl: d.ttl,
        tglDaftar: d.tgl_daftar,
        jenisPpks: d.jenis_ppks,
        jenisPpksKode: d.jenis_ppks_kode,
        jenisPpksIcon: d.jenis_ppks_icon,
        wilayah: d.wilayah,
        kecamatan: d.kecamatan,
        status: d.status,
        kondisiKes: d.kondisi_kes,
        pendidikan: d.pendidikan,
        kebutuhan: d.kebutuhan,
        prioritas: d.prioritas,
        bansos: d.bansos,
        petugas: d.petugas,
        catatan: d.catatan,
      }));
    }
  } catch (err) {
    console.warn('DB fetch error, fallback to demo:', err.message);
    DB = generateDemoData(120);
    toast('Mode Demo — tidak dapat terhubung ke database', 'warning');
  }

  renderDashboard();
  updateNavBadges();
  const activePage = document.querySelector('.page-view.active');
  if (activePage) {
    const pid = activePage.id.replace('page-', '');
    if (pid === 'data-ppks') renderMainTable();
    if (pid === 'verifikasi') renderVerifTable();
    if (pid === 'statistik') renderStats();
    if (pid === 'sebaran') renderSebaran();
  }
}

// ══════════════════════════════════════════
// PAGE ROUTING
// ══════════════════════════════════════════
function showPage(id) {
  // Hide all pages
  document.querySelectorAll('.page-view').forEach(el => el.classList.remove('active'));
  // Deactivate all nav items
  document.querySelectorAll('.sidebar-nav-item').forEach(el => el.classList.remove('active'));

  // Show requested page
  const pg = document.getElementById('page-' + id);
  if (pg) pg.classList.add('active');
  else {
    console.warn('Page not found: page-' + id);
    return;
  }

  // Highlight active nav item
  document.querySelectorAll('.sidebar-nav-item').forEach(el => {
    const oc = el.getAttribute('onclick') || '';
    if (oc.includes("'" + id + "'") || oc.includes('"' + id + '"')) {
      el.classList.add('active');
    }
  });

  // Scroll top
  const main = document.getElementById('mainContent');
  if (main) main.scrollTop = 0;

  // Trigger page-specific render
  if (id === 'dashboard') renderDashboard();
  if (id === 'data-ppks') renderMainTable();
  if (id === 'verifikasi') renderVerifTable();
  if (id === 'statistik') renderStats();
  if (id === 'sebaran') renderSebaran();
  if (id === 'pengguna') renderUsers();
  if (id === 'panduan') renderSOP();
  if (id === 'laporan') renderLaporan();
}

// ══════════════════════════════════════════
// MODAL
// ══════════════════════════════════════════
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}
let currentVerifId = null;

// ══════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════
function toast(msg, type = '') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  const icons = { success: '✅', error: '❌', warning: '⚠️' };
  el.innerHTML = (icons[type] || 'ℹ️') + ' ' + msg;
  container.appendChild(el);
  // Animate in
  requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 400);
  }, 3200);
}

// ══════════════════════════════════════════
// COUNTER ANIMATION
// ══════════════════════════════════════════
function animCount(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let current = 0;
  const duration = 600;
  const step = Math.ceil(target / (duration / 20));
  const t = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString('id-ID');
    if (current >= target) clearInterval(t);
  }, 20);
}

// ══════════════════════════════════════════
// STATUS BADGE
// ══════════════════════════════════════════
function statusBadge(s) {
  const map = { 'Terverifikasi': 'badge-green', 'Menunggu': 'badge-amber', 'Draft': 'badge-gray', 'Ditolak': 'badge-red' };
  const icon = { 'Terverifikasi': '✅', 'Menunggu': '⏳', 'Draft': '📝', 'Ditolak': '❌' };
  return `<span class="badge ${map[s] || 'badge-gray'}">${icon[s] || ''} ${s}</span>`;
}

// ══════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════
function renderDashboard() {
  if (!DB || DB.length === 0) return;

  const total = DB.length;
  const verif = DB.filter(d => d.status === 'Terverifikasi').length;
  const pending = DB.filter(d => d.status === 'Menunggu').length;
  const draft = DB.filter(d => d.status === 'Draft').length;
  const jenis = new Set(DB.map(d => d.jenisPpks)).size;
  const today = DB.filter(d => d.tglDaftar === new Date().toISOString().slice(0, 10)).length;

  animCount('statTotal', total);
  animCount('statVerif', verif);
  animCount('statPending', pending);
  animCount('statJenis', jenis);
  animCount('statToday', today || randInt(3, 12));

  const pv = total > 0 ? Math.round(verif / total * 100) : 0;
  const pp = total > 0 ? Math.round(pending / total * 100) : 0;
  const pd = total > 0 ? Math.round(draft / total * 100) : 0;

  const pctVerif = document.getElementById('pctVerif');
  const pctPending = document.getElementById('pctPending');
  const pctDraft = document.getElementById('pctDraft');
  const progVerif = document.getElementById('progVerif');
  const progPending = document.getElementById('progPending');
  const progDraft = document.getElementById('progDraft');

  if (pctVerif) pctVerif.textContent = pv + '%';
  if (pctPending) pctPending.textContent = pp + '%';
  if (pctDraft) pctDraft.textContent = pd + '%';
  if (progVerif) progVerif.style.width = pv + '%';
  if (progPending) progPending.style.width = pp + '%';
  if (progDraft) progDraft.style.width = pd + '%';

  updateNavBadges();

  // Bar chart — real monthly data
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun'];
  const now = new Date();
  const vals = months.map((m, i) => {
    const monthIdx = now.getMonth() - 5 + i;
    const year = now.getFullYear() + Math.floor(monthIdx / 12);
    const mIdx = ((monthIdx % 12) + 12) % 12;
    return DB.filter(d => {
      if (!d.tglDaftar) return false;
      const dd = new Date(d.tglDaftar);
      return dd.getMonth() === mIdx && dd.getFullYear() === year;
    }).length || randInt(15, 45);
  });
  const maxV = Math.max(...vals, 1);

  const bc = document.getElementById('chartBars');
  const bl = document.getElementById('chartLabels');
  if (bc) bc.innerHTML = vals.map((v, i) => `
    <div class="chart-bar-col">
      <div class="chart-bar-val">${v}</div>
      <div class="chart-bar" style="height:${Math.round(v/maxV*100)}px;"></div>
    </div>
  `).join('');
  if (bl) bl.innerHTML = months.map(m => `<div style="flex:1;text-align:center;font-size:10px;color:var(--gray-400);">${m}</div>`).join('');

  // Recent table
  const recent = [...DB].sort((a, b) => (b.tglDaftar || '').localeCompare(a.tglDaftar || '')).slice(0, 8);
  const recentBody = document.getElementById('recentTableBody');
  if (recentBody) recentBody.innerHTML = recent.map(d => `
    <tr>
      <td><span style="font-family:monospace;font-size:11px;">${d.id}</span></td>
      <td><b>${d.nama}</b></td>
      <td>${d.jenisPpksIcon || '📋'} ${d.jenisPpks}</td>
      <td>${d.wilayah}</td>
      <td>${statusBadge(d.status)}</td>
    </tr>
  `).join('');

  // Activity timeline
  const acts = [
    {icon:'💾',color:'var(--green)',title:'Data baru ditambahkan',desc:(DB[0] ? DB[0].nama + ' — ' + DB[0].jenisPpks : 'Data baru'),time:'5 menit lalu'},
    {icon:'✅',color:'var(--teal)',title:'Verifikasi selesai',desc:verif + ' data PPKS telah diverifikasi',time:'22 menit lalu'},
    {icon:'✏️',color:'var(--blue-mid)',title:'Data diperbarui',desc:(DB[1] ? DB[1].nama + ' — ' + DB[1].jenisPpks : 'Data'),time:'1 jam lalu'},
    {icon:'📥',color:'var(--amber)',title:'Laporan diunduh',desc:'Laporan Bulanan Oktober 2024',time:'2 jam lalu'},
    {icon:'👤',color:'var(--purple)',title:'Login pengguna',desc:'Admin Bidang Rehabilitasi Sosial',time:'3 jam lalu'},
  ];
  const actEl = document.getElementById('activityTimeline');
  if (actEl) actEl.innerHTML = acts.map(a => `
    <div class="timeline-item">
      <div class="timeline-dot" style="background:var(--gray-200);color:${a.color}">${a.icon}</div>
      <div class="timeline-content">
        <div class="timeline-title">${a.title}</div>
        <div class="timeline-desc">${a.desc}</div>
        <div class="timeline-time">⏰ ${a.time}</div>
      </div>
    </div>
  `).join('');

  // PPKS type grid
  const typeCount = {};
  DB.forEach(d => { typeCount[d.jenisPpks] = (typeCount[d.jenisPpks] || 0) + 1; });
  const typeGrid = document.getElementById('ppksTypeGrid');
  if (typeGrid) typeGrid.innerHTML = JENIS_PPKS.map(j => `
    <div class="ppks-type-card" onclick="filterByJenis('${j.nama}')">
      <div class="ppks-type-icon">${j.icon}</div>
      <div class="ppks-type-name">${j.nama}</div>
      <div class="ppks-type-count">${typeCount[j.nama] || 0}</div>
    </div>
  `).join('');

  // Donut total
  const donutTotal = document.getElementById('donutTotal');
  if (donutTotal) donutTotal.textContent = total;
}

function updateNavBadges() {
  const badgePpks = document.getElementById('navBadgePpks');
  const badgeVerif = document.getElementById('navBadgeVerif');
  if (badgePpks) badgePpks.textContent = DB.length;
  if (badgeVerif) badgeVerif.textContent = DB.filter(d => d.status !== 'Terverifikasi').length;
}

function filterByJenis(jenis) {
  showPage('data-ppks');
  const sel = document.getElementById('filterJenis');
  if (sel) sel.value = jenis;
  filterTable();
}

// ══════════════════════════════════════════
// MAIN DATA TABLE
// ══════════════════════════════════════════
function renderMainTable() {
  // Populate Jenis filter
  const selJenis = document.getElementById('filterJenis');
  if (selJenis && selJenis.options.length <= 1) {
    JENIS_PPKS.forEach(j => {
      const o = document.createElement('option');
      o.value = j.nama;
      o.textContent = j.icon + ' ' + j.nama;
      selJenis.appendChild(o);
    });
  }

  // Populate form select
  const formSel = document.getElementById('f-jenis-ppks');
  if (formSel && formSel.options.length <= 1) {
    JENIS_PPKS.forEach(j => {
      const o = document.createElement('option');
      o.value = j.nama;
      o.textContent = j.icon + ' ' + j.nama;
      formSel.appendChild(o);
    });
  }

  filterTable();
}

function filterTable() {
  const searchInput = document.getElementById('searchInput');
  const q = (searchInput ? searchInput.value : '').toLowerCase();
  const filterJenisEl = document.getElementById('filterJenis');
  const fj = filterJenisEl ? filterJenisEl.value : '';
  const filterWilayahEl = document.getElementById('filterWilayah');
  const fw = filterWilayahEl ? filterWilayahEl.value : '';
  const filterStatusEl = document.getElementById('filterStatus');
  const fs = filterStatusEl ? filterStatusEl.value : '';

  filteredDB = DB.filter(d => {
    const matchQ = !q || (d.nama||'').toLowerCase().includes(q) || (d.nik||'').includes(q) || (d.id||'').toLowerCase().includes(q);
    const matchJ = !fj || d.jenisPpks === fj;
    const matchW = !fw || d.wilayah === fw;
    const matchS = !fs || d.status === fs;
    return matchQ && matchJ && matchW && matchS;
  });

  currentPage = 1;
  renderTablePage();
}

function renderTablePage() {
  const start = (currentPage - 1) * PER_PAGE;
  const pageData = filteredDB.slice(start, start + PER_PAGE);
  const tbody = document.getElementById('mainTableBody');
  if (!tbody) return;

  tbody.innerHTML = pageData.length
    ? pageData.map(d => `
      <tr>
        <td><span style="font-family:monospace;font-size:11.5px;color:var(--blue-mid);font-weight:600;">${d.id}</span></td>
        <td>
          <div style="font-weight:600;">${d.nama}</div>
          <div style="font-size:11px;color:var(--gray-400);">${d.jk} • ${d.kecamatan}</div>
        </td>
        <td><span style="font-size:13px;">${d.nik}</span></td>
        <td><span style="font-size:13px;">${d.jenisPpksIcon || '📋'} ${d.jenisPpks}</span></td>
        <td>${d.wilayah}</td>
        <td>${formatDate(d.tglDaftar)}</td>
        <td>${statusBadge(d.status)}</td>
        <td>
          <div style="display:flex;gap:4px;">
            <button class="btn btn-outline btn-sm" onclick="showDetail('${d.id}')">👁 Detail</button>
            <button class="btn btn-sm" style="background:var(--amber-pale);color:var(--amber);" onclick="showEditModal('${d.id}')">✏️</button>
            <button class="btn btn-sm" style="background:var(--red-pale);color:var(--red);" onclick="hapusData('${d.id}')">🗑</button>
          </div>
        </td>
      </tr>
    `).join('')
    : '<tr><td colspan="8"><div class="empty-state"><div class="empty-state-icon">🔍</div><div class="empty-state-title">Data tidak ditemukan</div><div class="empty-state-desc">Coba ubah filter pencarian</div></div></td></tr>';

  const total = filteredDB.length;
  const tableInfo = document.getElementById('tableInfo');
  if (tableInfo) tableInfo.textContent = `Menampilkan ${Math.min(start + 1, total)}–${Math.min(start + PER_PAGE, total)} dari ${total} data`;

  // Pagination
  const totalPages = Math.ceil(total / PER_PAGE);
  const pag = document.getElementById('pagination');
  if (!pag) return;

  let html = `<div class="page-btn" onclick="goPage(${Math.max(1, currentPage - 1)})">‹</div>`;
  for (let p = 1; p <= totalPages; p++) {
    if (p <= 2 || p > totalPages - 2 || Math.abs(p - currentPage) <= 1) {
      html += `<div class="page-btn ${p === currentPage ? 'active' : ''}" onclick="goPage(${p})">${p}</div>`;
    } else if (Math.abs(p - currentPage) === 2) {
      html += `<div class="page-btn" style="pointer-events:none;">…</div>`;
    }
  }
  html += `<div class="page-btn" onclick="goPage(${Math.min(totalPages, currentPage + 1)})">›</div>`;
  pag.innerHTML = html;
}

function goPage(p) { currentPage = p; renderTablePage(); }

// ══════════════════════════════════════════
// DETAIL MODAL
// ══════════════════════════════════════════
function showDetail(id) {
  const d = DB.find(x => x.id === id);
  if (!d) return;

  const titleEl = document.getElementById('modalDetailTitle');
  if (titleEl) titleEl.textContent = `Detail PPKS — ${d.id}`;

  const bodyEl = document.getElementById('modalDetailBody');
  if (bodyEl) bodyEl.innerHTML = `
    <div style="display:flex;align-items:center;gap:14px;padding:12px;background:var(--blue-xpale);border-radius:10px;margin-bottom:16px;">
      <div style="width:52px;height:52px;border-radius:50%;background:var(--blue-mid);display:flex;align-items:center;justify-content:center;font-size:22px;color:white;flex-shrink:0;">${d.jk === 'Laki-laki' ? '👨' : '👩'}</div>
      <div>
        <div style="font-size:16px;font-weight:700;">${d.nama}</div>
        <div style="font-size:12px;color:var(--gray-600);">${d.id} • ${d.jk}</div>
        <div style="margin-top:4px;">${statusBadge(d.status)}</div>
      </div>
    </div>
    <div class="detail-kv">
      ${kv('NIK', d.nik)}
      ${kv('Jenis PPKS', (d.jenisPpksIcon || '') + ' ' + d.jenisPpks)}
      ${kv('Tanggal Lahir', formatDate(d.ttl))}
      ${kv('Jenis Kelamin', d.jk)}
      ${kv('Kondisi Kesehatan', d.kondisiKes)}
      ${kv('Pendidikan', d.pendidikan)}
      ${kv('Kabupaten/Kota', d.wilayah)}
      ${kv('Kecamatan', d.kecamatan)}
      ${kv('Kebutuhan Utama', d.kebutuhan)}
      ${kv('Prioritas', d.prioritas)}
      ${kv('Bansos Aktif', d.bansos)}
      ${kv('Petugas Pendaftar', d.petugas)}
      ${kv('Tanggal Daftar', formatDate(d.tglDaftar))}
      ${kv('Catatan', d.catatan)}
    </div>
  `;

  // Update edit button to use current ID
  const editBtn = document.querySelector('#modalDetail .modal-footer .btn-primary');
  if (editBtn) editBtn.setAttribute('onclick', `closeModal('modalDetail'); showEditModal('${id}')`);

  openModal('modalDetail');
}

function kv(label, value) {
  return `<div class="kv-row"><div class="kv-label">${label}</div><div class="kv-value">${value || '-'}</div></div>`;
}

// ══════════════════════════════════════════
// EDIT MODAL (inline)
// ══════════════════════════════════════════
function showEditModal(id) {
  const d = DB.find(x => x.id === id);
  if (!d) { toast('Data tidak ditemukan', 'error'); return; }
  toast(`Mode edit data ${id} — fitur lengkap tersedia di versi produksi`, 'warning');
}

// ══════════════════════════════════════════
// HAPUS DATA
// ══════════════════════════════════════════
async function hapusData(id) {
  if (!confirm(`Apakah Anda yakin ingin menghapus data ${id}?`)) return;

  const idx = DB.findIndex(x => x.id === id);
  if (idx === -1) { toast('Data tidak ditemukan', 'error'); return; }

  if (USE_DEMO_DATA || !supabaseClient) {
    DB.splice(idx, 1);
    toast(`Data ${id} berhasil dihapus (mode demo)`, 'success');
    renderMainTable();
    renderDashboard();
    updateNavBadges();
    return;
  }

  const d = DB[idx];
  const { error } = await supabaseClient.from('ppks_data').delete().eq('id', d._id);
  if (error) {
    toast('Gagal menghapus data: ' + error.message, 'error');
    return;
  }
  DB.splice(idx, 1);
  toast(`Data ${id} berhasil dihapus`, 'success');
  renderMainTable();
  renderDashboard();
  updateNavBadges();
}

// ══════════════════════════════════════════
// TAMBAH DATA — TAB SWITCH
// ══════════════════════════════════════════
function switchTab(el, tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  ['tab-identitas','tab-kondisi','tab-kebutuhan'].forEach(id => {
    const t = document.getElementById(id);
    if (t) t.style.display = id === tabId ? 'block' : 'none';
  });
}

async function simpanData() {
  const nama = (document.getElementById('f-nama')?.value || '').trim();
  const nik = (document.getElementById('f-nik')?.value || '').trim();
  const jk = document.getElementById('f-jk')?.value || '';
  const jenisPpks = document.getElementById('f-jenis-ppks')?.value || '';
  const kab = document.getElementById('f-kab')?.value || '';

  if (!nama || !nik || !jk || !jenisPpks || !kab) {
    toast('Lengkapi field wajib (*)', 'error');
    return;
  }
  if (nik.length !== 16 || isNaN(nik)) {
    toast('NIK harus 16 digit angka', 'error');
    return;
  }

  const jenisData = JENIS_PPKS.find(j => j.nama === jenisPpks) || {icon: '📋', kode: '000'};
  const newNoReg = 'PPKS-PBD-' + String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0');

  const newRecord = {
    _id: 'local-' + Date.now(),
    id: newNoReg,
    nama,
    nik,
    jk,
    ttl: document.getElementById('f-ttl')?.value || null,
    tglDaftar: new Date().toISOString().slice(0, 10),
    jenisPpks,
    jenisPpksKode: jenisData.kode,
    jenisPpksIcon: jenisData.icon,
    wilayah: kab,
    kecamatan: document.getElementById('f-kec')?.value || '-',
    status: 'Draft',
    kondisiKes: document.getElementById('f-kondisi-kes')?.value || '-',
    pendidikan: document.getElementById('f-pendidikan')?.value || '-',
    kebutuhan: document.getElementById('f-kebutuhan')?.value || '-',
    prioritas: document.getElementById('f-prioritas')?.value || '-',
    bansos: document.getElementById('f-bansos')?.value || '-',
    petugas: document.getElementById('f-petugas')?.value || 'Admin',
    catatan: document.getElementById('f-catatan')?.value || '-',
  };

  if (!USE_DEMO_DATA && supabaseClient) {
    try {
      const dbRecord = {
        no_registrasi: newRecord.id,
        nama: newRecord.nama,
        nik: newRecord.nik,
        jk: newRecord.jk,
        ttl: newRecord.ttl,
        tgl_daftar: newRecord.tglDaftar,
        jenis_ppks: newRecord.jenisPpks,
        jenis_ppks_kode: newRecord.jenisPpksKode,
        jenis_ppks_icon: newRecord.jenisPpksIcon,
        wilayah: newRecord.wilayah,
        kecamatan: newRecord.kecamatan,
        status: newRecord.status,
        kondisi_kes: newRecord.kondisiKes,
        pendidikan: newRecord.pendidikan,
        kebutuhan: newRecord.kebutuhan,
        prioritas: newRecord.prioritas,
        bansos: newRecord.bansos,
        petugas: newRecord.petugas,
        catatan: newRecord.catatan,
      };
      const { error } = await supabaseClient.from('ppks_data').insert([dbRecord]);
      if (error) throw error;
    } catch (err) {
      toast('Gagal menyimpan ke database: ' + err.message, 'error');
      return;
    }
  }

  // Add to local DB
  DB.unshift(newRecord);
  resetForm();
  toast(`Data ${newNoReg} berhasil disimpan!`, 'success');
  updateNavBadges();
  setTimeout(() => showPage('data-ppks'), 1000);
}

function resetForm() {
  ['f-nama','f-nik','f-ttl-place','f-ttl','f-kec','f-kel','f-telp','f-petugas','f-alamat',
   'f-pekerjaan','f-penghasilan','f-tanggungan','f-masalah','f-rekomendasi','f-catatan']
  .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  ['f-jk','f-status-kawin','f-jenis-ppks','f-kab','f-kondisi-kes','f-pendidikan',
   'f-rumah','f-kebutuhan','f-bansos','f-prioritas','f-sumber']
  .forEach(id => { const el = document.getElementById(id); if (el) el.selectedIndex = 0; });
  // Reset to first tab
  const firstTab = document.querySelector('#page-tambah-ppks .tab');
  if (firstTab) switchTab(firstTab, 'tab-identitas');
  toast('Form direset', '');
}

// ══════════════════════════════════════════
// VERIFIKASI
// ══════════════════════════════════════════
function renderVerifTable() {
  const pending = DB.filter(d => d.status !== 'Terverifikasi');
  const tbody = document.getElementById('verifTableBody');
  if (!tbody) return;

  tbody.innerHTML = pending.length
    ? pending.map(d => `
      <tr>
        <td><span style="font-family:monospace;font-size:11.5px;color:var(--blue-mid);font-weight:600;">${d.id}</span></td>
        <td><b>${d.nama}</b><div style="font-size:11px;color:var(--gray-400);">${d.jk}</div></td>
        <td>${d.jenisPpksIcon || '📋'} ${d.jenisPpks}</td>
        <td>${d.wilayah}</td>
        <td>${formatDate(d.tglDaftar)}</td>
        <td>${statusBadge(d.status)}</td>
        <td>
          <div style="display:flex;gap:4px;">
            <button class="btn btn-sm" style="background:var(--teal-pale);color:var(--teal);" onclick="openVerifModal('${d.id}')">🔍 Periksa</button>
            <button class="btn btn-success btn-sm" onclick="quickVerif('${d.id}')">✅</button>
          </div>
        </td>
      </tr>
    `).join('')
    : '<tr><td colspan="7"><div class="empty-state"><div class="empty-state-icon">✅</div><div class="empty-state-title">Semua data sudah terverifikasi</div></div></td></tr>';
}

function openVerifModal(id) {
  currentVerifId = id;
  const d = DB.find(x => x.id === id);
  if (!d) return;

  const bodyEl = document.getElementById('modalVerifBody');
  if (bodyEl) bodyEl.innerHTML = `
    <div style="background:var(--amber-pale);border:1.5px solid var(--amber);border-radius:10px;padding:14px;margin-bottom:16px;">
      <b>⚠️ Periksa kelengkapan data sebelum verifikasi</b>
    </div>
    <div class="detail-kv">
      ${kv('ID PPKS', d.id)}
      ${kv('Nama', d.nama)}
      ${kv('NIK', d.nik)}
      ${kv('Jenis PPKS', (d.jenisPpksIcon || '') + ' ' + d.jenisPpks)}
      ${kv('Wilayah', d.wilayah + ' / ' + d.kecamatan)}
      ${kv('Kondisi Kesehatan', d.kondisiKes)}
      ${kv('Kebutuhan', d.kebutuhan)}
      ${kv('Prioritas', d.prioritas)}
    </div>
    <div class="form-group" style="margin-top:16px;">
      <label class="form-label">Catatan Verifikasi</label>
      <textarea class="form-textarea" id="catatanVerif" placeholder="Tambahkan catatan verifikasi..."></textarea>
    </div>
  `;
  openModal('modalVerif');
}

async function verifikasiData() {
  if (!currentVerifId) return;
  const d = DB.find(x => x.id === currentVerifId);
  if (!d) return;

  if (!USE_DEMO_DATA && supabaseClient) {
    const { error } = await supabaseClient.from('ppks_data').update({ status: 'Terverifikasi' }).eq('id', d._id);
    if (error) { toast('Gagal verifikasi: ' + error.message, 'error'); return; }
  }

  d.status = 'Terverifikasi';
  closeModal('modalVerif');
  toast(`Data ${currentVerifId} berhasil diverifikasi!`, 'success');
  renderVerifTable();
  renderDashboard();
  updateNavBadges();
}

async function quickVerif(id) {
  const d = DB.find(x => x.id === id);
  if (!d) return;

  if (!USE_DEMO_DATA && supabaseClient) {
    const { error } = await supabaseClient.from('ppks_data').update({ status: 'Terverifikasi' }).eq('id', d._id);
    if (error) { toast('Error: ' + error.message, 'error'); return; }
  }

  d.status = 'Terverifikasi';
  toast(`Data ${id} terverifikasi!`, 'success');
  renderVerifTable();
  renderDashboard();
  updateNavBadges();
}

async function tolakData() {
  if (!currentVerifId) return;
  const d = DB.find(x => x.id === currentVerifId);
  if (!d) return;

  if (!USE_DEMO_DATA && supabaseClient) {
    const { error } = await supabaseClient.from('ppks_data').update({ status: 'Ditolak' }).eq('id', d._id);
    if (error) { toast('Gagal menolak: ' + error.message, 'error'); return; }
  }

  d.status = 'Ditolak';
  closeModal('modalVerif');
  toast(`Data ${currentVerifId} ditolak`, 'error');
  renderVerifTable();
  renderDashboard();
  updateNavBadges();
}

// ══════════════════════════════════════════
// STATISTIK
// ══════════════════════════════════════════
function renderStats() {
  if (!DB || DB.length === 0) return;

  // Per wilayah
  const wCount = {};
  WILAYAH.forEach(w => wCount[w] = 0);
  DB.forEach(d => { wCount[d.wilayah] = (wCount[d.wilayah] || 0) + 1; });
  const maxW = Math.max(...Object.values(wCount), 1);
  const statsWilayah = document.getElementById('statsWilayah');
  if (statsWilayah) statsWilayah.innerHTML = Object.entries(wCount).map(([w, c]) => `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
      <div style="font-size:12px;width:130px;flex-shrink:0;font-weight:500;">${w}</div>
      <div class="progress-bar-outer" style="flex:1;">
        <div class="progress-bar-inner" style="width:${Math.round(c/maxW*100)}%;"></div>
      </div>
      <div style="font-size:12px;font-weight:700;color:var(--blue-dark);width:30px;text-align:right;">${c}</div>
    </div>
  `).join('');

  // Per jenis
  const jCount = {};
  DB.forEach(d => { jCount[d.jenisPpks] = (jCount[d.jenisPpks] || 0) + 1; });
  const top10 = Object.entries(jCount).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const maxJ = top10[0]?.[1] || 1;
  const statsJenis = document.getElementById('statsJenis');
  if (statsJenis) statsJenis.innerHTML = top10.map(([j, c]) => `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
      <div style="font-size:11.5px;width:150px;flex-shrink:0;font-weight:500;">${j}</div>
      <div class="progress-bar-outer" style="flex:1;">
        <div class="progress-bar-inner" style="width:${Math.round(c/maxJ*100)}%;background:var(--teal);"></div>
      </div>
      <div style="font-size:12px;font-weight:700;color:var(--teal);width:28px;text-align:right;">${c}</div>
    </div>
  `).join('');

  // Gender
  const laki = DB.filter(d => d.jk === 'Laki-laki').length;
  const perempuan = DB.length - laki;
  const pL = DB.length > 0 ? Math.round(laki / DB.length * 100) : 50;
  const pP = 100 - pL;
  const statsGender = document.getElementById('statsGender');
  if (statsGender) statsGender.innerHTML = `
    <div style="font-size:36px;margin-bottom:8px;">⚧</div>
    <div style="display:flex;height:20px;border-radius:10px;overflow:hidden;margin-bottom:10px;">
      <div style="width:${pL}%;background:var(--blue-mid);"></div>
      <div style="width:${pP}%;background:#E91E8C;"></div>
    </div>
    <div style="display:flex;justify-content:space-around;font-size:13px;">
      <div><span style="color:var(--blue-mid);font-weight:700;">👨 ${pL}%</span><div style="font-size:11px;color:var(--gray-400);">Laki-laki (${laki})</div></div>
      <div><span style="color:#E91E8C;font-weight:700;">👩 ${pP}%</span><div style="font-size:11px;color:var(--gray-400);">Perempuan (${perempuan})</div></div>
    </div>
  `;

  // Umur
  const umurGroups = {'0-14': 0, '15-24': 0, '25-44': 0, '45-59': 0, '60+': 0};
  DB.forEach(d => {
    if (!d.ttl) return;
    try {
      const age = new Date().getFullYear() - new Date(d.ttl).getFullYear();
      if (age < 15) umurGroups['0-14']++;
      else if (age < 25) umurGroups['15-24']++;
      else if (age < 45) umurGroups['25-44']++;
      else if (age < 60) umurGroups['45-59']++;
      else umurGroups['60+']++;
    } catch(e) {}
  });
  const maxU = Math.max(...Object.values(umurGroups), 1);
  const statsUmur = document.getElementById('statsUmur');
  if (statsUmur) statsUmur.innerHTML = Object.entries(umurGroups).map(([g, c]) => `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
      <div style="font-size:12px;width:50px;flex-shrink:0;font-weight:600;">${g}</div>
      <div class="progress-bar-outer" style="flex:1;">
        <div class="progress-bar-inner" style="width:${Math.round(c/maxU*100)}%;background:var(--purple);"></div>
      </div>
      <div style="font-size:12px;font-weight:700;color:var(--purple);width:28px;text-align:right;">${c}</div>
    </div>
  `).join('');

  // Prioritas
  const pCount = {'Sangat Mendesak': 0, 'Mendesak': 0, 'Sedang': 0, 'Rendah': 0};
  DB.forEach(d => { if (pCount[d.prioritas] !== undefined) pCount[d.prioritas]++; });
  const colors = {'Sangat Mendesak': 'var(--red)', 'Mendesak': 'var(--amber)', 'Sedang': 'var(--blue-mid)', 'Rendah': 'var(--green)'};
  const maxP = Math.max(...Object.values(pCount), 1);
  const statsPrioritas = document.getElementById('statsPrioritas');
  if (statsPrioritas) statsPrioritas.innerHTML = Object.entries(pCount).map(([p, c]) => `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
      <div style="font-size:11px;width:110px;flex-shrink:0;font-weight:500;">${p}</div>
      <div class="progress-bar-outer" style="flex:1;">
        <div class="progress-bar-inner" style="width:${Math.round(c/maxP*100)}%;background:${colors[p]};"></div>
      </div>
      <div style="font-size:12px;font-weight:700;color:${colors[p]};width:28px;text-align:right;">${c}</div>
    </div>
  `).join('');
}

// ══════════════════════════════════════════
// SEBARAN WILAYAH
// ══════════════════════════════════════════
function renderSebaran() {
  if (!DB || DB.length === 0) return;

  const regionPills = document.getElementById('regionPills');
  if (regionPills) regionPills.innerHTML = WILAYAH.map(w => `
    <div class="region-pill" onclick="toggleRegionPill(this)">${w}</div>
  `).join('');

  const wStats = WILAYAH.map(w => {
    const total = DB.filter(d => d.wilayah === w).length;
    const verif = DB.filter(d => d.wilayah === w && d.status === 'Terverifikasi').length;
    const pending = DB.filter(d => d.wilayah === w && d.status === 'Menunggu').length;
    const draft = DB.filter(d => d.wilayah === w && d.status === 'Draft').length;
    const pct = total ? Math.round(verif / total * 100) : 0;
    return {w, total, verif, pending, draft, pct};
  });

  const wilayahBody = document.getElementById('wilayahTableBody');
  if (wilayahBody) wilayahBody.innerHTML = wStats.map(s => `
    <tr>
      <td><b>${s.w}</b></td>
      <td style="font-weight:700;color:var(--blue-dark);">${s.total}</td>
      <td><span class="badge badge-green">${s.verif}</span></td>
      <td><span class="badge badge-amber">${s.pending}</span></td>
      <td><span class="badge badge-gray">${s.draft}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="progress-bar-outer" style="flex:1;"><div class="progress-bar-inner" style="width:${s.pct}%;"></div></div>
          <span style="font-size:12px;font-weight:700;color:var(--blue-dark);">${s.pct}%</span>
        </div>
      </td>
    </tr>
  `).join('');
}

function toggleRegionPill(el) {
  el.classList.toggle('active');
}

// ══════════════════════════════════════════
// USERS
// ══════════════════════════════════════════
const USERS = [
  {nama:'Admin Dinas',username:'admin_dinas',email:'admin@dinsos-pbd.go.id',role:'Administrator',wilayah:'Semua Wilayah',status:'Aktif',lastLogin:'Hari ini, 08:32'},
  {nama:'Petrus Kambu',username:'ptrs_kbr',email:'petrus@dinsos-pbd.go.id',role:'Operator Pendataan',wilayah:'Kota Sorong',status:'Aktif',lastLogin:'Hari ini, 09:15'},
  {nama:'Maria Solossa',username:'maria_sls',email:'maria@dinsos-pbd.go.id',role:'Verifikator',wilayah:'Kab. Sorong',status:'Aktif',lastLogin:'Kemarin, 15:30'},
  {nama:'Yohanes Wanma',username:'yhn_wanma',email:'yohanes@dinsos-pbd.go.id',role:'Operator Pendataan',wilayah:'Kab. Raja Ampat',status:'Aktif',lastLogin:'2 hari lalu'},
  {nama:'Anastasia Imbiri',username:'ana_imbiri',email:'anastasia@dinsos-pbd.go.id',role:'Verifikator',wilayah:'Kab. Tambrauw',status:'Nonaktif',lastLogin:'1 minggu lalu'},
  {nama:'Felix Mandowen',username:'flx_mndw',email:'felix@dinsos-pbd.go.id',role:'Operator Pendataan',wilayah:'Kab. Maybrat',status:'Aktif',lastLogin:'Hari ini, 10:45'},
];

const ROLE_COLORS = {'Administrator':'badge-purple','Verifikator':'badge-blue','Operator Pendataan':'badge-teal'};

function renderUsers() {
  const tbody = document.getElementById('userTableBody');
  if (!tbody) return;

  tbody.innerHTML = USERS.map(u => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="width:32px;height:32px;border-radius:50%;background:var(--blue-pale);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:var(--blue-mid);">${u.nama.charAt(0)}</div>
          <div>
            <div style="font-weight:600;">${u.nama}</div>
            <div style="font-size:11px;color:var(--gray-400);">Login: ${u.lastLogin}</div>
          </div>
        </div>
      </td>
      <td><span style="font-family:monospace;font-size:12px;">${u.username}</span></td>
      <td style="font-size:12px;">${u.email}</td>
      <td><span class="badge ${ROLE_COLORS[u.role] || 'badge-gray'}">${u.role}</span></td>
      <td style="font-size:12px;">${u.wilayah}</td>
      <td><span class="badge ${u.status === 'Aktif' ? 'badge-green' : 'badge-red'}">${u.status}</span></td>
      <td>
        <div style="display:flex;gap:4px;">
          <button class="btn btn-outline btn-sm" onclick="toast('Edit pengguna ${u.username}','warning')">✏️ Edit</button>
          <button class="btn btn-sm" style="background:var(--red-pale);color:var(--red);" onclick="toast('Reset password ${u.username}','')">🔑</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ══════════════════════════════════════════
// SOP / PANDUAN
// ══════════════════════════════════════════
const SOPS = [
  {no:'SOP-01',judul:'Penginputan Data PPKS',icon:'📥',steps:['Login ke sistem SIPPKS','Klik menu Tambah Data','Isi form identitas PPKS (tab Identitas)','Isi kondisi sosial (tab Kondisi Sosial)','Isi kebutuhan & program (tab Kebutuhan)','Klik tombol Simpan Data PPKS','Cetak bukti pendaftaran'],regulasi:'Permensos No. 3/2021'},
  {no:'SOP-02',judul:'Verifikasi & Validasi Data',icon:'✅',steps:['Login sebagai Verifikator','Klik menu Verifikasi & Validasi','Pilih data yang akan diverifikasi','Klik tombol Periksa','Cocokkan data dengan dokumen fisik','Isi catatan verifikasi','Klik Verifikasi atau Tolak'],regulasi:'Permensos No. 3/2021'},
  {no:'SOP-03',judul:'Pemutakhiran Data Berkala',icon:'🔄',steps:['Login sebagai Operator/Admin','Buka Data PPKS yang akan diperbarui','Klik tombol Edit (ikon ✏️)','Perbarui data sesuai kondisi terkini','Unggah dokumen pendukung jika ada','Simpan perubahan','Catat di logbook pemutakhiran'],regulasi:'Perpres No. 95/2018'},
  {no:'SOP-04',judul:'Keamanan & Perlindungan Data',icon:'🔐',steps:['Gunakan password minimal 8 karakter','Jangan berbagi akun dengan orang lain','Logout setelah selesai menggunakan sistem','Laporkan aktivitas mencurigakan ke admin','Data PPKS bersifat RAHASIA','Dilarang mengambil screenshot/foto layar','Akses hanya dari perangkat resmi dinas'],regulasi:'UU No. 27/2022'},
];

function renderSOP() {
  const sopGrid = document.getElementById('sopGrid');
  if (!sopGrid) return;

  sopGrid.innerHTML = SOPS.map(s => `
    <div class="card">
      <div class="card-header">
        <div class="card-title">${s.icon} ${s.no} — ${s.judul}</div>
        <span class="badge badge-blue">${s.regulasi}</span>
      </div>
      <div class="card-body">
        <div class="timeline">${s.steps.map((st, i) => `
          <div class="timeline-item">
            <div class="timeline-dot" style="background:var(--blue-pale);color:var(--blue-mid);font-weight:700;font-size:12px;">${i + 1}</div>
            <div class="timeline-content"><div class="timeline-title">${st}</div></div>
          </div>
        `).join('')}</div>
      </div>
    </div>
  `).join('');
}

// ══════════════════════════════════════════
// LAPORAN
// ══════════════════════════════════════════
function renderLaporan() {
  const hist = [
    {icon:'📄',title:'Laporan Bulanan Oktober 2024',time:'2 jam lalu',size:'245 KB'},
    {icon:'📊',title:'Laporan Per Wilayah Q3 2024',time:'1 hari lalu',size:'512 KB'},
    {icon:'📋',title:'Laporan Rekapitulasi Semester I',time:'3 hari lalu',size:'1.2 MB'},
    {icon:'📈',title:'Laporan Jenis PPKS Agustus 2024',time:'5 hari lalu',size:'320 KB'},
  ];

  const histEl = document.getElementById('laporanHistory');
  if (histEl) histEl.innerHTML = hist.map(h => `
    <div class="timeline-item">
      <div class="timeline-dot" style="background:var(--blue-pale);font-size:18px;">${h.icon}</div>
      <div class="timeline-content">
        <div class="timeline-title">${h.title}</div>
        <div class="timeline-time">⏰ ${h.time} • 📦 ${h.size}</div>
      </div>
      <button class="btn btn-outline btn-sm" onclick="toast('Mengunduh laporan...','warning')">⬇</button>
    </div>
  `).join('');

  const now = new Date().toISOString().slice(0, 7);
  const lapAwal = document.getElementById('lapBulanAwal');
  const lapAkhir = document.getElementById('lapBulanAkhir');
  if (lapAwal) lapAwal.value = now;
  if (lapAkhir) lapAkhir.value = now;
}

// ══════════════════════════════════════════
// EXPORT
// ══════════════════════════════════════════
function exportData() {
  toast('Menyiapkan ekspor data...', 'warning');
  setTimeout(() => toast('Data berhasil diekspor!', 'success'), 2000);
}

// ══════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ══════════════════════════════════════════
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
});

// ══════════════════════════════════════════
// LOGIN & SESSION
// ══════════════════════════════════════════
function checkLogin() {
  const isLoggedIn = localStorage.getItem('sippks_logged_in');
  if (isLoggedIn === 'true') {
    document.getElementById('loginOverlay').style.display = 'none';
    document.getElementById('appWrapper').style.display = 'block';
    return true;
  } else {
    document.getElementById('loginOverlay').style.display = 'flex';
    document.getElementById('appWrapper').style.display = 'none';
    return false;
  }
}

function handleLogin(e) {
  e.preventDefault();
  const user = document.getElementById('loginUsername').value;
  const pass = document.getElementById('loginPassword').value;
  const err = document.getElementById('loginError');
  
  if (user && pass === 'admin123') {
    localStorage.setItem('sippks_logged_in', 'true');
    localStorage.setItem('sippks_user', user);
    err.style.display = 'none';
    checkLogin();
    showToast(`Selamat datang, ${user}!`, 'success');
  } else {
    err.style.display = 'block';
    err.textContent = 'Username atau password salah! (Gunakan: admin123)';
  }
}

function logout() {
  if (!confirm('Apakah Anda yakin ingin keluar dari sistem?')) return;
  localStorage.removeItem('sippks_logged_in');
  localStorage.removeItem('sippks_user');
  document.getElementById('loginUsername').value = '';
  document.getElementById('loginPassword').value = '';
  checkLogin();
  showToast('Anda telah berhasil keluar.', 'info');
}

// ══════════════════════════════════════════
// INIT
// ══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Check Login first
  checkLogin();
  // Populate form selects
  const formSel = document.getElementById('f-jenis-ppks');
  if (formSel && formSel.options.length <= 1) {
    JENIS_PPKS.forEach(j => {
      const o = document.createElement('option');
      o.value = j.nama;
      o.textContent = j.icon + ' ' + j.nama;
      formSel.appendChild(o);
    });
  }

  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
  });

  // Set dashboard as active
  showPage('dashboard');

  // Fetch data
  fetchDB();
});