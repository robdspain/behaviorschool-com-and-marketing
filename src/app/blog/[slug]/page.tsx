export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/ghost-hybrid";
import Image from "next/image";
import type { Metadata } from "next";
import { EditPostButton } from "@/components/admin/EditPostButton";

// Decode HTML entities in text
function decodeHtmlEntities(text: string): string {
  if (!text) return text;

  return text
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#x22;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#x26;/g, '&')
    .replace(/&#38;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&#x3C;/g, '<')
    .replace(/&#60;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x3E;/g, '>')
    .replace(/&#62;/g, '>')
    .replace(/&#x2014;/g, '\u2014') // em dash
    .replace(/&#8212;/g, '\u2014')
    .replace(/&#x2013;/g, '\u2013') // en dash
    .replace(/&#8211;/g, '\u2013')
    .replace(/&#x2019;/g, '\u2019') // right single quote
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#x201C;/g, '\u201C') // left double quote
    .replace(/&#8220;/g, '\u201C')
    .replace(/&#x201D;/g, '\u201D') // right double quote
    .replace(/&#8221;/g, '\u201D');
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | Behavior School",
      description: "The requested blog post could not be found."
    };
  }

  const ghostBase = (process.env.NEXT_PUBLIC_GHOST_CONTENT_URL || 'https://ghost.behaviorschool.com').replace(/\/$/, '');
  
  // Transform Ghost image URL to use proxy
  const transformImageUrl = (url: string | null | undefined): string => {
    if (!url) return '/optimized/og-image.webp';
    
    let transformed = url;
    const ghostContentPrefix = `${ghostBase}/content/images/`;
    
    // Handle protocol-relative URLs
    if (transformed.startsWith('//')) {
      transformed = 'https:' + transformed;
    }
    
    // Force https
    if (transformed.startsWith('http://')) {
      transformed = transformed.replace(/^http:/, 'https:');
    }
    
    // Transform Ghost content images to proxy path
    if (transformed.startsWith(ghostContentPrefix)) {
      transformed = transformed.replace(ghostBase, '');
    }
    
    if (transformed.startsWith('/content/images/')) {
      transformed = '/media/ghost' + transformed;
    }
    
    // Convert to absolute URL for social sharing
    if (transformed.startsWith('/')) {
      transformed = `https://behaviorschool.com${transformed}`;
    }
    
    return transformed;
  };

  const featureImage = transformImageUrl(post.feature_image as string | undefined);
  const title = decodeHtmlEntities(post.meta_title || post.title || "Blog Post");
  const description = decodeHtmlEntities(post.meta_description || post.excerpt || post.title || "");

  const isIndexable = post.status ? post.status === 'published' : true;

  return {
    title: `${title} | Behavior School`,
    description: description,
    keywords: post.tags?.map(t => t.name).join(', '),
    alternates: {
      canonical: `https://behaviorschool.com/blog/${slug}`
    },
    openGraph: {
      type: "article",
      title: decodeHtmlEntities(post.og_title || '') || title,
      description: decodeHtmlEntities(post.og_description || '') || description,
      url: `/blog/${slug}`,
      siteName: "Behavior School",
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
      authors: ['Behavior School'],
      images: [
        {
          url: post.og_image ? transformImageUrl(post.og_image as string) : featureImage,
          width: 1200,
          height: 630,
          alt: decodeHtmlEntities(post.title || "Blog post image"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: decodeHtmlEntities(post.twitter_title || '') || title,
      description: decodeHtmlEntities(post.twitter_description || '') || description,
      images: [post.twitter_image ? transformImageUrl(post.twitter_image as string) : featureImage],
      creator: "@BehaviorSchool",
    },
    robots: {
      index: isIndexable,
      follow: isIndexable,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return notFound();

  const ghostBase = (process.env.NEXT_PUBLIC_GHOST_CONTENT_URL || 'https://ghost.behaviorschool.com').replace(/\/$/, '');
  const ghostContentPrefix = `${ghostBase}/content/images/`;
  
  const normalizeHtml = (html: string, featureImage?: string): string => {
    if (!html) return '';
    let out = html;
    
    // Remove the first occurrence of the feature image to prevent duplication
    // since we're displaying it separately in the header
    if (featureImage) {
      // Create regex to match the first img tag with the feature image
      const featureImagePath = featureImage.replace(/^https?:\/\/[^/]+/, ''); // Get path only
      const escapedPath = featureImagePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Try to match various formats of the image in HTML
      const patterns = [
        new RegExp(`<figure[^>]*>\\s*<img[^>]*src=["'][^"']*${escapedPath}[^"']*["'][^>]*>\\s*</figure>`, 'i'),
        new RegExp(`<p[^>]*>\\s*<img[^>]*src=["'][^"']*${escapedPath}[^"']*["'][^>]*>\\s*</p>`, 'i'),
        new RegExp(`<img[^>]*src=["'][^"']*${escapedPath}[^"']*["'][^>]*>`, 'i'),
      ];
      
      for (const pattern of patterns) {
        if (pattern.test(out)) {
          out = out.replace(pattern, '');
          break; // Only remove the first occurrence
        }
      }
    }
    
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
    <>
    <article className="mx-auto max-w-3xl px-6 lg:px-8 pt-20 pb-12">
      <header>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{post.title}</h1>
        {post.published_at ? (
          <p className="mt-2 text-sm text-slate-500">{new Date(post.published_at).toLocaleDateString()}</p>
        ) : null}
      </header>
      {post.feature_image ? (
        <div className="mt-6 overflow-hidden rounded-lg bg-slate-100">
          <img
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
            className="w-full h-auto object-contain"
          />
        </div>
      ) : null}
      {post.excerpt ? (
        <p className="mt-6 text-slate-700 text-lg">{post.excerpt}</p>
      ) : null}
      {post.html ? (
        <div 
          className="mt-8 prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-ul:text-slate-700 prose-ol:text-slate-700 prose-blockquote:text-slate-600 prose-blockquote:border-l-emerald-500 prose-img:rounded-lg prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: normalizeHtml(post.html, post.feature_image as string) }}
        />
      ) : null}
    </article>
    <EditPostButton ghostId={post.id as string} slug={slug} />
    </>
  );
}
