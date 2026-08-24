"use client";

import { useState } from "react";
import DeleteButton from "@/components/DeleteButton";
import StatusBadge from "@/components/StatusBadge";
import { broodPatternLabels, temperamentLabels } from "@/lib/beheer/labels";
import { inspectionHealthStatus } from "@/lib/beheer/status";

type Inspection = {
  id: string;
  inspection_date: string;
  brood_pattern: string | null;
  temperament: string | null;
  queen_seen: boolean | null;
  frames_of_bees: number | null;
  frames_of_brood: number | null;
  notes: string | null;
};

const VISIBLE_DEFAULT = 5;

export default function InspectieLijst({
  inspections,
  deleteAction,
}: {
  inspections: Inspection[];
  deleteAction: (formData: FormData) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? inspections : inspections.slice(0, VISIBLE_DEFAULT);

  return (
    <div className="space-y-3 mb-6">
      {visible.map((i) => (
        <div key={i.id} className="bg-stone-800 rounded-2xl p-4 border border-stone-700">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-white">{i.inspection_date}</p>
                <StatusBadge status={inspectionHealthStatus(i.frames_of_bees)} />
              </div>
              <p className="text-stone-400 text-sm mt-1">
                {broodPatternLabels[i.brood_pattern ?? "not_assessed"] ?? i.brood_pattern}
                {" · "}
                {temperamentLabels[i.temperament ?? "normal"] ?? i.temperament}
                {i.frames_of_brood != null ? ` · ${i.frames_of_brood} ramen broed` : ""}
                {i.queen_seen ? " · koningin gezien" : ""}
              </p>
              {i.notes && <p className="text-stone-300 text-sm mt-2">{i.notes}</p>}
            </div>
            <form action={deleteAction}>
              <input type="hidden" name="id" value={i.id} />
              <DeleteButton confirmMessage="Deze inspectie verwijderen?" />
            </form>
          </div>
        </div>
      ))}

      {!showAll && inspections.length > VISIBLE_DEFAULT && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="text-amber-400 hover:underline text-sm font-bold"
        >
          Bekijk alle {inspections.length} inspecties
        </button>
      )}
    </div>
  );
}
