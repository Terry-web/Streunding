// merk/page.tsx  →  src/app/page.tsx  (vervangt de hele homepage)
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Hero from "@/components/Hero";

export const metadata: Metadata = {
  title: { absolute: "Streunding Imkerij" },
  description:
    "Mijn reis naar het imkeren — kasten timmeren, brouwen met honing en leren over bijen.",
};

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68235] rounded-sm";

const kaarten = [
  { nr: "01", titel: "Mijn verhalen", tekst: "Eerlijke stukken over de weg naar het imkeren — ook als het misgaat.", href: "/blog" },
  { nr: "02", titel: "Over bijen", tekst: "Wat ik leer over volken, seizoenen en het vak zelf.", href: "/informatief" },
  { nr: "03", titel: "De kasten", tekst: "Hoe ik mijn twee kasten van plank tot kast heb getimmerd.", href: "/kasten" },
  { nr: "04", titel: "Honing & mede", tekst: "Brouwen met honing terwijl de kasten nog leeg staan.", href: "/honing" },
];

const reis = [
  { jaar: "Altijd", titel: "De droom", tekst: "Imker worden stond al jaren op mijn lijstje. Bijen fascineren me zo lang als ik me kan herinneren." },
  { jaar: "2025", titel: "Twee kasten", tekst: "Zelf twee bijenkasten getimmerd. Nog geen bijen, maar ze staan klaar in de tuin." },
  { jaar: "2025", titel: "Eerste braggot", tekst: "Gebrouwen met honing en mout — oefenen met honing voordat de bijen er zijn." },
  { jaar: "2026", titel: "Oma's Appeltjes", tekst: "De derde mede, met appel. Rijpt nu op de bar; over een paar maanden weet ik of het wat is." },
  { jaar: "2027", titel: "Basiscursus", tekst: "De officiële basis imkercursus. En dan, eindelijk, het eerste volk." },
];

function Kicker({ children, tone = "light" }: { children: React.ReactNode; tone?: "light" | "dark" }) {
  return (
    <span className="flex items-center gap-3.5">
      <span className={`h-px w-9 ${tone === "dark" ? "bg-[#e1ad66]" : "bg-[#b68235]/60"}`} />
      <span
        className={`text-xs uppercase tracking-[0.2em] ${tone === "dark" ? "text-[#e1ad66]" : "text-[#7d5411]"}`}
      >
        {children}
      </span>
    </span>
  );
}

