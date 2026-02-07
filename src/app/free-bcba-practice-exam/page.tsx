"use client";

import Link from "next/link";
import { ArrowRight, Target, Clock, Brain } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { FreeQuizWidget } from "@/components/quiz/FreeQuizWidget";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export default function FreeBCBAPracticeExamPage() {
  const questions = [
    {
      id: "q1",
      tag: "B-3: Define and provide examples of stimulus and stimulus class",
      stem:
        "During a small-group lesson, a teacher presents the word dog orally, shows a picture of a dog, and writes the word “dog” on the board. A child responds correctly to all forms by pointing to a dog in an array. Which best describes this relation?",
      choices: [
        "Stimulus generalization within a response class",
        "Response generalization across stimulus classes",
        "Stimulus equivalence within a stimulus class",
        "Functional stimulus class across topographies",
      ],
      answer: "Stimulus equivalence within a stimulus class",
      letter: "C",
      explanation:
        "The learner demonstrates equivalence between different representations of “dog” (spoken, written, pictorial), indicating derived relations among stimuli in a class. Distractors confuse response generalization (changes in behavior), functional classes (stimuli producing the same function), and topographical differences.",
    },
    {
      id: "q2",
      tag: "C-8: Identify and define motivating operations",
      stem:
        "A client usually refuses to participate in group games. On days when the client has skipped lunch, he engages quickly and enthusiastically in games that involve snack rewards. Which best explains this shift?",
      choices: [
        "Reinforcer establishing operation increasing the value of snacks",
        "Conditioned reinforcement decreasing competing reinforcers",
        "Stimulus control from the presence of peers",
        "Abolishing operation reducing escape-maintained behavior",
      ],
      answer: "Reinforcer establishing operation increasing the value of snacks",
      letter: "A",
      explanation:
        "Skipping lunch increases the effectiveness of snacks as reinforcers, an EO effect. The distractors confuse this with conditioned reinforcement (not the issue here), stimulus control (peers aren’t the discriminative stimulus), and abolishing operations (would decrease snack value, not increase).",
    },
    {
      id: "q3",
      tag: "D-2: Use appropriate experimental designs",
      stem:
        "A BCBA alternates two interventions for reducing off-task behavior during math: differential reinforcement of alternative behavior (DRA) and noncontingent reinforcement (NCR). Each is implemented for 15-minute sessions across 5 days, with conditions rapidly alternated. Which design is being used?",
      choices: ["Reversal design", "Multiple baseline design", "Alternating treatments design", "Changing criterion design"],
      answer: "Alternating treatments design",
      letter: "C",
      explanation:
        "Rapid alternation of conditions across sessions without return to baseline indicates an alternating treatments design. Reversal involves sequential conditions with return to baseline, multiple baseline staggers interventions across settings/behaviors, and changing criterion involves stepwise adjustments in performance requirements.",
    },
    {
      id: "q4",
      tag: "H-4: Use functional communication training",
      stem:
        "Data show that tantrums occur in 80% of transitions to non-preferred activities. A BCBA teaches the client to request “2 more minutes” before transitioning. After training, tantrums drop to 20%. Which mechanism best explains this outcome?",
      choices: [
        "Extinction of tantrums via nonreinforcement",
        "Response generalization from prior mands",
        "Differential reinforcement of an alternative mand",
        "Stimulus fading with gradual transitions",
      ],
      answer: "Differential reinforcement of an alternative mand",
      letter: "C",
      explanation:
        "The appropriate mand replaces tantrums, which no longer produce the reinforcer. Extinction alone does not explain the reinforcement of the mand, response generalization is too broad, and stimulus fading was not described.",
    },
    {
      id: "q5",
      tag: "I-4: Evaluate intervention effectiveness",
      stem:
        "A graph shows a student’s self-injurious behavior decreasing from 12 to 4 per day after introduction of a token economy. Over the next 3 weeks, the rate fluctuates between 3–6 per day, but no consistent downward trend emerges. What should the BCBA conclude?",
      choices: [
        "The intervention is highly effective and should be maintained as is",
        "The intervention shows initial effect but lacks maintenance or consistency",
        "The intervention is ineffective and should be discontinued immediately",
        "The intervention is effective, but variability reflects natural fluctuation",
      ],
      answer: "The intervention shows initial effect but lacks maintenance or consistency",
      letter: "B",
      explanation:
        "The immediate reduction indicates functional control, but the lack of consistent downward trend suggests issues with implementation fidelity, reinforcer potency, or generalization. Option A overstates effectiveness, C is premature, and D underestimates the need for further analysis.",
    },
    {
      id: "q6",
      tag: "E-2: Use extinction procedures",
      stem:
        "A parent ignores a child’s whining for candy at the store. The child’s whining escalates to crying and screaming before gradually decreasing over several trips. Which best explains the escalation phase?",
      choices: ["Spontaneous recovery", "Extinction burst", "Resurgence", "Avoidance behavior"],
      answer: "Extinction burst",
      letter: "B",
      explanation:
        "The temporary increase in intensity and frequency before decline is the classic extinction burst. Spontaneous recovery occurs after the behavior has ceased, resurgence refers to return of previously reinforced behavior, and avoidance is unrelated.",
    },
    {
      id: "q7",
      tag: "F-7: Implement token economies",
      stem:
        "In a classroom token system, students earn stars for appropriate behaviors but exchange opportunities are delayed until the end of the day. Over time, students begin to show less interest in earning stars. What is the most likely issue?",
      choices: [
        "Backup reinforcers are not conditioned",
        "Response cost procedures are punishing responding",
        "Delay between tokens and exchange weakens conditioned reinforcement",
        "Tokens have become generalized conditioned reinforcers",
      ],
      answer: "Delay between tokens and exchange weakens conditioned reinforcement",
      letter: "C",
      explanation:
        "Tokens function as conditioned reinforcers, but long delays to backup reinforcers reduce their reinforcing value. Distractors confuse backup reinforcement issues, punishment procedures, and the opposite condition (generalized reinforcement would increase value).",
    },
    {
      id: "q8",
      tag: "G-5: Interpret graphed data",
      stem:
        "A BCBA evaluates aggression using an ABAB design. Aggression drops from 10 to 2 in B1, returns to 9 in A2, and decreases again to 1 in B2. Which is the strongest conclusion?",
      choices: [
        "The intervention is effective, demonstrating experimental control",
        "The behavior decreased due to maturation",
        "The reduction reflects natural variability in behavior",
        "The design lacks internal validity and is inconclusive",
      ],
      answer: "The intervention is effective, demonstrating experimental control",
      letter: "A",
      explanation:
        "Repeated introduction and withdrawal of the intervention produced consistent changes in aggression, demonstrating functional control. Maturation and variability are ruled out by reversal effects, and the design clearly shows internal validity.",
    },
    {
      id: "q9",
      tag: "J-2: Identify and address ethical dilemmas",
      stem:
        "A teacher asks a BCBA to implement a behavior reduction plan for a student who “talks too much” in class. The BCBA observes that the behavior involves asking questions relevant to instruction. What is the most ethical course of action?",
      choices: [
        "Implement the plan as requested, since the teacher is the client",
        "Decline to implement, as targeting appropriate behavior violates client rights",
        "Modify the goal to reduce frequency but maintain some engagement",
        "Collect baseline data before deciding whether the plan is necessary",
      ],
      answer: "Decline to implement, as targeting appropriate behavior violates client rights",
      letter: "B",
      explanation:
        "Asking relevant questions is socially significant and should not be reduced. Ethical guidelines prohibit targeting behavior that is not harmful or maladaptive. Options C and D suggest compromise but ignore the ethical violation, and A is clearly incorrect.",
    },
    {
      id: "q10",
      tag: "K-5: Supervise the implementation of behavior-change procedures",
      stem:
        "A BCBA trains staff to use DRA for attention-maintained aggression. During observations, some staff reinforce alternative behaviors inconsistently. What is the most appropriate supervisory action?",
      choices: [
        "Collect more baseline data before intervening",
        "Provide immediate performance feedback and model correct implementation",
        "Replace DRA with a simpler intervention",
        "Wait to see if staff improve with more practice",
      ],
      answer: "Provide immediate performance feedback and model correct implementation",
      letter: "B",
      explanation:
        "Effective supervision requires prompt, specific feedback and modeling to improve treatment fidelity. Collecting more baseline data or waiting delays correction, and replacing DRA ignores the problem of staff performance rather than intervention design.",
    },
  ];

  const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com";

  return (
    <div className="min-h-screen bg-bs-background">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <Breadcrumbs items={[{ label: "BCBA Exam Prep", href: "/bcba-exam-prep" }, { label: "Free Practice Exam" }]} />
      </div>

      {/* Hero Section */}
      <section className="pt-8 md:pt-10 pb-12 sm:pb-16 lg:pb-20 bg-bs-section-even">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Content */}
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full mb-6">
              <Target className="w-4 h-4 mr-2" />
              Free Practice Exam
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6">
              Quick BCBA Practice Test with Instant Feedback
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              Take a quick BCBA practice test designed for efficient exam prep. This free BCBA practice test includes 10 challenging questions aligned to the BACB task list with detailed explanations to build your confidence for exam day.
            </p>
          </div>

          {/* Feature Pills - Clean Badges */}
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl border-2 border-slate-200 shadow-sm">
              <Target className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="text-sm font-semibold text-slate-900">BACB Task List Aligned</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl border-2 border-slate-200 shadow-sm">
              <Clock className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="text-sm font-semibold text-slate-900">Instant Feedback</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl border-2 border-slate-200 shadow-sm">
              <Brain className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="text-sm font-semibold text-slate-900">Detailed Explanations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-bs-section-odd">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FreeQuizWidget
            questions={questions}
            ctaUrl="https://study.behaviorschool.com/free-mock-exam/full"
            ctaText="Take Full 185-Question Mock Exam"
          />
        </div>
      </section>

      {/* Email Signup Section - After Quiz */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Get More BCBA Practice Questions + Study Tips
            </h2>
            <p className="text-lg text-slate-600">
              Join our newsletter for weekly practice questions, study strategies, and free resources to help you pass the exam.
            </p>
          </div>
          <NewsletterSignup />
        </div>
      </section>

      {/* Why Practice Section */}
      <section className="py-16 lg:py-20 bg-bs-section-even">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Why Take a BCBA Practice Test?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Strategic BCBA practice test preparation is the key to exam success. Here&apos;s how our quick practice test helps you prepare efficiently.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-emerald-600 transition-all duration-300 hover:shadow-lg">
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Quick & Exam-Aligned
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Our quick BCBA practice test features questions mapped to BACB task list domains with realistic difficulty matching the actual exam format.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-emerald-600 transition-all duration-300 hover:shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Learn from Mistakes
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Detailed explanations for every question help you understand why answers are correct or incorrect, reinforcing key concepts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-emerald-600 transition-all duration-300 hover:shadow-lg">
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Build Confidence
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Regular practice reduces test anxiety and builds the speed and accuracy needed to excel on exam day.
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-xl border-2 border-slate-200">
              <div className="text-4xl font-bold text-emerald-600 mb-2">10</div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Questions</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl border-2 border-slate-200">
              <div className="text-4xl font-bold text-emerald-600 mb-2">185</div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Full Exam Size</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl border-2 border-slate-200">
              <div className="text-4xl font-bold text-emerald-600 mb-2">100%</div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Free Forever</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl border-2 border-slate-200">
              <div className="text-4xl font-bold text-emerald-600 mb-2">1,000+</div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Students</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know about our free BCBA practice exam
            </p>
          </div>

          <div className="space-y-6">
            {/* FAQ 1 */}
            <div className="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-100 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Is the free BCBA mock practice test really free?
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Yes, completely free with no signup required. Access all 185 questions instantly without creating an account or providing payment information.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                How many questions are on the BCBA mock exam?
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Our free mock exam has 185 questions matching the real BCBA exam format (175 scored + 10 unscored). This quick practice test has 10 questions to help you get started.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Can I take the free BCBA practice test multiple times?
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Yes! Take it as many times as you need. Questions are randomized each time for better practice and retention.
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="bg-gradient-to-br from-amber-50 to-white border-2 border-amber-100 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                How accurate is this compared to the real BCBA exam?
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Questions are written by BCBAs and cover all 9 content areas matching the BACB task list. The difficulty and format mirror real exam questions.
              </p>
            </div>

            {/* FAQ 5 */}
            <div className="bg-gradient-to-br from-pink-50 to-white border-2 border-pink-100 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Do I need to sign up to take the free mock exam?
              </h3>
              <p className="text-slate-700 leading-relaxed">
                No signup required! Start practicing immediately and track your progress locally in your browser.
              </p>
            </div>

            {/* FAQ 6 */}
            <div className="bg-gradient-to-br from-teal-50 to-white border-2 border-teal-100 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                How long should I take to complete the mock exam?
              </h3>
              <p className="text-slate-700 leading-relaxed">
                The real BCBA exam allows 4 hours for 185 questions. We recommend timing yourself for realistic practice - approximately 1.3 minutes per question.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/bcba-exam-prep"
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              View Complete BCBA Exam Prep Guide
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready for the Full 185-Question Mock Exam?
          </h2>
          <p className="text-xl text-emerald-50 mb-10 max-w-2xl mx-auto leading-relaxed">
            Experience the complete BCBA exam with 185 questions across all 9 domains. 4-hour timed simulation with instant scoring and detailed performance analytics — completely free, no signup required.
          </p>
          <Link
            href="https://study.behaviorschool.com/free-mock-exam/full"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-white text-emerald-600 rounded-xl shadow-xl hover:shadow-2xl hover:bg-emerald-50 transition-all duration-200 transform hover:-translate-y-1"
          >
            Start Full 185-Question Mock Exam
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <p className="mt-6 text-emerald-100 text-sm font-medium">
            Join 1,000+ behavior analysts practicing with realistic exam conditions
          </p>
        </div>
      </section>

      {/* Structured Data */}
      {(() => {
        const breadcrumbJsonLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "BCBA Exam Prep", item: `${SITE_URL}/bcba-exam-prep` },
            { "@type": "ListItem", position: 2, name: "Free BCBA Practice Exam", item: `${SITE_URL}/free-bcba-practice-exam` },
          ],
        } as const;
        const webPageJsonLd = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Quick BCBA Practice Test (Free 10-Question Exam)",
          url: `${SITE_URL}/free-bcba-practice-exam`,
          description: "Take a quick BCBA practice test with 10 challenging questions and detailed answers. Free BCBA practice test for efficient exam prep.",
          isPartOf: { "@type": "WebSite", url: SITE_URL, name: "Behavior School" },
        } as const;
        const faqJsonLd = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Is the free BCBA mock practice test really free?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, completely free with no signup required. Access all 185 questions instantly without creating an account or providing payment information."
              }
            },
            {
              "@type": "Question",
              name: "How many questions are on the BCBA mock exam?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Our free mock exam has 185 questions matching the real BCBA exam format (175 scored + 10 unscored). This quick practice test has 10 questions to help you get started."
              }
            },
            {
              "@type": "Question",
              name: "Can I take the free BCBA practice test multiple times?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes! Take it as many times as you need. Questions are randomized each time for better practice and retention."
              }
            },
            {
              "@type": "Question",
              name: "How accurate is this compared to the real BCBA exam?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Questions are written by BCBAs and cover all 9 content areas matching the BACB task list. The difficulty and format mirror real exam questions."
              }
            },
            {
              "@type": "Question",
              name: "Do I need to sign up to take the free mock exam?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No signup required! Start practicing immediately and track your progress locally in your browser."
              }
            },
            {
              "@type": "Question",
              name: "How long should I take to complete the mock exam?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The real BCBA exam allows 4 hours for 185 questions. We recommend timing yourself for realistic practice - approximately 1.3 minutes per question."
              }
            }
          ]
        } as const;
        return (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
          </>
        );
      })()}
    </div>
  );
}
