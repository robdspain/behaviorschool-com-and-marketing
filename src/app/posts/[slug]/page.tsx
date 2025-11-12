export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/ghost-hybrid";
import Image from "next/image";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return notFound();

  const ghostBase = (process.env.NEXT_PUBLIC_GHOST_CONTENT_URL || 'https://ghost.behaviorschool.com').replace(/\/$/, '');
  const normalizeImageSrc = (src?: string | null): string | null => {
    if (!src) return null;
    let out = src;
    if (out.startsWith('//')) out = 'https:' + out;
    if (out.startsWith('http://')) out = out.replace(/^http:/, 'https:');
    const ghostContentRegex = new RegExp(`^https?:\\/\\/${ghostBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\/content\\/images\\/`);
    if (ghostContentRegex.test(out)) {
      out = out.replace(/^https?:\/\/[\s\S]*?(?=\/content\/images\/)/, '');
    }
    if (out.startsWith('/content/images/')) {
      // Use proxy with WebP optimization for large images
      out = '/media/ghost' + out + '?w=1200&q=80&f=webp';
    }
    return out;
  };

  return (
    <article className="mx-auto max-w-3xl px-6 lg:px-8 py-12">
      <header>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{post.title}</h1>
        {post.published_at ? (
          <p className="mt-2 text-sm text-slate-500">{new Date(post.published_at).toLocaleDateString()}</p>
        ) : null}
      </header>
      {post.feature_image ? (
        <div className="mt-6 overflow-hidden rounded-lg bg-slate-100">
          <Image 
            src={normalizeImageSrc(post.feature_image) || '/thumbnails/hero-thumb.webp'} 
            alt={post.title} 
            className="h-auto w-full object-contain" 
            fill={true} 
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      ) : null}
      {post.excerpt ? (
        <p className="mt-6 text-slate-700 text-lg">{post.excerpt}</p>
      ) : null}
    </article>
  );
}
