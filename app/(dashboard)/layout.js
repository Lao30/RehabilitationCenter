import Link from "next/link";
import { DM_Sans, Fraunces } from "next/font/google";
import { redirect } from "next/navigation";
import AuthBackdrop from "@/components/auth/AuthBackdrop";
import LogoutButton from "@/components/auth/LogoutButton";
import SuperAdminSidebarNav from "@/components/dashboard/SuperAdminSidebarNav";
import { ROLES } from "@/constants/roles";
import { getNavForRole, formatRoleLabel } from "@/lib/rbac";
import { getSession } from "@/lib/session";

const saDisplay = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sa-display",
});

const saSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sa-sans",
});

export default async function DashboardLayout({ children }) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const links = getNavForRole(session.role);
  const isSuperAdmin = session.role === ROLES.SUPER_ADMIN;

  return (
    <div
      className={
        isSuperAdmin
          ? `${saDisplay.variable} ${saSans.variable} ${saSans.className} flex min-h-screen text-slate-800`
          : "flex min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50/80 dark:from-sky-950 dark:via-sky-950 dark:to-slate-950"
      }
    >
      {isSuperAdmin ? (
        <aside className="relative flex w-[17.5rem] shrink-0 flex-col overflow-hidden border-r border-sky-200/70">
          <AuthBackdrop />
          <div className="relative z-10 flex min-h-full flex-1 flex-col">
            <div className="border-b border-sky-200/60 bg-white/25 p-5 backdrop-blur-[2px]">
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex h-1.5 w-1.5 rounded-full bg-sky-400"
                  aria-hidden
                />
                <span
                  className="inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400"
                  aria-hidden
                />
                <span
                  className="inline-flex h-1.5 w-1.5 rounded-full bg-sky-300"
                  aria-hidden
                />
                <p
                  className={`${saDisplay.className} ml-1 text-[0.6rem] font-semibold uppercase tracking-[0.42em] text-sky-700/95`}
                >
                  RCMS
                </p>
              </div>
              <p className="mt-3 truncate text-sm font-semibold text-slate-900">
                {session.name}
              </p>
              <p className="text-xs font-medium text-sky-800/85">
                {formatRoleLabel(session.role)}
              </p>
              {session.branchId ? (
                <p className="mt-1 text-xs text-sky-700/75">
                  Branch: {session.branchId}
                </p>
              ) : null}
            </div>
            <SuperAdminSidebarNav links={links} />
            <div className="mt-auto border-t border-sky-200/60 bg-white/20 p-4 backdrop-blur-[2px]">
              <p className="text-[11px] leading-relaxed text-sky-700/80">
                One calm console for branches, therapists, and the people you
                help.
              </p>
            </div>
          </div>
        </aside>
      ) : (
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
      )}

      <div
        className={
          isSuperAdmin
            ? "relative flex min-w-0 flex-1 flex-col bg-[linear-gradient(165deg,#ffffff_0%,#f0f9ff_38%,#f8fafc_100%)]"
            : "flex min-w-0 flex-1 flex-col"
        }
      >
        {isSuperAdmin ? (
          <>
            <div
              className="pointer-events-none absolute right-0 top-0 h-52 w-52 bg-gradient-to-bl from-sky-300/25 to-transparent blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute bottom-0 left-0 h-48 w-full bg-gradient-to-t from-cyan-100/35 to-transparent lg:h-56"
              aria-hidden
            />
          </>
        ) : null}
        <header
          className={
            isSuperAdmin
              ? "relative z-10 flex h-14 shrink-0 items-center justify-end border-b border-sky-200/60 bg-white/55 px-6 backdrop-blur-md"
              : "flex h-14 shrink-0 items-center justify-end border-b border-sky-100/90 bg-white/80 px-6 backdrop-blur-sm dark:border-sky-800/60 dark:bg-sky-950/30"
          }
        >
          <LogoutButton
            className={isSuperAdmin ? "border-sky-200/80 bg-white/95" : ""}
          />
        </header>
        <main
          className={
            isSuperAdmin
              ? "relative z-10 flex-1 overflow-auto px-5 py-8 sm:px-8 lg:px-10"
              : "flex-1 overflow-auto p-6"
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}
