"use client";

import { useEffect, useState } from 'react';

export default function PublicPresentationPage({ params, searchParams }: { params: { id: string }, searchParams: { token?: string } }) {
  const [data, setData] = useState<{ title: string; slides: Array<{ title: string; content: string[]; imageUrl?: string }>|null } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = searchParams?.token || '';
  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`/api/presentations/share/${params.id}?token=${encodeURIComponent(token)}`);
        const j = await resp.json();
        if (!resp.ok) throw new Error(j.error || 'Failed to load');
        setData({ title: j.title, slides: j.slides });
      } catch (e) { setError(e instanceof Error ? e.message : 'Error'); }
    })();
  }, [params.id, token]);
  if (error) return <div className="p-6 text-red-700">{error}</div>;
  if (!data?.slides) return <div className="p-6 text-slate-700">Loading…</div>;
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">{data.title}</h1>
        <div className="space-y-6">
          {data.slides.map((s, i) => (
            <div key={i} className="bg-white border-2 border-slate-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h2>
              {s.imageUrl && (<img src={s.imageUrl} alt="" className="max-w-full max-h-96 rounded border mb-3" />)}
              <ul className="list-disc ml-6 text-slate-700">
                {s.content.map((c, k)=> (<li key={k} className="mb-1">{c}</li>))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

