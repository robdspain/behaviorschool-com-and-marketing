import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page Not Found | Behavior School",
  description: "The page you're looking for doesn't exist. Explore our BCBA training, certification prep, and behavior support tools.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-50">
      <div className="text-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-8xl font-bold text-emerald-600 mb-4">404</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-slate-600 mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. Perhaps you&apos;d like to explore our BCBA training resources or certification prep materials?
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/">
                Go Home
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/behavior-study-tools">
                BCBA Resources
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <Link 
              href="/transformation-program" 
              className="p-4 border border-slate-200 rounded-lg hover:border-emerald-300 transition-colors"
            >
              <h3 className="font-semibold text-slate-900">Training Programs</h3>
              <p className="text-sm text-slate-600">BCBA certification and exam prep</p>
            </Link>
            <Link 
              href="/iep-goals" 
              className="p-4 border border-slate-200 rounded-lg hover:border-emerald-300 transition-colors"
            >
              <h3 className="font-semibold text-slate-900">IEP Goals</h3>
              <p className="text-sm text-slate-600">Behavior analysis for schools</p>
            </Link>
            <Link 
              href="/behavior-plans" 
              className="p-4 border border-slate-200 rounded-lg hover:border-emerald-300 transition-colors"
            >
              <h3 className="font-semibold text-slate-900">Behavior Plans</h3>
              <p className="text-sm text-slate-600">Intervention strategies that work</p>
            </Link>
            <Link 
              href="/contact" 
              className="p-4 border border-slate-200 rounded-lg hover:border-emerald-300 transition-colors"
            >
              <h3 className="font-semibold text-slate-900">Get Help</h3>
              <p className="text-sm text-slate-600">Contact our team</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}