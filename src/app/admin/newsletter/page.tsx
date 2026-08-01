"use client";

import { Component, useEffect, useState, type ErrorInfo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, LogIn } from "lucide-react";
import { useConvexAuth } from "convex/react";
import { AdminNewsletterPage } from "@/components/admin/NewsletterDashboard";
import { NewsletterConvexProvider } from "@/components/admin/NewsletterConvexProvider";
import { hasAdminClientSession } from "@/lib/admin-client-session";

const newsletterGrantStorageKey = "behavior-school-newsletter-grant";

class NewsletterErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Newsletter workspace error", error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
        <div className="max-w-xl border border-red-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-950">
            Newsletter workspace needs attention
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            The workspace could not finish loading. Reload once; if the problem
            continues, share the diagnostic below with support.
          </p>
          <pre className="mt-4 overflow-auto bg-slate-950 p-4 text-xs text-slate-100">
            {this.state.error.message}
          </pre>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 inline-flex h-11 items-center bg-emerald-700 px-5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Reload workspace
          </button>
        </div>
      </div>
    );
  }
}

function NewsletterAccessGate({
  hasAccessToken,
}: {
  hasAccessToken: boolean;
}) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading || (hasAccessToken && !isAuthenticated)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Connecting to the newsletter workspace...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
        <div className="max-w-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-950">
            Newsletter workspace sign-in required
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Your Behavior School admin session is active. Connect your approved
            Google account once to open the weekly newsletter data here.
          </p>
          <a
            href="/api/newsletter-auth/start"
            className="mt-6 inline-flex h-11 items-center gap-2 bg-emerald-700 px-5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            <LogIn className="h-4 w-4" />
            Connect newsletter workspace
          </a>
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
  const [connectionError, setConnectionError] = useState("");
  const [newsletterAccessToken, setNewsletterAccessToken] = useState<
    string | null
  >(null);

  useEffect(() => {
    document.title = "Weekly Newsletter | Behavior School Admin";

    let active = true;
    void (async () => {
      const authenticated = await hasAdminClientSession();
      if (!active) return;

      if (!authenticated) {
        setAdminSession("unauthenticated");
        router.replace("/admin/login?returnTo=/admin/newsletter");
        return;
      }

      const currentUrl = new URL(window.location.href);
      let newsletterGrant = currentUrl.searchParams.get("newsletterGrant");
      if (newsletterGrant) {
        window.sessionStorage.setItem(
          newsletterGrantStorageKey,
          newsletterGrant,
        );
        currentUrl.searchParams.delete("newsletterGrant");
        window.history.replaceState({}, "", currentUrl);
      } else {
        newsletterGrant = window.sessionStorage.getItem(
          newsletterGrantStorageKey,
        );
      }

      if (currentUrl.searchParams.has("newsletterAuthError")) {
        setConnectionError(
          "The newsletter workspace could not be connected. Please try again.",
        );
        currentUrl.searchParams.delete("newsletterAuthError");
        window.history.replaceState({}, "", currentUrl);
      }

      const tokenResponse = newsletterGrant
        ? await fetch("/api/newsletter-auth/access-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ grant: newsletterGrant }),
            credentials: "same-origin",
            cache: "no-store",
          })
        : null;
      if (tokenResponse?.ok) {
        const tokenResult = (await tokenResponse.json()) as {
          token?: string;
        };
        if (tokenResult.token) {
          setNewsletterAccessToken(tokenResult.token);
        }
      } else if (tokenResponse) {
        const failure = (await tokenResponse.json().catch(() => null)) as {
          code?: string;
        } | null;
        if (failure?.code) {
          if (failure.code === "invalid_grant") {
            window.sessionStorage.removeItem(newsletterGrantStorageKey);
          }
          setConnectionError(
            "The newsletter workspace could not be connected. Please try again.",
          );
        } else if (tokenResponse.status !== 401) {
          setConnectionError(
            "The newsletter workspace could not be connected. Please try again.",
          );
        }
      }

      if (!active) return;
      setAdminSession("authenticated");
    })().catch(() => {
      if (!active) return;
      setConnectionError(
        "The newsletter workspace could not be connected. Please try again.",
      );
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
    <NewsletterErrorBoundary>
      <NewsletterConvexProvider initialToken={newsletterAccessToken}>
        {connectionError ? (
          <div
            role="alert"
            className="border-b border-red-200 bg-red-50 px-6 py-3 text-sm font-medium text-red-800"
          >
            {connectionError}
          </div>
        ) : null}
        <NewsletterAccessGate
          hasAccessToken={Boolean(newsletterAccessToken)}
        />
      </NewsletterConvexProvider>
    </NewsletterErrorBoundary>
  );
}
