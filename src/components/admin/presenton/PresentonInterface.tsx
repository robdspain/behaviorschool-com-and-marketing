"use client";

import { useState } from "react";
import { Presentation, Settings as SettingsIcon, History, Sparkles, Database } from "lucide-react";
import CreatePresentation from "./CreatePresentation";
import ProviderSettings from "./ProviderSettings";
import PresentationHistory from "./PresentationHistory";
import PresentationLibrary from "./PresentationLibrary";
 
type Tab = "create" | "settings" | "history" | "library";

export default function PresentonInterface() {
  const [activeTab, setActiveTab] = useState<Tab>("create");

  const tabs = [
    { id: "create" as Tab, label: "Create", icon: Sparkles },
    { id: "settings" as Tab, label: "Settings", icon: SettingsIcon },
    { id: "history" as Tab, label: "History", icon: History },
    { id: "library" as Tab, label: "Library", icon: Database },
  ];

  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header with tabs */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Presentation className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold text-white truncate">AI Presentation Generator</h2>
              <p className="text-emerald-50 text-xs sm:text-sm hidden sm:block">Self-hosted presentation generation with your own AI keys</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 sm:gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white text-emerald-600"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-6">
        {activeTab === "create" && <CreatePresentation />}
        {activeTab === "settings" && <ProviderSettings />}
        {activeTab === "history" && <PresentationHistory />}
        {activeTab === "library" && <PresentationLibrary />}
      </div>
    </div>
  );
}
