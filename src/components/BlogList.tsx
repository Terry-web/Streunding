"use client";
import Link from "next/link";
import { useState } from "react";
import type { Post } from "@/lib/posts";

const tagKleur: Record<string, string> = {
  Verhaal: "bg-amber-100 text-amber-800",
  Ambacht: "bg-orange-100 text-orange-800",
  Recept: "bg-yellow-100 text-yellow-800",
};

export default function BlogList({ posts }: { posts: Post[] }) {
  const [actieveTag, setActieveTag] = useState<string | null>(null);
  const tags = Array.from(new Set(posts.map((p) => p.tag)));
  const gefilterd = actieveTag ? posts.filter((p) => p.tag === actieveTag) : posts;

  return (
    <section className="bg-stone-100 py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="text-amber-700 font-semibold uppercase tracking-widest text-sm mb-1">Archief</p>
            <h2 className="text-4xl font-black text-stone-900">Alle berichten</h2>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActieveTag(null)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${!actieveTag ? "bg-amber-900 text-white" : "bg-white text-stone-600 hover:bg-amber-100"}`}
            >
              Alles
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActieveTag(actieveTag === tag ? null : tag)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${actieveTag === tag ? "bg-amber-900 text-white" : "bg-white text-stone-600 hover:bg-amber-100"}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {gefilterd.length === 0 ? (
          <p className="text-stone-400 text-center py-12">Geen berichten gevonden.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...gefilterd].reverse().map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl shadow border border-stone-100 p-7 hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col gap-4"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{post.icon}</span>
                  <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${tagKleur[post.tag] ?? "bg-stone-100 text-stone-700"}`}>
                    {post.tag}
                  </span>
                </div>
                <h3 className="text-lg font-black text-stone-900 group-hover:text-amber-700 transition-colors leading-snug">{post.titel}</h3>
                <p className="text-stone-500 text-sm leading-7 flex-1">{post.samenvatting}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-stone-400">{post.datum}</span>
                  <span className="text-amber-600 text-sm font-semibold group-hover:text-amber-800 transition-colors">Lees meer →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
