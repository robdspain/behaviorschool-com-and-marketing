"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ValueItem {
  label: string;
  value: number;
}

interface ValueStackProps {
  items: ValueItem[];
  totalValue: number;
  price: number;
  paymentPlan?: string;
  guarantee?: string;
  ctaLink: string;
  ctaLabel: string;
}

export function ValueStack({ 
  items, 
  totalValue, 
  price, 
  paymentPlan, 
  guarantee,
  ctaLink,
  ctaLabel 
}: ValueStackProps) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-red-100 overflow-hidden max-w-lg mx-auto">
      <div className="bg-slate-900 p-6 text-center">
        <h3 className="text-xl font-medium text-slate-300 uppercase tracking-wider mb-2">Total Value</h3>
        <div className="text-4xl font-bold text-white decoration-red-500 decoration-4 line-through decoration-double opacity-70">
          ${totalValue.toLocaleString()}
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-4 bg-slate-50/50">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center border-b border-slate-200 pb-3 last:border-0">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-1 rounded-full">
                <Check className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-slate-700 font-medium">{item.label}</span>
            </div>
            <span className="text-slate-500 font-semibold">${item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="p-8 bg-white text-center border-t border-slate-200">
        <div className="text-slate-500 font-medium mb-2">Join Today For Just</div>
        <div className="text-5xl md:text-6xl font-extrabold text-red-600 mb-4 tracking-tight">
          ${price.toLocaleString()}
        </div>
        {paymentPlan && (
          <div className="text-slate-600 font-medium mb-6 bg-slate-100 inline-block px-4 py-1 rounded-full text-sm">
            or {paymentPlan}
          </div>
        )}
        
        <div className="mb-6">
          <Link 
            href={ctaLink}
            className="inline-flex items-center justify-center w-full px-8 py-5 text-xl font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            {ctaLabel}
            <ArrowRight className="ml-2 h-6 w-6" />
          </Link>
        </div>

        {guarantee && (
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            {guarantee}
          </div>
        )}
      </div>
    </div>
  );
}
