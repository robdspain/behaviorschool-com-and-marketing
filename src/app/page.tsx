import Link from "next/link";
import Image from "next/image";
import { BrainCircuit, GraduationCap, BookMarked, ArrowRight } from "lucide-react";
import { getPublishedPosts } from "@/lib/blog";

export default function Home() {
  const recentPosts = getPublishedPosts().slice(0, 3);

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="bg-[#f7f3ee] py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1f4d3f] mb-4">
                BehaviorSchool
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-[#1f4d3f] leading-tight tracking-tight mb-6">
                A calmer workflow<br className="hidden sm:block" /> for school-based BCBAs
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
                A unified suite for plan writing, exam prep, and CEUs — built by a practicing BCBA.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://plan.behaviorschool.com/signup"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-[#1f4d3f] rounded-full hover:bg-[#173a2f] transition-colors"
                >
                  Start Free Trial
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-[#1f4d3f] border border-[#1f4d3f]/40 rounded-full hover:bg-[#1f4d3f]/10 transition-colors"
                >
                  Request District Quote
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f4d3f]/70">
                <span className="rounded-full border border-[#1f4d3f]/20 bg-white/70 px-3 py-1">FERPA‑aligned</span>
                <span className="rounded-full border border-[#1f4d3f]/20 bg-white/70 px-3 py-1">District‑contract ready</span>
                <span className="rounded-full border border-[#1f4d3f]/20 bg-white/70 px-3 py-1">Built by a BCBA</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 rounded-[32px] bg-[#1f4d3f]/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[28px] border border-[#1f4d3f]/10 bg-white/80 shadow-[0_25px_80px_rgba(31,77,63,0.18)]">
                <Image
                  src="/optimized/Hero/Hero-group1-optimized.webp"
                  alt="School-based behavior team collaborating"
                  width={980}
                  height={980}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHAT WE OFFER ────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1f4d3f] mb-4">
              Core Products
            </p>
            <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900">
              Three platforms, one experience
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 — Pro */}
            <div className="group bg-[#fbfaf8] rounded-[24px] border border-[#1f4d3f]/10 p-10 flex flex-col transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(31,77,63,0.12)]">
              <div className="w-12 h-12 rounded-2xl bg-[#1f4d3f]/10 flex items-center justify-center mb-6">
                <BrainCircuit className="text-[#1f4d3f]" size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">BehaviorSchool Pro</h3>
              <p className="text-slate-600 leading-relaxed flex-1">
                AI-assisted FBA/BIP writing, IEP goals, and student data — all in one secure workspace.
              </p>
              <a
                href="https://plan.behaviorschool.com"
                className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-[#1f4d3f]"
              >
                Learn More <ArrowRight size={14} />
              </a>
            </div>

            {/* Card 2 — Exam Prep */}
            <div className="group bg-[#fbfaf8] rounded-[24px] border border-[#1f4d3f]/10 p-10 flex flex-col transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(31,77,63,0.12)]">
              <div className="w-12 h-12 rounded-2xl bg-[#1f4d3f]/10 flex items-center justify-center mb-6">
                <GraduationCap className="text-[#1f4d3f]" size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">BCBA Exam Prep</h3>
              <p className="text-slate-600 leading-relaxed flex-1">
                6th‑edition mock exams, analytics, and adaptive study flows to close skill gaps fast.
              </p>
              <a
                href="https://study.behaviorschool.com"
                className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-[#1f4d3f]"
              >
                Start Studying <ArrowRight size={14} />
              </a>
            </div>

            {/* Card 3 — CEUs */}
            <div className="group bg-[#fbfaf8] rounded-[24px] border border-[#1f4d3f]/10 p-10 flex flex-col transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(31,77,63,0.12)]">
              <div className="w-12 h-12 rounded-2xl bg-[#1f4d3f]/10 flex items-center justify-center mb-6">
                <BookMarked className="text-[#1f4d3f]" size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">ACE CEU Platform</h3>
              <p className="text-slate-600 leading-relaxed flex-1">
                ACE‑approved courses curated for school‑based practice with clean tracking.
              </p>
              <a
                href="https://learning.behaviorschool.com"
                className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-[#1f4d3f]"
              >
                Browse Courses <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ABOUT / TRUST ────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-[#f9f7f2]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-center">
            <div className="flex-shrink-0">
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-[#1f4d3f]/10 shadow-lg">
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
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1f4d3f] mb-4">
                Built by a BCBA
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-5">
                Rob Spain, M.S., BCBA, IBA
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg max-w-2xl">
                BehaviorSchool was created by a practicing school-based behavior analyst. Every tool, course, and question is shaped by the realities of public schools and the professionals who support them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BLOG ─────────────────────────────────────────────────── */}
      {recentPosts.length > 0 && (
        <section className="py-24 sm:py-32 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1f4d3f] mb-4">
                  From the Blog
                </p>
                <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900">
                  Latest Articles
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#1f4d3f]"
              >
                View all posts <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <article key={post.slug} className="bg-[#fbfaf8] rounded-[24px] border border-[#1f4d3f]/10 p-8 flex flex-col">
                  <time className="text-xs text-gray-400 font-medium mb-4 block">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-snug">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-slate-600 text-sm leading-relaxed flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <Link
                    href={`/posts/${post.slug}`}
                    className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-[#1f4d3f]"
                  >
                    Read More <ArrowRight size={14} />
                  </Link>
                </article>
              ))}
            </div>

            <div className="mt-12 sm:hidden text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1f4d3f]"
              >
                View all posts <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── CREATOR BIO ──────────────────────────────────────────── */}
      <section className="py-24 sm:py-28 bg-[#f7f3ee]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1f4d3f] mb-4">
            From the Field
          </p>
          <p className="text-slate-700 leading-relaxed text-lg">
            BehaviorSchool was built by Rob Spain, a Board Certified Behavior Analyst with 25+ years of experience in public schools. He created the tools he wished existed — practical, modern, and rooted in daily school-based work. Learn more at{" "}
            <a
              href="https://robspain.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1f4d3f] font-semibold hover:underline"
            >
              robspain.com
            </a>
            .
          </p>
        </div>
      </section>

    </main>
  );
}
