import type { Metadata } from 'next';
import VideoCard from '@/components/VideoCard';
import type { Video, VideoCategory } from '@/types/video';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { behaviorStudyToolsAppHref } from '@/lib/behavior-study-tools/links';
import { getPublishedVideos } from '@/lib/videos';

const freePracticeHref = behaviorStudyToolsAppHref('/free-practice/', {
  intent: 'video_library',
  utm_content: 'video_library_page',
});

// The library is noindex until at least one video has a real recording behind it.
export function generateMetadata(): Metadata {
  const base = buildPageMetadata({
    title: 'Free BCBA Exam Prep Videos | Behavior School',
    description: 'Watch free BCBA exam prep videos covering ethics, reinforcement, experimental design, and study strategies from an experienced school BCBA. Start learning!',
    keywords: [
      'BCBA exam prep videos',
      'free BCBA study videos',
      'behavior analyst training',
      'BCBA ethics videos',
      'school BCBA tips'
    ],
    canonical: 'https://behaviorschool.com/videos',
  });
  if (getPublishedVideos().length === 0) {
    return { ...base, robots: { index: false, follow: false } };
  }
  return base;
}

export default function VideosPage() {
  const videos = getPublishedVideos();
  
  // Group videos by category
  const categories: VideoCategory[] = ['Exam Prep', 'School BCBA Tips', 'Tool Tutorials'];
  const videosByCategory = categories.reduce((acc, category) => {
    acc[category] = videos
      .filter(v => v.category === category)
      .sort((a, b) => a.order - b.order);
    return acc;
  }, {} as Record<VideoCategory, Video[]>);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Free BCBA Exam Prep Videos
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              {videos.length > 0
                ? 'Learn from an experienced school BCBA. Practical walkthroughs of ethics scenarios, core concepts, and study strategies for the 6th Edition exam.'
                : 'Short walkthroughs of ethics scenarios, core concepts, and study strategies for the 6th Edition exam, from a school BCBA. Recording is in progress.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                Real exam scenarios
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                Evidence-based strategies
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                From a school BCBA
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Library */}
      <section className="container mx-auto px-4 py-12">
        {categories.map(category => {
          const categoryVideos = videosByCategory[category];
          if (!categoryVideos || categoryVideos.length === 0) return null;

          return (
            <div key={category} className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryVideos.map(video => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </div>
          );
        })}

        {videos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              The first videos are being recorded. Until they are published, the free practice
              questions below are the fastest way to work on the same content.
            </p>
          </div>
        )}
      </section>

      {/* FAQ Section (only when there is a library to describe) */}
      {videos.length > 0 && (
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Where can I find free BCBA study videos?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Right here at Behavior School! We offer free BCBA exam prep videos covering ethics, concepts and principles, experimental design, and study strategies. Our videos are created by an experienced school BCBA and focus on real-world application rather than just memorization. All videos are available without registration or payment.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                What are the best video resources for behavior analysis?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                The best video resources combine theoretical foundations with practical application. Look for videos that explain concepts using real scenarios from schools or clinical settings, provide examples aligned to the BACB task list, and offer study strategies beyond content review. Behavior School videos are designed specifically for exam prep with a focus on high-yield topics and common misconceptions.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                How can video learning help me pass the BCBA exam?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Video learning complements textbook study by providing visual explanations of complex concepts, real-world examples that make abstract principles concrete, and modeling of how to approach application questions. Videos are especially helpful for understanding experimental designs, graphing conventions, and ethical decision-making scenarios that are harder to grasp from text alone.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Are these videos aligned with the BACB 6th edition task list?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Yes. All videos are mapped to specific items from the BACB 6th Edition Task List. Each video clearly identifies which task list items it covers, making it easy to target your study efforts and ensure comprehensive preparation across all exam domains.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Can I watch these videos on my phone or tablet?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Absolutely! All videos are optimized for mobile viewing so you can study on the go. Whether you&apos;re on a phone, tablet, or desktop, you&apos;ll have full access to the entire video library with no special apps required.
              </p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* CTA Section */}
      <section className="bg-blue-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Practice what the videos cover
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Behavior Study Tools has free BCBA practice questions written to the 6th Edition outline.
              See the missed domain, review the rationale, and choose the next study task.
            </p>
            <a
              href={freePracticeHref}
              className="inline-block bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg"
            >
              Start free BCBA practice
            </a>
          </div>
        </div>
      </section>

      {/* Structured Data */}
      {videos.length > 0 && (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Where can I find free BCBA study videos?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Right here at Behavior School! We offer free BCBA exam prep videos covering ethics, concepts and principles, experimental design, and study strategies. Our videos are created by an experienced school BCBA and focus on real-world application rather than just memorization. All videos are available without registration or payment."
                }
              },
              {
                "@type": "Question",
                name: "What are the best video resources for behavior analysis?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The best video resources combine theoretical foundations with practical application. Look for videos that explain concepts using real scenarios from schools or clinical settings, provide examples aligned to the BACB task list, and offer study strategies beyond content review. Behavior School videos are designed specifically for exam prep with a focus on high-yield topics and common misconceptions."
                }
              },
              {
                "@type": "Question",
                name: "How can video learning help me pass the BCBA exam?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Video learning complements textbook study by providing visual explanations of complex concepts, real-world examples that make abstract principles concrete, and modeling of how to approach application questions. Videos are especially helpful for understanding experimental designs, graphing conventions, and ethical decision-making scenarios that are harder to grasp from text alone."
                }
              },
              {
                "@type": "Question",
                name: "Are these videos aligned with the BACB 6th edition task list?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. All videos are mapped to specific items from the BACB 6th Edition Task List. Each video clearly identifies which task list items it covers, making it easy to target your study efforts and ensure comprehensive preparation across all exam domains."
                }
              },
              {
                "@type": "Question",
                name: "Can I watch these videos on my phone or tablet?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Absolutely! All videos are optimized for mobile viewing so you can study on the go. Whether you're on a phone, tablet, or desktop, you'll have full access to the entire video library with no special apps required."
                }
              }
            ]
          })
        }}
      />
      )}
    </div>
  );
}
