import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software",
  description:
    "Special education software for teachers to plan IEP-aligned lessons, track student progress, document accommodations, and generate compliant reports quickly — all in one AI-driven workspace.",
  alternates: { canonical: "/classroompilot" },
  openGraph: {
    type: "website",
    title: "ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software",
    description:
      "Special education software for teachers to plan IEP-aligned lessons, track student progress, document accommodations, and generate compliant reports quickly — all in one AI-driven workspace.",
    url: "/classroompilot",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ClassroomPilot - Special Education Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software",
    description:
      "Special education software for teachers to plan IEP-aligned lessons, track student progress, document accommodations, and generate compliant reports quickly — all in one AI-driven workspace.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

import { Button } from "@/components/ui/button";
import { Hero } from "@/components/ui/hero";
import { CheckCircle, Target, BookOpen, TrendingUp, FileCheck, Brain, Zap } from "lucide-react";
import Link from "next/link";

export default function ClassroomPilotPage() {
  return (
    <div className="min-h-screen bg-[var(--bs-background,#FAF3E0)]">
      <Hero
        variant="brand"
        eyebrow="ClassroomPilot"
        title="IEP Goal Tracking &"
        highlight="Progress Monitoring Software"
        subtitle="Special education software for teachers to plan IEP-aligned lessons, track student progress, document accommodations, and generate compliant reports quickly — all in one AI-driven workspace."
        primaryCta={{ href: "/subscribe", label: "Get Early Access" }}
        secondaryCta={{ href: "/contact", label: "Schedule Demo" }}
      />

      {/* Key Features Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Everything special education teachers need
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              Streamline your IEP management and focus more time on teaching with tools designed specifically for special education classrooms.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Target,
                title: "IEP Goal Tracking",
                description: "Easily track progress on all IEP goals with automated data collection and visual progress indicators."
              },
              {
                icon: BookOpen,
                title: "Lesson Planning",
                description: "Create IEP-aligned lesson plans with built-in accommodations and modification suggestions."
              },
              {
                icon: TrendingUp,
                title: "Progress Monitoring",
                description: "Real-time progress monitoring with customizable data collection methods and instant insights."
              },
              {
                icon: FileCheck,
                title: "Accommodation Tracking",
                description: "Document and track accommodations with easy-to-use templates and compliance checklists."
              },
              {
                icon: Brain,
                title: "AI-Powered Insights",
                description: "Get intelligent recommendations for interventions and teaching strategies based on student data."
              },
              {
                icon: Zap,
                title: "Quick Reports",
                description: "Generate compliant progress reports and data summaries in minutes, not hours."
              }
            ].map((feature, index) => (
              <div key={index} className="rounded-2xl bg-white/80 ring-1 ring-slate-200/70 p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)]">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-400/5 text-blue-700">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-6">
                Built for special education teachers
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                ClassroomPilot understands the unique demands of special education. Our platform helps you stay organized, compliant, and focused on what matters most — your students' success.
              </p>
              <ul className="space-y-4">
                {[
                  "IDEA compliant documentation and reporting",
                  "Seamless integration with existing school systems",
                  "Evidence-based teaching strategies and interventions",
                  "Parent communication tools and progress sharing",
                  "Time-saving automation for routine tasks"
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to simplify your classroom?</h3>
              <p className="mb-6 opacity-90">
                Join the waitlist to be among the first special education teachers to experience ClassroomPilot.
              </p>
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-slate-50">
                <Link href="/subscribe">Get Early Access</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Teacher Testimonial Preview */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-8">
            Designed with teachers, for teachers
          </h2>
          <blockquote className="text-xl text-slate-600 italic mb-8">
            "Finally, a tool that understands the complexity of special education. ClassroomPilot helps me stay on top of IEP goals while actually having time to teach."
          </blockquote>
          <p className="text-slate-500">— Sarah M., Special Education Teacher</p>
        </div>
      </section>
    </div>
  );
}