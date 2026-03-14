export const dynamic = "force-dynamic";
import Link from "next/link";
import type { Metadata } from "next";
import { getPosts, type Post } from "@/lib/ghost-hybrid";
import { templates } from "@/data/templates";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ArrowRight, BookOpen, ClipboardList, FileText, GraduationCap, Sparkles } from "lucide-react";

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
    .replace(/&#x2014;/g, '\u2014')
    .replace(/&#8212;/g, '\u2014')
    .replace(/&#x2013;/g, '\u2013')
    .replace(/&#8211;/g, '\u2013')
    .replace(/&#x2019;/g, '\u2019')
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#x201C;/g, '\u201C')
    .replace(/&#8220;/g, '\u201C')
    .replace(/&#x201D;/g, '\u201D')
    .replace(/&#8221;/g, '\u201D');
}

export const metadata: Metadata = {
  title: "Resources | Behavior School",
  description: "Tools, templates, and research-backed guides for school-based behavior analysts.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false, noimageindex: true } },
};

function PostRow({ post }: { post: Post }) {
  return (
    <div className="flex flex-col gap-2 py-5 border-b border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900">
        <Link href={`/blog/${post.slug}`} className="hover:text-emerald-700">
          {post.title}
        </Link>
      </h3>
      {post.excerpt ? <p className="text-slate-600 text-sm leading-relaxed">{decodeHtmlEntities(post.excerpt)}</p> : null}
    </div>
  );
}

const FEATURED_TOOLS = [
  {
    title: "ACT Matrix Live Demo",
    description: "See how student interview answers auto-populate the ACT Matrix in real time.",
    href: "/act-matrix",
    icon: Sparkles,
    tag: "Demo",
  },
  {
    title: "IEP Behavior Goal Writer",
    description: "Build Level 5 SMART goals with baseline, fluency, generalization, and maintenance.",
    href: "/iep-goal-writer",
    icon: ClipboardList,
    tag: "Tool",
  },
  {
    title: "ABC Function Finder",
    description: "Analyze ABC data and generate function hypotheses + intervention ideas.",
    href: "/abc-function-finder",
    icon: FileText,
    tag: "Tool",
  },
  {
    title: "RBT Hours Calculator",
    description: "Track supervision hours and export progress summaries.",
    href: "/rbt-hours",
    icon: GraduationCap,
    tag: "Calculator",
  },
  {
    title: "ACT Matrix Builder",
    description: "Fill the full matrix and print a clean, shareable worksheet.",
    href: "/act-matrix-builder",
    icon: BookOpen,
    tag: "Worksheet",
  },
];

export default async function ResourcesPage() {
  const { posts } = await getPosts({ limit: 24, tag: "resources", order: "published_at desc" });

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 pt-16 pb-12">
          <div className="mb-8">
            <Breadcrumbs items={[{ label: "Resources" }]} />
          </div>
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
            <div>
              <p className="text-xs font-semibold tracking-[0.3em] uppercase text-emerald-300 mb-4">
                2026 Resource Library
              </p>
              <h1 className="text-4xl sm:text-5xl font-black leading-tight">
                Tools, templates, and
                <span className="text-emerald-300"> real‑world workflows</span>
                <br />for school‑based BCBAs.
              </h1>
              <p className="text-slate-300 text-lg mt-4 max-w-2xl">
                A modern, searchable toolkit to reduce paperwork, improve fidelity, and deliver measurable behavior change.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="#tools"
                  className="inline-flex items-center gap-2 bg-emerald-500 text-slate-900 font-bold px-5 py-3 rounded-xl"
                >
                  Explore Tools <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#templates"
                  className="inline-flex items-center gap-2 border border-slate-700 text-white px-5 py-3 rounded-xl"
                >
                  Download Templates
                </Link>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-emerald-300 text-xs uppercase tracking-wide font-semibold mb-1">FBA/BIP</div>
                  <div className="text-slate-100">ACT‑aligned tools and interview workflows</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-emerald-300 text-xs uppercase tracking-wide font-semibold mb-1">IEP Goals</div>
                  <div className="text-slate-100">Level 5 SMART goals with maintenance & generalization</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-emerald-300 text-xs uppercase tracking-wide font-semibold mb-1">Data</div>
                  <div className="text-slate-100">Practical calculators and tracking sheets</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-emerald-300 text-xs uppercase tracking-wide font-semibold mb-1">Guides</div>
                  <div className="text-slate-100">Research‑backed articles and classroom examples</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section id="tools" className="py-12">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Featured Tools</h2>
            <p className="text-sm text-slate-500">Updated for 2026</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURED_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-emerald-300 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-emerald-700" />
                    </div>
                    <span className="text-[10px] uppercase tracking-wide bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                      {tool.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-700">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {tool.description}
                  </p>
                  <div className="mt-4 text-sm font-semibold text-emerald-700 inline-flex items-center gap-2">
                    Open Tool <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* TEMPLATES */}
      <section id="templates" className="py-12 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Downloadable Templates</h2>
            <span className="text-sm text-slate-500">Free & printable</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {templates.map((t) => (
              <div key={t.url} className="flex items-start justify-between gap-4 border border-slate-200 rounded-2xl p-5 bg-white">
                <div>
                  <Link href={t.url} target="_blank" className="text-emerald-700 hover:text-emerald-800 font-semibold">
                    {t.name}
                  </Link>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">{t.description}</p>
                </div>
                <Link href={t.url} target="_blank" className="text-sm text-emerald-700 hover:text-emerald-800 font-semibold">Open</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GUIDES */}
      {posts.length > 0 && (
        <section className="py-12">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Guides & Articles</h2>
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              {posts.map((post) => (
                <PostRow key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
