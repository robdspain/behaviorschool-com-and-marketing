import type { Metadata } from "next";
import { ABCWizard } from "@/components/abc-function-finder/ABCWizard";

export const metadata: Metadata = {
  title: "ABC Data Function Finder | Free FBA Tool | BehaviorSchool",
  description:
    "Enter your ABC observations and get a hypothesized behavior function with intervention recommendations. Free for BCBAs, RBTs, and school behavior teams.",
};

export default function ABCFunctionFinderPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            ABC Data Function Finder
          </h1>
          <p className="text-lg text-gray-600">
            Enter your ABC observations to get a hypothesized behavior function
            and evidence-based intervention starting points.
          </p>
        </div>
        <ABCWizard />
      </div>
    </main>
  );
}
