"use client";

import gsap from "gsap";
import Link from "next/link";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { deactivateGuardian } from "@/app/(dashboard)/admin/wali-pasien/actions";

const iconGroup = (
  <svg className="h-7 w-7 text-sky-600" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M16 11a3 3 0 1 0-6 0 3 3 0 0 0 6 0zM8 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM4 20v-1a4 4 0 0 1 4-4h2M20 20v-1a4 4 0 0 0-4-4h-2"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
    />
  </svg>
);

/** @param {{ icon: import('react').ReactNode, value: number, label: string, ring: string }} props */
function StatCard({ icon, value, label, ring }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm ${ring}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-xl p-2.5">{icon}</div>
        <p className="text-3xl font-semibold tabular-nums tracking-tight text-slate-900">
          {value}
        </p>
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
    </div>
  );
}

function IconAction({ label, children, disabled = true }) {
  return (
    <button
      type="button"
      title={disabled ? `${label} (segera)` : label}
      disabled={disabled}
      className="inline-flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg border border-slate-200/90 bg-white text-slate-500 opacity-65"
      aria-label={label}
    >
      {children}
    </button>
  );
}

/**
 * @param {{
 *   stats: { total: number, active: number, linkedPatients: number, inactive: number },
 *   rows: Array<{
 *     id: string,
 *     fullName: string,
 *     initials: string,
 *     email: string,
 *     phone: string,
 *     relationship: string,
 *     lastLoginLabel: string | null,
 *     patients: Array<{ id: string, shortName: string }>,
 *     branchLabel: string,
 *     isActive: boolean,
 *   }>,
 *   connectionHint: string | null,
 * }} props
 */
