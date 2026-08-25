import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DeleteButton from "@/components/DeleteButton";
import StatusBadge from "@/components/StatusBadge";
import PhotoGallery from "../../photos/PhotoGallery";
import ColonyForm from "../ColonyForm";
import InspectionForm from "../InspectionForm";
import InspectieLijst from "../InspectieLijst";
import VolkOntwikkelingChart from "../VolkOntwikkelingChart";
import { updateColony, deleteColony, createInspection, deleteInspection } from "../actions";

export const metadata = { title: "Volk bewerken | Beheer | Streunding" };

export default async function VolkEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: colony }, { data: apiaries }, { data: hives }, { data: inspections }, { data: overview }] =
    await Promise.all([
      supabase.from("colonies").select("*").eq("id", id).single(),
      supabase.from("apiaries").select("id, name").order("name"),
      supabase.from("hives").select("id, label").order("label"),
      supabase.from("inspections").select("*").eq("colony_id", id).order("inspection_date", { ascending: false }),
      supabase.from("colony_status_overview").select("*").eq("colony_id", id).maybeSingle(),
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

        {overview && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-stone-800 rounded-2xl p-4 border border-stone-700 text-center">
              <div className="text-2xl font-black text-amber-400">{overview.frames_of_bees ?? "—"}</div>
              <div className="text-stone-400 text-xs mt-1 uppercase tracking-wide">Ramen bijen</div>
            </div>
            <div className="bg-stone-800 rounded-2xl p-4 border border-stone-700 text-center">
              <div className="text-2xl font-black text-amber-400">{overview.queen_birth_year ?? "—"}</div>
              <div className="text-stone-400 text-xs mt-1 uppercase tracking-wide">Koningin-jaar</div>
            </div>
            <div className="bg-stone-800 rounded-2xl p-4 border border-stone-700 flex flex-col items-center justify-center gap-2">
              <StatusBadge status={overview.status} />
              <div className="text-stone-400 text-xs uppercase tracking-wide">Status</div>
            </div>
          </div>
        )}

        <ColonyForm
          colony={colony}
          apiaries={apiaries ?? []}
          hives={hives ?? []}
          action={updateColony.bind(null, id)}
        />
      </div>

      <PhotoGallery column="colony_id" parentId={colony.id} redirectTo={`/beheer/volken/${id}`} />

      <div>
        <h2 className="text-lg font-black text-stone-400 uppercase tracking-widest mb-4">Ontwikkeling</h2>
        <VolkOntwikkelingChart
          points={[...(inspections ?? [])].reverse().map((i) => ({
            inspection_date: i.inspection_date,
            frames_of_brood: i.frames_of_brood,
            frames_of_bees: i.frames_of_bees,
          }))}
        />
      </div>

      <div>
        <h2 className="text-lg font-black text-stone-400 uppercase tracking-widest mb-4">Inspecties</h2>

        {!inspections || inspections.length === 0 ? (
          <p className="text-stone-500 mb-6">Nog geen inspecties gelogd.</p>
        ) : (
          <InspectieLijst inspections={inspections} deleteAction={deleteInspection.bind(null, id)} />
        )}

        <InspectionForm action={createInspection.bind(null, id)} />
      </div>
    </div>
  );
}
