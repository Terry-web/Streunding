import Link from "next/link";

export type DashboardStats = {
  totaal_volken: number;
  actieve_kasten: number;
  koninginnen_gemiddelde_leeftijd: number | null;
  honing_dit_seizoen_kg: number;
  kasten_aandacht: number;
};

function Card({
  icon,
  value,
  label,
  href,
  highlight,
}: {
  icon: string;
  value: React.ReactNode;
  label: string;
  href?: string;
  highlight?: boolean;
}) {
  const className = `bg-stone-800 rounded-2xl p-5 border ${
    highlight ? "border-amber-600" : "border-stone-700"
  } ${href ? "hover:border-amber-500 transition-colors group" : ""}`;

  const content = (
    <>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-3xl font-black text-amber-400">{value}</div>
      <div
        className={`text-stone-400 text-sm mt-1 ${href ? "group-hover:text-stone-200 transition-colors" : ""}`}
      >
        {label}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

export default function DashboardStatsGrid({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card icon="🐝" value={stats.totaal_volken} label="Volken" href="/beheer/volken" />
      <Card icon="🏠" value={stats.actieve_kasten} label="Actieve kasten" href="/beheer/kasten" />
      <Card
        icon="👑"
        value={
          stats.koninginnen_gemiddelde_leeftijd != null
            ? `${stats.koninginnen_gemiddelde_leeftijd} jr`
            : "—"
        }
        label="Gem. koninginleeftijd"
      />
      <Card icon="🍯" value={`${stats.honing_dit_seizoen_kg} kg`} label="Honing dit seizoen" />
      <Card
        icon="⚠️"
        value={stats.kasten_aandacht}
        label="Aandacht nodig"
        href="/beheer/volken?status=aandacht"
        highlight={stats.kasten_aandacht > 0}
      />
      <Link
        href="/beheer/volken"
        className="bg-stone-800 rounded-2xl p-5 border border-stone-700 hover:border-amber-500 transition-colors group flex flex-col justify-center"
      >
        <div className="text-2xl mb-2">📈</div>
        <div className="text-stone-200 font-bold group-hover:text-amber-400 transition-colors">
          Ontwikkeling bekijken
        </div>
      </Link>
    </div>
  );
}
