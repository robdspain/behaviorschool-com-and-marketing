import type { Metadata } from 'next';
import { ComparisonPageLayout } from '@/components/compare/ComparisonPageLayout';
import { STUDY_PRICING, STUDY_PRICING_LINE } from '@/lib/study-pricing';

export const metadata: Metadata = {
  title: 'BehaviorSchool vs StudyABA | BCBA Exam Prep Comparison 2026',
  description: 'Compare BehaviorSchool vs ABA Exam Review for BCBA exam prep. Adaptive practice with rationales versus one-time mock exam bundles, side by side for behavior analysts.',
  keywords: 'BehaviorSchool vs ABA Exam Review, StudyABA alternative, BCBA exam prep comparison, behavioranalyststudy review, BCBA mock exam, BCBA study guide comparison, best BCBA practice exam',
  alternates: { canonical: 'https://behaviorschool.com/compare/behaviorschool-vs-studyaba' },
  openGraph: {
    title: 'BehaviorSchool vs ABA Exam Review – BCBA Exam Prep Comparison 2026',
    description: 'Adaptive practice with rationales vs. one-time mock exam bundles. Compare features, pricing models, and study tools before you choose a BCBA prep platform.',
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
          text: 'It depends on how you study. Behavior Study Tools adapts practice to your weak domains, gives a rationale on every answer, and sits alongside free IEP, FBA, and BIP tools and CEUs for school BCBAs. ABA Exam Review is a one-time purchase of fixed mock exams and study guides that you work through on your own. Candidates who want to pay once and self-direct may prefer ABA Exam Review; candidates who want practice that responds to their results may prefer Behavior Study Tools.',
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
        heroSubtitle="Adaptive practice with rationales, or a one-time bundle of mock exams and study guides? See which BCBA preparation approach fits how you study."
        competitorName="ABA Exam Review"
        competitorDescription="ABA Exam Review is a one-time-purchase BCBA prep product: a set of full-length mock exams, downloadable study guides, flashcards, and a YouTube channel with free study content. It is built around fixed question sets and PDFs rather than practice that adapts to your results. This comparison covers publicly described features, not pass-rate claims or their current catalog."
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
              { name: 'Full Mock Exams', behaviorSchool: true, competitor: true },
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
          { name: 'Try before you pay', behaviorSchool: 'Free practice questions + free mock exam', competitor: 'Sample questions' },
          { name: 'How you pay', behaviorSchool: 'Subscription: monthly, quarterly, or annual', competitor: 'One-time purchase per bundle' },
          { name: 'Behavior Study Tools plans', behaviorSchool: STUDY_PRICING_LINE, competitor: '—' },
          { name: 'What you get after the exam', behaviorSchool: 'IEP, FBA, and BIP tools stay free on behaviorschool.com', competitor: 'Study materials only' },
        ]}
        pricingNote={`Behavior Study Tools prices confirmed in Stripe on ${STUDY_PRICING.stripeCheckedOn}. ABA Exam Review prices are not listed here; the difference that matters is one-time bundle versus subscription.`}
        verdict="ABA Exam Review is a reasonable pick if you want to pay once for a fixed set of mock exams and study guides and work through them on your own. Behavior Study Tools fits better if you want practice that adapts to your weak domains, rationales on every answer, a free tier to try first, and school-based tools (IEP goals, BIP and FBA builders, CEUs) alongside exam prep. Choose based on how you study and whether you need more than exam prep."
        emailSource="compare-vs-studyaba"
        faqItems={[
          {
            q: 'Is ABA Exam Review cheaper than BehaviorSchool?',
            a: `They are priced differently, so it depends on how long you study. ABA Exam Review sells one-time bundles. Behavior Study Tools is a subscription (${STUDY_PRICING_LINE}) that you stop when you pass, and the IEP, FBA, and BIP tools on behaviorschool.com are free either way. A short, focused study window favors the subscription; a long open-ended one favors a one-time bundle.`,
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
            a: 'Question counts change, so check each product page for the current number. The more useful difference is how the questions are delivered: ABA Exam Review gives you fixed mock exams to work through in order, while Behavior Study Tools organizes its bank by BACB task list domain and adapts which questions you see based on your weak areas.',
          },
        ]}
      />
    </>
  );
}
