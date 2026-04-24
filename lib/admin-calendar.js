import { prisma } from "@/lib/prisma";
import { isBranchUuid } from "@/lib/admin-dashboard";
import { formatPostgresConnectionHelp } from "@/lib/db-errors";

/** Warna konsisten dengan mock legenda terapis */
export const CALENDAR_THERAPIST_COLORS = [
  "#0ea5e9",
  "#10b981",
  "#f97316",
  "#a855f7",
  "#ec4899",
  "#6366f1",
];

/** @param {string | null | undefined} s */
function normName(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** @param {string} uuid */
function colorFromTherapistUserId(uuid) {
  let h = 0;
  for (let i = 0; i < uuid.length; i++) {
    h = (h << 5) - h + uuid.charCodeAt(i);
    h |= 0;
  }
  const colors = CALENDAR_THERAPIST_COLORS;
  return colors[Math.abs(h) % colors.length];
}

/**
 * @param {string} therapistUserId
 * @param {string | null | undefined} primaryTherapistName
 * @param {{ display_name: string }[]} therapistRows ordered
 */
function colorForSession(therapistUserId, primaryTherapistName, therapistRows) {
  const n = normName(primaryTherapistName);
  if (n) {
    for (let i = 0; i < therapistRows.length; i++) {
      const tn = normName(therapistRows[i].display_name);
      if (tn && (tn === n || n.includes(tn) || tn.includes(n))) {
        return CALENDAR_THERAPIST_COLORS[i % CALENDAR_THERAPIST_COLORS.length];
      }
    }
  }
  return colorFromTherapistUserId(therapistUserId);
}

/** @param {Date} dt */
function dateKeyFromDbDate(dt) {
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

/**
 * @param {string | null | undefined} branchId
 */
export async function loadSessionCalendar(branchId) {
  if (!isBranchUuid(branchId)) {
    return {
      ok: true,
      connectionHint: null,
      events: [],
      holidays: [],
      therapistLegend: [],
    };
  }

  const now = new Date();
  const rangeStart = new Date(now.getFullYear(), now.getMonth() - 2, 1, 0, 0, 0, 0);
  const rangeEnd = new Date(now.getFullYear(), now.getMonth() + 4, 0, 23, 59, 59, 999);

  try {
    const [therapistRows, sessions, holidayRows] = await Promise.all([
      prisma.therapists.findMany({
        where: { branch_id: branchId, is_active: true },
        orderBy: [{ display_name: "asc" }],
        select: { display_name: true },
      }),
      prisma.therapy_sessions.findMany({
        where: {
          branch_id: branchId,
          scheduled_start: { gte: rangeStart, lte: rangeEnd },
        },
        orderBy: [{ scheduled_start: "asc" }],
        include: {
          patients: {
            select: {
              first_name: true,
              last_name: true,
              primary_therapist_name: true,
            },
          },
        },
      }),
      prisma.branch_holidays.findMany({
        where: { branch_id: branchId },
        orderBy: [{ holiday_date: "asc" }],
      }),
    ]);

    const therapistLegend = therapistRows.map((t, i) => ({
      displayName: t.display_name,
      color: CALENDAR_THERAPIST_COLORS[i % CALENDAR_THERAPIST_COLORS.length],
    }));

    const events = sessions.map((s) => {
      const p = s.patients;
      const title = `${p.first_name} ${p.last_name}`.trim() || "Sesi";
      const start = s.scheduled_start;
      let end = s.scheduled_end;
      if (!end) {
        end = new Date(start.getTime() + 60 * 60 * 1000);
      }
      const color = colorForSession(
        s.therapist_user_id,
        p.primary_therapist_name,
        therapistRows,
      );
      return {
        id: s.id,
        title,
        startIso: start.toISOString(),
        endIso: end.toISOString(),
        color,
      };
    });

    const holidays = holidayRows.map((h) => ({
      id: h.id,
      name: h.name,
      dateKey: dateKeyFromDbDate(h.holiday_date),
    }));

    return {
      ok: true,
      connectionHint: null,
      events,
      holidays,
      therapistLegend,
    };
  } catch (err) {
    return {
      ok: false,
      connectionHint: formatPostgresConnectionHelp(err),
      events: [],
      holidays: [],
      therapistLegend: [],
    };
  }
}
