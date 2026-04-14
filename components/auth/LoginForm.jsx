"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data.error ??
            (res.status === 403
              ? "This account cannot sign in here."
              : "Sign-in failed"),
        );
        return;
      }
      const path = data.role ? getPathForRole(data.role) : "/";
      router.push(path);
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="auth-enter">
      <header className="mb-10 lg:mb-12">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-px w-10 bg-gradient-to-r from-sky-500 to-cyan-400" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-sky-600/80">
            Secure access
          </span>
        </div>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.65rem]">
          Enter your workspace
        </h2>
        <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-slate-600">
          Use your staff email. We&apos;ll route you to the right dashboard by
          role.
        </p>
      </header>

      <form onSubmit={onSubmit} className="auth-enter-delay space-y-6">
        <div className="group relative">
          <label
            htmlFor="email"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@center.org"
            className="w-full border-0 border-b-2 border-slate-200 bg-transparent pb-3 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-0"
          />
          <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-sky-500 to-cyan-500 transition-all duration-300 group-focus-within:w-full" />
        </div>

        <div className="group relative">
          <label
            htmlFor="password"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border-0 border-b-2 border-slate-200 bg-transparent pb-3 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-0"
          />
          <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-sky-500 to-cyan-500 transition-all duration-300 group-focus-within:w-full" />
        </div>

        {error ? (
          <p
            className="rounded-lg border border-red-200/80 bg-red-50 px-3 py-2.5 text-sm text-red-900"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="group flex h-[3.25rem] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-500 text-[15px] font-semibold text-white shadow-lg shadow-sky-400/35 transition hover:brightness-105 hover:shadow-sky-400/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:brightness-100"
        >
          <span className="flex items-center gap-2">
            {pending ? (
              "Signing in…"
            ) : (
              <>
                Continue
                <svg
                  className="h-4 w-4 transition group-hover:translate-x-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </>
            )}
          </span>
        </button>
      </form>
    </div>
  );
}

/** @param {string} role */
function getPathForRole(role) {
  switch (role) {
    case "SUPER_ADMIN":
      return "/super-admin/dashboard";
    case "ADMIN":
      return "/admin/dashboard";
    default:
      return "/";
  }
}
