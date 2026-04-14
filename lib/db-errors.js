/**
 * Human-readable hint for pg connection failures (e.g. code 28P01).
 * @param {unknown} err
 */
export function formatPostgresConnectionHelp(err) {
  const msg = err instanceof Error ? err.message : String(err ?? "");
  const code = err && typeof err === "object" && "code" in err ? String(err.code) : "";

  if (code === "28P01" || msg.includes("password authentication failed")) {
    return "Cannot connect to PostgreSQL: wrong database password in DATABASE_URL, or special characters in the password must be URL-encoded in the URL. Fix my-app/.env.local (Supabase: Project Settings → Database → use the database password in the connection string, not your Supabase login). Test: psql \"$DATABASE_URL\" -c \"SELECT 1\" then restart npm run dev.";
  }
  if (msg.includes("DATABASE_URL is not set")) {
    return msg;
  }
  return msg || "Could not connect to the database.";
}
