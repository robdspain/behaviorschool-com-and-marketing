import type { Metadata } from 'next';
import { ComparisonPageLayout } from '@/components/compare/ComparisonPageLayout';
import { getFounderEducationYears, FOUNDER_EDUCATION_START_LABEL } from '@/lib/founder-tenure';

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
          text: 'BehaviorSchool offers AI-powered adaptive learning, school BCBA focus, and free practice tools alongside exam prep. BDS (Behavior Development Solutions) is a long-established fluency-based program with a large modular question library and traditional precision-teaching approach. The best choice depends on whether you want drill-heavy modules or a broader study workflow with mocks and readiness reporting.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does BDS have AI-powered study tools?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. BDS uses a traditional fluency-based question bank approach. BehaviorSchool uses AI to provide adaptive practice questions, personalized study paths, and intelligent explanations.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I try BehaviorSchool for free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! BehaviorSchool offers free BCBA practice questions, IEP goal writing tools, and study resources. No credit card required to get started.',
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
        heroSubtitle="Compare BehaviorSchool’s mock-and-readiness workflow against BDS’s established fluency modules and large question library. See when each platform fits."
        competitorName="BDS"
        competitorUrl="https://bds.com"
        competitorDescription="Behavior Development Solutions (BDS) has offered BCBA exam preparation for decades, with modular fluency training, a large question bank, and a traditional precision-teaching lineage. This comparison focuses on study workflow and publicly described features—not pass-rate claims."
        behaviorSchoolAdvantages={[
          'AI-powered adaptive practice with domain-level readiness',
          'Built for school BCBA candidates and school-relevant scenarios',
          'Free tier with practice questions and public study resources',
          'Timed full mock exams with score reports',
          'IEP goal writer and behavior plan tools on the marketing site',
          `Created by a BCBA with ${founderEducationYears} years in education since ${FOUNDER_EDUCATION_START_LABEL}`,
        ]}
        features={[
          {
            category: 'Exam Prep',
            features: [
              { name: 'BCBA Practice Questions', behaviorSchool: true, competitor: true },
              { name: 'AI-Powered Adaptive Learning', behaviorSchool: true, competitor: false },
              { name: 'Mock Exams', behaviorSchool: true, competitor: true },
              { name: 'Personalized Study Plans', behaviorSchool: true, competitor: false },
              { name: 'AI Explanations for Wrong Answers', behaviorSchool: true, competitor: false },
              { name: 'School BCBA Scenarios', behaviorSchool: true, competitor: false },
              { name: 'Fluency-Based Training', behaviorSchool: true, competitor: true },
              { name: 'Mobile App / Mobile-Friendly', behaviorSchool: true, competitor: false },
              { name: 'Modular fluency curriculum', behaviorSchool: 'partial', competitor: true },
              { name: 'Money-Back Guarantee', behaviorSchool: false, competitor: true },
              { name: 'Large legacy question bank (4,000+ items)', behaviorSchool: 'partial', competitor: true },
            ],
          },
          {
            category: 'Additional Tools',
            features: [
              { name: 'IEP Goal Writer', behaviorSchool: true, competitor: false },
              { name: 'Behavior Intervention Plan Generator', behaviorSchool: true, competitor: false },
              { name: 'FBA-to-BIP Pipeline', behaviorSchool: true, competitor: false },
              { name: 'CEU / Continuing Education', behaviorSchool: true, competitor: false },
              { name: 'Supervision Tools', behaviorSchool: true, competitor: false },
              { name: 'Professional Community', behaviorSchool: true, competitor: false },
            ],
          },
          {
            category: 'Platform & Experience',
            features: [
              { name: 'Modern UI/UX', behaviorSchool: true, competitor: false },
              { name: 'Free Tier Available', behaviorSchool: true, competitor: false },
              { name: 'School BCBA Focus', behaviorSchool: true, competitor: false },
              { name: 'Video Content', behaviorSchool: true, competitor: false },
              { name: 'Blog & Study Resources', behaviorSchool: true, competitor: 'partial' },
            ],
          },
        ]}
        pricing={[
          { name: 'Free Tier', behaviorSchool: '✅ Free forever', competitor: '❌ No free tier' },
          { name: 'Practice Questions', behaviorSchool: 'Free (basic) / $49 full', competitor: '$200–$350' },
          { name: 'Full Exam Prep', behaviorSchool: '$149/6mo or $199/yr', competitor: '$200–$350 (3–12mo)' },
          { name: 'IEP + Behavior Tools', behaviorSchool: 'Included free', competitor: 'Not available' },
          { name: 'All-Access Bundle', behaviorSchool: '$249/yr', competitor: 'N/A' },
        ]}
        verdict="Choose BDS if you want a established, module-driven fluency program with a very large question bank and you are comfortable studying primarily through structured drills. Choose BehaviorSchool if you want timed mock checkpoints, domain readiness reporting, school BCBA scenarios, and optional practice tools beyond exam prep—all in a modern web workflow."
        emailSource="compare-vs-bds"
        faqItems={[
          {
            q: 'Is BehaviorSchool better than BDS for BCBA exam prep?',
            a: 'It depends on your study style. BDS excels if you want modular fluency training, a large established question bank, and a traditional BDS-style progression with a money-back guarantee. BehaviorSchool fits better if you want timed full mocks, domain readiness signals, adaptive practice, and school BCBA scenarios alongside free public tools. Neither replaces the other for every candidate.',
          },
          {
            q: 'When does BDS make more sense than BehaviorSchool?',
            a: 'Candidates who prefer long-running fluency modules, maximum drill volume, and BDS’s historical precision-teaching format may prefer BDS—especially if they do not need supervisor progress exports or school-practice tools on the same platform.',
          },
          {
            q: 'Does BDS have AI or adaptive learning?',
            a: 'No. BDS uses a traditional fluency-based approach with fixed question sets. BehaviorSchool uses AI to adapt to your knowledge gaps, provide personalized explanations, and create customized study paths.',
          },
          {
            q: 'Can I try BehaviorSchool before paying?',
            a: 'Yes! BehaviorSchool offers free BCBA practice questions, IEP goal writing tools, and study resources with no credit card required.',
          },
          {
            q: 'Does this comparison include pass-rate claims?',
            a: 'No. We do not publish or repeat pass-rate claims here. Compare the preparation methods, practice experience, and features that fit your study needs.',
          },
          {
            q: 'Does BDS offer IEP or behavior plan tools?',
            a: 'No. BDS focuses exclusively on BCBA exam preparation. BehaviorSchool includes IEP goal writing, behavior intervention plan generators, FBA-to-BIP tools, and more — all included in your subscription.',
          },
        ]}
      />
    </>
  );
}
