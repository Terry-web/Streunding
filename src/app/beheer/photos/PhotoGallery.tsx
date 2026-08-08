import { createClient } from "@/lib/supabase/server";
import { getSignedPhotos } from "@/lib/beheer/photos";
import DeleteButton from "@/components/DeleteButton";
import PhotoUploadForm from "./PhotoUploadForm";
import { uploadPhoto, deletePhoto } from "./actions";

type ParentColumn = "apiary_id" | "hive_id" | "colony_id";

export default async function PhotoGallery({
  column,
  parentId,
  redirectTo,
}: {
  column: ParentColumn;
  parentId: string;
  redirectTo: string;
}) {
  const supabase = await createClient();
  const photos = await getSignedPhotos(supabase, column, parentId);

  return (
    <div>
      <h2 className="text-lg font-black text-stone-400 uppercase tracking-widest mb-4">Foto&apos;s</h2>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {photos.map((p) => (
            <div key={p.id} className="relative group">
              {p.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.url}
                  alt={p.filename}
                  className="w-full aspect-square object-cover rounded-xl border border-stone-700"
                />
              ) : (
                <div className="w-full aspect-square rounded-xl border border-stone-700 bg-stone-800 flex items-center justify-center text-stone-600 text-xs text-center px-2">
                  Kan niet laden
                </div>
              )}
              <form
                action={deletePhoto.bind(null, redirectTo)}
                className="absolute top-2 right-2 bg-stone-900/70 rounded-full px-2 py-1"
              >
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="path" value={p.storage_path} />
                <DeleteButton confirmMessage="Deze foto verwijderen?">✕</DeleteButton>
              </form>
            </div>
          ))}
        </div>
      )}

      <PhotoUploadForm action={uploadPhoto.bind(null, { column, id: parentId }, redirectTo)} />
    </div>
  );
}
