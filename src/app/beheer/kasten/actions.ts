"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { str, numOrNull, dateOrNull, boolFromCheckbox } from "@/lib/beheer/form-utils";

export type HiveFormState = { error: string } | undefined;

function payloadFromFormData(formData: FormData) {
  return {
    label: str(formData.get("label")),
    type: str(formData.get("type")) || "dadant",
    frame_count: numOrNull(formData.get("frame_count")),
    box_count: numOrNull(formData.get("box_count")),
    purchase_date: dateOrNull(formData.get("purchase_date")),
    condition: str(formData.get("condition")) || null,
    in_use: boolFromCheckbox(formData, "in_use"),
    notes: str(formData.get("notes")) || null,
    is_public: boolFromCheckbox(formData, "is_public"),
  };
}

export async function createHive(
  _prevState: HiveFormState,
  formData: FormData
): Promise<HiveFormState> {
  const payload = payloadFromFormData(formData);
  if (!payload.label) return { error: "Naam/nummer is verplicht." };

  const supabase = await createClient();
  const { error } = await supabase.from("hives").insert(payload);
  if (error) return { error: error.message };

  revalidatePath("/beheer/kasten");
  revalidatePath("/kasten");
  revalidatePath("/");
  revalidatePath("/over-mij");
  redirect("/beheer/kasten");
}

export async function updateHive(
  id: string,
  _prevState: HiveFormState,
  formData: FormData
): Promise<HiveFormState> {
  const payload = payloadFromFormData(formData);
  if (!payload.label) return { error: "Naam/nummer is verplicht." };

  const supabase = await createClient();
  const { error } = await supabase.from("hives").update(payload).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/beheer/kasten");
  revalidatePath(`/beheer/kasten/${id}`);
  revalidatePath("/kasten");
  revalidatePath("/");
  revalidatePath("/over-mij");
  redirect("/beheer/kasten");
}

export async function deleteHive(formData: FormData) {
  const id = str(formData.get("id"));
  const supabase = await createClient();
  const { error } = await supabase.from("hives").delete().eq("id", id);

  if (error) {
    const message =
      error.code === "23503"
        ? "Deze kast wordt nog gebruikt door een volk en kan niet verwijderd worden."
        : error.message;
    redirect(`/beheer/kasten?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/beheer/kasten");
  revalidatePath("/kasten");
  revalidatePath("/");
  revalidatePath("/over-mij");
  redirect("/beheer/kasten");
}
