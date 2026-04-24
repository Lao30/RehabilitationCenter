import RehabRecordsPageClient from "@/components/dashboard/admin/RehabRecordsPageClient";
import {
  listPatientOptionsForRehab,
  listRehabilitationRecords,
} from "@/lib/admin-rehab-records";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Rekam rehabilitasi",
};

export default async function Page() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const [{ rows, ok, connectionHint }, { options: patientOptions }] =
    await Promise.all([
      listRehabilitationRecords(session.branchId),
      listPatientOptionsForRehab(session.branchId),
    ]);

  return (
    <RehabRecordsPageClient
      rows={rows}
      patientOptions={patientOptions}
      connectionHint={ok === false ? connectionHint : null}
    />
  );
}
