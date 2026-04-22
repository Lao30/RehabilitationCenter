import { prisma } from "@/lib/prisma";
import { isBranchUuid } from "@/lib/admin-dashboard";
import { formatPostgresConnectionHelp } from "@/lib/db-errors";

/**
 * Inisial untuk avatar (dua huruf), mengabaikan gelar umum di awal nama.
 * @param {string} name
 */
export function initialsFromDisplayName(name) {
  let s = String(name || "")
    .trim()
    .replace(/^(dr\.|prof\.|drs\.|dra\.)\s+/i, "");
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0][0] || "";
    const b = parts[1][0] || "";
    return (a + b).toUpperCase();
  }
  if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return "??";
}

/**
 * @param {string | null | undefined} branchId
 */
export async function listTherapistsForAdmin(branchId) {
  try {
    const where = {
      is_active: true,
      ...(isBranchUuid(branchId) ? { branch_id: branchId } : {}),
    };
    const rows = await prisma.therapists.findMany({
      where,
      orderBy: [{ display_name: "asc" }],
    });
    return {
      ok: true,
      connectionHint: null,
      rows: rows.map((t) => ({
        id: t.id,
        displayName: t.display_name,
        initials: initialsFromDisplayName(t.display_name),
        specialization: t.specialization,
        scheduleDays: t.schedule_days,
        scheduleHours: t.schedule_hours,
        branchLabel: t.branch_label,
        totalPatients: t.total_patients,
        isActive: t.is_active,
      })),
    };
  } catch (err) {
    return {
      ok: false,
      connectionHint: formatPostgresConnectionHelp(err),
      rows: [],
    };
  }
}
