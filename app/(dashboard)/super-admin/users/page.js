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
import DbConnectionAlert from "@/components/dashboard/DbConnectionAlert";
import { ROLES } from "@/constants/roles";
import { formatPostgresConnectionHelp } from "@/lib/db-errors";
import { formatRoleLabel } from "@/lib/rbac";
import { displayNameFromEmail, listUsers } from "@/lib/users";

export const metadata = {
  title: "Users & roles",
};

export default async function Page() {
  let users = [];
  let dbError = null;
  try {
    users = await listUsers();
  } catch (err) {
    dbError = formatPostgresConnectionHelp(err);
  }

  return (
    <div className="space-y-8">
      <DbConnectionAlert message={dbError} />
      <SuperAdminPageHeader
        eyebrow="Directory"
        title="Users & roles"
        description="Accounts live in PostgreSQL (users table). Add or change rows with SQL or your DB client; in-app user management can be added later."
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
        description="Platform-wide directory from the database. Edit/delete actions can be wired later."
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
              {users.length} users
            </p>
          </div>
        </SuperAdminToolbar>
        <DataTable>
          <THead>
            <tr>
              <TH>Display name</TH>
              <TH>Email</TH>
              <TH>Role</TH>
              <TH className="text-right">Actions</TH>
            </tr>
          </THead>
          <TBody>
            {users.map((u) => (
              <TR key={u.id}>
                <TD className="font-medium">
                  {(u.name && String(u.name).trim()) ||
                    displayNameFromEmail(u.email)}
                </TD>
                <TD className="text-slate-600">{u.email}</TD>
                <TD>
                  <RoleBadge role={u.role} />
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
        <dl className="grid gap-4 sm:grid-cols-2">
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
        </dl>
      </SuperAdminPanel>
    </div>
  );
}
