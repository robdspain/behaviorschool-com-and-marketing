import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { CheckCircle, FolderOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Download Complete - Thank You! | Behavior School",
  description: "Your free PDF has been downloaded successfully. Find your file and explore more resources at Behavior School.",
  robots: {
    index: false, // Don't index confirmation pages
    follow: false,
  }
};

function DownloadConfirmationContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-emerald-600" />
        </div>

        {/* Main Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Download Complete!
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          Your free <strong>ACT Matrix for Schools Guide</strong> has been downloaded successfully.
        </p>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 mb-8 text-left">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6 text-center">
            <FolderOpen className="w-6 h-6 inline-block mr-2" />
            How to Find Your Downloaded File
          </h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Windows */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3">Windows Users:</h3>
                <ol className="space-y-2 text-blue-800 text-sm">
                  <li>1. Open File Explorer</li>
                  <li>2. Click on &quot;Downloads&quot; in the sidebar</li>
                  <li>3. Look for &quot;ACT-Matrix-for-Schools-Guide.pdf&quot;</li>
                  <li>4. Double-click to open with your PDF reader</li>
                </ol>
              </div>
              
              {/* Mac */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-3">Mac Users:</h3>
                <ol className="space-y-2 text-slate-800 text-sm">
                  <li>1. Open Finder</li>
                  <li>2. Click &quot;Downloads&quot; in the sidebar</li>
                  <li>3. Find &quot;ACT-Matrix-for-Schools-Guide.pdf&quot;</li>
                  <li>4. Double-click to open with Preview</li>
                </ol>
              </div>
            </div>

            {/* Mobile Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Mobile Users:</h3>
              <p className="text-yellow-700 text-sm">
                Check your device&apos;s Downloads folder or notification bar. The file will open in your default PDF viewer.
              </p>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">
            What&apos;s Next?
          </h2>
          <p className="text-emerald-700 mb-4">
            Now that you have your ACT Matrix guide, explore more free resources and tools for school-based behavior analysts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/resources">
                <ArrowRight className="mr-2 w-5 h-5" />
                Explore More Resources
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="/iep-goals">
                Values-Based IEP Goals
              </Link>
            </Button>
          </div>
        </div>

        {/* Return to Homepage */}
        <div className="text-center">
          <Link 
            href="/" 
            className="text-slate-600 hover:text-emerald-600 underline"
          >
            ← Return to Behavior School Homepage
          </Link>
        </div>

        {/* Optional: Email confirmation note */}
        <div className="mt-8 text-sm text-slate-500">
          <p>
            💌 Keep an eye on your inbox! We&apos;ll occasionally share helpful resources and updates for school-based behavior analysts.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DownloadConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DownloadConfirmationContent />
    </Suspense>
  );
}