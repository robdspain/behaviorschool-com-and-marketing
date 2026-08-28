import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BehaviorSchool Pro | Invite-Only FBA/BIP Workspace",
  description:
    "Invite-only BehaviorSchool Pro workspace for school FBA and BIP drafting, IEP goals, and student plan exports. Public account creation is not available.",
  alternates: { canonical: "https://behaviorschool.com/pro" },
  openGraph: {
    type: "website",
    title: "BehaviorSchool Pro | Invite-Only FBA/BIP Workspace",
    description:
      "Invite-only BehaviorSchool Pro workspace for school FBA and BIP drafting, IEP goals, and student plan exports. Public account creation is not available.",
    url: "https://behaviorschool.com/pro",
    siteName: "Behavior School",
    images: [
      {
        url: "/optimized/og-image.webp",
        width: 1200,
        height: 630,
        alt: "BehaviorSchool Pro invite-only workspace preview",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BehaviorSchool Pro | Invite-Only FBA/BIP Workspace",
    description:
      "Invite-only BehaviorSchool Pro workspace for school FBA and BIP drafting, IEP goals, and student plan exports. Public account creation is not available.",
    images: ["/optimized/og-image.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return children;
}
