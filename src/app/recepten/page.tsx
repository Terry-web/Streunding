import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Recepten",
  description: "Mijn recepten met honing — van braggot tot andere brouwsels.",
};

const stappen = [
  { nr: "01", stap: "Desinfecteer al je materiaal met sulfietoplossing (±1 g/L). Contacttijd 5–10 minuten, niet naspoelen." },
  { nr: "02", stap: "Bereid het blikbier voor volgens de instructies van Brewferm Strong Blond. Meng met water tot ±9 L basis." },
  { nr: "03", stap: "Voeg het appelsap toe en vul aan met water tot een eindvolume van 20 liter." },
  { nr: "04", stap: "Voeg de bierkitgist toe en laat de eerste gistingsfase op gang komen. De eerste 72 uur zijn kritisch — houd de temperatuur stabiel." },
  { nr: "05", stap: "Pas step feeding toe: voeg de honing niet in één keer toe maar gefaseerd. Dit voorkomt een stuck fermentation door te hoge suikerbelasting." },
  { nr: "06", stap: "Na de hoofdgisting hevel je de braggot over naar twee demijonnen van 10 liter. Voeg bij het hevelen de laatste ½ kg honing toe." },
  { nr: "07", stap: "Laat narijpen in de demijohn. Op 2 september 2026 gebotteld in 12 flessen." },
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
            Brouwen met honing — mijn eigen experimenten, bijgehouden per batch.
          </p>
        </div>
      </section>

      {/* Recept: Braggot batch 26244 */}
      <section className="max-w-3xl mx-auto px-6 py-20">

        {/* Header */}
        <div className="flex items-start gap-5 mb-10 reveal">
          <span className="text-5xl">🍺</span>
          <div>
            <p className="text-amber-700 font-semibold uppercase tracking-widest text-sm">Batch 26244 · 11 juni 2026</p>
            <h2 className="text-4xl font-black text-stone-900 mt-1">Braggot met appelsap</h2>
            <p className="text-stone-500 mt-2 leading-7">
              Een braggot is een kruising tussen bier en mede. Deze batch combineert een blond bierkit
              met bloemenhoning en appelsap — eigengemaakt, eerlijk en word echt lekker.
            </p>
          </div>
        </div>

        {/* Status banner */}
        <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-5 flex items-center gap-4 mb-10 reveal">
          <span className="text-3xl">✅</span>
          <div>
            <p className="font-black text-green-800">Gebotteld op 2 september 2026</p>
            <p className="text-green-700 text-sm">12 flessen — narijping in de fles aan de gang. Word echt lekker.</p>
          </div>
        </div>

        {/* Info blokken */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 reveal">
          {[
            { label: "Batch", value: "26244" },
            { label: "Eindvolume", value: "20 L" },
            { label: "Alcohol", value: "±12–14%" },
            { label: "Flessen", value: "12 stuks" },
          ].map((info) => (
            <div key={info.label} className="bg-white rounded-2xl p-4 text-center shadow border border-amber-100">
              <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mb-1">{info.label}</p>
              <p className="font-black text-stone-900 text-xl">{info.value}</p>
            </div>
          ))}
        </div>

        {/* Ingrediënten */}
        <div className="bg-white rounded-3xl p-8 shadow border border-amber-100 mb-8 reveal">
          <h3 className="text-2xl font-black text-stone-900 mb-6">Ingrediënten</h3>
          <ul className="space-y-4">
            {[
              { hoeveelheid: "1 blik", ingredient: "Brewferm Strong Blond", detail: "9 L basis" },
              { hoeveelheid: "4,5 kg", ingredient: "Bloemenhoning", detail: "gefaseerd toegevoegd via step feeding" },
              { hoeveelheid: "3 L", ingredient: "Appelsap uit concentraat", detail: "" },
              { hoeveelheid: "tot 20 L", ingredient: "Water", detail: "eindvolume" },
              { hoeveelheid: "1 zakje", ingredient: "Bierkitgist", detail: "meegeleverd met Brewferm kit" },
              { hoeveelheid: "±1 g/L", ingredient: "Sulfietoplossing", detail: "voor desinfectie" },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-4 py-3 border-b border-stone-100 last:border-0">
                <span className="text-amber-600 font-black text-sm w-20 shrink-0 pt-0.5">{item.hoeveelheid}</span>
                <div>
                  <span className="font-bold text-stone-900">{item.ingredient}</span>
                  {item.detail && <span className="text-stone-400 text-sm ml-2">— {item.detail}</span>}
                </div>
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

        {/* Brouwlog notities */}
        <div className="mt-10 space-y-4 reveal">
          <h3 className="text-2xl font-black text-stone-900">Brouwlog notities</h3>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">11 juni 2026 — Start</p>
            <ul className="space-y-2 text-stone-600 text-sm leading-7">
              <li>→ Totaal batchgewicht: 22,5 kg netto</li>
              <li>→ Helft van de honing direct toegevoegd, rest via step feeding</li>
              <li>→ Vergisting kritisch in eerste 72 uur — goed in de gaten gehouden</li>
            </ul>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">Hevelen — twee demijonnen van 10 L</p>
            <ul className="space-y-2 text-stone-600 text-sm leading-7">
              <li>→ Geheveld naar 2× 10 liter demijohn</li>
              <li>→ Bij het hevelen de laatste ½ kg honing toegevoegd</li>
            </ul>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-3">2 september 2026 — Gebotteld</p>
            <ul className="space-y-2 text-stone-600 text-sm leading-7">
              <li>→ 12 flessen gebotteld</li>
              <li>→ Narijping op fles gestart</li>
              <li>→ Eerste proef: word echt lekker 🍺</li>
            </ul>
          </div>
        </div>

        {/* Terry noot */}
        <div className="mt-8 bg-amber-900 rounded-3xl p-7 text-white reveal">
          <p className="font-black text-lg mb-2">💡 Terry&apos;s noot</p>
          <p className="text-amber-200 leading-7">
            Dit is mijn eerste braggot — gebrouwen voordat mijn eigen bijen er zijn. De honing komt
            van een lokale imker. Als mijn eigen volk er straks is, ga ik dit recept opnieuw maken
            met mijn eigen honing. Dan wordt het écht een Streunding braggot.
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
