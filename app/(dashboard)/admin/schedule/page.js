import SessionCalendarClient from "@/components/dashboard/admin/SessionCalendarClient";
import { loadSessionCalendar } from "@/lib/admin-calendar";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Kalender sesi",
};

export default async function Page() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { events, holidays, therapistLegend, ok, connectionHint } =
    await loadSessionCalendar(session.branchId);

  return (
    <SessionCalendarClient
      events={events}
      holidays={holidays}
      therapistLegend={therapistLegend}
      connectionHint={ok === false ? connectionHint : null}
    />
  );
}
