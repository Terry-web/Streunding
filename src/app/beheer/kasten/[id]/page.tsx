import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DeleteButton from "@/components/DeleteButton";
import HiveForm from "../HiveForm";
import { updateHive, deleteHive } from "../actions";

export const metadata = { title: "Kast bewerken | Beheer | Streunding" };

export default async function KastEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: hive } = await supabase.from("hives").select("*").eq("id", id).single();

  if (!hive) notFound();

  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-stone-400 uppercase tracking-widest">
            {hive.label} bewerken
          </h2>
          <form action={deleteHive}>
            <input type="hidden" name="id" value={hive.id} />
            <DeleteButton confirmMessage={`Kast "${hive.label}" verwijderen?`} />
          </form>
        </div>
        <HiveForm hive={hive} action={updateHive.bind(null, id)} />
      </div>
    </div>
  );
}
