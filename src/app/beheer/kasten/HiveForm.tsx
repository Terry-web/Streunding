"use client";

import { useActionState } from "react";
import SubmitButton from "@/components/SubmitButton";
import { hiveTypeLabels } from "@/lib/beheer/labels";
import type { HiveFormState } from "./actions";

type Hive = {
  id: string;
  label: string;
  type: string | null;
  frame_count: number | null;
  box_count: number | null;
  purchase_date: string | null;
  condition: string | null;
  in_use: boolean | null;
  notes: string | null;
  is_public: boolean | null;
};

export default function HiveForm({
  hive,
  action,
}: {
  hive?: Hive;
  action: (prevState: HiveFormState, formData: FormData) => Promise<HiveFormState>;
}) {
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form
      action={formAction}
      className="bg-white text-stone-800 rounded-2xl shadow border border-amber-100 p-7 space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Naam/nummer" name="label" required defaultValue={hive?.label} />
        <SelectField label="Type" name="type" defaultValue={hive?.type ?? "dadant"} options={hiveTypeLabels} />
        <Field label="Aantal ramen" name="frame_count" type="number" defaultValue={hive?.frame_count} />
        <Field label="Aantal kasten hoog" name="box_count" type="number" defaultValue={hive?.box_count ?? 1} />
        <Field label="Aankoopdatum" name="purchase_date" type="date" defaultValue={hive?.purchase_date} />
        <Field label="Conditie" name="condition" defaultValue={hive?.condition} />
      </div>

      <label className="flex items-center gap-2 text-sm font-bold text-stone-700">
        <input
          type="checkbox"
          name="in_use"
          defaultChecked={hive?.in_use ?? true}
          className="rounded border-stone-300 text-amber-600 focus:ring-amber-400"
        />
        In gebruik
      </label>

      <label className="flex items-center gap-2 text-sm font-bold text-stone-700">
        <input
          type="checkbox"
          name="is_public"
          defaultChecked={hive?.is_public ?? false}
          className="rounded border-stone-300 text-amber-600 focus:ring-amber-400"
        />
        Toon op publieke /kasten-pagina
      </label>

      <div>
        <label htmlFor="notes" className="block text-sm font-bold text-stone-700 mb-1">
          Notities
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={hive?.notes ?? ""}
          className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      {state?.error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {state.error}
        </p>
      )}

      <SubmitButton>{hive ? "Opslaan" : "Kast toevoegen"}</SubmitButton>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number | null;
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
