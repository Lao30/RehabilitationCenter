import AdminDashboardView from "@/components/dashboard/admin/AdminDashboardView";
import { loadAdminDashboard } from "@/lib/admin-dashboard";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin · Dashboard",
};

export default async function Page() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const dash = await loadAdminDashboard(session.branchId);

  return <AdminDashboardView greetingName={session.name} dash={dash} />;
}
