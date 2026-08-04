import fs from "fs";
import path from "path";

export type Kast = {
  id: string;
  naam: string;
  type: string;
  kleur: string;
  locatie: string;
  gebouwd: string;
};

export type Inspectie = {
  id: string;
  kastId: string;
  datum: string;
  weer: string;
  temperatuur: string;
  koninginGezien: "ja" | "nee" | "niet gezocht";
  broed: "goed" | "wisselend" | "geen" | "n.v.t.";
  honingvoorraad: "goed" | "matig" | "laag" | "n.v.t.";
  varroaTelling: number | null;
  acties: string[];
  notities: string;
};

type Data = { kasten: Kast[]; inspecties: Inspectie[] };

export function getInspecties(): Data {
  const file = path.join(process.cwd(), "content/inspecties.json");
  return JSON.parse(fs.readFileSync(file, "utf8")) as Data;
}
