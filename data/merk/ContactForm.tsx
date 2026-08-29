// merk/ContactForm.tsx  →  src/components/ContactForm.tsx
// Zelfde mailto-gedrag, alleen de opmaak volgt nu het merk.
"use client";
import { useState } from "react";

const heading = { fontFamily: "var(--font-heading), Georgia, serif" } as const;

const veld =
  "w-full rounded border border-[#201f1d]/20 bg-[#fdfcfc] px-3.5 py-2.5 text-[15px] leading-[1.6] placeholder:text-[#a3a09e] focus:border-[#b68235] focus:outline-none focus:ring-2 focus:ring-[#b68235]/20";

export default function ContactForm() {
  const [naam, setNaam] = useState("");
  const [bericht, setBericht] = useState("");
  const [verzonden, setVerzonden] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:terry@streunding.nl?subject=Bericht van ${encodeURIComponent(
      naam
    )}&body=${encodeURIComponent(bericht)}`;
    setVerzonden(true);
  };

  if (verzonden) {
    return (
      <div className="flex flex-col gap-3 border-l-2 border-[#b68235] bg-[#b68235]/8 px-5 py-5">
        <p className="m-0 text-[1.5rem] leading-tight" style={heading}>
          Je bericht staat klaar
        </p>
        <p className="m-0 text-[15px] leading-[1.65] text-[#4a4744]">
          Je e-mailprogramma is geopend met je bericht erin — stuur het daar even af.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-naam" className="text-xs uppercase tracking-[0.14em] text-[#605d5d]">
          Jouw naam *
        </label>
        <input
          id="contact-naam"
          type="text"
          required
          value={naam}
          onChange={(e) => setNaam(e.target.value)}
          placeholder="Jan de Imker"
          className={veld}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-bericht" className="text-xs uppercase tracking-[0.14em] text-[#605d5d]">
          Jouw bericht *
        </label>
        <textarea
          id="contact-bericht"
          required
          value={bericht}
          onChange={(e) => setBericht(e.target.value)}
          placeholder="Hallo Terry, ik had een vraag over…"
          rows={5}
          className={`${veld} resize-none`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          className="rounded border border-[#b68235] px-6 py-3 text-base tracking-[0.06em] text-[#7d5411] transition-colors hover:bg-[#b68235]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68235]"
          style={{ ...heading, fontWeight: 600 }}
        >
          Bericht versturen
        </button>
        <span className="text-[13px] text-[#605d5d]">
          Opent je e-mailprogramma met je bericht ingevuld.
        </span>
      </div>
    </form>
  );
}
