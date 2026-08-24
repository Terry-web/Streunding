"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Point = {
  inspection_date: string;
  frames_of_brood: number | null;
  frames_of_bees: number | null;
};

export default function VolkOntwikkelingChart({ points }: { points: Point[] }) {
  if (points.length === 0) {
    return (
      <div className="bg-stone-800 rounded-2xl p-8 border border-stone-700 text-center text-stone-500 text-sm">
        Nog geen inspecties — de ontwikkeling verschijnt hier zodra er data is.
      </div>
    );
  }

  return (
    <div className="bg-stone-800 rounded-2xl p-4 pr-6 border border-stone-700 h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#44403c" />
          <XAxis dataKey="inspection_date" stroke="#a8a29e" fontSize={12} />
          <YAxis stroke="#a8a29e" fontSize={12} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: "#292524", border: "1px solid #44403c", borderRadius: 8 }}
            labelStyle={{ color: "#e7e5e4" }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="frames_of_brood"
            name="Ramen broed"
            stroke="#f59e0b"
            strokeWidth={2}
            connectNulls={false}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="frames_of_bees"
            name="Ramen bijen"
            stroke="#22c55e"
            strokeWidth={2}
            connectNulls={false}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
