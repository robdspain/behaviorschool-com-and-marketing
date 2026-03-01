import Link from "next/link";
import Image from "next/image";
import { BrainCircuit, GraduationCap, BookMarked, ArrowRight } from "lucide-react";
import { getPublishedPosts } from "@/lib/blog";

export default function Home() {
  const recentPosts = getPublishedPosts().slice(0, 3);

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="bg-[#1f4d3f] py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
            The Modern Toolkit for<br className="hidden sm:block" /> Behavior Analysts
          </h1>
          <p className="text-lg sm:text-xl text-green-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered tools, exam prep, and continuing education for BCBAs, RBTs, and school-based behavior professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://plan.behaviorschool.com"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-[#1f4d3f] bg-white rounded-md hover:bg-green-50 transition-colors"
            >
              Explore AI Tools
            </a>
            <a
              href="https://study.behaviorschool.com"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white border border-white/50 rounded-md hover:bg-white/10 transition-colors"
            >
              Prep for the Exam
            </a>
            <a
              href="https://learning.behaviorschool.com"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white border border-white/50 rounded-md hover:bg-white/10 transition-colors"
            >
              Earn CEUs
            </a>
          </div>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                Master the 5th Edition Task List with mock exams, detailed analytics, and our adaptive learning algorithm.
              </p>
              <a
                href="https://study.behaviorschool.com"
                className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-[#1f4d3f] hover:underline"
              >
                Start Studying <ArrowRight size={14} />
              </a>
            </div>

            {/* Card 3 — CEUs */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col">
              <div className="w-12 h-12 rounded-lg bg-[#1f4d3f]/10 flex items-center justify-center mb-6">
                <BookMarked className="text-[#1f4d3f]" size={24} strokeWidth={1.75} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">ACE CEU Platform</h3>
              <p className="text-gray-600 leading-relaxed flex-1">
                Stay current with our library of ACE-approved courses on a wide range of behavior analytic topics.
              </p>
              <a
                href="https://learning.behaviorschool.com"
                className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-[#1f4d3f] hover:underline"
              >
                Browse Courses <ArrowRight size={14} />
              </a>
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

    </main>
  );
}
