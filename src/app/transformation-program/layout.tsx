import type { Metadata } from 'next';
import { TRANSFORMATION_PROGRAM, TRANSFORMATION_PROGRAM_FAQ } from '@/lib/transformation-program';

const META_DESCRIPTION = `Six-week live cohort for school BCBAs. Build FBA triage, function-based BIPs, staff fidelity systems, and caseload review. ${TRANSFORMATION_PROGRAM.cohort.label}, ${TRANSFORMATION_PROGRAM.cohort.seatCap} seats.`;

export const metadata: Metadata = {
  title: 'School BCBA Transformation Program | Behavior School',
  description: META_DESCRIPTION,
  alternates: { canonical: '/transformation-program' },
  openGraph: {
    title: 'School BCBA Transformation Program',
    description: META_DESCRIPTION,
    url: '/transformation-program',
    type: 'website',
    siteName: 'Behavior School',
    images: [{ url: '/optimized/Course/course-hero.webp', width: 1200, height: 630, alt: 'School BCBA Transformation Program' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'School BCBA Transformation Program',
    description: META_DESCRIPTION,
    images: ['/optimized/Course/course-hero.webp'],
  },
};

export default function TransformationProgramLayout({ children }: { children: React.ReactNode }) {
  const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://behaviorschool.com';
  const courseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'School BCBA Transformation Program',
    description: 'A six-week live cohort for certified school BCBAs covering tiered assessment routing, data collection systems, FBA hypothesis development, function-based BIP design, staff implementation and fidelity, and caseload progress monitoring in K-12 settings.',
    url: `${siteUrl}/transformation-program`,
    provider: { '@type': 'EducationalOrganization', name: 'Behavior School', url: siteUrl },
    instructor: { '@type': 'Person', name: 'Rob Spain', jobTitle: 'BCBA, IBA', url: 'https://robspain.com' },
    courseMode: 'online',
    timeRequired: 'P6W',
    coursePrerequisites: 'BCBA certification',
    audience: { '@type': 'EducationalAudience', audienceType: 'Certified BCBAs working in K-12 schools or districts' },
    teaches: [
      'Tiered assessment routing for school referrals',
      'Data collection systems for school staff',
      'FBA hypothesis development and function verification',
      'Function-based BIP design',
      'Staff training, implementation, and fidelity systems',
      'Caseload progress monitoring and decision rules',
    ],
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      startDate: TRANSFORMATION_PROGRAM.cohort.startDate,
      endDate: TRANSFORMATION_PROGRAM.cohort.endDate,
      instructor: { '@type': 'Person', name: 'Rob Spain', jobTitle: 'BCBA, IBA' },
      offers: { '@type': 'Offer', price: String(TRANSFORMATION_PROGRAM.pricing.payInFullCents / 100), priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: TRANSFORMATION_PROGRAM_FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <>
      {children}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
