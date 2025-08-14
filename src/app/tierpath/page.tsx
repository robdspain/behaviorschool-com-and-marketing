import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

export const metadata: Metadata = {
	title: "TierPath — MTSS & PBIS Software for Schools",
	description:
		"Track MTSS tiers, PBIS interventions, and progress monitoring in one dashboard. From screening to Tier 3 fidelity tracking.",
	keywords: [
		"MTSS software",
		"PBIS management system",
		"tiered intervention tracking",
		"multi-tiered system of supports tool",
		"CICO tracking software",
		"progress monitoring for MTSS",
		"schoolwide PBIS software",
		"tier 1 tier 2 tier 3 supports",
		"universal screening",
		"fidelity checks",
		"MTSS data system",
		"PBIS tracking",
	],
	openGraph: {
		title: "TierPath — MTSS & PBIS Software for Schools",
		description:
			"Track MTSS tiers, PBIS interventions, and progress monitoring in one dashboard. From screening to Tier 3 fidelity tracking.",
	},
	alternates: { canonical: "/tierpath" },
};

function TriangleGraphic() {
	return (
		<svg
			viewBox="0 0 300 260"
			role="img"
			aria-label="MTSS triangle with Tier 1, Tier 2, and Tier 3"
			className="mx-auto h-48 w-auto"
		>
			<defs>
				<linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
					<stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
				</linearGradient>
				<linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
					<stop offset="100%" stopColor="#f59e0b" stopOpacity="0.6" />
				</linearGradient>
				<linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
					<stop offset="100%" stopColor="#ef4444" stopOpacity="0.6" />
				</linearGradient>
			</defs>
			<polygon points="150,10 290,240 10,240" fill="#e5e7eb" />
			<polygon points="150,10 260,220 40,220" fill="url(#g3)" />
			<polygon points="150,60 240,220 60,220" fill="url(#g2)" />
			<polygon points="150,110 220,220 80,220" fill="url(#g1)" />
			<text x="150" y="95" textAnchor="middle" fontSize="14" fill="#111827">Tier 3</text>
			<text x="150" y="145" textAnchor="middle" fontSize="14" fill="#111827">Tier 2</text>
			<text x="150" y="195" textAnchor="middle" fontSize="14" fill="#111827">Tier 1</text>
		</svg>
	);
}

export default function TierPathPage() {
	return (
		<div className="relative overflow-hidden">
			<div className="pointer-events-none absolute inset-0 -z-10 select-none">
				<div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
				<div className="absolute -bottom-24 right-1/3 h-80 w-80 rounded-full bg-yellow-300/20 blur-3xl" />
			</div>

			<section className="mx-auto max-w-6xl px-6 lg:px-8 py-16">
				<div className="grid gap-10 lg:grid-cols-2 items-center">
					<div>
						<h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">TierPath — MTSS/PBIS OS</h1>
						<p className="mt-4 text-lg text-slate-700">
							An MTSS data system and PBIS tracking platform for schools. Centralize universal screening,
							tiered intervention tracking, and progress monitoring across Tier 1, Tier 2, and Tier 3 supports—including CICO.
						</p>
						<div className="mt-6 flex gap-4">
							<Link href="#demo" className="rounded-lg bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-700 transition-colors">Request a demo</Link>
							<Link href="#features" className="rounded-lg ring-1 ring-slate-300 px-5 py-3 text-slate-800 hover:bg-white/60 transition-colors">See features</Link>
						</div>
					</div>
					<div>
						<TriangleGraphic />
					</div>
				</div>
			</section>

			<section id="features" className="mx-auto max-w-6xl px-6 lg:px-8 pb-12">
				<div className="grid gap-8 md:grid-cols-3">
					<div className="rounded-2xl bg-white/80 ring-1 ring-slate-200/70 p-6">
						<h2 className="text-xl font-semibold text-slate-900">Universal screening</h2>
						<p className="mt-2 text-slate-600">Screen cohorts, flag risk, and route students to Tier 1–3 supports fast.</p>
					</div>
					<div className="rounded-2xl bg-white/80 ring-1 ring-slate-200/70 p-6">
						<h2 className="text-xl font-semibold text-slate-900">PBIS tracking</h2>
						<p className="mt-2 text-slate-600">Track schoolwide PBIS interventions, CICO plans, and fidelity checks.</p>
					</div>
					<div className="rounded-2xl bg-white/80 ring-1 ring-slate-200/70 p-6">
						<h2 className="text-xl font-semibold text-slate-900">Progress monitoring for MTSS</h2>
						<p className="mt-2 text-slate-600">Automated graphs, alerts, and reports to drive data-based decisions.</p>
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-6xl px-6 lg:px-8 py-8">
				<div className="rounded-2xl bg-white/80 ring-1 ring-slate-200/70 p-8">
					<h2 className="text-2xl font-bold text-slate-900">For District Leaders</h2>
					<p className="mt-3 text-slate-700">
						Make MTSS software adoption easy: streamline data flows across schools, ensure audit‑ready documentation,
						and standardize PBIS management system practices. Role‑based access, SIS-friendly imports, and exportable
						reports help you scale with confidence.
					</p>
					<ul className="mt-4 list-disc pl-6 text-slate-700">
						<li>District dashboards with Tier 1–3 fidelity tracking</li>
						<li>Evidence‑based templates for CICO and intervention plans</li>
						<li>Parent‑ready summaries and progress snapshots</li>
					</ul>
				</div>
			</section>

			<section className="mx-auto max-w-6xl px-6 lg:px-8 py-8">
				<h2 className="text-2xl font-bold text-slate-900">FAQs</h2>
				<Accordion type="single" collapsible className="mt-4">
					<AccordionItem value="q1">
						<AccordionTrigger>What is the best MTSS software?</AccordionTrigger>
						<AccordionContent>
							The best MTSS software aligns with your district’s workflows, supports universal screening, tiered intervention tracking,
							progress monitoring, and PBIS tracking in one place. TierPath focuses on fast setup, clarity, and audit‑ready reports.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="q2">
						<AccordionTrigger>How do schools track PBIS fidelity?</AccordionTrigger>
						<AccordionContent>
							Use a PBIS management system to define expectations, log acknowledgements and responses, and run fidelity checks. TierPath
							offers checklists, role‑based workflows, and dashboards for Tier 1–3 fidelity tracking.
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</section>

			<section id="demo" className="mx-auto max-w-6xl px-6 lg:px-8 py-12">
				<div className="rounded-2xl bg-white/80 ring-1 ring-slate-200/70 p-8 text-center">
					<h2 className="text-2xl font-bold text-slate-900">See TierPath in action</h2>
					<p className="mt-3 text-slate-700">Get a walkthrough of MTSS data system workflows, PBIS tracking, and CICO tools.</p>
					<Link href="/contact" className="mt-6 inline-flex rounded-lg bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-700 transition-colors">Request demo</Link>
				</div>
			</section>
		</div>
	);
}