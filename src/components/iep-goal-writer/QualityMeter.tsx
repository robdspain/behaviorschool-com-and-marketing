'use client';

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle, Circle } from "lucide-react";

interface QualityMeterProps {
  level: number; // 1-5
  className?: string;
}

const levelData = [
  { 
    label: "Basic Goal", 
    description: "Behavior + Measurement", 
    color: "bg-red-500",
    borderColor: "border-red-300",
    textColor: "text-red-700",
    bgLight: "bg-red-50"
  },
  { 
    label: "With Baseline", 
    description: "+ Current performance data", 
    color: "bg-orange-500",
    borderColor: "border-orange-300", 
    textColor: "text-orange-700",
    bgLight: "bg-orange-50"
  },
  { 
    label: "With Fluency", 
    description: "+ Response latency", 
    color: "bg-yellow-500",
    borderColor: "border-yellow-300",
    textColor: "text-yellow-700", 
    bgLight: "bg-yellow-50"
  },
  { 
    label: "With Generalization", 
    description: "+ Multiple settings", 
    color: "bg-blue-500",
    borderColor: "border-blue-300",
    textColor: "text-blue-700",
    bgLight: "bg-blue-50"
  },
  { 
    label: "Complete SMART Goal", 
    description: "+ 4-week maintenance", 
    color: "bg-emerald-500",
    borderColor: "border-emerald-300",
    textColor: "text-emerald-700",
    bgLight: "bg-emerald-50"
  },
];

export function QualityMeter({ level, className }: QualityMeterProps) {
  const currentLevel = levelData[Math.max(0, level - 1)] || levelData[0];
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Level Display */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Goal Quality Level</h4>
          <p className={cn("text-sm font-semibold", currentLevel.textColor)}>
            Level {level}/5: {currentLevel.label}
          </p>
        </div>
        <div className={cn(
          "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider",
          level >= 5 ? "bg-emerald-100 text-emerald-800" : 
          level >= 4 ? "bg-blue-100 text-blue-800" :
          level >= 3 ? "bg-yellow-100 text-yellow-800" :
          level >= 2 ? "bg-orange-100 text-orange-800" :
          "bg-red-100 text-red-800"
        )}>
          {level >= 5 ? "Most Effective" : level >= 4 ? "Strong" : level >= 3 ? "Improving" : level >= 2 ? "Moderate" : "Basic"}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          className={cn("h-full rounded-full", currentLevel.color)}
          initial={{ width: 0 }}
          animate={{ width: `${(level / 5) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      
      {/* Level Steps */}
      <div className="flex justify-between">
        {[1, 2, 3, 4, 5].map((num) => (
          <div key={num} className="flex flex-col items-center">
            <motion.div
              initial={false}
              animate={{ 
                scale: level >= num ? 1 : 0.8,
                opacity: level >= num ? 1 : 0.4 
              }}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                level >= num ? levelData[num - 1].color : "bg-slate-200"
              )}
            >
              {level >= num ? (
                <CheckCircle className="w-5 h-5 text-white" />
              ) : (
                <Circle className="w-5 h-5 text-slate-400" />
              )}
            </motion.div>
            <span className={cn(
              "text-[10px] font-medium mt-1 text-center max-w-[60px] leading-tight",
              level >= num ? "text-slate-700" : "text-slate-400"
            )}>
              {num === 1 ? "Basic" : 
               num === 2 ? "Baseline" : 
               num === 3 ? "Fluency" : 
               num === 4 ? "General." : 
               "Maintain"}
            </span>
          </div>
        ))}
      </div>
      
      {/* Current Level Description */}
      <div className={cn(
        "rounded-xl p-3 border",
        currentLevel.bgLight,
        currentLevel.borderColor
      )}>
        <p className={cn("text-sm", currentLevel.textColor)}>
          <strong>{currentLevel.label}:</strong> {currentLevel.description}
          {level < 5 && (
            <span className="block mt-1 text-slate-600">
              Add {levelData[level]?.label.toLowerCase().replace('with ', '')} to reach Level {level + 1}.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
