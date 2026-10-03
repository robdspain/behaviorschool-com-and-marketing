"use client";

import { FormEvent, useState } from "react";
import { W9_PENDING_MESSAGE, W9_REQUEST_ANCHOR } from "@/lib/transformation-program";

const fieldClass =
  "mt-1 w-full min-h-12 rounded-lg border border-[#173E35] bg-white px-3 text-base text-[#121F1A] placeholder:text-[#173E35]/60 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#173E35]";

export function W9RequestForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/transformation-program/w9", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          organization: data.get("organization"),
          faxNumber: data.get("faxNumber"),
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as { message?: string; error?: string };
      if (!response.ok) {
        setStatus("error");
        setMessage(payload.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setMessage(payload.message || W9_PENDING_MESSAGE);
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form
      id={W9_REQUEST_ANCHOR}
      onSubmit={onSubmit}
      className="relative scroll-mt-24 mt-10 rounded-lg border border-[#173E35] bg-[#EDF6F1] p-4 sm:p-6"
      noValidate
    >
      <h3 className="text-xl font-bold text-[#121F1A]">Request the Behavior School LLC W-9</h3>
      <p className="mt-2 text-base leading-7 text-[#173E35]">
        Add your name, work email, and organization. The file arrives in your inbox right away.
      </p>

      <div className="mt-5 space-y-4">
        <label className="block text-sm font-semibold text-[#121F1A]" htmlFor="w9-name">
          Name
          <input id="w9-name" name="name" type="text" autoComplete="name" required maxLength={120} className={fieldClass} />
        </label>
        <label className="block text-sm font-semibold text-[#121F1A]" htmlFor="w9-email">
          Work email
          <input id="w9-email" name="email" type="email" autoComplete="email" inputMode="email" required maxLength={320} className={fieldClass} />
        </label>
        <label className="block text-sm font-semibold text-[#121F1A]" htmlFor="w9-organization">
          Organization (school district or agency)
          <input id="w9-organization" name="organization" type="text" autoComplete="organization" required maxLength={200} className={fieldClass} />
        </label>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0"
        style={{ clip: "rect(0, 0, 0, 0)", clipPath: "inset(50%)" }}
      >
        <label htmlFor="w9-fax">
          Fax
          <input id="w9-fax" name="faxNumber" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[#D6A338] px-6 py-3 text-base font-semibold text-[#121F1A] transition-colors hover:bg-[#c4922d] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#173E35] disabled:opacity-70 sm:w-auto"
      >
        {status === "submitting" ? "Sending" : "Email me the W-9"}
      </button>

      {message ? (
        <p role={status === "error" ? "alert" : "status"} className="mt-4 text-base leading-7 text-[#121F1A]">
          {message}
        </p>
      ) : null}
    </form>
  );
}
