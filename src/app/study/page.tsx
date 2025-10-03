import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export const metadata = {
  title: "Behavior School Study Platform",
  description: "AI-powered BCBA exam prep with adaptive practice tests and smart study tools.",
};

export default function StudyPage() {
  return (
    <div className="min-h-screen bg-bs-background">
      <section className="relative overflow-hidden bg-bs-primary">
        <ContainerScroll
          titleComponent={(
            <div className="text-center">
              <Badge className="bg-white/10 text-white border-white/20 mb-4">AI-Powered Exam Prep</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white">Master Your BCBA Exam</h1>
              <p className="mt-4 text-lg text-slate-200 max-w-2xl mx-auto">Adaptive practice tests, targeted feedback, and precision learning to help you pass—faster.</p>
              <div className="mt-8 flex items-center justify-center">
                <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                  <Link href="https://study.behaviorschool.com/auth?mode=signup&source=study-page" target="_blank" rel="noopener noreferrer">Start Free Trial</Link>
                </Button>
              </div>
            </div>
          )}
        >
          <div className="w-full h-full bg-white" />
        </ContainerScroll>
      </section>

      <section id="features" className="py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          {[
            { title: 'Adaptive Practice', desc: 'Questions adjust to your mastery so you study what matters.' },
            { title: 'Smart Analytics', desc: 'Pinpoint weak areas with detailed skill breakdowns.' },
            { title: 'Precision Feedback', desc: 'Explanations that teach, not just tell.' },
          ].map((f) => (
            <Card key={f.title} className="rounded-2xl border-0 shadow-feature">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-600">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Product tour highlights */}
      <section className="py-16 bg-bs-section-odd">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Product Tour</h2>
            <Button asChild variant="outline">
              <Link href="https://study.behaviorschool.com/auth?mode=signup&source=study-page" target="_blank" rel="noopener noreferrer">Open full tour</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Exam Simulator', desc: 'Timed sessions mirror the BCBA exam, with section breakdowns and flag‑to‑review.' },
              { step: '02', title: 'Mastery Tracking', desc: 'See mastery by task list item and automatically generate next‑best practice sets.' },
              { step: '03', title: 'Spaced Repetition', desc: 'Items you miss reappear on an optimized schedule to drive retention.' },
              { step: '04', title: 'Question Bank', desc: 'Extensive vetted items with rich rationales and references.' },
              { step: '05', title: 'Study Planner', desc: 'Target your exam date and get a week‑by‑week plan with time estimates.' },
              { step: '06', title: 'Dashboards', desc: 'Session history, time on task, accuracy trends, and readiness indicators.' },
            ].map((item) => (
              <Card key={item.step} className="rounded-2xl border-0 bg-white shadow-feature">
                <CardContent className="p-6">
                  <div className="text-sm font-semibold text-slate-500 mb-2">{item.step}</div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex gap-3">
            <Button asChild size="lg" className="bg-bs-accent hover:bg-[#d9a42f] text-slate-900">
              <Link href="https://study.behaviorschool.com/auth?mode=signup&source=study-page" target="_blank" rel="noopener noreferrer">View interactive tour</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="https://study.behaviorschool.com/auth?mode=signup&source=study-page" target="_blank" rel="noopener noreferrer">Start free trial</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-bs-section-even">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">FAQs</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>How does the AI adapt to me?</AccordionTrigger>
              <AccordionContent>We analyze your responses to adjust difficulty and surface the highest-impact items for your next session.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What’s included in the free trial?</AccordionTrigger>
              <AccordionContent>Full access to the core practice engine and analytics for a limited time—no credit card required.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Can I track progress over time?</AccordionTrigger>
              <AccordionContent>Yes, dashboards show your mastery growth and time-to-target estimates by task area.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}


