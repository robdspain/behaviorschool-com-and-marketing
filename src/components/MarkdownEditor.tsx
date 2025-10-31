"use client";

import { useState } from 'react';

export default function MarkdownEditor({ initial = '', onChange }: { initial?: string; onChange?: (md: string)=>void }) {
  const [md, setMd] = useState(initial);
  return (
    <div className="grid md:grid-cols-2 gap-3 border-2 border-slate-200 rounded-lg overflow-hidden">
      <textarea value={md} onChange={(e)=> { setMd(e.target.value); onChange?.(e.target.value); }} rows={14} className="w-full p-3 border-r-2 border-slate-200 focus:outline-none" placeholder="Write Markdown..." />
      <div className="p-3 prose prose-slate max-w-none overflow-auto" dangerouslySetInnerHTML={{ __html: markdownToHtml(md) }} />
    </div>
  );
}

function markdownToHtml(md: string) {
  // Minimal markdown support: headings, bold, italic, lists, links
  let html = md
    .replace(/^###\s+(.*)$/gm, '<h3>$1<\/h3>')
    .replace(/^##\s+(.*)$/gm, '<h2>$1<\/h2>')
    .replace(/^#\s+(.*)$/gm, '<h1>$1<\/h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1<\/strong>')
    .replace(/\*(.*?)\*/g, '<em>$1<\/em>')
    .replace(/^\*\s+(.*)$/gm, '<li>$1<\/li>')
    .replace(/^\-\s+(.*)$/gm, '<li>$1<\/li>')
    .replace(/^\d+\.\s+(.*)$/gm, '<li>$1<\/li>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1<\/a>')
    .replace(/\n{2,}/g, '<br/>');
  // Wrap orphan list items
  html = html.replace(/(?:<li>[^<]*<\/li>\s*)+/g, (m) => `<ul>${m}<\/ul>`);
  return html;
}

