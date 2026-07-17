"use client";

import type { ReactNode } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: ReactNode;
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
            className="rounded-xl border border-slate-200 bg-white px-6 shadow-sm transition-[border-color,box-shadow] duration-300 data-[state=open]:border-[#1f4d3f]/35 data-[state=open]:shadow-md"
          >
            <AccordionTrigger className="min-h-14 py-6 text-left text-lg font-semibold text-[#151917] hover:text-[#1f4d3f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f4d3f]">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="max-w-3xl pb-6 text-base leading-7 text-[#52605b]">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
