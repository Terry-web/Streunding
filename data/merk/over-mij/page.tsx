// merk/over-mij/page.tsx  →  src/app/over-mij/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Over mij",
  description: "Wie is Terry en waarom wil hij imker worden? Lees mijn verhaal.",
};

const tijdlijn = [
  { periode: "Altijd al", titel: "De droom", tekst: "Al zolang ik me kan herinneren wilde ik imker worden. Bijen fascineren me — hun organisatie, hun rol in de natuur, de honing die ze maken." },
  { periode: "2025", titel: "Twee kasten getimmerd", tekst: "Nog voor het eerste volk heb ik zelf twee bijenkasten getimmerd. Leren door te doen — met hout, zaag en veel plezier." },
  { periode: "2025", titel: "Eerste braggot", tekst: "Een braggot is een brouwsel van honing en mout. Mijn eerste eigen recept: oefenen met honing voordat de bijen er zijn." },
  { periode: "2026", titel: "Oma's Appeltjes", tekst: "De derde mede, met appel. Staat op de bar te rijpen; over een paar maanden weet ik of het wat is." },
  { periode: "2027", titel: "Basiscursus", tekst: "De officiële basis imkercursus: de theorie leren, andere imkers ontmoeten en me goed voorbereiden op het eerste volk." },
];

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-3.5">
      <span className="h-px w-9 bg-[#b68235]/60" />
      <span className="text-xs uppercase tracking-[0.2em] text-[#7d5411]">{children}</span>
    </span>
  );
}

