import Link from "next/link";
import Image from "next/image";
import {
  BrainCircuit,
  GraduationCap,
  BookMarked,
  Users,
  BadgeCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const products = [
  {
    name: "BehaviorSchool Pro",
    href: "https://plan.behaviorschool.com",
    description:
      "AI-assisted FBA/BIP drafting, IEP goals, and student data — all in one secure workspace.",
    icon: BrainCircuit,
  },
  {
    name: "BCBA Exam Prep",
    href: "https://study.behaviorschool.com",
    description:
      "6th-edition mock exams, analytics, and adaptive study flows to close skill gaps fast.",
    icon: GraduationCap,
  },
  {
    name: "Learning Platform",
    href: "https://learning.behaviorschool.com",
    description:
      "ACE-approved courses curated for school-based practice with clean tracking.",
    icon: BookMarked,
  },
  {
    name: "Supervision Hub",
    href: "https://supervision.behaviorschool.com",
    description:
      "Hour tracking, session logs, and supervisor marketplace for fieldwork compliance.",
    icon: Users,
  },
  {
    name: "SchoolRBT",
    href: "https://schoolrbt.com",
    description:
      "RBT exam prep and school implementation resources for behavior technicians.",
    icon: BadgeCheck,
  },
  {
    name: "Behavior Study Tools",
    href: "https://behaviorstudytools.com",
    description:
      "Flashcards, SAFMEDS, and focused practice to strengthen exam readiness.",
    icon: Sparkles,
  },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#f7f3ee]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#e4b63d22,transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f4d3f12_1px,transparent_1px),linear-gradient(to_bottom,#1f4d3f12_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#1f4d3f]/20 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f4d3f]">
                Product Suite
              </div>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#1f4d3f] leading-tight tracking-tight">
                Tools for every stage of your behavior career.
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
                From exam prep to supervision to daily planning — BehaviorSchool products work together to support school-based and clinical teams.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href="#products"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-[#1f4d3f] rounded-full hover:bg-[#173a2f] transition-colors"
                >
                  Explore products
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-[#1f4d3f] border border-[#1f4d3f]/40 rounded-full hover:bg-[#1f4d3f]/10 transition-colors"
                >
                  Request a demo
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -inset-8 rounded-[32px] bg-[#1f4d3f]/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[28px] border border-[#1f4d3f]/10 bg-white/80 shadow-[0_30px_90px_rgba(31,77,63,0.18)]">
                <Image
                  src="/optimized/Hero/Hero-group1-optimized.webp"
                  alt="Behavior professionals collaborating"
                  width={640}
                  height={480}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="py-24 sm:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1f4d3f] mb-4">
              Current Products
            </p>
            <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900">
              One ecosystem, six platforms
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl">
              Each product is built to stand alone or integrate with the others — pick what fits your workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const Icon = product.icon;
              return (
                <article
                  key={product.name}
                  className="group rounded-[28px] border border-[#1f4d3f]/10 bg-[#fbfaf8] p-8 flex flex-col shadow-[0_20px_60px_rgba(31,77,63,0.08)] hover:shadow-[0_20px_60px_rgba(31,77,63,0.14)] transition-shadow"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#1f4d3f]/10 flex items-center justify-center mb-6">
                    <Icon className="text-[#1f4d3f]" size={22} strokeWidth={1.6} />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    {product.name}
                  </h3>
                  <p className="text-slate-600 leading-relaxed flex-1">
                    {product.description}
                  </p>
                  <a
                    href={product.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-[#1f4d3f]"
                  >
                    Learn more <ArrowRight size={14} />
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1f4d3f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Need help choosing the right product?
          </h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            Contact the BehaviorSchool team and we will point you to the best fit for your role.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-[#1f4d3f] bg-[#e4b63d] rounded-full hover:bg-[#d4a82d] transition-colors"
          >
            Contact the team
          </Link>
        </div>
      </section>
    </main>
  );
}
