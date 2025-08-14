import * as React from "react";
import { cn } from "@/lib/utils";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  items: FAQItem[];
}

export function FAQ({ title = "Frequently Asked Questions", items, className, ...props }: FAQProps) {
  return (
    <section className={cn("py-20", className)} {...props}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">{title}</h2>
        </div>
        <div className="grid gap-6 md:gap-8">
          {items.map((item, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{item.question}</h3>
              <p className="text-slate-700 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;