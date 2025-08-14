import * as React from "react";
import Container from "@/components/container";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";

export default function CommunityPage() {
  return (
    <Section className="py-16 md:py-24">
      <Container className="max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
          Community
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Behavior School is a focused, distraction‑free community for school‑based behavior analysts. Get support for any of our products, swap resources, and collaborate with peers who understand real classrooms. Explore topics like MTSS, Functional Analysis, ACT, and practical data tools—without the noise of traditional social media. Join to ask questions, share wins, and stay current with evidence‑based practices that work in schools.
        </p>
        <Button asChild size="lg">
          <a href="https://community.behaviorschool.com" target="_blank" rel="noopener noreferrer">
            Join the community
          </a>
        </Button>
      </Container>
    </Section>
  );
}


