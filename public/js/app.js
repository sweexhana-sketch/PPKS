// ══════════════════════════════════════════
// DATA STORE
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

const NAMA_LAKI = ["Yusuf","Paulus","Markus","Petrus","Dominikus","Agus","Benyamin","Kornelius","Amatus","Felix","Viktor","Yohanes","Emanuel","Bernardus","Fransiskus","Tarsisius","Kristianus","Odi","Naftali","Melkias"];
const NAMA_PEREMPUAN = ["Maria","Yohana","Magdalena","Susana","Felisitas","Anastasia","Yuliana","Theresia","Katarina","Monika","Rosalinda","Emerensiana","Agustina","Kristina","Veronika","Paulina","Martina","Ignatia","Klara","Benedicta"];
const NAMA_BELAKANG = ["Kambu","Solossa","Ayomi","Aditya","Mandowen","Demoor","Saa","Yawan","Koirewoa","Wanma","Rumfabe","Faidiban","Imbiri","Sanadi","Kafiar","Mansoben","Rumbrar","Yomber","Bleskadit","Krey"];

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
function formatDate(str) {
  if(!str) return '-';
  const d=new Date(str);
  return d.toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'});
}

// Generate 120 sample records
let DB = [];
let idCounter = 1;
function generateDB() {
  DB = [];
  idCounter = 1;
  for(let i=0;i<120;i++) {
    const jk = Math.random()>.45 ? 'Laki-laki':'Perempuan';
    const nama = (jk==='Laki-laki'?randFrom(NAMA_LAKI):randFrom(NAMA_PEREMPUAN)) + ' ' + randFrom(NAMA_BELAKANG);
    const jenisPpks = randFrom(JENIS_PPKS);
    const statusOptions = ['Terverifikasi','Terverifikasi','Terverifikasi','Menunggu','Menunggu','Draft'];
    const status = randFrom(statusOptions);
    DB.push({
      id: 'PPKS-PBD-'+String(idCounter++).padStart(4,'0'),
      nama, nik: randNIK(), jk,
      ttl: randDate(60), tglDaftar: randDate(2),
      jenisPpks: jenisPpks.nama, jenisPpksKode: jenisPpks.kode,
      jenisPpksIcon: jenisPpks.icon,
      wilayah: randFrom(WILAYAH),
      kecamatan: 'Kec. '+['Sorong Utara','Sorong Selatan','Sorong Timur','Aimas','Waigeo','Segun','Fef','Ayamaru','Sawiat','Teminabuan'][randInt(0,9)],
      status,
      kondisiKes: randFrom(['Sehat','Sakit Ringan','Sakit Kronis','Disabilitas']),
      pendidikan: randFrom(['Tidak Sekolah','SD/Sederajat','SMP/Sederajat','SMA/Sederajat']),
      kebutuhan: randFrom(['Bantuan Pangan','Bantuan Sandang','Layanan Kesehatan','Rehabilitasi Sosial','Pemberdayaan Ekonomi','Perlindungan Sosial']),
      prioritas: randFrom(['Sangat Mendesak','Mendesak','Sedang','Rendah']),
      bansos: randFrom(['PKH','BPNT/Sembako','KIS/BPJS PBI','Tidak Ada']),
      petugas: 'Petugas ' + randFrom(['A','B','C','D','E']),
      catatan: 'Data terdata melalui pendataan lapangan.',
    });
  }
}

// ══════════════════════════════════════════
// PAGE ROUTING
// ══════════════════════════════════════════
function showPage(id) {
  document.querySelectorAll('.page-view').forEach(el=>el.classList.remove('active'));
  document.querySelectorAll('.sidebar-nav-item').forEach(el=>el.classList.remove('active'));
  const pg = document.getElementById('page-'+id);
  if(pg) pg.classList.add('active');
  const navItems = document.querySelectorAll('.sidebar-nav-item');
  navItems.forEach(el => {
    if(el.getAttribute('onclick') && el.getAttribute('onclick').includes("'"+id+"'"))
      el.classList.add('active');
  });
  if(id==='data-ppks') renderMainTable();
  if(id==='verifikasi') renderVerifTable();
  if(id==='statistik') renderStats();
  if(id==='sebaran') renderSebaran();
  if(id==='pengguna') renderUsers();
  if(id==='panduan') renderSOP();
  if(id==='laporan') renderLaporan();
}

