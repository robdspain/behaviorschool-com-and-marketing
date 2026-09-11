import type { Metadata } from 'next';
import { ComparisonPageLayout } from '@/components/compare/ComparisonPageLayout';
import { STUDY_PRICING, STUDY_PRICING_LINE } from '@/lib/study-pricing';

export const metadata: Metadata = {
  title: 'Behavior School vs MagicSchool AI: IEP & Behavior Tools',
  description: 'Compare BehaviorSchool vs MagicSchool AI for IEP goal writing, behavior tools, and school BCBA support built for behavior analysts.',
  keywords: 'BehaviorSchool vs MagicSchool, MagicSchool AI alternative, IEP goal writer comparison, AI IEP tools, behavior analyst tools, MagicSchool AI review, best IEP goal generator',
  alternates: { canonical: 'https://behaviorschool.com/compare/behaviorschool-vs-magicschool' },
  openGraph: {
    title: 'Behavior School vs MagicSchool AI: IEP & Behavior Tools',
    description: 'Specialized behavior analysis tools vs generic AI education platform. Which is better for school BCBAs and special education professionals?',
    url: 'https://behaviorschool.com/compare/behaviorschool-vs-magicschool',
    siteName: 'Behavior School',
    type: 'website',
    images: [{ url: '/optimized/og-image.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Behavior School vs MagicSchool AI: IEP & Behavior Tools',
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
          text: 'For behavior-specific IEP goals, Behavior School is the more specialized tool. Its goal writer was built by a practicing school BCBA and walks you through the target behavior, context, measurement, baseline, and mastery criterion before it produces an editable draft. MagicSchool AI includes an IEP goal writer inside a broad catalog of teacher tools; it is a general-purpose drafting aid rather than a behavior-analytic one. Run the same goal through both and compare what comes back.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does MagicSchool AI have BCBA exam prep?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. MagicSchool AI is built for general K-12 teaching and its published catalog does not include BCBA exam preparation, practice questions, or CEUs. Behavior School pairs its free IEP, FBA, and BIP tools with Behavior Study Tools for exam prep and CEU courses for behavior analysts.',
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
          'Built by a practicing school BCBA for behavior analysts',
          'IEP behavior goals written around function, measurable criteria, and data collection',
          'FBA and BIP builders that carry assessment findings into the plan',
          'BCBA exam prep and CEUs alongside the school tools',
          'Behavior-specific goal bank and templates',
          'Free to use for IEP, FBA, and BIP work',
        ]}
        features={[
          {
            category: 'IEP & Behavior Tools',
            features: [
              { name: 'IEP Goal Writer', behaviorSchool: true, competitor: true },
              { name: 'Behavior-Specific IEP Goals (ABA-based)', behaviorSchool: true, competitor: false },
              { name: 'Behavior Intervention Plan (BIP) Generator', behaviorSchool: true, competitor: false },
              { name: 'FBA Builder', behaviorSchool: true, competitor: false },
              { name: 'Behavior Goal Bank', behaviorSchool: true, competitor: false },
              { name: 'Structured goal review', behaviorSchool: true, competitor: 'partial' },
            ],
          },
          {
            category: 'BCBA & Professional Development',
            features: [
              { name: 'BCBA Exam Prep', behaviorSchool: true, competitor: false },
              { name: 'BCBA Practice Questions', behaviorSchool: true, competitor: false },
              { name: 'Continuing Education (CEUs)', behaviorSchool: true, competitor: false },
              { name: 'Supervision Resources', behaviorSchool: true, competitor: false },
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
              { name: 'Published FERPA Overview', behaviorSchool: true, competitor: true },
              { name: 'School-Based BCBA Focus', behaviorSchool: true, competitor: false },
              { name: 'Built by a Behavior Analyst', behaviorSchool: true, competitor: false },
              { name: 'District Plans', behaviorSchool: 'partial', competitor: true },
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
            a: 'For behavior goals, Behavior School is the more specialized tool. Its goal writer walks you through the target behavior, context, measurement, baseline, and mastery criterion, then hands you an editable draft for the IEP team. MagicSchool\'s IEP writer is a general drafting aid that works from a short prompt. The fastest test is to run the same student scenario through both and compare which draft you would actually put in front of a team.',
          },
          {
            q: 'Does MagicSchool AI offer BCBA exam prep?',
            a: 'No. MagicSchool AI is built for general K-12 teaching, and its published catalog does not include BCBA exam preparation, practice questions, or CEUs. Behavior School pairs its free school tools with Behavior Study Tools for exam prep and CEU courses for behavior analysts.',
          },
          {
            q: 'Can I use both platforms?',
            a: 'Yes. Use MagicSchool for lesson-adjacent work such as rubrics, quizzes, and parent letters. Use Behavior School for the behavior-specific pieces: IEP behavior goals, FBAs, BIPs, exam prep, and CEUs. The two barely overlap, so there is no need to pick one.',
          },
          {
            q: 'Does MagicSchool AI have a behavior plan generator?',
            a: 'Not as a behavior-analytic tool. MagicSchool\'s published catalog does not include an FBA or BIP builder; its behavior-related outputs come from general-purpose writing tools. Behavior School\'s FBA and BIP builders are free and structured around what a school-based behavior analyst has to document: target behavior, function, prevention and teaching strategies, reinforcement, and a data collection plan.',
          },
          {
            q: 'Which platform is more affordable?',
            a: `For the tools a school BCBA would compare, Behavior School's IEP goal, FBA, and BIP tools are free with no paid tier. MagicSchool has a free tier with usage limits and a paid individual subscription for its full teacher toolkit. Behavior Study Tools exam prep is a separate subscription (${STUDY_PRICING_LINE}) and is not required for the school tools. Value comes down to which set of tools you will actually open each week.`,
          },
        ]}
        showExamPracticePaths={false}
      />
    </>
  );
}
