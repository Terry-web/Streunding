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
    <div className="bg-white rounded-2xl p-7 shadow border border-stone-100 flex flex-col gap-3">
      <h3 className="text-xl font-black text-stone-900">{aanbod.naam}</h3>
      <p className="text-stone-500 text-sm leading-6">
        {[aanbod.ras, aanbod.omvang, aanbod.regio].filter(Boolean).join(" · ") || "—"}
      </p>
      {aanbod.beschrijving && <p className="text-stone-600 text-sm leading-6">{aanbod.beschrijving}</p>}

      <div className="flex items-center justify-between mt-2">
        <span className="text-2xl font-black text-amber-700">
          {aanbod.prijs != null ? `€${aanbod.prijs}` : "Prijs op aanvraag"}
        </span>
        {!besteldbaar && (
          <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-full px-2 py-1">
            {uitverkocht ? "Uitverkocht" : "Seizoen voorbij"}
          </span>
        )}
      </div>

      {state && "success" in state ? (
        <p className="text-green-700 text-sm bg-green-50 border border-green-200 rounded-xl px-3 py-2 mt-2">
          Bedankt! We nemen binnen 2 werkdagen contact met je op.
        </p>
      ) : open ? (
        <form action={formAction} className="mt-2 space-y-3">
          <Field id={`${aanbod.id}-naam`} label="Naam" name="naam" required />
          <Field id={`${aanbod.id}-email`} label="E-mail" name="email" type="email" required />
          <Field id={`${aanbod.id}-telefoon`} label="Telefoon" name="telefoon" type="tel" />
          <Field id={`${aanbod.id}-aantal`} label="Aantal" name="aantal" type="number" defaultValue={1} />
          <Field
            id={`${aanbod.id}-leverdatum`}
            label="Gewenste leverdatum"
            name="gewenste_leverdatum"
            type="date"
          />
          <div>
            <label htmlFor={`${aanbod.id}-opmerking`} className="block text-sm font-bold text-stone-700 mb-1">
              Opmerking
            </label>
            <textarea
              id={`${aanbod.id}-opmerking`}
              name="opmerking"
              rows={2}
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          {state && "error" in state && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {state.error}
            </p>
          )}
          <SubmitButton>Aanvraag versturen</SubmitButton>
        </form>
      ) : (
        <button
          type="button"
          disabled={!besteldbaar}
          onClick={() => setOpen(true)}
          className="mt-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          Bestel je bestuifvolk
        </button>
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
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-stone-700 mb-1">
        {label}
        {required && " *"}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
    </div>
  );
}
