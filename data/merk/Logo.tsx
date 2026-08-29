// merk/Logo.tsx  →  src/components/Logo.tsx
// Merkteken is SVG (rieten korf), de naam is echte tekst in Cormorant italic.
// Tailwind v4 + de --font-heading / --font-body variabelen uit layout.tsx.

type Props = {
  /** "dark" op donkere ondergrond (de amber-900 nav, de footer), "light" op licht */
  tone?: "light" | "dark";
  /** hoogte van het merkteken in px */
  size?: number;
  /** de regel "IMKERIJ" met hairlines onder de naam */
  tagline?: boolean;
  className?: string;
};

const GOLD = { light: "#b68235", dark: "#e1ad66" } as const;
const INK = { light: "#201f1d", dark: "#f3f2f2" } as const;

export function Korf({
  size = 40,
  color = GOLD.light,
  className,
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 88"
      width={(size * 100) / 88}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className ?? ""}`}
    >
      <defs>
        <clipPath id="korf-riet">
          <path d="M6 82 C6 30 24 4 50 4 C76 4 94 30 94 82 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#korf-riet)" strokeWidth={2.4} opacity={0.75}>
        <path d="M-4 20 H104 M-4 33 H104 M-4 46 H104 M-4 59 H104 M-4 72 H104" />
      </g>
      <path d="M6 82 C6 30 24 4 50 4 C76 4 94 30 94 82 Z" />
      {/* vliegopening — dekt de rietbanden af */}
      <path d="M40 83 C40 70 60 70 60 83" fill="currentColor" stroke={color} />
    </svg>
  );
}

export default function Logo({ tone = "light", size = 40, tagline = false, className }: Props) {
  const gold = GOLD[tone];
  const ink = INK[tone];

  return (
    <span className={`inline-flex flex-col items-start gap-1.5 ${className ?? ""}`}>
      <span className="inline-flex items-end" style={{ gap: size * 0.34 }}>
        {/* currentColor vult de vliegopening met de ondergrondkleur */}
        <Korf size={size} color={gold} className={tone === "dark" ? "text-amber-900" : "text-[#f3f2f2]"} />
        <span
          className="italic leading-[0.95] tracking-[-0.02em]"
          style={{
            fontFamily: "var(--font-heading), Georgia, serif",
            fontSize: size * 1.2,
            color: ink,
          }}
        >
          streunding
        </span>
      </span>
      {tagline && (
        <span className="flex w-full items-center gap-3">
          <span className="h-px flex-1 opacity-55" style={{ background: gold }} />
          <span
            className="uppercase tracking-[0.24em]"
            style={{
              fontFamily: "var(--font-body), Georgia, serif",
              fontSize: Math.max(10, size * 0.24),
              color: gold,
            }}
          >
            Imkerij
          </span>
          <span className="h-px flex-1 opacity-55" style={{ background: gold }} />
        </span>
      )}
    </span>
  );
}
