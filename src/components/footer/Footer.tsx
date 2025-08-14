import Link from "next/link";
import { Twitter, Code, Youtube, Instagram, Facebook, Linkedin } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Social icons */}
        <div className="flex items-center justify-center gap-6 text-slate-500">
          <a href="https://x.com/behavior_school" target="_blank" rel="noopener noreferrer" aria-label="X">
            <Twitter className="h-6 w-6" />
          </a>
          <a href="https://bsky.app/profile/behaviorschool.bsky.social" target="_blank" rel="noopener noreferrer" aria-label="Bluesky">
            <Code className="h-6 w-6" />
          </a>
          <a href="https://www.youtube.com/@BehaviorSchool" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <Youtube className="h-6 w-6" />
          </a>
          <a href="https://www.instagram.com/behaviorschool" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <Instagram className="h-6 w-6" />
          </a>
          <a href="https://www.facebook.com/profile.php?id=61564836345571" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <Facebook className="h-6 w-6" />
          </a>
          <a href="https://www.linkedin.com/company/behavior-school/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin className="h-6 w-6" />
          </a>
        </div>

        {/* Copyright */}
        <p className="mt-6 text-center text-slate-600">© {year} Behavior School. All rights reserved.</p>
        <p className="mt-2 text-center text-slate-500 text-sm">BehaviorStudyTools.com is a product of Behavior School LLC</p>

        {/* Footer links */}
        <nav className="mt-6 flex flex-wrap items-center justify-center gap-6 text-slate-700">
          <a href="https://study.behaviorschool.com/faq" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900">FAQ</a>
          <a href="https://study.behaviorschool.com/contact" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900">Contact Us</a>
          <a href="https://study.behaviorschool.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900">Privacy Policy</a>
          <a href="https://study.behaviorschool.com/terms-of-service" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900">Terms of Service</a>
          <Link href="/" className="hover:text-slate-900">Behavior School</Link>
          <Link href="/blog" className="hover:text-slate-900">Blog</Link>
        </nav>
      </div>
    </footer>
  );
}


