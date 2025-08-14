import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/ui/hero";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
	title: "ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software",
	description:
		"Special education software to plan lessons, track IEP goals, and generate progress reports with ease. AI-powered for teachers and case managers.",
	alternates: { canonical: "/classroom-pilot" },
	keywords: [
		"special education teacher software",
		"IEP goal tracking tool",
		"progress monitoring app for special ed",
		"IEP progress report generator",
		"accommodations tracking tool",
		"sped data collection app",
		"special education planning software",
		"IDEA compliance",
		"parent communication tools",
		"assistive technology integration",
	],
	openGraph: {
		title: "ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software",
		description:
			"Plan lessons, track IEP goals, and generate progress reports with ease. AI-powered for teachers and case managers.",
		url: "/classroom-pilot",
		images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ClassroomPilot" }],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "ClassroomPilot — IEP Goal Tracking & Progress Monitoring Software",
		description:
			"Plan lessons, track IEP goals, and generate progress reports with ease. AI-powered for teachers and case managers.",
		images: ["/og-image.png"],
	},
	robots: { index: true, follow: true },
};

export default function ClassroomPilotPage() {
	const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://behaviorschool.com";
	const softwareJsonLd = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: "ClassroomPilot",
		description:
			"IEP data collection and progress monitoring software for special education teachers and case managers.",
		applicationCategory: "EducationApplication",
		operatingSystem: "Web",
		url: `${SITE_URL}/classroom-pilot`,
		creator: { "@type": "Organization", name: "Behavior School" },
	} as const;

	return (
		<div className="min-h-screen bg-[var(--bs-background,#FAF3E0)]">
			<Hero
				variant="brand"
				eyebrow="ClassroomPilot"
				title="IEP Goal Tracking & Progress Monitoring"
				highlight="for Special Education"
				subtitle="Special education teacher software for IEP data collection, lesson planning, accommodations tracking, and IDEA-compliant reporting."
				primaryCta={{ href: "#download", label: "Get the IEP Data Checklist" }}
			/>

			<section className="py-16 bg-white">
				<div className="max-w-6xl mx-auto px-6">
					<div className="text-center mb-10">
						<h2 className="text-3xl sm:text-4xl font-bold text-slate-900">How It Works</h2>
						<p className="mt-3 text-slate-700 max-w-2xl mx-auto">Map IEP goals to daily instruction, collect progress data, and generate IDEA-compliant reports in minutes.</p>
					</div>
					<div className="grid md:grid-cols-4 gap-6">
						{[
							{ step: "01", title: "Set IEP Goals", desc: "Import or define measurable IEP goals aligned to standards." },
							{ step: "02", title: "Plan Lessons", desc: "Turn goals into lesson plans with accommodations and supports." },
							{ step: "03", title: "Track Progress", desc: "IEP data collection with timers, prompts, and mastery criteria." },
							{ step: "04", title: "Report & Share", desc: "Generate IEP progress reports and share with families and teams." },
						].map((item) => (
							<Card key={item.step} className="rounded-2xl border-0 shadow-feature">
								<CardContent className="p-6">
									<div className="text-sm font-semibold text-slate-500 mb-2">{item.step}</div>
									<h3 className="text-lg font-semibold text-slate-900 mb-1">{item.title}</h3>
									<p className="text-slate-600">{item.desc}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			<section className="py-16 bg-slate-50">
				<div className="max-w-6xl mx-auto px-6">
					<div className="text-center mb-10">
						<h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Built for Special Education</h2>
						<p className="mt-3 text-slate-700 max-w-2xl mx-auto">Feature set designed for special education planning, compliant documentation, and parent communication.</p>
					</div>
					<div className="grid md:grid-cols-3 gap-6">
						{[
							{ title: "IEP Data Collection", desc: "Collect trial-by-trial, frequency, duration, and ABC data with one tap." },
							{ title: "Special Education Planning", desc: "Turn IEP goals into weekly lesson plans with accommodations and supports." },
							{ title: "Progress Monitoring", desc: "Real-time charts and mastery criteria for data-driven decisions." },
							{ title: "IEP Progress Report Generator", desc: "Auto-generate IDEA-compliant progress reports on schedule." },
							{ title: "Accommodations Tracking", desc: "Track service minutes, accommodations, and modifications by student." },
							{ title: "Parent Communication Tools", desc: "Share summaries securely with families and teams." },
						].map((f) => (
							<Card key={f.title} className="rounded-2xl border-0 bg-white shadow-feature">
								<CardContent className="p-6">
									<h3 className="text-xl font-semibold text-slate-900 mb-2">{f.title}</h3>
									<p className="text-slate-600">{f.desc}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			<section id="download" className="py-16 bg-white">
				<div className="max-w-3xl mx-auto px-6">
					<div className="text-center mb-8">
						<Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Free PDF</Badge>
						<h2 className="mt-3 text-3xl font-bold text-slate-900">Top 10 IEP Data Tracking Tips</h2>
						<p className="mt-2 text-slate-700">Download the checklist and get practical guidance for efficient IEP progress monitoring.</p>
					</div>
					<form name="iep-checklist" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="/thank-you" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
						<input type="hidden" name="form-name" value="iep-checklist" />
						<p className="hidden"><label>Don’t fill this out: <input name="bot-field" /></label></p>
						<div className="grid gap-4 sm:grid-cols-2">
							<div>
								<label htmlFor="name" className="block text-sm font-medium text-slate-700">Full name</label>
								<input id="name" name="name" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
							</div>
							<div>
								<label htmlFor="email" className="block text-sm font-medium text-slate-700">Work email</label>
								<input id="email" name="email" type="email" required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
							</div>
						</div>
						<div className="mt-4 flex items-center gap-2">
							<input id="opt_in" name="opt_in_marketing" type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300" />
							<label htmlFor="opt_in" className="text-sm text-slate-700">Send me special education planning resources and IEP progress monitoring tips</label>
						</div>
						<div className="mt-6">
							<Button asChild size="lg" className="h-12 px-6 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
								<button type="submit">Email me the PDF</button>
							</Button>
						</div>
					</form>
					<p className="mt-4 text-center text-sm text-slate-600">By submitting, you agree to our terms and acknowledge our privacy policy.</p>
				</div>
			</section>

			<section className="py-16 bg-slate-50">
				<div className="max-w-5xl mx-auto px-6">
					<h2 className="text-2xl font-semibold text-slate-900 mb-4">Why ClassroomPilot?</h2>
					<ul className="space-y-3">
						{[
							"Streamlined IEP goal tracking tool with built‑in progress monitoring app for special ed.",
							"Accommodations tracking tool aligned to IDEA compliance and district reporting.",
							"Parent communication tools and assistive technology integration to support access and equity.",
						].map((text) => (
							<li key={text} className="flex items-start gap-2 text-slate-700">
								<CheckCircle className="mt-0.5 h-5 w-5 text-emerald-600" />
								<span>{text}</span>
							</li>
						))}
					</ul>
				</div>
			</section>

			{/* Structured data */}
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
		</div>
	);
}