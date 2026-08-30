// merk/Kalender.tsx  →  src/components/Kalender.tsx
"use client";
import { useState } from "react";

type Taak = { type: "urgent" | "aandacht" | "info"; tekst: string };
type Maand = {
  naam: string; kort: string; seizoen: string; volk: string;
  dracht: string; openen: string; samenvatting: string; kern: string; taken: Taak[];
};

const heading = { fontFamily: "var(--font-heading), Georgia, serif" } as const;
const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68235]";

const maanden: Maand[] = [
  { naam: "Januari", kort: "Jan", seizoen: "Winter", volk: "10.000", dracht: "Geen", openen: "Nooit",
    samenvatting: "Diepe winterrust. De bijen niet storen — alleen van buiten controleren.",
    kern: "Winterrust; alleen buitenom controleren.",
    taken: [
      { type: "info", tekst: "De bijen zitten in de wintertros. De kast blijft dicht." },
      { type: "aandacht", tekst: "Controleer van buitenaf op stormschade." },
      { type: "aandacht", tekst: "Houd de vliegopening vrij van dode bijen." },
      { type: "info", tekst: "Goede tijd voor cursussen en het bijbestellen van materiaal." },
    ] },
  { naam: "Februari", kort: "Feb", seizoen: "Winter", volk: "10.000", dracht: "Hazelaar", openen: "Nee",
    samenvatting: "Eerste tekenen van leven: de koningin begint te leggen zodra het warm genoeg is.",
    kern: "Voorraad controleren; eerste reinigingsvluchten.",
    taken: [
      { type: "aandacht", tekst: "Controleer de voedselvoorraad — bij twijfel bijvoeren." },
      { type: "info", tekst: "Boven 10 °C komen ze eruit voor een reinigingsvlucht." },
      { type: "info", tekst: "Kast van buiten nakijken op schade of muizenvraat." },
    ] },
  { naam: "Maart", kort: "Mrt", seizoen: "Lente", volk: "20.000", dracht: "Wilg, krokus", openen: "Boven 12 °C",
    samenvatting: "De eerste inspectie is mogelijk bij twaalf graden of meer. Het volk groeit nu snel.",
    kern: "Eerste inspectie; muizenrooster eraf.",
    taken: [
      { type: "urgent", tekst: "Eerste inspectie bij zonnig weer boven 12 °C." },
      { type: "urgent", tekst: "Controleer of de koningin aanwezig is en legt." },
      { type: "aandacht", tekst: "Verwijder het muizenrooster." },
      { type: "info", tekst: "Het volk groeit snel — geef ruimte als het nodig is." },
    ] },
  { naam: "April", kort: "Apr", seizoen: "Lente", volk: "35.000", dracht: "Paardenbloem, fruit", openen: "Wekelijks",
    samenvatting: "Het zwermseizoen begint. Wekelijkse inspecties zijn nu geen luxe maar noodzaak.",
    kern: "Wekelijks op zwermcellen; honingkamer erop.",
    taken: [
      { type: "urgent", tekst: "Wekelijks inspecteren op zwermcellen." },
      { type: "urgent", tekst: "Wees alert op zwermgedrag." },
      { type: "aandacht", tekst: "Geef ruimte: zet een honingkamer op." },
      { type: "info", tekst: "De eerste dracht komt: paardenbloem en fruitbomen." },
    ] },
  { naam: "Mei", kort: "Mei", seizoen: "Lente", volk: "55.000", dracht: "Koolzaad, boom", openen: "Wekelijks",
    samenvatting: "Hoogtepunt van het zwermseizoen; het volk staat op zijn sterkst.",
    kern: "Zwermpiek; eventueel kunstzwerm maken.",
    taken: [
      { type: "urgent", tekst: "Wekelijks inspecteren — dit is de piek van het zwermseizoen." },
      { type: "aandacht", tekst: "Controleer of de honingkamers niet te vol raken." },
      { type: "aandacht", tekst: "Maak eventueel een kunstzwerm om zwermen voor te zijn." },
      { type: "info", tekst: "Tot 60.000 bijen per volk: de drukste weken van het jaar." },
    ] },
  { naam: "Juni", kort: "Jun", seizoen: "Zomer", volk: "60.000", dracht: "Linde, klaver", openen: "Tweewekelijks",
    samenvatting: "De eerste honingoogst kan; de zomerdracht is in volle gang.",
    kern: "Eerste oogst mogelijk; water bij de kast.",
    taken: [
      { type: "aandacht", tekst: "Kijk of de raten verzegeld zijn — boven 75 procent is rijp." },
      { type: "info", tekst: "Bij goede dracht is de eerste honingoogst mogelijk." },
      { type: "info", tekst: "Het zwermseizoen loopt af; minder vaak inspecteren." },
      { type: "aandacht", tekst: "Zorg voor water in de buurt van de kasten." },
    ] },
  { naam: "Juli", kort: "Jul", seizoen: "Zomer", volk: "55.000", dracht: "Linde, braam", openen: "Voor oogst",
    samenvatting: "Hoogtepunt van de honingoogst, en het moment om varroa te gaan tellen.",
    kern: "Honingoogst; varroa tellen.",
    taken: [
      { type: "urgent", tekst: "Honingoogst — maak alles slingerklaar." },
      { type: "urgent", tekst: "Varroa tellen met suikerrol of wasbodem." },
      { type: "aandacht", tekst: "Controleer na de oogst de voedselvoorraad." },
      { type: "info", tekst: "De dracht neemt af en het volk begint te krimpen." },
    ] },
  { naam: "Augustus", kort: "Aug", seizoen: "Zomer", volk: "40.000", dracht: "Heide", openen: "Voor behandeling",
    samenvatting: "De kritieke maand: varroa behandelen en wintervoer geven. Hier wordt de winter beslist.",
    kern: "Varroa behandelen; wintervoer starten.",
    taken: [
      { type: "urgent", tekst: "Varroa behandelen met mierenzuur of oxaalzuur." },
      { type: "urgent", tekst: "Begin met wintervoer: suikerwater 2 op 1." },
      { type: "aandacht", tekst: "Vernauw de vliegopening — wespen komen op de honing af." },
      { type: "info", tekst: "De wintertoestand wordt nu bepaald. Niet verwaarlozen." },
    ] },
  { naam: "September", kort: "Sep", seizoen: "Herfst", volk: "25.000", dracht: "Klimop", openen: "Laatste keer",
    samenvatting: "Wintervoer aanvullen. Het volk maakt zich op voor de winter.",
    kern: "15 kg voer halen; muizenrooster erop.",
    taken: [
      { type: "urgent", tekst: "Zorg voor minstens 15 kg voer voor de winter." },
      { type: "aandacht", tekst: "Laatste inspectie: koningin aanwezig, genoeg bijen?" },
      { type: "aandacht", tekst: "Plaats het muizenrooster." },
      { type: "info", tekst: "De darren worden het volk uitgedreven." },
    ] },
  { naam: "Oktober", kort: "Okt", seizoen: "Herfst", volk: "15.000", dracht: "Geen", openen: "Nee",
    samenvatting: "Het volk krimpt naar wintersterkte. Laatste controles, dan rust.",
    kern: "Laatste controles; materiaal opruimen.",
    taken: [
      { type: "aandacht", tekst: "Controleer of het muizenrooster goed zit." },
      { type: "aandacht", tekst: "Eventueel oxaalzuur druppelen bij een broedloos volk." },
      { type: "info", tekst: "Niet meer inspecteren — laat het volk met rust." },
      { type: "info", tekst: "Materiaal schoonmaken en opslaan." },
    ] },
  { naam: "November", kort: "Nov", seizoen: "Winter", volk: "12.000", dracht: "Geen", openen: "Nooit",
    samenvatting: "De winterrust begint. Handen af van de kasten.",
    kern: "Winterrust; seizoen evalueren.",
    taken: [
      { type: "info", tekst: "De wintertros vormt zich; alleen van buiten controleren." },
      { type: "aandacht", tekst: "Zorg dat de kasten niet omwaaien bij storm." },
      { type: "info", tekst: "Schrijf je ervaringen op en leer van het seizoen." },
      { type: "info", tekst: "Plan volgend jaar: meer volken, andere locatie?" },
    ] },
  { naam: "December", kort: "Dec", seizoen: "Winter", volk: "10.000", dracht: "Geen", openen: "Nooit",
    samenvatting: "Rust. Genieten van de honing en plannen maken voor volgend jaar.",
    kern: "Rust; lezen, plannen en bestellen.",
    taken: [
      { type: "info", tekst: "Kast van buiten controleren op stormschade." },
      { type: "info", tekst: "Cursussen volgen en boeken lezen." },
      { type: "info", tekst: "Materiaal bestellen voor volgend seizoen." },
      { type: "info", tekst: "Genieten van je eigen honing." },
    ] },
];