export default async function Home() {
  const supabase = await createClient();
  const { count: aantalKasten } = await supabase
    .from("hives")
    .select("*", { count: "exact", head: true })
    .eq("is_public", true);

  const cijfers = [
    { waarde: String(aantalKasten ?? 2), label: "Kasten zelf getimmerd" },
    { waarde: "3e", label: "Mede aan het rijpen" },
    { waarde: "2027", label: "Basiscursus imkeren" },
  ];

  return (
    <div className="bg-[#f3f2f2] text-[#201f1d]">
      <Hero />

      {/* Cijfers — drie echte feiten */}
      <section className="band-donker px-6 py-14">
        <ul className="mx-auto grid max-w-4xl grid-cols-1 divide-y divide-[#f3f2f2]/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {cijfers.map((c) => (
            <li key={c.label} className="flex flex-col items-center gap-2 px-6 py-6 text-center sm:py-0">
              <span
                className="text-[3.5rem] leading-none tabular-nums text-[#e1ad66]"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                {c.waarde}
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-[#bab6b6]">{c.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Wie ben ik */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-[320px_minmax(0,1fr)] md:gap-12">
          <div className="flex flex-col gap-4">
            <Kicker>Wie ben ik</Kicker>
            <h2 className="text-[2.75rem] leading-[1.08]">Hallo, ik ben Terry</h2>
          </div>
          <div className="flex flex-col gap-5 md:border-l md:border-[#201f1d]/15 md:pl-12">
            <p className="text-lg leading-[1.75] text-[#3a3735] [hyphens:auto] md:columns-2 md:gap-10 md:text-justify">
              Ik ben imker aan het worden. Twee kasten heb ik zelf getimmerd — van de
              eerste plank tot de laatste lat — en er staat inmiddels een derde mede te
              rijpen op de bar. In 2027 start ik de officiële basiscursus, en
              dan eindelijk het eerste volk. Tot die tijd lees ik, timmer ik, en brouw ik.
              Ik deel hier alles wat ik leer: eerlijk, zonder mooipraterij, inclusief de
              dingen die niet lukken.
            </p>
            <Link
              href="/over-mij"
              className={`self-start border-b border-[#b68235] pb-0.5 text-base tracking-[0.04em] text-[#7d5411] transition-colors hover:text-[#b68235] ${focus}`}
              style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 600 }}
            >
              Meer over mij
            </Link>
          </div>
        </div>
      </section>

      {/* Wat vind je hier */}
      <section className="border-y border-[#201f1d]/15 bg-[#eeeceb]">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20">
          <div className="flex flex-wrap items-baseline justify-between gap-6">
            <h2 className="text-[2.75rem] leading-none">Wat vind je hier?</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-[#7d5411]">Vier ingangen</span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {kaarten.map((k) => (
              <Link
                key={k.nr}
                href={k.href}
                className={`flex min-h-[230px] flex-col gap-3.5 rounded border border-[#201f1d]/15 bg-[#f6f5f4] px-6 pb-6 pt-7 transition-colors hover:border-[#b68235] ${focus}`}
              >
                <span className="text-[13px] tracking-[0.14em] tabular-nums text-[#b68235]">{k.nr}</span>
                <span className="h-px bg-[#201f1d]/15" />
                <h3 className="text-[1.55rem] leading-[1.12]" style={{ fontWeight: 600 }}>
                  {k.titel}
                </h3>
                <p className="text-sm leading-[1.62] text-[#605d5d]">{k.tekst}</p>
                <span
                  className="mt-auto text-sm tracking-[0.06em] text-[#7d5411]"
                  style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 600 }}
                >
                  Lees meer
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Volle plaat — de zwerm */}
      <section className="relative band-donker">
        <div className="relative h-[420px] md:h-[520px]">
          <Image
            src="/zwerm.jpg"
            alt="Een zwerm die zich verzamelt aan een tak"
            fill
            sizes="100vw"
            className="object-cover opacity-90 [filter:sepia(0.2)_saturate(0.85)_contrast(1.04)]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1917]/90 via-[#1a1917]/60 to-[#1a1917]/5" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-6">
            <figure className="m-0 flex max-w-[540px] flex-col gap-5">
              <Kicker tone="dark">Waar het om gaat</Kicker>
              <blockquote className="m-0 text-[2rem] italic leading-[1.22] text-[#f3f2f2] md:text-[2.5rem]"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}>
                Een zwerm kiest zelf waar hij gaat hangen. Mijn taak is klaarstaan als het
                moment komt.
              </blockquote>
            </figure>
          </div>
        </div>
      </section>

      {/* Tijdlijn */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-[320px_minmax(0,1fr)]">
          <div className="flex flex-col gap-4 md:sticky md:top-28 md:self-start">
            <Kicker>Mijn reis</Kicker>
            <h2 className="text-[2.75rem] leading-[1.08]">Hoe het begon</h2>
            <p className="max-w-[30ch] text-[15px] leading-[1.65] text-[#605d5d]">
              Vijf momenten, van een oud lijstje tot het eerste volk.
            </p>
          </div>
          <ol className="m-0 list-none border-b border-[#201f1d]/15 p-0">
            {reis.map((r) => (
              <li key={r.titel} className="grid gap-4 border-t border-[#201f1d]/15 py-7 sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-8">
                <span className="pt-1 text-sm uppercase tracking-[0.1em] tabular-nums text-[#7d5411]">
                  {r.jaar}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[1.6rem] leading-[1.1]" style={{ fontWeight: 600 }}>
                    {r.titel}
                  </h3>
                  <p className="max-w-[60ch] text-base leading-[1.68] text-[#4a4744]">{r.tekst}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Oma's Appeltjes */}
      <section className="border-t border-[#201f1d]/15 bg-[#eeeceb]">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:gap-16">
          <figure className="m-0 border-[7px] border-[#f6f5f4] outline outline-1 outline-[#201f1d]/15">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src="/mede.jpg"
                alt="Oma's Appeltjes, de derde mede, rijpend in een ballon op de bar"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover [filter:sepia(0.2)_saturate(0.85)_contrast(1.04)]"
              />
            </div>
          </figure>
          <div className="flex flex-col items-start gap-5">
            <Kicker>Honing &amp; brouwen</Kicker>
            <h2 className="text-[2.875rem] leading-[1.06]">
              Oma’s Appeltjes,
              <br />
              de derde mede
            </h2>
            <span className="h-px w-full bg-[#201f1d]/15" />
            <p className="max-w-[46ch] text-[17px] leading-[1.72] text-[#4a4744] [hyphens:auto] md:text-justify">
              Troebel nog, maar hij ruikt al goed. Elke batch leert me iets over honing dat
              ik straks bij de kast nodig heb: hoe hij zich gedraagt, wat warmte doet, en
              hoeveel geduld het echt kost.
            </p>
            <Link
              href="/honing"
              className={`rounded border border-[#b68235] px-6 py-3 text-base tracking-[0.06em] text-[#7d5411] transition-colors hover:bg-[#b68235]/10 ${focus}`}
              style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 600 }}
            >
              Naar de brouwsels
            </Link>
          </div>
        </div>
      </section>

      {/* Slot */}
      <section className="border-t border-[#201f1d]/15 band-donker px-6 py-24">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <h2 className="text-[2.875rem] leading-[1.08] text-[#f3f2f2]">Volg mijn imkerreis</h2>
          <p className="max-w-[44ch] text-[17px] leading-[1.7] text-[#bab6b6]">
            Nieuwe verhalen, wat er misgaat en wat er lukt — ongeveer één keer per maand.
          </p>
          <Link
            href="/blog"
            className={`mt-1 rounded border border-[#e1ad66] px-7 py-3.5 text-base tracking-[0.06em] text-[#e1ad66] transition-colors hover:bg-[#e1ad66]/10 ${focus}`}
            style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 600 }}
          >
            Naar de blog
          </Link>
        </div>
      </section>
    </div>
  );
}
