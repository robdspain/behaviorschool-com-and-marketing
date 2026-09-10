import type { Metadata } from 'next';
import { ComparisonPageLayout } from '@/components/compare/ComparisonPageLayout';
import { STUDY_PRICING, STUDY_PRICING_LINE } from '@/lib/study-pricing';

export const metadata: Metadata = {
  title: 'BehaviorSchool vs StudyABA | BCBA Exam Prep Comparison 2026',
  description: 'Compare BehaviorSchool vs ABA Exam Review for BCBA exam prep. Mock exams, study guides, AI tools, and pricing compared side-by-side for behavior analysts.',
  keywords: 'BehaviorSchool vs ABA Exam Review, StudyABA alternative, BCBA exam prep comparison, behavioranalyststudy review, BCBA mock exam, BCBA study guide comparison, best BCBA practice exam',
  alternates: { canonical: 'https://behaviorschool.com/compare/behaviorschool-vs-studyaba' },
  openGraph: {
    title: 'BehaviorSchool vs ABA Exam Review – BCBA Exam Prep Comparison 2026',
    description: 'Adaptive practice with rationales vs. one-time mock exam bundles. Compare features, pricing, and study tools before you choose a BCBA prep platform.',
    url: 'https://behaviorschool.com/compare/behaviorschool-vs-studyaba',
    siteName: 'Behavior School',
    type: 'website',
    images: [{ url: '/optimized/og-image.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BehaviorSchool vs ABA Exam Review – BCBA Prep Comparison 2026',
    description: 'Adaptive practice vs. static mock exams. A side-by-side BCBA exam prep comparison.',
  },
};

export default function BehaviorSchoolVsStudyABA() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'BehaviorSchool vs ABA Exam Review Comparison',
    description: 'Detailed comparison of BehaviorSchool and ABA Exam Review for BCBA exam preparation.',
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is BehaviorSchool better than ABA Exam Review?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'BehaviorSchool offers AI-adaptive learning, school-based BCBA focus, and additional tools (IEP writer, BIP generator, CEUs) alongside exam prep. ABA Exam Review offers affordable static mock exams and study guides. BehaviorSchool provides more features and a modern learning experience.',
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ComparisonPageLayout
        heroTitle="BehaviorSchool vs ABA Exam Review"
        heroSubtitle="Compare AI-powered adaptive exam prep against traditional mock exams and study guides. See which BCBA preparation platform is right for your study style."
        competitorName="ABA Exam Review"
        competitorUrl="https://behavioranalyststudy.com"
        competitorDescription="ABA Exam Review (behavioranalyststudy.com) offers a straightforward, affordable approach to BCBA exam prep with 8 mock exams containing 1,480 practice questions, downloadable study guides, flashcards, and a YouTube channel with free study content. It's a popular budget option for BCBA candidates, though it uses static PDFs and pre-set question banks without adaptive or AI technology."
        behaviorSchoolAdvantages={[
          'AI-powered adaptive practice (not static question sets)',
          'Personalized study paths based on your weak areas',
          'School-based BCBA scenarios and content',
          'IEP + behavior plan tools included at no extra cost',
          'Modern, interactive platform (not PDFs)',
          'All-in-one: exam prep + CEUs + tools + community',
        ]}
        features={[
          {
            category: 'Exam Prep',
            features: [
              { name: 'BCBA Practice Questions', behaviorSchool: true, competitor: true },
              { name: 'Full Mock Exams', behaviorSchool: true, competitor: '8 mock exams (1,480 Qs)' },
              { name: 'AI-Adaptive Question Selection', behaviorSchool: true, competitor: false },
              { name: 'Personalized Study Plans', behaviorSchool: true, competitor: false },
              { name: 'AI-Generated Explanations', behaviorSchool: true, competitor: false },
              { name: 'Study Guide (6th Edition)', behaviorSchool: true, competitor: true },
              { name: 'Flashcards', behaviorSchool: true, competitor: true },
              { name: 'Free YouTube Content', behaviorSchool: 'partial', competitor: true },
              { name: 'School-Based Scenarios', behaviorSchool: true, competitor: false },
            ],
          },
          {
            category: 'Additional Tools',
            features: [
              { name: 'IEP Goal Writer', behaviorSchool: true, competitor: false },
              { name: 'Behavior Intervention Plan Generator', behaviorSchool: true, competitor: false },
              { name: 'FBA-to-BIP Pipeline', behaviorSchool: true, competitor: false },
              { name: 'Continuing Education (CEUs)', behaviorSchool: true, competitor: false },
              { name: 'Supervision Tools', behaviorSchool: true, competitor: false },
              { name: 'Professional Community', behaviorSchool: true, competitor: false },
            ],
          },
          {
            category: 'Platform & Experience',
            features: [
              { name: 'Modern Web Platform', behaviorSchool: true, competitor: false },
              { name: 'Mobile-Friendly', behaviorSchool: true, competitor: 'partial' },
              { name: 'Interactive Learning (not PDFs)', behaviorSchool: true, competitor: false },
              { name: 'Progress Tracking & Analytics', behaviorSchool: true, competitor: false },
              { name: 'Free Tier Available', behaviorSchool: true, competitor: false },
              { name: 'Budget-Friendly One-Time Purchase', behaviorSchool: false, competitor: true },
            ],
          },
        ]}
        pricing={[
          { name: 'Free tier', behaviorSchool: 'Free practice questions + mock exam', competitor: 'Sample questions only' },
          { name: 'Monthly', behaviorSchool: STUDY_PRICING.monthly.short, competitor: 'Not offered' },
          { name: 'Quarterly', behaviorSchool: STUDY_PRICING.quarterly.short, competitor: 'Not offered' },
          { name: 'Annual / one-time', behaviorSchool: STUDY_PRICING.annual.short, competitor: '$115 mock exams or $140 combo' },
          { name: 'IEP + behavior tools', behaviorSchool: 'Free on behaviorschool.com', competitor: 'Not available' },
        ]}
        pricingNote={`Behavior Study Tools prices confirmed in Stripe on ${STUDY_PRICING.stripeCheckedOn}. ABA Exam Review prices and the 1,480-question / 8-exam count are from behavioranalyststudy.com, checked ${STUDY_PRICING.stripeCheckedOn}.`}
        verdict="ABA Exam Review is a reasonable pick if you want a one-time purchase of mock exams and study guides. BehaviorSchool Study fits better if you want adaptive practice with rationales, a free tier to try first, and school-based tools (IEP goals, BIP and FBA builders, CEUs) alongside exam prep. Choose based on how you study and whether you need more than exam prep."
        emailSource="compare-vs-studyaba"
        faqItems={[
          {
            q: 'Is ABA Exam Review cheaper than BehaviorSchool?',
            a: `ABA Exam Review sells one-time packs ($115 for mock exams, $140 for the combo, checked ${STUDY_PRICING.stripeCheckedOn} on its product page). Behavior Study Tools is a subscription: ${STUDY_PRICING_LINE}. IEP, FBA, and BIP tools on behaviorschool.com stay free. Which is cheaper depends on how long you study.`,
          },
          {
            q: 'Does ABA Exam Review have AI tools?',
            a: 'Based on its published product pages, ABA Exam Review uses PDFs, pre-set mock exams, and flashcards rather than adaptive practice. BehaviorSchool Study adapts question selection to your weak domains and provides rationales for each answer.',
          },
          {
            q: 'Can I try BehaviorSchool before committing?',
            a: 'Yes! BehaviorSchool offers free BCBA practice questions, IEP goal writing tools, and study resources. No credit card required.',
          },
          {
            q: 'Does ABA Exam Review offer IEP or behavior plan tools?',
            a: 'No. ABA Exam Review focuses exclusively on BCBA exam preparation materials. BehaviorSchool includes IEP goal writing, BIP generators, FBA tools, and more.',
          },
          {
            q: 'Which has more practice questions?',
            a: 'ABA Exam Review lists 1,480 questions across 8 mock exams on its product pages. BehaviorSchool Study draws from a question bank organized by BACB task list domain and adapts which questions you see based on your weak areas, so the count you practice depends on how you use it.',
          },
        ]}
      />
    </>
  );
}
