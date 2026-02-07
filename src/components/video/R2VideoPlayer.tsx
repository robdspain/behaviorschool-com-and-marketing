'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface R2VideoPlayerProps {
  hlsUrl?: string;
  mp4Url?: string;
  posterUrl?: string;
  title?: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  autoPlay?: boolean;
  resumeTime?: number;
}

export function R2VideoPlayer({
  hlsUrl,
  mp4Url,
  posterUrl,
  title,
  onProgress,
  onComplete,
  autoPlay = false,
  resumeTime = 0,
}: R2VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const sources = useMemo(() => {
    const list: { src: string; type: string }[] = [];
    if (hlsUrl) {
      list.push({ src: hlsUrl, type: 'application/x-mpegURL' });
    }
    if (mp4Url) {
      list.push({ src: mp4Url, type: 'video/mp4' });
    }
    return list;
  }, [hlsUrl, mp4Url]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setLoading(false);
      if (resumeTime > 0) {
        video.currentTime = resumeTime;
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (duration > 0 && onProgress) {
        onProgress((video.currentTime / duration) * 100);
      }
    };

    const handleEnded = () => {
      onComplete?.();
    };

    const handleError = () => {
      setError('Failed to load video');
      setLoading(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [duration, onProgress, onComplete, resumeTime]);

  if (!sources.length) {
    return (
      <div className="flex items-center justify-center min-h-[360px] bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Video unavailable</p>
          <p className="text-sm mt-2">Missing video source</p>
        </div>
      </div>
    );
  }

  if (loading && !error) {
    return (
      <div className="flex items-center justify-center min-h-[360px] bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[360px] bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Video unavailable</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="overflow-hidden rounded-lg shadow-lg">
      <div className="relative bg-black">
        {title && (
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent z-10">
            <h2 className="text-white text-lg font-semibold">{title}</h2>
          </div>
        )}
        <video
          ref={videoRef}
          className="w-full aspect-video"
          controls
          autoPlay={autoPlay}
          playsInline
          poster={posterUrl}
        >
          {sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
          Your browser does not support the video tag.
        </video>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <span className="font-medium">{progressPercent.toFixed(0)}% Complete</span>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
