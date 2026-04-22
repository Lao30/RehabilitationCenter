import TherapistsGridClient from "@/components/dashboard/admin/TherapistsGridClient";
import { listTherapistsForAdmin } from "@/lib/admin-therapists";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Data terapis",
};

export default async function Page() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { rows, ok, connectionHint } = await listTherapistsForAdmin(
    session.branchId,
  );

  return (
    <TherapistsGridClient
      rows={rows}
      connectionHint={ok === false ? connectionHint : null}
    />
  );
}
