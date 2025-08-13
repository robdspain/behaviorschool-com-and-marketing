import Link from "next/link";
import { FooterLinks } from "./FooterLinks";
import { SubscribeCTA } from "./SubscribeCTA";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-col gap-2">
            <Link href="/" className="text-xl font-bold text-slate-900">
              Behavior School
            </Link>
            <p className="text-slate-600">
              Lead with confidence. Reduce overwhelm. Create lasting change.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <FooterLinks />
            <SubscribeCTA />
          </div>
        </div>
        <div className="mt-6 border-t border-slate-200 pt-4">
          <p className="text-slate-500 text-sm text-center">
            © {new Date().getFullYear()} Behavior School. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}


