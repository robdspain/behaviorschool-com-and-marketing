"use client";

import { useEffect } from "react";

export default function ClickRedirectPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const url = params.get("url");
    if (url) {
      window.location.href = url;
      return;
    }
    window.location.href = "https://behaviorschool.com";
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <p className="text-sm text-slate-500">Redirecting…</p>
    </div>
  );
}
