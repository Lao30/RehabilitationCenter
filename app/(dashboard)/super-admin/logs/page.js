import {
  BtnSecondary,
  DataTable,
  LogLevelBadge,
  SuperAdminPageHeader,
  SuperAdminPanel,
  SuperAdminToolbar,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/dashboard/super-admin/PageChrome";
import { DEMO_LOG_ENTRIES } from "@/lib/demo-logs";

export const metadata = {
  title: "System logs",
};

function formatTimestamp(iso) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "medium",
    }).format(d);
  } catch {
    return iso;
  }
}

export default function Page() {
  return (
    <div className="space-y-8">
      <SuperAdminPageHeader
        eyebrow="Observability"
        title="System logs"
        description="Audit trail, API health, and background jobs. Sample entries illustrate the layout; connect your log store or SIEM for production."
        actions={
          <>
            <BtnSecondary disabled title="Coming soon">
              Export
            </BtnSecondary>
            <BtnSecondary disabled title="Coming soon">
              Stream settings
            </BtnSecondary>
          </>
        }
      />

      <SuperAdminPanel
        title="Event log"
        description="Most recent events (demo data)."
        flush
      >
        <SuperAdminToolbar>
          <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
            <input
              type="search"
              placeholder="Search message or source…"
              disabled
              className="min-w-0 flex-1 rounded-xl border border-sky-200/90 bg-white/90 px-3 py-2 text-sm text-slate-900"
              aria-label="Search logs"
            />
            <div className="flex flex-wrap gap-2">
              <select
                className="rounded-xl border border-sky-200/90 bg-white/90 px-3 py-2 text-xs font-medium text-slate-800"
                defaultValue="all"
                disabled
                aria-label="Filter by level"
              >
                <option value="all">All levels</option>
                <option value="info">Info</option>
                <option value="warn">Warn</option>
                <option value="error">Error</option>
              </select>
              <select
                className="rounded-xl border border-sky-200/90 bg-white/90 px-3 py-2 text-xs font-medium text-slate-800"
                defaultValue="24h"
                disabled
                aria-label="Time range"
              >
                <option value="1h">Last hour</option>
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
              </select>
            </div>
          </div>
        </SuperAdminToolbar>
        <DataTable>
          <THead>
            <tr>
              <TH>Time</TH>
              <TH>Level</TH>
              <TH>Source</TH>
              <TH>Message</TH>
            </tr>
          </THead>
          <TBody>
            {DEMO_LOG_ENTRIES.map((row) => (
              <TR key={row.id}>
                <TD className="whitespace-nowrap font-mono text-xs text-slate-600">
                  {formatTimestamp(row.at)}
                </TD>
                <TD>
                  <LogLevelBadge level={row.level} />
                </TD>
                <TD className="font-mono text-xs">{row.source}</TD>
                <TD className="max-w-md text-slate-600">
                  {row.message}
                </TD>
              </TR>
            ))}
          </TBody>
        </DataTable>
      </SuperAdminPanel>
    </div>
  );
}
