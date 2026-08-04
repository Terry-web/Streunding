import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-6 pt-16">
      <div className="text-center max-w-lg">
        <div className="text-8xl mb-6 animate-float inline-block">🐝</div>
        <h1 className="text-6xl font-black text-amber-900 mb-4">404</h1>
        <p className="text-2xl font-bold text-stone-800 mb-3">Deze pagina bestaat niet</p>
        <p className="text-stone-500 leading-7 mb-10">
          Misschien heeft de bij hem meegenomen. Of de URL klopt niet.
          Ga terug naar de homepage en probeer het opnieuw.
        </p>
        <Link
          href="/"
          className="bg-amber-400 text-amber-900 font-bold px-8 py-4 rounded-full hover:bg-amber-300 transition-all hover:scale-105 inline-block shadow text-lg"
        >
          Terug naar home →
        </Link>
      </div>
    </div>
  );
}
