import { DM_Sans, Fraunces } from "next/font/google";
import AuthBackdrop from "@/components/auth/AuthBackdrop";
import HeroArt, { HeroArtMobile } from "@/components/auth/HeroArt";

const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-auth-display",
});

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-auth-sans",
});

export default function AuthLayout({ children }) {
  return (
    <div
      className={`${display.variable} ${sans.variable} ${sans.className} relative min-h-screen antialiased`}
    >
      <div className="flex min-h-[100dvh] flex-col lg:grid lg:min-h-screen lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        {/* Hero */}
        <section className="relative flex min-h-[42vh] flex-col overflow-hidden lg:min-h-screen">
          <AuthBackdrop />
          <HeroArt />

          <div className="relative z-10 flex flex-1 flex-col justify-end gap-10 p-6 sm:p-8 lg:justify-between lg:p-10 xl:p-14">
            {/* Mobile / tablet */}
            <div className="lg:hidden">
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex h-1.5 w-1.5 rounded-full bg-sky-400"
                  aria-hidden
                />
                <span
                  className="inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400"
                  aria-hidden
                />
                <span
                  className="inline-flex h-1.5 w-1.5 rounded-full bg-sky-300"
                  aria-hidden
                />
                <p
                  className={`${display.className} ml-1 text-[0.6rem] font-semibold uppercase tracking-[0.48em] text-sky-600/90`}
                >
                  RCMS
                </p>
              </div>
              <h1
                className={`${display.className} mt-3 text-3xl font-medium leading-[1.1] tracking-[-0.03em] text-slate-800 sm:text-4xl`}
              >
                Recovery isn&apos;t linear.
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600">
                Your workflow can still feel steady—sessions, queue, and care
                in one place.
              </p>
              <HeroArtMobile />
              <ul
                className="mt-5 flex flex-wrap gap-2"
                aria-label="Product highlights"
              >
                {[
                  "Sessions & notes",
                  "Live queue",
                  "Role-based access",
                ].map((label) => (
                  <li key={label}>
                    <span className="inline-flex items-center rounded-full border border-sky-200/90 bg-white/60 px-3 py-1.5 text-[11px] font-medium text-sky-900 shadow-sm shadow-sky-100/60 backdrop-blur-sm">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Desktop */}
            <div className="relative hidden max-w-xl lg:block">
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex h-1.5 w-1.5 rounded-full bg-sky-400"
                  aria-hidden
                />
                <span
                  className="inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400"
                  aria-hidden
                />
                <span
                  className="inline-flex h-1.5 w-1.5 rounded-full bg-sky-300"
                  aria-hidden
                />
                <p
                  className={`${display.className} ml-1 text-[0.65rem] font-semibold uppercase tracking-[0.52em] text-sky-600`}
                >
                  Rehabilitation Center
                </p>
              </div>
              <h1
                className={`${display.className} mt-6 text-[clamp(2.35rem,3.6vw,3.65rem)] font-medium leading-[1.05] tracking-[-0.03em] text-slate-800`}
              >
                Recovery isn&apos;t linear.
                <span className="mt-3 block bg-gradient-to-r from-sky-600 via-cyan-600 to-sky-500 bg-clip-text text-transparent">
                  Your workflow can be.
                </span>
              </h1>
              <p className="mt-8 text-[15px] leading-relaxed text-slate-600">
                One calm console for branches, therapists, and the people you
                help—sessions, queue, and care coordination in sync.
              </p>
              <ul
                className="mt-8 flex flex-wrap gap-2"
                aria-label="Product highlights"
              >
                {[
                  "Sessions & notes",
                  "Live queue",
                  "Role-based access",
                ].map((label) => (
                  <li key={label}>
                    <span className="inline-flex items-center rounded-full border border-sky-200/90 bg-white/55 px-3.5 py-1.5 text-[11px] font-medium text-sky-900 shadow-sm shadow-sky-100/50 backdrop-blur-sm">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats — desktop */}
            <div className="hidden rounded-2xl border border-sky-200/80 bg-white/50 px-8 py-8 shadow-sm shadow-sky-200/40 backdrop-blur-md lg:flex lg:flex-wrap lg:items-end lg:gap-10">
              <div>
                <p
                  className={`${display.className} text-4xl font-semibold tracking-tight text-sky-900 xl:text-5xl`}
                >
                  24/7
                </p>
                <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.28em] text-sky-600/90">
                  Operational clarity
                </p>
              </div>
              <div className="hidden h-14 w-px bg-gradient-to-b from-transparent via-sky-300/80 to-transparent sm:block" />
              <p className="max-w-xs text-sm leading-relaxed text-slate-600">
                Built for busy clinics: fewer clicks between intake, the waiting
                room, and the treatment floor.
              </p>
            </div>
          </div>

          <svg
            className="relative z-10 -mb-px w-full text-[#f4f7fb] lg:hidden"
            viewBox="0 0 1440 56"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              fill="currentColor"
              d="M0,40 C200,12 400,56 640,32 C880,8 1120,48 1320,28 C1380,22 1410,20 1440,18 L1440,56 L0,56 Z"
            />
          </svg>
        </section>

        {/* Form column */}
        <div className="relative flex flex-1 flex-col justify-center bg-[#f8fafc] px-5 py-12 sm:px-10 lg:min-h-screen lg:bg-[linear-gradient(165deg,#ffffff_0%,#f0f9ff_38%,#f8fafc_100%)] lg:py-16 xl:px-16">
          <div
            className="pointer-events-none absolute right-0 top-0 h-48 w-48 bg-gradient-to-bl from-sky-300/25 to-transparent blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 left-0 h-44 w-full bg-gradient-to-t from-cyan-100/40 to-transparent lg:h-56"
            aria-hidden
          />

          <div className="relative z-10 mx-auto w-full max-w-md lg:max-w-[400px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
