import * as React from "react";
import type { Metadata } from "next";
import Container from "@/components/container";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Join the Behavior School Community | Support for School-Based BCBAs",
  description: "Connect with school-based behavior analysts in our focused, distraction-free community. Get support, swap resources, and collaborate on MTSS, Functional Analysis, ACT, and practical data tools.",
  keywords: "BCBA community, school-based behavior analysts, MTSS, functional analysis, behavior support, special education community",
  alternates: { canonical: "https://behaviorschool.com/community" },
  openGraph: {
    title: "Join the Behavior School Community",
    description: "Connect with school-based behavior analysts in our focused, distraction-free community. Get support, swap resources, and collaborate with peers who understand real classrooms.",
    type: "website",
    url: "https://behaviorschool.com/community",
    images: [
      {
        url: "/optimized/Community/community1.webp",
        width: 600,
        height: 400,
        alt: "Behavior School Community platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Join the Behavior School Community",
    description: "Connect with school-based behavior analysts in our focused, distraction-free community.",
    images: ["/optimized/Community/community1.webp"],
  },
  robots: { index: true, follow: true },
};

export default function CommunityPage() {
  return (
    <Section className="pt-40 md:pt-48 lg:pt-56 pb-16 md:pb-24">
      <Container className="max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Column */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mt-4">
                Join the Behavior School Community
              </h1>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                Behavior School is a focused, distraction‑free community for school‑based behavior analysts. Get support for any of our products, swap resources, and collaborate with peers who understand real classrooms.
              </p>
              <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                Explore topics like MTSS, Functional Analysis, ACT, and practical data tools—without the noise of traditional social media. Join to ask questions, share wins, and stay current with evidence‑based practices that work in schools.
              </p>
            </div>
            
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-lg">
              <p className="text-emerald-800 font-medium">
                Our community is hosted externally on Mighty Networks to provide you with the best possible experience.
              </p>
            </div>
            
            <div className="pt-4">
              <Button 
                asChild 
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto min-w-[250px]"
              >
                <a href="https://community.behaviorschool.com" target="_blank" rel="noopener noreferrer">
                  Join the Community
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Image Column */}
          <div className="relative order-first lg:order-last">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/optimized/Community/community1.webp"
                alt="Behavior School Community - Collaborative platform for school-based behavior analysts"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                loading="eager"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-100 rounded-full opacity-60 -z-10"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-100 rounded-full opacity-40 -z-10"></div>
          </div>
        </div>
      </Container>
    </Section>
  );
}