import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free BCBA CEU Masterclass | School BCBA Mastery Fundamentals',
  description: 'Free 1-hour masterclass for school BCBAs. Earn 1.0 BACB CEU credits. Learn ethics, teacher buy-in, data systems, and crisis management. BACB ACE Provider: OP-25-11420.',
  keywords: 'BCBA CEU, free BCBA training, school BCBA course, BACB continuing education, behavior analyst CEU, school-based BCBA, ethics training, teacher collaboration',
  alternates: { canonical: 'https://behaviorschool.com/masterclass' },
  openGraph: {
    title: 'Free BCBA CEU Masterclass | School BCBA Mastery',
    description: 'Earn 1.0 BACB CEU credit with this free masterclass for school BCBAs. Master ethics, collaboration, and crisis management.',
    type: 'website',
    url: 'https://behaviorschool.com/masterclass',
    images: [
      {
        url: '/optimized/Hero/Hero-group1-optimized.webp',
        width: 800,
        height: 600,
        alt: 'School BCBA Masterclass - Free CEU Training',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free BCBA CEU Masterclass',
    description: 'Earn 1.0 BACB CEU credit. Free masterclass for school BCBAs covering ethics, collaboration, and crisis management.',
    images: ['/optimized/Hero/Hero-group1-optimized.webp'],
  },
  robots: { index: false, follow: false }, // Not indexed until ready
};

export default function MasterclassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}

      {/* Structured Data for Course */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: 'School BCBA Mastery Fundamentals',
            description: 'Free 1-hour masterclass covering essential skills for school-based BCBAs including ethics, teacher collaboration, data systems, and crisis management.',
            provider: {
              '@type': 'Organization',
              name: 'Behavior School',
              url: 'https://behaviorschool.com',
              sameAs: [
                'https://www.linkedin.com/company/behavior-school',
              ],
            },
            educationalCredentialAwarded: {
              '@type': 'EducationalOccupationalCredential',
              name: '1.0 BACB CEU Credits',
              credentialCategory: 'BACB Continuing Education',
              recognizedBy: {
                '@type': 'Organization',
                name: 'Behavior Analyst Certification Board (BACB)',
              },
            },
            courseMode: 'online',
            educationalLevel: 'Professional',
            timeRequired: 'PT1H',
            isAccessibleForFree: true,
            hasCourseInstance: {
              '@type': 'CourseInstance',
              courseMode: 'online',
              duration: 'PT1H',
            },
            teaches: [
              'Ethics in school-based behavior analysis practice',
              'Building teacher buy-in and collaboration',
              'Data-driven decision making in schools',
              'Crisis management and de-escalation protocols',
            ],
          }),
        }}
      />
    </>
  );
}
