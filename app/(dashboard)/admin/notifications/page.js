import WhatsAppNotificationsClient from "@/components/dashboard/admin/WhatsAppNotificationsClient";
import { loadWhatsAppNotificationsPage } from "@/lib/admin-wa-notifications";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Notifikasi WhatsApp",
};

export default async function Page() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { guardians, logs, ok, connectionHint } = await loadWhatsAppNotificationsPage(
    session.branchId,
  );

  return (
    <WhatsAppNotificationsClient
      guardians={guardians}
      logs={logs}
      connectionHint={ok === false ? connectionHint : null}
    />
  );
}
