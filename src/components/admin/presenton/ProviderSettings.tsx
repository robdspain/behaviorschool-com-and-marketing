"use client";

import { useState, useEffect } from "react";
import { Settings, Eye, EyeOff, Check, AlertCircle, Key } from "lucide-react";

interface ProviderConfig {
  google_api_key: string;
  openai_api_key: string;
  anthropic_api_key: string;
  ollama_endpoint: string;
}

export default function ProviderSettings() {
  const [config, setConfig] = useState<ProviderConfig>({
    google_api_key: "",
    openai_api_key: "",
    anthropic_api_key: "",
    ollama_endpoint: "",
  });
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    // Load saved config from localStorage
    const saved: Partial<ProviderConfig> = {};
    const initialKeys = ["google_api_key", "openai_api_key", "anthropic_api_key", "ollama_endpoint"];
    initialKeys.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value) saved[key as keyof ProviderConfig] = value;
    });
    setConfig((prev) => ({ ...prev, ...saved }));
  }, []);

  const handleSave = () => {
    // Save all non-empty fields to localStorage
    const saved: string[] = [];
    Object.entries(config).forEach(([key, value]) => {
      if (value) {
        localStorage.setItem(key, value);
        saved.push(key);
      } else {
        localStorage.removeItem(key);
      }
    });

    console.log("Saved API keys to localStorage:", saved);
    setMessage({ type: 'success', text: `Settings saved successfully! (${saved.length} key${saved.length !== 1 ? 's' : ''} saved)` });
    setTimeout(() => setMessage(null), 3000);
  };

  const providers = [
    {
      key: "google_api_key" as keyof ProviderConfig,
      label: "Google AI API Key",
      description: "For Gemini models (recommended for presentation generation)",
      placeholder: "AIza...",
      link: "https://aistudio.google.com/app/apikey",
      required: true,
    },
    {
      key: "openai_api_key" as keyof ProviderConfig,
      label: "OpenAI API Key",
      description: "For GPT-4, GPT-3.5 Turbo models",
      placeholder: "sk-...",
      link: "https://platform.openai.com/api-keys",
      required: false,
    },
    {
      key: "anthropic_api_key" as keyof ProviderConfig,
      label: "Anthropic API Key",
      description: "For Claude models",
      placeholder: "sk-ant-...",
      link: "https://console.anthropic.com/",
      required: false,
    },
    {
      key: "ollama_endpoint" as keyof ProviderConfig,
      label: "Ollama Endpoint",
      description: "Local Ollama server endpoint",
      placeholder: "http://localhost:11434",
      link: "https://ollama.ai",
      required: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <Key className="w-6 h-6 text-slate-700 mt-1" />
        <div>
          <h3 className="text-xl font-bold text-slate-900">AI Provider Configuration</h3>
          <p className="text-slate-600">
            Configure your API keys for different AI providers. All keys are stored locally in your browser.
          </p>
        </div>
      </div>

      {/* Provider Fields */}
      <div className="space-y-6">
        {providers.map((provider) => (
          <div key={provider.key} className="border-2 border-slate-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <label className="block text-sm font-bold text-slate-900">
                  {provider.label}
                  {provider.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <p className="text-sm text-slate-600 mt-1">{provider.description}</p>
              </div>
              <a
                href={provider.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Get API Key →
              </a>
            </div>

            <div className="relative mt-3">
              <input
                type={showKeys[provider.key] ? "text" : "password"}
                value={config[provider.key]}
                onChange={(e) => setConfig({ ...config, [provider.key]: e.target.value })}
                placeholder={provider.placeholder}
                className="w-full px-4 py-3 pr-12 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowKeys({ ...showKeys, [provider.key]: !showKeys[provider.key] })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showKeys[provider.key] ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`p-4 rounded-lg border-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <p className="font-medium">{message.text}</p>
          </div>
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-bold text-lg hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
      >
        <Check className="w-6 h-6" />
        Save All Settings
      </button>

      {/* Info */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <h4 className="font-bold text-blue-900 mb-2">About API Keys</h4>
        <ul className="space-y-1 text-blue-800 text-sm">
          <li>• All API keys are stored locally in your browser</li>
          <li>• Keys are sent to your server when generating presentations</li>
          <li>• At minimum, you need one AI provider key (Google AI recommended)</li>
          <li>• Additional provider keys enable fallback options</li>
          <li>• Ollama endpoint allows using local AI models</li>
          <li>• No Presenton subscription required - this is self-hosted</li>
        </ul>
      </div>
    </div>
  );
}
