import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-amber-950 text-amber-300 py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-xl font-bold text-white">🐝 Streunding</span>
        <nav className="flex gap-6 text-sm flex-wrap justify-center">
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          <Link href="/informatief" className="hover:text-white transition-colors">Informatief</Link>
          <Link href="/kasten" className="hover:text-white transition-colors">Kasten</Link>
          <Link href="/over-mij" className="hover:text-white transition-colors">Over mij</Link>
        </nav>
        <p className="text-sm text-amber-500">© {new Date().getFullYear()} Streunding Imkerij</p>
      </div>
    </footer>
  );
}
