export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/ghost";
import Image from "next/image";
import * as React from "react";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return notFound();

  const initialSrc = (post.feature_image || '').replace(/^http:/, 'https:');

  return (
    <article className="mx-auto max-w-3xl px-6 lg:px-8 py-12">
      <header>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{post.title}</h1>
        {post.published_at ? (
          <p className="mt-2 text-sm text-slate-500">{new Date(post.published_at).toLocaleDateString()}</p>
        ) : null}
      </header>
      {post.feature_image ? (
        <div className="mt-6 overflow-hidden rounded-lg bg-slate-100 relative aspect-[16/9]">
          {/* Client-side fallback: swap to placeholder if the remote image fails */}
          <Image
            src={initialSrc}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target && target.getAttribute('src') !== '/thumbnails/hero-thumb.webp') {
                // Next/Image forwards onError to the underlying img
                target.setAttribute('src', '/thumbnails/hero-thumb.webp');
              }
            }}
          />
        </div>
      ) : null}
      {post.excerpt ? (
        <p className="mt-6 text-slate-700 text-lg">{post.excerpt}</p>
      ) : null}
    </article>
  );
}