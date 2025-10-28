"use client";

import { useState, useEffect } from "react";
import { Settings, Eye, EyeOff, Check, AlertCircle } from "lucide-react";

export default function PresentationSettings() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    // Load API key from localStorage on mount
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      setMessage({ type: 'error', text: 'Please enter an API key' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Save to localStorage
    localStorage.setItem("gemini_api_key", apiKey);
    setIsSaved(true);
    setMessage({ type: 'success', text: 'API key saved successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleClear = () => {
    localStorage.removeItem("gemini_api_key");
    setApiKey("");
    setIsSaved(false);
    setMessage({ type: 'success', text: 'API key cleared' });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Settings className="w-6 h-6 text-slate-700" />
        <h2 className="text-xl font-bold text-slate-900">API Configuration</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="apiKey"
            className="block text-sm font-bold text-slate-900 mb-2"
          >
            Google Gemini API Key
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                id="apiKey"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showKey ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              Save
            </button>
            {isSaved && (
              <button
                onClick={handleClear}
                className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>

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

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-900 mb-2">How to get your API key:</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
            <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-medium">Google AI Studio</a></li>
            <li>Sign in with your Google account</li>
            <li>Click &quot;Create API key&quot;</li>
            <li>Copy and paste the key above</li>
            <li>Click &quot;Save&quot;</li>
          </ol>
          <p className="mt-3 text-blue-800 text-sm">
            <strong>Note:</strong> Your API key is stored locally in your browser and is only sent to the server when generating presentations.
          </p>
        </div>
      </div>
    </div>
  );
}
