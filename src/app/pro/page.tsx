import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Shield,
  CheckCircle,
  Star,
  Sparkles,
  Zap,
  Clock,
  Users,
  FileText,
  Target,
  BookOpen,
  Brain,
  ChevronDown,
} from "lucide-react";

export const metadata: Metadata = {
  title: "BehaviorSchool Pro — AI Behavior Tools for School Teams",
  description:
    "BehaviorSchool Pro: AI-powered FBA-to-BIP generator, IEP Goal Writer, 1,000+ Goal Bank, ACT Module. FERPA compliant. Start your 14-day free trial.",
  alternates: { canonical: "https://behaviorschool.com/pro" },
  openGraph: {
    title: "BehaviorSchool Pro — AI Behavior Tools for School Teams",
    description:
      "AI-powered FBA-to-BIP, IEP Goal Writer, Goal Bank & ACT Module. FERPA compliant. 14-day free trial.",
    url: "/pro",
    siteName: "Behavior School",
    images: [{ url: "/og-image.webp", width: 1200, height: 630 }],
  },
};

const FEATURES = [
  {
    icon: FileText,
    title: "FBA-to-BIP Generator",
    description:
      "Upload or paste your Functional Behavior Assessment data and receive a comprehensive, legally-defensible Behavior Intervention Plan. Includes antecedent strategies, replacement behaviors, reinforcement schedules, and crisis protocols.",
    bullets: [
      "Generates complete BIP in under 2 minutes",
      "Aligned to district compliance standards",
      "Export to PDF or Word",
      "Editable before finalizing",
    ],
    image: "/images/pro/fba-to-bip.png",
  },
  {
    icon: Target,
    title: "IEP Goal Generator",
    description:
      "Generate measurable, SMART IEP goals from a brief student description. Goals are aligned to state standards and ready for your next IEP meeting.",
    bullets: [
      "Behavior, academic, social-emotional domains",
      "Customizable by grade level",
      "Includes baselines & criteria",
      "Copy directly into your IEP system",
    ],
    image: "/images/pro/iep-goal-generator.png",
  },
  {
    icon: BookOpen,
    title: "IEP Goal Bank",
    description:
      "Search and filter 1,000+ pre-written, expert-reviewed IEP goals. Every goal is measurable, specific, and classroom-ready.",
    bullets: [
      "Filter by domain, grade, and need area",
      "Goals written by practicing BCBAs",
      "Regular updates with new goals",
      "Save favorites to your account",
    ],
    image: "/images/pro/iep-goal-bank.png",
  },
  {
    icon: Brain,
    title: "ACT Module",
    description:
      "Acceptance & Commitment Training tools designed specifically for school-based behavioral support. Help students build psychological flexibility through values-based action.",
    bullets: [
      "ACT Matrix worksheets",
      "Values identification exercises",
      "Defusion & mindfulness activities",
      "Progress tracking tools",
    ],
    image: "/images/pro/act-module.png",
  },
];

const PRICING = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "Try our tools with limited access",
    features: [
      "3 generations per month",
      "Basic FBA-to-BIP",
      "Basic IEP Goal Generator",
      "Limited Goal Bank access",
    ],
    cta: "Get Started",
    href: "https://plan.behaviorschool.com/signup",
    highlight: false,
  },
  {
    name: "Individual",
    price: "$29",
    period: "/mo",
    description: "For BCBAs & school psychologists",
    features: [
      "Unlimited FBA-to-BIP",
      "Unlimited IEP Goals",
      "Full Goal Bank (1,000+ goals)",
      "ACT Module",
      "PDF & Word export",
      "Email support",
    ],
    cta: "Start Free Trial",
    href: "https://plan.behaviorschool.com/signup?plan=individual",
    highlight: false,
  },
  {
    name: "Team",
    price: "$19",
    period: "/seat/mo",
    description: "For school & district teams",
    features: [
      "Everything in Individual",
      "5+ seats",
      "Team collaboration",
      "Admin dashboard & usage reports",
      "Shared goal libraries",
      "Priority support",
      "Custom onboarding",
    ],
    cta: "Start Free Trial",
    href: "https://plan.behaviorschool.com/signup?plan=team",
    highlight: true,
  },
];

const FAQ = [
  {
    q: "Is BehaviorSchool Pro FERPA compliant?",
    a: "Yes. We never store student personally identifiable information (PII) on our servers. All AI processing happens in real-time with zero data retention. Our infrastructure runs on SOC 2 certified providers with end-to-end encryption.",
  },
  {
    q: "Can I try it before committing?",
    a: "Absolutely. Every plan starts with a 14-day free trial — no credit card required. You also get 3 free generations per month on the free tier forever.",
  },
  {
    q: "What does the AI actually generate?",
    a: "Our AI creates draft documents (BIPs, IEP goals) based on your input. Every output is fully editable. The AI assists — you remain the professional making the final clinical decisions.",
  },
  {
    q: "Can my whole team use it?",
    a: "Yes! Our Team plan supports 5+ seats with shared goal libraries, a team admin dashboard, and usage reporting. Contact us for district-wide pricing.",
  },
  {
    q: "How do I cancel?",
    a: "Cancel anytime from your account settings. No penalties, no hassle. Your data exports are always available.",
  },
  {
    q: "Do you offer discounts for conferences?",
    a: "Yes! CALABA 2026 attendees get 40% off the first year. Use code CALABA2026 at signup or visit our booth.",
  },
];

