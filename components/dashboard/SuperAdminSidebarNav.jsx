"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** @param {{ links: Array<{ href: string, label: string }> }} props */
export default function SuperAdminSidebarNav({ links }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
      {links.map((l) => {
        const active =
          pathname === l.href ||
          (l.href !== "/super-admin/dashboard" &&
            pathname.startsWith(l.href));
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-white/70 text-sky-900 shadow-sm shadow-sky-200/50 ring-1 ring-sky-200/80"
                : "text-sky-900/85 hover:bg-white/45"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
