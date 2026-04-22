"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createGuardian } from "./actions";

/**
 * @param {{ patientOptions: Array<{ id: string, label: string }> }} props
 */
export default function NewGuardianForm({ patientOptions }) {
  const [state, formAction, pending] = useActionState(createGuardian, null);

  return (
    <form action={formAction} className="mx-auto max-w-2xl space-y-6">
      {state?.ok === false && state.error ? (
        <p
          className="rounded-xl border border-red-200/90 bg-red-50 px-3 py-2.5 text-sm text-red-900"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="full_name" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Nama lengkap wali
          </label>
          <input
            id="full_name"
            name="full_name"
            required
            className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Telepon
          </label>
          <input
            id="phone"
            name="phone"
            required
            placeholder="0812xxxxxxx"
            className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="relationship" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Hubungan dengan pasien
          </label>
          <select
            id="relationship"
            name="relationship"
            required
            className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
            defaultValue=""
          >
            <option value="" disabled>
              — Pilih —
            </option>
            <option value="Ayah">Ayah</option>
            <option value="Ibu">Ibu</option>
            <option value="Kakak">Kakak</option>
            <option value="Adik">Adik</option>
            <option value="Kakek/Nenek">Kakek / Nenek</option>
            <option value="Paman/Bibi">Paman / Bibi</option>
            <option value="Wali resmi">Wali resmi</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
      </div>

      <fieldset className="space-y-2 rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Pasien terhubung (opsional)
        </legend>
        {patientOptions.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada pasien di cabang ini.</p>
        ) : (
          <ul className="grid max-h-48 gap-2 overflow-y-auto sm:grid-cols-2">
            {patientOptions.map((p) => (
              <li key={p.id} className="flex items-center gap-2">
                <input
                  id={`p-${p.id}`}
                  name="patient_ids"
                  type="checkbox"
                  value={p.id}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor={`p-${p.id}`} className="text-sm text-slate-800">
                  {p.label}
                </label>
              </li>
            ))}
          </ul>
        )}
      </fieldset>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-sky-700 disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : "Simpan wali"}
        </button>
        <Link
          href="/admin/wali-pasien"
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200/90 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
