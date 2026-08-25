import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export type PhotoParentColumn = "colony_id" | "hive_id";

export type Photo = {
  id: string;
  filename: string;
  storage_path: string;
  url: string | null;
};

export async function getSignedPhotos(
  supabase: SupabaseServerClient,
  column: PhotoParentColumn,
  parentId: string
): Promise<Photo[]> {
  const { data: docs } = await supabase
    .from("documents")
    .select("id, filename, storage_path")
    .eq(column, parentId)
    .order("uploaded_at", { ascending: false });

  if (!docs || docs.length === 0) return [];

  const { data: signed } = await supabase.storage
    .from("photos")
    .createSignedUrls(
      docs.map((d) => d.storage_path),
      3600
    );

  return docs.map((d, i) => ({
    id: d.id,
    filename: d.filename,
    storage_path: d.storage_path,
    url: signed?.[i]?.signedUrl ?? null,
  }));
}
