import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/jwt";
import { ROLES } from "@/constants/roles";
import { getDashboardPath, isAllowedRoute } from "@/lib/rbac";

export async function middleware(request) {
  const token = request.cookies.get("rcms_session")?.value;
  const loginUrl = new URL("/login", request.url);

  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  let role;
  try {
    const payload = await verifySessionToken(token);
    const r = String(payload.role ?? "");
    if (r !== ROLES.SUPER_ADMIN && r !== ROLES.ADMIN) {
      return NextResponse.redirect(loginUrl);
    }
    role = r;
  } catch {
    return NextResponse.redirect(loginUrl);
  }

  const pathname = request.nextUrl.pathname;
  if (!isAllowedRoute(role, pathname)) {
    return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/super-admin/:path*", "/admin/:path*"],
};
