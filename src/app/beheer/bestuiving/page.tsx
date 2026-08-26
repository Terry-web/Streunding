import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeleteButton from "@/components/DeleteButton";
import AanvraagStatusForm from "./AanvraagStatusForm";
import { deleteAanbod } from "./actions";

export const metadata = { title: "Bestuiving | Beheer | Streunding" };

export default async function BestuivingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();

  const [{ data: aanbod }, { data: aanvragen }] = await Promise.all([
    supabase.from("bestuifvolk_aanbod").select("*").order("created_at", { ascending: false }),
    supabase
      .from("bestuifvolk_aanvragen")
      .select("*, bestuifvolk_aanbod(naam)")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-stone-400 uppercase tracking-widest">
            Bestuifvolken — aanbod
          </h2>
          <Link
            href="/beheer/bestuiving/nieuw"
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
          >
            + Nieuw aanbod
          </Link>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/40 rounded-xl px-3 py-2 mb-6">
            {error}
          </p>
        )}

        {!aanbod || aanbod.length === 0 ? (
          <p className="text-stone-500">Nog geen aanbod toegevoegd.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {aanbod.map((a) => (
              <div key={a.id} className="bg-stone-800 rounded-2xl p-5 border border-stone-700">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-white">
                      {a.naam}
                      {!a.actief && (
                        <span className="ml-2 text-stone-500 text-xs font-normal">(inactief)</span>
                      )}
                    </p>
                    <p className="text-stone-400 text-sm mt-1">
                      {a.omvang ?? "—"}
                      {a.prijs != null ? ` · €${a.prijs}` : ""}
                      {a.regio ? ` · ${a.regio}` : ""}
                      {" · voorraad: "}
                      {a.voorraad}
                    </p>
                  </div>
                  <Link
                    href={`/beheer/bestuiving/${a.id}`}
                    className="text-amber-400 hover:text-amber-300 text-sm font-bold shrink-0"
                  >
                    Bewerken
                  </Link>
                </div>
                <form action={deleteAanbod} className="mt-3">
                  <input type="hidden" name="id" value={a.id} />
                  <DeleteButton
                    confirmMessage={`Aanbod "${a.naam}" verwijderen? Dit verwijdert ook alle aanvragen.`}
                  />
                </form>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-black text-stone-400 uppercase tracking-widest mb-4">Aanvragen</h2>

        {!aanvragen || aanvragen.length === 0 ? (
          <p className="text-stone-500">Nog geen aanvragen binnengekomen.</p>
        ) : (
          <div className="space-y-3">
            {aanvragen.map((v) => (
              <div key={v.id} className="bg-stone-800 rounded-2xl p-4 border border-stone-700">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-bold text-white">
                      {v.naam}
                      {v.doelgroep === "zakelijk" ? (
                        <span className="ml-2 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/40 rounded-full px-2 py-0.5 align-middle">
                          zakelijk
                        </span>
                      ) : (
                        <span className="text-stone-500 font-normal"> · {v.aantal}x</span>
                      )}
                    </p>
                    <p className="text-stone-400 text-sm mt-1">
                      {v.doelgroep === "zakelijk"
                        ? [v.gewas, v.oppervlakte, v.bloeiperiode].filter(Boolean).join(" · ") ||
                          "adviesaanvraag"
                        : (v.bestuifvolk_aanbod?.naam ?? "onbekend aanbod")}
                      {" · "}
                      <a href={`mailto:${v.email}`} className="hover:underline">
                        {v.email}
                      </a>
                      {v.telefoon ? ` · ${v.telefoon}` : ""}
                      {v.gewenste_leverdatum ? ` · gewenst: ${v.gewenste_leverdatum}` : ""}
                    </p>
                    {v.opmerking && <p className="text-stone-300 text-sm mt-2">{v.opmerking}</p>}
                  </div>
                  <AanvraagStatusForm id={v.id} status={v.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
