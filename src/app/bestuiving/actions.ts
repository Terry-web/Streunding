"use server";

import { createClient } from "@/lib/supabase/server";
import { str, numOrNull, dateOrNull } from "@/lib/beheer/form-utils";

export type AanvraagFormState = { error: string } | { success: true } | undefined;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createAanvraag(
  aanbodId: string,
  _prevState: AanvraagFormState,
  formData: FormData
): Promise<AanvraagFormState> {
  const naam = str(formData.get("naam"));
  const email = str(formData.get("email"));
  const telefoon = str(formData.get("telefoon")) || null;
  const aantal = numOrNull(formData.get("aantal")) ?? 1;
  const gewensteLeverdatum = dateOrNull(formData.get("gewenste_leverdatum"));
  const opmerking = str(formData.get("opmerking")) || null;

  if (!naam) return { error: "Naam is verplicht." };
  if (!email || !EMAIL_PATTERN.test(email)) return { error: "Vul een geldig e-mailadres in." };

  const supabase = await createClient();
  const { error } = await supabase.from("bestuifvolk_aanvragen").insert({
    aanbod_id: aanbodId,
    naam,
    email,
    telefoon,
    aantal,
    gewenste_leverdatum: gewensteLeverdatum,
    opmerking,
  });
  if (error) return { error: "Versturen is niet gelukt, probeer het later opnieuw." };

  return { success: true };
}

export async function createTierAanvraag(
  tier: "tuin" | "boomgaard" | "teelt" | "maatwerk",
  doelgroep: "particulier" | "zakelijk",
  _prevState: AanvraagFormState,
  formData: FormData
): Promise<AanvraagFormState> {
  const naam = str(formData.get("naam"));
  const email = str(formData.get("email"));
  const telefoon = str(formData.get("telefoon")) || null;
  const gewas = str(formData.get("gewas")) || null;
  const oppervlakte = str(formData.get("oppervlakte")) || null;
  const bloeiperiode = str(formData.get("bloeiperiode")) || null;
  const opmerking = str(formData.get("opmerking")) || null;

  if (!naam) return { error: "Naam is verplicht." };
  if (!email || !EMAIL_PATTERN.test(email)) return { error: "Vul een geldig e-mailadres in." };

  const supabase = await createClient();
  const { error } = await supabase.from("bestuifvolk_aanvragen").insert({
    aanbod_id: null,
    doelgroep,
    tier,
    naam,
    email,
    telefoon,
    gewas,
    oppervlakte,
    bloeiperiode,
    opmerking,
  });
  if (error) return { error: "Versturen is niet gelukt, probeer het later opnieuw." };

  return { success: true };
}
