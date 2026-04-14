import { DM_Sans, Fraunces } from "next/font/google";
import { redirect } from "next/navigation";
import AuthBackdrop from "@/components/auth/AuthBackdrop";
import LogoutButton from "@/components/auth/LogoutButton";
import SuperAdminSidebarNav from "@/components/dashboard/SuperAdminSidebarNav";
import { formatRoleLabel, getNavForRole } from "@/lib/rbac";
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

  return (
    <div
      className={`${saDisplay.variable} ${saSans.variable} ${saSans.className} flex min-h-screen text-slate-800`}
    >
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
              One calm console for branches, admins, and the people you help.
            </p>
          </div>
        </div>
      </aside>

      <div className="relative flex min-w-0 flex-1 flex-col bg-[linear-gradient(165deg,#ffffff_0%,#f0f9ff_38%,#f8fafc_100%)]">
        <div
          className="pointer-events-none absolute right-0 top-0 h-52 w-52 bg-gradient-to-bl from-sky-300/25 to-transparent blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-48 w-full bg-gradient-to-t from-cyan-100/35 to-transparent lg:h-56"
          aria-hidden
        />
        <header className="relative z-10 flex h-14 shrink-0 items-center justify-end border-b border-sky-200/60 bg-white/55 px-6 backdrop-blur-md">
          <LogoutButton className="border-sky-200/80 bg-white/95" />
        </header>
        <main className="relative z-10 flex-1 overflow-auto px-5 py-8 sm:px-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
