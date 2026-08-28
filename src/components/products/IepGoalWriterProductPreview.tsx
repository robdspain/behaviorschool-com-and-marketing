type IepGoalWriterProductPreviewProps = {
  className?: string;
};

const steps = [
  "Student and behavior",
  "Baseline",
  "Context and supports",
  "Goal and measurement",
  "Review",
];

export function IepGoalWriterProductPreview({ className = "" }: IepGoalWriterProductPreviewProps) {
  return (
    <div
      className={`overflow-hidden border border-[#173f33]/20 bg-white ${className}`}
      aria-label="IEP Behavior Goal Writer product preview"
    >
      <div className="flex h-10 items-center justify-between border-b border-[#173f33]/12 bg-[#f4f2ec] px-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#51645d]">
          Free tool · No login required
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1f6b50]">
          Live product view
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-base font-bold text-[#123628]">IEP Behavior Goal Writer</h3>
        <p className="mt-1 text-xs leading-5 text-[#51645d]">
          Build a measurable behavior goal from student-specific baseline, context, supports, and
          data-collection details.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {steps.map((step, index) => (
            <span
              key={step}
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                index === 0
                  ? "bg-[#1f4d3f] text-white"
                  : "border border-[#173f33]/15 bg-white text-[#51645d]"
              }`}
            >
              {index + 1}. {step}
            </span>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-[#173f33]/12 bg-[#f8f7f3] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#1f4d3f]">
            Student and behavior
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-[11px] font-semibold text-[#263b34]">Annual goal date</span>
              <span className="mt-1 block rounded-md border border-[#173f33]/15 bg-white px-3 py-2 text-xs text-[#51645d]">
                2026-06-01
              </span>
            </label>
            <label className="block">
              <span className="text-[11px] font-semibold text-[#263b34]">Student name</span>
              <span className="mt-1 block rounded-md border border-[#173f33]/15 bg-white px-3 py-2 text-xs text-[#51645d]">
                Student initials only
              </span>
            </label>
          </div>
          <label className="mt-3 block">
            <span className="text-[11px] font-semibold text-[#263b34]">Target behavior</span>
            <span className="mt-1 block rounded-md border border-[#173f33]/15 bg-white px-3 py-2 text-xs text-[#51645d]">
              On-task behavior during independent work
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
