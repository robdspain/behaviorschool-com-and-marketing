"use client";

import { useState } from "react";
import { Share2, Copy, Check, Linkedin } from "lucide-react";

interface ShareBarProps {
  title: string;
  text: string;
  url: string;
  hashtags?: string[];
}

export function ShareBar({ title, text, url, hashtags = [] }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${text}\n\n${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // suppress unused warning for hashtags (kept for API consistency)
  void hashtags;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: '#f0f7f4', borderRadius: '12px', border: '1px solid #d1e7dd', flexWrap: 'wrap' }}>
      <Share2 size={18} color="#1a4731" />
      <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a4731', marginRight: '8px' }}>Share this tool</span>

      {/* LinkedIn */}
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#0077b5', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}
        aria-label={`Share ${title} on LinkedIn`}
      >
        <Linkedin size={15} />
        Share on LinkedIn
      </a>

      {/* Copy link */}
      <button
        type="button"
        onClick={handleCopy}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#fff', color: '#1a4731', border: '1px solid #1a4731', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
        aria-label="Copy link"
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  );
}
