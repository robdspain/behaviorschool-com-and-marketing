"use client";

import { useEffect, useMemo, useState } from 'react';
import { ListOrdered, Plus, Trash2, ArrowUp, ArrowDown, Loader2, FileDown } from 'lucide-react';
import LayoutPreview from './LayoutPreview';
import ChartEditor from './ChartEditor';
import PresentationDocsLibrary from './PresentationDocsLibrary';
import TemplateSettings from './TemplateSettings';
import SlideRichEditor from './SlideRichEditor';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Slide = { title: string; content: string[]; imageUrl?: string; icons?: string[]; layout?: 'auto'|'text'|'image-right'|'image-left'|'two-column'|'quote'|'title-only'|'image-full'|'metrics-3'|'chart-right'|'chart-left' };

export default function OutlineEditor() {
  const [title, setTitle] = useState('Untitled Presentation');
  const [language, setLanguage] = useState('English');
  const [tone, setTone] = useState('professional');
  const [template, setTemplate] = useState('modern');
  const [slideCount, setSlideCount] = useState(10);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<'pptx' | 'pdf' | 'pdf_hifi'>('pptx');
  const [imgProvider, setImgProvider] = useState<'openai'|'gemini'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('google_api_key') ? 'gemini' : 'openai';
    }
    return 'openai';
  });
  const [imgSize, setImgSize] = useState<'512x512'|'1024x1024'|'2048x2048'>('1024x1024');
  const [layoutBrowserIndex, setLayoutBrowserIndex] = useState<number | null>(null);
  const [galleryTemplate, setGalleryTemplate] = useState<string | null>(null);
  const [chartEditorIndex, setChartEditorIndex] = useState<number | null>(null);
  const [saveId, setSaveId] = useState<string | null>(null);
  const [showDocs, setShowDocs] = useState(false);
  const [showTemplateSettings, setShowTemplateSettings] = useState(false);
  const [templateFonts, setTemplateFonts] = useState<{ titleFontUrl?: string; bodyFontUrl?: string; titleFontName?: string; bodyFontName?: string }>({});
  const [richEditIndex, setRichEditIndex] = useState<number | null>(null);
  const [asyncMsg, setAsyncMsg] = useState<string | null>(null);
  const [asyncRunning, setAsyncRunning] = useState(false);

  const provider = useMemo(() => {
    const googleKey = localStorage.getItem('google_api_key');
    const openaiKey = localStorage.getItem('openai_api_key');
    const anthropicKey = localStorage.getItem('anthropic_api_key');
    const ollamaEndpoint = localStorage.getItem('ollama_endpoint');
    return googleKey ? 'google' : openaiKey ? 'openai' : anthropicKey ? 'anthropic' : ollamaEndpoint ? 'ollama' : '';
  }, []);

  const apiKey = useMemo(() => localStorage.getItem('google_api_key') || localStorage.getItem('openai_api_key') || localStorage.getItem('anthropic_api_key') || '', []);
  const ollamaEndpoint = useMemo(() => localStorage.getItem('ollama_endpoint') || '', []);

  const genOutline = async () => {
    setLoading(true); setError(null);
    try {
      if (!provider) throw new Error('Configure an AI provider in Settings first');
      const resp = await fetch('/api/admin/presentations/generate-outline', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: title, slideCount, tone, language, model: '', provider, apiKey, ollamaEndpoint })
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to generate outline');
      }
      const data = await resp.json();
      setSlides(data.slides || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally { setLoading(false); }
  };

  const addSlide = () => setSlides([...slides, { title: 'New Slide', content: ['Point 1', 'Point 2', 'Point 3'] }]);
  const delSlide = (i: number) => setSlides(slides.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir; if (j < 0 || j >= slides.length) return;
    const copy = slides.slice(); [copy[i], copy[j]] = [copy[j], copy[i]]; setSlides(copy);
  };
  const updateTitle = (i: number, val: string) => {
    const copy = slides.slice(); copy[i] = { ...copy[i], title: val }; setSlides(copy);
  };
  const updateBullet = (i: number, k: number, val: string) => {
    const copy = slides.slice(); const content = copy[i].content.slice(); content[k] = val; copy[i] = { ...copy[i], content }; setSlides(copy);
  };
  const addBullet = (i: number) => {
    const copy = slides.slice(); copy[i] = { ...copy[i], content: [...copy[i].content, 'New point'] }; setSlides(copy);
  };
  const delBullet = (i: number, k: number) => {
    const copy = slides.slice(); copy[i] = { ...copy[i], content: copy[i].content.filter((_, idx) => idx !== k) }; setSlides(copy);
  };

  // Image helpers: search
  const [imagePicker, setImagePicker] = useState<{ index: number; results: Array<{ url: string; thumb: string; author?: string }> } | null>(null);
  const setImageResults = (index: number, results: Array<{ url: string; thumb: string; author?: string }>) => setImagePicker({ index, results });
  const searchImages = async (i: number) => {
    try {
      const q = slides[i].title || title;
      const res = await fetch('/api/admin/presentations/images/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: q, provider: 'auto', perPage: 6 }) });
      if (!res.ok) throw new Error('Image search failed');
      const data = await res.json();
      setImageResults(i, data.images || []);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Image search error');
    }
  };
  const chooseImage = (url: string) => {
    if (imagePicker) {
      const copy = slides.slice();
      copy[imagePicker.index] = { ...copy[imagePicker.index], imageUrl: url };
      setSlides(copy);
      setImagePicker(null);
    }
  };

  // Load from saved images library (Supabase)
  const openLibrary = async (i: number) => {
    try {
      const res = await fetch('/api/admin/presentations/images/list');
      if (!res.ok) throw new Error('Failed to load library');
      const data = await res.json();
      const results = (data.images || []).map((x: any) => ({ url: x.url, thumb: x.url }));
      setImageResults(i, results);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Library load error');
    }
  };

  // Image helpers: generate (OpenAI)
  const generateImage = async (i: number) => {
    try {
      const openaiKey = localStorage.getItem('openai_api_key');
      const googleKey = localStorage.getItem('google_api_key');
      if (imgProvider === 'openai' && !openaiKey) { alert('OpenAI API key not set in Settings'); return; }
      if (imgProvider === 'gemini' && !googleKey) { alert('Google API key not set in Settings'); return; }
      const q = slides[i].title || title;
      const res = await fetch('/api/admin/presentations/images/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: q, provider: imgProvider, apiKey: imgProvider === 'openai' ? openaiKey : googleKey, size: imgSize })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Image generation failed');
      }
      const data = await res.json();
      const copy = slides.slice();
      copy[i] = { ...copy[i], imageUrl: data.url };
      setSlides(copy);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Image generation error');
    }
  };

  // Icon search picker
  const [iconPicker, setIconPicker] = useState<{ index: number; results: Array<{ url: string; thumb: string }> } | null>(null);
  const searchIcons = async (i: number) => {
    try {
      const q = slides[i].title || title;
      const res = await fetch('/api/admin/presentations/icons/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: q, perPage: 12 }) });
      if (!res.ok) throw new Error('Icon search failed');
      const data = await res.json();
      setIconPicker({ index: i, results: data.icons || [] });
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Icon search error');
    }
  };
  const addIcon = (url: string) => {
    if (iconPicker) {
      const copy = slides.slice();
      const existing = copy[iconPicker.index].icons || [];
      copy[iconPicker.index] = { ...copy[iconPicker.index], icons: [...existing, url] };
      setSlides(copy);
    }
  };
  const removeIcon = (i: number, k: number) => {
    const copy = slides.slice();
    const icons = (copy[i].icons || []).slice();
    icons.splice(k, 1);
    copy[i].icons = icons;
    setSlides(copy);
  };

  function SortableSlide({ id, children }: { id: string; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition } as React.CSSProperties;
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
      </div>
    );
  }

  const createPresentation = async () => {
    setLoading(true); setError(null);
    try {
      const resp = await fetch('/api/admin/presentations/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: title, template, tone, language, exportAs: exportFormat, slides, templateFonts })
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to generate presentation');
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `${title.substring(0,30).replace(/[^a-z0-9]/gi,'_')}.${exportFormat}`;
      document.body.appendChild(a); a.click(); URL.revokeObjectURL(url); document.body.removeChild(a);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Presentation Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Export Format</label>
          <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value as any)} className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg">
            <option value="pptx">PowerPoint (.pptx)</option>
            <option value="pdf">PDF (.pdf)</option>
            <option value="pdf_hifi">PDF (Hi‑Fi)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg">
            {['English','Spanish','French','German','Chinese','Japanese'].map((l)=> <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Tone</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg">
            {['professional','casual','educational','inspirational','technical'].map((t)=> <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Template</label>
          <select value={template} onChange={(e) => setTemplate(e.target.value)} className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg">
            {['modern','general','swift','minimal','corporate'].map((t)=> <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Desired Slides</label>
          <select value={slideCount} onChange={(e) => setSlideCount(parseInt(e.target.value))} className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg">
            {[5,7,10,15,20,25,30].map((n)=> <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={genOutline} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium flex items-center gap-2" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ListOrdered className="w-4 h-4" />}
          Generate Outline
        </button>
        <button onClick={addSlide} className="px-4 py-2 border-2 border-slate-200 rounded-lg font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Slide
        </button>
        <button onClick={()=> setShowTemplateSettings(true)} className="px-4 py-2 border-2 border-slate-200 rounded-lg font-medium">Template Settings</button>
        <button onClick={async ()=>{
          const payload = { id: saveId, title, template, data: { title, language, tone, template, slides, templateFonts } };
          const res = await fetch('/api/admin/presentations/docs', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
          const out = await res.json(); if (out?.id) setSaveId(out.id);
          alert(res.ok ? 'Saved!' : ('Save failed: '+(out.error||'unknown')));
        }} className="px-4 py-2 border-2 border-emerald-200 rounded-lg font-medium">{saveId ? 'Save' : 'Save As New'}</button>
        <button onClick={()=> setShowDocs(true)} className="px-4 py-2 border-2 border-slate-200 rounded-lg font-medium">Load From Library</button>
        <button onClick={createPresentation} className="ml-auto px-4 py-2 bg-teal-600 text-white rounded-lg font-medium flex items-center gap-2" disabled={loading || slides.length===0}>
          <FileDown className="w-4 h-4" /> Create Presentation
        </button>
        <button onClick={async ()=>{
          setAsyncMsg('Starting...'); setAsyncRunning(true);
          const resp = await fetch('/api/admin/presentations/generate/async', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ topic: title, template, tone, language, exportAs: exportFormat, slides, templateFonts }) });
          if (!resp.ok) { setAsyncMsg('Failed to start'); setAsyncRunning(false); return; }
          const { id } = await resp.json();
          try {
            const ev = new EventSource(`/api/admin/presentations/generate/stream/${id}`);
            ev.onmessage = (e)=>{ try { const d = JSON.parse(e.data); if (d.progress!==undefined) setAsyncMsg(`${d.step||'working'} ${d.progress}%`);} catch{} };
            ev.addEventListener('status', (e: any)=>{ try { const d = JSON.parse(e.data); setAsyncMsg(`${d.step} ${d.progress}%`);} catch{} });
            ev.addEventListener('complete', (e: any)=>{ setAsyncMsg('Completed'); setAsyncRunning(false); ev.close(); });
          } catch { setAsyncMsg('Running...'); }
        }} className="px-4 py-2 border-2 border-teal-200 rounded-lg font-medium" disabled={asyncRunning || slides.length===0}>Generate (Async)</button>
      </div>

      {error && <div className="px-4 py-3 border-2 border-red-200 rounded-lg bg-red-50 text-red-700">{error}</div>}
      {asyncMsg && <div className="px-4 py-3 border-2 border-emerald-200 rounded-lg bg-emerald-50 text-emerald-800">{asyncMsg}</div>}

      <DndContext collisionDetection={closestCenter} onDragEnd={({active, over})=>{
        if (!over) return; const from = Number(active.id); const to = Number(over.id); if (from===to) return;
        setSlides((prev)=> arrayMove(prev, from, to));
      }}>
        <SortableContext items={slides.map((_,i)=> String(i))} strategy={verticalListSortingStrategy}>
      <div className="space-y-4">
        {slides.map((s, i) => (
          <SortableSlide key={i} id={String(i)}>
          <div className="border-2 border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <input value={s.title} onChange={(e)=>updateTitle(i, e.target.value)} className="flex-1 px-3 py-2 border-2 border-slate-200 rounded" />
              <select value={s.layout || 'auto'} onChange={(e)=>{ const copy = slides.slice(); copy[i] = { ...copy[i], layout: e.target.value as any }; setSlides(copy); }} className="px-2 py-2 border-2 border-slate-200 rounded text-sm">
                <option value="auto">Layout: Auto</option>
                <option value="text">Text</option>
                <option value="image-right">Image Right</option>
                <option value="image-left">Image Left</option>
                <option value="two-column">Two Column</option>
                <option value="quote">Quote</option>
                <option value="title-only">Title Only</option>
                <option value="image-full">Image Full</option>
                <option value="metrics-3">Metrics (3)</option>
                <option value="chart-right">Chart Right</option>
                <option value="chart-left">Chart Left</option>
              </select>
              <button onClick={() => setLayoutBrowserIndex(i)} className="px-3 py-2 border-2 border-slate-200 rounded text-sm">Browse layouts</button>
              <button onClick={() => move(i, -1)} className="p-2 hover:bg-slate-50 rounded" title="Move up"><ArrowUp className="w-4 h-4"/></button>
              <button onClick={() => move(i, +1)} className="p-2 hover:bg-slate-50 rounded" title="Move down"><ArrowDown className="w-4 h-4"/></button>
              <button onClick={() => delSlide(i)} className="p-2 hover:bg-red-50 text-red-600 rounded" title="Delete"><Trash2 className="w-4 h-4"/></button>
            </div>
            <div className="mb-3">
              <LayoutPreview
                layout={(s.layout || 'auto') as any}
                imageUrl={s.imageUrl}
                titleText={s.title}
                content={s.content}
                template={template as any}
                className="max-w-[260px]"
              />
            </div>
            <div className="space-y-2">
              {s.content.map((c, k) => (
                <div key={k} className="flex items-center gap-2">
                  <input value={c} onChange={(e)=>updateBullet(i, k, e.target.value)} className="flex-1 px-3 py-2 border-2 border-slate-200 rounded" />
                  <button onClick={() => delBullet(i, k)} className="p-2 hover:bg-red-50 text-red-600 rounded" title="Remove"><Trash2 className="w-4 h-4"/></button>
                </div>
              ))}
              <button onClick={() => addBullet(i)} className="mt-1 text-sm text-emerald-700">+ Add bullet</button>
              <div>
                <button onClick={()=> setRichEditIndex(i)} className="mt-1 text-sm text-slate-700 underline">Rich edit</button>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-bold text-slate-900 mb-1">Image URL (optional)</label>
                <div className="flex gap-2">
                  <input value={s.imageUrl || ''} onChange={(e)=>{ const copy = slides.slice(); copy[i] = { ...copy[i], imageUrl: e.target.value }; setSlides(copy); }} className="flex-1 px-3 py-2 border-2 border-slate-200 rounded" placeholder="https://..." />
                  <button onClick={() => searchImages(i)} type="button" className="px-3 py-2 border-2 border-slate-200 rounded">Search</button>
                  <button onClick={() => generateImage(i)} type="button" className="px-3 py-2 border-2 border-slate-200 rounded">Generate</button>
                  <button onClick={() => openLibrary(i)} type="button" className="px-3 py-2 border-2 border-slate-200 rounded">Library</button>
                </div>
                <div className="flex gap-2 mt-2">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Provider</label>
                    <select value={imgProvider} onChange={(e)=> setImgProvider(e.target.value as any)} className="px-2 py-1 border-2 border-slate-200 rounded">
                      <option value="openai" disabled={!localStorage.getItem('openai_api_key')}>OpenAI</option>
                      <option value="gemini" disabled={!localStorage.getItem('google_api_key')}>Gemini</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Size</label>
                    <select value={imgSize} onChange={(e)=> setImgSize(e.target.value as any)} className="px-2 py-1 border-2 border-slate-200 rounded">
                      <option value="512x512">512x512</option>
                      <option value="1024x1024">1024x1024</option>
                      <option value="2048x2048">2048x2048</option>
                    </select>
                  </div>
                </div>
                {imagePicker && imagePicker.index === i && imagePicker.results?.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {imagePicker.results.map((img, idx) => (
                      <button key={idx} type="button" onClick={() => chooseImage(img.url)} className="border-2 border-slate-200 rounded overflow-hidden hover:border-emerald-300">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.thumb || img.url} alt="" className="w-full h-24 object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {(s.layout === 'chart-right' || s.layout === 'chart-left') && (
                <div className="mt-3">
                  <label className="block text-sm font-bold text-slate-900 mb-1">Chart</label>
                  <div className="flex items-center gap-2">
                    <button onClick={()=> setChartEditorIndex(i)} className="px-3 py-2 border-2 border-slate-200 rounded">{s.chart ? 'Edit Chart' : 'Add Chart'}</button>
                    {s.chart && (
                      <span className="text-sm text-slate-600">{s.chart.type.toUpperCase()} • {s.chart.series.length} series • {s.chart.categories.length} categories</span>
                    )}
                  </div>
                </div>
              )}
              <div className="mt-3">
                <label className="block text-sm font-bold text-slate-900 mb-1">Icons (optional)</label>
                <div className="flex gap-2">
                  <button onClick={() => searchIcons(i)} type="button" className="px-3 py-2 border-2 border-slate-200 rounded">Search Icons</button>
                </div>
                {iconPicker && iconPicker.index === i && iconPicker.results?.length > 0 && (
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {iconPicker.results.map((ic, idx) => (
                      <button key={idx} type="button" onClick={() => addIcon(ic.url)} className="border-2 border-slate-200 rounded overflow-hidden hover:border-emerald-300">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={ic.thumb || ic.url} alt="" className="w-full h-16 object-contain bg-white" />
                      </button>
                    ))}
                  </div>
                )}
                {(s.icons && s.icons.length > 0) && (
                  <div className="flex flex-wrap gap-2 mt-2 items-center">
                    {s.icons.map((u, k) => (
                      <div key={k} className="flex items-center gap-2 border-2 border-slate-200 rounded px-2 py-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={u} alt="" className="w-6 h-6 object-contain" />
                        <button onClick={() => removeIcon(i, k)} className="text-red-600 text-xs">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          </SortableSlide>
        ))}
      </div>
        </SortableContext>
      </DndContext>

      {/* Layout Browser Overlay */}
      {layoutBrowserIndex !== null && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setLayoutBrowserIndex(null)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl border-2 border-slate-200 max-w-5xl w-full max-h-[85vh] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b-2 border-slate-200">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-bold text-slate-900">Choose a layout</h4>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <span>Preview template:</span>
                    <select value={galleryTemplate ?? template} onChange={(e)=> setGalleryTemplate(e.target.value)} className="px-2 py-1 border-2 border-slate-200 rounded">
                      {['modern','general','swift','minimal','corporate'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {galleryTemplate && galleryTemplate !== template && (
                      <button onClick={()=> { setTemplate(galleryTemplate as any); setGalleryTemplate(null); }} className="px-2 py-1 border-2 border-emerald-200 rounded text-emerald-700 hover:bg-emerald-50">Apply template</button>
                    )}
                  </div>
                </div>
                <button onClick={() => setLayoutBrowserIndex(null)} className="px-3 py-1 border-2 border-slate-200 rounded">Close</button>
              </div>
              <div className="p-4 overflow-auto">
                <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                  {(['auto','text','image-right','image-left','two-column','quote','title-only','image-full','metrics-3','chart-right','chart-left'] as const).map((lt) => (
                    <button
                      key={lt}
                      onClick={() => {
                        const idx = layoutBrowserIndex as number;
                        const copy = slides.slice();
                        copy[idx] = { ...copy[idx], layout: lt };
                        setSlides(copy);
                        setLayoutBrowserIndex(null);
                      }}
                      className="group border-2 border-slate-200 rounded-lg overflow-hidden hover:border-emerald-300 transition"
                    >
                      <LayoutPreview
                        layout={lt as any}
                        imageUrl={slides[layoutBrowserIndex]?.imageUrl}
                        titleText={slides[layoutBrowserIndex!]?.title}
                        content={slides[layoutBrowserIndex!]?.content}
                        icons={slides[layoutBrowserIndex!]?.icons}
                        template={(galleryTemplate ?? template) as any}
                        variant="large"
                        className="w-full"
                      />
                      <div className="px-3 py-2 text-left text-sm text-slate-700 bg-slate-50 border-t-2 border-slate-200">
                        {labelForLayout(lt)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart Editor */}
      {chartEditorIndex !== null && (
        <ChartEditor
          initial={slides[chartEditorIndex!].chart as any}
          onSave={(data)=> {
            const copy = slides.slice();
            copy[chartEditorIndex!] = { ...copy[chartEditorIndex!], chart: data as any };
            setSlides(copy);
            setChartEditorIndex(null);
          }}
          onClose={()=> setChartEditorIndex(null)}
          template={template as any}
        />
      )}

      {/* Docs Library */}
      {showDocs && (
        <PresentationDocsLibrary
          onLoad={(doc)=>{
            setTitle(doc.title);
            setSaveId(doc.id);
            setGalleryTemplate(null);
            setTemplate(doc.template || 'modern');
            try {
              setLanguage(doc.data?.language || 'English');
              setTone(doc.data?.tone || 'professional');
              setSlides(doc.data?.slides || []);
              setTemplateFonts(doc.data?.templateFonts || {});
            } catch { /* ignore */ }
            setShowDocs(false);
          }}
          onClose={()=> setShowDocs(false)}
        />
      )}

      {showTemplateSettings && (
        <TemplateSettings
          initial={templateFonts}
          onSave={(tf)=> { setTemplateFonts(tf); setShowTemplateSettings(false); }}
          onClose={()=> setShowTemplateSettings(false)}
        />
      )}

      {richEditIndex !== null && (
        <SlideRichEditor
          title={slides[richEditIndex].title}
          initialBullets={slides[richEditIndex].content}
          onSave={(bullets)=> { const copy = slides.slice(); copy[richEditIndex!] = { ...copy[richEditIndex!], content: bullets }; setSlides(copy); setRichEditIndex(null); }}
          onClose={()=> setRichEditIndex(null)}
        />
      )}
    </div>
  );
}

function labelForLayout(l: string) {
  switch (l) {
    case 'auto': return 'Auto (smart)';
    case 'text': return 'Text';
    case 'image-right': return 'Image Right';
    case 'image-left': return 'Image Left';
    case 'two-column': return 'Two Column';
    case 'quote': return 'Quote';
    case 'title-only': return 'Title Only';
    case 'image-full': return 'Image Full';
    default: return l;
  }
}
