"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { str, numOrNull, dateOrNull } from "@/lib/beheer/form-utils";

export type AanbodFormState = { error: string } | undefined;

function aanbodPayloadFromFormData(formData: FormData) {
  return {
    naam: str(formData.get("naam")),
    ras: str(formData.get("ras")) || null,
    omvang: str(formData.get("omvang")) || null,
    prijs: numOrNull(formData.get("prijs")),
    beschikbaar_vanaf: dateOrNull(formData.get("beschikbaar_vanaf")),
    beschikbaar_tot: dateOrNull(formData.get("beschikbaar_tot")),
    voorraad: numOrNull(formData.get("voorraad")) ?? 0,
    regio: str(formData.get("regio")) || null,
    beschrijving: str(formData.get("beschrijving")) || null,
    actief: formData.get("actief") === "on",
  };
}

export async function createAanbod(
  _prevState: AanbodFormState,
  formData: FormData
): Promise<AanbodFormState> {
  const payload = aanbodPayloadFromFormData(formData);
  if (!payload.naam) return { error: "Naam is verplicht." };

  const supabase = await createClient();
  const { error } = await supabase.from("bestuifvolk_aanbod").insert(payload);
  if (error) return { error: error.message };

  revalidatePath("/beheer/bestuiving");
  revalidatePath("/bestuiving");
  redirect("/beheer/bestuiving");
}

export async function updateAanbod(
  id: string,
  _prevState: AanbodFormState,
  formData: FormData
): Promise<AanbodFormState> {
  const payload = aanbodPayloadFromFormData(formData);
  if (!payload.naam) return { error: "Naam is verplicht." };

  const supabase = await createClient();
  const { error } = await supabase.from("bestuifvolk_aanbod").update(payload).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/beheer/bestuiving");
  revalidatePath(`/beheer/bestuiving/${id}`);
  revalidatePath("/bestuiving");
  redirect("/beheer/bestuiving");
}

export async function deleteAanbod(formData: FormData) {
  const id = str(formData.get("id"));
  const supabase = await createClient();
  const { error } = await supabase.from("bestuifvolk_aanbod").delete().eq("id", id);

  if (error) {
    redirect(`/beheer/bestuiving?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/beheer/bestuiving");
  revalidatePath("/bestuiving");
  redirect("/beheer/bestuiving");
}

export async function updateAanvraagStatus(formData: FormData) {
  const id = str(formData.get("id"));
  const status = str(formData.get("status"));

  const supabase = await createClient();
  await supabase.from("bestuifvolk_aanvragen").update({ status }).eq("id", id);

  revalidatePath("/beheer/bestuiving");
}
