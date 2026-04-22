"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createTherapist } from "./actions";

export default function NewTherapistForm() {
  const [state, formAction, pending] = useActionState(createTherapist, null);

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
        <label htmlFor="display_name" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Nama lengkap & gelar
        </label>
        <input
          id="display_name"
          name="display_name"
          required
          placeholder="Ni Made Dewi, AMd.FT"
          className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="specialization" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Spesialisasi
        </label>
        <input
          id="specialization"
          name="specialization"
          required
          placeholder="Fisioterapi"
          className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="schedule_days" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Jadwal (hari)
          </label>
          <input
            id="schedule_days"
            name="schedule_days"
            required
            placeholder="Senin, Rabu, Jumat"
            className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="schedule_hours" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Jam kerja
          </label>
          <input
            id="schedule_hours"
            name="schedule_hours"
            required
            placeholder="08:00 - 14:00"
            className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="branch_label" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Cabang (label)
          </label>
          <input
            id="branch_label"
            name="branch_label"
            defaultValue="Pusat"
            className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="total_patients" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total pasien
          </label>
          <input
            id="total_patients"
            name="total_patients"
            type="number"
            min={0}
            defaultValue={0}
            className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-2xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-teal-600 disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : "Simpan terapis"}
        </button>
        <Link
          href="/admin/terapis"
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200/90 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
