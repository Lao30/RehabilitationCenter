import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";
import { getNavForRole, formatRoleLabel } from "@/lib/rbac";
import { getSession } from "@/lib/session";

export default async function DashboardLayout({ children }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const links = getNavForRole(session.role);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50/80 dark:from-sky-950 dark:via-sky-950 dark:to-slate-950">
      <aside className="flex w-56 shrink-0 flex-col border-r border-sky-100/90 bg-white/90 backdrop-blur-sm dark:border-sky-800/60 dark:bg-sky-950/40">
        <div className="border-b border-sky-100/90 p-4 dark:border-sky-800/60">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            RCMS
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-sky-950 dark:text-sky-50">
            {session.name}
          </p>
          <p className="text-xs text-sky-700/80 dark:text-sky-300/80">
            {formatRoleLabel(session.role)}
          </p>
          {session.branchId ? (
            <p className="mt-1 text-xs text-sky-600/70 dark:text-sky-400/70">
              Branch: {session.branchId}
            </p>
          ) : null}
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-sky-900 transition hover:bg-sky-100/90 dark:text-sky-100 dark:hover:bg-sky-900/50"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-end border-b border-sky-100/90 bg-white/80 px-6 backdrop-blur-sm dark:border-sky-800/60 dark:bg-sky-950/30">
          <LogoutButton />
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
