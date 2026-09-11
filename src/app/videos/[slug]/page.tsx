import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import VideoCard from '@/components/VideoCard';
import { behaviorStudyToolsAppHref } from '@/lib/behavior-study-tools/links';
import { getPublishedVideos, getPublishedVideoBySlug } from '@/lib/videos';

const freePracticeHref = behaviorStudyToolsAppHref('/free-practice/', {
  intent: 'video_page',
  utm_content: 'video_detail_page',
});

// Only videos with a real recording get a page; placeholder entries 404.
export async function generateStaticParams() {
  return getPublishedVideos().map((video) => ({
    slug: video.slug,
  }));
}

// Generate metadata for each video page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const video = getPublishedVideoBySlug(slug);

  if (!video) {
    return {
      title: 'Video Not Found | Behavior School',
    };
  }

  return {
    title: `${video.seoTitle ?? video.title} | Behavior School`,
    description: video.metaDescription || video.description,
    keywords: video.keywords,
    openGraph: {
      title: video.title,
      description: video.description,
      type: 'video.other',
      url: `https://behaviorschool.com/videos/${video.slug}`,
      images: video.thumbnailUrl ? [video.thumbnailUrl] : [],
    },
  };
}

export default async function VideoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const video = getPublishedVideoBySlug(slug);

  if (!video) {
    notFound();
  }

  // Get related videos (same category, different video)
  const allVideos = getPublishedVideos();
  const relatedVideos = allVideos
    .filter(v => v.category === video.category && v.id !== video.id)
    .sort((a, b) => a.order - b.order)
    .slice(0, 3);

  // Schema.org VideoObject structured data for SEO
  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl || '',
    uploadDate: video.publishedAt,
    contentUrl: video.videoUrl,
    duration: video.duration ? `PT${video.duration}S` : undefined,
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Video Player */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
                <VideoPlayer
                  videoUrl={video.videoUrl}
                  videoSource={video.videoSource}
                  title={video.title}
                  thumbnailUrl={video.thumbnailUrl}
                />
              </div>

              {/* Video Info */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                {/* Category Badge */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {video.category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {video.title}
                </h1>

                {/* Description */}
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  {video.description}
                </p>

                {/* Transcript Section */}
                {video.transcript && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Transcript
                    </h2>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {video.transcript}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
                <h2 className="text-2xl font-bold mb-3">
                  Turn the video into practice
                </h2>
                <p className="text-blue-100 mb-6">
                  Behavior Study Tools has free BCBA practice questions written to the 6th Edition outline. See the missed domain, review the rationale, and choose the next study task.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={freePracticeHref}
                    className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors text-center"
                  >
                    Start free BCBA practice
                  </a>
                  <Link
                    href="/videos"
                    className="inline-block bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors text-center border border-blue-500"
                  >
                    Watch More Videos
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Related Videos
                </h2>
                
                {relatedVideos.length > 0 ? (
                  <div className="space-y-4">
                    {relatedVideos.map(relatedVideo => (
                      <VideoCard key={relatedVideo.id} video={relatedVideo} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    More videos coming soon!
                  </p>
                )}

                {/* Additional CTA in Sidebar */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Get More Study Tools
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    Free practice questions with results by domain and a rationale on every answer.
                  </p>
                  <a
                    href={freePracticeHref}
                    className="block text-center bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    Start free practice
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
