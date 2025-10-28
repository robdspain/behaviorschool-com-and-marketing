"use client";

import { useState } from "react";
import { Presentation, Download, Loader2, Sparkles } from "lucide-react";

interface PresentationFormData {
  topic: string;
  slideCount: number;
  template: string;
  tone: string;
}

export default function PresentationGenerator() {
  const [formData, setFormData] = useState<PresentationFormData>({
    topic: "",
    slideCount: 5,
    template: "modern",
    tone: "professional",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsGenerating(true);

    try {
      // Get API key from localStorage
      const apiKey = localStorage.getItem("presenton_api_key");

      if (!apiKey) {
        throw new Error("Please configure your Presenton API key in the settings above");
      }

      const response = await fetch("/api/admin/presentations/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          apiKey,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate presentation");
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formData.topic.replace(/[^a-z0-9]/gi, "_")}.pptx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(true);

      // Reset form after successful generation
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "slideCount" ? parseInt(value) : value,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border-2 border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-white" />
            <h2 className="text-3xl font-bold text-white">
              AI Presentation Generator
            </h2>
          </div>
          <p className="text-emerald-50">
            Create professional presentations instantly with AI
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Topic Input */}
          <div>
            <label
              htmlFor="topic"
              className="block text-sm font-bold text-slate-900 mb-2"
            >
              Presentation Topic *
            </label>
            <textarea
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="e.g., Positive Behavior Interventions and Supports (PBIS) in Schools"
            />
            <p className="mt-1 text-sm text-slate-500">
              Describe what you want your presentation to be about
            </p>
          </div>

          {/* Slide Count */}
          <div>
            <label
              htmlFor="slideCount"
              className="block text-sm font-bold text-slate-900 mb-2"
            >
              Number of Slides
            </label>
            <select
              id="slideCount"
              name="slideCount"
              value={formData.slideCount}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            >
              <option value="3">3 slides</option>
              <option value="5">5 slides</option>
              <option value="7">7 slides</option>
              <option value="10">10 slides</option>
              <option value="15">15 slides</option>
              <option value="20">20 slides</option>
            </select>
          </div>

          {/* Template Selection */}
          <div>
            <label
              htmlFor="template"
              className="block text-sm font-bold text-slate-900 mb-2"
            >
              Template Style
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "modern", label: "Modern", color: "from-blue-500 to-blue-600" },
                { value: "professional", label: "Professional", color: "from-slate-600 to-slate-700" },
                { value: "elegant", label: "Elegant", color: "from-purple-500 to-purple-600" },
              ].map((template) => (
                <button
                  key={template.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, template: template.value }))
                  }
                  className={`relative p-4 border-2 rounded-lg transition-all ${
                    formData.template === template.value
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`w-full h-16 rounded mb-2 bg-gradient-to-br ${template.color}`}
                  ></div>
                  <p className="text-sm font-medium text-slate-900">
                    {template.label}
                  </p>
                  {formData.template === template.value && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selection */}
          <div>
            <label
              htmlFor="tone"
              className="block text-sm font-bold text-slate-900 mb-2"
            >
              Presentation Tone
            </label>
            <select
              id="tone"
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="educational">Educational</option>
              <option value="inspirational">Inspirational</option>
              <option value="technical">Technical</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4">
              <p className="text-emerald-800 font-medium">
                Presentation generated successfully! Download should start automatically.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isGenerating || !formData.topic}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-bold text-lg hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Generating Presentation...
              </>
            ) : (
              <>
                <Download className="w-6 h-6" />
                Generate Presentation
              </>
            )}
          </button>

          <p className="text-center text-sm text-slate-500">
            Powered by Presenton AI • Generate professional presentations in seconds
          </p>
        </form>
      </div>

      {/* Info Cards */}
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <Presentation className="w-5 h-5" />
            AI-Powered
          </h3>
          <p className="text-blue-800 text-sm">
            Uses Claude AI to generate relevant, engaging content for your topic
          </p>
        </div>

        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
          <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Instant Download
          </h3>
          <p className="text-purple-800 text-sm">
            Get a fully formatted PowerPoint file ready to present or customize
          </p>
        </div>

        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4">
          <h3 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Professional Design
          </h3>
          <p className="text-emerald-800 text-sm">
            Choose from multiple templates with clean, modern styling
          </p>
        </div>
      </div>
    </div>
  );
}
