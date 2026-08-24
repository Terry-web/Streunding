"use client";

import { useActionState } from "react";
import SubmitButton from "@/components/SubmitButton";
import type { AanbodFormState } from "./actions";

type Aanbod = {
  id: string;
  naam: string;
  ras: string | null;
  omvang: string | null;
  prijs: number | null;
  beschikbaar_vanaf: string | null;
  beschikbaar_tot: string | null;
  voorraad: number;
  regio: string | null;
  beschrijving: string | null;
  actief: boolean;
};

export default function AanbodForm({
  aanbod,
  action,
}: {
  aanbod?: Aanbod;
  action: (prevState: AanbodFormState, formData: FormData) => Promise<AanbodFormState>;
}) {
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form
      action={formAction}
      className="bg-white text-stone-800 rounded-2xl shadow border border-amber-100 p-7 space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Naam" name="naam" required defaultValue={aanbod?.naam} />
        <Field label="Ras" name="ras" defaultValue={aanbod?.ras} />
        <Field label="Omvang" name="omvang" defaultValue={aanbod?.omvang} placeholder="bv. 5-raams" />
        <Field label="Prijs (€)" name="prijs" type="number" step="0.01" defaultValue={aanbod?.prijs} />
        <Field
          label="Beschikbaar vanaf"
          name="beschikbaar_vanaf"
          type="date"
          defaultValue={aanbod?.beschikbaar_vanaf}
        />
        <Field
          label="Beschikbaar tot"
          name="beschikbaar_tot"
          type="date"
          defaultValue={aanbod?.beschikbaar_tot}
        />
        <Field
          label="Voorraad"
          name="voorraad"
          type="number"
          defaultValue={aanbod?.voorraad ?? 0}
        />
        <Field label="Regio" name="regio" defaultValue={aanbod?.regio} placeholder="bv. Oldambt/Westerwolde" />
      </div>

      <div>
        <label htmlFor="beschrijving" className="block text-sm font-bold text-stone-700 mb-1">
          Beschrijving
        </label>
        <textarea
          id="beschrijving"
          name="beschrijving"
          rows={3}
          defaultValue={aanbod?.beschrijving ?? ""}
          className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-bold text-stone-700">
        <input
          type="checkbox"
          name="actief"
          defaultChecked={aanbod?.actief ?? true}
          className="rounded border-stone-300"
        />
        Actief (zichtbaar op de publieke pagina)
      </label>

      {state?.error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {state.error}
        </p>
      )}

      <SubmitButton>{aanbod ? "Opslaan" : "Aanbod toevoegen"}</SubmitButton>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  step,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number | null;
  step?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-bold text-stone-700 mb-1">
        {label}
        {required && " *"}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        step={step}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
    </div>
  );
}
