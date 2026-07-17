import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'School BCBA Transformation Program | Behavior School',
  description: 'A six-week applied cohort for school BCBAs focused on assessment judgment, school-adapted functional analysis, ACT-informed tools, and systems leadership.',
  alternates: { canonical: '/transformation-program' },
  openGraph: {
    title: 'School BCBA Transformation Program',
    description: 'Move from crisis responder to systems leader through applied school-based assessment, functional analysis, intervention, and implementation practice.',
    url: '/transformation-program',
    type: 'website',
    siteName: 'Behavior School',
    images: [{ url: '/optimized/Course/course-hero.webp', width: 1200, height: 630, alt: 'School BCBA Transformation Program' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'School BCBA Transformation Program',
    description: 'A six-week applied cohort focused on assessment judgment, functional analysis, ACT-informed tools, and systems leadership.',
    images: ['/optimized/Course/course-hero.webp'],
  },
};

export default function TransformationProgramLayout({ children }: { children: React.ReactNode }) {
  const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://behaviorschool.com';
  const courseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'School BCBA Transformation Program',
    description: 'A six-week applied cohort for certified school BCBAs covering assessment decisions, school-adapted functional analysis, ACT-informed assessment, intervention alignment, and team implementation.',
    provider: { '@type': 'EducationalOrganization', name: 'Behavior School', url: siteUrl },
    instructor: { '@type': 'Person', name: 'Rob Spain', jobTitle: 'BCBA, IBA' },
    courseMode: 'online',
    timeRequired: 'P6W',
    coursePrerequisites: 'BCBA certification',
    audience: { '@type': 'EducationalAudience', audienceType: 'Certified BCBAs working in K-12 schools or districts' },
    teaches: [
      'School-based assessment decisions',
      'School-adapted functional analysis',
      'ACT-informed functional assessment',
      'Evidence-to-intervention alignment',
      'Staff training and implementation systems',
    ],
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      startDate: '2026-08-12',
      endDate: '2026-09-16',
      instructor: { '@type': 'Person', name: 'Rob Spain', jobTitle: 'BCBA, IBA' },
      offers: { '@type': 'Offer', price: '1997', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
    },
  };

  return (
    <>
      {children}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} />
    </>
  );
}
