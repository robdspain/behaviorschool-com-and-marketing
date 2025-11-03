export const dynamic = "force-dynamic";
import Link from "next/link";
import type { Metadata } from "next";
import { getPosts, type Post } from "@/lib/ghost-hybrid";
import { templates } from "@/data/templates";
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

export const metadata: Metadata = {
  title: "Resources | Behavior School",
  description: "Downloadable templates and helpful links for school-based behavior analysts.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false, noimageindex: true } },
};

function PostRow({ post }: { post: Post }) {
  return (
    <div className="flex flex-col gap-1 py-4 border-b border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900">
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
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

      {/* Downloadable Templates */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-3">Downloadable Templates</h2>
        <div className="space-y-3">
          {templates.map(t => (
            <div key={t.url} className="flex items-start justify-between gap-4 border border-slate-200 rounded-lg p-4 bg-white">
              <div>
                <Link href={t.url} target="_blank" className="text-emerald-700 hover:text-emerald-800 font-medium">
                  {t.name}
                </Link>
                <p className="text-slate-600 text-sm mt-1">{t.description}</p>
              </div>
              <Link href={t.url} target="_blank" className="text-sm text-emerald-700 hover:text-emerald-800 font-medium">Open</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Blog resources tagged as resources */}
      {posts.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Guides & Articles</h2>
          <div>
            {posts.map((post) => (
              <PostRow key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
      </div>
    </div>
  );
}

