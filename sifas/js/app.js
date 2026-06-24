/* =============================================
   APP.JS — Main App Init & Navigation
   SiFas / Campus Fix
   ============================================= */

// ---- NAVIGATION MENUS ----
const NAV_MAHASISWA = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'buat',      icon: '✏️',  label: 'Buat Pengaduan' },
  { id: 'laporan',   icon: '📋', label: 'Riwayat Pengaduan' },
  { id: 'profil',    icon: '👤', label: 'Profil Saya' }
];

const NAV_ADMIN = [
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "verifikasi", icon: "📥", label: "Verifikasi Laporan" },
  { id: "kelola", icon: "🛠️", label: "Kelola Laporan" },
  { id: "profil", icon: "👤", label: "Profil" },
];

const VIEW_TITLES = {
  dashboard: "Dashboard",
  buat: "Buat Pengaduan",
  laporan: "Riwayat Pengaduan",
  detail: "Detail Laporan",
  verifikasi: "Verifikasi Laporan",
  kelola: "Kelola Laporan",
  profil: "Profil Akun",
};

let currentView = 'dashboard';

// ---- INIT APP ----
function initApp() {
  // Show app page
  document.getElementById('page-login').classList.add('hidden');
  document.getElementById('page-login').classList.remove('active');
  document.getElementById('page-app').classList.remove('hidden');
  document.getElementById('page-app').classList.add('active');

  // Build sidebar nav
  const navItems = currentUser.role === 'admin' ? NAV_ADMIN : NAV_MAHASISWA;
  const navEl = document.getElementById('sidebarNav');

  navEl.innerHTML = `
    <div class="nav-section-label">MENU UTAMA</div>
    ${navItems.map(item => `
      <button class="nav-item ${item.id === 'dashboard' ? 'active' : ''}"
              data-view="${item.id}"
              onclick="navigateTo('${item.id}')">
        <span class="nav-icon">${item.icon}</span>
        ${item.label}
      </button>
    `).join('')}
  `;

  // Sidebar user info
  const initials = currentUser.nama.split(' ').slice(0, 2).map(n => n[0]).join('');
  document.getElementById('sidebarUser').innerHTML = `
    <div class="sidebar-user-avatar">${initials}</div>
    <div class="sidebar-user-info">
      <span class="sidebar-user-name">${currentUser.nama.split(' ')[0]}</span>
      <span class="sidebar-user-id">${currentUser.nim || currentUser.nip || ''}</span>
    </div>`;

  // Topbar avatar
  document.getElementById('topbarAvatar').textContent = initials;

  // Load dashboard
  navigateTo('dashboard');
}

// ---- NAVIGATION ----
function navigateTo(viewId) {
  // Hide all views
  document.querySelectorAll('.view').forEach(v => {
    v.classList.remove('active');
    v.classList.add('hidden');
  });

  // Show target view
  const target = document.getElementById(`view-${viewId}`);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('active');
  }

  // Update topbar title
  document.getElementById('topbarTitle').textContent = VIEW_TITLES[viewId] || '';

  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.view === viewId);
  });

  currentView = viewId;

  // Load view-specific content
  switch (viewId) {
    case "dashboard":
      renderDashboard();
      break;
    case "laporan":
      renderLaporanTable(LAPORAN_DATA);
      break;
    case "kelola":
      renderKelolaTable(LAPORAN_DATA);
      break;
    case "profil":
      renderProfil();
      break;
    case "verifikasi":
      renderVerifikasiTable();
      break;
  }

  // Close sidebar on mobile
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('open');
  }

  // Scroll to top
  document.querySelector('.main-content').scrollTop = 0;
  window.scrollTo(0, 0);
}

