import { prisma } from "@/lib/prisma";
import { isBranchUuid } from "@/lib/admin-dashboard";
import { formatPostgresConnectionHelp } from "@/lib/db-errors";
import { buildWaMessage } from "@/lib/wa-templates";

/**
 * @param {string} raw
 * @returns {string}
 */
export function waPhoneDigitsForUrl(raw) {
  const d = String(raw || "").replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("62")) return d;
  if (d.startsWith("0")) return `62${d.slice(1)}`;
  if (d.length >= 9 && d.length <= 11) return `62${d}`;
  return d;
}

/**
 * @param {string} branchId
 * @param {string} guardianId
 */
export async function buildGuardianWaContext(branchId, guardianId) {
  const [guardian, branch] = await Promise.all([
    prisma.guardians.findFirst({
      where: {
        id: guardianId,
        branch_id: branchId,
        is_active: true,
      },
      include: {
        guardian_patients: {
          include: {
            patients: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                is_active: true,
              },
            },
          },
        },
      },
    }),
    prisma.branches.findUnique({
      where: { id: branchId },
      select: { name: true },
    }),
  ]);

  if (!guardian) return null;

  const patientLinks = guardian.guardian_patients.filter(
    (gp) => gp.patients?.is_active !== false,
  );
  const patientIds = patientLinks.map((gp) => gp.patient_id);
  const names = patientLinks.map((gp) => {
    const p = gp.patients;
    return `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "Pasien";
  });
  const patientNames = names.length ? names.join(", ") : "pasien terdaftar";
  const patientName = names[0] || "Pasien";

  let nextSessionStart = null;
  let patientNameForSession = patientName;
  if (patientIds.length) {
    const sessions = await prisma.therapy_sessions.findMany({
      where: {
        branch_id: branchId,
        patient_id: { in: patientIds },
        scheduled_start: { gte: new Date() },
        status: { not: "cancelled" },
      },
      orderBy: [{ scheduled_start: "asc" }],
      take: 24,
      select: {
        scheduled_start: true,
        patient_id: true,
        patients: { select: { first_name: true, last_name: true } },
      },
    });
    const first = sessions[0];
    if (first) {
      nextSessionStart = first.scheduled_start.toISOString();
      const p = first.patients;
      patientNameForSession =
        `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || patientName;
    }
  }

  return {
    guardianName: guardian.full_name,
    branchName: branch?.name ?? "Pusat rehabilitasi",
    patientName: patientNameForSession,
    patientNames,
    nextSessionStart,
  };
}

/**
 * @param {string | null | undefined} branchId
 */
export async function loadWhatsAppNotificationsPage(branchId) {
  if (!isBranchUuid(branchId)) {
    return {
      ok: true,
      connectionHint: null,
      guardians: [],
      logs: [],
    };
  }

  try {
    const [guardianRows, logRows, branch] = await Promise.all([
      prisma.guardians.findMany({
        where: { branch_id: branchId, is_active: true },
        orderBy: [{ full_name: "asc" }],
        include: {
          guardian_patients: {
            include: {
              patients: {
                select: {
                  id: true,
                  first_name: true,
                  last_name: true,
                  is_active: true,
                },
              },
            },
          },
        },
      }),
      prisma.wa_notification_logs.findMany({
        where: { branch_id: branchId },
        orderBy: [{ created_at: "desc" }],
        take: 50,
        select: {
          id: true,
          recipient_name: true,
          recipient_phone: true,
          message_body: true,
          status: true,
          created_at: true,
        },
      }),
      prisma.branches.findUnique({
        where: { id: branchId },
        select: { name: true },
      }),
    ]);

    const branchName = branch?.name ?? "Pusat rehabilitasi";
    const patientIds = [
      ...new Set(
        guardianRows.flatMap((g) =>
          g.guardian_patients
            .filter((gp) => gp.patients?.is_active !== false)
            .map((gp) => gp.patient_id),
        ),
      ),
    ];

    const sessions =
      patientIds.length === 0
        ? []
        : await prisma.therapy_sessions.findMany({
            where: {
              branch_id: branchId,
              patient_id: { in: patientIds },
              scheduled_start: { gte: new Date() },
              status: { not: "cancelled" },
            },
            orderBy: [{ scheduled_start: "asc" }],
            take: 400,
            select: {
              patient_id: true,
              scheduled_start: true,
              patients: { select: { first_name: true, last_name: true } },
            },
          });

    /** @type {Map<string, typeof sessions[0]>} */
    const firstSessionByPatient = new Map();
    for (const s of sessions) {
      if (!firstSessionByPatient.has(s.patient_id)) {
        firstSessionByPatient.set(s.patient_id, s);
      }
    }

    const guardians = guardianRows.map((g) => {
      const links = g.guardian_patients.filter((gp) => gp.patients?.is_active !== false);
      const names = links.map((gp) => {
        const p = gp.patients;
        return `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "Pasien";
      });
      const patientNames = names.length ? names.join(", ") : "pasien terdaftar";
      const defaultPatientName = names[0] || "Pasien";

      let best = null;
      for (const gp of links) {
        const s = firstSessionByPatient.get(gp.patient_id);
        if (!s) continue;
        if (!best || s.scheduled_start < best.scheduled_start) best = s;
      }

      let nextSessionStart = null;
      let patientName = defaultPatientName;
      if (best) {
        nextSessionStart = best.scheduled_start.toISOString();
        const p = best.patients;
        patientName = `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || defaultPatientName;
      }

      return {
        id: g.id,
        fullName: g.full_name,
        phone: g.phone,
        hasPhone: Boolean(waPhoneDigitsForUrl(g.phone)),
        previewContext: {
          guardianName: g.full_name,
          branchName,
          patientName,
          patientNames,
          nextSessionStart,
        },
      };
    });

    const logs = logRows.map((r) => ({
      id: r.id,
      recipientLabel: `${r.recipient_name} (${r.recipient_phone})`,
      snippet: truncateSnippet(r.message_body, 120),
      createdLabel: formatLogTimestamp(r.created_at),
      status: r.status,
    }));

    return { ok: true, connectionHint: null, guardians, logs };
  } catch (err) {
    return {
      ok: false,
      connectionHint: formatPostgresConnectionHelp(err),
      guardians: [],
      logs: [],
    };
  }
}

/** @param {string} text @param {number} max */
function truncateSnippet(text, max) {
  const s = String(text || "").replace(/\s+/g, " ").trim();
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

/** @param {Date} d */
function formatLogTimestamp(d) {
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  const date = dt.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const time = dt.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${date} ${time}`;
}

/**
 * @param {string} branchId
 * @param {string} guardianId
 * @param {string} templateKey
 */
export async function composeWaMessageForGuardian(branchId, guardianId, templateKey) {
  const guardian = await prisma.guardians.findFirst({
    where: { id: guardianId, branch_id: branchId, is_active: true },
    select: { full_name: true, phone: true },
  });
  if (!guardian) return { ok: false, error: "Wali tidak ditemukan." };
  const digits = waPhoneDigitsForUrl(guardian.phone);
  if (!digits) return { ok: false, error: "Nomor WhatsApp wali belum diisi." };
  const ctx = await buildGuardianWaContext(branchId, guardianId);
  if (!ctx) return { ok: false, error: "Wali tidak ditemukan." };
  const message = buildWaMessage(templateKey, ctx);
  return {
    ok: true,
    message,
    digits,
    recipientName: guardian.full_name,
    recipientPhone: guardian.phone ?? "",
  };
}
