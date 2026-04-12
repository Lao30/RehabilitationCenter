/**
 * Demo org directory — replace with database-backed records.
 * Branch ids align with `SEED_USERS` in `lib/seed-users.js`.
 */

/** @type {Array<{ id: string, name: string, code: string, city: string, phone: string, active: boolean }>} */
export const DEMO_BRANCHES = [
  {
    id: "branch-1",
    name: "North River Rehabilitation Center",
    code: "NRR",
    city: "Springfield",
    phone: "(555) 010-1000",
    active: true,
  },
];

/** @param {string | null | undefined} branchId */
export function getBranchLabel(branchId) {
  if (!branchId) return "—";
  const b = DEMO_BRANCHES.find((x) => x.id === branchId);
  return b ? b.name : branchId;
}
