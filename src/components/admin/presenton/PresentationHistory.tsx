"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Trash2, Clock, Presentation } from "lucide-react";

interface HistoryItem {
  id: string;
  topic: string;
  slideCount: number;
  template: string;
  createdAt: string;
}

export default function PresentationHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const saved = localStorage.getItem("presenton_history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear all history?")) {
      localStorage.removeItem("presenton_history");
      setHistory([]);
    }
  };

  const deleteItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem("presenton_history", JSON.stringify(updated));
    setHistory(updated);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <Presentation className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">No presentations yet</h3>
        <p className="text-slate-600 mb-4">
          Your generated presentations will appear here
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          Go to Create Tab
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Recent Presentations</h3>
          <p className="text-slate-600">
            {history.length} presentation{history.length !== 1 ? 's' : ''} generated
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-4 py-2 text-red-600 border-2 border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium"
          >
            <Trash2 className="w-4 h-4 inline mr-2" />
            Clear All
          </button>
        )}
      </div>

      {/* History List */}
      <div className="space-y-3">
        {history.map((item) => (
          <div
            key={item.id}
            className="border-2 border-slate-200 rounded-lg p-4 hover:border-emerald-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 mb-1">{item.topic}</h4>
                    <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                      <span className="px-2 py-1 bg-slate-100 rounded">
                        {item.slideCount} slides
                      </span>
                      <span className="px-2 py-1 bg-slate-100 rounded">
                        {item.template}
                      </span>
                      <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded">
                        <Clock className="w-3 h-3" />
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => deleteItem(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mt-6">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> History is stored locally in your browser. Generated files are not stored -
          make sure to save your presentations when you download them.
        </p>
      </div>
    </div>
  );
}
