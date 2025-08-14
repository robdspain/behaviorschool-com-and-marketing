import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Thanks! Your IEP Checklist is Ready | ClassroomPilot",
	description: "Download the Top 10 IEP Data Tracking Tips checklist.",
	robots: { index: false, follow: false },
};

export default function ThankYouPage() {
	return (
		<div className="mx-auto w-full max-w-[720px] px-4 sm:px-6 lg:px-8 py-16">
			<h1 className="text-3xl font-bold text-slate-900 mb-3">Thank you!</h1>
			<p className="text-slate-700 mb-6">Your checklist is ready. Click below to download.</p>
			<div>
				<Link
					href="/checklists/top-10-iep-data-tracking-tips.pdf"
					className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-700 transition-colors"
				>
					Download the PDF
				</Link>
			</div>
			<p className="mt-6 text-sm text-slate-600">We also emailed you a link to this page for reference.</p>
		</div>
	);
}