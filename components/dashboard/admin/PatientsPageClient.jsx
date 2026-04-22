"use client";

import gsap from "gsap";
import Link from "next/link";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

const iconWheelchair = (
  <svg className="h-7 w-7 text-teal-600" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="8" cy="16" r="3" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="17" cy="17" r="2.2" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M8 13V8a2 2 0 0 1 2-2h3M13 6l2 2M11 11h5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

function IconBtn({ label, children, tone = "slate" }) {
  const toneRing =
    tone === "rose"
      ? "border-rose-200 text-rose-600 hover:bg-rose-50"
      : tone === "sky"
        ? "border-sky-200 text-sky-600 hover:bg-sky-50"
        : "border-slate-200 text-slate-600 hover:bg-slate-50";
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled
      className={`inline-flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-lg border bg-white/90 opacity-70 ${toneRing}`}
    >
      {children}
    </button>
  );
}

/**
 * @typedef {{ id: string, displayNo: string, fullName: string, addressLine: string, ageLabel: string, disabilityLabels: string[], barthelScore: number | null, therapistName: string, isActive: boolean }} PatientRow
 */

/** @param {{ rows: PatientRow[], connectionHint: string | null }} props */
export default function PatientsPageClient({ rows, connectionHint }) {
  const [query, setQuery] = useState("");
  const tableWrapRef = useRef(null);
  const didAnimate = useRef(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.displayNo.toLowerCase().includes(q) ||
        r.addressLine.toLowerCase().includes(q),
    );
  }, [rows, query]);

  useLayoutEffect(() => {
    const root = tableWrapRef.current;
    if (!root || didAnimate.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      didAnimate.current = true;
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(root.querySelectorAll("[data-patient-row]"), {
        opacity: 0,
        x: -18,
        duration: 0.44,
        stagger: 0.055,
        ease: "power2.out",
      });
      gsap.from(root.querySelectorAll("[data-barthel-fill]"), {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.72,
        stagger: 0.07,
        ease: "power2.out",
        delay: 0.12,
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

      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {iconWheelchair}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.65rem]">
              Data Pasien
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Daftar pasien untuk cabang Anda
            </p>
          </div>
        </div>
        <Link
          href="/admin/patients/new"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-500/25 transition hover:bg-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
        >
          <span className="text-lg leading-none" aria-hidden>
            +
          </span>
          Tambah Pasien
        </Link>
      </header>

      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm shadow-slate-200/50 backdrop-blur-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-slate-800">
            <span className="tabular-nums text-slate-900">{filtered.length}</span>{" "}
            Pasien
          </p>
          <label className="relative w-full sm:max-w-xs">
            <span className="sr-only">Cari pasien</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama pasien..."
              className="w-full rounded-xl border border-slate-200/90 bg-slate-50/80 py-2.5 pl-3 pr-3 text-sm text-slate-900 outline-none ring-sky-200/60 placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-2"
            />
          </label>
        </div>

        <div ref={tableWrapRef} className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/90 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="whitespace-nowrap px-4 py-3.5">No. Pasien</th>
                <th className="min-w-[200px] px-4 py-3.5">Nama</th>
                <th className="whitespace-nowrap px-4 py-3.5">Usia</th>
                <th className="min-w-[160px] px-4 py-3.5">Jenis disabilitas</th>
                <th className="min-w-[140px] px-4 py-3.5">Barthel</th>
                <th className="min-w-[140px] px-4 py-3.5">Terapis</th>
                <th className="whitespace-nowrap px-4 py-3.5">Status</th>
                <th className="whitespace-nowrap px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-14 text-center text-sm text-slate-500"
                  >
                    {rows.length === 0
                      ? "Belum ada data pasien. Tambahkan pasien baru atau periksa koneksi database."
                      : "Tidak ada pasien yang cocok dengan pencarian."}
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr
                    key={r.id}
                    data-patient-row
                    className="bg-white/80 transition hover:bg-sky-50/40"
                  >
                    <td className="whitespace-nowrap px-4 py-4 font-medium text-sky-700">
                      {r.displayNo}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-900">{r.fullName}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                        {r.addressLine}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-700">
                      {r.ageLabel}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {r.disabilityLabels.length === 0 ? (
                          <span className="text-xs text-slate-400">—</span>
                        ) : (
                          r.disabilityLabels.map((lab) => (
                            <span
                              key={lab}
                              className="inline-flex rounded-full border border-sky-200/90 bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-800"
                            >
                              {lab}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {r.barthelScore == null ? (
                        <span className="text-xs text-slate-400">—</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 min-w-[72px] flex-1 overflow-hidden rounded-full bg-slate-100">
                            <div
                              data-barthel-fill
                              className="h-full rounded-full bg-linear-to-r from-emerald-400 to-emerald-600"
                              style={{ width: `${r.barthelScore}%` }}
                            />
                          </div>
                          <span className="w-10 shrink-0 text-right text-xs font-semibold tabular-nums text-slate-700">
                            {r.barthelScore}%
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="max-w-[180px] px-4 py-4 text-slate-800">
                      <span className="line-clamp-2">{r.therapistName}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          r.isActive
                            ? "border border-emerald-200/90 bg-emerald-50 text-emerald-900"
                            : "border border-slate-200/90 bg-slate-100 text-slate-600"
                        }`}
                      >
                        {r.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right">
                      <div className="inline-flex justify-end gap-1.5">
                        <IconBtn label="Ubah (segera)" tone="sky">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor">
                            <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </IconBtn>
                        <IconBtn label="Lihat ringkasan (segera)">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor">
                            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" />
                          </svg>
                        </IconBtn>
                        <IconBtn label="Kartu ID (segera)">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor">
                            <rect x="4" y="5" width="16" height="14" rx="2" />
                            <path d="M8 14h4M8 10h8" strokeLinecap="round" />
                          </svg>
                        </IconBtn>
                        <IconBtn label="Hapus (segera)" tone="rose">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" stroke="currentColor">
                            <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
