import {
  BtnPrimary,
  BtnSecondary,
  DataTable,
  RoleBadge,
  SuperAdminPageHeader,
  SuperAdminPanel,
  SuperAdminToolbar,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/dashboard/super-admin/PageChrome";
import { ROLES } from "@/constants/roles";
import { getBranchLabel } from "@/lib/demo-org";
import { SEED_USERS } from "@/lib/seed-users";

export const metadata = {
  title: "Therapists (org-wide)",
};

export default function Page() {
  const therapists = SEED_USERS.filter((u) => u.role === ROLES.THERAPIST);

  return (
    <div className="space-y-8">
      <SuperAdminPageHeader
        eyebrow="Workforce"
        title="Therapists"
        description="Org-wide view of therapist accounts and branch placement. Scheduling and caseload tools will layer on top of this directory."
        actions={
          <>
            <BtnSecondary disabled title="Coming soon">
              Export roster
            </BtnSecondary>
            <BtnPrimary disabled title="Coming soon">
              Invite therapist
            </BtnPrimary>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-sky-100/90 bg-white/90 p-5 shadow-sm dark:border-sky-800/50 dark:bg-sky-950/35">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Therapists
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-sky-950 dark:text-sky-50">
            {therapists.length}
          </p>
        </div>
        <div className="rounded-2xl border border-sky-100/90 bg-white/90 p-5 shadow-sm dark:border-sky-800/50 dark:bg-sky-950/35 sm:col-span-2 lg:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Note
          </p>
          <p className="mt-2 text-sm text-sky-800 dark:text-sky-200">
            Capacity targets, specialties, and license expiry will appear here
            once profiles are stored in the database.
          </p>
        </div>
      </div>

      <SuperAdminPanel
        title="Therapist roster"
        description="Users with the Therapist role. Demo data from seed users."
        flush
      >
        <SuperAdminToolbar>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="search"
              placeholder="Search therapists…"
              disabled
              className="min-w-0 flex-1 rounded-lg border border-sky-200/90 bg-white px-3 py-2 text-sm dark:border-sky-700 dark:bg-sky-950"
              aria-label="Search therapists"
            />
            <p className="text-xs text-sky-600 dark:text-sky-400">
              {therapists.length} listed
            </p>
          </div>
        </SuperAdminToolbar>
        <DataTable>
          <THead>
            <tr>
              <TH>Name</TH>
              <TH>Email</TH>
              <TH>Role</TH>
              <TH>Branch</TH>
              <TH className="text-right">Actions</TH>
            </tr>
          </THead>
          <TBody>
            {therapists.map((u) => (
              <TR key={u.id}>
                <TD className="font-medium">{u.name}</TD>
                <TD className="text-sky-800 dark:text-sky-200">{u.email}</TD>
                <TD>
                  <RoleBadge role={u.role} />
                </TD>
                <TD>{getBranchLabel(u.branchId)}</TD>
                <TD className="text-right">
                  <div className="flex justify-end gap-2">
                    <BtnSecondary className="!py-1.5 !text-xs" disabled>
                      Profile
                    </BtnSecondary>
                    <BtnSecondary className="!py-1.5 !text-xs" disabled>
                      Reassign
                    </BtnSecondary>
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </DataTable>
      </SuperAdminPanel>
    </div>
  );
}
