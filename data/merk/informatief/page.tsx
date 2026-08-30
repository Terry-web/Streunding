// merk/informatief/page.tsx  →  src/app/informatief/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Informatief",
  description: "Alles over bijen, bijenkasten en imkeren — wat ik leer als beginnend imker.",
};

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68235] rounded-sm";
const heading = { fontFamily: "var(--font-heading), Georgia, serif" } as const;

const inhoud = [
  { nr: "I", titel: "Wie leven er in de kast?", meta: "Koningin, werksters, darren", href: "#volk" },
  { nr: "II", titel: "Wat ze binnenhalen", meta: "Stuifmeel, nectar, honing", href: "#oogst" },
  { nr: "III", titel: "Imkeren door de seizoenen", meta: "Het jaar rond", href: "#seizoenen" },
  { nr: "IV", titel: "Tips voor beginners", meta: "Zes stuks", href: "#tips" },
];

const rollen = [
  { naam: "De koningin", aantal: "1", leeftijd: "5 jaar", taak: "Legt tot 2.000 eieren per dag en houdt met haar feromonen het hele volk bij elkaar. Valt zij weg, dan valt het volk uiteen." },
  { naam: "Werksters", aantal: "60.000", leeftijd: "6 weken", taak: "Alle vrouwtjes die het werk doen: voeden, bouwen, poetsen, bewaken, en pas in hun laatste weken naar buiten om te vliegen." },
  { naam: "Darren", aantal: "500", leeftijd: "3 maanden", taak: "De mannetjes. Geen angel, geen taken in de kast — hun enige opdracht is een koningin bevruchten. In de herfst worden ze buitengezet." },
];

const broed = [
  { dagen: "Dag 1–3", fase: "Ei", tekst: "Eén per cel, rechtop gelegd door de koningin.", balk: "#b68235" },
  { dagen: "Dag 4–9", fase: "Larve", tekst: "Wordt gevoerd en groeit ruim vijftienhonderd keer in gewicht.", balk: "rgba(182,130,53,.75)" },
  { dagen: "Dag 10–20", fase: "Pop", tekst: "Cel wordt gesloten; binnen verandert de larve in een bij.", balk: "rgba(182,130,53,.5)" },
  { dagen: "Dag 21", fase: "Werkster", tekst: "Ze knaagt zich naar buiten en begint direct te poetsen.", balk: "rgba(182,130,53,.3)" },
];

const seizoenen = [
  { seizoen: "Lente", maanden: "mrt – mei", volk: "20.000", acties: ["Eerste inspectie na de winter", "Voedselvoorraad controleren", "Volk bouwt snel uit", "Zwermseizoen begint"] },
  { seizoen: "Zomer", maanden: "jun – aug", volk: "60.000", acties: ["Hoogtepunt van het volk", "Honingoogst in juli en augustus", "Letten op zwermdrang", "Varroabehandeling plannen"] },
  { seizoen: "Herfst", maanden: "sep – nov", volk: "15.000", acties: ["Volk krimpt naar wintersterkte", "Wintervoer geven", "Varroabehandeling uitvoeren", "Muizenrooster plaatsen"] },
  { seizoen: "Winter", maanden: "dec – feb", volk: "10.000", acties: ["Bijen vormen een wintertros", "Niet storen", "Kast controleren op schade", "Cursussen en plannen maken"] },
];

const tips = [
  { nr: "01", tip: "Draag altijd je beschermende kleding, ook als je denkt dat het rustig is." },
  { nr: "02", tip: "Werk met trage, rustige bewegingen. Bijen reageren sterk op snelle gebaren." },
  { nr: "03", tip: "Rook kalmeert: de geur doet ze denken aan brand, waarna ze zich met honing vullen en minder in je geïnteresseerd zijn." },
  { nr: "04", tip: "Inspecteer bij warm, mooi weer tussen tien en vier — dan zijn de vliegsters buiten en is de kast rustiger." },
  { nr: "05", tip: "Schrijf alles op na elke inspectie. Je vergeet meer dan je denkt." },
  { nr: "06", tip: "Sluit je aan bij een lokale imkersvereniging. De kennis die je daar in één avond opdoet, staat in geen boek." },
];

function Kicker({ children, tone = "light" }: { children: React.ReactNode; tone?: "light" | "dark" }) {
  return (
    <span className="flex items-center gap-3.5">
      <span className={`h-px w-9 ${tone === "dark" ? "bg-[#e1ad66]" : "bg-[#b68235]/60"}`} />
      <span className={`text-xs uppercase tracking-[0.2em] ${tone === "dark" ? "text-[#e1ad66]" : "text-[#7d5411]"}`}>
        {children}
      </span>
    </span>
  );
}

