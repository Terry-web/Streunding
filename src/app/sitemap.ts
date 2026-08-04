import type { MetadataRoute } from "next";
import { getPostSlugs } from "@/lib/posts";

export const dynamic = "force-static";

const base = "https://streunding.nl";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getPostSlugs();
  const blogPosts = slugs.map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/informatief`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/kasten`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/recepten`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/honing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/over-mij`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
    ...blogPosts,
  ];
}
