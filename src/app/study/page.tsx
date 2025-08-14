import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BCBA Exam Prep & Study Tools | AI-Powered Practice Tests | Behavior School",
  description: "Master the BCBA exam with AI-powered practice tests, adaptive study tools, and comprehensive prep materials. Evidence-based exam preparation for behavior analysts with targeted feedback and analytics.",
  keywords: [
    "BCBA exam prep",
    "BCBA practice test",
    "behavior analyst certification",
    "BCBA study tools",
    "AI-powered exam prep",
    "adaptive practice tests",
    "BCBA exam practice",
    "behavior analysis certification",
    "BACB exam preparation",
    "BCBA test prep",
    "behavior analyst study guide",
    "BCBA exam questions"
  ],
  alternates: { canonical: "/study" },
  openGraph: {
    type: "website",
    title: "BCBA Exam Prep & Study Tools | AI-Powered Practice Tests | Behavior School",
    description: "Master the BCBA exam with AI-powered practice tests, adaptive study tools, and comprehensive prep materials. Evidence-based exam preparation for behavior analysts with targeted feedback and analytics.",
    url: "/study",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BCBA Exam Prep - AI-powered practice tests and study tools for behavior analysts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BCBA Exam Prep & Study Tools | AI-Powered Practice Tests | Behavior School",
    description: "Master the BCBA exam with AI-powered practice tests, adaptive study tools, and comprehensive prep materials. Evidence-based exam preparation for behavior analysts with targeted feedback and analytics.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function StudyPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF3E0' }}>
      <section className="relative overflow-hidden" style={{ backgroundColor: '#1F4D3F' }}>
        <ContainerScroll
          titleComponent={(
            <div className="text-center">
              <Badge className="bg-white/10 text-white border-white/20 mb-4">AI-Powered BCBA Exam Prep</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white">Master Your BCBA Exam with Confidence</h1>
              <p className="mt-4 text-lg text-slate-200 max-w-2xl mx-auto">
                AI-powered practice tests, adaptive study tools, and precision learning designed specifically for BCBA exam preparation. Join thousands of behavior analysts who've passed with our evidence-based approach.
              </p>
              <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
                <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                  <Link href="https://study.behaviorschool.com" target="_blank" rel="noopener noreferrer">Start Free Trial</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-slate-900">
                  <Link href="/supervisors">Supervision Tools</Link>
                </Button>
              </div>
            </div>
          )}
        >
          <div className="w-full h-full bg-white" />
        </ContainerScroll>
      </section>

      <section id="features" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Evidence-Based BCBA Exam Preparation</h2>
            <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
              Comprehensive study tools designed by certified BCBAs to help you master behavior analysis concepts and pass the BACB certification exam
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: 'Adaptive BCBA Practice Tests', 
                desc: 'AI-powered questions that adjust to your mastery level, focusing on BACB task list areas where you need the most practice for optimal exam preparation.' 
              },
              { 
                title: 'Smart Analytics & Progress Tracking', 
                desc: 'Detailed skill breakdowns and performance analytics help pinpoint weak areas in behavior analysis concepts with precision feedback for targeted study.' 
              },
              { 
                title: 'Evidence-Based Study Methods', 
                desc: 'Spaced repetition and retrieval practice techniques proven to enhance retention of behavior analyst certification material and exam readiness.' 
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
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Comprehensive BCBA Study Platform</h2>
              <p className="text-lg text-slate-600 mt-2">Everything you need for successful BCBA exam preparation in one integrated platform</p>
            </div>
            <Button asChild variant="outline">
              <Link href="https://study.behaviorschool.com/product-tour" target="_blank" rel="noopener noreferrer">Open full tour</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'BCBA Exam Simulator', desc: 'Timed practice sessions that mirror the actual BCBA certification exam format, with section breakdowns and flag‑to‑review functionality for optimal test preparation.' },
              { step: '02', title: 'BACB Task List Mastery Tracking', desc: 'Monitor your progress across all BACB task list items and automatically generate personalized practice sets targeting your weak areas in behavior analysis.' },
              { step: '03', title: 'Spaced Repetition for BCBA Prep', desc: 'Missed questions reappear on an optimized schedule using evidence-based spaced repetition to drive long-term retention of behavior analyst concepts.' },
              { step: '04', title: 'Comprehensive BCBA Question Bank', desc: 'Thousands of expertly vetted practice questions with detailed rationales and references to behavior analysis literature and BACB guidelines.' },
              { step: '05', title: 'Personalized BCBA Study Planner', desc: 'Target your exam date and receive a customized week‑by‑week study plan with time estimates tailored to your behavior analyst certification goals.' },
              { step: '06', title: 'Performance Analytics Dashboard', desc: 'Track session history, time on task, accuracy trends, and readiness indicators to optimize your BCBA exam preparation strategy.' },
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
          <div className="mt-8 flex gap-3 flex-wrap">
            <Button asChild size="lg" className="bg-[#E3B23C] hover:bg-[#d9a42f] text-slate-900">
              <Link href="https://study.behaviorschool.com/product-tour" target="_blank" rel="noopener noreferrer">View interactive tour</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="https://study.behaviorschool.com" target="_blank" rel="noopener noreferrer">Start free trial</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">Explore All Tools</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">BCBA Exam Prep FAQs</h2>
            <p className="text-lg text-slate-600 mt-4">
              Common questions about our AI-powered BCBA study tools and exam preparation platform
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="q1" className="bg-slate-50 rounded-lg px-6 border-0 shadow-sm">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-emerald-600">
                How does the AI adapt BCBA practice questions to my learning needs?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                Our AI-powered BCBA exam prep system analyzes your responses across all BACB task list areas to identify knowledge gaps and adjust question difficulty. The adaptive algorithm surfaces the highest-impact practice questions for your next study session, ensuring efficient preparation for the behavior analyst certification exam while focusing on areas where you need the most improvement.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="q2" className="bg-slate-50 rounded-lg px-6 border-0 shadow-sm">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-emerald-600">
                What's included in the free trial for BCBA exam preparation?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                The free trial provides full access to our core BCBA practice test engine, adaptive study tools, and performance analytics for a limited time—no credit card required. You'll be able to experience our AI-powered question selection, detailed explanations, and progress tracking across BACB task list items to see how our platform can accelerate your exam preparation.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q3" className="bg-slate-50 rounded-lg px-6 border-0 shadow-sm">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-emerald-600">
                Can I track my BCBA exam readiness and progress over time?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                Yes! Our comprehensive analytics dashboard shows your mastery growth across all BACB task list areas, time-to-target estimates, and exam readiness indicators. You can monitor your progress in specific behavior analysis domains, track accuracy trends, and receive personalized recommendations to optimize your BCBA study plan and ensure you're fully prepared for certification.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q4" className="bg-slate-50 rounded-lg px-6 border-0 shadow-sm">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-emerald-600">
                How do your BCBA practice tests compare to the actual certification exam?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                Our BCBA practice tests are designed to closely mirror the actual BACB certification exam format, timing, and difficulty level. Questions are written by certified BCBAs and cover all task list items with the same distribution and complexity as the real exam. The timed simulator includes section breakdowns and review functionality to replicate the authentic testing experience and build your confidence for exam day.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q5" className="bg-slate-50 rounded-lg px-6 border-0 shadow-sm">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-emerald-600">
                Do you offer BCBA exam prep for both initial certification and recertification?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                Our platform primarily focuses on initial BCBA certification exam preparation with comprehensive coverage of all BACB task list items. For recertification, we also offer continuing education modules and professional development resources that can count toward BACB continuing education requirements. Additionally, our supervision tools complement the study platform for BCBAs managing their own professional development and supervising others.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q6" className="bg-slate-50 rounded-lg px-6 border-0 shadow-sm">
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-emerald-600">
                Can I use your BCBA study tools alongside other exam prep materials?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                Absolutely! Our AI-powered BCBA exam prep tools are designed to complement your existing study materials and coursework. The adaptive practice system identifies gaps in your knowledge regardless of your primary study source, and our detailed explanations include references to behavior analysis literature. Many users combine our platform with textbooks, online courses, and study groups for a comprehensive preparation approach.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Structured Data */}
      {(() => {
        const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com";
        const webPageJsonLd = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "BCBA Exam Prep & Study Tools | AI-Powered Practice Tests | Behavior School",
          url: `${SITE_URL}/study`,
          description: "Master the BCBA exam with AI-powered practice tests, adaptive study tools, and comprehensive prep materials. Evidence-based exam preparation for behavior analysts with targeted feedback and analytics.",
          isPartOf: { "@type": "WebSite", url: SITE_URL, name: "Behavior School" },
          mainEntity: {
            "@type": "Course",
            name: "BCBA Exam Preparation",
            description: "AI-powered study tools and practice tests for BCBA certification",
            provider: {
              "@type": "Organization",
              name: "Behavior School",
              url: SITE_URL
            }
          }
        } as const;
        
        const breadcrumbJsonLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: SITE_URL,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "BCBA Study Tools",
              item: `${SITE_URL}/study`,
            },
          ],
        } as const;

        return (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
          </>
        );
      })()}
    </div>
  );
}


