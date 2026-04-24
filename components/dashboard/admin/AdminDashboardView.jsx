import Link from "next/link";
import { SuperAdminPageHeader } from "@/components/dashboard/super-admin/PageChrome";
import DbConnectionAlert from "@/components/dashboard/DbConnectionAlert";

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const statusToneClass = {
  amber:
    "border border-amber-200/90 bg-amber-50 text-amber-950",
  sky: "border border-sky-200/90 bg-sky-50 text-sky-950",
  emerald:
    "border border-emerald-200/90 bg-emerald-50 text-emerald-950",
  slate: "border border-slate-200/90 bg-slate-50 text-slate-800",
  rose: "border border-rose-200/90 bg-rose-50 text-rose-950",
};

const linkPrimaryClass =
  "inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-sky-500 via-sky-400 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-400/35 transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400";

const linkSecondaryClass =
  "inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-200/90 bg-white/90 px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm shadow-sky-100/50 transition hover:bg-sky-50/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300";

/** @param {{ cx: number, cy: number, rInner: number, rOuter: number, a0: number, a1: number }} p */
function donutSlicePath({ cx, cy, rInner, rOuter, a0, a1 }) {
  const polar = (r, a) => ({
    x: cx + r * Math.cos(a - Math.PI / 2),
    y: cy + r * Math.sin(a - Math.PI / 2),
  });
  const p1 = polar(rOuter, a1);
  const p2 = polar(rOuter, a0);
  const p3 = polar(rInner, a0);
  const p4 = polar(rInner, a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${rOuter} ${rOuter} 0 ${large} 0 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${rInner} ${rInner} 0 ${large} 1 ${p4.x} ${p4.y}`,
    "Z",
  ].join(" ");
}

/** @param {{ slices: Array<{ key: string, count: number, color: string }> }} props */
function DisabilityDonut({ slices }) {
  const cx = 88;
  const cy = 88;
  const rOuter = 72;
  const rInner = 44;
  const total = slices.reduce((a, s) => a + s.count, 0);

  if (total === 0) {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center text-center text-sm text-slate-500">
        <p>Belum ada data pasien</p>
        <p className="mt-1 text-xs">Isi kolom jenis disabilitas pada pasien untuk grafik ini.</p>
      </div>
    );
  }

  const twoPi = 2 * Math.PI;
  let angle = 0;
  const paths = [];
  for (const s of slices) {
    const frac = s.count / total;
    if (frac <= 0) continue;
    const a0 = angle;
    const a1 = angle + frac * twoPi;
    paths.push({
      key: s.key,
      d: donutSlicePath({ cx, cy, rInner, rOuter, a0, a1 }),
      fill: s.color,
    });
    angle = a1;
  }

  return (
    <svg
      viewBox="0 0 176 176"
      className="mx-auto h-44 w-44 shrink-0"
      role="img"
      aria-label="Distribusi jenis disabilitas"
    >
      {paths.map((p) => (
        <path key={p.key} d={p.d} fill={p.fill} stroke="#fff" strokeWidth="1" />
      ))}
      <circle cx={cx} cy={cy} r={rInner - 1} fill="white" className="fill-white/95" />
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        className="fill-slate-900 text-[15px] font-semibold"
        style={{ fontSize: 15 }}
      >
        {total}
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        className="fill-slate-500 text-[10px]"
        style={{ fontSize: 10 }}
      >
        pasien
      </text>
    </svg>
  );
}

/** @param {{ values: number[], max: number, year: number }} props */
function SessionsBarChart({ values, max, year }) {
  const h = 180;
  const pad = { t: 16, r: 12, b: 28, l: 36 };
  const chartW = 520;
  const chartH = h - pad.t - pad.b;
  const n = values.length;
  const gap = 6;
  const barW = (chartW - pad.l - pad.r - gap * (n - 1)) / n;
  const ticks = 4;
  const tickVals = Array.from({ length: ticks + 1 }, (_, i) =>
    Math.round((max * (ticks - i)) / ticks),
  );

  return (
    <svg
      viewBox={`0 0 ${chartW + pad.l + pad.r} ${h}`}
      className="h-[200px] w-full min-w-[280px]"
      role="img"
      aria-label={`Kunjungan sesi per bulan ${year}`}
    >
      {tickVals.map((tv, i) => {
        const y = pad.t + (chartH / ticks) * i;
        return (
          <g key={tv}>
            <line
              x1={pad.l}
              y1={y}
              x2={pad.l + chartW}
              y2={y}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
            <text
              x={pad.l - 8}
              y={y + 4}
              textAnchor="end"
              className="fill-slate-400 text-[10px]"
              style={{ fontSize: 10 }}
            >
              {tv}
            </text>
          </g>
        );
      })}
      {values.map((v, i) => {
        const bh = max > 0 ? (v / max) * chartH : 0;
        const x = pad.l + i * (barW + gap);
        const y = pad.t + chartH - bh;
        return (
          <rect
            key={MONTH_SHORT[i]}
            x={x}
            y={y}
            width={barW}
            height={Math.max(bh, v > 0 ? 2 : 0)}
            rx={4}
            fill="#7dd3fc"
            className="opacity-90"
          />
        );
      })}
      {MONTH_SHORT.map((label, i) => {
        const x = pad.l + i * (barW + gap) + barW / 2;
        return (
          <text
            key={label}
            x={x}
            y={h - 8}
            textAnchor="middle"
            className="fill-slate-500 text-[9px]"
            style={{ fontSize: 9 }}
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

/** @param {{ icon: import('react').ReactNode, value: number, label: string, footer: import('react').ReactNode, footerClass?: string }} props */
function StatCard({ icon, value, label, footer, footerClass = "" }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm shadow-slate-200/40 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-xl border border-sky-100 bg-sky-50/80 p-2 text-sky-600">
          {icon}
        </div>
        <p className="sa-panel-title text-3xl font-semibold tabular-nums tracking-tight text-slate-900">
          {value}
        </p>
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-800">{label}</p>
      <div className={`mt-2 text-xs font-medium ${footerClass}`}>{footer}</div>
    </div>
  );
}

const iconWheelchair = (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
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

const iconPerson = (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const iconQueue = (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M5 7h14M5 12h10M5 17h7"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <rect
      x="15"
      y="14"
      width="5"
      height="5"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.4"
    />
  </svg>
);

const iconChart = (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M4 19V5M4 19h16M8 15l3-4 3 2 4-6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function AdminDashboardView({ greetingName, dash }) {
  const pct = dash.stats.sessionPctVsLastMonth;
  let sessionFooter;
  if (pct == null) {
    sessionFooter = "Data sesi bulan lalu belum ada";
  } else if (pct > 0) {
    sessionFooter = (
      <>
        <span className="text-emerald-600">↑ +{pct}%</span>
        <span className="text-slate-500"> vs bulan lalu</span>
      </>
    );
  } else if (pct < 0) {
    sessionFooter = (
      <>
        <span className="text-rose-600">{pct}%</span>
        <span className="text-slate-500"> vs bulan lalu</span>
      </>
    );
  } else {
    sessionFooter = (
      <span className="text-slate-600">Stabil vs bulan lalu</span>
    );
  }

  return (
    <div className="space-y-8">
      <SuperAdminPageHeader
        eyebrow="Ringkasan operasional"
        title={`Selamat datang, ${greetingName || "Admin"}!`}
        description={dash.branchSubtitle}
        actions={
          <>
            <Link href="/admin/rekam-rehabilitasi/new" className={linkPrimaryClass}>
              <span aria-hidden>+</span> Input Rekam
            </Link>
            <Link href="/admin/queue" className={linkSecondaryClass}>
              <span className="inline-flex h-4 w-4 items-center justify-center" aria-hidden>
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                  <path
                    d="M2 4h12M2 8h8M2 12h5"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              Kelola Antrian
            </Link>
          </>
        }
      />

      <DbConnectionAlert message={dash.ok === false ? dash.connectionHint : null} />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={iconWheelchair}
          value={dash.stats.totalPatients}
          label="Total Pasien"
          footer={
            <>
              <span className="text-emerald-600">↑ +{dash.stats.patientsThisMonth}</span>
              <span className="text-slate-500"> bulan ini</span>
            </>
          }
        />
        <StatCard
          icon={iconPerson}
          value={dash.stats.therapistsActive}
          label="Terapis Aktif"
          footer={<span className="text-emerald-600">Berdasarkan jadwal sesi bulan ini</span>}
        />
        <StatCard
          icon={iconQueue}
          value={dash.stats.queueWaitingToday}
          label="Antrian Menunggu"
          footer={
            <span className="text-amber-600">
              <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-amber-500 align-middle" />{" "}
              Hari ini
            </span>
          }
        />
        <StatCard
          icon={iconChart}
          value={dash.stats.totalSessions}
          label="Total Sesi"
          footer={sessionFooter}
          footerClass=""
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
          <h2 className="sa-panel-title text-base font-semibold text-slate-900">
            Kunjungan Sesi per Bulan ({dash.monthlyYear})
          </h2>
          <div className="mt-4 overflow-x-auto">
            <SessionsBarChart
              values={dash.monthlySessions}
              max={dash.barMax}
              year={dash.monthlyYear}
            />
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
          <h2 className="sa-panel-title text-base font-semibold text-slate-900">
            Jenis Disabilitas
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Gunakan nilai FISIK, MOTORIK, INTELEKTUAL, KOGNITIF, atau SOSIAL pada field pasien.
          </p>
          <div className="mt-4 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
            <DisabilityDonut slices={dash.disabilitySlices} />
            <ul className="flex min-w-0 flex-1 flex-col gap-2 text-sm">
              {dash.disabilityLegend.map((row) => (
                <li
                  key={row.key}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2"
                >
                  <span className="flex items-center gap-2 truncate">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: row.color }}
                    />
                    <span className="truncate font-medium text-slate-800">{row.label}</span>
                  </span>
                  <span className="shrink-0 tabular-nums font-semibold text-slate-700">
                    {row.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-slate-200/70 px-5 py-4">
            <h2 className="sa-panel-title text-base font-semibold text-slate-900">
              Antrian Sesi Hari Ini
            </h2>
            <Link
              href="/admin/queue"
              className="text-xs font-semibold text-sky-600 hover:text-sky-800"
            >
              Lihat Semua
            </Link>
          </div>
          <ul className="divide-y divide-slate-100 p-3">
            {dash.queueToday.length === 0 ? (
              <li className="px-3 py-8 text-center text-sm text-slate-500">
                Tidak ada antrian untuk hari ini.
              </li>
            ) : (
              dash.queueToday.map((row) => (
                <li key={row.index} className="flex gap-3 px-3 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-sm font-semibold text-sky-800">
                    {row.index}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">{row.patientName}</p>
                    <p className="mt-0.5 text-xs text-slate-600">
                      {row.serviceLabel} — {row.therapistLabel}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Status:{" "}
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusToneClass[row.statusTone] ?? statusToneClass.slate}`}
                      >
                        {row.statusLabel}
                      </span>
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-sm">
          <div className="border-b border-slate-200/70 px-5 py-4">
            <h2 className="sa-panel-title text-base font-semibold text-slate-900">
              Jadwal Terapis Hari Ini
            </h2>
          </div>
          <ul className="divide-y divide-slate-100 p-3">
            {dash.therapistToday.length === 0 ? (
              <li className="px-3 py-8 text-center text-sm text-slate-500">
                Belum ada sesi terjadwal untuk hari ini.
              </li>
            ) : (
              dash.therapistToday.map((row) => (
                <li key={row.id} className="flex gap-3 px-3 py-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-sky-500 to-cyan-500 text-xs font-bold text-white">
                    {row.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">{row.displayName}</p>
                    <p className="mt-0.5 text-xs text-slate-600">
                      {row.specialization} — {row.hours}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Status:{" "}
                      <span className="inline-flex rounded-full border border-emerald-200/90 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-900">
                        Aktif
                      </span>
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
