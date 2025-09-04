"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, X, Mail, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DownloadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  resource: string;
  fileName: string;
  title: string;
}

export default function DownloadPopup({ 
  isOpen, 
  onClose, 
  resource, 
  fileName, 
  title 
}: DownloadPopupProps) {
  const [email, setEmail] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      alert("Please enter your email address");
      return;
    }

    setIsDownloading(true);

    try {
      // Submit email to newsletter/download tracking
      const subscribeResponse = await fetch('/api/download-subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          resource,
          source: 'act-matrix-download'
        }),
      });

      if (!subscribeResponse.ok) {
        console.error('Subscribe failed:', await subscribeResponse.text());
        // Continue with download anyway
      }

      // Start the download
      const downloadResponse = await fetch(`/api/download/${resource}`, {
        method: 'GET',
      });

      if (!downloadResponse.ok) {
        alert('Download failed. Please try again.');
        return;
      }

      // Create download link
      const blob = await downloadResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Close popup and redirect to confirmation page
      onClose();
      
      // Navigate to confirmation page with download info
      const params = new URLSearchParams({
        resource: resource,
        filename: fileName,
        email: email
      });
      
      router.push(`/download-confirmation?${params.toString()}`);

    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please check your connection and try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          disabled={isDownloading}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Download className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Download Your Free Resource
          </h2>
          <p className="text-slate-600">
            Enter your email to instantly download: <strong>{title}</strong>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                required
                disabled={isDownloading}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white font-semibold py-3"
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 w-5 h-5" />
                Download Now
              </>
            )}
          </Button>
        </form>

        <p className="text-xs text-slate-500 text-center mt-4">
          We respect your privacy. No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}