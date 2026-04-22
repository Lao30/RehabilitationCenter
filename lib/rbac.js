import { ROLES } from "@/constants/roles";

/** Human-readable role label for tables and badges.
 * @param {string} role */
export function formatRoleLabel(role) {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return "Super Admin";
    case ROLES.ADMIN:
      return "Admin";
    default:
      return role;
  }
}

/** @param {string} role */
export function getDashboardPath(role) {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return "/super-admin/dashboard";
    case ROLES.ADMIN:
      return "/admin/dashboard";
    default:
      return "/login";
  }
}

/**
 * Navigation for dashboard shell (role-scoped).
 * @param {string} role
 */
export function getNavForRole(role) {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return [
        { href: "/super-admin/dashboard", label: "Dashboard" },
        { href: "/super-admin/users", label: "Users & roles" },
        { href: "/super-admin/branches", label: "Branches" },
        { href: "/super-admin/settings", label: "Settings" },
        { href: "/super-admin/reports", label: "Reports" },
        { href: "/super-admin/logs", label: "System logs" },
      ];
    case ROLES.ADMIN:
      return [
        { href: "/admin/dashboard", label: "Dashboard" },
        { href: "/admin/patients", label: "Patients" },
        {
          href: "/admin/rekam-rehabilitasi",
          label: "Rekam Rehabilitasi",
        },
        { href: "/admin/sessions", label: "Sessions" },
        { href: "/admin/queue", label: "Sesi & Antrian" },
        { href: "/admin/schedule", label: "Kalender Sesi" },
        { href: "/admin/terapis", label: "Data Terapis" },
        { href: "/admin/wali-pasien", label: "Wali Pasien" },
        { href: "/admin/notifications", label: "Notifikasi WA" },
        { href: "/admin/reports", label: "Laporan & Statistik" },
      ];
    default:
      return [];
  }
}

/**
 * @param {string} role
 * @param {string} pathname
 */
export function isAllowedRoute(role, pathname) {
  if (role === ROLES.SUPER_ADMIN) return pathname.startsWith("/super-admin");
  if (role === ROLES.ADMIN) return pathname.startsWith("/admin");
  return false;
}
