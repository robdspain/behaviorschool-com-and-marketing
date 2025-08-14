"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function AdminPage() {
	const router = useRouter();
	const [isChecking, setIsChecking] = useState(true);
	const [userEmail, setUserEmail] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		const supabase = getSupabaseBrowserClient();
		supabase.auth.getUser().then(({ data }) => {
			if (!mounted) return;
			if (!data.user) {
				router.replace("/login");
			} else {
				setUserEmail(data.user.email ?? null);
				setIsChecking(false);
			}
		});
		return () => {
			mounted = false;
		};
	}, [router]);

	const signOut = async () => {
		const supabase = getSupabaseBrowserClient();
		await supabase.auth.signOut();
		router.replace("/login");
	};

	if (isChecking) {
		return <div className="max-w-5xl mx-auto p-8">Checking session…</div>;
	}

	return (
		<div className="max-w-5xl mx-auto p-8 space-y-6">
			<h1 className="text-2xl font-semibold">Admin</h1>
			<p className="text-sm text-muted-foreground">Signed in as {userEmail ?? "unknown"}</p>
			<div>
				<Button variant="outline" onClick={signOut}>Sign out</Button>
			</div>
			<div className="border rounded-md p-6">
				<p>Admin dashboard placeholder</p>
			</div>
		</div>
	);
}