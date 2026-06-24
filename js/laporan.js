/* =============================================
   LAPORAN.JS — Report List, Detail, Form Wizard
   SiFas / Campus Fix
   ============================================= */

// ---- RIWAYAT LAPORAN ----

function renderLaporanTable(data) {
  const container = document.getElementById('laporanTable');
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = `
      <div class="card">
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <div class="empty-state-title">Belum ada laporan</div>
          <div class="empty-state-sub">Laporan yang Anda buat akan muncul di sini</div>
        </div>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="card">
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Judul</th>
              <th>Kategori</th>
              <th>Gedung</th>
              <th>Prioritas</th>
              <th>Status</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(l => `
              <tr>
                <td><span class="ticket-id">${l.id}</span></td>
                <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${l.judul}</td>
                <td>${l.kategori}</td>
                <td style="font-size:12px;color:var(--clr-text-3)">${l.gedung.split('–')[0].trim()}</td>
                <td>${getPrioritasBadge(l.prioritas)}</td>
                <td>${getBadge(l.status)}</td>
                <td style="color:var(--clr-text-3);font-size:12.5px">${formatDate(l.tanggal)}</td>
                <td>
                  <button class="btn btn-sm btn-outline" onclick="viewDetail('${l.id}')">Detail</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

function filterLaporan() {
  const search   = document.getElementById('filterSearch').value.toLowerCase();
  const status   = document.getElementById('filterStatus').value;
  const kategori = document.getElementById('filterKat').value;

  const filtered = LAPORAN_DATA.filter(l => {
    const matchSearch = !search || l.judul.toLowerCase().includes(search) || l.id.toLowerCase().includes(search);
    const matchStatus = !status || l.status === status;
    const matchKat    = !kategori || l.kategori === kategori;
    return matchSearch && matchStatus && matchKat;
  });

  renderLaporanTable(filtered);
}

// ---- DETAIL VIEW ----

function viewDetail(id) {
  const l = LAPORAN_DATA.find(x => x.id === id);
  if (!l) return;

  const container = document.getElementById('detailContent');
  container.innerHTML = `
    <div class="detail-grid">
      <div>
        <div class="card mb-4">
          <div class="detail-header">
            <div>
              <div class="detail-tid">${l.id}</div>
              <div class="detail-judul">${l.judul}</div>
              <div class="detail-meta">
                <span>📍 ${l.gedung}</span>
                <span>🚪 ${l.ruangan}</span>
                <span>📅 ${formatDate(l.tanggal)}</span>
              </div>
              <div style="display:flex;gap:.5rem;flex-wrap:wrap">
                ${getBadge(l.status)}
                ${getPrioritasBadge(l.prioritas)}
                <span class="badge" style="background:var(--clr-bg);color:var(--clr-text-2)">${l.kategori}</span>
              </div>
            </div>
          </div>
          <hr style="border:none;border-top:1px solid var(--clr-border);margin:1rem 0"/>
          <h4 style="font-size:13px;font-weight:600;color:var(--clr-text-3);margin-bottom:.75rem">DESKRIPSI KERUSAKAN</h4>
          <div class="detail-deskripsi">${l.deskripsi}</div>
          ${l.catatan ? `
            <div style="margin-top:1rem;padding:.85rem 1rem;background:var(--clr-danger-lt);border-radius:var(--radius);border:1px solid #fca5a5">
              <span style="font-weight:600;color:var(--clr-danger);font-size:13px">⚠️ Catatan Admin:</span>
              <p style="margin-top:.35rem;font-size:13px;color:var(--clr-danger)">${l.catatan}</p>
            </div>` : ''}
        </div>
        <div class="card">
          <div class="card-head"><h3 class="card-title">Informasi Penanganan</h3></div>
          <div class="profil-info">
            <div class="profil-info-row"><span class="profil-info-key">Pelapor</span><span class="profil-info-val">${l.pelapor}</span></div>
            <div class="profil-info-row"><span class="profil-info-key">NIM</span><span class="profil-info-val" style="font-family:var(--font-mono)">${l.nim}</span></div>
            <div class="profil-info-row"><span class="profil-info-key">Teknisi</span><span class="profil-info-val">${l.teknisi || '—'}</span></div>
            <div class="profil-info-row"><span class="profil-info-key">Tanggal Lapor</span><span class="profil-info-val">${formatDate(l.tanggal)}</span></div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><h3 class="card-title">Progres Penanganan</h3></div>
        <div class="timeline">
          ${l.timeline.map((item, idx, arr) => `
            <div class="timeline-item" style="position:relative">
              ${idx < arr.length - 1 ? '<div class="timeline-line"></div>' : ''}
              <div class="timeline-dot ${item.status}"></div>
              <div class="timeline-content">
                <div class="timeline-label">${item.label}</div>
                <div class="timeline-date">${item.tanggal}</div>
                ${item.note ? `<div class="timeline-note">${item.note}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>`;

  navigateTo('detail');
}

// ---- BUAT LAPORAN WIZARD ----

let currentStep = 1;

function buatNext(step) {
  if (step === 1) {
    if (!document.getElementById('f_gedung').value ||
        !document.getElementById('f_ruangan').value.trim() ||
        !document.getElementById('f_kategori').value ||
        !document.getElementById('f_prioritas').value) {
      alert('Mohon lengkapi semua field yang wajib diisi (*)');
      return;
    }
  } else if (step === 2) {
    if (!document.getElementById('f_judul').value.trim() ||
        !document.getElementById('f_deskripsi').value.trim()) {
      alert('Mohon isi judul dan deskripsi pengaduan.');
      return;
    }
    // Show confirm data
    renderConfirm();
  }

  document.getElementById(`buat-step-${step}`).classList.remove('active');
  document.getElementById(`buat-step-${step}`).classList.add('hidden');
  document.getElementById(`buat-step-${step + 1}`).classList.remove('hidden');
  document.getElementById(`buat-step-${step + 1}`).classList.add('active');

  document.querySelectorAll('.step').forEach(s => {
    s.classList.remove('active');
    if (parseInt(s.dataset.step) < step + 1) s.classList.add('done');
  });
  const nextStep = document.querySelector(`.step[data-step="${step + 1}"]`);
  if (nextStep) nextStep.classList.add('active');

  currentStep = step + 1;
}

function buatPrev(step) {
  document.getElementById(`buat-step-${step}`).classList.remove('active');
  document.getElementById(`buat-step-${step}`).classList.add('hidden');
  document.getElementById(`buat-step-${step - 1}`).classList.remove('hidden');
  document.getElementById(`buat-step-${step - 1}`).classList.add('active');

  document.querySelectorAll('.step').forEach(s => s.classList.remove('active', 'done'));
  document.querySelector(`.step[data-step="${step - 1}"]`).classList.add('active');

  currentStep = step - 1;
}

function renderConfirm() {
  const prioritasLabels = { rendah: '🟢 Rendah', sedang: '🟡 Sedang', tinggi: '🔴 Tinggi', darurat: '🚨 Darurat' };
  const data = {
    'Gedung / Lokasi':     document.getElementById('f_gedung').value,
    'Ruangan / Lantai':    document.getElementById('f_ruangan').value,
    'Kategori':            document.getElementById('f_kategori').value,
    'Prioritas':           prioritasLabels[document.getElementById('f_prioritas').value],
    'Judul Pengaduan':     document.getElementById('f_judul').value,
    'Deskripsi':           document.getElementById('f_deskripsi').value.substring(0, 80) + '...'
  };

  document.getElementById('confirmData').innerHTML = Object.entries(data).map(([k, v]) => `
    <div class="confirm-row">
      <span class="confirm-key">${k}</span>
      <span class="confirm-val">${v}</span>
    </div>
  `).join('');
}

function handleFotoUpload(event) {
  const files = event.target.files;
  const preview = document.getElementById('fotoPreview');
  preview.innerHTML = '';
  Array.from(files).forEach(file => {
    const url = URL.createObjectURL(file);
    preview.innerHTML += `
      <div class="foto-preview-item">
        <img src="${url}" alt="Foto"/>
      </div>`;
  });
}

function submitLaporan() {
  const errorEl = document.getElementById('buat-error');
  if (!document.getElementById('f_setuju').checked) {
    errorEl.classList.remove('hidden');
    return;
  }
  errorEl.classList.add('hidden');

  const ticketId = generateTicketId();
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  const newLaporan = {
    id: ticketId,
    judul:     document.getElementById('f_judul').value,
    gedung:    document.getElementById('f_gedung').value,
    ruangan:   document.getElementById('f_ruangan').value,
    kategori:  document.getElementById('f_kategori').value,
    prioritas: document.getElementById('f_prioritas').value,
    deskripsi: document.getElementById('f_deskripsi').value,
    status:    'Menunggu',
    pelapor:   currentUser.nama,
    nim:       currentUser.nim || currentUser.nip || '—',
    tanggal:   dateStr,
    teknisi:   null,
    timeline: [
      {
        label: 'Laporan Diterima',
        tanggal: now.toLocaleString('id-ID', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }),
        note: 'Laporan berhasil dikirim dan sedang menunggu verifikasi.',
        status: 'active'
      },
      { label: 'Verifikasi Laporan', tanggal: '—', note: '', status: 'pending' },
      { label: 'Penugasan Teknisi',  tanggal: '—', note: '', status: 'pending' },
      { label: 'Selesai Diperbaiki', tanggal: '—', note: '', status: 'pending' }
    ]
  };

  LAPORAN_DATA.unshift(newLaporan);

  // Show toast
  const toast = document.getElementById('successToast');
  document.getElementById('toastTicket').textContent = `Nomor Tiket: ${ticketId}`;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 5000);

  // Reset form
  resetBuatForm();

  // Refresh dashboard
  renderDashboard();

  // Navigate to riwayat
  setTimeout(() => navigateTo('laporan'), 1500);
}

function resetBuatForm() {
  ['f_gedung', 'f_ruangan', 'f_kategori', 'f_prioritas', 'f_judul', 'f_deskripsi'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('f_setuju').checked = false;
  document.getElementById('fotoPreview').innerHTML = '';
  document.getElementById('buat-error').classList.add('hidden');

  // Reset to step 1
  document.querySelectorAll('.buat-step').forEach(s => { s.classList.remove('active'); s.classList.add('hidden'); });
  document.getElementById('buat-step-1').classList.remove('hidden');
  document.getElementById('buat-step-1').classList.add('active');
  document.querySelectorAll('.step').forEach(s => { s.classList.remove('active', 'done'); });
  document.querySelector('.step[data-step="1"]').classList.add('active');
  currentStep = 1;
}