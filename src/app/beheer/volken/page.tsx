import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import VolkenTable from "./VolkenTable";

export const metadata = { title: "Volken | Beheer | Streunding" };

export default async function VolkenPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; status?: string }>;
}) {
  const { error, status } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("colony_status_overview").select("*");
  if (status) query = query.eq("status", status);
  const { data: colonies } = await query;

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

      {status && (
        <div className="flex items-center gap-2 mb-6 text-sm">
          <span className="text-stone-400">
            Gefilterd op status: <strong className="text-amber-400">{status}</strong>
          </span>
          <Link href="/beheer/volken" className="text-amber-400 hover:underline">
            wis filter
          </Link>
        </div>
      )}

      {!colonies || colonies.length === 0 ? (
        <p className="text-stone-500">
          {status ? "Geen volken met deze status." : "Nog geen volken toegevoegd."}
        </p>
      ) : (
        <VolkenTable rows={colonies} />
      )}
    </div>
  );
}
