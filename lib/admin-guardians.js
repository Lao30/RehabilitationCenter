import { prisma } from "@/lib/prisma";
import { isBranchUuid } from "@/lib/admin-dashboard";
import { initialsFromDisplayName } from "@/lib/admin-therapists";
import { formatPostgresConnectionHelp } from "@/lib/db-errors";

/** @param {Date | null} d */
function formatLoginAt(d) {
  if (!d) return null;
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return null;
  return dt.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * @param {string | null | undefined} branchId
 */
export async function loadGuardiansDashboard(branchId) {
  try {
    const branchWhere = isBranchUuid(branchId) ? { branch_id: branchId } : {};

    let branchLabel = "Pusat";
    if (isBranchUuid(branchId)) {
      const br = await prisma.branches.findUnique({
        where: { id: branchId },
        select: { name: true },
      });
      if (br?.name) branchLabel = br.name;
    }

    const [total, active, inactive, distinctLinks, guardians] = await Promise.all([
      prisma.guardians.count({ where: branchWhere }),
      prisma.guardians.count({ where: { ...branchWhere, is_active: true } }),
      prisma.guardians.count({ where: { ...branchWhere, is_active: false } }),
      prisma.guardian_patients.findMany({
        where: { guardians: { ...branchWhere } },
        distinct: ["patient_id"],
        select: { patient_id: true },
      }),
      prisma.guardians.findMany({
        where: branchWhere,
        include: {
          guardian_patients: {
            include: {
              patients: {
                select: { id: true, first_name: true, last_name: true },
              },
            },
          },
        },
        orderBy: [{ full_name: "asc" }],
      }),
    ]);

    const rows = guardians.map((g) => {
      const patients = g.guardian_patients.map((gp) => ({
        id: gp.patients.id,
        shortName: gp.patients.first_name?.trim() || "Pasien",
      }));
      return {
        id: g.id,
        fullName: g.full_name,
        initials: initialsFromDisplayName(g.full_name),
        email: g.email,
        phone: g.phone,
        relationship: g.relationship,
        lastLoginLabel: formatLoginAt(g.last_login_at),
        patients,
        branchLabel,
        isActive: g.is_active,
      };
    });

    return {
      ok: true,
      connectionHint: null,
      stats: {
        total,
        active,
        linkedPatients: distinctLinks.length,
        inactive,
      },
      rows,
    };
  } catch (err) {
    return {
      ok: false,
      connectionHint: formatPostgresConnectionHelp(err),
      stats: { total: 0, active: 0, linkedPatients: 0, inactive: 0 },
      rows: [],
    };
  }
}
