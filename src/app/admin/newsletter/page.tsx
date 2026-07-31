"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle, LogIn } from "lucide-react";
import { AdminNewsletterPage } from "@/components/admin/NewsletterDashboard";
import {
  NewsletterConvexProvider,
  newsletterAuthClient,
} from "@/components/admin/NewsletterConvexProvider";
import { hasAdminClientSession } from "@/lib/admin-client-session";

function NewsletterAccessGate() {
  const { data: session, isPending } = newsletterAuthClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Connecting to the newsletter workspace...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
        <div className="max-w-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-950">
            Newsletter workspace sign-in required
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Your Behavior School admin session is active. Sign in once to the
            newsletter data service to open the weekly workflow here.
          </p>
          <Link
            href="https://learning.behaviorschool.com/login"
            className="mt-6 inline-flex h-11 items-center gap-2 bg-emerald-700 px-5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            <LogIn className="h-4 w-4" />
            Sign in to newsletter workspace
          </Link>
        </div>
      </div>
    );
  }

  return <AdminNewsletterPage />;
}

export default function NewsletterAdminPage() {
  const router = useRouter();
  const [adminSession, setAdminSession] = useState<
    "checking" | "authenticated" | "unauthenticated"
  >("checking");

  useEffect(() => {
    document.title = "Weekly Newsletter | Behavior School Admin";

    let active = true;
    void hasAdminClientSession().then((authenticated) => {
      if (!active) return;
      if (!authenticated) {
        setAdminSession("unauthenticated");
        router.replace("/admin/login?returnTo=/admin/newsletter");
        return;
      }
      setAdminSession("authenticated");
    });

    return () => {
      active = false;
    };
  }, [router]);

  if (adminSession !== "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Checking admin access...
        </div>
      </div>
    );
  }

  return (
    <NewsletterConvexProvider>
      <NewsletterAccessGate />
    </NewsletterConvexProvider>
  );
}
