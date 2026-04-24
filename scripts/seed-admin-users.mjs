/**
 * Create one SUPER_ADMIN and one ADMIN in a single transaction.
 *
 * From RehabilitationCenter folder:
 *   pnpm db:seed-admins -- super@example.com "SuperPass" admin@example.com "AdminPass"
 *
 * Or set env (e.g. CI): SEED_SUPER_EMAIL, SEED_SUPER_PASSWORD, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD
 */

import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(root, ".env.local") });
if (!process.env.DATABASE_URL?.trim()) {
  dotenv.config({ path: path.join(root, ".env") });
}

function defaultNameFromEmail(email) {
  const local = String(email).split("@")[0]?.trim() || "User";
  return local
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function parseArgs() {
  const a = process.argv[2]?.trim();
  const b = process.argv[3];
  const c = process.argv[4]?.trim();
  const d = process.argv[5];

  if (a && b != null && c && d != null) {
    return {
      superEmail: a.toLowerCase(),
      superPassword: String(b),
      adminEmail: c.toLowerCase(),
      adminPassword: String(d),
    };
  }

  const se = process.env.SEED_SUPER_EMAIL?.trim().toLowerCase();
  const sp = process.env.SEED_SUPER_PASSWORD;
  const ae = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const ap = process.env.SEED_ADMIN_PASSWORD;

  if (se && sp != null && ae && ap != null) {
    return {
      superEmail: se,
      superPassword: String(sp),
      adminEmail: ae,
      adminPassword: String(ap),
    };
  }

  return null;
}

async function main() {
  const parsed = parseArgs();
  if (!parsed) {
    console.error(`Usage:
  pnpm db:seed-admins -- <superEmail> <superPassword> <adminEmail> <adminPassword>

Or set all of:
  SEED_SUPER_EMAIL SEED_SUPER_PASSWORD SEED_ADMIN_EMAIL SEED_ADMIN_PASSWORD`);
    process.exit(1);
  }

  const { superEmail, superPassword, adminEmail, adminPassword } = parsed;

  if (superEmail === adminEmail) {
    console.error("super admin and admin must use different emails.");
    process.exit(1);
  }

  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    console.error(
      "DATABASE_URL is not set. Add it to .env.local (or .env) in this project folder.",
    );
    process.exit(1);
  }

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();

  const superHash = await bcrypt.hash(superPassword, 10);
  const adminHash = await bcrypt.hash(adminPassword, 10);

  try {
    await prisma.$transaction([
      prisma.user.create({
        data: {
          name: defaultNameFromEmail(superEmail),
          email: superEmail,
          password: superHash,
          phone: null,
          role: "SUPER_ADMIN",
          status: "active",
        },
      }),
      prisma.user.create({
        data: {
          name: defaultNameFromEmail(adminEmail),
          email: adminEmail,
          password: adminHash,
          phone: null,
          role: "ADMIN",
          status: "active",
        },
      }),
    ]);
    console.log(`OK: SUPER_ADMIN ${superEmail}`);
    console.log(`OK: ADMIN ${adminEmail}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Seed failed:", msg);
    console.error(`
Hints:
  • Run migrations / db push if tables are missing
  • Duplicate email → use different emails or remove existing rows
  • See db/README.md for DATABASE_URL troubleshooting`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
