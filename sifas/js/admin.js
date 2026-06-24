/* =============================================
   ADMIN.JS — Admin Panel & Status Management
   SiFas / Campus Fix
   ============================================= */

let currentEditId = null;

function renderKelolaTable(data) {
  const container = document.getElementById("kelolaTable");
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = `
      <div class="card">
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <div class="empty-state-title">Tidak ada laporan ditemukan</div>
          <div class="empty-state-sub">Coba ubah filter pencarian Anda</div>
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
              <th>Pelapor</th>
              <th>Gedung</th>
              <th>Kategori</th>
              <th>Prioritas</th>
              <th>Status</th>
              <th>Teknisi</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (l) => `
              <tr>
                <td><span class="ticket-id">${l.id}</span></td>
                <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${l.judul}</td>
                <td style="font-size:12.5px">${l.pelapor}</td>
                <td style="font-size:12px;color:var(--clr-text-3)">${l.gedung.split("–")[0].trim()}</td>
                <td style="font-size:12px">${l.kategori}</td>
                <td>${getPrioritasBadge(l.prioritas)}</td>
                <td>${getBadge(l.status)}</td>
                <td style="font-size:12.5px;color:var(--clr-text-2)">${l.teknisi || '<span style="color:var(--clr-text-3)">—</span>'}</td>
                <td style="color:var(--clr-text-3);font-size:12px">${formatDate(l.tanggal)}</td>
                <td>
                  <div style="display:flex;gap:.4rem">
                    <button class="btn btn-sm btn-outline" onclick="viewDetail('${l.id}')">Detail</button>
                    <button class="btn btn-sm btn-accent" onclick="openUpdateModal('${l.id}')">Update</button>
                  </div>
                </td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>`;
}

function filterAdmin() {
  const search = document.getElementById("adminSearch").value.toLowerCase();
  const status = document.getElementById("adminFilterStatus").value;
  const prioritas = document.getElementById("adminFilterPrioritas").value;

  const filtered = LAPORAN_DATA.filter((l) => {
    const matchSearch =
      !search ||
      l.judul.toLowerCase().includes(search) ||
      l.id.toLowerCase().includes(search) ||
      l.pelapor.toLowerCase().includes(search);
    const matchStatus = !status || l.status === status;
    const matchPrioritas = !prioritas || l.prioritas === prioritas;
    return matchSearch && matchStatus && matchPrioritas;
  });

  renderKelolaTable(filtered);
}

function openUpdateModal(id) {
  const l = LAPORAN_DATA.find((x) => x.id === id);
  if (!l) return;

  currentEditId = id;
  document.getElementById("modalTicketId").value = l.id;
  document.getElementById("modalStatus").value = l.status;
  document.getElementById("modalTeknisi").value = l.teknisi || "";
  document.getElementById("modalCatatan").value = l.catatan || "";

  document.getElementById("modalOverlay").classList.remove("hidden");
  document.getElementById("modalOverlay").style.display = "flex";
}

function closeModal(event) {
  if (event && event.target !== document.getElementById("modalOverlay")) return;
  document.getElementById("modalOverlay").classList.add("hidden");
  document.getElementById("modalOverlay").style.display = "";
  currentEditId = null;
}

function simpanStatus() {
  if (!currentEditId) return;

  const idx = LAPORAN_DATA.findIndex((x) => x.id === currentEditId);
  if (idx === -1) return;

  const newStatus = document.getElementById("modalStatus").value;
  const newTeknisi = document.getElementById("modalTeknisi").value;
  const catatan = document.getElementById("modalCatatan").value;

  const now = new Date();
  const dateLabel = now.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const l = LAPORAN_DATA[idx];
  l.status = newStatus;
  l.teknisi = newTeknisi || null;
  if (catatan) l.catatan = catatan;
  if (catatan) {
    l.tanggapanAdmin = catatan;
  }

  // Update timeline
  const timelineMap = {
    "Menunggu Verifikasi": 0,
    Diproses: 2,
    Selesai: 3,
    Ditolak: 1,
  };

  if (
    (newStatus === "Diproses" || newStatus === "Selesai") &&
    l.timeline.length >= 2
  ) {
    if (l.timeline[1].status !== "done") {
      l.timeline[1] = {
        label: "Verifikasi Laporan",
        tanggal: dateLabel,
        note: "Laporan telah diverifikasi oleh admin.",
        status: "done",
      };
    }
    if (l.timeline.length >= 3 && l.timeline[2].status !== "done") {
      l.timeline[2] = {
        label: "Penugasan Teknisi",
        tanggal: dateLabel,
        note: newTeknisi
          ? `${newTeknisi} ditugaskan untuk menangani laporan ini.`
          : "Sedang mencari teknisi yang tersedia.",
        status: "active",
      };
    }
  } else if (newStatus === "Selesai") {
    l.timeline = l.timeline.map((item, i) => ({
      ...item,
      status: "done",
      tanggal: item.tanggal === "—" ? dateLabel : item.tanggal,
      note:
        item.note ||
        (i === 3
          ? catatan || "Perbaikan telah selesai dilaksanakan."
          : item.note),
    }));
  } else if (newStatus === "Ditolak") {
    if (l.timeline[1].status !== "done") {
      l.timeline[1] = {
        label: "Verifikasi Laporan",
        tanggal: dateLabel,
        note: "Laporan diperiksa oleh admin.",
        status: "done",
      };
    }
    l.timeline[2] = {
      label: "Laporan Ditolak",
      tanggal: dateLabel,
      note: catatan || "Laporan ditolak oleh admin.",
      status: "done",
    };
    if (l.timeline[3]) l.timeline.splice(3, 1);
  }

  // Close modal
  document.getElementById("modalOverlay").classList.add("hidden");
  document.getElementById("modalOverlay").style.display = "";
  currentEditId = null;

  // Refresh tables and dashboard
  renderKelolaTable(LAPORAN_DATA);
  renderDashboard();

  // Show toast-like feedback
  showAdminToast(`Status laporan ${l.id} diperbarui menjadi "${newStatus}"`);
}

function showAdminToast(msg) {
  const existing = document.getElementById("adminToast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "adminToast";
  toast.style.cssText = `
    position:fixed;bottom:2rem;right:2rem;
    background:var(--clr-primary);color:#fff;
    padding:.85rem 1.25rem;border-radius:var(--radius);
    font-size:14px;font-weight:500;z-index:2000;
    box-shadow:var(--shadow-lg);
    animation:slideUp .3s ease;
  `;
  toast.textContent = "✅ " + msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function renderVerifikasiTable() {
  const data = LAPORAN_DATA.filter((l) => l.status === "Menunggu Verifikasi");

  const container = document.getElementById("verifikasiTable");

  if (!container) return;

  if (data.length === 0) {
    container.innerHTML = `
      <div class="card">
        <div class="empty-state">
          <div class="empty-state-icon">✅</div>
          <div class="empty-state-title">
            Tidak ada laporan yang perlu diverifikasi
          </div>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="card">
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Judul</th>
              <th>Pelapor</th>
              <th>Kategori</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            ${data
              .map(
                (l) => `
              <tr>
                <td>${l.id}</td>
                <td>${l.judul}</td>
                <td>${l.pelapor}</td>
                <td>${l.kategori}</td>
                <td>${formatDate(l.tanggal)}</td>

                <td>
                  <button
                    class="btn btn-sm btn-success"
                    onclick="verifikasiLaporan('${l.id}')">
                    Terima
                  </button>

                  <button
                    class="btn btn-sm btn-danger"
                    onclick="tolakLaporan('${l.id}')">
                    Tolak
                  </button>
                </td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function verifikasiLaporan(id) {
  const laporan = LAPORAN_DATA.find((l) => l.id === id);

  if (!laporan) return;

  laporan.status = "Diproses";

  showAdminToast(`Laporan ${id} berhasil diverifikasi`);

  renderVerifikasiTable();
  renderDashboard();
}

function tolakLaporan(id) {
  const laporan = LAPORAN_DATA.find((l) => l.id === id);

  if (!laporan) return;

  laporan.status = "Ditolak";

  showAdminToast(`Laporan ${id} ditolak`);

  renderVerifikasiTable();
  renderDashboard();
}