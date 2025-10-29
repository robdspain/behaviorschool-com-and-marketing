"use client";

import { useEffect, useState } from 'react';
import { Download, Trash2, FileText, Clock, Database } from 'lucide-react';

type Item = {
  id: string;
  topic: string;
  slide_count: number;
  template: string;
  tone: string | null;
  language: string | null;
  provider: string;
  model: string | null;
  export_format: 'pptx' | 'pdf';
  storage_path: string;
  created_at: string;
};

export default function PresentationLibrary() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/presentations/list', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Load error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id: string) => {
    if (!confirm('Delete this presentation?')) return;
    const res = await fetch(`/api/admin/presentations/${id}`, { method: 'DELETE' });
    if (res.ok) setItems((s) => s.filter((i) => i.id !== id));
  };

  const onDownload = (id: string) => {
    window.location.href = `/api/admin/presentations/download/${id}`;
  };

  if (loading) {
    return <div className="px-4 py-3 border-2 border-slate-200 rounded-lg bg-slate-50 text-slate-600">Loading...</div>;
  }
  if (error) {
    return <div className="px-4 py-3 border-2 border-red-200 rounded-lg bg-red-50 text-red-700">{error}</div>;
  }
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Database className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">No saved presentations</h3>
        <p className="text-slate-600">Generate a presentation to see it here.</p>
        <button onClick={load} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg">Refresh</button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div key={it.id} className="border-2 border-slate-200 rounded-lg p-4 hover:border-emerald-300 transition-colors">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 mb-1">{it.topic}</h4>
                  <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                    <span className="px-2 py-1 bg-slate-100 rounded">{it.slide_count} slides</span>
                    <span className="px-2 py-1 bg-slate-100 rounded">{it.template}</span>
                    <span className="px-2 py-1 bg-slate-100 rounded">{it.provider}{it.model ? ` • ${it.model}` : ''}</span>
                    <span className="px-2 py-1 bg-slate-100 rounded">{it.export_format.toUpperCase()}</span>
                    <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded">
                      <Clock className="w-3 h-3" />
                      {new Date(it.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button onClick={() => onDownload(it.id)} className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg" title="Download">
                <Download className="w-4 h-4" />
              </button>
              <button onClick={() => onDelete(it.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

