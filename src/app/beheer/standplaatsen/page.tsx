import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { apiaryTypeLabels } from "@/lib/beheer/labels";
import DeleteButton from "@/components/DeleteButton";
import { deleteApiary } from "./actions";

export const metadata = { title: "Standplaatsen | Beheer | Streunding" };

export default async function StandplaatsenPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: apiaries } = await supabase.from("apiaries").select("*").order("name");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black text-stone-400 uppercase tracking-widest">Standplaatsen</h2>
        <Link
          href="/beheer/standplaatsen/nieuw"
          className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
        >
          + Nieuwe standplaats
        </Link>
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/40 rounded-xl px-3 py-2 mb-6">
          {error}
        </p>
      )}

      {!apiaries || apiaries.length === 0 ? (
        <p className="text-stone-500">Nog geen standplaatsen toegevoegd.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {apiaries.map((a) => (
            <div key={a.id} className="bg-stone-800 rounded-2xl p-5 border border-stone-700">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-white">{a.name}</p>
                  <p className="text-stone-400 text-sm mt-1">
                    {apiaryTypeLabels[a.type ?? "field"] ?? a.type}
                    {a.city ? ` · ${a.city}` : ""}
                  </p>
                </div>
                <Link
                  href={`/beheer/standplaatsen/${a.id}`}
                  className="text-amber-400 hover:text-amber-300 text-sm font-bold shrink-0"
                >
                  Bewerken
                </Link>
              </div>
              <form action={deleteApiary} className="mt-3">
                <input type="hidden" name="id" value={a.id} />
                <DeleteButton confirmMessage={`Standplaats "${a.name}" verwijderen?`} />
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