// ══════════════════════════════════════════
// MODAL
// ══════════════════════════════════════════
function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}
let currentVerifId = null;

// ══════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════
function toast(msg, type='') {
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.innerHTML = (type==='success'?'✅ ':type==='error'?'❌ ':type==='warning'?'⚠️ ':'ℹ️ ') + msg;
  document.getElementById('toastContainer').appendChild(el);
  setTimeout(()=>el.remove(), 3200);
}

// ══════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════
function renderDashboard() {
  const total = DB.length;
  const verif = DB.filter(d=>d.status==='Terverifikasi').length;
  const pending = DB.filter(d=>d.status==='Menunggu').length;
  const draft = DB.filter(d=>d.status==='Draft').length;
  const jenis = new Set(DB.map(d=>d.jenisPpks)).size;
  const today = DB.filter(d=>d.tglDaftar === new Date().toISOString().slice(0,10)).length;

  animCount('statTotal', total);
  animCount('statVerif', verif);
  animCount('statPending', pending);
  animCount('statJenis', jenis);
  animCount('statToday', today||randInt(3,12));
  animCount('donutTotal', total);

  const pv = Math.round(verif/total*100), pp = Math.round(pending/total*100), pd = Math.round(draft/total*100);
  document.getElementById('pctVerif').textContent = pv+'%';
  document.getElementById('pctPending').textContent = pp+'%';
  document.getElementById('pctDraft').textContent = pd+'%';
  document.getElementById('progVerif').style.width = pv+'%';
  document.getElementById('progPending').style.width = pp+'%';
  document.getElementById('progDraft').style.width = pd+'%';

  updateNavBadges();

  // Bar chart
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun'];
  const vals = [randInt(15,30),randInt(18,35),randInt(20,40),randInt(25,45),randInt(22,38),randInt(28,50)];
  const maxV = Math.max(...vals);
  const bc = document.getElementById('chartBars');
  const bl = document.getElementById('chartLabels');
  bc.innerHTML = vals.map((v,i)=>`
    <div class="chart-bar-col">
      <div class="chart-bar-val">${v}</div>
      <div class="chart-bar" style="height:${Math.round(v/maxV*100)}px;"></div>
    </div>
  `).join('');
  bl.innerHTML = months.map(m=>`<div style="flex:1;text-align:center;font-size:10px;color:var(--gray-400);">${m}</div>`).join('');

  // Recent table
  const recent = [...DB].sort((a,b)=>b.tglDaftar.localeCompare(a.tglDaftar)).slice(0,8);
  document.getElementById('recentTableBody').innerHTML = recent.map(d=>`
    <tr>
      <td><span style="font-family:monospace;font-size:11px;">${d.id}</span></td>
      <td><b>${d.nama}</b></td>
      <td>${d.jenisPpksIcon} ${d.jenisPpks}</td>
      <td>${d.wilayah}</td>
      <td>${statusBadge(d.status)}</td>
    </tr>
  `).join('');

  // Activity
  const acts = [
    {icon:'💾',color:'var(--green)',title:'Data baru ditambahkan',desc:'Markus Solossa — Fakir Miskin — Kota Sorong',time:'5 menit lalu'},
    {icon:'✅',color:'var(--teal)',title:'Verifikasi selesai',desc:'3 data PPKS berhasil diverifikasi',time:'22 menit lalu'},
    {icon:'✏️',color:'var(--blue-mid)',title:'Data diperbarui',desc:'Maria Kambu — Penyandang Disabilitas',time:'1 jam lalu'},
    {icon:'📥',color:'var(--amber)',title:'Laporan diunduh',desc:'Laporan Bulanan Oktober 2024',time:'2 jam lalu'},
    {icon:'👤',color:'var(--purple)',title:'Login pengguna',desc:'Admin Bidang Rehabilitasi Sosial',time:'3 jam lalu'},
  ];
  document.getElementById('activityTimeline').innerHTML = acts.map(a=>`
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
  DB.forEach(d=>{typeCount[d.jenisPpks] = (typeCount[d.jenisPpks]||0)+1;});
  document.getElementById('ppksTypeGrid').innerHTML = JENIS_PPKS.map(j=>`
    <div class="ppks-type-card" onclick="filterByJenis('${j.nama}')">
      <div class="ppks-type-icon">${j.icon}</div>
      <div class="ppks-type-name">${j.nama}</div>
      <div class="ppks-type-count">${typeCount[j.nama]||0}</div>
    </div>
  `).join('');
}

function updateNavBadges() {
  document.getElementById('navBadgePpks').textContent = DB.length;
  document.getElementById('navBadgeVerif').textContent = DB.filter(d=>d.status!=='Terverifikasi').length;
}

function filterByJenis(jenis) {
  showPage('data-ppks');
  document.getElementById('filterJenis').value = jenis;
  filterTable();
}

function animCount(id, target) {
  const el = document.getElementById(id); if(!el) return;
  let current = 0;
  const step = Math.ceil(target/40);
  const t = setInterval(()=>{
    current = Math.min(current+step, target);
    el.textContent = current.toLocaleString('id-ID');
    if(current>=target) clearInterval(t);
  },25);
}

// ══════════════════════════════════════════
// MAIN TABLE
// ══════════════════════════════════════════
let currentPage = 1;
const PER_PAGE = 15;
let filteredDB = [];

function renderMainTable() {
  // Populate filter dropdowns
  const selJenis = document.getElementById('filterJenis');
  if(selJenis.options.length <= 1) {
    JENIS_PPKS.forEach(j=>{
      const o = document.createElement('option');
      o.value = j.nama; o.textContent = j.icon+' '+j.nama;
      selJenis.appendChild(o);
    });
  }

  const formSel = document.getElementById('f-jenis-ppks');
  if(formSel && formSel.options.length <= 1) {
    JENIS_PPKS.forEach(j=>{
      const o = document.createElement('option');
      o.value = j.nama; o.textContent = j.icon+' '+j.nama;
      formSel.appendChild(o);
    });
  }

  filterTable();
}

function filterTable() {
  const q = (document.getElementById('searchInput')?.value||'').toLowerCase();
  const fj = document.getElementById('filterJenis')?.value||'';
  const fw = document.getElementById('filterWilayah')?.value||'';
  const fs = document.getElementById('filterStatus')?.value||'';

  filteredDB = DB.filter(d=>{
    const matchQ = !q || d.nama.toLowerCase().includes(q) || d.nik.includes(q) || d.id.toLowerCase().includes(q);
    const matchJ = !fj || d.jenisPpks===fj;
    const matchW = !fw || d.wilayah===fw;
    const matchS = !fs || d.status===fs;
    return matchQ && matchJ && matchW && matchS;
  });

  currentPage = 1;
  renderTablePage();
}

function renderTablePage() {
  const start = (currentPage-1)*PER_PAGE;
  const pageData = filteredDB.slice(start, start+PER_PAGE);
  const tbody = document.getElementById('mainTableBody');
  if(!tbody) return;

  tbody.innerHTML = pageData.length ? pageData.map(d=>`
    <tr>
      <td><span style="font-family:monospace;font-size:11.5px;color:var(--blue-mid);font-weight:600;">${d.id}</span></td>
      <td>
        <div style="font-weight:600;">${d.nama}</div>
        <div style="font-size:11px;color:var(--gray-400);">${d.jk} &bull; ${d.kecamatan}</div>
      </td>
      <td><span style="font-size:13px;">${d.nik}</span></td>
      <td><span style="font-size:13px;">${d.jenisPpksIcon} ${d.jenisPpks}</span></td>
      <td>${d.wilayah}</td>
      <td>${formatDate(d.tglDaftar)}</td>
      <td>${statusBadge(d.status)}</td>
      <td>
        <div style="display:flex;gap:4px;">
          <button class="btn btn-outline btn-sm" onclick="showDetail('${d.id}')">👁 Detail</button>
          <button class="btn btn-sm" style="background:var(--amber-pale);color:var(--amber);" onclick="toast('Edit data ${d.id}','warning')">✏️</button>
          <button class="btn btn-sm" style="background:var(--red-pale);color:var(--red);" onclick="hapusData('${d.id}')">🗑</button>
        </div>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="8"><div class="empty-state"><div class="empty-state-icon">🔍</div><div class="empty-state-title">Data tidak ditemukan</div><div class="empty-state-desc">Coba ubah filter pencarian</div></div></td></tr>';

  const total = filteredDB.length;
  document.getElementById('tableInfo').textContent = `Menampilkan ${Math.min(start+1,total)}–${Math.min(start+PER_PAGE,total)} dari ${total} data`;

  // Pagination
  const totalPages = Math.ceil(total/PER_PAGE);
  const pag = document.getElementById('pagination');
  let html = `<div class="page-btn" onclick="goPage(${Math.max(1,currentPage-1)})">‹</div>`;
  for(let p=1;p<=totalPages;p++) {
    if(p<=2||p>totalPages-2||Math.abs(p-currentPage)<=1) {
      html += `<div class="page-btn ${p===currentPage?'active':''}" onclick="goPage(${p})">${p}</div>`;
    } else if(Math.abs(p-currentPage)===2) {
      html += `<div class="page-btn" style="pointer-events:none;">…</div>`;
    }
  }
  html += `<div class="page-btn" onclick="goPage(${Math.min(totalPages,currentPage+1)})">›</div>`;
  pag.innerHTML = html;
}

function goPage(p) {
  currentPage=p;
  renderTablePage();
}

function statusBadge(s) {
  const map = {'Terverifikasi':'badge-green','Menunggu':'badge-amber','Draft':'badge-gray'};
  const icon = {'Terverifikasi':'✅','Menunggu':'⏳','Draft':'📝'};
  return `<span class="badge ${map[s]||'badge-gray'}">${icon[s]||''} ${s}</span>`;
}

function showDetail(id) {
  const d = DB.find(x=>x.id===id); if(!d) return;
  document.getElementById('modalDetailTitle').textContent = `Detail PPKS — ${d.id}`;
  document.getElementById('modalDetailBody').innerHTML = `
    <div style="display:flex;align-items:center;gap:14px;padding:12px;background:var(--blue-xpale);border-radius:10px;margin-bottom:16px;">
      <div style="width:52px;height:52px;border-radius:50%;background:var(--blue-mid);display:flex;align-items:center;justify-content:center;font-size:22px;color:white;flex-shrink:0;">${d.jk==='Laki-laki'?'👨':'👩'}</div>
      <div>
        <div style="font-size:16px;font-weight:700;">${d.nama}</div>
        <div style="font-size:12px;color:var(--gray-600);">${d.id} &bull; ${d.jk}</div>
        <div style="margin-top:4px;">${statusBadge(d.status)}</div>
      </div>
    </div>
    <div class="detail-kv">
      ${kv('NIK', d.nik)}
      ${kv('Jenis PPKS', d.jenisPpksIcon+' '+d.jenisPpks)}
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
  openModal('modalDetail');
}

function kv(label, value) {
  return `<div class="kv-row"><div class="kv-label">${label}</div><div class="kv-value">${value||'-'}</div></div>`;
}

function hapusData(id) {
  if(!confirm('Hapus data '+id+'?')) return;
  DB = DB.filter(d=>d.id!==id);
  renderDashboard();
  renderMainTable();
  toast('Data '+id+' berhasil dihapus','error');
}

// ══════════════════════════════════════════
// TAMBAH DATA
// ══════════════════════════════════════════
function switchTab(el, tabId) {
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  ['tab-identitas','tab-kondisi','tab-kebutuhan'].forEach(id=>{
    const t = document.getElementById(id);
    if(t) t.style.display = id===tabId?'block':'none';
  });
}

function simpanData() {
  const nama = document.getElementById('f-nama').value.trim();
  const nik = document.getElementById('f-nik').value.trim();
  const jk = document.getElementById('f-jk').value;
  const jenisPpks = document.getElementById('f-jenis-ppks').value;
  const kab = document.getElementById('f-kab').value;

  if(!nama||!nik||!jk||!jenisPpks||!kab) {
    toast('Lengkapi field wajib (*)','error'); return;
  }
  if(nik.length!==16||isNaN(nik)) {
    toast('NIK harus 16 digit angka','error'); return;
  }

  const jenisData = JENIS_PPKS.find(j=>j.nama===jenisPpks)||{icon:'📋'};
  const newId = 'PPKS-PBD-'+String(++idCounter).padStart(4,'0');
  DB.unshift({
    id: newId, nama, nik, jk, jenisPpks, jenisPpksIcon: jenisData.icon,
    wilayah: kab, kecamatan: document.getElementById('f-kec').value||'-',
    status: 'Draft', tglDaftar: new Date().toISOString().slice(0,10),
    kondisiKes: document.getElementById('f-kondisi-kes')?.value||'-',
    pendidikan: document.getElementById('f-pendidikan')?.value||'-',
    kebutuhan: document.getElementById('f-kebutuhan')?.value||'-',
    prioritas: document.getElementById('f-prioritas')?.value||'-',
    bansos: document.getElementById('f-bansos')?.value||'-',
    petugas: document.getElementById('f-petugas').value||'Admin',
    catatan: document.getElementById('f-catatan')?.value||'-',
  });

  resetForm();
  renderDashboard();
  updateNavBadges();
  toast('Data '+newId+' berhasil disimpan!','success');
  setTimeout(()=>showPage('data-ppks'),1000);
}

function resetForm() {
  ['f-nama','f-nik','f-ttl-place','f-ttl','f-kec','f-kel','f-telp','f-petugas','f-alamat',
   'f-pekerjaan','f-penghasilan','f-tanggungan','f-masalah','f-rekomendasi','f-catatan']
  .forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
  ['f-jk','f-status-kawin','f-jenis-ppks','f-kab','f-kondisi-kes','f-pendidikan',
   'f-rumah','f-kebutuhan','f-bansos','f-prioritas','f-sumber']
  .forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
  toast('Form direset','');
}

// ══════════════════════════════════════════
// VERIFIKASI
// ══════════════════════════════════════════
function renderVerifTable() {
  const pending = DB.filter(d=>d.status!=='Terverifikasi');
  const tbody = document.getElementById('verifTableBody');
  tbody.innerHTML = pending.length ? pending.map(d=>`
    <tr>
      <td><span style="font-family:monospace;font-size:11.5px;color:var(--blue-mid);font-weight:600;">${d.id}</span></td>
      <td><b>${d.nama}</b><div style="font-size:11px;color:var(--gray-400);">${d.jk}</div></td>
      <td>${d.jenisPpksIcon} ${d.jenisPpks}</td>
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
  `).join('') : '<tr><td colspan="7"><div class="empty-state"><div class="empty-state-icon">✅</div><div class="empty-state-title">Semua data sudah terverifikasi</div></div></td></tr>';
}

function openVerifModal(id) {
  currentVerifId = id;
  const d = DB.find(x=>x.id===id); if(!d) return;
  document.getElementById('modalVerifBody').innerHTML = `
    <div style="background:var(--amber-pale);border:1.5px solid var(--amber);border-radius:10px;padding:14px;margin-bottom:16px;">
      <b>⚠️ Periksa kelengkapan data sebelum verifikasi</b>
    </div>
    <div class="detail-kv">
      ${kv('ID PPKS', d.id)}
      ${kv('Nama', d.nama)}
      ${kv('NIK', d.nik)}
      ${kv('Jenis PPKS', d.jenisPpksIcon+' '+d.jenisPpks)}
      ${kv('Wilayah', d.wilayah+' / '+d.kecamatan)}
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

function verifikasiData() {
  if(!currentVerifId) return;
  const d = DB.find(x=>x.id===currentVerifId);
  if(d) d.status = 'Terverifikasi';
  closeModal('modalVerif');
  renderVerifTable();
  renderDashboard();
  updateNavBadges();
  toast('Data '+currentVerifId+' berhasil diverifikasi!','success');
}

function quickVerif(id) {
  const d = DB.find(x=>x.id===id);
  if(d) { d.status='Terverifikasi'; renderVerifTable(); renderDashboard(); updateNavBadges(); toast('Data '+id+' terverifikasi!','success'); }
}

function tolakData() {
  if(!currentVerifId) return;
  closeModal('modalVerif');
  toast('Data '+currentVerifId+' ditolak','error');
}

// ══════════════════════════════════════════
// STATISTIK
// ══════════════════════════════════════════
function renderStats() {
  // Per wilayah
  const wCount = {};
  WILAYAH.forEach(w=>wCount[w]=0);
  DB.forEach(d=>wCount[d.wilayah]=(wCount[d.wilayah]||0)+1);
  const maxW = Math.max(...Object.values(wCount));
  document.getElementById('statsWilayah').innerHTML = Object.entries(wCount).map(([w,c])=>`
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
  DB.forEach(d=>jCount[d.jenisPpks]=(jCount[d.jenisPpks]||0)+1);
  const top10 = Object.entries(jCount).sort((a,b)=>b[1]-a[1]).slice(0,10);
  const maxJ = top10[0]?.[1]||1;
  document.getElementById('statsJenis').innerHTML = top10.map(([j,c])=>`
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
      <div style="font-size:11.5px;width:150px;flex-shrink:0;font-weight:500;">${j}</div>
      <div class="progress-bar-outer" style="flex:1;">
        <div class="progress-bar-inner" style="width:${Math.round(c/maxJ*100)}%;background:var(--teal);"></div>
      </div>
      <div style="font-size:12px;font-weight:700;color:var(--teal);width:28px;text-align:right;">${c}</div>
    </div>
  `).join('');

  // Gender
  const laki = DB.filter(d=>d.jk==='Laki-laki').length;
  const perempuan = DB.length - laki;
  const pL = Math.round(laki/DB.length*100);
  const pP = 100-pL;
  document.getElementById('statsGender').innerHTML = `
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
  const umurGroups = {'0-14':0,'15-24':0,'25-44':0,'45-59':0,'60+':0};
  DB.forEach(d=>{
    if(!d.ttl) return;
    const age = new Date().getFullYear() - new Date(d.ttl).getFullYear();
    if(age<15) umurGroups['0-14']++;
    else if(age<25) umurGroups['15-24']++;
    else if(age<45) umurGroups['25-44']++;
    else if(age<60) umurGroups['45-59']++;
    else umurGroups['60+']++;
  });
  const maxU = Math.max(...Object.values(umurGroups));
  document.getElementById('statsUmur').innerHTML = Object.entries(umurGroups).map(([g,c])=>`
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
      <div style="font-size:12px;width:50px;flex-shrink:0;font-weight:600;">${g}</div>
      <div class="progress-bar-outer" style="flex:1;">
        <div class="progress-bar-inner" style="width:${Math.round(c/maxU*100)}%;background:var(--purple);"></div>
      </div>
      <div style="font-size:12px;font-weight:700;color:var(--purple);width:28px;text-align:right;">${c}</div>
    </div>
  `).join('');

  // Prioritas
  const pCount = {'Sangat Mendesak':0,'Mendesak':0,'Sedang':0,'Rendah':0};
  DB.forEach(d=>{ if(pCount[d.prioritas]!==undefined) pCount[d.prioritas]++; });
  const colors = {'Sangat Mendesak':'var(--red)','Mendesak':'var(--amber)','Sedang':'var(--blue-mid)','Rendah':'var(--green)'};
  const maxP = Math.max(...Object.values(pCount));
  document.getElementById('statsPrioritas').innerHTML = Object.entries(pCount).map(([p,c])=>`
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
// SEBARAN
// ══════════════════════════════════════════
function renderSebaran() {
  document.getElementById('regionPills').innerHTML = WILAYAH.map(w=>`
    <div class="region-pill" onclick="this.classList.toggle('active')">${w}</div>
  `).join('');

  const wStats = WILAYAH.map(w=>{
    const total = DB.filter(d=>d.wilayah===w).length;
    const verif = DB.filter(d=>d.wilayah===w&&d.status==='Terverifikasi').length;
    const pending = DB.filter(d=>d.wilayah===w&&d.status==='Menunggu').length;
    const draft = DB.filter(d=>d.wilayah===w&&d.status==='Draft').length;
    const pct = total ? Math.round(verif/total*100) : 0;
    return {w, total, verif, pending, draft, pct};
  });

  document.getElementById('wilayahTableBody').innerHTML = wStats.map((s,i)=>`
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

// ══════════════════════════════════════════
// USERS
// ══════════════════════════════════════════
const USERS = [
  {nama:'Admin Dinas',username:'admin_dinas',email:'admin@dinsos-pbd.go.id',role:'Administrator',wilayah:'Semua Wilayah',status:'Aktif'},
  {nama:'Petrus Kambu',username:'ptrs_kbr',email:'petrus@dinsos-pbd.go.id',role:'Operator Pendataan',wilayah:'Kota Sorong',status:'Aktif'},
  {nama:'Maria Solossa',username:'maria_sls',email:'maria@dinsos-pbd.go.id',role:'Verifikator',wilayah:'Kab. Sorong',status:'Aktif'},
  {nama:'Yohanes Wanma',username:'yhn_wanma',email:'yohanes@dinsos-pbd.go.id',role:'Operator Pendataan',wilayah:'Kab. Raja Ampat',status:'Aktif'},
  {nama:'Anastasia Imbiri',username:'ana_imbiri',email:'anastasia@dinsos-pbd.go.id',role:'Verifikator',wilayah:'Kab. Tambrauw',status:'Nonaktif'},
  {nama:'Felix Mandowen',username:'flx_mndw',email:'felix@dinsos-pbd.go.id',role:'Operator Pendataan',wilayah:'Kab. Maybrat',status:'Aktif'},
];
const ROLE_COLORS = {'Administrator':'badge-purple','Verifikator':'badge-blue','Operator Pendataan':'badge-teal'};

function renderUsers() {
  document.getElementById('userTableBody').innerHTML = USERS.map(u=>`
    <tr>
      <td><b>${u.nama}</b></td>
      <td><span style="font-family:monospace;font-size:12px;">${u.username}</span></td>
      <td style="font-size:12px;">${u.email}</td>
      <td><span class="badge ${ROLE_COLORS[u.role]||'badge-gray'}">${u.role}</span></td>
      <td style="font-size:12px;">${u.wilayah}</td>
      <td><span class="badge ${u.status==='Aktif'?'badge-green':'badge-red'}">${u.status}</span></td>
      <td>
        <div style="display:flex;gap:4px;">
          <button class="btn btn-outline btn-sm" onclick="toast('Edit pengguna ${u.username}','warning')">✏️</button>
          <button class="btn btn-sm" style="background:var(--red-pale);color:var(--red);" onclick="toast('Reset password ${u.username}','')">🔑</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ══════════════════════════════════════════
// SOP
// ══════════════════════════════════════════
const SOPS = [
  {no:'SOP-01',judul:'Penginputan Data PPKS',icon:'📥',steps:['Login ke sistem SIPPKS','Klik menu Tambah Data','Isi form identitas PPKS (tab Identitas)','Isi kondisi sosial (tab Kondisi Sosial)','Isi kebutuhan & program (tab Kebutuhan)','Klik tombol Simpan Data PPKS','Cetak bukti pendaftaran'],regulasi:'Permensos No. 3/2021'},
  {no:'SOP-02',judul:'Verifikasi & Validasi Data',icon:'✅',steps:['Login sebagai Verifikator','Klik menu Verifikasi & Validasi','Pilih data yang akan diverifikasi','Klik tombol Periksa','Cocokkan data dengan dokumen fisik','Isi catatan verifikasi','Klik Verifikasi atau Tolak'],regulasi:'Permensos No. 3/2021'},
  {no:'SOP-03',judul:'Pemutakhiran Data Berkala',icon:'🔄',steps:['Login sebagai Operator/Admin','Buka Data PPKS yang akan diperbarui','Klik tombol Edit','Perbarui data sesuai kondisi terkini','Unggah dokumen pendukung jika ada','Simpan perubahan','Catat di logbook pemutakhiran'],regulasi:'Perpres No. 95/2018'},
  {no:'SOP-04',judul:'Keamanan & Perlindungan Data',icon:'🔐',steps:['Gunakan password minimal 8 karakter','Jangan berbagi akun dengan orang lain','Logout setelah selesai menggunakan sistem','Laporkan aktivitas mencurigakan ke admin','Data PPKS bersifat RAHASIA','Dilarang mengambil screenshot/foto layar','Akses hanya dari perangkat resmi dinas'],regulasi:'UU No. 27/2022'},
];

function renderSOP() {
  document.getElementById('sopGrid').innerHTML = SOPS.map(s=>`
    <div class="card">
      <div class="card-header">
        <div class="card-title">${s.icon} ${s.no} — ${s.judul}</div>
        <span class="badge badge-blue">${s.regulasi}</span>
      </div>
      <div class="card-body">
        <div class="timeline">${s.steps.map((st,i)=>`
          <div class="timeline-item">
            <div class="timeline-dot" style="background:var(--blue-pale);color:var(--blue-mid);font-weight:700;font-size:12px;">${i+1}</div>
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
  document.getElementById('laporanHistory').innerHTML = hist.map(h=>`
    <div class="timeline-item">
      <div class="timeline-dot" style="background:var(--blue-pale);font-size:18px;">${h.icon}</div>
      <div class="timeline-content">
        <div class="timeline-title">${h.title}</div>
        <div class="timeline-time">⏰ ${h.time} &bull; 📦 ${h.size}</div>
      </div>
      <button class="btn btn-outline btn-sm" onclick="toast('Mengunduh laporan...','warning')">⬇</button>
    </div>
  `).join('');

  const now = new Date().toISOString().slice(0,7);
  document.getElementById('lapBulanAwal').value = now;
  document.getElementById('lapBulanAkhir').value = now;
}

// ══════════════════════════════════════════
// EXPORT (demo)
// ══════════════════════════════════════════
function exportData() {
  toast('Menyiapkan ekspor data...','warning');
  setTimeout(()=>toast('Data berhasil diekspor!','success'), 2000);
}

// ══════════════════════════════════════════
// INIT
// ══════════════════════════════════════════
generateDB();
renderDashboard();

// populate form select on load
const formSel = document.getElementById('f-jenis-ppks');
if(formSel) {
  JENIS_PPKS.forEach(j=>{
    const o = document.createElement('option');
    o.value=j.nama; o.textContent=j.icon+' '+j.nama;
    formSel.appendChild(o);
  });
}

// Close modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(m=>{
  m.addEventListener('click', e=>{ if(e.target===m) m.classList.remove('open'); });
});