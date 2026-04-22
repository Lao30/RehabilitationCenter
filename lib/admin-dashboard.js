import { prisma } from "@/lib/prisma";
import { formatPostgresConnectionHelp } from "@/lib/db-errors";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** @param {string | null | undefined} branchId */
export function isBranchUuid(branchId) {
  return typeof branchId === "string" && UUID_RE.test(branchId);
}

/** @param {string | null | undefined} branchId */
function patientWhere(branchId) {
  return { is_active: true, ...(isBranchUuid(branchId) ? { branch_id: branchId } : {}) };
}

/** @param {string | null | undefined} branchId */
function branchWhere(branchId) {
  return isBranchUuid(branchId) ? { branch_id: branchId } : {};
}

/** @param {Date} d */
function startOfLocalDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

/** @param {Date} d */
function endOfLocalDay(d) {
  const t = startOfLocalDay(d);
  t.setDate(t.getDate() + 1);
  return t;
}

/** @param {number} y @param {number} m */
function startOfMonth(y, m) {
  return new Date(y, m, 1, 0, 0, 0, 0);
}

/** @param {number} y @param {number} m */
function endOfMonth(y, m) {
  return new Date(y, m + 1, 0, 23, 59, 59, 999);
}

export const DISABILITY_ORDER = [
  { key: "FISIK", label: "Fisik", color: "#3b82f6" },
  { key: "MOTORIK", label: "Motorik", color: "#22c55e" },
  { key: "INTELEKTUAL", label: "Intelektual", color: "#eab308" },
  { key: "KOGNITIF", label: "Kognitif", color: "#a855f7" },
  { key: "SOSIAL", label: "Sosial", color: "#ef4444" },
];

const QUEUE_STATUS_UI = {
  waiting: { label: "Menunggu", tone: "amber" },
  called: { label: "Dipanggil", tone: "sky" },
  serving: { label: "Dilayani", tone: "emerald" },
  completed: { label: "Selesai", tone: "slate" },
  cancelled: { label: "Dibatalkan", tone: "rose" },
};

/** @param {string | null | undefined} v */
function normDisabilityKey(v) {
  if (v == null || String(v).trim() === "") return null;
  return String(v).trim().toUpperCase();
}

/** @param {string | null | undefined} id */
function formatTherapist(id) {
  if (!id) return "—";
  const s = String(id).replace(/-/g, "");
  return `Terapis · …${s.slice(-6)}`;
}

