import { SEED_USERS } from "@/lib/seed-users";

/**
 * @param {string} email
 */
export function findUserByEmail(email) {
  const normalized = email.trim().toLowerCase();
  return SEED_USERS.find((u) => u.email === normalized) ?? null;
}
