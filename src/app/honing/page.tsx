// merk/honing/page.tsx  →  src/app/honing/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getBatches, type BatchStatus } from "@/lib/mede";

export const metadata: Metadata = {
  title: "Honing",
  description: "Nog geen eigen honing, wel al drie brouwsels — het brouwregister van 2026.",
};

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68235] rounded-sm";
const heading = { fontFamily: "var(--font-heading), Georgia, serif" } as const;

const KLAAR = "#7d5411", ACTIEF = "#8c2f2f", RIJPT = "#605d5d";

const statusStijl: Record<BatchStatus, { kleur: string; rand: string; dikte: string }> = {
  Gebotteld: { kleur: KLAAR, rand: "rgba(182,130,53,.6)", dikte: "1px" },
  Rijpt: { kleur: RIJPT, rand: "rgba(32,31,29,.24)", dikte: "1px" },
  Vergist: { kleur: ACTIEF, rand: "rgba(140,47,47,.5)", dikte: "2px" },
};

const proces = [
  { nr: "01", titel: "Een sterk volk", tekst: "Zonder bijen geen honing. Het begint bij een gezond volk dat genoeg nectar kan binnenhalen — en dat kost een heel seizoen opbouwen.", maat: "1 volk" },
  { nr: "02", titel: "De dracht", tekst: "Bijen vliegen tot drie kilometer ver. Wat er in die cirkel bloeit, bepaalt de smaak: koolzaad, linde of wilde bloemen.", maat: "3 km straal" },
  { nr: "03", titel: "Rijpen in de raat", tekst: "De bijen wapperen het water uit de nectar en zegelen de cel met was. Pas als ruim de helft verzegeld is, is de honing rijp.", maat: "> 75 % verzegeld" },
  { nr: "04", titel: "Slingeren", tekst: "De raten in de slinger; de centrifugaalkracht doet de rest. Kleverig werk, en je bent een halve dag aan het poetsen.", maat: "" },
  { nr: "05", titel: "Zeven en rusten", tekst: "Door de zeef om wasresten kwijt te raken, dan een paar dagen laten staan zodat de luchtbellen opstijgen.", maat: "2–3 dagen" },
  { nr: "06", titel: "In de pot", tekst: "Gelabeld, afgedicht, gedateerd. Zo weet je over een jaar nog uit welke dracht en welk seizoen hij komt.", maat: "" },
];

