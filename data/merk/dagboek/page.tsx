// merk/dagboek/page.tsx  →  src/app/dagboek/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { hiveTypeLabels } from "@/lib/beheer/labels";

export const metadata: Metadata = {
  title: "Inspectie dagboek",
  description: "Mijn bijgehouden inspecties per volk — koningin, broed, varroa en notities.",
};

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68235] rounded-sm";
const heading = { fontFamily: "var(--font-heading), Georgia, serif" } as const;

const GOED = "#7d5411", LET = "#8c2f2f", GRIJS = "#605d5d";

const statusStijl: Record<string, { label: string; kleur: string; rand: string; dikte: string }> = {
  goed: { label: "Goed", kleur: GOED, rand: "rgba(182,130,53,.6)", dikte: "1px" },
  controleren: { label: "Controleren", kleur: LET, rand: "rgba(140,47,47,.5)", dikte: "2px" },
  aandacht: { label: "Aandacht", kleur: LET, rand: "rgba(140,47,47,.5)", dikte: "2px" },
  onbekend: { label: "Onbekend", kleur: GRIJS, rand: "rgba(32,31,29,.24)", dikte: "1px" },
};

const broedStijl: Record<string, { label: string; kleur: string; dikte: string }> = {
  solid: { label: "Solide", kleur: GOED, dikte: "1px" },
  spotty: { label: "Vlekkerig", kleur: LET, dikte: "2px" },
  none: { label: "Geen", kleur: LET, dikte: "2px" },
  not_assessed: { label: "Niet beoordeeld", kleur: GRIJS, dikte: "1px" },
};

const wachtlijst = [
  { label: "Kasten gereed", waarde: "2" },
  { label: "Volken", waarde: "0" },
  { label: "Basiscursus", waarde: "2027" },
  { label: "Eerste inspectie", waarde: "Voorjaar 2027" },
];

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-3.5">
      <span className="h-px w-9 bg-[#b68235]/60" />
      <span className="text-xs uppercase tracking-[0.2em] text-[#7d5411]">{children}</span>
    </span>
  );
}

function datum(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
}

