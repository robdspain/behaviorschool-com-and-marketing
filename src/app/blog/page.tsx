import type { Metadata } from "next";
import { getPosts } from "@/lib/ghost-hybrid";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { PostList } from "@/components/post-list";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { BlogNewsletterSignup } from "@/components/blog/NewsletterSignup";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "BCBA Study & School ABA Blog | Behavior School",
  description: "Expert guides on BCBA exam prep, school-based ABA, IEP goals, and ACT Matrix. Plus free mock exams and study tools for behavior analysts. Read now!",
  alternates: { canonical: "https://behaviorschool.com/blog" },
  openGraph: {
    title: "BCBA Study & School ABA Blog | Behavior School",
    description: "Expert guides on BCBA exam prep, school-based ABA, IEP goals, and ACT Matrix. Plus free mock exams and study tools for behavior analysts. Read now!",
    url: "https://behaviorschool.com/blog",
    siteName: "Behavior School",
    type: "website",
    images: [
      { url: "/optimized/og-image.webp", width: 1200, height: 630, alt: "Behavior School Blog" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BCBA Study & School ABA Blog | Behavior School",
    description: "Expert guides on BCBA exam prep, school-based ABA, IEP goals, and ACT Matrix. Plus free mock exams and study tools for behavior analysts. Read now!",
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
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
                <a className="px-3 py-2 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-sm font-semibold hover:bg-blue-100" href="/bcba-test-questions">Sample BCBA Exam Questions</a>
                <a className="px-3 py-2 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 text-sm font-semibold hover:bg-purple-100" href="/bcba-practice-exam">BCBA Practice Exam</a>
                <a className="px-3 py-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-sm font-semibold hover:bg-amber-100" href="/free-bcba-mock-exam">BCBA Mock Exam Free</a>
                <a className="px-3 py-2 rounded-lg bg-cyan-50 text-cyan-800 border border-cyan-200 text-sm font-semibold hover:bg-cyan-100" href="/ai-for-behavior-analysts">AI for Behavior Analysts</a>
                <a className="px-3 py-2 rounded-lg bg-pink-50 text-pink-800 border border-pink-200 text-sm font-semibold hover:bg-pink-100" href="/school-bcba">School‑Based BCBA</a>
                <a className="px-3 py-2 rounded-lg bg-slate-50 text-slate-800 border border-slate-200 text-sm font-semibold hover:bg-slate-100" href="/iep-goals">IEP Goals</a>
                <a className="px-3 py-2 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-sm font-semibold hover:bg-teal-100" href="/act-matrix">ACT Matrix</a>
              </div>
            </div>
          </div>

          <div className="mb-10 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-bold text-slate-900">School ABA practice guides</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <a className="text-sm font-semibold text-emerald-800 hover:text-emerald-950" href="/blog/trauma-informed-and-trauma-assumed-practices-in-a-school-based-setting">Trauma-informed ABA in schools</a>
                <a className="text-sm font-semibold text-emerald-800 hover:text-emerald-950" href="/blog/integrating-skill-based-treatment-sbt-and-acceptance-commitment-training-act-in-schools">SBT and ACT in schools</a>
                <a className="text-sm font-semibold text-emerald-800 hover:text-emerald-950" href="/blog/how-functional-language-progresses-a-guide-to-stage-specific-interventions">Functional language stages</a>
                <a className="text-sm font-semibold text-emerald-800 hover:text-emerald-950" href="/blog/values-vs-preference-assessments-in-school-based-aba-interventions">Values vs preference assessments</a>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-bold text-slate-900">FBA, ACT, and PBIS guides</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <a className="text-sm font-semibold text-blue-800 hover:text-blue-950" href="/blog/deep-research-functional-behavior-assessments-fbas-leading-to-act-based-interventions">FBAs leading to ACT interventions</a>
                <a className="text-sm font-semibold text-blue-800 hover:text-blue-950" href="/blog/functional-behavior-assessment-in-public-schools">FBA tools and methods for schools</a>
                <a className="text-sm font-semibold text-blue-800 hover:text-blue-950" href="/blog/bcbas-in-schools-for-pbis">BCBAs in schools for PBIS</a>
                <a className="text-sm font-semibold text-blue-800 hover:text-blue-950" href="/blog/how-to-write-a-behavior-intervention-plan">How to write a BIP</a>
              </div>
            </div>
          </div>

          <div className="mb-10 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
            <h2 className="text-lg font-bold text-slate-900">Rob Spain&apos;s School BCBA field notes</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
              For school BCBA systems, PBIS implementation, and FBA/BIP workflow articles written from Rob&apos;s district practice, read the companion resource library on robspain.com.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <a className="text-sm font-semibold text-emerald-800 hover:text-emerald-950" href="https://robspain.com/bcba-in-schools/">BCBA in schools</a>
              <a className="text-sm font-semibold text-emerald-800 hover:text-emerald-950" href="https://robspain.com/blog/how-bcbas-support-pbis-without-becoming-tier-3-crisis/">PBIS without Tier 3 overload</a>
              <a className="text-sm font-semibold text-emerald-800 hover:text-emerald-950" href="https://robspain.com/blog/school-bcba-fba-bip-requests/">FBA/BIP request systems</a>
              <a className="text-sm font-semibold text-emerald-800 hover:text-emerald-950" href="https://robspain.com/transformation-program/">Transformation Program</a>
            </div>
          </div>
        {posts.length > 0 ? (
          <>
            <PostList posts={posts} columns={3} useExternalUrl={false} hideImages />
            <BlogNewsletterSignup />
          </>
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
