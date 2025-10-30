import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  BookOpen, 
  Award, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  Target, 
  Shield, 
  FileText,
  Brain,
  MessageCircle,
  Settings,
  PlayCircle,
  Sparkles,
  Clock,
  Zap
} from "lucide-react";

export const metadata: Metadata = {
  title: "School-Based BCBA Transformation System | Behavior School",
  description: "Lead behavior systems, reduce burnout & scale MTSS/PBIS supports with our 8-week BCBA transformation program. Free tools for IEP goals, BIPs & supervision included.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  keywords: [
    "school based BCBA",
    "school-based behavior analyst",
    "BCBA in schools",
    "school behavior systems",
    "PBIS implementation",
    "MTSS behavior support",
    "IEP behavior goals",
    "school BIP writing",
    "FBA in schools",
    "school BCBA training",
    "behavior intervention plans schools",
    "school behavior analyst certification",
    "BCBA professional development",
    "school BCBA transformation"
  ],
  openGraph: {
    title: "School-Based BCBA Transformation System | Behavior School",
    description: "Learn how to lead behavior systems, reduce burnout, and scale MTSS & PBIS supports with our 8-week BCBA transformation program.",
    url: "https://behaviorschool.com/school-based-bcba",
    siteName: "Behavior School",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "School-Based BCBA Transformation System",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "School-Based BCBA Transformation System | Behavior School",
    description: "Learn how to lead behavior systems, reduce burnout, and scale MTSS & PBIS supports with our 8-week BCBA transformation program.",
    images: ["/optimized/og-image.webp"],
  },
  alternates: {
    canonical: "https://behaviorschool.com/school-based-bcba",
  }
};

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "School-Based BCBA", href: "/school-based-bcba" }
];

