'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';
import { ComparisonTable, type ComparisonFeature } from './ComparisonTable';
import { ComparisonEmailCapture } from './ComparisonEmailCapture';

interface PricingTier {
  name: string;
  behaviorSchool: string;
  competitor: string;
}

interface ComparisonPageProps {
  heroTitle: string;
  heroSubtitle: string;
  competitorName: string;
  competitorUrl: string;
  competitorDescription: string;
  behaviorSchoolAdvantages: string[];
  features: ComparisonFeature[];
  pricing: PricingTier[];
  verdict: string;
  emailSource: string;
  faqItems: { q: string; a: string }[];
}

export function ComparisonPageLayout({
  heroTitle,
  heroSubtitle,
  competitorName,
  competitorUrl,
  competitorDescription,
  behaviorSchoolAdvantages,
  features,
  pricing,
  verdict,
  emailSource,
  faqItems,
}: ComparisonPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2" itemScope itemType="https://schema.org/BreadcrumbList">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link href="/" itemProp="item" className="hover:text-emerald-600 transition-colors">
                  <span itemProp="name">Home</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              <span>/</span>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span itemProp="name" className="text-slate-700 font-medium">{heroTitle}</span>
                <meta itemProp="position" content="2" />
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-6">
            <Star className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-300 font-medium">2026 Comparison</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {heroTitle}
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            {heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
            >
              Try BehaviorSchool Free <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#comparison"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/20 inline-flex items-center justify-center"
            >
              See Full Comparison
            </a>
          </div>
        </div>
      </section>

      {/* Quick Advantages */}
      <section className="py-12 sm:py-16 bg-emerald-50/50 border-b border-emerald-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-8">
            Why BCBAs Choose BehaviorSchool Over {competitorName}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {behaviorSchoolAdvantages.map((adv, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 text-sm sm:text-base">{adv}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Competitor */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            What is {competitorName}?
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-6">
            {competitorDescription}
          </p>
          <p className="text-slate-600 text-lg leading-relaxed">
            <strong>BehaviorSchool</strong> is an all-in-one platform built specifically for school-based BCBAs and behavior analysts in education. It combines AI-powered exam prep, IEP goal writing tools, behavior plan generators, and professional development — all designed by a practicing school BCBA with 20+ years of experience.
          </p>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section id="comparison" className="py-12 sm:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 text-center">
            Feature-by-Feature Comparison
          </h2>
          <p className="text-slate-500 text-center mb-10">See how BehaviorSchool stacks up against {competitorName}</p>
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <ComparisonTable competitorName={competitorName} features={features} />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 text-center">
            Pricing Comparison
          </h2>
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Plan</th>
                  <th className="text-center py-4 px-6 font-bold text-emerald-700">BehaviorSchool</th>
                  <th className="text-center py-4 px-6 font-semibold text-slate-600">{competitorName}</th>
                </tr>
              </thead>
              <tbody>
                {pricing.map((tier, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                    <td className="py-4 px-6 font-medium text-slate-700">{tier.name}</td>
                    <td className="py-4 px-6 text-center bg-emerald-50/30 font-semibold text-emerald-700">{tier.behaviorSchool}</td>
                    <td className="py-4 px-6 text-center text-slate-600">{tier.competitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">The Verdict</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">{verdict}</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl text-lg"
          >
            Start Free with BehaviorSchool <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Email Capture */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <ComparisonEmailCapture source={emailSource} />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <details key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden group">
                <summary className="px-6 py-4 cursor-pointer font-semibold text-slate-800 hover:text-emerald-700 transition-colors list-none flex items-center justify-between">
                  {item.q}
                  <span className="text-slate-400 group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <div className="px-6 pb-4 text-slate-600">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Other Comparisons */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Other Comparisons</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/compare/behaviorschool-vs-bds" className="px-4 py-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg text-sm font-medium text-slate-600 transition-colors">
              BehaviorSchool vs BDS
            </Link>
            <Link href="/compare/behaviorschool-vs-magicschool" className="px-4 py-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg text-sm font-medium text-slate-600 transition-colors">
              BehaviorSchool vs MagicSchool AI
            </Link>
            <Link href="/compare/behaviorschool-vs-studyaba" className="px-4 py-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg text-sm font-medium text-slate-600 transition-colors">
              BehaviorSchool vs StudyABA
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
