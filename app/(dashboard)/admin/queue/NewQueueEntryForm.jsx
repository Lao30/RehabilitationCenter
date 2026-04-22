"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createQueueEntry } from "./actions";

/**
 * @param {{ patientOptions: Array<{ id: string, label: string }> }} props
 */
export default function NewQueueEntryForm({ patientOptions }) {
  const [state, formAction, pending] = useActionState(createQueueEntry, null);

  return (
    <form action={formAction} className="mx-auto max-w-lg space-y-5">
      {state?.ok === false && state.error ? (
        <p
          className="rounded-xl border border-red-200/90 bg-red-50 px-3 py-2.5 text-sm text-red-900"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <div className="space-y-1.5">
        <label htmlFor="patient_id" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Pasien
        </label>
        <select
          id="patient_id"
          name="patient_id"
          required
          className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2.5 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
        >
          <option value="" disabled>
            — Pilih pasien —
          </option>
          {patientOptions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="notes" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Jenis layanan / terapi (opsional)
        </label>
        <input
          id="notes"
          name="notes"
          placeholder="Fisioterapi, Rehabilitasi Medik, …"
          className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
        />
        <p className="text-[11px] text-slate-500">
          Ditampilkan di kartu antrian jika belum ada sesi terkait.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-2xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-teal-600 disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : "Daftar ke antrian"}
        </button>
        <Link
          href="/admin/queue"
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200/90 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
