"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function ClientCTA() {
  return (
    <>
      <Link 
        href="/iep-behavior-goals/widget"
        className="inline-flex items-center px-12 py-5 text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200"
      >
        Generate My First Goal Now →
        <ArrowRight className="ml-3 h-6 w-6" />
      </Link>
    </>
  );
}
