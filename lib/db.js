import { prisma } from "@/lib/prisma";

/** Smoke test; returns true if SELECT 1 succeeds. */
export async function pingDatabase() {
  await prisma.$queryRaw`SELECT 1 AS ok`;
  return true;
}
