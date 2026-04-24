import QueueBoardClient from "@/components/dashboard/admin/QueueBoardClient";
import { listTodayQueueBoard } from "@/lib/admin-queue";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Sesi & antrian",
};

export default async function Page() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { waiting, called, completed, ok, connectionHint } =
    await listTodayQueueBoard(session.branchId);

  return (
    <QueueBoardClient
      waiting={waiting}
      called={called}
      completed={completed}
      connectionHint={ok === false ? connectionHint : null}
    />
  );
}
