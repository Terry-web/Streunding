import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export type Post = {
  slug: string;
  titel: string;
  datum: string;
  samenvatting: string;
  tag: string;
  icon: string;
  inhoudHtml?: string;
};

const postsDir = path.join(process.cwd(), "content/blog");

export function getPosts(): Post[] {
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const { data } = matter(fs.readFileSync(path.join(postsDir, file), "utf8"));
    return { slug, ...(data as Omit<Post, "slug">) };
  });
}

export async function getPost(slug: string): Promise<Post | undefined> {
  const filePath = path.join(postsDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return undefined;
  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
  const processed = await remark().use(html).process(content);
  return { slug, ...(data as Omit<Post, "slug">), inhoudHtml: processed.toString() };
}

export function getPostSlugs(): string[] {
  return fs.readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
