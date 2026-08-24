"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { str } from "@/lib/beheer/form-utils";

export type PhotoFormState = { error: string } | undefined;

export async function uploadPhoto(
  colonyId: string,
  redirectTo: string,
  _prevState: PhotoFormState,
  formData: FormData
): Promise<PhotoFormState> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Kies een foto." };
  if (!file.type.startsWith("image/")) return { error: "Alleen afbeeldingen zijn toegestaan." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Niet ingelogd." };

  const ext = file.name.split(".").pop() || "jpg";
  // Padconventie {colony_id}/... volgt de storage-policy in supabase/schema.sql
  // (inspection_photos_storage_access matcht het eerste padsegment tegen colonies.id).
  const path = `${colonyId}/${randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("photos")
    .upload(path, file, { contentType: file.type });
  if (uploadError) return { error: uploadError.message };

  const { error: dbError } = await supabase.from("documents").insert({
    colony_id: colonyId,
    filename: file.name,
    storage_path: path,
  });
  if (dbError) {
    await supabase.storage.from("photos").remove([path]);
    return { error: dbError.message };
  }

  revalidatePath(redirectTo);
  redirect(redirectTo);
}

export async function deletePhoto(redirectTo: string, formData: FormData) {
  const id = str(formData.get("id"));
  const path = str(formData.get("path"));

  const supabase = await createClient();
  await supabase.from("documents").delete().eq("id", id);
  await supabase.storage.from("photos").remove([path]);

  revalidatePath(redirectTo);
  redirect(redirectTo);
}