export default async function Dagboek() {
  const supabase = await createClient();
  const [{ data: colonies }, { data: inspections }] = await Promise.all([
    supabase.from("colony_status_overview").select("*"),
    supabase.from("inspections").select("*, colonies(name)").order("inspection_date", { ascending: false }),
  ]);

  const volken = colonies ?? [];
  const inspecties = inspections ?? [];
  const leeg = volken.length === 0 && inspecties.length === 0;

  return (
    <div className="bg-[#f3f2f2] text-[#201f1d]">

      {/* Hero */}
      <section className="pt-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 px-6 pb-8 pt-20">
          <Kicker>Inspectieregister</Kicker>
          <div className="grid w-full items-end gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
            <h1 className="text-5xl leading-none md:text-[4.5rem]">Het dagboek</h1>
            <p className="text-[17px] leading-[1.72] text-[#4a4744] [hyphens:auto] md:mb-2 md:text-justify">
              Wat ik zie bij elke inspectie, per volk vastgelegd: de koningin, het broedbeeld, de
              voorraad en de varroatelling. Wat je niet opschrijft, ben je vergeten.
            </p>
          </div>
          <span className="mt-2 h-px w-full bg-[#201f1d]/15" />
        </div>
      </section>

      {leeg ? (
        /* ── Lege toestand ── */
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-16 md:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)]">
            <div className="flex flex-col items-start gap-5">
              <h2 className="text-[2.75rem] leading-[1.06]">Nog geen regel geschreven</h2>
              <p className="text-[17px] leading-[1.75] text-[#4a4744] [hyphens:auto] md:text-justify">
                De kasten staan klaar in Oldambt, maar de bijen komen pas na de basiscursus. Vanaf
                het voorjaar van 2027 vult deze bladzijde zich: één regel per inspectie, van de
                eerste opening in maart tot de laatste controle in september.
              </p>
              <dl className="mt-1 flex w-full flex-col border-b border-[#201f1d]/15">
                {wachtlijst.map((w) => (
                  <div key={w.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 border-t border-[#201f1d]/15 py-3">
                    <dt className="text-[13px] uppercase tracking-[0.14em] text-[#605d5d]">{w.label}</dt>
                    <dd className="m-0 text-[19px] tabular-nums" style={{ ...heading, fontWeight: 600 }}>{w.waarde}</dd>
                  </div>
                ))}
              </dl>
              <Link
                href="/kalender"
                className={`mt-1 rounded border border-[#b68235] px-6 py-3 text-base tracking-[0.06em] text-[#7d5411] transition-colors hover:bg-[#b68235]/10 ${focus}`}
                style={{ ...heading, fontWeight: 600 }}
              >
                Wat er tot die tijd gebeurt
              </Link>
            </div>

            {/* Blanco register */}
            <div className="flex flex-col gap-3.5">
              <div className="flex items-baseline gap-4">
                <h3 className="text-[1.5rem]" style={{ ...heading, fontWeight: 600 }}>Zo komt het eruit te zien</h3>
                <span className="h-px flex-1 bg-[#201f1d]/15" />
              </div>
              <div className="rounded border border-[#201f1d]/20 bg-[#f6f5f4] px-7 py-6">
                <div className="grid grid-cols-[90px_minmax(0,1fr)_70px_70px_60px] gap-4 border-b border-[#201f1d]/30 pb-2.5">
                  {["Datum", "Volk", "Kon.", "Broed", "Varroa"].map((h, i) => (
                    <span key={h} className={`text-[11px] uppercase tracking-[0.16em] text-[#605d5d] ${i === 4 ? "text-right" : ""}`}>
                      {h}
                    </span>
                  ))}
                </div>
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <div key={n} className="grid grid-cols-[90px_minmax(0,1fr)_70px_70px_60px] gap-4 border-b border-[#201f1d]/10 py-4">
                    {[0, 1, 2, 3, 4].map((c) => (
                      <span key={c} className="h-px self-center bg-[#201f1d]/15" />
                    ))}
                  </div>
                ))}
                <p className="mt-4 text-[13px] italic leading-[1.6] text-[#605d5d]">
                  Voorjaar 2027 — eerste inspectie.
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* ── Gevulde toestand ── */
        <>
          {volken.length > 0 && (
            <section className="mx-auto max-w-6xl px-6 pb-20">
              <div className="mb-7 flex flex-wrap items-baseline justify-between gap-6">
                <h2 className="text-[2.625rem] leading-none">De volken</h2>
                <span className="text-xs uppercase tracking-[0.2em] tabular-nums text-[#7d5411]">
                  {volken.length} {volken.length === 1 ? "volk" : "volken"}
                </span>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {volken.map((c) => {
                  const s = statusStijl[c.status ?? "onbekend"] ?? statusStijl.onbekend;
                  return (
                    <div key={c.colony_id} className="rounded border border-[#201f1d]/15 bg-[#f6f5f4] p-7">
                      <div className="mb-4 flex items-start justify-between gap-5">
                        <div className="flex flex-col gap-1.5">
                          <h3 className="text-[1.7rem] leading-[1.1]" style={{ ...heading, fontWeight: 600 }}>
                            {c.colony_name}
                          </h3>
                          <span className="text-[13px] tracking-[0.05em] text-[#605d5d]">
                            {[c.hive_label, hiveTypeLabels[c.hive_type ?? ""], c.apiary].filter(Boolean).join(" · ") || "—"}
                          </span>
                        </div>
                        <span
                          className="flex shrink-0 items-center gap-2 rounded-sm border px-2.5 py-1 text-[11px] uppercase tracking-[0.14em]"
                          style={{ color: s.kleur, borderColor: s.rand }}
                        >
                          <span className="w-3" style={{ height: s.dikte, background: s.kleur }} />
                          {s.label}
                        </span>
                      </div>
                      <dl className="m-0 flex flex-col border-b border-[#201f1d]/15">
                        {[
                          { label: "Ramen bijen", waarde: c.frames_of_bees ?? "—" },
                          { label: "Laatste inspectie", waarde: datum(c.last_inspection_date) },
                        ].map((r) => (
                          <div key={r.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 border-t border-[#201f1d]/15 py-2.5">
                            <dt className="text-xs uppercase tracking-[0.14em] text-[#605d5d]">{r.label}</dt>
                            <dd className="m-0 text-[18px] tabular-nums" style={{ ...heading, fontWeight: 600 }}>{r.waarde}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <section className="border-t border-[#201f1d]/15 bg-[#eeeceb]">
            <div className="mx-auto max-w-6xl px-6 py-20">
              <div className="mb-8 flex flex-wrap items-baseline justify-between gap-6">
                <h2 className="text-[2.625rem] leading-none">Alle inspecties</h2>
                <span className="text-xs uppercase tracking-[0.2em] text-[#7d5411]">Nieuwste eerst</span>
              </div>
              <div className="flex flex-col border-b border-[#201f1d]/15">
                <div className="hidden grid-cols-[100px_140px_110px_110px_80px_minmax(0,1fr)] gap-5 border-b border-[#201f1d]/30 pb-3 lg:grid">
                  {["Datum", "Volk", "Koningin", "Broedbeeld", "Varroa", "Notitie"].map((h, i) => (
                    <span key={h} className={`text-[11px] uppercase tracking-[0.16em] text-[#605d5d] ${i === 4 ? "text-right" : ""}`}>
                      {h}
                    </span>
                  ))}
                </div>
                {inspecties.map((insp) => {
                  const b = broedStijl[insp.brood_pattern ?? "not_assessed"] ?? broedStijl.not_assessed;
                  const konKleur = insp.queen_seen ? GOED : LET;
                  return (
                    <div
                      key={insp.id}
                      className="grid items-baseline gap-2 border-t border-[#201f1d]/15 py-4 lg:grid-cols-[100px_140px_110px_110px_80px_minmax(0,1fr)] lg:gap-5"
                    >
                      <span className="text-[18px] tabular-nums" style={heading}>{datum(insp.inspection_date)}</span>
                      <span className="text-[19px] leading-[1.15]" style={{ ...heading, fontWeight: 600 }}>
                        {insp.colonies?.name ?? "Onbekend volk"}
                      </span>
                      <span className="flex items-center gap-2 text-[13px]" style={{ color: konKleur }}>
                        <span className="w-3 shrink-0" style={{ height: insp.queen_seen ? "1px" : "2px", background: konKleur }} />
                        {insp.queen_seen ? "Gezien" : "Niet gezien"}
                      </span>
                      <span className="flex items-center gap-2 text-[13px]" style={{ color: b.kleur }}>
                        <span className="w-3 shrink-0" style={{ height: b.dikte, background: b.kleur }} />
                        {b.label}
                      </span>
                      <span className="text-[18px] tabular-nums lg:text-right" style={heading}>
                        {insp.varroa_count ?? "—"}
                      </span>
                      <span className="text-sm italic leading-[1.6] text-[#4a4744]">{insp.notes ?? ""}</span>
                    </div>
                  );
                })}
              </div>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-5">
                {[
                  { k: GOED, d: "1px", t: "In orde" },
                  { k: LET, d: "2px", t: "Vraagt aandacht" },
                  { k: GRIJS, d: "1px", t: "Niet beoordeeld" },
                ].map((l) => (
                  <li key={l.t} className="flex items-center gap-2.5 text-xs text-[#605d5d]">
                    <span className="w-3.5" style={{ height: l.d, background: l.k }} />
                    {l.t}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}

      {/* Slot */}
      <section className="border-t border-[#201f1d]/15 px-6 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex flex-col gap-3.5">
            <Kicker>Wanneer inspecteren?</Kicker>
            <h2 className="text-[2.5rem] leading-[1.08]">Elke maand vraagt iets anders</h2>
            <p className="max-w-[52ch] text-[17px] leading-[1.7] text-[#4a4744]">
              In de almanak staat per maand wat er in de kast gebeurt en wanneer je hem beter dicht
              laat.
            </p>
          </div>
          <Link
            href="/kalender"
            className={`whitespace-nowrap rounded border border-[#b68235] px-7 py-3.5 text-base tracking-[0.06em] text-[#7d5411] transition-colors hover:bg-[#b68235]/10 ${focus}`}
            style={{ ...heading, fontWeight: 600 }}
          >
            Naar de kalender
          </Link>
        </div>
      </section>
    </div>
  );
}
