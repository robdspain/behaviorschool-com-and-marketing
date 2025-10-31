"use client";

import { useMemo, useState } from 'react';
import { RichTextEditor } from '@/components/RichTextEditor';

export default function SlideRichEditor({ title, initialBullets, onSave, onClose }: { title: string; initialBullets: string[]; onSave: (bullets: string[])=>void; onClose: ()=>void }) {
  const initialHtml = useMemo(() => {
    const safe = (s: string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const lis = (initialBullets || []).map(b=>`<li>${safe(b)}</li>`).join('');
    return `<h2>${safe(title)}</h2>${lis ? `<ul>${lis}</ul>` : '<p></p>'}`;
  }, [title, JSON.stringify(initialBullets)]);
  const [html, setHtml] = useState<string>(initialHtml);

  const save = () => {
    try {
      const div = document.createElement('div');
      div.innerHTML = html || '';
      const items: string[] = [];
      // Prefer <li>, fallback to <p>
      div.querySelectorAll('li').forEach(li => { const t=(li.textContent||'').trim(); if (t) items.push(t); });
      if (items.length === 0) {
        div.querySelectorAll('p').forEach(p => { const t=(p.textContent||'').trim(); if (t) items.push(t); });
      }
      onSave(items.length ? items : (initialBullets || []));
    } catch {
      onSave(initialBullets || []);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl border-2 border-slate-200 max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b-2 border-slate-200">
            <h4 className="text-lg font-bold text-slate-900">Edit Slide Content</h4>
            <button onClick={onClose} className="px-3 py-1 border-2 border-slate-200 rounded">Close</button>
          </div>
          <div className="p-4">
            <RichTextEditor content={html} onChange={setHtml} placeholder="Write slide content..." />
          </div>
          <div className="px-4 py-3 border-t-2 border-slate-200 flex items-center justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 border-2 border-slate-200 rounded">Cancel</button>
            <button onClick={save} className="px-4 py-2 bg-emerald-600 text-white rounded">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
