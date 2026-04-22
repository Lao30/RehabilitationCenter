import { prisma } from "@/lib/prisma";
import { isBranchUuid } from "@/lib/admin-dashboard";
import { patientDisplayNo } from "@/lib/admin-patients";
import { formatPostgresConnectionHelp } from "@/lib/db-errors";

/** @param {Date | string} d */
function formatDateId(d) {
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * @param {string | null | undefined} branchId
 */
export async function listPatientOptionsForRehab(branchId) {
  try {
    const where = isBranchUuid(branchId) ? { branch_id: branchId } : {};
    const rows = await prisma.patients.findMany({
      where,
      select: { id: true, first_name: true, last_name: true },
      orderBy: [{ last_name: "asc" }, { first_name: "asc" }],
    });
    return {
      ok: true,
      options: rows.map((p) => ({
        id: p.id,
        label: `${p.first_name} ${p.last_name}`.trim(),
      })),
    };
  } catch {
    return { ok: false, options: [] };
  }
}

/**
 * @param {string | null | undefined} branchId
 */
export async function listRehabilitationRecords(branchId) {
  try {
    const where = {
      is_active: true,
      ...(isBranchUuid(branchId) ? { branch_id: branchId } : {}),
    };
    const rows = await prisma.rehabilitation_records.findMany({
      where,
      include: {
        patients: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            medical_record_no: true,
            created_at: true,
          },
        },
      },
      orderBy: [{ record_date: "desc" }, { session_number: "desc" }],
    });

    const mapped = rows.map((r) => {
      const p = r.patients;
      const displayNo = patientDisplayNo({
        id: p.id,
        medical_record_no: p.medical_record_no,
        created_at: p.created_at,
      });
      return {
        id: r.id,
        patientId: r.patient_id,
        patientName: `${p.first_name} ${p.last_name}`.trim(),
        displayNo,
        sessionNumber: r.session_number,
        recordDateLabel: formatDateId(r.record_date),
        therapistName: r.therapist_name?.trim() || "—",
        complaints: r.complaints?.trim() || "—",
        program: r.program_therapy?.trim() || "—",
        assessment: r.assessment?.trim() || "—",
        motorikAdl: r.motorik_adl?.trim() || "—",
        noteClinical: r.note_clinical?.trim() || "",
        noteProgress: r.note_progress?.trim() || "",
        isActive: r.is_active,
      };
    });

    return { ok: true, connectionHint: null, rows: mapped };
  } catch (err) {
    return {
      ok: false,
      connectionHint: formatPostgresConnectionHelp(err),
      rows: [],
    };
  }
}
