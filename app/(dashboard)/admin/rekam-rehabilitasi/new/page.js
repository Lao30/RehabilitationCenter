import Link from "next/link";
import { redirect } from "next/navigation";
import { isBranchUuid } from "@/lib/admin-dashboard";
import { listPatientOptionsForRehab } from "@/lib/admin-rehab-records";
import { getSession } from "@/lib/session";
import NewRehabRecordForm from "../NewRehabRecordForm";

export const metadata = {
  title: "Input rekam rehabilitasi",
};

/** @param {{ searchParams: Promise<{ patientId?: string }> }} props */
export default async function NewRehabRecordPage({ searchParams }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const sp = await searchParams;
  const defaultPatientId =
    typeof sp?.patientId === "string" && sp.patientId.length > 0
      ? sp.patientId
      : undefined;

  const { options: patientOptions } = await listPatientOptionsForRehab(
    session.branchId,
  );
  const canCreate = isBranchUuid(session.branchId);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            Rekam rehabilitasi
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Input rekam
          </h1>
        </div>
        <Link
          href="/admin/rekam-rehabilitasi"
          className="text-sm font-semibold text-sky-700 hover:text-sky-900"
        >
          ← Kembali
        </Link>
      </div>

      {!canCreate ? (
        <div className="rounded-2xl border border-amber-200/90 bg-amber-50/90 px-4 py-4 text-sm text-amber-950">
          Akun admin perlu <strong className="font-semibold">branch UUID</strong>{" "}
          untuk menambah rekam. Hubungi Super Admin untuk penugasan cabang.
        </div>
      ) : patientOptions.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/90 bg-slate-50 px-4 py-4 text-sm text-slate-700">
          Belum ada pasien di cabang ini.{" "}
          <Link href="/admin/patients/new" className="font-semibold text-sky-700 underline">
            Tambah pasien
          </Link>{" "}
          terlebih dahulu.
        </div>
      ) : (
        <NewRehabRecordForm
          patientOptions={patientOptions}
          defaultPatientId={
            defaultPatientId &&
            patientOptions.some((p) => p.id === defaultPatientId)
              ? defaultPatientId
              : undefined
          }
        />
      )}
    </div>
  );
}
