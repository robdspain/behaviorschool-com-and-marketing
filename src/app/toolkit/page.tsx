import { Metadata } from "next";
import Link from "next/link";
import { Check, Download, FileText, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "School Behavior Support Toolkit | Behavior School",
  description: "Essential templates, data sheets, and protocols for school-based behavior analysts. Download the free toolkit today.",
};

export default function ToolkitPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative pt-32 pb-20 overflow-hidden bg-[#1F4D3F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800/50 rounded-full text-emerald-100 text-sm font-medium mb-8 border border-emerald-700">
            <Star className="w-4 h-4 fill-emerald-100" />
            <span>New Resource for 2026</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            The School Behavior <br className="hidden sm:block" />
            <span className="text-emerald-400">Support Toolkit</span>
          </h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop reinventing the wheel. Get the essential templates, data collection sheets, and fidelity checklists used by top school-based BCBAs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50 text-lg h-14 px-8">
              Download Toolkit Preview
              <Download className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-emerald-200 text-sm mt-3 sm:mt-0 sm:self-center">
              *Includes 5 Levels of IEP Goals Guide
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What&apos;s Inside the Toolkit?</h2>
            <p className="text-lg text-slate-600">Practical tools designed for the realities of school-based practice.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Data Collection Suite</h3>
              <ul className="space-y-3">
                {["ABC Data Sheets (Checkbox Style)", "Frequency & Duration Trackers", "Interval Recording Templates", "Fidelity Checklists"].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-600">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Compliance & Documentation</h3>
              <ul className="space-y-3">
                {["Session Note Templates", "Supervision Documentation Logs", "Parent Communication Logs", "Incident Report Frameworks"].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-600">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-slate-900 rounded-3xl p-10 lg:p-16 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -ml-32 -mt-32" />
             <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-32 -mb-32" />
             <div className="relative z-10">
               <h2 className="text-3xl font-bold text-white mb-6">Get the Full Operating System</h2>
               <p className="text-slate-300 mb-8 text-lg">
                 The toolkit is just the beginning. Join the Transformation Program to learn how to implement these systems school-wide.
               </p>
               <Link 
                 href="/transformation-program"
                 className="inline-flex items-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all"
               >
                 View Transformation Program
               </Link>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
