import { prisma } from "@/lib/prisma";
import { isBranchUuid } from "@/lib/admin-dashboard";
import { formatPostgresConnectionHelp } from "@/lib/db-errors";

const DISABILITY_LABELS = {
  FISIK: "Fisik",
  MOTORIK: "Motorik",
  INTELEKTUAL: "Intelektual",
  KOGNITIF: "Kognitif",
  SOSIAL: "Sosial",
};

/**
 * @param {string | null | undefined} raw
 * @returns {string[]}
 */
export function disabilityTokensToLabels(raw) {
  if (!raw || !String(raw).trim()) return [];
  const u = String(raw).trim().toUpperCase();
  if (u === "FISIK,MOTORIK" || u === "FISIK;MOTORIK" || u === "FISIK|MOTORIK") {
    return ["Fisik & Motorik"];
  }
  return String(raw)
    .split(/[,;/|]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((token) => {
      const k = token.toUpperCase();
      return DISABILITY_LABELS[k] ?? token;
    });
}

/** @param {Date | null | undefined} dob */
export function ageLabelFromDob(dob) {
  if (!dob) return null;
  const t = dob instanceof Date ? dob : new Date(dob);
  if (Number.isNaN(t.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - t.getFullYear();
  const m = now.getMonth() - t.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < t.getDate())) age -= 1;
  if (age < 0) return null;
  return `${age} thn`;
}

/**
 * @param {{ id: string, medical_record_no: string | null, created_at: Date }} p
 */
export function patientDisplayNo(p) {
  const m = p.medical_record_no?.trim();
  if (m) return m;
  const y = p.created_at.getFullYear();
  const tail = p.id.replace(/-/g, "").slice(-6).toUpperCase();
  return `YPK-${y}-${tail}`;
}

/** @param {Record<string, unknown> & { id: string, first_name: string, last_name: string }} p */
export function mapPatientListRow(p) {
  return {
    id: p.id,
    displayNo: patientDisplayNo(p),
    fullName: `${p.first_name} ${p.last_name}`.trim(),
    addressLine: p.address?.trim() || "—",
    ageLabel: ageLabelFromDob(p.date_of_birth) ?? "—",
    disabilityLabels: disabilityTokensToLabels(p.disability_type),
    barthelScore:
      typeof p.barthel_score === "number" && p.barthel_score >= 0
        ? Math.min(100, p.barthel_score)
        : null,
    therapistName: p.primary_therapist_name?.trim() || "—",
    isActive: p.is_active,
  };
}

/**
 * @param {string | null | undefined} branchId
 */
export async function listPatientsForAdmin(branchId) {
  try {
    const where = isBranchUuid(branchId) ? { branch_id: branchId } : {};
    const rows = await prisma.patients.findMany({
      where,
      orderBy: [{ last_name: "asc" }, { first_name: "asc" }],
    });
    return {
      ok: true,
      connectionHint: null,
      rows: rows.map(mapPatientListRow),
    };
  } catch (err) {
    return {
      ok: false,
      connectionHint: formatPostgresConnectionHelp(err),
      rows: [],
    };
  }
}
