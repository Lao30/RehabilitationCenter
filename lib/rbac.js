import { ROLES } from "@/constants/roles";

/** Human-readable role label for tables and badges.
 * @param {string} role */
export function formatRoleLabel(role) {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return "Super Admin";
    case ROLES.ADMIN:
      return "Admin";
    case ROLES.THERAPIST:
      return "Therapist";
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
    case ROLES.THERAPIST:
      return "/therapist/dashboard";
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
        { href: "/super-admin/therapists", label: "Therapists" },
        { href: "/super-admin/settings", label: "Settings" },
        { href: "/super-admin/reports", label: "Reports" },
        { href: "/super-admin/logs", label: "System logs" },
      ];
    case ROLES.ADMIN:
      return [
        { href: "/admin/dashboard", label: "Dashboard" },
        { href: "/admin/patients", label: "Patients" },
        { href: "/admin/sessions", label: "Sessions" },
        { href: "/admin/queue", label: "Queue" },
        { href: "/admin/schedule", label: "Schedule" },
        { href: "/admin/notifications", label: "Notifications" },
        { href: "/admin/reports", label: "Reports" },
      ];
    case ROLES.THERAPIST:
      return [
        { href: "/therapist/dashboard", label: "Dashboard" },
        { href: "/therapist/patients", label: "Patients" },
        { href: "/therapist/sessions", label: "Sessions" },
        { href: "/therapist/queue", label: "Queue" },
        { href: "/therapist/schedule", label: "Schedule" },
        { href: "/therapist/notifications", label: "Notifications" },
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
  if (role === ROLES.THERAPIST) return pathname.startsWith("/therapist");
  return false;
}
