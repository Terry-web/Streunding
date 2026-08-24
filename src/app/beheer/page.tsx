import { createClient } from "@/lib/supabase/server";
import DashboardStatsGrid, { type DashboardStats } from "./DashboardStatsGrid";

export const metadata = { title: "Beheer | Streunding" };

export default async function BeheerPage() {
  const supabase = await createClient();
  const { data: stats, error } = await supabase.rpc("get_dashboard_stats");

  if (error || !stats) {
    return (
      <div className="bg-stone-800 rounded-2xl p-5 border border-stone-700 text-stone-400 text-sm">
        Kon dashboardstatistieken niet laden.
        {error && <p className="mt-1 text-stone-500">{error.message}</p>}
      </div>
    );
  }

  return <DashboardStatsGrid stats={stats as DashboardStats} />;
}
