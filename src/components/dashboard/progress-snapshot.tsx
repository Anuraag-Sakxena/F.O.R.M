"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTracker } from "@/hooks/tracker-context";

export function ProgressSnapshot() {
  const { checklistDone, checklistTotal, todayMealsDone, workoutDone, skincare, nightRoutine, waterIntake } =
    useTracker();

  const skincareDone = skincare.reduce(
    (acc, routine) => acc + routine.steps.filter((s) => s.done).length,
    0
  );
  const skincareTotal = skincare.reduce(
    (acc, routine) => acc + routine.steps.length,
    0
  );

  const nrDone = nightRoutine.filter((i) => i.done).length;
  const nrTotal = nightRoutine.length;

  const pills = [
    {
      emoji: "✅",
      text: `${checklistDone}/${checklistTotal}`,
      complete: checklistTotal > 0 && checklistDone === checklistTotal,
    },
    {
      emoji: "🍽️",
      text: `${todayMealsDone}/3`,
      complete: todayMealsDone >= 3,
    },
    {
      emoji: "💪",
      text: workoutDone ? "Done" : "—",
      complete: workoutDone,
    },
    {
      emoji: "✨",
      text: `${skincareDone}/${skincareTotal}`,
      complete: skincareTotal > 0 && skincareDone === skincareTotal,
    },
    {
      emoji: "🌙",
      text: `${nrDone}/${nrTotal}`,
      complete: nrTotal > 0 && nrDone === nrTotal,
    },
    {
      emoji: "💧",
      text: `${(waterIntake.amount / 1000).toFixed(1)}L`,
      complete: waterIntake.amount >= waterIntake.target,
    },
  ];

  return (
    <motion.div
      className="flex gap-2 overflow-x-auto px-5 scrollbar-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.25, duration: 0.4 }}
    >
      {pills.map((pill) => (
        <div
          key={pill.emoji}
          className={cn(
            "rounded-full px-2.5 py-1 flex items-center gap-1.5 text-[11px] font-medium whitespace-nowrap",
            pill.complete
              ? "bg-success-soft text-success"
              : "bg-muted/60 text-foreground"
          )}
        >
          <span>{pill.emoji}</span>
          <span>{pill.text}</span>
        </div>
      ))}
    </motion.div>
  );
}
