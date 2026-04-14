import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { jsonResponseWithSession } from "@/lib/auth-cookies";
import { ROLES } from "@/constants/roles";
import { formatPostgresConnectionHelp } from "@/lib/db-errors";
import { displayNameFromEmail, findUserByEmail } from "@/lib/users";

export const runtime = "nodejs";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }

  let user;
  try {
    user = await findUserByEmail(email);
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[login] database error:", err);
    }
    const code =
      err && typeof err === "object" && "code" in err
        ? String(err.code)
        : "";
    const msg = err instanceof Error ? err.message : String(err ?? "");
    if (
      code === "28P01" ||
      msg.includes("password authentication failed") ||
      msg.includes("DATABASE_URL")
    ) {
      return NextResponse.json(
        { error: formatPostgresConnectionHelp(err) },
        { status: 503 },
      );
    }
    console.error("[login] database error:", err);
    return NextResponse.json(
      {
        error:
          "Could not reach the database. Check DATABASE_URL in .env.local and that PostgreSQL is running.",
      },
      { status: 503 },
    );
  }

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  const role = String(user.role ?? "").trim();
  if (role !== ROLES.SUPER_ADMIN && role !== ROLES.ADMIN) {
    return NextResponse.json(
      {
        error:
          "This app only allows Super Admin and Admin accounts. Ask your administrator to update your role in the database.",
      },
      { status: 403 },
    );
  }

  return jsonResponseWithSession(
    { ok: true, role: user.role },
    {
      sub: String(user.id),
      email: user.email,
      name:
        (user.name && String(user.name).trim()) ||
        displayNameFromEmail(user.email),
      role: user.role,
      branchId: null,
    },
  );
}
