"use client";

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
  FileText,
  Target,
  BookOpen,
  Brain,
  ChevronDown,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ShimmerButton from "@/components/magicui/shimmer-button";
import NumberTicker from "@/components/magicui/number-ticker";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import ShineBorder from "@/components/magicui/shine-border";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";

const FEATURES = [
  {
    icon: FileText,
    title: "FBA-to-BIP Generator",
    description:
      "Upload or paste your Functional Behavior Assessment data and receive a comprehensive, legally-defensible Behavior Intervention Plan.",
    bullets: [
      "Generates complete BIP in under 2 minutes",
      "Aligned to district compliance standards",
      "Export to PDF or Word",
      "Editable before finalizing",
    ],
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-emerald-600/20 blur-xl" />
    ),
  },
  {
    icon: Target,
    title: "IEP Goal Generator",
    description:
      "Generate measurable, SMART IEP goals from a brief student description. Goals are aligned to state standards.",
    bullets: [
      "Behavior, academic, social-emotional domains",
      "Customizable by grade level",
      "Includes baselines & criteria",
      "Copy directly into your IEP system",
    ],
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-yellow-500/20 to-amber-600/20 blur-xl" />
    ),
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
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-blue-600/20 blur-xl" />
    ),
  },
  {
    icon: Brain,
    title: "ACT Module",
    description:
      "Acceptance & Commitment Training tools designed specifically for school-based behavioral support. Build psychological flexibility.",
    bullets: [
      "ACT Matrix worksheets",
      "Values identification exercises",
      "Defusion & mindfulness activities",
      "Progress tracking tools",
    ],
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-purple-600/20 blur-xl" />
    ),
  },
];

const PRICING = [
  {
    name: "Free",
    price: 0,
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
    price: 29,
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
    price: 19,
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

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function ProPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 pt-32 pb-20 sm:pt-36 sm:pb-24">
        {/* Animated grid background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 to-transparent" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AnimatedGradientText className="mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="text-emerald-900 dark:text-white font-semibold">BehaviorSchool Pro</span>
            </AnimatedGradientText>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
          >
            <span className="text-white">Stop Spending Hours on</span>
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-300 bg-clip-text text-transparent animate-gradient">
              Paperwork
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg sm:text-xl text-emerald-100 mb-10 leading-relaxed"
          >
            AI-powered behavior tools that write BIPs, generate IEP goals, and give you a searchable goal bank — so you can focus on students, not documents.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="https://plan.behaviorschool.com/signup">
              <ShimmerButton
                className="h-14 px-8 text-lg font-bold rounded-xl w-full sm:w-auto"
                background="linear-gradient(135deg, #E3B23C 0%, #d4a12d 100%)"
                shimmerColor="#ffffff"
              >
                <span className="text-emerald-900">Start Free Trial</span>
                <ArrowRight className="ml-2 h-5 w-5 text-emerald-900" />
              </ShimmerButton>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-emerald-200 text-sm"
          >
            14-day free trial · No credit card required
          </motion.p>

          {/* Quick stats with Number Tickers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-3 gap-6 mt-14 max-w-lg mx-auto"
          >
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-1">
                <NumberTicker value={2} delay={0.5} />
                <span>min</span>
              </p>
              <p className="text-emerald-200 text-xs mt-1">Avg. BIP generation</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-0">
                <NumberTicker value={1000} delay={0.6} />
                <span>+</span>
              </p>
              <p className="text-emerald-200 text-xs mt-1">Goal bank entries</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-0">
                <NumberTicker value={100} delay={0.7} />
                <span>%</span>
              </p>
              <p className="text-emerald-200 text-xs mt-1">FERPA compliant</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features - Bento Grid */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Everything Your Team Needs
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Four powerful tools, one platform. Built by BCBAs for school behavior teams.
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            <BentoGrid className="lg:grid-rows-2">
              {FEATURES.map((feature, i) => (
                <BentoCard
                  key={feature.title}
                  name={feature.title}
                  className={feature.className}
                  background={feature.background}
                  Icon={feature.icon}
                  description={feature.description}
                  href="#"
                  cta="Learn more →"
                />
              ))}
            </BentoGrid>
          </FadeInSection>
        </div>
      </section>

      {/* FERPA Compliance */}
      <FadeInSection>
        <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50 border-y border-emerald-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <Shield className="h-12 w-12 text-emerald-700 mx-auto mb-4" />
              </motion.div>
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
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-xl p-6 border border-emerald-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
              <p className="text-lg text-slate-600">Start free. Upgrade when you&apos;re ready. Cancel anytime.</p>
            </div>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING.map((plan, i) => (
              <FadeInSection key={plan.name} delay={i * 0.1}>
                {plan.highlight ? (
                  <ShineBorder
                    className="w-full"
                    color={["#047857", "#10b981", "#047857"]}
                    borderWidth={2}
                  >
                    <div className="p-8 bg-white rounded-xl relative w-full">
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        MOST POPULAR
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                      <p className="text-sm text-slate-500 mb-4">{plan.description}</p>
                      <p className="text-4xl font-extrabold text-slate-900 mb-1 flex items-baseline">
                        <span>$</span>
                        <NumberTicker value={plan.price} delay={0.5 + i * 0.1} />
                        <span className="text-base font-normal text-slate-500">{plan.period}</span>
                      </p>
                      {plan.name === "Team" && (
                        <p className="text-xs text-slate-400 mb-4">Billed annually · 5 seat minimum</p>
                      )}
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                            <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Link href={plan.href}>
                        <Button className="w-full rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                          {plan.cta}
                        </Button>
                      </Link>
                    </div>
                  </ShineBorder>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="rounded-2xl p-8 border-2 border-slate-200 bg-white"
                  >
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                    <p className="text-sm text-slate-500 mb-4">{plan.description}</p>
                    <p className="text-4xl font-extrabold text-slate-900 mb-1 flex items-baseline">
                      <span>$</span>
                      <NumberTicker value={plan.price} delay={0.5 + i * 0.1} />
                      <span className="text-base font-normal text-slate-500">{plan.period}</span>
                    </p>
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
                      <Button className="w-full rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-900">
                        {plan.cta}
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FadeInSection>
        <section className="py-20 bg-slate-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQ.map((item, i) => (
                <motion.details
                  key={item.q}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="group bg-white rounded-xl border border-slate-200 overflow-hidden"
                >
                  <summary className="cursor-pointer px-6 py-4 flex items-center justify-between font-semibold text-slate-900 hover:bg-slate-50 transition-colors">
                    {item.q}
                    <ChevronDown className="h-5 w-5 text-slate-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-4 text-sm text-slate-600 leading-relaxed">{item.a}</div>
                </motion.details>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Final CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Save Hours Every Week?</h2>
            <p className="text-lg text-emerald-100 mb-8">
              Join BCBAs and school psychologists nationwide who are using BehaviorSchool Pro to spend less time on paperwork and more time with students.
            </p>
            <Link href="https://plan.behaviorschool.com/signup">
              <ShimmerButton
                className="h-14 px-10 text-lg font-bold rounded-xl"
                background="linear-gradient(135deg, #E3B23C 0%, #d4a12d 100%)"
                shimmerColor="#ffffff"
              >
                <span className="text-emerald-900">Start Free Trial</span>
                <ArrowRight className="ml-2 h-5 w-5 text-emerald-900" />
              </ShimmerButton>
            </Link>
            <p className="mt-4 text-emerald-200 text-sm">14-day free trial · No credit card required · Cancel anytime</p>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}
