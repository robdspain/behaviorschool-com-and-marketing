import type { Metadata } from "next";
import { getPosts } from "@/lib/ghost-hybrid";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { PostList } from "@/components/post-list";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "BCBA Study & School-Based ABA Blog | Behavior School",
  description: "Expert guides on BCBA exam prep, school-based ABA practice, IEP goals, and ACT Matrix — plus free mock exams and study tools.",
  alternates: { canonical: "https://behaviorschool.com/blog" },
  openGraph: {
    title: "BCBA Study & School-Based ABA Blog | Behavior School",
    description: "Evidence-based insights for BCBAs and educators: exam prep, school-based practice, IEP goals, ACT Matrix, and free practice tools.",
    url: "https://behaviorschool.com/blog",
    siteName: "Behavior School",
    type: "website",
    images: [
      { url: "/optimized/og-image.webp", width: 1200, height: 630, alt: "Behavior School Blog" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BCBA Study & School-Based ABA Blog | Behavior School",
    description: "Guides on BCBA exam prep, school-based ABA, IEP goals, ACT Matrix, and free practice tools.",
    images: ["/optimized/og-image.webp"],
  },
  robots: { index: true, follow: true },
};

export default async function BlogPage() {
  // Try tagged posts first; if none, fall back to all posts
  const tagged = await getPosts({ limit: 24, tag: "blog", order: "published_at DESC", include: "tags,authors" });
  const posts = tagged.posts.length > 0
    ? tagged.posts
    : (await getPosts({ limit: 24, order: "published_at DESC", include: "tags,authors" })).posts;
  const baseUrl = 'https://behaviorschool.com';
  const itemList = posts.slice(0, 12).map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `${baseUrl}/blog/${encodeURIComponent(p.slug)}`,
    name: p.title,
  }));

  return (
    <div className="min-h-screen bg-bs-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <Breadcrumbs 
          items={[
            { label: "Blog" }
          ]}
        />
      </div>
      
      <Section>
        <Container>
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">BCBA Study & School-Based ABA Blog</h1>
            <p className="text-lg text-slate-600">Evidence-based guides for BCBAs and educators: exam prep, school-based practice, IEP writing, ACT Matrix, and free practice tools.</p>
          </div>

          {/* Cornerstone topics */}
          <div className="mb-10">
            <div className="bg-white/80 border-2 border-slate-200 rounded-2xl p-4">
              <div className="flex flex-wrap gap-2">
                <a className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-semibold hover:bg-emerald-100" href="/bcba-exam-prep">BCBA Exam Prep Guide</a>
                <a className="px-3 py-2 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-sm font-semibold hover:bg-blue-100" href="/behavior-study-tools">Study Tools Platform</a>
                <a className="px-3 py-2 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 text-sm font-semibold hover:bg-purple-100" href="/bcba-practice-exam">BCBA Practice Exam</a>
                <a className="px-3 py-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-sm font-semibold hover:bg-amber-100" href="/free-bcba-mock-practice-test">Free Mock Exam</a>
                <a className="px-3 py-2 rounded-lg bg-pink-50 text-pink-800 border border-pink-200 text-sm font-semibold hover:bg-pink-100" href="/school-bcba">School‑Based BCBA</a>
                <a className="px-3 py-2 rounded-lg bg-slate-50 text-slate-800 border border-slate-200 text-sm font-semibold hover:bg-slate-100" href="/iep-goals">IEP Goals</a>
                <a className="px-3 py-2 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-sm font-semibold hover:bg-teal-100" href="/act-matrix">ACT Matrix</a>
              </div>
            </div>
          </div>
        {posts.length > 0 ? (
          <PostList posts={posts} columns={3} useExternalUrl={false} />
        ) : (
          <p className="text-muted-foreground">No posts found.</p>
        )}

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Blog',
              name: 'Behavior School Blog',
              url: `${baseUrl}/blog`,
              description: 'BCBA exam prep and school‑based ABA insights with free practice tools.',
              blogPost: itemList.map((item: any) => ({ '@type': 'BlogPosting', url: item.url, headline: item.name })),
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: itemList })
          }}
        />
        </Container>
      </Section>
    </div>
  );
}

