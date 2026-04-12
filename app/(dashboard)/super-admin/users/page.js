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
import { formatRoleLabel } from "@/lib/rbac";
import { SEED_USERS } from "@/lib/seed-users";

export const metadata = {
  title: "Users & roles",
};

export default function Page() {
  return (
    <div className="space-y-8">
      <SuperAdminPageHeader
        eyebrow="Directory"
        title="Users & roles"
        description="Create accounts, assign Super Admin, Admin, or Therapist roles, and link users to a branch. Demo data comes from seed users until persistence is connected."
        actions={
          <>
            <BtnSecondary disabled title="Coming soon">
              Import CSV
            </BtnSecondary>
            <BtnPrimary disabled title="Coming soon">
              Add user
            </BtnPrimary>
          </>
        }
      />

      <SuperAdminPanel
        title="All users"
        description="Platform-wide directory. Actions are disabled in this preview build."
        flush
      >
        <SuperAdminToolbar>
          <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="search"
              name="q"
              placeholder="Search by name or email…"
              disabled
              className="min-w-0 flex-1 rounded-xl border border-sky-200/90 bg-white/90 px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400"
              aria-label="Search users"
            />
            <p className="shrink-0 text-xs font-medium text-sky-700">
              {SEED_USERS.length} users
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
            {SEED_USERS.map((u) => (
              <TR key={u.id}>
                <TD className="font-medium">{u.name}</TD>
                <TD className="text-slate-600">{u.email}</TD>
                <TD>
                  <RoleBadge role={u.role} />
                </TD>
                <TD className="text-slate-600">
                  {getBranchLabel(u.branchId)}
                </TD>
                <TD className="text-right">
                  <div className="flex justify-end gap-2">
                    <BtnSecondary className="!py-1.5 !text-xs" disabled>
                      Edit
                    </BtnSecondary>
                  </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </DataTable>
      </SuperAdminPanel>

      <SuperAdminPanel title="Role reference" description="What each role can access in RCMS.">
        <dl className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-sky-200/80 bg-white/45 p-4 shadow-sm shadow-sky-200/35 backdrop-blur-md">
            <dt className="text-xs font-semibold uppercase tracking-wider text-violet-800">
              {formatRoleLabel(ROLES.SUPER_ADMIN)}
            </dt>
            <dd className="mt-2 text-xs leading-relaxed text-slate-600">
              Full platform control: branches, users, settings, reports, and
              logs.
            </dd>
          </div>
          <div className="rounded-2xl border border-sky-200/80 bg-white/45 p-4 shadow-sm shadow-sky-200/35 backdrop-blur-md">
            <dt className="text-xs font-semibold uppercase tracking-wider text-sky-800">
              {formatRoleLabel(ROLES.ADMIN)}
            </dt>
            <dd className="mt-2 text-xs leading-relaxed text-slate-600">
              Day-to-day operations for one branch: patients, sessions, queue,
              and schedule.
            </dd>
          </div>
          <div className="rounded-2xl border border-sky-200/80 bg-white/45 p-4 shadow-sm shadow-sky-200/35 backdrop-blur-md">
            <dt className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              {formatRoleLabel(ROLES.THERAPIST)}
            </dt>
            <dd className="mt-2 text-xs leading-relaxed text-slate-600">
              Clinical workflows: assigned patients, sessions, and personal
              schedule.
            </dd>
          </div>
        </dl>
      </SuperAdminPanel>
    </div>
  );
}
