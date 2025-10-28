"use client";

import { useState, useEffect } from "react";
import { Presentation, AlertCircle, ExternalLink, RefreshCw } from "lucide-react";

export default function PresentationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const presentonUrl = process.env.NEXT_PUBLIC_PRESENTON_URL || "http://localhost:5000";

  useEffect(() => {
    checkPresentonStatus();
  }, []);

  const checkPresentonStatus = async () => {
    try {
      const response = await fetch(presentonUrl, { mode: 'no-cors' });
      setIsOnline(true);
      setIsLoading(false);
    } catch (error) {
      setIsOnline(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Presentation className="w-8 h-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-slate-900">Presentations</h1>
          </div>
          <p className="text-slate-600">
            Create AI-powered presentations with Presenton
          </p>
        </div>

        {/* Status Check */}
        {isLoading ? (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
              <p className="text-blue-900 font-medium">Checking Presenton status...</p>
            </div>
          </div>
        ) : !isOnline ? (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-amber-900 mb-2">Presenton Not Running</h3>
                <p className="text-amber-800 mb-4">
                  To use Presenton, you need to start the Docker container first.
                </p>
                <div className="bg-amber-100 border border-amber-300 rounded-lg p-4 mb-4">
                  <p className="font-mono text-sm text-amber-900 mb-2">Run this command in your terminal:</p>
                  <code className="block bg-white p-3 rounded border border-amber-300 text-sm">
                    docker-compose up -d
                  </code>
                </div>
                <button
                  onClick={checkPresentonStatus}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  Check Again
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Presenton Interface */}
        <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-slate-50 border-b-2 border-slate-200 px-6 py-4 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Presenton Interface</h2>
            <a
              href={presentonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Open in New Tab
            </a>
          </div>
          <div className="relative" style={{ height: 'calc(100vh - 300px)', minHeight: '600px' }}>
            <iframe
              src={presentonUrl}
              className="w-full h-full border-0"
              title="Presenton"
              allow="clipboard-read; clipboard-write"
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-slate-50 border-2 border-slate-200 rounded-xl p-6">
          <h3 className="font-bold text-slate-900 mb-3">About Presenton</h3>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Create presentations using AI (OpenAI, Anthropic, Google, Ollama)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Export as PDF or PPTX format</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Web search integration for up-to-date content</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>Privacy-focused with local processing</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
