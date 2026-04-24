"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createPatient } from "./actions";

export default function NewPatientForm() {
  const [state, formAction, pending] = useActionState(createPatient, null);

  return (
    <form action={formAction} className="mx-auto max-w-xl space-y-6">
      {state?.ok === false && state.error ? (
        <p
          className="rounded-xl border border-red-200/90 bg-red-50 px-3 py-2.5 text-sm text-red-900"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="first_name" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Nama depan
          </label>
          <input
            id="first_name"
            name="first_name"
            required
            className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="last_name" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Nama belakang
          </label>
          <input
            id="last_name"
            name="last_name"
            required
            className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="medical_record_no" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          No. rekam medis (opsional)
        </label>
        <input
          id="medical_record_no"
          name="medical_record_no"
          placeholder="YPK-2024-001"
          className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="date_of_birth" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Tanggal lahir
        </label>
        <input
          id="date_of_birth"
          name="date_of_birth"
          type="date"
          className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="address" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Alamat
        </label>
        <textarea
          id="address"
          name="address"
          rows={2}
          className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="disability_type" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Jenis disabilitas
          </label>
          <select
            id="disability_type"
            name="disability_type"
            className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
            defaultValue=""
          >
            <option value="">— Pilih —</option>
            <option value="FISIK">Fisik</option>
            <option value="MOTORIK">Motorik</option>
            <option value="FISIK,MOTORIK">Fisik & Motorik</option>
            <option value="INTELEKTUAL">Intelektual</option>
            <option value="KOGNITIF">Kognitif</option>
            <option value="SOSIAL">Sosial</option>
          </select>
          <p className="text-[11px] text-slate-500">
            Untuk beberapa jenis, gunakan nilai gabungan dipisah koma di database nanti; di sini tersedia preset umum.
          </p>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="barthel_score" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Skor Barthel (0–100)
          </label>
          <input
            id="barthel_score"
            name="barthel_score"
            type="number"
            min={0}
            max={100}
            placeholder="65"
            className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="primary_therapist_name" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Nama terapis utama
        </label>
        <input
          id="primary_therapist_name"
          name="primary_therapist_name"
          placeholder="Ni Made Dewi, AMd.FT"
          className="w-full rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-400 focus:ring-2"
        />
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-2xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-500/25 transition hover:bg-teal-600 disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : "Simpan pasien"}
        </button>
        <Link
          href="/admin/patients"
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200/90 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
