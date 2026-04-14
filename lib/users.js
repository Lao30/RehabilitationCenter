import { prisma } from "@/lib/prisma";

/**
 * @typedef {{ id: string, email: string, passwordHash: string, role: string, name?: string | null }} UserRecord
 */

/**
 * Fallback display label when `name` is empty.
 * @param {string} email
 */
export function displayNameFromEmail(email) {
  const local = String(email).split("@")[0]?.trim() || email;
  return local
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Auth lookup. Matches legacy SQL: lower(trim(email)), active status.
 * @param {string} email
 * @returns {Promise<UserRecord | null>}
 */
export async function findUserByEmail(email) {
  const normalized = email.trim().toLowerCase();
  const rows = await prisma.$queryRaw`
    SELECT user_id AS "userId",
           name,
           email,
           password AS "password",
           trim(both from role) AS role
    FROM users
    WHERE lower(trim(email)) = ${normalized}
      AND lower(trim(coalesce(status, ''))) = 'active'
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) return null;
  return {
    id: String(row.userId),
    name: row.name,
    email: row.email,
    passwordHash: row.password,
    role: String(row.role).trim(),
  };
}

/**
 * @returns {Promise<Array<{ id: string, name: string | null, email: string, role: string, phone: string | null, status: string | null }>>}
 */
export async function listUsers() {
  const rows = await prisma.user.findMany({
    orderBy: { email: "asc" },
  });
  return rows.map((u) => ({
    id: String(u.userId),
    name: u.name,
    email: u.email,
    role: u.role.trim(),
    phone: u.phone,
    status: u.status,
  }));
}
