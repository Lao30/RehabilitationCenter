/**
 * Dokumen use case peran — dipakai halaman /use-cases.
 * @typedef {{ id: string, title: string, emoji: string, items: string[] }} UseCaseBlock
 * @typedef {{ role: string, roleLabel: string, goal: string, accent: 'violet' | 'sky', blocks: UseCaseBlock[] }} RoleProfile
 */

/** @type {RoleProfile} */
export const superAdminProfile = {
  role: "SUPER_ADMIN",
  roleLabel: "Super Admin",
  goal:
    "Kontrol penuh sistem, konfigurasi, dan monitoring tingkat platform — lintas cabang.",
  accent: "violet",
  blocks: [
    {
      id: "users",
      emoji: "🔐",
      title: "User & peran",
      items: [
        "Membuat, memperbarui, dan menonaktifkan akun (Admin, Terapis, Guardian).",
        "Menetapkan peran dan izin akses ke modul.",
        "Reset password dan kebijakan keamanan akun.",
      ],
    },
    {
      id: "config",
      emoji: "🏥",
      title: "Konfigurasi sistem",
      items: [
        "Pengaturan informasi klinik, jam operasional, dan parameter global.",
        "Manajemen cabang / lokasi (multi-branch).",
        "Kanal notifikasi (mis. WhatsApp, email) dan template pesan.",
      ],
    },
    {
      id: "dashboard",
      emoji: "📊",
      title: "Dashboard global",
      items: [
        "Statistik agregat: pasien, sesi, terapis, antrian.",
        "Indikator performa sistem dan kesehatan integrasi.",
      ],
    },
    {
      id: "reports",
      emoji: "📈",
      title: "Laporan & analitik",
      items: [
        "Laporan sesi bulanan, distribusi jenis disabilitas, dan KPI cabang.",
        "Ekspor laporan (PDF / Excel).",
        "Ringkasan dampak sosial & outcome per program.",
      ],
    },
    {
      id: "therapists",
      emoji: "🧑‍⚕️",
      title: "Manajemen terapis",
      items: [
        "Data terapis: tambah, ubah, arsip.",
        "Penugasan terapis ke cabang.",
        "Pengaturan jadwal kerja dan kuota sesi.",
      ],
    },
    {
      id: "audit",
      emoji: "🧾",
      title: "Audit & kontrol",
      items: [
        "Log sistem dan riwayat aktivitas pengguna.",
        "Monitoring akses mencurigakan dan perubahan konfigurasi kritis.",
      ],
    },
  ],
};

/** @type {RoleProfile} */
export const adminProfile = {
  role: "ADMIN",
  roleLabel: "Admin (operasional)",
  goal:
    "Mengelola operasional harian pusat rehabilitasi di tingkat cabang — pasien, antrian, dan sesi.",
  accent: "sky",
  blocks: [
    {
      id: "frontdesk",
      emoji: "📋",
      title: "Resepsionis & rekam medis",
      items: [
        "Registrasi pasien baru dan pembaruan profil.",
        "Rekam medis ringkas, jenis disabilitas, dan kontak keluarga.",
        "Input rekam cepat dari dashboard operasional.",
      ],
    },
    {
      id: "queue",
      emoji: "🎫",
      title: "Antrian harian",
      items: [
        "Melihat dan mengubah status antrian (menunggu, dipanggil, dilayani).",
        "Prioritas antrian dan catatan singkat per pasien.",
        "Koordinasi dengan ruang terapi.",
      ],
    },
    {
      id: "sessions",
      emoji: "🗓️",
      title: "Sesi terapi",
      items: [
        "Jadwalkan, ubah, atau batalkan sesi untuk pasien & terapis.",
        "Monitoring sesi hari ini dari dashboard.",
        "Status sesi: terjadwal, berlangsung, selesai.",
      ],
    },
    {
      id: "schedule",
      emoji: "⏰",
      title: "Jadwal & ruang",
      items: [
        "Gambaran jadwal terapis dan slot ruang.",
        "Menghindari bentrok jadwal di cabang yang sama.",
      ],
    },
    {
      id: "notify",
      emoji: "🔔",
      title: "Notifikasi cabang",
      items: [
        "Mengirim atau menindaklanjuti notifikasi operasional ke staf/pasien.",
        "Mengikuti pengingat sesi dan antrian.",
      ],
    },
    {
      id: "reports-branch",
      emoji: "📑",
      title: "Laporan cabang",
      items: [
        "Laporan volume sesi dan antrian untuk periode tertentu.",
        "Ringkasan kinerja operasional cabang (bukan konfigurasi global).",
      ],
    },
  ],
};
