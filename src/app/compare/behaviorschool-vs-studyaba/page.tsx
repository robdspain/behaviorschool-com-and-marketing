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
          'Adaptive practice that weights your weak domains (not static question sets)',
          'A rationale on every answer, shown as soon as you respond',
          'School-based BCBA scenarios and content',
          'Free IEP goal, FBA, and BIP tools on behaviorschool.com',
          'Web app you can use in any browser (not PDFs)',
          'Exam prep, CEUs, and school BCBA tools in one place',
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
              { name: 'Supervision Resources', behaviorSchool: true, competitor: false },
            ],
          },
          {
            category: 'Platform & Experience',
            features: [
              { name: 'Web App (any browser)', behaviorSchool: true, competitor: false },
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
            a: `It depends on how long you study. ABA Exam Review is a one-time purchase, so the price is the same whether you use it for a month or a year. Behavior Study Tools is a subscription (${STUDY_PRICING_LINE}) that you cancel when you pass. A focused study window of a few months usually favors the subscription; an open-ended, on-and-off study plan favors paying once. The IEP, FBA, and BIP tools on behaviorschool.com are free either way.`,
          },
          {
            q: 'Does ABA Exam Review adapt to my weak areas?',
            a: 'No. ABA Exam Review is a fixed set of mock exams, study guides, and flashcards; you decide what to review after each mock. Behavior Study Tools flags the domain you missed as soon as you answer, shows the rationale, and weights your next practice set toward those domains. The difference matters most in the last few weeks before the exam, when you need to spend time where the points are.',
          },
          {
            q: 'Can I try BehaviorSchool before paying?',
            a: 'Yes. Start with free practice questions or a free timed mock exam on study.behaviorschool.com. Both show domain-level results and rationales without a credit card, so you can judge the workflow on real questions before deciding.',
          },
          {
            q: 'Does ABA Exam Review offer IEP or behavior plan tools?',
            a: 'No. ABA Exam Review is exam preparation only. Behavior School includes free IEP behavior goal, FBA, and BIP tools that you keep using after you pass, so the exam prep sits inside a set of tools built for school-based practice.',
          },
          {
            q: 'Which has more practice questions?',
            a: 'Counts change, so check each product page for the current number. The more useful question is how the questions are delivered. ABA Exam Review gives you complete mock exams to sit through in order; Behavior Study Tools organizes its bank by BACB Test Content Outline domain and chooses questions based on your results. If you want to rehearse the full exam repeatedly, fixed mocks work. If you want to fix specific domains between mocks, adaptive practice works.',
          },
        ]}
      />
    </>
  );
}
