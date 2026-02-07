import type { Metadata } from 'next';
import VideoCard from '@/components/VideoCard';
import type { Video, VideoCategory } from '@/types/video';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'Free BCBA Exam Prep Videos | BehaviorSchool',
  description: 'Watch free BCBA exam prep videos covering ethics, reinforcement vs punishment, experimental design, and study strategies from an experienced school BCBA.',
  keywords: [
    'BCBA exam prep videos',
    'free BCBA study videos',
    'behavior analyst training',
    'BCBA ethics videos',
    'school BCBA tips'
  ],
  openGraph: {
    title: 'Free BCBA Exam Prep Videos | BehaviorSchool',
    description: 'Expert BCBA exam prep videos to help you pass on your first attempt. Learn from real-world scenarios and proven study strategies.',
    type: 'website',
    url: 'https://behaviorschool.com/videos',
  },
};

// Load videos from JSON file
function getVideos(): Video[] {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'videos.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return data.videos || [];
  } catch (error) {
    console.error('Error loading videos:', error);
    return [];
  }
}

export default function VideosPage() {
  const videos = getVideos();
  
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
              Learn from an experienced school BCBA. Expert insights on ethics, concepts, and study strategies to help you pass on your first attempt.
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
              New videos coming soon! Sign up below to get notified.
            </p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Want More Than Videos?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Get access to interactive flashcards, practice exams, and study tools designed specifically for BCBA exam prep.
            </p>
            <a
              href="/signup"
              className="inline-block bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg"
            >
              Start Your Free Trial
            </a>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              No credit card required • Free practice questions included
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
