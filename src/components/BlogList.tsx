"use client";
import Link from "next/link";
import { useState } from "react";
import type { Post } from "@/lib/posts";

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68235] rounded-sm";

export default function BlogList({ posts }: { posts: Post[] }) {
  const [actieveTag, setActieveTag] = useState<string | null>(null);
  const tags = Array.from(new Set(posts.map((p) => p.tag)));
  const gefilterd = actieveTag ? posts.filter((p) => p.tag === actieveTag) : posts;

  return (
    <section className="border-t border-[#201f1d]/15 bg-[#f3f2f2]">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex flex-wrap items-baseline justify-between gap-6">
          <h2 className="text-[2.625rem] leading-none">Alle berichten</h2>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => setActieveTag(null)}
              className={`rounded-sm border px-3.5 py-1.5 text-xs uppercase tracking-[0.12em] transition-colors ${focus} ${
                !actieveTag
                  ? "border-[#b68235] text-[#7d5411]"
                  : "border-[#201f1d]/20 text-[#605d5d] hover:border-[#b68235]/60"
              }`}
            >
              Alles
            </button>
            {tags.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => setActieveTag(actieveTag === tag ? null : tag)}
                className={`rounded-sm border px-3.5 py-1.5 text-xs uppercase tracking-[0.12em] transition-colors ${focus} ${
                  actieveTag === tag
                    ? "border-[#b68235] text-[#7d5411]"
                    : "border-[#201f1d]/20 text-[#605d5d] hover:border-[#b68235]/60"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {gefilterd.length === 0 ? (
          <p className="py-12 text-center text-[#605d5d]">Geen berichten gevonden.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[...gefilterd].reverse().map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`group flex flex-col gap-3.5 border border-[#201f1d]/15 bg-[#f6f5f4] p-7 transition-colors hover:border-[#b68235] ${focus}`}
              >
                <span className="w-fit rounded-sm border border-[#b68235]/60 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-[#7d5411]">
                  {post.tag}
                </span>
                <h3
                  className="text-[1.4rem] leading-[1.15]"
                  style={{ fontFamily: "var(--font-heading), Georgia, serif", fontWeight: 600 }}
                >
                  {post.titel}
                </h3>
                <p className="flex-1 text-sm leading-[1.65] text-[#4a4744]">{post.samenvatting}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-[#605d5d]">{post.datum}</span>
                  <span className="text-sm text-[#7d5411] transition-colors group-hover:text-[#b68235]">
                    Lees meer
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
