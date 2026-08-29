// merk/Hero.tsx  →  src/components/Hero.tsx
// De hero uit ronde 2a, als code. Server component — geen client JS nodig.
// Foto: zet je eigen bestand in public/ als /hero-kast.jpg (of pas src aan).

import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Hero() {
  return (
    <section className="bg-[#f3f2f2] pt-16 text-[#201f1d]">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] md:gap-16 md:py-28">

        <div className="flex flex-col items-start gap-6">
          <Logo size={26} />

          <h1
            className="text-5xl leading-[1.02] tracking-[-0.02em] md:text-[4rem]"
            style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 400 }}
          >
            Nog geen bijen.
            <br />
            Al wel de kasten.
          </h1>

          <div className="h-px w-full bg-[#201f1d]/15" />

          <p
            className="max-w-[42ch] text-lg leading-[1.65] text-[#4a4744] [hyphens:auto] md:text-justify"
            style={{ fontFamily: "var(--font-body), Georgia, serif" }}
          >
            Ik timmer, brouw en lees me een weg naar mijn eerste volk. Alles wat
            ik onderweg leer — en misluk — staat hier.
          </p>

          <div className="mt-1 flex flex-wrap gap-3">
            <Link
              href="/blog"
              className="rounded border border-[#b68235] px-6 py-3 text-base tracking-[0.06em] text-[#7d5411] transition-colors hover:bg-[#b68235]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68235]"
              style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 600 }}
            >
              Lees mijn verhalen
            </Link>
            <Link
              href="/kasten"
              className="rounded border border-[#201f1d]/20 px-6 py-3 text-base tracking-[0.06em] text-[#605d5d] transition-colors hover:border-[#201f1d]/40 hover:text-[#201f1d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68235]"
              style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 600 }}
            >
              De kasten
            </Link>
          </div>
        </div>

        {/* de plaat: foto in een dunne mat, warme archiefgrade */}
        <figure className="m-0 border-[6px] border-[#eae9e9] outline outline-1 outline-[#201f1d]/15">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src="/hero-kast.jpg"
              alt="Bijen bij de vliegopening van de kast"
              fill
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover [filter:sepia(0.22)_saturate(0.82)_contrast(1.05)]"
            />
          </div>
        </figure>

      </div>
    </section>
  );
}
