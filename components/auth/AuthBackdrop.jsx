/**
 * Bright sky hero — soft mesh, light glow, subtle texture (no images).
 */
export default function AuthBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {/* Airy base */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50 via-cyan-50/80 to-sky-100/90" />
      {/* Top-center daylight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_65%_at_50%_-15%,rgba(186,230,253,0.95),transparent_58%)]" />
      {/* Soft pastel blobs */}
      <div className="auth-blob auth-blob-a absolute -left-1/4 top-[-18%] h-[min(115%,50rem)] w-[min(115%,50rem)] rounded-[45%] bg-[conic-gradient(from_210deg_at_50%_50%,rgba(56,189,248,0.45)_0%,rgba(125,211,252,0.35)_30%,rgba(165,243,252,0.4)_60%,rgba(186,230,253,0.35)_100%)] blur-3xl" />
      <div className="auth-blob auth-blob-b absolute -right-[28%] bottom-[-22%] h-[min(105%,44rem)] w-[min(105%,44rem)] rounded-[42%] bg-[radial-gradient(circle_at_35%_35%,rgba(125,211,252,0.55),transparent_55%),radial-gradient(circle_at_70%_55%,rgba(103,232,249,0.4),transparent_50%)] blur-3xl" />
      <div className="auth-blob auth-blob-c absolute left-[12%] top-[38%] h-64 w-64 rounded-full bg-sky-200/50 blur-2xl" />
      {/* Gentle bottom bloom */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_50%_at_50%_100%,rgba(224,242,254,0.85),transparent_55%)]" />
      {/* Very light grain — reads as paper/sky haze */}
      <div className="auth-grain absolute inset-0 opacity-[0.12] mix-blend-multiply" />
      {/* Delicate grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(14,165,233,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.07) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
    </div>
  );
}
