import { createClient } from "@/lib/supabase/server";
import ColonyForm from "../ColonyForm";
import { createColony } from "../actions";

export const metadata = { title: "Nieuw volk | Beheer | Streunding" };

export default async function NieuwVolkPage() {
  const supabase = await createClient();
  const [{ data: apiaries }, { data: hives }] = await Promise.all([
    supabase.from("apiaries").select("id, name").order("name"),
    supabase.from("hives").select("id, label").order("label"),
  ]);

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-black text-stone-400 uppercase tracking-widest mb-6">Nieuw volk</h2>
      <ColonyForm action={createColony} apiaries={apiaries ?? []} hives={hives ?? []} />
    </div>
  );
}
