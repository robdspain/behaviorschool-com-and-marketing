"use client";

import { useState } from "react";
import { Mail, Download, CheckCircle, Loader2 } from "lucide-react";

interface EmailResultsGateProps {
  toolName: string;
  toolSource: string;
  resultsSummary?: string;
  onEmailSubmit?: (email: string, firstName: string) => void;
  ctaText?: string;
  successText?: string;
  children?: React.ReactNode;
}

export function EmailResultsGate({
  toolName,
  toolSource,
  resultsSummary,
  onEmailSubmit,
  ctaText = "Email me this report",
  successText = "Check your inbox!",
  children,
}: EmailResultsGateProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName: firstName || undefined,
          source: toolSource,
          role: "School BCBA",
          segment: "tools",
          metadata: {
            tool: toolName,
            resultsSummary: resultsSummary?.substring(0, 500),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }

      setIsSuccess(true);
      onEmailSubmit?.(email, firstName);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-green-900">{successText}</p>
            <p className="text-sm text-green-700">
              We sent your {toolName} results to {email}
            </p>
          </div>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-[#1a4731]/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <Mail className="w-6 h-6 text-[#1a4731]" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            {ctaText}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Get a PDF copy of your results plus tips for using this data in your FBA.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="First name (optional)"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731] focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a4731] focus:border-transparent"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || !email}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1a4731] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2d6b4f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Send My Results
                </>
              )}
            </button>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <p className="text-xs text-gray-500">
              Free. No spam. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
