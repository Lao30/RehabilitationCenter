import { ROLES } from "@/constants/roles";
import { formatRoleLabel } from "@/lib/rbac";

/** @param {{ eyebrow?: string, title: string, description?: string, actions?: import('react').ReactNode }} props */
export function SuperAdminPageHeader({ eyebrow, title, description, actions }) {
  return (
    <header className="flex flex-col gap-4 border-b border-sky-100/90 pb-8 dark:border-sky-800/60 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-sky-950 dark:text-sky-50">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-sky-800/90 dark:text-sky-200/85">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </header>
  );
}

/**
 * @param {{ title?: string, description?: string, children: import('react').ReactNode, flush?: boolean, className?: string }} props
 */
export function SuperAdminPanel({ title, description, children, flush, className = "" }) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-sky-100/90 bg-white/90 shadow-sm backdrop-blur-sm dark:border-sky-800/50 dark:bg-sky-950/35 ${className}`}
    >
      {title || description ? (
        <div className="border-b border-sky-100/80 px-5 py-4 dark:border-sky-800/50">
          {title ? (
            <h2 className="text-sm font-semibold text-sky-950 dark:text-sky-50">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-1 text-xs text-sky-700/85 dark:text-sky-300/75">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
      {flush ? children : <div className="p-5">{children}</div>}
    </section>
  );
}

/** @param {{ children: import('react').ReactNode }} props */
export function SuperAdminToolbar({ children }) {
  return (
    <div className="flex flex-col gap-3 border-b border-sky-100/80 bg-sky-50/50 px-4 py-3 dark:border-sky-800/50 dark:bg-sky-950/50 sm:flex-row sm:items-center sm:justify-between">
      {children}
    </div>
  );
}

const roleBadgeClass = {
  [ROLES.SUPER_ADMIN]:
    "bg-violet-100 text-violet-900 dark:bg-violet-900/45 dark:text-violet-100",
  [ROLES.ADMIN]:
    "bg-sky-100 text-sky-900 dark:bg-sky-900/45 dark:text-sky-100",
  [ROLES.THERAPIST]:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/45 dark:text-emerald-100",
};

/** @param {{ role: string }} props */
export function RoleBadge({ role }) {
  const cls = roleBadgeClass[role] ?? "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}
    >
      {formatRoleLabel(role)}
    </span>
  );
}

const logLevelClass = {
  info: "bg-sky-100 text-sky-900 dark:bg-sky-900/50 dark:text-sky-100",
  warn: "bg-amber-100 text-amber-950 dark:bg-amber-900/40 dark:text-amber-50",
  error: "bg-rose-100 text-rose-950 dark:bg-rose-900/40 dark:text-rose-50",
};

/** @param {{ level: 'info' | 'warn' | 'error' }} props */
export function LogLevelBadge({ level }) {
  const cls = logLevelClass[level] ?? logLevelClass.info;
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${cls}`}
    >
      {level}
    </span>
  );
}

/** @param {{ children: import('react').ReactNode, className?: string }} props */
export function BtnPrimary({ children, className = "", ...rest }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-lg bg-sky-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-sky-500 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/** @param {{ children: import('react').ReactNode, className?: string }} props */
export function BtnSecondary({ children, className = "", ...rest }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-lg border border-sky-200/90 bg-white px-3.5 py-2 text-sm font-semibold text-sky-900 shadow-sm transition hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-50 dark:hover:bg-sky-900/60 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/** @param {{ children: import('react').ReactNode }} props */
export function DataTable({ children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  );
}

/** @param {{ children: import('react').ReactNode }} props */
export function THead({ children }) {
  return (
    <thead className="border-b border-sky-100/90 bg-sky-50/80 text-xs font-semibold uppercase tracking-wider text-sky-600 dark:border-sky-800/60 dark:bg-sky-900/45 dark:text-sky-400">
      {children}
    </thead>
  );
}

/** @param {{ children: import('react').ReactNode, className?: string }} props */
export function TH({ children, className = "" }) {
  return <th className={`px-4 py-3 ${className}`}>{children}</th>;
}

/** @param {{ children: import('react').ReactNode, className?: string }} props */
export function TD({ children, className = "" }) {
  return (
    <td
      className={`border-b border-sky-100/70 px-4 py-3 text-sky-900 dark:border-sky-800/40 dark:text-sky-100 ${className}`}
    >
      {children}
    </td>
  );
}

/** @param {{ children: import('react').ReactNode }} props */
export function TBody({ children }) {
  return (
    <tbody className="align-top [&_tr:last-child>td]:border-b-0">
      {children}
    </tbody>
  );
}

/** @param {{ children: import('react').ReactNode }} props */
export function TR({ children }) {
  return <tr className="transition hover:bg-sky-50/80 dark:hover:bg-sky-900/30">{children}</tr>;
}

const inputClass =
  "w-full rounded-lg border border-sky-200/90 bg-white px-3 py-2 text-sm text-sky-950 shadow-sm placeholder:text-sky-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-50 dark:focus:border-sky-500 dark:focus:ring-sky-900";

/** @param {import('react').InputHTMLAttributes<HTMLInputElement> & { label: string }} props */
export function Field({ label, id, className = "", ...rest }) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300"
      >
        {label}
      </label>
      <input id={id} className={`${inputClass} ${className}`} {...rest} />
    </div>
  );
}

/** @param {import('react').SelectHTMLAttributes<HTMLSelectElement> & { label: string }} props */
export function SelectField({ label, id, children, className = "", ...rest }) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300"
      >
        {label}
      </label>
      <select id={id} className={`${inputClass} ${className}`} {...rest}>
        {children}
      </select>
    </div>
  );
}

/** @param {{ label: string, description?: string, defaultChecked?: boolean, disabled?: boolean }} props */
export function ToggleRow({ label, description, defaultChecked, disabled }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div>
        <p className="text-sm font-medium text-sky-950 dark:text-sky-50">{label}</p>
        {description ? (
          <p className="mt-0.5 text-xs text-sky-700/85 dark:text-sky-300/75">
            {description}
          </p>
        ) : null}
      </div>
      <label className="inline-flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          defaultChecked={defaultChecked}
          disabled={disabled}
          className="h-4 w-4 rounded border-sky-300 text-sky-600 focus:ring-sky-500 disabled:opacity-60 dark:border-sky-600 dark:bg-sky-900"
        />
        <span className="text-xs text-sky-600 dark:text-sky-400">Enabled</span>
      </label>
    </div>
  );
}
