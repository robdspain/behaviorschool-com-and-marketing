export const dynamic = "force-dynamic";
import Link from "next/link";
import { getPosts, type Post } from "@/lib/ghost-hybrid";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

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
    .replace(/&#x2014;/g, '—') // em dash
    .replace(/&#8212;/g, '—')
    .replace(/&#x2013;/g, '–') // en dash
    .replace(/&#8211;/g, '–')
    .replace(/&#x2019;/g, ''') // right single quote
    .replace(/&#8217;/g, ''')
    .replace(/&#x201C;/g, '"') // left double quote
    .replace(/&#8220;/g, '"')
    .replace(/&#x201D;/g, '"') // right double quote
    .replace(/&#8221;/g, '"');
}

function PostRow({ post }: { post: Post }) {
  return (
    <div className="flex flex-col gap-1 py-4 border-b border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900">
        <Link href={`/posts/${post.slug}`}>{post.title}</Link>
      </h3>
      {post.excerpt ? <p className="text-slate-600 text-sm">{decodeHtmlEntities(post.excerpt)}</p> : null}
    </div>
  );
}

export default async function ResourcesPage() {
  const { posts } = await getPosts({ limit: 24, tag: "resources", order: "published_at desc" });
  return (
    <div className="min-h-screen bg-bs-background">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 pt-24 pb-12">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs 
            items={[
              { label: "Resources" }
            ]}
          />
        </div>
      
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Resources</h1>
      <div>
        {posts.map((post) => (
          <PostRow key={post.id} post={post} />
        ))}
      </div>
      </div>
    </div>
  );
}


