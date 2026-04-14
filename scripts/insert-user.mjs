/**
 * Insert a user (Prisma → `users` table).
 * Usage (from my-app folder):
 *   pnpm db:insert-user you@email.com "YourPassword" SUPER_ADMIN
 */

import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROLES = new Set(["SUPER_ADMIN", "ADMIN"]);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadDatabaseUrl() {
  const fromEnv = process.env.DATABASE_URL?.trim();
  if (fromEnv) return fromEnv;
  for (const name of [".env.local", ".env"]) {
    try {
      const p = path.join(root, name);
      const raw = fs.readFileSync(p, "utf8");
      for (const line of raw.split("\n")) {
        const t = line.trim();
        if (t.startsWith("#") || !t) continue;
        const eq = t.indexOf("=");
        if (eq === -1) continue;
        const key = t.slice(0, eq).trim();
        let val = t.slice(eq + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        if (key === "DATABASE_URL") return val;
      }
    } catch {
      /* missing */
    }
  }
  return null;
}

function defaultNameFromEmail(email) {
  const local = String(email).split("@")[0]?.trim() || "User";
  return local
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  const plain = process.argv[3];
  const role = process.argv[4]?.trim();

  if (!email || !plain || !role) {
    console.error(
      "Usage: pnpm db:insert-user <email> <plain-password> <SUPER_ADMIN|ADMIN>",
    );
    process.exit(1);
  }
  if (!ROLES.has(role)) {
    console.error(`role must be one of: ${[...ROLES].join(", ")}`);
    process.exit(1);
  }

  const databaseUrl = loadDatabaseUrl();
  if (!databaseUrl) {
    console.error(
      "DATABASE_URL is not set. Add it to .env.local or export it in the shell.",
    );
    process.exit(1);
  }
  process.env.DATABASE_URL = databaseUrl;

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  const hash = await bcrypt.hash(plain, 10);

  try {
    await prisma.user.create({
      data: {
        name: defaultNameFromEmail(email),
        email,
        password: hash,
        phone: null,
        role,
        status: "active",
      },
    });
    console.log(`OK: inserted ${email} as ${role}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Insert failed:", msg);
    console.error(`
Hints:
  • npm run db:push (or apply db/schema.sql) if the table is missing
  • "Unique constraint" / duplicate → email already exists
  • See db/README.md for connection + troubleshooting
`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
