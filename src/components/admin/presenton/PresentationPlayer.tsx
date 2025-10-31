"use client";

import { useEffect, useState, useCallback } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronLeft, ChevronRight, Edit, X, Maximize2, Minimize2, Loader2 } from 'lucide-react';
import SlideRichEditor from './SlideRichEditor';

type ChartData = {
  type: 'bar'|'line'|'pie'|'doughnut';
  categories: string[];
  series: Array<{ name: string; values: number[] }>;
  stacked?: boolean;
  showLegend?: boolean;
  xLabel?: string;
  yLabel?: string;
  seriesColors?: string[];
  legendPosition?: 'top-right'|'bottom'|'right'|'left';
  yFormat?: 'auto'|'number'|'currency'|'percent';
  labelStyle?: 'auto'|'inside'|'above';
  showStackPercent?: boolean;
};

type Slide = {
  title: string;
  content: string[];
  imageUrl?: string;
  icons?: string[];
  chart?: ChartData;
  layout?: 'auto'|'text'|'image-right'|'image-left'|'two-column'|'quote'|'title-only'|'image-full'|'metrics-3'|'chart-right'|'chart-left'|'table';
};

type PresentationPlayerProps = {
  presentationId: string;
  initialSlides: Slide[];
  presentationTitle: string;
  template: string;
  onClose: () => void;
};

export default function PresentationPlayer({
  presentationId,
  initialSlides,
  presentationTitle,
  template,
  onClose
}: PresentationPlayerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Navigation functions
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Auto-save to database
  const saveToDatabase = useCallback(async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const response = await fetch(`/api/admin/presentations/${presentationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Save failed' }));
        throw new Error(errorData.error || 'Failed to save presentation');
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Save failed');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  }, [presentationId, slides]);

  // Edit mode handlers
  const openEditor = useCallback(() => {
    setEditingIndex(currentSlide);
  }, [currentSlide]);

  const saveSlideChanges = useCallback(async (newContent: string[]) => {
    const updatedSlides = [...slides];
    updatedSlides[currentSlide] = {
      ...updatedSlides[currentSlide],
      content: newContent
    };
    setSlides(updatedSlides);
    setEditingIndex(null);

    // Auto-save after edit
    setTimeout(() => {
      saveToDatabase();
    }, 100);
  }, [slides, currentSlide, saveToDatabase]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevSlide();
          break;
        case 'e':
        case 'E':
          e.preventDefault();
          openEditor();
          break;
        case 'Escape':
          if (editingIndex !== null) {
            setEditingIndex(null);
          } else if (isFullscreen) {
            toggleFullscreen();
          } else {
            onClose();
          }
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, openEditor, onClose, editingIndex, isFullscreen]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Fullscreen error:', err);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const currentSlideData = slides[currentSlide];

  // Drag-and-drop thumbnails
  function SortableThumb({ id, children }: { id: string; children: (bind: any)=>React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition } as React.CSSProperties;
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children({})}
      </div>
    );
  }
  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    const from = Number(active.id);
    const to = Number(over.id);
    if (from === to) return;
    setSlides((prev) => {
      const next = arrayMove(prev, from, to);
      if (currentSlide === from) setCurrentSlide(to);
      else if (from < currentSlide && to >= currentSlide) setCurrentSlide((v)=> v-1);
      else if (from > currentSlide && to <= currentSlide) setCurrentSlide((v)=> v+1);
      setTimeout(() => saveToDatabase(), 100);
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-200 bg-white">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Close player (Esc)"
        >
          <X className="w-5 h-5" />
          <span className="font-medium">Close</span>
        </button>

        <h1 className="text-xl font-bold text-slate-900 truncate max-w-md">
          {presentationTitle}
        </h1>

        <div className="flex items-center gap-2">
          {saveError && (
            <span className="text-sm text-red-600 mr-2">{saveError}</span>
          )}
          {saving && (
            <div className="flex items-center gap-2 text-sm text-emerald-600 mr-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </div>
          )}
          <button
            onClick={toggleFullscreen}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title={isFullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Thumbnail Sidebar */}
        <div className="w-64 border-r-2 border-slate-200 overflow-y-auto bg-slate-50">
          <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={slides.map((_,i)=> String(i))} strategy={verticalListSortingStrategy}>
              <div className="p-3 space-y-2">
                {slides.map((slide, index) => (
                  <SortableThumb key={index} id={String(index)}>
                    {() => (
                      <button
                        onClick={() => goToSlide(index)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          index === currentSlide
                            ? 'border-emerald-500 bg-emerald-50 shadow-md'
                            : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 bg-slate-200 rounded">
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-slate-900 truncate mb-1">
                              {slide.title}
                            </div>
                            <div className="text-xs text-slate-600">
                              {slide.content.length} bullet{slide.content.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </button>
                    )}
                  </SortableThumb>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Slide Display Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto p-8 bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl border-2 border-slate-200 p-12 min-h-[600px] flex flex-col">
              {/* Slide Title */}
              <h2 className="text-4xl font-bold text-slate-900 mb-8 pb-4 border-b-4 border-emerald-500">
                {currentSlideData.title}
              </h2>

              {/* Slide Content */}
              <div className="flex-1 flex flex-col gap-6">
                {currentSlideData.content.length > 0 && (
                  <ul className="space-y-4">
                    {currentSlideData.content.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-2" />
                        <span className="text-xl text-slate-700 leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Image Display */}
                {currentSlideData.imageUrl && (
                  <div className="mt-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentSlideData.imageUrl}
                      alt={currentSlideData.title}
                      className="max-w-full max-h-96 rounded-lg shadow-lg border-2 border-slate-200 object-contain"
                    />
                  </div>
                )}

                {/* Icons Display */}
                {currentSlideData.icons && currentSlideData.icons.length > 0 && (
                  <div className="flex gap-4 mt-auto">
                    {currentSlideData.icons.map((iconUrl, idx) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={idx}
                        src={iconUrl}
                        alt=""
                        className="w-12 h-12 object-contain"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="flex items-center justify-between px-8 py-4 border-t-2 border-slate-200 bg-white">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Previous slide (←)"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Previous</span>
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={openEditor}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                title="Edit slide (E)"
              >
                <Edit className="w-5 h-5" />
                <span className="font-medium">Edit Slide</span>
              </button>

              <span className="text-lg font-semibold text-slate-900">
                Slide {currentSlide + 1} / {slides.length}
              </span>
            </div>

            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Next slide (→)"
            >
              <span className="font-medium">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Rich Editor Modal */}
      {editingIndex !== null && (
        <SlideRichEditor
          title={slides[editingIndex].title}
          initialBullets={slides[editingIndex].content}
          onSave={saveSlideChanges}
          onClose={() => setEditingIndex(null)}
        />
      )}
    </div>
  );
}
