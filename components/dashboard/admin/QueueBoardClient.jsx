"use client";

import gsap from "gsap";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { callQueueEntry, finishQueueEntry } from "@/app/(dashboard)/admin/queue/actions";

const iconQueue = (
  <svg className="h-7 w-7 text-sky-600" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M5 7h14M5 12h10M5 17h7"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <rect x="15" y="13" width="5" height="6" rx="1" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

/**
 * @typedef {{ id: string, position: number, patientName: string, therapyLabel: string, dateLabel: string }} QueueCard
 */

/**
 * @param {{
 *   waiting: QueueCard[],
 *   called: QueueCard[],
 *   completed: QueueCard[],
 *   connectionHint: string | null,
 * }} props
 */
export default function QueueBoardClient({
  waiting,
  called,
  completed,
  connectionHint,
}) {
  const boardRef = useRef(null);
  const didAnimate = useRef(false);

  useLayoutEffect(() => {
    const root = boardRef.current;
    if (!root || didAnimate.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      didAnimate.current = true;
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from(root.querySelectorAll("[data-queue-card]"), {
        opacity: 0,
        y: 20,
        duration: 0.45,
        stagger: 0.06,
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

      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {iconQueue}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.65rem]">
              Sesi &amp; Antrian
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Alur harian: menunggu → dipanggil → selesai
            </p>
          </div>
        </div>
        <Link
          href="/admin/queue/new"
          className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-2xl bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-500/25 transition hover:scale-[1.02] hover:bg-teal-600 active:scale-[0.99]"
        >
          <span className="text-lg leading-none" aria-hidden>
            +
          </span>
          Daftar Sesi
        </Link>
      </header>

      <div
        ref={boardRef}
        className="grid gap-5 lg:grid-cols-3"
      >
        <QueueColumn
          title="Menunggu"
          tone="amber"
          count={waiting.length}
          emptyHint="Tidak ada antrian menunggu"
        >
          {waiting.map((c) => (
            <article
              key={c.id}
              data-queue-card
              className="flex items-stretch gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-500 text-lg font-bold text-white shadow-md shadow-teal-500/30">
                {c.position}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{c.patientName}</p>
                <p className="mt-0.5 text-sm text-slate-600">{c.therapyLabel}</p>
                <p className="mt-1 text-xs text-slate-500">{c.dateLabel}</p>
              </div>
              <form action={callQueueEntry} className="self-center">
                <input type="hidden" name="id" value={c.id} />
                <button
                  type="submit"
                  className="rounded-xl bg-teal-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-600"
                >
                  Panggil
                </button>
              </form>
            </article>
          ))}
        </QueueColumn>

        <QueueColumn
          title="Dipanggil"
          tone="sky"
          count={called.length}
          emptyHint="Belum ada pasien dipanggil"
        >
          {called.map((c) => (
            <article
              key={c.id}
              data-queue-card
              className="flex items-stretch gap-3 rounded-2xl border border-slate-200/90 border-l-[5px] border-l-teal-500 bg-sky-50/90 p-4 shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-500 text-lg font-bold text-white shadow-md shadow-teal-500/30">
                {c.position}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{c.patientName}</p>
                <p className="mt-0.5 text-sm text-slate-600">{c.therapyLabel}</p>
                <p className="mt-1 text-xs text-slate-500">{c.dateLabel}</p>
              </div>
              <form action={finishQueueEntry} className="self-center">
                <input type="hidden" name="id" value={c.id} />
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-600"
                >
                  Selesai
                </button>
              </form>
            </article>
          ))}
        </QueueColumn>

        <QueueColumn
          title="Selesai"
          tone="slate"
          count={completed.length}
          emptyHint="Tidak ada antrian selesai"
        >
          {completed.map((c) => (
            <article
              key={c.id}
              data-queue-card
              className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700">
                  {c.position}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">{c.patientName}</p>
                  <p className="mt-0.5 text-sm text-slate-600">{c.therapyLabel}</p>
                  <p className="mt-1 text-xs text-slate-500">{c.dateLabel}</p>
                </div>
              </div>
            </article>
          ))}
        </QueueColumn>
      </div>
    </div>
  );
}

/** @param {{ title: string, tone: 'amber' | 'sky' | 'slate', count: number, emptyHint: string, children: import('react').ReactNode }} props */
function QueueColumn({ title, tone, count, emptyHint, children }) {
  const badge =
    tone === "amber"
      ? "border-amber-200/90 bg-amber-50 text-amber-950"
      : tone === "sky"
        ? "border-sky-200/90 bg-sky-50 text-sky-950"
        : "border-slate-200/90 bg-slate-50 text-slate-800";

  return (
    <section className="flex min-h-[280px] flex-col rounded-3xl border border-slate-200/70 bg-slate-50/50 p-4 shadow-inner shadow-slate-200/40">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        <span
          className={`inline-flex min-w-8 items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-bold tabular-nums ${badge}`}
        >
          {count}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3">
        {count > 0 ? (
          children
        ) : (
          <p className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-200/90 bg-white/60 px-4 py-10 text-center text-sm text-slate-500">
            {emptyHint}
          </p>
        )}
      </div>
    </section>
  );
}
