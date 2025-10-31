"use client";

export default function PresentationCard({ title, template, provider, createdAt, onView, onDownload, onDelete }: { title: string; template: string; provider: string; createdAt: string; onView: ()=>void; onDownload: ()=>void; onDelete: ()=>void }) {
  return (
    <div className="border-2 border-slate-200 rounded-lg p-4 hover:border-emerald-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
          <div className="flex flex-wrap gap-2 text-sm text-slate-600">
            <span className="px-2 py-1 bg-slate-100 rounded">{template}</span>
            <span className="px-2 py-1 bg-slate-100 rounded">{provider}</span>
            <span className="px-2 py-1 bg-slate-100 rounded">{new Date(createdAt).toLocaleString()}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onView} className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded">View</button>
          <button onClick={onDownload} className="px-2 py-1 text-emerald-700 hover:bg-emerald-50 rounded">Download</button>
          <button onClick={onDelete} className="px-2 py-1 text-red-600 hover:bg-red-50 rounded">Delete</button>
        </div>
      </div>
    </div>
  );
}

