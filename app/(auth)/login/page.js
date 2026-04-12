import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import { getSession } from "@/lib/session";
import { getDashboardPath } from "@/lib/rbac";

export const metadata = {
  title: "Sign in",
};

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect(getDashboardPath(session.role));
  }

  return <LoginForm />;
}
