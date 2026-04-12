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
        <div className="rounded-2xl border border-sky-200/80 bg-white/55 p-5 shadow-sm shadow-sky-200/40 backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
            Total branches
          </p>
          <p className="sa-panel-title mt-2 text-3xl font-semibold tabular-nums text-slate-900">
            {DEMO_BRANCHES.length}
          </p>
        </div>
        <div className="rounded-2xl border border-sky-200/80 bg-white/55 p-5 shadow-sm shadow-sky-200/40 backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
            Active
          </p>
          <p className="sa-panel-title mt-2 text-3xl font-semibold tabular-nums text-slate-900">
            {active}
          </p>
        </div>
        <div className="rounded-2xl border border-sky-200/80 bg-white/55 p-5 shadow-sm shadow-sky-200/40 backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
            Inactive
          </p>
          <p className="sa-panel-title mt-2 text-3xl font-semibold tabular-nums text-slate-900">
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
            className="min-w-0 flex-1 rounded-xl border border-sky-200/90 bg-white/90 px-3 py-2 text-sm text-slate-900"
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
                    <p className="font-medium text-slate-900">
                      {b.name}
                    </p>
                    <p className="text-xs text-sky-700">
                      {b.id}
                    </p>
                  </div>
                </TD>
                <TD className="font-mono text-xs">{b.code}</TD>
                <TD>{b.city}</TD>
                <TD className="text-slate-600">{b.phone}</TD>
                <TD>
                  {b.active ? (
                    <span className="inline-flex rounded-full border border-emerald-200/90 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-900">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full border border-slate-200/90 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
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
