"use client";

import { useState } from "react";
import { Facebook, Linkedin, Mail, Twitter, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type ShareButtonsProps = {
  title: string;
  url: string;
  className?: string;
};

export function ShareButtons({ title, url, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareText = `${title} - ${url}`;

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareText);
  const encodedEmailSubject = encodeURIComponent(`Check out ${title}`);
  const encodedEmailBody = encodeURIComponent(`${title}\n${url}`);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      const fallback = document.createElement("textarea");
      fallback.value = url;
      fallback.setAttribute("readonly", "");
      fallback.style.position = "absolute";
      fallback.style.left = "-9999px";
      document.body.appendChild(fallback);
      fallback.select();
      document.execCommand("copy");
      document.body.removeChild(fallback);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-white p-6", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">Share this tool</h3>
        {copied && (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Link copied
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <a
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
          href={`https://twitter.com/intent/tweet?text=${encodedText}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share ${title} on X`}
        >
          <Twitter className="h-4 w-4" aria-hidden />
          X
        </a>
        <a
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodeURIComponent(title)}&summary=${encodedText}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share ${title} on LinkedIn`}
        >
          <Linkedin className="h-4 w-4" aria-hidden />
          LinkedIn
        </a>
        <a
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share ${title} on Facebook`}
        >
          <Facebook className="h-4 w-4" aria-hidden />
          Facebook
        </a>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
          onClick={handleCopy}
          aria-label={`Copy link to ${title}`}
        >
          <Copy className="h-4 w-4" aria-hidden />
          Copy link
        </button>
        <a
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
          href={`mailto:?subject=${encodedEmailSubject}&body=${encodedEmailBody}`}
          aria-label={`Share ${title} by email`}
        >
          <Mail className="h-4 w-4" aria-hidden />
          Email
        </a>
      </div>
    </div>
  );
}
