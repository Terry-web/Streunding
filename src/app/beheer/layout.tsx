import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BeheerNav from "./BeheerNav";

export default async function BeheerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-stone-900 text-white pt-20 px-6 pb-20">
      <div className="max-w-5xl mx-auto py-12">
        <div className="mb-10">
          <p className="text-amber-400 font-mono text-sm mb-1">Streunding Beheer</p>
          <h1 className="text-4xl font-black">Beheer</h1>
        </div>

        <BeheerNav />

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
