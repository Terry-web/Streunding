import AanbodForm from "../AanbodForm";
import { createAanbod } from "../actions";

export const metadata = { title: "Nieuw aanbod | Beheer | Streunding" };

export default function NieuwAanbodPage() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-black text-stone-400 uppercase tracking-widest mb-6">Nieuw aanbod</h2>
      <AanbodForm action={createAanbod} />
    </div>
  );
}
