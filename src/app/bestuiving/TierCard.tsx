"use client";

import { useActionState, useState } from "react";
import SubmitButton from "@/components/SubmitButton";
import { createTierAanvraag, type AanvraagFormState } from "./actions";
import type { Tier } from "./tiers";

export default function TierCard({ tier }: { tier: Tier }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<AanvraagFormState, FormData>(
    createTierAanvraag.bind(null, tier.id, tier.doelgroep),
    undefined
  );

  return (
    <div className="bg-white rounded-2xl p-7 shadow border border-stone-100 flex flex-col gap-4">
      <div>
        <h3 className="text-xl font-black text-stone-900">{tier.titel}</h3>
        <p className="text-stone-500 text-sm mt-1">{tier.intro}</p>
      </div>

      <p className="text-stone-600 text-sm leading-6">{tier.beschrijving}</p>

      <ul className="space-y-1.5">
        {tier.punten.map((punt) => (
          <li key={punt} className="text-stone-600 text-sm leading-6 flex gap-2">
            <span className="text-amber-600 shrink-0">✓</span>
            {punt}
          </li>
        ))}
      </ul>

      {state && "success" in state ? (
        <p className="text-green-700 text-sm bg-green-50 border border-green-200 rounded-xl px-3 py-2 mt-1">
          Bedankt! We nemen binnen 2 werkdagen contact met je op.
        </p>
      ) : open ? (
        <form action={formAction} className="mt-1 space-y-3">
          <Field id={`${tier.id}-naam`} label="Naam" name="naam" required />
          <Field id={`${tier.id}-email`} label="E-mail" name="email" type="email" required />
          <Field id={`${tier.id}-telefoon`} label="Telefoon" name="telefoon" type="tel" />
          {tier.gewasVelden && (
            <>
              <Field id={`${tier.id}-gewas`} label="Gewas" name="gewas" />
              <Field
                id={`${tier.id}-oppervlakte`}
                label="Oppervlakte"
                name="oppervlakte"
                placeholder="bijv. 2 hectare"
              />
              <Field
                id={`${tier.id}-bloeiperiode`}
                label="Bloeiperiode"
                name="bloeiperiode"
                placeholder="bijv. april-mei"
              />
            </>
          )}
          <div>
            <label htmlFor={`${tier.id}-opmerking`} className="block text-sm font-bold text-stone-700 mb-1">
              Opmerking
            </label>
            <textarea
              id={`${tier.id}-opmerking`}
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
          <SubmitButton>{tier.ctaLabel} versturen</SubmitButton>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-1 bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors self-start"
        >
          {tier.ctaLabel} →
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
  placeholder,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
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
        placeholder={placeholder}
        className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
    </div>
  );
}
