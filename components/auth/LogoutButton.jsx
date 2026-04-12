"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** @param {{ className?: string }} props */
export default function LogoutButton({ className = "" }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={pending}
      className={`rounded-xl border border-sky-200/90 bg-white/90 px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm shadow-sky-100/40 transition hover:bg-white disabled:opacity-60 dark:border-sky-700 dark:bg-sky-950/50 dark:text-sky-100 dark:hover:bg-sky-900/60 ${className}`}
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
