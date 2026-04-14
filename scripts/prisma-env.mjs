/**
 * Load `.env.local` (DATABASE_URL), then run the Prisma CLI.
 * Usage: node scripts/prisma-env.mjs db pull
 */
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import { execFileSync } from "child_process";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const loaded = dotenv.config({ path: path.join(root, ".env.local") });
if (loaded.error && !process.env.DATABASE_URL) {
  console.error(
    "Could not load .env.local and DATABASE_URL is not set. Add my-app/.env.local or export DATABASE_URL.",
  );
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node scripts/prisma-env.mjs <prisma args…>  e.g. db pull");
  process.exit(1);
}

const prismaBin =
  process.platform === "win32"
    ? path.join(root, "node_modules", ".bin", "prisma.cmd")
    : path.join(root, "node_modules", ".bin", "prisma");

if (!existsSync(prismaBin)) {
  console.error("Prisma CLI not found. Run: npm install");
  process.exit(1);
}

execFileSync(prismaBin, args, {
  cwd: root,
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32",
});
