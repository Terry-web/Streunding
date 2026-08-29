import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/posts";
import BlogList from "@/components/BlogList";

export const metadata: Metadata = {
  title: "Blog",
  description: "Eerlijke verhalen uit de bijenstal — van kasten timmeren tot het eerste brouwsel.",
};

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68235] rounded-sm";

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-3.5">
      <span className="h-px w-9 bg-[#b68235]/60" />
      <span className="text-xs uppercase tracking-[0.2em] text-[#7d5411]">{children}</span>
    </span>
  );
}

export default function Blog() {
  const posts = getPosts();
  const nieuwste = posts[posts.length - 1];

  return (
    <div className="bg-[#f3f2f2] text-[#201f1d]">

      {/* Hero */}
      <section className="pt-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 px-6 py-20">
          <Kicker>Mijn blog</Kicker>
          <h1 className="text-5xl leading-[1.02] md:text-[4rem]">Imkerblog</h1>
          <span className="h-px w-full bg-[#201f1d]/15" />
          <p className="max-w-[46ch] text-lg leading-[1.7] text-[#4a4744]">
            Eerlijke verhalen uit de bijenstal — van kasten timmeren tot het eerste brouwsel.
          </p>
        </div>
      </section>

      {/* Uitgelicht */}
      {nieuwste && (
        <section className="border-t border-[#201f1d]/15 bg-[#eeeceb]">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <Kicker>Nieuwste bericht</Kicker>
            <Link
              href={`/blog/${nieuwste.slug}`}
              className={`group mt-6 grid gap-8 border border-[#201f1d]/15 bg-[#f6f5f4] p-8 transition-colors hover:border-[#b68235] md:grid-cols-[auto_minmax(0,1fr)] md:items-center md:p-10 ${focus}`}
            >
              <span className="shrink-0 rounded-sm border border-[#b68235]/60 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-[#7d5411] md:self-start">
                {nieuwste.tag}
              </span>
              <div className="flex flex-col gap-3">
                <h2 className="text-[1.875rem] leading-[1.12] md:text-[2.25rem]">{nieuwste.titel}</h2>
                <p className="max-w-[60ch] text-base leading-[1.65] text-[#4a4744]">{nieuwste.samenvatting}</p>
                <div className="mt-1 flex items-center gap-4 text-sm">
                  <span className="text-[#605d5d]">{nieuwste.datum}</span>
                  <span
                    className="text-[#7d5411] transition-colors group-hover:text-[#b68235]"
                    style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 600 }}
                  >
                    Lees het verhaal
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      <BlogList posts={posts} />

    </div>
  );
}
