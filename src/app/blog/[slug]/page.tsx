import type { Metadata } from "next";
import { notFound } from "next/navigation";
import readingTime from "reading-time";
import Image from "next/image";
import { getPostBySlug } from "@/lib/ghost";

type PageProps = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug, { include: "tags,authors", formats: "html,plaintext" });
  if (!post) return {};
  const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com";
  const url = `${SITE_URL}/blog/${post.slug}`;
  const og = post.feature_image || `${url}/opengraph-image`;
  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: url },
    openGraph: { title: post.title, description: post.excerpt || undefined, url, images: [{ url: og }] },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt || undefined, images: [og] },
  };
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug, { include: "tags,authors", formats: "html,plaintext" });
  if (!post) return notFound();

  const rt = readingTime(post.plaintext || post.excerpt || "");

  return (
    <article className="mx-auto max-w-3xl px-6 lg:px-8 py-10">
      
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">{post.title}</h1>
      <div className="mb-6 text-sm text-slate-600 flex flex-wrap items-center gap-2">
        {post.published_at ? <span>{new Date(post.published_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</span> : null}
        {rt?.text ? <span>• {rt.text}</span> : null}
        {post.authors && post.authors.length > 0 ? <span>• {post.authors.map(a => a.name).filter(Boolean).join(", ")}</span> : null}
      </div>
      {post.tags && post.tags.length > 0 ? (
        <div className="mb-6 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span key={t.id} className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
              {t.name}
            </span>
          ))}
        </div>
      ) : null}
      {post.html ? (
        <div
          className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-900"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      ) : null}
    </article>
  );
}


