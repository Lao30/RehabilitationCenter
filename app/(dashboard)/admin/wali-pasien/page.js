import GuardiansPageClient from "@/components/dashboard/admin/GuardiansPageClient";
import { loadGuardiansDashboard } from "@/lib/admin-guardians";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Manajemen wali pasien",
};

export default async function Page() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { stats, rows, ok, connectionHint } = await loadGuardiansDashboard(
    session.branchId,
  );

  return (
    <GuardiansPageClient
      stats={stats}
      rows={rows}
      connectionHint={ok === false ? connectionHint : null}
    />
  );
}