export default function SchoolBasedBCBAPage() {
  return (
    <main className="min-h-screen bg-bs-background">
      {/* Sticky Top CTA Bar - Mobile Conversion Optimizer */}
      <div className="hidden md:block sticky top-0 z-40 bg-gradient-to-r from-[#1F4D3F] to-[#2D6F54] text-white py-3 shadow-md">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="font-semibold">Transform Your School BCBA Practice in 8 Weeks</span>
          </div>
          <Button 
            size="sm" 
            className="bg-yellow-400 hover:bg-yellow-500 text-[#1F4D3F] font-bold shadow-lg"
            asChild
          >
            <Link href="/transformation-program">
              Start Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 pt-24 pb-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Hero Section - Redesigned with Clear Hierarchy */}
      <section className="container mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200">
              <Award className="w-4 h-4 text-emerald-700 mr-2" />
              <span className="text-sm font-semibold text-emerald-700">BACB ACE Provider #OP-25-5048</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                School-Based BCBA <span className="text-emerald-700">Transformation System</span>
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-slate-700">
                From Crisis Manager to Systems Leader
              </p>
            </div>

            {/* Value Props - Quick Wins */}
            <div className="space-y-3">
              {[
                "8-week transformation program with live cohort support",
                "AI-powered IEP Goal Generator & Behavior Plan Writer",
                "Evidence-based systems aligned with MTSS & PBIS",
                "Reduce burnout while scaling your impact district-wide"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 group">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-emerald-200 transition-colors">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                  </div>
                  <span className="text-slate-700 font-medium leading-relaxed">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-gradient-to-r from-[#1F4D3F] to-[#2D6F54] hover:from-[#2D6F54] hover:to-[#1F4D3F] text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
                asChild
              >
                <Link href="/transformation-program">
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Transform Your Practice
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-50 font-semibold"
                asChild
              >
                <Link href="/iep-behavior-goals">
                  <Zap className="w-5 h-5 mr-2" />
                  Try Free Tools
                </Link>
              </Button>
            </div>

            {/* Trust Indicator */}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock className="w-4 h-4" />
              <span>Next cohort starts in 3 weeks • Limited to 25 participants</span>
            </div>
          </div>

          {/* Right Column - Hero Visual Placeholder */}
          <div className="relative hidden lg:block">
            <div className="relative bg-gradient-to-br from-emerald-50 to-yellow-50 rounded-2xl p-8 shadow-2xl border-2 border-emerald-100">
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-300 rounded-full opacity-40 blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-emerald-200 rounded-full opacity-30 blur-2xl"></div>
              
              {/* Content Card */}
              <div className="relative bg-white rounded-xl p-6 shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-emerald-700">Week 1-8 Transformation</span>
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="space-y-3">
                    {["Ethical Leadership", "System Building", "MTSS Implementation", "Staff Training", "Data Systems", "Sustainability"].map((phase, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 font-bold text-sm">
                          {idx + 1}
                        </div>
                        <span className="text-slate-700 font-medium">{phase}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Is a School-Based BCBA - Enhanced Visual Design */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                What Is a School-Based BCBA?
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                A Board Certified Behavior Analyst who applies ABA in K–12 schools, targeting behaviors that affect learning, engagement, and IEP compliance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg border-2 border-blue-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Student-Focused</h3>
                </div>
                <p className="text-slate-700 leading-relaxed text-lg">
                  Conducting FBAs, writing BIPs, and supporting IEP teams with measurable, achievable goals that improve individual student outcomes.
                </p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-2xl shadow-lg border-2 border-emerald-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center mr-4">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Systems-Focused</h3>
                </div>
                <p className="text-slate-700 leading-relaxed text-lg">
                  Training staff, embedding interventions, and aligning supports with district-wide MTSS & PBIS frameworks for sustainable impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Responsibilities - With Visual Icons */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 text-center">
              Core Responsibilities
            </h2>
            <p className="text-xl text-slate-600 text-center mb-12 max-w-3xl mx-auto">
              School-based BCBAs balance individual student support with systems-level leadership
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* FBA */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-slate-100 hover:border-blue-300 hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  1. Conduct Functional Behavior Assessments (FBAs)
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Identify the root causes of challenging behaviors and design context-fit interventions that work in real classrooms.
                </p>
              </div>

              {/* BIP */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-slate-100 hover:border-emerald-300 hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  2. Develop Behavior Intervention Plans (BIPs)
                </h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Plans that teachers can actually follow: prevention, skill replacement, reinforcement, and progress monitoring.
                </p>
                <Button variant="outline" size="sm" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold" asChild>
                  <Link href="/behavior-plans">
                    Try BIP Writer
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>

              {/* IEP */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-slate-100 hover:border-purple-300 hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  3. Collaborate on IEP Teams
                </h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Craft measurable, IDEA-compliant behavior goals that improve student outcomes and meet legal requirements.
                </p>
                <Button variant="outline" size="sm" className="border-purple-600 text-purple-700 hover:bg-purple-50 font-semibold" asChild>
                  <Link href="/iep-behavior-goals">
                    Try Goal Generator
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>

              {/* MTSS/PBIS */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-slate-100 hover:border-orange-300 hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  4. Align With Tiered Systems (MTSS/PBIS)
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Embed ABA strategies across Tier 1, Tier 2, and Tier 3 for school-wide consistency and sustainable outcomes.
                </p>
              </div>

              {/* Training */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-slate-100 hover:border-red-300 hover:shadow-xl transition-all group md:col-span-2">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  5. Train & Coach School Staff
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Provide practical coaching that boosts teacher confidence, ensures implementation fidelity, and creates sustainable behavior support systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Schools Need BCBAs - Chalkboard Green Theme */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#1F4D3F] to-[#2D6F54] text-white relative overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Why Schools Need BCBAs
              </h2>
              <p className="text-xl text-emerald-100">
                BCBAs bring evidence-based science to school behavior challenges
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-emerald-400 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Shield className="w-6 h-6 text-[#1F4D3F]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Legal Compliance</h3>
                    <p className="text-emerald-100 leading-relaxed">
                      Help districts meet federal and state mandates for FAPE, LRE, and IEP implementation with evidence-based behavior support.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-yellow-300 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Target className="w-6 h-6 text-[#1F4D3F]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Better Outcomes</h3>
                    <p className="text-emerald-100 leading-relaxed">
                      Function-based interventions reduce disruption, increase engagement, and improve academic and social outcomes for all students.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-blue-300 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-[#1F4D3F]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Staff Confidence</h3>
                    <p className="text-emerald-100 leading-relaxed">
                      Teachers succeed when supported with coaching, data-driven strategies, and usable classroom management systems.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-purple-300 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Settings className="w-6 h-6 text-[#1F4D3F]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Sustainable Systems</h3>
                    <p className="text-emerald-100 leading-relaxed">
                      Embedding BCBAs in schools reduces staff burnout, ensures intervention fidelity, and builds long-term capacity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8-Week Transformation System - Infographic Style */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-100 border border-yellow-300 mb-4">
                <Sparkles className="w-4 h-4 text-yellow-700 mr-2" />
                <span className="text-sm font-bold text-yellow-800 uppercase tracking-wide">8-Week Transformation</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                How the 8-Week Transformation Works
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Shift from overwhelmed crisis manager to confident ethical leader with practical tools, live support, and proven systems
              </p>
            </div>

            {/* Transformation Benefits Grid */}
            <div className="bg-gradient-to-br from-emerald-50 via-yellow-50 to-blue-50 p-8 md:p-12 rounded-3xl shadow-xl mb-12 border-2 border-emerald-200">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
                What You&apos;ll Master:
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: Shield, text: "Ethical leadership frameworks for navigating admin demands", color: "blue" },
                  { icon: TrendingUp, text: "Data-driven strategies to scale PBIS/MTSS across schools", color: "emerald" },
                  { icon: Brain, text: "ACT-based resilience skills to reduce stress & burnout", color: "purple" },
                  { icon: Users, text: "Supervision systems that build staff capacity & fidelity", color: "orange" },
                  { icon: Target, text: "Tier 2 interventions that handle 60% of referrals", color: "red" },
                  { icon: MessageCircle, text: "Teacher training scripts that get buy-in & implementation", color: "yellow" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 group">
                    <div className={`w-10 h-10 bg-${item.color}-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform`}>
                      <item.icon className={`w-5 h-5 text-${item.color}-700`} />
                    </div>
                    <span className="text-slate-700 font-medium leading-relaxed">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button 
                size="lg" 
                className="text-lg px-10 py-7 bg-gradient-to-r from-[#1F4D3F] to-[#2D6F54] hover:from-[#2D6F54] hover:to-[#1F4D3F] text-white shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-200 font-bold"
                asChild
              >
                <Link href="/transformation-program">
                  Get the Full Program Details
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <p className="text-sm text-slate-600 mt-4">
                🎓 Earns 16 BACB CEUs • 💰 Payment plans available • ⏰ Next cohort starts soon
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Free Tools Section - Card Grid with Hover Effects */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                Free Tools for School BCBAs
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                AI-powered tools to streamline your daily work and improve student outcomes
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { icon: Target, color: "emerald", title: "IEP Goal Generator", desc: "Create SMART, measurable behavior goals in seconds", link: "/iep-behavior-goals", cta: "Generate a Free Goal" },
                { icon: FileText, color: "blue", title: "Behavior Plan Writer", desc: "Build teacher-ready BIPs with evidence-based strategies", link: "/behavior-plans", cta: "Create a Free BIP" },
                { icon: Users, color: "purple", title: "Supervision Tracker", desc: "Monitor fieldwork hours and competencies with precision", link: "/supervisors", cta: "Try Supervision Tools" },
                { icon: BookOpen, color: "orange", title: "BCBA Exam Prep", desc: "Free practice questions and mock exams for certification", link: "/bcba-exam-prep", cta: "Start Studying Free" }
              ].map((tool, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg border-2 border-slate-100 hover:border-emerald-300 hover:shadow-2xl transition-all group">
                  <div className={`w-16 h-16 bg-gradient-to-br from-${tool.color}-500 to-${tool.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <tool.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 text-center">{tool.title}</h3>
                  <p className="text-slate-600 mb-4 text-center leading-relaxed text-sm">{tool.desc}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`w-full border-${tool.color}-600 text-${tool.color}-700 hover:bg-${tool.color}-50 font-semibold`}
                    asChild
                  >
                    <Link href={tool.link}>
                      {tool.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" size="lg" className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold" asChild>
                <Link href="/resources">
                  Explore All Free Tools
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Strong Conversion Focus */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#1F4D3F] via-[#2D6F54] to-[#1F4D3F] text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-300 rounded-full opacity-10 blur-3xl"></div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Lead Behavior Systems with Confidence?
            </h2>
            <p className="text-xl md:text-2xl text-emerald-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join school-based BCBAs who are transforming from overwhelmed crisis managers into confident systems leaders
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Button 
                size="lg" 
                className="bg-white text-[#1F4D3F] hover:bg-yellow-100 font-bold py-6 text-base shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all" 
                asChild
              >
                <Link href="/transformation-program">
                  Join the 8-Week Program
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-[#1F4D3F] font-bold py-6 text-base shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all" 
                asChild
              >
                <Link href="/iep-behavior-goals">
                  Try Free IEP Goal Generator
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-[#1F4D3F] font-bold py-6 text-base shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all" 
                asChild
              >
                <Link href="/community">
                  Join Our Community
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-emerald-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>BACB ACE Provider</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Money-Back Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Live Cohort Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Enhanced for SEO */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 text-center">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-slate-600 text-center mb-12">
              Everything you need to know about school-based BCBA practice
            </p>

            <div className="space-y-6">
              {[
                {
                  question: "What does a school-based BCBA do?",
                  answer: "School-based BCBAs design and implement school-wide behavior systems, conduct functional behavior assessments (FBAs), write behavior intervention plans (BIPs), collaborate on IEP teams, train and coach staff, and align supports with MTSS and PBIS frameworks.",
                  color: "blue"
                },
                {
                  question: "How are school-based BCBAs different from clinic BCBAs?",
                  answer: "Clinic BCBAs typically focus on 1:1 therapy sessions in controlled environments. School-based BCBAs balance individual student supports with systems-level leadership, working across multiple schools and classrooms to embed sustainable behavior support practices.",
                  color: "emerald"
                },
                {
                  question: "What challenges do school BCBAs face?",
                  answer: "Common challenges include high caseloads (30-50+ students), under-trained paraprofessionals and teachers, limited time for direct observation and coaching, crisis-driven reactive approaches, and navigating ethical dilemmas with administrative pressure.",
                  color: "purple"
                },
                {
                  question: "How does the 8-Week Transformation System help?",
                  answer: "The program provides ethical leadership frameworks, practical tools for scaling MTSS/PBIS, ACT-based stress resilience skills, supervision and coaching systems, teacher training scripts, and ongoing peer support to shift from crisis management to systems leadership.",
                  color: "orange"
                },
                {
                  question: "What free tools are available for school BCBAs?",
                  answer: "Free tools include the AI-powered IEP Goal Generator for creating SMART behavior goals, Behavior Plan Writer for building teacher-ready BIPs, Supervision Tracker for monitoring fieldwork, and BCBA Exam Prep with practice questions and mock exams.",
                  color: "red"
                },
                {
                  question: "Who should join the Behavior School community?",
                  answer: "School-based BCBAs, behavior analysts in K-12 settings, school psychologists, special education teachers, and anyone implementing behavior support systems in educational environments. Both current practitioners and those pursuing BCBA certification are welcome.",
                  color: "yellow"
                }
              ].map((faq, idx) => (
                <div key={idx} className={`border-l-4 border-${faq.color}-500 bg-${faq.color}-50 pl-6 pr-6 py-6 rounded-r-xl hover:shadow-lg transition-shadow`}>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "School-Based BCBA Transformation System",
            "description": "Learn how to lead behavior systems, reduce burnout, and scale MTSS & PBIS supports with our 8-week BCBA transformation program.",
            "url": "https://behaviorschool.com/school-based-bcba",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://behaviorschool.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "School-Based BCBA",
                  "item": "https://behaviorschool.com/school-based-bcba"
                }
              ]
            },
            "mainEntity": {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What does a school-based BCBA do?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "School-based BCBAs design and implement school-wide behavior systems, conduct functional behavior assessments (FBAs), write behavior intervention plans (BIPs), collaborate on IEP teams, train and coach staff, and align supports with MTSS and PBIS frameworks."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How are school-based BCBAs different from clinic BCBAs?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Clinic BCBAs typically focus on 1:1 therapy sessions in controlled environments. School-based BCBAs balance individual student supports with systems-level leadership, working across multiple schools and classrooms to embed sustainable behavior support practices."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What challenges do school BCBAs face?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Common challenges include high caseloads (30-50+ students), under-trained paraprofessionals and teachers, limited time for direct observation and coaching, crisis-driven reactive approaches, and navigating ethical dilemmas with administrative pressure."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does the 8-Week Transformation System help?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The program provides ethical leadership frameworks, practical tools for scaling MTSS/PBIS, ACT-based stress resilience skills, supervision and coaching systems, teacher training scripts, and ongoing peer support to shift from crisis management to systems leadership."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What free tools are available for school BCBAs?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Free tools include the AI-powered IEP Goal Generator for creating SMART behavior goals, Behavior Plan Writer for building teacher-ready BIPs, Supervision Tracker for monitoring fieldwork, and BCBA Exam Prep with practice questions and mock exams."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Who should join the Behavior School community?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "School-based BCBAs, behavior analysts in K-12 settings, school psychologists, special education teachers, and anyone implementing behavior support systems in educational environments. Both current practitioners and those pursuing BCBA certification are welcome."
                  }
                }
              ]
            },
            "provider": {
              "@type": "EducationalOrganization",
              "name": "Behavior School",
              "url": "https://behaviorschool.com",
              "description": "Professional development platform for school-based BCBAs and behavior analysts",
              "sameAs": [
                "https://www.linkedin.com/company/behavior-school",
                "https://x.com/behaviorschool"
              ]
            },
            "offers": {
              "@type": "Course",
              "name": "8-Week School BCBA Transformation System",
              "description": "Transform from crisis manager to systems leader with practical tools, live cohort support, and proven behavior support systems",
              "provider": {
                "@type": "EducationalOrganization",
                "name": "Behavior School"
              },
              "educationalCredentialAwarded": "16 BACB CEUs",
              "timeRequired": "P8W"
            }
          }),
        }}
      />
    </main>
  );
}
