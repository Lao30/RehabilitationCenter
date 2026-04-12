import { redirect } from "next/navigation";
import { getDashboardPath } from "@/lib/rbac";
import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  redirect(getDashboardPath(session.role));
}
