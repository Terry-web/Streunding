import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { colonyStatusLabels } from "@/lib/beheer/labels";

export const metadata = { title: "Volken | Beheer | Streunding" };

export default async function VolkenPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: colonies } = await supabase
    .from("colonies")
    .select("*, apiaries(name), hives(label)")
    .order("name");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black text-stone-400 uppercase tracking-widest">Volken</h2>
        <Link
          href="/beheer/volken/nieuw"
          className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
        >
          + Nieuw volk
        </Link>
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/40 rounded-xl px-3 py-2 mb-6">
          {error}
        </p>
      )}

      {!colonies || colonies.length === 0 ? (
        <p className="text-stone-500">Nog geen volken toegevoegd.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {colonies.map((c) => (
            <Link
              key={c.id}
              href={`/beheer/volken/${c.id}`}
              className="bg-stone-800 rounded-2xl p-5 border border-stone-700 hover:border-amber-500 transition-colors block"
            >
              <p className="font-bold text-white">{c.name}</p>
              <p className="text-stone-400 text-sm mt-1">
                {colonyStatusLabels[c.status ?? "active"] ?? c.status}
                {c.apiaries?.name ? ` · ${c.apiaries.name}` : ""}
                {c.hives?.label ? ` · ${c.hives.label}` : ""}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
