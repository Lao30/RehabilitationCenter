import Link from "next/link";
import { redirect } from "next/navigation";
import { isBranchUuid } from "@/lib/admin-dashboard";
import { getSession } from "@/lib/session";
import NewTherapistForm from "../NewTherapistForm";

export const metadata = {
  title: "Tambah terapis",
};

export default async function NewTherapistPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const canCreate = isBranchUuid(session.branchId);

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            Data terapis
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Tambah terapis
          </h1>
        </div>
        <Link
          href="/admin/terapis"
          className="text-sm font-semibold text-sky-700 hover:text-sky-900"
        >
          ← Kembali
        </Link>
      </div>

      {!canCreate ? (
        <div className="rounded-2xl border border-amber-200/90 bg-amber-50/90 px-4 py-4 text-sm text-amber-950">
          Akun admin perlu <strong className="font-semibold">branch UUID</strong>{" "}
          untuk menambah terapis.
        </div>
      ) : (
        <NewTherapistForm />
      )}
    </div>
  );
}
