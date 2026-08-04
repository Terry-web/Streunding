import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Informatief",
  description: "Alles over bijen, bijenkassen en imkeren — wat ik leer als beginnend imker.",
};

const onderwerpen = [
  {
    icon: "👑",
    title: "De koningin",
    desc: "Het hart van elk bijenvolk. Ze legt tot 2.000 eieren per dag en kan 5 jaar oud worden. Zonder haar valt het volk uiteen.",
    kleur: "from-yellow-400 to-amber-400",
  },
  {
    icon: "🐝",
    title: "Werksters",
    desc: "Alle vrouwtjesbijen die het werk doen — van voeden en bouwen tot bewaken en honing maken. Ze leven slechts 6 weken.",
    kleur: "from-amber-400 to-orange-400",
  },
  {
    icon: "🪲",
    title: "Darren",
    desc: "De mannetjesbijen. Ze doen geen werk en hebben geen angel. Hun enige taak: de koningin bevruchten.",
    kleur: "from-orange-400 to-red-400",
  },
  {
    icon: "🥚",
    title: "Broed",
    desc: "Van ei naar larve naar pop — in 21 dagen groeit een werkster op. De koningin legt haar eitjes één voor één in cellen.",
    kleur: "from-amber-300 to-yellow-300",
  },
  {
    icon: "🌸",
    title: "Stuifmeel",
    desc: "Bijen verzamelen stuifmeel als eiwitbron voor het broed. Ze dragen het mee in speciale korfjes op hun achterpoten.",
    kleur: "from-pink-300 to-rose-400",
  },
  {
    icon: "💧",
    title: "Nectar & honing",
    desc: "Nectar wordt door werksters omgezet in honing. Ze verdampen het water door met hun vleugels te wapperen.",
    kleur: "from-amber-400 to-yellow-300",
  },
];

const seizoenen = [
  {
    seizoen: "Lente",
    icon: "🌱",
    kleur: "bg-green-100 border-green-300 text-green-800",
    acties: ["Eerste inspectie na de winter", "Controleer op voedselvoorraden", "Volk bouwt snel uit", "Zwermseizoen begint"],
  },
  {
    seizoen: "Zomer",
    icon: "☀️",
    kleur: "bg-amber-100 border-amber-300 text-amber-800",
    acties: ["Hoogtepunt: 60.000+ bijen", "Honingoogst in juli/augustus", "Let op zwermdrang", "Varroabehandeling plannen"],
  },
  {
    seizoen: "Herfst",
    icon: "🍂",
    kleur: "bg-orange-100 border-orange-300 text-orange-800",
    acties: ["Volk krimpt", "Wintervoer geven", "Varroabehandeling uitvoeren", "Muis-roosters plaatsen"],
  },
  {
    seizoen: "Winter",
    icon: "❄️",
    kleur: "bg-blue-100 border-blue-300 text-blue-800",
    acties: ["Bijen vormen een winterbos", "Niet storen!", "Kast controleren op schade", "Cursussen en plannen maken"],
  },
];

const tips = [
  { nr: "01", tip: "Draag altijd je beschermende kleding, ook als je denkt dat het rustig is." },
  { nr: "02", tip: "Werk met trage, rustige bewegingen. Bijen reageren sterk op snelle gebaren." },
  { nr: "03", tip: "Rook kalmeert bijen — de geur van rook doet hen denken aan bosbrand en ze vullen zich met honing." },
  { nr: "04", tip: "Inspecteer bij mooi, warm weer tussen 10:00 en 16:00 — dan zijn de vliegsters buiten." },
  { nr: "05", tip: "Schrijf alles op na elke inspectie. Je vergeet meer dan je denkt." },
  { nr: "06", tip: "Sluit je aan bij een lokale imkersvereniging — de kennis die je daar opdoet is onbetaalbaar." },
];

export default function Informatief() {
  return (
    <div className="min-h-screen bg-amber-50 text-stone-800">

      {/* Hero */}
      <section className="relative pt-16 min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-yellow-900">
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
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl animate-float delay-200" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto py-20">
          <div className="text-7xl mb-6 animate-float inline-block">🐝</div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-none">
            Alles over<br/><span className="text-amber-400">Bijen</span>
          </h1>
          <p className="text-xl text-amber-200 max-w-xl mx-auto leading-relaxed">
            Wat ik leer over imkeren — eerlijk, praktisch en vanuit mijn eigen ervaring als beginner.
          </p>
        </div>
      </section>

      {/* Het bijenvolk */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <p className="text-amber-700 font-semibold uppercase tracking-widest text-sm text-center mb-2">Het volk</p>
        <h2 className="text-4xl font-black text-center mb-4 text-stone-900">Wie leven er in de kast?</h2>
        <p className="text-stone-500 text-center max-w-xl mx-auto mb-14 leading-relaxed">
          Een bijenvolk bestaat uit tienduizenden individuen met elk een eigen rol. Dit zijn de belangrijkste.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {onderwerpen.map((o) => (
            <div key={o.title} className="group bg-white rounded-2xl p-6 shadow hover:shadow-xl transition-all hover:-translate-y-2 border border-stone-100 flex flex-col gap-3">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${o.kleur} flex items-center justify-center text-3xl shadow`}>
                {o.icon}
              </div>
              <h3 className="text-xl font-bold text-stone-900 group-hover:text-amber-700 transition-colors">{o.title}</h3>
              <p className="text-stone-500 leading-7">{o.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Seizoenen */}
      <section className="bg-stone-100 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-amber-700 font-semibold uppercase tracking-widest text-sm text-center mb-2">Het jaar rond</p>
          <h2 className="text-4xl font-black text-center mb-14 text-stone-900">Imkeren door de seizoenen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {seizoenen.map((s) => (
              <div key={s.seizoen} className={`rounded-2xl border-2 p-6 ${s.kleur} flex flex-col gap-4`}>
                <div className="text-4xl">{s.icon}</div>
                <h3 className="text-xl font-black">{s.seizoen}</h3>
                <ul className="space-y-2">
                  {s.acties.map((a) => (
                    <li key={a} className="flex items-start gap-2 text-sm leading-6">
                      <span className="mt-1 shrink-0">•</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <p className="text-amber-700 font-semibold uppercase tracking-widest text-sm text-center mb-2">Geleerd van vallen en opstaan</p>
        <h2 className="text-4xl font-black text-center mb-14 text-stone-900">Tips voor beginners</h2>
        <div className="space-y-4">
          {tips.map((t) => (
            <div key={t.nr} className="group flex gap-6 items-start bg-white rounded-2xl p-6 shadow border border-stone-100 hover:shadow-lg hover:-translate-x-1 transition-all">
              <span className="text-3xl font-black text-amber-300 group-hover:text-amber-500 transition-colors shrink-0 leading-none">{t.nr}</span>
              <p className="text-stone-600 leading-7 pt-1">{t.tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-amber-800 to-orange-800 text-white py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hc2" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse">
                <polygon points="28,2 54,17 54,47 28,62 2,47 2,17" fill="none" stroke="white" strokeWidth="1.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hc2)"/>
          </svg>
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="text-5xl mb-4">📖</div>
          <h2 className="text-4xl font-black mb-4">Lees ook mijn blog</h2>
          <p className="text-amber-200 text-lg mb-8 leading-relaxed">
            Theorie is mooi, maar de praktijk is nóg leuker. Lees mijn persoonlijke ervaringen in de blog.
          </p>
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
