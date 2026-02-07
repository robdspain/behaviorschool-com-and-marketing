import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
export const metadata: Metadata = {
  title: "AI-Powered Behavior Tools for School Teams | BehaviorSchool",
  description:
    "AI-powered FBA-to-BIP generator, IEP Goal Writer, Goal Bank & ACT modules — FERPA compliant. Used by BCBAs and school psychologists nationwide. Try free today.",
  keywords: "BehaviorSchool Pro, FBA to BIP, IEP goal generator, IEP goal bank, ACT module, school BCBA tools, FERPA compliant, behavior intervention plan, school behavior support, AI behavior tools",
  alternates: { canonical: "https://behaviorschool.com/" },
  openGraph: {
    type: "website",
    title: "AI-Powered Behavior Tools for School Teams | BehaviorSchool",
    description:
      "AI-powered FBA-to-BIP generator, IEP Goal Writer, Goal Bank & ACT modules — FERPA compliant. Used by BCBAs and school psychologists nationwide.",
    url: "/",
    siteName: "Behavior School",
    locale: "en_US",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "BehaviorSchool — AI-Powered Behavior Tools for School Teams",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-Powered Behavior Tools for School Teams | BehaviorSchool",
    description:
      "AI-powered FBA-to-BIP generator, IEP Goal Writer, Goal Bank & ACT modules — FERPA compliant. Try free today.",
    images: ["/og-image.webp"],
    creator: "@BehaviorSchool",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  other: {
    "google-site-verification": process.env.GOOGLE_SITE_VERIFICATION || "",
  },
};
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, School, Download, Brain, Shield, Star, CheckCircle, Sparkles, Zap } from "lucide-react";
import { CalabaBanner } from "@/components/ui/calaba-banner";

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

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bs-background,#FAF3E0)]">
      {/* CALABA Banner */}
      <CalabaBanner />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 pt-32 pb-20 sm:pt-36 sm:pb-24">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-600/30 border border-emerald-400/30 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span className="text-emerald-100 text-sm font-medium">Now in BehaviorSchool Pro</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            AI-Powered Behavior Tools<br className="hidden sm:block" />
            <span className="text-amber-300">for School Teams</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-emerald-100 mb-10 leading-relaxed">
            Generate BIPs from FBA data, write measurable IEP goals, and access a complete goal bank — all FERPA compliant. Used by BCBAs and school psychologists nationwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="https://app.behaviorschool.com/signup">
              <Button size="lg" className="h-14 px-8 text-lg font-bold bg-amber-400 hover:bg-amber-300 text-emerald-900 rounded-xl shadow-lg shadow-amber-400/25 w-full sm:w-auto">
                Try Free for 14 Days
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="https://app.behaviorschool.com/pricing">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-2 border-white/30 text-white hover:bg-white/10 rounded-xl w-full sm:w-auto">
                See Pricing
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-emerald-200 text-sm">No credit card required · Cancel anytime</p>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{item.label}</p>
                  <p className="text-slate-500 text-xs">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tool Showcase */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Your Complete Behavior Support Toolkit
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything school behavior teams need — powered by AI, built by BCBAs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRO_TOOLS.map((tool) => (
              <Link key={tool.title} href={tool.href} className="group">
                <div className="bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-2xl p-6 h-full transition-all duration-200 hover:shadow-lg">
                  <div className="text-4xl mb-4">{tool.icon}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{tool.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/pro">
              <Button size="lg" className="h-12 px-8 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                See All Pro Features
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FERPA Compliance Section */}
      <section className="py-16 bg-emerald-50 border-y border-emerald-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="h-12 w-12 text-emerald-700 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">FERPA Compliant by Design</h2>
          <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
            Student data is never stored on our servers. All AI processing happens in real-time with no data retention.
            Built from the ground up to meet the privacy standards your district requires.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="inline-flex items-center gap-2 bg-white border border-emerald-200 rounded-full px-4 py-2 text-sm font-medium text-emerald-800">
              <Shield className="h-4 w-4" /> No student PII stored
            </span>
            <span className="inline-flex items-center gap-2 bg-white border border-emerald-200 rounded-full px-4 py-2 text-sm font-medium text-emerald-800">
              <Shield className="h-4 w-4" /> SOC 2 infrastructure
            </span>
            <span className="inline-flex items-center gap-2 bg-white border border-emerald-200 rounded-full px-4 py-2 text-sm font-medium text-emerald-800">
              <Shield className="h-4 w-4" /> Encrypted in transit & at rest
            </span>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Trusted by School Behavior Teams
            </h2>
            <p className="text-lg text-slate-600">Used by BCBAs, school psychologists, and special education teams nationwide.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "BehaviorSchool Pro cut my BIP writing time from 3 hours to 20 minutes. The quality is incredible.",
                name: "Dr. Sarah M.",
                role: "School Psychologist, CA",
              },
              {
                quote: "The IEP goal bank alone is worth the subscription. Every goal is measurable and classroom-ready.",
                name: "James T.",
                role: "BCBA, School District, TX",
              },
              {
                quote: "Finally, a tool that understands school-based behavior support. FERPA compliance was a must for us.",
                name: "Linda K.",
                role: "Special Education Director, IL",
              },
            ].map((testimonial) => (
              <div key={testimonial.name} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-4 leading-relaxed italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-emerald-900 to-emerald-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-emerald-100 mb-10 max-w-xl mx-auto">
            Start free. Upgrade when you&apos;re ready. Plans for individual practitioners and full school teams.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 text-left">
              <h3 className="text-lg font-bold text-white mb-1">Individual</h3>
              <p className="text-emerald-200 text-sm mb-4">For BCBAs & school psychologists</p>
              <p className="text-3xl font-extrabold text-white mb-1">$29<span className="text-base font-normal text-emerald-200">/mo</span></p>
              <p className="text-emerald-300 text-xs mb-4">Billed annually</p>
              <ul className="space-y-2 text-sm text-emerald-100">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-amber-300 flex-shrink-0" /> Unlimited FBA-to-BIP</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-amber-300 flex-shrink-0" /> Unlimited IEP Goals</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-amber-300 flex-shrink-0" /> Full Goal Bank access</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-amber-300 flex-shrink-0" /> ACT Module</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-6 text-left shadow-xl">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-slate-900">Team</h3>
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">POPULAR</span>
              </div>
              <p className="text-slate-500 text-sm mb-4">For school & district teams</p>
              <p className="text-3xl font-extrabold text-slate-900 mb-1">$19<span className="text-base font-normal text-slate-500">/seat/mo</span></p>
              <p className="text-slate-400 text-xs mb-4">Billed annually · 5 seat minimum</p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" /> Everything in Individual</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" /> Team collaboration</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" /> Admin dashboard</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" /> Priority support</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="https://app.behaviorschool.com/signup">
              <Button size="lg" className="h-14 px-8 text-lg font-bold bg-amber-400 hover:bg-amber-300 text-emerald-900 rounded-xl shadow-lg w-full sm:w-auto">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="https://app.behaviorschool.com/pricing">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-2 border-white/30 text-white hover:bg-white/10 rounded-xl w-full sm:w-auto">
                Compare Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Existing Community Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">School BCBA Community That Drives Change</h2>
                <p className="text-base sm:text-lg leading-relaxed text-slate-700">
                  We&apos;re not just a resource hub — we&apos;re a network of school-based BCBAs, educators, and leaders committed to building better school-wide behavior support systems.
                </p>
              </div>
              <div className="pt-2">
                <Link href="https://community.behaviorschool.com">
                  <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl w-full sm:w-auto min-w-[200px]">
                    Join the School BCBA Community
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative order-first lg:order-last">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/Community/comein-coffee-people-optimized.webp" 
                  alt="Community collaboration"
                  className="w-full h-auto object-cover"
                  width={584}
                  height={389}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Existing Tools Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 leading-tight">Free School BCBA Resources</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 active:scale-95 flex flex-col h-full relative group">
              <Link href="/behavior-study-tools" className="absolute inset-0 z-0"><span className="sr-only">View BCBA Exam Prep</span></Link>
              <div className="p-4 sm:p-6 flex flex-col h-full pointer-events-none">
                <div className="text-center flex-grow flex flex-col">
                  <Image src="/thumbnails/hero-thumb.webp" alt="Exam Prep" className="w-full h-24 sm:h-32 object-contain mb-3 sm:mb-4" width={128} height={128} />
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 leading-tight">BCBA Exam Prep</h3>
                  <div className="mt-auto pointer-events-auto">
                    <span className="block w-full bg-emerald-600 group-hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">Details</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 active:scale-95 flex flex-col h-full relative group">
              <Link href="/supervisors" className="absolute inset-0 z-0"><span className="sr-only">View Supervision</span></Link>
              <div className="p-4 sm:p-6 flex flex-col h-full pointer-events-none">
                <div className="text-center flex-grow flex flex-col">
                  <Image src="/thumbnails/supervision-thumb.webp" alt="Supervision" className="w-full h-24 sm:h-32 object-contain mb-3 sm:mb-4" width={128} height={128} />
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 leading-tight">BCBA Supervision</h3>
                  <div className="mt-auto pointer-events-auto">
                    <span className="block w-full bg-emerald-600 group-hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">Details</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 active:scale-95 flex flex-col h-full relative group">
              <Link href="/iep-goals" className="absolute inset-0 z-0"><span className="sr-only">View IEP Goals</span></Link>
              <div className="p-4 sm:p-6 flex flex-col h-full pointer-events-none">
                <div className="text-center flex-grow flex flex-col">
                  <Image src="/thumbnails/iep-goal-thumb.webp" alt="IEP Goals" className="w-full h-24 sm:h-32 object-contain mb-3 sm:mb-4" width={128} height={128} />
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 leading-tight">IEP Goal Writer</h3>
                  <div className="mt-auto pointer-events-auto">
                    <span className="block w-full bg-emerald-600 group-hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">Details</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 4 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 active:scale-95 flex flex-col h-full relative group">
              <Link href="/behavior-plans" className="absolute inset-0 z-0"><span className="sr-only">View Behavior Plans</span></Link>
              <div className="p-4 sm:p-6 flex flex-col h-full pointer-events-none">
                <div className="text-center flex-grow flex flex-col">
                  <Image src="/thumbnails/bip-writer-thumb.webp" alt="Behavior Plans" className="w-full h-24 sm:h-32 object-contain mb-3 sm:mb-4" width={128} height={128} />
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 leading-tight">Behavior Plan Writer</h3>
                  <div className="mt-auto pointer-events-auto">
                    <span className="block w-full bg-emerald-600 group-hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">Details</span>
                  </div>
                </div>
              </div>
            </div>
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
