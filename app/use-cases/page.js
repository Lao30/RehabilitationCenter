import UseCasesClient from "@/components/use-cases/UseCasesClient";
import { DM_Sans, Fraunces } from "next/font/google";

const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Use case peran",
  description:
    "Ringkasan use case Super Admin dan Admin operasional untuk RCMS — YPK Bali Rehabilitation Management System.",
};

export default function UseCasesPage() {
  return (
    <div
      className={`${sans.className} min-h-screen antialiased selection:bg-sky-200/80 selection:text-slate-900`}
    >
      <UseCasesClient displayClassName={display.className} />
    </div>
  );
}
