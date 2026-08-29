import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPostSlugs, getPosts } from "@/lib/posts";
import ReadingProgress from "@/components/ReadingProgress";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return { title: post.titel, description: post.samenvatting };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const posts = getPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  const vorigePost = index < posts.length - 1 ? posts[index + 1] : null;
  const volgendePost = index > 0 ? posts[index - 1] : null;

  return (
    <div className="bg-[#f3f2f2] text-[#201f1d]">
      <ReadingProgress />

      {/* Hero */}
      <section className="pt-16">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-5 px-6 py-20">
          <Link
            href="/blog"
            className="text-sm tracking-[0.04em] text-[#605d5d] transition-colors hover:text-[#201f1d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68235] rounded-sm"
          >
            ← Terug naar blog
          </Link>
          <span className="rounded-sm border border-[#b68235]/60 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-[#7d5411]">
            {post.tag}
          </span>
          <h1 className="text-4xl leading-[1.08] md:text-[3.25rem]">{post.titel}</h1>
          <span className="h-px w-full bg-[#201f1d]/15" />
          <p className="text-sm text-[#605d5d]">{post.datum} · Terry Streunding</p>
        </div>
      </section>

      {/* Artikel */}
      <article className="border-t border-[#201f1d]/15 bg-[#eeeceb]">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <p
            className="mb-10 border-b border-[#201f1d]/15 pb-10 text-xl italic leading-[1.6] text-[#3a3735]"
            style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
          >
            {post.samenvatting}
          </p>
          <div
            className="prose prose-lg max-w-none prose-p:leading-[1.8] prose-p:text-[#3a3735] prose-headings:font-normal prose-headings:text-[#201f1d] prose-a:text-[#7d5411] prose-strong:text-[#201f1d]"
            style={{ fontFamily: "var(--font-body), Georgia, serif" }}
            dangerouslySetInnerHTML={{ __html: post.inhoudHtml ?? "" }}
          />

          {/* Auteur */}
          <div className="mt-16 flex items-center gap-5 border-t border-[#201f1d]/15 pt-8">
            <div>
              <p style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 600 }}>
                Terry Streunding
              </p>
              <p className="text-sm leading-[1.6] text-[#605d5d]">
                Beginnend imker. Deel mijn eerlijke ervaringen vanuit de bijenstal.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Navigatie tussen posts */}
      {(vorigePost || volgendePost) && (
        <section className="grid max-w-2xl grid-cols-2 gap-px mx-auto bg-[#201f1d]/15 px-6 py-px sm:px-0">
          {vorigePost ? (
            <Link
              href={`/blog/${vorigePost.slug}`}
              className={`group bg-[#f3f2f2] p-6 transition-colors hover:bg-[#eeeceb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68235]`}
            >
              <p className="mb-2 text-xs uppercase tracking-[0.14em] text-[#7d5411]">← Vorig bericht</p>
              <p className="text-sm leading-snug text-[#201f1d] transition-colors group-hover:text-[#7d5411]">
                {vorigePost.titel}
              </p>
            </Link>
          ) : (
            <div className="bg-[#f3f2f2]" />
          )}
          {volgendePost ? (
            <Link
              href={`/blog/${volgendePost.slug}`}
              className={`group bg-[#f3f2f2] p-6 text-right transition-colors hover:bg-[#eeeceb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68235]`}
            >
              <p className="mb-2 text-xs uppercase tracking-[0.14em] text-[#7d5411]">Volgend bericht →</p>
              <p className="text-sm leading-snug text-[#201f1d] transition-colors group-hover:text-[#7d5411]">
                {volgendePost.titel}
              </p>
            </Link>
          ) : (
            <div className="bg-[#f3f2f2]" />
          )}
        </section>
      )}

    </div>
  );
}
