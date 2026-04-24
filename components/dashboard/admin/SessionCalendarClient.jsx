"use client";

import gsap from "gsap";
import moment from "moment";
import "moment/locale/id";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import { addBranchHoliday, deleteBranchHoliday } from "@/app/(dashboard)/admin/schedule/actions";

moment.locale("id");
const localizer = momentLocalizer(moment);

/** @param {Date} d */
function localYmd(d) {
  const y = d.getFullYear();
  return `${y}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const calendarMessages = {
  allDay: "Sepanjang hari",
  previous: "‹",
  next: "›",
  today: "Hari ini",
  month: "Bulan",
  week: "Minggu",
  work_week: "Minggu kerja",
  day: "Hari",
  agenda: "Daftar",
  date: "Tanggal",
  time: "Waktu",
  event: "Sesi",
  showMore: (n) => `+${n} lagi`,
};

/**
 * @typedef {{ id: string, title: string, startIso: string, endIso: string, color: string }} CalendarEventDto
 * @typedef {{ id: string, name: string, dateKey: string }} HolidayDto
 * @typedef {{ displayName: string, color: string }} LegendItem
 */

const iconCal = (
  <svg className="h-8 w-8 shrink-0 text-sky-600" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M4 9h16M9 5V3M15 5V3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/**
 * @param {{
 *   events: CalendarEventDto[],
 *   holidays: HolidayDto[],
 *   therapistLegend: LegendItem[],
 *   connectionHint: string | null,
 * }} props
 */
export default function SessionCalendarClient({
  events: initialEvents,
  holidays,
  therapistLegend,
  connectionHint,
}) {
  const rootRef = useRef(null);
  const didAnimate = useRef(false);
  const [showHolidayForm, setShowHolidayForm] = useState(false);

  const holidayKeys = useMemo(() => new Set(holidays.map((h) => h.dateKey)), [holidays]);

  const events = useMemo(
    () =>
      initialEvents.map((e) => ({
        id: e.id,
        title: e.title,
        start: new Date(e.startIso),
        end: new Date(e.endIso),
        color: e.color,
      })),
    [initialEvents],
  );

  const todayKey = localYmd(new Date());
  const upcomingHolidays = useMemo(() => {
    return [...holidays]
      .filter((h) => h.dateKey >= todayKey)
      .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
      .slice(0, 24);
  }, [holidays, todayKey]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || didAnimate.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      didAnimate.current = true;
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from(root.querySelectorAll("[data-cal-animate]"), {
        opacity: 0,
        y: 14,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
      });
    }, root);
    didAnimate.current = true;
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="mx-auto max-w-7xl space-y-4 px-4 py-6 sm:px-6">
      {connectionHint ? (
        <div
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          role="status"
        >
          {connectionHint}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" data-cal-animate>
        <div className="flex items-center gap-3">
          {iconCal}
          <h1 className="text-2xl font-semibold tracking-tight text-sky-950">Kalender Sesi</h1>
        </div>
        <button
          type="button"
          onClick={() => setShowHolidayForm((v) => !v)}
          className="inline-flex items-center justify-center rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          + Tandai Hari Libur
        </button>
      </div>

      {showHolidayForm ? (
        <div
          data-cal-animate
          className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm ring-1 ring-sky-100/80"
        >
          <h2 className="mb-3 text-sm font-semibold text-sky-900">Tambah hari libur</h2>
          <form action={addBranchHoliday} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <label className="block min-w-40 flex-1 text-sm">
              <span className="mb-1 block text-sky-800/80">Tanggal</span>
              <input
                required
                type="date"
                name="holiday_date"
                className="w-full rounded-lg border border-sky-200 bg-white px-3 py-2 text-sky-950 shadow-inner outline-none focus:border-teal-400"
              />
            </label>
            <label className="block min-w-48 flex-2 text-sm">
              <span className="mb-1 block text-sky-800/80">Nama</span>
              <input
                required
                type="text"
                name="name"
                maxLength={200}
                placeholder="Contoh: Hari Raya Nyepi"
                className="w-full rounded-lg border border-sky-200 bg-white px-3 py-2 text-sky-950 shadow-inner outline-none focus:border-teal-400"
              />
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setShowHolidayForm(false)}
                className="rounded-lg border border-sky-200 bg-white px-4 py-2 text-sm font-medium text-sky-800 hover:bg-sky-50"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-4">
        <div
          data-cal-animate
          className="lg:col-span-3 rounded-2xl border border-sky-100 bg-white p-3 shadow-md ring-1 ring-sky-100/60 sm:p-4"
        >
          <div className="rbc-wrapper h-[min(70vh,640px)] min-h-[420px]">
            <Calendar
              style={{ height: "100%" }}
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              titleAccessor="title"
              defaultView={Views.MONTH}
              views={[Views.MONTH, Views.WEEK, Views.AGENDA]}
              messages={calendarMessages}
              popup
              eventPropGetter={(ev) => ({
                style: {
                  backgroundColor: ev.color,
                  borderColor: ev.color,
                  color: "#0f172a",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                },
              })}
              dayPropGetter={(date) => {
                const key = localYmd(date);
                if (holidayKeys.has(key)) {
                  return {
                    style: { backgroundColor: "#fffbeb" },
                  };
                }
                return {};
              }}
            />
          </div>
        </div>

        <aside className="space-y-4 lg:col-span-1">
          <div
            data-cal-animate
            className="rounded-2xl border border-sky-100 bg-white p-4 shadow-md ring-1 ring-sky-100/60"
          >
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-sky-800/90">
              Hari libur
            </h2>
            {upcomingHolidays.length === 0 ? (
              <p className="text-sm text-sky-700/70">Belum ada hari libur mendatang.</p>
            ) : (
              <ul className="space-y-2">
                {upcomingHolidays.map((h) => (
                  <li
                    key={h.id}
                    className="flex items-start gap-2 rounded-lg border border-amber-100 bg-amber-50/90 px-3 py-2 text-sm text-amber-950"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-amber-950/90">
                        {moment(h.dateKey, "YYYY-MM-DD").format("D MMM YYYY")}
                      </div>
                      <div className="text-amber-900/85">{h.name}</div>
                    </div>
                    <form action={deleteBranchHoliday} className="shrink-0">
                      <input type="hidden" name="id" value={h.id} />
                      <button
                        type="submit"
                        className="rounded p-1 text-rose-600 hover:bg-rose-100"
                        title="Hapus"
                        aria-label="Hapus hari libur"
                      >
                        ×
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div
            data-cal-animate
            className="rounded-2xl border border-sky-100 bg-white p-4 shadow-md ring-1 ring-sky-100/60"
          >
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-sky-800/90">
              Legenda terapis
            </h2>
            {therapistLegend.length === 0 ? (
              <p className="text-sm text-sky-700/70">Belum ada data terapis aktif.</p>
            ) : (
              <ul className="space-y-2">
                {therapistLegend.map((t) => (
                  <li key={t.displayName} className="flex items-center gap-2 text-sm text-sky-900">
                    <span
                      className="h-3.5 w-3.5 shrink-0 rounded-sm shadow-sm ring-1 ring-black/10"
                      style={{ backgroundColor: t.color }}
                      aria-hidden
                    />
                    <span className="leading-snug">{t.displayName}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
