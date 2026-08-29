// merk/bestuiving/AanbodCard.tsx  →  src/app/bestuiving/AanbodCard.tsx
"use client";

import { useActionState, useState } from "react";
import SubmitButton from "@/components/SubmitButton";
import { createAanvraag, type AanvraagFormState } from "./actions";

type Aanbod = {
  id: string;
  naam: string;
  ras: string | null;
  omvang: string | null;
  prijs: number | null;
  beschikbaar_tot: string | null;
  voorraad: number;
  regio: string | null;
  beschrijving: string | null;
};

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68235] rounded-sm";

const heading = { fontFamily: "var(--font-heading), Georgia, serif" } as const;

export default function AanbodCard({ aanbod }: { aanbod: Aanbod }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<AanvraagFormState, FormData>(
    createAanvraag.bind(null, aanbod.id),
    undefined
  );

  const uitverkocht = aanbod.voorraad <= 0;
  const seizoenVoorbij = !!aanbod.beschikbaar_tot && new Date(aanbod.beschikbaar_tot) < new Date();
  const besteldbaar = !uitverkocht && !seizoenVoorbij;

  return (
    <div
      className={`flex flex-col gap-3.5 rounded border border-[#201f1d]/15 bg-[#f6f5f4] p-7 ${
        besteldbaar ? "" : "opacity-55"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-[1.55rem] leading-[1.1]" style={{ ...heading, fontWeight: 600 }}>
          {aanbod.naam}
        </h3>
        {!besteldbaar && (
          <span className="shrink-0 rounded-sm border border-[#201f1d]/25 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-[#605d5d]">
            {uitverkocht ? "Uitverkocht" : "Seizoen voorbij"}
          </span>
        )}
      </div>

      <p className="text-[13px] tracking-[0.05em] text-[#605d5d]">
        {[aanbod.ras, aanbod.omvang, aanbod.regio].filter(Boolean).join(" · ") || "—"}
      </p>

      <span className="h-px bg-[#201f1d]/15" />

      {aanbod.beschrijving && (
        <p className="text-sm leading-[1.65] text-[#4a4744]">{aanbod.beschrijving}</p>
      )}

      {state && "success" in state ? (
        <p className="mt-2 border-l-2 border-[#b68235] bg-[#b68235]/8 px-4 py-3 text-sm leading-[1.6] text-[#7d5411]">
          Bedankt — je aanvraag staat er. Je krijgt binnen 2 werkdagen bericht.
        </p>
      ) : open ? (
        <form action={formAction} className="mt-2 flex flex-col gap-4">
          <Field id={`${aanbod.id}-naam`} label="Naam" name="naam" required />
          <Field id={`${aanbod.id}-email`} label="E-mail" name="email" type="email" required />
          <Field id={`${aanbod.id}-telefoon`} label="Telefoon" name="telefoon" type="tel" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id={`${aanbod.id}-aantal`} label="Aantal" name="aantal" type="number" defaultValue={1} />
            <Field
              id={`${aanbod.id}-leverdatum`}
              label="Leverdatum"
              name="gewenste_leverdatum"
              type="date"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`${aanbod.id}-opmerking`}
              className="text-xs uppercase tracking-[0.14em] text-[#605d5d]"
            >
              Opmerking
            </label>
            <textarea
              id={`${aanbod.id}-opmerking`}
              name="opmerking"
              rows={2}
              className="w-full rounded border border-[#201f1d]/20 bg-[#fdfcfc] px-3.5 py-2.5 text-[15px] leading-[1.6] focus:border-[#b68235] focus:outline-none focus:ring-2 focus:ring-[#b68235]/20"
            />
          </div>
          {state && "error" in state && (
            <p className="border-l-2 border-[#8c2f2f] bg-[#8c2f2f]/6 px-4 py-3 text-sm text-[#8c2f2f]">
              {state.error}
            </p>
          )}
          <SubmitButton>Aanvraag versturen</SubmitButton>
        </form>
      ) : (
        <div className="mt-auto flex items-baseline justify-between gap-4 pt-2">
          <span className="text-[2.125rem] leading-none tabular-nums" style={heading}>
            {aanbod.prijs != null ? `€ ${aanbod.prijs}` : "Op aanvraag"}
          </span>
          <button
            type="button"
            disabled={!besteldbaar}
            onClick={() => setOpen(true)}
            className={`shrink-0 rounded border border-[#b68235] px-4 py-2.5 text-sm tracking-[0.06em] text-[#7d5411] transition-colors hover:bg-[#b68235]/10 disabled:cursor-not-allowed disabled:border-[#201f1d]/25 disabled:text-[#a3a09e] disabled:hover:bg-transparent ${focus}`}
            style={{ ...heading, fontWeight: 600 }}
          >
            Aanvragen
          </button>
        </div>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  name,
  type = "text",
  required,
  defaultValue,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs uppercase tracking-[0.14em] text-[#605d5d]">
        {label}
        {required && " *"}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded border border-[#201f1d]/20 bg-[#fdfcfc] px-3.5 py-2.5 text-[15px] focus:border-[#b68235] focus:outline-none focus:ring-2 focus:ring-[#b68235]/20"
      />
    </div>
  );
}
