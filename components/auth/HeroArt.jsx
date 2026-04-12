/**
 * Custom SVG art — abstract “path to recovery” + care connection (no stock assets).
 */

/** Compact strip for small screens */
export function HeroArtMobile() {
  return (
    <div
      className="relative mx-auto mt-5 w-full max-w-sm lg:hidden"
      aria-hidden
    >
      <svg
        viewBox="0 0 320 96"
        className="h-20 w-full text-sky-500/85"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="m-path" x1="16" y1="72" x2="300" y2="40">
            <stop stopColor="#38bdf8" stopOpacity="0.55" />
            <stop offset="1" stopColor="#22d3ee" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <rect
          x="8"
          y="12"
          width="304"
          height="72"
          rx="16"
          className="fill-white/50 stroke-sky-200/80"
          strokeWidth="1"
        />
        <path
          d="M32 64 C80 64 96 40 128 36 C160 32 192 52 224 44 C256 36 272 28 288 24"
          stroke="url(#m-path)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="56" cy="58" r="4" className="fill-sky-400" />
        <circle cx="128" cy="38" r="4" className="fill-cyan-500" />
        <circle cx="232" cy="44" r="4" className="fill-sky-500" />
        <g className="stroke-sky-600/50" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="72" cy="28" r="7" className="fill-sky-50" />
          <path d="M72 36 v10" />
          <circle cx="248" cy="24" r="7" className="fill-cyan-50" />
          <path d="M248 32 v10" />
        </g>
      </svg>
    </div>
  );
}

export default function HeroArt() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] hidden overflow-hidden lg:block"
      aria-hidden
    >
      <div className="auth-art-root absolute -right-8 bottom-[12%] w-[min(52%,26rem)] max-w-md xl:right-4 xl:w-[min(48%,28rem)]">
        <svg
          viewBox="0 0 420 340"
          className="h-auto w-full text-sky-500/90 drop-shadow-[0_12px_40px_rgba(14,165,233,0.15)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="hero-sky"
              x1="60"
              y1="20"
              x2="380"
              y2="300"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#38bdf8" stopOpacity="0.35" />
              <stop offset="0.5" stopColor="#22d3ee" stopOpacity="0.25" />
              <stop offset="1" stopColor="#0ea5e9" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="hero-path" x1="40" y1="240" x2="360" y2="120">
              <stop stopColor="#0ea5e9" stopOpacity="0.45" />
              <stop offset="1" stopColor="#06b6d4" stopOpacity="0.35" />
            </linearGradient>
            <filter
              id="hero-soft"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur stdDeviation="1.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Soft panel */}
          <rect
            x="48"
            y="36"
            width="324"
            height="268"
            rx="28"
            className="fill-white/40 stroke-sky-200/70"
            strokeWidth="1.25"
          />

          {/* Hills / horizon */}
          <path
            d="M72 220 C120 180 168 200 216 188 C264 176 312 156 360 168 L360 268 L72 268 Z"
            fill="url(#hero-sky)"
            className="stroke-sky-300/40"
            strokeWidth="1"
          />

          {/* Non-linear path (recovery arc) */}
          <path
            d="M88 248 C140 248 152 196 196 172 C236 150 276 188 312 156 C332 140 348 132 368 124"
            stroke="url(#hero-path)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#hero-soft)"
          />

          {/* Steps / milestones */}
          <circle cx="120" cy="228" r="5" className="fill-sky-400/80" />
          <circle cx="196" cy="176" r="5" className="fill-cyan-500/75" />
          <circle cx="288" cy="158" r="5" className="fill-sky-500/85" />

          {/* Abstract figures — therapist + patient connection */}
          <g className="stroke-sky-600/55" strokeWidth="2" strokeLinecap="round">
            {/* Patient */}
            <circle cx="118" cy="118" r="14" className="fill-sky-100/90" />
            <path d="M118 134 v22 M104 152 h28" />
            {/* Therapist */}
            <circle cx="292" cy="98" r="14" className="fill-cyan-50/95" />
            <path d="M292 114 v22 M278 132 h28" />
            {/* Link */}
            <path
              d="M140 118 Q210 72 270 98"
              strokeDasharray="6 7"
              className="stroke-sky-400/70"
              strokeWidth="1.75"
            />
          </g>

          {/* Plus / care mark */}
          <g
            className="fill-sky-500/35 stroke-sky-500/50"
            strokeWidth="1.2"
            transform="translate(300 52)"
          >
            <circle cx="0" cy="0" r="22" className="fill-white/50" />
            <path d="M0 -9 v18 M-9 0 h18" strokeLinecap="round" />
          </g>

          {/* Spark dots */}
          <circle cx="76" cy="64" r="2.5" className="fill-amber-300/80" />
          <circle cx="98" cy="52" r="1.8" className="fill-sky-300/90" />
          <circle cx="332" cy="210" r="2" className="fill-cyan-400/75" />
        </svg>
      </div>
    </div>
  );
}
