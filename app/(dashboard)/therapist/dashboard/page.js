import Placeholder from "@/components/dashboard/Placeholder";

export const metadata = {
  title: "Therapist · Dashboard",
};

export default function Page() {
  return (
    <Placeholder title="My dashboard">
      Your upcoming sessions and tasks (placeholder). Restrict lists to
      assigned patients in RBAC later.
    </Placeholder>
  );
}
