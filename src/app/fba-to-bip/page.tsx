import type { Metadata } from "next";
import { FBAToBIPWizard } from "@/components/fba-to-bip/FBAToBIPWizard";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ShareButtons } from "@/components/ui/share-buttons";
import { ProTrialCTA } from "@/components/ui/ProTrialCTA";

const baseUrl = "https://behaviorschool.com";
const pageUrl = `${baseUrl}/fba-to-bip`;

const faqItems = [
  {
    question: "What is an FBA-to-BIP generator?",
    answer:
      "It takes the data from a Functional Behavior Assessment (FBA) — target behaviors, antecedents, consequences, and the function of behavior — and generates a complete Behavior Intervention Plan (BIP) with evidence-based strategies tailored to the identified function.",
  },
  {
    question: "Who is this tool designed for?",
    answer:
      "School-based BCBAs, special educators, behavior specialists, school psychologists, and any team member responsible for writing BIPs based on FBA data.",
  },
  {
    question: "How does it generate strategies without AI?",
    answer:
      "The tool uses a comprehensive rules-based system built on ABA research and best practices. Strategies are selected and matched based on the function of behavior, identified antecedents, and the student's individual context.",
  },
  {
    question: "Can I use the output in an IEP or team meeting?",
    answer:
      "Yes. The BIP is designed to be copy-ready and professional. You can print it, save as PDF, or copy the text directly. Always review and customize the output with your team before finalizing.",
  },
  {
    question: "Is it free to use?",
    answer:
      "Yes. The generator is completely free. We ask for an email to deliver your BIP, and we'll send occasional behavior support tips you can unsubscribe from anytime.",
  },
  {
    question: "Does it include a crisis plan?",
    answer:
      "Yes, if you indicate safety concerns during the FBA data entry, the generator automatically includes a crisis/safety plan section with step-by-step response procedures.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "FBA to BIP Generator",
      description:
        "Free FBA-to-BIP generator that turns Functional Behavior Assessment data into a complete, evidence-based Behavior Intervention Plan with antecedent strategies, teaching strategies, reinforcement, data collection, and more.",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      url: pageUrl,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      provider: {
        "@type": "Organization",
        name: "Behavior School",
        url: baseUrl,
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

export const metadata: Metadata = {
  title: "FBA to BIP Generator - Free Tool | Behavior School",
  description:
    "Free FBA-to-BIP generator for BCBAs and educators. Enter FBA data and get a complete, evidence-based Behavior Intervention Plan in minutes. Start free today!",
  keywords: [
    "FBA to BIP generator",
    "behavior intervention plan generator",
    "BIP template generator",
    "FBA to BIP",
    "behavior intervention plan",
    "BIP generator",
    "BCBA tools",
    "behavior plan template",
    "functional behavior assessment",
    "special education tools",
    "school BCBA",
    "behavior support plan",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "FBA to BIP Generator | Free Behavior Intervention Plan Builder",
    description:
      "Turn your FBA data into a complete, evidence-based Behavior Intervention Plan. Free tool for BCBAs and special educators.",
    url: pageUrl,
    images: [
      {
        url: `${baseUrl}/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "FBA to BIP Generator by Behavior School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FBA to BIP Generator | Free Behavior Intervention Plan Builder",
    description:
      "Turn your FBA data into a complete, evidence-based Behavior Intervention Plan. Free tool for BCBAs and special educators.",
    images: [`${baseUrl}/og-image.webp`],
  },
};

import { Metadata } from "next";
import { Check, Brain, FileText, BarChart, Zap, ShieldCheck } from 'lucide-react';
import { FBAToBIPWizard } from "@/components/fba-to-bip/FBAToBIPWizard";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ProTrialCTA } from "@/components/ui/ProTrialCTA";

// ... (metadata and structured data remain the same) ...

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all duration-300">
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 mb-4">
      <Icon className="h-6 w-6 text-emerald-700" />
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
  </div>
);

const Step = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <h4 className="font-semibold text-slate-800">{title}</h4>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  </div>
);


export default function FBAToBIPPage() {
  return (
    <main className="bg-slate-50/70">
      {/* ... (script tag with structured data) ... */}
      
      <div className="container mx-auto px-6 pt-6">
        <Breadcrumbs
          items={[
            { label: "Products", href: "/products" },
            { label: "FBA to BIP Generator" },
          ]}
        />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pb-16 pt-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Info & Value Prop */}
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold border border-emerald-200">
              Free & Instant BIP Generation
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
              Write Less. Intervene More.
            </h1>
            <p className="text-lg text-slate-600">
              Our free FBA-to-BIP Generator transforms your assessment data into a complete, evidence-based Behavior Intervention Plan — so you can get back to what matters most.
            </p>
            
            <div className="space-y-5 rounded-2xl bg-white p-6 border border-slate-200/80 shadow-sm">
              <Step icon={FileText} title="1. Enter Your FBA Data" description="Input target behaviors, function, and antecedents." />
              <Step icon={Brain} title="2. Select Strategies" description="The tool suggests function-matched interventions." />
              <Step icon={BarChart} title="3. Generate & Export" description="Receive a professional, print-ready BIP in seconds." />
            </div>
          </div>

          {/* Right Column: The Wizard */}
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-br from-emerald-200 via-teal-200 to-sky-200 rounded-3xl blur-lg opacity-40"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl shadow-slate-300/40 border border-slate-200">
              <FBAToBIPWizard />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Everything a School BCBA Needs</h2>
            <p className="mt-4 text-lg text-slate-600">
              From data to draft in under 5 minutes, with all the components required for a compliant and effective plan.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={Zap} title="Function-Matched Strategies" description="Interventions are automatically aligned to the identified function—attention, escape, tangible, or sensory." />
            <FeatureCard icon={BarChart} title="Data Collection Plan" description="A complete data collection matrix is generated, including what to measure, how, and when." />
            <FeatureCard icon={FileText} title="Print-Ready Output" description="Export a professional, clean PDF or copy the text directly into your IEP software or district templates." />
            <FeatureCard icon={ShieldCheck} title="Crisis Plan Included" description="Indicate safety concerns and a comprehensive crisis/safety plan section is automatically included." />
            <FeatureCard icon={Brain} title="Replacement Behaviors" description="Clearly define teaching strategies for functionally equivalent replacement behaviors." />
            <FeatureCard icon={Check} title="Comprehensive & Compliant" description="Covers all critical sections: prevention, teaching, reinforcement, response, generalization, and maintenance." />
          </div>
        </div>
      </section>

      <ProTrialCTA source="fba-to-bip" className="py-20" />

      {/* ... (FAQ and Share sections can remain, maybe with some minor style updates if needed) ... */}
    </main>
  );
}
