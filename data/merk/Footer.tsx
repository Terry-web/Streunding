// merk/Footer.tsx  →  src/components/Footer.tsx
import Link from "next/link";
import { Korf } from "@/components/Logo";

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e1ad66] rounded-sm";

const links = [
  { href: "/blog", label: "Blog" },
  { href: "/informatief", label: "Informatief" },
  { href: "/kasten", label: "Kasten" },
  { href: "/honing", label: "Honing" },
  { href: "/over-mij", label: "Over mij" },
];

export default function Footer() {
  return (
    <footer className="bg-[#141312] px-6 py-10 text-[#8a8683]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <Link href="/" aria-label="Streunding Imkerij" className={`flex items-end gap-2.5 ${focus}`}>
          <Korf size={22} color="#e1ad66" className="mb-0.5 text-[#141312]" />
          <span
            className="text-[22px] italic leading-none text-[#f3f2f2]"
            style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
          >
            streunding
          </span>
        </Link>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px]">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`transition-colors hover:text-[#e1ad66] ${focus}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        <p className="text-[13px] tabular-nums">
          © {new Date().getFullYear()} Streunding Imkerij
        </p>
      </div>
    </footer>
  );
}