export default function ProPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 pt-32 pb-20 sm:pt-36 sm:pb-24">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-600/30 border border-emerald-400/30 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span className="text-emerald-100 text-sm font-medium">BehaviorSchool Pro</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Stop Spending Hours on<br className="hidden sm:block" />
            <span className="text-amber-300">Paperwork</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-emerald-100 mb-10 leading-relaxed">
            AI-powered behavior tools that write BIPs, generate IEP goals, and give you a searchable goal bank — so you can focus on students, not documents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="https://plan.behaviorschool.com/signup">
              <Button size="lg" className="h-14 px-8 text-lg font-bold bg-amber-400 hover:bg-amber-300 text-emerald-900 rounded-xl shadow-lg shadow-amber-400/25 w-full sm:w-auto">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-emerald-200 text-sm">14-day free trial · No credit card required</p>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-6 mt-14 max-w-lg mx-auto">
            {[
              { value: "2 min", label: "Avg. BIP generation" },
              { value: "1,000+", label: "Goal bank entries" },
              { value: "100%", label: "FERPA compliant" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">{s.value}</p>
                <p className="text-emerald-200 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Everything Your Team Needs</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Four powerful tools, one platform. Built by BCBAs for school behavior teams.</p>
          </div>
          <div className="space-y-20">
            {FEATURES.map((feature, i) => (
              <div key={feature.title} className={`flex flex-col lg:flex-row gap-10 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                {/* Product mockup */}
                <div className="lg:w-1/2">
                  <div className="rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={feature.image}
                      alt={`${feature.title} interface mockup`}
                      width={800}
                      height={600}
                      className="w-full h-auto"
                      priority={i === 0}
                    />
                  </div>
                </div>
                <div className="lg:w-1/2 space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FERPA Compliance */}
      <section className="py-16 bg-emerald-50 border-y border-emerald-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Shield className="h-12 w-12 text-emerald-700 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-900 mb-4">FERPA Compliant by Design</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We built BehaviorSchool Pro from the ground up with student privacy as a core requirement — not an afterthought.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Zero PII Storage", desc: "Student personally identifiable information is never saved to our servers. Inputs are processed in real-time and discarded." },
              { title: "SOC 2 Infrastructure", desc: "Our cloud infrastructure is hosted on SOC 2 Type II certified providers with continuous monitoring." },
              { title: "End-to-End Encryption", desc: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). No plaintext student data ever." },
              { title: "No Model Training", desc: "Your data is never used to train AI models. Your inputs remain yours." },
              { title: "District-Ready", desc: "We provide a Data Privacy Agreement (DPA) template for district procurement teams." },
              { title: "Audit Logging", desc: "Team plans include full audit logs for administrator oversight and compliance reporting." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 border border-emerald-200">
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-slate-600">Start free. Upgrade when you&apos;re ready. Cancel anytime.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 border-2 ${
                  plan.highlight
                    ? "border-emerald-600 shadow-xl shadow-emerald-100 relative"
                    : "border-slate-200"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{plan.description}</p>
                <p className="text-4xl font-extrabold text-slate-900 mb-1">
                  {plan.price}
                  <span className="text-base font-normal text-slate-500">{plan.period}</span>
                </p>
                {plan.name === "Team" && (
                  <p className="text-xs text-slate-400 mb-4">Billed annually · 5 seat minimum</p>
                )}
                {plan.name === "Individual" && (
                  <p className="text-xs text-slate-400 mb-4">Billed annually</p>
                )}
                {plan.name === "Free" && <div className="mb-4" />}
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button
                    className={`w-full rounded-xl font-bold ${
                      plan.highlight
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <details key={item.q} className="group bg-white rounded-xl border border-slate-200 overflow-hidden">
                <summary className="cursor-pointer px-6 py-4 flex items-center justify-between font-semibold text-slate-900 hover:bg-slate-50 transition-colors">
                  {item.q}
                  <ChevronDown className="h-5 w-5 text-slate-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-4 text-sm text-slate-600 leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 to-emerald-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Save Hours Every Week?</h2>
          <p className="text-lg text-emerald-100 mb-8">
            Join BCBAs and school psychologists nationwide who are using BehaviorSchool Pro to spend less time on paperwork and more time with students.
          </p>
          <Link href="https://plan.behaviorschool.com/signup">
            <Button size="lg" className="h-14 px-10 text-lg font-bold bg-amber-400 hover:bg-amber-300 text-emerald-900 rounded-xl shadow-lg shadow-amber-400/25">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="mt-4 text-emerald-200 text-sm">14-day free trial · No credit card required · Cancel anytime</p>
        </div>
      </section>
    </div>
  );
}
