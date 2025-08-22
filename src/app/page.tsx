import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "School BCBAs & Behavior Support Tools | Behavior School",
  description:
    "Tools, training, and community for school-based BCBAs, psychologists, and educators. BCBA exam prep, supervision tools, IEP goal writing, and behavior intervention plans that work in real classrooms.",
  keywords: "school BCBA, school-based BCBA, behavior analyst in schools, BCBA exam prep, BCBA practice exam, IEP goal writing, behavior intervention plan, BCBA supervision tools, applied behavior analysis schools, school-wide behavior support, MTSS behavior support",
  alternates: { canonical: "https://behaviorschool.com/" },
  openGraph: {
    type: "website",
    title: "School BCBAs & Behavior Support Tools | Behavior School",
    description:
      "Tools, training, and community for school-based BCBAs, psychologists, and educators. BCBA exam prep, supervision tools, IEP goal writing, and behavior intervention plans that work in real classrooms.",
    url: "/",
    siteName: "Behavior School",
    locale: "en_US",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Behavior School - Tools and training for school-based BCBAs and behavior analysts in education",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "School BCBAs & Behavior Support Tools | Behavior School",
    description:
      "Tools, training, and community for school-based BCBAs, psychologists, and educators. BCBA exam prep, supervision tools, IEP goal writing, and behavior intervention plans.",
    images: ["/og-image.webp"],
    creator: "@BehaviorSchool",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  other: {
    "google-site-verification": process.env.GOOGLE_SITE_VERIFICATION || "",
  },
};
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/ui/hero";
 

