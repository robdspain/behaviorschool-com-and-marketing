import type { Metadata } from 'next';
import { ComparisonPageLayout } from '@/components/compare/ComparisonPageLayout';
import { STUDY_PRICING, STUDY_PRICING_LINE } from '@/lib/study-pricing';

export const metadata: Metadata = {
  title: 'BehaviorSchool vs MagicSchool AI | IEP Tools 2026',
  description: 'Compare BehaviorSchool vs MagicSchool AI for IEP goal writing, behavior tools, and school BCBA support built for behavior analysts.',
  keywords: 'BehaviorSchool vs MagicSchool, MagicSchool AI alternative, IEP goal writer comparison, AI IEP tools, behavior analyst tools, MagicSchool AI review, best IEP goal generator',
  alternates: { canonical: 'https://behaviorschool.com/compare/behaviorschool-vs-magicschool' },
  openGraph: {
    title: 'BehaviorSchool vs MagicSchool AI – IEP & Behavior Tools Comparison 2026',
    description: 'Specialized behavior analysis tools vs generic AI education platform. Which is better for school BCBAs and special education professionals?',
    url: 'https://behaviorschool.com/compare/behaviorschool-vs-magicschool',
    siteName: 'Behavior School',
    type: 'website',
    images: [{ url: '/optimized/og-image.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BehaviorSchool vs MagicSchool AI – Which Is Better for BCBAs?',
    description: 'Specialized behavior analysis vs generic AI education tools. See the full comparison.',
  },
};

export default function BehaviorSchoolVsMagicSchool() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'BehaviorSchool vs MagicSchool AI Comparison',
    description: 'Detailed comparison of BehaviorSchool and MagicSchool AI for IEP goals, behavior tools, and school BCBA support.',
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is BehaviorSchool better than MagicSchool AI for IEP goals?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For behavior-specific IEP goals, yes. BehaviorSchool is built by a BCBA with expertise in applied behavior analysis. MagicSchool AI offers a general-purpose IEP tool inside a large catalog of teacher tools; it is not built around function-based intervention or behavior-analytic measurement.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does MagicSchool AI have BCBA exam prep?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. MagicSchool AI is a general education AI tool suite. It does not offer BCBA exam prep, behavior plan generators, or any behavior analysis-specific tools.',
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ComparisonPageLayout
        heroTitle="BehaviorSchool vs MagicSchool AI"
        heroSubtitle="Specialized behavior analysis tools built by a BCBA, or a general AI education platform with a large catalog of teacher tools? See which is right for school-based behavior analysts."
        competitorName="MagicSchool AI"
        competitorDescription="MagicSchool AI is a general-purpose AI platform for K-12 educators: lesson planners, quiz and rubric generators, a Chrome extension, and an IEP goal writer among a large catalog of teacher tools, with a free tier and paid individual and district plans. Its IEP and behavior tools are one entry in that catalog rather than a behavior-analytic product. This comparison covers publicly described features, not their current prices or tool count."
        behaviorSchoolAdvantages={[
          'Built by a BCBA specifically for behavior analysts',
          'ABA-grounded IEP goals (not generic education AI)',
          'FBA-to-BIP pipeline — no competitor has this',
          'BCBA exam prep + CEUs + tools in one platform',
          'Behavior-specific goal bank and templates',
          'Deep understanding of school-based behavior challenges',
        ]}
        features={[
          {
            category: 'IEP & Behavior Tools',
            features: [
              { name: 'IEP Goal Writer', behaviorSchool: true, competitor: true },
              { name: 'Behavior-Specific IEP Goals (ABA-based)', behaviorSchool: true, competitor: false },
              { name: 'Behavior Intervention Plan (BIP) Generator', behaviorSchool: true, competitor: false },
              { name: 'FBA-to-BIP AI Pipeline', behaviorSchool: true, competitor: false },
              { name: 'Behavior Goal Bank', behaviorSchool: true, competitor: false },
              { name: 'Progress Monitoring for Behavior Goals', behaviorSchool: true, competitor: false },
              { name: 'Structured goal review', behaviorSchool: true, competitor: 'partial' },
            ],
          },
          {
            category: 'BCBA & Professional Development',
            features: [
              { name: 'BCBA Exam Prep', behaviorSchool: true, competitor: false },
              { name: 'BCBA Practice Questions', behaviorSchool: true, competitor: false },
              { name: 'Continuing Education (CEUs)', behaviorSchool: true, competitor: false },
              { name: 'Supervision Tools', behaviorSchool: true, competitor: false },
              { name: 'School BCBA Community', behaviorSchool: true, competitor: false },
            ],
          },
          {
            category: 'General Education Tools',
            features: [
              { name: 'Lesson Plan Generator', behaviorSchool: false, competitor: true },
              { name: 'Quiz / Assessment Creator', behaviorSchool: false, competitor: true },
              { name: 'Rubric Generator', behaviorSchool: false, competitor: true },
              { name: 'Chrome Extension', behaviorSchool: false, competitor: true },
              { name: 'Large catalog of general teaching tools', behaviorSchool: false, competitor: true },
            ],
          },
          {
            category: 'Platform',
            features: [
              { name: 'Free Tier', behaviorSchool: true, competitor: true },
              { name: 'FERPA / COPPA Compliant', behaviorSchool: true, competitor: true },
              { name: 'School-Based BCBA Focus', behaviorSchool: true, competitor: false },
              { name: 'Built by a Behavior Analyst', behaviorSchool: true, competitor: false },
              { name: 'District / Enterprise Pricing', behaviorSchool: true, competitor: true },
            ],
          },
        ]}
        pricing={[
          { name: 'Free tier', behaviorSchool: 'IEP, FBA, and BIP tools are free', competitor: 'Free tier with usage limits' },
          { name: 'Paid individual plan', behaviorSchool: 'None for school tools (Pro is invite-only)', competitor: 'Monthly or annual subscription' },
          { name: 'BCBA exam prep', behaviorSchool: STUDY_PRICING_LINE, competitor: 'Not offered' },
        ]}
        pricingNote={`Behavior Study Tools prices confirmed in Stripe on ${STUDY_PRICING.stripeCheckedOn}. MagicSchool prices are not listed here; the behavior tools you would compare are free on behaviorschool.com.`}
        verdict="MagicSchool AI is a broad tool for classroom teachers who want help with lesson plans, quizzes, and basic IEP drafts. Behavior School is narrower on purpose: IEP behavior goals written with function and measurement in mind, FBA and BIP builders, BCBA exam prep, and CEUs for behavior analysts. If you are a school BCBA, the behavior-specific tooling is the difference; if you mostly need general teaching support, MagicSchool covers more ground."
        emailSource="compare-vs-magicschool"
        faqItems={[
          {
            q: 'Is BehaviorSchool better than MagicSchool AI for behavior IEP goals?',
            a: 'For behavior-specific goals, Behavior School\'s IEP tools are designed by a practicing school BCBA around function, measurable criteria, and data collection. MagicSchool\'s IEP writer is a general-purpose tool that is not built specifically around behavior-analytic terminology or function-based intervention. Try both with a real goal and compare the output.',
          },
          {
            q: 'Does MagicSchool AI offer BCBA exam prep?',
            a: 'No. MagicSchool AI is designed for general K-12 educators. It has no BCBA exam prep, practice questions, CEU courses, or behavior analysis-specific professional development.',
          },
          {
            q: 'Can I use both platforms?',
            a: 'Yes. The two tools do not overlap much: MagicSchool for general teaching tasks, Behavior School for behavior-specific IEP goals, FBA and BIP work, exam prep, and CEUs.',
          },
          {
            q: 'Does MagicSchool AI have a behavior plan generator?',
            a: 'No. MagicSchool AI does not offer FBA, BIP, or behavior intervention plan tools. BehaviorSchool includes a full FBA-to-BIP AI pipeline specifically designed for school-based behavior analysts.',
          },
          {
            q: 'Which platform is more affordable?',
            a: `For the tools a school BCBA would actually compare, Behavior School's IEP goal, FBA, and BIP tools are free with no paid tier. MagicSchool has a free tier with limits and a paid individual subscription for its full teacher toolkit. Behavior Study Tools exam prep is a separate subscription (${STUDY_PRICING_LINE}). Value depends on which set of tools you will actually use.`,
          },
        ]}
      />
    </>
  );
}
