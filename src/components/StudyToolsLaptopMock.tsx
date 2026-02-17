export function StudyToolsLaptopMock() {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl">
        <div className="bg-slate-800 rounded-[2rem] p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-amber-400" />
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
            <div className="ml-auto h-3 w-24 rounded-full bg-slate-600" />
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-emerald-600 font-semibold">Behavior Study Tools</div>
                <div className="text-lg font-bold text-slate-900">Live Progress Dashboard</div>
              </div>
              <div className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">Active</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Accuracy", value: "82%", className: "text-emerald-600" },
                { label: "Questions", value: "1,248", className: "text-blue-600" },
                { label: "Streak", value: "14 days", className: "text-purple-600" },
                { label: "Domains", value: "6/9", className: "text-orange-600" }
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-slate-200 p-3">
                  <div className="text-xs text-slate-500">{stat.label}</div>
                  <div className={`text-lg font-bold ${stat.className}`}>{stat.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-3">
              {[
                { label: "Measurement", value: 76 },
                { label: "Assessment", value: 84 },
                { label: "Intervention", value: 69 }
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 h-3 w-2/3 mx-auto bg-slate-300 rounded-full" />
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-200 to-emerald-100 opacity-80" />
      <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-xl bg-gradient-to-br from-blue-200 to-blue-100 opacity-70" />
    </div>
  );
}
