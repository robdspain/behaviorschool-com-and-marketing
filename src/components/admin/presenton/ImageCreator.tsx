"use client";

import { useEffect, useMemo, useState } from 'react';
import { ImagePlus, Loader2, Download } from 'lucide-react';

export default function ImageCreator() {
  const [prompt, setPrompt] = useState('');
  const [provider, setProvider] = useState<'openai' | 'gemini'>('openai');
  const [size, setSize] = useState('1024x1024');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<Array<{ id: string; url: string; provider: string; model: string | null; created_at: string }>>([]);

  const hasOpenAI = !!(typeof window !== 'undefined' && localStorage.getItem('openai_api_key'));
  const hasGoogle = !!(typeof window !== 'undefined' && localStorage.getItem('google_api_key'));

  useEffect(() => {
    if (hasGoogle) setProvider('gemini');
    else if (hasOpenAI) setProvider('openai');
    loadImages();
  }, []);

  const loadImages = async () => {
    const res = await fetch('/api/admin/presentations/images/list');
    if (res.ok) {
      const data = await res.json();
      setImages(data.images || []);
    }
  };

  const onGenerate = async () => {
    setGenerating(true); setError(null);
    try {
      const apiKey = provider === 'gemini' ? localStorage.getItem('google_api_key') : localStorage.getItem('openai_api_key');
      if (!apiKey) throw new Error(`${provider} API key not set in Settings`);
      const res = await fetch('/api/admin/presentations/images/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, provider, apiKey, size })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Generation failed');
      }
      await loadImages();
      setPrompt('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally { setGenerating(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 mb-4">
        <ImagePlus className="w-6 h-6 text-slate-700 mt-1" />
        <div>
          <h3 className="text-xl font-bold text-slate-900">Image Generator</h3>
          <p className="text-slate-600">Create images with OpenAI or Gemini and reuse them in slides</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-slate-900 mb-2">Prompt</label>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} className="w-full px-4 py-3 border-2 border-slate-200 rounded"></textarea>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Provider</label>
          <select value={provider} onChange={(e)=> setProvider(e.target.value as 'openai'|'gemini')} className="w-full px-4 py-3 border-2 border-slate-200 rounded">
            <option value="openai" disabled={!hasOpenAI}>OpenAI</option>
            <option value="gemini" disabled={!hasGoogle}>Gemini</option>
          </select>
          <label className="block text-sm font-bold text-slate-900 mb-2 mt-3">Size</label>
          <select value={size} onChange={(e)=> setSize(e.target.value)} className="w-full px-4 py-3 border-2 border-slate-200 rounded">
            <option value="1024x1024">1024 x 1024</option>
            <option value="512x512">512 x 512</option>
            <option value="2048x2048">2048 x 2048</option>
          </select>
          <button onClick={onGenerate} disabled={generating || !prompt.trim()} className="mt-4 w-full px-4 py-3 bg-emerald-600 text-white rounded">
            {generating ? (<span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/>Generating...</span>) : 'Generate Image'}
          </button>
          {error && <div className="mt-2 px-3 py-2 border-2 border-red-200 bg-red-50 text-red-700 rounded">{error}</div>}
        </div>
      </div>

      <div>
        <h4 className="font-bold text-slate-900 mb-2">Generated Images</h4>
        {images.length === 0 ? (
          <div className="px-4 py-3 border-2 border-slate-200 rounded bg-slate-50 text-slate-600">No images yet</div>
        ) : (
          <div className="grid md:grid-cols-4 grid-cols-2 gap-3">
            {images.map((img) => (
              <a key={img.id} href={img.url} target="_blank" rel="noreferrer" className="block border-2 border-slate-200 rounded overflow-hidden hover:border-emerald-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="w-full h-40 object-cover" />
                <div className="px-2 py-1 text-xs text-slate-600 flex items-center justify-between">
                  <span>{img.provider}</span>
                  <Download className="w-3 h-3" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

