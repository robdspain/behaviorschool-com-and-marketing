import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BrainCircuit,
  GraduationCap,
  BookMarked,
  ShieldCheck,
  Sparkles,
  Target,
  FileText,
} from "lucide-react";
import { getPublishedPosts } from "@/lib/blog";
import { EmailCapture } from "@/components/EmailCapture";

export default function Home() {
  const recentPosts = getPublishedPosts().slice(0, 3);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#f7f3ee]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#e4b63d22,transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f4d3f12_1px,transparent_1px),linear-gradient(to_bottom,#1f4d3f12_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#1f4d3f]/20 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f4d3f]">
                BehaviorSchool Platform
              </div>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#1f4d3f] leading-tight tracking-tight">
                The operating system for school-based behavior teams.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
                Plan writing, exam prep, and CEUs in one ecosystem — built by a practicing BCBA for the realities of public schools.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href="https://plan.behaviorschool.com"
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
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-600">
                {[
                  "FERPA-aligned workflows",
                  "District-contract ready",
                  "Built by a BCBA",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[#1f4d3f]/10 bg-white/80 px-4 py-3"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-8 rounded-[32px] bg-[#1f4d3f]/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[28px] border border-[#1f4d3f]/10 bg-white/80 shadow-[0_30px_90px_rgba(31,77,63,0.18)]">
                <Image
                  src="/optimized/Hero/Hero-group1-optimized.webp"
                  alt="School-based behavior team collaborating"
                  width={980}
                  height={980}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden sm:block rounded-3xl border border-[#1f4d3f]/10 bg-white px-5 py-4 shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f4d3f]/70">New</p>
                <p className="text-sm font-semibold text-slate-900">AI FBA & BIP drafting</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PLATFORM SUITE ───────────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1f4d3f] mb-4">
                Platform Suite
              </p>
              <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900">
                Three platforms, one ecosystem
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl">
                Move from case-level work to systems leadership with tools that share data, tone, and standards.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/products"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1f4d3f]"
              >
                View all products <ArrowRight size={14} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "BehaviorSchool Pro",
                description:
                  "AI-assisted FBA/BIP drafting, IEP goals, and student data — all in one secure workspace.",
                href: "https://plan.behaviorschool.com",
                image: "/optimized/BIP-Writer/BIP-Writer-Team.webp",
                icon: BrainCircuit,
              },
              {
                title: "BCBA Exam Prep",
                description:
                  "6th-edition mock exams, analytics, and adaptive study flows to close skill gaps fast.",
                href: "https://study.behaviorschool.com",
                image: "/optimized/OperatingSystem/DD83BB21-6F33-4A94-BF67-311EDDE6D309.webp",
                icon: GraduationCap,
              },
              {
                title: "Learning Platform",
                description:
                  "ACE-approved courses curated for school-based practice with clean tracking.",
                href: "https://learning.behaviorschool.com",
                image: "/optimized/Course/course-hero.webp",
                icon: BookMarked,
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="group rounded-[28px] border border-[#1f4d3f]/10 bg-[#fbfaf8] overflow-hidden flex flex-col shadow-[0_20px_60px_rgba(31,77,63,0.08)]"
                >
                  <div className="relative h-44">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-[#1f4d3f]/10 flex items-center justify-center mb-6">
                      <Icon className="text-[#1f4d3f]" size={22} strokeWidth={1.6} />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">{card.title}</h3>
                    <p className="text-slate-600 leading-relaxed flex-1">{card.description}</p>
                    <a
                      href={card.href}
                      className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-[#1f4d3f]"
                    >
                      Learn more <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FREE TOOLS ───────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-[#f9f7f2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1f4d3f] mb-4">
                Free Tools
              </p>
              <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900">
                Free tools built for real school teams
              </h2>
              <p className="mt-5 text-lg text-slate-600 leading-relaxed">
                Every free tool is built to save time, improve accuracy, and model the same standards we use in paid systems.
              </p>
              <div className="mt-8 grid gap-4">
                {[
                  {
                    title: "ACT-Informed FBA & BIP Generator",
                    description: "Generate a full ACT-informed plan in minutes.",
                    href: "/act-fba-bip",
                    icon: Sparkles,
                  },
                  {
                    title: "IEP Goal Writer",
                    description: "Write compliant, research-backed behavior goals fast.",
                    href: "/iep-goal-writer",
                    icon: Target,
                  },
                  {
                    title: "Caseload Analyzer",
                    description: "Audit workload and identify red flags before burnout hits.",
                    href: "/caseload-analyzer",
                    icon: ShieldCheck,
                  },
                ].map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <a
                      key={tool.title}
                      href={tool.href}
                      className="group rounded-2xl border border-[#1f4d3f]/10 bg-white px-5 py-4 flex items-center gap-4 hover:shadow-md transition"
                    >
                      <span className="h-11 w-11 rounded-2xl bg-[#1f4d3f]/10 flex items-center justify-center">
                        <Icon className="text-[#1f4d3f]" size={18} />
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{tool.title}</h3>
                        <p className="text-sm text-slate-600">{tool.description}</p>
                      </div>
                      <ArrowRight className="ml-auto text-[#1f4d3f] opacity-0 group-hover:opacity-100 transition" size={16} />
                    </a>
                  );
                })}
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-[28px] border border-[#1f4d3f]/10 bg-white p-6 shadow-lg">
                <Image
                  src="/optimized/IEP-Goal/IEP-Goal-Writing.webp"
                  alt="IEP goal writing"
                  width={640}
                  height={420}
                  className="rounded-2xl object-cover"
                />
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1f4d3f]/70">
                    Downloadable Guides
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">
                    Step-by-step playbooks for school BCBAs
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Professional layouts, editable templates, and immediate implementation support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── EMAIL CAPTURE ────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-[#1f4d3f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 mb-6">
            <FileText className="text-white" size={24} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Stay in the Loop
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Get weekly tips, new tool announcements, and practical strategies for school-based behavior support.
          </p>
          <div className="flex justify-center">
            <EmailCapture />
          </div>
          <p className="mt-4 text-sm text-white/50">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* ─── BUILT BY A BCBA ──────────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-white">
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
                BehaviorSchool is designed by a practicing school-based behavior analyst. Every tool, course, and workflow reflects real district constraints and the students behind the data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRANSFORMATION PROGRAM ─────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-[#f7f3ee] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#1f4d3f22,transparent_55%)]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#1f4d3f]/20 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f4d3f] mb-6">
                Live Cohort · Starts March 26
              </div>
              <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900 mb-6">
                The Transformation Program
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                A 6-week live cohort that turns overwhelmed school BCBAs into high-impact behavior leaders. Walk away with a district-ready playbook, referral systems, and the confidence to lead.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "6 live sessions with Rob Spain, BCBA",
                  "Done-for-you templates and systems",
                  "Small cohort — 20 spots max",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-700">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1f4d3f]/10 flex items-center justify-center">
                      <svg className="w-3 h-3 text-[#1f4d3f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/transformation-program"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-[#1f4d3f] rounded-full hover:bg-[#173a2f] transition-colors"
                >
                  Learn More & Enroll
                </a>
                <a
                  href="https://calendly.com/robspain/behavior-school-transformation-system-phone-call"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-[#1f4d3f] border border-[#1f4d3f]/40 rounded-full hover:bg-[#1f4d3f]/10 transition-colors"
                >
                  Book a Call
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-[28px] border border-[#1f4d3f]/10 bg-white p-8 shadow-[0_30px_90px_rgba(31,77,63,0.12)]">
                <div className="text-center mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e4b63d] mb-2">Early Bird Pricing</p>
                  <p className="text-4xl font-bold text-slate-900">$2,499</p>
                  <p className="text-sm text-slate-500 line-through">$2,997</p>
                  <p className="text-sm text-[#1f4d3f] font-semibold mt-1">Save $498 — ends March 9</p>
                </div>
                <div className="border-t border-slate-100 pt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-4">What&apos;s Included</p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• 6 live 2-hour sessions (Thursdays 6-8 PM PT)</li>
                    <li>• Complete transformation playbook</li>
                    <li>• Referral system templates</li>
                    <li>• FA planning guides & scripts</li>
                    <li>• Lifetime access to materials</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BLOG ─────────────────────────────────────────────────── */}
      {recentPosts.length > 0 && (
        <section className="py-24 sm:py-32 bg-[#fbfaf8]">
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
                <article
                  key={post.slug}
                  className="bg-white rounded-[24px] border border-[#1f4d3f]/10 p-8 flex flex-col shadow-[0_20px_40px_rgba(31,77,63,0.08)]"
                >
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
                    Read article <ArrowRight size={14} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
