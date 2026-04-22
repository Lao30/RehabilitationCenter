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
export async function createTherapist(_prev, formData) {
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

  const displayName = String(formData.get("display_name") ?? "").trim();
  const specialization = String(formData.get("specialization") ?? "").trim();
  const scheduleDays = String(formData.get("schedule_days") ?? "").trim();
  const scheduleHours = String(formData.get("schedule_hours") ?? "").trim();
  if (!displayName || !specialization || !scheduleDays || !scheduleHours) {
    return { ok: false, error: "Nama, spesialisasi, jadwal, dan jam wajib diisi." };
  }

  const branchLabel =
    String(formData.get("branch_label") ?? "").trim() || "Pusat";
  const totalRaw = formData.get("total_patients");
  let totalPatients = 0;
  if (totalRaw != null && String(totalRaw).trim() !== "") {
    const n = parseInt(String(totalRaw), 10);
    if (!Number.isNaN(n) && n >= 0) totalPatients = n;
  }

  try {
    await prisma.therapists.create({
      data: {
        branch_id: branchId,
        display_name: displayName,
        specialization,
        schedule_days: scheduleDays,
        schedule_hours: scheduleHours,
        branch_label: branchLabel,
        total_patients: totalPatients,
        is_active: true,
      },
    });
    revalidatePath("/admin/terapis");
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal menyimpan.";
    return { ok: false, error: msg };
  }

  redirect("/admin/terapis");
}

/** @param {FormData} formData */
export async function deleteTherapist(formData) {
  const session = await getSession();
  if (!session || session.role !== ROLES.ADMIN) redirect("/login");
  const branchId = session.branchId;
  if (!isBranchUuid(branchId)) return;

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const row = await prisma.therapists.findFirst({
    where: { id, branch_id: branchId },
    select: { id: true },
  });
  if (!row) return;

  await prisma.therapists.update({
    where: { id },
    data: { is_active: false },
  });
  revalidatePath("/admin/terapis");
  redirect("/admin/terapis");
}
