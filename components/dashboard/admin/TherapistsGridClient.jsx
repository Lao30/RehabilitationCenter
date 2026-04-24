"use client";

import gsap from "gsap";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import { deleteTherapist } from "@/app/(dashboard)/admin/terapis/actions";

const iconPerson = (
  <svg className="h-7 w-7 text-teal-600" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
    <path
      d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

const avatarRing = [
  "bg-linear-to-br from-sky-500 to-cyan-600",
  "bg-linear-to-br from-teal-500 to-emerald-600",
  "bg-linear-to-br from-violet-500 to-purple-600",
  "bg-linear-to-br from-cyan-500 to-sky-600",
];

/**
 * @typedef {{
 *   id: string,
 *   displayName: string,
 *   initials: string,
 *   specialization: string,
 *   scheduleDays: string,
 *   scheduleHours: string,
 *   branchLabel: string,
 *   totalPatients: number,
 * }} TherapistCard
 */

/** @param {{ rows: TherapistCard[], connectionHint: string | null }} props */
export default function TherapistsGridClient({ rows, connectionHint }) {
  const gridRef = useRef(null);
  const didEnter = useRef(false);

  useLayoutEffect(() => {
    const root = gridRef.current;
    if (!root || didEnter.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      didEnter.current = true;
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from(root.querySelectorAll("[data-therapist-card]"), {
        opacity: 0,
        y: 36,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, root);
    didEnter.current = true;
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
          {iconPerson}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.65rem]">
              Data Terapis
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Jadwal kerja dan ringkasan pasien per terapis
            </p>
          </div>
        </div>
        <Link
          href="/admin/terapis/new"
          className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-2xl bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-500/25 transition hover:scale-[1.02] hover:bg-teal-600 active:scale-[0.99]"
        >
          <span className="text-lg leading-none" aria-hidden>
            +
          </span>
          Tambah Terapis
        </Link>
      </header>

      {rows.length === 0 ? (
        <p className="rounded-3xl border border-slate-200/80 bg-white/90 px-6 py-14 text-center text-sm text-slate-500 shadow-sm">
          Belum ada data terapis. Klik{" "}
          <strong className="font-semibold text-slate-700">Tambah Terapis</strong>{" "}
          untuk entri pertama.
        </p>
      ) : (
        <div
          ref={gridRef}
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
        >
          {rows.map((t, i) => (
            <TherapistCard key={t.id} t={t} avatarClass={avatarRing[i % avatarRing.length]} />
          ))}
        </div>
      )}
    </div>
  );
}

/** @param {{ t: TherapistCard, avatarClass: string }} props */
function TherapistCard({ t, avatarClass }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = cardRef.current;
    if (!el || reduce) return;

    const onEnter = () => {
      gsap.to(el, {
        y: -5,
        boxShadow: "0 18px 40px -12px rgba(15, 23, 42, 0.18)",
        duration: 0.28,
        ease: "power2.out",
      });
    };
    const onLeave = () => {
      gsap.to(el, {
        y: 0,
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.06)",
        duration: 0.22,
        ease: "power2.out",
      });
    };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      gsap.killTweensOf(el);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <article
      ref={cardRef}
      data-therapist-card
      className="flex flex-col rounded-3xl border border-slate-200/85 bg-white p-5 shadow-sm"
      style={{ boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.06)" }}
    >
      <div className="flex gap-3 border-b border-slate-100 pb-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-md ${avatarClass}`}
        >
          {t.initials}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold leading-snug text-slate-900">{t.displayName}</h2>
          <p className="mt-1 text-sm font-medium text-sky-700">{t.specialization}</p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Jadwal
          </dt>
          <dd className="mt-0.5 font-medium text-slate-800">{t.scheduleDays}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Jam
          </dt>
          <dd className="mt-0.5 font-medium text-slate-800">{t.scheduleHours}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Cabang
          </dt>
          <dd className="mt-0.5 font-medium text-slate-800">{t.branchLabel}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Total pasien
          </dt>
          <dd className="mt-0.5 text-lg font-bold tabular-nums text-slate-900">
            {t.totalPatients}
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="inline-flex rounded-full border border-emerald-200/90 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-900">
          Aktif
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled
            title="Segera hadir"
            className="inline-flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-lg border border-sky-200/90 bg-white text-sky-600 opacity-60"
            aria-label="Ubah"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <form action={deleteTherapist}>
            <input type="hidden" name="id" value={t.id} />
            <button
              type="submit"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200/90 bg-white text-rose-600 transition hover:bg-rose-50"
              aria-label="Nonaktifkan terapis"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}
