import { glossaryTerms } from "@/data/glossary";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "School Behavior Glossary | Behavior School",
  description: "A comprehensive glossary of terms for school-based BCBAs, special educators, and psychologists. Learn about FBA, BIP, MTSS, and more.",
};

export default function GlossaryPage() {
  const categories = Array.from(new Set(glossaryTerms.map((term) => term.category)));

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-[#1F4D3F] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800/50 rounded-full text-emerald-100 text-sm font-medium mb-6 border border-emerald-700">
            <BookOpen className="w-4 h-4" />
            <span>Behavior Analysis in Education</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            School Behavior Glossary
          </h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Essential terms, definitions, and frameworks for behavior professionals working in educational settings.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12">
            {categories.map((category) => (
              <div key={category} id={category.toLowerCase()}>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg text-sm uppercase tracking-wider">
                    {category}
                  </span>
                </h2>
                <div className="grid gap-6">
                  {glossaryTerms
                    .filter((term) => term.category === category)
                    .map((term) => (
                      <div 
                        key={term.slug}
                        className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow group"
                      >
                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                          {term.term}
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                          {term.definition}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 bg-slate-900 rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Master These Concepts in Practice
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto mb-8">
                Definitions are just the start. Learn how to apply these frameworks in real classrooms with our 8-week Transformation Program.
              </p>
              <Link
                href="/transformation-program"
                className="inline-flex items-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg transition-all"
              >
                View the Program
                <ArrowRight className="ml-2 h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
