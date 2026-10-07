"use client";

export function PrintTemplateButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-11 items-center justify-center rounded-[8px] border border-[#1f4d3f] bg-[#fbfaf6] px-4 text-base font-semibold text-[#1f4d3f] hover:bg-[#f4efe5] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#1f4d3f]"
    >
      Print the FBA template
    </button>
  );
}
