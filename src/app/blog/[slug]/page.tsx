export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/ghost-hybrid";
import Image from "next/image";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return notFound();

  const ghostBase = (process.env.NEXT_PUBLIC_GHOST_CONTENT_URL || 'https://ghost.behaviorschool.com').replace(/\/$/, '');
  const ghostContentPrefix = `${ghostBase}/content/images/`;
  const normalizeHtml = (html: string): string => {
    if (!html) return '';
    let out = html;
    // Protocol-relative to https
    out = out.replace(/src=\"\/\/([^\"]+)\"/g, 'src="https://$1"');
    // Force https for any http Ghost URL
    out = out.replace(new RegExp(`src=\\"http:\\/\\/${ghostBase.replace(/https?:\/\//, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,'g'), `src="https://${ghostBase.replace(/https?:\/\//, '')}`);
    // Rewrite any Ghost content images (absolute or relative) to proxy path
    out = out.replace(new RegExp(`src=\\\"${ghostContentPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\\"]+)\\\"`, 'g'), (_m, rest) => `src="/media/ghost/content/images/${rest}"`);
    out = out.replace(/src=\"(\/content\/images\/[^\"]+)\"/g, (_m, p1) => `src="/media/ghost${p1}"`);

    // Handle srcset lists
    out = out.replace(/srcset=\"([^\"]+)\"/g, (_m, val: string) => {
      const rewritten = val.split(',').map(part => {
        const [url, size] = part.trim().split(/\s+/);
        let u = url || '';
        if (u.startsWith('//')) u = 'https:' + u;
        else if (u.startsWith('http://')) u = u.replace(/^http:/, 'https:');
        // Map Ghost content images to proxy
        if (u.startsWith(ghostContentPrefix)) {
          u = u.replace(ghostBase, '');
        }
        if (u.startsWith('/content/images/')) {
          u = '/media/ghost' + u;
        }
        return [u, size].filter(Boolean).join(' ');
      }).join(', ');
      return `srcset="${rewritten}"`;
    });
    return out;
  };

  return (
    <article className="mx-auto max-w-3xl px-6 lg:px-8 pt-20 pb-12">
      <header>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{post.title}</h1>
        {post.published_at ? (
          <p className="mt-2 text-sm text-slate-500">{new Date(post.published_at).toLocaleDateString()}</p>
        ) : null}
      </header>
      {post.feature_image ? (
        <div className="mt-6 overflow-hidden rounded-lg bg-slate-100 relative aspect-[16/9]">
          <Image 
            src={(function(){
              let src = post.feature_image as string;
              if (src.startsWith('//')) src = 'https:' + src;
              if (src.startsWith('http://')) src = src.replace(/^http:/, 'https:');
              if (src.startsWith(ghostContentPrefix)) {
                src = src.replace(ghostBase, '');
              }
              if (src.startsWith('/content/images/')) {
                src = '/media/ghost' + src;
              }
              return src;
            })()} 
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
      {post.html ? (
        <div 
          className="mt-8 prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-ul:text-slate-700 prose-ol:text-slate-700 prose-blockquote:text-slate-600 prose-blockquote:border-l-emerald-500 prose-img:rounded-lg prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: normalizeHtml(post.html) }}
        />
      ) : null}
    </article>
  );
}
