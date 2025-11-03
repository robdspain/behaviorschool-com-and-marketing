"use client";

import { useState } from "react";
import { Download, X, Mail, Loader2 } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

type Props = {
  title: string;
  buttonText?: string;
  downloadUrl: string;
  fileName: string;
  resourceName?: string; // used for analytics and /api/download-subscribe
  variant?: "primary" | "outline";
  className?: string;
};

export default function EmailGateDownload({
  title,
  buttonText = "Download",
  downloadUrl,
  fileName,
  resourceName = "salary-benchmarks",
  variant = "outline",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const { trackDownload, trackEmailSignup, trackFormSubmission, trackButtonClick } = useAnalytics();

  const onClick = () => {
    trackButtonClick('email_gate_open', 'salary download', { resourceName });
    setOpen(true);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setBusy(true);
    try {
      trackFormSubmission('email_gate_download', true, { resourceName });
      // Subscribe email (soft failure tolerated)
      const res = await fetch('/api/download-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resource: resourceName, source: 'email-gate-download' })
      });
      if (res.ok) {
        trackEmailSignup('download', email, { resource: resourceName });
      }
      // Fetch file and trigger download
      const dl = await fetch(downloadUrl, { method: 'GET' });
      if (!dl.ok) {
        alert('Download failed. Please try again.');
        return;
      }
      const blob = await dl.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      trackDownload(fileName, email);
      setOpen(false);
    } catch (err) {
      alert('Something went wrong. Please try again later.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={[
          "inline-flex items-center gap-2 rounded-lg px-4 py-2 transition-colors",
          variant === 'primary'
            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
            : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-800",
          className,
        ].join(' ')}
      >
        <Download className="w-4 h-4" />
        {buttonText}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              disabled={busy}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Download</h2>
              <p className="text-slate-600">Enter your email to download: <strong>{title}</strong></p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={busy}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg"
              >
                {busy ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 inline-block animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 w-5 h-5 inline-block" /> Download
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-slate-500 text-center mt-4">We respect your privacy. Unsubscribe anytime.</p>
          </div>
        </div>
      )}
    </>
  );
}

