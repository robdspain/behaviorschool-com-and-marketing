import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Linkedin, Twitter, ExternalLink, Award, GraduationCap, Briefcase, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Rob Spain, M.S., BCBA, IBA | Board Certified Behavior Analyst & Founder",
  description: "Rob Spain is a Board Certified Behavior Analyst with 14+ years experience, founder of Behavior School, President of CalABA's BAE SIG, and Adjunct Faculty at Fresno Pacific University specializing in school-based ABA.",
  keywords: [
    "Rob Spain BCBA",
    "Board Certified Behavior Analyst",
    "school based behavior analyst",
    "Behavior School founder",
    "CalABA BAE SIG President",
    "BCBA credential 1-11-9398",
    "International Behavior Analyst IBA",
    "behavior intervention specialist",
    "ABA in schools expert",
    "functional behavior assessment specialist"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Rob Spain, M.S., BCBA, IBA | Board Certified Behavior Analyst",
    description: "14+ years as a school-based behavior analyst. Founder of Behavior School, President of CalABA's BAE SIG, helping educators deliver data-driven behavior supports.",
    type: "profile",
    url: "https://behaviorschool.com/about/rob-spain",
    images: [
      {
        url: "https://behaviorschool.com/optimized/profile-Rob.webp",
        width: 400,
        height: 400,
        alt: "Rob Spain, BCBA, IBA - Board Certified Behavior Analyst"
      }
    ]
  },
  twitter: {
    card: "summary",
    title: "Rob Spain, M.S., BCBA, IBA",
    description: "School-based behavior analyst, founder of Behavior School, President of CalABA's BAE SIG",
    images: ["https://behaviorschool.com/optimized/profile-Rob.webp"],
    creator: "@robspainBCBA"
  },
  alternates: {
    canonical: "https://behaviorschool.com/about/rob-spain"
  }
};

// Enhanced Person schema with complete credentials
const robSpainPersonSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Rob Spain",
  "givenName": "Rob",
  "familyName": "Spain",
  "honorificSuffix": ["M.S.", "BCBA", "IBA"],
  "jobTitle": "Board Certified Behavior Analyst",
  "description": "Rob Spain, M.S., BCBA, IBA, is a school-based behavior analyst and founder of Behavior School, where he builds systems, training, and communities that help educators deliver high-fidelity, data-driven supports. He serves as President of CalABA's Behavior Analysts in Education SIG and as a Behavior Intervention Specialist in a California school district while teaching graduate ABA courses at Fresno Pacific University.",
  "image": "https://behaviorschool.com/optimized/profile-Rob.webp",
  "url": "https://robspain.com",
  "sameAs": [
    "https://www.linkedin.com/in/robspain/",
    "https://x.com/robspainBCBA",
    "https://www.instagram.com/robdspain/",
    "https://www.facebook.com/profile.php?id=61572496964176",
    "https://behaviorschool.com/about",
    "https://behaviorschool.com/about/rob-spain"
  ],
  "alumniOf": [
    {
      "@type": "CollegeOrUniversity",
      "name": "National University",
      "sameAs": "https://www.nu.edu/"
    },
    {
      "@type": "CollegeOrUniversity",
      "name": "Florida Institute of Technology",
      "sameAs": "https://www.fit.edu/"
    }
  ],
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Board Certified Behavior Analyst (BCBA)",
      "credentialCategory": "Professional Certification",
      "recognizedBy": {
        "@type": "Organization",
        "name": "Behavior Analyst Certification Board (BACB)",
        "sameAs": "https://www.bacb.com/"
      },
      "identifier": "1-11-9398"
    },
    {
      "@type": "EducationalOccupationalCredential",
      "name": "International Behavior Analyst (IBA)",
      "credentialCategory": "Professional Certification",
      "recognizedBy": {
        "@type": "Organization",
        "name": "International Behavior Analysis Organization (IBAO)",
        "sameAs": "https://www.ibao.org/"
      },
      "identifier": "103385847"
    },
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Master of Science in Special Education",
      "credentialCategory": "Degree",
      "educationalLevel": "Graduate",
      "recognizedBy": {
        "@type": "CollegeOrUniversity",
        "name": "National University"
      }
    }
  ],
  "memberOf": [
    {
      "@type": "Organization",
      "name": "California Association for Behavior Analysis (CalABA)",
      "sameAs": "https://www.calaba.org/"
    },
    {
      "@type": "Organization",
      "name": "Behavior Analysts in Education SIG",
      "memberOf": {
        "@type": "Organization",
        "name": "California Association for Behavior Analysis"
      }
    }
  ],
  "affiliation": [
    {
      "@type": "Organization",
      "name": "Behavior School LLC",
      "url": "https://behaviorschool.com"
    },
    {
      "@type": "EducationalOrganization",
      "name": "California School District"
    },
    {
      "@type": "CollegeOrUniversity",
      "name": "Fresno Pacific University",
      "sameAs": "https://www.fresno.edu/"
    }
  ],
  "knowsAbout": [
    "Applied Behavior Analysis",
    "School-Based Behavior Support",
    "Functional Behavior Assessment",
    "Behavior Intervention Planning",
    "BCBA Certification and Exam Preparation",
    "IEP Development",
    "PBIS (Positive Behavioral Interventions and Supports)",
    "MTSS (Multi-Tiered System of Supports)",
    "Acceptance and Commitment Therapy (ACT)",
    "Data-Driven Decision Making",
    "Teacher Training and Professional Development",
    "Special Education Law and Compliance"
  ],
  "worksFor": [
    {
      "@type": "Organization",
      "name": "Behavior School LLC",
      "startDate": "2024-04"
    },
    {
      "@type": "EducationalOrganization",
      "name": "California School District",
      "startDate": "2015-03"
    },
    {
      "@type": "CollegeOrUniversity",
      "name": "Fresno Pacific University",
      "startDate": "2014-12"
    }
  ]
};

