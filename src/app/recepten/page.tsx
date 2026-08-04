import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Recepten",
  description: "Mijn recepten met honing — van braggot tot andere brouwsels en gerechten.",
};

const stappen = [
  { nr: "01", stap: "Breng 3 liter water aan de kook en voeg de lichtgeroosterde moutextract toe. Roer goed door." },
  { nr: "02", stap: "Laat 20 minuten sudderen (niet koken). Voeg de hop toe en laat nog 10 minuten trekken." },
  { nr: "03", stap: "Haal van het vuur. Laat afkoelen tot 30°C. Voeg dan de honing toe en roer langzaam door — honing niet meekoken, dat verdampt de aroma's." },
  { nr: "04", stap: "Giet in een gefermenteerde fles (demijohn of gistvat). Vul aan met koud water tot 10 liter totaal." },
  { nr: "05", stap: "Voeg de geactiveerde gist toe. Sluit af met een waterslot en zet op een donkere plek van 18-22°C." },
  { nr: "06", stap: "Na 2-4 weken is de hoofdgisting klaar. Hevel over naar een schone fles en laat nog 4-6 weken narijpen." },
  { nr: "07", stap: "Bottelen! Gebruik schone flessen en voeg eventueel een klein beetje suiker toe voor koolzuur. Laat nog 2 weken op fles rijpen." },
];

export default function Recepten() {
  return (
    <div className="min-h-screen bg-amber-50 text-stone-800">

      {/* Hero */}
      <section className="relative pt-16 min-h-[55vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-yellow-900 via-amber-800 to-orange-900">
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
        <div className="absolute top-10 right-20 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl animate-float delay-200" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto py-20">
          <div className="text-7xl mb-6 animate-float inline-block">🍺</div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-none">
            Mijn<br/><span className="text-amber-400">Recepten</span>
          </h1>
          <p className="text-xl text-amber-200 max-w-xl mx-auto leading-relaxed">
            Brouwen met honing — mijn experimenten voordat de eigen bijen er zijn.
          </p>
        </div>
      </section>

      {/* Recept: Braggot */}
      <section className="max-w-3xl mx-auto px-6 py-20 reveal">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-5xl">🍺</span>
          <div>
            <p className="text-amber-700 font-semibold uppercase tracking-widest text-sm">Recept #1</p>
            <h2 className="text-4xl font-black text-stone-900">Braggot</h2>
          </div>
        </div>

        {/* Info blokken */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Hoeveelheid", value: "10 liter" },
            { label: "Bereidingstijd", value: "2 uur" },
            { label: "Rijptijd", value: "6-8 weken" },
            { label: "Alcohol", value: "±6-8%" },
          ].map((info) => (
            <div key={info.label} className="bg-white rounded-2xl p-4 text-center shadow border border-amber-100">
              <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mb-1">{info.label}</p>
              <p className="font-black text-stone-900 text-lg">{info.value}</p>
            </div>
          ))}
        </div>

        {/* Ingrediënten */}
        <div className="bg-white rounded-3xl p-8 shadow border border-amber-100 mb-8 reveal">
          <h3 className="text-2xl font-black text-stone-900 mb-6">Ingrediënten</h3>
          <ul className="space-y-3">
            {[
              "1,5 kg vloeibare honing (bij voorkeur van een lokale imker)",
              "500 g lichtgeroosterde moutextract (pale malt)",
              "20 g bitterhop (pellets, bijv. Saaz of Hallertau)",
              "8 liter water",
              "1 zakje droge gist (bijv. Lalvin 71B of Mangrove Jack's M05)",
              "Gistvoedingszout (optioneel maar aangeraden)",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-stone-700">
                <span className="text-amber-400 font-black shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Werkwijze */}
        <div className="reveal">
          <h3 className="text-2xl font-black text-stone-900 mb-6">Werkwijze</h3>
          <div className="space-y-4">
            {stappen.map((s) => (
              <div key={s.nr} className="flex gap-5 items-start bg-white rounded-2xl p-5 shadow border border-stone-100">
                <span className="text-2xl font-black text-amber-300 shrink-0">{s.nr}</span>
                <p className="text-stone-600 leading-7 pt-0.5">{s.stap}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notitie */}
        <div className="mt-10 bg-amber-900 rounded-3xl p-7 text-white reveal">
          <p className="font-black text-lg mb-2">💡 Terry&apos;s noot</p>
          <p className="text-amber-200 leading-7">
            Dit is de basisversie van mijn braggot. In de toekomst wil ik dit recept aanpassen met mijn eigen honing.
            Dan wordt dit écht een Streunding recept.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-amber-800 to-orange-800 text-white py-20 px-6 text-center overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="text-5xl mb-4">📖</div>
          <h2 className="text-4xl font-black mb-4">Lees het verhaal erachter</h2>
          <p className="text-amber-200 text-lg mb-8">Hoe ik tot dit recept kwam staat in mijn blog.</p>
          <Link href="/blog/eerste-braggot"
            className="bg-white text-amber-900 font-bold px-10 py-4 rounded-full hover:bg-amber-100 transition-all hover:scale-105 inline-block shadow-xl text-lg"
          >
            Lees de blogpost →
          </Link>
        </div>
      </section>

    </div>
  );
}
