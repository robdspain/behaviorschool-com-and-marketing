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
    <section className="bg-white border-b border-[#d9cdb8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className={`grid grid-cols-2 md:grid-cols-${stats.length} gap-8`}>
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-2">
              <div className="bg-[#e8efe9] p-3 rounded-full">
                <stat.icon className="w-6 h-6 text-[#1f4d3f]" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-[#171f1d]">{stat.label}</div>
                <div className="text-sm font-medium text-[#365548]">{stat.subLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
