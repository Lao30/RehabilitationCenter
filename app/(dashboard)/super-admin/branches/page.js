import {
  BtnPrimary,
  BtnSecondary,
  DataTable,
  SuperAdminPageHeader,
  SuperAdminPanel,
  SuperAdminToolbar,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/dashboard/super-admin/PageChrome";
import { DEMO_BRANCHES } from "@/lib/demo-org";

export const metadata = {
  title: "Branches",
};

export default function Page() {
  const active = DEMO_BRANCHES.filter((b) => b.active).length;

  return (
    <div className="space-y-8">
      <SuperAdminPageHeader
        eyebrow="Organization"
        title="Branches"
        description="Configure locations, codes, and contact details. Each branch can host its own admins and therapists."
        actions={
          <>
            <BtnSecondary disabled title="Coming soon">
              Export list
            </BtnSecondary>
            <BtnPrimary disabled title="Coming soon">
              Add branch
            </BtnPrimary>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-sky-100/90 bg-white/90 p-5 shadow-sm dark:border-sky-800/50 dark:bg-sky-950/35">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Total branches
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-sky-950 dark:text-sky-50">
            {DEMO_BRANCHES.length}
          </p>
        </div>
        <div className="rounded-2xl border border-sky-100/90 bg-white/90 p-5 shadow-sm dark:border-sky-800/50 dark:bg-sky-950/35">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Active
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-sky-950 dark:text-sky-50">
            {active}
          </p>
        </div>
        <div className="rounded-2xl border border-sky-100/90 bg-white/90 p-5 shadow-sm dark:border-sky-800/50 dark:bg-sky-950/35">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Inactive
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-sky-950 dark:text-sky-50">
            {DEMO_BRANCHES.length - active}
          </p>
        </div>
      </div>

      <SuperAdminPanel
        title="Branch directory"
        description="Demo list aligned with seed user branch IDs."
        flush
      >
        <SuperAdminToolbar>
          <input
            type="search"
            placeholder="Search branches…"
            disabled
            className="min-w-0 flex-1 rounded-lg border border-sky-200/90 bg-white px-3 py-2 text-sm dark:border-sky-700 dark:bg-sky-950"
            aria-label="Search branches"
          />
        </SuperAdminToolbar>
        <DataTable>
          <THead>
            <tr>
              <TH>Branch</TH>
              <TH>Code</TH>
              <TH>City</TH>
              <TH>Phone</TH>
              <TH>Status</TH>
              <TH className="text-right">Actions</TH>
            </tr>
          </THead>
          <TBody>
            {DEMO_BRANCHES.map((b) => (
              <TR key={b.id}>
                <TD>
                  <div>
                    <p className="font-medium text-sky-950 dark:text-sky-50">
                      {b.name}
                    </p>
                    <p className="text-xs text-sky-600 dark:text-sky-400">
                      {b.id}
                    </p>
                  </div>
                </TD>
                <TD className="font-mono text-xs">{b.code}</TD>
                <TD>{b.city}</TD>
                <TD className="text-sky-800 dark:text-sky-200">{b.phone}</TD>
                <TD>
                  {b.active ? (
                    <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      Inactive
                    </span>
                  )}
                </TD>
                <TD className="text-right">
                  <BtnSecondary className="!py-1.5 !text-xs" disabled>
                    Edit
                  </BtnSecondary>
                </TD>
              </TR>
            ))}
          </TBody>
        </DataTable>
      </SuperAdminPanel>
    </div>
  );
}
