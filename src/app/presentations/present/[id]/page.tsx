'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, X } from 'lucide-react';
import { TEMPLATE_COLORS } from '@/components/admin/presenton/templates';

type Slide = {
  title: string;
  content: string[];
  imageUrl?: string;
  layout?: string;
  notes?: string;
};

export default function PresentationMode() {
  const params = useParams();
  const searchParams = useSearchParams();
  const presentationId = params.id as string;
  const token = searchParams.get('token');

  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [title, setTitle] = useState('');
  const [template, setTemplate] = useState('sunset');
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load presentation
  useEffect(() => {
    async function loadPresentation() {
      try {
        const endpoint = token
          ? `/api/presentations/share/${presentationId}?token=${encodeURIComponent(token)}`
          : `/api/admin/presentations/${presentationId}`;

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();

        setSlides(data.slides || []);
        setTitle(data.title || 'Presentation');
        setTemplate(data.template || 'sunset');
      } catch (err) {
        console.error('Failed to load presentation:', err);
        alert('Failed to load presentation');
      } finally {
        setLoading(false);
      }
    }
    loadPresentation();
  }, [presentationId, token]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      e.preventDefault();
      setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      setCurrentSlide(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setCurrentSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setCurrentSlide(slides.length - 1);
    } else if (e.key === 'f' || e.key === 'F11') {
      e.preventDefault();
      toggleFullscreen();
    } else if (e.key === 'Escape' && isFullscreen) {
      e.preventDefault();
      exitFullscreen();
    }
  }, [slides.length, isFullscreen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Fullscreen
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const exitFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const colors = TEMPLATE_COLORS[template] || TEMPLATE_COLORS.sunset;
  const currentSlideData = slides[currentSlide];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-xl">Loading presentation...</div>
      </div>
    );
  }

  if (!slides.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-xl">No slides available</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: colors.bg }}
    >
      {/* Top Controls - Hide in fullscreen */}
      {!isFullscreen && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between text-white">
            <div className="font-semibold">{title}</div>
            <div className="flex items-center gap-4">
              <span className="text-sm">
                {currentSlide + 1} / {slides.length}
              </span>
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Fullscreen (F)"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => window.close()}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Slide Area */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-6xl">
          <div
            className="rounded-2xl shadow-2xl p-12 min-h-[600px] flex flex-col"
            style={{ backgroundColor: '#FFFFFF', borderColor: colors.border, borderWidth: '2px' }}
          >
            {/* Title */}
            <h1
              className="text-5xl font-bold mb-8"
              style={{ color: colors.title }}
            >
              {currentSlideData.title}
            </h1>

            {/* Content Area */}
            <div className="flex-1 flex gap-8">
              {/* Text Content */}
              <div className="flex-1">
                <ul className="space-y-4">
                  {currentSlideData.content?.map((item, i) => (
                    <li
                      key={i}
                      className="text-2xl flex items-start gap-3"
                      style={{ color: colors.text }}
                    >
                      <span
                        className="inline-block w-2 h-2 rounded-full mt-3 shrink-0"
                        style={{ backgroundColor: colors.primary }}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Image if present */}
              {currentSlideData.imageUrl && (
                <div className="w-1/3 shrink-0">
                  <img
                    src={currentSlideData.imageUrl}
                    alt=""
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Arrows - Always visible */}
        <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
          <button
            onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
            disabled={currentSlide === 0}
            className="pointer-events-auto p-4 rounded-full bg-black/30 hover:bg-black/50 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Previous (←)"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={() => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1))}
            disabled={currentSlide === slides.length - 1}
            className="pointer-events-auto p-4 rounded-full bg-black/30 hover:bg-black/50 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Next (→)"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="h-2 bg-black/30">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
            backgroundColor: colors.primary
          }}
        />
      </div>

      {/* Keyboard Hints - Bottom right, hide in fullscreen */}
      {!isFullscreen && (
        <div className="absolute bottom-4 right-4 text-white/60 text-sm bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg">
          <div>← → : Navigate</div>
          <div>F : Fullscreen</div>
          <div>Esc : Exit fullscreen</div>
        </div>
      )}
    </div>
  );
}
