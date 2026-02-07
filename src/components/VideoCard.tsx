'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Video } from '@/types/video';

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  // Generate thumbnail based on video source
  const getThumbnail = (): string => {
    if (video.thumbnailUrl) {
      return video.thumbnailUrl;
    }

    // Default thumbnails based on video source
    if (video.videoSource === 'youtube') {
      const videoIdMatch = video.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      const videoId = videoIdMatch ? videoIdMatch[1] : '';
      return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '/images/video-placeholder.jpg';
    }

    return '/images/video-placeholder.jpg';
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Exam Prep':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'School BCBA Tips':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Tool Tutorials':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <Link href={`/videos/${video.slug}`} className="group block">
      <article className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Thumbnail */}
        <div className="relative w-full aspect-video bg-gray-200 dark:bg-gray-700">
          <Image
            src={getThumbnail()}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Play icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-4">
          {/* Category badge */}
          <div className="mb-2">
            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(video.category)}`}>
              {video.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {video.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 flex-grow">
            {video.description}
          </p>

          {/* Duration (if available) */}
          {video.duration && (
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
