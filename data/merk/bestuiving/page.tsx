// merk/bestuiving/page.tsx  →  src/app/bestuiving/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AanbodCard from "./AanbodCard";
import TierCard from "./TierCard";
import { tiers } from "./tiers";

export const metadata: Metadata = {
  title: "Bestuiving",
  description: "Bestuiving op maat voor jouw tuin, boomgaard of teelt — vraag het aan.",
};

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68235] rounded-sm";

export default async function Bestuiving() {
  const supabase = await createClient();
  const { data: aanbod } = await supabase
    .from("bestuifvolk_aanbod")
    .select("*")
    .eq("actief", true)
    .order("created_at", { ascending: false });

  return (
    <div className="bg-[#f3f2f2] text-[#201f1d]">

      {/* Hero */}
      <section className="pt-16">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] md:gap-16">
          <div className="flex flex-col items-start gap-5">
            <span className="flex items-center gap-3.5">
              <span className="h-px w-9 bg-[#b68235]/60" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#7d5411]">
                Bestuiving op locatie
              </span>
            </span>
            <h1 className="text-5xl leading-[1.02] md:text-[4rem]">
              Bestuifvolken
              <br />
              voor jouw bloei
            </h1>
            <span className="h-px w-full bg-[#201f1d]/15" />
            <p className="max-w-[46ch] text-lg leading-[1.7] text-[#4a4744] [hyphens:auto] md:text-justify">
              Een sterk volk op de juiste plek, op het juiste moment. Van één kast in een
              moestuin tot een bestuivingsplanning voor een hele boomgaard — laat je
              gegevens achter en je krijgt binnen twee werkdagen bericht.
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#605d5d]">
              {["Lokale levering en plaatsing", "Reactie binnen 2 werkdagen"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="h-px w-3.5 bg-[#b68235]" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <figure className="m-0 border-[7px] border-[#eae9e9] outline outline-1 outline-[#201f1d]/15">
            <div className="relative aspect-square w-full">
              <Image
                src="/boomgaard-vierkant.jpg"
                alt="Een rij bijenkasten langs een boomgaard in volle bloei"
                fill
                priority
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover [filter:sepia(0.2)_saturate(0.85)_contrast(1.04)]"
              />
            </div>
          </figure>
        </div>
      </section>

      {/* Tiers */}
      <section className="border-t border-[#201f1d]/15 bg-[#eeeceb]">
        <div className="mx-auto flex max-w-6xl flex-col gap-9 px-6 py-20">
          <div className="flex flex-wrap items-baseline justify-between gap-6">
            <h2 className="text-[2.625rem] leading-none">Vier vormen van bestuiving</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-[#7d5411]">Kies wat past</span>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {tiers.map((tier) => (
              <TierCard key={tier.id} tier={tier} />
            ))}
          </div>
        </div>
      </section>

      {/* Actueel aanbod */}
      {aanbod && aanbod.length > 0 && (
        <section className="border-t border-[#201f1d]/15">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="mb-8 flex flex-wrap items-baseline justify-between gap-6">
              <h2 className="text-[2.625rem] leading-none">Direct beschikbaar</h2>
              <span className="text-xs uppercase tracking-[0.2em] tabular-nums text-[#7d5411]">
                Seizoen {new Date().getFullYear()}
              </span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {aanbod.map((a) => (
                <AanbodCard key={a.id} aanbod={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Slot */}
      <section className="border-t border-[#201f1d]/15 band-donker px-6 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex flex-col items-start gap-4">
            <span className="flex items-center gap-3.5">
              <span className="h-px w-9 bg-[#e1ad66]" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#e1ad66]">
                Twijfel je nog?
              </span>
            </span>
            <h2 className="text-[2.625rem] leading-[1.08] text-[#f3f2f2]">
              Niet zeker welke vorm past?
            </h2>
            <p className="max-w-[44ch] text-[17px] leading-[1.7] text-[#bab6b6]">
              Stuur me je situatie — oppervlakte, gewas, wanneer de bloei begint. Dan denk ik
              mee, ook als het uiteindelijk geen volk van mij wordt.
            </p>
          </div>
          <div className="flex flex-wrap gap-3.5 md:justify-end">
            <Link
              href="/over-mij"
              className={`rounded border border-[#e1ad66] px-6 py-3.5 text-base tracking-[0.06em] text-[#e1ad66] transition-colors hover:bg-[#e1ad66]/10 ${focus}`}
              style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 600 }}
            >
              Bespreek jouw situatie
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
