import { getPosts } from "@/lib/posts";
import { getInspecties } from "@/lib/inspecties";
import AdminClient from "./AdminClient";

export const metadata = { title: "Admin | Streunding" };

export default function AdminPage() {
  const posts = getPosts();
  const { kasten, inspecties } = getInspecties();

  const recentePost = posts[posts.length - 1] ?? null;
  const recenteInspectie = inspecties[inspecties.length - 1] ?? null;

  return (
    <div className="min-h-screen bg-stone-900 text-white pt-20 px-6">
      <div className="max-w-4xl mx-auto py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-amber-400 font-mono text-sm mb-1">Streunding Admin</p>
          <h1 className="text-4xl font-black">Dashboard</h1>
        </div>

        {/* Connectiviteit */}
        <AdminClient />

        {/* Statistieken */}
        <section className="mt-10">
          <h2 className="text-lg font-black text-stone-400 uppercase tracking-widest mb-4">Statistieken</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Blogposts", value: posts.length, icon: "📖" },
              { label: "Kasten", value: kasten.length, icon: "🪵" },
              { label: "Inspecties", value: inspecties.length, icon: "📋" },
              { label: "Recepten", value: 1, icon: "🍺" },
            ].map((s) => (
              <div key={s.label} className="bg-stone-800 rounded-2xl p-5 border border-stone-700">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="text-3xl font-black text-amber-400">{s.value}</div>
                <div className="text-stone-400 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Recente content */}
        <section className="mt-10 grid sm:grid-cols-2 gap-6">
          <div className="bg-stone-800 rounded-2xl p-6 border border-stone-700">
            <h2 className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-4">Laatste blogpost</h2>
            {recentePost ? (
              <>
                <p className="font-black text-white text-lg leading-snug">{recentePost.titel}</p>
                <p className="text-stone-400 text-sm mt-1">{recentePost.datum}</p>
                <a href={`/blog/${recentePost.slug}`} className="inline-block mt-4 text-amber-400 text-sm hover:text-amber-300">
                  Bekijk post →
                </a>
              </>
            ) : (
              <p className="text-stone-500">Geen posts gevonden</p>
            )}
          </div>

          <div className="bg-stone-800 rounded-2xl p-6 border border-stone-700">
            <h2 className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-4">Laatste inspectie</h2>
            {recenteInspectie ? (
              <>
                <p className="font-black text-white text-lg">{recenteInspectie.datum}</p>
                <p className="text-stone-400 text-sm mt-1">Kast: {recenteInspectie.kastId}</p>
                <p className="text-stone-400 text-sm">Koningin: {recenteInspectie.koninginGezien}</p>
              </>
            ) : (
              <p className="text-stone-500">Nog geen inspecties gelogd</p>
            )}
          </div>
        </section>

        {/* Snelle links */}
        <section className="mt-10">
          <h2 className="text-lg font-black text-stone-400 uppercase tracking-widest mb-4">Snelle links</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "Nieuwe blogpost", detail: "content/blog/*.md", href: "/blog", icon: "✍️" },
              { label: "Inspectie toevoegen", detail: "content/inspecties.json", href: "/dagboek", icon: "📋" },
              { label: "Bekijk site", detail: "Homepage", href: "/", icon: "🌐" },
            ].map((l) => (
              <a key={l.label} href={l.href}
                className="bg-stone-800 border border-stone-700 rounded-2xl p-5 hover:border-amber-500 transition-colors group"
              >
                <div className="text-2xl mb-2">{l.icon}</div>
                <div className="font-bold text-white group-hover:text-amber-400 transition-colors">{l.label}</div>
                <div className="text-stone-500 text-xs mt-1 font-mono">{l.detail}</div>
              </a>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
