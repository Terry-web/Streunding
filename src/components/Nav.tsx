"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/informatief", label: "Informatief" },
  { href: "/kalender", label: "Kalender" },
  { href: "/dagboek", label: "Dagboek" },
  { href: "/kasten", label: "Kasten" },
  { href: "/recepten", label: "Recepten" },
  { href: "/honing", label: "Honing" },
  { href: "/over-mij", label: "Over mij" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-amber-900/95 backdrop-blur-sm text-amber-50 shadow-lg">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight flex items-center gap-2 hover:text-amber-300 transition-colors" onClick={() => setOpen(false)}>
          🐝 <span>Streunding</span>
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex gap-8 text-sm font-medium">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={pathname === l.href ? "text-amber-400" : "hover:text-amber-300 transition-colors"}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-amber-50 transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-amber-50 transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-amber-50 transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobiel menu */}
      {open && (
        <div className="md:hidden bg-amber-950 border-t border-amber-800 px-6 py-4">
          <ul className="flex flex-col gap-4 text-sm font-medium">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={pathname === l.href ? "text-amber-400 font-bold" : "text-amber-100 hover:text-amber-300 transition-colors"}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
