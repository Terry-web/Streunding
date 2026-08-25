"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { str, numOrNull, dateOrNull, boolFromCheckbox } from "@/lib/beheer/form-utils";

export type ColonyFormState = { error: string } | undefined;
export type InspectionFormState = { error: string } | undefined;

function colonyPayloadFromFormData(formData: FormData) {
  return {
    name: str(formData.get("name")),
    apiary_id: str(formData.get("apiary_id")) || null,
    hive_id: str(formData.get("hive_id")) || null,
    status: str(formData.get("status")) || "active",
    established_date: dateOrNull(formData.get("established_date")),
    notes: str(formData.get("notes")) || null,
    is_public: formData.get("is_public") === "on",
  };
}

export async function createColony(
  _prevState: ColonyFormState,
  formData: FormData
): Promise<ColonyFormState> {
  const payload = colonyPayloadFromFormData(formData);
  if (!payload.name) return { error: "Naam is verplicht." };

  const supabase = await createClient();
  const { data, error } = await supabase.from("colonies").insert(payload).select("id").single();
  if (error) return { error: error.message };

  revalidatePath("/beheer/volken");
  revalidatePath("/dagboek");
  redirect(`/beheer/volken/${data.id}`);
}

export async function updateColony(
  id: string,
  _prevState: ColonyFormState,
  formData: FormData
): Promise<ColonyFormState> {
  const payload = colonyPayloadFromFormData(formData);
  if (!payload.name) return { error: "Naam is verplicht." };

  const supabase = await createClient();
  const { error } = await supabase.from("colonies").update(payload).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/beheer/volken");
  revalidatePath(`/beheer/volken/${id}`);
  revalidatePath("/dagboek");
  redirect(`/beheer/volken/${id}`);
}

export async function deleteColony(formData: FormData) {
  const id = str(formData.get("id"));
  const supabase = await createClient();
  const { error } = await supabase.from("colonies").delete().eq("id", id);

  if (error) {
    redirect(`/beheer/volken?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/beheer/volken");
  redirect("/beheer/volken");
}

export async function createInspection(
  colonyId: string,
  _prevState: InspectionFormState,
  formData: FormData
): Promise<InspectionFormState> {
  const supabase = await createClient();
  const { error } = await supabase.from("inspections").insert({
    colony_id: colonyId,
    inspection_date: dateOrNull(formData.get("inspection_date")) ?? undefined,
    queen_seen: boolFromCheckbox(formData, "queen_seen"),
    eggs_seen: boolFromCheckbox(formData, "eggs_seen"),
    brood_pattern: str(formData.get("brood_pattern")) || "not_assessed",
    temperament: str(formData.get("temperament")) || "normal",
    frames_of_bees: numOrNull(formData.get("frames_of_bees")),
    frames_of_brood: numOrNull(formData.get("frames_of_brood")),
    honey_stores: str(formData.get("honey_stores")) || null,
    pollen_stores: str(formData.get("pollen_stores")) || null,
    varroa_count: numOrNull(formData.get("varroa_count")),
    swarm_cells_seen: boolFromCheckbox(formData, "swarm_cells_seen"),
    queen_cells_seen: boolFromCheckbox(formData, "queen_cells_seen"),
    weather: str(formData.get("weather")) || null,
    notes: str(formData.get("notes")) || null,
  });
  if (error) return { error: error.message };

  revalidatePath(`/beheer/volken/${colonyId}`);
  revalidatePath("/beheer/volken");
  revalidatePath("/beheer");
  revalidatePath("/dagboek");
  redirect(`/beheer/volken/${colonyId}`);
}

export async function deleteInspection(colonyId: string, formData: FormData) {
  const id = str(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("inspections").delete().eq("id", id);

  revalidatePath(`/beheer/volken/${colonyId}`);
  revalidatePath("/beheer/volken");
  revalidatePath("/beheer");
  revalidatePath("/dagboek");
  redirect(`/beheer/volken/${colonyId}`);
}
