"use client";

export default function PresentationListItem({ index, title, slideCount, template, provider, exportFormat, createdAt, onView, onDownload, onDelete }: { index?: number; title: string; slideCount: number; template: string; provider: string; exportFormat: string; createdAt: string; onView: ()=>void; onDownload: ()=>void; onDelete: ()=>void }) {
  return (
    <div className="border-2 border-slate-200 rounded-lg p-4 hover:border-emerald-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            {index !== undefined && (
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-600 bg-slate-200 rounded">{index}</span>
            )}
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
              <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                <span className="px-2 py-1 bg-slate-100 rounded">{slideCount} slides</span>
                <span className="px-2 py-1 bg-slate-100 rounded">{template}</span>
                <span className="px-2 py-1 bg-slate-100 rounded">{provider}</span>
                <span className="px-2 py-1 bg-slate-100 rounded">{exportFormat.toUpperCase()}</span>
                <span className="px-2 py-1 bg-slate-100 rounded">{new Date(createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <button onClick={onView} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="View">View</button>
          <button onClick={onDownload} className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg" title="Download">Download</button>
          <button onClick={onDelete} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">Delete</button>
        </div>
      </div>
    </div>
  );
}

