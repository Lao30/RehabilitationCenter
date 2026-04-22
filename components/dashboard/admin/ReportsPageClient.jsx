"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const cardClass =
  "rounded-2xl border border-sky-100/90 bg-white p-4 shadow-md ring-1 ring-sky-100/50 sm:p-5";

const iconDownload = (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
    <path
      d="M12 4v12m0 0 4-4m-4 4-4-4M5 19h14"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * @param {{
 *   year: number,
 *   visitTrend: { month: string, count: number }[],
 *   paymentSlices: { name: string, value: number, fill: string, key: string }[],
 *   topDiagnoses: { name: string, count: number }[],
 *   stats: {
 *     activePatients: number,
 *     sessionsThisMonth: number,
 *     avgBarthel: number | null,
 *     completedProgramPatients: number,
 *     successRatePercent: number | null,
 *   },
 *   connectionHint: string | null,
 * }} props
 */
export default function ReportsPageClient({
  year,
  visitTrend,
  paymentSlices,
  topDiagnoses,
  stats,
  connectionHint,
}) {
  const router = useRouter();

  const csvBlob = useMemo(() => {
    const lines = [];
    lines.push("Bagian,Laporan & Statistik");
    lines.push(`Tahun,${year}`);
    lines.push("");
    lines.push("Bulan,Jumlah sesi");
    for (const v of visitTrend) {
      lines.push(`${v.month},${v.count}`);
    }
    lines.push("");
    lines.push("Kategori pembayaran,Jumlah");
    if (paymentSlices.length === 0) {
      lines.push("(kosong),0");
    } else {
      for (const p of paymentSlices) {
        lines.push(`"${String(p.name).replace(/"/g, '""')}",${p.value}`);
      }
    }
    lines.push("");
    lines.push("Diagnosa,Jumlah");
    if (topDiagnoses.length === 0) {
      lines.push("(kosong),0");
    } else {
      for (const d of topDiagnoses) {
        lines.push(`"${String(d.name).replace(/"/g, '""')}",${d.count}`);
      }
    }
    lines.push("");
    lines.push("Metrik,Nilai");
    lines.push(`Total pasien aktif,${stats.activePatients}`);
    lines.push(`Total sesi bulan ini,${stats.sessionsThisMonth}`);
    lines.push(`Rata-rata Barthel,${stats.avgBarthel ?? ""}`);
    lines.push(`Pasien selesai program,${stats.completedProgramPatients}`);
    lines.push(
      `Tingkat keberhasilan antrian (%),${stats.successRatePercent ?? ""}`,
    );
    const body = `\uFEFF${lines.join("\n")}`;
    return new Blob([body], { type: "text/csv;charset=utf-8" });
  }, [year, visitTrend, paymentSlices, topDiagnoses, stats]);

  function exportCsv() {
    const url = URL.createObjectURL(csvBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan-statistik-${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const yearOptions = useMemo(() => {
    const cy = new Date().getFullYear();
    const lo = Math.min(cy - 5, year);
    const hi = Math.max(cy + 1, year);
    const out = [];
    for (let yy = lo; yy <= hi; yy += 1) {
      out.push(yy);
    }
    return out;
  }, [year]);

  const maxVisits = Math.max(1, ...visitTrend.map((v) => v.count));
  const yAxisMax = Math.ceil(maxVisits / 10) * 10 + 10;

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6">
      {connectionHint ? (
        <div
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          role="status"
        >
          {connectionHint}
        </div>
      ) : null}

      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-sky-950">
            Laporan &amp; Statistik
          </h1>
          <p className="mt-1 text-sm text-sky-800/80">
            Ringkasan sesi, pembayaran, diagnosa, dan metrik cabang.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-sky-900">
            <span className="sr-only">Tahun</span>
            <select
              value={year}
              onChange={(e) => {
                const next = e.target.value;
                router.push(`/admin/reports?year=${encodeURIComponent(next)}`);
              }}
              className="rounded-xl border border-sky-200 bg-white px-3 py-2 text-sm font-medium text-sky-950 shadow-sm outline-none focus:border-sky-400"
            >
              {yearOptions.map((yy) => (
                <option key={yy} value={yy}>
                  {yy}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-900 shadow-sm transition hover:bg-sky-50"
          >
            {iconDownload}
            Export CSV
          </button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className={cardClass}>
          <h2 className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
            Tren kunjungan sesi ({year})
          </h2>
          <div className="mt-2 h-[280px] w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="visitFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} />
                <YAxis
                  domain={[0, yAxisMax]}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    fontSize: "13px",
                  }}
                  formatter={(value) => [`${value} sesi`, "Jumlah"]}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Sesi"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  fill="url(#visitFill)"
                  dot={{ r: 3, fill: "#0ea5e9", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className={cardClass}>
          <h2 className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
            Kategori pembayaran
          </h2>
          {paymentSlices.length === 0 ? (
            <div className="flex h-[280px] flex-col items-center justify-center gap-2 px-4 text-center text-sm text-slate-500">
              <p>Belum ada data kategori pembayaran.</p>
              <p className="text-xs text-slate-400">
                Isi kolom <strong>payment_category</strong> pada data pasien (BPJS, SUBSIDI, UMUM,
                GRATIS).
              </p>
              <Link
                href="/admin/patients"
                className="text-sm font-medium text-sky-700 underline-offset-2 hover:underline"
              >
                Ke data pasien
              </Link>
            </div>
          ) : (
            <div className="mt-2 h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                  <Pie
                    data={paymentSlices}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="46%"
                    innerRadius={52}
                    outerRadius={88}
                    paddingAngle={2}
                  >
                    {paymentSlices.map((entry) => (
                      <Cell key={entry.key} fill={entry.fill} stroke="#fff" strokeWidth={1} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span className="text-xs text-slate-700">{value}</span>}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} pasien`, "Jumlah"]}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                      fontSize: "13px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className={cardClass}>
          <h2 className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
            Diagnosa terbanyak
          </h2>
          {topDiagnoses.length === 0 ? (
            <div className="flex h-[280px] items-center justify-center px-4 text-center text-sm text-slate-500">
              Belum ada data diagnosa. Isi <strong>primary_diagnosis</strong> pada pasien, atau
              data akan memakai ringkasan jenis disabilitas.
            </div>
          ) : (
            <div className="mt-2 h-[min(320px,28vh)] min-h-[240px] w-full lg:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={topDiagnoses}
                  margin={{ top: 4, right: 28, left: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={148}
                    tick={{ fontSize: 11, fill: "#334155" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) =>
                      String(v).length > 22 ? `${String(v).slice(0, 20)}…` : String(v)
                    }
                  />
                  <Tooltip
                    formatter={(value) => [`${value}`, "Jumlah"]}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                      fontSize: "13px",
                    }}
                  />
                  <Bar dataKey="count" name="Pasien" fill="#0d9488" radius={[0, 6, 6, 0]} maxBarSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className={cardClass}>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
            Statistik umum
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
              <dt className="text-slate-600">Total pasien aktif</dt>
              <dd className="font-semibold tabular-nums text-slate-900">{stats.activePatients}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
              <dt className="text-slate-600">Total sesi bulan ini</dt>
              <dd className="font-semibold tabular-nums text-slate-900">
                {stats.sessionsThisMonth}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
              <dt className="text-slate-600">Rata-rata Barthel</dt>
              <dd className="font-semibold tabular-nums text-slate-900">
                {stats.avgBarthel != null ? `${stats.avgBarthel}%` : "—"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
              <dt className="text-slate-600">Pasien selesai program</dt>
              <dd className="font-semibold tabular-nums text-slate-900">
                {stats.completedProgramPatients}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-600">Tingkat keberhasilan</dt>
              <dd className="font-semibold tabular-nums text-emerald-600">
                {stats.successRatePercent != null ? `${stats.successRatePercent}%` : "—"}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-slate-400">
            Tingkat keberhasilan dihitung dari proporsi entri antrian berstatus selesai dibanding
            seluruh entri antrian di cabang (sepanjang waktu).
          </p>
        </section>
      </div>
    </div>
  );
}
