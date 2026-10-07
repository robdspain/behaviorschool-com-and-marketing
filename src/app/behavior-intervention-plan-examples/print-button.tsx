"use client";

export function PrintTemplateButton() {
  function onPrint() {
    const source = document.getElementById("bip-print-root");
    if (!source) {
      window.print();
      return;
    }
    document.getElementById("bip-print-holder")?.remove();
    const holder = document.createElement("div");
    holder.id = "bip-print-holder";
    holder.appendChild(source.cloneNode(true));
    document.body.appendChild(holder);
    const cleanup = () => {
      holder.remove();
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
  }

  return (
    <button
      type="button"
      onClick={onPrint}
      className="mt-4 inline-flex min-h-11 items-center rounded-[8px] bg-[#1f4d3f] px-5 text-base font-semibold text-[#fbfaf6] hover:bg-[#123628] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#fbfaf6]"
    >
      Print this template
    </button>
  );
}
