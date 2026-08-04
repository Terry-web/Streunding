import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Eerlijke verhalen uit de bijenstal — van kasten timmeren tot het eerste brouwsel.",
};

const tagKleur: Record<string, string> = {
  Verhaal: "bg-amber-100 text-amber-800",
  Ambacht: "bg-orange-100 text-orange-800",
  Recept: "bg-yellow-100 text-yellow-800",
};

export default function Blog() {
  const posts = getPosts();
  const nieuwste = posts[posts.length - 1];

  return (
    <div className="min-h-screen bg-amber-50 text-stone-800">

      {/* Hero */}
      <section className="relative pt-16 min-h-[55vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-900 via-orange-900 to-stone-900">
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
        <div className="absolute top-10 left-20 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl animate-float delay-200" />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto py-20">
          <div className="text-7xl mb-6 animate-float inline-block">📖</div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-none">
            Mijn<br/><span className="text-amber-400">Imkerblog</span>
          </h1>
          <p className="text-xl text-amber-200 max-w-xl mx-auto leading-relaxed">
            Eerlijke verhalen uit de bijenstal — van kasten timmeren tot het eerste brouwsel.
          </p>
        </div>
      </section>

      {/* Uitgelicht */}
      {nieuwste && (
        <section className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-amber-700 font-semibold uppercase tracking-widest text-sm mb-6">Nieuwste bericht</p>
          <Link href={`/blog/${nieuwste.slug}`} className="group block bg-white rounded-3xl shadow-lg border border-amber-100 overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="bg-gradient-to-r from-amber-800 to-orange-800 p-10 flex items-center gap-6">
              <span className="text-6xl">{nieuwste.icon}</span>
              <div>
                <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block ${tagKleur[nieuwste.tag] ?? "bg-stone-100 text-stone-700"}`}>
                  {nieuwste.tag}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white group-hover:text-amber-300 transition-colors leading-tight">
                  {nieuwste.titel}
                </h2>
                <p className="text-amber-300 text-sm mt-2">{nieuwste.datum}</p>
              </div>
            </div>
            <div className="p-8">
              <p className="text-stone-600 leading-8 text-lg">{nieuwste.samenvatting}</p>
              <span className="inline-block mt-6 text-amber-700 font-bold group-hover:text-amber-900 transition-colors">Lees het verhaal →</span>
            </div>
          </Link>
        </section>
      )}

      {/* Alle berichten */}
      <section className="bg-stone-100 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-amber-700 font-semibold uppercase tracking-widest text-sm mb-2">Archief</p>
          <h2 className="text-4xl font-black mb-12 text-stone-900">Alle berichten</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...posts].reverse().map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl shadow border border-stone-100 p-7 hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col gap-4"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{post.icon}</span>
                  <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${tagKleur[post.tag] ?? "bg-stone-100 text-stone-700"}`}>
                    {post.tag}
                  </span>
                </div>
                <h3 className="text-lg font-black text-stone-900 group-hover:text-amber-700 transition-colors leading-snug">{post.titel}</h3>
                <p className="text-stone-500 text-sm leading-7 flex-1">{post.samenvatting}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-stone-400">{post.datum}</span>
                  <span className="text-amber-600 text-sm font-semibold group-hover:text-amber-800 transition-colors">Lees meer →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
