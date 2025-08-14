import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";

export const metadata = {
  title: "BCBA Exam Prep & Study Tools | AI-Powered Practice Tests | Behavior School",
  description: "Master the BCBA exam with adaptive AI-powered practice tests, smart study tools, and personalized feedback. Get exam-ready faster with targeted prep designed by behavior analysts.",
  keywords: [
    "BCBA exam prep",
    "BCBA practice tests", 
    "behavior analyst certification",
    "BCBA study tools",
    "adaptive learning BCBA",
    "BCBA exam simulator",
    "behavior analysis exam prep",
    "RBT to BCBA study",
    "BCBA task list mastery",
    "AI-powered BCBA prep"
  ],
  openGraph: {
    title: "BCBA Exam Prep & Study Tools | Behavior School",
    description: "Master the BCBA exam with adaptive AI-powered practice tests and smart study tools designed by behavior analysts.",
    type: "website",
  },
};

export default function StudyPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF3E0' }}>
      <section className="relative overflow-hidden" style={{ backgroundColor: '#1F4D3F' }}>
        <ContainerScroll
          titleComponent={(
            <div className="text-center">
              <Badge className="bg-white/10 text-white border-white/20 mb-4">AI-Powered BCBA Exam Prep</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white">Master Your BCBA Exam with Adaptive Practice Tests</h1>
              <p className="mt-4 text-lg text-slate-200 max-w-2xl mx-auto">
                Accelerate your BCBA certification journey with AI-powered practice tests, personalized study tools, and 
                targeted feedback designed by experienced behavior analysts. Pass your exam faster with confidence.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                  <Link href="https://study.behaviorschool.com" target="_blank" rel="noopener noreferrer">Start Free BCBA Practice Test</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  <Link href="/supervisors">Explore Supervision Tools</Link>
                </Button>
              </div>
            </div>
          )}
        >
          <div className="w-full h-full bg-white" aria-label="BCBA exam prep dashboard preview showing adaptive practice tests and study analytics" />
        </ContainerScroll>
      </section>

      {/* Problem/Solution Section for SEO */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Why BCBA Exam Prep Is Challenging</h2>
          <p className="text-lg text-slate-700 mb-8">
            Preparing for the BCBA certification exam requires mastering complex behavior analysis concepts, 
            understanding ethical guidelines, and applying theoretical knowledge to real-world scenarios. 
            Traditional study methods often lack the personalization needed to identify and strengthen weak areas efficiently.
          </p>
          <h3 className="text-2xl font-semibold text-slate-900 mb-4">Our Solution: Smart, Adaptive BCBA Study Tools</h3>
          <p className="text-lg text-slate-700">
            Our AI-powered BCBA exam prep platform analyzes your performance in real-time, adapting practice questions 
            to your mastery level. Focus on areas that need improvement while reinforcing strong concepts through 
            spaced repetition—the scientifically proven method for long-term retention.
          </p>
        </div>
      </section>

      <section id="features" className="py-16" style={{ backgroundColor: '#FAF3E0' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            BCBA Exam Prep Features Designed for Success
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: 'Adaptive BCBA Practice Tests', 
                desc: 'Questions automatically adjust to your behavior analysis mastery level, ensuring you study the most relevant content for exam success.' 
              },
              { 
                title: 'Smart Analytics Dashboard', 
                desc: 'Track your BCBA exam readiness with detailed skill breakdowns by task list area and identify knowledge gaps instantly.' 
              },
              { 
                title: 'Expert Feedback & Rationales', 
                desc: 'Learn from comprehensive explanations written by BCBAs that teach behavior analysis concepts, not just correct answers.' 
              },
            ].map((f) => (
              <Card key={f.title} className="rounded-2xl border-0 shadow-feature">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-slate-600">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product tour highlights */}
      <section className="py-16" style={{ backgroundColor: '#FFF8EA' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900">BCBA Study Tools Product Tour</h2>
            <Button asChild variant="outline">
              <Link href="https://study.behaviorschool.com/product-tour" target="_blank" rel="noopener noreferrer">Open full tour</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                step: '01', 
                title: 'BCBA Exam Simulator', 
                desc: 'Timed practice sessions mirror the actual BCBA certification exam format, with section breakdowns and flag-to-review features.' 
              },
              { 
                step: '02', 
                title: 'Task List Mastery Tracking', 
                desc: 'Monitor your proficiency across all BCBA task list items and automatically generate personalized practice sets for weak areas.' 
              },
              { 
                step: '03', 
                title: 'Spaced Repetition System', 
                desc: 'Missed questions reappear on an optimized schedule based on behavior science research to maximize retention for exam day.' 
              },
              { 
                step: '04', 
                title: 'Comprehensive Question Bank', 
                desc: 'Access thousands of vetted BCBA practice questions with detailed rationales and references to behavior analysis literature.' 
              },
              { 
                step: '05', 
                title: 'Personalized Study Planner', 
                desc: 'Set your BCBA exam date and receive a customized week-by-week study plan with time estimates and milestone tracking.' 
              },
              { 
                step: '06', 
                title: 'Performance Analytics', 
                desc: 'Review session history, time on task, accuracy trends, and BCBA exam readiness indicators in real-time.' 
              },
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
            <Button asChild size="lg" className="bg-[#E3B23C] hover:bg-[#d9a42f] text-slate-900">
              <Link href="https://study.behaviorschool.com/product-tour" target="_blank" rel="noopener noreferrer">View BCBA prep tour</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="https://study.behaviorschool.com" target="_blank" rel="noopener noreferrer">Start free BCBA practice</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Internal Links Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Complete Your Behavior Analysis Toolkit</h2>
          <p className="text-lg text-slate-600 mb-6">
            Beyond BCBA exam prep, explore our comprehensive tools for behavior analysts in education
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/supervisors">BCBA Supervision Tools</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">BCBA Exam Prep FAQs</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>How does AI-powered BCBA exam prep adapt to my learning needs?</AccordionTrigger>
              <AccordionContent>
                Our adaptive learning system analyzes your responses to BCBA practice questions in real-time, adjusting difficulty 
                levels and content focus based on your performance. The AI identifies knowledge gaps in specific task list areas 
                and prioritizes questions that will have the highest impact on your exam readiness, ensuring efficient study sessions 
                tailored to your unique needs.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What's included in the free BCBA practice test trial?</AccordionTrigger>
              <AccordionContent>
                The free trial provides full access to our BCBA exam simulator, adaptive practice engine, and performance analytics 
                dashboard for a limited time. You'll experience personalized practice tests, detailed answer explanations from BCBAs, 
                and progress tracking across all task list areas—no credit card required to start preparing for your certification exam.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Can I track my BCBA exam readiness and progress over time?</AccordionTrigger>
              <AccordionContent>
                Yes! Our comprehensive analytics dashboard shows your mastery growth across all BCBA task list areas, tracks accuracy 
                trends, and provides time-to-target estimates for exam readiness. You'll see detailed breakdowns of performance by 
                content area, identify strengths and weaknesses, and receive personalized recommendations for focused study sessions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>How many BCBA practice questions are in your question bank?</AccordionTrigger>
              <AccordionContent>
                Our question bank contains thousands of carefully vetted BCBA practice questions covering all task list areas and 
                competencies. Each question includes comprehensive rationales written by experienced BCBAs, references to behavior 
                analysis literature, and explanations that teach concepts rather than just providing answers. New questions are 
                regularly added based on the latest exam content outline.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}


