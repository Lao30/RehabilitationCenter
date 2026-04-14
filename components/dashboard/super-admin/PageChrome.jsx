import { ROLES } from "@/constants/roles";
import { formatRoleLabel } from "@/lib/rbac";

/** @param {{ eyebrow?: string, title: string, description?: string, actions?: import('react').ReactNode }} props */
export function SuperAdminPageHeader({ eyebrow, title, description, actions }) {
  return (
    <header className="flex flex-col gap-4 border-b border-sky-200/70 pb-8 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <div className="flex items-center gap-3">
            <span className="inline-flex h-px w-10 bg-gradient-to-r from-sky-500 to-cyan-400" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-sky-600/90">
              {eyebrow}
            </p>
          </div>
        ) : null}
        <h1 className="sa-page-title mt-1 text-3xl font-medium tracking-[-0.03em] text-slate-800 sm:text-[1.85rem]">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-[15px] leading-relaxed text-slate-600">
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
      className={`overflow-hidden rounded-2xl border border-sky-200/80 bg-white/55 shadow-sm shadow-sky-200/40 backdrop-blur-md ${className}`}
    >
      {title || description ? (
        <div className="border-b border-sky-200/70 bg-white/35 px-5 py-4 backdrop-blur-sm">
          {title ? (
            <h2 className="sa-panel-title text-lg font-semibold tracking-tight text-slate-900">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
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
    <div className="flex flex-col gap-3 border-b border-sky-200/70 bg-sky-50/60 px-4 py-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
      {children}
    </div>
  );
}

const roleBadgeClass = {
  [ROLES.SUPER_ADMIN]:
    "border border-violet-200/90 bg-violet-50 text-violet-900",
  [ROLES.ADMIN]: "border border-sky-200/90 bg-sky-50 text-sky-950",
};

/** @param {{ role: string }} props */
export function RoleBadge({ role }) {
  const cls =
    roleBadgeClass[role] ??
    "border border-slate-200/90 bg-slate-50 text-slate-800";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}
    >
      {formatRoleLabel(role)}
    </span>
  );
}

const logLevelClass = {
  info: "border border-sky-200/90 bg-sky-50 text-sky-950",
  warn: "border border-amber-200/90 bg-amber-50 text-amber-950",
  error: "border border-rose-200/90 bg-rose-50 text-rose-950",
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
      className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-500 px-3.5 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-400/35 transition hover:brightness-105 hover:shadow-sky-400/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100 ${className}`}
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
      className={`inline-flex items-center justify-center rounded-2xl border border-sky-200/90 bg-white/90 px-3.5 py-2 text-sm font-semibold text-slate-800 shadow-sm shadow-sky-100/50 transition hover:bg-sky-50/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
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
    <thead className="border-b border-sky-200/80 bg-sky-50/90 text-xs font-semibold uppercase tracking-wider text-slate-500">
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
      className={`border-b border-sky-100/90 px-4 py-3 text-slate-800 ${className}`}
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
  return (
    <tr className="transition hover:bg-sky-50/70">{children}</tr>
  );
}

const fieldLabelClass =
  "text-xs font-semibold uppercase tracking-wider text-slate-500";

const inputUnderlineClass =
  "w-full border-0 border-b-2 border-slate-200 bg-transparent pb-2.5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-0 disabled:opacity-60";

const inputBoxClass =
  "w-full rounded-xl border border-sky-200/90 bg-white/90 px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200/80 disabled:cursor-not-allowed disabled:opacity-60";

/** @param {import('react').InputHTMLAttributes<HTMLInputElement> & { label: string, variant?: 'underline' | 'boxed' }} props */
export function Field({ label, id, className = "", variant = "boxed", ...rest }) {
  const inputCls = variant === "underline" ? inputUnderlineClass : inputBoxClass;
  const wrap =
    variant === "underline" ? "group relative space-y-1.5" : "space-y-1.5";
  return (
    <div className={wrap}>
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      <input id={id} className={`${inputCls} ${className}`} {...rest} />
      {variant === "underline" ? (
        <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-sky-500 to-cyan-500 transition-all duration-300 group-focus-within:w-full" />
      ) : null}
    </div>
  );
}

/** @param {import('react').SelectHTMLAttributes<HTMLSelectElement> & { label: string }} props */
export function SelectField({ label, id, children, className = "", ...rest }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      <select id={id} className={`${inputBoxClass} ${className}`} {...rest}>
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
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        {description ? (
          <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
            {description}
          </p>
        ) : null}
      </div>
      <label className="inline-flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          defaultChecked={defaultChecked}
          disabled={disabled}
          className="h-4 w-4 rounded border-sky-300 text-sky-600 focus:ring-sky-500 disabled:opacity-60"
        />
        <span className="text-xs font-medium text-sky-700">Enabled</span>
      </label>
    </div>
  );
}
