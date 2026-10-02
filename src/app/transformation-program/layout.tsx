import type { Metadata } from 'next';
import { TRANSFORMATION_PROGRAM } from '@/lib/transformation-program';

const programName = TRANSFORMATION_PROGRAM.name;
const scheduleSentence = `${TRANSFORMATION_PROGRAM.cohort.scheduleLabel.charAt(0).toUpperCase()}${TRANSFORMATION_PROGRAM.cohort.scheduleLabel.slice(1)}`;

export const metadata: Metadata = {
  title: `${programName} | Behavior School`,
  description: `${scheduleSentence} for certified school BCBAs in K-12 school or district settings. Build assessment judgment, school-adapted functional analysis, ACT-informed tools, and systems leadership.`,
  alternates: { canonical: '/transformation-program' },
  openGraph: {
    title: programName,
    description: `${scheduleSentence} for certified school BCBAs in K-12 settings. Build assessment judgment, functional analysis, intervention alignment, and implementation systems.`,
    url: '/transformation-program',
    type: 'website',
    siteName: 'Behavior School',
    images: [{ url: '/optimized/Course/course-hero.webp', width: 1200, height: 630, alt: programName }],
  },
  twitter: {
    card: 'summary_large_image',
    title: programName,
    description: `${scheduleSentence} for certified school BCBAs in K-12 school or district settings.`,
    images: ['/optimized/Course/course-hero.webp'],
  },
};

export default function TransformationProgramLayout({ children }: { children: React.ReactNode }) {
  const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://behaviorschool.com';
  const courseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: programName,
    description: `${scheduleSentence} for certified school BCBAs covering assessment decisions, school-adapted functional analysis, ACT-informed assessment, intervention alignment, and team implementation in K-12 settings.`,
    provider: { '@type': 'EducationalOrganization', name: 'Behavior School', url: siteUrl },
    instructor: { '@type': 'Person', name: 'Rob Spain', jobTitle: 'BCBA, IBA' },
    courseMode: 'online',
    timeRequired: 'P7W',
    coursePrerequisites: 'BCBA certification',
    audience: { '@type': 'EducationalAudience', audienceType: 'Certified BCBAs working in K-12 schools or districts' },
    teaches: [
      'School assessment decisions',
      'School-adapted functional analysis',
      'ACT-informed functional assessment',
      'Evidence-to-intervention alignment',
      'Staff training and implementation systems',
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

  return (
    <>
      {children}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} />
    </>
  );
}