// ProfilePage schema
const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "dateCreated": "2025-01-02",
  "dateModified": "2025-01-02",
  "mainEntity": {
    "@id": "https://behaviorschool.com/about/rob-spain#person"
  }
};

export default function RobSpainPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(robSpainPersonSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs
          items={[
            { label: "About", href: "/about" },
            { label: "Rob Spain" }
          ]}
        />
      </div>

      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-[300px_1fr] gap-8 md:gap-12 items-start">
            {/* Profile Image & Quick Info */}
            <div className="space-y-6">
              <div className="relative w-64 h-64 md:w-full md:h-auto md:aspect-square mx-auto rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/optimized/profile-Rob.webp"
                  alt="Rob Spain, M.S., BCBA, IBA - Board Certified Behavior Analyst and Founder of Behavior School"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Connect</h3>
                <div className="space-y-3">
                  <a
                    href="https://www.linkedin.com/in/robspain/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-slate-700 hover:text-blue-700 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href="https://x.com/robspainBCBA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                    <span>X (Twitter)</span>
                  </a>
                  <a
                    href="https://robspain.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-slate-700 hover:text-emerald-700 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Personal Website</span>
                  </a>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">At a Glance</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-semibold text-emerald-900">Education Experience</div>
                    <div className="text-slate-700">20+ years in education</div>
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-900">BCBA Experience</div>
                    <div className="text-slate-700">14+ years as BCBA (since 2011)</div>
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-900">Current Roles</div>
                    <div className="text-slate-700">4 organizations</div>
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-900">BCBA Credential</div>
                    <div className="text-slate-700">1-11-9398</div>
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-900">IBA Credential</div>
                    <div className="text-slate-700">103385847</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
                  Rob Spain, M.S., BCBA, IBA
                </h1>
                <p className="text-xl text-slate-600 mb-6">
                  Board Certified Behavior Analyst | Founder of Behavior School | President, CalABA BAE SIG
                </p>

                <div className="prose prose-slate max-w-none">
                  <p className="text-lg leading-relaxed text-slate-700">
                    Rob Spain, M.S., BCBA, IBA, is a school-based behavior analyst and founder of <Link href="/" className="text-emerald-700 hover:text-emerald-800 font-semibold">Behavior School</Link>, where he builds systems, training, and communities that help educators deliver high-fidelity, data-driven supports. He serves as President of CalABA&apos;s Behavior Analysts in Education SIG and as a Behavior Intervention Specialist in a California school district while teaching graduate ABA courses at Fresno Pacific University. His work pairs practical tools with measurable outcomes, reducing repeat intensive services and scaling effective practices across schools.
                  </p>
                </div>
              </div>

              {/* Current Roles */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Briefcase className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Current Positions</h2>
                </div>
                <div className="space-y-4">
                  <div className="border-l-4 border-emerald-500 pl-4">
                    <h3 className="font-semibold text-slate-900">Founder</h3>
                    <p className="text-slate-600">Behavior School</p>
                    <p className="text-sm text-slate-500">April 2024 – Present</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-slate-900">President</h3>
                    <p className="text-slate-600">Behavior Analysts in Education (BAE) SIG, CalABA</p>
                    <p className="text-sm text-slate-500">October 2022 – Present</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-slate-900">Behavior Intervention Specialist</h3>
                    <p className="text-slate-600">California School District</p>
                    <p className="text-sm text-slate-500">March 2015 – Present</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h3 className="font-semibold text-slate-900">Adjunct Faculty</h3>
                    <p className="text-slate-600">Fresno Pacific University</p>
                    <p className="text-sm text-slate-500">December 2014 – Present</p>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Certifications & Credentials</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                    <Award className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-900">Board Certified Behavior Analyst (BCBA)</h3>
                      <p className="text-slate-600">Behavior Analyst Certification Board (BACB)</p>
                      <p className="text-sm text-slate-500">Credential ID: 1-11-9398 | Issued: September 2011</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                    <Award className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-slate-900">International Behavior Analyst (IBA®)</h3>
                      <p className="text-slate-600">International Behavior Analysis Organization (IBAO)</p>
                      <p className="text-sm text-slate-500">Credential ID: 103385847 | Issued: May 2024 | Expires: May 2026</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Education</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">Master of Science in Special Education</h3>
                    <p className="text-slate-600">National University</p>
                    <p className="text-sm text-slate-500">2002 – 2005</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">BCBA Graduate Coursework, Behavior Analysis</h3>
                    <p className="text-slate-600">Florida Institute of Technology</p>
                    <p className="text-sm text-slate-500">2009 – 2010</p>
                  </div>
                </div>
              </div>

              {/* Presentations & Impact */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Presentations & Impact</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Conference Presentations</h3>
                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                      <p className="font-medium text-slate-900">&ldquo;BCBAs in PBIS: How to support all levels, systemically&rdquo;</p>
                      <p className="text-slate-600">California PBIS Conference 2025</p>
                      <p className="text-sm text-slate-500">Co-presenters: Megan Caluza & Katie Turner, Ed.D., BCBA</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">District-Level Impact</h3>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <span>Built district-wide behavior analytic team supporting 100+ intensive-needs students annually</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <span>Achieved {"<"}5% repeat intensive services rate after plan generalization</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <span>Leads CalABA BAE SIG executive board, CEU programming, resource library, and professional partnerships</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Behavior School Platform</h3>
                    <p className="text-slate-700">
                      Founded BehaviorSchool.com to provide community support, supervision tools, webinars/workshops covering functional assessment, ACT, MTSS, data systems, and comprehensive practitioner resources for school-based behavior professionals.
                    </p>
                  </div>
                </div>
              </div>

              {/* Areas of Expertise */}
              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Areas of Expertise</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "School-Based Applied Behavior Analysis",
                    "Functional Behavior Assessment (FBA)",
                    "Behavior Intervention Planning (BIP)",
                    "PBIS Implementation",
                    "Multi-Tiered System of Supports (MTSS)",
                    "IEP Development & Compliance",
                    "BCBA Exam Preparation",
                    "Acceptance and Commitment Therapy (ACT)",
                    "Data-Driven Decision Making",
                    "Teacher Training & Coaching",
                    "System-Level Behavior Support",
                    "Special Education Law"
                  ].map((expertise, index) => (
                    <div key={index} className="flex items-center gap-2 text-slate-700">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                      <span>{expertise}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl p-8 text-center text-white">
                <h2 className="text-2xl font-bold mb-4">Work with Rob</h2>
                <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
                  Access Rob&apos;s training programs, supervision tools, and BCBA exam prep resources through Behavior School.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-slate-100">
                    <Link href="/behavior-study-tools">
                      Explore Study Tools
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-emerald-600">
                    <Link href="/community">
                      Join Community
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
