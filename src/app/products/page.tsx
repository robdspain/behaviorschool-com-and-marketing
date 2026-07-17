import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BookOpenCheck,
  ClipboardCheck,
  GraduationCap,
  Layers3,
  UsersRound,
} from "lucide-react";

export const metadata: Metadata = {
  title: "The BehaviorSchool Suite | School-Based Behavior Practice",
  description:
    "Explore BehaviorSchool exam prep, SchoolRBT, professional development, and upcoming planning and supervision tools for school-based behavior professionals.",
};

const availableProducts = [
  {
    number: "01",
    stage: "Prepare",
    name: "Behavior Study Tools",
    audience: "For BCBA candidates",
    description:
      "Begin with a working 10-question diagnostic, then use focused practice to identify what to study next.",
    details: ["BCBA diagnostic", "Exam-focused practice", "Review by content area"],
    href: "https://study.behaviorschool.com/diagnostic/bcba",
    cta: "Start the BCBA diagnostic",
    image: "/product-suite/bcba-diagnostic.png",
    imageAlt: "Behavior Study Tools BCBA diagnostic screen",
    icon: GraduationCap,
    tone: "light",
  },
  {
    number: "02",
    stage: "Support",
    name: "SchoolRBT",
    audience: "For RBT candidates and school teams",
    description:
      "School-centered RBT exam practice begins with a live diagnostic that candidates can use before creating an account.",
    details: ["RBT diagnostic", "Task-list review", "School-relevant practice"],
    href: "https://study.behaviorschool.com/onboarding/rbt",
    cta: "Start the RBT diagnostic",
    image: "/product-suite/school-rbt.png",
    imageAlt: "SchoolRBT diagnostic screen",
    icon: BookOpenCheck,
    tone: "mint",
  },
  {
    number: "03",
    stage: "Lead",
    name: "Transformation Program",
    audience: "For school-based BCBAs",
    description:
      "Cohort-based professional development for moving from repeated crisis response toward stronger assessment, implementation, and systems leadership.",
    details: [
      "School-based functional analysis",
      "ACT-informed tools",
      "Implementation systems",
    ],
    href: "/transformation-program",
    cta: "Explore the program",
    image: "/product-suite/transformation-program.png",
    imageAlt: "BehaviorSchool Transformation Program page",
    icon: UsersRound,
    tone: "gold",
  },
] as const;

const upcomingProducts = [
  {
    name: "BehaviorSchool Pro",
    stage: "Plan",
    description:
      "A focused workspace for school-based FBA and BIP drafting, IEP goals, and student plan exports.",
    href: "https://plan.behaviorschool.com",
    cta: "View the preview",
    icon: ClipboardCheck,
  },
  {
    name: "Supervision Workspace",
    stage: "Supervise",
    description:
      "A shared workspace for fieldwork documentation, progress review, and required records. Account creation and hour tracking are not available yet.",
    href: "/supervisors",
    cta: "Get launch updates",
    icon: UsersRound,
  },
  {
    name: "Learning Library",
    stage: "Keep learning",
    description:
      "A dedicated home for school-specific professional learning beyond the live Transformation Program.",
    href: "/contact",
    cta: "Contact BehaviorSchool",
    icon: Layers3,
  },
] as const;

const toneClasses = {
  light: "bg-white",
  mint: "bg-[#edf5f0]",
  gold: "bg-[#f5eedc]",
};

