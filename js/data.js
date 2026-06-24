/* =============================================
   DATA.JS — Users & Sample Report Data
   SiFas / Campus Fix
   ============================================= */

const USERS = [
  {
    id: 'mahasiswa',
    password: 'mhs123',
    role: 'mahasiswa',
    nama: 'Ahmad Fauzi',
    nim: '2021001234',
    jurusan: 'Teknik Informatika',
    angkatan: '2021',
    email: 'ahmad.fauzi@student.univ.ac.id',
    telp: '081234567890'
  },
  {
    id: 'admin',
    password: 'adm123',
    role: 'admin',
    nama: 'Dr. Siti Aminah, M.T.',
    nip: '197806152005012003',
    jabatan: 'Kepala Bagian Sarana & Prasarana',
    email: 'siti.aminah@univ.ac.id',
    telp: '081298765432'
  }
];

const STATUS_LIST = ["Menunggu Verifikasi", "Diproses", "Selesai", "Ditolak"];
const PRIORITAS_LIST = ['rendah', 'sedang', 'tinggi', 'darurat'];

let LAPORAN_DATA = [
  {
    id: 'TKT-2024-101',
    judul: 'AC ruang kelas B-305 tidak berfungsi',
    gedung: 'Gedung B – Fakultas Teknik',
    ruangan: 'Ruang B-305, Lantai 3',
    kategori: '❄️ AC & Ventilasi',
    prioritas: 'tinggi',
    deskripsi: 'AC di ruang B-305 sudah tidak berfungsi selama 3 hari terakhir. Kondisi ruangan sangat panas dan mengganggu konsentrasi saat perkuliahan berlangsung. Suhu ruangan mencapai 35°C pada siang hari. Terdapat 40 mahasiswa yang menggunakan ruang ini setiap harinya.',
    status: 'Diproses',
    tanggapanAdmin: 'Laporan telah diverifikasi dan sedang ditangani teknisi.',
    pelapor: 'Ahmad Fauzi',
    nim: '2021001234',
    tanggal: '2024-12-08',
    teknisi: 'Budi Santoso',
    timeline: [
      { label: 'Laporan Diterima', tanggal: '08 Des 2024, 09:15', note: 'Laporan berhasil dikirim dan sedang menunggu verifikasi.', status: 'done' },
      { label: 'Verifikasi Laporan', tanggal: '08 Des 2024, 11:30', note: 'Laporan telah diverifikasi oleh admin. Teknisi akan segera ditugaskan.', status: 'done' },
      { label: 'Penugasan Teknisi', tanggal: '09 Des 2024, 08:00', note: 'Budi Santoso ditugaskan untuk menangani laporan ini.', status: 'active' },
      { label: 'Selesai Diperbaiki', tanggal: '—', note: '', status: 'pending' }
    ]
  },
  {
    id: 'TKT-2024-098',
    judul: 'Proyektor ruang seminar tidak menyala',
    gedung: 'Gedung A – Rektorat',
    ruangan: 'Ruang Seminar A-101',
    kategori: '🖥️ Komputer & Proyektor',
    prioritas: 'sedang',
    deskripsi: 'Proyektor di ruang seminar A-101 tidak dapat menyala. Lampu indikator berkedip merah. Sudah dicoba restart namun tetap tidak berfungsi. Ruang ini digunakan setiap hari untuk kegiatan seminar dan rapat.',
    status: 'Menunggu Verifikasi',
    tanggapanAdmin: 'Laporan telah diverifikasi dan sedang ditangani teknisi.',
    pelapor: 'Ahmad Fauzi',
    nim: '2021001234',
    tanggal: '2024-12-09',
    teknisi: null,
    timeline: [
      { label: 'Laporan Diterima', tanggal: '09 Des 2024, 13:45', note: 'Laporan berhasil dikirim dan sedang menunggu verifikasi.', status: 'active' },
      { label: 'Verifikasi Laporan', tanggal: '—', note: '', status: 'pending' },
      { label: 'Penugasan Teknisi', tanggal: '—', note: '', status: 'pending' },
      { label: 'Selesai Diperbaiki', tanggal: '—', note: '', status: 'pending' }
    ]
  },
  {
    id: 'TKT-2024-089',
    judul: 'Wastafel toilet lantai 2 tersumbat',
    gedung: 'Gedung C – Fakultas Ekonomi',
    ruangan: 'Toilet Lantai 2',
    kategori: '🚰 Sanitasi & Air',
    prioritas: 'sedang',
    deskripsi: 'Wastafel di toilet pria lantai 2 Gedung C tersumbat dan airnya tidak dapat mengalir. Sudah 2 hari kondisi seperti ini.',
    status: 'Selesai',
    tanggapanAdmin: 'Masalah sudah diperbaiki. Wastafel kembali normal.',
    pelapor: 'Ahmad Fauzi',
    nim: '2021001234',
    tanggal: '2024-12-01',
    teknisi: 'Andi Wijaya',
    timeline: [
      { label: 'Laporan Diterima', tanggal: '01 Des 2024, 08:00', note: 'Laporan berhasil dikirim.', status: 'done' },
      { label: 'Verifikasi Laporan', tanggal: '01 Des 2024, 09:15', note: 'Laporan diverifikasi.', status: 'done' },
      { label: 'Penugasan Teknisi', tanggal: '01 Des 2024, 10:00', note: 'Andi Wijaya ditugaskan.', status: 'done' },
      { label: 'Selesai Diperbaiki', tanggal: '02 Des 2024, 14:30', note: 'Pipa tersumbat telah dibersihkan. Wastafel kembali normal.', status: 'done' }
    ]
  },
  {
    id: 'TKT-2024-085',
    judul: 'Lampu ruang baca perpustakaan mati',
    gedung: 'Gedung D – Perpustakaan',
    ruangan: 'Ruang Baca Utama',
    kategori: '🔌 Listrik & Elektronik',
    prioritas: 'rendah',
    deskripsi: 'Beberapa lampu di pojok kiri ruang baca perpustakaan sudah mati sejak minggu lalu. Area tersebut menjadi gelap dan kurang nyaman untuk membaca.',
    status: 'Selesai',
    tanggapanAdmin: 'Laporan telah diverifikasi dan sedang ditangani teknisi.',
    pelapor: 'Ahmad Fauzi',
    nim: '2021001234',
    tanggal: '2024-11-28',
    teknisi: 'Dedi Kurniawan',
    timeline: [
      { label: 'Laporan Diterima', tanggal: '28 Nov 2024, 10:00', note: 'Laporan berhasil dikirim.', status: 'done' },
      { label: 'Verifikasi Laporan', tanggal: '28 Nov 2024, 11:00', note: 'Laporan diverifikasi.', status: 'done' },
      { label: 'Penugasan Teknisi', tanggal: '29 Nov 2024, 08:00', note: 'Dedi Kurniawan ditugaskan.', status: 'done' },
      { label: 'Selesai Diperbaiki', tanggal: '29 Nov 2024, 13:00', note: 'Lampu berhasil diganti dengan yang baru.', status: 'done' }
    ]
  },
  {
    id: 'TKT-2024-082',
    judul: 'Kabel jaringan terputus di lab komputer',
    gedung: 'Gedung E – Laboratorium',
    ruangan: 'Lab Komputer 1, Lantai 1',
    kategori: '🌐 Jaringan & Internet',
    prioritas: 'tinggi',
    deskripsi: 'Terdapat 5 unit komputer yang tidak dapat terhubung ke jaringan internet. Kabel LAN terlihat rusak akibat terinjak. Sangat mengganggu praktikum pemrograman web.',
    status: 'Ditolak',
    tanggapanAdmin: 'Laporan telah diverifikasi dan sedang ditangani teknisi.',
    pelapor: 'Ahmad Fauzi',
    nim: '2021001234',
    tanggal: '2024-11-25',
    teknisi: null,
    tanggapanAdmin: 'Laporan telah ditolak karena duplikasi.',
    catatan: 'Ditolak karena duplikasi laporan. Sudah ada laporan dengan ID TKT-2024-079 dengan permasalahan yang sama.',
    timeline: [
      { label: 'Laporan Diterima', tanggal: '25 Nov 2024, 09:00', note: 'Laporan berhasil dikirim.', status: 'done' },
      { label: 'Verifikasi Laporan', tanggal: '25 Nov 2024, 10:00', note: 'Laporan diperiksa oleh admin.', status: 'done' },
      { label: 'Laporan Ditolak', tanggal: '25 Nov 2024, 10:30', note: 'Duplikasi laporan TKT-2024-079.', status: 'done' }
    ]
  },
  {
    id: 'TKT-2024-075',
    judul: 'Kursi kuliah patah di ruang C-201',
    gedung: 'Gedung C – Fakultas Ekonomi',
    ruangan: 'Ruang C-201, Lantai 2',
    kategori: '🪑 Furnitur & Perabot',
    prioritas: 'rendah',
    deskripsi: 'Terdapat 3 kursi kuliah yang kakinya patah di ruang C-201. Kursi tersebut berbahaya jika digunakan karena dapat menyebabkan mahasiswa terjatuh.',
    status: 'Selesai',
    tanggapanAdmin: 'Laporan telah diverifikasi dan sedang ditangani teknisi.',
    pelapor: 'Ahmad Fauzi',
    nim: '2021001234',
    tanggal: '2024-11-20',
    teknisi: 'Siti Rahayu',
    timeline: [
      { label: 'Laporan Diterima', tanggal: '20 Nov 2024, 07:30', note: 'Laporan berhasil dikirim.', status: 'done' },
      { label: 'Verifikasi Laporan', tanggal: '20 Nov 2024, 09:00', note: 'Laporan diverifikasi.', status: 'done' },
      { label: 'Penugasan Teknisi', tanggal: '20 Nov 2024, 10:00', note: 'Siti Rahayu ditugaskan.', status: 'done' },
      { label: 'Selesai Diperbaiki', tanggal: '21 Nov 2024, 11:00', note: '3 kursi telah diganti dengan yang baru dari gudang sarana.', status: 'done' }
    ]
  },
  {
    id: 'TKT-2024-060',
    judul: 'Pintu ruang dosen macet tidak bisa dibuka',
    gedung: 'Gedung B – Fakultas Teknik',
    ruangan: 'Ruang Dosen Teknik Informatika',
    kategori: '🚪 Pintu & Jendela',
    prioritas: 'darurat',
    deskripsi: 'Pintu ruang dosen Teknik Informatika macet dan tidak bisa dibuka dari luar. Dosen terkunci di dalam ruangan. Kunci tidak dapat diputar.',
    status: 'Selesai',
    tanggapanAdmin: 'Laporan telah diverifikasi dan sedang ditangani teknisi.',
    pelapor: 'Ahmad Fauzi',
    nim: '2021001234',
    tanggal: '2024-11-10',
    teknisi: 'Budi Santoso',
    timeline: [
      { label: 'Laporan Diterima', tanggal: '10 Nov 2024, 13:00', note: 'Laporan darurat diterima.', status: 'done' },
      { label: 'Verifikasi Laporan', tanggal: '10 Nov 2024, 13:05', note: 'Langsung diproses karena darurat.', status: 'done' },
      { label: 'Penugasan Teknisi', tanggal: '10 Nov 2024, 13:10', note: 'Budi Santoso dikirim segera.', status: 'done' },
      { label: 'Selesai Diperbaiki', tanggal: '10 Nov 2024, 14:00', note: 'Kunci berhasil diperbaiki. Dosen sudah bisa keluar.', status: 'done' }
    ]
  }
];

// Generate ticket ID
function generateTicketId() {
  const now = new Date();
  const year = now.getFullYear();
  const seq = String(Math.floor(Math.random() * 900) + 102).padStart(3, '0');
  return `TKT-${year}-${seq}`;
}

// Get status badge HTML
function getBadge(status) {
  const cls = status.toLowerCase().replace(' ', '-');
  const icons = { 'Menunggu': '⏳', 'Diproses': '🔧', 'Selesai': '✅', 'Ditolak': '❌' };
  return `<span class="badge badge-${cls}">${icons[status] || ''} ${status}</span>`;
}

// Get priority badge HTML
function getPrioritasBadge(prioritas) {
  const icons = { rendah: '🟢', sedang: '🟡', tinggi: '🔴', darurat: '🚨' };
  const labels = { rendah: 'Rendah', sedang: 'Sedang', tinggi: 'Tinggi', darurat: 'Darurat' };
  return `<span class="badge badge-prioritas-${prioritas}">${icons[prioritas]} ${labels[prioritas]}</span>`;
}

// Format date
function formatDate(dateStr) {
  if (!dateStr || dateStr === '—') return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}