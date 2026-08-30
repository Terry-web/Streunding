// merk/kasten/page.tsx  →  src/app/kasten/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { hiveTypeLabels } from "@/lib/beheer/labels";

export const metadata: Metadata = {
  title: "De kasten",
  description: "Hoe ik twee bijenkasten zelf timmerde — van zaag tot geschilderde kast.",
};

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68235] rounded-sm";
const heading = { fontFamily: "var(--font-heading), Georgia, serif" } as const;

const spec = [
  { label: "Hout", uitleg: "Douglas: van nature vochtwerend, dus minder onderhoud dan grenen.", waarde: "22 mm" },
  { label: "Raatafstand", uitleg: "De bijenmaat — te ruim en ze bouwen wildbouw, te krap en ze kitten alles vast.", waarde: "8–9 mm" },
  { label: "Broedramen", uitleg: "Standaard Simplex-broedkamer, zodat materiaal uitwisselbaar blijft.", waarde: "10 stuks" },
  { label: "Hoeken", uitleg: "Op 45 graden gezaagd voor een strakke, waterdichte naad.", waarde: "45°" },
  { label: "Verbinding", uitleg: "Constructielijm plus roestvrije nagels — de kast staat buiten.", waarde: "Lijm + rvs" },
  { label: "Afwerking", uitleg: "Alleen aan de buitenkant geschilderd; bijen zijn gevoelig voor chemie binnen.", waarde: "Buiten" },
];

