"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ACTFBABIPWizard } from "@/components/act-fba-bip/ACTFBABIPWizard";
import { DEMO_WIZARD_DATA } from "@/components/act-fba-bip/actBipGenerator";

export default function ACTFBABIPWizardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasStudentInfo, setHasStudentInfo] = useState<boolean | null>(null);

  useEffect(() => {
    const isDemo = searchParams.get("demo") === "true";
    const demoFlag = localStorage.getItem("act-fba-bip-demo") === "true";

    const stored = localStorage.getItem("act-fba-bip-student-info");
    if (!stored && (isDemo || demoFlag)) {
      localStorage.setItem("act-fba-bip-data", JSON.stringify(DEMO_WIZARD_DATA));
      localStorage.setItem("act-fba-bip-student-info", JSON.stringify(DEMO_WIZARD_DATA.profile));
      localStorage.setItem("act-fba-bip-demo", "true");
      setHasStudentInfo(true);
      return;
    }

    if (!stored) {
      router.push("/act-fba-bip");
      return;
    }
    setHasStudentInfo(true);
  }, [router, searchParams]);

  if (hasStudentInfo === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#1E3A34] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading wizard...</p>
        </div>
      </div>
    );
  }

  const demoMode = searchParams.get("demo") === "true";

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <ACTFBABIPWizard startFromPhase={1} demoMode={demoMode} />
      </div>
    </main>
  );
}
