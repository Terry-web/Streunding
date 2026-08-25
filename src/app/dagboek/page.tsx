import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { hiveTypeLabels } from "@/lib/beheer/labels";

export const metadata: Metadata = {
  title: "Inspectie dagboek",
  description: "Mijn bijgehouden inspecties per volk — koningin, broed, varroa en notities.",
};

const statusStyle: Record<string, string> = {
  goed: "bg-green-100 text-green-800",
  controleren: "bg-amber-100 text-amber-800",
  aandacht: "bg-red-100 text-red-800",
  onbekend: "bg-stone-100 text-stone-500",
};

const statusLabel: Record<string, string> = {
  goed: "Goed",
  controleren: "Controleren",
  aandacht: "Aandacht",
  onbekend: "Onbekend",
};

const broodPatternStyle: Record<string, string> = {
  solid: "bg-green-100 text-green-800",
  spotty: "bg-amber-100 text-amber-800",
  none: "bg-red-100 text-red-800",
  not_assessed: "bg-stone-100 text-stone-500",
};

const broodPatternLabel: Record<string, string> = {
  solid: "Solide",
  spotty: "Vlekkerig",
  none: "Geen",
  not_assessed: "Niet beoordeeld",
};

export default async function Dagboek() {
  const supabase = await createClient();

  const [{ data: colonies }, { data: inspections }] = await Promise.all([
    supabase.from("colony_status_overview").select("*"),
    supabase
      .from("inspections")
      .select("*, colonies(name)")
      .order("inspection_date", { ascending: false }),
  ]);

  const hasColonies = !!colonies && colonies.length > 0;
  const hasInspections = !!inspections && inspections.length > 0;

  return (
    <div className="min-h-screen bg-amber-50 text-stone-800">

      {/* Hero */}
      <section className="relative pt-16 min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-stone-900 via-amber-900 to-green-900">
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
        <div className="absolute top-10 right-20 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl animate-float" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto py-20">
          <div className="text-7xl mb-6 animate-float inline-block">📋</div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-none">
            Inspectie<br/><span className="text-amber-400">Dagboek</span>
          </h1>
          <p className="text-xl text-amber-200 max-w-xl mx-auto leading-relaxed">
            Alles wat ik zie en doe tijdens mijn bijeninspecties, bijgehouden per volk.
          </p>
        </div>
      </section>

      {/* Volken overzicht */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-amber-700 font-semibold uppercase tracking-widest text-sm mb-2">Mijn volken</p>
        <h2 className="text-4xl font-black mb-10 text-stone-900 reveal">De volken</h2>

        {!hasColonies ? (
          <div className="border-2 border-dashed border-amber-200 rounded-xl p-8 text-center">
            <p className="text-amber-600 text-sm font-medium">Nog geen volken om te tonen</p>
            <p className="text-stone-400 text-xs mt-1">Eerste volk verwacht in 2027</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {colonies.map((c) => (
              <div key={c.colony_id} className="bg-white rounded-2xl shadow border border-stone-100 p-7 reveal">
                <div className="flex items-start justify-between mb-5 gap-3">
                  <div>
                    <h3 className="text-2xl font-black text-stone-900">{c.colony_name}</h3>
                    <p className="text-stone-400 text-sm mt-1">
                      {[c.hive_label, hiveTypeLabels[c.hive_type ?? ""], c.apiary].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${statusStyle[c.status ?? "onbekend"]}`}
                  >
                    {statusLabel[c.status ?? "onbekend"] ?? c.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-stone-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-stone-900">{c.frames_of_bees ?? "—"}</p>
                    <p className="text-xs text-stone-400 uppercase tracking-widest">Ramen bijen</p>
                  </div>
                  <div className="bg-stone-50 rounded-xl p-3 text-center">
                    <p className="text-sm font-black text-stone-900">{c.last_inspection_date ?? "—"}</p>
                    <p className="text-xs text-stone-400 uppercase tracking-widest">Laatste inspectie</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Inspecties tijdlijn */}
      <section className="bg-stone-100 py-20">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-amber-700 font-semibold uppercase tracking-widest text-sm mb-2">Geschiedenis</p>
          <h2 className="text-4xl font-black mb-12 text-stone-900 reveal">Alle inspecties</h2>

          {!hasInspections ? (
            <div className="bg-white rounded-3xl p-16 text-center shadow border border-stone-100 reveal">
              <div className="text-6xl mb-6">🪵</div>
              <h3 className="text-2xl font-black text-stone-900 mb-3">Nog leeg</h3>
              <p className="text-stone-500 leading-7 max-w-sm mx-auto">
                De kasten staan klaar, maar de bijen komen pas na de basis imkercursus in 2027.
                Zodra het eerste volk er is, begin ik hier mijn inspecties bij te houden.
              </p>
              <div className="mt-8 inline-block bg-amber-50 border border-amber-200 rounded-full px-6 py-2 text-amber-700 text-sm font-medium">
                📅 Eerste inspectie verwacht: voorjaar 2027
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-amber-200" />
              {inspections.map((insp) => (
                <div key={insp.id} className="relative flex gap-8 mb-8 reveal">
                  <div className="shrink-0 w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-amber-900 z-10 shadow">
                    🔍
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow flex-1 border border-stone-100">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                      <div>
                        <p className="font-black text-stone-900">{insp.colonies?.name ?? "Onbekend volk"}</p>
                        <p className="text-stone-400 text-sm">
                          {insp.inspection_date}
                          {insp.weather ? ` · ${insp.weather}` : ""}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          insp.queen_seen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
                        }`}
                      >
                        Koningin: {insp.queen_seen ? "gezien" : "niet gezien"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ${
                            broodPatternStyle[insp.brood_pattern ?? "not_assessed"]
                          }`}
                        >
                          {broodPatternLabel[insp.brood_pattern ?? "not_assessed"] ?? insp.brood_pattern}
                        </span>
                        <p className="text-xs text-stone-400 mt-1">Broed</p>
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-stone-100 text-stone-700">
                          {insp.honey_stores ?? "—"}
                        </span>
                        <p className="text-xs text-stone-400 mt-1">Honing</p>
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-stone-100 text-stone-700">
                          {insp.varroa_count ?? "—"}
                        </span>
                        <p className="text-xs text-stone-400 mt-1">Varroa</p>
                      </div>
                    </div>
                    {insp.notes && (
                      <p className="text-sm text-stone-500 italic border-t border-stone-100 pt-3 mt-3">{insp.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative bg-gradient-to-r from-amber-800 to-orange-800 text-white py-20 px-6 text-center">
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="text-5xl mb-4">📅</div>
          <h2 className="text-4xl font-black mb-4">Wanneer inspecteer je?</h2>
          <p className="text-amber-200 text-lg mb-8">Bekijk de imkerkalender om te zien wat je elke maand moet doen.</p>
          <Link href="/kalender"
            className="bg-white text-amber-900 font-bold px-10 py-4 rounded-full hover:bg-amber-100 transition-all hover:scale-105 inline-block shadow-xl text-lg"
          >
            Naar de kalender →
          </Link>
        </div>
      </section>

    </div>
  );
}
