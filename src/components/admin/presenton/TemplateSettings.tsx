"use client";

import { useState } from 'react';

type Theme = { primaryColor?: string; backgroundColor?: string; titleColor?: string; subtitleColor?: string; textColor?: string };

export default function TemplateSettings({ initial, onSave, onClose }: { initial?: { titleFontUrl?: string; bodyFontUrl?: string; titleFontName?: string; bodyFontName?: string; theme?: Theme }, onSave: (tf: any)=>void, onClose: ()=>void }) {
  const [titleFontUrl, setTitleFontUrl] = useState(initial?.titleFontUrl || '');
  const [bodyFontUrl, setBodyFontUrl] = useState(initial?.bodyFontUrl || '');
  const [titleFontName, setTitleFontName] = useState(initial?.titleFontName || 'CustomTitle');
  const [bodyFontName, setBodyFontName] = useState(initial?.bodyFontName || 'CustomBody');
  const [theme, setTheme] = useState<Theme>({
    primaryColor: initial?.theme?.primaryColor || '',
    backgroundColor: initial?.theme?.backgroundColor || '',
    titleColor: initial?.theme?.titleColor || '',
    subtitleColor: initial?.theme?.subtitleColor || '',
    textColor: initial?.theme?.textColor || '',
  });

  const uploadFont = async (file: File, setUrl: (s:string)=>void) => {
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/admin/presentations/fonts/upload', { method: 'POST', body: fd });
    const data = await res.json(); if (res.ok && data.url) setUrl(data.url);
    else alert('Font upload failed: '+(data.error||'unknown'));
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl border-2 border-slate-200 max-w-xl w-full overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b-2 border-slate-200">
            <h4 className="text-lg font-bold text-slate-900">Template Settings</h4>
            <button onClick={onClose} className="px-3 py-1 border-2 border-slate-200 rounded">Close</button>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1">Title Font URL</label>
              <input value={titleFontUrl} onChange={(e)=> setTitleFontUrl(e.target.value)} className="w-full px-3 py-2 border-2 border-slate-200 rounded" placeholder="https://.../font.woff2" />
              <input type="file" accept=".woff,.woff2,.ttf,.otf" onChange={(e)=> { const f=e.target.files?.[0]; if (f) uploadFont(f, setTitleFontUrl); }} className="mt-2" />
              <label className="block text-xs text-slate-600 mt-1">Font Family Name</label>
              <input value={titleFontName} onChange={(e)=> setTitleFontName(e.target.value)} className="w-full px-3 py-2 border-2 border-slate-200 rounded" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1">Body Font URL</label>
              <input value={bodyFontUrl} onChange={(e)=> setBodyFontUrl(e.target.value)} className="w-full px-3 py-2 border-2 border-slate-200 rounded" placeholder="https://.../font.woff2" />
              <input type="file" accept=".woff,.woff2,.ttf,.otf" onChange={(e)=> { const f=e.target.files?.[0]; if (f) uploadFont(f, setBodyFontUrl); }} className="mt-2" />
              <label className="block text-xs text-slate-600 mt-1">Font Family Name</label>
              <input value={bodyFontName} onChange={(e)=> setBodyFontName(e.target.value)} className="w-full px-3 py-2 border-2 border-slate-200 rounded" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 mb-2">Theme Colors</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Primary</label>
                  <input type="color" value={theme.primaryColor || '#10B981'} onChange={(e)=> setTheme({ ...theme, primaryColor: e.target.value.replace('#','') })} />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Background</label>
                  <input type="color" value={'#'+(theme.backgroundColor || 'FFFFFF')} onChange={(e)=> setTheme({ ...theme, backgroundColor: e.target.value.replace('#','') })} />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Title</label>
                  <input type="color" value={'#'+(theme.titleColor || '1F2937')} onChange={(e)=> setTheme({ ...theme, titleColor: e.target.value.replace('#','') })} />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Subtitle</label>
                  <input type="color" value={'#'+(theme.subtitleColor || 'FFFFFF')} onChange={(e)=> setTheme({ ...theme, subtitleColor: e.target.value.replace('#','') })} />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Text</label>
                  <input type="color" value={'#'+(theme.textColor || '374151')} onChange={(e)=> setTheme({ ...theme, textColor: e.target.value.replace('#','') })} />
                </div>
              </div>
              <div className="text-xs text-slate-600 mt-1">Colors are applied to PPTX/PDF and Hi‑Fi PDF exports.</div>
            </div>
            <div className="text-sm text-slate-600">These fonts will be used in Hi‑Fi PDF exports and previews.</div>
          </div>
          <div className="px-4 py-3 border-t-2 border-slate-200 flex items-center justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 border-2 border-slate-200 rounded">Cancel</button>
            <button onClick={()=> onSave({ titleFontUrl, bodyFontUrl, titleFontName, bodyFontName, theme })} className="px-4 py-2 bg-emerald-600 text-white rounded">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
