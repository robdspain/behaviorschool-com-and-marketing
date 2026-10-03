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
            className="rounded-[12px] border border-[var(--bs-hairline)] bg-[var(--bs-paper)] px-6 transition-colors duration-300 data-[state=open]:border-[#1f4d3f]/35"
          >
            <AccordionTrigger className="min-h-14 py-6 text-left text-lg font-semibold text-[#151917] hover:text-[#1f4d3f] focus-visible:[outline-style:solid] focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#1f4d3f]">
              {item.question}
            </AccordionTrigger>
            <AccordionContent forceMount className="max-w-3xl pb-6 text-base leading-7 text-[#365548]">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
