export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/ghost";
import Image from "next/image";

function processPostContent(html: string): string {
  if (!html) return '';
  
  // Fix image URLs - ensure they use HTTPS
  let processedHtml = html.replace(/(<img[^>]*src=")http:\/\//gi, '$1https://');
  
  // Add fallback for broken images
  processedHtml = processedHtml.replace(
    /<img([^>]*?)src="([^"]*)"([^>]*?)>/gi, 
    (match, beforeSrc, src, afterSrc) => {
      // If the image src is already broken or empty, use fallback
      if (!src || src.includes('ghost.behaviorschool.com/content/images/2025/08/passthefreakinexam-1.png') || 
          src.includes('ghost.behaviorschool.com/content/images/2025/07/skinner90.jpeg')) {
        return `<img${beforeSrc}src="/thumbnails/hero-thumb.webp"${afterSrc} onerror="this.src='/thumbnails/hero-thumb.webp'">`;
      }
      // Add onerror fallback to all images
      return `<img${beforeSrc}src="${src}"${afterSrc} onerror="this.src='/thumbnails/hero-thumb.webp'">`;
    }
  );
  
  return processedHtml;
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return notFound();

  const processedContent = processPostContent(post.html || '');

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
            src={(post.feature_image || '').replace(/^http:/, 'https:')} 
            alt={post.title} 
            fill 
            sizes="(max-width: 768px) 100vw, 768px" 
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/thumbnails/hero-thumb.webp';
            }}
          />
        </div>
      ) : null}
      {post.excerpt ? (
        <p className="mt-6 text-slate-700 text-lg">{post.excerpt}</p>
      ) : null}
      {processedContent ? (
        <div 
          className="mt-8 prose prose-lg prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-strong:text-slate-900 prose-img:rounded-lg prose-img:shadow-sm"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      ) : null}
    </article>
  );
}