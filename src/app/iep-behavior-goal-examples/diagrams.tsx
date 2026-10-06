const steps = [
  "By the annual review date",
  "When: given a difficult independent task and visual support",
  "Who: Jordan",
  "Will do: request help or a break using the taught response",
  "From baseline: 2 of 10 opportunities",
  "To criterion: 8 of 10 opportunities",
  "Measured by: teacher opportunity recording across 2 consecutive weeks",
] as const;

const title = "Anatomy of a measurable IEP behavior goal";
const description =
  "Diagram showing the baseline, condition, observable behavior, criterion, measurement method, and time frame in a measurable IEP behavior goal.";

export function GoalAnatomyDiagram() {
  return (
    <figure className="my-8">
      <div
        role="img"
        aria-label={`${title}. ${description} Reading order: ${steps.join(". ")}.`}
        className="rounded-[12px] border border-[#d9cdb8] bg-[#f4efe5] p-4 sm:p-6"
      >
        <p className="text-base font-semibold text-[#171f1d]">{title}</p>
        <ol className="mt-4 flex flex-col">
          {steps.map((step, index) => (
            <li key={step} className="flex flex-col items-stretch">
              <div className="rounded-[12px] border border-[#d9cdb8] bg-[#fbfaf6] px-4 py-3">
                <p className="text-base leading-6 text-[#171f1d]">
                  <span className="font-semibold text-[#1f4d3f]">{index + 1}. </span>
                  {step}
                </p>
              </div>
              {index < steps.length - 1 ? (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 16"
                  className="mx-auto my-1 h-4 w-6 text-[#1f4d3f]"
                >
                  <path d="M12 15 L3 3 H21 Z" fill="currentColor" />
                </svg>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="mt-3 text-base leading-7 text-[#365548]">
        <p>{description}</p>
        <ol className="mt-2 list-decimal space-y-1 pl-6 text-[#171f1d]">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}
