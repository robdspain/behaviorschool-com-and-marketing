"use client";

import { useEffect, useState } from 'react';
import { FileText, Download, Trash2, Copy, Upload } from 'lucide-react';

export default function PresentationDocsLibrary({ onLoad, onClose }: { onLoad: (doc: any) => void; onClose: () => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/presentations/docs');
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) {
      setError('Failed to load');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this saved presentation?')) return;
    await fetch(`/api/admin/presentations/docs/${id}`, { method: 'DELETE' });
    await load();
  };
  const cloneItem = async (id: string) => {
    await fetch(`/api/admin/presentations/docs/${id}/clone`, { method: 'POST' });
    await load();
  };
  const open = async (id: string) => {
    const res = await fetch(`/api/admin/presentations/docs/${id}`);
    if (!res.ok) return;
    const doc = await res.json();
    onLoad(doc);
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl border-2 border-slate-200 max-w-4xl w-full max-h-[85vh] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b-2 border-slate-200">
            <h4 className="text-lg font-bold text-slate-900">Saved Presentations</h4>
            <button onClick={onClose} className="px-3 py-1 border-2 border-slate-200 rounded">Close</button>
          </div>
          <div className="p-4 overflow-auto">
            {loading ? (
              <div className="text-slate-600">Loading...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : items.length === 0 ? (
              <div className="text-slate-600">No saved presentations. Save from the Outline tab.</div>
            ) : (
              <div className="space-y-2">
                {items.map((it) => (
                  <div key={it.id} className="border-2 border-slate-200 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <div>
                        <div className="font-bold text-slate-900">{it.title}</div>
                        <div className="text-sm text-slate-600">{new Date(it.updated_at).toLocaleString()} • Template: {it.template}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => open(it.id)} className="px-3 py-1 border-2 border-slate-200 rounded">Open</button>
                      <button onClick={() => cloneItem(it.id)} className="p-2 text-slate-700 hover:bg-slate-50 rounded"><Copy className="w-4 h-4" /></button>
                      <button onClick={() => deleteItem(it.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

