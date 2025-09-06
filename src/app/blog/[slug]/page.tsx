export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/ghost";
import Image from "next/image";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return notFound();

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
          <Image 
            src={post.feature_image.startsWith('http') 
              ? post.feature_image.replace(/^http:/, 'https:')
              : `${process.env.NEXT_PUBLIC_GHOST_CONTENT_URL || 'https://ghost.behaviorschool.com'}${post.feature_image}`
            } 
            alt={post.title} 
            fill 
            sizes="(max-width: 768px) 100vw, 768px" 
            className="object-cover" 
          />
        </div>
      ) : null}
      {post.excerpt ? (
        <p className="mt-6 text-slate-700 text-lg">{post.excerpt}</p>
      ) : null}
    </article>
  );
}