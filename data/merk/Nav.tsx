// merk/Nav.tsx  →  src/components/Nav.tsx  (vervangt de amber-900 balk)
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/app/login/actions";
import Logo from "@/components/Logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/informatief", label: "Informatief" },
  { href: "/kalender", label: "Kalender" },
  { href: "/dagboek", label: "Dagboek" },
  { href: "/kasten", label: "Kasten" },
  { href: "/honing", label: "Honing" },
  { href: "/bestuiving", label: "Bestuiving" },
  { href: "/over-mij", label: "Over mij" },
];

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68235] rounded-sm";

export default function Nav({ userEmail }: { userEmail: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navLinks = userEmail ? [...links, { href: "/beheer", label: "Beheer" }] : links;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#201f1d]/15 bg-[#f3f2f2]/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-[82px] max-w-6xl items-center justify-between gap-8 px-6">
        <Link
          href="/"
          aria-label="Streunding Imkerij — naar de homepage"
          onClick={() => setOpen(false)}
          className={`transition-opacity hover:opacity-75 ${focus}`}
        >
          <Logo size={28} />
        </Link>

        {/* Desktop */}
        <ul className="hidden items-center gap-6 text-[13px] tracking-[0.045em] text-[#4a4744] lg:flex">
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`pb-1 transition-colors ${focus} ${
                    active
                      ? "border-b border-[#b68235] text-[#201f1d]"
                      : "border-b border-transparent hover:border-[#b68235]/50 hover:text-[#201f1d]"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
          <li className="border-l border-[#201f1d]/15 pl-6">
            {userEmail ? (
              <form action={signOut}>
                <button type="submit" className={`text-[#605d5d] transition-colors hover:text-[#201f1d] ${focus}`}>
                  Uitloggen
                </button>
              </form>
            ) : (
              <Link href="/login" className={`text-[#605d5d] transition-colors hover:text-[#201f1d] ${focus}`}>
                Inloggen
              </Link>
            )}
          </li>
        </ul>

        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobiel-menu"
          aria-label={open ? "Menu sluiten" : "Menu openen"}
          className={`flex flex-col gap-1.5 p-2 lg:hidden ${focus}`}
        >
          <span className={`block h-px w-6 bg-[#201f1d] transition-all duration-300 ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-px w-6 bg-[#201f1d] transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block h-px w-6 bg-[#201f1d] transition-all duration-300 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* Mobiel menu */}
      {open && (
        <div id="mobiel-menu" className="border-t border-[#201f1d]/15 bg-[#f3f2f2] px-6 py-5 lg:hidden">
          <ul className="flex flex-col text-[15px]">
            {navLinks.map((l) => (
              <li key={l.href} className="border-b border-[#201f1d]/10 last:border-0">
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === l.href ? "page" : undefined}
                  className={`block py-3 transition-colors ${focus} ${
                    pathname === l.href ? "text-[#7d5411]" : "text-[#4a4744] hover:text-[#201f1d]"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-[#201f1d]/15 pt-1">
              {userEmail ? (
                <form action={signOut}>
                  <button
                    type="submit"
                    onClick={() => setOpen(false)}
                    className={`py-3 text-[#605d5d] transition-colors hover:text-[#201f1d] ${focus}`}
                  >
                    Uitloggen
                  </button>
                </form>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={`block py-3 text-[#605d5d] transition-colors hover:text-[#201f1d] ${focus}`}
                >
                  Inloggen
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