/** @param {Date} d */
function formatTime(d) {
  return d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/** @param {string} uuid */
function initialsFromId(uuid) {
  const hex = uuid.replace(/-/g, "").toUpperCase();
  return hex.slice(0, 2) || "TR";
}

/**
 * @param {string | null | undefined} branchId
 */
export async function loadAdminDashboard(branchId) {
  try {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const dayStart = startOfLocalDay(now);
    const dayEnd = endOfLocalDay(now);
    const monthStart = startOfMonth(y, m);
    const prevMonthStart = startOfMonth(y, m - 1);
    const prevMonthEnd = endOfMonth(y, m - 1);

    const pw = patientWhere(branchId);
    const bw = branchWhere(branchId);

    const [
      totalPatients,
      patientsThisMonth,
      queueWaitingToday,
      totalSessions,
      sessionsThisMonth,
      sessionsPrevMonth,
      patientGroups,
      monthlyBuckets,
      queueRows,
      sessionsToday,
      therapistRows,
    ] = await Promise.all([
      prisma.patients.count({ where: pw }),
      prisma.patients.count({
        where: { ...pw, created_at: { gte: monthStart } },
      }),
      prisma.queue_entries.count({
        where: {
          ...bw,
          status: "waiting",
          queued_at: { gte: dayStart, lt: dayEnd },
        },
      }),
      prisma.therapy_sessions.count({ where: bw }),
      prisma.therapy_sessions.count({
        where: {
          ...bw,
          scheduled_start: { gte: monthStart, lte: endOfMonth(y, m) },
        },
      }),
      prisma.therapy_sessions.count({
        where: {
          ...bw,
          scheduled_start: { gte: prevMonthStart, lte: prevMonthEnd },
        },
      }),
      prisma.patients.groupBy({
        by: ["disability_type"],
        where: pw,
        _count: { _all: true },
      }),
      Promise.all(
        Array.from({ length: 12 }, (_, mi) =>
          prisma.therapy_sessions.count({
            where: {
              ...bw,
              scheduled_start: {
                gte: startOfMonth(y, mi),
                lte: endOfMonth(y, mi),
              },
            },
          }),
        ),
      ),
      prisma.queue_entries.findMany({
        where: {
          ...bw,
          queued_at: { gte: dayStart, lt: dayEnd },
        },
        orderBy: [{ priority: "desc" }, { queued_at: "asc" }],
        take: 6,
        include: {
          patients: {
            select: { first_name: true, last_name: true },
          },
          therapy_sessions: {
            select: {
              therapist_user_id: true,
              room_label: true,
              notes: true,
            },
          },
        },
      }),
      prisma.therapy_sessions.findMany({
        where: {
          ...bw,
          scheduled_start: { gte: dayStart, lt: dayEnd },
        },
        select: {
          therapist_user_id: true,
          scheduled_start: true,
          scheduled_end: true,
          room_label: true,
        },
      }),
      prisma.therapy_sessions.findMany({
        where: {
          ...bw,
          scheduled_start: { gte: monthStart, lte: endOfMonth(y, m) },
        },
        distinct: ["therapist_user_id"],
        select: { therapist_user_id: true },
      }),
    ]);

    const therapistsActive = therapistRows.length;

    /** @type {Map<string, number>} */
    const countMap = new Map();
    for (const row of patientGroups) {
      const k = normDisabilityKey(row.disability_type);
      const labelKey = k ?? "__none";
      countMap.set(labelKey, (countMap.get(labelKey) ?? 0) + row._count._all);
    }

    const noneCount = countMap.get("__none") ?? 0;

    /** @type {Array<{ key: string, label: string, count: number, color: string }>} */
    const disabilitySlices = [];
    for (const d of DISABILITY_ORDER) {
      const c = countMap.get(d.key) ?? 0;
      if (c > 0) {
        disabilitySlices.push({
          key: d.key,
          label: d.label,
          count: c,
          color: d.color,
        });
      }
    }
    for (const [key, c] of countMap) {
      if (c === 0 || key === "__none") continue;
      if (!DISABILITY_ORDER.some((d) => d.key === key)) {
        disabilitySlices.push({
          key,
          label: key,
          count: c,
          color: "#64748b",
        });
      }
    }
    if (noneCount > 0) {
      disabilitySlices.push({
        key: "__none",
        label: "Belum diklasifikasi",
        count: noneCount,
        color: "#94a3b8",
      });
    }

    const disabilityLegend = [
      ...DISABILITY_ORDER.map((d) => ({
        key: d.key,
        label: d.label,
        color: d.color,
        count: countMap.get(d.key) ?? 0,
      })),
      {
        key: "__none",
        label: "Belum diklasifikasi",
        color: "#94a3b8",
        count: noneCount,
      },
    ];

    let sessionPctVsLastMonth = null;
    if (sessionsPrevMonth > 0) {
      sessionPctVsLastMonth = Math.round(
        ((sessionsThisMonth - sessionsPrevMonth) / sessionsPrevMonth) * 100,
      );
    } else if (sessionsThisMonth > 0) {
      sessionPctVsLastMonth = 100;
    }

    const barMax = Math.max(8, ...monthlyBuckets, 1);

    const queueToday = queueRows.map((row, i) => {
      const p = row.patients;
      const patientName = p
        ? `${p.first_name} ${p.last_name}`.trim()
        : "Pasien";
      const session = row.therapy_sessions;
      const service = session?.room_label?.trim() || "Fisioterapi";
      const therapistLabel = formatTherapist(session?.therapist_user_id);
      const raw = String(row.status || "").toLowerCase();
      const ui = QUEUE_STATUS_UI[raw] ?? {
        label: row.status,
        tone: "slate",
      };
      return {
        index: i + 1,
        patientName,
        serviceLabel: service,
        therapistLabel,
        statusLabel: ui.label,
        statusTone: ui.tone,
      };
    });

    /** @type {Map<string, typeof sessionsToday>} */
    const byTherapist = new Map();
    for (const s of sessionsToday) {
      const tid = s.therapist_user_id;
      const list = byTherapist.get(tid) ?? [];
      list.push(s);
      byTherapist.set(tid, list);
    }

    const therapistToday = [];
    for (const [tid, list] of byTherapist) {
      const starts = list.map((x) => x.scheduled_start.getTime());
      const ends = list.map((x) =>
        (x.scheduled_end ?? x.scheduled_start).getTime(),
      );
      const t0 = new Date(Math.min(...starts));
      const t1 = new Date(Math.max(...ends));
      const first = list[0];
      const specialization = first?.room_label?.trim() || "Fisioterapi";
      therapistToday.push({
        id: tid,
        initials: initialsFromId(String(tid)),
        displayName: formatTherapist(tid),
        specialization,
        hours: `${formatTime(t0)} - ${formatTime(t1)}`,
        active: true,
      });
    }
    therapistToday.sort((a, b) =>
      a.displayName.localeCompare(b.displayName),
    );

    let branchSubtitle =
      "Sistem Manajemen Rehabilitasi YPK Bali — Semua cabang";
    if (isBranchUuid(branchId)) {
      const br = await prisma.branches.findUnique({
        where: { id: branchId },
        select: { name: true },
      });
      if (br) {
        branchSubtitle = `Sistem Manajemen Rehabilitasi YPK Bali — ${br.name}`;
      }
    }

    return {
      ok: true,
      connectionHint: null,
      branchSubtitle,
      stats: {
        totalPatients,
        patientsThisMonth,
        therapistsActive,
        queueWaitingToday,
        totalSessions,
        sessionPctVsLastMonth,
      },
      monthlyYear: y,
      monthlySessions: monthlyBuckets,
      barMax,
      disabilitySlices,
      disabilityLegend,
      queueToday,
      therapistToday,
    };
  } catch (err) {
    return {
      ok: false,
      connectionHint: formatPostgresConnectionHelp(err),
      branchSubtitle:
        "Sistem Manajemen Rehabilitasi YPK Bali — Semua cabang",
      stats: {
        totalPatients: 0,
        patientsThisMonth: 0,
        therapistsActive: 0,
        queueWaitingToday: 0,
        totalSessions: 0,
        sessionPctVsLastMonth: null,
      },
      monthlyYear: new Date().getFullYear(),
      monthlySessions: Array(12).fill(0),
      barMax: 8,
      disabilitySlices: [],
      disabilityLegend: [
        ...DISABILITY_ORDER.map((d) => ({
          key: d.key,
          label: d.label,
          color: d.color,
          count: 0,
        })),
        {
          key: "__none",
          label: "Belum diklasifikasi",
          color: "#94a3b8",
          count: 0,
        },
      ],
      queueToday: [],
      therapistToday: [],
    };
  }
}
