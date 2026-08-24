const statusConfig: Record<string, { emoji: string; label: string; className: string }> = {
  goed: {
    emoji: "🟢",
    label: "Goed",
    className: "bg-green-500/10 text-green-400 border-green-500/30",
  },
  controleren: {
    emoji: "🟠",
    label: "Controleren",
    className: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  },
  aandacht: {
    emoji: "🔴",
    label: "Aandacht",
    className: "bg-red-500/10 text-red-400 border-red-500/30",
  },
  onbekend: {
    emoji: "⚪",
    label: "Onbekend",
    className: "bg-stone-500/10 text-stone-400 border-stone-500/30",
  },
};

export default function StatusBadge({ status }: { status: string | null }) {
  const config = statusConfig[status ?? "onbekend"] ?? statusConfig.onbekend;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border whitespace-nowrap ${config.className}`}
    >
      {config.emoji} {config.label}
    </span>
  );
}
