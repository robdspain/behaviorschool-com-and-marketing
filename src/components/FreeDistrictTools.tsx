import Link from "next/link";

const tools = [
  {
    title: "FBA to BIP Quality Check",
    desc: "Audit plan quality with a clear checklist and export-ready structure.",
    href: "/fba-to-bip",
  },
  {
    title: "ACT Matrix Builder",
    desc: "Map function, values, and barriers for cleaner intervention planning.",
    href: "/act-matrix-builder",
  },
  {
    title: "RBT Hours Tracker",
    desc: "Track supervision hours and documentation needs in minutes.",
    href: "/rbt-hours",
  },
  {
    title: "ABC Function Finder",
    desc: "Clarify hypothesized function with structured antecedent review.",
    href: "/abc-function-finder",
  },
];

const routes = [
  { label: "Need a behavior plan fast", href: "/fba-to-bip" },
  { label: "Need IEP behavior goals", href: "/iep-goals" },
  { label: "Need district pricing or team plan", href: "/pro" },
];

export default function FreeDistrictTools() {
  return (
    <section className="py-20 sm:py-28 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1f4d3f] mb-3">
            Free District Tools
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Practical tools districts can use immediately
          </h2>
          <p className="text-gray-600 mt-4 text-base sm:text-lg">
            Each tool is built to solve a specific district problem, without extra setup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="group bg-gray-50 border border-gray-200 rounded-xl p-6 hover:border-[#1f4d3f]/40 hover:bg-white transition"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {tool.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {tool.desc}
              </p>
              <div className="mt-4 text-sm font-semibold text-[#1f4d3f]">
                Open tool
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#1f4d3f] mb-2">
                Where are you now
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                Get to the right next step
              </h3>
              <p className="text-gray-600 mt-2">
                Pick the closest match and we will send you to the right page.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
              {routes.map((route) => (
                <Link
                  key={route.label}
                  href={route.href}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 hover:border-[#1f4d3f]/50 hover:text-[#1f4d3f]"
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
