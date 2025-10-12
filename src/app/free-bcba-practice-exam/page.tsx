"use client";

import Link from "next/link";
import { ArrowRight, Target, Clock, Brain } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { FreeQuizWidget } from "@/components/quiz/FreeQuizWidget";

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <Breadcrumbs items={[{ label: "BCBA Exam Prep", href: "/bcba-exam-prep" }, { label: "Free Practice Exam" }]} />
      </div>

      <section className="pt-24 pb-12 sm:pt-32 sm:pb-16 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">Free BCBA Practice Exam</h1>
          <p className="mt-4 text-lg sm:text-xl text-slate-600">
            Interactive 10-question practice quiz with instant feedback and detailed explanations
          </p>

          {/* Feature Pills */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
              <Target className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">BACB Task List Aligned</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Instant Feedback</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
              <Brain className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Detailed Explanations</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FreeQuizWidget
            questions={questions}
            ctaUrl="https://study.behaviorschool.com"
            ctaText="Continue with Full Adaptive Practice"
          />
        </div>
      </section>

      {/* Why Practice Section */}
      <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
            Why Practice with BCBA Mock Questions?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                Exam-Aligned Content
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Questions mapped to BACB task list domains with realistic difficulty and format matching the actual BCBA exam.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                Learn from Mistakes
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Detailed explanations for every question help you understand why answers are correct or incorrect, reinforcing key concepts.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                Build Confidence
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Regular practice reduces test anxiety and builds the speed and accuracy needed to excel on exam day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Ready for More Practice?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Get unlimited adaptive practice questions, full 185-question mock exams, and personalized study analytics — all free, no credit card required.
          </p>
          <Link
            href="https://study.behaviorschool.com"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start Full Practice Platform
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Join 1,000+ behavior analysts preparing for certification
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
          name: "Free BCBA Practice Exam (10 Hard Questions)",
          url: `${SITE_URL}/free-bcba-practice-exam`,
          description: "A free BCBA practice exam with 10 challenging questions and detailed answers.",
          isPartOf: { "@type": "WebSite", url: SITE_URL, name: "Behavior School" },
        } as const;
        return (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
          </>
        );
      })()}
    </div>
  );
}

