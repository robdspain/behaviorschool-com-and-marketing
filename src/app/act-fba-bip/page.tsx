import type { Metadata } from "next";
import { ACTFBABIPWizard } from "@/components/act-fba-bip/ACTFBABIPWizard";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ShareButtons } from "@/components/ui/share-buttons";

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
      "The tool adapts language, metaphors, and strategies for five grade-level bands: Pre-K through Kindergarten, Grades 1-3, Grades 4-5, Grades 6-8, and Grades 9-12. ACT concepts like defusion, acceptance, and values are translated into developmentally appropriate language for each level.",
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
    <main className="min-h-screen bg-bs-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container mx-auto px-6 pt-20">
        <Breadcrumbs
          items={[
            { label: "Products", href: "/products" },
            { label: "ACT-Informed FBA & BIP Generator" },
          ]}
        />
      </div>

      {/* Post-Presentation Orientation */}
      <div className="bg-emerald-50 border-b border-emerald-200 py-10 px-6">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-emerald-900 mb-4">What You&apos;re About to Do</h2>
          <p className="text-slate-700 mb-5 text-base leading-relaxed">
            In Rob&apos;s presentation, you saw how combining a standard FBA with ACT principles creates behavior support
            plans that address the psychological root of behavior — not just its function. This tool walks you through
            that exact process:
          </p>
          <ol className="space-y-3 mb-6">
            {[
              "Identify the function of the behavior (attention, escape, tangible, sensory)",
              "Assess ACT processes — values, experiential avoidance, cognitive fusion",
              "Generate a complete, copy-ready BIP with ACT-aligned strategies",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-700 text-white text-sm font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="text-slate-600 text-sm">
            It takes about 10 minutes. The output is printable and ready for your team.
          </p>
        </div>
      </div>

      <article className="container mx-auto px-6 pb-16 pt-8">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_1.2fr] lg:items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-700">
              ACT-Informed FBA → BIP
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                ACT-Informed FBA & Behavior Intervention Plan Generator
              </h1>
              <p className="text-base text-slate-600">
                Go beyond function-based behavior plans. Create a values-driven, ACT-informed FBA and BIP that addresses
                psychological inflexibility, builds acceptance skills, and connects replacement behaviors to what actually
                matters to the student.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Values assessment & alignment",
                "Psychological flexibility assessment",
                "ACT functional analysis lens",
                "Age-appropriate defusion & acceptance",
                "Committed action goals",
                "Metaphors & exercises catalog",
                "Values-consistent progress monitoring",
                "Standard BIP sections included",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-2xl border border-purple-100 bg-white px-4 py-3 text-sm text-slate-700">
                  <span className="mt-0.5 text-purple-600">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">How it works</p>
              <p>
                Complete the standard FBA steps (behaviors, antecedents, consequences, function), then add ACT-specific
                assessments (values, psychological flexibility, ACT functional analysis). The generator produces a comprehensive
                report with both standard BIP sections and ACT-informed additions — all matched to the student&apos;s grade level.
              </p>
            </div>
          </div>

          <ACTFBABIPWizard />
        </section>

        {/* What is ACT-Informed FBA/BIP */}
        <section className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_1fr]" aria-labelledby="act-fba-bip-what">
          <div className="space-y-4">
            <h2 id="act-fba-bip-what" className="text-2xl font-semibold text-slate-900">
              What is an ACT-Informed Behavior Intervention Plan?
            </h2>
            <p className="text-base text-slate-600">
              Acceptance and Commitment Training (ACT) is an evidence-based approach that helps individuals develop
              psychological flexibility — the ability to be present, open to difficult experiences, and committed to
              values-driven action. When applied to school-based behavior support, ACT transforms the traditional FBA/BIP
              process by adding a deeper understanding of WHY behavior occurs and connecting interventions to what genuinely
              matters to the student.
            </p>
            <p className="text-base text-slate-600">
              A standard BIP asks: &quot;What function does the behavior serve?&quot; An ACT-informed BIP also asks: &quot;What
              is the student avoiding internally?&quot; &quot;What rigid thoughts are they fused with?&quot; &quot;What do they
              value?&quot; and &quot;How can we help them move TOWARD what matters, even when it&apos;s hard?&quot;
            </p>
            <h3 className="text-lg font-semibold text-slate-900 mt-6">
              ACT&#39;s Six Core Processes in the Classroom
            </h3>
            <p className="text-base text-slate-600">
              ACT targets six interconnected processes: <strong>acceptance</strong> (making room for difficult feelings),{" "}
              <strong>cognitive defusion</strong> (unhooking from rigid thoughts), <strong>present-moment awareness</strong>{" "}
              (being here now), <strong>self-as-context</strong> (flexible sense of self), <strong>values</strong> (knowing
              what matters), and <strong>committed action</strong> (doing what matters). This tool assesses and addresses all
              six, adapted for each grade level.
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-purple-100 bg-purple-50/70 p-6">
              <h3 className="text-lg font-semibold text-purple-900">What&apos;s included in your ACT FBA/BIP</h3>
              <ul className="mt-3 space-y-2 text-sm text-purple-900/90">
                <li>✓ Standard behavior definitions & function analysis</li>
                <li>✓ Student values assessment & descriptions</li>
                <li>✓ Psychological flexibility assessment</li>
                <li>✓ ACT-lens functional analysis</li>
                <li>✓ ACT-specific setting events</li>
                <li>✓ Values-aligned replacement behaviors</li>
                <li>✓ Acceptance-based strategies (by grade level)</li>
                <li>✓ Defusion techniques (by grade level)</li>
                <li>✓ Values clarification activities</li>
                <li>✓ Committed action goals tied to values</li>
                <li>✓ Metaphors & exercises catalog</li>
                <li>✓ Standard BIP strategies (antecedent, teaching, reinforcement, response)</li>
                <li>✓ Values-consistent progress monitoring</li>
                <li>✓ Crisis plan (when applicable)</li>
                <li>✓ Generalization & maintenance plans</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-slate-900">Who Is This For?</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>• School-based BCBAs using ACT in practice</li>
                <li>• Behavior specialists exploring values-based approaches</li>
                <li>• School psychologists integrating ACT into behavior support</li>
                <li>• Special educators writing comprehensive behavior plans</li>
                <li>• Teams supporting students with experiential avoidance patterns</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Why ACT-Informed BIP */}
        <section className="mt-14 space-y-6" aria-labelledby="act-fba-bip-why">
          <h2 id="act-fba-bip-why" className="text-2xl font-semibold text-slate-900">
            Why Use an ACT-Informed Behavior Intervention Plan?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12" aria-labelledby="act-fba-bip-faq">
          <h2 id="act-fba-bip-faq" className="text-2xl font-semibold text-slate-900">
            ACT-Informed FBA & BIP Generator FAQ
          </h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {faqItems.map((item) => (
              <div key={item.question} className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-base font-semibold text-slate-900">{item.question}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Share */}
        <section className="mt-12" aria-labelledby="act-fba-bip-share">
          <h2 id="act-fba-bip-share" className="text-2xl font-semibold text-slate-900">
            Share this tool
          </h2>
          <ShareButtons title="ACT-Informed FBA & BIP Generator" url={pageUrl} className="mt-4" />
        </section>

        {/* Transformation Program CTA */}
        <section className="mt-12 rounded-2xl bg-emerald-800 text-white p-8 sm:p-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300 mb-2">Go Deeper</p>
            <h2 className="text-2xl font-bold mb-3">
              Want to learn this process with a cohort of school BCBAs?
            </h2>
            <p className="text-emerald-100 mb-2 leading-relaxed">
              The <strong className="text-white">School BCBA Transformation Program</strong> walks you through this and
              much more — live, 6 weeks, starting March 26.
            </p>
            <p className="text-emerald-200 mb-6 text-sm">
              Early bird pricing: <strong className="text-white">$2,499</strong> through March 21.
            </p>
            <a
              href="https://behaviorschool.com/transformation-program"
              className="inline-flex items-center gap-2 bg-white text-emerald-800 font-bold px-7 py-3 rounded-xl hover:bg-emerald-50 transition-colors"
            >
              Reserve Your Spot
            </a>
          </div>
        </section>
      </article>
    </main>
  );
}
