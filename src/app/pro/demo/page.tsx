import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export default function DemoPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f7f5f0] px-4">
      <div className="max-w-lg w-full text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#edf5f0] mb-6">
          <Lock className="w-8 h-8 text-[#1f4d3f]" />
        </div>
        <h1 className="text-3xl font-bold text-[#123628] mb-4">BehaviorSchool Pro demo is invite only</h1>
        <p className="text-lg text-[#59645f] mb-8">
          The commercial FBA/BIP workspace is in development and not open for public demos or
          account creation. Request invite-only access or use the free school-practice tools that
          are live today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/pro/waitlist"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#1f4d3f] text-white font-semibold rounded-lg hover:bg-[#123628] transition-colors"
          >
            Request invite-only access
          </Link>
          <Link
            href="/pro"
            className="inline-flex items-center gap-2 text-[#1f4d3f] hover:text-[#123628] font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pro preview
          </Link>
        </div>
      </div>
    </main>
  );
}
