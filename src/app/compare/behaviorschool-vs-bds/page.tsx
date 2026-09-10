import type { Metadata } from 'next';
import { ComparisonPageLayout } from '@/components/compare/ComparisonPageLayout';
import { getFounderEducationYears, FOUNDER_EDUCATION_START_LABEL } from '@/lib/founder-tenure';
import { STUDY_PRICING, STUDY_PRICING_LINE } from '@/lib/study-pricing';

export const metadata: Metadata = {
  title: 'BehaviorSchool vs BDS | BCBA Exam Prep Comparison 2026',
  description: 'Compare BehaviorSchool vs BDS for BCBA exam prep. See features, pricing, fluency modules, and which platform fits school BCBA candidates in 2026.',
  keywords: 'BehaviorSchool vs BDS, Behavior Development Solutions review, BCBA exam prep comparison, BDS alternative, best BCBA exam prep 2026, BCBA practice exam',
  alternates: { canonical: 'https://behaviorschool.com/compare/behaviorschool-vs-bds' },
  openGraph: {
    title: 'BehaviorSchool vs BDS – BCBA Exam Prep Comparison 2026',
    description: 'Side-by-side comparison of BehaviorSchool and Behavior Development Solutions for BCBA exam preparation. AI-powered tools vs traditional question banks.',
    url: 'https://behaviorschool.com/compare/behaviorschool-vs-bds',
    siteName: 'Behavior School',
    type: 'website',
    images: [{ url: '/optimized/og-image.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BehaviorSchool vs BDS – BCBA Exam Prep Comparison 2026',
    description: 'Which BCBA exam prep platform is right for you? Compare features, pricing, and AI tools.',
  },
};

export default function BehaviorSchoolVsBDS() {
  const founderEducationYears = getFounderEducationYears();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'BehaviorSchool vs BDS Comparison',
    description: 'Detailed comparison of BehaviorSchool and Behavior Development Solutions for BCBA exam preparation.',
    mainEntity: {
      '@type': 'Table',
      about: 'BCBA Exam Prep Platform Comparison',
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is BehaviorSchool better than BDS for BCBA exam prep?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'BehaviorSchool offers adaptive practice, school BCBA focus, and free public study resources alongside exam prep. BDS (Behavior Development Solutions) is a long-established fluency-based program with modular questions, domain tests, and a published money-back guarantee. The best choice depends on whether you want drill-heavy modules or a broader study workflow with mocks and readiness reporting.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does BDS have AI-powered study tools?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'BDS uses a traditional fluency-based module approach rather than AI-adaptive study paths. BehaviorSchool uses adaptive practice and personalized explanations where available in the study app.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I try BehaviorSchool for free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. BehaviorSchool offers free BCBA practice questions, IEP goal writing tools, and study resources. No credit card is required to get started.',
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ComparisonPageLayout
        heroTitle="BehaviorSchool vs BDS"
        heroSubtitle="Compare BehaviorSchool’s mock-and-readiness workflow against BDS’s established CBA Learning Module Series. See when each platform fits."
        competitorName="BDS"
        competitorUrl="https://bds.com"
        competitorDescription="Behavior Development Solutions (BDS) publishes the CBA Learning Module Series with 3,500+ module questions, domain tests, a mock exam, and a money-back guarantee on its BCBA prep product page. This comparison focuses on publicly described features—not pass-rate claims."
        behaviorSchoolAdvantages={[
          'Adaptive practice with domain-level readiness where available',
          'Built for school BCBA candidates and school-relevant scenarios',
          'Free tier with practice questions and public study resources',
          'Timed full mock exams with score reports',
          'Free IEP goal writer and behavior plan tools on behaviorschool.com',
          `Created by a BCBA with ${founderEducationYears} years in education since ${FOUNDER_EDUCATION_START_LABEL}`,
        ]}
        features={[
          {
            category: 'Exam Prep',
            features: [
              { name: 'BCBA Practice Questions', behaviorSchool: true, competitor: true },
              { name: 'AI-Powered Adaptive Learning', behaviorSchool: true, competitor: false },
              { name: 'Mock Exams', behaviorSchool: true, competitor: true },
              { name: 'Structured Module / Study Path', behaviorSchool: 'partial', competitor: true },
              { name: 'AI Explanations for Wrong Answers', behaviorSchool: true, competitor: 'Not verified' },
              { name: 'School BCBA Scenarios', behaviorSchool: true, competitor: 'Not verified' },
              { name: 'Fluency-Based Training', behaviorSchool: 'partial', competitor: true },
              { name: 'Mobile-Friendly Web Access', behaviorSchool: true, competitor: 'partial' },
              { name: 'Modular fluency curriculum', behaviorSchool: 'partial', competitor: true },
              { name: 'Money-Back Guarantee (published)', behaviorSchool: false, competitor: true },
              { name: '3,500+ module questions (per BDS product page)', behaviorSchool: 'partial', competitor: true },
            ],
          },
          {
            category: 'Additional Tools',
            features: [
              { name: 'IEP Goal Writer', behaviorSchool: true, competitor: false },
              { name: 'Behavior Intervention Plan Generator', behaviorSchool: true, competitor: false },
              { name: 'FBA-to-BIP Pipeline', behaviorSchool: true, competitor: false },
              { name: 'CEU / Continuing Education', behaviorSchool: true, competitor: 'partial' },
              { name: 'Supervision Tools', behaviorSchool: 'partial', competitor: 'Not verified' },
              { name: 'Professional Community', behaviorSchool: 'partial', competitor: 'Not verified' },
            ],
          },
          {
            category: 'Platform & Experience',
            features: [
              { name: 'Modern UI/UX', behaviorSchool: true, competitor: 'Not verified' },
              { name: 'Free Tier Available', behaviorSchool: true, competitor: 'partial' },
              { name: 'School BCBA Focus', behaviorSchool: true, competitor: 'Not verified' },
              { name: 'Video Content', behaviorSchool: true, competitor: 'partial' },
              { name: 'Blog & Study Resources', behaviorSchool: true, competitor: 'partial' },
            ],
          },
        ]}
        pricing={[
          { name: 'Free Tier', behaviorSchool: 'Free practice tier', competitor: 'Free demo (per BDS site)' },
          { name: 'Practice Questions', behaviorSchool: 'Free tier + paid plans', competitor: 'See BDS subscription options' },
          { name: 'Full Exam Prep', behaviorSchool: STUDY_PRICING_LINE, competitor: 'See BDS CBA LMS pricing' },
          { name: 'IEP + Behavior Tools', behaviorSchool: 'Included free on site', competitor: 'Not offered' },
        ]}
        pricingNote={`Behavior Study Tools prices confirmed in Stripe on ${STUDY_PRICING.stripeCheckedOn}. BDS publishes its own subscription prices on its site; we do not restate them here.`}
        verdict="Choose BDS if you want an established, module-driven fluency program with thousands of published module questions, domain tests, and a money-back guarantee—and you are comfortable studying primarily through structured drills. Choose BehaviorSchool if you want timed mock checkpoints, domain readiness reporting where available, school BCBA scenarios, and free practice tools on behaviorschool.com."
        emailSource="compare-vs-bds"
        faqItems={[
          {
            q: 'Is BehaviorSchool better than BDS for BCBA exam prep?',
            a: 'It depends on your study style. BDS excels if you want modular fluency training, a large published question library, domain tests, and BDS’s advertised money-back guarantee. BehaviorSchool fits better if you want timed full mocks, domain readiness signals where available, adaptive practice, and school BCBA scenarios alongside free public tools. Neither replaces the other for every candidate.',
          },
          {
            q: 'When does BDS make more sense than BehaviorSchool?',
            a: 'Candidates who prefer long-running fluency modules, BDS’s published module-and-domain-test structure, and a vendor-advertised money-back guarantee may prefer BDS—especially if they do not need shareable progress summaries or school-practice tools on the same platform.',
          },
          {
            q: 'Does BDS have AI or adaptive learning?',
            a: 'BDS markets a traditional fluency-based module approach. BehaviorSchool uses adaptive practice where available in the study app. Compare both workflows directly before choosing.',
          },
          {
            q: 'Can I try BehaviorSchool before paying?',
            a: 'Yes. BehaviorSchool offers free BCBA practice questions, IEP goal writing tools, and study resources with no credit card required.',
          },
          {
            q: 'Does this comparison include pass-rate claims?',
            a: 'No. We do not publish or repeat vendor pass-rate claims here. Compare preparation methods, practice experience, and features that fit your study needs.',
          },
          {
            q: 'Does BDS offer IEP or behavior plan tools?',
            a: 'No. BDS focuses on BCBA exam preparation. BehaviorSchool includes IEP goal writing, behavior intervention plan generators, and FBA-to-BIP tools on behaviorschool.com.',
          },
        ]}
      />
    </>
  );
}
