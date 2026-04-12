import { ROLES } from "@/constants/roles";

/** Password for all demo accounts: demo123 */
const DEMO_HASH =
  "$2b$10$Gptdic5p7VJsPi8OZLMgguyqHhPoYx/4aWwInayTo3ZMcep1OZyta";

/**
 * Replace with database-backed users in production.
 * @type {Array<{ id: string, email: string, passwordHash: string, name: string, role: import('@/constants/roles').Role, branchId: string | null }>}
 */
export const SEED_USERS = [
  {
    id: "u_super",
    email: "superadmin@rehab.local",
    passwordHash: DEMO_HASH,
    name: "Super Admin",
    role: ROLES.SUPER_ADMIN,
    branchId: null,
  },
  {
    id: "u_admin",
    email: "admin@rehab.local",
    passwordHash: DEMO_HASH,
    name: "Branch Admin",
    role: ROLES.ADMIN,
    branchId: "branch-1",
  },
  {
    id: "u_therapist",
    email: "therapist@rehab.local",
    passwordHash: DEMO_HASH,
    name: "Demo Therapist",
    role: ROLES.THERAPIST,
    branchId: "branch-1",
  },
];
