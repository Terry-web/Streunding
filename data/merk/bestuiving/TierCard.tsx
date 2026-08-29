// merk/bestuiving/TierCard.tsx  →  src/app/bestuiving/TierCard.tsx
// Alleen de opmaak is anders; useActionState en createTierAanvraag zijn ongewijzigd.
"use client";

import { useActionState, useState } from "react";
import SubmitButton from "@/components/SubmitButton";
import { createTierAanvraag, type AanvraagFormState } from "./actions";
import type { Tier } from "./tiers";

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68235] rounded-sm";

const heading = { fontFamily: "var(--font-heading), Georgia, serif" } as const;

export default function TierCard({ tier }: { tier: Tier }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<AanvraagFormState, FormData>(
    createTierAanvraag.bind(null, tier.id, tier.doelgroep),
    undefined
  );

  return (
    <div className="flex flex-col gap-4.5 rounded border border-[#201f1d]/15 bg-[#f6f5f4] p-8">
      <div className="flex items-start justify-between gap-5">
        <h3 className="max-w-[24ch] text-[1.7rem] leading-[1.12]" style={{ ...heading, fontWeight: 600 }}>
          {tier.titel}
        </h3>
        <span className="shrink-0 rounded-sm border border-[#b68235]/60 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-[#7d5411]">
          {tier.doelgroep}
        </span>
      </div>

      <p className="text-[15px] italic leading-[1.6] text-[#605d5d]">{tier.intro}</p>
      <span className="h-px bg-[#201f1d]/15" />
      <p className="text-[15px] leading-[1.7] text-[#4a4744]">{tier.beschrijving}</p>

      <ul className="flex flex-col gap-2.5">
        {tier.punten.map((punt) => (
          <li
            key={punt}
            className="grid grid-cols-[18px_minmax(0,1fr)] gap-2.5 text-sm leading-[1.6] text-[#4a4744]"
          >
            <span className="mt-[11px] h-px bg-[#b68235]" />
            <span>{punt}</span>
          </li>
        ))}
      </ul>

      {state && "success" in state ? (
        <p className="mt-1 border-l-2 border-[#b68235] bg-[#b68235]/8 px-4 py-3 text-sm leading-[1.6] text-[#7d5411]">
          Bedankt — je aanvraag staat er. Je krijgt binnen 2 werkdagen bericht.
        </p>
      ) : open ? (
        <form action={formAction} className="mt-2 flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id={`${tier.id}-naam`} label="Naam" name="naam" required />
            <Field id={`${tier.id}-email`} label="E-mail" name="email" type="email" required />
            <Field id={`${tier.id}-telefoon`} label="Telefoon" name="telefoon" type="tel" />
            {tier.gewasVelden && (
              <>
                <Field id={`${tier.id}-gewas`} label="Gewas" name="gewas" placeholder="appel, peer …" />
                <Field
                  id={`${tier.id}-oppervlakte`}
                  label="Oppervlakte"
                  name="oppervlakte"
                  placeholder="bijv. 2 hectare"
                />
                <Field
                  id={`${tier.id}-bloeiperiode`}
                  label="Bloeiperiode"
                  name="bloeiperiode"
                  placeholder="bijv. april–mei"
                />
              </>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`${tier.id}-opmerking`}
              className="text-xs uppercase tracking-[0.14em] text-[#605d5d]"
            >
              Opmerking
            </label>
            <textarea
              id={`${tier.id}-opmerking`}
              name="opmerking"
              rows={3}
              placeholder="Waar staat het perceel, en wanneer verwacht je de bloei?"
              className={`w-full rounded border border-[#201f1d]/20 bg-[#fdfcfc] px-3.5 py-2.5 text-[15px] leading-[1.6] placeholder:text-[#a3a09e] focus:border-[#b68235] focus:outline-none focus:ring-2 focus:ring-[#b68235]/20`}
            />
          </div>

          {state && "error" in state && (
            <p className="border-l-2 border-[#8c2f2f] bg-[#8c2f2f]/6 px-4 py-3 text-sm text-[#8c2f2f]">
              {state.error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-5">
            <SubmitButton>Aanvraag versturen</SubmitButton>
            <span className="text-[13px] text-[#605d5d]">Je krijgt binnen 2 werkdagen bericht.</span>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`mt-auto self-start rounded border border-[#b68235] px-5 py-2.5 text-[15px] tracking-[0.06em] text-[#7d5411] transition-colors hover:bg-[#b68235]/10 ${focus}`}
          style={{ ...heading, fontWeight: 600 }}
        >
          {tier.ctaLabel}
        </button>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs uppercase tracking-[0.14em] text-[#605d5d]">
        {label}
        {required && " *"}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded border border-[#201f1d]/20 bg-[#fdfcfc] px-3.5 py-2.5 text-[15px] placeholder:text-[#a3a09e] focus:border-[#b68235] focus:outline-none focus:ring-2 focus:ring-[#b68235]/20"
      />
    </div>
  );
}
