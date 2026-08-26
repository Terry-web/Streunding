"use client";

import { useActionState, useState } from "react";
import SubmitButton from "@/components/SubmitButton";
import { createZakelijkeAanvraag, type AanvraagFormState } from "./actions";

export default function ZakelijkeAanvraag() {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<AanvraagFormState, FormData>(
    createZakelijkeAanvraag,
    undefined
  );

  return (
    <section className="max-w-3xl mx-auto px-6 pb-20">
      <div className="bg-white rounded-2xl p-8 shadow border border-stone-100">
        <h2 className="text-xl font-black text-stone-900">
          Bestuiving voor je bedrijf, boomgaard of teelt?
        </h2>
        <p className="text-stone-600 text-sm leading-6 mt-2">
          Grotere oppervlaktes of specifieke gewassen vragen om maatwerk — laat je gegevens
          achter, dan denken we mee over aantal volken en planning.
        </p>

        {state && "success" in state ? (
          <p className="text-green-700 text-sm bg-green-50 border border-green-200 rounded-xl px-3 py-2 mt-4">
            Bedankt! We nemen binnen 2 werkdagen contact met je op.
          </p>
        ) : open ? (
          <form action={formAction} className="mt-4 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field id="zk-naam" label="Naam" name="naam" required />
              <Field id="zk-email" label="E-mail" name="email" type="email" required />
              <Field id="zk-telefoon" label="Telefoon" name="telefoon" type="tel" />
              <Field id="zk-gewas" label="Gewas" name="gewas" />
              <Field id="zk-oppervlakte" label="Oppervlakte" name="oppervlakte" placeholder="bijv. 2 hectare" />
              <Field id="zk-bloeiperiode" label="Bloeiperiode" name="bloeiperiode" placeholder="bijv. april-mei" />
            </div>
            <div>
              <label htmlFor="zk-opmerking" className="block text-sm font-bold text-stone-700 mb-1">
                Opmerking
              </label>
              <textarea
                id="zk-opmerking"
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
            <SubmitButton>Adviesaanvraag versturen</SubmitButton>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-4 bg-stone-900 hover:bg-stone-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
          >
            Vraag advies aan
          </button>
        )}
      </div>
    </section>
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
