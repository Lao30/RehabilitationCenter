/** @param {{ message: string | null }} props */
export default function DbConnectionAlert({ message }) {
  if (!message) return null;
  return (
    <div
      className="rounded-2xl border border-amber-300/90 bg-amber-50/90 px-5 py-4 text-sm text-amber-950 shadow-sm"
      role="alert"
    >
      <p className="font-semibold">Database connection failed</p>
      <p className="mt-2 leading-relaxed text-amber-950/90">{message}</p>
    </div>
  );
}
