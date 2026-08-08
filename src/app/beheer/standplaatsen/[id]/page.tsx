import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DeleteButton from "@/components/DeleteButton";
import PhotoGallery from "../../photos/PhotoGallery";
import ApiaryForm from "../ApiaryForm";
import { updateApiary, deleteApiary } from "../actions";

export const metadata = { title: "Standplaats bewerken | Beheer | Streunding" };

export default async function StandplaatsEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: apiary } = await supabase.from("apiaries").select("*").eq("id", id).single();

  if (!apiary) notFound();

  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-stone-400 uppercase tracking-widest">
            {apiary.name} bewerken
          </h2>
          <form action={deleteApiary}>
            <input type="hidden" name="id" value={apiary.id} />
            <DeleteButton confirmMessage={`Standplaats "${apiary.name}" verwijderen?`} />
          </form>
        </div>
        <ApiaryForm apiary={apiary} action={updateApiary.bind(null, id)} />
      </div>

      <PhotoGallery column="apiary_id" parentId={apiary.id} redirectTo={`/beheer/standplaatsen/${id}`} />
    </div>
  );
}
