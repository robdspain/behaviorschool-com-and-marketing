"use client";

import { useState } from "react";
import { Presentation, FileText, Settings as SettingsIcon, History, Sparkles, Database, ListOrdered, ImagePlus } from "lucide-react";
import CreatePresentation from "./CreatePresentation";
import ProviderSettings from "./ProviderSettings";
import PresentationHistory from "./PresentationHistory";
import PresentationLibrary from "./PresentationLibrary";
import OutlineEditor from "./OutlineEditor";
import ImageCreator from "./ImageCreator";

type Tab = "create" | "settings" | "history" | "library" | "outline" | "images";

export default function PresentonInterface() {
  const [activeTab, setActiveTab] = useState<Tab>("create");

  const tabs = [
    { id: "create" as Tab, label: "Create", icon: Sparkles },
    { id: "outline" as Tab, label: "Outline", icon: ListOrdered },
    { id: "images" as Tab, label: "Images", icon: ImagePlus },
    { id: "settings" as Tab, label: "Settings", icon: SettingsIcon },
    { id: "history" as Tab, label: "History", icon: History },
    { id: "library" as Tab, label: "Library", icon: Database },
  ];

  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header with tabs */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Presentation className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">AI Presentation Generator</h2>
              <p className="text-emerald-50 text-sm">Self-hosted presentation generation with your own AI keys</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-emerald-600"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "create" && <CreatePresentation />}
        {activeTab === "settings" && <ProviderSettings />}
        {activeTab === "history" && <PresentationHistory />}
        {activeTab === "library" && <PresentationLibrary />}
        {activeTab === "outline" && <OutlineEditor />}
        {activeTab === "images" && <ImageCreator />}
      </div>
    </div>
  );
}
