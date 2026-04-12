import { Pool } from "pg";

let pool;

/**
 * PostgreSQL pool for Route Handlers and Server Actions (Node runtime).
 * Routes that call this must not use Edge runtime.
 *
 * @returns {import("pg").Pool}
 */
export function getPool() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and set DATABASE_URL.",
    );
  }
  if (!pool) {
    pool = new Pool({
      connectionString: url,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });
  }
  return pool;
}

/** Smoke test; returns true if SELECT 1 succeeds. */
export async function pingDatabase() {
  const client = await getPool().connect();
  try {
    await client.query("SELECT 1 AS ok");
    return true;
  } finally {
    client.release();
  }
}