const TAAK = {
  urgent: { label: "Moet nu", kleur: "#8c2f2f", dikte: "2px" },
  aandacht: { label: "Let op", kleur: "#7d5411", dikte: "1px" },
  info: { label: "Achtergrond", kleur: "#605d5d", dikte: "1px" },
} as const;

export default function Kalender() {
  const nu = new Date().getMonth();
  const [actief, setActief] = useState(nu);
  const m = maanden[actief];

  return (
    <>
      {/* Maandstrip */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-6 border-y border-[#201f1d]/30 lg:grid-cols-12">
          {maanden.map((x, idx) => (
            <button
              key={x.naam}
              type="button"
              onClick={() => setActief(idx)}
              aria-pressed={idx === actief}
              className={`flex flex-col items-center gap-1.5 border-l border-[#201f1d]/15 px-1 pb-3.5 pt-4 transition-colors first:border-l-0 hover:bg-[#b68235]/10 ${focus} ${
                idx === actief ? "bg-[#b68235]/[0.13]" : ""
              }`}
            >
              <span className={`text-[11px] uppercase tracking-[0.14em] tabular-nums ${idx === actief ? "text-[#7d5411]" : "text-[#605d5d]"}`}>
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span
                className={`text-xl leading-none ${idx === actief ? "text-[#201f1d]" : "text-[#605d5d]"}`}
                style={{ ...heading, fontWeight: idx === actief ? 600 : 400 }}
              >
                {x.kort}
              </span>
              <span className="min-h-[12px] text-[10px] uppercase tracking-[0.12em] text-[#b68235]">
                {idx === nu ? "Nu" : ""}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Maandspread */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-14">
        <div className="grid gap-13 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] md:gap-13">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3.5">
              <span className="text-xs uppercase tracking-[0.2em] text-[#7d5411]">{m.seizoen}</span>
              {actief === nu && (
                <span className="rounded-sm border border-[#b68235]/60 px-2 py-0.5 text-[11px] uppercase tracking-[0.14em] text-[#7d5411]">
                  Deze maand
                </span>
              )}
            </div>
            <h2 className="text-[3.75rem] leading-none" style={heading}>{m.naam}</h2>
            <span className="h-px bg-[#201f1d]/15" />
            <p className="text-[1.5rem] italic leading-[1.42] text-[#3a3735]" style={heading}>
              {m.samenvatting}
            </p>
            <dl className="mt-2 flex flex-col border-b border-[#201f1d]/15">
              {[
                { label: "Volk", waarde: m.volk },
                { label: "Dracht", waarde: m.dracht },
                { label: "Kast openen", waarde: m.openen },
              ].map((r) => (
                <div key={r.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 border-t border-[#201f1d]/15 py-3">
                  <dt className="text-xs uppercase tracking-[0.14em] text-[#605d5d]">{r.label}</dt>
                  <dd className="m-0 text-[19px] tabular-nums" style={{ ...heading, fontWeight: 600 }}>{r.waarde}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col gap-5 md:border-l md:border-[#201f1d]/15 md:pl-13">
            <div className="flex items-baseline gap-4">
              <h3 className="text-[1.625rem]" style={{ ...heading, fontWeight: 600 }}>Wat te doen</h3>
              <span className="h-px flex-1 bg-[#201f1d]/15" />
              <span className="text-xs uppercase tracking-[0.14em] tabular-nums text-[#605d5d]">
                {m.taken.length} punten
              </span>
            </div>
            <ol className="m-0 list-none border-b border-[#201f1d]/15 p-0">
              {m.taken.map((t) => {
                const s = TAAK[t.type];
                return (
                  <li key={t.tekst} className="grid items-baseline gap-3 border-t border-[#201f1d]/15 py-4 sm:grid-cols-[100px_minmax(0,1fr)] sm:gap-6">
                    <span className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.14em]" style={{ color: s.kleur }}>
                      <span className="w-3.5 shrink-0" style={{ height: s.dikte, background: s.kleur }} />
                      {s.label}
                    </span>
                    <span className="text-base leading-[1.68] text-[#3a3735]">{t.tekst}</span>
                  </li>
                );
              })}
            </ol>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
              {[
                { k: "#8c2f2f", d: "2px", t: "Moet deze maand — anders heeft het gevolgen" },
                { k: "#b68235", d: "1px", t: "Aandachtspunt om in de gaten te houden" },
                { k: "#605d5d", d: "1px", t: "Achtergrond: wat er gebeurt" },
              ].map((l) => (
                <li key={l.t} className="flex items-center gap-2.5 text-xs text-[#605d5d]">
                  <span className="w-3.5" style={{ height: l.d, background: l.k }} />
                  {l.t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Het hele jaar */}
      <section className="border-t border-[#201f1d]/15 bg-[#eeeceb]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-6">
            <h2 className="text-[2.625rem] leading-none">Het hele jaar in één oogopslag</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-[#7d5411]">Twaalf maanden</span>
          </div>
          <div className="flex flex-col border-b border-[#201f1d]/15">
            <div className="hidden grid-cols-[150px_100px_96px_minmax(0,1fr)] gap-6 border-b border-[#201f1d]/30 pb-3 sm:grid">
              {["Maand", "Seizoen", "Volk", "Kern van de maand"].map((h, i) => (
                <span key={h} className={`text-[11px] uppercase tracking-[0.16em] text-[#605d5d] ${i === 2 ? "text-right" : ""}`}>
                  {h}
                </span>
              ))}
            </div>
            {maanden.map((x, idx) => (
              <button
                key={x.naam}
                type="button"
                onClick={() => setActief(idx)}
                className={`grid items-baseline gap-2 border-t border-[#201f1d]/15 py-3.5 text-left transition-colors hover:bg-[#b68235]/[0.07] sm:grid-cols-[150px_100px_96px_minmax(0,1fr)] sm:gap-6 ${focus} ${
                  idx === actief ? "bg-[#b68235]/10" : ""
                }`}
              >
                <span className={`text-[1.3rem] leading-[1.1] ${idx === actief ? "text-[#7d5411]" : "text-[#201f1d]"}`} style={{ ...heading, fontWeight: 600 }}>
                  {x.naam}
                </span>
                <span className="text-xs uppercase tracking-[0.12em] text-[#7d5411]">{x.seizoen}</span>
                <span className="text-[19px] tabular-nums sm:text-right" style={heading}>{x.volk}</span>
                <span className="text-[15px] leading-[1.6] text-[#4a4744]">{x.kern}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
