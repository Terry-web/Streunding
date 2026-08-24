import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DeleteButton from "@/components/DeleteButton";
import AanbodForm from "../AanbodForm";
import { updateAanbod, deleteAanbod } from "../actions";

export const metadata = { title: "Aanbod bewerken | Beheer | Streunding" };

export default async function AanbodEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: aanbod } = await supabase.from("bestuifvolk_aanbod").select("*").eq("id", id).single();

  if (!aanbod) notFound();

  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-stone-400 uppercase tracking-widest">
            {aanbod.naam} bewerken
          </h2>
          <form action={deleteAanbod}>
            <input type="hidden" name="id" value={aanbod.id} />
            <DeleteButton
              confirmMessage={`Aanbod "${aanbod.naam}" verwijderen? Dit verwijdert ook alle aanvragen.`}
            />
          </form>
        </div>
        <AanbodForm aanbod={aanbod} action={updateAanbod.bind(null, id)} />
      </div>
    </div>
  );
}
