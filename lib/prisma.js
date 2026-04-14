import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

/**
 * Single PrismaClient for serverless/dev hot reload (Next.js App Router).
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
