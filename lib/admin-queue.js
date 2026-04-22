import { prisma } from "@/lib/prisma";
import { isBranchUuid } from "@/lib/admin-dashboard";
import { formatPostgresConnectionHelp } from "@/lib/db-errors";

function startOfLocalDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

function endOfLocalDay(d) {
  const t = startOfLocalDay(d);
  t.setDate(t.getDate() + 1);
  return t;
}

/** @param {Date | string} d */
function formatDateId(d) {
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * @param {string | null | undefined} branchId
 */
export async function listTodayQueueBoard(branchId) {
  try {
    const now = new Date();
    const dayStart = startOfLocalDay(now);
    const dayEnd = endOfLocalDay(now);
    const where = {
      queued_at: { gte: dayStart, lt: dayEnd },
      ...(isBranchUuid(branchId) ? { branch_id: branchId } : {}),
    };

    const rows = await prisma.queue_entries.findMany({
      where,
      include: {
        patients: {
          select: { first_name: true, last_name: true },
        },
        therapy_sessions: {
          select: { room_label: true, scheduled_start: true },
        },
      },
      orderBy: [{ priority: "desc" }, { queued_at: "asc" }],
    });

    /** @param {typeof rows[0]} row */
    function mapCard(row) {
      const p = row.patients;
      const name = `${p.first_name} ${p.last_name}`.trim();
      const therapy =
        row.therapy_sessions?.room_label?.trim() ||
        row.notes?.trim() ||
        "Terapi";
      const dateSrc =
        row.therapy_sessions?.scheduled_start ?? row.queued_at;
      return {
        id: row.id,
        patientName: name,
        therapyLabel: therapy,
        dateLabel: formatDateId(dateSrc),
        status: row.status,
      };
    }

    const waiting = rows
      .filter((r) => r.status === "waiting")
      .map(mapCard)
      .map((c, i) => ({ ...c, position: i + 1 }));
    const called = rows
      .filter((r) => r.status === "called")
      .map(mapCard)
      .map((c, i) => ({ ...c, position: i + 1 }));
    const completed = rows
      .filter((r) => r.status === "completed")
      .map(mapCard)
      .map((c, i) => ({ ...c, position: i + 1 }));

    return {
      ok: true,
      connectionHint: null,
      waiting,
      called,
      completed,
    };
  } catch (err) {
    return {
      ok: false,
      connectionHint: formatPostgresConnectionHelp(err),
      waiting: [],
      called: [],
      completed: [],
    };
  }
}
