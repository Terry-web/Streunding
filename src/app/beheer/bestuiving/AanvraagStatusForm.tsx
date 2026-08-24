"use client";

import { updateAanvraagStatus } from "./actions";

const statusOptions = ["nieuw", "bevestigd", "geleverd", "geannuleerd"];

export default function AanvraagStatusForm({ id, status }: { id: string; status: string }) {
  return (
    <form action={updateAanvraagStatus}>
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={status}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-lg border border-stone-300 text-sm px-2 py-1 bg-white text-stone-800 font-bold"
      >
        {statusOptions.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </form>
  );
}
