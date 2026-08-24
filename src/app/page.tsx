import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Streunding Imkerij" },
  description: "Mijn reis naar het imkeren — kasten timmeren, brouwen met honing en leren over bijen.",
};

const stats = [
  { value: "2", label: "Kasten gebouwd", icon: "🪵" },
  { value: "2027", label: "Basis cursus", icon: "📚" },
  { value: "1e", label: "Braggot gebrouwen", icon: "🍺" },
  { value: "∞", label: "Passie", icon: "❤️" },
];

const features = [
  { icon: "📖", title: "Mijn verhalen", desc: "Eerlijke blogposts over mijn weg naar het imkeren.", href: "/blog", color: "from-amber-400 to-orange-400" },
  { icon: "🐝", title: "Over bijen", desc: "Alles wat ik leer over bijenvolken, seizoenen en imkeren.", href: "/informatief", color: "from-yellow-400 to-amber-400" },
  { icon: "🪵", title: "De kasten", desc: "Hoe ik mijn twee kasten zelf heb getimmerd.", href: "/kasten", color: "from-orange-400 to-red-400" },
];

const journey = [
  { year: "Altijd", title: "De droom", desc: "Imker worden stond al jaren op mijn lijstje. Bijen fascineren me al zo lang ik me kan herinneren." },
  { year: "2025", title: "Twee kasten", desc: "Zelf twee bijenkassen getimmerd. Nog geen bijen, maar de kasten staan klaar." },
  { year: "2025", title: "Eerste braggot", desc: "Gebrouwen met honing en mout. Oefenen met honing voordat de bijen er zijn." },
  { year: "2027", title: "Basis cursus", desc: "De officiële basis imkercursus — en dan eindelijk het eerste volk." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-amber-50 text-stone-800 overflow-x-hidden">

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 pt-16">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="honeycomb" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse">
                <polygon points="28,2 54,17 54,47 28,62 2,47 2,17" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
                <polygon points="28,52 54,67 54,97 28,112 2,97 2,67" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
                <polygon points="56,27 82,42 82,72 56,87 30,72 30,42" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#honeycomb)"/>
          </svg>
        </div>
        <div className="absolute top-20 left-10 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-float delay-200" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="text-8xl mb-6 animate-float inline-block">🍯</div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight mb-6 animate-fade-up leading-none">
            Streunding<br/>
            <span className="text-amber-400">Imkerij</span>
          </h1>
          <p className="text-xl md:text-2xl text-amber-200 max-w-2xl mx-auto mb-12 animate-fade-up delay-200 leading-relaxed">
            Mijn reis naar het imkeren — kasten timmeren, brouwen met honing en leren over bijen.
          </p>
          <div className="flex justify-center gap-4 flex-wrap animate-fade-up delay-300">
            <Link href="/blog" className="bg-amber-400 text-amber-900 font-bold px-8 py-4 rounded-full hover:bg-amber-300 transition-all hover:scale-105 shadow-lg shadow-amber-900/30 text-lg">
              Lees mijn verhalen →
            </Link>
            <Link href="/over-mij" className="border-2 border-amber-400 text-amber-100 font-bold px-8 py-4 rounded-full hover:bg-amber-400/20 transition-all hover:scale-105 text-lg">
              Over mij
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-amber-400 animate-bounce text-2xl">↓</div>
      </section>

      {/* Stats */}
      <section className="bg-amber-900 text-white py-12">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label} className="space-y-1">
              <div className="text-3xl">{s.icon}</div>
              <div className="text-4xl font-black text-amber-400">{s.value}</div>
              <div className="text-amber-200 text-sm font-medium uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-5xl mx-auto px-6 py-24 flex flex-col md:flex-row gap-12 items-center">
        <div className="text-8xl shrink-0 animate-float">👨‍🌾</div>
        <div>
          <p className="text-amber-700 font-semibold uppercase tracking-widest text-sm mb-2">Wie ben ik?</p>
          <h2 className="text-4xl font-black mb-4 text-stone-900">Hallo, ik ben Terry</h2>
          <p className="text-lg text-stone-600 leading-8 mb-6">
            Ik ben imker aan het worden. Twee kasten heb ik al zelf getimmerd, mijn eerste braggot staat te rijpen
            en in 2027 start ik de basis imkercursus. Ik deel hier alles wat ik leer — eerlijk, zonder mooipraterij.
          </p>
          <Link href="/over-mij" className="inline-flex items-center gap-2 text-amber-700 font-bold hover:text-amber-900 transition-colors text-lg">
            Meer over mij →
          </Link>
        </div>
      </section>

      {/* Feature kaarten */}
      <section className="bg-stone-100 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-amber-700 font-semibold uppercase tracking-widest text-sm text-center mb-2">Ontdek</p>
          <h2 className="text-4xl font-black text-center mb-12 text-stone-900">Wat vind je hier?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <Link key={f.title} href={f.href}
                className="group bg-white rounded-2xl p-6 shadow hover:shadow-xl transition-all hover:-translate-y-2 border border-stone-100 flex flex-col gap-3"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl shadow`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-700 transition-colors">{f.title}</h3>
                <p className="text-stone-500 text-sm leading-6">{f.desc}</p>
                <span className="text-amber-600 text-sm font-semibold mt-auto">Lees meer →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tijdlijn */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <p className="text-amber-700 font-semibold uppercase tracking-widest text-sm text-center mb-2">Mijn reis</p>
        <h2 className="text-4xl font-black text-center mb-16 text-stone-900">Hoe het begon</h2>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-amber-200" />
          {journey.map((item, i) => (
            <div key={i} className="relative flex gap-8 mb-10 group">
              <div className="shrink-0 w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center font-black text-amber-900 text-xs shadow-lg group-hover:bg-amber-500 transition-colors z-10">
                {item.year}
              </div>
              <div className="bg-white rounded-2xl p-5 shadow flex-1 border border-amber-100 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-stone-900 text-lg mb-1">{item.title}</h3>
                <p className="text-stone-500 text-sm leading-6">{item.desc}</p>
              </div>
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
          <div className="text-5xl mb-4">🐝</div>
          <h2 className="text-4xl font-black mb-4">Volg mijn imkerreis</h2>
          <p className="text-amber-200 text-lg mb-8 leading-relaxed">Blijf op de hoogte van nieuwe verhalen, tips en avonturen.</p>
          <Link href="/blog" className="bg-white text-amber-900 font-bold px-10 py-4 rounded-full hover:bg-amber-100 transition-all hover:scale-105 inline-block shadow-xl text-lg">
            Naar de blog →
          </Link>
        </div>
      </section>

    </div>
  );
}
