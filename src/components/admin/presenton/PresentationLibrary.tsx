"use client";

import { useEffect, useState } from 'react';
import { Download, Trash2, FileText, Clock, Database, Eye } from 'lucide-react';
import PresentationPlayer from './PresentationPlayer';
import PresentationListItem from './PresentationListItem';

type Slide = {
  title: string;
  content: string[];
  imageUrl?: string;
  icons?: string[];
  chart?: any;
  layout?: 'auto'|'text'|'image-right'|'image-left'|'two-column'|'quote'|'title-only'|'image-full'|'metrics-3'|'chart-right'|'chart-left'|'table';
};

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
  slides?: Slide[];
};

export default function PresentationLibrary() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewingPresentation, setViewingPresentation] = useState<{ id: string; slides: Slide[]; title: string; template: string } | null>(null);

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

  const onView = async (item: Item) => {
    try {
      // Fetch full presentation data including slides
      const res = await fetch(`/api/admin/presentations/${item.id}`);
      if (!res.ok) {
        alert('Failed to load presentation data');
        return;
      }
      const data = await res.json();

      // If no slides in database, create default slides from metadata
      const slides = data.slides || [{
        title: item.topic,
        content: ['No slide content available', 'This presentation was created before slide data was stored'],
        layout: 'text'
      }];

      setViewingPresentation({
        id: item.id,
        slides: slides,
        title: item.topic,
        template: item.template
      });
    } catch (err) {
      alert('Error loading presentation: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
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

  // If viewing a presentation, show the player
  if (viewingPresentation) {
    return (
      <PresentationPlayer
        presentationId={viewingPresentation.id}
        initialSlides={viewingPresentation.slides}
        presentationTitle={viewingPresentation.title}
        template={viewingPresentation.template}
        onClose={() => setViewingPresentation(null)}
      />
    );
  }

  return (
    <div className="space-y-3">
      {items.map((it, idx) => (
        <PresentationListItem
          key={it.id}
          index={idx+1}
          title={it.topic}
          slideCount={it.slide_count}
          template={it.template}
          provider={`${it.provider}${it.model ? ` • ${it.model}` : ''}`}
          exportFormat={it.export_format}
          createdAt={it.created_at}
          onView={() => onView(it)}
          onDownload={() => onDownload(it.id)}
          onDelete={() => onDelete(it.id)}
        />
      ))}
    </div>
  );
}
