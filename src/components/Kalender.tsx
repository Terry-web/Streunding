"use client";
import { useState } from "react";

type Taak = { type: "urgent" | "aandacht" | "info"; tekst: string };
type Maand = {
  naam: string;
  seizoen: "winter" | "lente" | "zomer" | "herfst";
  samenvatting: string;
  taken: Taak[];
};

const maanden: Maand[] = [
  {
    naam: "Januari", seizoen: "winter",
    samenvatting: "Diepe winterrust. Bijen niet storen, alleen van buiten controleren.",
    taken: [
      { type: "info", tekst: "Bijen zitten in de wintertros — niet openen" },
      { type: "aandacht", tekst: "Controleer kasten op stormschade van buitenaf" },
      { type: "aandacht", tekst: "Zorg dat de vliegopening niet verstopt zit met dode bijen" },
      { type: "info", tekst: "Mooie tijd om cursussen te volgen en materiaal bij te bestellen" },
    ],
  },
  {
    naam: "Februari", seizoen: "winter",
    samenvatting: "Eerste tekenen van leven. Koningin begint te leggen als het warm genoeg is.",
    taken: [
      { type: "aandacht", tekst: "Controleer voedselvoorraden — bij twijfel bijvoeren" },
      { type: "info", tekst: "Op warme dagen (>10°C) vluchten bijen voor reinigingsvlucht" },
      { type: "info", tekst: "Kasten van buiten inspecteren op schade of muizenvraat" },
    ],
  },
  {
    naam: "Maart", seizoen: "lente",
    samenvatting: "Eerste inspectie mogelijk bij ≥12°C. Volk groeit snel.",
    taken: [
      { type: "urgent", tekst: "Eerste inspectie bij zonnig weer boven 12°C" },
      { type: "urgent", tekst: "Controleer of koningin aanwezig is en legt" },
      { type: "aandacht", tekst: "Verwijder muizenrooster als dat er nog op zit" },
      { type: "info", tekst: "Volk groeit snel — voeg extra ruimte toe als nodig" },
    ],
  },
  {
    naam: "April", seizoen: "lente",
    samenvatting: "Zwermseizoen begint. Wekelijkse inspecties zijn nu belangrijk.",
    taken: [
      { type: "urgent", tekst: "Wekelijks inspecteren op zwermcellen" },
      { type: "urgent", tekst: "Zwermseizoen — wees alert op zwermgedrag" },
      { type: "aandacht", tekst: "Geef extra ruimte: voeg een honingkamer toe" },
      { type: "info", tekst: "Eerste dracht begint — paardenbloem, fruitbomen" },
    ],
  },
  {
    naam: "Mei", seizoen: "lente",
    samenvatting: "Hoogtepunt van het zwermseizoen. Volk op z'n sterkst.",
    taken: [
      { type: "urgent", tekst: "Wekelijks inspecteren — zwermseizoen piek" },
      { type: "aandacht", tekst: "Controleer of honingkamers niet te vol raken" },
      { type: "aandacht", tekst: "Eventueel kunstzwerm maken om zwermgedrag te voorkomen" },
      { type: "info", tekst: "Tot 60.000+ bijen per volk — drukste periode" },
    ],
  },
  {
    naam: "Juni", seizoen: "zomer",
    samenvatting: "Eerste honingoogst mogelijk. Zomerdracht in volle gang.",
    taken: [
      { type: "aandacht", tekst: "Controleer of honingraten verzegeld zijn (>75% = rijp)" },
      { type: "info", tekst: "Eerste honingoogst mogelijk bij goede dracht" },
      { type: "info", tekst: "Zwermseizoen loopt af — minder frequent inspecteren" },
      { type: "aandacht", tekst: "Zorg voor water in de buurt van de kasten" },
    ],
  },
  {
    naam: "Juli", seizoen: "zomer",
    samenvatting: "Hoogtepunt van de honingoogst. Begin ook met varroa-monitoring.",
    taken: [
      { type: "urgent", tekst: "Honingoogst — slingerklaar maken" },
      { type: "urgent", tekst: "Varroa-telling uitvoeren (suikerrol of wasbodem)" },
      { type: "aandacht", tekst: "Na oogst: controleer voedselvoorraden" },
      { type: "info", tekst: "Dracht neemt af — volk begint te krimpen" },
    ],
  },
  {
    naam: "Augustus", seizoen: "zomer",
    samenvatting: "Varroa behandelen. Wintervoer geven. Kritieke maand.",
    taken: [
      { type: "urgent", tekst: "Varroa behandelen met mierenzuur of oxaalzuur" },
      { type: "urgent", tekst: "Begin met wintervoer geven (suikerwater 2:1)" },
      { type: "aandacht", tekst: "Vliegopening vernauwen — wespen willen honing stelen" },
      { type: "info", tekst: "Wintertoestand wordt nu bepaald — niet verwaarlozen" },
    ],
  },
  {
    naam: "September", seizoen: "herfst",
    samenvatting: "Wintervoer aanvullen. Volk bereidt zich voor op winter.",
    taken: [
      { type: "urgent", tekst: "Zorg dat volk minstens 15 kg voer heeft voor de winter" },
      { type: "aandacht", tekst: "Laatste inspectie: koningin aanwezig, voldoende bijen?" },
      { type: "aandacht", tekst: "Muizenrooster plaatsen" },
      { type: "info", tekst: "Darren worden het volk uitgedreven" },
    ],
  },
  {
    naam: "Oktober", seizoen: "herfst",
    samenvatting: "Volk krimpt. Laatste controles voor de winter.",
    taken: [
      { type: "aandacht", tekst: "Controleer of muizenrooster goed zit" },
      { type: "aandacht", tekst: "Eventueel oxaalzuur druppelen bij broedloos volk" },
      { type: "info", tekst: "Niet meer inspecteren — volk met rust laten" },
      { type: "info", tekst: "Materiaal reinigen en opslaan" },
    ],
  },
  {
    naam: "November", seizoen: "winter",
    samenvatting: "Winterrust begint. Handen af van de kasten.",
    taken: [
      { type: "info", tekst: "Bijen vormen wintertros — alleen van buiten controleren" },
      { type: "aandacht", tekst: "Zorg dat kasten niet omwaaien bij storm" },
      { type: "info", tekst: "Noteer je ervaringen en leer van het seizoen" },
      { type: "info", tekst: "Plan volgend seizoen: meer volken? Nieuwe locatie?" },
    ],
  },
  {
    naam: "December", seizoen: "winter",
    samenvatting: "Rust. Genieten van de honing en plannen maken voor volgend jaar.",
    taken: [
      { type: "info", tekst: "Kasten van buiten controleren op stormschade" },
      { type: "info", tekst: "Cursussen volgen, boeken lezen" },
      { type: "info", tekst: "Materiaal bestellen voor volgend seizoen" },
      { type: "info", tekst: "Genieten van je eigen honing 🍯" },
    ],
  },
];

