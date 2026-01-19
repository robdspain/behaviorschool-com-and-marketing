export interface GlossaryTerm {
  term: string;
  definition: string;
  slug: string;
  category: "Assessment" | "Intervention" | "Legal/IEP" | "Framework";
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Functional Behavior Assessment (FBA)",
    slug: "functional-behavior-assessment",
    category: "Assessment",
    definition: "A systematic process for identifying the events that predict and maintain problem behavior. In schools, an FBA is required by IDEA when behavior impedes learning or results in disciplinary changes."
  },
  {
    term: "Behavior Intervention Plan (BIP)",
    slug: "behavior-intervention-plan",
    category: "Intervention",
    definition: "A written plan based on an FBA that describes interventions, strategies, and supports to address problem behavior and teach replacement skills."
  },
  {
    term: "Individualized Education Program (IEP)",
    slug: "individualized-education-program",
    category: "Legal/IEP",
    definition: "A legal document that lays out the program of special education instruction, supports, and services kids with disabilities need to make progress in school."
  },
  {
    term: "Multi-Tiered System of Supports (MTSS)",
    slug: "mtss",
    category: "Framework",
    definition: "A comprehensive framework used to provide targeted support to struggling students. It focuses on the 'whole child,' covering academic, behavioral, social, and emotional needs."
  },
  {
    term: "Positive Behavioral Interventions and Supports (PBIS)",
    slug: "pbis",
    category: "Framework",
    definition: "An evidence-based three-tiered framework to improve and integrate all of the data, systems, and practices affecting student outcomes every day."
  },
  {
    term: "SMART Goals",
    slug: "smart-goals",
    category: "Legal/IEP",
    definition: "A framework for writing IEP goals that are Specific, Measurable, Achievable, Relevant, and Time-bound."
  },
  {
    term: "Antecedent Intervention",
    slug: "antecedent-intervention",
    category: "Intervention",
    definition: "Strategies implemented before a behavior occurs to reduce the likelihood of the behavior happening. Also known as preventative strategies."
  },
  {
    term: "Replacement Behavior",
    slug: "replacement-behavior",
    category: "Intervention",
    definition: "A safer, more appropriate behavior taught to a student that serves the same function (purpose) as the challenging behavior."
  }
];
