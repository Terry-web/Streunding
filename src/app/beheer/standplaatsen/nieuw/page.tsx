import ApiaryForm from "../ApiaryForm";
import { createApiary } from "../actions";

export const metadata = { title: "Nieuwe standplaats | Beheer | Streunding" };

export default function NieuweStandplaatsPage() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-black text-stone-400 uppercase tracking-widest mb-6">
        Nieuwe standplaats
      </h2>
      <ApiaryForm action={createApiary} />
    </div>
  );
}
