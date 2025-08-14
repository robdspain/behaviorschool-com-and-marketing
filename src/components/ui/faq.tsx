"use client"

import * as React from "react"
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  title?: string
  items: FAQItem[]
  className?: string
}

export function FAQ({ title = "Frequently Asked Questions", items, className }: FAQProps) {
  return (
    <section className={cn("py-20", className)}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">{title}</h2>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {items.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-slate-200 rounded-lg px-6 py-2 bg-white shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-emerald-600 text-lg">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-700 text-base leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}