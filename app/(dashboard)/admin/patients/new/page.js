import Link from "next/link";
import { redirect } from "next/navigation";
import { isBranchUuid } from "@/lib/admin-dashboard";
import { getSession } from "@/lib/session";
import NewPatientForm from "../NewPatientForm";

export const metadata = {
  title: "Tambah pasien",
};

export default async function NewPatientPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const canCreate = isBranchUuid(session.branchId);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
            Pasien
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Tambah pasien
          </h1>
        </div>
        <Link
          href="/admin/patients"
          className="text-sm font-semibold text-sky-700 hover:text-sky-900"
        >
          ← Kembali ke daftar
        </Link>
      </div>

      {!canCreate ? (
        <div className="rounded-2xl border border-amber-200/90 bg-amber-50/90 px-4 py-4 text-sm text-amber-950">
          Akun admin Anda belum memiliki{" "}
          <strong className="font-semibold">cabang (branch UUID)</strong> di sesi
          login. Pasien harus tergabung ke sebuah cabang. Hubungi Super Admin
          untuk penugasan cabang, lalu masuk kembali.
        </div>
      ) : (
        <NewPatientForm />
      )}
    </div>
  );
}
