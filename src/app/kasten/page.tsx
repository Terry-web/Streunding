import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { hiveTypeLabels } from "@/lib/beheer/labels";

export const metadata: Metadata = {
  title: "De kasten",
  description: "Hoe ik twee bijenkassen zelf timmerde — van zaag tot geschilderde kast.",
};

const stappen = [
  { nr: "01", titel: "Materiaal kiezen", tekst: "Voor een Simplex kast heb je hout nodig dat weerbestendig is en genoeg isoleert. Ik koos voor 22mm douglas planken — van nature vochtwerend, dus minder onderhoud dan grenen." },
  { nr: "02", titel: "Maten opzoeken", tekst: "De Simplex kast heeft vaste maten die de bijenmaat respecteren: 8 tot 9mm ruimte tussen de raten. Die maten vind je online bij imkersverenigingen." },
  { nr: "03", titel: "Zagen en schuren", tekst: "Kast één: veel schuurwerk achteraf. Kast twee: beter gezaagd, minder schuurwerk. Leren door te doen." },
  { nr: "04", titel: "Lijmen en nagelen", tekst: "Buitenhoeken op 45 graden gezaagd voor een strakke afwerking. Constructielijm en roestvrije nagels voor duurzaamheid buiten." },
  { nr: "05", titel: "Schilderen", tekst: "Buitenkant geschilderd met lichte kleur — bijen navigeren ook op kleur. Geen verf op de binnenkant: bijen zijn gevoelig voor chemische stoffen." },
  { nr: "06", titel: "Klaar!", tekst: "Beide kasten staan klaar in de schuur. Ze wachten op hun eerste bewoners — dat wordt 2027 na de basis imkercursus." },
];