const plan = [
  { jaar: "2027", titel: "Eerst het volk", tekst: "Het eerste volk komt na de basiscursus. Dat seizoen oogst ik niets — alles blijft in de kast zodat het volk sterk de winter in gaat." },
  { jaar: "2028", titel: "De eerste oogst", tekst: "Als het volk het goed doet: de eerste eigen honing. Lokale dracht uit Oldambt, van mijn eigen kasten." },
  { jaar: "Later", titel: "Meer volken, meer dracht", tekst: "Uitbreiden naar meerdere volken en locaties, zodat er ook echt verschillende soorten honing te oogsten zijn." },
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

export default function Honing() {
  const batches = getBatches();
  const kerncijfers = [
    { label: "Brouwsels dit jaar", waarde: String(batches.length) },
    { label: "Honing verwerkt", waarde: "±5 kg" },
    { label: "Eerste eigen oogst", waarde: "2028" },
    { label: "Eigen honing tot nu", waarde: "0 kg" },
  ];

  return (
    <div className="bg-[#f3f2f2] text-[#201f1d]">

      {/* Hero */}
      <section className="pt-16">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-[minmax(0,1fr)_400px] md:gap-16">
          <div className="flex flex-col items-start gap-5">
            <Kicker>Honing &amp; brouwen</Kicker>
            <h1 className="text-[2.75rem] leading-[1.02] md:text-[4.125rem]">
              Nog geen eigen honing.
              <br />
              Wel al drie brouwsels.
            </h1>
            <span className="h-px w-full bg-[#201f1d]/15" />
            <p className="max-w-[48ch] text-lg leading-[1.72] text-[#4a4744] [hyphens:auto] md:text-justify">
              De eerste eigen oogst laat nog op zich wachten — het eerste seizoen is voor de bijen.
              Tot die tijd oefen ik met gekochte honing: braggot, appelmede, en een brouwlog waarin
              ook staat wat er misging.
            </p>
            <dl className="mt-1 flex w-full max-w-[440px] flex-col border-b border-[#201f1d]/15">
              {kerncijfers.map((k) => (
                <div key={k.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 border-t border-[#201f1d]/15 py-3">
                  <dt className="text-[13px] uppercase tracking-[0.14em] text-[#605d5d]">{k.label}</dt>
                  <dd className="m-0 text-[19px] tabular-nums" style={{ ...heading, fontWeight: 600 }}>{k.waarde}</dd>
                </div>
              ))}
            </dl>
          </div>
          <figure className="m-0">
            <div className="border-[7px] border-[#eae9e9] outline outline-1 outline-[#201f1d]/15">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src="/mede.jpg"
                  alt="Oma’s Appelmede rijpt in een demijohn op de bar"
                  fill
                  priority
                  sizes="(min-width: 768px) 400px, 100vw"
                  className="object-cover [filter:sepia(0.2)_saturate(0.85)_contrast(1.04)]"
                />
              </div>
            </div>
            <figcaption className="pt-3 text-xs italic tracking-[0.06em] text-[#605d5d]">
              Batch 26332 — Oma’s Appelmede, op de bar.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Brouwregister */}
      <section className="border-t border-[#201f1d]/15 bg-[#eeeceb]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-6">
            <h2 className="text-[2.625rem] leading-none">Het brouwregister</h2>
            <span className="text-xs uppercase tracking-[0.2em] tabular-nums text-[#7d5411]">Seizoen 2026</span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {batches.map((b) => {
              const s = statusStijl[b.status];
              return (
              <article key={b.nr} className="flex flex-col gap-4 rounded border border-[#201f1d]/15 bg-[#f6f5f4] p-7">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs tracking-[0.16em] tabular-nums text-[#b68235]">Batch {b.nr}</span>
                    <h3 className="text-[1.625rem] leading-[1.1]" style={{ ...heading, fontWeight: 600 }}>{b.naam}</h3>
                  </div>
                  <span
                    className="flex shrink-0 items-center gap-2 rounded-sm border px-2.5 py-1 text-[11px] uppercase tracking-[0.14em]"
                    style={{ color: s.kleur, borderColor: s.rand }}
                  >
                    <span className="w-2.5" style={{ height: s.dikte, background: s.kleur }} />
                    {b.status}
                  </span>
                </div>
                <p className="text-[15px] italic leading-[1.6] text-[#605d5d]">{b.type}</p>
                <dl className="m-0 flex flex-col border-b border-[#201f1d]/15">
                  {b.regels.map((r) => (
                    <div key={r.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3.5 border-t border-[#201f1d]/15 py-2.5">
                      <dt className="text-xs uppercase tracking-[0.12em] text-[#605d5d]">{r.label}</dt>
                      <dd className="m-0 text-[17px] tabular-nums" style={{ ...heading, fontWeight: 600 }}>{r.waarde}</dd>
                    </div>
                  ))}
                </dl>
                <p className="text-sm leading-[1.68] text-[#4a4744]">{b.notitie}</p>
              </article>
              );
            })}
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-5">
            {[
              { k: KLAAR, d: "1px", t: "Gebotteld" },
              { k: ACTIEF, d: "2px", t: "Vergist nog" },
              { k: RIJPT, d: "1px", t: "Rijpt" },
            ].map((l) => (
              <li key={l.t} className="flex items-center gap-2.5 text-xs text-[#605d5d]">
                <span className="w-3.5" style={{ height: l.d, background: l.k }} />
                {l.t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Van bloem tot pot */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-[300px_minmax(0,1fr)]">
          <div className="flex flex-col gap-4 md:sticky md:top-28 md:self-start">
            <Kicker>Het proces</Kicker>
            <h2 className="text-[2.75rem] leading-[1.08]">Van bloem tot pot</h2>
            <p className="max-w-[30ch] text-[15px] leading-[1.68] text-[#605d5d]">
              Zes stappen, en bij elke stap iets dat mis kan gaan.
            </p>
          </div>
          <ol className="m-0 list-none border-b border-[#201f1d]/15 p-0">
            {proces.map((p) => (
              <li key={p.nr} className="grid items-baseline gap-3 border-t border-[#201f1d]/15 py-6 sm:grid-cols-[56px_minmax(0,1fr)_140px] sm:gap-7">
                <span className="text-[2.125rem] leading-none tabular-nums text-[#b68235]" style={heading}>{p.nr}</span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[1.55rem] leading-[1.1]" style={{ ...heading, fontWeight: 600 }}>{p.titel}</h3>
                  <p className="max-w-[58ch] text-base leading-[1.7] text-[#4a4744]">{p.tekst}</p>
                </div>
                <span className="text-[13px] leading-[1.55] tabular-nums text-[#7d5411] sm:text-right">{p.maat}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Plan */}
      <section className="border-t border-[#201f1d]/15 band-donker px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[300px_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <Kicker tone="dark">Mijn plan</Kicker>
            <h2 className="text-[2.625rem] leading-[1.06] text-[#f3f2f2]">Hoe ik het ga aanpakken</h2>
          </div>
          <ol className="m-0 list-none border-b border-[#f3f2f2]/20 p-0">
            {plan.map((p) => (
              <li key={p.jaar} className="grid items-baseline gap-3 border-t border-[#f3f2f2]/20 py-6 sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-8">
                <span className="text-[1.5rem] tabular-nums text-[#e1ad66]" style={{ ...heading, fontWeight: 600 }}>{p.jaar}</span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[1.45rem] leading-[1.15] text-[#f3f2f2]" style={{ ...heading, fontWeight: 600 }}>{p.titel}</h3>
                  <p className="max-w-[62ch] text-base leading-[1.7] text-[#bab6b6]">{p.tekst}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Slot */}
      <section className="border-t border-[#201f1d]/15 px-6 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex flex-col gap-3.5">
            <Kicker>Volg mijn reis</Kicker>
            <h2 className="text-[2.5rem] leading-[1.08]">De brouwlogs, volledig</h2>
            <p className="max-w-[52ch] text-[17px] leading-[1.7] text-[#4a4744]">
              In de blog staan de complete logs per batch: de metingen, de stapvoeding en de keren
              dat de vergisting bijna stilviel.
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
