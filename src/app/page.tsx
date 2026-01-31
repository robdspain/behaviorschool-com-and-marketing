import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
export const metadata: Metadata = {
  title: "FREE BCBA Exam Prep & School Behavior Tools | Behavior School",
  description:
    "FREE BCBA practice questions, exam prep tools, and school behavior resources. Download free study guides, IEP templates, supervision tools, and training programs for behavior analysts.",
  keywords: "Behavior School, school BCBA, school-based BCBA, behavior analyst in schools, BCBA exam prep, BCBA practice exam, IEP goal writing, behavior intervention plan, BCBA supervision tools, applied behavior analysis schools, school-wide behavior support, MTSS behavior support, behavior school platform",
  alternates: { canonical: "https://behaviorschool.com/" },
  openGraph: {
    type: "website",
    title: "FREE BCBA Exam Prep & School Behavior Tools | Behavior School",
    description:
      "FREE BCBA practice questions, exam prep tools, and school behavior resources. Download free study guides, IEP templates, supervision tools, and training programs for behavior analysts.",
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
    title: "FREE BCBA Exam Prep & School Behavior Tools | Behavior School",
    description:
      "FREE BCBA practice questions, exam prep tools, and school behavior resources. Download free study guides, IEP templates, supervision tools, and training programs for behavior analysts.",
    images: ["/og-image.webp"],
    creator: "@BehaviorSchool",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  other: {
    "google-site-verification": process.env.GOOGLE_SITE_VERIFICATION || "",
  },
};
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, School, Download, Brain } from "lucide-react";
import { Hero } from "@/components/ui/hero";
import { TrustBar } from "@/components/ui/trust-bar";
import { ExternalLinkModal } from "@/components/ui/external-link-modal";
// import { ExitIntentModal } from "@/components/ui/exit-intent-modal";
 

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bs-background,#FAF3E0)]">
      <Hero
        variant="brand"
        eyebrow="Behavior School"
        title="Empowering"
        highlight="School Behavior Support Teams & BCBAs"
        subtitle="The premier Behavior School platform providing tools, training, and community for school-based BCBAs, psychologists, and educators — from BCBA exam prep to supervision systems that work in real classrooms."
        primaryCta={{ href: "/community", label: "Join Our Free Community" }}
      />

      <TrustBar 
        stats={[
          { icon: School, label: "School-Focused", subLabel: "Built for Education" },
          { icon: Brain, label: "Evidence-Based", subLabel: "Grounded in Science" },
          { icon: Users, label: "Community", subLabel: "For School BCBAs" },
          { icon: Download, label: "Practical Tools", subLabel: "Ready for Classrooms" },
        ]}
      />

      <div className="sr-only">
        <h2>About Behavior School</h2>
        <p>
          Behavior School is an online community and toolkit for school-based BCBAs, behavior analysts in schools, and education professionals. We provide BCBA exam prep, BCBA practice exams, supervision tools, IEP goal writing, and behavior intervention plan templates.
        </p>
      </div>

      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">School BCBA Community That Drives Change</h2>
                <p className="text-base sm:text-lg leading-relaxed text-slate-700">
                  We&apos;re not just a resource hub — we&apos;re a network of school-based BCBAs, educators, and leaders committed to building better school-wide behavior support systems.
                </p>
              </div>
              <div className="pt-2">
                <ExternalLinkModal href="https://community.behaviorschool.com" title="Join Our Community" description="You are about to visit our private community on Circle.so. This is where we host discussions, resources, and events.">
                  <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl w-full sm:w-auto min-w-[200px]">
                    Join the School BCBA Community
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </ExternalLinkModal>
              </div>
            </div>
            <div className="relative order-first lg:order-last">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/Community/comein-coffee-people-optimized.webp" 
                  alt="Community collaboration"
                  className="w-full h-auto object-cover"
                  width={584}
                  height={389}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 leading-tight">School BCBA Tools & Resources</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 active:scale-95 flex flex-col h-full relative group">
              <Link href="/behavior-study-tools" className="absolute inset-0 z-0"><span className="sr-only">View BCBA Exam Prep</span></Link>
              <div className="p-4 sm:p-6 flex flex-col h-full pointer-events-none">
                <div className="text-center flex-grow flex flex-col">
                  <Image src="/thumbnails/hero-thumb.webp" alt="Exam Prep" className="w-full h-24 sm:h-32 object-contain mb-3 sm:mb-4" width={128} height={128} />
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 leading-tight">BCBA Exam Prep</h3>
                  <div className="mt-auto pointer-events-auto">
                    <span className="block w-full bg-emerald-600 group-hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">Details</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 active:scale-95 flex flex-col h-full relative group">
              <Link href="/supervisors" className="absolute inset-0 z-0"><span className="sr-only">View Supervision</span></Link>
              <div className="p-4 sm:p-6 flex flex-col h-full pointer-events-none">
                <div className="text-center flex-grow flex flex-col">
                  <Image src="/thumbnails/supervision-thumb.webp" alt="Supervision" className="w-full h-24 sm:h-32 object-contain mb-3 sm:mb-4" width={128} height={128} />
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 leading-tight">BCBA Supervision</h3>
                  <div className="mt-auto pointer-events-auto">
                    <span className="block w-full bg-emerald-600 group-hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">Details</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 active:scale-95 flex flex-col h-full relative group">
              <Link href="/iep-goals" className="absolute inset-0 z-0"><span className="sr-only">View IEP Goals</span></Link>
              <div className="p-4 sm:p-6 flex flex-col h-full pointer-events-none">
                <div className="text-center flex-grow flex flex-col">
                  <Image src="/thumbnails/iep-goal-thumb.webp" alt="IEP Goals" className="w-full h-24 sm:h-32 object-contain mb-3 sm:mb-4" width={128} height={128} />
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 leading-tight">IEP Goal Writer</h3>
                  <div className="mt-auto pointer-events-auto">
                    <span className="block w-full bg-emerald-600 group-hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">Details</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 4 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 active:scale-95 flex flex-col h-full relative group">
              <Link href="/behavior-plans" className="absolute inset-0 z-0"><span className="sr-only">View Behavior Plans</span></Link>
              <div className="p-4 sm:p-6 flex flex-col h-full pointer-events-none">
                <div className="text-center flex-grow flex flex-col">
                  <Image src="/thumbnails/bip-writer-thumb.webp" alt="Behavior Plans" className="w-full h-24 sm:h-32 object-contain mb-3 sm:mb-4" width={128} height={128} />
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 leading-tight">Behavior Plan Writer</h3>
                  <div className="mt-auto pointer-events-auto">
                    <span className="block w-full bg-emerald-600 group-hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">Details</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* No popup on homepage - irritating for visitors */}
    </div>
  );
}