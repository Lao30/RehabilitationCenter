"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { adminProfile, superAdminProfile } from "@/lib/use-cases-content";

/** @param {{ displayClassName: string }} props */
export default function UseCasesClient({ displayClassName }) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      gsap.set(
        root.querySelectorAll(
          "[data-hero-line],[data-hero-badge],[data-hero-title],[data-hero-desc],[data-hero-cta],[data-role-shell],[data-use-block]",
        ),
        { clearProps: "opacity,transform" },
      );
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-hero-line]", {
        scaleX: 0,
        duration: 0.65,
        transformOrigin: "left center",
      })
        .from(
          "[data-hero-badge]",
          { opacity: 0, y: 14, stagger: 0.07, duration: 0.42 },
          "-=0.4",
        )
        .from(
          "[data-hero-title]",
          { opacity: 0, y: 36, duration: 0.72 },
          "-=0.48",
        )
        .from(
          "[data-hero-desc]",
          { opacity: 0, y: 22, duration: 0.55 },
          "-=0.52",
        )
        .from(
          "[data-hero-cta]",
          { opacity: 0, y: 18, duration: 0.5 },
          "-=0.42",
        )
        .from(
          "[data-role-shell]",
          { opacity: 0, y: 44, duration: 0.68, stagger: 0.14 },
          "-=0.38",
        );

      gsap.utils.toArray(root.querySelectorAll("[data-use-block]")).forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 89%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 30,
          duration: 0.58,
          ease: "power2.out",
        });
      });

      gsap.to("[data-float-orb]", {
        y: 14,
        x: -6,
        duration: 5.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to("[data-float-orb-b]", {
        y: -10,
        x: 8,
        duration: 6.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, root);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(165deg,#ffffff_0%,#f0f9ff_42%,#f8fafc_100%)] text-slate-800"
    >
      <div
        className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-sky-300/25 blur-3xl"
        data-float-orb
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-32 h-64 w-64 rounded-full bg-violet-300/20 blur-3xl"
        data-float-orb-b
        aria-hidden
      />

      <header className="sticky top-0 z-20 border-b border-sky-200/60 bg-white/70 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-semibold text-slate-800 transition hover:text-sky-800"
          >
            <span className="flex gap-1" aria-hidden>
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
            </span>
            RCMS
          </Link>
          <nav className="flex items-center gap-2 text-sm font-medium">
            <Link
              href="/use-cases"
              className="rounded-full bg-sky-100/90 px-3 py-1.5 text-sky-900"
            >
              Use case
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-sky-200/90 bg-white/90 px-3 py-1.5 text-slate-700 transition hover:bg-sky-50"
            >
              Masuk
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
        <section className="max-w-3xl">
          <div
            data-hero-line
            className="h-px w-16 rounded-full bg-linear-to-r from-sky-500 to-cyan-400"
          />
          <div className="mt-5 flex flex-wrap gap-2">
            <span
              data-hero-badge
              className="rounded-full border border-sky-200/80 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-sky-700"
            >
              Dokumen produk
            </span>
            <span
              data-hero-badge
              className="rounded-full border border-violet-200/80 bg-violet-50/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-violet-800"
            >
              Super Admin vs Admin
            </span>
          </div>
          <h1
            data-hero-title
            className={`${displayClassName} mt-6 text-4xl font-medium leading-[1.08] tracking-[-0.03em] text-slate-900 sm:text-5xl`}
          >
            Use case peran dalam{" "}
            <span className="bg-linear-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
              RCMS
            </span>
          </h1>
          <p
            data-hero-desc
            className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-[17px]"
          >
            Halaman ini merangkum tujuan utama, tanggung jawab, dan skenario
            penggunaan untuk{" "}
            <strong className="font-semibold text-slate-800">Super Admin</strong>{" "}
            (kontrol platform) dan{" "}
            <strong className="font-semibold text-slate-800">Admin cabang</strong>{" "}
            (operasional harian). Cocok untuk onboarding staf dan penyelarasan
            dengan tim pengembangan.
          </p>
          <div data-hero-cta className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-sky-500 via-sky-400 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-400/35 transition hover:brightness-105"
            >
              Lanjut ke masuk
            </Link>
            <a
              href="#super-admin"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200/90 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-sky-200 hover:bg-sky-50/80"
            >
              Lihat Super Admin
            </a>
            <a
              href="#admin"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200/90 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-sky-200 hover:bg-sky-50/80"
            >
              Lihat Admin
            </a>
          </div>
        </section>

        <div className="mt-16 grid gap-8 lg:mt-20 lg:grid-cols-2 lg:gap-10">
          <RoleColumn profile={superAdminProfile} id="super-admin" />
          <RoleColumn profile={adminProfile} id="admin" />
        </div>

        <p className="mt-14 text-center text-xs leading-relaxed text-slate-500">
          Roadmap implementasi dapat berbeda per modul; gunakan halaman ini
          sebagai acuan fungsional, bukan daftar fitur yang sudah 100% tersedia
          di build saat ini.
        </p>
      </main>
    </div>
  );
}

function RoleColumn({ profile, id }) {
  const isViolet = profile.accent === "violet";
  const shellClass = isViolet
    ? "border-violet-200/70 bg-linear-to-b from-violet-50/90 via-white/80 to-white/60 shadow-violet-200/25"
    : "border-sky-200/70 bg-linear-to-b from-sky-50/90 via-white/80 to-white/60 shadow-sky-200/25";

  return (
    <section
      id={id}
      data-role-shell
      className={`relative overflow-hidden rounded-3xl border p-6 shadow-lg backdrop-blur-sm sm:p-8 ${shellClass}`}
    >
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-50 blur-2xl ${
          isViolet ? "bg-violet-400/35" : "bg-cyan-400/35"
        }`}
        aria-hidden
      />
      <header className="relative border-b border-slate-200/60 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {isViolet ? "Peran platform" : "Peran cabang"}
        </p>
        <h2
          className={`mt-2 text-2xl font-semibold tracking-tight sm:text-[1.65rem] ${isViolet ? "text-violet-950" : "text-slate-900"}`}
        >
          <span className="mr-2" aria-hidden>
            {isViolet ? "🧑‍💼" : "🧑‍💻"}
          </span>
          {profile.roleLabel}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{profile.goal}</p>
      </header>

      <ul className="relative mt-6 space-y-4">
        {profile.blocks.map((block) => (
          <li
            key={block.id}
            data-use-block
            className="rounded-2xl border border-white/60 bg-white/75 p-4 shadow-sm shadow-slate-200/40 backdrop-blur-sm sm:p-5"
          >
            <h3 className="flex items-start gap-2 text-base font-semibold text-slate-900">
              <span className="text-lg leading-none" aria-hidden>
                {block.emoji}
              </span>
              <span>{block.title}</span>
            </h3>
            <ul className="mt-3 space-y-2.5 border-t border-slate-100/90 pt-3 text-sm leading-relaxed text-slate-600">
              {block.items.map((item, i) => (
                <li key={i} className="flex gap-2.5">
                  <span
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                      isViolet ? "bg-violet-400" : "bg-sky-400"
                    }`}
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
