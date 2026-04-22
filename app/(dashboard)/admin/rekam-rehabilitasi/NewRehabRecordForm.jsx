"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createRehabRecord } from "./actions";

/**
 * @param {{ patientOptions: Array<{ id: string, label: string }>, defaultPatientId?: string }} props
 */
export default function NewRehabRecordForm({ patientOptions, defaultPatientId }) {
  const [state, formAction, pending] = useActionState(createRehabRecord, null);

  return (
    <form action={formAction} className="mx-auto max-w-2xl space-y-5">
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
          <label htmlFor="patient_id" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Pasien
          </label>
          <select
            id="patient_id"
            name="patient_id"
            required
            defaultValue={defaultPatientId || ""}
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
          <label htmlFor="record_date" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Tanggal rekam
          </label>
          <input
            id="record_date"
            name="record_date"
            type="date"
            required
            className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="session_number" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Sesi ke-
          </label>
          <input
            id="session_number"
            name="session_number"
            type="number"
            min={1}
            defaultValue={1}
            className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="therapist_name" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Nama terapis
        </label>
        <input
          id="therapist_name"
          name="therapist_name"
          placeholder="Ni Made Dewi, AMd.FT"
          className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="complaints" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Keluhan
        </label>
        <textarea
          id="complaints"
          name="complaints"
          rows={2}
          className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="program_therapy" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Program terapi
        </label>
        <textarea
          id="program_therapy"
          name="program_therapy"
          rows={2}
          placeholder="Fisioterapi, Terapi Okupasi"
          className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="assessment" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Asesmen
          </label>
          <input
            id="assessment"
            name="assessment"
            placeholder="Sedang"
            className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="motorik_adl" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Motorik / ADL
          </label>
          <input
            id="motorik_adl"
            name="motorik_adl"
            placeholder="2/5 | ADL: 45%"
            className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="note_clinical" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Catatan observasi (klinis)
        </label>
        <textarea
          id="note_clinical"
          name="note_clinical"
          rows={2}
          className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="note_progress" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Catatan perkembangan (kutipan)
        </label>
        <textarea
          id="note_progress"
          name="note_progress"
          rows={2}
          className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm italic outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
        />
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-2xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-teal-600 disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : "Simpan rekam"}
        </button>
        <Link
          href="/admin/rekam-rehabilitasi"
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200/90 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
