import Link from "next/link";
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
    <div className="rounded-2xl border border-sky-100/90 bg-white/90 p-5 shadow-sm backdrop-blur-sm dark:border-sky-800/50 dark:bg-sky-950/35">
      <p className="text-xs font-semibold uppercase tracking-wider text-sky-600/90 dark:text-sky-400/90">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-sky-950 dark:text-sky-50">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-xs text-sky-700/75 dark:text-sky-300/70">
          {hint}
        </p>
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
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
          Platform overview
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-sky-950 dark:text-sky-50">
          Super Admin dashboard
        </h1>
        <p className="max-w-2xl text-sky-800/90 dark:text-sky-200/85">
          High-level view of tenants, people, and infrastructure. Figures below
          use the current demo directory until the database is wired for live
          data.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-sky-900 dark:text-sky-100">
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
        <h2 className="text-sm font-semibold text-sky-900 dark:text-sky-100">
          Infrastructure
        </h2>
        <div
          className={`rounded-2xl border p-5 shadow-sm backdrop-blur-sm ${
            db.ok
              ? "border-emerald-200/90 bg-emerald-50/80 dark:border-emerald-800/50 dark:bg-emerald-950/30"
              : "border-amber-200/90 bg-amber-50/80 dark:border-amber-800/50 dark:bg-amber-950/30"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-700/90 dark:text-sky-300/85">
                Database
              </p>
              <p className="mt-1 text-lg font-semibold text-sky-950 dark:text-sky-50">
                {db.ok ? "Connected" : "Not available"}
              </p>
              <p className="mt-1 max-w-xl text-sm text-sky-800/90 dark:text-sky-200/80">
                {db.detail}
              </p>
            </div>
            <span
              className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ${
                db.ok
                  ? "bg-emerald-600/15 text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-100"
                  : "bg-amber-600/15 text-amber-950 dark:bg-amber-400/15 dark:text-amber-50"
              }`}
            >
              {db.ok ? "Healthy" : "Check .env.local"}
            </span>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-sky-900 dark:text-sky-100">
          Quick actions
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {quickLinks.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-2xl border border-sky-100/90 bg-white/90 p-4 shadow-sm transition hover:border-sky-300/90 hover:shadow-md dark:border-sky-800/50 dark:bg-sky-950/35 dark:hover:border-sky-600/60"
              >
                <span className="text-sm font-semibold text-sky-950 group-hover:text-sky-800 dark:text-sky-50 dark:group-hover:text-sky-100">
                  {item.title}
                </span>
                <span className="mt-1 text-xs text-sky-700/85 dark:text-sky-300/75">
                  {item.description}
                </span>
                <span className="mt-3 text-xs font-medium text-sky-600 group-hover:text-sky-700 dark:text-sky-400 dark:group-hover:text-sky-300">
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
