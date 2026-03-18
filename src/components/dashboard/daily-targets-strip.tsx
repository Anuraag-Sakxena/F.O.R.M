"use client";

import { motion } from "framer-motion";
import { dailyTargets } from "@/lib/data/targets";

const targets = [
  {
    label: "Protein",
    value: `${dailyTargets.protein.min}–${dailyTargets.protein.max}g`,
    emoji: "🥩",
    bg: "bg-accent-peach-soft/60",
  },
  {
    label: "Calories",
    value: `${dailyTargets.calories.min}–${dailyTargets.calories.max}`,
    emoji: "🔥",
    bg: "bg-accent-rose-soft/60",
  },
  {
    label: "Steps",
    value: `${(dailyTargets.steps.min / 1000).toFixed(0)}–${(dailyTargets.steps.max / 1000).toFixed(0)}K`,
    emoji: "👟",
    bg: "bg-accent-mint-soft/60",
  },
  {
    label: "Meals",
    value: `${dailyTargets.meals}/day`,
    emoji: "🍽️",
    bg: "bg-accent-sky-soft/60",
  },
];

export function DailyTargetsStrip() {
  return (
    <motion.div
      className="flex gap-2 px-5 overflow-x-auto scrollbar-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      {targets.map((t) => (
        <div
          key={t.label}
          className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2 min-w-fit ${t.bg}`}
        >
          <span className="text-sm">{t.emoji}</span>
          <div>
            <p className="text-[9px] text-muted-foreground font-medium leading-none">
              {t.label}
            </p>
            <p className="text-[11px] font-bold text-foreground leading-tight mt-0.5">
              {t.value}
            </p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
