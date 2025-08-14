"use client";

import Link from "next/link";
import { Twitter, Code, Youtube, Instagram, Facebook, Linkedin } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 mt-8 w-full overflow-hidden pt-16 pb-8">
      <style jsx global>{`
        .glass {
          backdrop-filter: blur(3px) saturate(180%);
          background: radial-gradient(circle, #fff9 0%, #ffdce64d 60%, #f9f2f4 100%);
          border: 1px solid #ff96b41a;
          justify-content: center;
          align-items: center;
          transition: all .3s;
          display: flex;
        }
        .glass:where(.dark, .dark *) {
          display: flex;
          backdrop-filter: blur(2px) !important;
          background: radial-gradient(circle, #ffffff1a 0%, #1e00001a 60%, #2a0e0e 100%) !important;
          border: 1px solid #ffffff0d !important;
          border-radius: 16px !important;
          justify-content: center !important;
          align-items: center !important;
        }
      `}</style>
      <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-full w-full -translate-x-1/2 select-none">
        <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-rose-600/20 blur-3xl"></div>
        <div className="absolute right-1/4 -bottom-24 h-80 w-80 rounded-full bg-rose-600/20 blur-3xl"></div>
      </div>
      <div className="glass relative mx-auto flex max-w-6xl flex-col items-center gap-8 rounded-2xl px-6 py-10 md:flex-row md:items-start md:justify-between md:gap-12">
        <div className="flex flex-col items-center md:items-start">
          <Link href="#" className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-rose-700 text-2xl font-extrabold text-white shadow-md">
              BS
            </span>
            <span className="bg-gradient-to-br from-rose-200 to-rose-500 bg-clip-text text-xl font-semibold tracking-tight text-transparent">
              Behavior School
            </span>
          </Link>
          <p className="text-foreground mb-6 max-w-xs text-center text-sm md:text-left">
            BehaviorStudyTools.com is a product of Behavior School LLC.
          </p>
          <div className="mt-2 flex gap-3 text-rose-400">
            <a href="https://x.com/behavior_school" aria-label="X" className="hover:text-foreground transition" target="_blank" rel="noopener noreferrer">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://bsky.app/profile/behaviorschool.bsky.social" aria-label="Bluesky" className="hover:text-foreground transition" target="_blank" rel="noopener noreferrer">
              <Code className="h-5 w-5" />
            </a>
            <a href="https://www.youtube.com/@BehaviorSchool" aria-label="YouTube" className="hover:text-foreground transition" target="_blank" rel="noopener noreferrer">
              <Youtube className="h-5 w-5" />
            </a>
            <a href="https://www.instagram.com/behaviorschool" aria-label="Instagram" className="hover:text-foreground transition" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61564836345571" aria-label="Facebook" className="hover:text-foreground transition" target="_blank" rel="noopener noreferrer">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://www.linkedin.com/company/behavior-school/" aria-label="LinkedIn" className="hover:text-foreground transition" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
        <nav className="flex w-full flex-col gap-9 text-center md:w-auto md:flex-row md:justify-end md:text-left">
          <div>
            <div className="mb-3 text-xs font-semibold tracking-widest text-rose-400 uppercase">Product</div>
            <ul className="space-y-2 text-foreground/70">
              <li><Link href="/study">Study Tools</Link></li>
              <li><Link href="/supervisors">Supervision</Link></li>
              <li><Link href="/products">All Products</Link></li>
              <li><Link href="/resources">Resources</Link></li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-xs font-semibold tracking-widest text-rose-400 uppercase">Company</div>
            <ul className="space-y-2 text-foreground/70">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/blog">Blog</Link></li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-xs font-semibold tracking-widest text-rose-400 uppercase">Legal</div>
            <ul className="space-y-2 text-foreground/70">
              <li><a href="https://study.behaviorschool.com/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
              <li><a href="https://study.behaviorschool.com/terms-of-service" target="_blank" rel="noopener noreferrer">Terms of Service</a></li>
              <li><a href="https://study.behaviorschool.com/faq" target="_blank" rel="noopener noreferrer">FAQ</a></li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="text-foreground relative z-10 mt-10 text-center text-xs">
        <span>&copy; {year} Behavior School. All rights reserved.</span>
      </div>
    </footer>
  );
}


