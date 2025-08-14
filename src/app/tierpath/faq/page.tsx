import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata = {
	title: "TierPath FAQ",
	description: "Frequently asked questions about TierPath, the MTSS platform for schools.",
};

export default function TierPathFaqPage() {
	return (
		<section className="py-16 bg-white">
			<div className="max-w-4xl mx-auto px-6">
				<h2 className="text-3xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
				<Accordion type="single" collapsible className="w-full">
					<AccordionItem value="q1">
						<AccordionTrigger>What is the best MTSS software for schools?</AccordionTrigger>
						<AccordionContent>
							TierPath streamlines multi-tiered systems of support (MTSS) by centralizing Tier 1–3 interventions, PBIS tracking, and progress monitoring into one platform.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="q2">
						<AccordionTrigger>Can TierPath help track PBIS interventions?</AccordionTrigger>
						<AccordionContent>
							Yes. TierPath includes built-in PBIS tracking, from Check-In/Check-Out (CICO) to Tier 3 intervention fidelity, with easy-to-read dashboards.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="q3">
						<AccordionTrigger>Does TierPath support universal screening?</AccordionTrigger>
						<AccordionContent>
							Absolutely. TierPath includes a universal screening module with risk flagging so you can identify students in need of additional support early.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="q4">
						<AccordionTrigger>How does TierPath help with fidelity checks?</AccordionTrigger>
						<AccordionContent>
							TierPath tracks implementation fidelity at all tiers, giving district leaders and coaches the data they need to improve program consistency.
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</section>
	);
}