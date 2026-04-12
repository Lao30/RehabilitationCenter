import { pingDatabase } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    await pingDatabase();
    return Response.json({ ok: true, database: "connected" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ ok: false, error: message }, { status: 503 });
  }
}
