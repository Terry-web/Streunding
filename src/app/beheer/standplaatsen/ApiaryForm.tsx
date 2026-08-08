"use client";

import { useActionState } from "react";
import SubmitButton from "@/components/SubmitButton";
import { apiaryTypeLabels } from "@/lib/beheer/labels";
import type { ApiaryFormState } from "./actions";

type Apiary = {
  id: string;
  name: string;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  province: string | null;
  latitude: number | null;
  longitude: number | null;
  type: string | null;
  owner_permission: string | null;
  rvo_registration_number: string | null;
  max_hives: number | null;
  notes: string | null;
};

export default function ApiaryForm({
  apiary,
  action,
}: {
  apiary?: Apiary;
  action: (prevState: ApiaryFormState, formData: FormData) => Promise<ApiaryFormState>;
}) {
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form
      action={formAction}
      className="bg-white text-stone-800 rounded-2xl shadow border border-amber-100 p-7 space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Naam" name="name" required defaultValue={apiary?.name} />
        <SelectField label="Type" name="type" defaultValue={apiary?.type ?? "field"} options={apiaryTypeLabels} />
        <Field label="Adres" name="address" defaultValue={apiary?.address} />
        <Field label="Postcode" name="postal_code" defaultValue={apiary?.postal_code} />
        <Field label="Plaats" name="city" defaultValue={apiary?.city} />
        <Field label="Provincie" name="province" defaultValue={apiary?.province} />
        <Field label="Breedtegraad" name="latitude" type="number" step="any" defaultValue={apiary?.latitude} />
        <Field label="Lengtegraad" name="longitude" type="number" step="any" defaultValue={apiary?.longitude} />
        <Field
          label="Toestemming grondeigenaar"
          name="owner_permission"
          defaultValue={apiary?.owner_permission}
        />
        <Field
          label="I&R-registratienummer"
          name="rvo_registration_number"
          defaultValue={apiary?.rvo_registration_number}
        />
        <Field label="Max. aantal kasten" name="max_hives" type="number" defaultValue={apiary?.max_hives} />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-bold text-stone-700 mb-1">
          Notities
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={apiary?.notes ?? ""}
          className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      {state?.error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {state.error}
        </p>
      )}

      <SubmitButton>{apiary ? "Opslaan" : "Standplaats toevoegen"}</SubmitButton>
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
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number | null;
  step?: string;
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
        defaultValue={defaultValue ?? ""}
        className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: Record<string, string>;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-bold text-stone-700 mb-1">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
      >
        {Object.entries(options).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
