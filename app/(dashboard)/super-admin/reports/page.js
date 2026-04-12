import {
  BtnPrimary,
  BtnSecondary,
  SuperAdminPageHeader,
  SuperAdminPanel,
} from "@/components/dashboard/super-admin/PageChrome";

export const metadata = {
  title: "Global reports",
};

const reportCards = [
  {
    id: "utilization",
    title: "Utilization & throughput",
    description:
      "Session volume, no-shows, and therapist utilization across branches.",
    metrics: ["Last 30 days · all branches", "Exports: CSV, PDF"],
  },
  {
    id: "caseload",
    title: "Caseload & outcomes",
    description:
      "Active patients, episode length, and goal progress by program.",
    metrics: ["Rolling quarter", "Group by branch or therapist"],
  },
  {
    id: "billing",
    title: "Billing snapshot",
    description:
      "Charges, adjustments, and payer mix (when billing module is enabled).",
    metrics: ["Monthly close", "PII masked in exports"],
  },
];

export default function Page() {
  return (
    <div className="space-y-8">
      <SuperAdminPageHeader
        eyebrow="Analytics"
        title="Reports"
        description="Run cross-branch analytics and schedule recurring exports. Generation is disabled until reporting services are wired to your warehouse."
        actions={
          <>
            <BtnSecondary disabled title="Coming soon">
              Manage schedules
            </BtnSecondary>
            <BtnPrimary disabled title="Coming soon">
              New report
            </BtnPrimary>
          </>
        }
      />

      <SuperAdminPanel
        title="Quick filters"
        description="These controls preview the reporting UI; they do not query data yet."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">
              Date range
            </span>
            <select
              className="w-full rounded-lg border border-sky-200/90 bg-white px-3 py-2 text-sm dark:border-sky-700 dark:bg-sky-950"
              defaultValue="30d"
              disabled
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="qtd">Quarter to date</option>
              <option value="ytd">Year to date</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">
              Branch
            </span>
            <select
              className="w-full rounded-lg border border-sky-200/90 bg-white px-3 py-2 text-sm dark:border-sky-700 dark:bg-sky-950"
              defaultValue="all"
              disabled
            >
              <option value="all">All branches</option>
              <option value="branch-1">North River (branch-1)</option>
            </select>
          </label>
          <label className="space-y-1.5 sm:col-span-2 lg:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">
              Compare to
            </span>
            <select
              className="w-full rounded-lg border border-sky-200/90 bg-white px-3 py-2 text-sm dark:border-sky-700 dark:bg-sky-950"
              defaultValue="none"
              disabled
            >
              <option value="none">No comparison</option>
              <option value="prev">Previous period</option>
              <option value="yoy">Same period last year</option>
            </select>
          </label>
        </div>
      </SuperAdminPanel>

      <div className="grid gap-4 lg:grid-cols-3">
        {reportCards.map((r) => (
          <SuperAdminPanel key={r.id} title={r.title} description={r.description}>
            <ul className="space-y-2 text-xs text-sky-700 dark:text-sky-300">
              {r.metrics.map((m) => (
                <li key={m} className="flex gap-2">
                  <span className="text-sky-400" aria-hidden>
                    ·
                  </span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <BtnPrimary className="!text-xs" disabled>
                Generate
              </BtnPrimary>
              <BtnSecondary className="!text-xs" disabled>
                Export CSV
              </BtnSecondary>
            </div>
          </SuperAdminPanel>
        ))}
      </div>
    </div>
  );
}
