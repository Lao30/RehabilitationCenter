import { cookies } from "next/headers";
import { ROLES } from "@/constants/roles";
import { verifySessionToken } from "@/lib/jwt";

/**
 * @returns {Promise<{ id: string, email: string, name: string, role: string, branchId: string | null } | null>}
 */
export async function getSession() {
  const store = await cookies();
  const token = store.get("rcms_session")?.value;
  if (!token) return null;
  try {
    const payload = await verifySessionToken(token);
    const role = String(payload.role ?? "");
    if (
      role !== ROLES.SUPER_ADMIN &&
      role !== ROLES.ADMIN &&
      role !== ROLES.THERAPIST
    ) {
      return null;
    }
    return {
      id: String(payload.sub ?? ""),
      email: String(payload.email ?? ""),
      name: String(payload.name ?? ""),
      role,
      branchId: payload.branchId ? String(payload.branchId) : null,
    };
  } catch {
    return null;
  }
}
