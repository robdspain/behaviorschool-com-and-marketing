'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Loader2 } from 'lucide-react';

interface AudioNarrationStaticProps {
  slug: string;
  title: string;
  markdownContent?: string; // Raw markdown for static pages
}

export function AudioNarrationStatic({ slug, title, markdownContent }: AudioNarrationStaticProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check for pre-generated audio first
  useEffect(() => {
    const preGeneratedUrl = `/audio/blog/${slug}.mp3`;
    
    fetch(preGeneratedUrl, { method: 'HEAD' })
      .then(res => {
        if (res.ok) {
          setAudioUrl(preGeneratedUrl);
        }
      })
      .catch(() => {
        // Pre-generated doesn't exist, will generate on demand
      });
  }, [slug]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generateAudio = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/blog/audio/static`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          title,
          content: markdownContent,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate audio');
      }
      
      const data = await response.json();
      setAudioUrl(data.audioUrl);
      return data.audioUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate audio');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = async () => {
    if (!audioRef.current) return;
    
    if (!audioUrl) {
      const url = await generateAudio();
      if (!url) return;
      
      audioRef.current.src = url;
      await new Promise<void>((resolve, reject) => {
        if (!audioRef.current) return reject();
        audioRef.current.onloadeddata = () => resolve();
        audioRef.current.onerror = () => reject(new Error('Failed to load audio'));
      });
    }
    
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handleMuteToggle = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setProgress(0);
      setCurrentTime(0);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(current);
      setProgress((current / total) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = (clickX / rect.width) * 100;
    const newTime = (newProgress / 100) * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(newProgress);
  };

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 mb-8">
      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={handleTogglePlay}
          disabled={isLoading}
          className="w-12 h-12 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-full transition-colors shadow-md"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>

        {/* Info & Controls */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-emerald-800 truncate">
              🎧 Listen to this article
            </span>
            <div className="flex items-center gap-2">
              {duration > 0 && (
                <span className="text-xs text-emerald-600">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              )}
              <button
                onClick={handleRestart}
                className="p-1 text-emerald-600 hover:text-emerald-800 transition-colors"
                aria-label="Restart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleMuteToggle}
                className="p-1 text-emerald-600 hover:text-emerald-800 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div
            className="h-2 bg-emerald-200 rounded-full cursor-pointer overflow-hidden"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl || undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />
    </div>
  );
}
