"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

export function FAQAccordion({ items, className }: FAQAccordionProps) {
  return (
    <div className={className}>
      <Accordion type="single" collapsible className="w-full space-y-4">
        {items.map((item, index) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            className="border border-slate-200 rounded-xl bg-white px-6 shadow-sm data-[state=open]:border-emerald-500 data-[state=open]:ring-1 data-[state=open]:ring-emerald-500 transition-all duration-200"
          >
            <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:text-emerald-700 py-6">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 pb-6 text-base leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
