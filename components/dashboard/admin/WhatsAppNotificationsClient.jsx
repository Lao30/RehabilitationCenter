"use client";

import gsap from "gsap";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { openWhatsAppWithLog } from "@/app/(dashboard)/admin/notifications/actions";
import { buildWaMessage, WA_TEMPLATE_OPTIONS } from "@/lib/wa-templates";

const waGreen = "#25D366";
const waGreenHover = "#1ebe57";

const iconWa = (
  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.883 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/**
 * @typedef {{
 *   id: string,
 *   fullName: string,
 *   phone: string | null,
 *   hasPhone: boolean,
 *   previewContext: {
 *     guardianName: string,
 *     branchName: string,
 *     patientName: string,
 *     patientNames: string,
 *     nextSessionStart: string | null,
 *   },
 * }} GuardianRow
 */

/**
 * @typedef {{ id: string, recipientLabel: string, snippet: string, createdLabel: string, status: string }} WaLogRow
 */

/**
 * @param {{
 *   guardians: GuardianRow[],
 *   logs: WaLogRow[],
 *   connectionHint: string | null,
 * }} props
 */
export default function WhatsAppNotificationsClient({
  guardians,
  logs,
  connectionHint,
}) {
  const router = useRouter();
  const rootRef = useRef(null);
  const didAnimate = useRef(false);
  const [guardianId, setGuardianId] = useState("");
  const [templateKey, setTemplateKey] = useState(WA_TEMPLATE_OPTIONS[0]?.key ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const selected = useMemo(
    () => guardians.find((g) => g.id === guardianId) ?? null,
    [guardians, guardianId],
  );

  const preview = useMemo(() => {
    if (!selected || !templateKey) return "";
    return buildWaMessage(templateKey, selected.previewContext);
  }, [selected, templateKey]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || didAnimate.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      didAnimate.current = true;
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from(root.querySelectorAll("[data-wa-card]"), {
        opacity: 0,
        y: 16,
        duration: 0.45,
        stagger: 0.08,
        ease: "power2.out",
      });
    }, root);
    didAnimate.current = true;
    return () => ctx.revert();
  }, []);

  async function handleSend() {
    setError("");
    if (!guardianId || !templateKey) {
      setError("Pilih wali dan template pesan.");
      return;
    }
    if (!selected?.hasPhone) {
      setError("Wali ini belum punya nomor WhatsApp yang valid.");
      return;
    }
    setBusy(true);
    try {
      const result = await openWhatsAppWithLog({ guardianId, templateKey });
      if (result.ok && "url" in result && result.url) {
        window.open(result.url, "_blank", "noopener,noreferrer");
        router.refresh();
      } else {
        setError("error" in result ? result.error : "Gagal membuka WhatsApp.");
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  function statusLabel(s) {
    if (s === "terkirim") return "Terkirim";
    return s;
  }

  return (
    <div ref={rootRef} className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:px-6">
      {connectionHint ? (
        <div
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          role="status"
        >
          {connectionHint}
        </div>
      ) : null}

      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Notifikasi WhatsApp
        </h1>
        <p className="text-sm text-slate-600">
          Kirim pesan ke wali pasien lewat WhatsApp Web / aplikasi. Riwayat tercatat di log cabang.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <section
          data-wa-card
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ring-1 ring-slate-100"
        >
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-500">
            Kirim notifikasi WA
          </h2>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Pilih wali
              <select
                value={guardianId}
                onChange={(e) => setGuardianId(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-inner outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="">Pilih wali…</option>
                {guardians.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.fullName}
                    {!g.hasPhone ? " (tanpa nomor WA)" : ""}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Template pesan
              <select
                value={templateKey}
                onChange={(e) => setTemplateKey(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 shadow-inner outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                {WA_TEMPLATE_OPTIONS.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Preview pesan
              <textarea
                readOnly
                value={preview}
                rows={10}
                className="mt-1.5 w-full resize-none rounded-lg border border-emerald-100 bg-emerald-50/80 px-3 py-2.5 text-sm leading-relaxed text-slate-800 outline-none"
                placeholder="Pilih wali dan template untuk melihat pratinjau…"
              />
            </label>

            {error ? (
              <p className="text-sm text-rose-600" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="button"
              onClick={handleSend}
              disabled={busy || !guardianId || !selected?.hasPhone}
              className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-md transition enabled:cursor-pointer enabled:hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: waGreen }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = waGreenHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = waGreen;
              }}
            >
              {iconWa}
              {busy ? "Membuka…" : "Kirim via WhatsApp"}
            </button>
          </div>
        </section>

        <section
          data-wa-card
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm ring-1 ring-slate-100"
        >
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-500">
            Log pengiriman WA
          </h2>

          {logs.length === 0 ? (
            <p className="text-sm text-slate-500">Belum ada log pengiriman.</p>
          ) : (
            <ul className="max-h-[min(70vh,520px)] space-y-3 overflow-y-auto pr-1">
              {logs.map((row) => (
                <li
                  key={row.id}
                  className="rounded-xl border border-emerald-100/90 bg-emerald-50/60 p-3 text-sm shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="font-medium text-slate-900">{row.recipientLabel}</div>
                      <p className="text-slate-700">{row.snippet}</p>
                      <div className="text-xs text-slate-500">{row.createdLabel}</div>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                      style={{ backgroundColor: waGreen }}
                    >
                      {statusLabel(row.status)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
