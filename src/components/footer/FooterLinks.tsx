import Link from "next/link";

export function FooterLinks() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-slate-600">
      <Link href="/products" className="hover:text-slate-900">Tools</Link>
      <Link href="/resources" className="hover:text-slate-900">Resources</Link>
      <Link href="/blog" className="hover:text-slate-900">Blog</Link>
      <Link href="/about" className="hover:text-slate-900">About</Link>
      <Link href="/contact" className="hover:text-slate-900">Contact</Link>
      <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
      <Link href="/terms" className="hover:text-slate-900">Terms</Link>
    </div>
  );
}


