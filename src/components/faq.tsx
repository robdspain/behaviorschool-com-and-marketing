import * as React from "react";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  items?: FAQItem[];
}

const defaultFAQItems: FAQItem[] = [
  {
    question: "What is the best BCBA software for schools?",
    answer: "BehaviorPilot is designed specifically for school-based BCBAs, combining functional behavior assessment (FBA) tools, behavior intervention plan (BIP) templates, and real-time data collection in one secure platform."
  },
  {
    question: "Can BehaviorPilot help create FBAs and BIPs faster?",
    answer: "Yes. Our AI-assisted workflow guides you through every step of the FBA and BIP process, helping you produce district-compliant documents in a fraction of the usual time."
  },
  {
    question: "Does BehaviorPilot support FERPA and HIPAA compliance?",
    answer: "Absolutely. BehaviorPilot follows strict FERPA and HIPAA data handling standards, ensuring all student and staff information is secure and private."
  },
  {
    question: "Can I monitor intervention fidelity with BehaviorPilot?",
    answer: "Yes. BehaviorPilot includes fidelity checklists and tracking dashboards so you can ensure interventions are implemented consistently across teams."
  }
];

export function FAQ({ 
  title = "Frequently Asked Questions", 
  items = defaultFAQItems,
  className,
  ...props 
}: FAQProps) {
  return (
    <Section className={cn("bg-background", className)} {...props}>
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 max-w-4xl mx-auto">
          {items.map((item, index) => (
            <Card key={index} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-left">
                  {item.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {item.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default FAQ;