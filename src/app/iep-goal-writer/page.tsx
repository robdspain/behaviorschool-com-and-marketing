import type { Metadata } from "next";
import { IEPGoalWriter } from "@/components/IEPGoalWriter";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "IEP Goal Writer (Team Vault) | Behavior School",
  description: "On-device IEP goal writer with end-to-end encrypted team sharing.",
  robots: { index: false, follow: false },
};

export default function IEPGoalWriterPage() {
  return (
    <div className="min-h-screen bg-bs-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        <Breadcrumbs items={[{ label: "IEP Goals", href: "/iep-goals" }, { label: "IEP Goal Writer" }]} />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <IEPGoalWriter />
      </div>
    </div>
  );
}
