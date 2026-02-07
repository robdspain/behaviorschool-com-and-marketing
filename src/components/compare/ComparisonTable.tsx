'use client';

import { CheckCircle, XCircle, Minus } from 'lucide-react';

export type FeatureValue = true | false | string | 'partial';

export interface ComparisonFeature {
  category: string;
  features: {
    name: string;
    behaviorSchool: FeatureValue;
    competitor: FeatureValue;
  }[];
}

function renderValue(value: FeatureValue) {
  if (value === true) return <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto" />;
  if (value === false) return <XCircle className="w-5 h-5 text-red-400 mx-auto" />;
  if (value === 'partial') return <Minus className="w-5 h-5 text-amber-500 mx-auto" />;
  return <span className="text-sm text-slate-700">{value}</span>;
}

export function ComparisonTable({
  competitorName,
  features,
}: {
  competitorName: string;
  features: ComparisonFeature[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50">
            <th className="text-left py-4 px-4 sm:px-6 font-semibold text-slate-700 w-1/2">Feature</th>
            <th className="text-center py-4 px-4 sm:px-6 font-bold text-emerald-700 w-1/4">
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs uppercase tracking-wider text-emerald-600">✨ Recommended</span>
                <span>BehaviorSchool</span>
              </div>
            </th>
            <th className="text-center py-4 px-4 sm:px-6 font-semibold text-slate-600 w-1/4">{competitorName}</th>
          </tr>
        </thead>
        <tbody>
          {features.map((category) => (
            <>
              <tr key={category.category}>
                <td colSpan={3} className="bg-emerald-50/50 py-3 px-4 sm:px-6 font-bold text-emerald-900 text-sm uppercase tracking-wider border-t-2 border-emerald-100">
                  {category.category}
                </td>
              </tr>
              {category.features.map((feature, idx) => (
                <tr key={`${category.category}-${idx}`} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 sm:px-6 text-slate-700 text-sm sm:text-base">{feature.name}</td>
                  <td className="py-3 px-4 sm:px-6 text-center bg-emerald-50/30">{renderValue(feature.behaviorSchool)}</td>
                  <td className="py-3 px-4 sm:px-6 text-center">{renderValue(feature.competitor)}</td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
