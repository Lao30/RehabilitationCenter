"use server";

import { revalidatePath } from "next/cache";
import { ROLES } from "@/constants/roles";
import { composeWaMessageForGuardian } from "@/lib/admin-wa-notifications";
import { isBranchUuid } from "@/lib/admin-dashboard";
import { WA_TEMPLATE_OPTIONS } from "@/lib/wa-templates";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

/**
 * @param {{ guardianId: string, templateKey: string }} input
 * @returns {Promise<{ ok: true, url: string } | { ok: false, error: string }>}
 */
export async function openWhatsAppWithLog(input) {
  const session = await getSession();
  if (!session || session.role !== ROLES.ADMIN) {
    return { ok: false, error: "Tidak diizinkan." };
  }
  const branchId = session.branchId;
  if (!isBranchUuid(branchId)) {
    return { ok: false, error: "Cabang tidak valid." };
  }

  const guardianId = String(input?.guardianId ?? "").trim();
  const templateKey = String(input?.templateKey ?? "").trim();
  const allowedKeys = new Set(WA_TEMPLATE_OPTIONS.map((t) => t.key));
  if (!guardianId || !templateKey || !allowedKeys.has(templateKey)) {
    return { ok: false, error: "Pilih wali dan template." };
  }

  const composed = await composeWaMessageForGuardian(branchId, guardianId, templateKey);
  if (!composed.ok || !composed.message || !composed.digits) {
    return { ok: false, error: composed.error ?? "Gagal menyusun pesan." };
  }

  await prisma.wa_notification_logs.create({
    data: {
      branch_id: branchId,
      guardian_id: guardianId,
      recipient_name: composed.recipientName,
      recipient_phone: composed.recipientPhone || composed.digits,
      template_key: templateKey,
      message_body: composed.message,
      status: "terkirim",
    },
  });

  const text = encodeURIComponent(composed.message);
  const url = `https://wa.me/${composed.digits}?text=${text}`;

  revalidatePath("/admin/notifications");
  return { ok: true, url };
}
