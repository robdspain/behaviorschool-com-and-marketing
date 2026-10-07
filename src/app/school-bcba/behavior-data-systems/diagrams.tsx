const sheetColumns = [
  { step: "1", label: "TIME" },
  { step: "2", label: "A, WHAT HAPPENED RIGHT BEFORE?" },
  { step: "3", label: "B, WHAT DID THE STUDENT DO?" },
  { step: "4", label: "C, WHAT HAPPENED RIGHT AFTER?" },
] as const;

const sheetFields = [
  "Student",
  "Target behavior",
  "Observer",
  "Date",
  "Setting",
  "Start time",
  "End time",
] as const;

const measureBranches = [
  {
    question: "How many times?",
    measure: "Count or rate",
    note: "Discrete responses with clear starts and stops.",
  },
  {
    question: "How long?",
    measure: "Duration",
    note: "Behavior that lasts too long, too briefly, or varies in length.",
  },
  {
    question: "How soon after an event?",
    measure: "Latency",
    note: "Time from an instruction or opportunity to the response.",
  },
  {
    question: "Was it present during an interval?",
    measure: "Interval recording or momentary time sampling",
    note: "Ongoing behavior when continuous observation is difficult.",
  },
  {
    question: "What remains after the behavior?",
    measure: "Permanent product",
    note: "A reliable product that can be scored after the event.",
  },
  {
    question: "When does it occur during the day?",
    measure: "Scatterplot",
    note: "Distribution across time periods and activities.",
  },
] as const;

function ThenMark() {
  return (
    <p className="flex items-center justify-center gap-2 py-1 text-base font-semibold text-[#1f4d3f] lg:px-1 lg:py-0">
      <span>then</span>
      <svg viewBox="0 0 20 20" className="h-5 w-5 lg:hidden" aria-hidden="true">
        <path d="M10 3v12M6 11l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
      <svg viewBox="0 0 20 20" className="hidden h-5 w-5 lg:block" aria-hidden="true">
        <path d="M3 10h12M11 6l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </p>
  );
}

export function AbcDataSheetDiagram() {
  return (
    <figure className="my-6">
      <div
        role="img"
        aria-label="ABC observation record. Record one episode in time order. Time flows through A, then B, then C. Descriptive data show patterns to examine. They do not prove function by themselves."
        className="overflow-hidden rounded-[12px] border border-[#d9cdb8] bg-white"
      >
        <div className="bg-[#1f4d3f] px-4 py-4 sm:px-5">
          <p className="text-xl font-semibold leading-snug text-[#fbfaf6]">ABC observation record</p>
          <p className="mt-1 text-base leading-7 text-[#fbfaf6]">
            Record one episode in time order. Time flows through A, then B, then C.
          </p>
        </div>
        <div className="bg-[#fbfaf6] px-4 py-4 sm:px-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {sheetFields.map((label) => (
              <div key={label} className="min-w-0">
                <p className="text-base font-semibold text-[#171f1d]">{label}</p>
                <div className="mt-2 h-11 rounded-[8px] border border-[#d9cdb8] bg-white" />
              </div>
            ))}
          </div>
          <div className="mt-4 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.2fr)_auto_minmax(0,1.2fr)_auto_minmax(0,1.2fr)] lg:items-stretch lg:gap-2">
            {sheetColumns.map((column, index) => (
              <div key={column.step} className="contents">
                {index > 0 ? <ThenMark /> : null}
                <div className="rounded-[12px] border border-[#d9cdb8] bg-white p-3">
                  <p className="flex items-start gap-2 text-base font-semibold leading-snug text-[#171f1d]">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#1f4d3f] text-base text-[#fbfaf6]">
                      {column.step}
                    </span>
                    <span className="min-w-0 flex-1 pt-2">{column.label}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-base font-semibold text-[#171f1d]">Use observable words.</p>
          <p className="mt-2 text-base leading-7 text-[#365548]">
            Descriptive data show patterns to examine. They do not prove function by themselves.
          </p>
        </div>
      </div>
    </figure>
  );
}

export function MeasureChooserDiagram() {
  return (
    <figure className="my-6">
      <div
        role="img"
        aria-label="Which measure fits this behavior? Start with what you need to know. Each question points to one measure: count or rate, duration, latency, interval recording or momentary time sampling, permanent product, or scatterplot. The text version follows."
        className="rounded-[12px] border border-[#d9cdb8] bg-[#fbfaf6] p-4 sm:p-5"
      >
        <p className="text-xl font-semibold leading-snug text-[#171f1d]">Which measure fits this behavior?</p>
        <p className="mt-3 inline-flex min-h-11 items-center rounded-[8px] bg-[#1f4d3f] px-3 text-base font-semibold text-[#fbfaf6]">
          What do you need to know?
        </p>
        <div className="mt-4 grid gap-3">
          {measureBranches.map((branch, index) => (
            <div key={branch.question} className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-stretch">
              <div className="rounded-[12px] border border-[#d9cdb8] bg-white p-3">
                <p className="flex items-start gap-2 text-base font-semibold leading-snug text-[#171f1d]">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#1f4d3f] text-base text-[#fbfaf6]">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1 pt-2">{branch.question}</span>
                </p>
              </div>
              <ThenMark />
              <div className="rounded-[12px] border border-[#d9cdb8] bg-white p-3">
                <p className="text-base font-semibold leading-snug text-[#171f1d]">{branch.measure}</p>
                <p className="mt-1 text-base leading-7 text-[#365548]">{branch.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="mt-4 rounded-[12px] border border-[#d9cdb8] bg-white p-4">
        <p className="text-base font-semibold text-[#171f1d]">Text version of the measure chooser</p>
        <ol className="mt-3 list-decimal space-y-3 pl-6 text-base leading-7 text-[#171f1d]">
          {measureBranches.map((branch) => (
            <li key={branch.question} className="pl-1">
              {branch.question} {branch.measure}. {branch.note}
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}

export function ResponsiveTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="my-4 max-w-full overflow-x-auto">
      <table className="w-full border-collapse text-base leading-7 text-[#171f1d]">
        <caption className="sr-only">{caption}</caption>
        <thead className="hidden md:table-header-group">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="border border-[#d9cdb8] bg-[#f4efe5] px-3 py-3 text-left align-top text-base font-semibold text-[#171f1d]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={`${caption}-${rowIndex}`}
              className="mb-3 block rounded-[12px] border border-[#d9cdb8] bg-white p-4 md:mb-0 md:table-row md:rounded-none md:border-0 md:p-0"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={`${caption}-${rowIndex}-${headers[cellIndex]}`}
                  className="block py-2 align-top [overflow-wrap:anywhere] md:table-cell md:border md:border-[#d9cdb8] md:px-3 md:py-3"
                >
                  <span className="mb-1 block font-semibold text-[#171f1d] md:hidden">{headers[cellIndex]}</span>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
