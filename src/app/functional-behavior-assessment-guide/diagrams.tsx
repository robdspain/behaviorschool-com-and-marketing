const STEPS = [
  "1. Referral question: What behavior, where, since when, who is worried?",
  "2. Consent and team: Confirm consent rules and name who does what",
  "3. Define the behavior: Observable and measurable words only",
  "4. Records and interviews: Indirect information from files, staff, family and the student",
  "5. Direct observation: ABC data in the times the interviews point to",
  "6. Find the patterns: When it happens, when it does not, what follows",
  "7. Write the hypothesis: Setting event, antecedent, behavior, maintaining consequence",
  "8. Check it: Compare with new data, or run a functional analysis if the team needs proof",
  "9. Hand off to the BIP: Replacement skill, adult steps, review date",
] as const;

function ThenLabel({ direction }: { direction: "down" | "right" }) {
  return (
    <span className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1 text-sm font-semibold text-[#171f1d]">
      {direction === "down" ? (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
          <path d="M8 2v10M4 8l4 5 4-5" fill="none" stroke="#1f4d3f" strokeWidth="2" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
          <path d="M2 8h10M8 4l5 4-5 4" fill="none" stroke="#1f4d3f" strokeWidth="2" />
        </svg>
      )}
      then
    </span>
  );
}

function StepCard({ text }: { text: string }) {
  return (
    <div className="min-h-11 flex-1 rounded-[12px] border border-[#d9cdb8] bg-white p-3 text-base leading-6 text-[#171f1d]">
      {text}
    </div>
  );
}

export function FbaProcessDiagram() {
  const top = STEPS.slice(0, 5);
  const bottom = STEPS.slice(5);

  return (
    <figure className="my-6">
      <div role="img" aria-labelledby="fba-process-title fba-process-desc">
        <p id="fba-process-title" className="text-base font-semibold text-[#171f1d]">
          FBA process for school teams
        </p>
        <p id="fba-process-desc" className="sr-only">
          Nine numbered steps from the referral question to the behavior plan. If the pattern is unclear after step 6, observe again. If the hypothesis does not hold at step 8, return to step 6.
        </p>

        <ol className="mt-4 flex list-none flex-col gap-1 p-0 lg:hidden">
          {STEPS.map((step, index) => (
            <li key={step} className="flex flex-col items-stretch">
              <StepCard text={step} />
              {index === 5 ? (
                <p className="px-1 py-2 text-sm leading-5 text-[#171f1d]">
                  Pattern unclear: observe again
                </p>
              ) : null}
              {index === 7 ? (
                <p className="px-1 py-2 text-sm leading-5 text-[#171f1d]">
                  Hypothesis does not hold: return to step 6
                </p>
              ) : null}
              {index < STEPS.length - 1 ? (
                <div className="flex justify-center">
                  <ThenLabel direction="down" />
                </div>
              ) : null}
            </li>
          ))}
        </ol>

        <div className="mt-4 hidden lg:block">
          <div className="grid grid-cols-5 gap-3">
            {top.map((step, index) => (
              <div key={step} className="flex min-w-0 flex-col">
                <StepCard text={step} />
                <div className="flex justify-center">
                  <ThenLabel direction={index < top.length - 1 ? "right" : "down"} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-4 gap-3">
            {bottom.map((step, index) => (
              <div key={step} className="flex min-w-0 flex-col">
                <StepCard text={step} />
                {index < bottom.length - 1 ? (
                  <div className="flex justify-center">
                    <ThenLabel direction="right" />
                  </div>
                ) : null}
                {index === 0 ? (
                  <p className="mt-2 text-sm leading-5 text-[#171f1d]">Pattern unclear: observe again</p>
                ) : null}
                {index === 2 ? (
                  <p className="mt-2 text-sm leading-5 text-[#171f1d]">Hypothesis does not hold: return to step 6</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}
