import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Beheer | Streunding" };

export default async function BeheerPage() {
  const supabase = await createClient();

  const [{ count: apiaryCount }, { count: hiveCount }, { count: colonyCount }] = await Promise.all([
    supabase.from("apiaries").select("*", { count: "exact", head: true }),
    supabase.from("hives").select("*", { count: "exact", head: true }),
    supabase.from("colonies").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Standplaatsen", value: apiaryCount ?? 0, icon: "📍", href: "/beheer/standplaatsen" },
    { label: "Kasten", value: hiveCount ?? 0, icon: "🪵", href: "/beheer/kasten" },
    { label: "Volken", value: colonyCount ?? 0, icon: "🐝", href: "/beheer/volken" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((s) => (
        <Link
          key={s.label}
          href={s.href}
          className="bg-stone-800 rounded-2xl p-5 border border-stone-700 hover:border-amber-500 transition-colors group"
        >
          <div className="text-2xl mb-2">{s.icon}</div>
          <div className="text-3xl font-black text-amber-400">{s.value}</div>
          <div className="text-stone-400 text-sm mt-1 group-hover:text-stone-200 transition-colors">
            {s.label}
          </div>
        </Link>
      ))}
    </div>
  );
}
