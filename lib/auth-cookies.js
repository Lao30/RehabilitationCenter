import { NextResponse } from "next/server";
import { signSessionToken } from "@/lib/jwt";

/**
 * JSON response that also sets the httpOnly session cookie (same as login).
 * @param {object} body
 * @param {{ sub: string, email: string, name: string, role: string, branchId?: string | null }} sessionPayload
 */
export async function jsonResponseWithSession(body, sessionPayload) {
  const token = await signSessionToken({
    sub: sessionPayload.sub,
    email: sessionPayload.email,
    name: sessionPayload.name,
    role: sessionPayload.role,
    branchId: sessionPayload.branchId ?? null,
  });
  const res = NextResponse.json(body);
  res.cookies.set("rcms_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
