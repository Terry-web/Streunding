"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/beheer", label: "Overzicht" },
  { href: "/beheer/standplaatsen", label: "Standplaatsen" },
  { href: "/beheer/kasten", label: "Kasten" },
  { href: "/beheer/volken", label: "Volken" },
];

export default function BeheerNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 border-b border-stone-700 overflow-x-auto">
      {tabs.map((t) => {
        const active = t.href === "/beheer" ? pathname === "/beheer" : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`px-4 py-2.5 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
              active
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
