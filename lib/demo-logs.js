/**
 * Sample audit-style rows for the system logs UI (replace with DB / log drain).
 * @type {Array<{ id: string, at: string, level: 'info' | 'warn' | 'error', source: string, message: string }>}
 */
export const DEMO_LOG_ENTRIES = [
  {
    id: "log-1",
    at: "2026-04-12T08:14:02.000Z",
    level: "info",
    source: "auth",
    message: "User session established (superadmin@rehab.local)",
  },
  {
    id: "log-2",
    at: "2026-04-12T07:58:41.000Z",
    level: "info",
    source: "api",
    message: "GET /api/health/db — 200",
  },
  {
    id: "log-3",
    at: "2026-04-12T07:12:09.000Z",
    level: "warn",
    source: "email",
    message: "SMTP relay not configured; outbound mail queued (demo)",
  },
  {
    id: "log-4",
    at: "2026-04-11T22:03:55.000Z",
    level: "info",
    source: "rbac",
    message: "Policy check: SUPER_ADMIN → /super-admin/dashboard — allowed",
  },
  {
    id: "log-5",
    at: "2026-04-11T18:40:12.000Z",
    level: "error",
    source: "worker",
    message: "Background job 'report_snapshot' failed — retry scheduled",
  },
];