const stappen = [
  { nr: "01", titel: "Materiaal kiezen", tekst: "Voor een Simplex-kast heb je hout nodig dat weerbestendig is en genoeg isoleert. Ik koos 22 mm douglas: van nature vochtwerend, dus minder onderhoud dan grenen." },
  { nr: "02", titel: "Maten opzoeken", tekst: "De Simplex heeft vaste maten die de bijenmaat respecteren: 8 tot 9 mm tussen de raten. Die maten vind je bij de imkersverenigingen." },
  { nr: "03", titel: "Zagen en schuren", tekst: "Kast één: veel schuurwerk achteraf. Kast twee: beter gezaagd, nauwelijks schuurwerk. Leren door te doen." },
  { nr: "04", titel: "Lijmen en nagelen", tekst: "Buitenhoeken op 45 graden voor een strakke afwerking. Constructielijm en roestvrije nagels, want de kast staat buiten." },
  { nr: "05", titel: "Schilderen", tekst: "Buitenkant in een lichte kleur — bijen navigeren ook op kleur. Binnenkant blijft blank: ze zijn gevoelig voor chemische stoffen." },
  { nr: "06", titel: "Wachten", tekst: "Beide kasten staan klaar in de schuur. Ze wachten op hun eerste bewoners, na de basiscursus in 2027." },
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

export default async function Kasten() {
  const supabase = await createClient();
  const { data: hives } = await supabase
    .from("hives")
    .select("*")
    .eq("is_public", true)
    .order("purchase_date", { ascending: true });

  const kasten = hives ?? [];
  const types = new Set(kasten.map((h) => h.type).filter(Boolean));
  const eersteType = [...types][0];
  const typeLabel =
    types.size === 1 ? hiveTypeLabels[eersteType as string] ?? eersteType : types.size > 1 ? "Gemengd" : "Simplex";

  const jaren = kasten
    .map((h) => h.purchase_date)
    .filter((d): d is string => !!d)
    .map((d) => new Date(d).getFullYear());
  const gebouwd =
    jaren.length === 0
      ? "2025–2026"
      : Math.min(...jaren) === Math.max(...jaren)
      ? String(Math.min(...jaren))
      : `${Math.min(...jaren)}–${Math.max(...jaren)}`;

  const kerncijfers = [
    { label: "Kasten gebouwd", waarde: String(kasten.length || 2) },
    { label: "Kasttype", waarde: typeLabel },
    { label: "Gebouwd in", waarde: gebouwd },
    { label: "Eerste bewoners", waarde: "2027" },
  ];

  return (
    <div className="bg-[#f3f2f2] text-[#201f1d]">

      {/* Hero */}
      <section className="pt-16">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] md:gap-16">
          <div className="flex flex-col items-start gap-5">
            <Kicker>De kasten</Kicker>
            <h1 className="text-5xl leading-[1.02] md:text-[4.25rem]">
              Van plank
              <br />
              tot kast
            </h1>
            <span className="h-px w-full bg-[#201f1d]/15" />
            <p className="max-w-[46ch] text-lg leading-[1.72] text-[#4a4744] [hyphens:auto] md:text-justify">
              Twee Simplex-kasten, zelf getimmerd, nog voordat er één bij in de buurt was. Je kunt
              een kast kopen — maar dan weet je niet waarom elke maat is zoals hij is.
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
                  src="/kast-b.jpg"
                  alt="De zelfgetimmerde kast, geschilderd en klaar"
                  fill
                  priority
                  sizes="(min-width: 768px) 42vw, 100vw"
                  className="object-cover [filter:sepia(0.2)_saturate(0.85)_contrast(1.04)]"
                />
              </div>
            </div>
            <figcaption className="pt-3 text-xs italic tracking-[0.06em] text-[#605d5d]">
              Kast B, gebouwd in 2026 — geschilderd en klaar voor bewoners.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Waarom zelf bouwen */}
      <section className="border-t border-[#201f1d]/15 bg-[#eeeceb]">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[300px_minmax(0,1fr)]">
          <div className="flex flex-col gap-4 md:sticky md:top-28 md:self-start">
            <Kicker>Het verhaal</Kicker>
            <h2 className="text-[2.75rem] leading-[1.08]">Waarom zelf bouwen?</h2>
          </div>
          <div className="flex flex-col gap-6 md:border-l md:border-[#201f1d]/15 md:pl-12">
            <p className="text-lg leading-[1.78] text-[#3a3735] [hyphens:auto] md:text-justify">
              Je kunt een bijenkast kopen. Maar ik wilde begrijpen hoe een kast in elkaar zit
              vóórdat ik hem ga gebruiken. Elke maat heeft een reden, elke opening een functie.
              Door het zelf te bouwen leer je dat vanzelf — met je handen, niet uit een boek.
            </p>
            <blockquote className="my-1 border-y border-[#b68235]/50 px-0 py-6">
              <p className="m-0 text-[1.9rem] italic leading-[1.3] tracking-[-0.01em]" style={heading}>
                Kast één was een leermoment. Kast twee werd een stuk beter. Precies zoals imkeren
                zelf werkt.
              </p>
            </blockquote>
            <p className="text-lg leading-[1.78] text-[#3a3735] [hyphens:auto] md:text-justify">
              Planken net niet recht, scharnieren scheef, afwerking ruw — dat was de eerste. De
              tweede zaagde ik nauwkeuriger en hoefde ik nauwelijks bij te schuren. Beide staan nu
              in de schuur en wachten op 2027, als ik na de basiscursus mijn eerste volk ophaal.
            </p>
          </div>
        </div>
      </section>

      {/* Mijn kasten */}
      {kasten.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-6">
            <h2 className="text-[2.625rem] leading-none">Mijn kasten</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-[#7d5411]">In het echt</span>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {kasten.map((h) => (
              <Link
                key={h.id}
                href={`/kasten/${h.id}`}
                className={`flex flex-col overflow-hidden rounded border border-[#201f1d]/15 bg-[#f6f5f4] text-[#201f1d] transition-colors hover:border-[#b68235] ${focus}`}
              >
                <div className="flex items-start justify-between gap-5 px-7 pb-5 pt-7">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-[1.75rem] leading-[1.1]" style={{ ...heading, fontWeight: 600 }}>
                      {h.label}
                    </h3>
                    <span className="text-[13px] tracking-[0.05em] text-[#605d5d]">
                      {[hiveTypeLabels[h.type ?? ""] ?? h.type, h.purchase_date ? `gebouwd ${new Date(h.purchase_date).getFullYear()}` : null, "Oldambt"]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </div>
                  <span className="shrink-0 rounded-sm border border-[#b68235]/60 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-[#7d5411]">
                    Leeg
                  </span>
                </div>
                <span className="mx-7 mb-7 mt-5 self-start rounded border border-[#b68235] px-4.5 py-2.5 text-[15px] tracking-[0.06em] text-[#7d5411]" style={{ ...heading, fontWeight: 600 }}>
                  Bekijk deze kast
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Specificatie */}
      <section className="border-t border-[#201f1d]/15 band-donker px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[300px_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <Kicker tone="dark">Specificatie</Kicker>
            <h2 className="text-[2.625rem] leading-[1.06] text-[#f3f2f2]">Zo is hij gebouwd</h2>
            <p className="max-w-[30ch] text-[15px] leading-[1.7] text-[#bab6b6]">
              De maten die de bijenmaat respecteren — daar zit de hele kast in.
            </p>
          </div>
          <div className="flex flex-col border-b border-[#f3f2f2]/20">
            {spec.map((s) => (
              <div key={s.label} className="grid items-baseline gap-3 border-t border-[#f3f2f2]/20 py-4 sm:grid-cols-[180px_minmax(0,1fr)_140px] sm:gap-7">
                <span className="text-xs uppercase tracking-[0.14em] text-[#e1ad66]">{s.label}</span>
                <span className="text-[15px] leading-[1.6] text-[#d7d3d3]">{s.uitleg}</span>
                <span className="text-[19px] tabular-nums text-[#f3f2f2] sm:text-right" style={{ ...heading, fontWeight: 600 }}>
                  {s.waarde}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stappen */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-[300px_minmax(0,1fr)]">
          <div className="flex flex-col gap-4 md:sticky md:top-28 md:self-start">
            <Kicker>Hoe ik het deed</Kicker>
            <h2 className="text-[2.75rem] leading-[1.08]">Zes stappen</h2>
            <p className="max-w-[30ch] text-[15px] leading-[1.68] text-[#605d5d]">
              Van de eerste plank in de bouwmarkt tot twee kasten in de schuur.
            </p>
          </div>
          <ol className="m-0 list-none border-b border-[#201f1d]/15 p-0">
            {stappen.map((s) => (
              <li key={s.nr} className="grid grid-cols-[56px_minmax(0,1fr)] items-baseline gap-7 border-t border-[#201f1d]/15 py-6">
                <span className="text-[2.125rem] leading-none tabular-nums text-[#b68235]" style={heading}>{s.nr}</span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[1.55rem] leading-[1.1]" style={{ ...heading, fontWeight: 600 }}>{s.titel}</h3>
                  <p className="max-w-[64ch] text-base leading-[1.7] text-[#4a4744]">{s.tekst}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Slot */}
      <section className="border-t border-[#201f1d]/15 bg-[#eeeceb] px-6 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex flex-col gap-3.5">
            <Kicker>Het hele verhaal</Kicker>
            <h2 className="text-[2.5rem] leading-[1.08]">Twee kasten timmeren</h2>
            <p className="max-w-[52ch] text-[17px] leading-[1.7] text-[#4a4744]">
              In de blog staat het uitgebreide verslag: de misrekeningen, de scheve scharnieren en
              wat ik anders zou doen.
            </p>
          </div>
          <Link
            href="/blog/twee-kasten-timmeren"
            className={`whitespace-nowrap rounded border border-[#b68235] px-7 py-3.5 text-base tracking-[0.06em] text-[#7d5411] transition-colors hover:bg-[#b68235]/10 ${focus}`}
            style={{ ...heading, fontWeight: 600 }}
          >
            Lees het blogbericht
          </Link>
        </div>
      </section>
    </div>
  );
}
