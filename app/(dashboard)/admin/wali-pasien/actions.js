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
export async function createGuardian(_prev, formData) {
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

  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const relationship = String(formData.get("relationship") ?? "").trim();
  if (!fullName || !email || !phone || !relationship) {
    return { ok: false, error: "Nama, email, telepon, dan hubungan wajib diisi." };
  }

  const patientIds = formData
    .getAll("patient_ids")
    .map((x) => String(x).trim())
    .filter(Boolean);

  for (const pid of patientIds) {
    const p = await prisma.patients.findFirst({
      where: { id: pid, branch_id: branchId },
      select: { id: true },
    });
    if (!p) {
      return { ok: false, error: "Salah satu pasien tidak valid untuk cabang ini." };
    }
  }

  try {
    const guardian = await prisma.guardians.create({
      data: {
        branch_id: branchId,
        full_name: fullName,
        email,
        phone,
        relationship,
        is_active: true,
      },
      select: { id: true },
    });

    if (patientIds.length > 0) {
      await prisma.guardian_patients.createMany({
        data: patientIds.map((patient_id) => ({
          guardian_id: guardian.id,
          patient_id,
        })),
      });
    }

    revalidatePath("/admin/wali-pasien");
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal menyimpan.";
    if (msg.includes("Unique constraint")) {
      return { ok: false, error: "Email wali sudah terdaftar di cabang ini." };
    }
    return { ok: false, error: msg };
  }

  redirect("/admin/wali-pasien");
}

/** @param {FormData} formData */
export async function deactivateGuardian(formData) {
  const session = await getSession();
  if (!session || session.role !== ROLES.ADMIN) redirect("/login");
  const branchId = session.branchId;
  if (!isBranchUuid(branchId)) return;

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const row = await prisma.guardians.findFirst({
    where: { id, branch_id: branchId },
    select: { id: true },
  });
  if (!row) return;

  await prisma.guardians.update({
    where: { id },
    data: { is_active: false },
  });
  revalidatePath("/admin/wali-pasien");
  redirect("/admin/wali-pasien");
}
