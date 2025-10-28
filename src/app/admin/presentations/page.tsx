"use client";

import { Presentation } from "lucide-react";
import PresentationSettings from "@/components/admin/PresentationSettings";
import PresentationGenerator from "@/components/admin/PresentationGenerator";

export default function PresentationsPage() {
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
            Create AI-powered presentations instantly with Google Gemini AI
          </p>
        </div>

        {/* API Key Settings */}
        <PresentationSettings />

        {/* Presentation Generator */}
        <PresentationGenerator />
      </div>
    </div>
  );
}
