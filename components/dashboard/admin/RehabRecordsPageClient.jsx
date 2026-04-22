"use client";

import gsap from "gsap";
import Link from "next/link";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { deleteRehabRecord } from "@/app/(dashboard)/admin/rekam-rehabilitasi/actions";

const iconMedical = (
  <svg className="h-7 w-7 text-teal-600" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 4v16M8 8h8M6 12h12"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * @typedef {{
 *   id: string,
 *   patientId: string,
 *   patientName: string,
 *   displayNo: string,
 *   sessionNumber: number,
 *   recordDateLabel: string,
 *   therapistName: string,
 *   complaints: string,
 *   program: string,
 *   assessment: string,
 *   motorikAdl: string,
 *   noteClinical: string,
 *   noteProgress: string,
 *   isActive: boolean,
 * }} RehabCard
 */

/** @param {{ rows: RehabCard[], patientOptions: Array<{ id: string, label: string }>, connectionHint: string | null }} props */
export default function RehabRecordsPageClient({
  rows,
  patientOptions,
  connectionHint,
}) {
  const [patientFilter, setPatientFilter] = useState("");
  const listRef = useRef(null);
  const didAnimate = useRef(false);

  const filtered = useMemo(() => {
    if (!patientFilter) return rows;
    return rows.filter((r) => r.patientId === patientFilter);
  }, [rows, patientFilter]);

  useLayoutEffect(() => {
    const root = listRef.current;
    if (!root || didAnimate.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      didAnimate.current = true;
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from(root.querySelectorAll("[data-rehab-card]"), {
        opacity: 0,
        y: 28,
        duration: 0.52,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, root);
    didAnimate.current = true;
    return () => ctx.revert();
  }, []);

  return (
    <div className="space-y-6">
      {connectionHint ? (
        <div className="rounded-2xl border border-amber-200/90 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
          {connectionHint}
        </div>
      ) : null}

      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-3">
          {iconMedical}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.65rem]">
              Rekam Rehabilitasi
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Catatan keluhan, program, asesmen, dan perkembangan pasien
            </p>
          </div>
        </div>
        <Link
          href="/admin/rekam-rehabilitasi/new"
          className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-2xl bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-500/25 transition hover:scale-[1.02] hover:bg-teal-600 active:scale-[0.99]"
        >
          <span className="text-lg leading-none" aria-hidden>
            +
          </span>
          Input Rekam
        </Link>
      </header>

      <div className="max-w-xl">
        <label htmlFor="patient-filter" className="sr-only">
          Filter pasien
        </label>
        <select
          id="patient-filter"
          value={patientFilter}
          onChange={(e) => setPatientFilter(e.target.value)}
          className="w-full rounded-2xl border border-slate-200/90 bg-white/95 px-4 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none ring-sky-200/50 focus:border-sky-300 focus:ring-2"
        >
          <option value="">Semua Pasien</option>
          {patientOptions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div ref={listRef} className="space-y-8">
        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-slate-200/80 bg-white/80 px-6 py-12 text-center text-sm text-slate-500">
            {rows.length === 0
              ? "Belum ada rekam. Gunakan tombol Input Rekam untuk menambah entri pertama."
              : "Tidak ada rekam untuk pasien yang dipilih."}
          </p>
        ) : (
          filtered.map((r) => (
            <article
              key={r.id}
              data-rehab-card
              className="relative pl-11 sm:pl-12"
            >
              <div
                className="absolute left-0 top-7 h-4 w-4 rounded-full border-4 border-sky-100 bg-sky-500 shadow-sm sm:top-8"
                aria-hidden
              />
              <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-md shadow-slate-200/40">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {r.patientName}
                    </h2>
                    <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                      <span className="text-sky-700">{r.displayNo}</span>
                      <span className="mx-2 text-slate-300">|</span>
                      <span>Sesi ke-{r.sessionNumber}</span>
                      <span className="mx-2 text-slate-300">|</span>
                      <span>{r.therapistName}</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full border border-emerald-200/90 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-900">
                      Aktif
                    </span>
                    <span className="text-sm text-slate-500">{r.recordDateLabel}</span>
                  </div>
                </div>

                <div className="grid gap-6 px-5 py-5 sm:grid-cols-2 sm:px-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Keluhan
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-800">
                        {r.complaints}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Program
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-800">
                        {r.program}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Asesmen
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-800">
                        {r.assessment}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Motorik / ADL
                      </p>
                      <p className="mt-1 text-sm font-medium text-sky-700">
                        {r.motorikAdl}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-100 px-5 py-4 sm:px-6">
                  {r.noteClinical ? (
                    <div className="flex gap-3 rounded-2xl bg-sky-50/90 px-4 py-3 text-sm leading-relaxed text-slate-800">
                      <span className="shrink-0 text-sky-600" aria-hidden>
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                        </svg>
                      </span>
                      <span>{r.noteClinical}</span>
                    </div>
                  ) : null}
                  {r.noteProgress ? (
                    <div className="flex gap-3 rounded-2xl bg-sky-50/90 px-4 py-3 text-sm leading-relaxed text-slate-800">
                      <span className="shrink-0 text-rose-500" aria-hidden>
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </span>
                      <span className="italic text-slate-700">{r.noteProgress}</span>
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2 border-t border-slate-100 px-5 py-4 sm:px-6">
                  <Link
                    href={`/admin/rekam-rehabilitasi/new?patientId=${encodeURIComponent(r.patientId)}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-600"
                  >
                    <span aria-hidden>+</span> Sesi Baru
                  </Link>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200/90 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden
                    >
                      <path d="M6 9V4h12v5M6 14H4a2 2 0 0 1-2-2v-1h20v1a2 2 0 0 1-2 2h-2M6 18h12v4H6v-4zM8 14h8v4H8v-4z" />
                    </svg>
                    Cetak
                  </button>
                  <form action={deleteRehabRecord}>
                    <input type="hidden" name="id" value={r.id} />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200/90 bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden
                      >
                        <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                      Hapus
                    </button>
                  </form>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
