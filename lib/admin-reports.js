import { prisma } from "@/lib/prisma";
import { DISABILITY_ORDER, isBranchUuid } from "@/lib/admin-dashboard";
import { formatPostgresConnectionHelp } from "@/lib/db-errors";

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

/** @param {string | null | undefined} branchId */
function branchWhere(branchId) {
  return isBranchUuid(branchId) ? { branch_id: branchId } : {};
}

/** @param {string | null | undefined} branchId */
function patientActiveWhere(branchId) {
  return { is_active: true, ...(isBranchUuid(branchId) ? { branch_id: branchId } : {}) };
}

/** @param {number} y @param {number} m */
function startOfMonth(y, m) {
  return new Date(y, m, 1, 0, 0, 0, 0);
}

/** @param {number} y @param {number} m */
function endOfMonth(y, m) {
  return new Date(y, m + 1, 0, 23, 59, 59, 999);
}

export const PAYMENT_CHART_ORDER = [
  { key: "BPJS", label: "BPJS", color: "#3b82f6" },
  { key: "SUBSIDI", label: "Subsidi Yayasan", color: "#22c55e" },
  { key: "UMUM", label: "Umum", color: "#f97316" },
  { key: "GRATIS", label: "Gratis", color: "#a855f7" },
];

/** @param {string | null | undefined} raw */
function normPaymentKey(raw) {
  if (raw == null) return null;
  const u = String(raw).trim().toUpperCase();
  if (!u) return null;
  if (u === "BPJS") return "BPJS";
  if (u === "SUBSIDI" || u === "SUBSIDI_YAYASAN" || u === "YAYASAN") return "SUBSIDI";
  if (u === "UMUM") return "UMUM";
  if (u === "GRATIS") return "GRATIS";
  return u.length > 20 ? null : u;
}

/**
 * @param {string | null | undefined} branchId
 * @param {number} year
 */
export async function loadAdminReports(branchId, year) {
  const y = Number.isFinite(year) && year >= 2000 && year <= 2100 ? year : new Date().getFullYear();

  if (!isBranchUuid(branchId)) {
    return {
      ok: true,
      connectionHint: null,
      year: y,
      visitTrend: MONTH_SHORT.map((month) => ({ month, count: 0 })),
      paymentSlices: [],
      topDiagnoses: [],
      stats: {
        activePatients: 0,
        sessionsThisMonth: 0,
        avgBarthel: null,
        completedProgramPatients: 0,
        successRatePercent: null,
      },
    };
  }

  const bw = branchWhere(branchId);
  const pw = patientActiveWhere(branchId);
  const now = new Date();
  const cy = now.getFullYear();
  const cm = now.getMonth();
  const monthStart = startOfMonth(cy, cm);
  const monthEnd = endOfMonth(cy, cm);

  try {
    const [
      monthlyVisits,
      paymentGroups,
      diagnosisGroups,
      disabilityGroups,
      activePatients,
      sessionsThisMonth,
      barthelAgg,
      completedProgramPatients,
      queueCompleted,
      queueTotal,
    ] = await Promise.all([
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
      prisma.patients.groupBy({
        by: ["payment_category"],
        where: pw,
        _count: { _all: true },
      }),
      prisma.patients.groupBy({
        by: ["primary_diagnosis"],
        where: {
          ...pw,
          primary_diagnosis: { not: null },
        },
        _count: { _all: true },
      }),
      prisma.patients.groupBy({
        by: ["disability_type"],
        where: pw,
        _count: { _all: true },
      }),
      prisma.patients.count({ where: pw }),
      prisma.therapy_sessions.count({
        where: {
          ...bw,
          scheduled_start: { gte: monthStart, lte: monthEnd },
        },
      }),
      prisma.patients.aggregate({
        where: { ...pw, barthel_score: { not: null } },
        _avg: { barthel_score: true },
      }),
      prisma.patients.count({
        where: { ...branchWhere(branchId), is_active: false },
      }),
      prisma.queue_entries.count({ where: { ...bw, status: "completed" } }),
      prisma.queue_entries.count({ where: bw }),
    ]);

    const visitTrend = MONTH_SHORT.map((month, i) => ({
      month,
      count: monthlyVisits[i],
    }));

    const payMap = new Map();
    for (const row of paymentGroups) {
      const k = normPaymentKey(row.payment_category);
      if (!k) continue;
      payMap.set(k, (payMap.get(k) ?? 0) + row._count._all);
    }
    const paymentSlices = PAYMENT_CHART_ORDER.filter((p) => (payMap.get(p.key) ?? 0) > 0).map(
      (p) => ({
        name: p.label,
        value: payMap.get(p.key) ?? 0,
        fill: p.color,
        key: p.key,
      }),
    );

    const dxSorted = diagnosisGroups
      .filter((r) => String(r.primary_diagnosis ?? "").trim())
      .map((r) => ({
        name: String(r.primary_diagnosis).trim(),
        count: r._count._all,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    /** @type {{ name: string, count: number }[]} */
    let topDiagnoses = dxSorted;
    if (topDiagnoses.length === 0) {
      const dMap = new Map(
        disabilityGroups.map((r) => [String(r.disability_type ?? "").toUpperCase(), r._count._all]),
      );
      topDiagnoses = DISABILITY_ORDER.map((d) => ({
        name: d.label,
        count: dMap.get(d.key) ?? 0,
      }))
        .filter((x) => x.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    }

    const avgBarthel =
      barthelAgg._avg.barthel_score != null
        ? Math.round(Number(barthelAgg._avg.barthel_score))
        : null;

    const successRatePercent =
      queueTotal > 0 ? Math.min(100, Math.round((100 * queueCompleted) / queueTotal)) : null;

    return {
      ok: true,
      connectionHint: null,
      year: y,
      visitTrend,
      paymentSlices,
      topDiagnoses,
      stats: {
        activePatients,
        sessionsThisMonth,
        avgBarthel,
        completedProgramPatients,
        successRatePercent,
      },
    };
  } catch (err) {
    return {
      ok: false,
      connectionHint: formatPostgresConnectionHelp(err),
      year: y,
      visitTrend: MONTH_SHORT.map((month) => ({ month, count: 0 })),
      paymentSlices: [],
      topDiagnoses: [],
      stats: {
        activePatients: 0,
        sessionsThisMonth: 0,
        avgBarthel: null,
        completedProgramPatients: 0,
        successRatePercent: null,
      },
    };
  }
}
