import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Honing",
  description: "Mijn plannen voor de eerste honingoogst — van raat tot pot.",
};

const stappen = [
  { icon: "🐝", titel: "De bijen", tekst: "Zonder bijen geen honing. Dat klinkt logisch, maar het begint met een gezond, sterk volk dat genoeg nectar kan verzamelen." },
  { icon: "🌸", titel: "De dracht", tekst: "Bijen halen nectar uit bloemen in een straal van 3 km. De omgeving bepaalt de smaak van de honing — koolzaad, linde of wilde bloemen." },
  { icon: "🍯", titel: "De raten", tekst: "Bijen verdampen water uit de nectar en verzegelen de cellen met wasdeksels. Pas als meer dan de helft is verzegeld, is de honing rijp." },
  { icon: "⚙️", titel: "Het slingeren", tekst: "Met een honingslinger draai je de raten en vliegt de honing er door middel van centrifugaalkracht uit. Kleverig, maar prachtig." },
  { icon: "🔬", titel: "Het zeven", tekst: "De honing wordt door een zeef gehaald om wasresten te verwijderen. Daarna laat je hem rusten zodat luchtbellen opstijgen." },
  { icon: "🫙", titel: "De pot", tekst: "Dan eindelijk: de honing in potten. Gelabeld, afgedicht en klaar. Van bij tot pot — het is bijna magisch." },
];

export default function Honing() {
  return (
    <div className="min-h-screen bg-amber-50 text-stone-800">

      {/* Hero */}
      <section className="relative pt-16 min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-800 via-yellow-800 to-orange-900">
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
        <div className="absolute top-10 right-20 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl animate-float delay-300" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto py-24">
          <div className="text-7xl mb-6 animate-float inline-block">🍯</div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-none">
            Mijn eerste<br/><span className="text-amber-400">Honing</span>
          </h1>
          <p className="text-xl text-amber-200 max-w-xl mx-auto leading-relaxed">
            Nog toekomstmuziek — maar ik bereid me voor. Alles wat ik leer over het oogsten van honing.
          </p>
          <div className="mt-8 inline-block bg-amber-400/20 border border-amber-400/40 text-amber-200 px-6 py-3 rounded-full text-sm font-medium">
            🗓️ Verwachte eerste oogst: 2027 of later
          </div>
        </div>
      </section>

      {/* Van bloem tot pot */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <p className="text-amber-700 font-semibold uppercase tracking-widest text-sm text-center mb-2">Het proces</p>
        <h2 className="text-4xl font-black text-center mb-14 text-stone-900 reveal">Van bloem tot pot</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stappen.map((s, i) => (
            <div key={i} className="group bg-white rounded-2xl p-7 shadow border border-stone-100 hover:shadow-xl hover:-translate-y-2 transition-all reveal flex flex-col gap-3">
              <div className="text-4xl">{s.icon}</div>
              <h3 className="text-xl font-black text-stone-900 group-hover:text-amber-700 transition-colors">{s.titel}</h3>
              <p className="text-stone-500 leading-7 text-sm">{s.tekst}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mijn plan */}
      <section className="bg-stone-100 py-20">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-amber-700 font-semibold uppercase tracking-widest text-sm text-center mb-2">Mijn plan</p>
          <h2 className="text-4xl font-black text-center mb-10 text-stone-900 reveal">Hoe ik het ga aanpakken</h2>
          <div className="space-y-5">
            {[
              { jaar: "2027", tekst: "Eerste volk na de basis imkercursus. Het eerste seizoen is voor de bijen — geen honing oogsten, het volk eerst laten groeien." },
              { jaar: "2028", tekst: "Als het volk sterk genoeg is, de eerste honingoogst. Lokale honing van mijn eigen kasten, mijn eigen tuin en omgeving." },
              { jaar: "Later", tekst: "Uitbreiden naar meerdere volken, meerdere locaties. Verschillende soorten honing, afhankelijk van de dracht." },
            ].map((item) => (
              <div key={item.jaar} className="bg-white rounded-2xl p-6 shadow border border-stone-100 flex gap-5 items-start reveal">
                <span className="text-amber-400 font-black text-lg shrink-0 w-14">{item.jaar}</span>
                <p className="text-stone-600 leading-7">{item.tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-amber-800 to-orange-800 text-white py-20 px-6 text-center overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="text-5xl mb-4">🐝</div>
          <h2 className="text-4xl font-black mb-4">Volg mijn reis</h2>
          <p className="text-amber-200 text-lg mb-8">Ik deel alles over mijn weg naar de eerste honingoogst in mijn blog.</p>
          <Link href="/blog"
            className="bg-white text-amber-900 font-bold px-10 py-4 rounded-full hover:bg-amber-100 transition-all hover:scale-105 inline-block shadow-xl text-lg"
          >
            Naar de blog →
          </Link>
        </div>
      </section>

    </div>
  );
}
