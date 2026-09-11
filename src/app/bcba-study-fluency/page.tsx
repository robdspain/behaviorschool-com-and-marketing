import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Timer, Target, BookOpen } from "lucide-react";

const FREE_MOCK_HREF = "https://study.behaviorschool.com/free-mock-exam/";

export const metadata: Metadata = {
  title: "BCBA Study Fluency: Speed Without Guessing | Behavior School",
  description:
    "Practical steps to build BCBA exam fluency: timed practice, error review, domain rotation, and full mock checkpoints. Start with a free mock exam.",
  robots: { index: true, follow: true },
  keywords: [
    "bcba study fluency",
    "bcba exam pacing",
    "bcba timed practice",
    "bcba mock exam stamina",
    "bcba exam preparation",
  ],
  alternates: {
    canonical: "https://behaviorschool.com/bcba-study-fluency",
  },
  openGraph: {
    title: "BCBA Study Fluency: Speed Without Guessing | Behavior School",
    description:
      "How to practice BCBA exam items with accuracy, pacing, and review habits that hold up across a four-hour exam.",
    url: "https://behaviorschool.com/bcba-study-fluency",
    siteName: "Behavior School",
    images: [{ url: "/optimized/og-image.webp", width: 1200, height: 630, alt: "BCBA study fluency guide" }],
    locale: "en_US",
    type: "website",
  },
};

const studySteps = [
  {
    step: "1",
    title: "Establish a timed baseline with a full mock",
    body:
      "Take a full-length mock under exam-like conditions. Note accuracy by domain, pacing in the second half, and items where you changed answers. That score report is your starting point—not a pass prediction.",
  },
  {
    step: "2",
    title: "Practice short sets on weak domains",
    body:
      "Use focused practice on your lowest domains between mock checkpoints. Review rationales for every miss and every item you were unsure about, not only wrong answers.",
  },
  {
    step: "3",
    title: "Track response patterns, not just percent correct",
    body:
      "Pay attention to hesitation, answer changes, and fatigue late in a session. Fluency means stable accuracy when time pressure and cognitive load increase—not answering faster while guessing more.",
  },
  {
    step: "4",
    title: "Re-test with another full mock",
    body:
      "Schedule mocks every few weeks as you study. Compare domain trends, pacing, and stamina. If accuracy improves but you run out of time, your next block should emphasize timed sets before adding more content review.",
  },
];

export default function BCBAStudyFluencyPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "BCBA Exam Prep", href: "https://study.behaviorschool.com/free-practice/" },
    { label: "Study Fluency", href: "/bcba-study-fluency" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-24 pb-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <section className="py-12 lg:py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700 mb-4">
            BCBA exam prep
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            How to build BCBA study fluency
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-8">
            Fluency on the BCBA exam is not about racing through items. It is accurate, confident responding
            under time pressure across 185 questions. These steps help you practice that way—without
            overclaiming what any single score can tell you.
          </p>
          <Button asChild size="lg" className="bg-emerald-700 hover:bg-emerald-800">
            <a href={FREE_MOCK_HREF} target="_blank" rel="noopener noreferrer">
              Start with a free mock exam
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </section>

        <section className="py-12 border-t border-slate-200">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
            What fluency means for exam prep
          </h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            Precision-teaching and fluency-building literature (for example, Binder, 1996) emphasizes accuracy
            plus endurance, stability under pressure, and transfer to new problems. For BCBA candidates, that
            translates into a few practical habits:
          </p>
          <ul className="space-y-3 text-slate-700">
            <li className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Scenario-based items answered without long stalls on familiar task-list concepts</span>
            </li>
            <li className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Stable accuracy in the last third of a timed session, not only the first block</span>
            </li>
            <li className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Review habits that turn misses into retrievable understanding before the next mock</span>
            </li>
          </ul>
          <p className="mt-6 text-slate-600 leading-relaxed">
            No practice tool can guarantee exam outcomes. Mock scores and domain reports are diagnostic—they
            show where to focus next.
          </p>
        </section>

        <section className="py-12 border-t border-slate-200">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-8">
            A four-step fluency workflow
          </h2>
          <div className="space-y-8">
            {studySteps.map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 border-t border-slate-200">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
            What to avoid
          </h2>
          <ul className="space-y-3 text-slate-700">
            <li className="flex gap-3">
              <Timer className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
              <span>Speed drills with no rationale review—fast wrong answers do not build fluency</span>
            </li>
            <li className="flex gap-3">
              <BookOpen className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
              <span>Passive reading without retrieval practice on scenario-style items</span>
            </li>
            <li className="flex gap-3">
              <Target className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
              <span>Studying only strong domains because they feel productive</span>
            </li>
          </ul>
        </section>

        <section className="py-12 border-t border-slate-200">
          <div className="rounded-2xl bg-slate-900 p-8 text-white">
            <h2 className="text-2xl font-bold mb-3">Start with a free mock exam</h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Behavior Study Tools offers timed mock exams with domain-level results. Use your first mock to
              set a baseline, then return to focused practice before your next checkpoint.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white">
                <a href={FREE_MOCK_HREF} target="_blank" rel="noopener noreferrer">
                  Take the free mock exam
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <a href="https://study.behaviorschool.com/free-practice/" target="_blank" rel="noopener noreferrer">
                  More BCBA exam prep resources
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Related resources</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <a href={FREE_MOCK_HREF} className="rounded-xl border border-slate-200 p-4 hover:border-emerald-300 transition-colors block">
              <div className="font-medium text-slate-900">Free BCBA mock exam guide</div>
              <div className="text-sm text-slate-600 mt-1">Start a timed mock in the study app</div>
            </a>
            <Link href="/school-bcba" className="rounded-xl border border-slate-200 p-4 hover:border-emerald-300 transition-colors">
              <div className="font-medium text-slate-900">School BCBA career guide</div>
              <div className="text-sm text-slate-600 mt-1">Jobs, tools, and training for school practice</div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