export default function Informatief() {
  return (
    <div className="bg-[#f3f2f2] text-[#201f1d]">

      {/* Hero */}
      <section className="pt-16">
        <div className="mx-auto grid max-w-6xl items-end gap-14 px-6 py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)]">
          <div className="flex flex-col items-start gap-5">
            <Kicker>Informatief</Kicker>
            <h1 className="text-5xl leading-[1.02] md:text-[4.25rem]">Alles over bijen</h1>
            <span className="h-px w-full bg-[#201f1d]/15" />
            <p className="max-w-[48ch] text-lg leading-[1.72] text-[#4a4744] [hyphens:auto] md:text-justify">
              Wat ik leer over imkeren, opgeschreven terwijl ik het leer. Geen handboek — een
              leesbaar naslagwerk van een beginner, met de cijfers erbij die ik zelf steeds
              moest opzoeken.
            </p>
            <nav className="mt-1 flex w-full max-w-[520px] flex-col border-b border-[#201f1d]/15">
              {inhoud.map((i) => (
                <a
                  key={i.nr}
                  href={i.href}
                  className={`grid grid-cols-[44px_minmax(0,1fr)_auto] items-baseline gap-4 border-t border-[#201f1d]/15 py-3.5 text-[#201f1d] transition-colors hover:text-[#7d5411] ${focus}`}
                >
                  <span className="text-[13px] tracking-[0.1em] tabular-nums text-[#b68235]">{i.nr}</span>
                  <span className="text-xl" style={{ ...heading, fontWeight: 600 }}>{i.titel}</span>
                  <span className="text-[13px] text-[#605d5d]">{i.meta}</span>
                </a>
              ))}
            </nav>
          </div>
          <figure className="m-0 border-[7px] border-[#eae9e9] outline outline-1 outline-[#201f1d]/15">
            <div className="relative aspect-[3/4] w-full">
              <Image
                src="/hero-kast.jpg"
                alt="Bijen bij de vliegopening van de kast"
                fill
                priority
                sizes="(min-width: 768px) 38vw, 100vw"
                className="object-cover [filter:sepia(0.2)_saturate(0.85)_contrast(1.04)]"
              />
            </div>
          </figure>
        </div>
      </section>

      {/* I — Het volk */}
      <section id="volk" className="scroll-mt-24 border-t border-[#201f1d]/15 bg-[#eeeceb]">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[300px_minmax(0,1fr)]">
          <div className="flex flex-col gap-4 md:sticky md:top-28 md:self-start">
            <Kicker>Het volk · I</Kicker>
            <h2 className="text-[2.75rem] leading-[1.08]">Wie leven er in de kast?</h2>
            <p className="max-w-[32ch] text-[15px] leading-[1.68] text-[#605d5d]">
              Tienduizenden individuen, drie rollen. De cijfers zijn gemiddelden voor een gezond
              volk in het seizoen.
            </p>
          </div>

          <div className="flex flex-col">
            <div className="grid grid-cols-[minmax(0,1fr)] gap-6 border-b border-[#201f1d]/30 pb-3 sm:grid-cols-[170px_100px_120px_minmax(0,1fr)]">
              {["Rol", "Aantal", "Leeft", "Taak"].map((h, idx) => (
                <span
                  key={h}
                  className={`text-[11px] uppercase tracking-[0.16em] text-[#605d5d] ${
                    idx === 1 || idx === 2 ? "sm:text-right" : ""
                  }`}
                >
                  {h}
                </span>
              ))}
            </div>
            {rollen.map((r) => (
              <div
                key={r.naam}
                className="grid items-baseline gap-3 border-b border-[#201f1d]/15 py-5 sm:grid-cols-[170px_100px_120px_minmax(0,1fr)] sm:gap-6"
              >
                <span className="text-[1.45rem] leading-[1.15]" style={{ ...heading, fontWeight: 600 }}>
                  {r.naam}
                </span>
                <span className="text-[1.3rem] tabular-nums sm:text-right" style={heading}>{r.aantal}</span>
                <span className="text-[1.3rem] tabular-nums sm:text-right" style={heading}>{r.leeftijd}</span>
                <span className="text-[15px] leading-[1.68] text-[#4a4744]">{r.taak}</span>
              </div>
            ))}

            <div className="mt-11 flex flex-col gap-5">
              <div className="flex items-baseline gap-4">
                <h3 className="text-[1.625rem]" style={{ ...heading, fontWeight: 600 }}>Van ei tot werkster</h3>
                <span className="h-px flex-1 bg-[#201f1d]/15" />
                <span className="text-[13px] uppercase tracking-[0.14em] tabular-nums text-[#7d5411]">21 dagen</span>
              </div>
              <div className="grid gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
                {broed.map((b) => (
                  <div key={b.fase} className="flex flex-col gap-2.5 pr-5">
                    <span className="h-0.5" style={{ background: b.balk }} />
                    <span className="text-[15px] uppercase tracking-[0.14em] tabular-nums text-[#7d5411]" style={heading}>
                      {b.dagen}
                    </span>
                    <span className="text-[1.3rem] leading-[1.1]" style={{ ...heading, fontWeight: 600 }}>{b.fase}</span>
                    <p className="text-sm leading-[1.6] text-[#605d5d]">{b.tekst}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* II — De oogst */}
      <section id="oogst" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20">
        <div className="grid gap-12 md:grid-cols-[300px_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <Kicker>De oogst · II</Kicker>
            <h2 className="text-[2.75rem] leading-[1.08]">Wat ze binnenhalen</h2>
          </div>
          <div className="grid gap-11 md:grid-cols-2 md:divide-x md:divide-[#201f1d]/15">
            <div className="flex flex-col gap-3.5">
              <h3 className="text-[1.75rem]" style={{ ...heading, fontWeight: 600 }}>Stuifmeel</h3>
              <span className="h-px bg-[#b68235]/50" />
              <p className="text-base leading-[1.75] text-[#3a3735] [hyphens:auto] md:text-justify">
                De eiwitbron voor het broed. Werksters dragen het mee in korfjes op hun
                achterpoten — twee gekleurde bolletjes die je van een afstand ziet aankomen. De
                kleur verraadt de bron: oranje van paardenbloem, grijsblauw van phacelia.
              </p>
            </div>
            <div className="flex flex-col gap-3.5 md:pl-11">
              <h3 className="text-[1.75rem]" style={{ ...heading, fontWeight: 600 }}>Nectar &amp; honing</h3>
              <span className="h-px bg-[#b68235]/50" />
              <p className="text-base leading-[1.75] text-[#3a3735] [hyphens:auto] md:text-justify">
                Nectar is voor tachtig procent water; honing voor minder dan twintig. Dat verschil
                wapperen de bijen eruit met hun vleugels, tot de cel rijp is en ze hem met wax
                dichtzegelen. Pas dan mag je oogsten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* III — Seizoenen */}
      <section id="seizoenen" className="scroll-mt-24 border-t border-[#201f1d]/15 band-donker px-6 py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-11">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-4">
              <Kicker tone="dark">Het jaar rond · III</Kicker>
              <h2 className="text-[2.75rem] leading-[1.06] text-[#f3f2f2]">Imkeren door de seizoenen</h2>
            </div>
            <p className="max-w-[34ch] text-[15px] leading-[1.7] text-[#bab6b6]">
              Wat er in de kast gebeurt, en wat er van mij verwacht wordt.
            </p>
          </div>
          <div className="grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {seizoenen.map((s) => (
              <div key={s.seizoen} className="flex flex-col gap-4 border-l border-[#f3f2f2]/20 px-8">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs uppercase tracking-[0.18em] tabular-nums text-[#e1ad66]">{s.maanden}</span>
                  <h3 className="text-[2.125rem] leading-none text-[#f3f2f2]" style={heading}>{s.seizoen}</h3>
                </div>
                <div className="flex items-baseline gap-2.5 border-b border-[#f3f2f2]/20 pb-3">
                  <span className="text-[1.75rem] leading-none tabular-nums text-[#e1ad66]" style={heading}>{s.volk}</span>
                  <span className="text-xs uppercase tracking-[0.1em] text-[#8a8683]">bijen</span>
                </div>
                <ul className="flex flex-col gap-2.5">
                  {s.acties.map((a) => (
                    <li key={a} className="grid grid-cols-[16px_minmax(0,1fr)] gap-2.5 text-sm leading-[1.6] text-[#d7d3d3]">
                      <span className="mt-[11px] h-px bg-[#e1ad66]/80" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IV — Tips */}
      <section id="tips" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
        <div className="grid gap-12 md:grid-cols-[300px_minmax(0,1fr)]">
          <div className="flex flex-col gap-4 md:sticky md:top-28 md:self-start">
            <Kicker>Van vallen en opstaan · IV</Kicker>
            <h2 className="text-[2.75rem] leading-[1.08]">Tips voor beginners</h2>
            <p className="max-w-[30ch] text-[15px] leading-[1.68] text-[#605d5d]">
              Zes dingen die ik van andere imkers kreeg, en die ik zelf inmiddels ook geloof.
            </p>
          </div>
          <ol className="m-0 list-none border-b border-[#201f1d]/15 p-0">
            {tips.map((t) => (
              <li key={t.nr} className="grid grid-cols-[56px_minmax(0,1fr)] items-baseline gap-7 border-t border-[#201f1d]/15 py-6">
                <span className="text-[2.125rem] leading-none tabular-nums text-[#b68235]" style={heading}>{t.nr}</span>
                <p className="max-w-[64ch] text-[17px] leading-[1.7] text-[#3a3735]">{t.tip}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Slot */}
      <section className="border-t border-[#201f1d]/15 bg-[#eeeceb] px-6 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex flex-col gap-3.5">
            <Kicker>En in de praktijk</Kicker>
            <h2 className="text-[2.5rem] leading-[1.08]">Theorie is mooi. De praktijk is leuker.</h2>
            <p className="max-w-[52ch] text-[17px] leading-[1.7] text-[#4a4744]">
              In de blog staat wat er echt gebeurt als ik dit alles probeer toe te passen —
              inclusief de keren dat het niet werkte.
            </p>
          </div>
          <Link
            href="/blog"
            className={`whitespace-nowrap rounded border border-[#b68235] px-7 py-3.5 text-base tracking-[0.06em] text-[#7d5411] transition-colors hover:bg-[#b68235]/10 ${focus}`}
            style={{ ...heading, fontWeight: 600 }}
          >
            Naar de blog
          </Link>
        </div>
      </section>
    </div>
  );
}
