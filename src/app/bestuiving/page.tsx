import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import AanbodCard from "./AanbodCard";
import TierCard from "./TierCard";
import { tiers } from "./tiers";

export const metadata: Metadata = {
  title: "Bestuiving",
  description: "Bestuiving op maat voor jouw tuin, boomgaard of teelt — vraag het aan.",
};

export default async function Bestuiving() {
  const supabase = await createClient();
  const { data: aanbod } = await supabase
    .from("bestuifvolk_aanbod")
    .select("*")
    .eq("actief", true)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-amber-50 text-stone-800">

      {/* Hero */}
      <section className="relative pt-16 min-h-[45vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-800 via-yellow-800 to-orange-900">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="honeycomb" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse">
                <polygon points="28,2 54,17 54,47 28,62 2,47 2,17" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
                <polygon points="28,52 54,67 54,97 28,112 2,97 2,67" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#honeycomb)"/>
          </svg>
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto py-24">
          <div className="text-6xl mb-6">🐝</div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 leading-none">
            Bestuif<span className="text-amber-400">volken</span>
          </h1>
          <p className="text-lg text-amber-200 max-w-xl mx-auto leading-relaxed">
            Bestuiving nodig voor je tuin, boomgaard of teelt? Laat je gegevens achter — je krijgt
            binnen 2 werkdagen bericht.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tiers.map((tier) => (
            <TierCard key={tier.id} tier={tier} />
          ))}
        </div>
      </section>

      {/* Actueel aanbod */}
      {aanbod && aanbod.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <h2 className="text-lg font-black text-stone-400 uppercase tracking-widest mb-6">
            Direct beschikbaar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aanbod.map((a) => (
              <AanbodCard key={a.id} aanbod={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
