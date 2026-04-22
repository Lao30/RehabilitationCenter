/**
 * Konteks untuk merakit teks WA (dipakai server + klien pratinjau).
 * @typedef {{
 *   guardianName: string,
 *   branchName: string,
 *   patientName: string,
 *   patientNames: string,
 *   nextSessionStart: string | null,
 * }} WaTemplateContext
 */

/** Opsi template untuk dropdown admin */
export const WA_TEMPLATE_OPTIONS = [
  {
    key: "session_confirmation",
    label: "Konfirmasi Sesi Terapi",
  },
  {
    key: "visit_reminder",
    label: "Pengingat Kunjungan",
  },
  {
    key: "queue_ready",
    label: "Pemanggilan Antrian",
  },
];

/**
 * @param {string} key
 * @param {WaTemplateContext} ctx
 */
export function buildWaMessage(key, ctx) {
  const g = ctx.guardianName || "Bapak/Ibu";
  const patients = ctx.patientNames || "pasien terdaftar";

  if (key === "session_confirmation") {
    if (!ctx.nextSessionStart) {
      return (
        `Yth. ${g},\n\n` +
        `Belum ada jadwal sesi terapi mendatang yang terhubung dengan wali ini di sistem. ` +
        `Silakan periksa jadwal di Kalender Sesi atau hubungi resepsionis.\n\n` +
        `Salam,\n${ctx.branchName}`
      );
    }
    const d = new Date(ctx.nextSessionStart);
    const datePart = d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const timePart = d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return (
      `Yth. ${g},\n\n` +
      `Konfirmasi sesi terapi ${ctx.patientName} ${datePart} pukul ${timePart}. ` +
      `Mohon konfirmasi kehadiran atau hubungi kami jika perlu penjadwalan ulang.\n\n` +
      `Terima kasih,\n${ctx.branchName}`
    );
  }

  if (key === "visit_reminder") {
    return (
      `Yth. ${g},\n\n` +
      `Ini pengingat terkait pasien: ${patients}. ` +
      `Pastikan dokumen yang diperlukan dibawa pada kunjungan berikutnya.\n\n` +
      `Salam,\n${ctx.branchName}`
    );
  }

  if (key === "queue_ready") {
    return (
      `Yth. ${g},\n\n` +
      `Pasien (${patients}) dipanggil ke ruang terapi. Mohon menunggu di area tunggu.\n\n` +
      `${ctx.branchName}`
    );
  }

  return `Yth. ${g},\n\nPesan dari ${ctx.branchName}.`;
}
