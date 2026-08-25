import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSignedPhotos } from "@/lib/beheer/photos";
import { hiveTypeLabels } from "@/lib/beheer/labels";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: hive } = await supabase.from("hives").select("label").eq("id", id).single();

  return {
    title: hive ? `${hive.label} | Kasten` : "Kast",
    description: hive ? `Foto's en info over ${hive.label}.` : undefined,
  };
}

export default async function KastPubliekPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: hive } = await supabase.from("hives").select("*").eq("id", id).single();
  if (!hive) notFound();

  const photos = await getSignedPhotos(supabase, "hive_id", hive.id);

  return (
    <div className="min-h-screen bg-amber-50 text-stone-800">

      {/* Hero */}
      <section className="relative pt-16 min-h-[40vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-900 via-amber-900 to-stone-900">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="honeycomb" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse">
                <polygon points="28,2 54,17 54,47 28,62 2,47 2,17" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
                <polygon points="28,52 54,67 54,97 28,112 2,97 2,67" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#honeycomb)"/>
          </svg>
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto py-16">
          <div className="text-6xl mb-6">🪵</div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 leading-none">
            {hive.label}
          </h1>
          <p className="text-lg text-amber-200">
            {hiveTypeLabels[hive.type ?? ""] ?? hive.type ?? "Kast"}
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/kasten" className="text-amber-700 font-semibold hover:text-amber-900 text-sm">
          ← Terug naar de kasten
        </Link>

        {/* Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
          <InfoCard label="Type" value={hiveTypeLabels[hive.type ?? ""] ?? hive.type ?? "—"} />
          <InfoCard label="Aantal ramen" value={hive.frame_count ?? "—"} />
          <InfoCard label="Kasten hoog" value={hive.box_count ?? "—"} />
          <InfoCard
            label="Aankoopdatum"
            value={hive.purchase_date ? new Date(hive.purchase_date).toLocaleDateString("nl-NL") : "—"}
          />
        </div>

        {hive.notes && (
          <div className="bg-white rounded-2xl p-6 shadow border border-amber-100 mb-10">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">Notities</p>
            <p className="text-stone-600 leading-7">{hive.notes}</p>
          </div>
        )}

        {/* Foto's */}
        <div>
          <p className="text-amber-700 font-semibold uppercase tracking-widest text-sm mb-2">Foto&apos;s</p>
          <h2 className="text-2xl font-black text-stone-900 mb-6">Deze kast in beeld</h2>

          {photos.length === 0 ? (
            <p className="text-stone-500">Nog geen foto&apos;s van deze kast.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((p) =>
                p.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={p.id}
                    src={p.url}
                    alt={p.filename}
                    className="w-full aspect-square object-cover rounded-xl border border-amber-100 shadow"
                  />
                ) : null
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-2xl p-4 text-center shadow border border-amber-100">
      <p className="text-lg font-black text-stone-900">{value}</p>
      <p className="text-xs text-stone-400 uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}
