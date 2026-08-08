"use client";

import { useActionState } from "react";
import SubmitButton from "@/components/SubmitButton";
import { broodPatternLabels, temperamentLabels } from "@/lib/beheer/labels";
import type { InspectionFormState } from "./actions";

export default function InspectionForm({
  action,
}: {
  action: (prevState: InspectionFormState, formData: FormData) => Promise<InspectionFormState>;
}) {
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form
      action={formAction}
      className="bg-white text-stone-800 rounded-2xl shadow border border-amber-100 p-7 space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="inspection_date" className="block text-sm font-bold text-stone-700 mb-1">
            Datum
          </label>
          <input
            id="inspection_date"
            name="inspection_date"
            type="date"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label htmlFor="weather" className="block text-sm font-bold text-stone-700 mb-1">
            Weer
          </label>
          <input
            id="weather"
            name="weather"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label htmlFor="brood_pattern" className="block text-sm font-bold text-stone-700 mb-1">
            Broedpatroon
          </label>
          <select
            id="brood_pattern"
            name="brood_pattern"
            defaultValue="not_assessed"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
          >
            {Object.entries(broodPatternLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="temperament" className="block text-sm font-bold text-stone-700 mb-1">
            Temperament
          </label>
          <select
            id="temperament"
            name="temperament"
            defaultValue="normal"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
          >
            {Object.entries(temperamentLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="frames_of_bees" className="block text-sm font-bold text-stone-700 mb-1">
            Ramen met bijen
          </label>
          <input
            id="frames_of_bees"
            name="frames_of_bees"
            type="number"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label htmlFor="frames_of_brood" className="block text-sm font-bold text-stone-700 mb-1">
            Ramen met broed
          </label>
          <input
            id="frames_of_brood"
            name="frames_of_brood"
            type="number"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label htmlFor="honey_stores" className="block text-sm font-bold text-stone-700 mb-1">
            Honingvoorraad
          </label>
          <input
            id="honey_stores"
            name="honey_stores"
            placeholder="laag / gemiddeld / hoog"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label htmlFor="pollen_stores" className="block text-sm font-bold text-stone-700 mb-1">
            Stuifmeelvoorraad
          </label>
          <input
            id="pollen_stores"
            name="pollen_stores"
            placeholder="laag / gemiddeld / hoog"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label htmlFor="varroa_count" className="block text-sm font-bold text-stone-700 mb-1">
            Mijtenval
          </label>
          <input
            id="varroa_count"
            name="varroa_count"
            type="number"
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <Checkbox name="queen_seen" label="Koningin gezien" />
        <Checkbox name="eggs_seen" label="Eitjes gezien" />
        <Checkbox name="swarm_cells_seen" label="Zwermcellen gezien" />
        <Checkbox name="queen_cells_seen" label="Weiselcellen gezien" />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-bold text-stone-700 mb-1">
          Notities
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      {state?.error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {state.error}
        </p>
      )}

      <SubmitButton>Inspectie toevoegen</SubmitButton>
    </form>
  );
}

function Checkbox({ name, label }: { name: string; label: string }) {
  return (
    <label className="flex items-center gap-2 text-sm font-bold text-stone-700">
      <input
        type="checkbox"
        name={name}
        className="rounded border-stone-300 text-amber-600 focus:ring-amber-400"
      />
      {label}
    </label>
  );
}
