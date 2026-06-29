import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BrainCircuit, GraduationCap, ArrowRight, CheckCircle2 } from "lucide-react";
import { getPublishedPosts } from "@/lib/blog";
import { Hero } from "@/components/ui/hero";
import { HomepageEmailCapture } from "@/components/ui/homepage-email-capture";

export const metadata: Metadata = {
  title: "BehaviorSchool | School BCBA Tools & Resources",
  description:
    "AI-powered tools, BCBA exam prep, and CE courses for school-based behavior analysts. Built by a BCBA for real school practice.",
  alternates: {
    canonical: "https://behaviorschool.com",
  },
  openGraph: {
    title: "BehaviorSchool | School BCBA Tools & Resources",
    description:
      "AI-powered tools, BCBA exam prep, and CE courses for school-based behavior analysts. Built by a BCBA for real school practice.",
    type: "website",
    url: "https://behaviorschool.com",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "BehaviorSchool tools and resources for school BCBAs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BehaviorSchool | School BCBA Tools & Resources",
    description:
      "AI-powered tools, BCBA exam prep, and CE courses for school-based behavior analysts.",
    images: ["/optimized/og-image.webp"],
  },
};

export default function Home() {
  const recentPosts = getPublishedPosts().slice(0, 3);

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <Hero
        eyebrow="The Modern Toolkit"
        title="Everything a Behavior Analyst"
        highlight="Actually Needs"
        subtitle="AI-powered tools, exam prep, and continuing education designed from the ground up to meet the real-world needs of BCBAs, RBTs, and school-based behavior professionals."
        primaryCta={{ href: "/free-bcba-practice-exam", label: "Take Free BCBA Practice Exam" }}
        variant="brand"
      />

      {/* ─── HIGH-INTENT BCBA PRACTICE PATH ───────────────────────── */}
      <section className="border-y border-emerald-100 bg-emerald-50/70 py-10">
        <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1f4d3f]">
              Free BCBA Exam Prep
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-950 sm:text-3xl">
              Start with 10 free BCBA questions, instant score, and rationales.
            </h2>
            <div className="mt-4 grid gap-2 text-sm font-medium text-gray-700 sm:grid-cols-3">
              {["No credit card", "Score immediately", "Know what to study next"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 flex-none text-emerald-700" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <Link
            href="/free-bcba-practice-exam"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1f4d3f] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#173a30]"
          >
            Take the free exam
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ─── WHAT WE OFFER ────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1f4d3f] mb-3">
              What We Offer
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything a behavior professional needs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Card 1 — Pro */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col">
              <div className="w-12 h-12 rounded-lg bg-[#1f4d3f]/10 flex items-center justify-center mb-6">
                <BrainCircuit className="text-[#1f4d3f]" size={24} strokeWidth={1.75} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">BehaviorSchool Pro</h3>
              <p className="text-gray-600 leading-relaxed flex-1">
                Our suite of AI-powered tools for FBA/BIP writing, IEP goals, and student data management.
              </p>
              <a
                href="https://plan.behaviorschool.com"
                className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-[#1f4d3f] hover:underline"
              >
                Learn More <ArrowRight size={14} />
              </a>
            </div>

            {/* Card 2 — Exam Prep */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col">
              <div className="w-12 h-12 rounded-lg bg-[#1f4d3f]/10 flex items-center justify-center mb-6">
                <GraduationCap className="text-[#1f4d3f]" size={24} strokeWidth={1.75} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">BCBA Exam Prep</h3>
              <p className="text-gray-600 leading-relaxed flex-1">
                Start with free BCBA practice questions, then move into mock exams, detailed analytics, and adaptive study paths.
              </p>
              <div className="mt-6 grid gap-2 text-sm">
                <Link href="/free-bcba-practice-exam" className="inline-flex items-center gap-1.5 font-semibold text-[#1f4d3f] hover:underline">
                  Free 10-question BCBA exam <ArrowRight size={14} />
                </Link>
                <Link href="/bcba-exam-prep" className="inline-flex items-center gap-1.5 font-semibold text-[#1f4d3f] hover:underline">
                  BCBA exam prep <ArrowRight size={14} />
                </Link>
                <Link href="/bcba-practice-exam" className="inline-flex items-center gap-1.5 font-semibold text-[#1f4d3f] hover:underline">
                  BCBA practice exam <ArrowRight size={14} />
                </Link>
                <Link href="/bcba-test-questions" className="inline-flex items-center gap-1.5 font-semibold text-[#1f4d3f] hover:underline">
                  Sample BCBA exam questions <ArrowRight size={14} />
                </Link>
                <Link href="/free-bcba-mock-exam" className="inline-flex items-center gap-1.5 font-semibold text-[#1f4d3f] hover:underline">
                  BCBA mock exam free <ArrowRight size={14} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── ABOUT / TRUST ────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
            <div className="flex-shrink-0">
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-[#1f4d3f]/10 shadow-md">
                <Image
                  src="/profile-Rob.webp"
                  alt="Rob Spain, M.S., BCBA, IBA"
                  width={192}
                  height={192}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#1f4d3f] mb-3">
                Built by a BCBA, for BCBAs
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Rob Spain, M.S., BCBA, IBA
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                BehaviorSchool was founded by Rob Spain, M.S., BCBA, IBA, a practicing school-based behavior analyst. Every tool, course, and question is designed from the ground up to meet the real-world needs of professionals in the field.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BLOG ─────────────────────────────────────────────────── */}
      {recentPosts.length > 0 && (
        <section className="py-20 sm:py-28 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#1f4d3f] mb-3">
                  From the Blog
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Latest Articles
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#1f4d3f] hover:underline"
              >
                View all posts <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <article key={post.slug} className="bg-white rounded-xl border border-gray-200 p-7 flex flex-col">
                  <time className="text-xs text-gray-400 font-medium mb-3 block">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-gray-600 text-sm leading-relaxed flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <Link
                    href={`/posts/${post.slug}`}
                    className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-[#1f4d3f] hover:underline"
                  >
                    Read More <ArrowRight size={14} />
                  </Link>
                </article>
              ))}
            </div>

            <div className="mt-10 sm:hidden text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1f4d3f] hover:underline"
              >
                View all posts <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <HomepageEmailCapture />

      {/* ─── CREATOR BIO ──────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1f4d3f] mb-4">
            From a BCBA in the Field, For You
          </p>
          <blockquote className="text-gray-600 leading-relaxed text-lg italic">
            Behavior School and its suite of tools were created by Rob Spain, a Board Certified Behavior Analyst (BCBA) with over 25+ years of experience in public schools. He faced the daily struggle of paperwork, outdated tools, and a lack of practical resources, so he built what he needed: a modern, AI-powered toolkit for today&apos;s behavior analyst. Learn more about Rob&apos;s work at{" "}
            <a
              href="https://robspain.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1f4d3f] font-semibold not-italic hover:underline"
            >
              robspain.com
            </a>
            .
          </blockquote>
        </div>
      </section>

    </main>
  );
}
