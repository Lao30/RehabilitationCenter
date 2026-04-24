"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isBranchUuid } from "@/lib/admin-dashboard";
import { ROLES } from "@/constants/roles";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

/** @param {FormData} formData */
export async function callQueueEntry(formData) {
  const session = await getSession();
  if (!session || session.role !== ROLES.ADMIN) redirect("/login");
  const branchId = session.branchId;
  if (!isBranchUuid(branchId)) return;

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const row = await prisma.queue_entries.findFirst({
    where: { id, branch_id: branchId, status: "waiting" },
    select: { id: true },
  });
  if (!row) return;

  await prisma.queue_entries.update({
    where: { id },
    data: { status: "called", called_at: new Date() },
  });
  revalidatePath("/admin/queue");
  redirect("/admin/queue");
}

/** @param {FormData} formData */
export async function finishQueueEntry(formData) {
  const session = await getSession();
  if (!session || session.role !== ROLES.ADMIN) redirect("/login");
  const branchId = session.branchId;
  if (!isBranchUuid(branchId)) return;

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const row = await prisma.queue_entries.findFirst({
    where: { id, branch_id: branchId, status: "called" },
    select: { id: true },
  });
  if (!row) return;

  await prisma.queue_entries.update({
    where: { id },
    data: { status: "completed" },
  });
  revalidatePath("/admin/queue");
  redirect("/admin/queue");
}

/**
 * @param {unknown} _prev
 * @param {FormData} formData
 */
export async function createQueueEntry(_prev, formData) {
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

  const notes = String(formData.get("notes") ?? "").trim() || null;

  try {
    await prisma.queue_entries.create({
      data: {
        branch_id: branchId,
        patient_id: patientId,
        status: "waiting",
        notes,
      },
    });
    revalidatePath("/admin/queue");
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal menyimpan.";
    return { ok: false, error: msg };
  }

  redirect("/admin/queue");
}
