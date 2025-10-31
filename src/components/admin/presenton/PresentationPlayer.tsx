"use client";

import { useEffect, useState, useCallback } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronLeft, ChevronRight, Edit, X, Maximize2, Minimize2, Loader2, GripVertical } from 'lucide-react';
import SlideRichEditor from './SlideRichEditor';
import { TEMPLATE_COLORS, TEMPLATE_OPTIONS } from './templates';
import TemplateSettings from './TemplateSettings';

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
  overlay?: boolean;
};

export default function PresentationPlayer({
  presentationId,
  initialSlides,
  presentationTitle,
  template,
  onClose,
  overlay = true
}: PresentationPlayerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [enriching, setEnriching] = useState(false);
  const [enrichMsg, setEnrichMsg] = useState<string | null>(null);
  const [showRedesign, setShowRedesign] = useState(false);
  const [theme, setTheme] = useState<{ primaryColor?: string; backgroundColor?: string; titleColor?: string; subtitleColor?: string; textColor?: string } | null>(null);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const [autoEnriched, setAutoEnriched] = useState(false);
  const [showTemplateSettings, setShowTemplateSettings] = useState(false);
  const [templateFonts, setTemplateFonts] = useState<{ titleFontUrl?: string; bodyFontUrl?: string; titleFontName?: string; bodyFontName?: string } | null>(null);
  const [allowFallback, setAllowFallback] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try { return localStorage.getItem('presenton_allow_openai_fallback') === 'true'; } catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem('presenton_allow_openai_fallback', String(allowFallback)); } catch {}
  }, [allowFallback]);

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`/api/admin/presentations/${presentationId}`);
        const j = await resp.json();
        if (resp.ok) {
          if (j?.templateTheme) setTheme(j.templateTheme);
          if (j?.templateFonts) setTemplateFonts(j.templateFonts);
          if (j?.shareToken) setShareToken(j.shareToken);
        }
      } catch {}
    })();
  }, [presentationId]);

  // moved lower to after saveToDatabase declaration

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

  // Auto-enrich missing images once if API keys present
  useEffect(() => {
    if (autoEnriched) return;
    const anyMissing = slides.some(s => !s.imageUrl);
    if (!anyMissing) return;
    const hasGoogle = typeof window !== 'undefined' ? !!localStorage.getItem('google_api_key') : false;
    const hasOpenAI = typeof window !== 'undefined' ? !!localStorage.getItem('openai_api_key') : false;
    if (!hasGoogle && !hasOpenAI) return;
    setAutoEnriched(true);
    (async () => {
      const provider = hasGoogle ? 'gemini' : 'openai';
      const apiKey = hasGoogle ? localStorage.getItem('google_api_key') : localStorage.getItem('openai_api_key');
      if (!apiKey) return;
      let updated = [...slides];
      const total = updated.length;
      for (let i = 0; i < total; i++) {
        const s = updated[i]; if (s.imageUrl) continue;
        try {
          const prompt = `${presentationTitle}: ${s.title}${s.content?.length ? ' — ' + s.content[0] : ''}`.slice(0, 400);
          const resp = await fetch('/api/admin/presentations/images/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, provider, apiKey, size: '1024x1024' }) });
          if (resp.ok) {
            const j = await resp.json();
            updated[i] = { ...s, imageUrl: j.url };
            setSlides(updated);
          }
        } catch {}
      }
      setTimeout(() => saveToDatabase(), 100);
    })();
  }, [slides, autoEnriched, presentationTitle, saveToDatabase]);

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
  const [currentTemplate, setCurrentTemplate] = useState<string>(template || 'modern');
  const base = TEMPLATE_COLORS[currentTemplate] || TEMPLATE_COLORS['modern'];
  const titleColor = `#${theme?.titleColor || base.title.replace('#','')}`;
  const textColor = `#${theme?.textColor || base.text.replace('#','')}`;
  const primaryColor = `#${theme?.primaryColor || base.primary.replace('#','')}`;
  const bgColor = `#${theme?.backgroundColor || base.bg.replace('#','')}`;

  // Determine effective layout based on slide settings and presence of image
  const effectiveLayout = (() => {
    const hasImage = !!currentSlideData?.imageUrl;
    const chosen = currentSlideData?.layout || 'auto';
    if (chosen === 'auto') return hasImage ? 'image-right' : 'text';
    return chosen;
  })();

  // Drag-and-drop thumbnails
  function SortableThumb({ id, children }: { id: string; children: (bind: { attributes: any; listeners: any; setNodeRef: (el: any)=>void; style: React.CSSProperties })=>React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition } as React.CSSProperties;
    return children({ attributes, listeners, setNodeRef, style });
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
    <div className={overlay ? "fixed inset-0 z-50 bg-white flex flex-col" : "relative flex flex-col border-2 border-slate-200 rounded-xl overflow-hidden"} style={{ background: bgColor }}>
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

        <div className="flex items-center gap-2 flex-wrap">
          {saveError && (
            <span className="text-sm text-red-600 mr-2">{saveError}</span>
          )}
          {saving && (
            <div className="flex items-center gap-2 text-sm text-emerald-600 mr-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving changes…</span>
            </div>
          )}
          {enriching && (
            <div className="flex items-center gap-2 text-sm text-emerald-700 mr-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{enrichMsg || 'Putting images on slides...'}</span>
            </div>
          )}
          {/* Moved slide controls into header */}
          <label className="text-sm font-semibold text-slate-700 ml-2">Layout</label>
          <select
            value={currentSlideData.layout || 'auto'}
            onChange={(e)=>{
              const val = e.target.value as Slide['layout'];
              const updated = [...slides];
              updated[currentSlide] = { ...updated[currentSlide], layout: val };
              setSlides(updated);
              setTimeout(()=> saveToDatabase(), 100);
            }}
            className="px-2 py-1 border-2 border-slate-200 rounded"
          >
            {(['auto','text','image-right','image-left','two-column','quote','title-only','image-full','metrics-3','chart-right','chart-left','table'] as const).map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <label className="text-sm font-semibold text-slate-700 ml-2">Template</label>
          <select
            value={currentTemplate}
            onChange={async (e)=>{
              const val = e.target.value;
              setCurrentTemplate(val);
              try {
                await fetch(`/api/admin/presentations/${presentationId}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ slides, template: val }) });
              } catch {}
            }}
            className="px-2 py-1 border-2 border-slate-200 rounded"
          >
            {TEMPLATE_OPTIONS.map(opt => (<option key={opt.id} value={opt.id}>{opt.label}</option>))}
          </select>
          <div className="flex items-center gap-2 ml-2">
            <input id="allowFallback" type="checkbox" checked={allowFallback} onChange={(e)=> setAllowFallback(e.target.checked)} />
            <label htmlFor="allowFallback" className="text-sm text-slate-700" title="If Gemini fails, allow fallback to OpenAI (requires verified org)">Allow OpenAI fallback</label>
          </div>
          <button
            onClick={async ()=>{
              try {
                const hasGoogle = typeof window !== 'undefined' ? !!localStorage.getItem('google_api_key') : false;
                const apiKey = hasGoogle ? localStorage.getItem('google_api_key') : '';
                if (!apiKey) { alert('Set your Google API key in Settings to generate with Gemini.'); return; }
                const s = slides[currentSlide];
                const prompt = `${presentationTitle}: ${s.title}${s.content?.length ? ' — ' + s.content[0] : ''}`.slice(0, 400);
                setEnriching(true); setEnrichMsg('Generating image…');
                const resp = await fetch('/api/admin/presentations/images/generate', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ prompt, provider: 'gemini', apiKey, size: '1024x1024', allowFallback }) });
                const j = await resp.json();
                if (!resp.ok) throw new Error(j.details || j.error || 'Gemini image generation failed');
                const updated = [...slides]; updated[currentSlide] = { ...s, imageUrl: j.url, layout: 'image-right' };
                setSlides(updated);
                setTimeout(()=> saveToDatabase(), 100);
              } catch (e) {
                const msg = e instanceof Error ? e.message : 'Couldn’t create an image. Check your Google AI key or Imagen access.';
                alert(msg);
              } finally { setEnriching(false); setEnrichMsg(null); }
            }}
            className="px-3 py-2 border-2 border-emerald-200 rounded-lg text-emerald-700 hover:bg-emerald-50"
            title="Put image on this slide"
          >
            Put image on this slide
          </button>
          <button
            onClick={async ()=>{
              try {
                const s = slides[currentSlide];
                const updated = [...slides];
                const nextLayout = (s.layout === 'image-right' || s.layout === 'image-left' || s.layout === 'two-column' || s.layout === 'image-full') ? 'text' as const : (s.layout || 'auto');
                updated[currentSlide] = { ...s, imageUrl: undefined, layout: nextLayout };
                setSlides(updated);
                setTimeout(()=> saveToDatabase(), 50);
              } catch {}
            }}
            className="px-3 py-2 border-2 border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            title="Remove the image from this slide"
            disabled={!slides[currentSlide]?.imageUrl}
          >
            Remove image
          </button>
          <button
            onClick={async ()=>{
              try {
                const hasGoogle = typeof window !== 'undefined' ? !!localStorage.getItem('google_api_key') : false;
                const apiKey = hasGoogle ? localStorage.getItem('google_api_key') : '';
                if (!apiKey) { alert('Set your Google API key in Settings to generate with Gemini.'); return; }
                const s = slides[currentSlide];
                const prompt = `${presentationTitle}: ${s.title}${s.content?.length ? ' — ' + s.content[0] : ''}`.slice(0, 400);
                setEnriching(true); setEnrichMsg('Regenerating image…');
                const resp = await fetch('/api/admin/presentations/images/generate', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ prompt, provider: 'gemini', apiKey, size: '1024x1024', allowFallback }) });
                const j = await resp.json();
                if (!resp.ok) throw new Error(j.details || j.error || 'Gemini image generation failed');
                const updated = [...slides]; updated[currentSlide] = { ...s, imageUrl: j.url, layout: 'image-right' };
                setSlides(updated);
                setTimeout(()=> saveToDatabase(), 100);
              } catch (e) {
                const msg = e instanceof Error ? e.message : 'Couldn’t create an image. Check your Google AI key or Imagen access.';
                alert(msg);
              } finally { setEnriching(false); setEnrichMsg(null); }
            }}
            className="px-3 py-2 border-2 border-emerald-200 rounded-lg text-emerald-700 hover:bg-emerald-50"
            title="Regenerate the image for this slide"
          >
            Regenerate image
          </button>
          <label className="px-3 py-2 border-2 border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer">
            Upload image
            <input type="file" accept="image/*" className="hidden" onChange={async (e)=>{
              const file = e.target.files?.[0]; if (!file) return;
              setEnriching(true); setEnrichMsg('Uploading image…');
              try {
                const fd = new FormData(); fd.append('file', file);
                const resp = await fetch('/api/admin/presentations/images/upload', { method: 'POST', body: fd });
                const j = await resp.json();
                if (!resp.ok) throw new Error(j.error || 'Upload failed');
                const updated = [...slides]; const s = updated[currentSlide];
                updated[currentSlide] = { ...s, imageUrl: j.url, layout: 'image-right' };
                setSlides(updated);
                setTimeout(()=> saveToDatabase(), 100);
              } catch (e) {
                alert(e instanceof Error ? e.message : 'Upload failed');
              } finally {
                setEnriching(false); setEnrichMsg(null);
                // clear input
                if (e.target) (e.target as HTMLInputElement).value = '';
              }
            }} />
          </label>

          <button
            onClick={() => setShowRedesign(true)}
            className="px-3 py-2 border-2 border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
            title="Redesign (Brand Kit)"
          >
            Redesign
          </button>
          <button
            onClick={()=> setShowTemplateSettings(true)}
            className="px-3 py-2 border-2 border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
            title="Template settings (fonts + colors)"
          >
            Template settings
          </button>
          <button
            onClick={async ()=>{
              try {
                const tok = shareToken;
                if (!tok) { alert('Share token not available for this draft. Save once and retry.'); return; }
                const origin = typeof window !== 'undefined' ? window.location.origin : '';
                const link = `${origin}/presentations/view/${presentationId}?token=${encodeURIComponent(tok)}`;
                await navigator.clipboard.writeText(link);
                setShareMsg('Share link copied'); setTimeout(()=> setShareMsg(null), 1200);
              } catch { alert('Failed to copy'); }
            }}
            className="px-3 py-2 border-2 border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
            title="Copy a private view-only link"
          >
            Share
          </button>
          {shareMsg && <span className="text-sm text-emerald-700">{shareMsg}</span>}
          <button
            onClick={async ()=>{
              if (enriching) return;
              setEnriching(true);
              try {
                const hasGoogle = typeof window !== 'undefined' ? !!localStorage.getItem('google_api_key') : false;
                const hasOpenAI = typeof window !== 'undefined' ? !!localStorage.getItem('openai_api_key') : false;
                const provider = hasGoogle ? 'gemini' : (hasOpenAI ? 'openai' : '');
                const apiKey = hasGoogle ? localStorage.getItem('google_api_key') : (hasOpenAI ? localStorage.getItem('openai_api_key') : '');
                if (!provider || !apiKey) {
                  alert('Set a Google or OpenAI API key in Settings to generate images.');
                  setEnriching(false);
                  return;
                }
                let updated = [...slides];
                const total = updated.length;
                for (let i = 0; i < total; i++) {
                  const s = updated[i];
                  if (s.imageUrl) continue;
                  setEnrichMsg(`Slide ${i+1}/${total}…`);
                  try {
                    const textSnippet = (s.content || []).join(' • ').slice(0, 500);
                    const prompt = `${presentationTitle}: ${s.title}${textSnippet ? ' — ' + textSnippet : ''}`.slice(0, 700);
                    const resp = await fetch('/api/admin/presentations/images/generate', {
                      method: 'POST', headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ prompt, provider, apiKey, size: '1024x1024', allowFallback })
                    });
                    if (resp.ok) {
                      const j = await resp.json();
                      updated[i] = { ...s, imageUrl: j.url };
                      setSlides(updated);
                      // persist incrementally
                      setTimeout(() => saveToDatabase(), 10);
                    } else {
                      const j = await resp.json().catch(()=>({}));
                      const msg = j.details || j.error || 'Gemini image generation failed';
                      console.warn('[Presenton] Image generation error:', msg);
                    }
                  } catch {}
                }
                setEnrichMsg('Done');
                setTimeout(()=> setEnrichMsg(null), 1200);
              } finally {
                setEnriching(false);
              }
            }}
            className="px-3 py-2 border-2 border-emerald-200 rounded-lg text-emerald-700 hover:bg-emerald-50"
            title="Put images on slides that match the text"
          >
            Put images on slides
          </button>
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
                    {({ attributes, listeners, setNodeRef, style }) => (
                      <div ref={setNodeRef} style={style} className={`flex items-center gap-2 group`}>
                        <button
                          onClick={() => goToSlide(index)}
                          className={`flex-1 text-left p-3 rounded-lg border-2 transition-all ${
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
                        <button className="p-1 text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing" aria-label="Drag to reorder" {...attributes} {...listeners}>
                          <GripVertical className="w-4 h-4" />
                        </button>
                      </div>
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
            <div className="max-w-5xl mx-auto rounded-2xl shadow-2xl border-2 border-slate-200 p-12 min-h-[600px] flex flex-col" style={{ background: bgColor }}>
              {/* Slide Title */}
              <h2 className="text-4xl font-bold mb-8 pb-4 border-b-4" style={{ color: titleColor, borderBottomColor: primaryColor }}>{currentSlideData.title}</h2>

              {/* Slide controls moved to top menu bar */}

              {/* Slide Content (layout-aware) */}
              <div className="flex-1 flex flex-col gap-6">
                {effectiveLayout === 'two-column' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div>
                      {currentSlideData.content?.length > 0 && (
                        <ul className="space-y-4">
                          {currentSlideData.content.map((bullet, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="flex-shrink-0 w-2 h-2 rounded-full mt-2" style={{ background: primaryColor }} />
                              <span className="text-xl leading-relaxed" style={{ color: textColor }}>{sanitizePlain(bullet)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="flex items-center justify-center">
                      {currentSlideData.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={currentSlideData.imageUrl} alt={currentSlideData.title} className="max-w-full max-h-96 rounded-lg shadow-lg border-2 border-slate-200 object-contain" />
                      ) : (
                        <div className="text-slate-400 italic">No image</div>
                      )}
                    </div>
                  </div>
                ) : effectiveLayout === 'image-right' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div>
                      {currentSlideData.content?.length > 0 && (
                        <ul className="space-y-4">
                          {currentSlideData.content.map((bullet, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="flex-shrink-0 w-2 h-2 rounded-full mt-2" style={{ background: primaryColor }} />
                              <span className="text-xl leading-relaxed" style={{ color: textColor }}>{sanitizePlain(bullet)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="flex items-center justify-center">
                      {currentSlideData.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={currentSlideData.imageUrl} alt={currentSlideData.title} className="max-w-full max-h-96 rounded-lg shadow-lg border-2 border-slate-200 object-contain" />
                      )}
                    </div>
                  </div>
                ) : effectiveLayout === 'image-left' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="flex items-center justify-center order-last md:order-first">
                      {currentSlideData.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={currentSlideData.imageUrl} alt={currentSlideData.title} className="max-w-full max-h-96 rounded-lg shadow-lg border-2 border-slate-200 object-contain" />
                      )}
                    </div>
                    <div className="order-first md:order-last">
                      {currentSlideData.content?.length > 0 && (
                        <ul className="space-y-4">
                          {currentSlideData.content.map((bullet, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="flex-shrink-0 w-2 h-2 rounded-full mt-2" style={{ background: primaryColor }} />
                              <span className="text-xl leading-relaxed" style={{ color: textColor }}>{sanitizePlain(bullet)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ) : effectiveLayout === 'image-full' ? (
                  <div className="flex items-center justify-center flex-1">
                    {currentSlideData.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={currentSlideData.imageUrl} alt={currentSlideData.title} className="max-w-full max-h-[520px] rounded-xl shadow-2xl border-2 border-slate-200 object-contain" />
                    ) : (
                      <div className="text-slate-400 italic">No image</div>
                    )}
                  </div>
                ) : (
                  // Text-only or fallback
                  <>
                    {currentSlideData.content?.length > 0 && (
                      <ul className="space-y-4">
                        {currentSlideData.content.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-2 h-2 rounded-full mt-2" style={{ background: primaryColor }} />
                            <span className="text-xl leading-relaxed" style={{ color: textColor }}>{sanitizePlain(bullet)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {effectiveLayout === 'text' && currentSlideData.imageUrl && (
                      <div className="text-xs text-slate-500">Image present but layout is set to text</div>
                    )}
                  </>
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
      {showTemplateSettings && (
        <TemplateSettings
          initial={{
            titleFontUrl: templateFonts?.titleFontUrl,
            bodyFontUrl: templateFonts?.bodyFontUrl,
            titleFontName: templateFonts?.titleFontName,
            bodyFontName: templateFonts?.bodyFontName,
            theme: theme || undefined
          }}
          onSave={async (tf: any)=>{
            try {
              setSaving(true); setSaveError(null);
              await fetch(`/api/admin/presentations/${presentationId}`, {
                method:'PATCH', headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ slides, templateTheme: tf.theme, templateFonts: {
                  titleFontUrl: tf.titleFontUrl, bodyFontUrl: tf.bodyFontUrl, titleFontName: tf.titleFontName, bodyFontName: tf.bodyFontName
                } })
              });
              setTemplateFonts({ titleFontUrl: tf.titleFontUrl, bodyFontUrl: tf.bodyFontUrl, titleFontName: tf.titleFontName, bodyFontName: tf.bodyFontName });
              setTheme(tf.theme || null);
              setShowTemplateSettings(false);
            } catch (e) {
              setSaveError(e instanceof Error ? e.message : 'Failed to save');
            } finally { setSaving(false); }
          }}
          onClose={()=> setShowTemplateSettings(false)}
        />
      )}

      {/* Redesign (Brand Kit) Modal */}
      {showRedesign && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-900/50" onClick={()=> setShowRedesign(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl border-2 border-slate-200 max-w-xl w-full overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b-2 border-slate-200">
                <h4 className="text-lg font-bold text-slate-900">Redesign (Brand Kit)</h4>
                <button onClick={()=> setShowRedesign(false)} className="px-3 py-1 border-2 border-slate-200 rounded">Close</button>
              </div>
              <div className="p-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1">Primary Color</label>
                  <input type="color" value={'#'+((theme?.primaryColor)||'10B981')} onChange={(e)=> setTheme({ ...(theme||{}), primaryColor: e.target.value.replace('#','') })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1">Background Color</label>
                  <input type="color" value={'#'+((theme?.backgroundColor)||'FFFFFF')} onChange={(e)=> setTheme({ ...(theme||{}), backgroundColor: e.target.value.replace('#','') })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1">Title Color</label>
                  <input type="color" value={'#'+((theme?.titleColor)||'1F2937')} onChange={(e)=> setTheme({ ...(theme||{}), titleColor: e.target.value.replace('#','') })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1">Subtitle Color</label>
                  <input type="color" value={'#'+((theme?.subtitleColor)||'FFFFFF')} onChange={(e)=> setTheme({ ...(theme||{}), subtitleColor: e.target.value.replace('#','') })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-1">Text Color</label>
                  <input type="color" value={'#'+((theme?.textColor)||'374151')} onChange={(e)=> setTheme({ ...(theme||{}), textColor: e.target.value.replace('#','') })} />
                </div>
                <div>
                  <div className="text-sm text-slate-600">Preview</div>
                  <div className="rounded border overflow-hidden" style={{ borderColor: '#d1d5db' }}>
                    <div className="p-3" style={{ background: '#'+((theme?.primaryColor)||'10B981') }}>
                      <div className="font-bold" style={{ color: '#'+((theme?.subtitleColor)||'FFFFFF') }}>Title</div>
                    </div>
                    <div className="p-3" style={{ background: '#'+((theme?.backgroundColor)||'FFFFFF'), color: '#'+((theme?.textColor)||'374151') }}>
                      Lorem ipsum dolor sit amet
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 border-t-2 border-slate-200 flex items-center justify-end gap-2">
                <button onClick={()=> setShowRedesign(false)} className="px-4 py-2 border-2 border-slate-200 rounded">Cancel</button>
                <button
                  onClick={async ()=>{
                    // One-click redesign: adjust layouts and persist theme
                    try {
                      setSaving(true);
                      setSaveError(null);
                      // Adjust slide layouts based on content/images
                      const updated = [...slides].map((s) => {
                        const current = s.layout || 'auto';
                        if ((current === 'auto' || current === 'text') && s.imageUrl) return { ...s, layout: 'image-right' as const };
                        if (!s.imageUrl && (current === 'auto' || current === 'image-right')) return { ...s, layout: 'text' as const };
                        return s;
                      });
                      setSlides(updated);
                      const resp = await fetch(`/api/admin/presentations/${presentationId}`, {
                        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ slides: updated, templateTheme: theme || {} })
                      });
                      if (!resp.ok) {
                        const j = await resp.json().catch(()=>({})); throw new Error(j.error || 'Failed to apply redesign');
                      }
                      setShowRedesign(false);
                    } catch (e) {
                      setSaveError(e instanceof Error ? e.message : 'Failed to save');
                    } finally { setSaving(false); }
                  }}
                  className="px-4 py-2 border-2 border-emerald-200 text-emerald-700 rounded"
                >
                  Apply Theme Now
                </button>
                <button
                  onClick={async ()=>{
                    try {
                      setSaving(true);
                      setSaveError(null);
                      const resp = await fetch(`/api/admin/presentations/${presentationId}`, {
                        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ slides, templateTheme: theme || {} })
                      });
                      if (!resp.ok) {
                        const j = await resp.json().catch(()=>({})); throw new Error(j.error || 'Failed to save theme');
                      }
                      setShowRedesign(false);
                    } catch (e) {
                      setSaveError(e instanceof Error ? e.message : 'Failed to save');
                    } finally { setSaving(false); }
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded"
                >
                  Save Theme
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function sanitizePlain(s: string) {
  try {
    return String(s)
      .replace(/\r/g, '')
      .replace(/^\s*[-*•]\s+/, '')
      .replace(/^\s*\d+[\.)]\s+/, '')
      .replace(/\*\*|__|\*|_|`/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  } catch { return s as any; }
}
