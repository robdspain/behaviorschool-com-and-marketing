"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function LoginPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;
		const supabase = getSupabaseBrowserClient();
		supabase.auth.getSession().then(({ data }) => {
			if (!isMounted) return;
			if (data.session) {
				router.replace("/admin");
			} else {
				setIsLoading(false);
			}
		});
		const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
			if (session) router.replace("/admin");
		});
		return () => {
			isMounted = false;
			subscription.subscription.unsubscribe();
		};
	}, [router]);

	const signInWithGoogle = async () => {
		const origin = typeof window !== "undefined" ? window.location.origin : "";
		const supabase = getSupabaseBrowserClient();
		await supabase.auth.signInWithOAuth({
			provider: "google",
			options: { redirectTo: `${origin}/admin` },
		});
	};

	if (isLoading) {
		return <div className="max-w-3xl mx-auto p-8">Loading…</div>;
	}

	return (
		<div className="max-w-3xl mx-auto p-8">
			<h1 className="text-2xl font-semibold mb-6">Sign in</h1>
			<div className="space-y-4">
				<Button onClick={signInWithGoogle}>Continue with Google</Button>
			</div>
		</div>
	);
}