export default function Home() {
  // Testing RSS fallback with updated Netlify environment variables.

  return (
    <div className="min-h-screen bg-[var(--bs-background,#FAF3E0)]">
      <Hero
        variant="brand"
        eyebrow="Behavior School"
        title="Empowering"
        highlight="School BCBAs & Behavior Analysts in Education"
        subtitle="Tools, training, and community to help school-based BCBAs, psychologists, and educators thrive — from BCBA exam prep to supervision systems that work in real classrooms."
        primaryCta={{ href: "/subscribe", label: "Join the School BCBA Community" }}
      />

      {/* AI-Friendly Summary for LLM Indexing */}
      <section className="py-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="sr-only">About Behavior School</h2>
            <p className="text-lg font-medium text-slate-800 leading-relaxed">
              <strong>Behavior School is an online community and toolkit for school-based BCBAs, behavior analysts in schools, and education professionals.</strong> We provide BCBA exam prep, BCBA practice exams, supervision tools, IEP goal writing, and behavior intervention plan templates to help school BCBAs reduce burnout, increase fidelity, and improve student outcomes. Founded by <a href="https://robspain.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 font-semibold">Rob Spain, BCBA</a>, our platform offers AI-powered BCBA study tools, supervision workflows, behavior plan writers, and an 8-week transformation program for school behavior professionals practicing applied behavior analysis in schools.
            </p>
          </div>
        </div>
      </section>

      {/* Section 1 – Join the Community */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Content Column */}
            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">School BCBA Community That Drives Change</h2>
                <p className="text-base sm:text-lg leading-relaxed text-slate-700">
                  We&apos;re not just a resource hub — we&apos;re a network of school-based BCBAs, behavior analysts in schools, educators, and leaders committed to building better school-wide behavior support systems and MTSS behavior support.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-slate-700">
                  <li>Connect with other school BCBAs and behavior analysts</li>
                  <li>Participate in collaborative problem-solving for schools</li>
                  <li>Share proven applied behavior analysis strategies</li>
                  <li>Access resources for functional behavior assessments in schools</li>
                </ul>
              </div>
              <div className="pt-2">
                <Button asChild size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl w-full sm:w-auto min-w-[200px]">
                  <a href="https://community.behaviorschool.com" target="_blank" rel="noopener noreferrer">
                    Join the School BCBA Community
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Image Column */}
            <div className="relative order-first lg:order-last">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/Community/comein-coffee-people.webp" 
                  alt="Come on in - welcoming community space with people collaborating over coffee"
                  className="w-full h-auto object-cover"
                  width="1536"
                  height="1024"
                  loading="lazy"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-emerald-100 rounded-full opacity-60 -z-10"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-slate-100 rounded-full opacity-40 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 leading-tight">School BCBA Tools & Resources</h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              BCBA exam prep, supervision tools, IEP goal writing, and behavior intervention plan templates designed to streamline your school-based practice and improve student outcomes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Product Card 1: Behavior Study Tools */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 active:scale-95 flex flex-col h-full">
              <div className="p-4 sm:p-6 flex flex-col h-full">
                <div className="text-center flex-grow flex flex-col">
                  <img src="/thumbnails/hero-thumb.webp" alt="Behavior Study Tools" className="w-full h-24 sm:h-32 object-contain mb-3 sm:mb-4" width="128" height="128" loading="lazy" />
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 leading-tight">BCBA Exam Prep & Practice Tests</h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4 flex-grow">Master the BCBA exam with AI-powered practice questions and BCBA study materials.</p>
                  <div className="space-y-2 mt-auto">
                    <Link 
                      href="/behavior-study-tools"
                      className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Learn More
                    </Link>
                    <a 
                      href="https://behaviorstudytools.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full border border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Try Free BCBA Practice Test
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Card 2: Supervision Tools */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 active:scale-95 flex flex-col h-full">
              <div className="p-4 sm:p-6 flex flex-col h-full">
                <div className="text-center flex-grow flex flex-col">
                  <img src="/thumbnails/supervision-thumb.webp" alt="Supervision Tools" className="w-full h-24 sm:h-32 object-contain mb-3 sm:mb-4" width="128" height="128" loading="lazy" />
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 leading-tight">BCBA Supervision Tools</h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4 flex-grow">Track BCBA fieldwork hours, competencies, and streamline your supervision practice.</p>
                  <div className="mt-auto">
                    <Link 
                      href="/supervisors"
                      className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Card 3: IEP Goal Writer */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 active:scale-95 flex flex-col h-full">
              <div className="p-4 sm:p-6 flex flex-col h-full">
                <div className="text-center flex-grow flex flex-col">
                  <img src="/thumbnails/iep-goal-thumb.webp" alt="IEP Goal Writer" className="w-full h-24 sm:h-32 object-contain mb-3 sm:mb-4" width="128" height="128" loading="lazy" />
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 leading-tight">IEP Goal Writer</h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4 flex-grow">Write measurable IEP behavior goals and SMART IEP goals for students.</p>
                  <div className="mt-auto">
                    <Link 
                      href="/iep-goals"
                      className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Card 4: Behavior Plan Writer */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 active:scale-95 flex flex-col h-full">
              <div className="p-4 sm:p-6 flex flex-col h-full">
                <div className="text-center flex-grow flex flex-col">
                  <img src="/thumbnails/bip-writer-thumb.webp" alt="Behavior Plan Writer" className="w-full h-24 sm:h-32 object-contain mb-3 sm:mb-4" width="128" height="128" loading="lazy" />
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 leading-tight">Behavior Intervention Plan Writer</h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4 flex-grow">Develop comprehensive behavior intervention plans (BIPs) from functional behavior assessments.</p>
                  <div className="mt-auto">
                    <Link 
                      href="/behavior-plans"
                      className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Operating Systems Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 leading-tight">From School BCBA Burnout and Crisis Management</h2>
            <p className="text-xl sm:text-2xl font-bold text-emerald-600 mb-3 sm:mb-4">↓</p>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">To Confidence, School-Wide Behavior Support, and Ethical Leadership</h3>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              The 8-week transformation program that turns overwhelmed school BCBAs into ethical leaders who master crisis management in schools, build teacher buy-in for behavior plans, and drive measurable change through school-wide behavior systems.
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            {/* Pain Points */}
            <div className="bg-slate-50 rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3 leading-tight">Current Reality</h4>
              <ul className="text-slate-600 space-y-2 text-sm sm:text-base leading-relaxed">
                <li>• Ethical challenges in schools with admin demands</li>
                <li>• Difficulty getting teacher buy-in for behavior plans</li>
                <li>• School BCBA burnout from overwhelming caseloads</li>
                <li>• Constant school behavior crisis management</li>
                <li>• Lack of school-wide behavior support systems</li>
              </ul>
            </div>

            {/* Solution */}
            <div className="bg-slate-50 rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3 leading-tight">Our Solution</h4>
              <ul className="text-slate-600 space-y-2 text-sm sm:text-base leading-relaxed">
                <li>• Ethical leadership framework for school BCBAs</li>
                <li>• Training teachers in behavior support strategies</li>
                <li>• Applied behavior analysis in schools workflows</li>
                <li>• Crisis management in schools protocols</li>
                <li>• MTSS behavior support implementation</li>
              </ul>
            </div>

            {/* Transformation */}
            <div className="bg-slate-50 rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3 leading-tight">Your Future</h4>
              <ul className="text-slate-600 space-y-2 text-sm sm:text-base leading-relaxed">
                <li>• Confident ethical leadership as a school BCBA</li>
                <li>• Engaged teachers implementing behavior plans</li>
                <li>• Streamlined school-wide behavior support</li>
                <li>• Measurable student behavior outcomes</li>
                <li>• District-wide MTSS behavior support impact</li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="space-y-4 sm:space-y-6 text-slate-700 order-2 md:order-1">
              <p className="text-base sm:text-lg font-medium leading-relaxed">
                Stop surviving your role and start transforming your entire district.
              </p>
              <p className="text-base sm:text-lg leading-relaxed">
                This isn&apos;t just another course—it&apos;s a complete operating system that addresses the 6 universal pain points every school BCBA faces, with practical tools, scripts, and systems you can implement immediately. Learn how to conduct functional behavior assessments in schools, write effective behavior intervention plans, and reduce BCBA burnout. Get support from our <Link href="/community" className="text-emerald-600 hover:text-emerald-700 font-medium">school BCBA community</Link> and enhance your skills with our <Link href="/behavior-study-tools" className="text-emerald-600 hover:text-emerald-700 font-medium">BCBA exam prep tools</Link>.
              </p>
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
                <p className="text-emerald-800 font-medium text-sm sm:text-base leading-relaxed">
                  &ldquo;Finally, a program that gets what school BCBAs actually deal with — the ethics conflicts, crisis management, and getting teacher buy-in.&rdquo;
                </p>
              </div>
              <div className="pt-2">
                <Link 
                  href="/transformation-program" 
                  className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold group transition-colors text-sm sm:text-base w-full sm:w-auto justify-center min-w-[280px]"
                >
                  Stop BCBA Burnout - Get the Full Program
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="relative order-1 md:order-2">
              <img 
                src="/OperatingSystem/DD83BB21-6F33-4A94-BF67-311EDDE6D309.webp" 
                alt="Behavior School Operating System"
                className="rounded-xl shadow-lg w-full h-auto"
                width="1536"
                height="1024"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Light CTA simplified is integrated into Section 1 above */}
      
      {/* Comprehensive Structured Data for AI Indexing */}
      {(() => {
        const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com";
        
        const organizationJsonLd = {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Behavior School",
          url: SITE_URL,
          logo: `${SITE_URL}/Logos/logo-gold-transparent.webp`,
          description: "Behavior School is an online community and toolkit for school-based BCBAs, behavior analysts in schools, and education professionals. We provide BCBA exam prep, BCBA practice exams, supervision tools, IEP goal writing, behavior intervention plan templates, and training to help school BCBAs reduce burnout, increase fidelity, and improve student outcomes through applied behavior analysis in schools.",
          founder: {
            "@type": "Person",
            name: "Rob Spain",
            jobTitle: "BCBA, IBA",
            url: "https://robspain.com",
            sameAs: [
              "https://www.linkedin.com/in/robspain/",
              "https://x.com/robspainBCBA",
              "https://www.instagram.com/robdspain/"
            ]
          },
          address: {
            "@type": "PostalAddress",
            addressCountry: "US"
          },
          sameAs: [
            "https://www.linkedin.com/company/behavior-school",
            "https://x.com/behaviorschool"
          ],
          offers: [
            {
              "@type": "Service",
              name: "BCBA Exam Prep & Practice Tests",
              description: "AI-powered BCBA exam preparation, BCBA practice exams, BCBA study materials, and free BCBA practice tests",
              url: `${SITE_URL}/behavior-study-tools`,
              provider: {
                "@type": "Organization",
                name: "Behavior School"
              }
            },
            {
              "@type": "Service", 
              name: "BCBA Supervision Tools",
              description: "Track BCBA fieldwork hours, BCBA supervision log, competency assessments, and supervision workflows",
              url: `${SITE_URL}/supervisors`,
              provider: {
                "@type": "Organization",
                name: "Behavior School"
              }
            },
            {
              "@type": "Service",
              name: "School BCBA Training Program",
              description: "8-week cohort-based program for school BCBAs to reduce burnout, master crisis management in schools, build teacher buy-in for behavior plans, and implement school-wide behavior support systems",
              url: `${SITE_URL}/transformation-program`,
              provider: {
                "@type": "Organization",
                name: "Behavior School"
              }
            },
            {
              "@type": "Service",
              name: "IEP Goal Writing",
              description: "Write measurable IEP goals, behavior IEP goals, and SMART IEP goals for students with autism, ADHD, and behavioral challenges",
              url: `${SITE_URL}/iep-goals`,
              provider: {
                "@type": "Organization",
                name: "Behavior School"
              }
            },
            {
              "@type": "Service",
              name: "Behavior Intervention Plans",
              description: "Behavior intervention plan templates, behavior support plans, and tools to write BIPs from functional behavior assessments in schools",
              url: `${SITE_URL}/behavior-plans`,
              provider: {
                "@type": "Organization",
                name: "Behavior School"
              }
            }
          ]
        } as const;

        const webSiteJsonLd = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Behavior School",
          url: SITE_URL,
          description: "Tools, training, and community for school-based BCBAs, behavior analysts in schools, and education professionals — from BCBA exam prep and functional behavior assessments in schools to supervision tools and behavior intervention plans that work in real classrooms.",
          publisher: {
            "@type": "Organization",
            name: "Behavior School"
          },
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        } as const;

        const webPageJsonLd = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Empowering Behavior Analysts in Education | Behavior School",
          url: SITE_URL,
          description:
            "Tools, training, and community for school-based BCBAs, behavior analysts in schools, and education professionals — from BCBA exam prep and functional behavior assessments in schools to supervision tools, IEP goal writing, and behavior intervention plans that work in real classrooms.",
          isPartOf: { "@type": "WebSite", url: SITE_URL, name: "Behavior School" },
          about: {
            "@type": "Thing",
            name: "School-Based Behavior Analysis",
            description: "Applied behavior analysis in schools, BCBA exam prep, supervision tools, IEP goal writing, behavior intervention plans, and school-wide behavior support systems for school-based BCBAs and behavior analysts in education"
          }
        } as const;

        const breadcrumbJsonLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: SITE_URL,
            },
          ],
        } as const;

        return (
          <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
          </>
        );
      })()}

      {/* Footer rendered by root layout */}
    </div>
  );
}