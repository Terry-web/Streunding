import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Over mij",
  description: "Wie is Terry en waarom wil hij imker worden? Lees mijn verhaal.",
};

const tijdlijn = [
  {
    periode: "Altijd al",
    icon: "💭",
    titel: "De droom",
    tekst: "Al zolang ik me kan herinneren wilde ik imker worden. Bijen fascineren me — hun organisatie, hun rol in de natuur, de honing die ze maken.",
  },
  {
    periode: "2025",
    icon: "🪵",
    titel: "Twee kasten getimmerd",
    tekst: "Nog voor het eerste volk heb ik zelf twee bijenkassen getimmerd. Leren door te doen — met hout, zaag en veel plezier.",
  },
  {
    periode: "2025",
    icon: "🍺",
    titel: "Eerste braggot gebrouwen",
    tekst: "Een braggot is een brouwsel van honing en mout. Mijn eerste eigen recept — al oefenen met honing voordat de bijen er zijn.",
  },
  {
    periode: "2027",
    icon: "📚",
    titel: "Basis imkercursus",
    tekst: "In 2027 start ik met de officiële basis imkercursus. De theorie leren, netwerken met andere imkers en me goed voorbereiden op het eerste volk.",
  },
];

export default async function OverMij() {
  const supabase = await createClient();
  const { count: aantalKasten } = await supabase
    .from("hives")
    .select("*", { count: "exact", head: true })
    .eq("is_public", true);

  const cijfers = [
    { value: String(aantalKasten ?? 0), label: "Kasten gebouwd", icon: "🪵" },
    { value: "2027", label: "Basis cursus", icon: "📚" },
    { value: "1e", label: "Braggot gebrouwen", icon: "🍺" },
    { value: "Binnenkort", label: "Eerste volk", icon: "🐝" },
  ];

  return (
    <div className="min-h-screen bg-amber-50 text-stone-800">

      {/* Hero */}
      <section className="relative pt-16 min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-stone-900 via-amber-900 to-orange-900">
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
        <div className="absolute top-20 right-20 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-float delay-300" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto py-24">
          {/* Avatar placeholder */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-6xl mx-auto mb-8 shadow-2xl shadow-amber-900/50 ring-4 ring-amber-400/30">
            👨‍🌾
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-4 leading-none">
            Hallo, ik ben<br/><span className="text-amber-400">Terry</span>
          </h1>
          <p className="text-xl text-amber-200 max-w-xl mx-auto leading-relaxed">
            Beginnend imker, nieuwsgierig mens en eigenaar van één bijenkast die langzaam mijn leven overneemt.
          </p>
        </div>
      </section>

      {/* Cijfers */}
      <section className="bg-amber-900 text-white py-12">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {cijfers.map((c) => (
            <div key={c.label} className="space-y-1">
              <div className="text-3xl">{c.icon}</div>
              <div className="text-3xl font-black text-amber-400">{c.value}</div>
              <div className="text-amber-200 text-sm font-medium uppercase tracking-widest">{c.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Verhaal */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <p className="text-amber-700 font-semibold uppercase tracking-widest text-sm text-center mb-2">Mijn verhaal</p>
        <h2 className="text-4xl font-black text-center mb-12 text-stone-900">Hoe het zo gekomen is</h2>

        <div className="bg-white rounded-3xl p-8 shadow-lg border border-amber-100 mb-10">
          <p className="text-lg text-stone-600 leading-9">
            Imkeren stond al járen op mijn lijstje. De combinatie van natuur, ambacht en het idee dat je een
            bijenvolk beheert — een levende, ademende gemeenschap van duizenden individuen — vond ik altijd
            al ongelofelijk fascinerend.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-lg border border-amber-100 mb-10">
          <p className="text-lg text-stone-600 leading-9">
            In 2025 heb ik de eerste stap gezet: twee bijenkassen zelf getimmerd. Nog zonder bijen, maar
            met veel enthousiasme. In 2027 start ik de officiële basis imkercursus — dan komen de bijen er
            écht in.
          </p>
        </div>

        <div className="bg-amber-900 rounded-3xl p-8 shadow-lg text-white">
          <p className="text-lg leading-9 text-amber-100">
            Deze website is mijn dagboek. Ik deel wat ik leer, wat misgaat, wat verrassend goed gaat —
            en hopelijk helpt dat andere beginners om zelf de stap te zetten.
          </p>
        </div>
      </section>

      {/* Tijdlijn */}
      <section className="bg-stone-100 py-24">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-amber-700 font-semibold uppercase tracking-widest text-sm text-center mb-2">Terugkijken</p>
          <h2 className="text-4xl font-black text-center mb-16 text-stone-900">De weg hier naartoe</h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-amber-200" />
            {tijdlijn.map((item, i) => (
              <div key={i} className="relative flex gap-8 mb-10 group">
                <div className="shrink-0 w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center text-2xl shadow-lg group-hover:bg-amber-500 transition-colors z-10">
                  {item.icon}
                </div>
                <div className="bg-white rounded-2xl p-6 shadow flex-1 border border-amber-100 hover:shadow-md transition-shadow">
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">{item.periode}</span>
                  <h3 className="font-black text-stone-900 text-lg mt-1 mb-2">{item.titel}</h3>
                  <p className="text-stone-500 leading-7 text-sm">{item.tekst}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <p className="text-amber-700 font-semibold uppercase tracking-widest text-sm text-center mb-2">Vragen of ideeën?</p>
        <h2 className="text-4xl font-black text-center mb-4 text-stone-900">Neem contact op</h2>
        <p className="text-stone-500 text-center max-w-lg mx-auto mb-12 leading-relaxed">
          Wil je iets vragen over imkeren, een tip delen of gewoon hallo zeggen? Stuur me een bericht!
        </p>
        <div className="bg-white rounded-3xl shadow-lg border border-amber-100 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-800 to-orange-800 p-8 text-white text-center">
            <div className="text-5xl mb-3">✉️</div>
            <h3 className="text-2xl font-black mb-2">Stuur een e-mail</h3>
            <p className="text-amber-200 text-sm">Ik reageer zo snel mogelijk</p>
          </div>
          <div className="p-8">
            <ContactForm />
          </div>
        </div>
      </section>

    </div>
  );
}
