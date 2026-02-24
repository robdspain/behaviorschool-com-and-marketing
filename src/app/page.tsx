"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Shield, CheckCircle, Sparkles, Zap } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ShimmerButton from "@/components/magicui/shimmer-button";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";

const PRO_TOOLS = [
  {
    title: "FBA-to-BIP Generator",
    description: "Upload FBA data and get a comprehensive, legally-defensible Behavior Intervention Plan in minutes.",
    icon: "📋",
    href: "/fba-to-bip",
  },
  {
    title: "IEP Goal Generator",
    description: "AI-powered measurable IEP goals aligned to state standards. SMART, specific, and classroom-ready.",
    icon: "🎯",
    href: "/iep-goal-generator",
  },
  {
    title: "IEP Goal Bank",
    description: "Searchable library of 1,000+ pre-written behavior & academic goals. Filter by domain, grade, and need.",
    icon: "📚",
    href: "/iep-goal-bank",
  },
  {
    title: "ACT Module",
    description: "Acceptance & Commitment Training tools designed for school-based behavioral support teams.",
    icon: "🧠",
    href: "/act-matrix",
  },
];

const TRUST_ITEMS = [
  { icon: Shield, label: "FERPA Compliant", sub: "Student data never stored" },
  { icon: CheckCircle, label: "Evidence-Based", sub: "Grounded in ABA research" },
  { icon: Users, label: "Built for Schools", sub: "By BCBAs, for school teams" },
  { icon: Zap, label: "AI-Powered", sub: "Save hours every week" },
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

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bs-background,#FAF3E0)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 pt-32 pb-20 sm:pt-36 sm:pb-24">
        {/* Animated grid background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AnimatedGradientText className="mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="text-emerald-900 dark:text-white font-semibold">Now in BehaviorSchool Pro</span>
            </AnimatedGradientText>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
          >
            <span className="text-white">AI-Powered Behavior Tools</span>
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-300 bg-clip-text text-transparent animate-gradient">
              for School Teams
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg sm:text-xl text-emerald-100 mb-10 leading-relaxed"
          >
            Generate BIPs from FBA data, write measurable IEP goals, and access a complete goal bank — all FERPA compliant. Used by BCBAs and school psychologists nationwide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/pro/demo">
              <ShimmerButton
                className="h-14 px-8 text-lg font-bold rounded-xl w-full sm:w-auto"
                background="linear-gradient(135deg, #E3B23C 0%, #d4a12d 100%)"
                shimmerColor="#ffffff"
              >
                <span className="text-emerald-900">Try Free for 14 Days</span>
                <ArrowRight className="ml-2 h-5 w-5 text-emerald-900" />
              </ShimmerButton>
            </Link>
            <Link href="/pro">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-2 border-white/30 text-white hover:bg-white/10 rounded-xl w-full sm:w-auto">
                  See Pricing
                </Button>
              </motion.div>
            </Link>
            <Link href="/free-study-plan">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-2 border-[#e4b63d]/60 text-[#e4b63d] hover:bg-[#e4b63d]/10 rounded-xl w-full sm:w-auto">
                  Get Free Study Plan
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-emerald-200 text-sm"
          >
            No credit card required · Cancel anytime
          </motion.p>
        </div>
      </section>

      <section className="bg-[#e4b63d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <FadeInSection>
            <div className="rounded-2xl bg-[#e4b63d] text-center text-emerald-950 px-6 py-10 sm:py-12 shadow-sm">
              <p className="text-2xl sm:text-3xl font-bold">
                New to BehaviorSchool? Start here →
              </p>
              <p className="mt-3 text-lg font-medium">
                Get your free 7-day personalized study plan
              </p>
              <div className="mt-6 flex justify-center">
                <Link href="/free-study-plan">
                  <Button className="h-12 px-6 text-base font-semibold rounded-xl bg-emerald-950 text-[#e4b63d] hover:bg-emerald-900">
                    Get My Free Plan
                  </Button>
                </Link>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_ITEMS.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex-shrink-0 w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center"
                >
                  <item.icon className="h-5 w-5 text-emerald-700" />
                </motion.div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{item.label}</p>
                  <p className="text-slate-500 text-xs">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tool Showcase */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Your Complete Behavior Support Toolkit
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Everything school behavior teams need — powered by AI, built by BCBAs.
              </p>
            </div>
          </FadeInSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRO_TOOLS.map((tool, i) => (
              <FadeInSection key={tool.title} delay={i * 0.1}>
                <Link href={tool.href} className="group block h-full">
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-2xl p-6 h-full transition-all duration-200 hover:shadow-xl"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      className="text-4xl mb-4"
                    >
                      {tool.icon}
                    </motion.div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{tool.description}</p>
                  </motion.div>
                </Link>
              </FadeInSection>
            ))}
          </div>

          <FadeInSection delay={0.4}>
            <div className="text-center mt-10">
              <Link href="/pro">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="h-12 px-8 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                    See All Pro Features
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* FERPA Compliance Section */}
      <FadeInSection>
        <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50 border-y border-emerald-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <Shield className="h-12 w-12 text-emerald-700 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">FERPA Compliant by Design</h2>
            <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
              Student data is never stored on our servers. All AI processing happens in real-time with no data retention.
              Built from the ground up to meet the privacy standards your district requires.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: Shield, text: "No student PII stored" },
                { icon: Shield, text: "SOC 2 infrastructure" },
                { icon: Shield, text: "Encrypted in transit & at rest" },
              ].map((item, i) => (
                <motion.span
                  key={item.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 bg-white border border-emerald-200 rounded-full px-4 py-2 text-sm font-medium text-emerald-800"
                >
                  <item.icon className="h-4 w-4" /> {item.text}
                </motion.span>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Social Proof */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Built for School Behavior Teams
              </h2>
              <p className="text-lg text-slate-600">Designed for BCBAs, school psychologists, and special education teams.</p>
            </div>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "AI-assisted BIP drafting designed to cut hours of writing time into minutes — with FERPA compliance built in.",
                name: "FBA-to-BIP Generator",
                role: "Draft behavior plans from assessment data",
              },
              {
                quote: "Every goal is measurable, classroom-ready, and aligned with best practices in behavior analysis.",
                name: "IEP Goal Bank",
                role: "Function-based goals at your fingertips",
              },
              {
                quote: "Built by a school BCBA who understands the unique challenges of educational settings and FERPA requirements.",
                name: "School-First Design",
                role: "By practitioners, for practitioners",
              },
            ].map((testimonial, i) => (
              <FadeInSection key={testimonial.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-slate-50 rounded-2xl p-6 border border-slate-200 h-full hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, starIndex) => (
                      <motion.div
                        key={starIndex}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.1 + starIndex * 0.05 }}
                      >
                        <svg className="h-5 w-5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-slate-700 mb-4 leading-relaxed italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </motion.div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-emerald-100 mb-10 max-w-xl mx-auto">
              Start free. Upgrade when you&apos;re ready. Plans for individual practitioners and full school teams.
            </p>
          </FadeInSection>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {[
              {
                name: "Individual",
                price: "$29/mo",
                period: "Billed annually",
                features: [
                  "Unlimited FBA-to-BIP",
                  "Unlimited IEP Goals",
                  "Full Goal Bank access",
                  "ACT Module",
                ],
                popular: false,
              },
              {
                name: "Team",
                price: "$19/seat/mo",
                period: "Billed annually · 5 seat minimum",
                features: [
                  "Everything in Individual",
                  "Team collaboration",
                  "Admin dashboard",
                  "Priority support",
                ],
                popular: true,
              },
            ].map((plan, i) => (
              <FadeInSection key={plan.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  className={`rounded-2xl p-6 text-left shadow-xl ${
                    plan.popular
                      ? "bg-white"
                      : "bg-white/10 backdrop-blur border border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-lg font-bold ${plan.popular ? "text-slate-900" : "text-white"}`}>
                      {plan.name}
                    </h3>
                    {plan.popular && (
                      <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
                        POPULAR
                      </span>
                    )}
                  </div>
                  <p className={`text-sm mb-4 ${plan.popular ? "text-slate-500" : "text-emerald-200"}`}>
                    For {plan.name === "Team" ? "school & district teams" : "BCBAs & school psychologists"}
                  </p>
                  <p className={`text-3xl font-extrabold mb-1 ${plan.popular ? "text-slate-900" : "text-white"}`}>
                    {plan.price}
                  </p>
                  <p className={`text-xs mb-4 ${plan.popular ? "text-slate-400" : "text-emerald-300"}`}>
                    {plan.period}
                  </p>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className={`flex items-center gap-2 ${
                          plan.popular ? "text-slate-700" : "text-emerald-100"
                        }`}
                      >
                        <CheckCircle
                          className={`h-4 w-4 flex-shrink-0 ${
                            plan.popular ? "text-emerald-600" : "text-amber-300"
                          }`}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </FadeInSection>
            ))}
          </div>

          <FadeInSection delay={0.3}>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pro/demo">
                <ShimmerButton
                  className="h-14 px-8 text-lg font-bold rounded-xl w-full sm:w-auto"
                  background="linear-gradient(135deg, #E3B23C 0%, #d4a12d 100%)"
                  shimmerColor="#ffffff"
                >
                  <span className="text-emerald-900">Start Free Trial</span>
                  <ArrowRight className="ml-2 h-5 w-5 text-emerald-900" />
                </ShimmerButton>
              </Link>
              <Link href="/pro">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-2 border-white/30 text-white hover:bg-white/10 rounded-xl w-full sm:w-auto">
                    Compare Plans
                  </Button>
                </motion.div>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Existing Community Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <FadeInSection>
              <div className="space-y-6 lg:space-y-8">
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">School BCBA Community That Drives Change</h2>
                  <p className="text-base sm:text-lg leading-relaxed text-slate-700">
                    We&apos;re not just a resource hub — we&apos;re a network of school-based BCBAs, educators, and leaders committed to building better school-wide behavior support systems.
                  </p>
                </div>
                <div className="pt-2">
                  <Link href="https://community.behaviorschool.com">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl w-full sm:w-auto min-w-[200px]">
                        Join the School BCBA Community
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <div className="relative order-first lg:order-last">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-2xl overflow-hidden shadow-2xl"
                >
                  <Image 
                    src="/Community/comein-coffee-people-optimized.webp" 
                    alt="Community collaboration"
                    className="w-full h-auto object-cover"
                    width={584}
                    height={389}
                  />
                </motion.div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Existing Tools Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 leading-tight">Free School BCBA Resources</h2>
            </div>
          </FadeInSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              { title: "BCBA Exam Prep", href: "/behavior-study-tools", img: "/thumbnails/hero-thumb.webp" },
              { title: "BCBA Supervision", href: "/supervisors", img: "/thumbnails/supervision-thumb.webp" },
              { title: "IEP Goal Writer", href: "/iep-goals", img: "/thumbnails/iep-goal-thumb.webp" },
              { title: "Behavior Plan Writer", href: "/behavior-plans", img: "/thumbnails/bip-writer-thumb.webp" },
            ].map((card, i) => (
              <FadeInSection key={card.title} delay={i * 0.1}>
                <Link href={card.href} className="group block h-full">
                  <motion.div
                    whileHover={{ y: -8, scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden h-full"
                  >
                    <div className="p-4 sm:p-6 flex flex-col h-full">
                      <div className="text-center flex-grow flex flex-col">
                        <Image
                          src={card.img}
                          alt={card.title}
                          className="w-full h-24 sm:h-32 object-contain mb-3 sm:mb-4"
                          width={128}
                          height={128}
                        />
                        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 leading-tight">{card.title}</h3>
                        <div className="mt-auto">
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className="block w-full bg-emerald-600 group-hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                          >
                            Details
                          </motion.span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      <div className="sr-only">
        <h2>About Behavior School</h2>
        <p>
          Behavior School is an online community and toolkit for school-based BCBAs, behavior analysts in schools, and education professionals. We provide BCBA exam prep, BCBA practice exams, supervision tools, IEP goal writing, and behavior intervention plan templates.
        </p>
      </div>
    </div>
  );
}
