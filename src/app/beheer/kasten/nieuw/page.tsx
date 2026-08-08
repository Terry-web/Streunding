import HiveForm from "../HiveForm";
import { createHive } from "../actions";

export const metadata = { title: "Nieuwe kast | Beheer | Streunding" };

export default function NieuweKastPage() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-black text-stone-400 uppercase tracking-widest mb-6">Nieuwe kast</h2>
      <HiveForm action={createHive} />
    </div>
  );
}