export default function GuardiansPageClient({ stats, rows, connectionHint }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const statsRef = useRef(null);
  const tableRef = useRef(null);
  const didStats = useRef(false);
  const didTable = useRef(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const matchQ =
        !q ||
        r.fullName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q);
      const matchS =
        statusFilter === "all" ||
        (statusFilter === "active" && r.isActive) ||
        (statusFilter === "inactive" && !r.isActive);
      return matchQ && matchS;
    });
  }, [rows, query, statusFilter]);

  useLayoutEffect(() => {
    const root = statsRef.current;
    if (!root || didStats.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      didStats.current = true;
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from(root.querySelectorAll("[data-stat-card]"), {
        opacity: 0,
        y: 22,
        duration: 0.48,
        stagger: 0.08,
        ease: "power2.out",
      });
    }, root);
    didStats.current = true;
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const root = tableRef.current;
    if (!root || didTable.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      didTable.current = true;
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from(root.querySelectorAll("[data-guardian-row]"), {
        opacity: 0,
        y: 14,
        duration: 0.4,
        stagger: 0.045,
        ease: "power2.out",
        delay: 0.08,
      });
    }, root);
    didTable.current = true;
    return () => ctx.revert();
  }, []);

  return (
    <div className="space-y-8">
      {connectionHint ? (
        <div className="rounded-2xl border border-amber-200/90 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
          {connectionHint}
        </div>
      ) : null}

      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {iconGroup}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.65rem]">
              Manajemen Wali Pasien
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Wali, kontak, hubungan ke pasien, dan status akun
            </p>
          </div>
        </div>
        <Link
          href="/admin/wali-pasien/new"
          className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-600/25 transition hover:bg-sky-700"
        >
          <span className="text-lg leading-none" aria-hidden>
            +
          </span>
          Tambah Wali Baru
        </Link>
      </header>

      <section ref={statsRef} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div data-stat-card>
          <StatCard
            label="Total Wali"
            value={stats.total}
            ring="ring-1 ring-sky-100/80"
            icon={
              <span className="text-sky-600">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M16 11a3 3 0 1 0-6 0M8 13a2.5 2.5 0 1 0 0-5M4 20v-1a4 4 0 0 1 4-4h2M20 20v-1a4 4 0 0 0-4-4h-2" strokeLinecap="round" />
                </svg>
              </span>
            }
          />
        </div>
        <div data-stat-card>
          <StatCard
            label="Wali Aktif"
            value={stats.active}
            ring="ring-1 ring-emerald-100/80"
            icon={
              <span className="text-emerald-600">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M9 12l2 2 4-4M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            }
          />
        </div>
        <div data-stat-card>
          <StatCard
            label="Total Pasien Terhubung"
            value={stats.linkedPatients}
            ring="ring-1 ring-amber-100/80"
            icon={
              <span className="text-amber-600">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M10 13a5 5 0 0 0 7.54.54M14 11a5 5 0 0 0-7.54-.54M8 8l-2-2m8 8l2 2M4 4l2 2m12 12l2 2" strokeLinecap="round" />
                </svg>
              </span>
            }
          />
        </div>
        <div data-stat-card>
          <StatCard
            label="Nonaktif"
            value={stats.inactive}
            ring="ring-1 ring-violet-100/80"
            icon={
              <span className="text-violet-600">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M16 7a4 4 0 1 0-8 0M4 21v-2a4 4 0 0 1 4-4h1M18 21v-2a4 4 0 0 0-3-3.87M14 7h1M6 7H5" strokeLinecap="round" />
                </svg>
              </span>
            }
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-md shadow-slate-200/40">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-slate-800">
            <span className="tabular-nums text-slate-900">{rows.length}</span> Wali Terdaftar
          </p>
          <div className="flex w-full flex-col gap-2 sm:max-w-xl sm:flex-row sm:items-center">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama / email..."
              className="w-full flex-1 rounded-xl border border-slate-200/90 bg-slate-50/80 px-3 py-2 text-sm outline-none ring-sky-200/50 focus:border-sky-300 focus:bg-white focus:ring-2"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full shrink-0 rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none ring-sky-200/50 focus:border-sky-300 focus:ring-2 sm:w-40"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>
        </div>

        <div ref={tableRef} className="overflow-x-auto">
          <table className="w-full min-w-[1040px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/90 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">No</th>
                <th className="min-w-[200px] px-4 py-3">Nama wali</th>
                <th className="min-w-[160px] px-4 py-3">Kontak</th>
                <th className="px-4 py-3">Hubungan</th>
                <th className="min-w-[200px] px-4 py-3">Pasien terhubung</th>
                <th className="px-4 py-3">Cabang</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                    {rows.length === 0
                      ? "Belum ada wali. Tambah wali baru untuk memulai."
                      : "Tidak ada data yang cocok dengan filter."}
                  </td>
                </tr>
              ) : (
                filtered.map((r, i) => (
                  <tr
                    key={r.id}
                    data-guardian-row
                    className="bg-white/80 transition hover:bg-sky-50/40"
                  >
                    <td className="px-4 py-4 tabular-nums text-slate-600">{i + 1}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-sky-500 to-cyan-600 text-xs font-bold text-white">
                          {r.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">{r.fullName}</p>
                          <p className="truncate text-xs text-slate-500">{r.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-2 text-slate-700">
                        <span className="mt-0.5 text-slate-400" aria-hidden>
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                            <path d="M6 4h4l2 3h6a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" strokeLinecap="round" />
                          </svg>
                        </span>
                        <div>
                          <p className="font-medium">{r.phone}</p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            Login: {r.lastLoginLabel ?? "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full border border-slate-200/90 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {r.relationship}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {r.patients.length === 0 ? (
                          <span className="text-xs text-slate-400">—</span>
                        ) : (
                          <>
                            {r.patients.map((p) => (
                              <span
                                key={p.id}
                                className="inline-flex rounded-full border border-sky-200/90 bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-900"
                              >
                                {p.shortName}
                              </span>
                            ))}
                            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-sky-600 px-1.5 text-[11px] font-bold text-white">
                              {r.patients.length}
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full border border-slate-200/90 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {r.branchLabel}
                      </span>
                    </td>
                    <td className="px-4 py-4">
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
                    <td className="px-4 py-4 text-right">
                      <div className="inline-flex flex-wrap justify-end gap-1">
                        <IconAction label="Lihat">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </IconAction>
                        <IconAction label="Ubah">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                            <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5z" strokeLinecap="round" />
                          </svg>
                        </IconAction>
                        <IconAction label="Hubungkan">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                            <path d="M10 13a5 5 0 0 0 7.54.54M14 11a5 5 0 0 0-7.54-.54" strokeLinecap="round" />
                          </svg>
                        </IconAction>
                        <IconAction label="Reset kata sandi">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                            <path d="M15.5 9.5L18 7M10.5 14.5L8 17M12 12l-2 2m2-2l2 2M5 12a7 7 0 1 1 14 0c0 1.5-.5 3-1.5 4L17 17" strokeLinecap="round" />
                          </svg>
                        </IconAction>
                        <IconAction label="Blokir">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M5 5l14 14" strokeLinecap="round" />
                          </svg>
                        </IconAction>
                        {r.isActive ? (
                          <form action={deactivateGuardian} className="inline">
                            <input type="hidden" name="id" value={r.id} />
                            <button
                              type="submit"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200/90 bg-white text-rose-600 transition hover:bg-rose-50"
                              title="Nonaktifkan"
                              aria-label="Nonaktifkan wali"
                            >
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                                <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" strokeLinecap="round" />
                              </svg>
                            </button>
                          </form>
                        ) : (
                          <IconAction label="Hapus">
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                              <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" strokeLinecap="round" />
                            </svg>
                          </IconAction>
                        )}
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
