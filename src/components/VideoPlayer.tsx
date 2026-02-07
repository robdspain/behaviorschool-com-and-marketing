'use client';

import React from 'react';
import { R2VideoPlayer } from './video/R2VideoPlayer';

interface VideoPlayerProps {
  videoUrl: string;
  videoSource: 'youtube' | 'vimeo' | 'upload';
  title: string;
  thumbnailUrl?: string;
}

export default function VideoPlayer({ videoUrl, videoSource, title, thumbnailUrl }: VideoPlayerProps) {
  const getEmbedUrl = (url: string, source: 'youtube' | 'vimeo' | 'upload'): string => {
    if (source === 'upload') {
      return url;
    }

    if (source === 'youtube') {
      // Extract video ID from various YouTube URL formats
      const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      const videoId = videoIdMatch ? videoIdMatch[1] : '';
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (source === 'vimeo') {
      // Extract video ID from Vimeo URL
      const videoIdMatch = url.match(/vimeo\.com\/(\d+)/);
      const videoId = videoIdMatch ? videoIdMatch[1] : '';
      return `https://player.vimeo.com/video/${videoId}`;
    }

    return url;
  };

  // Detect if this is an R2 video (direct video file URL)
  const isR2Video = videoSource === 'upload' && (
    videoUrl.includes('.mp4') || 
    videoUrl.includes('.webm') || 
    videoUrl.includes('.m3u8') ||
    videoUrl.includes('r2.cloudflarestorage.com') ||
    videoUrl.includes(process.env.NEXT_PUBLIC_CF_R2_PUBLIC_BASE_URL || '')
  );

  if (isR2Video) {
    // Use R2VideoPlayer for R2-hosted videos
    const isHLS = videoUrl.includes('.m3u8');
    return (
      <R2VideoPlayer
        hlsUrl={isHLS ? videoUrl : undefined}
        mp4Url={!isHLS ? videoUrl : undefined}
        posterUrl={thumbnailUrl}
        title={title}
      />
    );
  }

  const embedUrl = getEmbedUrl(videoUrl, videoSource);

  if (videoSource === 'upload') {
    // HTML5 video player for other direct uploads
    return (
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <video
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          controls
          poster={thumbnailUrl}
          preload="metadata"
        >
          <source src={embedUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // YouTube or Vimeo iframe embed
  return (
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
