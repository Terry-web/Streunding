"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import { colonyStatusLabels } from "@/lib/beheer/labels";

export type ColonyStatusRow = {
  colony_id: string;
  colony_name: string;
  colony_status: string | null;
  apiary: string | null;
  hive_label: string | null;
  queen_birth_year: number | null;
  last_inspection_date: string | null;
  status: string | null;
};

type SortKey = "colony_name" | "apiary" | "hive_label" | "queen_birth_year" | "last_inspection_date" | "status";

const columns: { key: SortKey; label: string }[] = [
  { key: "colony_name", label: "Volk" },
  { key: "apiary", label: "Standplaats" },
  { key: "hive_label", label: "Kast" },
  { key: "queen_birth_year", label: "Koningin-jaar" },
  { key: "last_inspection_date", label: "Laatste inspectie" },
  { key: "status", label: "Status" },
];

export default function VolkenTable({ rows }: { rows: ColonyStatusRow[] }) {
  const router = useRouter();
  const [sortKey, setSortKey] = useState<SortKey>("colony_name");
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ? 1 : -1;
      return 0;
    });
    return copy;
  }, [rows, sortKey, sortAsc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortAsc((v) => !v);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-stone-400 border-b border-stone-700">
            {columns.map((c) => (
              <th
                key={c.key}
                onClick={() => toggleSort(c.key)}
                className="py-2 pr-4 font-bold uppercase tracking-wide text-xs cursor-pointer select-none hover:text-stone-200"
              >
                {c.label}
                {sortKey === c.key && (sortAsc ? " ↑" : " ↓")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr
              key={r.colony_id}
              onClick={() => router.push(`/beheer/volken/${r.colony_id}`)}
              className="border-b border-stone-800 hover:bg-stone-800/60 cursor-pointer transition-colors"
            >
              <td className="py-3 pr-4 font-bold text-white">
                {r.colony_name}
                <div className="text-stone-500 text-xs font-normal mt-0.5">
                  {colonyStatusLabels[r.colony_status ?? "active"] ?? r.colony_status}
                </div>
              </td>
              <td className="py-3 pr-4 text-stone-300">{r.apiary ?? "—"}</td>
              <td className="py-3 pr-4 text-stone-300">{r.hive_label ?? "—"}</td>
              <td className="py-3 pr-4 text-stone-300">{r.queen_birth_year ?? "—"}</td>
              <td className="py-3 pr-4 text-stone-300">{r.last_inspection_date ?? "—"}</td>
              <td className="py-3 pr-4">
                <StatusBadge status={r.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
