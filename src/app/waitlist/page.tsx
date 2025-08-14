"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";


export default function WaitlistPage() {
	const [name, setName] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [submitting, setSubmitting] = React.useState(false);
	const [submitted, setSubmitted] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSubmitting(true);
		setError(null);
		try {
			const res = await fetch("/api/subscribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, name, company: "" }),
			});
			if (!res.ok) {
				const text = await res.text().catch(() => "");
				throw new Error(text || "Failed to subscribe");
			}
			setSubmitted(true);
		} catch (err) {
			setError((err as Error).message || "Something went wrong");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className="min-h-screen" style={{ backgroundColor: '#FAF3E0' }}>
			<section className="relative overflow-hidden" style={{ backgroundColor: '#1F4D3F' }}>
				<div className="max-w-3xl mx-auto px-6 py-16 text-center">
					<Badge className="bg-white/10 text-white border-white/20 mb-4">Coming Soon</Badge>
					<h1 className="text-4xl md:text-5xl font-bold text-white">Be first to know when it launches</h1>
					<p className="mt-4 text-lg text-slate-200">Join the waitlist and we&apos;ll email you as soon as everything is available.</p>
				</div>
			</section>

			<section className="py-12">
				<div className="max-w-xl mx-auto px-6">
					<form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)] ring-1 ring-slate-200/70">
						<div className="grid gap-4">
							<div>
								<label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
								<input
									id="name"
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
									placeholder="Jane Doe"
								/>
							</div>
							<div>
								<label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
								<input
									id="email"
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500"
									placeholder="you@example.com"
								/>
							</div>
							{/* Honeypot to align with API schema */}
							<input type="hidden" name="company" value="" readOnly />
							<Button type="submit" disabled={submitting} className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
								{submitting ? "Joining..." : "Join the Waitlist"}
							</Button>
							{error ? <p className="text-sm text-red-600 mt-2">{error}</p> : null}
							{submitted ? <p className="text-sm text-emerald-700 mt-2">Thanks! We&apos;ll let you know as soon as it&apos;s live.</p> : null}
						</div>
					</form>
					<p className="mt-4 text-center text-xs text-slate-500">We respect your privacy. Unsubscribe anytime.</p>
				</div>
			</section>
		</div>
	);
}