import { LucideIcon } from "lucide-react";

interface TrustStat {
  icon: LucideIcon;
  label: string;
  subLabel: string;
}

interface TrustBarProps {
  stats: TrustStat[];
}

export function TrustBar({ stats }: TrustBarProps) {
  return (
    <section className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className={`grid grid-cols-2 md:grid-cols-${stats.length} gap-8`}>
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-2">
              <div className="bg-emerald-100 p-3 rounded-full">
                <stat.icon className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900">{stat.label}</div>
                <div className="text-sm font-medium text-slate-600">{stat.subLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
