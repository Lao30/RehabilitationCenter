import Link from "next/link";
import { redirect } from "next/navigation";
import { isBranchUuid } from "@/lib/admin-dashboard";
import { listPatientOptionsForRehab } from "@/lib/admin-rehab-records";
import { getSession } from "@/lib/session";
import NewQueueEntryForm from "../NewQueueEntryForm";

export const metadata = {
  title: "Daftar sesi antrian",
};

export default async function NewQueuePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { options: patientOptions } = await listPatientOptionsForRehab(
    session.branchId,
  );
  const canCreate = isBranchUuid(session.branchId);

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            Antrian
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Daftar sesi
          </h1>
        </div>
        <Link
          href="/admin/queue"
          className="text-sm font-semibold text-sky-700 hover:text-sky-900"
        >
          ← Kembali
        </Link>
      </div>

      {!canCreate ? (
        <div className="rounded-2xl border border-amber-200/90 bg-amber-50/90 px-4 py-4 text-sm text-amber-950">
          Akun admin perlu <strong className="font-semibold">branch UUID</strong>{" "}
          untuk menambah antrian.
        </div>
      ) : patientOptions.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/90 bg-slate-50 px-4 py-4 text-sm text-slate-700">
          Belum ada pasien.{" "}
          <Link href="/admin/patients/new" className="font-semibold text-sky-700 underline">
            Tambah pasien
          </Link>
        </div>
      ) : (
        <NewQueueEntryForm patientOptions={patientOptions} />
      )}
    </div>
  );
}
