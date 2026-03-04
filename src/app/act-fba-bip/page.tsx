import type { Metadata } from "next";
import { ACTFBABIPWizard } from "@/components/act-fba-bip/ACTFBABIPWizard";
import { ShareButtons } from "@/components/ui/share-buttons";
import { ShareBar } from "@/components/ui/ShareBar";

const baseUrl = "https://behaviorschool.com";
const pageUrl = `${baseUrl}/act-fba-bip`;

const faqItems = [
  {
    question: "What is an ACT-informed FBA and BIP?",
    answer:
      "An ACT-informed FBA adds Acceptance and Commitment Training concepts to the standard Functional Behavior Assessment process. It includes a values assessment, psychological flexibility assessment, and views behavior through an ACT lens — as experiential avoidance or values-inconsistent action. The resulting BIP includes values-aligned replacement behaviors, acceptance strategies, defusion techniques, and committed action goals.",
  },
  {
    question: "How is this different from a standard FBA-to-BIP?",
    answer:
      "A standard FBA/BIP focuses on the function of behavior (attention, escape, tangible, sensory) and uses ABA-based strategies. An ACT-informed FBA/BIP includes all of that PLUS values assessment, psychological flexibility assessment, ACT-specific setting events, acceptance-based strategies, defusion techniques, age-appropriate metaphors, and progress monitoring tied to values-consistent behavior — not just behavior reduction.",
  },
  {
    question: "Who should use this tool?",
    answer:
      "BCBAs, school psychologists, behavior specialists, and special educators who want to incorporate ACT principles into their behavior support planning. It's especially useful for students whose behavior involves experiential avoidance, cognitive fusion, rigid self-stories, or disconnection from values.",
  },
  {
    question: "Does it use AI or paid APIs?",
    answer:
      "No. The generator uses a comprehensive rules-based template engine that maps ACT concepts to age-appropriate language and interventions. Strategies are selected based on the identified function of behavior, ACT processes of inflexibility, student values, and grade level — all without AI API calls.",
  },
  {
    question: "What age groups does it support?",
    answer:
      "The tool adapts language, metaphors, and strategies for four grade-level bands: Grades 1–3, Grades 4–5, Grades 6–8, and Grades 9–12. ACT concepts like defusion, acceptance, and values are translated into developmentally appropriate language for each level.",
  },
  {
    question: "What ACT metaphors and exercises are included?",
    answer:
      "The tool includes a catalog of ACT metaphors matched to grade level and target process, including Passengers on the Bus, Tug of War with the Monster, Hands as Thoughts, Thought Train, Weather Report, The Values Compass, Balloon Breathing, the ACT Matrix, Willingness Dial, and more. Each is adapted for the student's developmental level.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes. The ACT-informed FBA/BIP generator is completely free. We ask for an email to deliver your complete report, and we'll send occasional behavior support tips you can unsubscribe from anytime.",
  },
  {
    question: "Can I use the output in IEP meetings?",
    answer:
      "Yes. The output is designed to be professional and copy-ready. You can print it, save as PDF, or copy the text. Always review and customize with your team before finalizing.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "ACT-Informed FBA to BIP Generator",
      description:
        "Free ACT-informed FBA and BIP generator. Combines standard Functional Behavior Assessment with Acceptance and Commitment Training — including values assessment, psychological flexibility assessment, defusion techniques, acceptance strategies, and committed action goals.",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      url: pageUrl,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      provider: {
        "@type": "Organization",
        name: "Behavior School",
        url: baseUrl,
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

export const metadata: Metadata = {
  title: "ACT-Informed FBA & BIP Generator | Behavior School",
  description:
    "Free ACT-informed FBA and BIP generator with values-based strategies, acceptance techniques, and defusion exercises. For BCBAs and behavior teams. Start free!",
  keywords: [
    "ACT behavior intervention plan",
    "values-based BIP",
    "ACT FBA",
    "acceptance and commitment therapy BIP",
    "ACT-informed behavior plan",
    "values-based behavior intervention",
    "ACT for schools",
    "acceptance and commitment training schools",
    "psychological flexibility behavior plan",
    "ACT defusion techniques students",
    "values-aligned replacement behaviors",
    "committed action goals BIP",
    "ACT matrix behavior plan",
    "school BCBA ACT tools",
    "free behavior plan generator",
    "ACT-informed functional behavior assessment",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "ACT-Informed FBA & BIP Generator | Free Values-Based Behavior Plan",
    description:
      "Create ACT-informed behavior intervention plans with values assessment, acceptance strategies, defusion techniques, and committed action goals. Free for educators and BCBAs.",
    url: pageUrl,
    images: [
      {
        url: `${baseUrl}/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "ACT-Informed FBA & BIP Generator by Behavior School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ACT-Informed FBA & BIP Generator | Free Values-Based Behavior Plan",
    description:
      "Create ACT-informed FBA/BIPs with values assessment, defusion techniques, acceptance strategies, and committed action goals. Free for BCBAs and educators.",
    images: [`${baseUrl}/og-image.webp`],
  },
};

export default function ACTFBABIPPage() {
  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ── HERO ── Two-column: dark left / wizard right */}
      <section className="grid lg:grid-cols-2 min-h-[90vh]">
        {/* Left column — brand green, white text */}
        <div
          className="relative flex flex-col justify-center px-8 py-16 sm:px-12 lg:px-16 xl:px-20 overflow-hidden"
          style={{ backgroundColor: "#1E3A34" }}
        >
          {/* Subtle diagonal mesh texture via CSS */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                -45deg,
                rgba(255,255,255,0.6) 0px,
                rgba(255,255,255,0.6) 1px,
                transparent 1px,
                transparent 28px
              )`,
            }}
          />

          <div className="relative z-10 max-w-xl">
            {/* Credential badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 mb-8">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: "#e4b63d" }}
              />
              <span className="text-xs font-semibold tracking-wide text-white/80">
                Built by a 25-year school BCBA — Rob Spain, BCBA, IBA
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-5">
              Stop Writing FBAs at 10&nbsp;PM.
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-white/75 leading-relaxed mb-10">
              An ACT-informed FBA &amp; BIP that addresses the psychological root of behavior — not just the function.
              Free. No AI. No login.
            </p>

            {/* 3 Steps */}
            <ol className="space-y-5 mb-10">
              {[
                "Identify the function of the behavior (attention, escape, tangible, sensory)",
                "Assess ACT processes — values, experiential avoidance, cognitive fusion",
                "Generate a complete, copy-ready BIP with ACT-aligned strategies",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-[#1E3A34] mt-0.5"
                    style={{ backgroundColor: "#e4b63d" }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-white/85 text-sm sm:text-base leading-snug pt-1">{step}</span>
                </li>
              ))}
            </ol>

            {/* Stat block */}
            <div className="border-t border-white/15 pt-6">
              <p className="text-sm text-white/50 leading-relaxed">
                A comprehensive FBA takes 10–20 hours. This tool makes the output faster — so you can spend those hours
                on the work that actually matters.
              </p>
            </div>
          </div>
        </div>

        {/* Right column — wizard */}
        <div className="flex flex-col justify-start bg-slate-50 px-6 py-12 sm:px-10 lg:px-12">
          <ACTFBABIPWizard />
        </div>
      </section>

      {/* ── POST-WIZARD: Sample Output Preview ── */}
      <div className="bg-white border-t border-b border-slate-200 py-10 px-6">
        <div className="container mx-auto max-w-3xl">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none py-2 gap-4">
              <div>
                <span className="text-base font-semibold text-slate-900">
                  See what the output looks like
                </span>
                <span className="ml-3 text-sm text-slate-500">
                  A real clinical document — ready to print or share with your team.
                </span>
              </div>
              <span className="text-slate-400 group-open:rotate-180 transition-transform duration-200 text-lg select-none flex-shrink-0">
                ▼
              </span>
            </summary>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
              <div className="bg-slate-800 px-4 py-2 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-slate-400 font-mono">
                  ACT-Informed FBA &amp; BIP — Sample Output
                </span>
              </div>
              <pre className="p-5 text-xs sm:text-sm font-mono text-slate-700 whitespace-pre-wrap leading-relaxed overflow-x-auto">{`ACT-INFORMED FUNCTIONAL BEHAVIOR ASSESSMENT & BEHAVIOR INTERVENTION PLAN

Student: [Student Name] | Grade: 7 | Date: [Today]
Prepared by: [Team Members]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 1: BEHAVIORAL DEFINITION
Target Behavior: Task Refusal
Operational Definition: Student pushes materials away, puts head down, or states
"I'm not doing this" within 2 minutes of an independent work task being presented.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 2: FUNCTIONAL BEHAVIOR ASSESSMENT SUMMARY
Hypothesized Function: Escape/Avoidance
Antecedents: Independent academic task presented; transitions between activities
Setting Events: Prior peer conflict; unstructured schedule

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 3: ACT ANALYSIS
ACT Functional Analysis: Task refusal functions as experiential avoidance —
escaping the internal experience of feeling incompetent. Student is fused with
self-stories ("I can't do this") that trigger escape behavior.

ACT Processes Targeted: Cognitive Fusion, Experiential Avoidance, Self-as-Content
Values Identified: Competence, Belonging, Growth

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 4: BEHAVIOR INTERVENTION PLAN

Antecedent Strategies:
• Pre-teach tasks during low-pressure time (connects to value: Competence)
• Offer choice within structure ("Do problems 1-5 or 6-10 first?")
• Use a visual task breakdown card

Values-Aligned Replacement Behaviors:
• Use help card to request assistance (toward: Competence)
• "I need a minute" + return within 2 min (toward: Growth)

Acceptance & Defusion Strategies (ACT):
• "Passengers on the Bus" metaphor (adapted for Grade 6-8)
• Thought defusion: "I'm having the thought that I can't do this"
• Willingness practice: Sitting with hard feelings for 60 seconds

Committed Action Goals:
• Complete 80% of assigned tasks with help card use within 6 weeks
• Decrease task refusal from 4-6x/day to 1x/day within 8 weeks

[Full report continues with progress monitoring, team roles, data collection
procedures, crisis protocol, and 30/60/90-day review schedule...]`}</pre>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              This is a representative preview. Your generated report will be fully customized to your student&apos;s data.
            </p>
          </details>
        </div>
      </div>

      {/* ── SHARE BAR (below wizard) ── */}
      <div className="bg-slate-50 border-b border-slate-200 py-6 px-6">
        <div className="container mx-auto max-w-3xl">
          <ShareBar
            title="Free ACT-Informed FBA & BIP Generator"
            text="This free tool from BehaviorSchool generates a complete ACT-informed FBA and BIP in about 10 minutes. Built for school BCBAs."
            url="https://behaviorschool.com/act-fba-bip"
            hashtags={["BCBA", "SchoolBCBA", "BehaviorAnalysis", "ACT"]}
          />
        </div>
      </div>

      <article className="container mx-auto px-6 pb-20 pt-16 max-w-6xl">

        {/* ── TIME BURDEN STAT ── */}
        <section className="mb-16" aria-labelledby="act-fba-bip-time">
          <div
            className="rounded-2xl border border-slate-200 bg-white px-8 py-8 sm:px-10 shadow-sm"
            style={{ borderLeft: `4px solid #1E3A34` }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="flex-1 space-y-2">
                <p className="text-2xl font-bold text-slate-900 leading-snug">
                  A comprehensive FBA takes 10–20 hours to complete.
                  <sup className="text-sm font-normal text-slate-400 ml-1">*</sup>
                </p>
                <p className="text-base text-slate-600 leading-relaxed">
                  That&apos;s a full week of after-hours work per student — record review, observations, interviews, data
                  analysis, and report writing. This tool doesn&apos;t replace that process. It makes the{" "}
                  <em>output</em> faster, so you can spend those hours on the work that matters.
                </p>
              </div>
            </div>
            <p className="mt-5 text-xs text-slate-400 border-t border-slate-100 pt-4 leading-relaxed">
              <sup>*</sup> Time estimate based on practitioner-reported workflows: indirect assessment (interviews, rating
              scales, record review: 1–3 hrs), direct observation across 3+ sessions (1.5–3 hrs), data analysis and
              hypothesis formation (1–2 hrs), and report writing (3–6+ hrs). Source: Practitioner survey data, r/ABA
              community (2023); Rob Spain, BCBA, 25 years school-based practice. No peer-reviewed study with a
              standardized hour-count exists; this reflects real-world practitioner experience.
            </p>
          </div>
        </section>

        {/* ── WHAT IS ACT-INFORMED BIP ── */}
        <section className="mb-16 grid gap-10 lg:grid-cols-[1.2fr_1fr]" aria-labelledby="act-fba-bip-what">
          <div className="space-y-5">
            <h2 id="act-fba-bip-what" className="text-3xl font-bold text-slate-900 leading-tight">
              What is an ACT-Informed Behavior Intervention Plan?
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Acceptance and Commitment Training (ACT) is an evidence-based approach that helps individuals develop
              psychological flexibility — the ability to be present, open to difficult experiences, and committed to
              values-driven action. When applied to school-based behavior support, ACT transforms the traditional FBA/BIP
              process by adding a deeper understanding of <em>why</em> behavior occurs and connecting interventions to
              what genuinely matters to the student.
            </p>
            <p className="text-base text-slate-600 leading-relaxed">
              A standard BIP asks: &quot;What function does the behavior serve?&quot; An ACT-informed BIP also asks:
              &quot;What is the student avoiding internally?&quot; &quot;What rigid thoughts are they fused with?&quot;
              &quot;What do they value?&quot; and &quot;How can we help them move TOWARD what matters, even when it&apos;s
              hard?&quot;
            </p>
            <div className="pt-2">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                ACT&apos;s Six Core Processes in the Classroom
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                ACT targets six interconnected processes:{" "}
                <strong className="text-slate-800">acceptance</strong> (making room for difficult feelings),{" "}
                <strong className="text-slate-800">cognitive defusion</strong> (unhooking from rigid thoughts),{" "}
                <strong className="text-slate-800">present-moment awareness</strong> (being here now),{" "}
                <strong className="text-slate-800">self-as-context</strong> (flexible sense of self),{" "}
                <strong className="text-slate-800">values</strong> (knowing what matters), and{" "}
                <strong className="text-slate-800">committed action</strong> (doing what matters). This tool assesses and
                addresses all six, adapted for each grade level.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* What's included card */}
            <div
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              style={{ borderLeft: `4px solid #1E3A34` }}
            >
              <h3 className="text-base font-semibold text-slate-900 mb-4">
                What&apos;s included in your ACT FBA/BIP
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                {[
                  "Standard behavior definitions & function analysis",
                  "Student values assessment & descriptions",
                  "Psychological flexibility assessment",
                  "ACT-lens functional analysis",
                  "ACT-specific setting events",
                  "Values-aligned replacement behaviors",
                  "Acceptance-based strategies (by grade level)",
                  "Defusion techniques (by grade level)",
                  "Values clarification activities",
                  "Committed action goals tied to values",
                  "Metaphors & exercises catalog",
                  "Standard BIP strategies (antecedent, teaching, reinforcement, response)",
                  "Values-consistent progress monitoring",
                  "Crisis plan (when applicable)",
                  "Generalization & maintenance plans",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "#1E3A34" }}>
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                        <path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Who is this for */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-base font-semibold text-slate-900 mb-3">Who Is This For?</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                {[
                  "School-based BCBAs using ACT in practice",
                  "Behavior specialists exploring values-based approaches",
                  "School psychologists integrating ACT into behavior support",
                  "Special educators writing comprehensive behavior plans",
                  "Teams supporting students with experiential avoidance patterns",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-slate-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── WHY USE ACT-INFORMED BIP ── */}
        <section className="mb-16 space-y-8" aria-labelledby="act-fba-bip-why">
          <div>
            <h2 id="act-fba-bip-why" className="text-3xl font-bold text-slate-900 leading-tight">
              Why Use an ACT-Informed Behavior Intervention Plan?
            </h2>
            <p className="mt-2 text-base text-slate-500">
              Six reasons this approach goes further than a standard FBA/BIP.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Beyond behavior reduction",
                description:
                  "Standard BIPs focus on reducing problem behavior. ACT-informed BIPs also build psychological flexibility — helping students thrive, not just comply.",
              },
              {
                title: "Values give meaning to change",
                description:
                  "When replacement behaviors connect to what the student actually cares about, motivation comes from within — not just external reinforcement.",
              },
              {
                title: "Address the root, not just the function",
                description:
                  "Many behaviors stem from experiential avoidance — trying to escape uncomfortable thoughts and feelings. ACT addresses this directly.",
              },
              {
                title: "Age-appropriate ACT strategies",
                description:
                  "Every strategy, metaphor, and exercise is adapted for the student's developmental level — from Pre-K through high school.",
              },
              {
                title: "Research-supported approach",
                description:
                  "ACT has a strong evidence base for improving psychological flexibility and reducing problematic behavior across populations and settings.",
              },
              {
                title: "Free, template-based, instant",
                description:
                  "No AI, no subscriptions, no waiting. The rules-based engine generates a comprehensive ACT-informed FBA/BIP in seconds.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                style={{ borderLeft: `3px solid #1E3A34` }}
              >
                <h3 className="text-base font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="mb-16" aria-labelledby="act-fba-bip-faq">
          <div className="mb-8">
            <h2 id="act-fba-bip-faq" className="text-3xl font-bold text-slate-900 leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-base text-slate-500">
              Everything you need to know about the ACT-informed FBA &amp; BIP generator.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {faqItems.map((item) => (
              <div
                key={item.question}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-base font-semibold text-slate-900 mb-2">{item.question}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SHARE ── */}
        <section className="mb-16" aria-labelledby="act-fba-bip-share">
          <h2 id="act-fba-bip-share" className="text-2xl font-bold text-slate-900 mb-4">
            Share this tool
          </h2>
          <ShareButtons title="ACT-Informed FBA & BIP Generator" url={pageUrl} className="mt-2" />
        </section>

        {/* ── CTA ── */}
        <section
          className="rounded-2xl text-white p-8 sm:p-12"
          style={{ backgroundColor: "#1E3A34" }}
          aria-labelledby="act-fba-bip-cta"
        >
          <div className="max-w-2xl">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "#e4b63d" }}
            >
              Go Deeper
            </p>
            <h2 id="act-fba-bip-cta" className="text-2xl sm:text-3xl font-bold leading-snug mb-4">
              Want to learn this process with a cohort of school BCBAs?
            </h2>
            <p className="text-white/80 mb-2 leading-relaxed">
              The <strong className="text-white">School BCBA Transformation Program</strong> walks you through this and
              much more — live, 6 weeks, starting March 26.
            </p>
            <p className="text-white/60 mb-8 text-sm">
              Early bird pricing: <strong className="text-white">$2,499</strong> through March 21.
            </p>
            <a
              href="https://behaviorschool.com/transformation-program"
              className="inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-xl transition-colors text-sm"
              style={{ backgroundColor: "#e4b63d", color: "#1E3A34" }}
            >
              Reserve Your Spot
            </a>
          </div>
        </section>
      </article>
    </main>
  );
}
