// merk/kalender/page.tsx  →  src/app/kalender/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Kalender from "@/components/Kalender";

export const metadata: Metadata = {
  title: "Imkerkalender",
  description: "Wat doet een imker elke maand? Het imkerjaar, maand voor maand.",
};

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68235] rounded-sm";
const heading = { fontFamily: "var(--font-heading), Georgia, serif" } as const;

export default function KalenderPage() {
  return (
    <div className="bg-[#f3f2f2] text-[#201f1d]">
      <section className="pt-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 px-6 pb-12 pt-20">
          <span className="flex items-center gap-3.5">
            <span className="h-px w-9 bg-[#b68235]/60" />
            <span className="text-xs uppercase tracking-[0.2em] text-[#7d5411]">Imkeralmanak</span>
          </span>
          <div className="grid w-full items-end gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
            <h1 className="text-5xl leading-none md:text-[4.5rem]">
              Het imkerjaar,
              <br />
              maand voor maand
            </h1>
            <p className="text-[17px] leading-[1.72] text-[#4a4744] [hyphens:auto] md:mb-2 md:text-justify">
              Wat er in de kast gebeurt en wat er van de imker wordt verwacht. Gebaseerd op het
              Nederlandse klimaat — in Oldambt loopt het meestal een week achter op het zuiden, en
              het weer heeft altijd het laatste woord.
            </p>
          </div>
        </div>
      </section>

      <Kalender />

      <section className="border-t border-[#201f1d]/15 px-6 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex flex-col gap-3.5">
            <span className="flex items-center gap-3.5">
              <span className="h-px w-9 bg-[#b68235]/60" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#7d5411]">Verder lezen</span>
            </span>
            <h2 className="text-[2.5rem] leading-[1.08]">Waarom dit allemaal moet</h2>
            <p className="max-w-[52ch] text-[17px] leading-[1.7] text-[#4a4744]">
              Op de informatiefpagina staat het achterliggende verhaal: wie er in de kast leven,
              hoe het broed groeit en wat de bijen binnenhalen.
            </p>
          </div>
          <Link
            href="/informatief"
            className={`whitespace-nowrap rounded border border-[#b68235] px-7 py-3.5 text-base tracking-[0.06em] text-[#7d5411] transition-colors hover:bg-[#b68235]/10 ${focus}`}
            style={{ ...heading, fontWeight: 600 }}
          >
            Naar informatief
          </Link>
        </div>
      </section>
    </div>
  );
}
