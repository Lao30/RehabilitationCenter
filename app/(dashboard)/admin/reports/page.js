import ReportsPageClient from "@/components/dashboard/admin/ReportsPageClient";
import { loadAdminReports } from "@/lib/admin-reports";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Laporan & Statistik",
};

/** @param {{ searchParams: Promise<{ year?: string }> }} props */
export default async function Page({ searchParams }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const sp = await searchParams;
  const rawYear = sp?.year != null ? Number.parseInt(String(sp.year), 10) : NaN;
  const year = Number.isFinite(rawYear) ? rawYear : new Date().getFullYear();

  const {
    year: resolvedYear,
    visitTrend,
    paymentSlices,
    topDiagnoses,
    stats,
    ok,
    connectionHint,
  } = await loadAdminReports(session.branchId, year);

  return (
    <ReportsPageClient
      year={resolvedYear}
      visitTrend={visitTrend}
      paymentSlices={paymentSlices}
      topDiagnoses={topDiagnoses}
      stats={stats}
      connectionHint={ok === false ? connectionHint : null}
    />
  );
}
