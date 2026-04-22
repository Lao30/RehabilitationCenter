"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isBranchUuid } from "@/lib/admin-dashboard";
import { ROLES } from "@/constants/roles";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

/**
 * @param {unknown} _prev
 * @param {FormData} formData
 */
export async function createRehabRecord(_prev, formData) {
  const session = await getSession();
  if (!session || session.role !== ROLES.ADMIN) {
    return { ok: false, error: "Tidak diizinkan." };
  }
  const branchId = session.branchId;
  if (!isBranchUuid(branchId)) {
    return {
      ok: false,
      error:
        "Cabang belum ditetapkan pada akun (branchId UUID). Hubungi Super Admin.",
    };
  }

  const patientId = String(formData.get("patient_id") ?? "").trim();
  if (!patientId) {
    return { ok: false, error: "Pilih pasien." };
  }

  const patient = await prisma.patients.findFirst({
    where: { id: patientId, branch_id: branchId },
    select: { id: true },
  });
  if (!patient) {
    return { ok: false, error: "Pasien tidak ditemukan di cabang ini." };
  }

  const recordDateRaw = String(formData.get("record_date") ?? "").trim();
  if (!recordDateRaw) {
    return { ok: false, error: "Tanggal rekam wajib diisi." };
  }

  const sessionNoRaw = formData.get("session_number");
  const sessionNum =
    sessionNoRaw == null || String(sessionNoRaw).trim() === ""
      ? 1
      : Math.max(1, parseInt(String(sessionNoRaw), 10) || 1);

  try {
    await prisma.rehabilitation_records.create({
      data: {
        branch_id: branchId,
        patient_id: patientId,
        session_number: sessionNum,
        record_date: new Date(recordDateRaw),
        therapist_name:
          String(formData.get("therapist_name") ?? "").trim() || null,
        complaints: String(formData.get("complaints") ?? "").trim() || null,
        program_therapy:
          String(formData.get("program_therapy") ?? "").trim() || null,
        assessment: String(formData.get("assessment") ?? "").trim() || null,
        motorik_adl: String(formData.get("motorik_adl") ?? "").trim() || null,
        note_clinical: String(formData.get("note_clinical") ?? "").trim() || null,
        note_progress:
          String(formData.get("note_progress") ?? "").trim() || null,
        is_active: true,
      },
    });
    revalidatePath("/admin/rekam-rehabilitasi");
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal menyimpan.";
    return { ok: false, error: msg };
  }

  redirect("/admin/rekam-rehabilitasi");
}

/** @param {FormData} formData */
export async function deleteRehabRecord(formData) {
  const session = await getSession();
  if (!session || session.role !== ROLES.ADMIN) {
    return;
  }
  const branchId = session.branchId;
  if (!isBranchUuid(branchId)) return;

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const rec = await prisma.rehabilitation_records.findFirst({
    where: { id, branch_id: branchId },
    select: { id: true },
  });
  if (!rec) return;

  await prisma.rehabilitation_records.update({
    where: { id },
    data: { is_active: false },
  });
  revalidatePath("/admin/rekam-rehabilitasi");
  redirect("/admin/rekam-rehabilitasi");
}