function renderDashboard() {
  const total = LAPORAN_DATA.length;
  const menunggu = LAPORAN_DATA.filter(
    (l) => l.status === "Menunggu Verifikasi",
  ).length;
  const diproses = LAPORAN_DATA.filter((l) => l.status === "Diproses").length;
  const selesai = LAPORAN_DATA.filter((l) => l.status === "Selesai").length;
  const persenSelesai = total > 0 ? Math.round((selesai / total) * 100) : 0;

  // Welcome message
  const welcomeEl = document.getElementById("dashWelcome");
  if (welcomeEl) {
    const hour = new Date().getHours();
    const greet =
      hour < 11
        ? "Selamat pagi"
        : hour < 15
          ? "Selamat siang"
          : hour < 18
            ? "Selamat sore"
            : "Selamat malam";
    welcomeEl.textContent = `${greet}, ${currentUser.nama.split(" ")[0]}! Berikut ringkasan pengaduan hari ini.`;
  }

  // Stat cards
  const statGrid = document.getElementById("statGrid");
  if (statGrid) {
    const stats =
      currentUser.role === "admin"
        ? [
            {
              icon: "📋",
              label: "Total Laporan",
              num: total,
              change: "+3 minggu ini",
              up: true,
              color: "#EEF2FF",
              iconBg: "#818CF8",
            },
            {
              icon: "⏳",
              label: 'Menunggu Verifikasi',
              num: menunggu,
              change: "Perlu ditangani",
              up: false,
              color: "#FEF3C7",
              iconBg: "#FBBF24",
            },
            {
              icon: "🔧",
              label: "Sedang Diproses",
              num: diproses,
              change: "Dalam penanganan",
              up: true,
              color: "#CFFAFE",
              iconBg: "#22D3EE",
            },
            {
              icon: "✅",
              label: "Selesai Diperbaiki",
              num: selesai,
              change: `${persenSelesai}% selesai`,
              up: true,
              color: "#DCFCE7",
              iconBg: "#4ADE80",
            },
          ]
        : [
            {
              icon: "📋",
              label: "Total Pengaduan Saya",
              num: total,
              change: "Semua laporan",
              up: true,
              color: "#EEF2FF",
              iconBg: "#818CF8",
            },
            {
              icon: "⏳",
              label: 'Menunggu Verifikasi',
              num: menunggu,
              change: "Belum diproses",
              up: false,
              color: "#FEF3C7",
              iconBg: "#FBBF24",
            },
            {
              icon: "🔧",
              label: "Diproses",
              num: diproses,
              change: "Dalam penanganan",
              up: true,
              color: "#CFFAFE",
              iconBg: "#22D3EE",
            },
            {
              icon: "✅",
              label: "Selesai",
              num: selesai,
              change: `${persenSelesai}% selesai`,
              up: true,
              color: "#DCFCE7",
              iconBg: "#4ADE80",
            },
          ];

    statGrid.innerHTML = stats
      .map(
        (s) => `
      <div class="stat-card">
        <div class="stat-icon" style="background:${s.color}">
          <span style="font-size:1.4rem">${s.icon}</span>
        </div>
        <div class="stat-info">
          <div class="stat-num">${s.num}</div>
          <div class="stat-label">${s.label}</div>
          <div class="stat-change ${s.up ? "stat-up" : "stat-down"}">${s.change}</div>
        </div>
      </div>`,
      )
      .join("");
  }

  // Recent reports
  const recentEl = document.getElementById("recentReports");
  if (recentEl) {
    const recent = LAPORAN_DATA.slice(0, 5);
    recentEl.innerHTML = `
      <div class="table-wrap">
        <table class="data-table recent-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Judul</th>
              <th>Status</th>
              <th>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            ${recent
              .map(
                (l) => `
              <tr style="cursor:pointer" onclick="viewDetail('${l.id}')">
                <td><span class="ticket-id">${l.id}</span></td>
                <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${l.judul}</td>
                <td>${getBadge(l.status)}</td>
                <td style="color:var(--clr-text-3);font-size:12px">${formatDate(l.tanggal)}</td>
              </tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </div>`;
  }

  // Charts
  setTimeout(renderCharts, 50);
}

// ---- PROFIL ----
function renderProfil() {
  const u = currentUser;
  const initials = u.nama.split(' ').slice(0, 2).map(n => n[0]).join('');

  const avatarEl = document.getElementById('profilAvatar');
  const nameEl   = document.getElementById('profilName');
  const roleEl   = document.getElementById('profilRole');
  const infoEl   = document.getElementById('profilInfo');

  if (avatarEl) avatarEl.textContent = initials;
  if (nameEl)   nameEl.textContent   = u.nama;
  if (roleEl)   roleEl.textContent   = u.role === 'admin' ? (u.jabatan || 'Administrator') : `Mahasiswa ${u.jurusan || ''}`;

  if (infoEl) {
    const rows = u.role === 'admin'
      ? [
          ['NIP', u.nip],
          ['Jabatan', u.jabatan],
          ['Email', u.email],
          ['Telepon', u.telp]
        ]
      : [
          ['NIM', u.nim],
          ['Jurusan', u.jurusan],
          ['Angkatan', u.angkatan],
          ['Email', u.email],
          ['Telepon', u.telp]
        ];

    infoEl.innerHTML = rows.map(([k, v]) => `
      <div class="profil-info-row">
        <span class="profil-info-key">${k}</span>
        <span class="profil-info-val">${v || '—'}</span>
      </div>`).join('');
  }
}

// ---- SIDEBAR TOGGLE ----
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ---- NOTIFICATION TOGGLE ----
function toggleNotif() {
  const dd = document.getElementById('notifDropdown');
  dd.classList.toggle('hidden');
  if (!dd.classList.contains('hidden')) {
    document.getElementById('notifBadge').style.display = 'none';
  }
}

// Close notif dropdown when clicking outside
document.addEventListener('click', (e) => {
  const wrap = document.querySelector('.notif-wrap');
  const dd   = document.getElementById('notifDropdown');
  if (wrap && dd && !wrap.contains(e.target)) {
    dd.classList.add('hidden');
  }
});

// Redraw charts on resize
window.addEventListener('resize', () => {
  if (currentView === 'dashboard') {
    renderCharts();
  }
});