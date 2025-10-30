"use client";

import { useState, useEffect } from "react";
import { FileUp, Loader2, Download, Eye, Sparkles, FileText, Upload } from "lucide-react";

interface PresentationForm {
  inputType: "text" | "file";
  content: string;
  file: File | null;
  slideCount: number;
  language: string;
  template: string;
  tone: string;
  model: string;
  exportFormat: 'pptx' | 'pdf' | 'pdf_hifi';
}

interface AIModel {
  name: string;
  displayName: string;
  description?: string;
}

export default function CreatePresentation() {
  const [form, setForm] = useState<PresentationForm>({
    inputType: "text",
    content: "",
    file: null,
    slideCount: 10,
    language: "English",
    template: "modern",
    tone: "professional",
    model: "", // Will be set from API
    exportFormat: 'pptx',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPresentation, setGeneratedPresentation] = useState<{
    id: string;
    path: string;
    editPath: string;
  } | null>(null);
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelsError, setModelsError] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailableModels();
  }, []);

  const fetchAvailableModels = async () => {
    setIsLoadingModels(true);
    setModelsError(null);

    try {
      const googleKey = localStorage.getItem("google_api_key");
      const openaiKey = localStorage.getItem("openai_api_key");
      const anthropicKey = localStorage.getItem("anthropic_api_key");
      const ollamaEndpoint = localStorage.getItem("ollama_endpoint");

      if (!googleKey && !openaiKey && !anthropicKey && !ollamaEndpoint) {
        setModelsError("Please configure an AI provider key in Settings first");
        setIsLoadingModels(false);
        return;
      }

      const provider = googleKey ? "google" : openaiKey ? "openai" : anthropicKey ? "anthropic" : "ollama";
      const apiKey = googleKey || openaiKey || anthropicKey || "";

      const response = await fetch("/api/admin/presentations/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, provider, ollamaEndpoint }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || "Failed to fetch models");
      }

      const data = await response.json();
      setAvailableModels(data.models || []);

      // Set default model if available
      if (data.models && data.models.length > 0 && !form.model) {
        console.log(`[Presenton] Defaulting to model: ${data.models[0].name}`);
        setForm({ ...form, model: data.models[0].name });
      }
    } catch (err) {
      console.error("Error fetching models:", err);
      setModelsError(err instanceof Error ? err.message : "Failed to fetch models");
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, file: e.target.files[0] });
    }
  };

  const handleGenerate = async () => {
    setError(null);
    setIsGenerating(true);
    setGeneratedPresentation(null);

    try {
      // Get API keys from localStorage - try Google AI first, then others
      const googleKey = localStorage.getItem("google_api_key");
      const openaiKey = localStorage.getItem("openai_api_key");
      const anthropicKey = localStorage.getItem("anthropic_api_key");
      const ollamaEndpoint = localStorage.getItem("ollama_endpoint");

      if (!googleKey && !openaiKey && !anthropicKey && !ollamaEndpoint) {
        throw new Error("Please configure at least one AI provider in the Settings tab (Google, OpenAI, Anthropic, or Ollama endpoint)");
      }

      // Prefer Google AI for presentation generation
      const apiKey = googleKey || openaiKey || anthropicKey || "";
      const provider = googleKey ? "google" : openaiKey ? "openai" : anthropicKey ? "anthropic" : "ollama";
      console.log(`[Presenton] Generating with provider=${provider} model=${form.model} format=${form.exportFormat}`);

      // If using file input and we have a plaintext file, read it client-side
      let topicContent = form.content;
      if (form.inputType === 'file' && form.file) {
        const ext = form.file.name.toLowerCase().split('.').pop();
        if (ext === 'txt' || ext === 'csv') {
          topicContent = await form.file.text();
        } else {
          const fd = new FormData();
          fd.append('file', form.file);
          const extractResp = await fetch('/api/admin/presentations/files/extract', { method: 'POST', body: fd });
          if (!extractResp.ok) {
            const errJson = await extractResp.json().catch(() => ({}));
            throw new Error(errJson.error || 'Failed to extract text from document');
          }
          const { text } = await extractResp.json();
          topicContent = text;
        }
      }

      const response = await fetch("/api/admin/presentations/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topicContent,
          slideCount: form.slideCount,
          template: form.template,
          tone: form.tone,
          language: form.language,
          model: form.model,
          provider,
          apiKey,
          exportAs: form.exportFormat,
          ollamaEndpoint,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Generation error:", errorData);
        throw new Error(errorData.details || errorData.error || "Failed to generate presentation");
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const baseName = (topicContent || form.content).substring(0, 30).replace(/[^a-z0-9]/gi, "_");
      a.download = `${baseName}.${form.exportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Save to history
      const history = JSON.parse(localStorage.getItem("presenton_history") || "[]");
      history.unshift({
        id: Date.now().toString(),
        topic: (topicContent || form.content).slice(0, 200),
        slideCount: form.slideCount,
        template: form.template,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("presenton_history", JSON.stringify(history.slice(0, 20)));

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Type Selection */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-3">
          How would you like to create your presentation?
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setForm({ ...form, inputType: "text" })}
            className={`p-4 border-2 rounded-lg transition-all ${
              form.inputType === "text"
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <FileText className={`w-8 h-8 mx-auto mb-2 ${
              form.inputType === "text" ? "text-emerald-600" : "text-slate-400"
            }`} />
            <p className="font-medium text-slate-900">From Text/Topic</p>
            <p className="text-sm text-slate-600 mt-1">Describe your presentation topic</p>
          </button>

          <button
            type="button"
            onClick={() => setForm({ ...form, inputType: "file" })}
            className={`p-4 border-2 rounded-lg transition-all ${
              form.inputType === "file"
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <Upload className={`w-8 h-8 mx-auto mb-2 ${
              form.inputType === "file" ? "text-emerald-600" : "text-slate-400"
            }`} />
            <p className="font-medium text-slate-900">From Document</p>
            <p className="text-sm text-slate-600 mt-1">Upload a file or document</p>
          </button>
        </div>
      </div>

      {/* Content Input */}
      {form.inputType === "text" ? (
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">
            Presentation Topic *
          </label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="e.g., The impact of AI on modern education systems"
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">
            Upload Document *
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors">
            <FileUp className="w-12 h-12 mx-auto mb-3 text-slate-400" />
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Click to upload
            </label>
            <p className="text-slate-600 text-sm mt-1">
              {form.file ? form.file.name : "Supports PDF, DOC, DOCX, TXT"}
            </p>
          </div>
        </div>
      )}

      {/* Configuration Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Slide Count */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">
            Number of Slides
          </label>
          <select
            value={form.slideCount}
            onChange={(e) => setForm({ ...form, slideCount: parseInt(e.target.value) })}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {[5, 7, 10, 15, 20, 25, 30].map((count) => (
              <option key={count} value={count}>{count} slides</option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">
            Language
          </label>
          <select
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Chinese">Chinese</option>
            <option value="Japanese">Japanese</option>
          </select>
        </div>

        {/* Template */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">
            Template
          </label>
          <select
            value={form.template}
            onChange={(e) => setForm({ ...form, template: e.target.value })}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="modern">Modern</option>
            <option value="general">General</option>
            <option value="swift">Swift</option>
            <option value="minimal">Minimal</option>
            <option value="corporate">Corporate</option>
          </select>
        </div>

        {/* Tone */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">
            Tone
          </label>
          <select
            value={form.tone}
            onChange={(e) => setForm({ ...form, tone: e.target.value })}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="educational">Educational</option>
            <option value="inspirational">Inspirational</option>
            <option value="technical">Technical</option>
          </select>
        </div>

        {/* AI Model */}
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-slate-900 mb-2">
            AI Model
          </label>
          {isLoadingModels ? (
            <div className="px-4 py-3 border-2 border-slate-200 rounded-lg bg-slate-50 text-slate-600 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading available models...
            </div>
          ) : modelsError ? (
            <div className="px-4 py-3 border-2 border-red-200 rounded-lg bg-red-50 text-red-700">
              {modelsError}
              <button
                onClick={fetchAvailableModels}
                className="ml-2 text-sm underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          ) : availableModels.length > 0 ? (
            <>
              <select
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {availableModels.map((model) => (
                  <option key={model.name} value={model.name}>
                    {model.displayName} {model.description ? `- ${model.description}` : ''}
                  </option>
                ))}
              </select>
              <div className="mt-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-md p-3 leading-relaxed">
                <div className="font-semibold text-slate-800 mb-1">Model guidance</div>
                <ul className="list-disc ml-4 space-y-1">
                  <li><span className="font-medium">Gemini 2.5 Pro</span>: best for complex reasoning (code/math/STEM), long-context docs, and nuanced slide writing.</li>
                  <li><span className="font-medium">Gemini 2.5 Flash</span>: recommended default — strong quality with low latency and great price-performance.</li>
                  <li><span className="font-medium">Gemini 2.5 Flash‑Lite</span>: ultra fast and cost‑efficient for bulk or quick drafts.</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="px-4 py-3 border-2 border-yellow-200 rounded-lg bg-yellow-50 text-yellow-800">
              No models available. Please check your API key in Settings.
            </div>
          )}
        </div>

        {/* Export Format */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Export Format</label>
          <select
            value={form.exportFormat}
            onChange={(e) => setForm({ ...form, exportFormat: e.target.value as 'pptx' | 'pdf' })}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="pptx">PowerPoint (.pptx)</option>
            <option value="pdf">PDF (.pdf)</option>
            <option value="pdf_hifi">PDF (Hi‑Fi)</option>
          </select>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || (!form.content && !form.file)}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-bold text-lg hover:from-emerald-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Generating Your Presentation...
          </>
        ) : (
          <>
            <Sparkles className="w-6 h-6" />
            Generate Presentation
          </>
        )}
      </button>
    </div>
  );
}
