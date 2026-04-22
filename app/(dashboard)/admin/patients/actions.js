"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isBranchUuid } from "@/lib/admin-dashboard";
import { ROLES } from "@/constants/roles";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

/**
 * @param {unknown} _prevState
 * @param {FormData} formData
 */
export async function createPatient(_prevState, formData) {
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

  const first = String(formData.get("first_name") ?? "").trim();
  const last = String(formData.get("last_name") ?? "").trim();
  if (!first || !last) {
    return { ok: false, error: "Nama depan dan nama belakang wajib diisi." };
  }

  const dobRaw = String(formData.get("date_of_birth") ?? "").trim();
  const barthelRaw = formData.get("barthel_score");
  let barthel = null;
  if (barthelRaw != null && String(barthelRaw).trim() !== "") {
    const n = parseInt(String(barthelRaw), 10);
    if (!Number.isNaN(n)) barthel = Math.min(100, Math.max(0, n));
  }

  const disabilityRaw = String(formData.get("disability_type") ?? "").trim();
  const disability =
    disabilityRaw === "" ? null : disabilityRaw.toUpperCase();

  try {
    await prisma.patients.create({
      data: {
        branch_id: branchId,
        first_name: first,
        last_name: last,
        date_of_birth: dobRaw ? new Date(dobRaw) : null,
        address: String(formData.get("address") ?? "").trim() || null,
        disability_type: disability,
        barthel_score: barthel,
        primary_therapist_name:
          String(formData.get("primary_therapist_name") ?? "").trim() || null,
        medical_record_no:
          String(formData.get("medical_record_no") ?? "").trim() || null,
        is_active: true,
      },
    });
    revalidatePath("/admin/patients");
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal menyimpan.";
    return { ok: false, error: msg };
  }

  redirect("/admin/patients");
}
