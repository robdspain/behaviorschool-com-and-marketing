import type { Metadata } from 'next';
import {
  buildTransformationCourseJsonLd,
  buildTransformationFaqJsonLd,
  TRANSFORMATION_PROGRAM,
} from '@/lib/transformation-program';

const programName = TRANSFORMATION_PROGRAM.name;
const { summaryHeadline, sessionTime, label } = TRANSFORMATION_PROGRAM.cohort;
const dateSpan = summaryHeadline.replace(/^Six Thursdays, /, '');
const metaDescription = `The ${programName}: live online training for school BCBAs. ${summaryHeadline}, ${sessionTime}.`;
const socialDateLine = `${dateSpan}, ${sessionTime}`;
const ogImage = '/optimized/Course/transformation-program-og-1200x630.webp';
const ogImageAlt = `${programName}, ${label}, six live online sessions for school BCBAs`;

export const metadata: Metadata = {
  title: `${programName} | Behavior School`,
  description: metaDescription,
  alternates: { canonical: '/transformation-program' },
  openGraph: {
    title: programName,
    description: `Six live online Thursday sessions for school BCBAs, ${socialDateLine}. Build functional behavior assessment, behavior intervention plan, and staff training systems.`,
    url: '/transformation-program',
    type: 'website',
    siteName: 'Behavior School',
    images: [{ url: ogImage, width: 1200, height: 630, alt: ogImageAlt }],
  },
  twitter: {
    card: 'summary_large_image',
    title: programName,
    description: `Six live Thursday sessions for school BCBAs, ${socialDateLine}.`,
    images: [ogImage],
  },
};

export default function TransformationProgramLayout({ children }: { children: React.ReactNode }) {
  const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://behaviorschool.com';
  const courseJsonLd = buildTransformationCourseJsonLd(siteUrl);
  const faqJsonLd = buildTransformationFaqJsonLd(siteUrl);

  return (
    <>
      {children}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
