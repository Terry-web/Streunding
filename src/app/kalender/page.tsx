import type { Metadata } from "next";
import Link from "next/link";
import Kalender from "@/components/Kalender";

export const metadata: Metadata = {
  title: "Imkerkalender",
  description: "Wat doet een imker elke maand? Een interactief overzicht van het imkerjaar.",
};

export default function KalenderPage() {
  return (
    <div className="min-h-screen bg-amber-50 text-stone-800">

      {/* Hero */}
      <section className="relative pt-16 min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-900 via-amber-900 to-orange-900">
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
        <div className="absolute top-10 right-20 w-64 h-64 bg-green-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl animate-float delay-200" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto py-20">
          <div className="text-7xl mb-6 animate-float inline-block">📅</div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-none">
            Imker<span className="text-amber-400">kalender</span>
          </h1>
          <p className="text-xl text-amber-200 max-w-xl mx-auto leading-relaxed">
            Wat doet een imker elke maand? Klik op een maand om de taken te zien.
          </p>
        </div>
      </section>

      {/* Kalender */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <Kalender />
      </section>

      {/* Leg uit hoe te gebruiken */}
      <section className="bg-stone-100 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-black text-stone-900 mb-8 reveal">Over deze kalender</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: "🔴", titel: "Urgent", tekst: "Moet deze maand gebeuren. Sla je dit over, heeft dat direct gevolgen voor je volk." },
              { icon: "🟡", titel: "Let op", tekst: "Belangrijke aandachtspunten die je in de gaten moet houden." },
              { icon: "🟢", titel: "Info", tekst: "Achtergrondinfo over wat er in de kast en in de natuur gebeurt." },
            ].map((item) => (
              <div key={item.titel} className="bg-white rounded-2xl p-6 shadow border border-stone-100 reveal">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-black text-stone-900 mb-2">{item.titel}</h3>
                <p className="text-stone-500 text-sm leading-7">{item.tekst}</p>
              </div>
            ))}
          </div>
          <p className="text-stone-400 text-sm mt-8 text-center">
            Deze kalender is gebaseerd op het Nederlandse klimaat. Tijden kunnen 1-2 weken afwijken afhankelijk van je regio en het weer.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-amber-800 to-orange-800 text-white py-20 px-6 text-center">
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="text-5xl mb-4">🐝</div>
          <h2 className="text-4xl font-black mb-4">Alles over imkeren</h2>
          <p className="text-amber-200 text-lg mb-8">Meer leren? Bekijk de informatieve pagina over bijen en imkeren.</p>
          <Link href="/informatief"
            className="bg-white text-amber-900 font-bold px-10 py-4 rounded-full hover:bg-amber-100 transition-all hover:scale-105 inline-block shadow-xl text-lg"
          >
            Naar informatief →
          </Link>
        </div>
      </section>

    </div>
  );
}
