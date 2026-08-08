"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { str, numOrNull } from "@/lib/beheer/form-utils";

export type ApiaryFormState = { error: string } | undefined;

function payloadFromFormData(formData: FormData) {
  return {
    name: str(formData.get("name")),
    type: str(formData.get("type")) || "field",
    address: str(formData.get("address")) || null,
    postal_code: str(formData.get("postal_code")) || null,
    city: str(formData.get("city")) || null,
    province: str(formData.get("province")) || null,
    latitude: numOrNull(formData.get("latitude")),
    longitude: numOrNull(formData.get("longitude")),
    owner_permission: str(formData.get("owner_permission")) || null,
    rvo_registration_number: str(formData.get("rvo_registration_number")) || null,
    max_hives: numOrNull(formData.get("max_hives")),
    notes: str(formData.get("notes")) || null,
  };
}

export async function createApiary(
  _prevState: ApiaryFormState,
  formData: FormData
): Promise<ApiaryFormState> {
  const payload = payloadFromFormData(formData);
  if (!payload.name) return { error: "Naam is verplicht." };

  const supabase = await createClient();
  const { error } = await supabase.from("apiaries").insert(payload);
  if (error) return { error: error.message };

  revalidatePath("/beheer/standplaatsen");
  redirect("/beheer/standplaatsen");
}

export async function updateApiary(
  id: string,
  _prevState: ApiaryFormState,
  formData: FormData
): Promise<ApiaryFormState> {
  const payload = payloadFromFormData(formData);
  if (!payload.name) return { error: "Naam is verplicht." };

  const supabase = await createClient();
  const { error } = await supabase.from("apiaries").update(payload).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/beheer/standplaatsen");
  revalidatePath(`/beheer/standplaatsen/${id}`);
  redirect("/beheer/standplaatsen");
}

export async function deleteApiary(formData: FormData) {
  const id = str(formData.get("id"));
  const supabase = await createClient();
  const { error } = await supabase.from("apiaries").delete().eq("id", id);

  if (error) {
    const message =
      error.code === "23503"
        ? "Deze standplaats wordt nog gebruikt door een volk en kan niet verwijderd worden."
        : error.message;
    redirect(`/beheer/standplaatsen?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/beheer/standplaatsen");
  redirect("/beheer/standplaatsen");
}
