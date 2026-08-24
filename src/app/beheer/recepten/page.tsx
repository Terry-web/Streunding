export const metadata = { title: "Recepten (todo) | Beheer | Streunding" };

export default function BeheerReceptenTodoPage() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-black text-stone-400 uppercase tracking-widest mb-6">Recepten</h2>

      <div className="bg-stone-800 rounded-2xl p-6 border border-amber-600/40">
        <p className="text-amber-400 font-bold mb-2">📝 Todo — nog van de publieke site gehaald</p>
        <p className="text-stone-300 text-sm leading-6">
          De publieke <code className="text-stone-400">/recepten</code>-pagina (braggot batch 26244) stond
          hardcoded op de homepage en in de nav. Voor nu weggehaald tot dit opnieuw ingericht is — de
          content zelf staat nog in de git-historie, niks kwijt.
        </p>
        <p className="text-stone-500 text-xs mt-4">
          Uitwerken zodra duidelijk is hoe recepten structureel getoond moeten worden (los onderdeel, of
          gekoppeld aan het dagboek/blog).
        </p>
      </div>
    </div>
  );
}
