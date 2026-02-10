"use client";

import { Presentation } from "lucide-react";
import PresentonInterface from "@/components/admin/presenton/PresentonInterface";

export default function PresentationsPage() {
  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Presentation className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">AI Presentations</h1>
          </div>
          <p className="text-sm sm:text-base text-slate-600">
            Create professional presentations with AI-powered content generation
          </p>
        </div>

        {/* Presenton Interface */}
        <PresentonInterface />
      </div>
    </div>
  );
}
