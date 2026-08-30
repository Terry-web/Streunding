import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type BatchRegel = { label: string; waarde: string };
export type BatchStatus = "Gebotteld" | "Rijpt" | "Vergist";

export type Batch = {
  nr: string;
  naam: string;
  type: string;
  status: BatchStatus;
  regels: BatchRegel[];
  notitie: string;
};

const medeDir = path.join(process.cwd(), "data/mede");

export function getBatches(): Batch[] {
  const files = fs.readdirSync(medeDir).filter((f) => f.endsWith(".txt"));
  return files
    .map((file) => {
      const { data } = matter(fs.readFileSync(path.join(medeDir, file), "utf8"));
      return data as Batch;
    })
    .sort((a, b) => a.nr.localeCompare(b.nr));
}
