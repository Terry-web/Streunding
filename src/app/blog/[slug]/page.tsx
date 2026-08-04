import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPostSlugs, getPosts } from "@/lib/posts";

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
    <div className="min-h-screen bg-amber-50 text-stone-800">

      {/* Hero */}
      <section className="relative pt-16 min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-900 via-orange-900 to-stone-900">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="honeycomb" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse">
                <polygon points="28,2 54,17 54,47 28,62 2,47 2,17" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#honeycomb)"/>
          </svg>
        </div>
        <div className="absolute top-10 right-20 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl animate-float" />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto py-20">
          <Link href="/blog" className="inline-flex items-center gap-2 text-amber-300 hover:text-white transition-colors text-sm font-medium mb-6">
            ← Terug naar blog
          </Link>
          <div className="text-6xl mb-4 animate-float inline-block">{post.icon}</div>
          <div className="mb-4">
            <span className="bg-amber-400 text-amber-900 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              {post.tag}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">{post.titel}</h1>
          <p className="text-amber-300 text-sm">{post.datum} · Terry Streunding</p>
        </div>
      </section>

      {/* Artikel */}
      <article className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-xl text-stone-600 leading-9 font-medium mb-10 pb-10 border-b border-amber-100">
          {post.samenvatting}
        </p>
        <div
          className="prose prose-stone prose-lg max-w-none prose-p:leading-9 prose-headings:font-black prose-headings:text-stone-900"
          dangerouslySetInnerHTML={{ __html: post.inhoudHtml ?? "" }}
        />

        {/* Auteur */}
        <div className="mt-16 bg-white rounded-2xl p-6 shadow border border-amber-100 flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shrink-0">
            👨‍🌾
          </div>
          <div>
            <p className="font-black text-stone-900">Terry Streunding</p>
            <p className="text-stone-500 text-sm leading-6">Beginnend imker. Deel mijn eerlijke ervaringen vanuit de bijenstal.</p>
          </div>
        </div>
      </article>

      {/* Navigatie tussen posts */}
      {(vorigePost || volgendePost) && (
        <section className="max-w-2xl mx-auto px-6 pb-16 grid grid-cols-2 gap-4">
          {vorigePost ? (
            <Link href={`/blog/${vorigePost.slug}`} className="group bg-white rounded-2xl p-5 shadow border border-stone-100 hover:shadow-md hover:-translate-y-1 transition-all">
              <p className="text-xs text-stone-400 mb-2">← Vorig bericht</p>
              <p className="font-bold text-stone-900 group-hover:text-amber-700 transition-colors text-sm leading-snug">{vorigePost.titel}</p>
            </Link>
          ) : <div />}
          {volgendePost ? (
            <Link href={`/blog/${volgendePost.slug}`} className="group bg-white rounded-2xl p-5 shadow border border-stone-100 hover:shadow-md hover:-translate-y-1 transition-all text-right">
              <p className="text-xs text-stone-400 mb-2">Volgend bericht →</p>
              <p className="font-bold text-stone-900 group-hover:text-amber-700 transition-colors text-sm leading-snug">{volgendePost.titel}</p>
            </Link>
          ) : <div />}
        </section>
      )}

    </div>
  );
}
