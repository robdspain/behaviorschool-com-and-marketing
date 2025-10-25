'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Play, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoSectionProps {
  sectionNumber: number;
  title: string;
  description: string;
  videoUrl: string;
  isCompleted: boolean;
  onMarkComplete: () => Promise<void>;
}

export function VideoSection({
  sectionNumber,
  title,
  description,
  videoUrl,
  isCompleted,
  onMarkComplete,
}: VideoSectionProps) {
  const [isMarking, setIsMarking] = useState(false);

  // Detect video platform and extract relevant info
  const getVideoEmbedInfo = (url: string) => {
    // Descript share links
    if (url.includes('share.descript.com')) {
      return {
        platform: 'descript',
        embedUrl: url,
      };
    }

    // Wistia
    // Supports: https://fast.wistia.net/embed/iframe/VIDEO_ID
    // or: https://ACCOUNT.wistia.com/medias/VIDEO_ID
    const wistiaMatch = url.match(/(?:wistia\.(?:com|net)\/(?:medias|embed\/iframe)\/)([a-zA-Z0-9]+)/);
    if (wistiaMatch || url.includes('wistia')) {
      let videoId = wistiaMatch?.[1];

      // If no match but contains wistia, try to extract from different formats
      if (!videoId && url.includes('wistia')) {
        const altMatch = url.match(/([a-zA-Z0-9]{10,})/);
        videoId = altMatch?.[1];
      }

      if (videoId) {
        return {
          platform: 'wistia',
          embedUrl: `https://fast.wistia.net/embed/iframe/${videoId}`,
        };
      }
    }

    // YouTube (works for both public and unlisted)
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
    if (youtubeMatch) {
      return {
        platform: 'youtube',
        embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
      };
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return {
        platform: 'vimeo',
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?badge=0&autopause=0&player_id=0&app_id=58479`,
      };
    }

    return null;
  };

  const videoInfo = getVideoEmbedInfo(videoUrl);

  const handleMarkComplete = async () => {
    setIsMarking(true);
    try {
      await onMarkComplete();
    } finally {
      setIsMarking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
            {sectionNumber}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{title}</h2>
          </div>
          {isCompleted && (
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 border border-emerald-300 rounded-full">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">Complete</span>
            </div>
          )}
        </div>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </div>

      {/* Video Player */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
        {videoInfo ? (
          <div className="relative" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={videoInfo.embedUrl}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              allowFullScreen
              title={title}
            />
          </div>
        ) : (
          // Placeholder for invalid video URL
          <div className="aspect-video flex items-center justify-center bg-slate-800">
            <div className="text-center text-slate-400">
              <Play className="w-16 h-16 mx-auto mb-3" />
              <p className="text-sm">Video will be loaded here</p>
              <p className="text-xs mt-1">Supported: Vimeo, YouTube, or Descript share links</p>
            </div>
          </div>
        )}
      </div>

      {/* Mark Complete Button */}
      {!isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6"
        >
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-2">
                Watched the video?
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Mark this video as complete to unlock the quiz. Make sure you&apos;ve watched the entire video to get the most out of this section.
              </p>
              <Button
                onClick={handleMarkComplete}
                disabled={isMarking}
                className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white"
              >
                {isMarking ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Marking Complete...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Video as Complete
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-100 border-2 border-emerald-300 rounded-xl p-4 sm:p-6"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 flex-shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-emerald-900 mb-1">
                Video Complete!
              </h3>
              <p className="text-xs sm:text-sm text-emerald-700">
                Great work! Now scroll down to take the quiz for this section.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
