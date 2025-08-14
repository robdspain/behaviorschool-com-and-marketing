export interface FAQItem {
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    question: "What is the best BCBA software for schools?",
    answer:
      "BehaviorPilot is designed specifically for school-based BCBAs, combining functional behavior assessment (FBA) tools, behavior intervention plan (BIP) templates, and real-time data collection in one secure platform.",
  },
  {
    question: "Can BehaviorPilot help create FBAs and BIPs faster?",
    answer:
      "Yes. Our AI-assisted workflow guides you through every step of the FBA and BIP process, helping you produce district-compliant documents in a fraction of the usual time.",
  },
  {
    question: "Does BehaviorPilot support FERPA and HIPAA compliance?",
    answer:
      "Absolutely. BehaviorPilot follows strict FERPA and HIPAA data handling standards, ensuring all student and staff information is secure and private.",
  },
  {
    question: "Can I monitor intervention fidelity with BehaviorPilot?",
    answer:
      "Yes. BehaviorPilot includes fidelity checklists and tracking dashboards so you can ensure interventions are implemented consistently across teams.",
  },
];