export default async function Kasten() {
  const supabase = await createClient();
  const { data: hives } = await supabase
    .from("hives")
    .select("*")
    .eq("is_public", true)
    .order("purchase_date", { ascending: true });

  const aantal = hives?.length ?? 0;

  const types = new Set((hives ?? []).map((h) => h.type).filter(Boolean));
  const eersteType = [...types][0];
  const typeLabel =
    types.size === 1 ? hiveTypeLabels[eersteType as string] ?? eersteType : types.size > 1 ? "Gemengd" : "—";

  const jaren = (hives ?? [])
    .map((h) => h.purchase_date)
    .filter((d): d is string => !!d)
    .map((d) => new Date(d).getFullYear());
  const gebouwdLabel = jaren.length > 0 ? String(Math.min(...jaren)) : "—";

  return (
    <div className="min-h-screen bg-amber-50 text-stone-800">

      {/* Hero */}
      <section className="relative pt-16 min-h-[55vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-900 via-amber-900 to-stone-900">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="honeycomb" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse">
                <polygon points="28,2 54,17 54,47 28,62 2,47 2,17" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
                <polygon points="28,52 54,67 54,97 28,112 2,97 2,67" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#honeycomb)"/>
          </svg>
        </div>
        <div className="absolute top-10 right-20 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl animate-float delay-200" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto py-20">
          <div className="text-7xl mb-6 animate-float inline-block">🪵</div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-none">
            De<br/><span className="text-amber-400">Kasten</span>
          </h1>
          <p className="text-xl text-amber-200 max-w-xl mx-auto leading-relaxed">
            Twee bijenkassen zelf getimmerd — nog vóór het eerste volk. Leren door te doen.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-amber-900 text-white py-10">
        <div className="max-w-3xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          <div><div className="text-3xl mb-1">🪵</div><div className="text-3xl font-black text-amber-400">{aantal}</div><div className="text-amber-200 text-xs uppercase tracking-widest">Kasten</div></div>
          <div><div className="text-3xl mb-1">📐</div><div className="text-3xl font-black text-amber-400">{typeLabel}</div><div className="text-amber-200 text-xs uppercase tracking-widest">Kasttype</div></div>
          <div><div className="text-3xl mb-1">🔨</div><div className="text-3xl font-black text-amber-400">{gebouwdLabel}</div><div className="text-amber-200 text-xs uppercase tracking-widest">Gebouwd</div></div>
        </div>
      </section>

      {/* Mijn kasten */}
      {aantal > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-amber-700 font-semibold uppercase tracking-widest text-sm text-center mb-2">
            In het echt
          </p>
          <h2 className="text-4xl font-black text-center mb-10 text-stone-900">Mijn kasten</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {hives!.map((h) => (
              <div key={h.id} className="bg-white rounded-2xl shadow border border-amber-100 p-7 flex flex-col">
                <h3 className="text-2xl font-black text-stone-900">{h.label}</h3>
                <p className="text-stone-400 text-sm mt-1">
                  {hiveTypeLabels[h.type ?? ""] ?? h.type}
                  {h.purchase_date ? ` · ${new Date(h.purchase_date).getFullYear()}` : ""}
                </p>
                <Link
                  href={`/kasten/${h.id}`}
                  className="mt-5 inline-block bg-amber-600 hover:bg-amber-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors self-start"
                >
                  Bekijk deze kast →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Verhaal */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-amber-700 font-semibold uppercase tracking-widest text-sm text-center mb-2">Het verhaal</p>
        <h2 className="text-4xl font-black text-center mb-10 text-stone-900">Waarom zelf bouwen?</h2>
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow border border-amber-100">
            <p className="text-lg text-stone-600 leading-9">
              Je kunt een bijenkast kopen. Maar ik wilde begrijpen hoe een kast in elkaar zit voordat ik hem
              ga gebruiken. Elke maat heeft een reden, elke opening een functie. Door het zelf te bouwen
              leer je dat vanzelf.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow border border-amber-100">
            <p className="text-lg text-stone-600 leading-9">
              Kast één was een leermoment. Planken net niet recht, scharnieren scheef, afwerking ruw.
              Kast twee werd een stuk beter. Dat is precies hoe imkeren ook werkt — je leert van wat misgaat.
            </p>
          </div>
          <div className="bg-amber-900 rounded-3xl p-8 shadow text-white">
            <p className="text-lg leading-9 text-amber-100">
              Beide kasten staan nu klaar in de schuur. Ze wachten op 2027, als ik na de basis imkercursus
              mijn eerste volk ophaal.
            </p>
          </div>
        </div>
      </section>

      {/* Stappen */}
      <section className="bg-stone-100 py-20">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-amber-700 font-semibold uppercase tracking-widest text-sm text-center mb-2">Hoe ik het deed</p>
          <h2 className="text-4xl font-black text-center mb-14 text-stone-900">Van plank tot kast</h2>
          <div className="space-y-4">
            {stappen.map((s) => (
              <div key={s.nr} className="group flex gap-6 items-start bg-white rounded-2xl p-6 shadow border border-stone-100 hover:shadow-lg hover:-translate-x-1 transition-all">
                <span className="text-3xl font-black text-amber-300 group-hover:text-amber-500 transition-colors shrink-0 leading-none">{s.nr}</span>
                <div>
                  <h3 className="font-black text-stone-900 mb-1">{s.titel}</h3>
                  <p className="text-stone-500 text-sm leading-7">{s.tekst}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-amber-800 to-orange-800 text-white py-20 px-6 text-center overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="text-5xl mb-4">📖</div>
          <h2 className="text-4xl font-black mb-4">Lees ook mijn blog</h2>
          <p className="text-amber-200 text-lg mb-8">Het volledige verhaal over de kasten staat in mijn blog.</p>
          <Link href="/blog/twee-kasten-timmeren"
            className="bg-white text-amber-900 font-bold px-10 py-4 rounded-full hover:bg-amber-100 transition-all hover:scale-105 inline-block shadow-xl text-lg"
          >
            Lees het blogbericht →
          </Link>
        </div>
      </section>

    </div>
  );
}
