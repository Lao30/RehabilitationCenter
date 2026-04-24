"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ROLES } from "@/constants/roles";
import { isBranchUuid } from "@/lib/admin-dashboard";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

/** @param {FormData} formData */
export async function addBranchHoliday(formData) {
  const session = await getSession();
  if (!session || session.role !== ROLES.ADMIN) redirect("/login");
  const branchId = session.branchId;
  if (!isBranchUuid(branchId)) return;

  const dateStr = String(formData.get("holiday_date") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  if (!dateStr || !name) return;

  const parts = dateStr.split("-").map((x) => Number.parseInt(x, 10));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return;
  const [y, mo, da] = parts;
  if (mo < 1 || mo > 12 || da < 1 || da > 31 || y < 2000 || y > 2100) return;
  const holidayDate = new Date(Date.UTC(y, mo - 1, da, 12, 0, 0, 0));

  await prisma.branch_holidays.create({
    data: {
      branch_id: branchId,
      holiday_date: holidayDate,
      name,
    },
  });
  revalidatePath("/admin/schedule");
  redirect("/admin/schedule");
}

/** @param {FormData} formData */
export async function deleteBranchHoliday(formData) {
  const session = await getSession();
  if (!session || session.role !== ROLES.ADMIN) redirect("/login");
  const branchId = session.branchId;
  if (!isBranchUuid(branchId)) return;

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  await prisma.branch_holidays.deleteMany({
    where: { id, branch_id: branchId },
  });
  revalidatePath("/admin/schedule");
  redirect("/admin/schedule");
}
