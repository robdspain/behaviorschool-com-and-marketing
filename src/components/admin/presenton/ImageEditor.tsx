"use client";

import { useState, useEffect } from 'react';

type ImageEditorProps = {
  imageUrl: string;
  open: boolean;
  onClose: () => void;
  onApply?: (result: { url: string }) => void; // future: crop/resize output
};

// Simple placeholder editor. Crop/resize tooling pending.
export default function ImageEditor({ imageUrl, open, onClose, onApply }: ImageEditorProps) {
  const [url, setUrl] = useState(imageUrl);

  useEffect(() => { setUrl(imageUrl); }, [imageUrl]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl border-2 border-slate-200 max-w-3xl w-full overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b-2 border-slate-200">
            <h4 className="text-lg font-bold text-slate-900">Image Editor</h4>
            <button onClick={onClose} className="px-3 py-1 border-2 border-slate-200 rounded">Close</button>
          </div>
          <div className="p-4 grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg p-4 bg-slate-50 min-h-[320px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="Preview" className="max-h-[420px] max-w-full object-contain rounded-md shadow-sm" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-semibold text-slate-900 mb-1">Source URL</div>
                <input value={url} onChange={(e)=> setUrl(e.target.value)} className="w-full px-3 py-2 border-2 border-slate-200 rounded" placeholder="https://..." />
                <div className="text-xs text-slate-500 mt-1">Paste a different image URL to preview.</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs font-medium text-slate-700 mb-1">Crop</div>
                  <button disabled className="w-full px-3 py-2 border-2 border-slate-200 rounded text-slate-400 cursor-not-allowed">Pending</button>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-700 mb-1">Resize</div>
                  <button disabled className="w-full px-3 py-2 border-2 border-slate-200 rounded text-slate-400 cursor-not-allowed">Pending</button>
                </div>
              </div>
              <div className="text-xs text-slate-600">Crop and resize tooling coming soon.</div>
            </div>
          </div>
          <div className="px-4 py-3 border-t-2 border-slate-200 flex items-center justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 border-2 border-slate-200 rounded">Cancel</button>
            <button onClick={()=> onApply?.({ url })} className="px-4 py-2 bg-emerald-600 text-white rounded">Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
}

