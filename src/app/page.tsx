import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Behavior School — Lead with confidence, reduce overwhelm",
  description:
    "Evidence-based strategies for leaders to reduce overwhelm, build sustainable success, and create lasting impact without burnout.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Behavior School — Lead with confidence, reduce overwhelm",
    description:
      "Evidence-based strategies for leaders to reduce overwhelm, build sustainable success, and create lasting impact without burnout.",
    url: "/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Behavior School",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Behavior School — Lead with confidence, reduce overwhelm",
    description:
      "Evidence-based strategies for leaders to reduce overwhelm, build sustainable success, and create lasting impact without burnout.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, TrendingUp, Shield, Target, ArrowRight, BookOpen, Brain, Star, Award, Calendar, Play, Zap } from "lucide-react";
import Footer from "@/components/ui/Footer";
// Removed old Hero component usage
import { Hero } from "@/components/ui/hero";
import { Testimonials } from "@/components/ui/testimonials";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bs-background,#FAF3E0)]">
      <Hero
        variant="light"
        eyebrow="Behavior School"
        title="Lead with"
        highlight="confidence"
        subtitle="We help overwhelmed BCBAs build structured behavior systems for student success."
        
      />

      {/* Features Section */}
      <section className="py-24" style={{ backgroundColor: 'var(--bs-background, #FAF3E0)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Everything you need to lead effectively
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our comprehensive platform provides the tools, insights, and community you need to build sustainable leadership excellence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Confident Decision Making",
                description: "Build clarity and confidence in your leadership decisions with evidence-based frameworks and proven methodologies.",
                color: "emerald"
              },
              {
                icon: Shield,
                title: "Stress Management",
                description: "Learn sustainable strategies to manage complexity, reduce overwhelm, and maintain focus on what matters most.",
                color: "blue"
              },
              {
                icon: TrendingUp,
                title: "Lasting Impact",
                description: "Create meaningful, sustainable change in your organization without sacrificing your well-being or burning out.",
                color: "purple"
              }
            ].map((feature, index) => (
               <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl group cursor-pointer">
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                     feature.color === 'emerald' ? 'from-bs-primary to-emerald-700' :
                     feature.color === 'blue' ? 'from-[#2E4057] to-[#1B263B]' :
                     'from-[#8D6A9F] to-[#6B4E71]'
                  } flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Content from behaviorschool.com */}
      <section className="py-16" style={{ backgroundColor: '#FFF8EA' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Featured Content</h2>
            <Link href="https://behaviorschool.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[var(--bs-primary,#1E3A34)] hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Behavior School Launches AI-Powered BCBA Exam Prep Platform That Works',
                href: 'https://behaviorschool.com',
              },
              {
                title: 'The Science Behind Smart Study',
                href: 'https://behaviorschool.com',
              },
              {
                title: 'Best BCBA Exam Prep: Why AI-Powered Practice Tests Beat Traditional Study Materials',
                href: 'https://behaviorschool.com',
              },
              {
                title: 'Master Your BCBA Exam: The Complete Study Platform That Gets Results',
                href: 'https://behaviorschool.com',
              },
            ].map((item) => (
              <Card key={item.title} className="bg-white border-0 shadow-feature hover:shadow-feature-hover transition-all duration-200 rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <Link href={item.href} target="_blank" rel="noopener noreferrer" className="text-[var(--bs-primary,#1E3A34)] hover:underline">Read →</Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Testimonials
        items={[
          {
            id: 'zach',
            name: 'Zachary Martz',
            company: 'Zmartz Marketing',
            quote: "We’re basically saving $2000 a month. And that doesn’t include all the things that we were able to do in place of all that admin.",
            image: 'https://www.freshbooks.com/media/2024/06/testimonial-us-03-1.png',
          },
          {
            id: 'carolina',
            name: 'Carolina Ramirez Herrera',
            company: 'CHR Collective',
            quote: 'FreshBooks has really helped me to be more efficient throughout the year so that tax time… it’s less stressful.',
            image: 'https://www.freshbooks.com/media/2024/06/testimonial-us-02-1.png',
          },
          {
            id: 'damona',
            name: 'Damona Hoffman',
            company: 'Dear Mrs D, Inc.',
            quote: 'FreshBooks has really helped me to be more efficient throughout the year so that tax time… it’s less stressful.',
            image: 'https://www.freshbooks.com/media/2024/06/testimonial-us-01-1.png',
          },
        ]}
      />

      {/* How It Works */}
       <section className="py-24" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-100 text-emerald-800 rounded-full px-4 py-2">
              Proven Methodology
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              How our approach works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Built on behavior analytic principles and backed by research, our systematic approach delivers measurable results.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                icon: BookOpen,
                title: "Evidence-Based Foundation",
                description: "Start with scientifically-proven strategies grounded in behavioral research and real-world application."
              },
              {
                step: "02", 
                icon: Award,
                title: "Personalized Implementation",
                description: "Apply frameworks tailored to your specific leadership challenges and organizational context."
              },
              {
                step: "03",
                icon: Brain,
                title: "Sustainable Growth",
                description: "Build lasting habits and systems that create continuous improvement without overwhelming your team."
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-emerald-200 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section (light) */}
       <section className="py-24 relative overflow-hidden bg-gradient-to-br from-emerald-50 to-white">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Ready to transform your leadership?
          </h2>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            Join thousands of leaders who have already started their journey to sustainable excellence. Get started today with our free resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="h-14 px-10 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-xl"
            >
              <Link href="/subscribe">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 px-10 text-lg font-semibold border-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl"
            >
              <Link href="/resources">
                <Calendar className="mr-2 h-5 w-5" />
                Explore Resources
              </Link>
            </Button>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Structured data (WebPage + Breadcrumbs) */}
      {(() => {
        const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com";
        const webPageJsonLd = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Behavior School — Lead with confidence, reduce overwhelm",
          url: SITE_URL,
          description:
            "Evidence-based strategies for leaders to reduce overwhelm, build sustainable success, and create lasting impact without burnout.",
          isPartOf: { "@type": "WebSite", url: SITE_URL, name: "Behavior School" },
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
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
          </>
        );
      })()}

      <Footer />
    </div>
  );
}