import Link from "next/link";
import { Bolt, BarChart3, ShieldCheck, Clock, Layers, BookOpen } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Behavior Analysis Tools & BCBA Training Products | Behavior School",
  description: "Comprehensive suite of behavior analysis tools for schools including BCBA exam prep, virtual supervision platform, and school behavior data management systems. Evidence-based solutions for behavior analysts and educators.",
  keywords: [
    "behavior analysis tools",
    "BCBA training products", 
    "school behavior data tools",
    "virtual BCBA supervision",
    "behavior analyst software",
    "educational behavior management",
    "BCBA exam preparation",
    "RBT supervision platform",
    "school behavior tracking",
    "behavior intervention tools",
    "functional behavior assessment",
    "behavior support software"
  ],
  alternates: { canonical: "/products" },
  openGraph: {
    type: "website",
    title: "Behavior Analysis Tools & BCBA Training Products | Behavior School",
    description: "Comprehensive suite of behavior analysis tools for schools including BCBA exam prep, virtual supervision platform, and school behavior data management systems. Evidence-based solutions for behavior analysts and educators.",
    url: "/products",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Behavior School Products - Comprehensive behavior analysis tools and training for education",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Behavior Analysis Tools & BCBA Training Products | Behavior School",
    description: "Comprehensive suite of behavior analysis tools for schools including BCBA exam prep, virtual supervision platform, and school behavior data management systems. Evidence-based solutions for behavior analysts and educators.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function ProductsPage() {
  return (

      <div className="relative overflow-hidden">
        {/* background accents */}
        <div className="pointer-events-none absolute inset-0 -z-10 select-none">
          <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="absolute -bottom-24 right-1/3 h-80 w-80 rounded-full bg-yellow-300/20 blur-3xl" />
        </div>

        <section className="mx-auto max-w-6xl px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">Behavior Analysis Tools & Training Products</h1>
            <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
              Comprehensive suite of evidence-based behavior analysis tools designed for school-based BCBAs, supervisors, and educational teams. From BCBA exam preparation to virtual supervision platforms and school behavior data management systems.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Study card */}
            <Link href="/study" className="group rounded-2xl">
              <div className="rounded-2xl bg-white/80 ring-1 ring-slate-200/70 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-2 hover:scale-105">
                <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-400 text-white shadow-md group-hover:scale-105 transition-transform" role="img" aria-label="BCBA Study Tools">BS</span>
                  <h2 className="text-2xl font-semibold text-slate-900">BCBA Exam Prep & Study Tools</h2>
                </div>
                <p className="mt-3 text-slate-600">AI-powered BCBA exam preparation with adaptive practice tests, comprehensive study materials, and precision learning designed to help behavior analysts master the BACB certification exam with confidence.</p>
                <div className="mt-5 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-white group-hover:bg-emerald-700 transition-colors">
                  Explore BCBA Prep Tools
                  <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10.293 15.707a1 1 0 010-1.414L13.586 11H5a1 1 0 110-2h8.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"/></svg>
                </div>
                </div>
              </div>
            </Link>

            {/* Supervisors card */}
            <Link href="/supervisors" className="group rounded-2xl">
              <div className="rounded-2xl bg-white/80 ring-1 ring-slate-200/70 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-2 hover:scale-105">
                <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-amber-400 text-white shadow-md group-hover:scale-105 transition-transform" role="img" aria-label="Virtual Supervision Tools">SV</span>
                  <h2 className="text-2xl font-semibold text-slate-900">Virtual BCBA Supervision Platform</h2>
                </div>
                <p className="mt-3 text-slate-600">Comprehensive virtual supervision tools for managing RBT supervision, tracking competencies, maintaining BACB compliance, and streamlining supervision workflows with automated documentation and analytics.</p>
                <div className="mt-5 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-white group-hover:bg-emerald-700 transition-colors">
                  Explore Supervision Tools
                  <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10.293 15.707a1 1 0 010-1.414L13.586 11H5a1 1 0 110-2h8.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"/></svg>
                </div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Highlights similar to feature showcase */}
        <section className="mx-auto max-w-6xl px-6 lg:px-8 pb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">Why Behavior Analysts Choose Our Tools</h2>
            <p className="mt-3 text-slate-600 max-w-3xl mx-auto">Evidence-based behavior analysis tools and workflows designed for real educational environments—fast to adopt, easy to integrate, and proven to improve outcomes.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Bolt, title: "Fast Implementation", desc: "Get started in minutes with opinionated defaults, guided setup, and clear implementation guidance for behavior analysis workflows." },
              { icon: BarChart3, title: "Actionable Behavior Analytics", desc: "Comprehensive dashboards showing student progress, intervention effectiveness, and data-driven insights for behavior support decisions." },
              { icon: ShieldCheck, title: "BACB Audit‑Ready Documentation", desc: "Defensible documentation, digital signatures, and compliance tracking that meets all BACB supervision and certification requirements." },
              { icon: Clock, title: "Time‑Saving Automation", desc: "Smart automations reduce administrative busywork so behavior analysts and school teams can focus on student outcomes and intervention quality." },
              { icon: Layers, title: "Flexible & Scalable", desc: "Works seamlessly across school districts, behavior programs, and varying caseload sizes with customizable workflows and integrations." },
              { icon: BookOpen, title: "Evidence‑Based Practice", desc: "Grounded in applied behavior analysis research and field‑tested in K-12 schools by experienced BCBAs and educational professionals." },
            ].map((f) => (
              <div
                key={f.title}
                className="group relative rounded-2xl bg-white/80 ring-1 ring-slate-200/70 p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_-20px_rgba(0,0,0,0.35)] hover:scale-105"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-400/5 text-emerald-700">
                  <f.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-1 text-slate-600">{f.desc}</p>
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "radial-gradient(120% 60% at 50% 0%, rgba(16,185,129,0.10) 0%, transparent 60%)" }} />
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900">Behavior Analysis Tools FAQs</h2>
              <p className="text-lg text-slate-600 mt-4">
                Common questions about our behavior analysis tools, BCBA training products, and supervision platforms
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="faq1" className="bg-slate-50 rounded-lg px-6 border-0 shadow-sm">
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-emerald-600">
                  What behavior analysis tools does Behavior School offer for educational settings?
                </AccordionTrigger>
                <AccordionContent className="text-slate-700 pt-2">
                  Behavior School offers a comprehensive suite of behavior analysis tools specifically designed for K-12 educational environments. Our products include AI-powered BCBA exam prep with adaptive practice tests, virtual supervision platforms for managing RBT supervision and BACB compliance, and school behavior data management systems with functional behavior assessment templates and intervention tracking. All tools are evidence-based and field-tested by experienced school-based BCBAs.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="faq2" className="bg-slate-50 rounded-lg px-6 border-0 shadow-sm">
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-emerald-600">
                  How do your BCBA training products support both exam preparation and continuing education?
                </AccordionTrigger>
                <AccordionContent className="text-slate-700 pt-2">
                  Our BCBA training products provide comprehensive support for both initial certification and ongoing professional development. The AI-powered exam prep platform includes adaptive practice tests covering all BACB task list items, detailed explanations, and personalized study plans. For continuing education, we offer professional development modules, supervision training resources, and community forums that can count toward BACB continuing education requirements while keeping behavior analysts current with best practices.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq3" className="bg-slate-50 rounded-lg px-6 border-0 shadow-sm">
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-emerald-600">
                  Can your behavior analysis tools integrate with existing school data systems and IEP platforms?
                </AccordionTrigger>
                <AccordionContent className="text-slate-700 pt-2">
                  Yes! Our behavior analysis tools are designed to complement and integrate with existing school data systems, student information systems (SIS), and IEP platforms. We provide export capabilities for seamless data transfer, API integrations where available, and documentation formats that align with special education requirements. Our tools maintain FERPA compliance while enhancing existing workflows rather than replacing them entirely.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq4" className="bg-slate-50 rounded-lg px-6 border-0 shadow-sm">
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-emerald-600">
                  What makes your virtual BCBA supervision platform different from other supervision tools?
                </AccordionTrigger>
                <AccordionContent className="text-slate-700 pt-2">
                  Our virtual BCBA supervision platform is specifically designed by experienced behavior analysts for modern supervision needs. Unlike generic supervision software, our platform includes BACB-compliant competency tracking, automated supervision hour documentation, integrated video conferencing, and evidence-based supervision workflows. The system provides real-time analytics, automated reminders, and audit-ready documentation that meets all BACB requirements while streamlining the supervision process for both supervisors and supervisees.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq5" className="bg-slate-50 rounded-lg px-6 border-0 shadow-sm">
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-emerald-600">
                  Do you offer training and support for implementing behavior analysis tools in schools?
                </AccordionTrigger>
                <AccordionContent className="text-slate-700 pt-2">
                  Absolutely! We provide comprehensive training and implementation support for all our behavior analysis tools. This includes onboarding sessions, best practices workshops, ongoing technical support, and access to our professional community of school-based BCBAs. We also offer customized training programs for school districts and behavior teams to ensure successful adoption and maximum impact on student outcomes. Our support team understands the unique challenges of implementing behavior analysis tools in educational settings.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq6" className="bg-slate-50 rounded-lg px-6 border-0 shadow-sm">
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-emerald-600">
                  Are your behavior analysis tools suitable for both individual practitioners and large school districts?
                </AccordionTrigger>
                <AccordionContent className="text-slate-700 pt-2">
                  Yes, our behavior analysis tools are designed to scale from individual BCBA practitioners to large school districts with hundreds of users. We offer flexible pricing models, customizable workflows, and enterprise-level features including user management, data security, and integration capabilities. Whether you're a solo practitioner managing a small caseload or a district-level behavior team supporting multiple schools, our tools adapt to your specific needs and organizational structure.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Transform Your Behavior Analysis Practice?</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Join thousands of behavior analysts who are already using our evidence-based tools to improve student outcomes and streamline their practice.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link 
                href="/study" 
                className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
              >
                Start BCBA Exam Prep
                <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.293 15.707a1 1 0 010-1.414L13.586 11H5a1 1 0 110-2h8.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"/>
                </svg>
              </Link>
              <Link 
                href="/supervisors" 
                className="inline-flex items-center px-6 py-3 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold rounded-lg transition-colors"
              >
                Explore Supervision Tools
                <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.293 15.707a1 1 0 010-1.414L13.586 11H5a1 1 0 110-2h8.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"/>
                </svg>
              </Link>
              <Link 
                href="/" 
                className="inline-flex items-center px-6 py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded-lg transition-colors"
              >
                Learn More
                <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.293 15.707a1 1 0 010-1.414L13.586 11H5a1 1 0 110-2h8.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Behavior Analysis Tools & BCBA Training Products | Behavior School",
            url: `${process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com"}/products`,
            description: "Comprehensive suite of behavior analysis tools for schools including BCBA exam prep, virtual supervision platform, and school behavior data management systems. Evidence-based solutions for behavior analysts and educators.",
            isPartOf: { 
              "@type": "WebSite", 
              url: process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com", 
              name: "Behavior School" 
            },
            mainEntity: {
              "@type": "ItemList",
              name: "Behavior Analysis Tools and Training Products",
              description: "Comprehensive suite of behavior analysis tools and training for education",
              itemListElement: [
                {
                  "@type": "Product",
                  name: "BCBA Exam Prep Tools",
                  description: "AI-powered BCBA exam preparation with adaptive practice tests",
                  url: `${process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com"}/study`
                },
                {
                  "@type": "Product", 
                  name: "Virtual BCBA Supervision Platform",
                  description: "Comprehensive virtual supervision tools for behavior analysts",
                  url: `${process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com"}/supervisors`
                }
              ]
            }
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Products",
                item: `${process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com"}/products`,
              },
            ],
          })}
        </script>
             </div>
   );
 }


