"use client";

import { useActionState } from "react";
import SubmitButton from "@/components/SubmitButton";
import { colonyStatusLabels } from "@/lib/beheer/labels";
import type { ColonyFormState } from "./actions";

type ApiaryOption = { id: string; name: string };
type HiveOption = { id: string; label: string };

type Colony = {
  id: string;
  name: string;
  apiary_id: string | null;
  hive_id: string | null;
  status: string | null;
  established_date: string | null;
  notes: string | null;
  is_public: boolean | null;
};

export default function ColonyForm({
  colony,
  apiaries,
  hives,
  action,
}: {
  colony?: Colony;
  apiaries: ApiaryOption[];
  hives: HiveOption[];
  action: (prevState: ColonyFormState, formData: FormData) => Promise<ColonyFormState>;
}) {
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form
      action={formAction}
      className="bg-white text-stone-800 rounded-2xl shadow border border-amber-100 p-7 space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-stone-700 mb-1">
            Naam *
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={colony?.name ?? ""}
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-bold text-stone-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={colony?.status ?? "active"}
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
          >
            {Object.entries(colonyStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="apiary_id" className="block text-sm font-bold text-stone-700 mb-1">
            Standplaats
          </label>
          <select
            id="apiary_id"
            name="apiary_id"
            defaultValue={colony?.apiary_id ?? ""}
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
          >
            <option value="">— Geen —</option>
            {apiaries.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="hive_id" className="block text-sm font-bold text-stone-700 mb-1">
            Kast
          </label>
          <select
            id="hive_id"
            name="hive_id"
            defaultValue={colony?.hive_id ?? ""}
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
          >
            <option value="">— Geen —</option>
            {hives.map((h) => (
              <option key={h.id} value={h.id}>
                {h.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="established_date" className="block text-sm font-bold text-stone-700 mb-1">
            Gevestigd op
          </label>
          <input
            id="established_date"
            name="established_date"
            type="date"
            defaultValue={colony?.established_date ?? ""}
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-bold text-stone-700 mb-1">
          Notities
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={colony?.notes ?? ""}
          className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-bold text-stone-700">
        <input
          type="checkbox"
          name="is_public"
          defaultChecked={colony?.is_public ?? false}
          className="rounded border-stone-300"
        />
        Toon in publiek dagboek (/dagboek)
      </label>

      {state?.error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {state.error}
        </p>
      )}

      <SubmitButton>{colony ? "Opslaan" : "Volk toevoegen"}</SubmitButton>
    </form>
  );
}