export default async function OverMij() {
  const supabase = await createClient();
  const { count: aantalKasten } = await supabase
    .from("hives")
    .select("*", { count: "exact", head: true })
    .eq("is_public", true);

  const feiten = [
    { label: "Kasten zelf getimmerd", waarde: String(aantalKasten ?? 2) },
    { label: "Medes gebrouwen", waarde: "3" },
    { label: "Basiscursus imkeren", waarde: "2027" },
    { label: "Eerste volk", waarde: "Binnenkort" },
  ];

  return (
    <div className="bg-[#f3f2f2] text-[#201f1d]">

      {/* Hero */}
      <section className="pt-16">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-[minmax(0,1fr)_380px] md:gap-16">
          <div className="flex flex-col items-start gap-5">
            <Kicker>Over mij</Kicker>
            <h1 className="text-5xl leading-[1.02] md:text-[4.125rem]">
              Hallo,
              <br />
              ik ben Terry
            </h1>
            <span className="h-px w-full bg-[#201f1d]/15" />
            <p
              className="max-w-[34ch] text-[1.625rem] italic leading-[1.45] text-[#4a4744]"
              style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
            >
              Beginnend imker, nieuwsgierig mens, en eigenaar van twee kasten die langzaam
              mijn leven overnemen.
            </p>
            <dl className="mt-2 flex w-full max-w-[420px] flex-col border-b border-[#201f1d]/15">
              {feiten.map((f) => (
                <div
                  key={f.label}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 border-t border-[#201f1d]/15 py-3"
                >
                  <dt className="text-[13px] uppercase tracking-[0.14em] text-[#605d5d]">{f.label}</dt>
                  <dd
                    className="m-0 text-[19px] tabular-nums"
                    style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 600 }}
                  >
                    {f.waarde}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <figure className="m-0">
            <div className="border-[8px] border-[#eae9e9] outline outline-1 outline-[#201f1d]/15">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src="/mede.jpg"
                  alt="Oma's Appeltjes rijpt in een ballon op de bar"
                  fill
                  priority
                  sizes="(min-width: 768px) 380px, 100vw"
                  className="object-cover [filter:sepia(0.2)_saturate(0.85)_contrast(1.04)]"
                />
              </div>
            </div>
            <figcaption className="pt-3 text-xs italic tracking-[0.06em] text-[#605d5d]">
              Oma’s Appeltjes op de bar.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Verhaal */}
      <section className="border-t border-[#201f1d]/15 bg-[#eeeceb]">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[300px_minmax(0,1fr)]">
          <div className="flex flex-col gap-4 md:sticky md:top-28 md:self-start">
            <Kicker>Mijn verhaal</Kicker>
            <h2 className="text-[2.75rem] leading-[1.08]">Hoe het zo gekomen is</h2>
          </div>
          <div className="flex flex-col gap-7 md:border-l md:border-[#201f1d]/15 md:pl-12">
            <p className="text-lg leading-[1.78] text-[#3a3735] [hyphens:auto] md:text-justify">
              Imkeren stond al jaren op mijn lijstje. De combinatie van natuur en ambacht, en
              het idee dat je een bijenvolk beheert — een levende, ademende gemeenschap van
              duizenden individuen — vond ik altijd al ongelofelijk fascinerend.
            </p>
            <p className="text-lg leading-[1.78] text-[#3a3735] [hyphens:auto] md:text-justify">
              In 2025 zette ik de eerste stap: twee bijenkasten, zelf getimmerd. Nog zonder
              bijen, maar met veel enthousiasme en een zaag die scherper had gekund. In 2027
              start ik de officiële basiscursus — dan komen de bijen er écht in.
            </p>
            <blockquote className="my-2 border-y border-[#b68235]/50 px-0 py-6">
              <p
                className="m-0 text-[2rem] italic leading-[1.3] tracking-[-0.01em]"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                Deze website is mijn dagboek: wat ik leer, wat misgaat, en wat verrassend goed
                gaat.
              </p>
            </blockquote>
            <p className="text-lg leading-[1.78] text-[#3a3735] [hyphens:auto] md:text-justify">
              Ik schrijf het op zoals het gaat, zonder mooipraterij. Als het je helpt om zelf
              de stap te zetten, is dat mooi. En als je een tip voor me hebt: die is altijd
              welkom.
            </p>
          </div>
        </div>
      </section>

      {/* Tijdlijn */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-[300px_minmax(0,1fr)]">
          <div className="flex flex-col gap-4 md:sticky md:top-28 md:self-start">
            <Kicker>Terugkijken</Kicker>
            <h2 className="text-[2.75rem] leading-[1.08]">De weg hier naartoe</h2>
          </div>
          <ol className="m-0 list-none border-b border-[#201f1d]/15 p-0">
            {tijdlijn.map((t) => (
              <li
                key={t.titel}
                className="grid gap-4 border-t border-[#201f1d]/15 py-7 sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-8"
              >
                <span className="pt-1 text-sm uppercase tracking-[0.1em] tabular-nums text-[#7d5411]">
                  {t.periode}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[1.6rem] leading-[1.1]" style={{ fontWeight: 600 }}>
                    {t.titel}
                  </h3>
                  <p className="max-w-[62ch] text-base leading-[1.7] text-[#4a4744]">{t.tekst}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-[#201f1d]/15 bg-[#eeeceb]">
        <div className="mx-auto grid max-w-6xl items-start gap-12 px-6 py-20 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] md:gap-16">
          <div className="flex flex-col gap-5">
            <Kicker>Vragen of ideeën?</Kicker>
            <h2 className="text-[2.75rem] leading-[1.06]">Neem contact op</h2>
            <span className="h-px w-full bg-[#201f1d]/15" />
            <p className="max-w-[42ch] text-[17px] leading-[1.72] text-[#4a4744] [hyphens:auto] md:text-justify">
              Wil je iets vragen over imkeren, een tip delen of gewoon hallo zeggen? Stuur een
              bericht — ik antwoord meestal binnen een paar dagen.
            </p>
            <p className="flex items-center gap-3 text-[15px] text-[#4a4744]">
              <span className="h-px w-4 bg-[#b68235]" />
              Oldambt, Groningen
            </p>
          </div>
          <div className="rounded border border-[#201f1d]/15 bg-[#f6f5f4] p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