const seizoenKleur = {
  winter: "from-blue-900 to-slate-900",
  lente: "from-green-800 to-emerald-900",
  zomer: "from-amber-800 to-orange-900",
  herfst: "from-orange-800 to-red-900",
};

const seizoenBadge = {
  winter: "bg-blue-100 text-blue-800",
  lente: "bg-green-100 text-green-800",
  zomer: "bg-amber-100 text-amber-800",
  herfst: "bg-orange-100 text-orange-800",
};

const taakKleur = {
  urgent: { dot: "bg-red-500", tekst: "text-red-700", label: "Urgent" },
  aandacht: { dot: "bg-amber-400", tekst: "text-amber-700", label: "Let op" },
  info: { dot: "bg-green-500", tekst: "text-green-700", label: "Info" },
};

export default function Kalender() {
  const huidigeMaand = new Date().getMonth();
  const [actief, setActief] = useState<number>(huidigeMaand);

  return (
    <div>
      {/* Legenda */}
      <div className="flex gap-4 flex-wrap mb-8 text-sm">
        {Object.entries(taakKleur).map(([type, stijl]) => (
          <div key={type} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${stijl.dot}`} />
            <span className="text-stone-600">{stijl.label}</span>
          </div>
        ))}
      </div>

      {/* Maand grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
        {maanden.map((m, i) => (
          <button
            key={i}
            onClick={() => setActief(i)}
            className={`rounded-xl py-3 px-2 text-sm font-bold transition-all text-center ${
              i === actief
                ? "bg-amber-900 text-white shadow-lg scale-105"
                : i === huidigeMaand
                ? "bg-amber-400 text-amber-900 shadow"
                : "bg-white text-stone-700 hover:bg-amber-50 shadow border border-stone-100"
            }`}
          >
            {m.naam.slice(0, 3)}
            {i === huidigeMaand && i !== actief && (
              <span className="block text-xs font-normal opacity-70">Nu</span>
            )}
          </button>
        ))}
      </div>

      {/* Detail kaart */}
      {(() => {
        const m = maanden[actief];
        return (
          <div className={`bg-gradient-to-br ${seizoenKleur[m.seizoen]} rounded-3xl overflow-hidden shadow-xl`}>
            <div className="p-8 text-white">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <div>
                  <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${seizoenBadge[m.seizoen]}`}>
                    {m.seizoen.charAt(0).toUpperCase() + m.seizoen.slice(1)}
                  </span>
                  <h3 className="text-4xl font-black mt-3">{m.naam}</h3>
                </div>
                {actief === huidigeMaand && (
                  <span className="bg-white/20 text-white text-sm font-bold px-4 py-2 rounded-full">
                    📅 Deze maand
                  </span>
                )}
              </div>
              <p className="text-white/80 text-lg leading-relaxed">{m.samenvatting}</p>
            </div>
            <div className="bg-white/10 p-8">
              <h4 className="text-white font-black mb-5 text-lg">Wat te doen</h4>
              <div className="space-y-3">
                {m.taken.map((taak, i) => {
                  const stijl = taakKleur[taak.type];
                  return (
                    <div key={i} className="flex items-start gap-3 bg-white/10 rounded-xl p-4">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${stijl.dot}`} />
                      <p className="text-white/90 leading-6 text-sm">{taak.tekst}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
