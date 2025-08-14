"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  FileText, 
  BarChart3, 
  Users, 
  Clock, 
  Shield,
  BookOpen,
  Target,
  TrendingUp,
  Award,
  Zap,
  Database
} from "lucide-react";

export default function BehaviorPilotPage() {
  const features = [
    {
      icon: FileText,
      title: "FBA & BIP Templates",
      description: "Pre-built templates for Functional Behavior Assessments and Behavior Intervention Plans that meet compliance standards."
    },
    {
      icon: BarChart3,
      title: "Real-time Data Collection",
      description: "Streamlined data collection tools for tracking behavior frequency, duration, and intensity with automated reporting."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share assessments and intervention plans with teachers, parents, and administrators in real-time."
    },
    {
      icon: Clock,
      title: "Time-Saving Automation",
      description: "Auto-generate reports and documentation, reducing paperwork by up to 75% for busy School-Based BCBAs."
    },
    {
      icon: Shield,
      title: "Compliance Ready",
      description: "Built-in compliance checks ensure all documentation meets state and federal special education requirements."
    },
    {
      icon: Target,
      title: "Fidelity Monitoring",
      description: "Track intervention implementation fidelity with built-in monitoring tools and alerts."
    }
  ];

  const comparisonData = [
    {
      feature: "FBA Template Creation",
      paper: "Manual writing (2-4 hours)",
      excel: "Basic templates (1-2 hours)", 
      behaviorpilot: "AI-assisted generation (15 minutes)",
      highlight: true
    },
    {
      feature: "Data Collection",
      paper: "Paper forms, manual entry",
      excel: "Spreadsheet tracking",
      behaviorpilot: "Real-time mobile collection",
      highlight: true
    },
    {
      feature: "Report Generation",
      paper: "Manual compilation (3-5 hours)",
      excel: "Basic charts (1-2 hours)",
      behaviorpilot: "Automated reports (5 minutes)",
      highlight: true
    },
    {
      feature: "Team Collaboration",
      paper: "Email/print sharing",
      excel: "File sharing",
      behaviorpilot: "Real-time collaboration",
      highlight: false
    },
    {
      feature: "Compliance Tracking",
      paper: "Manual checklist",
      excel: "Custom tracking",
      behaviorpilot: "Built-in compliance alerts",
      highlight: false
    },
    {
      feature: "Fidelity Monitoring",
      paper: "Paper checklists",
      excel: "Basic tracking",
      behaviorpilot: "Automated fidelity checks",
      highlight: false
    }
  ];

  const faqs = [
    {
      question: "What is the best BCBA software for schools?",
      answer: "BehaviorPilot is specifically designed for School-Based BCBAs, offering comprehensive FBA and BIP tools, real-time data collection, and seamless integration with school systems. Unlike generic behavior tracking apps, BehaviorPilot understands the unique needs of school-based behavior analysis and special education compliance requirements."
    },
    {
      question: "How to create a Behavior Intervention Plan fast?",
      answer: "With BehaviorPilot's AI-powered BIP generator, you can create comprehensive Behavior Intervention Plans in under 15 minutes. Our templates are pre-loaded with evidence-based interventions and automatically populate based on your FBA data, ensuring consistency and compliance while dramatically reducing creation time."
    },
    {
      question: "Can BehaviorPilot integrate with our school's existing systems?",
      answer: "Yes! BehaviorPilot seamlessly integrates with popular school information systems and IEP platforms. Our behavior analyst software is designed to work within existing school workflows, making adoption smooth for both BCBAs and educational teams."
    },
    {
      question: "How does BehaviorPilot ensure data privacy and FERPA compliance?",
      answer: "BehaviorPilot is built with student privacy as a priority. We maintain full FERPA compliance with encrypted data storage, role-based access controls, and comprehensive audit trails. All student behavior data is protected with enterprise-grade security measures."
    },
    {
      question: "What makes BehaviorPilot different from other behavior tracking tools?",
      answer: "BehaviorPilot is the only BCBA data collection tool built specifically for school environments. We combine functional behavior assessment capabilities with intervention planning and fidelity monitoring in one integrated platform. Our focus on School-Based BCBA workflows sets us apart from generic behavior apps."
    },
    {
      question: "Can multiple team members collaborate on behavior plans?",
      answer: "Absolutely! BehaviorPilot's collaboration features allow Behavior Analysts, teachers, administrators, and parents to work together on behavior plans in real-time. Team members can contribute observations, track implementation, and monitor progress from any device."
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "BehaviorPilot",
    "description": "AI-powered BCBA platform for FBAs, BIPs, and school-based data tracking. Create, collect, and report with speed and fidelity.",
    "applicationCategory": "EducationalSoftware",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "provider": {
      "@type": "Organization",
      "name": "Behavior School",
      "url": "https://behaviorschool.com"
    },
    "featureList": [
      "FBA and BIP Templates",
      "Real-time Data Collection", 
      "Team Collaboration",
      "Compliance Ready Documentation",
      "Fidelity Monitoring",
      "Automated Report Generation"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative overflow-hidden">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10 select-none">
        <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />
        <div className="absolute -bottom-24 right-1/3 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 py-16">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 mb-6">
              BehaviorPilot
              <span className="block text-3xl sm:text-4xl text-emerald-600 mt-2">
                BCBA Software for FBAs, BIPs & Data Collection
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              The AI-powered <strong>behavior analyst software</strong> designed for School-Based BCBAs. 
              Create comprehensive FBAs and BIPs, collect real-time data, and ensure fidelity monitoring 
              with the most advanced <strong>BCBA data collection tool</strong> available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Start Free Trial
                <Zap className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="#features" 
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                Learn More
                <BookOpen className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mx-auto max-w-6xl px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Complete School-Based Behavior Analysis Software
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Everything a Behavior Analyst needs for effective <strong>school-based behavior analysis software</strong> 
            implementation, from initial assessment through intervention monitoring.
          </p>
        </div>

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/80 ring-1 ring-slate-200/70 rounded-2xl p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)] hover:shadow-[0_25px_60px_-20px_rgba(0,0,0,0.35)] transition-all duration-300"
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-400/5 text-emerald-700 mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Comparison Table */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Why Choose BehaviorPilot Over Traditional Methods?
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            See how our <strong>behavior intervention plan tool</strong> compares to paper-based methods and basic spreadsheet solutions.
          </p>
        </div>

        <div className="bg-white/80 ring-1 ring-slate-200/70 rounded-2xl overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Feature</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Paper Methods</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Excel/Spreadsheets</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-emerald-700 bg-emerald-50">BehaviorPilot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {comparisonData.map((row, index) => (
                  <tr key={index} className={row.highlight ? "bg-emerald-50/30" : ""}>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{row.feature}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-center">{row.paper}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-center">{row.excel}</td>
                    <td className="px-6 py-4 text-sm font-medium text-emerald-700 text-center">
                      <div className="flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {row.behaviorpilot}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600">
            Common questions about our <strong>functional behavior assessment app</strong> and BCBA tools.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white/80 ring-1 ring-slate-200/70 rounded-2xl p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-3">{faq.question}</h3>
              <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-6xl px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Transform Your Behavior Analysis Practice?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
            Join hundreds of School-Based BCBAs who have streamlined their workflow with BehaviorPilot. 
            Start your free trial today and experience the future of behavior analysis software.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-emerald-600 bg-white rounded-lg hover:bg-emerald-50 transition-colors"
            >
              Start Free Trial
              <Award className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors"
            >
              Schedule Demo
              <Database className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}