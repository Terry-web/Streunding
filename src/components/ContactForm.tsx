"use client";
import { useState } from "react";

export default function ContactForm() {
  const [naam, setNaam] = useState("");
  const [bericht, setBericht] = useState("");
  const [verzonden, setVerzonden] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:terry@streunding.nl?subject=Bericht van ${encodeURIComponent(naam)}&body=${encodeURIComponent(bericht)}`;
    setVerzonden(true);
  };

  if (verzonden) {
    return (
      <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-8 text-center">
        <div className="text-5xl mb-3">✅</div>
        <p className="font-black text-stone-900 text-xl mb-2">Goed zo!</p>
        <p className="text-stone-500">Je e-mailprogramma is geopend met je bericht. Stuur het even af!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-bold text-stone-700 mb-2">Jouw naam</label>
        <input
          type="text"
          required
          value={naam}
          onChange={(e) => setNaam(e.target.value)}
          placeholder="Jan de Imker"
          className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-stone-700 mb-2">Jouw bericht</label>
        <textarea
          required
          value={bericht}
          onChange={(e) => setBericht(e.target.value)}
          placeholder="Hallo Terry, ik had een vraag over..."
          rows={5}
          className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition resize-none"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-amber-400 text-amber-900 font-bold py-4 rounded-xl hover:bg-amber-300 transition-all hover:scale-[1.02] shadow text-lg"
      >
        Verstuur bericht →
      </button>
      <p className="text-xs text-stone-400 text-center">Opent je e-mailprogramma met je bericht ingevuld.</p>
    </form>
  );
}
