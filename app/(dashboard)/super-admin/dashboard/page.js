import Link from "next/link";
import { SuperAdminPageHeader } from "@/components/dashboard/super-admin/PageChrome";
import { pingDatabase } from "@/lib/db";
import { ROLES } from "@/constants/roles";
import { SEED_USERS } from "@/lib/seed-users";

export const metadata = {
  title: "Super Admin · Dashboard",
};

function collectSnapshot() {
  const branchIds = new Set(
    SEED_USERS.map((u) => u.branchId).filter(Boolean),
  );
  const roleCounts = {
    [ROLES.SUPER_ADMIN]: 0,
    [ROLES.ADMIN]: 0,
    [ROLES.THERAPIST]: 0,
  };
  for (const u of SEED_USERS) {
    if (roleCounts[u.role] !== undefined) roleCounts[u.role] += 1;
  }
  return {
    branchCount: branchIds.size,
    roleCounts,
    totalUsers: SEED_USERS.length,
  };
}

async function getDbStatus() {
  try {
    await pingDatabase();
    return { ok: true, detail: "PostgreSQL reachable" };
  } catch (err) {
    const detail = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, detail };
  }
}

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-sky-200/80 bg-white/55 p-5 shadow-sm shadow-sky-200/40 backdrop-blur-md">
      <p className="text-xs font-semibold uppercase tracking-wider text-sky-600/95">
        {label}
      </p>
      <p className="sa-panel-title mt-2 text-3xl font-semibold tabular-nums tracking-tight text-slate-900">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-xs text-slate-600">{hint}</p>
      ) : null}
    </div>
  );
}

const quickLinks = [
  {
    href: "/super-admin/users",
    title: "Users & roles",
    description: "Accounts, roles, and branch assignment",
  },
  {
    href: "/super-admin/branches",
    title: "Branches",
    description: "Locations and branch defaults",
  },
  {
    href: "/super-admin/therapists",
    title: "Therapists",
    description: "Capacity and assignments across branches",
  },
  {
    href: "/super-admin/reports",
    title: "Reports",
    description: "Cross-branch analytics and exports",
  },
  {
    href: "/super-admin/settings",
    title: "Settings",
    description: "Platform configuration",
  },
  {
    href: "/super-admin/logs",
    title: "System logs",
    description: "Audit trail and operational events",
  },
];

export default async function Page() {
  const snapshot = collectSnapshot();
  const db = await getDbStatus();

  return (
    <div className="space-y-10">
      <SuperAdminPageHeader
        eyebrow="Platform overview"
        title="Super Admin dashboard"
        description="High-level view of tenants, people, and infrastructure. Figures below use the current demo directory until the database is wired for live data."
      />

      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">
          Directory snapshot
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Branches"
            value={snapshot.branchCount}
            hint="Distinct branch IDs in demo accounts"
          />
          <StatCard
            label="Super admins"
            value={snapshot.roleCounts[ROLES.SUPER_ADMIN]}
          />
          <StatCard
            label="Branch admins"
            value={snapshot.roleCounts[ROLES.ADMIN]}
          />
          <StatCard
            label="Therapists"
            value={snapshot.roleCounts[ROLES.THERAPIST]}
            hint={`${snapshot.totalUsers} users total`}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">
          Infrastructure
        </h2>
        <div
          className={`rounded-2xl border p-6 shadow-sm shadow-sky-200/30 backdrop-blur-md ${
            db.ok
              ? "border-emerald-200/90 bg-emerald-50/70"
              : "border-amber-200/90 bg-amber-50/75"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Database
              </p>
              <p className="sa-panel-title mt-1 text-xl font-semibold text-slate-900">
                {db.ok ? "Connected" : "Not available"}
              </p>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-600">
                {db.detail}
              </p>
            </div>
            <span
              className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                db.ok
                  ? "border-emerald-200/90 bg-white/80 text-emerald-900"
                  : "border-amber-200/90 bg-white/80 text-amber-950"
              }`}
            >
              {db.ok ? "Healthy" : "Check .env.local"}
            </span>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">
          Quick actions
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {quickLinks.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-2xl border border-sky-200/80 bg-white/55 p-5 shadow-sm shadow-sky-200/35 backdrop-blur-md transition hover:border-sky-300/90 hover:shadow-md"
              >
                <span className="sa-panel-title text-base font-semibold text-slate-900 group-hover:text-sky-900">
                  {item.title}
                </span>
                <span className="mt-1 text-xs leading-relaxed text-slate-600">
                  {item.description}
                </span>
                <span className="mt-4 text-xs font-semibold text-sky-600 group-hover:text-sky-700">
                  Open →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