export default function ProductsPage() {
  return (
    <main className="overflow-hidden bg-[#f8f7f3] text-[#14231f]">
      <section className="border-b border-[#173f33]/15 bg-[#0d2b23] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-14 sm:px-8 lg:min-h-[610px] lg:grid-cols-[0.82fr_1.18fr] lg:px-10 lg:py-16">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f3c84b]">
              One connected offering
            </p>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">
              The BehaviorSchool Suite
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-8 text-white/72 sm:text-xl">
              Prepare for certification, strengthen school-based practice, and grow into systems leadership through one clear product family.
            </p>
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-white/82">
              <span>Exam readiness</span>
              <span>School practice</span>
              <span>Professional development</span>
            </div>
            <a
              href="#suite"
              className="mt-10 inline-flex h-12 items-center gap-3 bg-[#f3c84b] px-5 font-semibold text-[#14231f] transition-colors hover:bg-[#ffd967]"
            >
              Explore the suite
              <ArrowDown aria-hidden="true" size={18} />
            </a>
          </div>

          <div className="relative hidden min-h-[470px] lg:block" aria-label="BehaviorSchool product previews">
            <div className="absolute left-0 top-0 w-[82%] overflow-hidden border border-white/20 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
              <div className="flex h-8 items-center gap-1.5 border-b border-black/10 bg-[#f4f2ec] px-3">
                <span className="h-2 w-2 rounded-full bg-[#d56b5c]" />
                <span className="h-2 w-2 rounded-full bg-[#dab340]" />
                <span className="h-2 w-2 rounded-full bg-[#4d9b71]" />
              </div>
              <Image
                src="/product-suite/bcba-diagnostic.png"
                alt="Behavior Study Tools diagnostic preview"
                width={1280}
                height={800}
                priority
                className="aspect-[16/10] w-full object-cover object-top"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-[62%] overflow-hidden border border-white/20 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.34)]">
              <div className="flex h-8 items-center justify-between border-b border-black/10 bg-[#f4f2ec] px-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#173f33]">
                  Professional learning
                </span>
              </div>
              <Image
                src="/product-suite/transformation-program.png"
                alt="Transformation Program preview"
                width={1280}
                height={800}
                priority
                className="aspect-[16/10] w-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#173f33]/15 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10">
          <p className="max-w-2xl text-base leading-7 text-[#51645d]">
            Start with the product that fits today. Upcoming products are labeled clearly so you know what is usable now and what is still being built.
          </p>
          <div className="flex flex-wrap gap-5 text-xs font-semibold uppercase tracking-[0.16em]">
            <span className="inline-flex items-center gap-2 text-[#1f6b50]">
              <span className="h-2 w-2 rounded-full bg-[#1f8a61]" /> Available now
            </span>
            <span className="inline-flex items-center gap-2 text-[#8a6820]">
              <span className="h-2 w-2 rounded-full bg-[#d5a82c]" /> Coming soon
            </span>
          </div>
        </div>
      </section>

      <section id="suite" aria-labelledby="suite-heading">
        <div className="sr-only">
          <h2 id="suite-heading">Available BehaviorSchool products</h2>
        </div>
        {availableProducts.map((product, index) => {
          const Icon = product.icon;
          return (
            <article
              key={product.name}
              className={`border-b border-[#173f33]/15 ${toneClasses[product.tone]}`}
            >
              <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-10 lg:py-28">
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-[#8b6c1f]">{product.number}</span>
                    <span className="h-px w-10 bg-[#173f33]/30" />
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f6b50]">
                      Available now
                    </span>
                  </div>
                  <div className="mt-8 flex items-center gap-3 text-[#1f6b50]">
                    <Icon aria-hidden="true" size={21} strokeWidth={1.8} />
                    <span className="text-sm font-semibold uppercase tracking-[0.14em]">
                      {product.stage}
                    </span>
                  </div>
                  <h3 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
                    {product.name}
                  </h3>
                  <p className="mt-3 text-sm font-semibold text-[#173f33]">{product.audience}</p>
                  <p className="mt-6 max-w-xl text-lg leading-8 text-[#51645d]">
                    {product.description}
                  </p>
                  <ul className="mt-7 grid gap-3 text-sm text-[#263b34] sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                    {product.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d5a82c]" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                  {product.href.startsWith("/") ? (
                    <Link
                      href={product.href}
                      className="mt-9 inline-flex h-12 items-center gap-3 bg-[#173f33] px-5 font-semibold text-white transition-colors hover:bg-[#245846]"
                    >
                      {product.cta}
                      <ArrowRight aria-hidden="true" size={18} />
                    </Link>
                  ) : (
                    <a
                      href={product.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-9 inline-flex h-12 items-center gap-3 bg-[#173f33] px-5 font-semibold text-white transition-colors hover:bg-[#245846]"
                    >
                      {product.cta}
                      <ArrowRight aria-hidden="true" size={18} />
                    </a>
                  )}
                </div>

                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="overflow-hidden border border-[#173f33]/20 bg-white shadow-[0_28px_70px_rgba(20,35,31,0.13)]">
                    <div className="flex h-10 items-center justify-between border-b border-[#173f33]/12 bg-[#f4f2ec] px-4">
                      <div className="flex gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#d56b5c]" />
                        <span className="h-2 w-2 rounded-full bg-[#dab340]" />
                        <span className="h-2 w-2 rounded-full bg-[#4d9b71]" />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#51645d]">
                        Live product view
                      </span>
                    </div>
                    <Image
                      src={product.image}
                      alt={product.imageAlt}
                      width={1280}
                      height={800}
                      className="aspect-[16/10] w-full object-cover object-top"
                    />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section id="coming-soon" className="bg-[#102f27] py-20 text-white sm:py-28" aria-labelledby="coming-soon-heading">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-8 border-b border-white/15 pb-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f3c84b]">
                Product roadmap
              </p>
              <h2 id="coming-soon-heading" className="mt-4 text-4xl font-semibold sm:text-5xl">
                Coming soon
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-white/68 lg:justify-self-end">
              These products belong to the same suite, but they are not currently available for active use. Each link leads to an honest preview or launch-update page.
            </p>
          </div>

          <div className="divide-y divide-white/15">
            {upcomingProducts.map((product, index) => {
              const Icon = product.icon;
              const content = (
                <>
                  <div className="flex items-start gap-4">
                    <span className="mt-1 font-mono text-sm text-[#f3c84b]">0{index + 4}</span>
                    <Icon aria-hidden="true" className="mt-0.5 text-white/72" size={22} strokeWidth={1.7} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f3c84b]">
                      {product.stage} · Coming soon
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold sm:text-3xl">{product.name}</h3>
                    <p className="mt-3 max-w-2xl leading-7 text-white/66">{product.description}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 font-semibold text-white lg:justify-self-end">
                    {product.cta}
                    <ArrowRight aria-hidden="true" size={18} />
                  </span>
                </>
              );

              return product.href.startsWith("/") ? (
                <Link
                  key={product.name}
                  href={product.href}
                  className="grid gap-6 py-9 transition-colors hover:bg-white/[0.035] lg:grid-cols-[90px_1fr_auto] lg:items-center lg:px-4"
                >
                  {content}
                </Link>
              ) : (
                <a
                  key={product.name}
                  href={product.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid gap-6 py-9 transition-colors hover:bg-white/[0.035] lg:grid-cols-[90px_1fr_auto] lg:items-center lg:px-4"
                >
                  {content}
                </a>
              );
            })}
          </div>

          <div className="mt-14 overflow-hidden border border-white/15 bg-white">
            <Image
              src="/product-suite/supervision-coming-soon.png"
              alt="BehaviorSchool supervision tools coming-soon page"
              width={1280}
              height={800}
              className="aspect-[16/7] w-full object-cover object-top"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#f3c84b] py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#173f33]">Not sure where to begin?</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight text-[#14231f] sm:text-4xl">
              Tell us what you are working toward.
            </h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-12 w-fit items-center gap-3 bg-[#173f33] px-5 font-semibold text-white transition-colors hover:bg-[#245846]"
          >
            Contact BehaviorSchool
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
