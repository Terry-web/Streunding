import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DeleteButton from "@/components/DeleteButton";
import PhotoGallery from "../../photos/PhotoGallery";
import ColonyForm from "../ColonyForm";
import InspectionForm from "../InspectionForm";
import { updateColony, deleteColony, createInspection, deleteInspection } from "../actions";
import { broodPatternLabels, temperamentLabels } from "@/lib/beheer/labels";

export const metadata = { title: "Volk bewerken | Beheer | Streunding" };

export default async function VolkEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: colony }, { data: apiaries }, { data: hives }, { data: inspections }] = await Promise.all([
    supabase.from("colonies").select("*").eq("id", id).single(),
    supabase.from("apiaries").select("id, name").order("name"),
    supabase.from("hives").select("id, label").order("label"),
    supabase.from("inspections").select("*").eq("colony_id", id).order("inspection_date", { ascending: false }),
  ]);

  if (!colony) notFound();

  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-stone-400 uppercase tracking-widest">
            {colony.name} bewerken
          </h2>
          <form action={deleteColony}>
            <input type="hidden" name="id" value={colony.id} />
            <DeleteButton confirmMessage={`Volk "${colony.name}" verwijderen? Dit verwijdert ook alle inspecties.`} />
          </form>
        </div>
        <ColonyForm
          colony={colony}
          apiaries={apiaries ?? []}
          hives={hives ?? []}
          action={updateColony.bind(null, id)}
        />
      </div>

      <PhotoGallery column="colony_id" parentId={colony.id} redirectTo={`/beheer/volken/${id}`} />

      <div>
        <h2 className="text-lg font-black text-stone-400 uppercase tracking-widest mb-4">Inspecties</h2>

        {!inspections || inspections.length === 0 ? (
          <p className="text-stone-500 mb-6">Nog geen inspecties gelogd.</p>
        ) : (
          <div className="space-y-3 mb-6">
            {inspections.map((i) => (
              <div key={i.id} className="bg-stone-800 rounded-2xl p-4 border border-stone-700">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-white">{i.inspection_date}</p>
                    <p className="text-stone-400 text-sm mt-1">
                      {broodPatternLabels[i.brood_pattern ?? "not_assessed"] ?? i.brood_pattern}
                      {" · "}
                      {temperamentLabels[i.temperament ?? "normal"] ?? i.temperament}
                      {i.queen_seen ? " · koningin gezien" : ""}
                    </p>
                    {i.notes && <p className="text-stone-300 text-sm mt-2">{i.notes}</p>}
                  </div>
                  <form action={deleteInspection.bind(null, id)}>
                    <input type="hidden" name="id" value={i.id} />
                    <DeleteButton confirmMessage="Deze inspectie verwijderen?" />
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}

        <InspectionForm action={createInspection.bind(null, id)} />
      </div>
    </div>
  );
}
