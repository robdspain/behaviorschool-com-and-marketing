'use client';

type ShareBarProps = { url: string; title: string };

export function ShareBar({ url, title }: ShareBarProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const xUrl = `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // noop
    }
  }

  return (
    <div className="hidden lg:flex lg:flex-col gap-3 sticky top-24 self-start">
      <a href={xUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900">X</a>
      <a href={fbUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900">FB</a>
      <a href={liUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900">LI</a>
      <button onClick={handleCopy} className="text-slate-500 hover:text-slate-900 text-left">Copy</button>
    </div>
  );
}


